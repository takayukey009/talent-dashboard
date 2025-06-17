import { createClient } from "@supabase/supabase-js"

// 環境変数からSupabaseの接続情報を取得（フォールバック付き）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// デバッグ用に環境変数の状態をログ出力
if (typeof window !== "undefined") {
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set");
  console.log("Supabase Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set");
}

// Supabaseが設定されているかチェック
export const isSupabaseConfigured =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"

// デバッグ用に接続状態をログ出力
if (typeof window !== "undefined") {
  console.log("Supabase configured:", isSupabaseConfigured);
}

// 共有のクライアントオプション
const clientOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
}

// クライアント側で使用するSupabaseクライアント
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey, clientOptions) : null

// サーバーサイドのSupabaseクライアント作成関数
export function createServerSupabaseClient() {
  try {
    if (!isSupabaseConfigured) {
      console.error("Supabase is not configured properly")
      return null
    }

    // Next.js 15.2.4に対応したシンプルな実装
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })
  } catch (error) {
    console.error("Error creating server Supabase client:", error)
    return null
  }
}

// タレント情報の型定義（年齢と職種を削除）
export type Talent = {
  id: number
  name: string
  avatar_url: string | null
  created_at?: string
  weekly_topic?: string
}

export type Activity = {
  id: number
  talent_id: number
  type: string
  title: string
  status: string
  date: string
  created_at?: string
}

export type SnsStats = {
  id: number
  talent_id: number
  platform: string
  followers: number
  growth: number
  week_number: number
  year: number
  created_at?: string
}

export type WeeklyGoal = {
  id: number
  talent_id: number
  completed: number
  total: number
  week_number: number
  year: number
  created_at?: string
}

// 現在の週番号を取得する関数
export function getCurrentWeekNumber() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = now.getTime() - start.getTime() + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000
  const oneWeek = 604800000 // 1週間のミリ秒
  return Math.ceil(diff / oneWeek)
}

// 現在の年を取得する関数
export function getCurrentYear() {
  return new Date().getFullYear()
}

// モックデータ（年齢と職種を削除）
export const mockTalents: Talent[] = [
  {
    id: 1,
    name: "中塚智",
    avatar_url: null,
    weekly_topic: "新曲「夢の先へ」リリース決定",
  },
  {
    id: 2,
    name: "五十嵐諒",
    avatar_url: null,
    weekly_topic: "ファッション誌の表紙に初登場",
  },
  {
    id: 3,
    name: "吉川慶",
    avatar_url: null,
    weekly_topic: "ドラマ「青い空」出演決定",
  },
  {
    id: 4,
    name: "島田和奏",
    avatar_url: "/images/shimada-wakana.jpg",
    weekly_topic: "初のソロコンサート開催発表",
  },
  {
    id: 6,
    name: "吉富千桜",
    avatar_url: null,
    weekly_topic: "新CM契約獲得",
  },
  {
    id: 7,
    name: "谷口彩菜",
    avatar_url: null,
    weekly_topic: "海外ファッションショー出演決定",
  },
]

export const mockActivities: Activity[] = [
  { id: 1, talent_id: 1, type: "撮影", title: "ファッション雑誌「VOGUE」", status: "完了", date: "2024-01-08" },
  { id: 2, talent_id: 1, type: "オーディション", title: "ドラマ「青春物語」主演", status: "合格", date: "2024-01-10" },
  { id: 3, talent_id: 2, type: "撮影", title: "CM「爽やかドリンク」", status: "完了", date: "2024-01-09" },
  { id: 4, talent_id: 2, type: "オーディション", title: "映画「夏の記憶」", status: "待機中", date: "2024-01-11" },
  { id: 5, talent_id: 3, type: "撮影", title: "MV「桜の季節」", status: "進行中", date: "2024-01-12" },
  { id: 6, talent_id: 3, type: "オーディション", title: "アニメ声優「魔法少女」", status: "合格", date: "2024-01-07" },
  { id: 7, talent_id: 4, type: "撮影", title: "グラビア撮影", status: "完了", date: "2024-01-13" },
  { id: 9, talent_id: 6, type: "撮影", title: "ドラマ「恋愛物語」", status: "進行中", date: "2024-01-14" },
  { id: 10, talent_id: 7, type: "オーディション", title: "映画「アクション」", status: "待機中", date: "2024-01-12" },
]

export const mockSnsStats: SnsStats[] = [
  // 中塚智
  {
    id: 1,
    talent_id: 1,
    platform: "instagram",
    followers: 5611,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  {
    id: 2,
    talent_id: 1,
    platform: "tiktok",
    followers: 120000,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  {
    id: 3,
    talent_id: 1,
    platform: "twitter",
    followers: 1308,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  // 五十嵐諒
  {
    id: 4,
    talent_id: 2,
    platform: "instagram",
    followers: 513,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  {
    id: 5,
    talent_id: 2,
    platform: "tiktok",
    followers: 85000,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  {
    id: 6,
    talent_id: 2,
    platform: "twitter",
    followers: 540,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  // 吉川慶
  {
    id: 7,
    talent_id: 3,
    platform: "instagram",
    followers: 67000,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  {
    id: 8,
    talent_id: 3,
    platform: "tiktok",
    followers: 150000,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  {
    id: 9,
    talent_id: 3,
    platform: "twitter",
    followers: 41000,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  // 島田和奏
  {
    id: 10,
    talent_id: 4,
    platform: "instagram",
    followers: 4651,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  {
    id: 11,
    talent_id: 4,
    platform: "tiktok",
    followers: 95000,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  {
    id: 12,
    talent_id: 4,
    platform: "twitter",
    followers: 937,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  // 吉富千桜
  {
    id: 16,
    talent_id: 6,
    platform: "instagram",
    followers: 59,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  {
    id: 17,
    talent_id: 6,
    platform: "tiktok",
    followers: 88000,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  {
    id: 18,
    talent_id: 6,
    platform: "twitter",
    followers: 383,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  // 谷口彩菜
  {
    id: 19,
    talent_id: 7,
    platform: "instagram",
    followers: 204000,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  {
    id: 20,
    talent_id: 7,
    platform: "tiktok",
    followers: 42900,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
  {
    id: 21,
    talent_id: 7,
    platform: "twitter",
    followers: 26068,
    growth: 0,
    week_number: getCurrentWeekNumber(),
    year: getCurrentYear(),
  },
]

export const mockWeeklyGoals: WeeklyGoal[] = [
  { id: 1, talent_id: 1, completed: 4, total: 5, week_number: getCurrentWeekNumber(), year: getCurrentYear() },
  { id: 2, talent_id: 2, completed: 3, total: 4, week_number: getCurrentWeekNumber(), year: getCurrentYear() },
  { id: 3, talent_id: 3, completed: 5, total: 6, week_number: getCurrentWeekNumber(), year: getCurrentYear() },
  { id: 4, talent_id: 4, completed: 2, total: 4, week_number: getCurrentWeekNumber(), year: getCurrentYear() },
  { id: 6, talent_id: 6, completed: 3, total: 5, week_number: getCurrentWeekNumber(), year: getCurrentYear() },
  { id: 7, talent_id: 7, completed: 2, total: 3, week_number: getCurrentWeekNumber(), year: getCurrentYear() },
]
