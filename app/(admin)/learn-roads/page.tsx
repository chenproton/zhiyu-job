'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  Search,
  ArrowLeft,
  Pencil,
  GraduationCap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useData } from '@/lib/stores/data-context'
import type { Position } from '@/lib/types'

interface Task {
  id: string
  name: string
}

interface Scene {
  id: string
  name: string
  tasks: Task[]
}

const STORAGE_KEY_PREFIX = 'learn-roads-scenes'

const defaultScenes: Scene[] = [
  {
    id: 'scene-0',
    name: '基础学习',
    tasks: [
      { id: 'task-0-0', name: 'HTML5 语义化标签' },
      { id: 'task-0-1', name: 'CSS3 核心选择器' },
      { id: 'task-0-2', name: 'Flex 弹性布局' },
      { id: 'task-0-3', name: 'Grid 网格布局' },
      { id: 'task-0-4', name: 'JavaScript 基础语法' },
      { id: 'task-0-5', name: 'DOM 操作与事件' },
      { id: 'task-0-6', name: 'CSS 动画与过渡' },
      { id: 'task-0-7', name: '基础综合实战' },
    ],
  },
  {
    id: 'scene-1',
    name: '电商后台管理系统',
    tasks: [
      { id: 'task-1-0', name: 'Vue3 项目初始化' },
      { id: 'task-1-1', name: '登录鉴权模块' },
      { id: 'task-1-2', name: '商品管理 CRUD' },
      { id: 'task-1-3', name: '订单与权限管理' },
      { id: 'task-1-4', name: '后台界面优化' },
      { id: 'task-1-5', name: '数据报表与导出' },
      { id: 'task-1-6', name: '表单校验与提交' },
    ],
  },
  {
    id: 'scene-2',
    name: '移动端H5活动页',
    tasks: [
      { id: 'task-2-0', name: '移动端适配方案' },
      { id: 'task-2-1', name: '活动页面布局' },
      { id: 'task-2-2', name: 'H5 动画特效' },
      { id: 'task-2-3', name: '微信分享与埋点' },
      { id: 'task-2-4', name: '微信授权登录' },
      { id: 'task-2-5', name: '活动抽奖动画' },
      { id: 'task-2-6', name: 'H5 性能优化' },
    ],
  },
  {
    id: 'scene-3',
    name: '数据可视化大屏',
    tasks: [
      { id: 'task-3-0', name: '大屏布局自适应' },
      { id: 'task-3-1', name: 'ECharts 图表配置' },
      { id: 'task-3-2', name: '数据实时刷新' },
      { id: 'task-3-3', name: '大屏主题与动效' },
      { id: 'task-3-4', name: '地图可视化' },
      { id: 'task-3-5', name: '实时数据推送' },
      { id: 'task-3-6', name: '大屏适配与投屏' },
    ],
  },
  {
    id: 'scene-4',
    name: '前端工程化实践',
    tasks: [
      { id: 'task-4-0', name: 'Git 工作流实践' },
      { id: 'task-4-1', name: '自动化部署' },
      { id: 'task-4-2', name: '代码规范与 ESLint' },
      { id: 'task-4-3', name: '构建性能优化' },
      { id: 'task-4-4', name: '单元测试与覆盖率' },
      { id: 'task-4-5', name: '组件库封装' },
      { id: 'task-4-6', name: '性能监控与埋点' },
    ],
  },
  {
    id: 'scene-5',
    name: '团队协作开发实战',
    tasks: [
      { id: 'task-5-0', name: '需求分析与拆分' },
      { id: 'task-5-1', name: '代码评审与重构' },
      { id: 'task-5-2', name: '接口联调与文档' },
      { id: 'task-5-3', name: '项目上线与复盘' },
      { id: 'task-5-4', name: '跨部门沟通协作' },
      { id: 'task-5-5', name: '技术方案评审' },
      { id: 'task-5-6', name: '线上问题应急响应' },
    ],
  },
  {
    id: 'scene-6',
    name: '全栈实战',
    tasks: [
      { id: 'task-6-0', name: 'Node.js 接口开发' },
      { id: 'task-6-1', name: '数据库设计与操作' },
      { id: 'task-6-2', name: '前后端联调部署' },
      { id: 'task-6-3', name: '全栈项目答辩' },
      { id: 'task-6-4', name: '用户认证与权限' },
      { id: 'task-6-5', name: '服务端接口测试' },
      { id: 'task-6-6', name: '项目部署与运维' },
    ],
  },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: '草稿', className: 'bg-gray-100 text-gray-500' },
  pending: { label: '审批中', className: 'bg-yellow-50 text-yellow-600' },
  approved: { label: '已通过', className: 'bg-blue-50 text-blue-600' },
  rejected: { label: '已驳回', className: 'bg-red-50 text-red-500' },
  published: { label: '已发布', className: 'bg-green-50 text-green-600' },
  archived: { label: '已归档', className: 'bg-gray-100 text-gray-400' },
}

