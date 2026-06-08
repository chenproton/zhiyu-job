'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Sparkles,
  Plus,
  X,
  Loader2,
  Award,
  ExternalLink,
  Image as ImageIcon,
  Check,
} from 'lucide-react'
import { AiGenerateButton } from '@/components/ai/ai-generate-button'
import { AiConfidenceBadge } from '@/components/ai/ai-confidence-badge'
import {
  mockPositionDescriptionGeneration,
  mockPositionResponsibilitiesGeneration,
  mockPositionRequirementsGeneration,
  mockPositionCareerPathGeneration,
  type AiGeneratedContent,
} from '@/lib/ai-mock-data'
import type { Position, PositionResponsibility } from '@/lib/types'

interface StepBasicInfoProps {
  position: Position
  onUpdate: (data: Partial<Position>) => void
  aiMode?: boolean
}

// Mock 数据
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

// Mock 证书库
const MOCK_CERTIFICATES = [
  { id: 'cert-1', name: '软件设计师', url: 'https://www.ruankao.org.cn', description: '国家软件设计师资格认证' },
  { id: 'cert-2', name: '系统架构设计师', url: 'https://www.ruankao.org.cn', description: '国家系统架构设计师资格认证' },
  { id: 'cert-3', name: 'PMP', url: 'https://www.pmi.org', description: '项目管理专业人士资格认证' },
  { id: 'cert-4', name: 'AWS 云从业者', url: 'https://aws.amazon.com/certification', description: 'AWS 云计算基础认证' },
  { id: 'cert-5', name: 'CKA', url: 'https://www.cncf.io', description: 'Kubernetes 管理员认证' },
  { id: 'cert-6', name: '数据库系统工程师', url: 'https://www.ruankao.org.cn', description: '国家数据库系统工程师资格认证' },
]

interface Certificate {
  id: string
  name: string
  url: string
  description: string
  image?: string
}

type AiSuggestionField = 'description' | 'responsibilities' | 'requirements' | 'careerPath'

interface AiSuggestion {
  content: string
  data: unknown
  confidence: "high" | "medium" | "low"
  reasoning?: string
}

// 传统模式下的 Mock AI 内容
const mockAIContent = {
  description: '本岗位负责公司核心业务系统的设计与开发工作，参与系统架构设计和技术方案制定，确保系统的高可用性、高性能和可扩展性。需要具备扎实的编程基础，良好的问题分析和解决能力，以及优秀的团队协作精神。',
  responsibilities: [
    { id: 'resp-ai-1', name: '负责核心业务模块的设计、开发和维护', description: '承担核心模块的编码、测试及维护工作' },
    { id: 'resp-ai-2', name: '参与系统架构设计和技术选型决策', description: '参与技术方案评审与架构设计' },
    { id: 'resp-ai-3', name: '编写高质量的代码和技术文档', description: '确保代码规范并撰写相关文档' },
    { id: 'resp-ai-4', name: '进行代码评审，保证代码质量', description: '参与团队代码评审活动' },
    { id: 'resp-ai-5', name: '解决技术难题，持续优化系统性能', description: '排查线上问题并优化系统性能' },
  ] as PositionResponsibility[],
  requirements: [
    '本科及以上学历，计算机相关专业',
    '3年以上相关工作经验',
    '熟练掌握至少一门主流编程语言',
    '熟悉常见的设计模式和架构模式',
    '具备良好的沟通能力和团队协作精神',
    '有较强的学习能力和责任心',
  ],
  careerPath: {
    horizontal: ['技术专家', '产品经理', '项目经理', '技术顾问'],
    vertical: ['高级工程师', '技术主管', '架构师', '技术总监', 'CTO'],
  },
}

