'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Clock, Target, Filter, ChevronRight } from 'lucide-react'

// Complete IELTS Grammar Lessons
const GRAMMAR_LESSONS = [
  // Basic Grammar (Weeks 1-4)
  {
    id: 'present-simple',
    title: 'Present Simple Tense',
    level: 'Basic',
    week: 1,
    duration: '30 min',
    description: 'Learn how to use present simple for facts, habits, and general truths',
    topics: ['Facts & General Truths', 'Habits & Routines', 'Scheduled Events'],
    completed: false
  },
  {
    id: 'present-continuous',
    title: 'Present Continuous Tense', 
    level: 'Basic',
    week: 1,
    duration: '25 min',
    description: 'Express actions happening now or temporary situations',
    topics: ['Actions in Progress', 'Temporary Situations', 'Future Arrangements'],
    completed: false
  },
  {
    id: 'past-simple',
    title: 'Past Simple Tense',
    level: 'Basic', 
    week: 2,
    duration: '30 min',
    description: 'Talk about completed actions in the past',
    topics: ['Completed Past Actions', 'Past Events', 'Time Expressions'],
    completed: false
  },
  {
    id: 'past-continuous',
    title: 'Past Continuous Tense',
    level: 'Basic',
    week: 2,
    duration: '25 min',
    description: 'Describe ongoing actions in the past',
    topics: ['Past Progressive Actions', 'Interrupted Actions', 'Background Events'],
    completed: false
  },
  {
    id: 'present-perfect',
    title: 'Present Perfect Tense',
    level: 'Intermediate',
    week: 3,
    duration: '35 min',
    description: 'Connect past actions to the present moment',
    topics: ['Life Experiences', 'Recent Actions', 'Unfinished Time Periods'],
    completed: false
  },
  {
    id: 'present-perfect-continuous',
    title: 'Present Perfect Continuous',
    level: 'Intermediate', 
    week: 3,
    duration: '30 min',
    description: 'Express duration of actions from past to present',
    topics: ['Duration', 'Recent Activity', 'Temporary Situations'],
    completed: false
  },
  {
    id: 'future-tenses',
    title: 'Future Tenses',
    level: 'Intermediate',
    week: 4,
    duration: '40 min',
    description: 'Master will, going to, and present continuous for future',
    topics: ['Will vs Going to', 'Future Continuous', 'Future Perfect'],
    completed: false
  },
  
  // Intermediate Grammar (Weeks 5-9)
  {
    id: 'conditional-types',
    title: 'Conditional Sentences',
    level: 'Intermediate',
    week: 5,
    duration: '45 min',
    description: 'Master zero, first, second, and third conditionals',
    topics: ['Zero Conditional', 'First Conditional', 'Second Conditional', 'Third Conditional'],
    completed: false
  },
  {
    id: 'passive-voice',
    title: 'Passive Voice',
    level: 'Intermediate',
    week: 6,
    duration: '40 min',
    description: 'Transform active sentences to passive for formal writing',
    topics: ['Basic Passive', 'Passive with Modals', 'Advanced Passive'],
    completed: false
  },
  {
    id: 'reported-speech',
    title: 'Reported Speech',
    level: 'Intermediate',
    week: 7,
    duration: '35 min',
    description: 'Report what others have said with accuracy',
    topics: ['Reporting Statements', 'Reporting Questions', 'Reporting Commands'],
    completed: false
  },
  {
    id: 'modal-verbs',
    title: 'Modal Verbs',
    level: 'Intermediate',
    week: 8,
    duration: '40 min',
    description: 'Express possibility, necessity, and advice',
    topics: ['Possibility & Probability', 'Necessity & Obligation', 'Advice & Suggestion'],
    completed: false
  },
  {
    id: 'relative-clauses',
    title: 'Relative Clauses',
    level: 'Intermediate',
    week: 9,
    duration: '35 min',
    description: 'Combine sentences with who, which, that, where',
    topics: ['Defining Clauses', 'Non-defining Clauses', 'Reduced Clauses'],
    completed: false
  },
  
  // Advanced Grammar (Weeks 10-14)
  {
    id: 'subjunctive-mood',
    title: 'Subjunctive Mood',
    level: 'Advanced',
    week: 10,
    duration: '35 min',
    description: 'Express wishes, recommendations, and hypothetical situations',
    topics: ['Wishes & Regrets', 'Recommendations', 'Hypothetical Situations'],
    completed: false
  },
  {
    id: 'inversion',
    title: 'Inversion',
    level: 'Advanced',
    week: 11,
    duration: '30 min',
    description: 'Use inverted word order for emphasis and formality',
    topics: ['Negative Inversion', 'Conditional Inversion', 'Emphasis Inversion'],
    completed: false
  },
  {
    id: 'cleft-sentences',
    title: 'Cleft Sentences',
    level: 'Advanced',
    week: 12,
    duration: '30 min',
    description: 'Emphasize information with it-cleft and wh-cleft structures',
    topics: ['It-cleft Sentences', 'Wh-cleft Sentences', 'Pseudo-cleft'],
    completed: false
  },
  {
    id: 'mixed-conditionals',
    title: 'Mixed Conditionals',
    level: 'Advanced',
    week: 13,
    duration: '35 min',
    description: 'Combine different time periods in conditional sentences',
    topics: ['Past-Present Mix', 'Present-Past Mix', 'Complex Conditionals'],
    completed: false
  },
  {
    id: 'advanced-passive',
    title: 'Advanced Passive Structures',
    level: 'Advanced',
    week: 14,
    duration: '40 min',
    description: 'Complex passive constructions for academic writing',
    topics: ['Have/Get + Object + Past Participle', 'Passive Reporting', 'Impersonal Passive'],
    completed: false
  },
  
  // IELTS Specific Grammar (Weeks 15-19)
  {
    id: 'academic-writing-grammar',
    title: 'Academic Writing Grammar',
    level: 'IELTS',
    week: 15,
    duration: '45 min',
    description: 'Grammar structures specifically for IELTS Writing Task 2',
    topics: ['Complex Sentences', 'Nominalization', 'Academic Phrases'],
    completed: false
  },
  {
    id: 'complex-sentence-structures',
    title: 'Complex Sentence Structures',
    level: 'IELTS',
    week: 16,
    duration: '40 min',
    description: 'Build sophisticated sentences for high band scores',
    topics: ['Subordination', 'Coordination', 'Sentence Variety'],
    completed: false
  },
  {
    id: 'cohesive-devices',
    title: 'Cohesive Devices',
    level: 'IELTS',
    week: 17,
    duration: '35 min',
    description: 'Link ideas effectively in IELTS writing',
    topics: ['Linking Words', 'Reference Words', 'Substitution'],
    completed: false
  },
  {
    id: 'formal-register',
    title: 'Formal Register',
    level: 'IELTS',
    week: 18,
    duration: '30 min',
    description: 'Use appropriate formality level in IELTS tasks',
    topics: ['Formal vs Informal', 'Academic Vocabulary', 'Register Consistency'],
    completed: false
  },
  {
    id: 'error-correction',
    title: 'Common Grammar Errors',
    level: 'IELTS',
    week: 19,
    duration: '35 min',
    description: 'Identify and fix typical mistakes in IELTS',
    topics: ['Article Errors', 'Preposition Mistakes', 'Word Order Problems'],
    completed: false
  }
]

