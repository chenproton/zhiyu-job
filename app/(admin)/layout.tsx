'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/stores/auth-context'
import { PlatformShellWrapper } from '@/components/shared/platform-shell-wrapper'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role === 'student') {
      router.push('/explore')
    }
  }, [user, router])

  if (user?.role === 'student') {
    return null
  }

  return <PlatformShellWrapper>{children}</PlatformShellWrapper>
}
