-- 既存のデータを削除
DELETE FROM weekly_goals;
DELETE FROM sns_stats;
DELETE FROM activities;
DELETE FROM talents;

-- weekly_topicカラムを追加（存在しない場合）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'talents'
        AND column_name = 'weekly_topic'
    ) THEN
        ALTER TABLE talents ADD COLUMN weekly_topic TEXT;
    END IF;
END $$;

-- 新しいタレントデータを挿入
INSERT INTO talents (name, avatar_url, age, agency, weekly_topic) VALUES
('中塚智', NULL, 19, 'スターライト', '新曲「夢の先へ」リリース決定'),
('五十嵐', NULL, 22, 'エンターテイメント・プロ', 'ファッション誌の表紙に初登場'),
('吉川慶', NULL, 20, 'ミュージック・スター', 'ドラマ「青い空」出演決定'),
('小久保', NULL, 18, 'アイドル・プロダクション', '初のソロコンサート開催発表'),
('吉富千桜', NULL, 19, 'エンターテイメント・スタジオ', '新CM契約獲得'),
('谷口彩菜', NULL, 23, 'パフォーマンス・グループ', '海外ファッションショー出演決定');

-- 現在の週と年を取得してサンプルデータを挿入
DO $$
DECLARE
    current_week INTEGER;
    current_year INTEGER;
BEGIN
    SELECT EXTRACT(WEEK FROM CURRENT_DATE), EXTRACT(YEAR FROM CURRENT_DATE) INTO current_week, current_year;
    
    -- 活動データ
    INSERT INTO activities (talent_id, type, title, status, date) VALUES
    (1, '撮影', 'ファッション雑誌「VOGUE」', '完了', CURRENT_DATE - 6),
    (1, 'オーディション', 'ドラマ「青春物語」主演', '合格', CURRENT_DATE - 4),
    (2, '撮影', 'CM「爽やかドリンク」', '完了', CURRENT_DATE - 5),
    (2, 'オーディション', '映画「夏の記憶」', '待機中', CURRENT_DATE - 3),
    (3, '撮影', 'MV「桜の季節」', '進行中', CURRENT_DATE - 2),
    (3, 'オーディション', 'アニメ声優「魔法少女」', '合格', CURRENT_DATE - 7),
    (4, '撮影', 'グラビア撮影', '完了', CURRENT_DATE - 1),
    (5, '撮影', 'ドラマ「恋愛物語」', '進行中', CURRENT_DATE),
    (6, 'オーディション', '映画「アクション」', '待機中', CURRENT_DATE - 2);
    
    -- SNS統計データ
    INSERT INTO sns_stats (talent_id, platform, followers, growth, week_number, year) VALUES
    -- 中塚智
    (1, 'instagram', 45000, 0, current_week, current_year),
    (1, 'tiktok', 120000, 0, current_week, current_year),
    (1, 'twitter', 1308, 0, current_week, current_year),
    -- 五十嵐
    (2, 'instagram', 32000, 0, current_week, current_year),
    (2, 'tiktok', 85000, 0, current_week, current_year),
    (2, 'twitter', 19000, 0, current_week, current_year),
    -- 吉川慶
    (3, 'instagram', 67000, 0, current_week, current_year),
    (3, 'tiktok', 150000, 0, current_week, current_year),
    (3, 'twitter', 41000, 0, current_week, current_year),
    -- 小久保
    (4, 'instagram', 28000, 0, current_week, current_year),
    (4, 'tiktok', 95000, 0, current_week, current_year),
    (4, 'twitter', 15000, 0, current_week, current_year),
    -- 吉富千桜
    (5, 'instagram', 38000, 0, current_week, current_year),
    (5, 'tiktok', 88000, 0, current_week, current_year),
    (5, 'twitter', 22000, 0, current_week, current_year),
    -- 谷口彩菜
    (6, 'instagram', 204000, 0, current_week, current_year),
    (6, 'tiktok', 42900, 0, current_week, current_year),
    (6, 'twitter', 26068, 0, current_week, current_year);
    
    -- 週間目標データ（参照用に残しておく）
    INSERT INTO weekly_goals (talent_id, completed, total, week_number, year) VALUES
    (1, 4, 5, current_week, current_year),
    (2, 3, 4, current_week, current_year),
    (3, 5, 6, current_week, current_year),
    (4, 2, 4, current_week, current_year),
    (5, 3, 5, current_week, current_year),
    (6, 2, 3, current_week, current_year);
END $$;
