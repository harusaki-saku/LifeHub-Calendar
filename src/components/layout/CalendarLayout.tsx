'use client';

import { Header } from './Header';

export function CalendarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 p-4 max-w-7xl mx-auto w-full">{children}</div>
    </div>
  );
}
