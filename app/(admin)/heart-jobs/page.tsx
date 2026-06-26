"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Heart,
  Search,
  Trophy,
  Medal,
} from "lucide-react"
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
  publishDate?: string
  updateDate?: string
}

const STORAGE_KEY = "zhiyu_heart_jobs"
const SEED_KEY = "zhiyu_heart_jobs_seeded_v3"

const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
]

const SAMPLE_JOBS: Omit<HeartJob, "id" | "coverImage">[] = [
  {
    name: "前端开发工程师",
    code: "JOB-2024-001",
    industry: "互联网/IT",
    major: "软件技术",
    salary: "8K-15K",
    location: "北京",
    description: "负责网站、Web应用、移动端H5页面等用户界面开发，使用HTML、CSS、JavaScript及Vue、React等现代前端框架。",
    isFavorite: true,
    addedAt: "2024-01-12T08:00:00.000Z",
    publishDate: "2024-01-08",
    updateDate: "2024-01-03",
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
    addedAt: "2024-01-13T08:00:00.000Z",
    publishDate: "2024-01-09",
    updateDate: "2024-01-04",
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
    addedAt: "2024-01-14T08:00:00.000Z",
    publishDate: "2024-01-10",
    updateDate: "2024-01-05",
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
    addedAt: "2024-01-15T08:00:00.000Z",
    publishDate: "2024-01-11",
    updateDate: "2024-01-06",
  },
  {
    name: "会计师",
    code: "JOB-2025-0005",
    industry: "金融",
    major: "财务管理",
    salary: "7K-13K",
    location: "广州",
    description: "负责企业财务核算、报表编制、税务申报及成本管理，熟悉会计准则与财务软件操作。",
    isFavorite: true,
    addedAt: "2024-01-19T08:00:00.000Z",
    publishDate: "2024-01-10",
    updateDate: "2024-01-05",
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
    addedAt: "2024-01-16T08:00:00.000Z",
    publishDate: "2024-01-12",
    updateDate: "2024-01-07",
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
    addedAt: "2024-01-17T08:00:00.000Z",
    publishDate: "2024-01-13",
    updateDate: "2024-01-08",
  },
  {
    name: "产品经理",
    code: "JOB-2024-008",
    industry: "互联网/IT",
    major: "产品管理",
    salary: "12K-20K",
    location: "北京",
    description: "负责产品规划、需求分析、原型设计及项目推进，协调设计、开发与运营资源，推动产品迭代落地。",
    isFavorite: true,
    addedAt: "2024-01-20T08:00:00.000Z",
    publishDate: "2024-01-16",
    updateDate: "2024-01-10",
  },
  {
    name: "UI设计师",
    code: "JOB-2024-009",
    industry: "互联网/IT",
    major: "视觉传达",
    salary: "8K-14K",
    location: "上海",
    description: "负责产品界面视觉设计、交互优化及设计规范制定，熟练使用Figma、Sketch、Photoshop等设计工具。",
    isFavorite: true,
    addedAt: "2024-01-21T08:00:00.000Z",
    publishDate: "2024-01-17",
    updateDate: "2024-01-11",
  },
  {
    name: "运维工程师",
    code: "JOB-2024-010",
    industry: "互联网/IT",
    major: "网络工程",
    salary: "9K-16K",
    location: "深圳",
    description: "负责服务器、网络及云资源的日常运维、监控告警、故障排查及自动化脚本编写，保障系统稳定运行。",
    isFavorite: true,
    addedAt: "2024-01-22T08:00:00.000Z",
    publishDate: "2024-01-18",
    updateDate: "2024-01-12",
  },
  {
    name: "人力资源专员",
    code: "JOB-2024-011",
    industry: "人力资源",
    major: "人力资源管理",
    salary: "6K-11K",
    location: "广州",
    description: "负责招聘实施、员工入离职办理、培训组织及人事档案管理，协助完善人力资源制度与流程。",
    isFavorite: true,
    addedAt: "2024-01-23T08:00:00.000Z",
    publishDate: "2024-01-19",
    updateDate: "2024-01-13",
  },
  {
    name: "市场营销专员",
    code: "JOB-2024-012",
    industry: "服务业",
    major: "市场营销",
    salary: "7K-13K",
    location: "成都",
    description: "负责市场调研、推广方案执行、渠道维护及活动效果分析，提升品牌曝光与销售线索转化。",
    isFavorite: true,
    addedAt: "2024-01-24T08:00:00.000Z",
    publishDate: "2024-01-20",
    updateDate: "2024-01-14",
  },
  {
    name: "护士",
    code: "JOB-2024-013",
    industry: "医疗健康",
    major: "护理学",
    salary: "6K-12K",
    location: "武汉",
    description: "负责患者日常护理、医嘱执行、健康宣教及病房管理，具备护理专业资质和良好的沟通能力。",
    isFavorite: true,
    addedAt: "2024-01-25T08:00:00.000Z",
    publishDate: "2024-01-21",
    updateDate: "2024-01-15",
  },
  {
    name: "物流专员",
    code: "JOB-2024-014",
    industry: "物流",
    major: "物流管理",
    salary: "6K-11K",
    location: "杭州",
    description: "负责订单处理、仓储协调、物流跟踪及配送异常处理，优化物流成本与客户体验。",
    isFavorite: true,
    addedAt: "2024-01-26T08:00:00.000Z",
    publishDate: "2024-01-22",
    updateDate: "2024-01-16",
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
    coverImage: COVER_IMAGES[idx % COVER_IMAGES.length],
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

function hashFromId(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = (h << 5) - h + id.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function getCardStats(job: HeartJob) {
  const h = hashFromId(job.id)
  return {
    viewCount: 120 + (h % 880),
    relatedScenes: 1 + (h % 6),
    totalHours: "-",
    version: `v${(1 + (h % 30) / 10).toFixed(1)}`,
    creator: ["张老师", "李老师", "王老师", "陈老师"][h % 4],
  }
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

  const handleToggleFavorite = (job: HeartJob, e: React.MouseEvent) => {
    e.stopPropagation()
    const list = loadHeartJobs().map((j) =>
      j.id === job.id ? { ...j, isFavorite: !j.isFavorite } : j
    )
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
    <div className="space-y-6">
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

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {filteredJobs.map((job, idx) => {
                const stats = getCardStats(job)
                const coverStyle = job.coverImage
                  ? { backgroundImage: `url(${job.coverImage})` }
                  : { background: COVER_BACKUPS[idx % COVER_BACKUPS.length] }

                return (
                  <div
                    key={job.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#e7e5e4] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(69,26,3,0.1)]"
                    onClick={handleCardClick}
                  >
                    <div
                      className="h-[160px] relative p-4 flex flex-col justify-end text-white bg-cover bg-center"
                      style={coverStyle}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(69,26,3,0.85)] via-[rgba(69,26,3,0.2)] to-transparent" />

                      <div className="absolute top-3 left-3 right-3 flex justify-between z-10">
                        <div className="flex gap-1.5">
                          <span className="bg-black/40 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-md">
                            {stats.version}
                          </span>
                          <span className="bg-black/40 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-md">
                            {formatDate(job.addedAt)} 收录
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleToggleFavorite(job, e)}
                            className="flex items-center justify-center bg-black/40 backdrop-blur-sm text-white hover:bg-black/50 p-1.5 rounded-md transition-colors"
                            title={job.isFavorite ? "取消心仪" : "设为心仪"}
                          >
                            <Heart
                              className={cn(
                                "h-3.5 w-3.5",
                                job.isFavorite ? "fill-red-500 text-red-500" : "text-slate-300"
                              )}
                            />
                          </button>
                          <span className="bg-black/40 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-md">
                            已发布
                          </span>
                        </div>
                      </div>

                      <div className="relative z-10">
                        <div className="text-lg font-bold leading-snug mb-1.5">{job.name}</div>
                        <div className="text-xs text-white/90">
                          岗位编码：{job.code} · {formatDate(job.publishDate || job.addedAt)}
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="grid grid-cols-3 gap-2 mb-5">
                        <div className="text-center">
                          <div className="text-[26px] font-extrabold text-[#0f172a] leading-none">{stats.viewCount}</div>
                          <div className="text-sm text-[#94a3b8] mt-1">浏览次数</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[26px] font-extrabold text-[#0f172a] leading-none">{stats.relatedScenes}</div>
                          <div className="text-sm text-[#94a3b8] mt-1">关联场景</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[26px] font-extrabold text-[#0f172a] leading-none">{stats.totalHours}</div>
                          <div className="text-sm text-[#94a3b8] mt-1">场景任务</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4">
                        <span className="text-sm px-2.5 py-1 rounded-md bg-[#ffedd5] text-[#c2410c] truncate whitespace-nowrap">
                          面向行业：{job.industry}
                        </span>
                        <span className="text-sm px-2.5 py-1 rounded-md bg-[#dbeafe] text-[#1d4ed8] truncate whitespace-nowrap">
                          适用专业：{job.major}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        <span className="text-sm text-[#64748b]">创建人：{stats.creator}</span>
                        <span className="text-sm text-[#64748b]">共建人：{job.location || "知与未来"}</span>
                        <span className="text-sm text-[#64748b]">浏览量：{stats.viewCount}</span>
                        <span className="text-sm text-[#64748b]">更新时间：{formatDate(job.updateDate || job.addedAt)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="w-full lg:w-64 shrink-0">
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
    </div>
  )
}
