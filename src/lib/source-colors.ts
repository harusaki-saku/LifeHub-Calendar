const SOURCE_COLORS: Record<string, string> = {
  native: '#3B82F6',
  'habit-tracker': '#22C55E',
};

const FALLBACK_COLORS = ['#8B5CF6', '#F97316', '#EC4899', '#14B8A6', '#EAB308'];

export function getSourceColor(source: string): string {
  if (SOURCE_COLORS[source]) return SOURCE_COLORS[source];
  let hash = 0;
  for (let i = 0; i < source.length; i++) {
    hash = source.charCodeAt(i) + ((hash << 5) - hash);
  }
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

export function getSourceLabel(source: string): string {
  if (source === 'native') return 'カレンダー';
  if (source === 'habit-tracker') return '習慣トラッカー';
  return source;
}
