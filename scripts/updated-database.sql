-- 既存のデータを削除
DELETE FROM weekly_goals;
DELETE FROM sns_stats;
DELETE FROM activities;
DELETE FROM talents;

-- 新しいタレントデータを挿入
INSERT INTO talents (name, avatar_url, age, agency) VALUES
('中原', NULL, 19, 'スターライト'),
('五十嵐', NULL, 22, 'エンターテイメント・プロ'),
('吉川愛', NULL, 20, 'ミュージック・スター'),
('小久保', NULL, 18, 'アイドル・プロダクション'),
('倉田', NULL, 21, 'タレント・エージェンシー'),
('千桜', NULL, 19, 'エンターテイメント・スタジオ'),
('谷口', NULL, 23, 'パフォーマンス・グループ');

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
    (5, 'オーディション', '舞台「青春」', '合格', CURRENT_DATE - 3),
    (6, '撮影', 'ドラマ「恋愛物語」', '進行中', CURRENT_DATE),
    (7, 'オーディション', '映画「アクション」', '待機中', CURRENT_DATE - 2);
    
    -- SNS統計データ
    INSERT INTO sns_stats (talent_id, platform, followers, growth, week_number, year) VALUES
    -- 中原
    (1, 'instagram', 45000, 2500, current_week, current_year),
    (1, 'tiktok', 120000, 8000, current_week, current_year),
    (1, 'twitter', 28000, 1200, current_week, current_year),
    -- 五十嵐
    (2, 'instagram', 32000, 1800, current_week, current_year),
    (2, 'tiktok', 85000, 5200, current_week, current_year),
    (2, 'twitter', 19000, 900, current_week, current_year),
    -- 吉川愛
    (3, 'instagram', 67000, 3200, current_week, current_year),
    (3, 'tiktok', 150000, 12000, current_week, current_year),
    (3, 'twitter', 41000, 2100, current_week, current_year),
    -- 小久保
    (4, 'instagram', 28000, 1500, current_week, current_year),
    (4, 'tiktok', 95000, 6500, current_week, current_year),
    (4, 'twitter', 15000, 800, current_week, current_year),
    -- 倉田
    (5, 'instagram', 52000, 2800, current_week, current_year),
    (5, 'tiktok', 110000, 7200, current_week, current_year),
    (5, 'twitter', 33000, 1600, current_week, current_year),
    -- 千桜
    (6, 'instagram', 38000, 2200, current_week, current_year),
    (6, 'tiktok', 88000, 5800, current_week, current_year),
    (6, 'twitter', 22000, 1100, current_week, current_year),
    -- 谷口
    (7, 'instagram', 44000, 2600, current_week, current_year),
    (7, 'tiktok', 102000, 6800, current_week, current_year),
    (7, 'twitter', 29000, 1400, current_week, current_year);
    
    -- 週間目標データ
    INSERT INTO weekly_goals (talent_id, completed, total, week_number, year) VALUES
    (1, 4, 5, current_week, current_year),
    (2, 3, 4, current_week, current_year),
    (3, 5, 6, current_week, current_year),
    (4, 2, 4, current_week, current_year),
    (5, 4, 5, current_week, current_year),
    (6, 3, 5, current_week, current_year),
    (7, 2, 3, current_week, current_year);
END $$;
