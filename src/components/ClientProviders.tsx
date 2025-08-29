'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/contexts/AuthContext'
import { AudioSettingsProvider } from '@/contexts/AudioSettingsContext'

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AuthProvider>
        <AudioSettingsProvider>
          {children}
        </AudioSettingsProvider>
      </AuthProvider>
    </SessionProvider>
  )
}