const STORAGE_KEY = 'search_history';
const MAX_ITEMS = 10;

function readHistory(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  } catch {
    return [];
  }
}

function writeHistory(items: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export function getSearchHistory(): string[] {
  return readHistory();
}

export function addToSearchHistory(term: string) {
  const trimmed = term.trim();
  if (!trimmed) return;
  const next = [trimmed, ...readHistory().filter((item) => item.toLowerCase() !== trimmed.toLowerCase())];
  writeHistory(next);
}

export function removeFromSearchHistory(term: string) {
  const next = readHistory().filter((item) => item !== term);
  writeHistory(next);
}

export function clearSearchHistory() {
  writeHistory([]);
}
