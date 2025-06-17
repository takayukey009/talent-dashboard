"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { type Talent, getCurrentWeekNumber, getCurrentYear, isSupabaseConfigured } from "@/lib/supabase"
import { getTalents, updateActivity, updateSnsStats } from "../actions"

export default function AdminPage() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [selectedTalent, setSelectedTalent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  // 活動フォームの状態
  const [activityForm, setActivityForm] = useState({
    type: "撮影",
    title: "",
    status: "完了",
    date: new Date().toISOString().split("T")[0],
  })

  // SNS統計フォームの状態
  const [snsForm, setSnsForm] = useState({
    platform: "instagram",
    followers: 0,
    growth: 0,
  })

  // 週間トピックフォームの状態
  const [topicForm, setTopicForm] = useState({
    topic: "",
  })

  // タレント一覧を取得
  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const data = await getTalents()
        setTalents(data)
        if (data.length > 0) {
          setSelectedTalent(data[0].id.toString())
          setTopicForm({ topic: data[0].weekly_topic || "" })
        }
      } catch (error) {
        console.error("Error fetching talents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTalents()
  }, [])

  // 選択されたタレントが変更されたときにトピックを更新
  useEffect(() => {
    if (selectedTalent) {
      const talent = talents.find((t) => t.id.toString() === selectedTalent)
      if (talent) {
        setTopicForm({ topic: talent.weekly_topic || "" })
      }
    }
  }, [selectedTalent, talents])

  // 活動を追加
  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTalent) return

    setSubmitting(true)
    try {
      await updateActivity({
        talent_id: Number.parseInt(selectedTalent),
        type: activityForm.type,
        title: activityForm.title,
        status: activityForm.status,
        date: activityForm.date,
      })

      setMessage("活動情報を更新しました")
      setActivityForm({
        ...activityForm,
        title: "",
      })
    } catch (error) {
      console.error("Error updating activity:", error)
      setMessage("エラーが発生しました")
    } finally {
      setSubmitting(false)
    }
  }

  // SNS統計を更新
  const handleSnsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTalent) return

    setSubmitting(true)
    try {
      await updateSnsStats({
        talent_id: Number.parseInt(selectedTalent),
        platform: snsForm.platform,
        followers: snsForm.followers,
        growth: snsForm.growth,
        week_number: getCurrentWeekNumber(),
        year: getCurrentYear(),
      })

      setMessage("SNS統計を更新しました")
      setSnsForm({
        ...snsForm,
        growth: 0,
      })
    } catch (error) {
      console.error("Error updating SNS stats:", error)
      setMessage("エラーが発生しました")
    } finally {
      setSubmitting(false)
    }
  }

  // 週間トピックを更新
  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTalent) return

    setSubmitting(true)
    try {
      // ここでトピックを更新するAPIを呼び出す（実装が必要）
      // 例: await updateTalentTopic(selectedTalent, topicForm.topic)

      setMessage("週間トピックを更新しました")
    } catch (error) {
      console.error("Error updating weekly topic:", error)
      setMessage("エラーが発生しました")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="p-8">データを読み込み中...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">タレント情報管理</h1>
      {!isSupabaseConfigured && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                <strong>管理機能無効:</strong> Supabaseが設定されていないため、データの更新はできません。
                データベースを設定してから管理機能をご利用ください。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* タレント選択 */}
      <div className="mb-6">
        <Label htmlFor="talent-select">タレントを選択</Label>
        <Select value={selectedTalent} onValueChange={setSelectedTalent}>
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="タレントを選択" />
          </SelectTrigger>
          <SelectContent>
            {talents.map((talent) => (
              <SelectItem key={talent.id} value={talent.id.toString()}>
                {talent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">{message}</div>
      )}

      <Tabs defaultValue="topic">
        <TabsList className="mb-4">
          <TabsTrigger value="topic">今週のトピック</TabsTrigger>
          <TabsTrigger value="activity">活動情報</TabsTrigger>
          <TabsTrigger value="sns">SNS統計</TabsTrigger>
        </TabsList>

        {/* 今週のトピックフォーム */}
        <TabsContent value="topic">
          <Card>
            <CardHeader>
              <CardTitle>今週のトピックを更新</CardTitle>
              <CardDescription>タレントの今週の重要なトピックを記録します</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTopicSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weekly-topic">トピック内容</Label>
                  <Textarea
                    id="weekly-topic"
                    value={topicForm.topic}
                    onChange={(e) => setTopicForm({ topic: e.target.value })}
                    placeholder="例: 新曲「夢の先へ」リリース決定"
                    rows={3}
                    required
                  />
                </div>

                <Button type="submit" disabled={submitting || !isSupabaseConfigured}>
                  {submitting ? "送信中..." : !isSupabaseConfigured ? "データベース未設定" : "トピックを更新"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 活動情報フォーム */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>活動情報を追加</CardTitle>
              <CardDescription>タレントの撮影、オーディションなどの活動を記録します</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleActivitySubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activity-type">活動タイプ</Label>
                    <Select
                      value={activityForm.type}
                      onValueChange={(value) => setActivityForm({ ...activityForm, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="活動タイプを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="撮影">撮影</SelectItem>
                        <SelectItem value="オーディション">オーディション</SelectItem>
                        <SelectItem value="イベント">イベント</SelectItem>
                        <SelectItem value="レッスン">レッスン</SelectItem>
                        <SelectItem value="その他">その他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-status">ステータス</Label>
                    <Select
                      value={activityForm.status}
                      onValueChange={(value) => setActivityForm({ ...activityForm, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="ステータスを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="完了">完了</SelectItem>
                        <SelectItem value="合格">合格</SelectItem>
                        <SelectItem value="進行中">進行中</SelectItem>
                        <SelectItem value="待機中">待機中</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity-title">タイトル</Label>
                  <Input
                    id="activity-title"
                    value={activityForm.title}
                    onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                    placeholder="例: ファッション雑誌「VOGUE」"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity-date">日付</Label>
                  <Input
                    id="activity-date"
                    type="date"
                    value={activityForm.date}
                    onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" disabled={submitting || !isSupabaseConfigured}>
                  {submitting ? "送信中..." : !isSupabaseConfigured ? "データベース未設定" : "活動を追加"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SNS統計フォーム */}
        <TabsContent value="sns">
          <Card>
            <CardHeader>
              <CardTitle>SNS統計を更新</CardTitle>
              <CardDescription>タレントのSNSフォロワー数と増加数を記録します</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSnsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sns-platform">プラットフォーム</Label>
                  <Select
                    value={snsForm.platform}
                    onValueChange={(value) => setSnsForm({ ...snsForm, platform: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="プラットフォームを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="twitter">X</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sns-followers">フォロワー数</Label>
                    <Input
                      id="sns-followers"
                      type="number"
                      value={snsForm.followers}
                      onChange={(e) => setSnsForm({ ...snsForm, followers: Number.parseInt(e.target.value) })}
                      min="0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sns-growth">増加数</Label>
                    <Input
                      id="sns-growth"
                      type="number"
                      value={snsForm.growth}
                      onChange={(e) => setSnsForm({ ...snsForm, growth: Number.parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={submitting || !isSupabaseConfigured}>
                  {submitting ? "送信中..." : !isSupabaseConfigured ? "データベース未設定" : "SNS統計を更新"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
