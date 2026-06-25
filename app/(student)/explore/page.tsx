"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useData } from "@/lib/stores/data-context"
import type { Position } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Briefcase,
  MapPin,
  Clock,
  Star,
  Heart,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Building2,
  GraduationCap
} from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"

const INDUSTRIES = [
  { value: "all", label: "全部行业" },
  { value: "it", label: "信息技术" },
  { value: "finance", label: "金融服务" },
  { value: "healthcare", label: "医疗健康" },
  { value: "education", label: "教育培训" },
  { value: "manufacturing", label: "智能制造" },
]

const SORT_OPTIONS = [
  { value: "recommended", label: "推荐排序" },
  { value: "newest", label: "最新发布" },
  { value: "popular", label: "热门优先" },
  { value: "abilities", label: "能力点数量" },
]

export default function ExplorePage() {
  const { positions, favorites, toggleFavorite, recommendations, batches } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [sortBy, setSortBy] = useState("recommended")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedMajor, setSelectedMajor] = useState<string>("")

  // 专业选项
  const majorOptions = useMemo(() => {
    const set = new Set<string>()
    batches.forEach((b) => set.add(b.major))
    positions.forEach((p) => p.majors.forEach((m) => set.add(m)))
    return Array.from(set).sort()
  }, [batches, positions])

  const currentMajor = selectedMajor || majorOptions[0] || ""

  // 只显示已发布的岗位
  const publishedPositions = positions.filter((p) => p.status === "published")

  // 当前专业推荐配置
  const majorRecommendations = useMemo(() => {
    return recommendations
      .filter((rec) => rec.major === currentMajor)
      .sort((a, b) => a.order - b.order)
  }, [recommendations, currentMajor])

  // 热门推荐：优先使用老师配置的推荐顺序，不足时按默认补全
  const featuredPositions = useMemo(() => {
    const recommended = majorRecommendations
      .map((rec) => positions.find((p) => p.id === rec.positionId))
      .filter((p): p is Position => !!p && p.status === "published")
    const remaining = publishedPositions.filter((p) => !recommended.some((r) => r.id === p.id))
    return [...recommended, ...remaining].slice(0, 4)
  }, [majorRecommendations, positions, publishedPositions])

  // 推荐排序权重映射
  const recommendationOrderMap = useMemo(() => {
    const map = new Map<string, number>()
    majorRecommendations.forEach((rec, index) => {
      map.set(rec.positionId, index)
    })
    return map
  }, [majorRecommendations])

  // 过滤和排序
  const filteredPositions = publishedPositions
    .filter((position) => {
      const matchesSearch =
        position.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        position.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        position.industry?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesIndustry =
        selectedIndustry === "all" || position.industry === selectedIndustry
      return matchesSearch && matchesIndustry
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === "abilities") {
        return (b.abilityModel?.nodes.length || 0) - (a.abilityModel?.nodes.length || 0)
      }
      if (sortBy === "popular") {
        return (b.favoriteCount || 0) - (a.favoriteCount || 0)
      }
      // 默认推荐排序：优先按老师配置顺序，其次按收藏数
      const orderA = recommendationOrderMap.get(a.id) ?? Infinity
      const orderB = recommendationOrderMap.get(b.id) ?? Infinity
      if (orderA !== orderB) {
        return orderA - orderB
      }
      return (b.favoriteCount || 0) - (a.favoriteCount || 0)
    })

  const isFavorite = (positionId: string) => favorites.includes(positionId)

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero 区域 */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-background py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              探索职业岗位
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              浏览各行业热门岗位，了解岗位所需能力，规划你的职业发展路径
            </p>
          </div>

          {/* 搜索栏 */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索岗位名称、行业或关键词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-12 text-base"
                />
              </div>
              <Button size="lg" className="h-12 px-6">
                <Search className="mr-2 h-5 w-5" />
                搜索
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">热门搜索：</span>
              {["全栈工程师", "数据分析师", "产品经理", "UI设计师"].map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 推荐岗位 */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">为你推荐</h2>
              <Select value={currentMajor} onValueChange={setSelectedMajor}>
                <SelectTrigger className="w-44 h-8 text-xs border-dashed">
                  <GraduationCap className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {majorOptions.map((major) => (
                    <SelectItem key={major} value={major}>
                      {major}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" className="gap-1">
              查看更多 <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {featuredPositions.map((position) => (
              <Card key={position.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative h-32 bg-gradient-to-br from-primary/20 to-primary/5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Briefcase className="h-12 w-12 text-primary/30" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 bg-background/80 backdrop-blur"
                    onClick={() => toggleFavorite(position.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isFavorite(position.id)
                          ? "fill-destructive text-destructive"
                          : ""
                      }`}
                    />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold group-hover:text-primary">
                        {position.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {position.description || "暂无描述"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {position.abilityModel?.nodes.slice(0, 3).map((ability) => (
                      <Badge key={ability.id} variant="outline" className="text-xs">
                        {ability.name}
                      </Badge>
                    ))}
                    {(position.abilityModel?.nodes.length || 0) > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(position.abilityModel?.nodes.length || 0) - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t px-4 py-3">
                  <Link href={`/explore/${position.id}`} className="w-full">
                    <Button variant="ghost" size="sm" className="w-full">
                      查看详情
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 岗位列表 */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          {/* 过滤和排序 */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="行业" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="排序" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                共 {filteredPositions.length} 个岗位
              </span>
              <div className="flex rounded-lg border">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 岗位卡片 */}
          {filteredPositions.length === 0 ? (
            <div className="mt-12 flex flex-col items-center justify-center py-12">
              <Briefcase className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">暂无匹配的岗位</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                尝试调整搜索条件或清除筛选
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedIndustry("all")
                }}
              >
                清除筛选
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPositions.map((position) => (
                <Card key={position.id} className="group transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary">
                            {position.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {position.industry || "综合行业"}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(position.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isFavorite(position.id)
                              ? "fill-destructive text-destructive"
                              : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {position.description || "暂无描述"}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {position.abilityModel?.nodes.length || 0} 个能力点
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {position.estimatedHours || 40} 学时
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {position.abilityModel?.nodes.slice(0, 4).map((ability) => (
                        <Badge key={ability.id} variant="secondary" className="text-xs">
                          {ability.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <Link href={`/explore/${position.id}`} className="w-full">
                      <Button className="w-full">查看详情</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredPositions.map((position) => (
                <Card key={position.id} className="transition-shadow hover:shadow-lg">
                  <CardContent className="flex items-center gap-6 py-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{position.name}</h3>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                            {position.description || "暂无描述"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(position.id)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isFavorite(position.id)
                                ? "fill-destructive text-destructive"
                                : ""
                            }`}
                          />
                        </Button>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {position.industry || "综合行业"}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          {position.abilityModel?.nodes.length || 0} 个能力点
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {position.estimatedHours || 40} 学时
                        </span>
                      </div>
                    </div>
                    <Link href={`/explore/${position.id}`}>
                      <Button>查看详情</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
