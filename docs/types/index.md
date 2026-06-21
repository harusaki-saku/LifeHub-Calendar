# src/types/

アプリ全体で使用するTypeScript型定義。

## src/types/index.ts

### ViewType
```ts
type ViewType = 'month' | 'week' | 'day'
```
カレンダーの表示ビュー種別。

### SyncDirection
```ts
type SyncDirection = 'read-only' | 'bidirectional'
```
外部ソースとの同期方向。現在は `'read-only'` のみ運用。

### CalendarEvent
カレンダーイベントのエンティティ型。

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | `string` | UUID |
| `title` | `string` | イベントタイトル |
| `startAt` | `string` | 開始日時 (ISO8601) |
| `endAt` | `string \| null` | 終了日時 (ISO8601)、null なら終了なし |
| `allDay` | `boolean` | 終日イベントか |
| `source` | `string` | 作成元 (`native` / `habit-tracker` / ...) |
| `sourceEventId` | `string \| null` | 外部ソースのイベントID（冪等性保証用） |
| `syncDirection` | `SyncDirection` | 同期方向 |
| `createdAt` | `string` | 作成日時 (ISO8601) |
| `updatedAt` | `string` | 更新日時 (ISO8601) |

### CreateEventInput
```ts
interface CreateEventInput {
  title: string;
  startAt: string;
  endAt?: string;
  allDay?: boolean;
}
```

### UpdateEventInput
```ts
interface UpdateEventInput {
  title?: string;
  startAt?: string;
  endAt?: string | null;  // null で終了日時を削除
  allDay?: boolean;
}
```

### IngestEventInput
外部サービス（习慣トラッカー等）からイベントを取り込む Ingest API 用の入力型。

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `userId` | `string` | 対象ユーザーID（Cognito sub） |
| `title` | `string` | イベントタイトル |
| `startTime` | `string` | 開始日時 (ISO8601) |
| `endTime` | `string \| undefined` | 終了日時 |
| `source` | `string` | ソース識別子（`SOURCE_PATTERN` 準拠） |
| `sourceEventId` | `string` | 冪等性キー（同一IDで再送しても重複しない） |
| `allDay` | `boolean \| undefined` | 終日イベントか |

### ApiErrorDetail
```ts
interface ApiErrorDetail {
  field: string;
  reason: string;
}
```
APIエラーの詳細情報型（バックエンドから返るフィールドエラーの表現）。

---

## src/types/showlabo-auth.d.ts

`showlabo-auth` ライブラリのアンビエント型宣言。ライブラリ自体に型定義がないため、このファイルで型を補完する。

### ShowlaboAuthConfig
認証設定オブジェクト（`domain`, `clientId`, `redirectUri`, `scopes`, `region`）。

### ShowlaboUser
認証済みユーザー情報（`sub`, `email`, `name`, `picture`, `provider`）。

### ShowlaboAuth
認証インスタンスのインターフェース（`login`, `logout`, `isAuthenticated`, `getUser`, `getAccessToken`, `refreshToken` など）。

### createShowlaboAuth(config)
認証インスタンスを生成するファクトリ関数。

## 関連ファイル

- [../lib/auth.md](../lib/auth.md)
- [../stores/event-store.md](../stores/event-store.md)
- [../stores/view-store.md](../stores/view-store.md)
- [../lib/validators.md](../lib/validators.md)
