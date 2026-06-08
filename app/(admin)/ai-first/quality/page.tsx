"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, BarChart3, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"

export default function AiFirstQualityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">岗位质量分析(AI主导)</h1>
        <p className="text-muted-foreground">AI 主导对岗位资源进行综合质量评分与一致性分析</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均分</p>
                <p className="text-3xl font-bold">84.1</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">高分标杆</p>
                <p className="text-3xl font-bold">14</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">待优化</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">严重问题</p>
                <p className="text-3xl font-bold">1</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI 质量评分看板
          </CardTitle>
          <CardDescription>按批次/院系维度，AI 对岗位资源进行综合质量评分</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { name: "2026春季人工智能岗位开发", score: 94, completeness: 96, logic: 93, standardization: 91, richness: 95, studentValue: 94 },
            { name: "2026春季电商实训岗位", score: 88, completeness: 90, logic: 89, standardization: 86, richness: 89, studentValue: 87 },
            { name: "2025秋季财务管理岗位", score: 81, completeness: 84, logic: 85, standardization: 78, richness: 79, studentValue: 82 },
            { name: "2025秋季市场营销岗位", score: 76, completeness: 74, logic: 78, standardization: 72, richness: 79, studentValue: 75 },
          ].map((batch) => (
            <div key={batch.name} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{batch.name}</span>
                  <Badge variant={batch.score >= 80 ? "default" : batch.score >= 60 ? "secondary" : "destructive"}>
                    {batch.score} 分
                  </Badge>
                </div>
                <Sparkles className="h-4 w-4 text-purple-400" />
              </div>
              <div className="grid grid-cols-5 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground">完整性</span>
                  <Progress value={batch.completeness} className="h-2" />
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">逻辑性</span>
                  <Progress value={batch.logic} className="h-2" />
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">标准化</span>
                  <Progress value={batch.standardization} className="h-2" />
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">丰富度</span>
                  <Progress value={batch.richness} className="h-2" />
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground">学生价值</span>
                  <Progress value={batch.studentValue} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>审批标准一致性分析</CardTitle>
          <CardDescription>按批次维度，AI 分析所有审批人的审批数据一致性</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 text-center text-muted-foreground">
            <BarChart3 className="mx-auto h-12 w-12 mb-2 opacity-50" />
            <p>审批标准一致性分析看板开发中</p>
            <p className="text-sm">将展示审批人之间通过率的离散度热力图、评分分布异常预警、高频驳回原因 Top 10 等</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
