# Implementation Plan: web-schedule-calendar

## Overview

LifeHub カレンダー機能のフルスタック実装。Next.js 16 (App Router) + Zustand + shadcn/ui フロントエンド、DynamoDB シングルテーブル + Lambda + API Gateway バックエンド、Cognito 認証、Ingestion API による外部イベント受信を段階的に構築する。TypeScript で統一。

## Tasks

- [x] 1. プロジェクト基盤セットアップ
  - [x] 1.1 Next.js 16 プロジェクト初期化とディレクトリ構造作成
    - `apps/web-schedule/` に Next.js 16 (App Router) プロジェクトを作成
    - `output: 'export'` の静的エクスポート設定を next.config.ts に追加
    - package.json に `"build": "npm version patch --no-git-tag-version && next build"` を設定、初期バージョン `0.1.0`
    - shadcn/ui、zustand、date-fns、zod、sonner の依存関係を追加
    - vitest + @testing-library/react + jsdom + fast-check のテスト環境を構成
    - ディレクトリ構造: `src/app/`, `src/components/`, `src/lib/`, `src/stores/`, `src/types/`, `src/test/`
    - _Requirements: 2.1, 8.1, 9.1_

  - [x] 1.2 TypeScript 型定義と Zod バリデーションスキーマ作成
    - `src/types/index.ts` に CalendarEvent, ViewType, CreateEventInput, UpdateEventInput, IngestEventInput 型を定義
    - `src/lib/validators.ts` に Zod スキーマ（createEventSchema, updateEventSchema, ingestEventSchema）を実装
    - title 最大100文字（native）/200文字（ingestion）、source パターン `^[a-z0-9-]{1,64}$`、endAt >= startAt 検証を含む
    - _Requirements: 3.2, 3.5, 5.3, 5.7, 10.6_

  - [x] 1.3 日付ユーティリティ関数の実装
    - `src/lib/date-utils.ts` に date-fns を使ったヘルパーを実装
    - ナビゲーション関数: navigateForward/navigateBackward（viewType に応じて月/週/日を加減算）
    - イベント配置関数: getEventsForDate, getEventsForWeek, getEventsForMonth
    - 週の開始日計算（月曜始まり）、月グリッド生成関数
    - _Requirements: 2.3, 2.4, 2.5, 2.6_

  - [ ]* 1.4 日付ユーティリティのプロパティテスト
    - **Property 1: Event placement in correct time slot** — 任意の startAt と viewType に対し、イベントが正しいセル/スロットに配置されることを検証
    - **Property 2: Navigation date arithmetic** — forward → backward で元の日付に戻ること、1単位の正確なシフトを検証
    - **Validates: Requirements 2.3, 2.4, 2.5, 2.6**

  - [ ]* 1.5 バリデーションスキーマのプロパティテスト
    - **Property 4: Event validation rejects invalid input** — 空タイトル、100文字超、endAt < startAt を Zod スキーマが拒否することを検証
    - **Property 14: Source format validation** — `^[a-z0-9-]{1,64}$` にマッチしない文字列を拒否することを検証
    - **Validates: Requirements 3.5, 4.6, 10.6**

- [x] 2. 認証モジュールとレイアウト
  - [x] 2.1 認証ライブラリとAuthGuardコンポーネントの実装
    - `src/lib/auth.ts` に showlabo-auth パッケージのセットアップ（PKCE フロー、トークン管理）
    - `src/lib/env.ts` に Cognito 関連の環境変数定義
    - `src/components/layout/AuthGuard.tsx` — 未認証時に Cognito Hosted UI へリダイレクト
    - トークン期限切れ時のリフレッシュ処理（最大3回リトライ → 失敗時ログイン画面リダイレクト）
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 2.2 認証コールバックページの実装
    - `src/app/auth/callback/page.tsx` — OAuth コールバック処理
    - トークン抽出・Cookie 保存・カレンダー画面へリダイレクト
    - エラー発生時のエラーメッセージ表示
    - _Requirements: 1.1, 1.6_

  - [x] 2.3 API クライアントとルートレイアウトの実装
    - `src/lib/api-client.ts` — Bearer JWT 付き fetch ラッパー、401 時の自動トークンリフレッシュ + リトライ
    - `src/app/layout.tsx` — ルートレイアウト（providers、globals.css）
    - `src/app/page.tsx` — カレンダーメインページ（AuthGuard でラップ）
    - _Requirements: 1.1, 1.3, 1.5, 7.1_

