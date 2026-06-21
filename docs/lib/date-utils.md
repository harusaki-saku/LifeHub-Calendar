# src/lib/date-utils.ts

カレンダー表示に必要な日付計算・フォーマット関数群。`date-fns` をベースとする。

## 定数

```ts
const WEEK_OPTS = { weekStartsOn: 1 }  // 月曜始まり
```

## エクスポートする関数

### formatDateKey(date)
```ts
function formatDateKey(date: Date): string  // "yyyy-MM-dd"
```

### navigateDate(date, viewType, direction)
```ts
function navigateDate(date: Date, viewType: ViewType, direction: 1 | -1): Date
```
ビュータイプに応じて 1ヶ月・1週・1日 前後に移動する。

### getViewTitle(date, viewType)
```ts
function getViewTitle(date: Date, viewType: ViewType): string
```

| viewType | 出力例 |
|----------|--------|
| `month` | `2026年 6月` |
| `week` | `6/15 – 6/21` |
| `day` | `2026年 6月 15日 (月)` |

### getMonthGrid(date)
```ts
function getMonthGrid(date: Date): Date[]
```
月ビューの全セル日付（月曜始まり、前後月の日を含む）を返す。

### getWeekDays(date)
```ts
function getWeekDays(date: Date): Date[]  // 7要素
```
月曜始まりの7日間を返す。

### getDaySlots()
```ts
function getDaySlots(): string[]  // ["00:00", "00:30", ..., "23:30"]
```
30分単位の時刻スロット48件を返す。

### eventOccursOnDate(event, date)
```ts
function eventOccursOnDate(event: CalendarEvent, date: Date): boolean
```
終日イベントは開始日で判定。時刻指定イベントは `startAt < dayEnd && endAt >= dayStart` で判定。

### getEventsForDate(events, date)
```ts
function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[]
```
指定日に該当するイベントを `startAt` 昇順で返す。

### getEventsForWeek(events, anchor)
### getEventsForMonth(events, anchor)
指定週・月に該当するイベントを返す（クロスデイイベント対応）。

### isToday(date)
```ts
function isToday(date: Date): boolean
```

### isCurrentMonth(date, anchor)
```ts
function isCurrentMonth(date: Date, anchor: Date): boolean
```

### getFetchRange(anchor, viewType)
```ts
function getFetchRange(anchor: Date, viewType: ViewType): { start: string; end: string }
```
ビュータイプに応じた取得範囲をISOString で返す。月ビューはグリッドの端まで含む。

### formatEventTime(event)
```ts
function formatEventTime(event: CalendarEvent): string
// 終日: "終日"
// 時刻指定: "10:00 – 11:00" または "10:00"
```

### toLocalDateTimeInput(iso) / fromLocalDateTimeInput(value)
```ts
function toLocalDateTimeInput(iso: string): string   // "2026-06-15T10:00"
function fromLocalDateTimeInput(value: string): string  // ISO8601 UTC
```
`<input type="datetime-local">` との変換ヘルパー。

## テスト

`src/test/date-utils.test.ts` で `navigateDate` と `getEventsForDate` をテスト。

## 関連ファイル

- [../test/README.md](../test/README.md)
- [../types/index.md](../types/index.md) — `CalendarEvent`, `ViewType`
