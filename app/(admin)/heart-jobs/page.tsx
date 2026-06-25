"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Building2,
  Calendar,
  GraduationCap,
  Heart,
  MapPin,
  Search,
  Trash2,
  TrendingUp,
  Trophy,
  Medal,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface HeartJob {
  id: string
  name: string
  code: string
  industry: string
  major: string
  salary: string
  location?: string
  description: string
  coverImage?: string
  isFavorite: boolean
  addedAt: string
}

const STORAGE_KEY = "zhiyu_heart_jobs"
const SEED_KEY = "zhiyu_heart_jobs_seeded"

const SAMPLE_JOBS: Omit<HeartJob, "id" | "addedAt">[] = [
  {
    name: "前端开发工程师",
    code: "JOB-2024-001",
    industry: "互联网/IT",
    major: "软件技术",
    salary: "8K-15K",
    location: "北京",
    description: "负责网站、Web应用、移动端H5页面等用户界面开发，使用HTML、CSS、JavaScript及Vue、React等现代前端框架。",
    isFavorite: true,
  },
  {
    name: "Java开发",
    code: "JOB-2024-002",
    industry: "互联网/IT",
    major: "信息技术",
    salary: "10K-18K",
    location: "上海",
    description: "使用Java语言进行企业级后端系统开发，熟悉Spring Boot、微服务架构及数据库设计。",
    isFavorite: true,
  },
  {
    name: "数据分析师",
    code: "JOB-2024-003",
    industry: "互联网/IT",
    major: "数据科学",
    salary: "9K-16K",
    location: "深圳",
    description: "通过数据采集、清洗、分析与可视化，为业务决策提供数据支持，掌握Python、SQL及BI工具。",
    isFavorite: true,
  },
  {
    name: "电商运营专员",
    code: "JOB-2024-004",
    industry: "电子商务",
    major: "电子商务",
    salary: "6K-12K",
    location: "杭州",
    description: "负责电商平台店铺日常运营、活动策划、流量推广及销售数据分析，提升店铺转化率。",
    isFavorite: true,
  },
  {
    name: "会计师",
    code: "JOB-2024-005",
    industry: "金融",
    major: "财务管理",
    salary: "7K-13K",
    location: "广州",
    description: "负责企业财务核算、报表编制、税务申报及成本管理，熟悉会计准则与财务软件操作。",
    isFavorite: true,
  },
  {
    name: "品牌经理",
    code: "JOB-2024-006",
    industry: "服务业",
    major: "市场营销",
    salary: "8K-15K",
    location: "成都",
    description: "负责品牌定位、传播策略制定、市场推广活动策划及品牌形象维护，提升品牌影响力。",
    isFavorite: true,
  },
  {
    name: "小学教师",
    code: "JOB-2024-007",
    industry: "教育",
    major: "小学教育",
    salary: "5K-10K",
    location: "武汉",
    description: "负责小学阶段学科教学、班级管理及学生综合素质培养，具备良好的沟通能力与教学热情。",
    isFavorite: true,
  },
]

const COVER_BACKUPS = [
  "linear-gradient(135deg,#1e3a8a,#3b82f6)",
  "linear-gradient(135deg,#7c2d12,#dc2626)",
  "linear-gradient(135deg,#064e3b,#0891b2)",
  "linear-gradient(135deg,#334155,#64748b)",
  "linear-gradient(135deg,#581c87,#a855f7)",
  "linear-gradient(135deg,#be123c,#f43f5e)",
  "linear-gradient(135deg,#0f766e,#14b8a6)",
]

function loadHeartJobs(): HeartJob[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  } catch {
    return []
  }
}

