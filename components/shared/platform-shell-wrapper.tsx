'use client'

import { PlatformShell } from "@/components/platform-shell"
import { useAuth } from "@/lib/stores/auth-context"
import { RoleSwitcher } from "@/components/shared/role-switcher"
import { careerNavigationConfig } from "@/lib/navigation-config"
import type { SideNavItem } from "@/components/platform-shell"

const ROLE_SIDE_NAV_ACCESS: Record<string, string[]> = {
  admin: ['job-construction', 'positions', 'batches', 'workflows', 'approvals', 'student-learning', 'ai-assisted', 'ai-assisted-positions', 'ai-assisted-batch', 'ai-assisted-student', 'ai-assisted-2', 'ai-assisted-2-positions', 'ai-first', 'ai-first-positions', 'ai-first-batch', 'ai-first-student'],
  builder: ['job-construction', 'positions', 'batches', 'workflows', 'approvals', 'student-learning', 'ai-assisted', 'ai-assisted-positions', 'ai-assisted-batch', 'ai-assisted-student', 'ai-assisted-2', 'ai-assisted-2-positions', 'ai-first', 'ai-first-positions', 'ai-first-batch', 'ai-first-student'],
  reviewer: ['job-construction', 'positions', 'batches', 'workflows', 'approvals', 'student-learning', 'ai-assisted', 'ai-assisted-positions', 'ai-assisted-batch', 'ai-assisted-student', 'ai-assisted-2', 'ai-assisted-2-positions', 'ai-first', 'ai-first-positions', 'ai-first-batch', 'ai-first-student'],
}

export function PlatformShellWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  const allowedIds = user ? ROLE_SIDE_NAV_ACCESS[user.role] || [] : []

  const filteredSideNav = careerNavigationConfig.sideNavItems.filter((item: SideNavItem) => {
    if (allowedIds.includes(item.id)) return true
    if (item.children?.some((child) => allowedIds.includes(child.id))) return true
    return false
  }).map((item: SideNavItem) => {
    if (!item.children) return item
    const filteredChildren = item.children.filter((child) => allowedIds.includes(child.id))
    return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : item
  })

  const config = {
    ...careerNavigationConfig,
    currentUserName: user?.name || "管理员",
    currentUserRoleLabel: user ? ({
      admin: '系统管理员',
      builder: '岗位建设者',
      reviewer: '审批者',
      student: '学生',
    } as Record<string, string>)[user.role] || '管理员' : '管理员',
    sideNavItems: filteredSideNav,
  }

  return (
    <PlatformShell config={config} userMenuSlot={<RoleSwitcher />}>
      {children}
    </PlatformShell>
  )
}