export default function GrammarLessonsList() {
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedWeek, setSelectedWeek] = useState<string>('all')

  const levels = ['all', 'Basic', 'Intermediate', 'Advanced', 'IELTS']
  const weeks = ['all', ...Array.from({length: 19}, (_, i) => (i + 1).toString())]

  const filteredLessons = GRAMMAR_LESSONS.filter(lesson => {
    const levelMatch = selectedLevel === 'all' || lesson.level === selectedLevel
    const weekMatch = selectedWeek === 'all' || lesson.week.toString() === selectedWeek
    return levelMatch && weekMatch
  })

  const groupedLessons = filteredLessons.reduce((groups, lesson) => {
    const key = lesson.level
    if (!groups[key]) groups[key] = []
    groups[key].push(lesson)
    return groups
  }, {} as Record<string, typeof GRAMMAR_LESSONS>)

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Basic': return 'bg-green-100 text-green-800 border-green-200'
      case 'Intermediate': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Advanced': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'IELTS': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          IELTS Grammar Lessons
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master English grammar with our comprehensive 19-week program. 
          From basic tenses to advanced IELTS structures.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Lessons</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {levels.map(level => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Levels' : level}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Week
            </label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {weeks.map(week => (
                <option key={week} value={week}>
                  {week === 'all' ? 'All Weeks' : `Week ${week}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lessons by Level */}
      <div className="space-y-8">
        {Object.entries(groupedLessons).map(([level, lessons]) => (
          <div key={level} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className={`px-6 py-4 ${getLevelColor(level)} border-b`}>
              <h2 className="text-xl font-semibold flex items-center gap-3">
                <Target className="w-6 h-6" />
                {level} Level ({lessons.length} lessons)
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid gap-4">
                {lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/grammar/${lesson.id}`}
                    className="block p-6 border rounded-lg hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {lesson.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            {lesson.duration}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">
                          {lesson.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {lesson.topics.map((topic, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 ml-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(lesson.level)}`}>
                          Week {lesson.week}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Complete Grammar Program
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {GRAMMAR_LESSONS.length}
              </div>
              <div className="text-gray-600">Total Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">19</div>
              <div className="text-gray-600">Study Weeks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">4</div>
              <div className="text-gray-600">Skill Levels</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">8.0+</div>
              <div className="text-gray-600">Target Band</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}