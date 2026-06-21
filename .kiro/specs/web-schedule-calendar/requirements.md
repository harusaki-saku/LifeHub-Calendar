# Requirements Document

## Introduction

LifeHub エコシステムにおけるカレンダー機能（web-schedule-calendar）の要件定義書。本アプリケーションは単なるスケジュール管理ツールではなく、エコシステム内の各サービスが生成するイベントを集約表示する「ハブ」として機能する。MVP では、カレンダー本体の CRUD、Cognito 認証、習慣トラッカー（web-habits）からの PUSH 連携によるイベント受信、ソースフィルター表示、レスポンシブ対応を実現する。

## Glossary

- **Calendar_System**: カレンダーアプリケーション本体。イベントの作成・表示・編集・削除およびエコシステム連携を担うフロントエンド・バックエンド全体
- **Calendar_UI**: Next.js で構築されるカレンダーのフロントエンド画面
- **Calendar_API**: API Gateway + Lambda で構成されるカレンダーのバックエンド API
- **Ingestion_API**: 外部サービスからのイベント登録リクエストを受け付けるカレンダー側の受信エンドポイント
- **Auth_Module**: showlabo-auth パッケージを利用した Cognito 認証モジュール
- **Event_Store**: DynamoDB 上のカレンダーイベントデータストア（LifeHub シングルテーブル設計）
- **Native_Event**: カレンダー自身で作成されたイベント（source = "native"）
- **External_Event**: 外部サービスから PUSH されたイベント（source = "habit-tracker" 等）
- **Source_Filter**: イベントの出典（source）による表示 ON/OFF 切り替え機能
- **Habits_Tracker**: web-habits アプリケーション。習慣記録完了時にカレンダーへイベントを PUSH する
- **Ingestion_Schema**: 外部サービスがカレンダーへイベントを送信する際の共通データスキーマ

## Requirements

### Requirement 1: Cognito 認証によるログイン・ログアウト

**User Story:** ユーザーとして、既存の LifeHub Cognito User Pool でログイン・ログアウトしたい。そうすることで、自分のカレンダーデータに安全にアクセスできる。

#### Acceptance Criteria

1. WHEN ユーザーがログイン操作を開始した場合, THE Auth_Module SHALL Cognito Hosted UI へ PKCE フロー付きでリダイレクトし、認証完了後に ID トークン・アクセストークン・リフレッシュトークンを Cookie に保存してセッションを確立する
2. WHEN ユーザーがログアウト操作を行った場合, THE Auth_Module SHALL すべての認証トークン Cookie を削除し、Cognito のログアウトエンドポイントへリダイレクトする
3. IF 未認証状態（ID トークン Cookie が存在しない、または有効期限切れ）のユーザーがカレンダー画面にアクセスした場合, THEN THE Calendar_UI SHALL Cognito Hosted UI のログイン画面へリダイレクトする
4. THE Auth_Module SHALL 既存の LifeHub 共通 Cognito User Pool を認証プロバイダとして使用する
5. IF ID トークンまたはアクセストークンの有効期限が切れた場合, THEN THE Auth_Module SHALL リフレッシュトークンを使用してトークンを再取得し、最大 3 回までリトライする。3 回失敗した場合は認証 Cookie を削除しログイン画面へリダイレクトする
6. IF 認証コールバック処理中にエラーが発生した場合, THEN THE Calendar_UI SHALL エラーが発生したことを示すメッセージを表示する

### Requirement 2: カレンダービュー切り替え

**User Story:** ユーザーとして、月表示・週表示・日表示を切り替えて予定を閲覧したい。そうすることで、目的に応じた粒度でスケジュールを把握できる。

#### Acceptance Criteria

