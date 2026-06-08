"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Sparkles, BarChart3, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"

export default function AiAssistedQualityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">岗位质量分析(AI辅助)</h1>
        <p className="text-muted-foreground">AI 对岗位资源进行综合质量评分与一致性分析</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均分</p>
                <p className="text-3xl font-bold">82.4</p>
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
                <p className="text-3xl font-bold">12</p>
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
                <p className="text-3xl font-bold">5</p>
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
                <p className="text-3xl font-bold">2</p>
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
            { name: "2026春季人工智能岗位开发", score: 92, completeness: 95, logic: 90, standardization: 88, richness: 94, studentValue: 93 },
            { name: "2026春季电商实训岗位", score: 85, completeness: 88, logic: 86, standardization: 82, richness: 87, studentValue: 84 },
            { name: "2025秋季财务管理岗位", score: 78, completeness: 80, logic: 82, standardization: 75, richness: 76, studentValue: 79 },
            { name: "2025秋季市场营销岗位", score: 72, completeness: 70, logic: 74, standardization: 68, richness: 75, studentValue: 71 },
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
