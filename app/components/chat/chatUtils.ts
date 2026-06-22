export const CONDITION_LABELS: Record<string, string> = {
  NEW: 'Neuf',
  VERY_GOOD: 'Très bon état',
  GOOD: 'Bon état',
  FAIR: 'État correct',
};

export function conditionLabel(condition: string | null | undefined): string {
  if (!condition) return '';
  return CONDITION_LABELS[condition] ?? condition;
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/** Short relative time for conversation list ("20s", "5min", "3h", "2j", or date). */
export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  const ts = date.getTime();
  if (Number.isNaN(ts)) return '';
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${Math.max(sec, 0)}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}j`;
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit' }).format(date);
}

/** Full date + time label used as a divider inside a thread. */
export function messageDivider(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function sameDay(a: string, b: string): boolean {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}
