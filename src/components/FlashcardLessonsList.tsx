'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Target, Users, Clock, ChevronRight, Filter, Search } from 'lucide-react'

interface Lesson {
  id: string
  name: string
  description: string
  color: string
  flashcard_count: number
  created_at: string
}

// Organized lesson structure for IELTS preparation
const LESSON_ORGANIZATION = {
  'Foundation (Band 4.0-5.5)': {
    color: '#10B981',
    description: 'Essential vocabulary for IELTS beginners',
    targetBand: '4.0-5.5',
    expectedLessons: [
      'IELTS Core 1000 Words',
      'IELTS 4000 - Band 5.0-5.5 Essential',
      'IELTS Level 1',
      'Basic Academic Vocabulary'
    ]
  },
  'Intermediate (Band 6.0-6.5)': {
    color: '#3B82F6', 
    description: 'Vocabulary for intermediate IELTS students',
    targetBand: '6.0-6.5',
    expectedLessons: [
      'IELTS Academic 1000 Words',
      'IELTS 4000 - Band 6.0-6.5 Intermediate',
      'IELTS Level 2',
      'IELTS Level 3',
      'AWL Sublist 1',
      'AWL Sublist 2'
    ]
  },
  'Advanced (Band 7.0-7.5)': {
    color: '#8B5CF6',
    description: 'Advanced vocabulary for high band scores',
    targetBand: '7.0-7.5', 
    expectedLessons: [
      'IELTS Advanced 1000 Words',
      'IELTS 4000 - Band 7.0-7.5 Advanced',
      'IELTS Level 4',
      'AWL Sublist 3',
      'AWL Sublist 4'
    ]
  },
  'Expert (Band 8.0+)': {
    color: '#EF4444',
    description: 'Expert vocabulary for highest band scores',
    targetBand: '8.0+',
    expectedLessons: [
      'IELTS 4000 - Band 8.0+ Expert',
      'IELTS Level 5',
      'AWL Sublist 5',
      'Advanced Academic Discourse'
    ]
  },
  'Topic-Specific': {
    color: '#F59E0B',
    description: 'Specialized vocabulary by topic areas',
    targetBand: 'All Levels',
    expectedLessons: [
      'Education & Learning',
      'Technology & Innovation', 
      'Environment & Climate',
      'Health & Medicine',
      'Business & Economics',
      'Crime & Society'
    ]
  }
}

export default function FlashcardLessonsList() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons')
      if (response.ok) {
        const data = await response.json()
        // Remove duplicates and organize
        const uniqueLessons = removeDuplicateLessons(data)
        setLessons(uniqueLessons)
      }
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeDuplicateLessons = (lessons: Lesson[]) => {
    const seen = new Set<string>()
    const unique: Lesson[] = []
    
    // Sort by created_at desc to keep newest versions
    const sorted = lessons.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    
    for (const lesson of sorted) {
      // Create a normalized key for comparison
      const key = lesson.name.toLowerCase().replace(/\s+/g, ' ').trim()
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(lesson)
      }
    }
    
    return unique
  }

  const categorizeLesson = (lesson: Lesson) => {
    const name = lesson.name.toLowerCase()
    
    // Foundation level
    if (name.includes('core 1000') || name.includes('band 5.0-5.5') || 
        name.includes('level 1 (1-20)') || name.includes('essential')) {
      return 'Foundation (Band 4.0-5.5)'
    }
    
    // Intermediate level  
    if (name.includes('academic 1000') || name.includes('band 6.0-6.5') ||
        name.includes('level 2') || name.includes('level 3') ||
        name.includes('sublist 1') || name.includes('sublist 2')) {
      return 'Intermediate (Band 6.0-6.5)'
    }
    
    // Advanced level
    if (name.includes('advanced 1000') || name.includes('band 7.0-7.5') ||
        name.includes('level 4') || name.includes('sublist 3') || name.includes('sublist 4')) {
      return 'Advanced (Band 7.0-7.5)'
    }
    
    // Expert level
    if (name.includes('band 8.0+') || name.includes('level 5') || 
        name.includes('sublist 5') || name.includes('expert')) {
      return 'Expert (Band 8.0+)'
    }
    
    // Topic-specific
    if (name.includes('education') || name.includes('technology') || 
        name.includes('environment') || name.includes('health') ||
        name.includes('business') || name.includes('crime') ||
        name.includes('ielts liz')) {
      return 'Topic-Specific'
    }
    
    return 'Other'
  }

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedLevel === 'all') return matchesSearch
    
    const category = categorizeLesson(lesson)
    return matchesSearch && category === selectedLevel
  })

  const groupedLessons = filteredLessons.reduce((groups, lesson) => {
    const category = categorizeLesson(lesson)
    if (!groups[category]) groups[category] = []
    groups[category].push(lesson)
    return groups
  }, {} as Record<string, Lesson[]>)

  const getLevelInfo = (level: string) => {
    return LESSON_ORGANIZATION[level as keyof typeof LESSON_ORGANIZATION] || {
      color: '#6B7280',
      description: 'Other vocabulary lessons',
      targetBand: 'Various'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vocabulary lessons...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            IELTS Vocabulary Lessons
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master IELTS vocabulary with our structured lesson progression. 
            From foundation to expert level - 1497 words across all topics.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Find Your Level</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Lessons
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                {Object.keys(LESSON_ORGANIZATION).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lesson Groups */}
        <div className="space-y-8">
          {Object.entries(groupedLessons).map(([level, levelLessons]) => {
            const levelInfo = getLevelInfo(level)
            const totalWords = levelLessons.reduce((sum, lesson) => sum + lesson.flashcard_count, 0)
            
            return (
              <div key={level} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div 
                  className="px-6 py-4 border-b"
                  style={{ backgroundColor: levelInfo.color + '10', borderLeftColor: levelInfo.color, borderLeftWidth: '4px' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                        <Target className="w-6 h-6" style={{ color: levelInfo.color }} />
                        {level}
                      </h2>
                      <p className="text-gray-600 mt-1">{levelInfo.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Target Band</div>
                      <div className="text-lg font-semibold" style={{ color: levelInfo.color }}>
                        {levelInfo.targetBand}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid gap-4">
                    {levelLessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        href={`/?lesson=${lesson.id}`}
                        className="block p-6 border rounded-lg hover:shadow-md transition-all group hover:border-blue-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: lesson.color }}
                              />
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {lesson.name}
                              </h3>
                            </div>
                            
                            <p className="text-gray-600 mb-3">
                              {lesson.description}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                {lesson.flashcard_count} words
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                ~{Math.ceil(lesson.flashcard_count / 10)} min
                              </div>
                            </div>
                          </div>
                          
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors ml-4" />
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{levelLessons.length} lessons in this level</span>
                      <span>{totalWords} total words</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Complete IELTS Vocabulary Program
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {lessons.length}
                </div>
                <div className="text-gray-600">Active Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  1497+
                </div>
                <div className="text-gray-600">Vocabulary Words</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  4
                </div>
                <div className="text-gray-600">Skill Levels</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  8.0+
                </div>
                <div className="text-gray-600">Target Band</div>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                href="/study-plan"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Users className="w-5 h-5" />
                View Study Plan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}