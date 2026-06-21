# src/stores/view-store.ts

カレンダーのビュータイプ（月/週/日）と現在表示日付を管理するZustandストア。

## ステート

| フィールド | 型 | 初期値 | 説明 |
|-----------|-----|--------|------|
| `viewType` | `ViewType` | `'month'` | 表示ビュー |
| `currentDate` | `Date` | `new Date()` | 現在の表示基準日 |

## アクション

| アクション | 説明 |
|-----------|------|
| `setViewType(type)` | ビュータイプを変更 |
| `setCurrentDate(date)` | 表示日付を直接指定 |
| `navigateForward()` | 1ビュー分前進（`navigateDate(currentDate, viewType, 1)`） |
| `navigateBackward()` | 1ビュー分後退（`navigateDate(currentDate, viewType, -1)`） |
| `goToToday()` | 今日に戻る（`new Date()`） |

## ナビゲーション量

| viewType | 1ステップの移動量 |
|----------|----------------|
| `month` | 1ヶ月 |
| `week` | 1週間 |
| `day` | 1日 |

`navigateDate()` (`date-utils.ts`) に委譲して計算する。

## 使用箇所

- `Header` — ビュー切替ボタン、`NavigationControls` への `title` 生成
- `MonthView` / `WeekView` / `DayView` — `currentDate` で表示範囲を決定
- `src/app/page.tsx` — `currentDate` + `viewType` の変化で `fetchEvents` をトリガー

## 関連ファイル

- [../lib/date-utils.md](../lib/date-utils.md) — `navigateDate`, `getViewTitle`
- [../types/index.md](../types/index.md) — `ViewType`
