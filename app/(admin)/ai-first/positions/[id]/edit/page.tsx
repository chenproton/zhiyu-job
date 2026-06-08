'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useData } from '@/lib/stores/data-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Save, Eye, ArrowRight, ArrowLeft, Check, ImagePlus, UserPlus, Wand2, Sparkles, Pencil } from 'lucide-react'
import { StepBasicInfo } from '@/components/position-builder/step-basic-info'
import { StepAbilityModeling } from '@/components/position-builder/step-ability-modeling'
import { StepCompetencyConfig } from '@/components/position-builder/step-competency-config'
import { mockAiPositionGeneration } from '@/lib/ai-mock-data'
import type { Position } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const CURRENT_USER = { id: 'user-1', name: '张建设' }

interface PageProps {
  params: Promise<{ id: string }>
}

export default function PositionEditPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { positions, batches, updatePosition, submitForApproval } = useData()
  const [activeStep, setActiveStep] = useState('basic')
  const [isSaving, setIsSaving] = useState(false)
  const [position, setPosition] = useState<Position | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // AI Assisted Creation Dialog
  const [isAiCreateDialogOpen, setIsAiCreateDialogOpen] = useState(false)
  const [aiDirection, setAiDirection] = useState('')
  const [aiProgress, setAiProgress] = useState(0)
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const [aiGeneratedPreview, setAiGeneratedPreview] = useState<{
    name: string
    shortName: string
    industry: string
    majors: string[]
    salaryRange: [number, number]
    description: string
    responsibilities: { id: string; name: string; description: string }[]
    requirements: string[]
    careerPath: { horizontal: string[]; vertical: string[] }
    coverImage: string
    certificates: { id: string; name: string; description?: string }[]
  } | null>(null)
  const [isAiGeneratedPreviewOpen, setIsAiGeneratedPreviewOpen] = useState(false)

  // Inline editing states for AI preview
  const [editingRespIdx, setEditingRespIdx] = useState<number | null>(null)
  const [editRespName, setEditRespName] = useState('')
  const [editRespDesc, setEditRespDesc] = useState('')
  const [editingReqIdx, setEditingReqIdx] = useState<number | null>(null)
  const [editReqText, setEditReqText] = useState('')

  // Cover AI generation
  const [coverRegenOpen, setCoverRegenOpen] = useState(false)
  const [coverRegenPrompt, setCoverRegenPrompt] = useState("")
  const [coverRegenLoading, setCoverRegenLoading] = useState(false)
  const [coverRegenProgress, setCoverRegenProgress] = useState(0)

  const handleAiGenerateCover = () => {
    setCoverRegenLoading(true)
    setCoverRegenProgress(0)
    let p = 0
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 15) + 10
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setCoverRegenProgress(100)
        setTimeout(() => {
          const covers = ["/cover-wms-1.png", "/cover-wms-2.png", "/cover-wms-3.png", "/placeholder.jpg"]
          const currentIdx = covers.indexOf(position?.coverImage || "")
          let nextIdx = Math.floor(Math.random() * covers.length)
          while (nextIdx === currentIdx && covers.length > 1) {
            nextIdx = Math.floor(Math.random() * covers.length)
          }
          updatePositionData({ coverImage: covers[nextIdx] })
          setCoverRegenLoading(false)
          setCoverRegenProgress(0)
          setCoverRegenPrompt("")
        }, 400)
      } else {
        setCoverRegenProgress(p)
      }
    }, 150)
  }

  useEffect(() => {
    const found = positions.find((p) => p.id === id)
    if (found) {
      setPosition({ ...found })
    }
  }, [id, positions])

  if (!position) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">岗位不存在</p>
      </div>
    )
  }

  const batch = batches.find((b) => b.id === position.batchId)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    updatePosition(position.id, position)
    setIsSaving(false)
  }

  const handleSubmit = async () => {
    await handleSave()
    if (batch) {
      submitForApproval(position.id, batch.workflowId, 'user-2', '李建设')
    }
    router.push('/ai-first/positions')
  }

  const updatePositionData = (data: Partial<Position>) => {
    setPosition((prev) => (prev ? { ...prev, ...data } : null))
  }

  const steps = [
    { id: 'basic', label: '基础信息', description: '填写岗位基本信息' },
    { id: 'ability', label: '能力建模', description: '构建能力图谱' },
    { id: 'competency', label: '胜任力配置', description: '设置达标要求' },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === activeStep)
  const currentStep = steps[currentStepIndex]

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) setActiveStep(steps[nextIndex].id)
  }

  const handlePrev = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) setActiveStep(steps[prevIndex].id)
  }

  const canGoNext = currentStepIndex < steps.length - 1
  const canGoPrev = currentStepIndex > 0

  const handleStartAiGenerate = () => {
    if (!position) return
    setIsAiGenerating(true)
    setAiProgress(0)

    const interval = setInterval(() => {
      setAiProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.floor(Math.random() * 15) + 5
      })
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setAiProgress(100)

      const result = mockAiPositionGeneration(position.name, aiDirection)
      setAiGeneratedPreview(result)

      setIsAiGenerating(false)
      setAiProgress(0)
      setAiDirection('')
      setIsAiCreateDialogOpen(false)
      setIsAiGeneratedPreviewOpen(true)
    }, 1500)
  }

  const handleApplyAiPreview = () => {
    if (!aiGeneratedPreview) return
    const updates: Partial<Position> = {}
    updates.name = aiGeneratedPreview.name
    updates.shortName = aiGeneratedPreview.shortName
    updates.industry = aiGeneratedPreview.industry
    updates.majors = aiGeneratedPreview.majors
    updates.description = aiGeneratedPreview.description
    updates.responsibilities = aiGeneratedPreview.responsibilities
    updates.requirements = aiGeneratedPreview.requirements
    updates.careerPath = aiGeneratedPreview.careerPath
    updates.salaryRange = aiGeneratedPreview.salaryRange
    updates.certificates = aiGeneratedPreview.certificates.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description || '',
    }))
    updates.coverImage = aiGeneratedPreview.coverImage
    updatePositionData(updates)
    setAiGeneratedPreview(null)
    setIsAiGeneratedPreviewOpen(false)
  }

  const startEditResp = (idx: number) => {
    if (!aiGeneratedPreview) return
    setEditingRespIdx(idx)
    setEditRespName(aiGeneratedPreview.responsibilities[idx].name)
    setEditRespDesc(aiGeneratedPreview.responsibilities[idx].description)
  }

  const saveEditResp = () => {
    if (!aiGeneratedPreview || editingRespIdx === null) return
    const next = { ...aiGeneratedPreview }
    next.responsibilities = next.responsibilities.map((r, i) =>
      i === editingRespIdx ? { ...r, name: editRespName, description: editRespDesc } : r
    )
    setAiGeneratedPreview(next)
    setEditingRespIdx(null)
  }

  const startEditReq = (idx: number) => {
    if (!aiGeneratedPreview) return
    setEditingReqIdx(idx)
    setEditReqText(aiGeneratedPreview.requirements[idx])
  }

  const saveEditReq = () => {
    if (!aiGeneratedPreview || editingReqIdx === null) return
    const next = { ...aiGeneratedPreview }
    next.requirements = next.requirements.map((r, i) =>
      i === editingReqIdx ? editReqText : r
    )
    setAiGeneratedPreview(next)
    setEditingReqIdx(null)
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/ai-first/positions')}>
              <X className="h-4 w-4 mr-2" />
              取消
            </Button>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">
                步骤 {currentStepIndex + 1}
              </Badge>
              <span className="text-sm font-medium text-gray-800">{currentStep.label}</span>
              <span className="text-xs text-gray-400 hidden sm:inline">{currentStep.description}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => setIsAiCreateDialogOpen(true)}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 gap-1 shrink-0"
            >
              <Wand2 className="h-4 w-4" />
              AI 辅助编辑
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? '保存中...' : '保存草稿'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsPreviewOpen(true)}>
              <Eye className="mr-2 h-4 w-4" />
              预览
            </Button>
            {canGoPrev && (
              <Button variant="outline" size="sm" onClick={handlePrev}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                上一步
              </Button>
            )}
            {canGoNext ? (
              <Button size="sm" onClick={handleNext}>
                下一步
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              position.status === 'draft' && (
                <Button size="sm" onClick={handleSubmit}>
                  <Check className="mr-2 h-4 w-4" />
                  提交审批
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-full mx-auto px-6 py-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{position.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {batch?.department} - {batch?.major} | 版本 {position.version}
            </p>
          </div>
        </div>

        {activeStep === 'basic' ? (
          <div className="grid grid-cols-3 gap-6">
            {/* Left: form */}
            <div className="col-span-2">
              <StepBasicInfo position={position} onUpdate={updatePositionData} aiMode />
            </div>

            {/* Right: sidebar */}
            <div className="space-y-6">
              {/* Cover Image */}
              <Card>
                <CardContent className="pt-6">
                  <Label className="mb-3 block">岗位封面</Label>
                  <div
                    className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden relative group"
                    onClick={() => !position.coverImage && updatePositionData({ coverImage: '/placeholder.svg?height=200&width=300' })}
                  >
                    {position.coverImage ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={position.coverImage}
                          alt="岗位封面"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/90 text-gray-800 border-white hover:bg-white gap-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              setCoverRegenOpen(true)
                            }}
                          >
                            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                            重新生成
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/90 text-gray-800 border-white hover:bg-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              updatePositionData({ coverImage: '' })
                            }}
                          >
                            移除封面
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center">
                        <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">点击设置封面图片</p>
                        <p className="text-xs text-gray-400 mt-1">建议尺寸 320x200</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 gap-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCoverRegenOpen(true)
                          }}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          AI 生成封面
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Meta Info */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {/* Batch */}
                  <div>
                    <Label className="text-gray-500 text-xs">所属批次</Label>
                    <div className="mt-1">
                      <Select
                        value={position.batchId || '__none__'}
                        onValueChange={(v) => updatePositionData({ batchId: v === '__none__' ? '' : v })}
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="选择批次" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">未选择批次</SelectItem>
                          {batches.map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Creator */}
                  <div>
                    <Label className="text-gray-500 text-xs">创建人</Label>
                    <p className="font-medium text-gray-800 mt-1">{CURRENT_USER.name}</p>
                  </div>

                  {/* Collaborators */}
                  <div>
                    <Label className="text-gray-500 text-xs">共建人</Label>
                    <div className="mt-1 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                      {position.collaborators.length === 0 ? (
                        <div className="flex items-center gap-2 text-gray-400">
                          <UserPlus className="h-4 w-4" />
                          <span className="text-sm">点击选择共建人</span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                            <span>{CURRENT_USER.name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Version */}
                  <div className="pt-3 border-t border-gray-100">
                    <Label className="text-gray-500 text-xs">当前版本号</Label>
                    <p className="font-medium text-gray-800 mt-1">{position.version}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {activeStep === 'ability' && (
              <StepAbilityModeling position={position} onUpdate={updatePositionData} aiMode />
            )}
            {activeStep === 'competency' && (
              <StepCompetencyConfig position={position} onUpdate={updatePositionData} aiMode onSubmit={handleSubmit} />
            )}
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>岗位信息预览</DialogTitle>
            <DialogDescription>预览当前填写的岗位信息</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">岗位名称</p>
                <p className="font-medium text-sm">{position.name}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">所属批次</p>
                <p className="font-medium text-sm">{batch?.name || '未关联'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">所属行业</p>
                <p className="font-medium text-sm">{position.industry || '-'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">适用专业</p>
                <p className="font-medium text-sm">{position.majors.join('、') || '-'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">薪资范围</p>
                <p className="font-medium text-sm">{position.salaryRange[0]} - {position.salaryRange[1]}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">当前版本</p>
                <p className="font-medium text-sm">{position.version}</p>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">岗位描述</p>
              <p className="text-sm">{position.description || '暂无描述'}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">工作职责 ({position.responsibilities.length})</p>
              <ul className="text-sm space-y-1 mt-1">
                {position.responsibilities.map((r) => (
                  <li key={r.id}>• {r.name}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">能力绑定 ({position.abilityBindings.length})</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {position.abilityBindings.map((b) => (
                  <Badge key={b.id} variant="secondary" className="text-xs">{b.name}</Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Assisted Creation Dialog */}
      <Dialog open={isAiCreateDialogOpen} onOpenChange={setIsAiCreateDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>AI 辅助完善岗位信息</DialogTitle>
            <DialogDescription>AI 将基于当前岗位为您智能生成或完善基础信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="ai-description">岗位描述 / 工作方向</Label>
              <Textarea
                id="ai-description"
                value={aiDirection}
                onChange={(e) => setAiDirection(e.target.value)}
                placeholder="请描述该岗位的工作内容、技术栈或重点方向，AI 将据此生成岗位信息。例如：负责电商平台前端开发，需要精通React和TypeScript"
                rows={4}
              />
            </div>
            {isAiGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>AI 生成中...</span>
                  <span>{aiProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all duration-200"
                    style={{ width: `${aiProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAiCreateDialogOpen(false)} disabled={isAiGenerating}>
              取消
            </Button>
            <Button
              onClick={handleStartAiGenerate}
              disabled={isAiGenerating}
              className="gap-1 bg-purple-600 hover:bg-purple-700"
            >
              {isAiGenerating ? (
                <>生成中...</>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  开始AI生成
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Generated Preview Dialog */}
      <Dialog open={isAiGeneratedPreviewOpen} onOpenChange={setIsAiGeneratedPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI 生成结果预览
            </DialogTitle>
            <DialogDescription>
              AI 已生成以下岗位基础信息，确认后将填充到当前表单
            </DialogDescription>
          </DialogHeader>
          {aiGeneratedPreview && (
            <>
              {/* Cover Image - full width at top */}
              <div className="overflow-hidden -mx-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={aiGeneratedPreview.coverImage}
                  alt="AI 生成封面"
                  className="w-full aspect-video object-cover"
                />
              </div>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">岗位名称</p>
                    <p className="font-medium text-sm">{aiGeneratedPreview.name}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">所属行业</p>
                    <p className="font-medium text-sm">{aiGeneratedPreview.industry}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">适用专业</p>
                    <p className="font-medium text-sm">{aiGeneratedPreview.majors.join('、')}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">薪资范围</p>
                    <p className="font-medium text-sm">{aiGeneratedPreview.salaryRange[0].toLocaleString()} - {aiGeneratedPreview.salaryRange[1].toLocaleString()} 元/月</p>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">岗位介绍</p>
                  <p className="text-sm whitespace-pre-line">{aiGeneratedPreview.description}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">工作职责 ({aiGeneratedPreview.responsibilities.length})</p>
                  <ul className="text-sm space-y-2 mt-1">
                    {aiGeneratedPreview.responsibilities.map((r, i) => (
                      <li key={r.id} className="flex items-start gap-2">
                        {editingRespIdx === i ? (
                          <div className="flex-1 space-y-1.5">
                            <input
                              value={editRespName}
                              onChange={(e) => setEditRespName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEditResp()}
                              className="w-full text-sm px-2 py-1 rounded border border-gray-300 focus:border-purple-500 focus:outline-none"
                              autoFocus
                            />
                            <input
                              value={editRespDesc}
                              onChange={(e) => setEditRespDesc(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEditResp()}
                              className="w-full text-xs px-2 py-1 rounded border border-gray-200 focus:border-purple-500 focus:outline-none text-gray-500"
                            />
                          </div>
                        ) : (
                          <div className="flex-1">
                            <p className="font-medium">{r.name}</p>
                            <p className="text-xs text-gray-400">{r.description}</p>
                          </div>
                        )}
                        <button
                          onClick={() => editingRespIdx === i ? saveEditResp() : startEditResp(i)}
                          className="p-1 rounded text-gray-300 hover:text-purple-600 hover:bg-purple-50 transition-colors shrink-0 mt-0.5"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">任职要求 ({aiGeneratedPreview.requirements.length})</p>
                  <ul className="text-sm space-y-1.5 mt-1">
                    {aiGeneratedPreview.requirements.map((r, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {editingReqIdx === i ? (
                          <input
                            value={editReqText}
                            onChange={(e) => setEditReqText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEditReq()}
                            onBlur={saveEditReq}
                            className="flex-1 text-sm px-2 py-1 rounded border border-gray-300 focus:border-purple-500 focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="flex-1">• {r}</span>
                        )}
                        <button
                          onClick={() => editingReqIdx === i ? saveEditReq() : startEditReq(i)}
                          className="p-1 rounded text-gray-300 hover:text-purple-600 hover:bg-purple-50 transition-colors shrink-0"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">相关证书 ({aiGeneratedPreview.certificates.length})</p>
                  <ul className="text-sm space-y-1 mt-1">
                    {aiGeneratedPreview.certificates.map((c) => (
                      <li key={c.id}>
                        <span className="font-medium">{c.name}</span>
                        {c.description && <span className="text-xs text-gray-400 ml-1">— {c.description}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">发展路径</p>
                  <div className="text-sm space-y-1">
                    <p>横向：{aiGeneratedPreview.careerPath.horizontal.join('、')}</p>
                    <p>纵向：{aiGeneratedPreview.careerPath.vertical.join(' → ')}</p>
                  </div>
                </div>
              </div>
            </>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAiGeneratedPreviewOpen(false)}>
              取消
            </Button>
            <Button onClick={handleApplyAiPreview} className="gap-1 bg-purple-600 hover:bg-purple-700">
              <Check className="h-4 w-4" />
              确认应用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cover Regeneration Prompt Dialog */}
      <Dialog open={coverRegenOpen} onOpenChange={setCoverRegenOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI 生成封面
            </DialogTitle>
            <DialogDescription>
              输入您对封面图的要求，AI 将为您生成新的岗位封面
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label htmlFor="cover-prompt">封面描述要求</Label>
            <Textarea
              id="cover-prompt"
              placeholder="例如：蓝色科技风格，展现软件开发工作场景..."
              value={coverRegenPrompt}
              onChange={(e) => setCoverRegenPrompt(e.target.value)}
              className="min-h-[80px] text-sm"
            />
            <p className="text-xs text-gray-400">留空将随机生成封面图</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setCoverRegenOpen(false)}>取消</Button>
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => {
                setCoverRegenOpen(false)
                handleAiGenerateCover()
              }}
            >
              确认生成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cover Regeneration Progress Dialog */}
      <Dialog open={coverRegenLoading} onOpenChange={(v) => !v && setCoverRegenLoading(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI 正在生成封面
            </DialogTitle>
            <DialogDescription>
              {coverRegenPrompt ? `正在根据要求生成封面：${coverRegenPrompt}` : "正在为您生成新的岗位封面..."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-purple-700">
              <span>生成进度</span>
              <span>{coverRegenProgress}%</span>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all"
                style={{ width: `${coverRegenProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="h-4 w-4 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              <span>AI 正在绘制封面图像...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
