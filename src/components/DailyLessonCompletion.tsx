'use client'

import { useState } from 'react'
import { CheckCircle, Clock, BookOpen, Target, Trophy, Star, ArrowRight } from 'lucide-react'

interface CompletionData {
  wordsLearned: number
  studyTimeMinutes: number
  accuracyPercentage: number
  grammarCompleted: boolean
  skillsPracticed: string[]
}

interface Props {
  dayNumber: number
  phase: string
  onComplete: (data: CompletionData) => void
  onSkip: () => void
  isCompleting?: boolean
}

export default function DailyLessonCompletion({ 
  dayNumber, 
  phase, 
  onComplete, 
  onSkip, 
  isCompleting = false 
}: Props) {
  const [wordsLearned, setWordsLearned] = useState(20)
  const [studyTimeMinutes, setStudyTimeMinutes] = useState(30)
  const [accuracyPercentage, setAccuracyPercentage] = useState(85)
  const [grammarCompleted, setGrammarCompleted] = useState(false)
  const [skillsPracticed, setSkillsPracticed] = useState<string[]>(['vocabulary'])

  const handleComplete = () => {
    onComplete({
      wordsLearned,
      studyTimeMinutes,
      accuracyPercentage,
      grammarCompleted,
      skillsPracticed
    })
  }

  const toggleSkill = (skill: string) => {
    setSkillsPracticed(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const getPhaseColor = () => {
    switch (phase.toLowerCase()) {
      case 'foundation': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'development': return 'bg-green-100 text-green-800 border-green-200'
      case 'mastery': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'expert': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎉 Complete Day {dayNumber}
        </h2>
        
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getPhaseColor()}`}>
          <Star className="w-4 h-4" />
          {phase} Phase
        </div>
        
        <p className="text-gray-600 mt-2">
          Mark your progress and celebrate your achievement!
        </p>
      </div>

      <div className="space-y-6">
        {/* Words Learned */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <label className="font-medium text-blue-900">Words Learned Today</label>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="25"
              value={wordsLearned}
              onChange={(e) => setWordsLearned(parseInt(e.target.value))}
              className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold min-w-[3rem] text-center">
              {wordsLearned}
            </div>
          </div>
          <div className="text-sm text-blue-700 mt-2">
            Target: 20 words • Progress: {Math.round((wordsLearned / 20) * 100)}%
          </div>
        </div>

        {/* Study Time */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-green-600" />
            <label className="font-medium text-green-900">Study Time (minutes)</label>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="5"
              max="60"
              value={studyTimeMinutes}
              onChange={(e) => setStudyTimeMinutes(parseInt(e.target.value))}
              className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold min-w-[3rem] text-center">
              {studyTimeMinutes}
            </div>
          </div>
          <div className="text-sm text-green-700 mt-2">
            Recommended: 25-35 minutes
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-5 h-5 text-purple-600" />
            <label className="font-medium text-purple-900">Accuracy Percentage</label>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={accuracyPercentage}
              onChange={(e) => setAccuracyPercentage(parseInt(e.target.value))}
              className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="bg-purple-600 text-white px-3 py-1 rounded-lg font-bold min-w-[3rem] text-center">
              {accuracyPercentage}%
            </div>
          </div>
          <div className="text-sm text-purple-700 mt-2">
            {accuracyPercentage >= 80 ? 'Excellent! 🎯' : accuracyPercentage >= 60 ? 'Good progress! 👍' : 'Keep practicing! 💪'}
          </div>
        </div>

        {/* Grammar Completed */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={grammarCompleted}
              onChange={(e) => setGrammarCompleted(e.target.checked)}
              className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500"
            />
            <span className="font-medium text-yellow-900">
              📝 Grammar practice completed
            </span>
          </label>
          <div className="text-sm text-yellow-700 mt-1 ml-8">
            Did you practice today&apos;s grammar topics?
          </div>
        </div>

        {/* Skills Practiced */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">🎯 Skills Practiced Today</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['vocabulary', 'grammar', 'reading', 'writing', 'listening', 'speaking'].map(skill => (
              <label key={skill} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skillsPracticed.includes(skill)}
                  onChange={() => toggleSkill(skill)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">{skill}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-8">
        <button
          onClick={handleComplete}
          disabled={isCompleting}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isCompleting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isCompleting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Completing...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Complete Day {dayNumber}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        
        <button
          onClick={onSkip}
          disabled={isCompleting}
          className="px-4 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}