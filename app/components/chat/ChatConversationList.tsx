'use client';

import React from 'react';
import { useAuth } from '@/app/context/AuthContext';
import type { ChatConversation } from '@/lib/chat-api';
import { relativeTime, getInitials } from './chatUtils';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';

interface ChatConversationListProps {
  conversations: ChatConversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

export default function ChatConversationList({
  conversations,
  selectedId,
  onSelect,
  loading,
}: ChatConversationListProps) {
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="space-y-1 p-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-gray-500">
        Aucune conversation pour le moment.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {conversations.map((conversation) => {
        const isSelected = conversation.id === selectedId;
        const last = conversation.last_message;
        const isMine = last?.sender_id === user?.id;
        const preview = last ? `${isMine ? 'Vous : ' : ''}${last.content}` : 'Nouvelle conversation';

        return (
          <li key={conversation.id}>
            <button
              type="button"
              onClick={() => onSelect(conversation.id)}
              className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-colors ${
                isSelected ? 'bg-gray-50' : 'hover:bg-gray-50/70'
              }`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                {conversation.counterpart.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={conversation.counterpart.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getInitials(conversation.counterpart.name)
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-bold text-gray-900">
                    {conversation.counterpart.name}
                  </span>
                  <span className="shrink-0 text-xs text-gray-400">
                    {relativeTime(conversation.last_message_at)}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span
                    className={`truncate text-xs ${
                      conversation.unread_count > 0 && !isMine
                        ? 'font-semibold text-gray-900'
                        : 'text-gray-500'
                    }`}
                  >
                    {preview}
                  </span>
                  {conversation.unread_count > 0 && (
                    <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-black px-1.5 text-[11px] font-bold text-white">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              </div>

              {conversation.product?.image && (
                <span className="h-12 w-10 shrink-0 overflow-hidden bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={conversation.product.image || PRODUCT_IMAGE_PLACEHOLDER}
                    alt=""
                    className="h-full w-full object-cover mix-blend-multiply"
                  />
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
