'use client';

import { format } from 'date-fns';
import { useViewStore } from '@/stores/view-store';
import { useFilterStore } from '@/stores/filter-store';
import { useEventStore } from '@/stores/event-store';
import { getEventsForDate, formatEventTime } from '@/lib/date-utils';
import { getSourceColor } from '@/lib/source-colors';
import { EventCard } from './EventCard';

interface DayViewProps {
  onEventClick: (eventId: string) => void;
}

export function DayView({ onEventClick }: DayViewProps) {
  const currentDate = useViewStore((s) => s.currentDate);
  const events = useEventStore((s) => s.events);
  const getVisibleEvents = useFilterStore((s) => s.getVisibleEvents);
  const visible = getVisibleEvents(events);
  const dayEvents = getEventsForDate(visible, currentDate);

  return (
    <>
      <div className="hidden md:block border rounded-lg">
        <div className="grid grid-cols-[4rem_1fr]">
          {Array.from({ length: 24 }, (_, hour) => {
            const slotEvents = dayEvents.filter((event) => {
              if (event.allDay) return hour === 0;
              const startHour = new Date(event.startAt).getHours();
              return startHour === hour;
            });
            return (
              <div key={hour} className="contents">
                <div className="border-t px-2 py-2 text-xs text-muted-foreground">
                  {String(hour).padStart(2, '0')}:00
                </div>
                <div className="border-t border-l p-1 min-h-12">
                  {slotEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={(e) => {
                        if (e.source === 'native') onEventClick(e.id);
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="md:hidden space-y-2">
        <h3 className="font-medium">{format(currentDate, 'yyyy/M/d (EEE)')}</h3>
        {dayEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">予定はありません</p>
        ) : (
          dayEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-2 border rounded-lg p-3 min-h-11"
              style={{ borderLeft: `4px solid ${getSourceColor(event.source)}` }}
            >
              <div className="flex-1">
                <p className="font-medium">{event.title}</p>
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
            </div>
          ))
        )}
      </div>
    </>
  );
}
