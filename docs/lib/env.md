# src/lib/env.ts

`NEXT_PUBLIC_*` 環境変数の存在チェックと型安全なアクセスを提供する。

## エクスポート

```ts
export const env = {
  cognitoClientId: string,  // NEXT_PUBLIC_COGNITO_CLIENT_ID
  apiUrl: string,           // NEXT_PUBLIC_API_URL
  authDomain: string,       // NEXT_PUBLIC_AUTH_DOMAIN
  appUrl: string,           // NEXT_PUBLIC_APP_URL
}
```

## 動作

各変数が未設定（`undefined` または空文字）の場合、`requireEnv()` がアプリ起動時に `Error` をスローする。これにより設定漏れを本番デプロイ前に検出できる。

## 設定方法

`.env.local`（`.env.local.example` を参照）:

```env
NEXT_PUBLIC_COGNITO_CLIENT_ID=your-client-id
NEXT_PUBLIC_API_URL=https://api.showlabo.com/v1
NEXT_PUBLIC_AUTH_DOMAIN=auth.showlabo.com
NEXT_PUBLIC_APP_URL=https://app.showlabo.com
```

`next.config.ts` にデフォルト値が設定されているが、本番環境では `.env.local` で上書きすること。

## 関連ファイル

- [auth.md](auth.md)
- [api-client.md](api-client.md)
