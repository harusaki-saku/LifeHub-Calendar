# src/lib/auth.ts

`showlabo-auth` ライブラリのラッパー。Cognito認証をアプリに統合する。

## エクスポート

### auth (インスタンス)

`createShowlaboAuth()` で生成したシングルトン。

**設定:**
```ts
{
  domain:      env.authDomain,
  clientId:    env.cognitoClientId,
  redirectUri: `${env.appUrl}/auth/callback`,
  scopes:      ['openid', 'email', 'profile'],
  region:      'ap-northeast-1',
}
```

**主なメソッド:**

| メソッド | 説明 |
|---------|------|
| `auth.isAuthenticated()` | 認証済みか確認 |
| `auth.login({ returnUrl })` | Cognito ログイン画面へリダイレクト |
| `auth.logout({ returnUrl })` | セッション破棄してログアウト |
| `auth.getAccessToken()` | アクセストークンを返す |
| `auth.refreshToken()` | トークンをリフレッシュ → `boolean` |
| `auth.getUser()` | ログイン中のユーザー情報 (`ShowlaboUser`) |

### getCurrentUser()
```ts
function getCurrentUser(): CurrentUser | null
// { email: string; displayName: string }
```
`auth.getUser()` の結果を整形して返す。`name` がなければメールのローカルパートを `displayName` として使用。

## redirectUri

`/auth/callback` に設定されている（basePath の `/calendar` は含まない）。Cognito 側の許可済みリダイレクトURIに登録が必要。

## 関連ファイル

- [env.md](env.md)
- [api-client.md](api-client.md)
- [../components/layout/AuthGuard.md](../components/layout/AuthGuard.md)
- [../components/layout/Header.md](../components/layout/Header.md)
- [../types/index.md](../types/index.md) — `showlabo-auth.d.ts`
