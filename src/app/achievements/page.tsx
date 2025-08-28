import { Suspense } from 'react'
import AchievementDashboard from '@/components/AchievementDashboard'

export default function AchievementsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading achievements...</div>
      </div>
    }>
      <AchievementDashboard />
    </Suspense>
  )
}

export const metadata = {
  title: 'Achievements - IELTS Vocabulary Learning',
  description: 'Track your learning progress with achievements, badges, and milestones'
}