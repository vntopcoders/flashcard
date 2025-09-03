import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const GrammarLessonsList = dynamic(() => import('@/components/GrammarLessonsList'), {
  loading: () => <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading grammar lessons...</div>
})

export default function GrammarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <GrammarLessonsList />
      </Suspense>
    </div>
  )
}

export const metadata = {
  title: 'Grammar Exercises - IELTS Vocabulary',
  description: 'Practice IELTS grammar with interactive exercises and instant feedback'
}