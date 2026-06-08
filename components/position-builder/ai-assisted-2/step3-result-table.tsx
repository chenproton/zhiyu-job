'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, CheckCircle2 } from 'lucide-react'
import type { Position } from '@/lib/types'
import { COMPETENCY_LEVEL_LABELS } from '@/lib/types'

interface Step3ResultTableProps {
  position: Position
  onPrev: () => void
  onSave: () => void
}

export function Step3ResultTable({ position, onPrev, onSave }: Step3ResultTableProps) {
  const bindings = position.abilityBindings

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">步骤三：能力模型汇总</h2>
          <p className="text-sm text-gray-500 mt-0.5">确认拆解结果，保存后岗位将进入草稿状态</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onPrev} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> 返回修改
          </Button>
          <Button onClick={onSave} className="gap-1 bg-purple-600 hover:bg-purple-700">
            <Save className="h-4 w-4" /> 保存岗位
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-xs text-gray-500">工作职责</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{position.responsibilities.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-xs text-gray-500">能力点</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{bindings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-xs text-gray-500">能力域</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {new Set(bindings.map((b) => b.domain).filter(Boolean)).size}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">能力模型明细表</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {bindings.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p>暂无能力点数据</p>
              <p className="text-xs text-gray-400 mt-1">请返回步骤二进行拆解</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-[140px]">能力域名称</TableHead>
                    <TableHead className="w-[180px]">能力点名称</TableHead>
                    <TableHead className="w-[100px]">能力属性</TableHead>
                    <TableHead className="w-[100px]">掌握程度</TableHead>
                    <TableHead>胜任标准描述</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(() => {
                    const groups = new Map<string, typeof bindings>()
                    for (const b of bindings) {
                      const key = b.domain || '未分类'
                      if (!groups.has(key)) groups.set(key, [])
                      groups.get(key)!.push(b)
                    }
                    const rows: React.ReactNode[] = []
                    for (const [, group] of groups) {
                      group.forEach((binding, idx) => {
                        rows.push(
                          <TableRow key={binding.id}>
                            {idx === 0 && (
                              <TableCell rowSpan={group.length} className="align-middle">
                                <Badge variant="outline" className="text-[10px]">
                                  {binding.domain || '未分类'}
                                </Badge>
                              </TableCell>
                            )}
                            <TableCell className="font-medium text-sm">{binding.name}</TableCell>
                            <TableCell>
                              <span className="text-xs text-gray-700">技能</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs font-medium text-gray-800">
                                {COMPETENCY_LEVEL_LABELS[binding.level]}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600 max-w-md">
                              <p className="line-clamp-2">{binding.rubricDescription || '-'}</p>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    }
                    return rows
                  })()}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
