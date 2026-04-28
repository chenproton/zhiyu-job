'use client'

import { useState } from 'react'
import { useData } from '@/lib/stores/data-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/shared/status-badge'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Send,
  Briefcase,
  Upload,
  Download,
  ArrowRightLeft,
  Globe,
  Users,
  Network,
  Target,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Position, PositionStatus, Batch } from '@/lib/types'

// Mock 共建人员数据
const MOCK_COLLABORATORS = [
  { id: 'user-1', name: '张管理' },
  { id: 'user-2', name: '李建设' },
  { id: 'user-3', name: '王审批' },
  { id: 'user-4', name: '赵老师' },
  { id: 'user-5', name: '陈教授' },
]

export default function PositionsPage() {
  const router = useRouter()
  const { positions, batches, workflows, addPosition, deletePosition, submitForApproval, updatePosition } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBatch, setFilterBatch] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<PositionStatus | 'all'>('all')
  const [filterIndustry, setFilterIndustry] = useState<string>('all')
  const [filterMajor, setFilterMajor] = useState<string>('all')
  const [filterCollaborator, setFilterCollaborator] = useState<string>('all')
  
  // 批量选择相关
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  // 弹窗状态
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isMoveOpen, setIsMoveOpen] = useState(false)
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [targetBatchId, setTargetBatchId] = useState('')
  const [inviteTargetPosition, setInviteTargetPosition] = useState<Position | null>(null)
  const [selectedCollaborator, setSelectedCollaborator] = useState('')
  
  // 批次展开状态
  const [expandedBatches, setExpandedBatches] = useState<Record<string, boolean>>({})

  // 获取所有唯一的行业和专业
  const allIndustries = [...new Set(positions.map(p => p.industry).filter(Boolean))]
  const allMajors = [...new Set(positions.flatMap(p => p.majors).filter(Boolean))]

  const filteredPositions = positions.filter((position) => {
    const matchesSearch =
      position.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      position.shortName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBatch = filterBatch === 'all' || position.batchId === filterBatch
    const matchesStatus = filterStatus === 'all' || position.status === filterStatus
    const matchesIndustry = filterIndustry === 'all' || position.industry === filterIndustry
    const matchesMajor = filterMajor === 'all' || position.majors.includes(filterMajor)
    const matchesCollaborator = filterCollaborator === 'all' || position.collaborators.includes(filterCollaborator)
    return matchesSearch && matchesBatch && matchesStatus && matchesIndustry && matchesMajor && matchesCollaborator
  })

  // 按批次分组
  const positionsByBatch = batches.reduce((acc, batch) => {
    const batchPositions = filteredPositions.filter(p => p.batchId === batch.id)
    if (batchPositions.length > 0 || filterBatch === batch.id) {
      acc[batch.id] = {
        batch,
        positions: batchPositions,
      }
    }
    return acc
  }, {} as Record<string, { batch: Batch; positions: Position[] }>)

  // 未分配批次的岗位
  const unassignedPositions = filteredPositions.filter(p => !batches.some(b => b.id === p.batchId))

  // 获取未截止的批次
  const openBatches = batches.filter(b => b.status === 'open')

  const handleSelectPosition = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter(i => i !== id))
    }
  }

  const handleSelectAll = (batchId: string, checked: boolean) => {
    const batchPositionIds = positionsByBatch[batchId]?.positions.map(p => p.id) || []
    if (checked) {
      setSelectedIds([...new Set([...selectedIds, ...batchPositionIds])])
    } else {
      setSelectedIds(selectedIds.filter(id => !batchPositionIds.includes(id)))
    }
  }

  const handleCreateWithBatch = (batchId: string) => {
    // 创建一个新岗位并跳转到编辑页
    const batch = batches.find(b => b.id === batchId)
    const newPosition = addPosition({
      batchId,
      version: 'V1.0',
      status: 'draft',
      name: '新建岗位',
      shortName: '新岗位',
      industry: '',
      majors: batch ? [batch.major] : [],
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
      createdBy: 'user-2',
      collaborators: ['user-2'],
      favoriteCount: 0,
    })
    router.push(`/positions/${newPosition.id}/edit`)
    setIsCreateOpen(false)
  }

  const handleDelete = (positionId: string) => {
    if (confirm('确定要删除这个岗位吗？')) {
      deletePosition(positionId)
      setSelectedIds(selectedIds.filter(id => id !== positionId))
    }
  }

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return
    if (confirm(`确定要删除选中的 ${selectedIds.length} 个岗位吗？`)) {
      selectedIds.forEach(id => deletePosition(id))
      setSelectedIds([])
    }
  }

  const handleBatchMove = () => {
    if (!targetBatchId || selectedIds.length === 0) return
    selectedIds.forEach(id => {
      updatePosition(id, { batchId: targetBatchId })
    })
    setSelectedIds([])
    setIsMoveOpen(false)
    setTargetBatchId('')
  }

  const handleBatchExport = () => {
    alert(`已导出 ${selectedIds.length} 个岗位数据`)
    setSelectedIds([])
  }

  const handleBatchPublish = () => {
    if (selectedIds.length === 0) return
    selectedIds.forEach(id => {
      const position = positions.find(p => p.id === id)
      if (position && position.status === 'approved') {
        updatePosition(id, { status: 'published' })
      }
    })
    alert(`已发布符合条件的岗位`)
    setSelectedIds([])
  }

  const handleBatchSubmit = () => {
    if (selectedIds.length === 0) return
    selectedIds.forEach(id => {
      const position = positions.find(p => p.id === id)
      if (position && position.status === 'draft') {
        const batch = batches.find(b => b.id === position.batchId)
        if (batch) {
          submitForApproval(id, batch.workflowId, 'user-2', '李建设')
        }
      }
    })
    alert(`已提交符合条件的岗位审批`)
    setSelectedIds([])
  }

  const handleSubmitForApproval = (position: Position) => {
    const batch = batches.find((b) => b.id === position.batchId)
    if (!batch) return
    submitForApproval(position.id, batch.workflowId, 'user-2', '李建设')
  }

  const handleInviteCollaborator = () => {
    if (!inviteTargetPosition || !selectedCollaborator) return
    const currentCollaborators = inviteTargetPosition.collaborators || []
    if (!currentCollaborators.includes(selectedCollaborator)) {
      updatePosition(inviteTargetPosition.id, {
        collaborators: [...currentCollaborators, selectedCollaborator],
      })
    }
    setIsInviteOpen(false)
    setInviteTargetPosition(null)
    setSelectedCollaborator('')
    alert('已邀请共建人员')
  }

  const handleImport = () => {
    alert('导入功能演示：文件已上传，正在解析...')
    setIsImportOpen(false)
  }

  const toggleBatchExpand = (batchId: string) => {
    setExpandedBatches(prev => ({
      ...prev,
      [batchId]: !prev[batchId],
    }))
  }

  // 初始化所有批次为展开状态
  if (Object.keys(expandedBatches).length === 0 && Object.keys(positionsByBatch).length > 0) {
    const initialExpanded: Record<string, boolean> = {}
    Object.keys(positionsByBatch).forEach(batchId => {
      initialExpanded[batchId] = true
    })
    setExpandedBatches(initialExpanded)
  }

  const getCollaboratorNames = (collaboratorIds: string[]) => {
    return collaboratorIds
      .map(id => MOCK_COLLABORATORS.find(c => c.id === id)?.name || id)
      .join(', ')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">岗位大厅</h1>
          <p className="text-muted-foreground mt-1">管理和建设职业岗位信息</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                导入岗位
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>导入岗位</DialogTitle>
                <DialogDescription>上传 Excel 或 CSV 文件批量导入岗位数据</DialogDescription>
              </DialogHeader>
              <div className="py-8">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    拖拽文件到此处，或点击选择文件
                  </p>
                  <Button variant="outline" size="sm">选择文件</Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsImportOpen(false)}>取消</Button>
                <Button onClick={handleImport}>开始导入</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新建岗位
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>选择批次</DialogTitle>
                <DialogDescription>请选择岗位所属的批次，选择后将进入岗位编辑页面</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {openBatches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>暂无开放中的批次</p>
                    <p className="text-sm">请先在批次管理中创建批次</p>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {openBatches.map((batch) => {
                      const workflow = workflows.find(w => w.id === batch.workflowId)
                      return (
                        <Card 
                          key={batch.id} 
                          className="cursor-pointer hover:border-primary transition-colors"
                          onClick={() => handleCreateWithBatch(batch.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{batch.name}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {batch.department} - {batch.major}
                                </p>
                                {workflow && (
                                  <Badge variant="outline" className="mt-2 text-xs">
                                    {workflow.name}
                                  </Badge>
                                )}
                              </div>
                              <Badge variant="secondary">{batch.positionCount} 个岗位</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索岗位名称..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterBatch} onValueChange={setFilterBatch}>
              <SelectTrigger>
                <SelectValue placeholder="批次" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部批次</SelectItem>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterIndustry} onValueChange={setFilterIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="所属行业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部行业</SelectItem>
                {allIndustries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterMajor} onValueChange={setFilterMajor}>
              <SelectTrigger>
                <SelectValue placeholder="所属专业" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部专业</SelectItem>
                {allMajors.map((major) => (
                  <SelectItem key={major} value={major}>
                    {major}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterStatus}
              onValueChange={(v) => setFilterStatus(v as PositionStatus | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="pending">审批中</SelectItem>
                <SelectItem value="approved">已通过</SelectItem>
                <SelectItem value="rejected">已驳回</SelectItem>
                <SelectItem value="published">已上架</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCollaborator} onValueChange={setFilterCollaborator}>
              <SelectTrigger>
                <SelectValue placeholder="共建人员" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部人员</SelectItem>
                {MOCK_COLLABORATORS.map((collaborator) => (
                  <SelectItem key={collaborator.id} value={collaborator.id}>
                    {collaborator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Batch Actions */}
      {selectedIds.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                已选择 <span className="font-medium text-foreground">{selectedIds.length}</span> 个岗位
              </span>
              <div className="flex gap-2">
                <Dialog open={isMoveOpen} onOpenChange={setIsMoveOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ArrowRightLeft className="mr-2 h-4 w-4" />
                      批量移动
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>批量移动岗位</DialogTitle>
                      <DialogDescription>
                        将选中的 {selectedIds.length} 个岗位移动到指定批次
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Select value={targetBatchId} onValueChange={setTargetBatchId}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择目标批次" />
                        </SelectTrigger>
                        <SelectContent>
                          {batches.map((batch) => (
                            <SelectItem key={batch.id} value={batch.id}>
                              {batch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsMoveOpen(false)}>取消</Button>
                      <Button onClick={handleBatchMove} disabled={!targetBatchId}>确认移动</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={handleBatchExport}>
                  <Download className="mr-2 h-4 w-4" />
                  批量导出
                </Button>
                <Button variant="outline" size="sm" onClick={handleBatchPublish}>
                  <Globe className="mr-2 h-4 w-4" />
                  批量发布
                </Button>
                <Button variant="outline" size="sm" onClick={handleBatchSubmit}>
                  <Send className="mr-2 h-4 w-4" />
                  批量提交审批
                </Button>
                <Button variant="outline" size="sm" onClick={handleBatchDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  批量删除
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content - Grouped by Batch */}
      {Object.keys(positionsByBatch).length === 0 && unassignedPositions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">暂无岗位数据</p>
            <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              创建第一个岗位
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(positionsByBatch).map(([batchId, { batch, positions: batchPositions }]) => {
            const isExpanded = expandedBatches[batchId] !== false
            const allSelected = batchPositions.every(p => selectedIds.includes(p.id))
            const someSelected = batchPositions.some(p => selectedIds.includes(p.id))
            
            return (
              <Card key={batchId}>
                <CardHeader 
                  className="cursor-pointer hover:bg-accent/50 transition-colors py-3"
                  onClick={() => toggleBatchExpand(batchId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div>
                        <CardTitle className="text-base">{batch.name}</CardTitle>
                        <CardDescription>
                          {batch.department} - {batch.major} | {batchPositions.length} 个岗位
                        </CardDescription>
                      </div>
                    </div>
                    <StatusBadge status={batch.status} type="batch" />
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={allSelected}
                              onCheckedChange={(checked) => handleSelectAll(batchId, !!checked)}
                              aria-label="全选"
                            />
                          </TableHead>
                          <TableHead>岗位名称</TableHead>
                          <TableHead>所属行业</TableHead>
                          <TableHead>所属专业</TableHead>
                          <TableHead>审核状态</TableHead>
                          <TableHead>版本号</TableHead>
                          <TableHead>共建人员</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {batchPositions.map((position) => (
                          <TableRow key={position.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedIds.includes(position.id)}
                                onCheckedChange={(checked) => handleSelectPosition(position.id, !!checked)}
                                aria-label={`选择 ${position.name}`}
                              />
                            </TableCell>
                            <TableCell>
                              <Link
                                href={`/positions/${position.id}/edit`}
                                className="font-medium text-foreground hover:text-primary"
                              >
                                {position.name}
                              </Link>
                            </TableCell>
                            <TableCell>{position.industry || '-'}</TableCell>
                            <TableCell>
                              {position.majors.length > 0 ? position.majors.join(', ') : '-'}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={position.status} />
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{position.version}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {position.collaborators.slice(0, 2).map((collab) => (
                                  <Avatar key={collab} className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {MOCK_COLLABORATORS.find(c => c.id === collab)?.name.slice(0, 1) || collab.slice(0, 1)}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {position.collaborators.length > 2 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{position.collaborators.length - 2}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/positions/${position.id}/edit`}>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      编辑
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/positions/${position.id}/edit?step=1`}>
                                      <Network className="mr-2 h-4 w-4" />
                                      配置能力模型
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/positions/${position.id}/edit?step=2`}>
                                      <Target className="mr-2 h-4 w-4" />
                                      配置胜任标准
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setInviteTargetPosition(position)
                                      setIsInviteOpen(true)
                                    }}
                                  >
                                    <Users className="mr-2 h-4 w-4" />
                                    邀请共建
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    导出
                                  </DropdownMenuItem>
                                  {position.status === 'draft' && (
                                    <DropdownMenuItem onClick={() => handleSubmitForApproval(position)}>
                                      <Send className="mr-2 h-4 w-4" />
                                      提交审批
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(position.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    删除
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                )}
              </Card>
            )
          })}

          {/* 未分配批次的岗位 */}
          {unassignedPositions.length > 0 && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">未分类岗位</CardTitle>
                <CardDescription>{unassignedPositions.length} 个岗位</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox aria-label="全选" />
                      </TableHead>
                      <TableHead>岗位名称</TableHead>
                      <TableHead>所属行业</TableHead>
                      <TableHead>所属专业</TableHead>
                      <TableHead>审核状态</TableHead>
                      <TableHead>版本号</TableHead>
                      <TableHead>共建人员</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unassignedPositions.map((position) => (
                      <TableRow key={position.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(position.id)}
                            onCheckedChange={(checked) => handleSelectPosition(position.id, !!checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/positions/${position.id}/edit`}
                            className="font-medium text-foreground hover:text-primary"
                          >
                            {position.name}
                          </Link>
                        </TableCell>
                        <TableCell>{position.industry || '-'}</TableCell>
                        <TableCell>
                          {position.majors.length > 0 ? position.majors.join(', ') : '-'}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={position.status} />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{position.version}</Badge>
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/positions/${position.id}/edit`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  编辑
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(position.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 邀请共建对话框 */}
      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>邀请共建</DialogTitle>
            <DialogDescription>
              邀请人员加入「{inviteTargetPosition?.name}」的共建
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedCollaborator} onValueChange={setSelectedCollaborator}>
              <SelectTrigger>
                <SelectValue placeholder="选择共建人员" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_COLLABORATORS.filter(
                  c => !inviteTargetPosition?.collaborators.includes(c.id)
                ).map((collaborator) => (
                  <SelectItem key={collaborator.id} value={collaborator.id}>
                    {collaborator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>取消</Button>
            <Button onClick={handleInviteCollaborator} disabled={!selectedCollaborator}>
              发送邀请
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
