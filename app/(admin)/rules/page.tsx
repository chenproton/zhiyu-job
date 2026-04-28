"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  BookOpen,
  FileText,
  ClipboardCheck,
  Target,
  Download,
  Upload
} from "lucide-react"

// Mock 评价规则数据
interface EvaluationRule {
  id: string
  name: string
  type: "exam" | "practice" | "project" | "certificate"
  description: string
  criteria: string[]
  passingScore: number
  totalScore: number
  status: "active" | "inactive"
  usageCount: number
  createdAt: string
}

const RULE_TYPES = [
  { value: "exam", label: "考试评价", icon: FileText },
  { value: "practice", label: "实操评价", icon: ClipboardCheck },
  { value: "project", label: "项目评价", icon: Target },
  { value: "certificate", label: "证书认证", icon: BookOpen },
]

const mockRules: EvaluationRule[] = [
  {
    id: "rule-1",
    name: "编程能力考核标准",
    type: "exam",
    description: "适用于各类编程语言能力的考核评价",
    criteria: ["代码规范性", "算法效率", "逻辑正确性", "代码可读性"],
    passingScore: 60,
    totalScore: 100,
    status: "active",
    usageCount: 15,
    createdAt: "2024-01-15",
  },
  {
    id: "rule-2",
    name: "项目实战评估标准",
    type: "project",
    description: "用于评估学生的项目实战能力和团队协作能力",
    criteria: ["需求分析能力", "方案设计能力", "编码实现能力", "测试调试能力", "文档撰写能力"],
    passingScore: 70,
    totalScore: 100,
    status: "active",
    usageCount: 8,
    createdAt: "2024-02-20",
  },
  {
    id: "rule-3",
    name: "职业技能实操考核",
    type: "practice",
    description: "针对具体岗位技能的实际操作能力评价",
    criteria: ["操作规范性", "完成效率", "成果质量", "安全意识"],
    passingScore: 75,
    totalScore: 100,
    status: "active",
    usageCount: 22,
    createdAt: "2024-03-10",
  },
  {
    id: "rule-4",
    name: "行业证书认证标准",
    type: "certificate",
    description: "通过获取行业认可证书来评定能力水平",
    criteria: ["证书有效性", "证书等级", "颁发机构权威性"],
    passingScore: 0,
    totalScore: 0,
    status: "active",
    usageCount: 12,
    createdAt: "2024-01-05",
  },
]

