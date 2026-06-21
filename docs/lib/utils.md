# src/lib/utils.ts

UIコンポーネント向けのクラス名マージユーティリティ。

## エクスポートする関数

### cn(...inputs)
```ts
function cn(...inputs: ClassValue[]): string
```
`clsx` で条件付きクラス名を結合し、`tailwind-merge` でTailwindの重複クラスを解決して返す。

**使用例:**
```ts
cn('px-4 py-2', isActive && 'bg-blue-500', className)
// → 重複する Tailwind クラスを後勝ちで解決
```

## 依存ライブラリ

- `clsx` — 条件付きクラス名のオブジェクト/配列記法をサポート
- `tailwind-merge` — `px-2 px-4` のような重複を後勝ちで解決

## 使用箇所

`src/components/ui/` 配下のすべてのコンポーネントで使用される。
