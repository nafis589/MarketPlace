'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import { useAuth } from '@/app/context/AuthContext';
import { useUI } from '@/app/context/UIContext';
import { useChat } from '@/app/context/ChatContext';
import ChatConversationList from '@/app/components/chat/ChatConversationList';
import ChatThread from '@/app/components/chat/ChatThread';

export default function MessagesPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const { openLogin } = useUI();
  const { conversations, loadingConversations, refreshConversations } = useChat();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isLoggedIn) void refreshConversations();
  }, [isLoggedIn, refreshConversations]);

  // Auto-select the first conversation on desktop.
  useEffect(() => {
    if (isDesktop && !selectedId && conversations.length > 0) {
      setSelectedId(conversations[0].id);
    }
  }, [isDesktop, selectedId, conversations]);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  if (!isLoading && !isLoggedIn) {
    return (
      <main className="min-h-screen bg-white font-sans">
        <Header />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 pt-[100px] text-center md:pt-[120px]">
          <h1 className="font-serif text-3xl text-gray-900">Messages</h1>
          <p className="text-sm text-gray-500">Connectez-vous pour accéder à vos messages.</p>
          <button
            type="button"
            onClick={openLogin}
            className="bg-black px-6 py-3 text-sm font-bold text-white hover:bg-gray-800"
          >
            Se connecter
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-[100px] md:px-6 md:pt-[120px] md:pb-16">
        <h1
          className={`mb-6 text-center font-serif text-3xl text-gray-900 md:mb-10 md:mt-6 ${
            selected ? 'hidden md:block' : 'block'
          }`}
        >
          Messages
        </h1>

        <div className="flex h-[calc(100vh-220px)] min-h-[420px] max-h-[680px] overflow-hidden border-gray-200 md:h-[min(680px,calc(100vh-340px))] md:rounded-lg md:border">
          {/* Conversation list */}
          <div
            className={`w-full overflow-y-auto md:w-[360px] md:shrink-0 md:border-r md:border-gray-200 ${
              selected ? 'hidden md:block' : 'block'
            }`}
          >
            <ChatConversationList
              conversations={conversations}
              selectedId={selectedId}
              onSelect={setSelectedId}
              loading={loadingConversations}
            />
          </div>

          {/* Thread */}
          <div className={`min-h-0 flex-1 flex-col ${selected ? 'flex' : 'hidden md:flex'}`}>
            {selected ? (
              <>
                <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 md:hidden">
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    aria-label="Retour"
                    className="text-gray-700 hover:text-black"
                  >
                    <ArrowLeft size={22} strokeWidth={1.75} />
                  </button>
                  <span className="truncate text-sm font-bold text-gray-900">
                    @{selected.counterpart.username}
                  </span>
                </div>
                <ChatThread conversation={selected} className="flex-1 min-h-0" />
              </>
            ) : (
              <div className="hidden flex-1 items-center justify-center text-sm text-gray-400 md:flex">
                Sélectionnez une conversation
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
