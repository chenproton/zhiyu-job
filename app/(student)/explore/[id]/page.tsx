"use client"

import { use, useState, useCallback, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useData } from "@/lib/stores/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  ArrowLeft,
  Briefcase,
  Building2,
  Clock,
  Heart,
  Share2,
  BookOpen,
  Video,
  FileText,
  Link as LinkIcon,
  Brain,
  Lightbulb,
  CheckCircle2,
  Target,
  GraduationCap,
  Play,
  ChevronRight
} from "lucide-react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  MarkerType,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

const ABILITY_COLORS = {
  skill: "#3b82f6",
  knowledge: "#f59e0b",
  quality: "#ec4899",
}

const RESOURCE_ICONS = {
  course: BookOpen,
  video: Video,
  document: FileText,
  link: LinkIcon,
}

export default function PositionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { positions, favorites, toggleFavorite } = useData()
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null)

  const position = positions.find((p) => p.id === id)
  const isFavorite = favorites.includes(id)

  // 构建 React Flow 节点和边
  const initialNodes = useMemo<Node[]>(() => {
    if (!position?.abilityModel?.nodes) return []
    
    return position.abilityModel.nodes.map((ability, index) => ({
      id: ability.id,
      type: "default",
      position: ability.position || { 
        x: 150 + (index % 3) * 200, 
        y: 100 + Math.floor(index / 3) * 120 
      },
      data: {
        label: (
          <div className="flex flex-col items-center gap-1 p-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: ABILITY_COLORS[ability.type] || "#6b7280" }}
            />
            <span className="text-xs font-medium">{ability.name}</span>
          </div>
        ),
      },
      style: {
        background: selectedAbility === ability.id ? "#eff6ff" : "#ffffff",
        border: `2px solid ${selectedAbility === ability.id ? "#3b82f6" : "#e5e7eb"}`,
        borderRadius: "8px",
        padding: "4px",
        cursor: "pointer",
      },
    }))
  }, [position?.abilityModel?.nodes, selectedAbility])

  const initialEdges = useMemo<Edge[]>(() => {
    if (!position?.abilityModel?.edges) return []
    
    return position.abilityModel.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "smoothstep",
      animated: true,
      style: { stroke: "#94a3b8", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#94a3b8",
      },
    }))
  }, [position?.abilityModel?.edges])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedAbility(selectedAbility === node.id ? null : node.id)
  }, [selectedAbility])

  if (!position) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <Briefcase className="h-16 w-16 text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold">岗位不存在</h2>
        <p className="mt-2 text-muted-foreground">该岗位可能已被删除或暂未发布</p>
        <Button className="mt-6" onClick={() => router.push("/explore")}>
          返回岗位列表
        </Button>
      </div>
    )
  }

  const selectedAbilityData = position.abilityModel?.nodes.find(
    (a) => a.id === selectedAbility
  )

  const totalResources = position.abilityModel?.nodes.reduce(
    (sum, a) => sum + (a.resources?.length || 0),
    0
  ) || 0

  return (
    <div className="pb-20 md:pb-0">
      {/* 顶部导航 */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
        </div>
      </div>

      {/* 岗位信息头部 */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-background py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <Briefcase className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">{position.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-muted-foreground">
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
                    预计 {position.estimatedHours || 40} 学时
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {totalResources} 个学习资源
                  </span>
                </div>
                <p className="mt-4 max-w-2xl text-muted-foreground">
                  {position.description || "暂无岗位描述"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleFavorite(position.id)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite ? "fill-destructive text-destructive" : ""
                  }`}
                />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button size="lg" className="gap-2">
                <Play className="h-5 w-5" />
                开始学习
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 主内容区 */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          <Tabs defaultValue="abilities" className="space-y-6">
            <TabsList>
              <TabsTrigger value="abilities" className="gap-2">
                <Brain className="h-4 w-4" />
                能力图谱
              </TabsTrigger>
              <TabsTrigger value="resources" className="gap-2">
                <BookOpen className="h-4 w-4" />
                学习资源
              </TabsTrigger>
              <TabsTrigger value="requirements" className="gap-2">
                <Target className="h-4 w-4" />
                达标要求
              </TabsTrigger>
            </TabsList>

            {/* 能力图谱 Tab */}
            <TabsContent value="abilities" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* 图谱可视化 */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>能力关系图谱</CardTitle>
                    <CardDescription>
                      点击节点查看能力详情，拖拽可移动视图
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] rounded-lg border bg-muted/30">
                      {nodes.length > 0 ? (
                        <ReactFlow
                          nodes={nodes}
                          edges={edges}
                          onNodesChange={onNodesChange}
                          onEdgesChange={onEdgesChange}
                          onNodeClick={handleNodeClick}
                          fitView
                          attributionPosition="bottom-left"
                        >
                          <Background />
                          <Controls />
                          <MiniMap />
                        </ReactFlow>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <p className="text-muted-foreground">暂无能力图谱数据</p>
                        </div>
                      )}
                    </div>
                    {/* 图例 */}
                    <div className="mt-4 flex items-center justify-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                        <span className="text-sm text-muted-foreground">技能</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500" />
                        <span className="text-sm text-muted-foreground">知识</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-pink-500" />
                        <span className="text-sm text-muted-foreground">素养</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 能力详情 */}
                <Card>
                  <CardHeader>
                    <CardTitle>能力详情</CardTitle>
                    <CardDescription>
                      {selectedAbilityData
                        ? `查看「${selectedAbilityData.name}」的详细信息`
                        : "点击图谱中的节点查看详情"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedAbilityData ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">{selectedAbilityData.name}</h4>
                          <Badge variant="outline" className="mt-1">
                            {selectedAbilityData.type === "skill"
                              ? "技能"
                              : selectedAbilityData.type === "knowledge"
                              ? "知识"
                              : "素养"}
                          </Badge>
                        </div>
                        {selectedAbilityData.description && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {selectedAbilityData.description}
                            </p>
                          </div>
                        )}
                        {selectedAbilityData.requiredLevel && (
                          <div>
                            <p className="text-sm font-medium">达标等级</p>
                            <Badge className="mt-1">
                              {selectedAbilityData.requiredLevel === "beginner"
                                ? "初级"
                                : selectedAbilityData.requiredLevel === "intermediate"
                                ? "中级"
                                : selectedAbilityData.requiredLevel === "advanced"
                                ? "高级"
                                : "专家"}
                            </Badge>
                          </div>
                        )}
                        {selectedAbilityData.resources &&
                          selectedAbilityData.resources.length > 0 && (
                            <div>
                              <p className="text-sm font-medium">学习资源</p>
                              <div className="mt-2 space-y-2">
                                {selectedAbilityData.resources.slice(0, 3).map((res) => {
                                  const Icon =
                                    RESOURCE_ICONS[res.type as keyof typeof RESOURCE_ICONS] ||
                                    FileText
                                  return (
                                    <div
                                      key={res.id}
                                      className="flex items-center gap-2 rounded-lg bg-muted p-2"
                                    >
                                      <Icon className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm">{res.title}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Brain className="h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-sm text-muted-foreground">
                          点击左侧图谱中的能力节点
                          <br />
                          查看详细信息
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 能力列表 */}
              <Card>
                <CardHeader>
                  <CardTitle>全部能力点</CardTitle>
                  <CardDescription>
                    该岗位共包含 {position.abilityModel?.nodes.length || 0} 个能力要求
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {position.abilityModel?.nodes.map((ability) => (
                      <div
                        key={ability.id}
                        className={`cursor-pointer rounded-lg border p-4 transition-colors hover:border-primary ${
                          selectedAbility === ability.id ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => setSelectedAbility(ability.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="mt-1 h-3 w-3 shrink-0 rounded-full"
                            style={{
                              backgroundColor: ABILITY_COLORS[ability.type] || "#6b7280",
                            }}
                          />
                          <div>
                            <h4 className="font-medium">{ability.name}</h4>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                              {ability.description || "暂无描述"}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {ability.type === "skill"
                                  ? "技能"
                                  : ability.type === "knowledge"
                                  ? "知识"
                                  : "素养"}
                              </Badge>
                              {ability.resources && ability.resources.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  {ability.resources.length} 个资源
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 学习资源 Tab */}
            <TabsContent value="resources" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>学习资源</CardTitle>
                  <CardDescription>
                    按能力点组织的学习材料，帮助你系统掌握岗位技能
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {position.abilityModel?.nodes.some((a) => a.resources && a.resources.length > 0) ? (
                    <Accordion type="single" collapsible className="w-full">
                      {position.abilityModel?.nodes
                        .filter((a) => a.resources && a.resources.length > 0)
                        .map((ability) => (
                          <AccordionItem key={ability.id} value={ability.id}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-3">
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{
                                    backgroundColor: ABILITY_COLORS[ability.type] || "#6b7280",
                                  }}
                                />
                                <span className="font-medium">{ability.name}</span>
                                <Badge variant="secondary" className="ml-2">
                                  {ability.resources?.length} 个资源
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3 pt-2">
                                {ability.resources?.map((resource) => {
                                  const Icon =
                                    RESOURCE_ICONS[
                                      resource.type as keyof typeof RESOURCE_ICONS
                                    ] || FileText
                                  return (
                                    <div
                                      key={resource.id}
                                      className="flex items-center gap-4 rounded-lg border p-4"
                                    >
                                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                                        <Icon className="h-6 w-6" />
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-medium">{resource.title}</h4>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                          {resource.description}
                                        </p>
                                        {resource.duration && (
                                          <span className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {resource.duration} 分钟
                                          </span>
                                        )}
                                      </div>
                                      <Button size="sm" variant="outline" className="gap-1">
                                        学习 <ChevronRight className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )
                                })}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                    </Accordion>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">暂无学习资源</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        该岗位的学习资源正在建设中
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 达标要求 Tab */}
            <TabsContent value="requirements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>岗位达标要求</CardTitle>
                  <CardDescription>
                    完成以下能力要求，即可获得该岗位的能力认证
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {position.abilityModel?.nodes.map((ability) => (
                      <div
                        key={ability.id}
                        className="flex items-center gap-4 rounded-lg border p-4"
                      >
                        <div
                          className="h-4 w-4 shrink-0 rounded-full"
                          style={{
                            backgroundColor: ABILITY_COLORS[ability.type] || "#6b7280",
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{ability.name}</h4>
                            {ability.isRequired !== false && (
                              <Badge variant="destructive" className="text-xs">
                                必修
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              要求等级：
                              <Badge variant="outline" className="ml-1">
                                {ability.requiredLevel === "beginner"
                                  ? "初级"
                                  : ability.requiredLevel === "intermediate"
                                  ? "中级"
                                  : ability.requiredLevel === "advanced"
                                  ? "高级"
                                  : ability.requiredLevel === "expert"
                                  ? "专家"
                                  : "未设置"}
                              </Badge>
                            </span>
                            {ability.weight && (
                              <span className="text-sm text-muted-foreground">
                                权重：{ability.weight}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-muted-foreground">
                            0%
                          </div>
                          <div className="text-xs text-muted-foreground">当前进度</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