function getStorageKey(positionId: string) {
  return `${STORAGE_KEY_PREFIX}-${positionId}`
}

function loadScenesForPosition(positionId: string): Scene[] {
  try {
    const stored = localStorage.getItem(getStorageKey(positionId))
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // ignore
  }
  return defaultScenes
}

function countScenesAndTasks(positionId: string): { sceneCount: number; taskCount: number } {
  const scenes = loadScenesForPosition(positionId)
  return {
    sceneCount: scenes.length,
    taskCount: scenes.reduce((sum, scene) => sum + scene.tasks.length, 0),
  }
}

export default function LearnRoadsPage() {
  const { positions, batches } = useData()

  const [view, setView] = useState<'list' | 'edit'>('list')
  const [editingPosition, setEditingPosition] = useState<Position | null>(null)

  const [scenes, setScenes] = useState<Scene[]>(defaultScenes)
  const [selectedSceneId, setSelectedSceneId] = useState<string>(defaultScenes[0].id)
  const [saved, setSaved] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    if (view === 'edit' && editingPosition) {
      const loaded = loadScenesForPosition(editingPosition.id)
      setScenes(loaded)
      setSelectedSceneId(loaded[0]?.id || defaultScenes[0].id)
      setSaved(false)
    }
  }, [view, editingPosition])

  const filteredPositions = useMemo(() => {
    let result = positions
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortName.toLowerCase().includes(q)
      )
    }
    return result
  }, [positions, searchQuery])

  const stats = useMemo(() => {
    const total = positions.length
    const published = positions.filter((p) => p.status === 'published').length
    return { total, published }
  }, [positions])

  const allSelected =
    filteredPositions.length > 0 &&
    filteredPositions.every((p) => selectedIds.includes(p.id))
  const someSelected =
    filteredPositions.some((p) => selectedIds.includes(p.id)) && !allSelected

  const handleSelectId = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((sid) => sid !== id)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredPositions.map((p) => p.id) : [])
  }

  const handleEdit = (position: Position) => {
    setEditingPosition(position)
    setView('edit')
  }

  const handleBack = () => {
    setView('list')
    setEditingPosition(null)
    setSaved(false)
  }

  const selectedScene = scenes.find((s) => s.id === selectedSceneId) || scenes[0]

  const moveScene = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= scenes.length) return
    const newScenes = [...scenes]
    const [moved] = newScenes.splice(index, 1)
    newScenes.splice(newIndex, 0, moved)
    setScenes(newScenes)
    setSaved(false)
  }

  const moveTask = (sceneIndex: number, taskIndex: number, direction: -1 | 1) => {
    const newTaskIndex = taskIndex + direction
    const scene = scenes[sceneIndex]
    if (newTaskIndex < 0 || newTaskIndex >= scene.tasks.length) return
    const newScenes = [...scenes]
    const newTasks = [...scene.tasks]
    const [moved] = newTasks.splice(taskIndex, 1)
    newTasks.splice(newTaskIndex, 0, moved)
    newScenes[sceneIndex] = { ...scene, tasks: newTasks }
    setScenes(newScenes)
    setSaved(false)
  }

  const handleSave = () => {
    if (!editingPosition) return
    try {
      localStorage.setItem(getStorageKey(editingPosition.id), JSON.stringify(scenes))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // ignore
    }
  }

  const handleReset = () => {
    setScenes(defaultScenes)
    setSelectedSceneId(defaultScenes[0].id)
    setSaved(false)
  }

  const ListView = () => (
    <div className="space-y-6">
      {/* Top title card */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">学习路径管理</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                按岗位管理学习路径中场景与任务的展示顺序
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedIds([])}>
                <GraduationCap className="mr-2 h-4 w-4" />
                岗位学习路径
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3 max-w-md">
            <Card className="border-slate-200 shadow-sm w-full">
              <CardContent className="px-3 py-[3px] flex items-center justify-between">
                <div className="leading-none">
                  <p className="text-xs text-slate-500 leading-none">岗位总数</p>
                  <p className="text-xl font-bold text-slate-900 leading-none mt-[3px]">{stats.total}</p>
                </div>
                <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center">
                  <GraduationCap className="h-3 w-3 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm w-full">
              <CardContent className="px-3 py-[3px] flex items-center justify-between">
                <div className="leading-none">
                  <p className="text-xs text-slate-500 leading-none">已发布</p>
                  <p className="text-xl font-bold text-slate-900 leading-none mt-[3px]">{stats.published}</p>
                </div>
                <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center">
                  <Save className="h-3 w-3 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Search + list */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 w-full">
                <Search className="h-4 w-4 text-slate-400" />
                <Input
                  placeholder="搜索岗位名称 / 简称"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 text-sm flex-1"
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => {
                setSearchQuery('')
                setSelectedIds([])
              }}
            >
              <RotateCcw className="mr-1 h-3.5 w-3.5" />
              重置
            </Button>
          </div>
        </CardContent>

        {filteredPositions.length > 0 && (
          <CardContent className="pt-0">
            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 text-xs font-medium text-slate-500 border-b border-slate-100 items-center">
                <div className="col-span-1 flex justify-center">
                  <Checkbox
                    checked={someSelected ? 'indeterminate' : allSelected}
                    onCheckedChange={(checked) => handleSelectAll(checked === true)}
                    aria-label="全选"
                  />
                </div>
                <div className="col-span-3">岗位名称</div>
                <div className="col-span-3">所属批次</div>
                <div className="col-span-1 text-center">状态</div>
                <div className="col-span-1 text-center">场景数</div>
                <div className="col-span-1 text-center">任务数</div>
                <div className="col-span-2 text-right">操作</div>
              </div>

              {/* Body */}
              <div className="divide-y divide-slate-100">
                {filteredPositions.map((position) => {
                  const status = statusConfig[position.status] || statusConfig.draft
                  const isSelected = selectedIds.includes(position.id)
                  const batch = batches.find((b) => b.id === position.batchId)
                  const { sceneCount, taskCount } = countScenesAndTasks(position.id)

                  return (
                    <div
                      key={position.id}
                      className={cn(
                        'grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-slate-50 transition-colors group relative',
                        isSelected && 'bg-primary/5'
                      )}
                    >
                      <div className="col-span-1 flex justify-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectId(position.id, checked === true)}
                          aria-label={`选择 ${position.name}`}
                        />
                      </div>
                      <div className="col-span-3">
                        <p className="text-sm font-medium text-slate-900 line-clamp-1">{position.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{position.shortName}</p>
                      </div>
                      <div className="col-span-3 text-sm text-slate-600 truncate">
                        {batch ? batch.name : '-'}
                      </div>
                      <div className="col-span-1 text-center">
                        <Badge variant="secondary" className={cn('text-xs', status.className)}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="col-span-1 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600">
                          {sceneCount}
                        </span>
                      </div>
                      <div className="col-span-1 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-600">
                          {taskCount}
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleEdit(position)}
                        >
                          <Pencil className="mr-1 h-3 w-3" />
                          编辑学习路径
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {filteredPositions.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-20 shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-slate-700">暂无岗位</h3>
          <p className="text-sm text-slate-500">当前筛选条件下没有岗位数据</p>
        </div>
      )}
    </div>
  )

  const EditView = () => {
    if (!editingPosition) return null
    const batch = batches.find((b) => b.id === editingPosition.batchId)
    const status = statusConfig[editingPosition.status] || statusConfig.draft

    return (
      <div className="space-y-6">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleBack}>
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  返回岗位列表
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    {editingPosition.name}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {batch ? batch.name : '未关联批次'} · {editingPosition.shortName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={cn('text-xs', status.className)}>
                  {status.label}
                </Badge>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  重置
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  {saved ? '已保存' : '保存顺序'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 场景顺序 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">场景顺序</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scenes.map((scene, index) => (
                <div
                  key={scene.id}
                  onClick={() => setSelectedSceneId(scene.id)}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors ${
                    selectedSceneId === scene.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600">
                      {index + 1}
                    </span>
                    <span className="font-medium text-slate-900">{scene.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation()
                        moveScene(index, -1)
                      }}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={index === scenes.length - 1}
                      onClick={(e) => {
                        e.stopPropagation()
                        moveScene(index, 1)
                      }}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 任务顺序 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">任务顺序 · {selectedScene?.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedScene?.tasks.map((task, taskIndex) => {
                const sceneIndex = scenes.findIndex((s) => s.id === selectedScene.id)
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600">
                        {taskIndex + 1}
                      </span>
                      <span className="font-medium text-slate-900">{task.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={taskIndex === 0}
                        onClick={() => moveTask(sceneIndex, taskIndex, -1)}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={taskIndex === selectedScene.tasks.length - 1}
                        onClick={() => moveTask(sceneIndex, taskIndex, 1)}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {view === 'list' ? <ListView /> : <EditView />}
    </div>
  )
}
