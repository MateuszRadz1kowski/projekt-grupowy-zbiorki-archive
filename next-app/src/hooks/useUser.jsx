// lib/hooks/useUser.js
'use client'
import { useState, useEffect } from 'react'
import { pocketbase } from '@/lib/pocketbase'
import { useRouter } from 'next/navigation'

export function useUser() {
  const router = useRouter()
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    setUser(pocketbase.authStore.record)
  }, [])

  const logout = () => {
    pocketbase.authStore.clear()
    router.push('/auth/login')
  }

  return { user, logout }
}
