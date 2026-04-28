"use client"

import Link from "next/link"
import { useData } from "@/lib/stores/data-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Heart,
  Briefcase,
  Building2,
  Clock,
  GraduationCap,
  Trash2,
  ChevronRight
} from "lucide-react"

export default function FavoritesPage() {
  const { positions, favorites, toggleFavorite } = useData()

  const favoritePositions = positions.filter((p) => favorites.includes(p.id))

  return (
    <div className="pb-20 md:pb-0">
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">我的收藏</h1>
            <p className="mt-2 text-muted-foreground">
              你收藏的岗位列表，方便随时查看和学习
            </p>
          </div>

          {favoritePositions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Heart className="h-16 w-16 text-muted-foreground/30" />
                <h3 className="mt-6 text-lg font-medium">暂无收藏</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  浏览岗位时点击收藏按钮，即可将感兴趣的岗位添加到这里
                </p>
                <Link href="/explore" className="mt-6">
                  <Button className="gap-2">
                    探索岗位 <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favoritePositions.map((position) => (
                <Card key={position.id} className="group transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary">
                            {position.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {position.industry || "综合行业"}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => toggleFavorite(position.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {position.description || "暂无描述"}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {position.abilityModel?.nodes.length || 0} 个能力点
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {position.estimatedHours || 40} 学时
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {position.abilityModel?.nodes.slice(0, 3).map((ability) => (
                        <Badge key={ability.id} variant="secondary" className="text-xs">
                          {ability.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <Link href={`/explore/${position.id}`} className="w-full">
                      <Button className="w-full">查看详情</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