export default function RulesPage() {
  const [rules, setRules] = useState<EvaluationRule[]>(mockRules)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<EvaluationRule | null>(null)
  const [newCriterion, setNewCriterion] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    type: "exam" as EvaluationRule["type"],
    description: "",
    criteria: [] as string[],
    passingScore: 60,
    totalScore: 100,
  })

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || rule.type === filterType
    return matchesSearch && matchesType
  })

  const resetForm = () => {
    setFormData({
      name: "",
      type: "exam",
      description: "",
      criteria: [],
      passingScore: 60,
      totalScore: 100,
    })
    setNewCriterion("")
  }

  const handleAddCriterion = () => {
    if (!newCriterion.trim()) return
    setFormData({
      ...formData,
      criteria: [...formData.criteria, newCriterion.trim()],
    })
    setNewCriterion("")
  }

  const handleRemoveCriterion = (index: number) => {
    setFormData({
      ...formData,
      criteria: formData.criteria.filter((_, i) => i !== index),
    })
  }

  const handleCreate = () => {
    if (!formData.name || formData.criteria.length === 0) return
    const newRule: EvaluationRule = {
      id: `rule-${Date.now()}`,
      ...formData,
      status: "active",
      usageCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setRules([...rules, newRule])
    setIsCreateOpen(false)
    resetForm()
  }

  const handleEdit = (rule: EvaluationRule) => {
    setEditingRule(rule)
    setFormData({
      name: rule.name,
      type: rule.type,
      description: rule.description,
      criteria: rule.criteria,
      passingScore: rule.passingScore,
      totalScore: rule.totalScore,
    })
  }

  const handleUpdate = () => {
    if (!editingRule) return
    setRules(
      rules.map((r) =>
        r.id === editingRule.id
          ? { ...r, ...formData }
          : r
      )
    )
    setEditingRule(null)
    resetForm()
  }

  const handleDelete = (ruleId: string) => {
    if (confirm("确定要删除这个评价规则吗？")) {
      setRules(rules.filter((r) => r.id !== ruleId))
    }
  }

  const handleToggleStatus = (rule: EvaluationRule) => {
    setRules(
      rules.map((r) =>
        r.id === rule.id
          ? { ...r, status: r.status === "active" ? "inactive" : "active" }
          : r
      )
    )
  }

  const getTypeIcon = (type: string) => {
    const found = RULE_TYPES.find((t) => t.value === type)
    return found ? found.icon : FileText
  }

  const getTypeLabel = (type: string) => {
    const found = RULE_TYPES.find((t) => t.value === type)
    return found ? found.label : type
  }

  const RuleForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <FieldGroup className="gap-4">
      <Field>
        <FieldLabel>规则名称</FieldLabel>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="例如：编程能力考核标准"
        />
      </Field>
      <Field>
        <FieldLabel>评价类型</FieldLabel>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value as EvaluationRule["type"] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RULE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel>规则描述</FieldLabel>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="描述该评价规则的适用场景..."
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>总分</FieldLabel>
          <Input
            type="number"
            value={formData.totalScore}
            onChange={(e) => setFormData({ ...formData, totalScore: Number(e.target.value) })}
          />
        </Field>
        <Field>
          <FieldLabel>及格分</FieldLabel>
          <Input
            type="number"
            value={formData.passingScore}
            onChange={(e) => setFormData({ ...formData, passingScore: Number(e.target.value) })}
          />
        </Field>
      </div>
      <div>
        <FieldLabel>评价维度</FieldLabel>
        <div className="mt-2 space-y-2">
          {formData.criteria.map((criterion, index) => (
            <div key={index} className="flex items-center gap-2 p-2 rounded-lg border">
              <Badge variant="outline">{index + 1}</Badge>
              <span className="flex-1 text-sm">{criterion}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleRemoveCriterion(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              placeholder="添加评价维度..."
              value={newCriterion}
              onChange={(e) => setNewCriterion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCriterion()}
            />
            <Button variant="outline" onClick={handleAddCriterion}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) setEditingRule(null)
            else setIsCreateOpen(false)
            resetForm()
          }}
        >
          取消
        </Button>
        <Button onClick={isEdit ? handleUpdate : handleCreate}>
          {isEdit ? "保存" : "创建"}
        </Button>
      </DialogFooter>
    </FieldGroup>
  )

  // 统计数据
  const stats = {
    total: rules.length,
    active: rules.filter((r) => r.status === "active").length,
    totalUsage: rules.reduce((sum, r) => sum + r.usageCount, 0),
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">评价规则库</h1>
          <p className="text-muted-foreground">
            管理和维护能力评价的标准规则和评估维度
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            导入
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新建规则
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>新建评价规则</DialogTitle>
                <DialogDescription>创建一个新的能力评价规则</DialogDescription>
              </DialogHeader>
              <RuleForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">规则总数</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <ClipboardCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">启用中</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                <Target className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">引用次数</p>
                <p className="text-2xl font-bold">{stats.totalUsage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">评价类型</p>
                <p className="text-2xl font-bold">{RULE_TYPES.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索规则名称或描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="评价类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                {RULE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 规则列表 */}
      <Card>
        <CardHeader>
          <CardTitle>评价规则列表</CardTitle>
          <CardDescription>共 {filteredRules.length} 条规则</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>规则名称</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>评价维度</TableHead>
                <TableHead>分数设置</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>引用次数</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <BookOpen className="h-10 w-10 mb-2" />
                      <p>暂无评价规则</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRules.map((rule) => {
                  const TypeIcon = getTypeIcon(rule.type)
                  return (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <TypeIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{rule.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {rule.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getTypeLabel(rule.type)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {rule.criteria.slice(0, 2).map((c, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {c}
                            </Badge>
                          ))}
                          {rule.criteria.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{rule.criteria.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {rule.totalScore > 0 ? (
                          <span className="text-sm">
                            {rule.passingScore}/{rule.totalScore}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={rule.status === "active" ? "default" : "secondary"}
                        >
                          {rule.status === "active" ? "启用" : "停用"}
                        </Badge>
                      </TableCell>
                      <TableCell>{rule.usageCount}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(rule)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(rule)}>
                              {rule.status === "active" ? "停用" : "启用"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(rule.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 编辑对话框 */}
      <Dialog open={!!editingRule} onOpenChange={(open) => !open && setEditingRule(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑评价规则</DialogTitle>
            <DialogDescription>修改评价规则配置</DialogDescription>
          </DialogHeader>
          <RuleForm isEdit />
        </DialogContent>
      </Dialog>
    </div>
  )
}
