# src/components/calendar/DayView.tsx

日表示カレンダーコンポーネント。

## Props

| 名前 | 型 | 説明 |
|------|----|------|
| `onEventClick` | `(eventId: string) => void` | イベントクリック時のコールバック |

## 表示内容

現在の日付の1日分のイベントをタイムライン形式で表示する。

## レスポンシブ

| 画面サイズ | レイアウト |
|-----------|----------|
| md以上 | 左に時刻ラベル（00:00〜23:00）、右にイベントをグリッド表示。終日イベントは 00:00 スロットに表示 |
| md未満 | 縦リスト形式。タイトル・時刻・編集ボタン |

## タイムグリッド

24行 × 2カラム（時刻ラベル + イベントセル）のグリッド。各スロットの高さは `min-h-12`。

```
00:00 | [EventCard]
01:00 | ...
...
23:00 | ...
```

## 編集制限

`native` ソースのイベントのみ `onEventClick` を呼び出す。

## 使用するストア・ライブラリ

- `useViewStore` — `currentDate`
- `useEventStore` — `events`
- `useFilterStore` — `getVisibleEvents()`
- `date-utils` — `getEventsForDate`, `formatEventTime`
- `source-colors` — `getSourceColor` (モバイル用)

## 関連ファイル

- [EventCard.md](EventCard.md)
- [../../stores/view-store.md](../../stores/view-store.md)
- [../../lib/date-utils.md](../../lib/date-utils.md)
