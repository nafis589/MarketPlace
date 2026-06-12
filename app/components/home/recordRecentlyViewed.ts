const STORAGE_KEY = 'recently_viewed';

export function recordRecentlyViewed(productId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const viewed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[];
    const updated = [productId, ...viewed.filter((id) => id !== productId)].slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([productId]));
  }
}
