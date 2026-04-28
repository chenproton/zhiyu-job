"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  GraduationCap,
  Clock,
  Target,
  Trophy,
  ChevronRight,
  BookOpen,
  Play,
  CheckCircle2
} from "lucide-react"

// Mock 学习数据
const MOCK_LEARNING_PROGRESS = [
  {
    id: "1",
    positionName: "全栈开发工程师",
    progress: 65,
    completedAbilities: 5,
    totalAbilities: 8,
    lastStudyDate: "2024-01-15",
    totalHours: 24,
  },
  {
    id: "2",
    positionName: "数据分析师",
    progress: 30,
    completedAbilities: 2,
    totalAbilities: 6,
    lastStudyDate: "2024-01-10",
    totalHours: 12,
  },
]

const MOCK_ACHIEVEMENTS = [
  { id: "1", name: "学习先锋", description: "完成第一个能力点学习", icon: "🎯", earned: true },
  { id: "2", name: "持之以恒", description: "连续学习7天", icon: "🔥", earned: true },
  { id: "3", name: "知识达人", description: "完成10个知识类能力点", icon: "📚", earned: false },
  { id: "4", name: "技能大师", description: "获得3个岗位认证", icon: "🏆", earned: false },
]

export default function LearningPage() {
  return (
    <div className="pb-20 md:pb-0">
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">学习进度</h1>
            <p className="mt-2 text-muted-foreground">
              跟踪你的学习进度，查看已获得的成就
            </p>
          </div>

          {/* 统计卡片 */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">学习中岗位</p>
                    <p className="text-2xl font-bold">{MOCK_LEARNING_PROGRESS.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">已掌握能力</p>
                    <p className="text-2xl font-bold">7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">累计学时</p>
                    <p className="text-2xl font-bold">36</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                    <Trophy className="h-6 w-6 text-info" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">获得成就</p>
                    <p className="text-2xl font-bold">
                      {MOCK_ACHIEVEMENTS.filter((a) => a.earned).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 学习中的岗位 */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold">学习中的岗位</h2>
            <div className="mt-4 space-y-4">
              {MOCK_LEARNING_PROGRESS.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">暂无学习记录</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      开始学习一个岗位，你的进度将显示在这里
                    </p>
                    <Link href="/explore" className="mt-4">
                      <Button>探索岗位</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                MOCK_LEARNING_PROGRESS.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="py-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{item.positionName}</h3>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              {item.completedAbilities}/{item.totalAbilities} 能力点
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              已学习 {item.totalHours} 学时
                            </span>
                            <span>
                              上次学习：{new Date(item.lastStudyDate).toLocaleDateString("zh-CN")}
                            </span>
                          </div>
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm">
                              <span>学习进度</span>
                              <span className="font-medium">{item.progress}%</span>
                            </div>
                            <Progress value={item.progress} className="mt-2 h-2" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="gap-2">
                            <Play className="h-4 w-4" />
                            继续学习
                          </Button>
                          <Link href={`/explore/${item.id}`}>
                            <Button variant="ghost" size="icon">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* 成就展示 */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold">我的成就</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {MOCK_ACHIEVEMENTS.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={achievement.earned ? "" : "opacity-50"}
                >
                  <CardContent className="flex flex-col items-center py-6 text-center">
                    <div className="text-4xl">{achievement.icon}</div>
                    <h3 className="mt-3 font-semibold">{achievement.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    {achievement.earned ? (
                      <Badge className="mt-3 bg-success text-success-foreground">
                        已获得
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="mt-3">
                        未解锁
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
