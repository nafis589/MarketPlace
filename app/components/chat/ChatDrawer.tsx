'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useChat } from '@/app/context/ChatContext';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import ChatThread from './ChatThread';

export default function ChatDrawer() {
  const { drawerOpen, activeConversationId, conversations, closeChat } = useChat();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useLockBodyScroll(drawerOpen && isMobile);

  if (!drawerOpen || !activeConversationId) return null;

  const conversation = conversations.find((c) => c.id === activeConversationId);
  if (!conversation) return null;

  const content = (
    <div
      className="
        fixed inset-0 z-[1000] flex flex-col bg-white shadow-2xl
        md:inset-auto md:bottom-4 md:right-4 md:h-[600px] md:max-h-[80vh] md:w-[400px] md:rounded-lg md:border md:border-gray-200
      "
    >
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <span className="truncate text-sm font-bold text-gray-900">
          @{conversation.counterpart.username}
        </span>
        <button
          type="button"
          onClick={closeChat}
          aria-label="Fermer"
          className="text-gray-400 transition-colors hover:text-black"
        >
          <X size={22} strokeWidth={1.75} />
        </button>
      </div>

      <ChatThread
        conversation={conversation}
        className="flex-1 min-h-0"
        hideProductBarOnDesktop
      />
    </div>
  );

  if (isMobile && mounted) {
    return createPortal(content, document.body);
  }
  return content;
}
