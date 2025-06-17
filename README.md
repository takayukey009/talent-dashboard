# タレント週次ダッシュボード

若手タレントの週次活動状況、SNS成長状況、目標達成状況を一元管理するためのダッシュボードシステムです。

## 機能

- 週次レポート表示
- タレント情報表示
- 活動管理機能
- SNS統計機能
- 管理機能

## 技術スタック

- Next.js 14
- Supabase
- shadcn/ui
- Tailwind CSS

## セットアップ方法

### 前提条件

- Node.js 18.0.0以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install
# または
yarn install
```

### 環境変数の設定

プロジェクトルートに`.env.local`ファイルを作成し、以下の環境変数を設定します：

```
NEXT_PUBLIC_SUPABASE_URL=あなたのSupabaseプロジェクトURL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSupabase匿名キー
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションが表示されます。

## データベース設計

- talents（タレント情報）
- activities（活動記録）
- sns_stats（SNS統計）
- weekly_goals（週間目標）

## デプロイ

このプロジェクトはVercelにデプロイすることを想定しています。GitHubリポジトリをVercelに接続し、必要な環境変数を設定することで、自動的にデプロイされます。

## ライセンス

このプロジェクトは非公開です。無断での使用・複製・配布は禁止されています。
