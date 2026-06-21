# src/lib/validators.ts

イベント操作のZodバリデーションスキーマ群。フロントエンドのフォームバリデーションと、バックエンドAPIの入力検証に共用される設計。

## 共通ユーティリティ

```ts
const SOURCE_PATTERN = /^[a-z0-9-]{1,64}$/
```
ソース識別子の許可パターン（小文字英数字とハイフン、1〜64文字）。

```ts
function endAfterStart(data, ctx)
```
`endAt < startAt` のときバリデーションエラーを追加するリファインメント関数。

## スキーマ

### createEventSchema
新規イベント作成のバリデーション。

| フィールド | ルール |
|-----------|--------|
| `title` | 必須、trim後1文字以上、100文字以内 |
| `startAt` | 必須、ISO日時文字列 |
| `endAt` | 任意、`startAt` 以降であること |
| `allDay` | 任意 boolean |

### updateEventSchema
既存イベント更新のバリデーション。全フィールドが任意（部分更新対応）。

| フィールド | ルール |
|-----------|--------|
| `title` | 任意、trim後1〜100文字 |
| `startAt` | 任意 |
| `endAt` | 任意（`null` 許容、削除用） |
| `allDay` | 任意 |

### ingestEventSchema
外部サービスからのイベント取り込み（Ingest API）用バリデーション。

| フィールド | ルール |
|-----------|--------|
| `userId` | 必須 |
| `title` | 必須、1〜200文字 |
| `startTime` | 必須 |
| `endTime` | 任意、`startTime` 以降 |
| `source` | `SOURCE_PATTERN` に一致、50文字以内 |
| `sourceEventId` | 1〜128文字 |
| `allDay` | 任意 |

### sourceSchema
ソース識別子単体のバリデーション（`SOURCE_PATTERN` のZodラッパー）。

## テスト

`src/test/validators.test.ts` でバリデーションロジックをテスト。

## 使用箇所

- `EventModal` — `createEventSchema` / `updateEventSchema`
- バックエンドAPIも同じスキーマを参照（設計上の意図）

## 関連ファイル

- [../test/README.md](../test/README.md)
- [../components/events/EventModal.md](../components/events/EventModal.md)
