'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useData } from '@/lib/stores/data-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Check, ArrowRight, ArrowLeft, Sparkles, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Step1BasicInfo, type Step1Draft } from '@/components/position-builder/ai-assisted-2/step1-basic-info'
import { Step2AbilityModel } from '@/components/position-builder/ai-assisted-2/step2-ability-model'
import { Step3ResultTable } from '@/components/position-builder/ai-assisted-2/step3-result-table'
import type { Position } from '@/lib/types'

const CURRENT_USER = { id: 'user-1', name: '张建设' }

const DEFAULT_DRAFT: Step1Draft = {
  id: `draft-new-${Date.now()}`,
  batchId: '',
  version: 'V1.0',
  status: 'draft',
  name: '',
  shortName: '',
  industry: '',
  majors: [],
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
  rawResponsibilities: '',
  rawRequirements: '',
  rawCareerPath: '',
}

type WizardStep = 'basic' | 'ability' | 'result'

const steps = [
  { id: 'basic' as WizardStep, label: '基础信息润色', num: 1 },
  { id: 'ability' as WizardStep, label: '能力模型配置', num: 2 },
  { id: 'result' as WizardStep, label: '结果汇总', num: 3 },
]

export default function AiAssisted2NewPositionPage() {
  const router = useRouter()
  const { addPosition } = useData()
  const [step, setStep] = useState<WizardStep>('basic')
  const [draft, setDraft] = useState<Step1Draft>({ ...DEFAULT_DRAFT })

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  const updateDraft = useCallback((data: Partial<Step1Draft>) => {
    setDraft((prev) => ({ ...prev, ...data }))
  }, [])

  const handleSave = () => {
    const positionData: Omit<Position, 'id' | 'createdAt' | 'updatedAt'> = {
      batchId: draft.batchId || '',
      version: draft.version,
      status: 'draft',
      name: draft.name || '未命名岗位',
      shortName: draft.shortName || '',
      industry: draft.industry || '',
      majors: draft.majors || [],
      salaryRange: draft.salaryRange || [0, 0],
      certificates: draft.certificates || [],
      description: draft.description || '',
      responsibilities: draft.responsibilities || [],
      requirements: draft.requirements || [],
      careerPath: draft.careerPath || { horizontal: [], vertical: [] },
      abilityModel: draft.abilityModel || { nodes: [], edges: [] },
      abilityBindings: draft.abilityBindings || [],
      abilityDomains: draft.abilityDomains || [],
      competencyConfig: draft.competencyConfig || [],
      createdBy: CURRENT_USER.id,
      collaborators: [CURRENT_USER.id],
      favoriteCount: 0,
    }
    addPosition(positionData)
    router.push('/ai-assisted_2/positions')
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/ai-assisted_2/positions')}>
              <X className="h-4 w-4 mr-2" />
              取消
            </Button>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Bot className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">AI 辅助创建岗位 V2</h1>
                <p className="text-xs text-gray-400">手动建设 + AI 辅助润色与拆解</p>
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="hidden md:flex items-center gap-1">
            {steps.map((s, idx) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                    step === s.id
                      ? 'bg-purple-100 text-purple-700'
                      : idx < currentStepIndex
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-400'
                  )}
                >
                  <span
                    className={cn(
                      'h-5 w-5 rounded-full flex items-center justify-center text-[10px]',
                      step === s.id
                        ? 'bg-purple-600 text-white'
                        : idx < currentStepIndex
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 text-white'
                    )}
                  >
                    {idx < currentStepIndex ? <Check className="h-3 w-3" /> : s.num}
                  </span>
                  {s.label}
                </div>
                {idx < steps.length - 1 && <div className="w-6 h-px bg-gray-200 mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {step === 'basic' && (
          <Step1BasicInfo draft={draft} onUpdate={updateDraft} onNext={() => setStep('ability')} />
        )}
        {step === 'ability' && (
          <Step2AbilityModel position={draft} onUpdate={updateDraft} onNext={() => setStep('result')} />
        )}
        {step === 'result' && (
          <Step3ResultTable position={draft} onPrev={() => setStep('ability')} onSave={handleSave} />
        )}
      </div>
    </div>
  )
}
