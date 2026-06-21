# src/components/filters/SourceFilterPanel.tsx

イベントのソース（表示元）別に表示/非表示を切り替えるフィルターパネル。

## 表示

ヘッダーの「フィルター」ボタンで開閉される。各ソースを横並びのチェックボックス+色丸+ラベルで表示。

## 動作

- ページ読み込み時、`events` のユニークなソース一覧を `loadFilters(sources)` に渡して初期化
- チェックボックスのトグルで `toggleFilter(source)` を呼び出し、フィルター状態を更新
- フィルター状態は `localStorage` に永続化される（`filter-store.ts`）

## ソース一覧の生成

```ts
const sources = useMemo(
  () => [...new Set(events.map((e) => e.source))].sort(),
  [events],
);
```

表示対象は `filters` キーと `sources` のユニオン（途中でイベントが消えてもチェックボックスが残る）。

## 使用箇所

`Header.tsx` 内で `filtersOpen` ステートに応じて表示/非表示。

## 関連ファイル

- [../../stores/filter-store.md](../../stores/filter-store.md)
- [../../stores/event-store.md](../../stores/event-store.md)
- [../../lib/source-colors.md](../../lib/source-colors.md) — `getSourceColor`, `getSourceLabel`
- [../layout/Header.md](../layout/Header.md)
