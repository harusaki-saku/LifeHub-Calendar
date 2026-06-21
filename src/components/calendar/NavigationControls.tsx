'use client';

import { Button } from '@/components/ui/button';
import { useViewStore } from '@/stores/view-store';

interface NavigationControlsProps {
  title: string;
}

export function NavigationControls({ title }: NavigationControlsProps) {
  const navigateBackward = useViewStore((s) => s.navigateBackward);
  const navigateForward = useViewStore((s) => s.navigateForward);
  const goToToday = useViewStore((s) => s.goToToday);

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={navigateBackward} aria-label="前へ">
        ‹
      </Button>
      <Button variant="outline" size="sm" onClick={goToToday}>
        今日
      </Button>
      <span className="text-sm font-medium min-w-[8rem] text-center">{title}</span>
      <Button variant="outline" size="icon" onClick={navigateForward} aria-label="次へ">
        ›
      </Button>
    </div>
  );
}
