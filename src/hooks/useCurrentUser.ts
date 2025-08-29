'use client'

import { useAuth } from '@/contexts/AuthContext'

export interface CurrentUserData {
  id: string
  name?: string
  email?: string
  image?: string
}

export function useCurrentUser() {
  const { user, isAuthenticated, loading } = useAuth()

  // Dùng trực tiếp NextAuth session thay vì gọi API
  const userData: CurrentUserData | null = user && isAuthenticated ? {
    id: user.id || user.email || 'temp-id',
    name: user.name || undefined,
    email: user.email || undefined,
    image: user.image || undefined
  } : null

  return {
    user: userData,
    isAuthenticated: isAuthenticated && !!userData,
    loading
  }
}