1. THE Calendar_UI SHALL 月表示・週表示・日表示の 3 種類のビューを提供し、初回表示時は月表示をデフォルトとする
2. WHEN ユーザーがビュー切り替え操作を行った場合, THE Calendar_UI SHALL 300ms 以内に選択されたビューへ表示を切り替える
3. WHILE 月表示の状態, THE Calendar_UI SHALL 該当月のすべてのイベントを月曜始まりのカレンダーグリッド上に表示し、1 日のセルに収まらないイベントがある場合は最大 3 件まで表示し残件数を示すインジケーターを表示する
4. WHILE 週表示の状態, THE Calendar_UI SHALL 該当週（月曜〜日曜）のイベントを 0:00〜24:00 の時間軸付きグリッドで表示する
5. WHILE 日表示の状態, THE Calendar_UI SHALL 該当日のイベントを 0:00〜24:00 の時間軸上に 30 分単位のスロットで表示し、各イベントのタイトル・開始時刻・終了時刻を表示する
6. WHEN ユーザーが前後ナビゲーション操作を行った場合, THE Calendar_UI SHALL 現在のビュー種別を維持したまま表示期間を 1 単位（月表示: 1 か月、週表示: 1 週間、日表示: 1 日）移動する
7. THE Calendar_UI SHALL 現在の日付（今日）を他の日付と視覚的に区別して表示する

### Requirement 3: ネイティブイベントの作成

**User Story:** ユーザーとして、カレンダー上で新しいイベントを作成したい。そうすることで、自分の予定を管理できる。

#### Acceptance Criteria

1. WHEN ユーザーがイベント作成操作を行った場合, THE Calendar_UI SHALL イベント作成モーダルを表示する
2. WHEN ユーザーがタイトル（最大100文字）・開始日時（ISO8601）・終了日時（ISO8601）を入力して保存操作を行った場合, THE Calendar_API SHALL イベントを Event_Store に保存し、UUID で生成した eventId を付与する
3. WHEN ユーザーが終日フラグを有効にした場合, THE Calendar_API SHALL 時刻情報を持たない終日イベントとして保存する
4. THE Calendar_API SHALL 作成されたイベントに source 値 "native" を自動付与する
5. IF イベント作成時に必須項目（タイトル、開始日時）が未入力、またはタイトルが100文字を超過、または終了日時が開始日時より前の場合, THEN THE Calendar_UI SHALL 該当フィールド付近にエラーメッセージを表示し保存を実行しない
6. WHEN イベントの保存が成功した場合, THE Calendar_UI SHALL イベント作成モーダルを閉じ、作成されたイベントをカレンダー上に即時反映する
7. IF イベント保存時に API がエラーレスポンスを返却した場合, THEN THE Calendar_UI SHALL モーダルを維持したまま保存失敗を示すエラーメッセージを表示し、ユーザーが入力済みデータを保持する

### Requirement 4: ネイティブイベントの編集・削除

**User Story:** ユーザーとして、作成済みのイベントを編集・削除したい。そうすることで、予定変更に対応できる。

#### Acceptance Criteria

1. WHEN ユーザーが Native_Event を選択して編集操作を行った場合, THE Calendar_UI SHALL 既存データ（タイトル、開始日時、終了日時、終日フラグ）を反映した編集モーダルを表示する
2. WHEN ユーザーが編集内容を保存した場合, THE Calendar_API SHALL Event_Store 上の該当イベントを更新し、updatedAt タイムスタンプを保存時刻に設定する
3. WHEN ユーザーが Native_Event の削除操作を行った場合, THE Calendar_UI SHALL 削除確認ダイアログを表示する
4. WHEN ユーザーが削除を確認した場合, THE Calendar_API SHALL Event_Store から該当イベントを削除し、カレンダー表示から即座に除去する
5. THE Calendar_UI SHALL External_Event に対して編集・削除操作を提供しない
6. IF 編集保存時に必須項目（タイトル、開始日時）が未入力の場合, THEN THE Calendar_UI SHALL バリデーションエラーを表示し保存を実行しない
7. IF 編集または削除の API リクエストが失敗した場合, THEN THE Calendar_UI SHALL 操作失敗を示すエラーメッセージを表示し、既存データを変更しない

### Requirement 5: 外部イベント受信（PUSH 方式）

