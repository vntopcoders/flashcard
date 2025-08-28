import { Suspense } from 'react'
import StudyPlan from '@/components/StudyPlan'

export default function StudyPlanPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading study plan...</div>
      </div>
    }>
      <StudyPlan />
    </Suspense>
  )
}

export const metadata = {
  title: '24-Week IELTS Study Plan - Vocabulary Learning',
  description: 'Structured 24-week journey from IELTS Band 4.0 to 7.0+ with daily tasks and milestones'
}