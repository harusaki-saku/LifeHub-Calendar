'use client';

import type { CalendarEvent } from '@/types';
import { getSourceColor, getSourceLabel } from '@/lib/source-colors';
import { formatEventTime } from '@/lib/date-utils';

interface EventCardProps {
  event: CalendarEvent;
  compact?: boolean;
  onClick?: (event: CalendarEvent) => void;
}

export function EventCard({ event, compact = false, onClick }: EventCardProps) {
  const color = getSourceColor(event.source);
  const isExternal = event.source !== 'native';

  return (
    <button
      type="button"
      onClick={() => onClick?.(event)}
      className={[
        'w-full text-left rounded px-2 py-1 text-xs truncate border-l-4',
        compact ? 'mb-0.5' : 'mb-1',
        isExternal ? 'cursor-default opacity-90' : 'cursor-pointer hover:opacity-90',
      ].join(' ')}
      style={{ borderLeftColor: color, backgroundColor: `${color}22` }}
      aria-label={`${event.title} (${getSourceLabel(event.source)})`}
    >
      <span className="font-medium">{event.title}</span>
      {!compact && (
        <span className="block text-[10px] text-muted-foreground">{formatEventTime(event)}</span>
      )}
    </button>
  );
}
