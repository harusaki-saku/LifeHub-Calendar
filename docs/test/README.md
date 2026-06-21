# src/test/

ユニットテスト群。Vitest + Testing Library (jsdom環境) で実行する。プロパティベーステスト（fast-check）も使用する設計。

## テストファイル

### date-utils.test.ts
`src/lib/date-utils.ts` のユニットテスト。

**テストケース:**

| テスト | 内容 |
|--------|------|
| `navigateDate`: month forward/backward | 前後1ヶ月で元の月に戻ることを確認 |
| `getEventsForDate`: event placement | 開始日にイベントが配置されることを確認 |

### validators.test.ts
`src/lib/validators.ts` のユニットテスト。

**テストケース:**

| テスト | 内容 |
|--------|------|
| `createEventSchema`: 空タイトル拒否 | trim後に空文字ならバリデーション失敗 |
| `createEventSchema`: endAt < startAt 拒否 | 終了日時が開始日時より前ならエラー |
| `sourceSchema`: `habit-tracker` 受入 | ハイフン含む小文字英数字は有効 |
| `sourceSchema`: 大文字ソース拒否 | `SOURCE_PATTERN` に一致しない場合はエラー |

### setup.ts
Vitest のグローバルセットアップファイル。

```ts
import '@testing-library/jest-dom';
```

jest-dom のカスタムマッチャー（`toBeInTheDocument` 等）をグローバルに登録する。

## 実行方法

```bash
npm run test       # ウォッチモード
npm run test:run   # 単発実行（CI向け）
```

## 設定ファイル

`vitest.config.ts`:
- `environment: 'jsdom'`
- `globals: true`
- `setupFiles: ['./src/test/setup.ts']`
- path alias `@/*` → `./src/*`

## プロパティベーステスト

`fast-check` が依存関係に含まれており、将来的には `navigateDate` の可逆性や `getEventsForDate` のフィルタリング正確性をプロパティとして検証する設計。

## 関連ファイル

- [../lib/date-utils.md](../lib/date-utils.md)
- [../lib/validators.md](../lib/validators.md)
