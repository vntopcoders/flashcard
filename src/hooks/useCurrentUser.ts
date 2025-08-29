'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'

export interface CurrentUserData {
  id: string
  name?: string
  email?: string
  image?: string
}

export function useCurrentUser() {
  const { user, isAuthenticated, loading } = useAuth()
  const [userData, setUserData] = useState<CurrentUserData | null>(null)
  const [userLoading, setUserLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      if (!isAuthenticated || !user?.email || loading) {
        setUserData(null)
        setUserLoading(false)
        return
      }

      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          setUserData({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            image: data.user.image
          })
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setUserLoading(false)
      }
    }

    fetchUserData()
  }, [isAuthenticated, user?.email, loading])

  return {
    user: userData,
    isAuthenticated: isAuthenticated && !!userData,
    loading: loading || userLoading
  }
}