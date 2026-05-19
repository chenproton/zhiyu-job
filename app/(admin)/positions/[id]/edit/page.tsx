'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useData } from '@/lib/stores/data-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Save, Eye, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { StepBasicInfo } from '@/components/position-builder/step-basic-info'
import { StepAbilityModeling } from '@/components/position-builder/step-ability-modeling'
import { StepCompetencyConfig } from '@/components/position-builder/step-competency-config'
import type { Position } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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

  const handleSubmit = () => {
    if (!batch) return
    handleSave()
    submitForApproval(position.id, batch.workflowId, 'user-2', '李建设')
    router.push('/positions')
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

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-full mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/positions')}>
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
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">{position.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {batch?.department} - {batch?.major} | 版本 {position.version}
          </p>
        </div>

        <div className="space-y-6">
          {activeStep === 'basic' && (
            <StepBasicInfo position={position} onUpdate={updatePositionData} />
          )}
          {activeStep === 'ability' && (
            <StepAbilityModeling position={position} onUpdate={updatePositionData} />
          )}
          {activeStep === 'competency' && (
            <StepCompetencyConfig position={position} onUpdate={updatePositionData} />
          )}
        </div>
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
    </div>
  )
}
