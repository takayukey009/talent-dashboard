"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Instagram,
  Twitter,
  Camera,
  Mic,
  Users,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { getTalents, getTalentActivities, getSnsStats, getWeeklyGoals } from "@/app/actions"

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

type TalentWithDetails = {
  id: number
  name: string
  avatar_url: string | null
  weekly_topic?: string
  activities: Activity[]
  snsStats: SnsStats[]
  weeklyGoal: WeeklyGoal | null
}

export default function TalentDashboard() {
  const [talents, setTalents] = useState<TalentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  // 現在の週と年を初期値に設定（ハードコード値を使用）
  const [currentWeek, setCurrentWeek] = useState(3)
  const [currentYear, setCurrentYear] = useState(2024)

  // 週番号を取得する関数
  const getWeekNumber = (date: Date): [number, number] => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
    return [weekNo, d.getUTCFullYear()]
  }

  // 現在の週番号を取得
  const getCurrentWeekNumber = (): number => {
    return getWeekNumber(new Date())[0]
  }

  // 現在の年を取得
  const getCurrentYear = (): number => {
    return getWeekNumber(new Date())[1]
  }

  // ステータスに応じた色を返す関数
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "完了":
      case "合格":
        return "bg-green-100 text-green-800 border-green-200"
      case "進行中":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "待機中":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "キャンセル":
      case "不合格":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // 活動タイプに応じたアイコンを返す関数
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "撮影":
        return <Camera className="w-4 h-4" />
      case "レッスン":
        return <Mic className="w-4 h-4" />
      case "オーディション":
        return <Users className="w-4 h-4" />
      case "イベント":
        return <Award className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  // フォロワー数をフォーマットする関数
  const formatFollowers = (count: number): string => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`
    }
    return count.toLocaleString()
  }

  // 成長率表示コンポーネント
  const GrowthIndicator = ({ growth }: { growth: number }) => {
    if (growth > 0) {
      return (
        <div className="flex items-center text-green-600 text-xs">
          <TrendingUp className="w-3 h-3 mr-1" />
          +{growth}
        </div>
      )
    } else if (growth < 0) {
      return (
        <div className="flex items-center text-red-600 text-xs">
          <TrendingDown className="w-3 h-3 mr-1" />
          {growth}
        </div>
      )
    } else {
      return (
        <div className="flex items-center text-gray-500 text-xs">
          <Minus className="w-3 h-3 mr-1" />
          0
        </div>
      )
    }
  }

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const talentsData = await getTalents()

        // 各タレントの詳細データを取得
        const talentDetails = await Promise.all(
          talentsData.map(async (talent) => {
            try {
              const [activities, snsStats, weeklyGoal] = await Promise.all([
                getTalentActivities(talent.id, currentWeek, currentYear),
                getSnsStats(talent.id, currentWeek, currentYear),
                getWeeklyGoals(talent.id, currentWeek, currentYear)
              ])

              return {
                ...talent,
                activities,
                snsStats,
                weeklyGoal
              }
            } catch (talentError) {
              console.error(`タレントID ${talent.id} のデータ取得に失敗:`, talentError)
              // エラー時にも基本データは返す
              return {
                ...talent,
                activities: [],
                snsStats: [],
                weeklyGoal: null
              }
            }
          })
        )

        setTalents(talentDetails)
      } catch (error) {
        console.error('タレントデータの取得に失敗しました:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentWeek, currentYear])

  // 週の変更
  const changeWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentWeek === 1) {
        setCurrentWeek(52)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentWeek(currentWeek - 1)
      }
    } else {
      if (currentWeek === 52) {
        setCurrentWeek(1)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentWeek(currentWeek + 1)
      }
    }
  }

  // 現在の週に戻る
  const goToCurrentWeek = () => {
    setCurrentWeek(getCurrentWeekNumber())
    setCurrentYear(getCurrentYear())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            タレント週次ダッシュボード
          </h1>
          <p className="text-gray-600">週次活動状況とSNS成長の管理</p>
        </div>

        {/* 週選択 */}
        <div className="flex items-center justify-center mb-8 space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changeWeek('prev')}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>前週</span>
          </Button>
          
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">
              {currentYear}年 第{currentWeek}週
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => changeWeek('next')}
            className="flex items-center space-x-2"
          >
            <span>次週</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={goToCurrentWeek}
            className="ml-4"
          >
            今週
          </Button>
        </div>

        {/* タレントカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map((talent) => (
            <Card key={talent.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                    <AvatarImage src={talent.avatar_url || undefined} alt={talent.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                      {talent.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900">{talent.name}</CardTitle>
                    <div className="flex items-center mt-2">
                      <div className="text-sm text-gray-600">
                        目標達成率: {talent.weeklyGoal && talent.weeklyGoal.total > 0 
                          ? Math.round((talent.weeklyGoal.completed / talent.weeklyGoal.total) * 100)
                          : 0}%
                      </div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${talent.weeklyGoal && talent.weeklyGoal.total > 0 
                              ? (talent.weeklyGoal.completed / talent.weeklyGoal.total) * 100 
                              : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                {talent.weekly_topic && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {talent.weekly_topic}
                    </p>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* 最近の活動 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    最近の活動
                  </h3>
                  <div className="space-y-2">
                    {talent.activities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="text-blue-600">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {activity.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {activity.type} • {new Date(activity.date).toLocaleDateString('ja-JP')}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(activity.status)}`}
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                    {talent.activities.length > 3 && (
                      <div className="text-center">
                        <span className="text-sm text-gray-500">
                          他 {talent.activities.length - 3} 件の活動
                        </span>
                      </div>
                    )}
                    {talent.activities.length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        今週の活動はありません
                      </div>
                    )}
                  </div>
                </div>

                {/* SNS統計 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    SNS フォロワー数
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border border-pink-100">
                      <Instagram className="w-5 h-5 text-pink-600 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-gray-900">
                        {formatFollowers(talent.snsStats.find(s => s.platform === "Instagram")?.followers || 0)}
                      </div>
                      <GrowthIndicator growth={talent.snsStats.find(s => s.platform === "Instagram")?.growth || 0} />
                    </div>
                    
                    <div className="text-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                      <div className="w-5 h-5 mx-auto mb-1 text-xs font-bold text-gray-700 flex items-center justify-center">
                        TT
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatFollowers(talent.snsStats.find(s => s.platform === "TikTok")?.followers || 0)}
                      </div>
                      <GrowthIndicator growth={talent.snsStats.find(s => s.platform === "TikTok")?.growth || 0} />
                    </div>
                    
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg border border-blue-100">
                      <Twitter className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-gray-900">
                        {formatFollowers(talent.snsStats.find(s => s.platform === "Twitter")?.followers || 0)}
                      </div>
                      <GrowthIndicator growth={talent.snsStats.find(s => s.platform === "Twitter")?.growth || 0} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {talents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              タレントデータが見つかりません
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
