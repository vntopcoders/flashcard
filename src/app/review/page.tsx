import { Suspense } from 'react'
import SimpleReviewQueue from '@/components/SimpleReviewQueue'

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading review system...</div>
      </div>
    }>
      <SimpleReviewQueue />
    </Suspense>
  )
}

export const metadata = {
  title: 'Review Queue - IELTS Vocabulary',
  description: 'Study your vocabulary with spaced repetition for optimal retention'
}