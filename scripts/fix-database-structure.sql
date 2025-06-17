-- タレントダッシュボード データベース構造修正
-- アプリケーションコードに合わせたテーブル構造

-- トランザクションを開始
BEGIN;

-- 既存のデータを削除（外部キー制約を考慮した順序）
DELETE FROM weekly_goals;
DELETE FROM sns_stats;
DELETE FROM activities;
DELETE FROM talents;

-- テーブル構造の修正

-- 1. activities テーブル
-- title と status はそのままに、week_number と year を追加
ALTER TABLE activities ADD COLUMN IF NOT EXISTS week_number INTEGER;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS year INTEGER;

-- 2. sns_stats テーブル
-- growth カラムをそのまま使用（アプリケーションコードでは growth として参照）

-- 3. weekly_goals テーブル
-- completed と total カラムをそのまま使用（アプリケーションコードでは completed と total として参照）
-- description カラムを追加
ALTER TABLE weekly_goals ADD COLUMN IF NOT EXISTS description TEXT;

-- RLSを有効にし、基本的なポリシーを設定
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sns_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_goals ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "Enable read access for all users on talents" ON talents;
DROP POLICY IF EXISTS "Enable read access for all users on activities" ON activities;
DROP POLICY IF EXISTS "Enable read access for all users on sns_stats" ON sns_stats;
DROP POLICY IF EXISTS "Enable read access for all users on weekly_goals" ON weekly_goals;

DROP POLICY IF EXISTS "Enable insert for authenticated users on talents" ON talents;
DROP POLICY IF EXISTS "Enable insert for authenticated users on activities" ON activities;
DROP POLICY IF EXISTS "Enable insert for authenticated users on sns_stats" ON sns_stats;
DROP POLICY IF EXISTS "Enable insert for authenticated users on weekly_goals" ON weekly_goals;

DROP POLICY IF EXISTS "Enable update for authenticated users on talents" ON talents;
DROP POLICY IF EXISTS "Enable update for authenticated users on activities" ON activities;
DROP POLICY IF EXISTS "Enable update for authenticated users on sns_stats" ON sns_stats;
DROP POLICY IF EXISTS "Enable update for authenticated users on weekly_goals" ON weekly_goals;

-- 読み取りポリシー（全員が読み取り可能）
CREATE POLICY "Enable read access for all users on talents" 
    ON talents FOR SELECT USING (true);
    
CREATE POLICY "Enable read access for all users on activities" 
    ON activities FOR SELECT USING (true);
    
CREATE POLICY "Enable read access for all users on sns_stats" 
    ON sns_stats FOR SELECT USING (true);
    
CREATE POLICY "Enable read access for all users on weekly_goals" 
    ON weekly_goals FOR SELECT USING (true);

-- 書き込みポリシー（認証済みユーザーのみ）
CREATE POLICY "Enable insert for authenticated users on talents" 
    ON talents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
CREATE POLICY "Enable insert for authenticated users on activities" 
    ON activities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
CREATE POLICY "Enable insert for authenticated users on sns_stats" 
    ON sns_stats FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
CREATE POLICY "Enable insert for authenticated users on weekly_goals" 
    ON weekly_goals FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 更新ポリシー（認証済みユーザーのみ）
CREATE POLICY "Enable update for authenticated users on talents" 
    ON talents FOR UPDATE WITH CHECK (auth.role() = 'authenticated');
    
CREATE POLICY "Enable update for authenticated users on activities" 
    ON activities FOR UPDATE WITH CHECK (auth.role() = 'authenticated');
    
CREATE POLICY "Enable update for authenticated users on sns_stats" 
    ON sns_stats FOR UPDATE WITH CHECK (auth.role() = 'authenticated');
    
CREATE POLICY "Enable update for authenticated users on weekly_goals" 
    ON weekly_goals FOR UPDATE WITH CHECK (auth.role() = 'authenticated');

-- サンプルデータの挿入（順序を考慮）
DO $$
DECLARE
    current_week INTEGER;
    current_year INTEGER;
    talent_id1 INTEGER;
    talent_id2 INTEGER;
    talent_id3 INTEGER;
    talent_id4 INTEGER;
    talent_id5 INTEGER;
    talent_id6 INTEGER;