- [ ] 3. チェックポイント — 認証基盤の確認
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. 状態管理ストア
  - [x] 4.1 View Store の実装
    - `src/stores/view-store.ts` — viewType（month/week/day）、currentDate、setViewType、navigateForward/navigateBackward、goToToday
    - デフォルト: 月表示、今日の日付
    - _Requirements: 2.1, 2.6_

  - [x] 4.2 Event Store の実装
    - `src/stores/event-store.ts` — events 配列、loading/error 状態、fetchEvents、createEvent、updateEvent、deleteEvent
    - Optimistic UI パターン: 即時ローカル反映 → API 成功で確定 / 失敗でロールバック + エラー toast
    - api-client.ts を使用した Calendar API との通信
    - _Requirements: 3.2, 3.6, 4.2, 4.4, 4.7_

  - [x] 4.3 Filter Store の実装
    - `src/stores/filter-store.ts` — filters (Record<string, boolean>)、loadFilters、toggleFilter、getVisibleEvents
    - localStorage 永続化（キー: `lifehub:schedule:source-filters`）
    - 新規 source 検出時デフォルト ON、localStorage 読み込み失敗時全 ON で初期化
    - _Requirements: 6.1, 6.2, 6.3, 6.5, 6.6, 6.7, 6.8_

  - [ ]* 4.4 Filter Store のプロパティテスト
    - **Property 11: Source filter correctness** — フィルター状態に基づき正しいイベントのみが可視であること、toggle OFF → ON で元に戻ることを検証
    - **Property 12: Filter state persistence round-trip** — localStorage 保存 → 読み込みで等価な状態が復元されること、未知 source はデフォルト ON を検証
    - **Validates: Requirements 6.2, 6.3, 6.5, 6.6, 6.7, 6.8**

- [x] 5. カレンダービューコンポーネント
  - [x] 5.1 CalendarLayout と Header の実装
    - `src/components/layout/CalendarLayout.tsx` — メインレイアウト（Header + ビューエリア）
    - `src/components/layout/Header.tsx` — ViewSwitcher（月/週/日ボタン）+ NavigationControls + SourceFilterPanel トリガー
    - `src/components/calendar/NavigationControls.tsx` — 前後ナビゲーション + Today ボタン + 現在日付表示
    - _Requirements: 2.1, 2.6, 2.7_

  - [x] 5.2 MonthView コンポーネントの実装
    - `src/components/calendar/MonthView.tsx` — 月曜始まりのカレンダーグリッド
    - 1セル最大3件表示 + 残件数インジケーター（"+N more"）
    - 今日の日付のハイライト表示
    - レスポンシブ: 768px未満で簡略化グリッド
    - _Requirements: 2.3, 2.7, 8.1, 8.2, 8.4_

  - [x] 5.3 WeekView コンポーネントの実装
    - `src/components/calendar/WeekView.tsx` — 月曜〜日曜、0:00〜24:00 時間軸付きグリッド
    - イベントを時間帯に配置
    - レスポンシブ: 768px未満でアジェンダ形式リスト表示
    - _Requirements: 2.4, 8.1, 8.2_

  - [x] 5.4 DayView コンポーネントの実装
    - `src/components/calendar/DayView.tsx` — 0:00〜24:00、30分単位スロット
    - 各イベントのタイトル・開始時刻・終了時刻を表示
    - レスポンシブ: 768px未満でアジェンダ形式リスト表示
    - _Requirements: 2.5, 8.1, 8.2_

  - [x] 5.5 EventCard と source カラーマッピングの実装
    - `src/components/calendar/EventCard.tsx` — イベント表示カード（タイトル、時間、source 色帯）
    - `src/lib/source-colors.ts` — source → 背景色マッピング（native: blue, habit-tracker: green, etc.）
    - タッチターゲット 44x44px 以上（モバイル時）
    - _Requirements: 6.4, 8.3_

  - [x] 5.6 SourceFilterPanel の実装
    - `src/components/filters/SourceFilterPanel.tsx` — source 一覧 + ON/OFF トグル + 色インジケーター
    - filter-store の toggleFilter を呼び出し
    - クライアントサイドフィルタリング（API 呼び出しなし）
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 6. イベント CRUD UI
  - [x] 6.1 EventModal（作成/編集）の実装
    - `src/components/events/EventModal.tsx` — 作成モーダル・編集モーダル兼用
    - フォームフィールド: タイトル（max 100）、開始日時ピッカー、終了日時ピッカー、終日フラグ
    - Zod バリデーション + フィールドレベルエラー表示
    - 保存成功時: モーダル閉じ + カレンダー即時反映、失敗時: モーダル維持 + エラー表示
    - 編集時: 既存データをフォームに反映
    - External_Event に対しては編集操作を提供しない
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6, 3.7, 4.1, 4.5, 4.6_

  - [x] 6.2 DeleteConfirmDialog の実装
    - `src/components/events/DeleteConfirmDialog.tsx` — 削除確認ダイアログ
    - 確認後に event-store の deleteEvent を呼び出し
    - Optimistic UI: 即座に表示から除去 → 失敗時ロールバック
    - External_Event に対しては削除操作を提供しない
    - _Requirements: 4.3, 4.4, 4.5, 4.7_

