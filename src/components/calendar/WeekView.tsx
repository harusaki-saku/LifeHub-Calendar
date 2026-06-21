'use client';

import { format } from 'date-fns';
import { useViewStore } from '@/stores/view-store';
import { useFilterStore } from '@/stores/filter-store';
import { useEventStore } from '@/stores/event-store';
import { getWeekDays, getEventsForDate, formatEventTime } from '@/lib/date-utils';
import { getSourceColor } from '@/lib/source-colors';
import { EventCard } from './EventCard';

interface WeekViewProps {
  onEventClick: (eventId: string) => void;
}

export function WeekView({ onEventClick }: WeekViewProps) {
  const currentDate = useViewStore((s) => s.currentDate);
  const events = useEventStore((s) => s.events);
  const getVisibleEvents = useFilterStore((s) => s.getVisibleEvents);
  const visible = getVisibleEvents(events);
  const days = getWeekDays(currentDate);

  return (
    <>
      <div className="hidden md:grid md:grid-cols-7 gap-2">
        {days.map((date) => (
          <div key={date.toISOString()} className="border rounded-lg p-2 min-h-[480px]">
            <div className="text-sm font-medium mb-2">{format(date, 'M/d (EEE)')}</div>
            {getEventsForDate(visible, date).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={(e) => {
                  if (e.source === 'native') onEventClick(e.id);
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="md:hidden space-y-3">
        {days.map((date) => {
          const dayEvents = getEventsForDate(visible, date);
          if (dayEvents.length === 0) return null;
          return (
            <div key={date.toISOString()} className="border rounded-lg p-3">
              <h3 className="font-medium mb-2">{format(date, 'M/d (EEE)')}</h3>
              <ul className="space-y-2">
                {dayEvents.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-center gap-2 min-h-11"
                    style={{ borderLeft: `4px solid ${getSourceColor(event.source)}`, paddingLeft: 8 }}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{formatEventTime(event)}</p>
                    </div>
                    {event.source === 'native' && (
                      <button
                        type="button"
                        className="text-xs text-brand-primary min-h-11 min-w-11"
                        onClick={() => onEventClick(event.id)}
                      >
                        編集
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