function saveHeartJobs(jobs: HeartJob[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}

function seedSampleJobs() {
  if (typeof window === "undefined") return
  if (localStorage.getItem(SEED_KEY)) return
  const list: HeartJob[] = SAMPLE_JOBS.map((j, idx) => ({
    ...j,
    id: `heart_job_sample_${idx}`,
    addedAt: new Date(Date.now() - idx * 86400000).toISOString(),
  }))
  saveHeartJobs(list)
  localStorage.setItem(SEED_KEY, "1")
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`
}

export default function HeartJobsPage() {
  const [jobs, setJobs] = useState<HeartJob[]>([])
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeIndustry, setActiveIndustry] = useState("全部")

  useEffect(() => {
    setMounted(true)
    seedSampleJobs()
    setJobs(loadHeartJobs())
  }, [])

  const industries = useMemo(() => {
    const set = new Set(jobs.map((j) => j.industry).filter(Boolean))
    return ["全部", ...Array.from(set)]
  }, [jobs])

  const filteredJobs = useMemo(() => {
    let result = [...jobs]
    if (activeIndustry !== "全部") {
      result = result.filter((j) => j.industry === activeIndustry)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (j) =>
          j.name.toLowerCase().includes(q) ||
          j.code.toLowerCase().includes(q) ||
          j.industry.toLowerCase().includes(q) ||
          j.major.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      )
    }
    return result
  }, [jobs, activeIndustry, searchQuery])

  const stats = useMemo(() => {
    const total = jobs.length
    const favoriteCount = jobs.filter((j) => j.isFavorite).length
    const industryCount = new Set(jobs.map((j) => j.industry)).size
    return { total, favoriteCount, industryCount }
  }, [jobs])

  const rankJobs = useMemo(() => {
    const parseMaxSalary = (salary: string) => {
      const match = salary.match(/(\d+(?:\.\d+)?)K/)
      return match ? parseFloat(match[1]) : 0
    }
    return [...jobs]
      .sort((a, b) => parseMaxSalary(b.salary) - parseMaxSalary(a.salary))
      .slice(0, 5)
  }, [jobs])

  const handleToggleFavorite = (job: HeartJob) => {
    const list = loadHeartJobs().map((j) =>
      j.id === job.id ? { ...j, isFavorite: !j.isFavorite } : j
    )
    saveHeartJobs(list)
    setJobs(list)
  }

  const handleRemove = (id: string) => {
    const list = loadHeartJobs().filter((j) => j.id !== id)
    saveHeartJobs(list)
    setJobs(list)
  }

  const handleCardClick = () => {
    window.location.href = "/student.html"
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">我的心仪岗位</h1>
            <p className="text-sm text-muted-foreground mt-1">管理学生端收藏的心仪岗位</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">我的心仪岗位</h1>
            <p className="text-sm text-muted-foreground mt-1">管理学生端收藏的心仪岗位，支持按行业筛选与搜索</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="搜索岗位名称、编码、行业或专业..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setActiveIndustry(industry)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    activeIndustry === industry
                      ? "bg-primary text-primary-foreground"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {industry}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            共 <span className="font-semibold text-foreground">{filteredJobs.length}</span> 个岗位
          </p>
        </div>

        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Heart className="h-16 w-16 mb-4 text-red-100" />
              <p className="text-base font-medium">暂无心仪岗位</p>
              <p className="text-sm mt-1">在岗位详情页点击“设为心仪岗位”即可添加</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job, idx) => (
              <Card
                key={job.id}
                className="group overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                onClick={handleCardClick}
              >
                <div
                  className="h-36 relative p-4 flex flex-col justify-end text-white"
                  style={{
                    background: job.coverImage || COVER_BACKUPS[idx % COVER_BACKUPS.length],
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-lg leading-tight">{job.name}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleFavorite(job)
                        }}
                        className={cn(
                          "p-1.5 rounded-full transition-colors",
                          job.isFavorite
                            ? "text-red-400 hover:text-red-300"
                            : "text-white/60 hover:text-white"
                        )}
                        title={job.isFavorite ? "取消收藏" : "收藏"}
                      >
                        <Heart
                          className="h-5 w-5"
                          fill={job.isFavorite ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-white/80 mt-1">{job.code}</p>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-orange-50 text-orange-600 text-sm px-2.5 py-0.5">
                      <Building2 className="mr-1.5 h-4 w-4" />
                      {job.industry}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-sm px-2.5 py-0.5">
                      <GraduationCap className="mr-1.5 h-4 w-4" />
                      {job.major}
                    </Badge>
                  </div>

                  <p className="text-base text-slate-600 line-clamp-2 leading-relaxed">{job.description}</p>

                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {job.location || '-'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatDate(job.addedAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-red-600 font-bold text-base">
                      <TrendingUp className="h-5 w-5" />
                      {job.salary}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-sm text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(job.id)
                      }}
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" />
                      移除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              心仪岗位排行
            </CardTitle>
            <CardDescription>按薪资上限排序 TOP5</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {rankJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">暂无数据</p>
            ) : (
              rankJobs.map((job, idx) => (
                <div key={job.id} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      idx === 0
                        ? "bg-amber-100 text-amber-600"
                        : idx === 1
                        ? "bg-slate-200 text-slate-700"
                        : idx === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {idx < 3 ? <Medal className="h-4 w-4" /> : idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{job.name}</p>
                    <p className="text-xs text-slate-500">{job.industry}</p>
                  </div>
                  <div className="text-sm font-semibold text-red-600 whitespace-nowrap">{job.salary}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
