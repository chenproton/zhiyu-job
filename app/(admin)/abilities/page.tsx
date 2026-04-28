"use client"

import { useState } from "react"
import { useData } from "@/lib/stores/data-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Brain,
  Lightbulb,
  Heart,
  Sparkles,
  Download,
  Upload,
  Layers
} from "lucide-react"
import type { Ability } from "@/lib/types"

// 能力分类常量（与 mock-data/abilities.ts 保持一致）
const ABILITY_CATEGORIES = [
  { value: "专业技能", label: "专业技能" },
  { value: "通用能力", label: "通用能力" },
  { value: "软技能", label: "软技能" },
  { value: "工具应用", label: "工具应用" },
  { value: "行业知识", label: "行业知识" },
]

const MOCK_AI_ABILITIES = [
  { name: "问题分析能力", category: "通用能力", description: "能够准确识别和分析问题的根本原因" },
  { name: "团队协作能力", category: "软技能", description: "能够与团队成员有效沟通、协作完成任务" },
  { name: "行业法规知识", category: "行业知识", description: "熟悉本行业相关的法律法规和政策要求" },
  { name: "创新思维能力", category: "通用能力", description: "能够提出创新性的解决方案和改进建议" },
  { name: "职业道德素养", category: "软技能", description: "具备良好的职业操守和道德规范意识" },
  { name: "数据分析能力", category: "专业技能", description: "能够运用统计方法和工具进行数据分析" },
  { name: "项目管理能力", category: "专业技能", description: "能够有效规划、执行和监控项目进度" },
]

