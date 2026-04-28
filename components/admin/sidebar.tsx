'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/stores/auth-context'
import { useData } from '@/lib/stores/data-context'
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  GitBranch,
  Layers,
  FileCheck,
  BookOpen,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  label: string
  href: string
  icon: typeof LayoutDashboard
  badge?: number
  roles: string[]
}

export function AdminSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { stats } = useData()

  // 角色权限配置：
  // 管理员：数据工作台、批次管理、审批流程管理、能力公共池、评价规则库、审批中心
  // 建设者：岗位大厅、能力公共池、评价规则库
  // 审批者：数据工作台、审批中心、岗位大厅、能力公共池、评价规则库
  const navItems: NavItem[] = [
    {
      label: '数据工作台',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'reviewer'],
    },
    {
      label: '批次管理',
      href: '/batches',
      icon: FolderKanban,
      badge: stats.openBatches,
      roles: ['admin'],
    },
    {
      label: '审批流程管理',
      href: '/workflows',
      icon: GitBranch,
      roles: ['admin'],
    },
    {
      label: '岗位大厅',
      href: '/positions',
      icon: Briefcase,
      badge: stats.totalPositions,
      roles: ['admin', 'builder', 'reviewer'],
    },
    {
      label: '能力公共池',
      href: '/abilities',
      icon: Layers,
      badge: stats.totalAbilities,
      roles: ['admin', 'builder', 'reviewer'],
    },
    {
      label: '评价规则库',
      href: '/rules',
      icon: BookOpen,
      roles: ['admin', 'builder', 'reviewer'],
    },
    {
      label: '审批中心',
      href: '/approvals',
      icon: FileCheck,
      badge: stats.pendingApprovals > 0 ? stats.pendingApprovals : undefined,
      roles: ['admin', 'reviewer'],
    },
  ]

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  )

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 border-r border-sidebar-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Briefcase className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">岗位学习平台</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge
                    variant="secondary"
                    className="h-5 min-w-5 justify-center bg-sidebar-primary/20 text-xs text-sidebar-primary"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent/50 p-3">
            <p className="text-xs text-sidebar-foreground/70">
              当前角色: <span className="font-medium text-sidebar-foreground">{user?.name}</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