export function StepBasicInfo({ position, onUpdate, aiMode = false }: StepBasicInfoProps) {
  const [isGenerating, setIsGenerating] = useState<string | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<Partial<Record<AiSuggestionField, AiSuggestion>>>({})
  const [newResponsibility, setNewResponsibility] = useState('')
  const [newRequirement, setNewRequirement] = useState('')
  const [newHorizontal, setNewHorizontal] = useState('')
  const [newVertical, setNewVertical] = useState('')

  // AI 方向输入弹窗
  const [aiDirectionOpen, setAiDirectionOpen] = useState(false)
  const [aiDirectionField, setAiDirectionField] = useState<AiSuggestionField | null>(null)
  const [aiDirectionValue, setAiDirectionValue] = useState('')

  // 证书相关状态
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false)
  const [isNewCertDialogOpen, setIsNewCertDialogOpen] = useState(false)
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>(
    position.certificates?.map((c) => c.id) || []
  )
  const [newCert, setNewCert] = useState<Omit<Certificate, 'id'>>({
    name: '',
    url: '',
    description: '',
    image: '',
  })

  // 证书 AI 匹配
  const [certAiOpen, setCertAiOpen] = useState(false)
  const [certAiDirection, setCertAiDirection] = useState('')
  const [certAiLoading, setCertAiLoading] = useState(false)

  const openAiDirectionDialog = (field: AiSuggestionField) => {
    setAiDirectionField(field)
    setAiDirectionValue('')
    setAiDirectionOpen(true)
  }

  const confirmAiDirection = async () => {
    if (!aiDirectionField) return
    setAiDirectionOpen(false)
    await handleAIGenerate(aiDirectionField, aiDirectionValue)
    setAiDirectionValue('')
    setAiDirectionField(null)
  }

  const handleAIGenerate = async (field: AiSuggestionField, direction?: string) => {
    setIsGenerating(field)
    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, aiMode ? 1200 : 1500))

    const directionHint = direction ? `，重点关注${direction}` : ''

    if (aiMode) {
      // AI 辅助模式：生成建议卡片，不直接填充
      switch (field) {
        case 'description': {
          const result = mockPositionDescriptionGeneration({
            positionName: position.name,
            industry: position.industry,
            majors: position.majors,
          })
          setAiSuggestions(prev => ({
            ...prev,
            description: {
              content: result.content + directionHint,
              data: result.content + directionHint,
              confidence: result.confidence,
              reasoning: result.reasoning + (direction ? `（用户指定方向：${direction}）` : ''),
            },
          }))
          break
        }
        case 'responsibilities': {
          const data = mockPositionResponsibilitiesGeneration(position.name, position.industry)
          const content = data.map((r, i) => `${i + 1}. ${r.name}\n   ${r.description}`).join('\n\n')
          setAiSuggestions(prev => ({
            ...prev,
            responsibilities: {
              content: content + (direction ? `\n\n【用户指定方向】${direction}` : ''),
              data,
              confidence: 'high',
              reasoning: `基于岗位「${position.name}」的核心职责特征生成` + (direction ? `（用户指定方向：${direction}）` : ''),
            },
          }))
          break
        }
        case 'requirements': {
          const data = mockPositionRequirementsGeneration(position.name)
          const content = data.map((r, i) => `${i + 1}. ${r}`).join('\n')
          setAiSuggestions(prev => ({
            ...prev,
            requirements: {
              content: content + (direction ? `\n\n【用户指定方向】${direction}` : ''),
              data,
              confidence: 'high',
              reasoning: `基于岗位「${position.name}」的任职要求模型生成` + (direction ? `（用户指定方向：${direction}）` : ''),
            },
          }))
          break
        }
        case 'careerPath': {
          const data = mockPositionCareerPathGeneration(position.name)
          const content = `横向发展：${data.horizontal.join('、')}\n\n纵向晋升：${data.vertical.join(' → ')}`
          setAiSuggestions(prev => ({
            ...prev,
            careerPath: {
              content: content + (direction ? `\n\n【用户指定方向】${direction}` : ''),
              data,
              confidence: 'medium',
              reasoning: `基于${position.industry || '互联网'}行业常见职业发展路径生成` + (direction ? `（用户指定方向：${direction}）` : ''),
            },
          }))
          break
        }
      }
    } else {
      // 传统模式：直接填充数据
      switch (field) {
        case 'description':
          onUpdate({ description: mockAIContent.description + directionHint })
          break
        case 'responsibilities':
          onUpdate({ responsibilities: mockAIContent.responsibilities })
          break
        case 'requirements':
          onUpdate({ requirements: mockAIContent.requirements })
          break
        case 'careerPath':
          onUpdate({ careerPath: mockAIContent.careerPath })
          break
      }
    }

    setIsGenerating(null)
  }

  const handleAdoptSuggestion = (field: AiSuggestionField) => {
    const suggestion = aiSuggestions[field]
    if (!suggestion) return

    switch (field) {
      case 'description':
        onUpdate({ description: suggestion.data as string })
        break
      case 'responsibilities':
        onUpdate({ responsibilities: suggestion.data as PositionResponsibility[] })
        break
      case 'requirements':
        onUpdate({ requirements: suggestion.data as string[] })
        break
      case 'careerPath':
        onUpdate({ careerPath: suggestion.data as Position['careerPath'] })
        break
    }

    setAiSuggestions(prev => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleDismissSuggestion = (field: AiSuggestionField) => {
    setAiSuggestions(prev => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const renderAiSuggestionCard = (field: AiSuggestionField) => {
    const suggestion = aiSuggestions[field]
    if (!suggestion) return null

    return (
      <div className="mt-2 rounded-lg border border-purple-200 bg-purple-50/30 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">AI 生成建议</span>
            <AiConfidenceBadge confidence={suggestion.confidence} />
          </div>
          <button
            type="button"
            onClick={() => handleDismissSuggestion(field)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {suggestion.reasoning && (
          <p className="text-xs text-gray-500 mb-2">生成依据：{suggestion.reasoning}</p>
        )}
        <div className="max-h-[160px] overflow-y-auto rounded-md bg-white border border-purple-100 p-3 text-sm text-gray-700 whitespace-pre-line mb-3">
          {suggestion.content}
        </div>
        <div className="flex items-center justify-end gap-2">
          <AiGenerateButton
            onClick={() => handleAIGenerate(field)}
            loading={isGenerating === field}
            label="重新生成"
            size="sm"
          />
          <Button
            size="sm"
            onClick={() => handleAdoptSuggestion(field)}
            className="gap-1 bg-purple-600 hover:bg-purple-700"
          >
            <Check className="h-3.5 w-3.5" />
            采纳
          </Button>
        </div>
      </div>
    )
  }

  const renderAIButton = (field: AiSuggestionField, label: string) => {
    if (aiMode) {
      return (
        <AiGenerateButton
          onClick={() => openAiDirectionDialog(field)}
          loading={isGenerating === field}
          label={label}
          size="sm"
        />
      )
    }
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => openAiDirectionDialog(field)}
        disabled={isGenerating !== null}
      >
        {isGenerating === field ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        {label}
      </Button>
    )
  }

  const addResponsibility = () => {
    if (!newResponsibility.trim()) return
    const newItem: PositionResponsibility = {
      id: `resp-${Date.now()}`,
      name: newResponsibility.trim(),
      description: '',
    }
    onUpdate({ responsibilities: [...position.responsibilities, newItem] })
    setNewResponsibility('')
  }

  const removeResponsibility = (index: number) => {
    onUpdate({ responsibilities: position.responsibilities.filter((_, i) => i !== index) })
  }

  const addRequirement = () => {
    if (!newRequirement.trim()) return
    onUpdate({ requirements: [...position.requirements, newRequirement.trim()] })
    setNewRequirement('')
  }

  const removeRequirement = (index: number) => {
    onUpdate({ requirements: position.requirements.filter((_, i) => i !== index) })
  }

  const addHorizontalPath = () => {
    if (!newHorizontal.trim()) return
    onUpdate({
      careerPath: {
        ...position.careerPath,
        horizontal: [...position.careerPath.horizontal, newHorizontal.trim()],
      },
    })
    setNewHorizontal('')
  }

  const removeHorizontalPath = (index: number) => {
    onUpdate({
      careerPath: {
        ...position.careerPath,
        horizontal: position.careerPath.horizontal.filter((_, i) => i !== index),
      },
    })
  }

  const addVerticalPath = () => {
    if (!newVertical.trim()) return
    onUpdate({
      careerPath: {
        ...position.careerPath,
        vertical: [...position.careerPath.vertical, newVertical.trim()],
      },
    })
    setNewVertical('')
  }

  const removeVerticalPath = (index: number) => {
    onUpdate({
      careerPath: {
        ...position.careerPath,
        vertical: position.careerPath.vertical.filter((_, i) => i !== index),
      },
    })
  }

  const handleSelectCertificate = (certId: string, checked: boolean) => {
    if (checked) {
      setSelectedCertIds([...selectedCertIds, certId])
    } else {
      setSelectedCertIds(selectedCertIds.filter((id) => id !== certId))
    }
  }

  const handleConfirmCertificates = () => {
    const selectedCerts = MOCK_CERTIFICATES.filter((c) => selectedCertIds.includes(c.id))
    const existingCustomCerts =
      position.certificates?.filter((c) => !MOCK_CERTIFICATES.some((mc) => mc.id === c.id)) || []
    onUpdate({ certificates: [...selectedCerts, ...existingCustomCerts] })
    setIsCertDialogOpen(false)
  }

  const handleAddNewCertificate = () => {
    if (!newCert.name) return
    const cert: Certificate = {
      id: `cert-custom-${Date.now()}`,
      ...newCert,
    }
    onUpdate({ certificates: [...(position.certificates || []), cert] })
    setNewCert({ name: '', url: '', description: '', image: '' })
    setIsNewCertDialogOpen(false)
  }

  const handleRemoveCertificate = (certId: string) => {
    onUpdate({ certificates: position.certificates?.filter((c) => c.id !== certId) || [] })
    setSelectedCertIds(selectedCertIds.filter((id) => id !== certId))
  }

  const handleAiMatchCertificates = async () => {
    setCertAiLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const mockCerts = [
      { id: `cert-ai-1-${Date.now()}`, name: 'PMP 项目管理专业人士认证', description: '由美国项目管理协会（PMI）颁发' },
      { id: `cert-ai-2-${Date.now()}`, name: 'NPDP 产品经理国际资格认证', description: '产品开发与管理协会（PDMA）颁发' },
      { id: `cert-ai-3-${Date.now()}`, name: 'CPPM 注册职业采购经理', description: '美国采购协会颁发' },
      { id: `cert-ai-4-${Date.now()}`, name: '物流师职业资格证书', description: '中国物流与采购联合会颁发' },
      { id: `cert-ai-5-${Date.now()}`, name: '信息系统项目管理师', description: '国家计算机技术与软件专业技术资格' },
      { id: `cert-ai-6-${Date.now()}`, name: '供应链管理专家（SCMP）', description: '中国物流与采购联合会颁发' },
    ]

    const count = Math.floor(Math.random() * 3) + 2
    const shuffled = mockCerts.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, count)

    onUpdate({ certificates: [...(position.certificates || []), ...selected] })
    setCertAiLoading(false)
    setCertAiOpen(false)
    setCertAiDirection('')
  }

  return (
    <div className="space-y-6">
      {/* Merged Basic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Row 1: Name + Short Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">岗位名称</Label>
              <Input
                id="name"
                value={position.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                placeholder="例如：Java 后端开发工程师"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shortName">岗位简称</Label>
              <Input
                id="shortName"
                value={position.shortName}
                onChange={(e) => onUpdate({ shortName: e.target.value })}
                placeholder="例如：Java开发"
              />
            </div>
          </div>

          {/* Row 2: Industry + Major */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="industry">所属行业</Label>
              <Select
                value={position.industry}
                onValueChange={(value) => onUpdate({ industry: value })}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="选择行业" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="major">关联专业</Label>
              <Select
                value={position.majors[0] || ''}
                onValueChange={(value) => onUpdate({ majors: [value] })}
              >
                <SelectTrigger id="major">
                  <SelectValue placeholder="选择专业" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_MAJORS.map((major) => (
                    <SelectItem key={major} value={major}>
                      {major}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Salary Range */}
          <div className="grid gap-2">
            <Label>薪资范围（元/月）</Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={position.salaryRange[0]}
                onChange={(e) =>
                  onUpdate({
                    salaryRange: [Number(e.target.value), position.salaryRange[1]],
                  })
                }
                placeholder="最低"
                className="w-32"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                value={position.salaryRange[1]}
                onChange={(e) =>
                  onUpdate({
                    salaryRange: [position.salaryRange[0], Number(e.target.value)],
                  })
                }
                placeholder="最高"
                className="w-32"
              />
            </div>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">岗位介绍</Label>
              {renderAIButton('description', aiMode ? 'AI 生成文案' : 'AI 起草')}
            </div>
            <Textarea
              id="description"
              value={position.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="描述该岗位的主要工作内容和特点..."
              rows={4}
            />
            {aiMode && renderAiSuggestionCard('description')}
          </div>
        </CardContent>
      </Card>

      {/* Responsibilities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">工作职责</CardTitle>
          {renderAIButton('responsibilities', 'AI 生成')}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {position.responsibilities.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                <Badge variant="outline" className="shrink-0">
                  {index + 1}
                </Badge>
                <Input
                  value={item.name}
                  onChange={(e) => {
                    const next = position.responsibilities.map((r, i) =>
                      i === index ? { ...r, name: e.target.value } : r
                    )
                    onUpdate({ responsibilities: next })
                  }}
                  className="flex-1 text-sm h-8"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeResponsibility(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="添加工作职责..."
                value={newResponsibility}
                onChange={(e) => setNewResponsibility(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addResponsibility()}
              />
              <Button variant="outline" onClick={addResponsibility}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {aiMode && renderAiSuggestionCard('responsibilities')}
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">任职要求</CardTitle>
          {renderAIButton('requirements', 'AI 生成')}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {position.requirements.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="outline" className="shrink-0">
                  {index + 1}
                </Badge>
                <Input
                  value={item}
                  onChange={(e) => {
                    const next = position.requirements.map((r, i) =>
                      i === index ? e.target.value : r
                    )
                    onUpdate({ requirements: next })
                  }}
                  className="flex-1 text-sm h-8"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeRequirement(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="添加任职要求..."
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addRequirement()}
              />
              <Button variant="outline" onClick={addRequirement}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {aiMode && renderAiSuggestionCard('requirements')}
        </CardContent>
      </Card>

      {/* Career Path */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">发展路径</CardTitle>
          {renderAIButton('careerPath', 'AI 生成')}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium mb-2">横向发展</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {position.careerPath.horizontal.map((item, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {item}
                    <button onClick={() => removeHorizontalPath(index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="添加横向发展方向..."
                  value={newHorizontal}
                  onChange={(e) => setNewHorizontal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addHorizontalPath()}
                  className="flex-1"
                />
                <Button variant="outline" size="icon" onClick={addHorizontalPath}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">纵向发展</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {position.careerPath.vertical.map((item, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {item}
                    <button onClick={() => removeVerticalPath(index)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="添加纵向发展方向..."
                  value={newVertical}
                  onChange={(e) => setNewVertical(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addVerticalPath()}
                  className="flex-1"
                />
                <Button variant="outline" size="icon" onClick={addVerticalPath}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          {aiMode && renderAiSuggestionCard('careerPath')}
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">相关证书</CardTitle>
          <div className="flex gap-2">
            {aiMode && (
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 gap-1"
                onClick={() => setCertAiOpen(true)}
                disabled={certAiLoading}
              >
                {certAiLoading ? (
                  <Sparkles className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                AI 匹配
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setIsCertDialogOpen(true)}>
              从资源库选择
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsNewCertDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新增证书
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!position.certificates || position.certificates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>暂无相关证书</p>
            </div>
          ) : (
            <div className="space-y-3">
              {position.certificates.map((cert) => (
                <div key={cert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{cert.name}</span>
                      {cert.url && (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    {cert.description && (
                      <p className="text-sm text-muted-foreground mt-0.5">{cert.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveCertificate(cert.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 从资源库选择证书对话框 */}
      <Dialog open={isCertDialogOpen} onOpenChange={setIsCertDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>从资源库选择证书</DialogTitle>
            <DialogDescription>选择与该岗位相关的职业资格证书</DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-80 overflow-y-auto space-y-2">
            {MOCK_CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer"
                onClick={() => handleSelectCertificate(cert.id, !selectedCertIds.includes(cert.id))}
              >
                <Checkbox
                  checked={selectedCertIds.includes(cert.id)}
                  onCheckedChange={(checked) => handleSelectCertificate(cert.id, !!checked)}
                />
                <div className="flex-1">
                  <div className="font-medium">{cert.name}</div>
                  <div className="text-sm text-muted-foreground">{cert.description}</div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCertDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleConfirmCertificates}>确认选择</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI 方向输入对话框 */}
      <Dialog open={aiDirectionOpen} onOpenChange={setAiDirectionOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>AI 生成方向</DialogTitle>
            <DialogDescription>
              请描述您希望 AI 重点关注的方向或特殊要求，留空则使用默认生成策略
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={aiDirectionValue}
              onChange={(e) => setAiDirectionValue(e.target.value)}
              placeholder="例如：侧重于仓储物流自动化方向、需要强调数据分析能力、面向电商行业等..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiDirectionOpen(false)}>
              取消
            </Button>
            <Button onClick={confirmAiDirection} className="gap-1 bg-purple-600 hover:bg-purple-700">
              <Sparkles className="h-4 w-4" />
              确认生成
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 证书 AI 匹配对话框 */}
      <Dialog open={certAiOpen} onOpenChange={setCertAiOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI 证书匹配
            </DialogTitle>
            <DialogDescription>
              请描述您希望 AI 重点匹配的证书方向，留空则使用默认策略
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={certAiDirection}
              onChange={(e) => setCertAiDirection(e.target.value)}
              placeholder="例如：侧重于项目管理类证书、需要供应链管理相关认证等..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCertAiOpen(false)}>
              取消
            </Button>
            <Button
              onClick={handleAiMatchCertificates}
              disabled={certAiLoading}
              className="gap-1 bg-purple-600 hover:bg-purple-700"
            >
              {certAiLoading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  匹配中...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  确认匹配
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新增证书对话框 */}
      <Dialog open={isNewCertDialogOpen} onOpenChange={setIsNewCertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增证书</DialogTitle>
            <DialogDescription>添加一个新的职业资格证书</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label>证书名称</Label>
              <Input
                value={newCert.name}
                onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                placeholder="例如：AWS 云从业者认证"
              />
            </div>
            <div className="grid gap-2">
              <Label>相关网址</Label>
              <Input
                value={newCert.url}
                onChange={(e) => setNewCert({ ...newCert, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-2">
              <Label>证书介绍</Label>
              <Textarea
                value={newCert.description}
                onChange={(e) => setNewCert({ ...newCert, description: e.target.value })}
                placeholder="简要描述该证书..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>证书图片</Label>
              <div className="flex gap-2">
                <Input
                  value={newCert.image}
                  onChange={(e) => setNewCert({ ...newCert, image: e.target.value })}
                  placeholder="图片链接（可选）"
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCertDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddNewCertificate} disabled={!newCert.name}>
              添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
