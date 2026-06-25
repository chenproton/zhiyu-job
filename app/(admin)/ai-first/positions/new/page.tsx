'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useData } from '@/lib/stores/data-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Loader2,
  Bot,
  ImagePlus,
  UserPlus,
  Wand2,
  Save,
  Eye,
} from 'lucide-react'
import { StepBasicInfo } from '@/components/position-builder/step-basic-info'
import { StepAbilityModeling } from '@/components/position-builder/step-ability-modeling'
import { StepCompetencyConfig } from '@/components/position-builder/step-competency-config'
import { mockAiPositionGeneration } from '@/lib/ai-mock-data'
import type { Position } from '@/lib/types'
import { cn } from '@/lib/utils'

const CURRENT_USER = { id: 'user-1', name: '张建设' }

const MOCK_INDUSTRIES = [
  '互联网/IT',
  '金融/银行',
  '教育/培训',
  '医疗/健康',
  '制造/工业',
  '零售/电商',
  '物流/运输',
  '房地产/建筑',
  '能源/环保',
  '文化/传媒',
]

const MOCK_MAJORS = [
  '软件工程',
  '计算机科学与技术',
  '人工智能',
  '数据科学',
  '网络工程',
  '信息安全',
  '电子商务',
  '数字媒体',
  '物联网工程',
  '云计算技术',
  '物流管理',
  '供应链管理',
  '工业工程',
  '信息管理与信息系统',
  '工商管理',
  '市场营销',
  '金融学',
  '会计学',
  '人力资源管理',
  '产品设计',
]

const DEFAULT_POSITION: Position = {
  id: `draft-${Date.now()}`,
  batchId: '',
  version: 'V1.0',
  status: 'draft',
  name: '',
  shortName: '',
  industry: '',
  majors: [],
  positionType: 'enterprise',
  salaryRange: [0, 0],
  certificates: [],
  description: '',
  responsibilities: [],
  requirements: [],
  careerPath: { horizontal: [], vertical: [] },
  abilityModel: { nodes: [], edges: [] },
  abilityBindings: [],
  abilityDomains: [],
  competencyConfig: [],
  createdBy: CURRENT_USER.id,
  collaborators: [CURRENT_USER.id],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  favoriteCount: 0,
}

