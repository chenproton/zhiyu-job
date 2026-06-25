import type { PositionRecommendation } from '@/lib/types'

export const mockRecommendations: PositionRecommendation[] = [
  {
    id: 'rec-1',
    major: '软件工程',
    positionId: 'position-1',
    positionType: 'enterprise',
    reason: '核心对口岗位，Java后端需求量大',
    order: 1,
    createdBy: 'user-1',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 'rec-2',
    major: '软件工程',
    positionId: 'position-2',
    positionType: 'enterprise',
    reason: '前端开发是软件工程专业重要就业方向',
    order: 2,
    createdBy: 'user-1',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 'rec-3',
    major: '软件工程',
    positionId: 'position-9',
    positionType: 'teaching',
    reason: '教学实践岗，强化工程实践能力',
    order: 3,
    createdBy: 'user-1',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 'rec-4',
    major: '人工智能',
    positionId: 'position-3',
    positionType: 'enterprise',
    reason: '人工智能专业核心算法岗位',
    order: 1,
    createdBy: 'user-2',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 'rec-5',
    major: '人工智能',
    positionId: 'position-10',
    positionType: 'teaching',
    reason: '教学实践岗，培养AI工程与科研能力',
    order: 2,
    createdBy: 'user-2',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 'rec-6',
    major: '市场营销',
    positionId: 'position-5',
    positionType: 'enterprise',
    reason: '市场营销专业对口岗位',
    order: 1,
    createdBy: 'user-2',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
]

export const getRecommendationsByMajor = (major: string): PositionRecommendation[] => {
  return mockRecommendations
    .filter((rec) => rec.major === major)
    .sort((a, b) => a.order - b.order)
}

export const getRecommendationById = (id: string): PositionRecommendation | undefined => {
  return mockRecommendations.find((rec) => rec.id === id)
}
