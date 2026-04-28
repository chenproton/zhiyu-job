'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type {
  Batch,
  Position,
  Workflow,
  Ability,
  ApprovalRecord,
  DashboardStats,
} from '@/lib/types'
import {
  mockBatches,
  mockPositions,
  mockWorkflows,
  mockAbilities,
  mockApprovalRecords,
} from '@/lib/mock-data'

interface DataContextType {
  // 数据
  batches: Batch[]
  positions: Position[]
  workflows: Workflow[]
  abilities: Ability[]
  approvals: ApprovalRecord[]
  favorites: string[] // position ids
  
  // 统计
  stats: DashboardStats
  
  // 批次操作
  addBatch: (batch: Omit<Batch, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBatch: (id: string, data: Partial<Batch>) => void
  deleteBatch: (id: string) => void
  
  // 岗位操作
  addPosition: (position: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>) => Position
  updatePosition: (id: string, data: Partial<Position>) => void
  deletePosition: (id: string) => void
  
  // 审批流操作
  addWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt'>) => void
  updateWorkflow: (id: string, data: Partial<Workflow>) => void
  deleteWorkflow: (id: string) => void
  
  // 能力操作
  addAbility: (ability: Omit<Ability, 'id' | 'createdAt'>) => void
  updateAbility: (id: string, data: Partial<Ability>) => void
  deleteAbility: (id: string) => void
  
  // 审批操作
  submitForApproval: (positionId: string, workflowId: string, submittedBy: string, submittedByName: string) => void
  approveApproval: (approvalId: string, reviewerId: string, reviewerName: string, comment: string) => void
  rejectApproval: (approvalId: string, reviewerId: string, reviewerName: string, comment: string) => void
  
  // 收藏操作
  toggleFavorite: (positionId: string) => void
  isFavorite: (positionId: string) => boolean
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const FAVORITES_KEY = 'career-platform-favorites'

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function calculateStats(batches: Batch[], positions: Position[], approvals: ApprovalRecord[], abilities: Ability[]): DashboardStats {
  return {
    totalBatches: batches.length,
    openBatches: batches.filter(b => b.status === 'open').length,
    totalPositions: positions.length,
    publishedPositions: positions.filter(p => p.status === 'published').length,
    pendingApprovals: approvals.filter(a => a.status === 'pending').length,
    totalAbilities: abilities.length,
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [batches, setBatches] = useState<Batch[]>(mockBatches)
  const [positions, setPositions] = useState<Position[]>(mockPositions)
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows)
  const [abilities, setAbilities] = useState<Ability[]>(mockAbilities)
  const [approvals, setApprovals] = useState<ApprovalRecord[]>(mockApprovalRecords)
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 从 localStorage 恢复收藏
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch {
        // 忽略解析错误
      }
    }
    setIsLoaded(true)
  }, [])

  // 保存收藏到 localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }
  }, [favorites, isLoaded])

  const stats = calculateStats(batches, positions, approvals, abilities)

  // 批次操作
  const addBatch = (data: Omit<Batch, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newBatch: Batch = {
      ...data,
      id: generateId('batch'),
      createdAt: now,
      updatedAt: now,
    }
    setBatches(prev => [...prev, newBatch])
  }

  const updateBatch = (id: string, data: Partial<Batch>) => {
    setBatches(prev =>
      prev.map(batch =>
        batch.id === id
          ? { ...batch, ...data, updatedAt: new Date().toISOString() }
          : batch
      )
    )
  }

  const deleteBatch = (id: string) => {
    setBatches(prev => prev.filter(batch => batch.id !== id))
  }

  // 岗位操作
  const addPosition = (data: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newPosition: Position = {
      ...data,
      id: generateId('position'),
      createdAt: now,
      updatedAt: now,
    }
    setPositions(prev => [...prev, newPosition])
    
    // 更新批次中的岗位计数
    updateBatch(data.batchId, {
      positionCount: (batches.find(b => b.id === data.batchId)?.positionCount ?? 0) + 1,
    })
    
    return newPosition
  }

  const updatePosition = (id: string, data: Partial<Position>) => {
    setPositions(prev =>
      prev.map(position =>
        position.id === id
          ? { ...position, ...data, updatedAt: new Date().toISOString() }
          : position
      )
    )
  }

  const deletePosition = (id: string) => {
    const position = positions.find(p => p.id === id)
    if (position) {
      setPositions(prev => prev.filter(p => p.id !== id))
      // 更新批次中的岗位计数
      const batch = batches.find(b => b.id === position.batchId)
      if (batch) {
        updateBatch(batch.id, {
          positionCount: Math.max(0, batch.positionCount - 1),
        })
      }
    }
  }

  // 审批流操作
  const addWorkflow = (data: Omit<Workflow, 'id' | 'createdAt'>) => {
    const newWorkflow: Workflow = {
      ...data,
      id: generateId('workflow'),
      createdAt: new Date().toISOString(),
    }
    setWorkflows(prev => [...prev, newWorkflow])
  }

  const updateWorkflow = (id: string, data: Partial<Workflow>) => {
    setWorkflows(prev =>
      prev.map(workflow =>
        workflow.id === id ? { ...workflow, ...data } : workflow
      )
    )
  }

  const deleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(workflow => workflow.id !== id))
  }

  // 能力操作
  const addAbility = (data: Omit<Ability, 'id' | 'createdAt'>) => {
    const newAbility: Ability = {
      ...data,
      id: generateId('ability'),
      createdAt: new Date().toISOString(),
    }
    setAbilities(prev => [...prev, newAbility])
  }

  const updateAbility = (id: string, data: Partial<Ability>) => {
    setAbilities(prev =>
      prev.map(ability =>
        ability.id === id ? { ...ability, ...data } : ability
      )
    )
  }

  const deleteAbility = (id: string) => {
    setAbilities(prev => prev.filter(ability => ability.id !== id))
  }

  // 审批操作
  const submitForApproval = (
    positionId: string,
    workflowId: string,
    submittedBy: string,
    submittedByName: string
  ) => {
    const position = positions.find(p => p.id === positionId)
    if (!position) return

    const now = new Date().toISOString()
    const newApproval: ApprovalRecord = {
      id: generateId('approval'),
      positionId,
      positionName: position.name,
      workflowId,
      currentStepIndex: 0,
      status: 'pending',
      submittedBy,
      submittedByName,
      history: [],
      createdAt: now,
      updatedAt: now,
    }
    setApprovals(prev => [...prev, newApproval])
    
    // 更新岗位状态为审批中
    updatePosition(positionId, { status: 'pending' })
  }

  const approveApproval = (
    approvalId: string,
    reviewerId: string,
    reviewerName: string,
    comment: string
  ) => {
    const approval = approvals.find(a => a.id === approvalId)
    if (!approval) return

    const workflow = workflows.find(w => w.id === approval.workflowId)
    if (!workflow) return

    const currentStep = workflow.steps[approval.currentStepIndex]
    const now = new Date().toISOString()

    const historyItem = {
      id: generateId('history'),
      stepId: currentStep.id,
      stepName: currentStep.name,
      reviewerId,
      reviewerName,
      status: 'approved' as const,
      comment,
      createdAt: now,
    }

    const isLastStep = approval.currentStepIndex >= workflow.steps.length - 1

    setApprovals(prev =>
      prev.map(a =>
        a.id === approvalId
          ? {
              ...a,
              currentStepIndex: isLastStep ? a.currentStepIndex : a.currentStepIndex + 1,
              status: isLastStep ? 'approved' : 'pending',
              history: [...a.history, historyItem],
              updatedAt: now,
            }
          : a
      )
    )

    // 如果是最后一步，更新岗位状态为已通过
    if (isLastStep) {
      updatePosition(approval.positionId, { status: 'approved' })
    }
  }

  const rejectApproval = (
    approvalId: string,
    reviewerId: string,
    reviewerName: string,
    comment: string
  ) => {
    const approval = approvals.find(a => a.id === approvalId)
    if (!approval) return

    const workflow = workflows.find(w => w.id === approval.workflowId)
    if (!workflow) return

    const currentStep = workflow.steps[approval.currentStepIndex]
    const now = new Date().toISOString()

    const historyItem = {
      id: generateId('history'),
      stepId: currentStep.id,
      stepName: currentStep.name,
      reviewerId,
      reviewerName,
      status: 'rejected' as const,
      comment,
      createdAt: now,
    }

    setApprovals(prev =>
      prev.map(a =>
        a.id === approvalId
          ? {
              ...a,
              status: 'rejected',
              history: [...a.history, historyItem],
              updatedAt: now,
            }
          : a
      )
    )

    // 更新岗位状态为已驳回
    updatePosition(approval.positionId, { status: 'rejected' })
  }

  // 收藏操作
  const toggleFavorite = (positionId: string) => {
    setFavorites(prev =>
      prev.includes(positionId)
        ? prev.filter(id => id !== positionId)
        : [...prev, positionId]
    )
  }

  const isFavorite = (positionId: string) => {
    return favorites.includes(positionId)
  }

  if (!isLoaded) {
    return null
  }

  return (
    <DataContext.Provider
      value={{
        batches,
        positions,
        workflows,
        abilities,
        approvals,
        favorites,
        stats,
        addBatch,
        updateBatch,
        deleteBatch,
        addPosition,
        updatePosition,
        deletePosition,
        addWorkflow,
        updateWorkflow,
        deleteWorkflow,
        addAbility,
        updateAbility,
        deleteAbility,
        submitForApproval,
        approveApproval,
        rejectApproval,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
