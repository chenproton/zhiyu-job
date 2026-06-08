"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Wand2, Check, RotateCcw, ArrowLeft, Upload, FileText, X, Loader2 } from "lucide-react"

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

export default function AiAssistedBatchGeneratePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [specialty, setSpecialty] = useState("")
  const [count, setCount] = useState([5])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const [industry, setIndustry] = useState("")
  const [major, setMajor] = useState("")

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

  const handleGenerate = () => {
    if (!specialty.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
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
        setGenerated(false)
        setTimeout(() => setGenerated(true), 50)
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/ai-assisted/positions")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">批量岗位族谱生成(AI辅助)</h1>
          <p className="text-muted-foreground">基于专业方向或上传的人才培养方案，AI 批量生成相关岗位草稿列表</p>
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
              已为您生成 {count[0]} 个岗位草稿，请勾选感兴趣的岗位后批量创建
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: count[0] }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border bg-white p-4">
                  <input type="checkbox" className="h-4 w-4" defaultChecked={i < 3} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{["人工智能训练师", "数据标注工程师", "算法测试工程师", "智能客服产品经理", "AI 应用开发工程师", "机器学习运维工程师", "知识图谱工程师", "语音合成工程师", "计算机视觉工程师", "自然语言处理工程师"][i]}</span>
                      <Badge variant="outline">{["初级", "中级", "高级", "初级", "中级", "高级", "中级", "初级", "高级", "中级"][i]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {["负责 AI 模型训练数据的准备与标注质量把控", "负责图像、文本等数据的标注与质检工作", "负责 AI 算法模型的测试与效果评估", "负责智能客服产品的需求分析与功能设计", "负责 AI 应用场景的代码开发与落地", "负责机器学习模型的部署、监控与维护", "负责知识图谱的构建、推理与应用", "负责语音合成系统的优化与效果调优", "负责图像识别、目标检测等视觉算法开发", "负责文本理解、生成等 NLP 任务开发"][i]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {isRegenerating && (
              <div className="mb-4 space-y-2">
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
              <Button className="gap-2 bg-purple-600 hover:bg-purple-700" onClick={() => router.push('/ai-assisted/positions?batchGenerated=1')}>
                <Check className="h-4 w-4" />
                创建选中岗位
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 重新生成弹窗 */}
      <Dialog open={regenerateDialogOpen} onOpenChange={setRegenerateDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI 重新生成
            </DialogTitle>
            <DialogDescription>
              请描述您对生成结果的修改建议，AI 将根据您的反馈重新生成岗位列表
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={regenerateSuggestion}
              onChange={(e) => setRegenerateSuggestion(e.target.value)}
              placeholder="例如：希望增加更多高级岗位、减少技术类岗位、增加管理方向岗位等..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRegenerateDialogOpen(false)}>取消</Button>
            <Button onClick={confirmRegenerate} className="gap-1 bg-purple-600 hover:bg-purple-700">
              <Sparkles className="h-4 w-4" />
              确认重新生成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