BEGIN
    SELECT EXTRACT(WEEK FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE) INTO current_week, current_year;
    
    -- タレントデータを挿入し、生成されたIDを保存
    INSERT INTO talents (name, avatar_url, weekly_topic) VALUES
    ('中塚智', NULL, '新曲「夢の先へ」リリース決定') RETURNING id INTO talent_id1;
    
    INSERT INTO talents (name, avatar_url, weekly_topic) VALUES
    ('五十嵐諒', NULL, 'ファッション誌の表紙に初登場') RETURNING id INTO talent_id2;
    
    INSERT INTO talents (name, avatar_url, weekly_topic) VALUES
    ('吉川慶', NULL, 'ドラマ「青い空」出演決定') RETURNING id INTO talent_id3;
    
    INSERT INTO talents (name, avatar_url, weekly_topic) VALUES
    ('島田和奏', '/images/shimada-wakana.jpg', '初のソロコンサート開催発表') RETURNING id INTO talent_id4;
    
    INSERT INTO talents (name, avatar_url, weekly_topic) VALUES
    ('吉富千桜', NULL, '新CM契約獲得') RETURNING id INTO talent_id5;
    
    INSERT INTO talents (name, avatar_url, weekly_topic) VALUES
    ('谷口彩菜', NULL, '海外ファッションショー出演決定') RETURNING id INTO talent_id6;

    -- 活動データ（生成されたtalent_idを使用）
    INSERT INTO activities (talent_id, type, title, status, week_number, year, date) VALUES
    (talent_id1, '撮影', 'ファッション雑誌「VOGUE」', '完了', current_week, current_year, CURRENT_DATE - 6),
    (talent_id1, 'オーディション', 'ドラマ「青春物語」主演', '完了', current_week, current_year, CURRENT_DATE - 4),
    (talent_id2, '撮影', 'CM「爽やかドリンク」', '完了', current_week, current_year, CURRENT_DATE - 5),
    (talent_id2, 'オーディション', '映画「夏の記憶」', '未完了', current_week, current_year, CURRENT_DATE - 3),
    (talent_id3, '撮影', 'MV「桜の季節」', '未完了', current_week, current_year, CURRENT_DATE - 2),
    (talent_id3, 'オーディション', 'アニメ声優「魔法少女」', '完了', current_week, current_year, CURRENT_DATE - 7),
    (talent_id4, '撮影', 'グラビア撮影', '完了', current_week, current_year, CURRENT_DATE - 1),
    (talent_id5, '撮影', 'ドラマ「恋愛物語」', '未完了', current_week, current_year, CURRENT_DATE),
    (talent_id6, 'オーディション', '映画「アクション」', '未完了', current_week, current_year, CURRENT_DATE - 2);
    
    -- SNS統計データ（生成されたtalent_idを使用）
    INSERT INTO sns_stats (talent_id, platform, followers, growth, week_number, year) VALUES
    -- 中塚智
    (talent_id1, 'instagram', 5611, 24, current_week, current_year),
    (talent_id1, 'tiktok', 120000, 24, current_week, current_year),
    (talent_id1, 'twitter', 1308, 0, current_week, current_year),
    -- 五十嵐諒
    (talent_id2, 'instagram', 513, 0, current_week, current_year),
    (talent_id2, 'tiktok', 85000, 0, current_week, current_year),
    (talent_id2, 'twitter', 540, 0, current_week, current_year),
    -- 吉川慶
    (talent_id3, 'instagram', 67000, 0, current_week, current_year),
    (talent_id3, 'tiktok', 150000, 0, current_week, current_year),
    (talent_id3, 'twitter', 41000, 0, current_week, current_year),
    -- 島田和奏
    (talent_id4, 'instagram', 4651, 0, current_week, current_year),
    (talent_id4, 'tiktok', 95000, 0, current_week, current_year),
    (talent_id4, 'twitter', 937, 0, current_week, current_year),
    -- 吉富千桜
    (talent_id5, 'instagram', 59, 0, current_week, current_year),
    (talent_id5, 'tiktok', 88000, 0, current_week, current_year),
    (talent_id5, 'twitter', 383, 0, current_week, current_year),
    -- 谷口彩菜
    (talent_id6, 'instagram', 204000, 0, current_week, current_year),
    (talent_id6, 'tiktok', 42900, 0, current_week, current_year),
    (talent_id6, 'twitter', 26068, 0, current_week, current_year);
    
    -- 週間目標データ（生成されたtalent_idを使用）
    INSERT INTO weekly_goals (talent_id, description, completed, total, week_number, year) VALUES
    (talent_id1, 'SNSフォロワー増加キャンペーン', 4, 5, current_week, current_year),
    (talent_id2, '新しい演技スキルの習得', 3, 4, current_week, current_year),
    (talent_id3, 'ボーカルレッスンの完了', 5, 5, current_week, current_year),
    (talent_id4, 'ダンスパフォーマンスの練習', 2, 4, current_week, current_year),
    (talent_id5, 'モデルウォークの改善', 5, 5, current_week, current_year),
    (talent_id6, '英語スピーキングスキルの向上', 2, 3, current_week, current_year);
END $$;

-- トランザクションをコミット
COMMIT;
