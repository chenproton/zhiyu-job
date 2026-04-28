'use client'

import { useData } from '@/lib/stores/data-context'
import { useAuth } from '@/lib/stores/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/status-badge'
import {
  FolderKanban,
  Briefcase,
  FileCheck,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))']

export default function DashboardPage() {
  const { stats, batches, positions, approvals } = useData()
  const { user } = useAuth()

  // 按状态统计岗位
  const positionStatusData = [
    { name: '草稿', value: positions.filter(p => p.status === 'draft').length },
    { name: '审批中', value: positions.filter(p => p.status === 'pending').length },
    { name: '已上架', value: positions.filter(p => p.status === 'published').length },
    { name: '已驳回', value: positions.filter(p => p.status === 'rejected').length },
  ].filter(d => d.value > 0)

  // 按院系统计批次
  const batchByDepartment = batches.reduce((acc, batch) => {
    acc[batch.department] = (acc[batch.department] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const departmentData = Object.entries(batchByDepartment).map(([name, value]) => ({
    name,
    count: value,
  }))

  // 待办事项
  const pendingApprovals = approvals.filter(a => a.status === 'pending')
  const draftPositions = positions.filter(p => p.status === 'draft')

  const statCards = [
    {
      title: '批次总数',
      value: stats.totalBatches,
      subtitle: `${stats.openBatches} 个开放中`,
      icon: FolderKanban,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
      href: '/batches',
    },
    {
      title: '岗位总数',
      value: stats.totalPositions,
      subtitle: `${stats.publishedPositions} 个已上架`,
      icon: Briefcase,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
      href: '/positions',
    },
    {
      title: '待审批',
      value: stats.pendingApprovals,
      subtitle: '需要处理',
      icon: FileCheck,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
      href: '/approvals',
    },
    {
      title: '能力点',
      value: stats.totalAbilities,
      subtitle: '公共池',
      icon: Layers,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
      href: '/abilities',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome - 移除了创建岗位按钮 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          欢迎回来，{user?.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          这是您的数据工作台概览
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.title} href={card.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-lg ${card.bgColor}`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-foreground">{card.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{card.title}</p>
                    <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Position Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              岗位状态分布
            </CardTitle>
            <CardDescription>当前所有岗位的状态统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={positionStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {positionStatusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-muted-foreground" />
              院系批次分布
            </CardTitle>
            <CardDescription>各院系的批次数量统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Todo List */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                待审批事项
              </CardTitle>
              <CardDescription>需要您处理的审批任务</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {pendingApprovals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileCheck className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">暂无待审批事项</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.slice(0, 5).map((approval) => (
                  <Link
                    key={approval.id}
                    href="/approvals"
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{approval.positionName}</p>
                      <p className="text-sm text-muted-foreground">
                        提交人: {approval.submitterName}
                      </p>
                    </div>
                    <StatusBadge status={approval.status} type="approval" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Draft Positions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                草稿岗位
              </CardTitle>
              <CardDescription>尚未提交审批的岗位</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {draftPositions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">暂无草稿岗位</p>
              </div>
            ) : (
              <div className="space-y-3">
                {draftPositions.slice(0, 5).map((position) => (
                  <Link
                    key={position.id}
                    href={`/positions/${position.id}/edit`}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{position.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {position.industry}
                      </p>
                    </div>
                    <StatusBadge status={position.status} />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
