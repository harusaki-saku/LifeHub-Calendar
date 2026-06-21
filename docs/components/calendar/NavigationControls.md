# src/components/calendar/NavigationControls.tsx

カレンダーの前後ナビゲーションと「今日」ボタンのコンポーネント。

## Props

| 名前 | 型 | 説明 |
|------|----|------|
| `title` | `string` | 現在表示中の期間ラベル（例: `2026年 6月`、`6/15 – 6/21`） |

## ボタン

| ボタン | アクション | aria-label |
|--------|-----------|------------|
| ‹ | `navigateBackward()` | 前へ |
| 今日 | `goToToday()` | — |
| › | `navigateForward()` | 次へ |

## レイアウト

```
[‹] [今日] [title] [›]
```

`title` は `min-w-[8rem] text-center` で幅固定。

## 使用箇所

`Header.tsx` に埋め込まれ、ビュータイプと現在日付から `getViewTitle()` で生成した文字列を `title` として受け取る。

## 関連ファイル

- [../layout/Header.md](../layout/Header.md)
- [../../stores/view-store.md](../../stores/view-store.md)
- [../../lib/date-utils.md](../../lib/date-utils.md) — `getViewTitle`