export default function AbilitiesPage() {
  const { abilities, addAbility, updateAbility, deleteAbility } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingAbility, setEditingAbility] = useState<Ability | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const [newAbility, setNewAbility] = useState({
    name: "",
    category: "专业技能",
    description: "",
    isPublic: true,
  })

  // 统计数据
  const stats = {
    total: abilities.length,
    professional: abilities.filter(a => a.category === "专业技能").length,
    general: abilities.filter(a => a.category === "通用能力").length,
    soft: abilities.filter(a => a.category === "软技能").length,
    tool: abilities.filter(a => a.category === "工具应用").length,
    knowledge: abilities.filter(a => a.category === "行业知识").length,
  }

  // 过滤能力
  const filteredAbilities = abilities.filter((ability) => {
    const matchesSearch =
      ability.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ability.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || ability.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // 按分类分组
  const groupedAbilities = ABILITY_CATEGORIES.map(cat => ({
    ...cat,
    abilities: filteredAbilities.filter(a => a.category === cat.value)
  })).filter(cat => cat.abilities.length > 0 || selectedCategory === cat.value)

  const handleAdd = () => {
    if (!newAbility.name) return
    addAbility({
      name: newAbility.name,
      category: newAbility.category,
      description: newAbility.description,
      isPublic: newAbility.isPublic,
    })
    setNewAbility({ name: "", category: "专业技能", description: "", isPublic: true })
    setIsAddOpen(false)
  }

  const handleEdit = () => {
    if (!editingAbility) return
    updateAbility(editingAbility.id, {
      name: editingAbility.name,
      category: editingAbility.category,
      description: editingAbility.description,
    })
    setEditingAbility(null)
    setIsEditOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个能力点吗？")) {
      deleteAbility(id)
    }
  }

  const handleAIGenerate = async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // 随机选择3个AI推荐的能力
    const randomAbilities = MOCK_AI_ABILITIES
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    
    randomAbilities.forEach((mockAbility) => {
      addAbility({
        name: mockAbility.name,
        category: mockAbility.category,
        description: mockAbility.description,
        isPublic: true,
      })
    })
    
    setIsGenerating(false)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "专业技能": return Brain
      case "通用能力": return Lightbulb
      case "软技能": return Heart
      case "工具应用": return Layers
      case "行业知识": return Layers
      default: return Brain
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "专业技能": return "bg-blue-500"
      case "通用能力": return "bg-amber-500"
      case "软技能": return "bg-rose-500"
      case "工具应用": return "bg-emerald-500"
      case "行业知识": return "bg-emerald-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">能力公共池</h1>
          <p className="text-muted-foreground">
            管理和维护可复用的能力点库，支持分类管理和批量操作
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert("导入功能演示")}>
            <Upload className="mr-2 h-4 w-4" />
            导入
          </Button>
          <Button variant="outline" onClick={() => alert("导出功能演示")}>
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
          <Button
            variant="outline"
            onClick={handleAIGenerate}
            disabled={isGenerating}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isGenerating ? "生成中..." : "AI 推荐"}
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新建能力
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新建能力点</DialogTitle>
                <DialogDescription>创建一个新的能力点添加到公共池</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>能力名称</Label>
                  <Input
                    value={newAbility.name}
                    onChange={(e) => setNewAbility({ ...newAbility, name: e.target.value })}
                    placeholder="例如：数据分析能力"
                  />
                </div>
                <div className="space-y-2">
                  <Label>所属分类</Label>
                  <Select
                    value={newAbility.category}
                    onValueChange={(value) => setNewAbility({ ...newAbility, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ABILITY_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>能力描述</Label>
                  <Textarea
                    value={newAbility.description}
                    onChange={(e) => setNewAbility({ ...newAbility, description: e.target.value })}
                    placeholder="描述该能力的具体内涵..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleAdd} disabled={!newAbility.name}>
                  创建
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">能力总数</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                <Brain className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">专业技能</p>
                <p className="text-2xl font-bold">{stats.professional}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                <Lightbulb className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">通用能力</p>
                <p className="text-2xl font-bold">{stats.general}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-500/10">
                <Heart className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">软技能</p>
                <p className="text-2xl font-bold">{stats.soft}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10">
                <Layers className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">工具应用</p>
                <p className="text-2xl font-bold">{stats.tool}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                <Layers className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">行业知识</p>
                <p className="text-2xl font-bold">{stats.knowledge}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和过滤 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索能力名称或描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList>
                <TabsTrigger value="all">全部</TabsTrigger>
                <TabsTrigger value="专业技能">专业技能</TabsTrigger>
                <TabsTrigger value="通用能力">通用能力</TabsTrigger>
                <TabsTrigger value="软技能">软技能</TabsTrigger>
                <TabsTrigger value="工具应用">工具应用</TabsTrigger>
                <TabsTrigger value="行业知识">行业知识</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* 能力列表 */}
      <div className="space-y-4">
        {filteredAbilities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Layers className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">暂无能力点</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                点击上方「新建能力」按钮创建第一个能力点
              </p>
            </CardContent>
          </Card>
        ) : (
          groupedAbilities.map((group) => (
            <Card key={group.value}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${getCategoryColor(group.value)}`} />
                  <CardTitle className="text-lg">{group.label}</CardTitle>
                  <Badge variant="secondary">{group.abilities.length} 个</Badge>
                </div>
              </CardHeader>
              {group.abilities.length > 0 && (
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>能力名称</TableHead>
                        <TableHead>描述</TableHead>
                        <TableHead>公开状态</TableHead>
                        <TableHead>创建时间</TableHead>
                        <TableHead className="w-[100px]">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.abilities.map((ability) => {
                        const CategoryIcon = getCategoryIcon(ability.category)
                        return (
                          <TableRow key={ability.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{ability.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[300px] truncate text-muted-foreground">
                              {ability.description || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={ability.isPublic ? "default" : "outline"}>
                                {ability.isPublic ? "公开" : "私有"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(ability.createdAt).toLocaleDateString("zh-CN")}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setEditingAbility(ability)
                                      setIsEditOpen(true)
                                    }}
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    编辑
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDelete(ability.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    删除
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* 编辑弹窗 */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑能力点</DialogTitle>
            <DialogDescription>修改能力点的基本信息</DialogDescription>
          </DialogHeader>
          {editingAbility && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>能力名称</Label>
                <Input
                  value={editingAbility.name}
                  onChange={(e) => setEditingAbility({ ...editingAbility, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>所属分类</Label>
                <Select
                  value={editingAbility.category}
                  onValueChange={(value) => setEditingAbility({ ...editingAbility, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ABILITY_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>能力描述</Label>
                <Textarea
                  value={editingAbility.description}
                  onChange={(e) => setEditingAbility({ ...editingAbility, description: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              取消
            </Button>
            <Button onClick={handleEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
