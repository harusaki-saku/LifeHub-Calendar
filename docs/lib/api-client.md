# src/lib/api-client.ts

バックエンドAPIとの通信を担うHTTPクライアント。Bearer トークンの自動付与と 401 時のリフレッシュ・リトライを行う。

## インスタンス

```ts
import { apiClient } from '@/lib/api-client';
```

モジュールレベルのシングルトンとしてエクスポートされる。

## メソッド

| メソッド | 説明 |
|---------|------|
| `get<T>(path)` | GETリクエスト → `Promise<T>` |
| `post<T>(path, body)` | POSTリクエスト → `Promise<T>` |
| `put<T>(path, body)` | PUTリクエスト → `Promise<T>` |
| `delete(path)` | DELETEリクエスト → `Promise<unknown>` |

エラー時は `Error` をスローする。

## レスポンス形式（エンベロープ）

```json
// 成功
{ "data": <T> }

// エラー
{ "error": { "code": "string", "message": "string", "details"?: unknown } }
```

## 認証フロー

```
リクエスト
  → auth.getAccessToken() でトークン取得
  → Authorization: Bearer <token> ヘッダー付与
  → 401 かつ未リトライ
      → auth.refreshToken() でリフレッシュ
          → 成功: リトライ (retried=true)
          → 失敗: auth.login() でリダイレクト
```

## ベースURL

`env.apiUrl`（`NEXT_PUBLIC_API_URL`）をベースURLとして使用。

## 関連ファイル

- [env.md](env.md)
- [auth.md](auth.md)
- [../stores/event-store.md](../stores/event-store.md)
