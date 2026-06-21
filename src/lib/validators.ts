import { z } from 'zod';

export const SOURCE_PATTERN = /^[a-z0-9-]{1,64}$/;

const isoDateTime = z.string().min(1, '日時を入力してください');

function endAfterStart(data: { startAt: string; endAt?: string | null }, ctx: z.RefinementCtx) {
  if (data.endAt && data.endAt < data.startAt) {
    ctx.addIssue({
      code: 'custom',
      message: '終了日時は開始日時以降にしてください',
      path: ['endAt'],
    });
  }
}

export const createEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'タイトルを入力してください')
      .max(100, 'タイトルは100文字以内にしてください'),
    startAt: isoDateTime,
    endAt: isoDateTime.optional(),
    allDay: z.boolean().optional(),
  })
  .superRefine(endAfterStart);

export const updateEventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'タイトルを入力してください')
      .max(100, 'タイトルは100文字以内にしてください')
      .optional(),
    startAt: isoDateTime.optional(),
    endAt: isoDateTime.nullable().optional(),
    allDay: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startAt && data.endAt && data.endAt < data.startAt) {
      ctx.addIssue({
        code: 'custom',
        message: '終了日時は開始日時以降にしてください',
        path: ['endAt'],
      });
    }
  });

export const ingestEventSchema = z
  .object({
    userId: z.string().min(1),
    title: z.string().trim().min(1).max(200),
    startTime: isoDateTime,
    endTime: isoDateTime.optional(),
    source: z.string().regex(SOURCE_PATTERN, 'source format invalid').max(50),
    sourceEventId: z.string().min(1).max(128),
    allDay: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.endTime && data.endTime < data.startTime) {
      ctx.addIssue({
        code: 'custom',
        message: 'endTime must be after startTime',
        path: ['endTime'],
      });
    }
  });

export const sourceSchema = z.string().regex(SOURCE_PATTERN);