**User Story:** ユーザーとして、習慣トラッカーの記録をカレンダー上で確認したい。そうすることで、習慣の実績をスケジュールと合わせて俯瞰できる。

#### Acceptance Criteria

1. WHEN 外部サービスが Ingestion_Schema に準拠したイベントを送信した場合, THE Ingestion_API SHALL イベントを検証し Event_Store に保存して HTTP 201 レスポンスを返却する
2. THE Ingestion_API SHALL 受信したイベントに送信元の source 値（例: "habit-tracker"）と sourceEventId を保持する
3. IF 受信データが Ingestion_Schema に準拠していない場合, THEN THE Ingestion_API SHALL HTTP 400 レスポンスと、不正なフィールドごとのエラー理由を含むバリデーションエラーを返却する
4. THE Ingestion_API SHALL Cognito JWT による認証を要求し、リクエストボディの userId と JWT の userId が一致することを検証する
5. IF リクエストボディの userId と JWT の userId が一致しない場合, THEN THE Ingestion_API SHALL HTTP 403 レスポンスを返却し、イベントを保存しない
6. WHEN 同一 source かつ同一 sourceEventId のイベントが再送信された場合, THE Ingestion_API SHALL 既存データを上書き更新し HTTP 200 レスポンスを返却する（冪等性保証）
7. THE Ingestion_API SHALL Ingestion_Schema の必須フィールドとして title（最大200文字）、startTime（ISO 8601 形式）、source（最大50文字）、sourceEventId（最大128文字）を要求する

### Requirement 6: ソースフィルター表示

**User Story:** ユーザーとして、イベントの出典元（source）ごとに表示を ON/OFF したい。そうすることで、必要な情報だけに集中できる。

#### Acceptance Criteria

1. THE Calendar_UI SHALL ユーザーの Event_Store に存在するイベントの source 値から重複を排除した一覧をフィルターコントロールとして表示する
2. WHEN ユーザーが特定の source フィルターを OFF にした場合, THE Calendar_UI SHALL 該当 source のイベントをカレンダー表示から即座に非表示にする（API 呼び出しなしのクライアントサイドフィルタリング）
3. WHEN ユーザーが特定の source フィルターを ON にした場合, THE Calendar_UI SHALL 該当 source のイベントをカレンダー表示に即座に復帰させる（API 呼び出しなしのクライアントサイドフィルタリング）
4. THE Calendar_UI SHALL source ごとに異なる背景色をイベント表示要素に適用し、フィルターコントロール上にも対応する色インジケーターを表示する
5. WHEN ユーザーがフィルター状態を変更した場合, THE Calendar_UI SHALL フィルター設定をブラウザのローカルストレージにネームスペース付きキーで保存する
6. WHEN ユーザーがカレンダー画面にアクセスした場合, THE Calendar_UI SHALL ローカルストレージから保存済みフィルター設定を読み込み復元する
7. IF ローカルストレージにフィルター設定が存在しない、または読み込みに失敗した場合, THEN THE Calendar_UI SHALL すべての source フィルターを ON（表示）の状態で初期化する
8. IF 保存済みフィルター設定に含まれない新規 source のイベントが検出された場合, THEN THE Calendar_UI SHALL 当該 source のフィルターを ON（表示）の状態で追加する

### Requirement 7: API 認証・認可

**User Story:** システム管理者として、すべての API アクセスが認証済みユーザーに限定されることを保証したい。そうすることで、他ユーザーのデータへの不正アクセスを防止できる。

#### Acceptance Criteria

