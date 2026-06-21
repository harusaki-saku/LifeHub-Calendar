'use client';

import { useViewStore } from '@/stores/view-store';
import { useFilterStore } from '@/stores/filter-store';
import { useEventStore } from '@/stores/event-store';
import {
  formatDateKey,
  getMonthGrid,
  getEventsForDate,
  isCurrentMonth,
  isToday,
} from '@/lib/date-utils';
import { EventCard } from './EventCard';

interface MonthViewProps {
  onEventClick: (eventId: string) => void;
  onDateClick: (date: Date) => void;
}

export function MonthView({ onEventClick, onDateClick }: MonthViewProps) {
  const currentDate = useViewStore((s) => s.currentDate);
  const events = useEventStore((s) => s.events);
  const getVisibleEvents = useFilterStore((s) => s.getVisibleEvents);
  const visible = getVisibleEvents(events);
  const grid = getMonthGrid(currentDate);
  const weekdays = ['月', '火', '水', '木', '金', '土', '日'];

  return (
    <div>
      <div className="grid grid-cols-7 gap-px mb-1">
        {weekdays.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border">
        {grid.map((date) => {
          const dayEvents = getEventsForDate(visible, date);
          const shown = dayEvents.slice(0, 3);
          const extra = dayEvents.length - shown.length;
          return (
            <button
              key={formatDateKey(date)}
              type="button"
              onClick={() => onDateClick(date)}
              className={[
                'min-h-24 md:min-h-28 bg-background p-1 text-left align-top',
                !isCurrentMonth(date, currentDate) ? 'opacity-40' : '',
              ].join(' ')}
            >
              <span
                className={[
                  'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs mb-1',
                  isToday(date) ? 'bg-brand-primary text-white font-bold' : '',
                ].join(' ')}
              >
                {date.getDate()}
              </span>
              <div className="hidden sm:block">
                {shown.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    compact
                    onClick={(e) => {
                      if (e.source === 'native') onEventClick(e.id);
                    }}
                  />
                ))}
                {extra > 0 && (
                  <span className="text-[10px] text-muted-foreground">+{extra} 件</span>
                )}
              </div>
              <div className="sm:hidden text-[10px] text-muted-foreground">
                {dayEvents.length > 0 ? `${dayEvents.length}件` : ''}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
