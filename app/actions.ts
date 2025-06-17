"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@supabase/supabase-js"

// デバッグ用のログ出力
console.log("Server Actions module loaded")

// 型定義
type Talent = {
  id: number
  name: string
  avatar_url: string | null
  created_at?: string
  weekly_topic?: string
}

type Activity = {
  id: number
  talent_id: number
  type: string
  title: string
  status: string
  date: string
  created_at?: string
}

type SnsStats = {
  id: number
  talent_id: number
  platform: string
  followers: number
  growth: number
  week_number: number
  year: number
  created_at?: string
}

type WeeklyGoal = {
  id: number
  talent_id: number
  completed: number
  total: number
  week_number: number
  year: number
  created_at?: string
}

// 環境変数が設定されているか確認する関数
function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
  )
}

// 週番号を取得する関数
function getWeekNumber(d: Date): [number, number] {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return [Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7), date.getUTCFullYear()]
}

// 現在の週番号を取得
function getCurrentWeekNumber(): number {
  return getWeekNumber(new Date())[0]
}

// 現在の年を取得
function getCurrentYear(): number {
  return getWeekNumber(new Date())[1]
}

// モックデータ
const mockTalents: Talent[] = [
  {
    id: 1,
    name: "中塚智",
    avatar_url: null,
    weekly_topic: "新しいドラマの撮影が始まりました！役作りに集中しています。",
  },
  {
    id: 2,
    name: "田中美咲",
    avatar_url: null,
    weekly_topic: "ファッション雑誌の撮影でした。新しいスタイルに挑戦中です。",
  },
  {
    id: 3,
    name: "佐藤健太",
    avatar_url: null,
    weekly_topic: "舞台の稽古が本格化。毎日練習に励んでいます。",
  },
]

const mockActivities: Activity[] = [
  // 中塚智の活動
  { id: 1, talent_id: 1, type: "撮影", title: "ドラマ「青春物語」第1話", status: "完了", date: "2024-01-15", created_at: "2024-01-15T09:00:00Z" },
  { id: 2, talent_id: 1, type: "オーディション", title: "映画「夏の記憶」主演オーディション", status: "合格", date: "2024-01-16", created_at: "2024-01-16T14:00:00Z" },
  { id: 3, talent_id: 1, type: "レッスン", title: "演技レッスン", status: "完了", date: "2024-01-17", created_at: "2024-01-17T16:00:00Z" },
  
  // 田中美咲の活動
  { id: 4, talent_id: 2, type: "撮影", title: "ファッション雑誌「STYLE」", status: "完了", date: "2024-01-15", created_at: "2024-01-15T10:00:00Z" },
  { id: 5, talent_id: 2, type: "イベント", title: "ブランドイベント出演", status: "進行中", date: "2024-01-18", created_at: "2024-01-18T15:00:00Z" },
  
  // 佐藤健太の活動
  { id: 6, talent_id: 3, type: "レッスン", title: "ダンスレッスン", status: "完了", date: "2024-01-16", created_at: "2024-01-16T18:00:00Z" },
  { id: 7, talent_id: 3, type: "オーディション", title: "舞台「春の嵐」オーディション", status: "待機中", date: "2024-01-19", created_at: "2024-01-19T11:00:00Z" },
]

const mockSnsStats: SnsStats[] = [
  // 中塚智
  { id: 1, talent_id: 1, platform: "Instagram", followers: 25000, growth: 500, week_number: 3, year: 2024 },
  { id: 2, talent_id: 1, platform: "TikTok", followers: 15000, growth: 300, week_number: 3, year: 2024 },
  { id: 3, talent_id: 1, platform: "Twitter", followers: 8000, growth: 100, week_number: 3, year: 2024 },
  
  // 田中美咲
  { id: 4, talent_id: 2, platform: "Instagram", followers: 45000, growth: 800, week_number: 3, year: 2024 },
  { id: 5, talent_id: 2, platform: "TikTok", followers: 32000, growth: 600, week_number: 3, year: 2024 },
  { id: 6, talent_id: 2, platform: "Twitter", followers: 12000, growth: 200, week_number: 3, year: 2024 },
  
  // 佐藤健太
  { id: 7, talent_id: 3, platform: "Instagram", followers: 18000, growth: 400, week_number: 3, year: 2024 },
  { id: 8, talent_id: 3, platform: "TikTok", followers: 22000, growth: 700, week_number: 3, year: 2024 },
  { id: 9, talent_id: 3, platform: "Twitter", followers: 6000, growth: 150, week_number: 3, year: 2024 },
]