- [ ] 7. チェックポイント — フロントエンド統合確認
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. バックエンド Lambda ハンドラ — Calendar API
  - [x] 8.1 Lambda 共通ユーティリティとプロジェクト構成
    - `infra/cdk/lambda/schedule/` ディレクトリ作成
    - 共通ヘルパー: DynamoDB クライアント初期化、errorResponse ユーティリティ、JWT sub 抽出
    - DynamoDB アイテムの型定義（pk, sk, GSI1PK, GSI1SK 等）
    - _Requirements: 7.3, 10.2_

  - [x] 8.2 GET /schedule/events（イベント一覧取得）の実装
    - `infra/cdk/lambda/schedule/events/list.ts`
    - クエリパラメータ: start (ISO8601), end (ISO8601) — 必須
    - pk = `USER#{sub}`、sk begins_with `EVENT#`、FilterExpression で startAt/endAt 範囲フィルタリング
    - レスポンス: `{ data: CalendarEvent[] }`
    - _Requirements: 7.1, 7.3, 9.2_

  - [x] 8.3 POST /schedule/events（イベント作成）の実装
    - `infra/cdk/lambda/schedule/events/create.ts`
    - Zod バリデーション（title max 100, startAt 必須, endAt >= startAt）
    - UUID v4 で eventId 生成、source = "native"、sourceEventId = null、syncDirection = "read-only"
    - DynamoDB PutCommand（pk, sk, GSI1PK, GSI1SK 設定）
    - レスポンス 201: `{ data: CalendarEvent }`
    - _Requirements: 3.2, 3.4, 10.1, 10.3_

  - [x] 8.4 PUT /schedule/events/{eventId}（イベント更新）の実装
    - `infra/cdk/lambda/schedule/events/update.ts`
    - source !== "native" のイベントは 403 拒否
    - 部分更新（title, startAt, endAt, allDay）、updatedAt を現在時刻に設定
    - 存在しない eventId は 404
    - _Requirements: 4.2, 4.5, 7.3_

  - [x] 8.5 DELETE /schedule/events/{eventId}（イベント削除）の実装
    - `infra/cdk/lambda/schedule/events/delete.ts`
    - source !== "native" のイベントは 403 拒否
    - DynamoDB DeleteCommand で完全削除
    - 存在しない eventId は 404
    - _Requirements: 4.4, 4.5, 7.3_

  - [ ]* 8.6 Calendar API のプロパティテスト
    - **Property 3: Native event creation round-trip** — 有効な入力で作成したイベントが正しい属性で保存・取得されることを検証
    - **Property 5: Event deletion removes from store** — 削除後にクエリでイベントが返されないことを検証
    - **Property 6: External events are immutable via Calendar API** — source !== "native" のイベントに対する更新・削除が拒否されることを検証
    - **Validates: Requirements 3.2, 3.4, 4.4, 4.5, 10.1, 10.3**

