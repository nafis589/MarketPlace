'use client';

import React, { useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  isLoading = false,
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, isLoading, onCancel]);

  if (!open) return null;

  const confirmClass =
    variant === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-black text-white hover:opacity-90';

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Fermer"
        disabled={isLoading}
        onClick={onCancel}
      />

      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="absolute right-4 top-4 text-gray-400 hover:text-black transition-colors disabled:opacity-50"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-6 pt-6 pb-5">
          <h2 id="confirm-modal-title" className="text-lg font-semibold text-[#1A1A1A] pr-8">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">{description}</p>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 pb-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium border border-gray-300 text-[#1A1A1A] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${confirmClass}`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
