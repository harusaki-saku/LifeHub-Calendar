# src/components/ui/

Radix UI プリミティブをベースにした汎用UIコンポーネント群（shadcn/ui パターン準拠）。

## コンポーネント一覧

### badge.tsx
インラインバッジ。`rounded-full border px-2.5 py-0.5 text-xs` のスタイルを持つ `<span>` ラッパー。

### button.tsx
クリックアクション用ボタン。`class-variance-authority (cva)` でバリアント管理。

**バリアント:**

| variant | 説明 |
|---------|------|
| `default` | ブランドカラー背景（`bg-brand-primary text-white`） |
| `outline` | ボーダーのみ |
| `ghost` | ホバー時のみ背景 |
| `destructive` | 赤背景（削除操作用） |

**サイズ:** `default` / `sm` / `icon` (h-11 w-11、タッチターゲット確保)

`asChild` プロップで `Radix Slot` に切替可能。

### checkbox.tsx
Radix UI `Checkbox` のラッパー。チェック時は `bg-brand-primary` のカラーを適用。アイコンは `lucide-react` の `Check`。

### dialog.tsx
Radix UI `Dialog` のラッパー。エクスポートするコンポーネント:

| 名前 | 説明 |
|------|------|
| `Dialog` | ルート (`DialogPrimitive.Root`) |
| `DialogTrigger` | トリガー |
| `DialogClose` | 閉じるボタンラッパー |
| `DialogContent` | オーバーレイ + コンテンツパネル（右上に X ボタン） |
| `DialogHeader` | ヘッダー (`flex-col space-y-1.5`) |
| `DialogFooter` | フッター（モバイル: 縦、sm以上: 横右寄せ） |
| `DialogTitle` | タイトル (`text-lg font-semibold`) |

### input.tsx
`<input>` のスタイル付きラッパー。`type` プロップをそのまま渡すため `datetime-local`・`date` など任意の型を利用可能。

### label.tsx
Radix UI `Label` のラッパー。`text-sm font-medium leading-none`。

### sonner.tsx
`sonner` ライブラリの `Toaster` をラップ。`richColors` と `position="top-center"` を固定設定。

## 共通事項

- すべてのコンポーネントは `cn()` (`clsx` + `tailwind-merge`) でクラス名をマージ
- `className` プロップでカスタマイズ可能
- `forwardRef` で `ref` を転送（`button`, `input`, `label`, `dialog*`）

## 関連ファイル

- [../../lib/utils.md](../../lib/utils.md) — `cn` ユーティリティ
