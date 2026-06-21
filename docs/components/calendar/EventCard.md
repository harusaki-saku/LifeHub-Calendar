# src/components/calendar/EventCard.tsx

各ビュー共通のイベントカードコンポーネント。

## Props

| 名前 | 型 | デフォルト | 説明 |
|------|----|----------|------|
| `event` | `CalendarEvent` | — | 表示するイベント |
| `compact` | `boolean` | `false` | true のとき時刻を省略（月ビュー用） |
| `onClick` | `(event: CalendarEvent) => void` | — | クリック時のコールバック |

## ビジュアル

- 左ボーダー: `getSourceColor(event.source)` の色
- 背景: ソースカラーに `22` (8%) の透明度を付与
- 外部ソース (`source !== 'native'`) は `cursor-default opacity-90`
- native イベントは `cursor-pointer hover:opacity-90`

## 表示内容

- タイトル（truncate）
- `compact=false` かつ終日でない場合: 時刻 (`HH:mm – HH:mm`)

## アクセシビリティ

`aria-label` に `"{タイトル} ({ソースラベル})"` を設定。

## 使用箇所

- `MonthView` — `compact=true`
- `WeekView` / `DayView` — `compact=false`（デフォルト）

## 関連ファイル

- [../../lib/source-colors.md](../../lib/source-colors.md)
- [../../lib/date-utils.md](../../lib/date-utils.md) — `formatEventTime`
- [../../types/index.md](../../types/index.md) — `CalendarEvent`
