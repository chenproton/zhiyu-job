'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
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
import { Sparkles, Plus, X, Loader2, Award, ExternalLink, Image as ImageIcon } from 'lucide-react'
import type { Position, PositionResponsibility } from '@/lib/types'

interface StepBasicInfoProps {
  position: Position
  onUpdate: (data: Partial<Position>) => void
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

// Mock AI 生成的内容
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

export function StepBasicInfo({ position, onUpdate }: StepBasicInfoProps) {
  const [isGenerating, setIsGenerating] = useState<string | null>(null)
  const [newResponsibility, setNewResponsibility] = useState('')
  const [newRequirement, setNewRequirement] = useState('')
  const [newHorizontal, setNewHorizontal] = useState('')
  const [newVertical, setNewVertical] = useState('')
  
  // 证书相关状态
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false)
  const [isNewCertDialogOpen, setIsNewCertDialogOpen] = useState(false)
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>(
    position.certificates?.map(c => c.id) || []
  )
  const [newCert, setNewCert] = useState<Omit<Certificate, 'id'>>({
    name: '',
    url: '',
    description: '',
    image: '',
  })

  const handleAIGenerate = async (field: string) => {
    setIsGenerating(field)
    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    switch (field) {
      case 'description':
        onUpdate({ description: mockAIContent.description })
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

    setIsGenerating(null)
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
      setSelectedCertIds(selectedCertIds.filter(id => id !== certId))
    }
  }

  const handleConfirmCertificates = () => {
    const selectedCerts = MOCK_CERTIFICATES.filter(c => selectedCertIds.includes(c.id))
    const existingCustomCerts = position.certificates?.filter(c => !MOCK_CERTIFICATES.some(mc => mc.id === c.id)) || []
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
    onUpdate({ certificates: position.certificates?.filter(c => c.id !== certId) || [] })
    setSelectedCertIds(selectedCertIds.filter(id => id !== certId))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left Column - Basic Info */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>填写岗位的基础信息</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel>岗位名称</FieldLabel>
                <Input
                  value={position.name}
                  onChange={(e) => onUpdate({ name: e.target.value })}
                  placeholder="例如：Java 后端开发工程师"
                />
              </Field>
              <Field>
                <FieldLabel>岗位简称</FieldLabel>
                <Input
                  value={position.shortName}
                  onChange={(e) => onUpdate({ shortName: e.target.value })}
                  placeholder="例如：Java开发"
                />
              </Field>
              <Field>
                <FieldLabel>所属行业</FieldLabel>
                <Select
                  value={position.industry}
                  onValueChange={(value) => onUpdate({ industry: value })}
                >
                  <SelectTrigger>
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
              </Field>
              <Field>
                <FieldLabel>关联专业</FieldLabel>
                <Select
                  value={position.majors[0] || ''}
                  onValueChange={(value) => onUpdate({ majors: [value] })}
                >
                  <SelectTrigger>
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
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>岗位介绍</CardTitle>
              <CardDescription>描述该岗位的主要工作内容和特点</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAIGenerate('description')}
              disabled={isGenerating !== null}
            >
              {isGenerating === 'description' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              AI 起草
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              value={position.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="请输入岗位介绍..."
              rows={5}
            />
          </CardContent>
        </Card>

        {/* Certificates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>相关证书</CardTitle>
              <CardDescription>该岗位相关的职业资格证书</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCertDialogOpen(true)}
              >
                从资源库选择
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsNewCertDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                新增证书
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {(!position.certificates || position.certificates.length === 0) ? (
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
      </div>

      {/* Right Column - Lists */}
      <div className="space-y-6">
        {/* Responsibilities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>工作职责</CardTitle>
              <CardDescription>列出该岗位的主要工作职责</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAIGenerate('responsibilities')}
              disabled={isGenerating !== null}
            >
              {isGenerating === 'responsibilities' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              AI 生成
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {position.responsibilities.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Badge variant="outline" className="shrink-0">
                    {index + 1}
                  </Badge>
                  <span className="flex-1 text-sm">{item.name}</span>
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
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>任职要求</CardTitle>
              <CardDescription>列出该岗位的任职资格要求</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAIGenerate('requirements')}
              disabled={isGenerating !== null}
            >
              {isGenerating === 'requirements' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              AI 生成
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {position.requirements.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className="shrink-0">
                    {index + 1}
                  </Badge>
                  <span className="flex-1 text-sm">{item}</span>
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
          </CardContent>
        </Card>

        {/* Career Path */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>发展路径</CardTitle>
              <CardDescription>设置职业发展的横向和纵向路径</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAIGenerate('careerPath')}
              disabled={isGenerating !== null}
            >
              {isGenerating === 'careerPath' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              AI 生成
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      </div>

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
            <Button variant="outline" onClick={() => setIsCertDialogOpen(false)}>取消</Button>
            <Button onClick={handleConfirmCertificates}>确认选择</Button>
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
          <FieldGroup className="gap-4 py-4">
            <Field>
              <FieldLabel>证书名称</FieldLabel>
              <Input
                value={newCert.name}
                onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                placeholder="例如：AWS 云从业者认证"
              />
            </Field>
            <Field>
              <FieldLabel>相关网址</FieldLabel>
              <Input
                value={newCert.url}
                onChange={(e) => setNewCert({ ...newCert, url: e.target.value })}
                placeholder="https://..."
              />
            </Field>
            <Field>
              <FieldLabel>证书介绍</FieldLabel>
              <Textarea
                value={newCert.description}
                onChange={(e) => setNewCert({ ...newCert, description: e.target.value })}
                placeholder="简要描述该证书..."
                rows={3}
              />
            </Field>
            <Field>
              <FieldLabel>证书图片</FieldLabel>
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
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCertDialogOpen(false)}>取消</Button>
            <Button onClick={handleAddNewCertificate} disabled={!newCert.name}>添加</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
