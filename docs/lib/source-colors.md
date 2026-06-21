# src/lib/source-colors.ts

イベントのソース別カラーとラベルを管理するユーティリティ。

## 定義済みカラー

| source | カラー | 説明 |
|--------|--------|------|
| `native` | `#3B82F6` (青) | ユーザーが直接作成したイベント |
| `habit-tracker` | `#22C55E` (緑) | 習慣トラッカーからの連携イベント |

## エクスポートする関数

### getSourceColor(source)
```ts
function getSourceColor(source: string): string  // HEX カラー
```
未定義のソースの場合は文字列ハッシュを使ってフォールバックカラーから決定論的に選択する。

**フォールバックカラー（5色ローテーション）:**
`#8B5CF6` / `#F97316` / `#EC4899` / `#14B8A6` / `#EAB308`

### getSourceLabel(source)
```ts
function getSourceLabel(source: string): string
```

| source | ラベル |
|--------|--------|
| `native` | `カレンダー` |
| `habit-tracker` | `習慣トラッカー` |
| その他 | source値そのまま |

## 使用箇所

- `EventCard` — カード左ボーダーの色・背景色
- `WeekView` / `DayView` — モバイル表示の左ボーダー色
- `SourceFilterPanel` — フィルターパネルの色丸

## 関連ファイル

- [../components/calendar/EventCard.md](../components/calendar/EventCard.md)
- [../components/filters/SourceFilterPanel.md](../components/filters/SourceFilterPanel.md)
