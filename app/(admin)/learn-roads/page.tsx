'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown, Save, RotateCcw } from 'lucide-react'

interface Task {
  id: string
  name: string
}

interface Scene {
  id: string
  name: string
  tasks: Task[]
}

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

export default function LearnRoadsPage() {
  const [scenes, setScenes] = useState<Scene[]>(defaultScenes)
  const [selectedSceneId, setSelectedSceneId] = useState<string>(defaultScenes[0].id)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('learn-roads-scenes')
      if (stored) {
        setScenes(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
  }, [])

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
    try {
      localStorage.setItem('learn-roads-scenes', JSON.stringify(scenes))
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

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">学习管理路径</h1>
            <p className="mt-1 text-sm text-slate-500">管理岗位学习路径中场景与任务的展示顺序</p>
          </div>
          <div className="flex gap-3">
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
              <CardTitle className="text-base">
                任务顺序 · {selectedScene?.name}
              </CardTitle>
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
    </div>
  )
}
