-- タレントテーブル
CREATE TABLE IF NOT EXISTS talents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  age INTEGER NOT NULL,
  agency VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 活動テーブル
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  talent_id INTEGER REFERENCES talents(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SNS統計テーブル
CREATE TABLE IF NOT EXISTS sns_stats (
  id SERIAL PRIMARY KEY,
  talent_id INTEGER REFERENCES talents(id),
  platform VARCHAR(50) NOT NULL,
  followers INTEGER NOT NULL,
  growth INTEGER NOT NULL,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(talent_id, platform, week_number, year)
);

-- 週間目標テーブル
CREATE TABLE IF NOT EXISTS weekly_goals (
  id SERIAL PRIMARY KEY,
  talent_id INTEGER REFERENCES talents(id),
  completed INTEGER NOT NULL,
  total INTEGER NOT NULL,
  week_number INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(talent_id, week_number, year)
);

-- サンプルデータ
INSERT INTO talents (name, avatar_url, age, agency) VALUES
('田中 美咲', NULL, 19, 'スターライト'),
('佐藤 健太', NULL, 22, 'エンターテイメント・プロ'),
('山田 花音', NULL, 20, 'ミュージック・スター');

-- 現在の週と年を取得
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
    (3, 'オーディション', 'アニメ声優「魔法少女」', '合格', CURRENT_DATE - 7);
    
    -- SNS統計データ
    INSERT INTO sns_stats (talent_id, platform, followers, growth, week_number, year) VALUES
    (1, 'instagram', 45000, 2500, current_week, current_year),
    (1, 'tiktok', 120000, 8000, current_week, current_year),
    (1, 'twitter', 28000, 1200, current_week, current_year),
    (2, 'instagram', 32000, 1800, current_week, current_year),
    (2, 'tiktok', 85000, 5200, current_week, current_year),
    (2, 'twitter', 19000, 900, current_week, current_year),
    (3, 'instagram', 67000, 3200, current_week, current_year),
    (3, 'tiktok', 150000, 12000, current_week, current_year),
    (3, 'twitter', 41000, 2100, current_week, current_year);
    
    -- 週間目標データ
    INSERT INTO weekly_goals (talent_id, completed, total, week_number, year) VALUES
    (1, 4, 5, current_week, current_year),
    (2, 3, 4, current_week, current_year),
    (3, 5, 6, current_week, current_year);
END $$;
