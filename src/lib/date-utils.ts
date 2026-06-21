import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import type { CalendarEvent, ViewType } from '@/types';

const WEEK_OPTS = { weekStartsOn: 1 as const };

export function formatDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function navigateDate(date: Date, viewType: ViewType, direction: 1 | -1): Date {
  switch (viewType) {
    case 'month':
      return addMonths(date, direction);
    case 'week':
      return addWeeks(date, direction);
    case 'day':
      return addDays(date, direction);
  }
}

export function getViewTitle(date: Date, viewType: ViewType): string {
  switch (viewType) {
    case 'month':
      return format(date, 'yyyy年 M月');
    case 'week': {
      const start = startOfWeek(date, WEEK_OPTS);
      const end = endOfWeek(date, WEEK_OPTS);
      return `${format(start, 'M/d')} – ${format(end, 'M/d')}`;
    }
    case 'day':
      return format(date, 'yyyy年 M月 d日 (EEE)');
  }
}

export function getMonthGrid(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const gridStart = startOfWeek(monthStart, WEEK_OPTS);
  const gridEnd = endOfWeek(endOfMonth(date), WEEK_OPTS);
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date, WEEK_OPTS);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function getDaySlots(): string[] {
  return Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${String(hour).padStart(2, '0')}:${minute}`;
  });
}

function eventStartDate(event: CalendarEvent): Date {
  return parseISO(event.startAt);
}

export function eventOccursOnDate(event: CalendarEvent, date: Date): boolean {
  const start = eventStartDate(event);
  if (event.allDay) {
    return isSameDay(start, date);
  }
  const end = event.endAt ? parseISO(event.endAt) : start;
  const dayStart = startOfDay(date);
  const dayEnd = addDays(dayStart, 1);
  return start < dayEnd && end >= dayStart;
}

export function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events
    .filter((event) => eventOccursOnDate(event, date))
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export function getEventsForWeek(events: CalendarEvent[], anchor: Date): CalendarEvent[] {
  const days = getWeekDays(anchor);
  const start = days[0];
  const end = addDays(days[6], 1);
  return events
    .filter((event) => {
      const eventStart = eventStartDate(event);
      const eventEnd = event.endAt ? parseISO(event.endAt) : eventStart;
      return eventStart < end && eventEnd >= start;
    })
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export function getEventsForMonth(events: CalendarEvent[], anchor: Date): CalendarEvent[] {
  const monthStart = startOfMonth(anchor);
  const monthEnd = addDays(endOfMonth(anchor), 1);
  return events
    .filter((event) => {
      const eventStart = eventStartDate(event);
      const eventEnd = event.endAt ? parseISO(event.endAt) : eventStart;
      return eventStart < monthEnd && eventEnd >= monthStart;
    })
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isCurrentMonth(date: Date, anchor: Date): boolean {
  return isSameMonth(date, anchor);
}

export function getFetchRange(anchor: Date, viewType: ViewType): { start: string; end: string } {
  let rangeStart: Date;
  let rangeEnd: Date;

  switch (viewType) {
    case 'month': {
      const grid = getMonthGrid(anchor);
      rangeStart = grid[0];
      rangeEnd = addDays(grid[grid.length - 1], 1);
      break;
    }
    case 'week': {
      const days = getWeekDays(anchor);
      rangeStart = days[0];
      rangeEnd = addDays(days[6], 1);
      break;
    }
    case 'day':
      rangeStart = startOfDay(anchor);
      rangeEnd = addDays(rangeStart, 1);
      break;
  }

  return {
    start: rangeStart.toISOString(),
    end: rangeEnd.toISOString(),
  };
}

export function formatEventTime(event: CalendarEvent): string {
  if (event.allDay) return '終日';
  const start = format(parseISO(event.startAt), 'HH:mm');
  const end = event.endAt ? format(parseISO(event.endAt), 'HH:mm') : '';
  return end ? `${start} – ${end}` : start;
}

export function toLocalDateTimeInput(iso: string): string {
  const d = parseISO(iso);
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

export function fromLocalDateTimeInput(value: string): string {
  return new Date(value).toISOString();
}
