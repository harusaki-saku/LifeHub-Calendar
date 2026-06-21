# src/components/layout/AuthGuard.tsx

認証状態を確認し、未認証ユーザーをログイン画面へリダイレクトするラッパーコンポーネント。

## 責務

1. マウント時に `auth.isAuthenticated()` で認証状態を確認
2. 未認証なら `auth.login({ returnUrl: window.location.href })` でCognitoログインへリダイレクト
3. 認証済みなら `ready = true` として `children` をレンダリング

## web-habits の AuthGuard との違い

| | web-calendar | web-habits |
|---|---|---|
| 初期化処理 | 認証チェックのみ | 認証 + データロード（settings → habits → logs）|
| マイグレーション | なし | `migrateLocalToRemote()` を実行 |

このアプリではデータの初期化は `page.tsx` 内の `useEffect` で行う。

## ローディング表示

`ready` が `false` の間は「読み込み中...」を画面中央に表示。

## 状態遷移

```
マウント
  → 認証チェック
      → 未認証: login() へリダイレクト
      → 認証済み: ready = true → children 表示
      → エラー: console.error + ready = true（フォールバック表示）
```

## 関連ファイル

- [../../lib/auth.md](../../lib/auth.md)
