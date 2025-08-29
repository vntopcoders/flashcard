import { Suspense } from 'react'
import DailyDashboard from '@/components/DailyDashboard'

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading daily dashboard...</div>
      </div>
    }>
      <div className="min-h-screen bg-gray-50">
        <DailyDashboard />
      </div>
    </Suspense>
  )
}

export const metadata = {
  title: 'Daily Dashboard - IELTS Vocabulary',
  description: 'Your personalized daily study dashboard with tasks, progress, and recommendations'
}