# src/app/layout.tsx

Next.js App Router のルートレイアウト。全ページ共通の設定を行う。

## 役割

- HTML ルート要素 (`<html lang="ja">`) の定義
- グローバルCSS (`globals.css`) のインポート
- トースト通知システム (`Toaster`) の配置

## メタデータ

```ts
title: "カレンダー | LifeHub"
description: "LifeHub エコシステムのカレンダーハブ"
```

## 構造

```
<html lang="ja">
  <body>
    {children}   ← 各ページのコンテンツ
    <Toaster />  ← 画面上部中央に表示されるトースト
  </body>
</html>
```

## 注意点

- 認証ガード (`AuthGuard`) はこのレイアウトではなく、`src/app/page.tsx` の中に配置されている
- `Toaster` は `sonner` ライブラリのラッパー（`src/components/ui/sonner.tsx`）を使用
- `richColors` と `position="top-center"` が設定済み

## 関連ファイル

- [page.md](page.md)
- [../components/ui/ui.md](../components/ui/ui.md) — `Toaster`
