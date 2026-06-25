'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useData } from '@/lib/stores/data-context'
import { useAuth } from '@/lib/stores/auth-context'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
  Plus,
  Trash2,
  Sparkles,
  GraduationCap,
  Briefcase,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PositionType } from '@/lib/types'
import { POSITION_TYPE_LABELS } from '@/lib/types'

export default function PostRecommendPage() {
  const { positions, batches, recommendations, addRecommendation, deleteRecommendation, reorderRecommendations } = useData()
  const { user } = useAuth()

  const [selectedMajor, setSelectedMajor] = useState<string>('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedPositionId, setSelectedPositionId] = useState<string>('')
  const [selectedType, setSelectedType] = useState<PositionType>('enterprise')
  const [reason, setReason] = useState('')

  // 专业列表从批次和专业字符串去重得到
  const majorOptions = useMemo(() => {
    const set = new Set<string>()
    batches.forEach((b) => set.add(b.major))
    positions.forEach((p) => p.majors.forEach((m) => set.add(m)))
    return Array.from(set).sort()
  }, [batches, positions])

  // 默认选中第一个专业
  const currentMajor = selectedMajor || majorOptions[0] || ''

  const majorRecommendations = useMemo(() => {
    return recommendations
      .filter((rec) => rec.major === currentMajor)
      .sort((a, b) => a.order - b.order)
  }, [recommendations, currentMajor])

  const recommendedPositionIds = useMemo(
    () => new Set(majorRecommendations.map((rec) => rec.positionId)),
    [majorRecommendations]
  )

  const availablePositions = useMemo(() => {
    return positions.filter(
      (p) =>
        p.majors.includes(currentMajor) &&
        p.status === 'published' &&
        !recommendedPositionIds.has(p.id)
    )
  }, [positions, currentMajor, recommendedPositionIds])

  const handleMove = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= majorRecommendations.length) return
    const ids = majorRecommendations.map((rec) => rec.id)
    const [moved] = ids.splice(index, 1)
    ids.splice(newIndex, 0, moved)
    reorderRecommendations(currentMajor, ids)
  }

  const handleDelete = (id: string) => {
    deleteRecommendation(id)
  }

  const handleAdd = () => {
    if (!selectedPositionId || !currentMajor || !user) return
    const position = positions.find((p) => p.id === selectedPositionId)
    if (!position) return
    addRecommendation({
      major: currentMajor,
      positionId: position.id,
      positionType: selectedType,
      reason: reason.trim() || undefined,
      createdBy: user.id,
    })
    setSelectedPositionId('')
    setSelectedType('enterprise')
    setReason('')
    setIsAddOpen(false)
  }

  const selectedPosition = positions.find((p) => p.id === selectedPositionId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            目标岗位推荐
          </h1>
          <p className="text-muted-foreground mt-1">
            按专业配置前台"为你推荐"模块展示的岗位及顺序，支持企业岗位与教学岗位混合推荐
          </p>
        </div>
        <Link href="/explore">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            前台预览
          </Button>
        </Link>
      </div>

      {/* 专业选择 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 min-w-[120px]">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">选择专业</span>
            </div>
            <Select value={currentMajor} onValueChange={setSelectedMajor}>
              <SelectTrigger className="w-full sm:w-72">
                <SelectValue placeholder="请选择专业" />
              </SelectTrigger>
              <SelectContent>
                {majorOptions.map((major) => (
                  <SelectItem key={major} value={major}>
                    {major}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground sm:ml-auto">
              已配置 {majorRecommendations.length} 个推荐岗位
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {/* 已配置推荐 */}
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>推荐岗位列表</CardTitle>
              <CardDescription>
                专业「{currentMajor}」的前台推荐顺序，数字越小越靠前
              </CardDescription>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  添加推荐
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>添加目标岗位推荐</DialogTitle>
                  <DialogDescription>
                    为「{currentMajor}」专业选择一个岗位并配置推荐类型与原因
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">推荐岗位</label>
                    <Select value={selectedPositionId} onValueChange={setSelectedPositionId}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择岗位" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePositions.length === 0 ? (
                          <SelectItem value="" disabled>
                            暂无可添加的岗位
                          </SelectItem>
                        ) : (
                          availablePositions.map((position) => (
                            <SelectItem key={position.id} value={position.id}>
                              {position.name}（{position.shortName}）
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedPosition && (
                    <div className="rounded-lg border bg-muted/50 p-3 text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{selectedPosition.name}</span>
                      </div>
                      <div className="text-muted-foreground">
                        行业：{selectedPosition.industry} · 能力点：{selectedPosition.abilityModel?.nodes.length || 0} 个
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">岗位类型</label>
                    <Select
                      value={selectedType}
                      onValueChange={(v) => setSelectedType(v as PositionType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enterprise">企业岗位</SelectItem>
                        <SelectItem value="teaching">教学岗位</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">推荐原因（选填）</label>
                    <Input
                      placeholder="例如：核心对口岗位，就业需求量大"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleAdd} disabled={!selectedPositionId}>
                    确认添加
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">顺序</TableHead>
                  <TableHead>岗位名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>推荐原因</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {majorRecommendations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Sparkles className="h-10 w-10 mb-2" />
                        <p>暂无为「{currentMajor}」配置的推荐岗位</p>
                        <p className="text-xs mt-1">添加后将在前台"为你推荐"按顺序展示</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  majorRecommendations.map((rec, index) => {
                    const position = positions.find((p) => p.id === rec.positionId)
                    return (
                      <TableRow key={rec.id} className="group">
                        <TableCell>
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                            {rec.order}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{position?.name || '未知岗位'}</div>
                          <div className="text-xs text-muted-foreground">
                            {position?.shortName || '-'} · {position?.industry || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              rec.positionType === 'teaching'
                                ? 'bg-amber-50 text-amber-600 hover:bg-amber-50'
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-50'
                            )}
                          >
                            {POSITION_TYPE_LABELS[rec.positionType]}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <span className="text-sm text-muted-foreground line-clamp-2">
                            {rec.reason || '-'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={index === 0}
                              onClick={() => handleMove(index, -1)}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={index === majorRecommendations.length - 1}
                              onClick={() => handleMove(index, 1)}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(rec.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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

    </div>
  )
}
