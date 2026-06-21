import { describe, it, expect } from 'vitest';
import { createEventSchema, sourceSchema } from '@/lib/validators';

describe('createEventSchema', () => {
  it('rejects empty title', () => {
    const result = createEventSchema.safeParse({
      title: '   ',
      startAt: '2026-07-01T10:00:00.000Z',
    });
    expect(result.success).toBe(false);
  });

  it('rejects endAt before startAt', () => {
    const result = createEventSchema.safeParse({
      title: 'Meeting',
      startAt: '2026-07-01T11:00:00.000Z',
      endAt: '2026-07-01T10:00:00.000Z',
    });
    expect(result.success).toBe(false);
  });
});

describe('sourceSchema', () => {
  it('accepts habit-tracker', () => {
    expect(sourceSchema.safeParse('habit-tracker').success).toBe(true);
  });

  it('rejects uppercase source', () => {
    expect(sourceSchema.safeParse('HabitTracker').success).toBe(false);
  });
});
