'use client';

import { useFilterStore } from '@/stores/filter-store';
import { useEventStore } from '@/stores/event-store';
import { getSourceColor, getSourceLabel } from '@/lib/source-colors';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useEffect, useMemo } from 'react';

export function SourceFilterPanel() {
  const events = useEventStore((s) => s.events);
  const filters = useFilterStore((s) => s.filters);
  const loadFilters = useFilterStore((s) => s.loadFilters);
  const toggleFilter = useFilterStore((s) => s.toggleFilter);

  const sources = useMemo(
    () => [...new Set(events.map((e) => e.source))].sort(),
    [events],
  );

  useEffect(() => {
    if (sources.length > 0) {
      loadFilters(sources);
    }
  }, [sources, loadFilters]);

  const allSources = [...new Set([...Object.keys(filters), ...sources])];

  return (
    <div className="border rounded-lg p-3 flex flex-wrap gap-4">
      {allSources.map((source) => (
        <label key={source} className="flex items-center gap-2 min-h-11 cursor-pointer">
          <Checkbox
            checked={filters[source] !== false}
            onCheckedChange={() => toggleFilter(source)}
          />
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: getSourceColor(source) }}
          />
          <Label>{getSourceLabel(source)}</Label>
        </label>
      ))}
    </div>
  );
}
