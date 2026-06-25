'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  Search,
  ArrowLeft,
  Pencil,
  FolderOpen,
  GraduationCap,
  Eye,
} from 'lucide-react'
import Link from 'next/link'
import { StatusBadge } from '@/components/shared/status-badge'
import { cn } from '@/lib/utils'
import { useData } from '@/lib/stores/data-context'
import { getUserById } from '@/lib/mock-data'
import type { Position, PositionStatus } from '@/lib/types'

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
  const [filterStatus, setFilterStatus] = useState<'all' | PositionStatus>('all')

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
    if (filterStatus !== 'all') {
      result = result.filter((p) => p.status === filterStatus)
    }
    return result
  }, [positions, searchQuery, filterStatus])

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">学习路径管理</h1>
          <p className="text-muted-foreground mt-1">按岗位管理学习路径中场景与任务的展示顺序</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/learning-route">
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              预览
            </Button>
          </Link>
          <Button variant="outline" disabled>
            <GraduationCap className="mr-2 h-4 w-4" />
            岗位学习路径
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索岗位名称、简称..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={filterStatus}
              onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="pending">审批中</SelectItem>
                <SelectItem value="approved">已通过</SelectItem>
                <SelectItem value="rejected">已驳回</SelectItem>
                <SelectItem value="published">已发布</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>岗位列表</CardTitle>
          <CardDescription>共 {filteredPositions.length} 个岗位</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>岗位名称</TableHead>
                <TableHead>所属批次</TableHead>
                <TableHead>所属行业</TableHead>
                <TableHead>所属专业</TableHead>
                <TableHead>创建人</TableHead>
                <TableHead>共建人</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>场景数</TableHead>
                <TableHead>任务数</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPositions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FolderOpen className="h-10 w-10 mb-2" />
                      <p>暂无岗位数据</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPositions.map((position) => {
                  const batch = batches.find((b) => b.id === position.batchId)
                  const { sceneCount, taskCount } = countScenesAndTasks(position.id)
                  const creator = getUserById(position.createdBy)
                  const collaborators = position.collaborators
                    .map((id) => getUserById(id)?.name)
                    .filter(Boolean)
                    .join('，')

                  return (
                    <TableRow key={position.id} className="group">
                      <TableCell>
                        <span className="font-medium text-foreground">{position.name}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{position.shortName}</p>
                      </TableCell>
                      <TableCell>{batch ? batch.name : '-'}</TableCell>
                      <TableCell>{position.industry || '-'}</TableCell>
                      <TableCell>
                        {position.majors.length > 0 ? position.majors.join('，') : '-'}
                      </TableCell>
                      <TableCell>{creator?.name || '-'}</TableCell>
                      <TableCell>{collaborators || '-'}</TableCell>
                      <TableCell>
                        <StatusBadge status={position.status} type="position" />
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50">
                          {sceneCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-purple-50 text-purple-600 hover:bg-purple-50">
                          {taskCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right relative">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm z-10 px-2 py-1 rounded-lg shadow-sm border">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleEdit(position)}
                          >
                            <Pencil className="mr-1 h-3 w-3" />
                            编辑学习路径
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const EditView = () => {
    if (!editingPosition) return null
    const batch = batches.find((b) => b.id === editingPosition.batchId)

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              返回岗位列表
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{editingPosition.name}</h1>
              <p className="text-muted-foreground mt-1">
                {batch ? batch.name : '未关联批次'} · {editingPosition.shortName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              重置
            </Button>
            <Link href="/learning-route">
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                预览
              </Button>
            </Link>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              {saved ? '已保存' : '保存顺序'}
            </Button>
          </div>
        </div>

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
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors',
                    selectedSceneId === scene.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  )}
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
    <div className="space-y-6">
      {view === 'list' ? <ListView /> : <EditView />}
    </div>
  )
}
