# web-calendar — カレンダー

LifeHub エコシステムのカレンダーハブアプリです。自分で作成したイベント（native）に加え、習慣トラッカー等の外部サービスからのイベントを統合表示します。

## 主な機能

- **3つのビュー**: 月・週・日ビューを切り替えて表示
- **イベントCRUD**: 作成・編集・削除（native イベントのみ）
- **マルチソース統合**: native + habit-tracker など複数ソースのイベントを1画面で管理
- **ソースフィルター**: ソース別にイベントの表示/非表示を切り替え
- **楽観的更新**: 操作の即時反映とAPIエラー時のロールバック
- **認証**: Cognito + showlabo-auth による認証保護
- **外部イベント取り込み**: Ingest API 経由で他サービスからイベントを受信

## 技術スタック

| 分類 | 技術 |
|------|------|
| フレームワーク | Next.js 16 (App Router, static export) |
| UI | React 19, Tailwind CSS 4, Radix UI |
| 状態管理 | Zustand 5 |
| 認証 | showlabo-auth (Cognito ラッパー) |
| バリデーション | Zod |
| 日付処理 | date-fns |
| テスト | Vitest + Testing Library + fast-check (プロパティベース) |

## セットアップ

```bash
# 依存関係インストール
npm install

# 環境変数設定
cp .env.local.example .env.local
# .env.local を編集して各値を設定

# 開発サーバー起動
npm run dev
```

## 環境変数

```env
NEXT_PUBLIC_COGNITO_CLIENT_ID=  # Cognito アプリクライアントID
NEXT_PUBLIC_API_URL=            # バックエンドAPIのベースURL
NEXT_PUBLIC_AUTH_DOMAIN=        # Cognito のホストされたドメイン
NEXT_PUBLIC_APP_URL=            # このアプリのURL（リダイレクトURI用）
```

## コマンド

```bash
npm run dev        # 開発サーバー起動 (http://localhost:3000)
npm run build      # 本番ビルド（patch バージョンアップ + static export → out/）
npm run lint       # ESLint 実行
npm run test       # Vitest ウォッチモード
npm run test:run   # テスト単発実行
```

## デプロイ

`npm run build` で `out/` に静的ファイルが生成されます。`deploy.sh` で S3 + CloudFront にデプロイできます。

basePath は `/calendar` に設定されています。

## イベントソース

| source 値 | 意味 | 編集可否 |
|-----------|------|---------|
| `native` | ユーザーがこのアプリで作成 | ○ |
| `habit-tracker` | 習慣トラッカーから取り込み | ✕（読み取り専用） |
| その他 | 拡張可能 | ✕（読み取り専用） |

## ディレクトリ構成

```
src/
├── app/                      # Next.js App Router ページ・レイアウト
│   ├── layout.tsx            # ルートレイアウト（トースト配置）
│   └── page.tsx              # メインカレンダーページ
├── components/
│   ├── calendar/             # カレンダービューコンポーネント
│   │   ├── MonthView.tsx     # 月表示
│   │   ├── WeekView.tsx      # 週表示
│   │   ├── DayView.tsx       # 日表示
│   │   ├── EventCard.tsx     # イベントカード（各ビュー共通）
│   │   └── NavigationControls.tsx  # 前後ナビゲーション
│   ├── events/               # イベント操作ダイアログ
│   │   ├── EventModal.tsx    # 作成・編集モーダル
│   │   └── DeleteConfirmDialog.tsx  # 削除確認ダイアログ
│   ├── filters/              # フィルタリングUI
│   │   └── SourceFilterPanel.tsx    # ソースフィルターパネル
│   ├── layout/               # ページ構造コンポーネント
│   │   ├── AuthGuard.tsx     # 認証ガード
│   │   ├── CalendarLayout.tsx # ページレイアウト
│   │   └── Header.tsx        # ヘッダー（ビュー切替・ナビ・フィルター）
│   └── ui/                   # Radix UI ベースの汎用コンポーネント
├── lib/                      # ライブラリ・ユーティリティ
│   ├── api-client.ts         # REST API クライアント
│   ├── auth.ts               # 認証ラッパー
│   ├── date-utils.ts         # 日付計算・フォーマット
│   ├── env.ts                # 環境変数バリデーション
│   ├── source-colors.ts      # ソース別カラーマッピング
│   ├── utils.ts              # クラス名マージユーティリティ
│   └── validators.ts         # Zod バリデーションスキーマ
├── stores/                   # Zustand ストア
│   ├── event-store.ts        # イベントCRUD・楽観的更新
│   ├── filter-store.ts       # ソースフィルター状態（localStorage永続化）
│   └── view-store.ts         # ビュータイプ・現在日付のナビゲーション
├── types/                    # TypeScript 型定義
│   ├── index.ts
│   └── showlabo-auth.d.ts    # 内部ライブラリの型定義
└── test/                     # ユニットテスト・プロパティテスト
    ├── date-utils.test.ts
    ├── validators.test.ts
    └── setup.ts
```

## ドキュメント

各ソースファイルの詳細ドキュメントは [docs/](docs/) を参照してください。

- [docs/app/](docs/app/) — ページ・レイアウト
- [docs/components/calendar/](docs/components/calendar/) — カレンダービュー
- [docs/components/events/](docs/components/events/) — イベント操作
- [docs/components/filters/](docs/components/filters/) — フィルター
- [docs/components/layout/](docs/components/layout/) — ページ構造
- [docs/components/ui/](docs/components/ui/) — 汎用UIコンポーネント
- [docs/lib/](docs/lib/) — ライブラリ
- [docs/stores/](docs/stores/) — Zustand ストア
- [docs/types/](docs/types/) — 型定義
