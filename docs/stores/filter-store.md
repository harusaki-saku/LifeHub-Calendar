# src/stores/filter-store.ts

イベントのソース別フィルター状態を管理するZustandストア。状態は `localStorage` に永続化される。

## ストレージキー

```ts
const STORAGE_KEY = 'lifehub:calendar:source-filters'
```

## ステート

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `filters` | `Record<string, boolean>` | ソース識別子 → 表示/非表示 のマップ |

**初期値:** `{ native: true, 'habit-tracker': true }`

## アクション

### loadFilters(sources)
```ts
loadFilters(sources: string[]): void
```
指定されたソース一覧を元にフィルター状態を初期化する。

1. `localStorage` から保存済みのフィルター状態を読み込む
2. 各ソースについて: 保存値があればそれを使用、なければ `true`（表示）
3. 新しい `filters` を `localStorage` に書き込む

### toggleFilter(source)
```ts
toggleFilter(source: string): void
```
指定ソースの表示/非表示を反転し、`localStorage` に保存する。

### getVisibleEvents(events)
```ts
getVisibleEvents(events: CalendarEvent[]): CalendarEvent[]
```
`filters[source] !== false` のイベントのみを返す（`undefined` のソースは表示扱い）。

## 永続化

`readStoredFilters()` / `writeStoredFilters()` で `localStorage` との入出力を行う。SSR環境では `typeof window === 'undefined'` チェックでスキップ。

## 使用箇所

- `src/app/page.tsx` — `loadFilters`（`events` 更新時に呼び出し）
- `SourceFilterPanel` — `filters`, `loadFilters`, `toggleFilter`
- 各カレンダービュー — `getVisibleEvents(events)` でフィルタリング済みイベントを取得

## 関連ファイル

- [../components/filters/SourceFilterPanel.md](../components/filters/SourceFilterPanel.md)
- [../types/index.md](../types/index.md) — `CalendarEvent`