const mockWeeklyGoals: WeeklyGoal[] = [
  { id: 1, talent_id: 1, completed: 3, total: 4, week_number: 3, year: 2024 },
  { id: 2, talent_id: 2, completed: 2, total: 3, week_number: 3, year: 2024 },
  { id: 3, talent_id: 3, completed: 1, total: 2, week_number: 3, year: 2024 },
]

// Supabaseクライアントを作成する関数
function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// タレント一覧を取得
export async function getTalents(): Promise<Talent[]> {
  try {
    if (!isSupabaseConfigured()) {
      console.log("Using mock data for talents")
      return mockTalents
    }

    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from("talents")
      .select("*")
      .order("name")

    if (error) {
      console.error("Error fetching talents:", error)
      return mockTalents
    }

    return data || mockTalents
  } catch (error) {
    console.error("Error in getTalents:", error)
    return mockTalents
  }
}

// 特定のタレントの活動を取得
export async function getTalentActivities(talentId: number, weekNumber?: number, year?: number): Promise<Activity[]> {
  try {
    if (!isSupabaseConfigured()) {
      console.log("Using mock data for activities")
      return mockActivities.filter(activity => activity.talent_id === talentId)
    }

    const supabase = createSupabaseClient()

    let query = supabase
      .from("activities")
      .select("*")
      .eq("talent_id", talentId)
      .order("date", { ascending: false })

    if (weekNumber && year) {
      query = query.eq("week_number", weekNumber).eq("year", year)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching activities:", error)
      return mockActivities.filter(activity => activity.talent_id === talentId)
    }

    return data || []
  } catch (error) {
    console.error("Error in getTalentActivities:", error)
    return mockActivities.filter(activity => activity.talent_id === talentId)
  }
}

// 特定のタレントのSNS統計を取得
export async function getSnsStats(talentId: number, weekNumber?: number, year?: number): Promise<SnsStats[]> {
  try {
    if (!isSupabaseConfigured()) {
      console.log("Using mock data for SNS stats")
      return mockSnsStats.filter(stat => stat.talent_id === talentId)
    }

    const supabase = createSupabaseClient()

    let query = supabase
      .from("sns_stats")
      .select("*")
      .eq("talent_id", talentId)

    if (weekNumber && year) {
      query = query.eq("week_number", weekNumber).eq("year", year)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching SNS stats:", error)
      return mockSnsStats.filter(stat => stat.talent_id === talentId)
    }

    return data || []
  } catch (error) {
    console.error("Error in getSnsStats:", error)
    return mockSnsStats.filter(stat => stat.talent_id === talentId)
  }
}

// 特定のタレントの週間目標を取得
export async function getWeeklyGoals(talentId: number, weekNumber?: number, year?: number): Promise<WeeklyGoal | null> {
  try {
    if (!isSupabaseConfigured()) {
      console.log("Using mock data for weekly goals")
      return mockWeeklyGoals.find(goal => goal.talent_id === talentId) || null
    }

    const supabase = createSupabaseClient()

    let query = supabase
      .from("weekly_goals")
      .select("*")
      .eq("talent_id", talentId)

    if (weekNumber && year) {
      query = query.eq("week_number", weekNumber).eq("year", year)
    }

    const { data, error } = await query.single()

    if (error) {
      console.error("Error fetching weekly goals:", error)
      return mockWeeklyGoals.find(goal => goal.talent_id === talentId) || null
    }

    return data
  } catch (error) {
    console.error("Error in getWeeklyGoals:", error)
    return mockWeeklyGoals.find(goal => goal.talent_id === talentId) || null
  }
}
