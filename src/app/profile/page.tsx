'use client'

import React from 'react'
import UserProfile from '@/components/UserProfile'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <UserProfile />
      </div>
    </div>
  )
}