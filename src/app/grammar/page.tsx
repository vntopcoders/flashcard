import { Suspense } from 'react'
import GrammarExercise from '@/components/GrammarExercise'

export default function GrammarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading grammar exercises...</div>
      </div>
    }>
      <div className="min-h-screen bg-gray-50">
        <GrammarExercise />
      </div>
    </Suspense>
  )
}

export const metadata = {
  title: 'Grammar Exercises - IELTS Vocabulary',
  description: 'Practice IELTS grammar with interactive exercises and instant feedback'
}