'use client'

import { useState, useEffect } from 'react'
import { Calendar, BookOpen, Clock, CheckCircle, Play, Star, Target } from 'lucide-react'
import { getCurrentUserId } from '@/lib/user-utils'

interface DailyLesson {
  id: string
  day_number: number
  week_number: number
  day_of_week: number
  title: string
  description: string
  target_words: number
  phase: string
  grammar_focus: string
  skills_focus: string[]
  day_name: string
  actual_words: number
  is_completed?: boolean
}

interface Props {
  currentWeek: number
  onLessonSelect: (lessonId: string) => void
  selectedLessonId?: string
}

export default function DailyLessonsView({ currentWeek, onLessonSelect, selectedLessonId }: Props) {
  const [dailyLessons, setDailyLessons] = useState<DailyLesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'week' | 'all'>('week')

  useEffect(() => {
    fetchDailyLessons()
  }, [currentWeek, viewMode])

  const fetchDailyLessons = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // For now, create mock data based on our 36-week plan
      const mockLessons: DailyLesson[] = []
      
      const startDay = viewMode === 'week' ? (currentWeek - 1) * 7 + 1 : 1
      const endDay = viewMode === 'week' ? currentWeek * 7 : 252
      
      for (let day = startDay; day <= Math.min(endDay, 252); day++) {
        const weekNum = Math.ceil(day / 7)
        const dayOfWeek = ((day - 1) % 7) + 1
        
        // Determine phase
        let phase = 'Foundation'
        if (weekNum > 12) phase = 'Development'
        if (weekNum > 24) phase = 'Mastery'
        if (weekNum > 32) phase = 'Expert'
        
        // Generate lesson data
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const lesson: DailyLesson = {
          id: `day-${day}`,
          day_number: day,
          week_number: weekNum,
          day_of_week: dayOfWeek,
          title: getDailyTitle(day, dayOfWeek),
          description: getDailyDescription(day, phase),
          target_words: 20,
          phase,
          grammar_focus: getGrammarFocus(weekNum),
          skills_focus: getSkillsFocus(dayOfWeek),
          day_name: dayNames[dayOfWeek - 1],
          actual_words: 20, // Standard target words
          is_completed: false // Will be updated with real data
        }
        
        mockLessons.push(lesson)
      }
      
      // Fetch real completion data and update lessons
      try {
        const userId = getCurrentUserId()
        const completedResponse = await fetch(`/api/daily-lesson/completed?user_id=${userId}`)
        if (completedResponse.ok) {
          const completedData = await completedResponse.json()
          const completedDays = new Set(completedData.data?.completed_days || [])
          
          // Update lessons with real completion status
          mockLessons.forEach(lesson => {
            lesson.is_completed = completedDays.has(lesson.day_number)
          })
          
          console.log('✅ Updated lessons with completion data:', {
            total_lessons: mockLessons.length,
            completed_count: Array.from(completedDays).length,
            completed_days: Array.from(completedDays).slice(0, 10) // Show first 10
          })
        }
      } catch (completionError) {
        console.log('Could not fetch completion data, using defaults:', completionError)
      }
      
      setDailyLessons(mockLessons)
    } catch (error) {
      console.error('Error fetching daily lessons:', error)
      setError('Failed to load daily lessons')
    } finally {
      setLoading(false)
    }
  }

  const getDailyTitle = (day: number, dayOfWeek: number): string => {
    const weekNum = Math.ceil(day / 7)
    const dayNames = ['Foundation Start', 'Vocabulary Building', 'Grammar Focus', 'Skills Practice', 'Speaking Day', 'Writing Focus', 'Weekly Review']
    
    if (dayOfWeek === 7) return `Week ${weekNum} Review`
    return `Day ${day}: ${dayNames[dayOfWeek - 1]}`
  }

  const getDailyDescription = (day: number, phase: string): string => {
    const descriptions = {
      Foundation: 'Build essential IELTS vocabulary and basic grammar structures',
      Development: 'Develop intermediate skills with complex grammar patterns',
      Mastery: 'Master advanced structures for Band 7.0+ achievement',
      Expert: 'Perfect Band 8.0+ structures with error-free accuracy'
    }
    return descriptions[phase as keyof typeof descriptions] || 'IELTS preparation'
  }

  const getGrammarFocus = (week: number): string => {
    const grammarTopics = [
      'Present Simple & Continuous', 'Modal Verbs', 'Perfect Tenses', 'Conditionals',
      'Passive Voice', 'Future Tenses', 'Gerunds & Infinitives', 'Articles',
      'Relative Clauses', 'Reported Speech', 'Advanced Conditionals', 'Subjunctive',
      'Advanced Passive', 'Inversion', 'Participles', 'Cleft Sentences',
      'Advanced Modals', 'Nominalization', 'Complex Structures', 'Hedging',
      'Cohesion Devices', 'Verb Patterns', 'Register Variation', 'Error Analysis',
      'Reduced Clauses', 'Complex Participles', 'Advanced Inversion', 'Sophisticated Conditionals',
      'Academic Hedging', 'Complex Prepositions', 'Discourse Markers', 'Register Mastery',
      'Fronting & Dislocation', 'Expletive Constructions', 'Advanced Subjunctive', 'Error-free Integration'
    ]
    return grammarTopics[week - 1] || 'Grammar Practice'
  }

  const getSkillsFocus = (dayOfWeek: number): string[] => {
    const skillsByDay = [
      ['vocabulary', 'grammar'],
      ['vocabulary', 'reading'],
      ['grammar', 'writing'],
      ['vocabulary', 'listening'],
      ['speaking', 'vocabulary'],
      ['writing', 'vocabulary'],
      ['review', 'all-skills']
    ]
    return skillsByDay[dayOfWeek - 1] || ['vocabulary']
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Foundation': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Development': return 'bg-green-100 text-green-800 border-green-200'
      case 'Mastery': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Expert': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'vocabulary': return <BookOpen className="w-3 h-3" />
      case 'grammar': return <Star className="w-3 h-3" />
      case 'reading': return <BookOpen className="w-3 h-3" />
      case 'writing': return <Star className="w-3 h-3" />
      case 'listening': return <Play className="w-3 h-3" />
      case 'speaking': return <Play className="w-3 h-3" />
      case 'review': return <Target className="w-3 h-3" />
      default: return <BookOpen className="w-3 h-3" />
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            📅 Daily Lessons - Week {currentWeek}
          </h2>
          <p className="text-gray-600 mt-1">
            20 words per day • {dailyLessons[0]?.phase} Phase
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setViewMode('all')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {dailyLessons.map((lesson) => (
          <div
            key={lesson.id}
            className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md cursor-pointer ${
              selectedLessonId === lesson.id
                ? 'border-blue-500 bg-blue-50'
                : lesson.is_completed
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            onClick={() => onLessonSelect(lesson.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">
                  {lesson.day_name}
                </span>
              </div>
              {lesson.is_completed && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>

            <div className="mb-3">
              <h3 className="font-medium text-gray-800 text-sm mb-1">
                {lesson.title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2">
                {lesson.description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  📚 {lesson.actual_words}/{lesson.target_words} words
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPhaseColor(lesson.phase)}`}>
                  {lesson.phase}
                </span>
              </div>

              <div className="text-xs text-gray-600">
                <div className="mb-1">
                  <strong>Grammar:</strong> {lesson.grammar_focus}
                </div>
                <div className="flex items-center gap-1">
                  <strong>Skills:</strong>
                  {lesson.skills_focus.map((skill, index) => (
                    <span key={index} className="inline-flex items-center gap-1">
                      {getSkillIcon(skill)}
                      <span className="capitalize">{skill}</span>
                      {index < lesson.skills_focus.length - 1 && <span className="mx-1">•</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    lesson.is_completed ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${(lesson.actual_words / lesson.target_words) * 100}%` }}
                />
              </div>
            </div>

            {selectedLessonId === lesson.id && (
              <div className="mt-3 flex items-center gap-1 text-blue-600 text-xs">
                <Play className="w-3 h-3" />
                Ready to study
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-gray-200">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  // Navigate to flashcard system with daily lesson
                  window.location.href = `/?daily-lesson=${lesson.day_number}&phase=${lesson.phase.toLowerCase()}`
                }}
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                🚀 Start Day {lesson.day_number}
              </button>
            </div>
          </div>
        ))}
      </div>

      {viewMode === 'all' && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Showing {dailyLessons.length} daily lessons • 
            Total: {dailyLessons.length * 20} words across {Math.ceil(dailyLessons.length / 7)} weeks
          </p>
        </div>
      )}
    </div>
  )
}