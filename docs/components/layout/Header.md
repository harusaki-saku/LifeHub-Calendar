# src/components/layout/Header.tsx

カレンダーアプリのヘッダー。ビュー切替・ナビゲーション・フィルター・ユーザーメニューを統括する。

## レイアウト構成

```
[LifeHub ロゴ/タイトル]  [フィルターボタン] [UserMenu]
[月/週/日 切替ボタン]    [NavigationControls]
（フィルター展開時）
[SourceFilterPanel]
```

## ビュー切替

`VIEWS` 配列 (`month / week / day`) をボタンで表示。選択中は `variant="default"`（ブランドカラー）、それ以外は `variant="outline"`。

```ts
const VIEWS: { value: ViewType; label: string }[] = [
  { value: 'month', label: '月' },
  { value: 'week', label: '週' },
  { value: 'day', label: '日' },
];
```

## UserMenu

`@lifehub/ui` の `UserMenu` コンポーネントを使用。`getCurrentUser()` でユーザー情報を取得して渡す。

- ログアウト: `auth.logout({ returnUrl: window.location.origin })`
- アカウントURL: `https://account.showlabo.com`

## フィルターの開閉

`filtersOpen` ステートでトグル。ヘッダー下部に `SourceFilterPanel` をインライン表示する。

## ナビゲーションタイトル

`getViewTitle(currentDate, viewType)` で生成:

| viewType | 例 |
|----------|-----|
| `month` | `2026年 6月` |
| `week` | `6/15 – 6/21` |
| `day` | `2026年 6月 15日 (月)` |

## 関連ファイル

- [NavigationControls.md](../calendar/NavigationControls.md)
- [../filters/SourceFilterPanel.md](../filters/SourceFilterPanel.md)
- [../../stores/view-store.md](../../stores/view-store.md)
- [../../lib/auth.md](../../lib/auth.md)
- [../../lib/date-utils.md](../../lib/date-utils.md) — `getViewTitle`
