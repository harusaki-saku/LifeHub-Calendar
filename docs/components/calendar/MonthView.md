# src/components/calendar/MonthView.tsx

月表示カレンダーコンポーネント。

## Props

| 名前 | 型 | 説明 |
|------|----|------|
| `onEventClick` | `(eventId: string) => void` | イベントカードクリック時のコールバック |
| `onDateClick` | `(date: Date) => void` | 日付セルクリック時のコールバック（新規作成） |

## 表示内容

- 曜日ヘッダー（月〜日）
- 当月の全日セル（前後月の日も表示、opacity で暗く表示）
- 各日のイベントカード（最大3件、超過分は `+N 件` で表示）
- 今日の日付は `bg-brand-primary text-white` の円でハイライト

## レスポンシブ

| 画面サイズ | 表示 |
|-----------|------|
| sm以上 | `EventCard` を最大3件 + `+N 件` |
| sm未満 | 件数のみ (`N件`) |

## 使用するストア・ライブラリ

- `useViewStore` — `currentDate`
- `useEventStore` — `events`
- `useFilterStore` — `getVisibleEvents()` でフィルタリング
- `date-utils` — `getMonthGrid`, `getEventsForDate`, `isToday`, `isCurrentMonth`, `formatDateKey`

## 関連ファイル

- [EventCard.md](EventCard.md)
- [../../stores/event-store.md](../../stores/event-store.md)
- [../../stores/view-store.md](../../stores/view-store.md)
- [../../stores/filter-store.md](../../stores/filter-store.md)
- [../../lib/date-utils.md](../../lib/date-utils.md)
