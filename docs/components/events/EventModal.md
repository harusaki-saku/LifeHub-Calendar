# src/components/events/EventModal.tsx

イベントの作成・編集を行うモーダルダイアログ。

## Props

| 名前 | 型 | 説明 |
|------|----|------|
| `open` | `boolean` | ダイアログ開閉状態 |
| `event` | `CalendarEvent \| null` | 編集時は対象イベント、新規作成時は `null` |
| `defaultStart` | `Date \| undefined` | 新規作成時の初期開始日時（月ビューで日付クリックした場合） |
| `onClose` | `() => void` | 閉じる時のコールバック |
| `onDelete` | `(event: CalendarEvent) => void` | 削除ボタン押下時のコールバック |

## コンポーネント構成

```
EventModal
└── Dialog
    └── EventModalForm (key={event?.id ?? `new-${defaultStart}`})
```

`key` を使って `event` が変わるたびにフォームを再マウントし、状態をリセットする。

## フォームフィールド

| フィールド | 入力型 | 備考 |
|-----------|--------|------|
| タイトル | text | 1〜100文字、空白トリム |
| 開始 | `datetime-local` / `date` (終日時) | |
| 終了 | `datetime-local` / `date` (終日時) | 終了 < 開始 はバリデーションエラー |
| 終日 | checkbox | チェックで入力型が `date` に切替 |

## バリデーション

`createEventSchema` / `updateEventSchema`（`lib/validators.ts`）で Zod バリデーション。エラー時はフィールド下にメッセージ表示（フォームはキャンセルせず再編集可能）。

## 初期値ロジック

- 編集時: 既存イベントの値を `toLocalDateTimeInput()` で変換してセット
- 新規作成時: `defaultStart` を 0分に丸めた時刻 + 1時間後を終了時刻に設定

## 操作

| ボタン | 動作 |
|--------|------|
| 保存 | 新規 → `createEvent(input)` / 編集 → `updateEvent(id, input)` → `toast.success` → `onClose()` |
| 削除 | `onDelete(event)` を呼び出し（DeleteConfirmDialog に制御を渡す） |
| キャンセル | `onClose()` |

## 関連ファイル

- [DeleteConfirmDialog.md](DeleteConfirmDialog.md)
- [../../stores/event-store.md](../../stores/event-store.md)
- [../../lib/validators.md](../../lib/validators.md)
- [../../lib/date-utils.md](../../lib/date-utils.md) — `toLocalDateTimeInput`, `fromLocalDateTimeInput`
