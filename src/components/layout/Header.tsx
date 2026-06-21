'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useViewStore } from '@/stores/view-store';
import { getViewTitle } from '@/lib/date-utils';
import { NavigationControls } from '@/components/calendar/NavigationControls';
import { SourceFilterPanel } from '@/components/filters/SourceFilterPanel';
import { auth, getCurrentUser } from '@/lib/auth';
import { UserMenu } from '@lifehub/ui';
import type { ViewType } from '@/types';

const VIEWS: { value: ViewType; label: string }[] = [
  { value: 'month', label: '月' },
  { value: 'week', label: '週' },
  { value: 'day', label: '日' },
];

export function Header() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const viewType = useViewStore((s) => s.viewType);
  const currentDate = useViewStore((s) => s.currentDate);
  const setViewType = useViewStore((s) => s.setViewType);
  const user = getCurrentUser();

  return (
    <header className="border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h1 className="text-xl font-bold">カレンダー</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setFiltersOpen((v) => !v)}>
              フィルター
            </Button>
            <UserMenu
              user={user}
              onLogout={() => auth.logout({ returnUrl: window.location.origin })}
              accountUrl="https://account.showlabo.com"
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-1">
            {VIEWS.map((v) => (
              <Button
                key={v.value}
                size="sm"
                variant={viewType === v.value ? 'default' : 'outline'}
                onClick={() => setViewType(v.value)}
              >
                {v.label}
              </Button>
            ))}
          </div>
          <NavigationControls title={getViewTitle(currentDate, viewType)} />
        </div>
        {filtersOpen && <SourceFilterPanel />}
      </div>
    </header>
  );
}
