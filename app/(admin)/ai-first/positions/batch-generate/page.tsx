"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Wand2, Check, RotateCcw, ArrowLeft, Upload, FileText, X, Loader2, ArrowRight, Bot, ImagePlus, UserPlus } from "lucide-react"
import { StepBasicInfo } from "@/components/position-builder/step-basic-info"
import { StepAbilityModeling } from "@/components/position-builder/step-ability-modeling"
import { StepCompetencyConfig } from "@/components/position-builder/step-competency-config"
import { useData } from "@/lib/stores/data-context"
import type { Position } from "@/lib/types"
import { cn } from "@/lib/utils"
import { mockAiPositionGeneration, type AiPositionPreview } from "@/lib/ai-mock-data"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
}

interface ParseResult {
  specialty: string
  confidence: number
}

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

const CURRENT_USER = { id: 'user-1', name: '张建设' }

const COMPETENCY_LEVELS: { value: CompetencyLevel; label: string }[] = [
  { value: 'understand', label: '了解' },
  { value: 'comprehend', label: '理解' },
  { value: 'master', label: '掌握' },
  { value: 'proficient', label: '熟练' },
  { value: 'expert', label: '精通' },
]

const BATCH_NAMES = [
  "人工智能训练师",
  "数据标注工程师",
  "算法测试工程师",
  "智能客服产品经理",
  "AI 应用开发工程师",
  "机器学习运维工程师",
  "知识图谱工程师",
  "语音合成工程师",
  "计算机视觉工程师",
  "自然语言处理工程师",
]

const BATCH_LEVELS = ["初级", "中级", "高级", "初级", "中级", "高级", "中级", "初级", "高级", "中级"]

const BATCH_DESC = [
  "负责 AI 模型训练数据的准备与标注质量把控",
  "负责图像、文本等数据的标注与质检工作",
  "负责 AI 算法模型的测试与效果评估",
  "负责智能客服产品的需求分析与功能设计",
  "负责 AI 应用场景的代码开发与落地",
  "负责机器学习模型的部署、监控与维护",
  "负责知识图谱的构建、推理与应用",
  "负责语音合成系统的优化与效果调优",
  "负责图像识别、目标检测等视觉算法开发",
  "负责文本理解、生成等 NLP 任务开发",
]

export default function AiFirstBatchGeneratePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { batches, addPosition, submitForApproval } = useData()

  const [specialty, setSpecialty] = useState("")
  const [count, setCount] = useState([5])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const [industry, setIndustry] = useState("")
  const [major, setMajor] = useState("")

  // Generated positions
  const [generatedPositions, setGeneratedPositions] = useState<Position[]>([])
  const [activeTab, setActiveTab] = useState("0")

  // Inline refine wizard per position: null | positionIndex
  const [refiningIndex, setRefiningIndex] = useState<number | null>(null)
  const [refineStep, setRefineStep] = useState<'basic' | 'ability' | 'submit'>('basic')
  const [refineDraft, setRefineDraft] = useState<Position | null>(null)
  const [refineSubmitting, setRefineSubmitting] = useState(false)
  const [refineBatchId, setRefineBatchId] = useState("")

  // Ability generation progress dialog
  const [abilityProgressOpen, setAbilityProgressOpen] = useState(false)
  const [abilityProgress, setAbilityProgress] = useState(0)

  // AI 辅助编辑弹窗
  const [aiAssistOpen, setAiAssistOpen] = useState(false)
  const [aiAssistDirection, setAiAssistDirection] = useState('')
  const [aiAssistGenerating, setAiAssistGenerating] = useState(false)
  const [aiAssistPreview, setAiAssistPreview] = useState<AiPositionPreview | null>(null)
  const [aiAssistPreviewOpen, setAiAssistPreviewOpen] = useState(false)

  // 重新生成弹窗
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false)
  const [regenerateSuggestion, setRegenerateSuggestion] = useState("")
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [regenerateProgress, setRegenerateProgress] = useState(0)

  // 文件上传状态
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // 解析进度状态
  const [isParsing, setIsParsing] = useState(false)
  const [parseProgress, setParseProgress] = useState(0)
  const [parseStage, setParseStage] = useState("")
  const [parseResult, setParseResult] = useState<ParseResult | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const simulateParsing = useCallback((fileName: string) => {
    setIsParsing(true)
    setParseProgress(0)
    setParseStage("正在读取文件内容...")
    setParseResult(null)

    const stages = [
      { progress: 15, text: "正在提取文本内容...", delay: 800 },
      { progress: 35, text: "正在识别专业方向关键词...", delay: 1200 },
      { progress: 55, text: "正在分析课程体系结构...", delay: 1000 },
      { progress: 75, text: "正在匹配行业标准岗位...", delay: 1000 },
      { progress: 90, text: "正在生成解析结果...", delay: 800 },
      { progress: 100, text: "解析完成", delay: 600 },
    ]

    let currentStage = 0

    const runStage = () => {
      if (currentStage >= stages.length) {
        setIsParsing(false)
        // 模拟解析结果
        const mockSpecialties = [
          "人工智能技术应用",
          "大数据技术与应用",
          "电子商务",
          "软件技术",
          "物联网应用技术",
          "数字媒体技术",
        ]
        const result: ParseResult = {
          specialty: mockSpecialties[Math.floor(Math.random() * mockSpecialties.length)],
          confidence: 85 + Math.floor(Math.random() * 14),
        }
        setParseResult(result)
        setSpecialty(result.specialty)
        return
      }

      const stage = stages[currentStage]
      setParseProgress(stage.progress)
      setParseStage(stage.text)

      setTimeout(() => {
        currentStage++
        runStage()
      }, stage.delay)
    }

    runStage()
  }, [])

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]

    // 只接受 PDF 和 Word
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".pdf") && !file.name.endsWith(".doc") && !file.name.endsWith(".docx")) {
      alert("请上传 PDF 或 Word 格式的文件")
      return
    }

    const newFile: UploadedFile = {
      id: `file-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
    }
    setUploadedFile(newFile)
    setGenerated(false)

    // 开始模拟解析
    simulateParsing(file.name)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setParseProgress(0)
    setParseStage("")
    setParseResult(null)
    setIsParsing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const buildPositionFromIndex = (idx: number): Position => {
    const respCount = 3 + (idx % 3)
    const responsibilities = Array.from({ length: respCount }).map((_, i) => ({
      id: `resp-${idx}-${i}`,
      name: `${BATCH_NAMES[idx]}核心职责 ${i + 1}`,
      description: `负责${BATCH_NAMES[idx]}相关的具体工作执行与质量把控`,
    }))

    const abilityBindings = responsibilities.flatMap((resp, i) => [
      {
        id: `bind-${idx}-${i}-1`,
        responsibilityId: resp.id,
        source: 'custom' as const,
        name: '专业技能',
        category: '专业技能',
        level: (['master', 'proficient', 'comprehend'][i % 3] || 'master') as Position['abilityBindings'][0]['level'],
        rubricDescription: `能够独立完成${resp.name}相关工作`,
        description: '岗位核心专业技能',
        attributes: ['技能'] as string[],
      },
      {
        id: `bind-${idx}-${i}-2`,
        responsibilityId: resp.id,
        source: 'custom' as const,
        name: '沟通协作',
        category: '通用素质',
        level: 'comprehend' as Position['abilityBindings'][0]['level'],
        rubricDescription: `能够在${resp.name}过程中与团队有效沟通协作`,
        description: '团队协作与沟通能力',
        attributes: ['素养'] as string[],
      },
    ])

    return {
      id: `batch-pos-${Date.now()}-${idx}`,
      batchId: '',
      version: 'V1.0',
      status: 'draft',
      name: BATCH_NAMES[idx],
      shortName: BATCH_NAMES[idx],
      industry: industry || '互联网/IT',
      majors: major ? [major] : ['人工智能'],
      salaryRange: [8000 + idx * 2000, 15000 + idx * 4000],
      description: `${BATCH_DESC[idx]}。本岗位面向${industry || '互联网/IT'}行业，要求具备扎实的${major || '人工智能'}专业背景。`,
      responsibilities,
      requirements: [
        `${BATCH_LEVELS[idx]}及以上学历，相关专业优先`,
        `具备${BATCH_NAMES[idx]}相关经验`,
        '良好的沟通能力和团队协作精神',
        '具备较强的学习能力和问题解决能力',
      ],
      careerPath: {
        horizontal: ['相关技术岗位', '项目管理', '产品方向'],
        vertical: ['初级工程师', '中级工程师', '高级工程师', '技术专家'],
      },
      certificates: [],
      coverImage: '',
      abilityModel: { nodes: [], edges: [] },
      abilityBindings,
      abilityDomains: [],
      competencyConfig: [],
      createdBy: CURRENT_USER.id,
      collaborators: [CURRENT_USER.id],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favoriteCount: 0,
    }
  }

  const handleGenerate = () => {
    if (!specialty.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
      const positions = Array.from({ length: count[0] }).map((_, i) => buildPositionFromIndex(i))
      setGeneratedPositions(positions)
      setActiveTab('0')
      setIsGenerating(false)
      setGenerated(true)
    }, 2000)
  }

  const handleRegenerate = () => {
    setRegenerateDialogOpen(true)
  }

  const confirmRegenerate = () => {
    setRegenerateDialogOpen(false)
    setRegenerateSuggestion("")
    setIsRegenerating(true)
    setRegenerateProgress(0)

    const stages = [
      { progress: 20, delay: 400 },
      { progress: 45, delay: 500 },
      { progress: 70, delay: 500 },
      { progress: 90, delay: 400 },
      { progress: 100, delay: 300 },
    ]

    let currentStage = 0
    const runStage = () => {
      if (currentStage >= stages.length) {
        setIsRegenerating(false)
        const positions = Array.from({ length: count[0] }).map((_, i) => buildPositionFromIndex(i))
        setGeneratedPositions(positions)
        setActiveTab('0')
        setGenerated(true)
        return
      }
      const stage = stages[currentStage]
      setRegenerateProgress(stage.progress)
      setTimeout(() => {
        currentStage++
        runStage()
      }, stage.delay)
    }
    runStage()
  }

  // Inline refine wizard
  const startRefine = (idx: number) => {
    setRefiningIndex(idx)
    setRefineDraft({ ...generatedPositions[idx] })
    setRefineStep('basic')
    setRefineBatchId('')
  }

  const updateRefineDraft = (updates: Partial<Position>) => {
    setRefineDraft((prev) => (prev ? { ...prev, ...updates } : null))
  }

  const handleGoToAbility = () => {
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
        setRefineStep('ability')
      }, 500)
    }, 10000)
  }

  const handleAiAssistGenerate = () => {
    if (!refineDraft) return
    setAiAssistGenerating(true)

    setTimeout(() => {
      const result = mockAiPositionGeneration(refineDraft.name, aiAssistDirection)
      setAiAssistPreview(result)
      setAiAssistGenerating(false)
      setAiAssistOpen(false)
      setAiAssistDirection('')
      setAiAssistPreviewOpen(true)
    }, 1500)
  }

  const handleApplyAiAssist = () => {
    if (!aiAssistPreview || !refineDraft) return
    const updated: Position = {
      ...refineDraft,
      name: aiAssistPreview.name,
      shortName: aiAssistPreview.shortName,
      industry: aiAssistPreview.industry,
      majors: aiAssistPreview.majors,
      salaryRange: aiAssistPreview.salaryRange,
      description: aiAssistPreview.description,
      responsibilities: aiAssistPreview.responsibilities,
      requirements: aiAssistPreview.requirements,
      careerPath: aiAssistPreview.careerPath,
      coverImage: aiAssistPreview.coverImage,
      certificates: aiAssistPreview.certificates.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.description || '',
      })),
    }
    setRefineDraft(updated)
    setAiAssistPreview(null)
    setAiAssistPreviewOpen(false)
  }

  const handleSaveRefinedPosition = async () => {
    if (!refineBatchId || !refineDraft) return
    setRefineSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 600))

    const newPosition = addPosition({
      ...refineDraft,
      batchId: refineBatchId,
      status: 'draft',
      competencyConfig: (refineDraft.abilityBindings || []).map((b) => ({
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

    submitForApproval(newPosition.id, refineBatchId, 'user-2', '李建设')

    // Update local state to mark as saved
    if (refiningIndex !== null) {
      const next = [...generatedPositions]
      next[refiningIndex] = { ...next[refiningIndex], status: 'pending' as const, id: newPosition.id }
      setGeneratedPositions(next)
    }

    setRefineSubmitting(false)
    setRefiningIndex(null)
    setRefineDraft(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/ai-first/positions")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">批量岗位族谱生成(AI主导)</h1>
          <p className="text-muted-foreground">基于专业方向或上传的人才培养方案，AI 主导批量生成相关岗位草稿列表</p>
        </div>
      </div>

      {/* 附件上传区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-500" />
            上传人才培养方案
          </CardTitle>
          <CardDescription>支持上传 PDF / Word 格式的人才培养方案，AI 将自动解析并提取专业方向</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!uploadedFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer ${
                isDragging
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-700">
                点击上传或拖拽文件到此处
              </p>
              <p className="mt-1 text-xs text-gray-500">
                支持 PDF、Word（.doc / .docx），单个文件不超过 20MB
              </p>
            </div>
          ) : (
            <div className="rounded-lg border bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleRemoveFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* 解析进度 */}
              {isParsing && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                    <span className="text-sm text-gray-700">{parseStage}</span>
                    <span className="ml-auto text-xs text-gray-500">{parseProgress}%</span>
                  </div>
                  <Progress value={parseProgress} className="h-2" />
                </div>
              )}

              {/* 解析结果 */}
              {parseResult && !isParsing && (
                <div className="mt-4 rounded-md bg-green-50 border border-green-200 p-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">解析成功</span>
                  </div>
                  <p className="mt-1 text-sm text-green-700">
                    识别专业方向：<span className="font-semibold">{parseResult.specialty}</span>
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      置信度 {parseResult.confidence}%
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 生成配置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            生成配置
          </CardTitle>
          <CardDescription>输入专业方向和预期岗位数量，AI 将为您生成岗位族谱草稿</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="specialty">岗位需求</Label>
            <Textarea
              id="specialty"
              placeholder="例如：需要具备人工智能技术应用能力，熟悉深度学习框架，能够独立完成模型训练与部署..."
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {parseResult
                ? "已从上传文件中自动提取，您也可以手动修改"
                : "描述岗位需求，AI 将基于需求内容为您生成匹配的相关岗位草稿"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>所属行业</Label>
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
              <Label>关联专业</Label>
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>预期岗位数量</Label>
              <Badge variant="secondary">{count[0]} 个</Badge>
            </div>
            <Slider value={count} onValueChange={setCount} min={3} max={10} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>3 个</span>
              <span>10 个</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleGenerate} disabled={isGenerating || !specialty.trim() || isParsing} className="gap-2">
              <Wand2 className="h-4 w-4" />
              {isGenerating ? "AI 生成中..." : "开始生成"}
            </Button>
            <Button variant="outline" onClick={() => { setSpecialty(""); setCount([5]); setGenerated(false); handleRemoveFile() }}>
              <RotateCcw className="mr-2 h-4 w-4" />
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      {generated && (
        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI 生成结果
            </CardTitle>
            <CardDescription className="text-purple-700/70">
              已为您生成 {count[0]} 个岗位草稿，点击 Tab 切换查看，并为每个岗位单独完善与提交审批
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start bg-white border mb-4 flex-wrap h-auto py-2 gap-1">
                {generatedPositions.map((pos, idx) => (
                  <TabsTrigger
                    key={idx}
                    value={String(idx)}
                    className="text-xs data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
                  >
                    <span className="truncate max-w-[120px]">{pos.name}</span>
                    {'id' in pos && pos.id && (
                      <Check className="ml-1.5 h-3 w-3 text-green-600" />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {generatedPositions.map((pos, idx) => {
                const isSaved = pos.status !== 'draft'
                return (
                  <TabsContent key={idx} value={String(idx)}>
                    {refiningIndex === idx && refineDraft ? (
                      <div className="bg-white rounded-xl border p-5 space-y-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Bot className="h-5 w-5 text-purple-600" />
                            <h3 className="font-semibold text-gray-900">AI 完善向导：{refineDraft.name}</h3>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setAiAssistOpen(true)}
                              className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 gap-1 h-7 text-xs"
                            >
                              <Wand2 className="h-3.5 w-3.5" />
                              AI 辅助编辑
                            </Button>
                          </div>
                          <div className="flex gap-1 text-xs">
                            <span className={cn('px-2 py-1 rounded-full border', refineStep === 'basic' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-500')}>
                              1 基本信息
                            </span>
                            <span className={cn('px-2 py-1 rounded-full border', refineStep === 'ability' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-500')}>
                              2 能力建模表
                            </span>
                            <span className={cn('px-2 py-1 rounded-full border', refineStep === 'submit' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-500')}>
                              3 提交审批
                            </span>
                          </div>
                        </div>

                        {refineStep === 'basic' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-6">
                              <div className="col-span-2">
                                <StepBasicInfo position={refineDraft} onUpdate={updateRefineDraft} aiMode />
                              </div>
                              <div className="space-y-6">
                                <Card>
                                  <CardContent className="pt-6">
                                    <Label className="mb-3 block">岗位封面</Label>
                                    <div
                                      className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden relative group"
                                      onClick={() => !refineDraft.coverImage && updateRefineDraft({ coverImage: '/placeholder.svg?height=200&width=300' })}
                                    >
                                      {refineDraft.coverImage ? (
                                        <>
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img src={refineDraft.coverImage} alt="岗位封面" className="w-full h-full object-cover" />
                                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button variant="outline" size="sm" className="bg-white/90 text-gray-800 border-white hover:bg-white" onClick={(e) => { e.stopPropagation(); updateRefineDraft({ coverImage: '' }) }}>
                                              移除封面
                                            </Button>
                                          </div>
                                        </>
                                      ) : (
                                        <div className="flex flex-col items-center">
                                          <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                                          <p className="text-sm text-gray-500">点击设置封面</p>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="pt-6 space-y-4">
                                    <div>
                                      <Label className="text-gray-500 text-xs">所属批次</Label>
                                      <div className="mt-1">
                                        <Select value={refineDraft.batchId || '__none__'} onValueChange={(v) => updateRefineDraft({ batchId: v === '__none__' ? '' : v })}>
                                          <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="选择批次" /></SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="__none__">未选择批次</SelectItem>
                                            {batches.map((b) => (
                                              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-gray-500 text-xs">创建人</Label>
                                      <p className="font-medium text-gray-800 mt-1">{CURRENT_USER.name}</p>
                                    </div>
                                    <div>
                                      <Label className="text-gray-500 text-xs">共建人</Label>
                                      <div className="mt-1 border rounded-lg p-3">
                                        <div className="flex flex-wrap gap-2">
                                          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                            <span>{CURRENT_USER.name}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100">
                                      <Label className="text-gray-500 text-xs">当前版本号</Label>
                                      <p className="font-medium text-gray-800 mt-1">{refineDraft.version}</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setRefiningIndex(null)}>取消</Button>
                              <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleGoToAbility}>
                                生成能力建模表 <ArrowRight className="h-4 w-4 ml-1.5" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {refineStep === 'ability' && (
                          <div className="space-y-6">
                            <StepAbilityModeling position={refineDraft} onUpdate={updateRefineDraft} aiMode />
                            <StepCompetencyConfig position={refineDraft} onUpdate={updateRefineDraft} aiMode />
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setRefineStep('basic')}>
                                <ArrowLeft className="h-4 w-4 mr-1.5" /> 上一步
                              </Button>
                              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setRefineStep('submit')}>
                                提交审批 <ArrowRight className="h-4 w-4 ml-1.5" />
                              </Button>
                            </div>
                          </div>
                        )}

                        {refineStep === 'submit' && (
                          <div className="space-y-4 max-w-lg mx-auto">
                            <div className="space-y-1.5">
                              <Label>所属批次 <span className="text-red-500">*</span></Label>
                              <Select value={refineBatchId} onValueChange={setRefineBatchId}>
                                <SelectTrigger><SelectValue placeholder="选择批次分组" /></SelectTrigger>
                                <SelectContent>
                                  {batches.map((b) => (
                                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">工作职责</p>
                                <p className="text-sm font-medium">{refineDraft.responsibilities.length} 项</p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">能力绑定</p>
                                <p className="text-sm font-medium">{refineDraft.abilityBindings.length} 个</p>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setRefineStep('ability')}>
                                <ArrowLeft className="h-4 w-4 mr-1.5" /> 返回修改
                              </Button>
                              <Button
                                className="bg-purple-600 hover:bg-purple-700"
                                disabled={!refineBatchId || refineSubmitting}
                                onClick={handleSaveRefinedPosition}
                              >
                                {refineSubmitting ? (
                                  <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> 提交中...</>
                                ) : (
                                  <><Check className="h-4 w-4 mr-1.5" /> 确认提交审批</>
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-900">{pos.name}</h3>
                              <Badge variant="outline">{BATCH_LEVELS[idx]}</Badge>
                              {isSaved && (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                  已提交审批
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{pos.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">所属行业：</span>
                                <span className="text-gray-700">{pos.industry || '-'}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">关联专业：</span>
                                <span className="text-gray-700">{(pos.majors || []).join('、') || '-'}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">薪资范围：</span>
                                <span className="text-gray-700">{pos.salaryRange?.[0] || 0} - {pos.salaryRange?.[1] || 0} 元/月</span>
                              </div>
                              <div>
                                <span className="text-gray-400">工作职责：</span>
                                <span className="text-gray-700">{(pos.responsibilities || []).length} 项</span>
                              </div>
                            </div>
                            <div className="pt-2">
                              <p className="text-xs text-gray-400 mb-1.5">任职要求</p>
                              <ul className="text-sm text-gray-600 space-y-0.5">
                                {(pos.requirements || []).slice(0, 3).map((req, i) => (
                                  <li key={i}>• {req}</li>
                                ))}
                                {(pos.requirements || []).length > 3 && (
                                  <li className="text-gray-400">... 还有 {(pos.requirements || []).length - 3} 条</li>
                                )}
                              </ul>
                            </div>
                          </div>
                          <div className="shrink-0">
                            {!isSaved ? (
                              <Button
                                className="bg-purple-600 hover:bg-purple-700 gap-1"
                                onClick={() => startRefine(idx)}
                              >
                                <Sparkles className="h-4 w-4" /> 一键完善
                              </Button>
                            ) : (
                              <Button variant="outline" onClick={() => router.push('/ai-first/positions')}>
                                查看列表
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                )
              })}
            </Tabs>

            {isRegenerating && (
              <div className="mb-4 space-y-2 mt-4">
                <div className="flex items-center justify-between text-sm text-purple-700">
                  <span>AI 重新生成中...</span>
                  <span>{regenerateProgress}%</span>
                </div>
                <Progress value={regenerateProgress} className="h-2" />
              </div>
            )}
            <div className="mt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={handleRegenerate} disabled={isRegenerating}>
                <RotateCcw className="mr-2 h-4 w-4" />
                重新生成
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI 辅助编辑 Dialog */}
      <Dialog open={aiAssistOpen} onOpenChange={setAiAssistOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>AI 辅助完善岗位信息</DialogTitle>
            <DialogDescription>AI 将基于当前岗位为您智能生成或完善基础信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="ai-direction">岗位描述 / 工作方向</Label>
              <Textarea
                id="ai-direction"
                value={aiAssistDirection}
                onChange={(e) => setAiAssistDirection(e.target.value)}
                placeholder="请描述该岗位的工作内容、技术栈或重点方向，AI 将据此生成岗位信息。例如：负责电商平台前端开发，需要精通React和TypeScript"
                rows={4}
              />
            </div>
            {aiAssistGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>AI 生成中...</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-purple-600 animate-pulse" />
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAiAssistOpen(false)} disabled={aiAssistGenerating}>
              取消
            </Button>
            <Button
              onClick={handleAiAssistGenerate}
              disabled={aiAssistGenerating}
              className="gap-1 bg-purple-600 hover:bg-purple-700"
            >
              {aiAssistGenerating ? (
                <>生成中...</>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  开始AI生成
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI 生成结果预览 Dialog */}
      <Dialog open={aiAssistPreviewOpen} onOpenChange={setAiAssistPreviewOpen}>
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
          {aiAssistPreview && (
            <>
              <div className="overflow-hidden -mx-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={aiAssistPreview.coverImage}
                  alt="AI 生成封面"
                  className="w-full aspect-video object-cover"
                />
              </div>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">岗位名称</p>
                    <p className="font-medium text-sm">{aiAssistPreview.name}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">所属行业</p>
                    <p className="font-medium text-sm">{aiAssistPreview.industry}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">适用专业</p>
                    <p className="font-medium text-sm">{aiAssistPreview.majors.join('、')}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">薪资范围</p>
                    <p className="font-medium text-sm">{aiAssistPreview.salaryRange[0].toLocaleString()} - {aiAssistPreview.salaryRange[1].toLocaleString()} 元/月</p>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">岗位介绍</p>
                  <p className="text-sm whitespace-pre-line">{aiAssistPreview.description}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">工作职责 ({aiAssistPreview.responsibilities.length})</p>
                  <ul className="text-sm space-y-2 mt-1">
                    {aiAssistPreview.responsibilities.map((r) => (
                      <li key={r.id}>
                        <p className="font-medium">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">任职要求 ({aiAssistPreview.requirements.length})</p>
                  <ul className="text-sm space-y-1.5 mt-1">
                    {aiAssistPreview.requirements.map((r, i) => (
                      <li key={i}><span>• {r}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">相关证书 ({aiAssistPreview.certificates.length})</p>
                  <ul className="text-sm space-y-1 mt-1">
                    {aiAssistPreview.certificates.map((c) => (
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
                    <p>横向：{aiAssistPreview.careerPath.horizontal.join('、')}</p>
                    <p>纵向：{aiAssistPreview.careerPath.vertical.join(' → ')}</p>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setAiAssistPreviewOpen(false)}>
              取消
            </Button>
            <Button onClick={handleApplyAiAssist} className="gap-1 bg-purple-600 hover:bg-purple-700">
              <Check className="h-4 w-4" />
              确认应用
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
    </div>
  )
}
