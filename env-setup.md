# 環境変数の設定方法

このプロジェクトでは、Supabaseに接続するために以下の環境変数が必要です。

## ローカル開発環境

ローカル開発環境では、プロジェクトルートに`.env.local`ファイルを作成し、以下の内容を設定してください：

```
NEXT_PUBLIC_SUPABASE_URL=あなたのSupabaseプロジェクトURL
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSupabase匿名キー
```

## Vercelデプロイ時

Vercelにデプロイする際は、Vercelのダッシュボードから環境変数を設定してください：

1. Vercelダッシュボードでプロジェクトを選択
2. 「Settings」タブをクリック
3. 「Environment Variables」セクションで以下の変数を追加：
   - `NEXT_PUBLIC_SUPABASE_URL`: SupabaseのプロジェクトURL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの匿名キー

## Supabase設定の取得方法

1. [Supabase](https://supabase.com/)にログイン
2. プロジェクトを選択
3. 「Settings」→「API」を開く
4. 「Project URL」と「anon public」キーをコピー

**注意**: 環境変数ファイル（.env.local）はGitにコミットしないでください。セキュリティリスクとなります。