1. THE Calendar_API SHALL すべてのエンドポイントで Cognito User Pool Authorizer による JWT トークンの検証を要求する
2. IF トークンが未付与、有効期限切れ、署名不正、または発行元が異なるリクエストを受信した場合, THEN THE Calendar_API SHALL HTTP 401 レスポンスと認証失敗を示すエラーメッセージを返却する
3. THE Calendar_API SHALL JWT claims から抽出した userId（sub）のみをデータアクセスキーとして使用し、リクエストパラメータによる userId の上書きを許可しない
4. IF 認証済みユーザーが自身に属さないリソースへのアクセスを試みた場合, THEN THE Calendar_API SHALL HTTP 403 レスポンスを返却し、対象リソースの内容を一切含めない
5. THE Calendar_API SHALL CORS の Access-Control-Allow-Origin を CloudFront ディストリビューションドメイン 1 件のみに制限する

### Requirement 8: レスポンシブ対応

**User Story:** ユーザーとして、PC でもモバイルでもカレンダーを快適に操作したい。そうすることで、デバイスを問わず予定を管理できる。

#### Acceptance Criteria

1. IF 画面幅が 768px 以上である場合, THEN THE Calendar_UI SHALL フルカレンダーグリッド（タイムスロット付き）を含むデスクトップレイアウトを表示する
2. IF 画面幅が 768px 未満である場合, THEN THE Calendar_UI SHALL モバイルレイアウトを表示し、月ビューでは簡略化されたグリッドを、週・日ビューではアジェンダ形式のリスト表示を提供する
3. WHILE モバイルレイアウトの状態, THE Calendar_UI SHALL すべてのインタラクティブ要素のタッチターゲットサイズを 44x44px 以上で提供する
4. THE Calendar_UI SHALL すべてのビュー（月・週・日）において、画面幅 360px から 428px の範囲で水平スクロールなしにコンテンツを表示する
5. WHILE モバイルレイアウトの状態, THE Calendar_UI SHALL ドラッグ＆ドロップによる予定移動機能を無効化する

### Requirement 9: パフォーマンス

**User Story:** ユーザーとして、カレンダーの表示と操作が高速であることを期待する。そうすることで、ストレスなく日常的に利用できる。

#### Acceptance Criteria

1. THE Calendar_UI SHALL カレンダー画面の初期表示において、Largest Contentful Paint（LCP）を 1 秒以内に完了する（Lambda ウォームスタート時の計測とする）
2. THE Calendar_API SHALL Lambda ウォームスタート時において、すべての API レスポンスの 95 パーセンタイル応答時間を 500ms 以内に収める
3. IF Ingestion_API 経由の外部イベント取り込み処理に 3 秒以上の遅延が発生した場合, THEN THE Calendar_System SHALL Event_Store に保存済みのキャッシュデータで画面表示を継続し、イベント取り込みを非同期で再試行する（最大 3 回）
4. IF Lambda コールドスタートが発生した場合, THEN THE Calendar_API SHALL API レスポンスを 3 秒以内に返却する

### Requirement 10: データモデル拡張性

**User Story:** 開発者として、将来の外部サービス追加や双方向連携に対応できるデータ構造を持ちたい。そうすることで、エコシステムの成長を技術的にブロックしない。

#### Acceptance Criteria

1. THE Event_Store SHALL 各イベントに source（出典識別子）、sourceEventId（外部 ID、Native_Event の場合は null）、syncDirection（同期方向、許容値: "read-only" | "bidirectional"）の属性を保持する
2. THE Event_Store SHALL LifeHub シングルテーブル設計（PK: USER#{userId}, SK: EVENT#{eventId}）に従う
3. WHILE MVP フェーズの状態, THE Calendar_System SHALL syncDirection の値を "read-only" 固定で運用する
4. THE Event_Store SHALL source 属性による検索用 GSI（GSI1PK: USER#{userId}#SOURCE#{source}, GSI1SK: startAt）を保持し、ユーザー×ソース×日付範囲によるクエリを単一クエリ操作で実行可能とする
5. THE Ingestion_API SHALL 共通の Ingestion_Schema を定義し、新規外部サービス追加時にカレンダー側ソースコードの変更およびデプロイを不要とする（新規 source 値の登録は設定追加のみで完了すること）
6. THE Event_Store SHALL source 属性を最大 64 文字の英小文字・数字・ハイフンのみで構成される文字列として保持する
