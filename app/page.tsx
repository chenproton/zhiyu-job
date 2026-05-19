'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/stores/auth-context'

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      if (user.role === 'student') {
        router.push('/explore')
      } else {
        router.push('/positions')
      }
    }
  }, [user, router])

  return null
}
