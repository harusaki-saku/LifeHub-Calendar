# src/app/page.tsx

カレンダーのメインページ。ビュー切替・イベント取得・モーダル制御を統括する。

## コンポーネント構成

```
CalendarPage (default export)
└── AuthGuard               # 未認証時は Cognito ログインへリダイレクト
    └── CalendarPageContent # 実際のカレンダーUI
```

## CalendarPageContent の責務

### データ取得
- ビュータイプ・現在日付が変わるたびに `fetchEvents(start, end)` を呼び出す
- `getFetchRange(currentDate, viewType)` で取得範囲のISODateを計算
- エラー時は `toast.error(error)` で通知

### フィルター初期化
- `events` が更新されたタイミングで、一意のソース一覧を `loadFilters(sources)` に渡す

### モーダル状態管理

| 状態 | 説明 |
|------|------|
| `modalOpen` | EventModal の開閉 |
| `deleteOpen` | DeleteConfirmDialog の開閉 |
| `selectedEvent` | 編集・削除対象のイベント |
| `defaultStart` | 新規作成時にカレンダーでクリックした日付 |

### イベントハンドラー

- `openCreate(date?)` — 新規作成モーダルを開く。月ビューの日付クリックで `date` が渡る
- `openEdit(eventId)` — 編集モーダルを開く。`source === 'native'` のイベントのみ対象
- 削除フロー: EventModal の削除ボタン → DeleteConfirmDialog で確認 → `deleteEvent(id)`

## ビュー切替

`viewType`（`useViewStore`）の値に応じてコンポーネントを切り替える:

| viewType | コンポーネント |
|----------|--------------|
| `month` | `MonthView` |
| `week` | `WeekView` |
| `day` | `DayView` |

## 関連ファイル

- [../components/layout/AuthGuard.md](../components/layout/AuthGuard.md)
- [../components/layout/CalendarLayout.md](../components/layout/CalendarLayout.md)
- [../components/calendar/MonthView.md](../components/calendar/MonthView.md)
- [../components/calendar/WeekView.md](../components/calendar/WeekView.md)
- [../components/calendar/DayView.md](../components/calendar/DayView.md)
- [../components/events/EventModal.md](../components/events/EventModal.md)
- [../components/events/DeleteConfirmDialog.md](../components/events/DeleteConfirmDialog.md)
- [../stores/event-store.md](../stores/event-store.md)
- [../stores/view-store.md](../stores/view-store.md)
- [../lib/date-utils.md](../lib/date-utils.md) — `getFetchRange`
