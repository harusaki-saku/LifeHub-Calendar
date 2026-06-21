import { describe, it, expect } from 'vitest';
import { navigateDate, getEventsForDate } from '@/lib/date-utils';
import type { CalendarEvent } from '@/types';

describe('navigateDate', () => {
  it('month forward then backward returns same month anchor', () => {
    const anchor = new Date('2026-07-15T12:00:00.000Z');
    const forward = navigateDate(anchor, 'month', 1);
    const back = navigateDate(forward, 'month', -1);
    expect(back.getMonth()).toBe(anchor.getMonth());
    expect(back.getFullYear()).toBe(anchor.getFullYear());
  });
});

describe('getEventsForDate', () => {
  it('places event on its start date', () => {
    const events: CalendarEvent[] = [
      {
        id: '1',
        title: 'Test',
        startAt: '2026-07-01T10:00:00+09:00',
        endAt: '2026-07-01T11:00:00+09:00',
        allDay: false,
        source: 'native',
        sourceEventId: null,
        syncDirection: 'read-only',
        createdAt: '',
        updatedAt: '',
      },
    ];
    const result = getEventsForDate(events, new Date('2026-07-01T00:00:00+09:00'));
    expect(result).toHaveLength(1);
  });
});
