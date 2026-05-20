'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sparkles,
  Plus,
  Search,
  Trash2,
  Lightbulb,
  BookOpen,
  Brain,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'
import { useData } from '@/lib/stores/data-context'
import type { Position, PositionAbilityBinding, CompetencyLevel, PositionResponsibility } from '@/lib/types'
import { COMPETENCY_LEVEL_LABELS } from '@/lib/types'

interface StepAbilityModelingProps {
  position: Position
  onUpdate: (data: Partial<Position>) => void
}

const COMPETENCY_LEVELS: { value: CompetencyLevel; label: string; description: string }[] = [
  { value: 'understand', label: '了解', description: '了解基本概念，能在指导下完成简单任务' },
  { value: 'comprehend', label: '理解', description: '理解原理和方法，能独立完成基本任务' },
  { value: 'master', label: '掌握', description: '能独立完成常规任务，处理一般问题' },
  { value: 'proficient', label: '熟练', description: '能处理复杂任务，指导他人，优化流程' },
  { value: 'expert', label: '精通', description: '行业专家水平，能创新和引领发展方向' },
]

const DEFAULT_DOMAINS = [
  '业务洞察',
  '专业工具',
  '通用素质',
  '团队协作',
  '创新思维',
]

export function StepAbilityModeling({ position, onUpdate }: StepAbilityModelingProps) {
  const { abilities } = useData()
  const [selectedRespId, setSelectedRespId] = useState<string | null>(
    position.responsibilities[0]?.id || null
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newAbilityName, setNewAbilityName] = useState('')
  const [newAbilityCategory, setNewAbilityCategory] = useState('专业技能')
  const [isGenerating, setIsGenerating] = useState(false)

  const selectedResp = position.responsibilities.find(r => r.id === selectedRespId)

  const respBindings = useMemo(() => {
    if (!selectedRespId) return []
    return position.abilityBindings.filter(b => b.responsibilityId === selectedRespId)
  }, [position.abilityBindings, selectedRespId])

  const unmappedRespCount = position.responsibilities.filter(r =>
    !position.abilityBindings.some(b => b.responsibilityId === r.id)
  ).length

  const filteredPublicAbilities = useMemo(() => {
    if (!searchQuery.trim()) return []
    return abilities.filter(a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [abilities, searchQuery])

  const handleAddFromPool = (ability: typeof abilities[0]) => {
    if (!selectedRespId) return
    const exists = position.abilityBindings.some(
      b => b.responsibilityId === selectedRespId && b.publicAbilityId === ability.id
    )
    if (exists) return

    const newBinding: PositionAbilityBinding = {
      id: `bind-${Date.now()}`,
      responsibilityId: selectedRespId,
      source: 'public',
      publicAbilityId: ability.id,
      name: ability.name,
      category: ability.category,
      level: 'master',
      rubricDescription: '',
    }
    onUpdate({ abilityBindings: [...position.abilityBindings, newBinding] })
    setSearchQuery('')
  }

  const handleCreateCustom = () => {
    if (!selectedRespId || !newAbilityName.trim()) return
    const newBinding: PositionAbilityBinding = {
      id: `bind-${Date.now()}`,
      responsibilityId: selectedRespId,
      source: 'custom',
      name: newAbilityName.trim(),
      category: newAbilityCategory,
      level: 'master',
      rubricDescription: '',
    }
    onUpdate({ abilityBindings: [...position.abilityBindings, newBinding] })
    setNewAbilityName('')
    setShowCreateDialog(false)
  }

  const handleRemoveBinding = (bindingId: string) => {
    onUpdate({
      abilityBindings: position.abilityBindings.filter(b => b.id !== bindingId),
    })
  }

  const handleUpdateBinding = (bindingId: string, updates: Partial<PositionAbilityBinding>) => {
    onUpdate({
      abilityBindings: position.abilityBindings.map(b =>
        b.id === bindingId ? { ...b, ...updates } : b
      ),
    })
  }

  const handleAIGenerate = async () => {
    if (!selectedRespId) return
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const mockBindings: PositionAbilityBinding[] = ([
      {
        id: `bind-ai-1-${Date.now()}`,
        responsibilityId: selectedRespId,
        source: 'public' as const,
        publicAbilityId: abilities[0]?.id,
        name: abilities[0]?.name || '编程开发',
        category: abilities[0]?.category || '专业技能',
        level: 'proficient' as const,
        rubricDescription: '能够独立完成复杂业务模块的编码实现，代码质量达到团队规范要求',
      },
      {
        id: `bind-ai-2-${Date.now()}`,
        responsibilityId: selectedRespId,
        source: 'public' as const,
        publicAbilityId: abilities[1]?.id,
        name: abilities[1]?.name || '系统设计',
        category: abilities[1]?.category || '专业技能',
        level: 'master' as const,
        rubricDescription: '能够进行模块级设计，理解并能运用常见设计模式',
      },
      {
        id: `bind-ai-3-${Date.now()}`,
        responsibilityId: selectedRespId,
        source: 'custom' as const,
        name: '代码审查',
        category: '通用能力',
        level: 'comprehend' as const,
        rubricDescription: '能够发现代码中的明显缺陷，并提出改进建议',
      },
    ] as PositionAbilityBinding[]).filter(b => b.name)

    const cleaned = position.abilityBindings.filter(b => b.responsibilityId !== selectedRespId)
    onUpdate({ abilityBindings: [...cleaned, ...mockBindings] })
    setIsGenerating(false)
  }

  const getSourceBadge = (source: string) => {
    return source === 'public'
      ? <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">公共库</Badge>
      : <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200">自建</Badge>
  }

  const completeness = position.responsibilities.length > 0
    ? Math.round(
        ((position.responsibilities.length - unmappedRespCount) / position.responsibilities.length) * 100
      )
    : 0

  return (
    <div className="grid gap-6 lg:grid-cols-5 h-[calc(100vh-280px)] min-h-[500px]">
      {/* Left Panel - Responsibilities */}
      <Card className="lg:col-span-2 flex flex-col overflow-hidden">
        <CardHeader className="shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">工作职责列表</CardTitle>
              <CardDescription>选中职责后进行能力点拆解</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">{completeness}%</div>
              <div className="text-xs text-muted-foreground">拆解进度</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-2">
          {position.responsibilities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <AlertCircle className="h-10 w-10 mb-3" />
              <p className="text-sm">暂无工作职责</p>
              <p className="text-xs mt-1">请返回第一步添加工作职责</p>
            </div>
          ) : (
            position.responsibilities.map((resp) => {
              const bindingCount = position.abilityBindings.filter(b => b.responsibilityId === resp.id).length
              const isSelected = resp.id === selectedRespId
              return (
                <button
                  key={resp.id}
                  onClick={() => setSelectedRespId(resp.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-border hover:border-primary/30 hover:bg-accent/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      bindingCount > 0
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground'
                    }`}>
                      {bindingCount > 0 && <CheckCircle2 className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {resp.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" className="text-xs">
                          {bindingCount} 个能力点
                        </Badge>
                        {bindingCount === 0 && (
                          <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
                            待拆解
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 mt-1 transition-colors ${
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                </button>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Right Panel - Ability Decomposition */}
      <Card className="lg:col-span-3 flex flex-col overflow-hidden">
        <CardHeader className="shrink-0 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">
              {selectedResp ? `「${selectedResp.name}」能力拆解` : '能力拆分与达标配置'}
            </CardTitle>
            <CardDescription>
              {selectedResp
                ? '为当前职责添加支撑能力点并配置达标要求'
                : '请从左侧选择一项工作职责'}
            </CardDescription>
          </div>
          {selectedResp && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAIGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              AI 智能匹配
            </Button>
          )}
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto">
          {!selectedResp ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Lightbulb className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm">请从左侧选择一项工作职责</p>
              <p className="text-xs mt-1">选中后可在本区域为其配置支撑能力点</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search & Add */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="搜索公共能力点库..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Search results - only shown when searching */}
                {searchQuery.trim() && (
                  <div className="rounded-lg border bg-card p-3 space-y-2 max-h-56 overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground font-medium">公共能力点库（{abilities.length}）</p>
                      <p className="text-xs text-muted-foreground">
                        搜索「{searchQuery}」
                      </p>
                    </div>
                    {filteredPublicAbilities.length === 0 ? (
                      <div className="py-4 text-center">
                        <p className="text-sm text-muted-foreground">未找到匹配的能力点</p>
                      </div>
                    ) : (
                      filteredPublicAbilities.map((ability) => (
                        <div
                          key={ability.id}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                          onClick={() => handleAddFromPool(ability)}
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span className="text-sm">{ability.name}</span>
                            <Badge variant="outline" className="text-xs">{ability.category}</Badge>
                          </div>
                          <Button size="sm" variant="ghost" className="h-7 px-2">
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))
                    )}
                    {filteredPublicAbilities.length === 0 && (
                      <div className="pt-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => {
                            setNewAbilityName(searchQuery)
                            setShowCreateDialog(true)
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          库中不存在，新建「{searchQuery}」能力点
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  新建能力点
                </Button>
              </div>

              {/* Bindings List - Expanded cards, no accordion */}
              {respBindings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 rounded-lg border border-dashed">
                  <Brain className="h-10 w-10 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">暂无能力点</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    搜索公共库添加或新建能力点
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {respBindings.map((binding) => (
                    <div
                      key={binding.id}
                      className="rounded-lg border bg-card p-4 space-y-4"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{binding.name}</span>
                          {getSourceBadge(binding.source)}
                          <Badge variant="outline" className="text-xs">{binding.category}</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                          onClick={() => handleRemoveBinding(binding.id)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          移除
                        </Button>
                      </div>

                      {/* Level - Radio style */}
                      <div className="space-y-2">
                        <Label className="text-sm">掌握程度档次</Label>
                        <div className="grid grid-cols-5 gap-2">
                          {COMPETENCY_LEVELS.map((level) => {
                            const isActive = binding.level === level.value
                            return (
                              <button
                                key={level.value}
                                type="button"
                                onClick={() =>
                                  handleUpdateBinding(binding.id, { level: level.value })
                                }
                                className={`relative flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-all ${
                                  isActive
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                    : 'border-border hover:border-primary/30 hover:bg-accent/30'
                                }`}
                              >
                                <span className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                                  {level.label}
                                </span>
                                <span className="text-xs text-muted-foreground mt-1 leading-tight line-clamp-2">
                                  {level.description}
                                </span>
                                {isActive && (
                                  <div className="absolute top-1.5 right-1.5">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                  </div>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Rubric Description */}
                      <div className="space-y-2">
                        <Label className="text-sm">量规表现描述（岗位私有）</Label>
                        <Textarea
                          value={binding.rubricDescription}
                          onChange={(e) =>
                            handleUpdateBinding(binding.id, { rubricDescription: e.target.value })
                          }
                          placeholder="描述该能力点在本岗位中的具体达标表现，如考核方式、评判标准等..."
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                          此处配置的掌握程度与量规描述仅作为当前岗位的私有业务数据保存，不会反向污染全校能力点公共池。
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Custom Ability Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建能力点</DialogTitle>
            <DialogDescription>
              公共库中不存在该能力点，创建为岗位自建能力点
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>能力点名称</Label>
              <Input
                value={newAbilityName}
                onChange={(e) => setNewAbilityName(e.target.value)}
                placeholder="例如：微服务架构设计"
              />
            </div>
            <div className="space-y-2">
              <Label>分类</Label>
              <Select value={newAbilityCategory} onValueChange={setNewAbilityCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_DOMAINS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                  <SelectItem value="专业技能">专业技能</SelectItem>
                  <SelectItem value="通用能力">通用能力</SelectItem>
                  <SelectItem value="软技能">软技能</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              取消
            </Button>
            <Button onClick={handleCreateCustom} disabled={!newAbilityName.trim()}>
              创建并关联
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
