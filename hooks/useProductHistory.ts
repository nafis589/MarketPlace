'use client';

const HISTORY_KEY = 'viewed_products';
const MAX_HISTORY = 20;

export function trackProductView(productId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const history: string[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const updated = [productId, ...history.filter((id) => id !== productId)].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}

export function getProductHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as string[];
  } catch {
    return [];
  }
}

export function clearProductHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

export function useProductHistory() {
  return {
    trackView: trackProductView,
    getHistory: getProductHistory,
    clearHistory: clearProductHistory,
  };
}
