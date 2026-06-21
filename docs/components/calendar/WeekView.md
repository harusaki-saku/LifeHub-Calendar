# src/components/calendar/WeekView.tsx

週表示カレンダーコンポーネント。

## Props

| 名前 | 型 | 説明 |
|------|----|------|
| `onEventClick` | `(eventId: string) => void` | イベントクリック時のコールバック |

## 表示内容

月曜始まりの7日間を横並びで表示。各日に当日のイベント一覧を表示する。

## レスポンシブ

| 画面サイズ | レイアウト |
|-----------|----------|
| md以上 | 7列グリッド、各列に `EventCard` を縦並び |
| md未満 | イベントがある日のみリスト表示。左側にソースカラーの縦ボーダー付き |

## 編集制限

`native` ソースのイベントのみ `onEventClick` を呼び出す。外部ソースはクリック無効（モバイルでは「編集」ボタン自体を非表示）。

## 使用するストア・ライブラリ

- `useViewStore` — `currentDate`
- `useEventStore` — `events`
- `useFilterStore` — `getVisibleEvents()`
- `date-utils` — `getWeekDays`, `getEventsForDate`, `formatEventTime`
- `source-colors` — `getSourceColor` (モバイル用ボーダー色)

## 関連ファイル

- [EventCard.md](EventCard.md)
- [../../stores/view-store.md](../../stores/view-store.md)
- [../../lib/date-utils.md](../../lib/date-utils.md)
