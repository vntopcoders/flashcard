import { Suspense } from 'react'
import SimpleProgressDashboard from '@/components/SimpleProgressDashboard'

export default function ProgressPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading progress dashboard...</div>
      </div>
    }>
      <SimpleProgressDashboard />
    </Suspense>
  )
}

export const metadata = {
  title: 'Progress Dashboard - IELTS Vocabulary',
  description: 'Track your vocabulary learning journey and achievements'
}