# src/components/layout/CalendarLayout.tsx

ページ全体のレイアウト骨格を提供するコンポーネント。

## 構造

```
<div class="min-h-screen flex flex-col">
  <Header />                    # 固定ヘッダー
  <div class="flex-1 p-4 ...">  # コンテンツエリア（最大幅 7xl, 中央寄せ）
    {children}
  </div>
</div>
```

## Props

| 名前 | 型 | 説明 |
|------|----|------|
| `children` | `ReactNode` | コンテンツエリアに表示するコンポーネント |

## 使用箇所

`src/app/page.tsx` の `CalendarPageContent` を包む。

## 関連ファイル

- [Header.md](Header.md)
