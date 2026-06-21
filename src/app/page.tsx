'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { CalendarLayout } from '@/components/layout/CalendarLayout';
import { MonthView } from '@/components/calendar/MonthView';
import { WeekView } from '@/components/calendar/WeekView';
import { DayView } from '@/components/calendar/DayView';
import { EventModal } from '@/components/events/EventModal';
import { DeleteConfirmDialog } from '@/components/events/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { useViewStore } from '@/stores/view-store';
import { useEventStore } from '@/stores/event-store';
import { useFilterStore } from '@/stores/filter-store';
import { getFetchRange } from '@/lib/date-utils';
import type { CalendarEvent } from '@/types';

function CalendarPageContent() {
  const viewType = useViewStore((s) => s.viewType);
  const currentDate = useViewStore((s) => s.currentDate);
  const fetchEvents = useEventStore((s) => s.fetchEvents);
  const events = useEventStore((s) => s.events);
  const loading = useEventStore((s) => s.loading);
  const error = useEventStore((s) => s.error);
  const loadFilters = useFilterStore((s) => s.loadFilters);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [defaultStart, setDefaultStart] = useState<Date | undefined>();

  const reload = useCallback(async () => {
    const { start, end } = getFetchRange(currentDate, viewType);
    await fetchEvents(start, end);
  }, [currentDate, viewType, fetchEvents]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    const sources = [...new Set(events.map((e) => e.source))];
    if (sources.length > 0) loadFilters(sources);
  }, [events, loadFilters]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  function openCreate(date?: Date) {
    setSelectedEvent(null);
    setDefaultStart(date);
    setModalOpen(true);
  }

  function openEdit(eventId: string) {
    const event = events.find((e) => e.id === eventId);
    if (!event || event.source !== 'native') return;
    setSelectedEvent(event);
    setModalOpen(true);
  }

  return (
    <CalendarLayout>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openCreate()}>＋ 予定を追加</Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground mb-2">読み込み中...</p>}

      {viewType === 'month' && (
        <MonthView
          onEventClick={openEdit}
          onDateClick={(date) => openCreate(date)}
        />
      )}
      {viewType === 'week' && <WeekView onEventClick={openEdit} />}
      {viewType === 'day' && <DayView onEventClick={openEdit} />}

      <EventModal
        open={modalOpen}
        event={selectedEvent}
        defaultStart={defaultStart}
        onClose={() => {
          setModalOpen(false);
          setSelectedEvent(null);
        }}
        onDelete={(ev) => {
          setModalOpen(false);
          setSelectedEvent(ev);
          setDeleteOpen(true);
        }}
      />

      <DeleteConfirmDialog
        event={selectedEvent}
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedEvent(null);
        }}
      />
    </CalendarLayout>
  );
}

export default function CalendarPage() {
  return (
    <AuthGuard>
      <CalendarPageContent />
    </AuthGuard>
  );
}
