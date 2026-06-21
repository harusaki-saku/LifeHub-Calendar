'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEventStore } from '@/stores/event-store';
import { createEventSchema, updateEventSchema } from '@/lib/validators';
import {
  fromLocalDateTimeInput,
  toLocalDateTimeInput,
} from '@/lib/date-utils';
import type { CalendarEvent } from '@/types';

interface EventModalProps {
  open: boolean;
  event?: CalendarEvent | null;
  defaultStart?: Date;
  onClose: () => void;
  onDelete?: (event: CalendarEvent) => void;
}

function getInitialFormState(event?: CalendarEvent | null, defaultStart?: Date) {
  if (event) {
    return {
      title: event.title,
      startAt: toLocalDateTimeInput(event.startAt),
      endAt: event.endAt ? toLocalDateTimeInput(event.endAt) : '',
      allDay: event.allDay,
    };
  }

  const start = defaultStart ? new Date(defaultStart) : new Date();
  start.setMinutes(0, 0, 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  return {
    title: '',
    startAt: toLocalDateTimeInput(start.toISOString()),
    endAt: toLocalDateTimeInput(end.toISOString()),
    allDay: false,
  };
}

function EventModalForm({
  event,
  defaultStart,
  onClose,
  onDelete,
}: Omit<EventModalProps, 'open'>) {
  const createEvent = useEventStore((s) => s.createEvent);
  const updateEvent = useEventStore((s) => s.updateEvent);
  const initial = getInitialFormState(event, defaultStart);
  const [title, setTitle] = useState(initial.title);
  const [startAt, setStartAt] = useState(initial.startAt);
  const [endAt, setEndAt] = useState(initial.endAt);
  const [allDay, setAllDay] = useState(initial.allDay);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const payload = {
      title,
      startAt: fromLocalDateTimeInput(startAt),
      endAt: endAt ? fromLocalDateTimeInput(endAt) : undefined,
      allDay,
    };

    setSaving(true);
    try {
      if (event) {
        const parsed = updateEventSchema.safeParse(payload);
        if (!parsed.success) {
          const next: Record<string, string> = {};
          for (const issue of parsed.error.issues) {
            const key = issue.path[0]?.toString() ?? 'form';
            next[key] = issue.message;
          }
          setErrors(next);
          return;
        }
        await updateEvent(event.id, parsed.data);
        toast.success('イベントを更新しました');
      } else {
        const parsed = createEventSchema.safeParse(payload);
        if (!parsed.success) {
          const next: Record<string, string> = {};
          for (const issue of parsed.error.issues) {
            const key = issue.path[0]?.toString() ?? 'form';
            next[key] = issue.message;
          }
          setErrors(next);
          return;
        }
        await createEvent(parsed.data);
        toast.success('イベントを作成しました');
      }
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{event ? 'イベントを編集' : 'イベントを作成'}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="event-title">タイトル</Label>
          <Input
            id="event-title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: '' }));
            }}
          />
          {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
        </div>
        <div>
          <Label htmlFor="event-start">開始</Label>
          <Input
            id="event-start"
            type={allDay ? 'date' : 'datetime-local'}
            value={allDay ? startAt.slice(0, 10) : startAt}
            onChange={(e) => setStartAt(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="event-end">終了</Label>
          <Input
            id="event-end"
            type={allDay ? 'date' : 'datetime-local'}
            value={allDay ? endAt.slice(0, 10) : endAt}
            onChange={(e) => setEndAt(e.target.value)}
          />
          {errors.endAt && <p className="text-sm text-destructive mt-1">{errors.endAt}</p>}
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
          />
          <span className="text-sm">終日</span>
        </label>
      </div>
      <DialogFooter>
        {event && onDelete && (
          <Button
            variant="destructive"
            className="mr-auto"
            onClick={() => onDelete(event)}
            disabled={saving}
          >
            削除
          </Button>
        )}
        <Button variant="outline" onClick={onClose} disabled={saving}>
          キャンセル
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          保存
        </Button>
      </DialogFooter>
    </>
  );
}

export function EventModal({ open, event, defaultStart, onClose, onDelete }: EventModalProps) {
  const formKey = event?.id ?? `new-${defaultStart?.getTime() ?? 0}`;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        {open && (
          <EventModalForm
            key={formKey}
            event={event}
            defaultStart={defaultStart}
            onClose={onClose}
            onDelete={onDelete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
