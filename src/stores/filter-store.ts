'use client';

import { create } from 'zustand';
import type { CalendarEvent } from '@/types';

const STORAGE_KEY = 'lifehub:calendar:source-filters';

interface FilterStore {
  filters: Record<string, boolean>;
  loadFilters: (sources: string[]) => void;
  toggleFilter: (source: string) => void;
  getVisibleEvents: (events: CalendarEvent[]) => CalendarEvent[];
}

function readStoredFilters(): Record<string, boolean> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return null;
  }
}

function writeStoredFilters(filters: Record<string, boolean>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // silent fallback
  }
}

export const useFilterStore = create<FilterStore>()((set, get) => ({
  filters: { native: true, 'habit-tracker': true },

  loadFilters: (sources) => {
    const stored = readStoredFilters();
    const next: Record<string, boolean> = {};
    for (const source of sources) {
      next[source] = stored?.[source] ?? true;
    }
    set({ filters: next });
    writeStoredFilters(next);
  },

  toggleFilter: (source) =>
    set((s) => {
      const filters = { ...s.filters, [source]: !s.filters[source] };
      writeStoredFilters(filters);
      return { filters };
    }),

  getVisibleEvents: (events) => {
    const { filters } = get();
    return events.filter((event) => filters[event.source] !== false);
  },
}));
