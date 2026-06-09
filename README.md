# 案件進捗管理システム (gb-manual)

kintone ライクな社内向けの**案件進捗管理システム**です。10名程度のチームでの利用を想定しています。

## 主な機能

| 機能 | 内容 |
| --- | --- |
| 🔐 認証 | メールアドレス + パスワードによるログイン（NextAuth.js v5 / JWT セッション）。未ログイン時はログイン画面へリダイレクト |
| 📋 案件管理 | 案件の一覧（カード表示）・新規作成・編集・削除。ステータス（未着手 / 進行中 / レビュー待ち / 完了）、優先度（低 / 中 / 高）、担当者、顧客、期日を管理。ステータスでフィルタ可能 |
| 🏢 顧客マスタ | 顧客の一覧・新規作成・編集・削除（顧客名・会社名・メール・電話・メモ） |
| 💬 コメント | 案件詳細画面でのコメント投稿・削除（自分のコメントのみ削除可。管理者は全削除可） |
| 👥 ユーザー管理 | 管理者のみ。ユーザー一覧・招待（メール + パスワード設定）・削除。ロールは admin / member |

## 技術スタック

- **Next.js 14**（App Router） / **TypeScript**
- **Prisma**（ORM） / **PostgreSQL**
- **NextAuth.js v5**（Credentials Provider, JWT）
- **Tailwind CSS** + shadcn/ui スタイルのコンポーネント
- **Vercel** + **Supabase**（PostgreSQL）でのデプロイを想定

---

## ローカル開発手順

### 1. 前提

- Node.js 18.18 以降
- PostgreSQL（ローカル or Docker or Supabase）

### 2. セットアップ

```bash
# 依存関係のインストール
npm install

# 環境変数ファイルを作成
cp .env.example .env
```

`.env` を編集します。

```env
# PostgreSQL 接続文字列
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gb_manual?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/gb_manual?schema=public"

# 32文字以上のランダム文字列（生成: openssl rand -base64 32）
AUTH_SECRET="..."
```

> ローカルに PostgreSQL がない場合は Docker で簡単に起動できます:
> ```bash
> docker run --name gb-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
> ```

### 3. データベースの初期化とシード

```bash
# スキーマを DB に反映（マイグレーションファイルを作る場合は db:migrate）
npm run db:push

# 初期データ（管理者・サンプル顧客・案件）を投入
npm run db:seed
```

### 4. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 にアクセスし、以下でログインします。

| ロール | メールアドレス | パスワード |
| --- | --- | --- |
| 管理者 | `admin@example.com` | `admin1234` |
| メンバー | `member@example.com` | `member1234` |

### 便利なコマンド

```bash
npm run dev        # 開発サーバー
npm run build      # 本番ビルド（prisma generate を含む）
npm run start      # 本番サーバー
npm run db:push    # スキーマを DB に反映
npm run db:migrate # マイグレーション作成・適用
npm run db:seed    # シードデータ投入
npm run db:studio  # Prisma Studio（DB GUI）
```

---

## Vercel + Supabase へのデプロイ手順

### 1. Supabase で PostgreSQL を用意

1. [Supabase](https://supabase.com/) でプロジェクトを作成。
2. **Project Settings → Database → Connection string** から接続文字列を取得します。
   - `DATABASE_URL`: **Transaction pooler**（ポート `6543`、末尾に `?pgbouncer=true&connection_limit=1` を付与）
   - `DIRECT_URL`: **Session / Direct connection**（ポート `5432`）
   - 例:
     ```env
     DATABASE_URL="postgresql://postgres.xxxx:[PASSWORD]@aws-0-xxx.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
     DIRECT_URL="postgresql://postgres.xxxx:[PASSWORD]@aws-0-xxx.pooler.supabase.com:5432/postgres"
     ```

### 2. スキーマ反映とシード（ローカルから本番 DB へ）

`.env` に Supabase の接続文字列を設定したうえで、ローカルから実行します。

```bash
npm run db:push    # 本番 DB にスキーマを反映
npm run db:seed    # 管理者ユーザー等を投入（任意）
```

> ⚠️ シードで作成される初期パスワードは、本番では必ずログイン後に変更（または別ユーザーを作成して初期管理者を削除）してください。

### 3. Vercel へデプロイ

1. [Vercel](https://vercel.com/) でこの GitHub リポジトリをインポート。
2. **Environment Variables** に以下を設定します。

   | 変数名 | 値 |
   | --- | --- |
   | `DATABASE_URL` | Supabase の pooler 接続文字列 |
   | `DIRECT_URL` | Supabase の direct 接続文字列 |
   | `AUTH_SECRET` | `openssl rand -base64 32` で生成した値 |

3. **Deploy** を実行。`build` スクリプトで `prisma generate` が走るため追加設定は不要です。
4. デプロイ後、発行された URL にアクセスしてログインします。

> NextAuth v5 は Vercel 上では `VERCEL_URL` を自動利用するため、`NEXTAUTH_URL` の手動設定は通常不要です（`trustHost: true` を設定済み）。

---

## ディレクトリ構成

```
.
├── prisma/
│   ├── schema.prisma        # User / Customer / Project / Comment モデル
│   └── seed.ts              # シードデータ
├── src/
│   ├── auth.ts              # NextAuth 本体（Credentials Provider）
│   ├── auth.config.ts       # エッジ対応の認証設定（middleware 用）
│   ├── middleware.ts        # 未ログイン時のリダイレクト
│   ├── app/
│   │   ├── login/           # ログイン画面
│   │   ├── (dashboard)/     # 認証必須エリア
│   │   │   ├── projects/    # 案件 一覧 / 新規 / 詳細 / 編集
│   │   │   ├── customers/   # 顧客 一覧 / 新規 / 編集
│   │   │   └── users/       # ユーザー管理（管理者のみ）
│   │   └── api/auth/        # NextAuth ルートハンドラ
│   ├── components/          # UI コンポーネント（shadcn/ui スタイル）
│   └── lib/
│       ├── prisma.ts        # Prisma クライアント
│       └── actions/         # Server Actions（CRUD）
└── .env.example
```

## データモデル

- **User** (id, name, email, password, role, createdAt)
- **Customer** (id, name, company, email, phone, memo, createdAt)
- **Project** (id, title, description, status, priority, dueDate, customerId, assigneeId, createdById, createdAt, updatedAt)
- **Comment** (id, content, projectId, userId, createdAt)

---

## 補足

- リポジトリ直下の `index.html` は別途の業務マニュアル（静的ファイル）であり、本アプリとは独立しています。
