# src/stores/event-store.ts

カレンダーイベントのCRUDと取得状態を管理するZustandストア。楽観的更新（Optimistic Update）を採用。

## ステート

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `events` | `CalendarEvent[]` | 現在表示中のイベント一覧 |
| `loading` | `boolean` | 取得中フラグ |
| `error` | `string \| null` | 取得エラーメッセージ |

## アクション

### fetchEvents(start, end)
```ts
async fetchEvents(start: string, end: string): Promise<void>
```
`GET /calendar/events?start=...&end=...` でイベントを取得。`loading` を true にし、完了時に false へ戻す。エラー時は `error` にメッセージをセット。

### createEvent(input)
```ts
async createEvent(input: CreateEventInput): Promise<CalendarEvent>
```
**楽観的更新フロー:**
1. 一時ID (`temp-{timestamp}`) で仮イベントを即時追加
2. `POST /calendar/events` を送信
3. 成功: 仮イベントをサーバーレスポンスで置換
4. 失敗: `events` を元に戻してエラーをスロー

**仮イベントのデフォルト値:** `source: 'native'`, `syncDirection: 'read-only'`

### updateEvent(id, input)
```ts
async updateEvent(id: string, input: UpdateEventInput): Promise<CalendarEvent>
```
**楽観的更新フロー:**
1. ローカルストアを即時更新（`endAt` は `input.endAt === undefined` のとき現状維持）
2. `PUT /calendar/events/{id}` を送信
3. 成功: サーバーレスポンスで上書き
4. 失敗: 元の `events` にロールバック

### deleteEvent(id)
```ts
async deleteEvent(id: string): Promise<void>
```
**楽観的更新フロー:**
1. ローカルストアからイベントを即時除去
2. `DELETE /calendar/events/{id}` を送信
3. 失敗: 元の `events` にロールバック

## 呼び出し元

- `src/app/page.tsx` — `fetchEvents`, `createEvent`, `updateEvent`, `deleteEvent`
- `EventModal` — `createEvent`, `updateEvent`
- `DeleteConfirmDialog` — `deleteEvent`
- `SourceFilterPanel` — `events` を読み取り

## 関連ファイル

- [../lib/api-client.md](../lib/api-client.md)
- [../types/index.md](../types/index.md) — `CalendarEvent`, `CreateEventInput`, `UpdateEventInput`
