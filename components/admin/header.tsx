'use client'

import { RoleSwitcher } from '@/components/shared/role-switcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bell, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useData } from '@/lib/stores/data-context'

interface AdminHeaderProps {
  title?: string
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const { stats } = useData()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-4">
        {title && <h1 className="text-lg font-semibold text-foreground">{title}</h1>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索..."
            className="w-64 pl-9"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {stats.pendingApprovals > 0 && (
            <Badge
              className="absolute -right-1 -top-1 h-5 w-5 justify-center p-0 text-xs"
            >
              {stats.pendingApprovals}
            </Badge>
          )}
        </Button>

        {/* User Menu */}
        <RoleSwitcher />
      </div>
    </header>
  )
}
