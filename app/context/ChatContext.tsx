'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { chatApi, type ChatConversation, type ChatMessage } from '@/lib/chat-api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

export interface IncomingMessagePayload {
  conversationId: string;
  message: {
    id: string;
    content: string;
    sender_id: string;
    type: ChatMessage['type'];
    created_at: string;
  };
}

type MessageListener = (payload: IncomingMessagePayload) => void;

interface ChatContextType {
  conversations: ChatConversation[];
  totalUnread: number;
  loadingConversations: boolean;
  refreshConversations: () => Promise<void>;

  drawerOpen: boolean;
  activeConversationId: string | null;
  openChatWithVendor: (vendorId: string, productId?: string | null) => Promise<void>;
  openConversation: (conversationId: string) => void;
  closeChat: () => void;
  starting: boolean;

  sendMessage: (conversationId: string, content: string) => Promise<ChatMessage | null>;
  markRead: (conversationId: string) => Promise<void>;
  subscribe: (listener: MessageListener) => () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

async function fetchSocketToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/socket-token', { credentials: 'include' });
    if (!res.ok) return null;
    const json = (await res.json()) as { token: string | null };
    return json.token ?? null;
  } catch {
    return null;
  }
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const listenersRef = useRef<Set<MessageListener>>(new Set());
  const activeIdRef = useRef<string | null>(null);
  const userIdRef = useRef<string | null>(null);
  const drawerOpenRef = useRef(false);

  useEffect(() => {
    drawerOpenRef.current = drawerOpen;
  }, [drawerOpen]);

  useEffect(() => {
    activeIdRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    userIdRef.current = user?.id ?? null;
  }, [user?.id]);

  const refreshConversations = useCallback(async () => {
    if (!isLoggedIn) {
      setConversations([]);
      return;
    }
    setLoadingConversations(true);
    try {
      const list = await chatApi.listConversations();
      setConversations(list);
    } catch {
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  }, [isLoggedIn]);

  // Apply an incoming message to the conversation list (reorder, update preview, bump unread).
  const applyIncomingToList = useCallback((payload: IncomingMessagePayload) => {
    const myId = userIdRef.current;
    const isMine = payload.message.sender_id === myId;
    const isActive = activeIdRef.current === payload.conversationId && drawerOpenRef.current;

    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === payload.conversationId);
      if (idx === -1) {
        // Unknown conversation — trigger a refresh elsewhere; keep list as-is for now.
        return prev;
      }
      const existing = prev[idx];
      const updated: ChatConversation = {
        ...existing,
        last_message: {
          content: payload.message.content,
          sender_id: payload.message.sender_id,
          type: payload.message.type,
          created_at: payload.message.created_at,
        },
        last_message_at: payload.message.created_at,
        unread_count:
          isMine || isActive ? existing.unread_count : existing.unread_count + 1,
      };
      const next = [...prev];
      next.splice(idx, 1);
      return [updated, ...next];
    });
  }, []);

  // Socket lifecycle tied to auth.
  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setConversations([]);
      return;
    }

    let cancelled = false;
    let socket: Socket | null = null;

    (async () => {
      const token = await fetchSocketToken();
      if (cancelled || !token) return;

      socket = io(API_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
      });
      socketRef.current = socket;

      socket.on('message:new', (payload: IncomingMessagePayload) => {
        applyIncomingToList(payload);
        listenersRef.current.forEach((listener) => listener(payload));
      });

      socket.on('conversation:updated', () => {
        // List ordering handled by message:new; nothing extra needed here.
      });
    })();

    void refreshConversations();

    return () => {
      cancelled = true;
      if (socket) socket.disconnect();
      socketRef.current = null;
    };
  }, [isLoggedIn, authLoading, applyIncomingToList, refreshConversations]);

  const openChatWithVendor = useCallback(
    async (vendorId: string, productId?: string | null) => {
      setStarting(true);
      try {
        const conversation = await chatApi.createConversation(vendorId, productId);
        setConversations((prev) => {
          const without = prev.filter((c) => c.id !== conversation.id);
          return [conversation, ...without];
        });
        setActiveConversationId(conversation.id);
        setDrawerOpen(true);
      } finally {
        setStarting(false);
      }
    },
    [],
  );

  const openConversation = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
    setDrawerOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const sendMessage = useCallback(
    async (conversationId: string, content: string): Promise<ChatMessage | null> => {
      const trimmed = content.trim();
      if (!trimmed) return null;
      try {
        const message = await chatApi.sendMessage(conversationId, trimmed);
        // Update list preview locally (socket echo also arrives; dedup is by id in thread).
        applyIncomingToList({
          conversationId,
          message: {
            id: message.id,
            content: message.content,
            sender_id: message.sender_id,
            type: message.type,
            created_at: message.created_at,
          },
        });
        return message;
      } catch {
        return null;
      }
    },
    [applyIncomingToList],
  );

  const markRead = useCallback(async (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unread_count: 0 } : c)),
    );
    try {
      await chatApi.markRead(conversationId);
    } catch {
      // Non-blocking
    }
  }, []);

  const subscribe = useCallback((listener: MessageListener) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        totalUnread,
        loadingConversations,
        refreshConversations,
        drawerOpen,
        activeConversationId,
        openChatWithVendor,
        openConversation,
        closeChat,
        starting,
        sendMessage,
        markRead,
        subscribe,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