export default function AiFirstNewPositionPage() {
  const router = useRouter()
  const { batches, addPosition, submitForApproval } = useData()

  // Wizard steps
  const [step, setStep] = useState<'chat' | 'basic' | 'ability' | 'submitting' | 'success'>('chat')

  // Step 1: AI Chat form
  const [requirement, setRequirement] = useState('')
  const [industry, setIndustry] = useState('')
  const [major, setMajor] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateProgress, setGenerateProgress] = useState(0)

  // Step 2+: Draft position data (full Position type)
  const [position, setPosition] = useState<Position>({ ...DEFAULT_POSITION })

  // Step 2: Cover generation
  const [coverRegenOpen, setCoverRegenOpen] = useState(false)
  const [coverRegenPrompt, setCoverRegenPrompt] = useState('')
  const [coverRegenLoading, setCoverRegenLoading] = useState(false)
  const [coverRegenProgress, setCoverRegenProgress] = useState(0)

  // Step 2 -> Step 3: Progress dialog
  const [abilityProgressOpen, setAbilityProgressOpen] = useState(false)
  const [abilityProgress, setAbilityProgress] = useState(0)

  // Step 4
  const [selectedBatchId, setSelectedBatchId] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)

  const updatePositionData = (data: Partial<Position>) => {
    setPosition((prev) => ({ ...prev, ...data }))
  }

  const handleGenerate = () => {
    if (!requirement.trim()) return
    setIsGenerating(true)
    setGenerateProgress(0)

    const interval = setInterval(() => {
      setGenerateProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.floor(Math.random() * 12) + 4
      })
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setGenerateProgress(100)
      const result = mockAiPositionGeneration(requirement, requirement)

      const newPos: Position = {
        ...DEFAULT_POSITION,
        id: `draft-${Date.now()}`,
        name: result.name,
        shortName: result.shortName,
        industry: industry || result.industry,
        majors: major ? [major] : result.majors,
        salaryRange: result.salaryRange,
        description: result.description,
        responsibilities: result.responsibilities,
        requirements: result.requirements,
        careerPath: result.careerPath,
        coverImage: result.coverImage,
        certificates: result.certificates.map((c) => ({
          id: c.id,
          name: c.name,
          description: c.description || '',
        })),
      }
      setPosition(newPos)

      setIsGenerating(false)
      setTimeout(() => setStep('basic'), 400)
    }, 1800)
  }

  const steps = [
    { id: 'chat', label: 'AI 对话生成' },
    { id: 'basic', label: '基本信息确认' },
    { id: 'ability', label: '能力建模表确认' },
    { id: 'submitting', label: '提交审批' },
    { id: 'success', label: '创建成功' },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

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
          const covers = ['/cover-wms-1.png', '/cover-wms-2.png', '/cover-wms-3.png', '/placeholder.jpg']
          let nextIdx = Math.floor(Math.random() * covers.length)
          updatePositionData({ coverImage: covers[nextIdx] })
          setCoverRegenLoading(false)
          setCoverRegenProgress(0)
          setCoverRegenPrompt('')
          setCoverRegenOpen(false)
        }, 400)
      } else {
        setCoverRegenProgress(p)
      }
    }, 150)
  }

  const handleGoToAbility = () => {
    // Show progress dialog
    setAbilityProgressOpen(true)
    setAbilityProgress(0)

    const interval = setInterval(() => {
      setAbilityProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval)
          return 98
        }
        return prev + Math.floor(Math.random() * 8) + 2
      })
    }, 800)

    setTimeout(() => {
      clearInterval(interval)
      setAbilityProgress(100)
      setTimeout(() => {
        setAbilityProgressOpen(false)
        setStep('ability')
      }, 500)
    }, 10000)
  }

  const handleSubmit = async () => {
    if (!selectedBatchId) return
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newPosition = addPosition({
      ...position,
      batchId: selectedBatchId,
      status: 'draft',
      competencyConfig: (position.abilityBindings || []).map((b) => ({
        id: `comp-${b.id}`,
        abilityId: b.id,
        abilityName: b.name,
        level: b.level,
        ruleDescription: b.rubricDescription,
        weight: 1,
      })),
      createdBy: CURRENT_USER.id,
      collaborators: [CURRENT_USER.id],
      favoriteCount: 0,
    })

    submitForApproval(newPosition.id, selectedBatchId, 'user-2', '李建设')
    setSubmitting(false)
    setStep('success')
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/ai-first/positions')}>
              <X className="h-4 w-4 mr-2" />
              取消
            </Button>
            <div className="h-5 w-px bg-gray-200" />
            {currentStepIndex >= 0 && (
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">
                  步骤 {currentStepIndex + 1}
                </Badge>
                <span className="text-sm font-medium text-gray-800">{steps[currentStepIndex].label}</span>
              </div>
            )}
          </div>
          {step !== 'success' && (
            <div className="flex items-center gap-3">
              {step !== 'chat' && (
                <Button variant="outline" size="sm" onClick={() => {}}>
                  <Save className="mr-2 h-4 w-4" />
                  保存草稿
                </Button>
              )}
              {step !== 'chat' && (
                <Button variant="outline" size="sm" onClick={() => {}}>
                  <Eye className="mr-2 h-4 w-4" />
                  预览
                </Button>
              )}
              {currentStepIndex > 0 && step !== 'submitting' && (
                <Button variant="outline" size="sm" onClick={() => setStep(steps[currentStepIndex - 1].id as typeof step)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  上一步
                </Button>
              )}
              {step === 'chat' && (
                <Button size="sm" onClick={handleGenerate} disabled={!requirement || isGenerating}>
                  下一步
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {step === 'basic' && (
                <Button size="sm" onClick={handleGoToAbility}>
                  下一步
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {step === 'ability' && (
                <Button size="sm" onClick={() => setStep('submitting')}>
                  下一步
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {step === 'submitting' && (
                <Button size="sm" onClick={handleSubmit} disabled={!selectedBatchId || submitting}>
                  <Check className="mr-2 h-4 w-4" />
                  提交审批
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {step === 'chat' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">描述需求</h2>
                  <p className="text-sm text-gray-500">填写以下信息，AI 将为您智能生成岗位资源草案</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label>岗位需求</Label>
                    <Textarea
                      placeholder="请描述该岗位的工作内容、技术栈或重点方向，AI 将据此生成岗位信息。例如：负责电商平台前端开发，需要精通React和TypeScript"
                      value={requirement}
                      onChange={(e) => setRequirement(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>面向行业</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择行业" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_INDUSTRIES.map((ind) => (
                            <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>适用专业</Label>
                      <Select value={major} onValueChange={setMajor}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择专业" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_MAJORS.map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 h-12 text-base"
                  onClick={handleGenerate}
                  disabled={!requirement || isGenerating}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  {isGenerating ? 'AI 生成中...' : 'AI 智能生成'}
                </Button>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>AI 正在生成岗位草案...</span>
                      <span>{generateProgress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-purple-600 transition-all duration-200"
                        style={{ width: `${generateProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'basic' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  AI 生成的岗位草案
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">请确认并修改以下信息，确认无误后进入能力建模表</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setStep('chat')}>
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> 重新描述
                </Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={handleGoToAbility}>
                  生成能力建模表 <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </div>

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
          </div>
        )}

        {step === 'ability' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-purple-500" />
                  能力建模表确认
                </h2>
                <p className="text-sm text-gray-400 mt-0.5">AI 已根据工作职责自动匹配能力点、等级与胜任标准，请确认或调整</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setStep('basic')}>
                  <ArrowLeft className="h-4 w-4 mr-1.5" /> 返回修改
                </Button>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => setStep('submitting')}>
                  提交审批 <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </div>

            <StepAbilityModeling position={position} onUpdate={updatePositionData} aiMode />
            <StepCompetencyConfig position={position} onUpdate={updatePositionData} aiMode />
          </div>
        )}

        {step === 'submitting' && (
          <div className="max-w-xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" /> 提交审批
                </CardTitle>
                <CardDescription>请选择所属批次并提交审批</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>岗位名称</Label>
                  <p className="text-sm font-medium text-gray-800">{position.name}</p>
                </div>
                <div className="space-y-1.5">
                  <Label>所属批次 <span className="text-red-500">*</span></Label>
                  <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择批次分组" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">工作职责</p>
                    <p className="text-sm font-medium">{position.responsibilities.length} 项</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">能力绑定</p>
                    <p className="text-sm font-medium">{position.abilityBindings.length} 个</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep('ability')}>
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> 返回修改
                  </Button>
                  <Button
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    disabled={!selectedBatchId || submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> 提交中...</>
                    ) : (
                      <><Check className="h-4 w-4 mr-1.5" /> 确认提交审批</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'success' && (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">岗位创建并提交成功</h2>
            <p className="text-sm text-gray-500 mb-6">AI 已成功创建「{position.name}」并已提交审批</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push('/ai-first/positions')}>
                返回岗位列表
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  setStep('chat')
                  setRequirement('')
                  setIndustry('')
                  setMajor('')
                  setPosition({ ...DEFAULT_POSITION })
                  setSelectedBatchId('')
                }}
              >
                <Sparkles className="h-4 w-4 mr-1.5" /> 再创建一个
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Ability Generation Progress Dialog */}
      <Dialog open={abilityProgressOpen} onOpenChange={setAbilityProgressOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              正在生成能力建模表
            </DialogTitle>
            <DialogDescription>
              AI 正在根据工作职责分析并生成能力点、等级与胜任标准...
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-purple-700">
              <span>分析进度</span>
              <span>{abilityProgress}%</span>
            </div>
            <Progress value={abilityProgress} className="h-2" />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
              <span>{abilityProgress < 30 ? '正在解析工作职责...' : abilityProgress < 60 ? '正在匹配能力点...' : abilityProgress < 90 ? '正在生成胜任标准...' : '正在整理能力领域归类...'}</span>
            </div>
          </div>
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
            <DialogDescription>输入您对封面图的要求，AI 将为您生成新的岗位封面</DialogDescription>
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
          <div className="flex justify-end gap-2">
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
          </div>
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
              {coverRegenPrompt ? `正在根据要求生成封面：${coverRegenPrompt}` : '正在为您生成新的岗位封面...'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-purple-700">
              <span>生成进度</span>
              <span>{coverRegenProgress}%</span>
            </div>
            <Progress value={coverRegenProgress} className="h-2" />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
              <span>AI 正在绘制封面图像...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
