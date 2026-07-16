'use client';

import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export interface ToastOptions {
  variant?: 'default' | 'danger';
  duration?: number;
  href?: string;
  hrefLabel?: string;
}

interface ToastItem {
  id: number;
  message: string;
  variant: 'default' | 'danger';
  href?: string;
  hrefLabel?: string;
}

interface ToastContextType {
  showToast: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, options?: ToastOptions) => {
    const id = Date.now();
    const duration = options?.duration ?? 4000;
    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        variant: options?.variant ?? 'default',
        href: options?.href,
        hrefLabel: options?.hrefLabel,
      },
    ]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-20 lg:bottom-6 left-1/2 z-[200] flex w-[min(100%,24rem)] -translate-x-1/2 flex-col gap-2 px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-sm px-5 py-3 text-sm shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300 ${
              toast.variant === 'danger'
                ? 'border border-red-200 bg-red-50 text-red-900'
                : 'bg-gray-900 text-white'
            }`}
          >
            <div className="flex items-start gap-2">
              {toast.variant === 'danger' && (
                <XCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
              )}
              <div className="min-w-0 flex-1">
                <p>{toast.message}</p>
                {toast.href && (
                  <Link
                    href={toast.href}
                    className={`mt-1 inline-block text-xs font-medium underline ${
                      toast.variant === 'danger' ? 'text-red-700' : 'text-white/90'
                    }`}
                  >
                    {toast.hrefLabel ?? 'Voir la commande'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
