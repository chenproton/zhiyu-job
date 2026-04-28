'use client'

import { useAuth } from '@/lib/stores/auth-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ROLE_LABELS, type UserRole } from '@/lib/types'
import { ChevronDown, LogOut, UserCog } from 'lucide-react'
import { useRouter } from 'next/navigation'

const roles: UserRole[] = ['admin', 'builder', 'reviewer', 'student']

export function RoleSwitcher() {
  const { user, switchRole, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  const handleSwitchRole = (role: UserRole) => {
    switchRole(role)
    if (role === 'student') {
      router.push('/explore')
    } else {
      router.push('/dashboard')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-sm">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>切换角色</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleSwitchRole(role)}
            className={user.role === role ? 'bg-accent' : ''}
          >
            <UserCog className="mr-2 h-4 w-4" />
            {ROLE_LABELS[role]}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
