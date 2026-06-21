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
import { useEventStore } from '@/stores/event-store';
import type { CalendarEvent } from '@/types';

interface DeleteConfirmDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onClose: () => void;
}

export function DeleteConfirmDialog({ event, open, onClose }: DeleteConfirmDialogProps) {
  const deleteEvent = useEventStore((s) => s.deleteEvent);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!event) return;
    setDeleting(true);
    try {
      await deleteEvent(event.id);
      toast.success('イベントを削除しました');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '削除に失敗しました');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>イベントを削除しますか？</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          「{event?.title}」を削除します。この操作は取り消せません。
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={deleting}>
            キャンセル
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            削除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
