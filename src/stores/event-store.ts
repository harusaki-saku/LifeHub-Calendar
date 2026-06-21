'use client';

import { create } from 'zustand';
import type { CalendarEvent, CreateEventInput, UpdateEventInput } from '@/types';
import { apiClient } from '@/lib/api-client';

interface EventStore {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  fetchEvents: (start: string, end: string) => Promise<void>;
  createEvent: (input: CreateEventInput) => Promise<CalendarEvent>;
  updateEvent: (id: string, input: UpdateEventInput) => Promise<CalendarEvent>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventStore>()((set, get) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async (start, end) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams({ start, end });
      const events = await apiClient.get<CalendarEvent[]>(`/schedule/events?${params}`);
      set({ events, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'イベントの取得に失敗しました',
      });
    }
  },

  createEvent: async (input) => {
    const previous = get().events;
    const tempId = `temp-${Date.now()}`;
    const now = new Date().toISOString();
    const optimistic: CalendarEvent = {
      id: tempId,
      title: input.title,
      startAt: input.startAt,
      endAt: input.endAt ?? null,
      allDay: input.allDay ?? false,
      source: 'native',
      sourceEventId: null,
      syncDirection: 'read-only',
      createdAt: now,
      updatedAt: now,
    };
    set({ events: [...previous, optimistic] });
    try {
      const created = await apiClient.post<CalendarEvent>('/schedule/events', input);
      set((s) => ({
        events: s.events.map((e) => (e.id === tempId ? created : e)),
      }));
      return created;
    } catch (error) {
      set({ events: previous });
      throw error;
    }
  },

  updateEvent: async (id, input) => {
    const previous = get().events;
    set({
      events: previous.map((e) =>
        e.id === id
          ? {
              ...e,
              ...input,
              endAt: input.endAt === undefined ? e.endAt : input.endAt,
              updatedAt: new Date().toISOString(),
            }
          : e,
      ),
    });
    try {
      const updated = await apiClient.put<CalendarEvent>(`/schedule/events/${id}`, input);
      set((s) => ({
        events: s.events.map((e) => (e.id === id ? updated : e)),
      }));
      return updated;
    } catch (error) {
      set({ events: previous });
      throw error;
    }
  },

  deleteEvent: async (id) => {
    const previous = get().events;
    set({ events: previous.filter((e) => e.id !== id) });
    try {
      await apiClient.delete(`/schedule/events/${id}`);
    } catch (error) {
      set({ events: previous });
      throw error;
    }
  },
}));
