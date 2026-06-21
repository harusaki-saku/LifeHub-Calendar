export type ViewType = 'month' | 'week' | 'day';
export type SyncDirection = 'read-only' | 'bidirectional';

export interface CalendarEvent {
  id: string;
  title: string;
  startAt: string;
  endAt: string | null;
  allDay: boolean;
  source: string;
  sourceEventId: string | null;
  syncDirection: SyncDirection;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  title: string;
  startAt: string;
  endAt?: string;
  allDay?: boolean;
}

export interface UpdateEventInput {
  title?: string;
  startAt?: string;
  endAt?: string | null;
  allDay?: boolean;
}

export interface IngestEventInput {
  userId: string;
  title: string;
  startTime: string;
  endTime?: string;
  source: string;
  sourceEventId: string;
  allDay?: boolean;
}

export interface ApiErrorDetail {
  field: string;
  reason: string;
}
