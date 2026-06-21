'use client';

import { create } from 'zustand';
import type { ViewType } from '@/types';
import { navigateDate } from '@/lib/date-utils';

interface ViewStore {
  viewType: ViewType;
  currentDate: Date;
  setViewType: (type: ViewType) => void;
  setCurrentDate: (date: Date) => void;
  navigateForward: () => void;
  navigateBackward: () => void;
  goToToday: () => void;
}

export const useViewStore = create<ViewStore>()((set) => ({
  viewType: 'month',
  currentDate: new Date(),

  setViewType: (viewType) => set({ viewType }),

  setCurrentDate: (currentDate) => set({ currentDate }),

  navigateForward: () =>
    set((s) => ({ currentDate: navigateDate(s.currentDate, s.viewType, 1) })),

  navigateBackward: () =>
    set((s) => ({ currentDate: navigateDate(s.currentDate, s.viewType, -1) })),

  goToToday: () => set({ currentDate: new Date() }),
}));