- [x] 9. バックエンド Lambda ハンドラ — Ingestion API
  - [x] 9.1 POST /schedule/events/ingest（Ingestion API）の実装
    - `infra/cdk/lambda/schedule/ingest/create.ts`
    - Zod バリデーション: title (max 200), startTime (ISO8601), source (max 50, `^[a-z0-9-]+$`), sourceEventId (max 128), userId 必須
    - userId と JWT sub の一致検証 → 不一致時 403
    - Upsert ロジック: GSI1 で既存イベント検索（source + sourceEventId）→ 既存あれば UpdateCommand (200)、なければ PutCommand (201)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [ ]* 9.2 Ingestion API のプロパティテスト
    - **Property 7: Ingestion round-trip with source preservation** — 有効なペイロードで保存されたイベントが source, sourceEventId を保持することを検証
    - **Property 8: Ingestion schema validation rejects invalid payloads** — 必須フィールド欠落、フィールド上限超過、不正 source 形式が 400 で拒否されることを検証
    - **Property 9: Ingestion userId mismatch yields 403** — userId !== JWT sub で 403 が返り、イベントが保存されないことを検証
    - **Property 10: Ingestion idempotent upsert** — 同一 source + sourceEventId の二重送信で 1 件のみ存在し、最新値に更新されることを検証
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.5, 5.6, 5.7**

  - [ ]* 9.3 ユーザーデータ分離のプロパティテスト
    - **Property 13: User data isolation** — 異なる userId 間でイベントが互いに参照・変更不可であることを検証
    - **Validates: Requirements 7.3, 7.4**

- [ ] 10. チェックポイント — バックエンド統合確認
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. インフラ接続とフロントエンド・バックエンド統合
  - [x] 11.1 API Gateway ルート定義と CORS 設定
    - CDK で API Gateway に `/schedule/events` (GET, POST) と `/schedule/events/{eventId}` (PUT, DELETE) と `/schedule/events/ingest` (POST) を定義
    - Token Authorizer（既存 jose ベース JWT 検証）をすべてのルートにアタッチ
    - CORS: Access-Control-Allow-Origin を CloudFront ドメインのみに制限
    - _Requirements: 7.1, 7.2, 7.5_

  - [ ] 11.2 フロントエンドとバックエンドの接続テスト
    - CDK deploy 済み（2026-06-21）: GSI1 + schedule Lambda + API ルート
    - フロント S3 deploy 済み: `s3://showlabo-app/schedule/` + CloudFront invalidation
    - 未認証 GET `/schedule/events` → 401 確認済み（ルート到達 OK）
    - 認証: 共有 callback `https://app.showlabo.com/auth/callback`（web-habits 同様、`auth.ts` 修正済み）
    - **要対応**: Cognito Logout URL に `https://app.showlabo.com/schedule/` を追加
    - 本番ログイン後の CRUD 動作確認は未実施
    - api-client.ts のベース URL を環境変数 (`NEXT_PUBLIC_API_URL`) で設定
    - Event Store の fetchEvents が GET /schedule/events を正しく呼び出すことを確認
    - 作成・更新・削除が対応する API エンドポイントを呼び出すことを確認
    - 認証トークンが全リクエストに付与されることを確認
    - _Requirements: 7.1, 9.2_

- [ ] 12. 最終チェックポイント — 全テスト通過確認
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- web-habits 側の Ingestion PUSH 実装は別タスクとして管理（本スコープ外）
- フロントエンドは静的エクスポート（`output: 'export'`）のため SSR 関連の考慮は不要
- CDK デプロイ自体はコーディングタスクに含むが、実際の AWS デプロイ実行はスコープ外

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "2.1"] },
    { "id": 2, "tasks": ["1.4", "1.5", "2.2", "2.3"] },
    { "id": 3, "tasks": ["4.1", "4.2", "4.3"] },
    { "id": 4, "tasks": ["4.4", "5.1", "5.5"] },
    { "id": 5, "tasks": ["5.2", "5.3", "5.4", "5.6"] },
    { "id": 6, "tasks": ["6.1", "6.2"] },
    { "id": 7, "tasks": ["8.1"] },
    { "id": 8, "tasks": ["8.2", "8.3", "8.4", "8.5"] },
    { "id": 9, "tasks": ["8.6", "9.1"] },
    { "id": 10, "tasks": ["9.2", "9.3"] },
    { "id": 11, "tasks": ["11.1", "11.2"] }
  ]
}
```
