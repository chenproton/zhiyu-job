'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useData } from '@/lib/stores/data-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Save, Send, Sparkles, Check } from 'lucide-react'
import Link from 'next/link'
import { StepBasicInfo } from '@/components/position-builder/step-basic-info'
import { StepAbilityModeling } from '@/components/position-builder/step-ability-modeling'
import { StepCompetencyConfig } from '@/components/position-builder/step-competency-config'
import type { Position } from '@/lib/types'

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
    // Simulate save delay
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/positions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{position.name}</h1>
            <p className="text-muted-foreground mt-1">
              {batch?.department} - {batch?.major} | 版本 {position.version}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? '保存中...' : '保存草稿'}
          </Button>
          {position.status === 'draft' && (
            <Button onClick={handleSubmit}>
              <Send className="mr-2 h-4 w-4" />
              提交审批
            </Button>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => setActiveStep(step.id)}
                  className="flex items-center gap-3 group"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                      index < currentStepIndex
                        ? 'bg-primary border-primary text-primary-foreground'
                        : index === currentStepIndex
                          ? 'border-primary text-primary'
                          : 'border-border text-muted-foreground'
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p
                      className={`font-medium ${
                        index === currentStepIndex ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      index < currentStepIndex ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Tabs value={activeStep} onValueChange={setActiveStep}>
        <TabsList className="hidden">
          <TabsTrigger value="basic">基础信息</TabsTrigger>
          <TabsTrigger value="ability">能力建模</TabsTrigger>
          <TabsTrigger value="competency">胜任力配置</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-0">
          <StepBasicInfo position={position} onUpdate={updatePositionData} />
        </TabsContent>

        <TabsContent value="ability" className="mt-0">
          <StepAbilityModeling position={position} onUpdate={updatePositionData} />
        </TabsContent>

        <TabsContent value="competency" className="mt-0">
          <StepCompetencyConfig
            position={position}
            onUpdate={updatePositionData}
          />
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => {
            const prevIndex = currentStepIndex - 1
            if (prevIndex >= 0) setActiveStep(steps[prevIndex].id)
          }}
          disabled={currentStepIndex === 0}
        >
          上一步
        </Button>
        <Button
          onClick={() => {
            const nextIndex = currentStepIndex + 1
            if (nextIndex < steps.length) setActiveStep(steps[nextIndex].id)
          }}
          disabled={currentStepIndex === steps.length - 1}
        >
          下一步
        </Button>
      </div>
    </div>
  )
}
