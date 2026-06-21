# src/components/events/DeleteConfirmDialog.tsx

イベント削除前の確認ダイアログ。

## Props

| 名前 | 型 | 説明 |
|------|----|------|
| `event` | `CalendarEvent \| null` | 削除対象のイベント |
| `open` | `boolean` | ダイアログ開閉状態 |
| `onClose` | `() => void` | 閉じる時のコールバック |

## 表示内容

- タイトル: 「イベントを削除しますか？」
- 本文: 「`{event.title}` を削除します。この操作は取り消せません。」
- キャンセルボタン / 削除ボタン（`destructive` バリアント）

## 動作フロー

1. 削除ボタン押下 → `setDeleting(true)`
2. `deleteEvent(event.id)` を呼び出す（`event-store`）
3. 成功: `toast.success('イベントを削除しました')` → `onClose()`
4. 失敗: `toast.error(エラーメッセージ)` → `setDeleting(false)` （ダイアログは開いたまま）

`deleting` が `true` の間は両ボタンを `disabled` にする。

## 呼び出し元

`src/app/page.tsx` — EventModal の `onDelete` コールバックから受け取ったイベントで開く。

## 関連ファイル

- [../../stores/event-store.md](../../stores/event-store.md) — `deleteEvent`
- [EventModal.md](EventModal.md)
