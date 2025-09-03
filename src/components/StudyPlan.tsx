'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Target, 
  CheckCircle, 
  Clock, 
  BookOpen,
  Flame,
  Play,
  Pause,
  BarChart3,
  Brain,
  Edit3,
  Headphones,
  MessageSquare,
  LogIn
} from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { getCurrentUserId } from '@/lib/user-utils'
import AchievementHeader from './AchievementHeader'
import AchievementPanel from './AchievementPanel'
import AchievementToast from './AchievementToast'
import { Achievement } from './AchievementBadge'
import GrammarWeekContent from './GrammarWeekContent'
import DailyLessonsView from './DailyLessonsView'

interface StudyWeek {
  week: number
  title: string
  targetBand: string
  vocabularyGoal: number
  grammarUnits: string
  grammarTheory?: string
  grammarKeyPoints?: string[]
  lessonLinks?: string[]
  grammarLinks?: string[]
  focusSkills: string[]
  milestones: string[]
  dailyHours: number
  isCompleted: boolean
  isActive: boolean
  hasProgress?: boolean
  completedDays?: number
}

interface DailyTask {
  id: string
  time: string
  duration: number
  title: string
  description: string
  skill: 'vocabulary' | 'grammar' | 'reading' | 'writing' | 'listening' | 'speaking'
  isCompleted: boolean
  resources?: string[]
}

interface StudyPlanData {
  currentWeek: number
  currentDay: number
  totalWeeks: 36
  startDate: Date
  targetScore: number
  currentScore: number
  weeklyPlans: StudyWeek[]
  todaysTasks: DailyTask[]
  overallProgress: {
    vocabularyLearned: number
    vocabularyTarget: number
    grammarCompleted: number
    grammarTarget: number
    mockTestsCompleted: number
    studyDays: number
    currentStreak: number
  }
}

export default function StudyPlan() {
  const { user, isAuthenticated, loading: userLoading } = useCurrentUser()
  const [studyData, setStudyData] = useState<StudyPlanData | null>(null)
  const [selectedWeek, setSelectedWeek] = useState<number>(1)
  const [showDailyView, setShowDailyView] = useState(false)
  const [showDailyLessons, setShowDailyLessons] = useState(true) // Default to true
  const [selectedDailyLesson, setSelectedDailyLesson] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  
  // Achievement system state
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [showAchievements, setShowAchievements] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [userLevel, setUserLevel] = useState(1)
  const [totalPoints, setTotalPoints] = useState(0)
  const [pointsForNext, setPointsForNext] = useState(100)

  useEffect(() => {
    if (!userLoading && !initialized) {
      setInitialized(true)
      loadStudyPlan()
      loadAchievements()
    }
  }, [userLoading, initialized])

  const loadAchievements = async () => {
    try {
      const userId = getCurrentUserId()
      const response = await fetch(`/api/achievements?user_id=${userId}`)
      const result = await response.json()
      
      if (result.success) {
        console.log('🏆 Achievement data loaded:', {
          achievements: result.data.achievements.length,
          unlocked: result.data.achievements.filter((a: Achievement) => a.isUnlocked).length,
          level: result.data.level,
          totalPoints: result.data.totalPoints
        })
        setAchievements(result.data.achievements)
        setUserLevel(result.data.level)
        setTotalPoints(result.data.totalPoints)
        setPointsForNext(result.data.pointsForNext)
      } else {
        console.error('❌ Achievement loading failed:', result)
      }
    } catch (error) {
      console.error('Failed to load achievements:', error)
    }
  }

  const resetProgress = async () => {
    try {
      const response = await fetch('/api/user-progress/reset', {
        method: 'POST',
      })
      const result = await response.json()
      
      if (result.success) {
        // Reload study plan with reset data
        loadStudyPlan()
        loadAchievements()
        alert('Progress đã được reset về tuần 1!')
      } else {
        alert('Có lỗi khi reset progress')
      }
    } catch (error) {
      console.error('Failed to reset progress:', error)
      alert('Có lỗi khi reset progress')
    }
  }

  const loadStudyPlan = async () => {
    try {
      setIsLoading(true)
      
      // Get real user progress data
      const userId = getCurrentUserId()
      let realUserData = {
        currentWeek: 1,
        currentDay: 1,
        totalDaysStudied: 0,
        totalWordsLearned: 0,
        currentPhase: 'Foundation'
      }
      
      try {
        const userResponse = await fetch(`/api/user/sync-progress?user_id=${userId}`)
        if (userResponse.ok) {
          const userData = await userResponse.json()
          if (userData.success && userData.data.user_progress) {
            const progress = userData.data.user_progress
            realUserData = {
              currentWeek: progress.current_week || 1,
              currentDay: progress.current_day || 1,
              totalDaysStudied: progress.total_days_studied || 0,
              totalWordsLearned: progress.total_words_learned || 0,
              currentPhase: progress.current_phase || 'Foundation'
            }
          }
        }
      } catch (userError) {
        console.log('Using default user data:', userError)
      }
      
      // Create study plan with real user data
      const mockData: StudyPlanData = {
        currentWeek: realUserData.currentWeek,
        currentDay: realUserData.currentDay,
        totalWeeks: 36,
        startDate: new Date('2025-08-01'),
        targetScore: 8.0,
        currentScore: 5.5,
        overallProgress: {
          vocabularyLearned: realUserData.totalWordsLearned,
          vocabularyTarget: 5000,
          grammarCompleted: Math.floor(realUserData.totalDaysStudied * 1.2), // Estimate
          grammarTarget: 180,
          mockTestsCompleted: Math.floor(realUserData.totalDaysStudied / 7), // Weekly tests
          studyDays: realUserData.totalDaysStudied,
          currentStreak: 7
        },
        weeklyPlans: [
          // Foundation Phase (Weeks 1-12) - Band 4.0 to 5.5
          {
            week: 1,
            title: 'Foundation Building - Assessment',
            targetBand: '4.0-4.5',
            vocabularyGoal: 140,
            grammarUnits: 'Present Simple & Present Continuous',
            grammarTheory: 'Thì hiện tại đơn và hiện tại tiếp diễn là nền tảng cơ bản nhất trong tiếng Anh. Thì hiện tại đơn diễn tả thói quen, sự thật hiển nhiên. Thì hiện tại tiếp diễn diễn tả hành động đang xảy ra tại thời điểm nói.',
            grammarKeyPoints: [
              'Present Simple: S + V/V-s/es (thói quen, sự thật)',
              'Present Continuous: S + am/is/are + V-ing (hành động đang diễn ra)',
              'Cách sử dụng adverbs of frequency với Present Simple',
              'Time expressions: now, at the moment, usually, always'
            ],
            lessonLinks: ['/lessons?level=Foundation', '/?lesson=2ed7cd0a-b814-416c-a187-3cf4de2481fd-chunk-1', '/?lesson=41a70e26-5fa3-4d2b-98d3-a5d3a806467b-chunk-1'],
            grammarLinks: ['/grammar/present-simple', '/grammar/present-continuous'],
            focusSkills: ['Vocabulary', 'Basic Grammar', 'Assessment'],
            milestones: ['Complete mock test', 'Setup Anki', 'Learn 300 words'],
            dailyHours: 2.5,
            isCompleted: true,
            isActive: false
          },
          {
            week: 2,
            title: 'Modal Verbs & Ability',
            targetBand: '4.5-5.0',
            vocabularyGoal: 140,
            grammarUnits: 'Modal Verbs (Can, Could, May, Might)',
            grammarTheory: 'Động từ khuyết thiếu (Modal verbs) là những động từ đặc biệt diễn tả khả năng, sự cho phép, nghĩa vụ, lời khuyên. Chúng không chia theo ngôi và luôn đi với động từ nguyên mẫu không "to".',
            grammarKeyPoints: [
              'Can/Could: khả năng, sự cho phép (có thể)',
              'May/Might: khả năng, sự cho phép lịch sự (có lẽ)',
              'Must/Have to: nghĩa vụ, sự cần thiết (phải)',
              'Should/Ought to: lời khuyên (nên)'
            ],
            lessonLinks: ['/lessons?level=Foundation', '/?lesson=41488c34-dada-4a3b-ba67-a6352c05ce21-chunk-1', '/?lesson=2ed7cd0a-b814-416c-a187-3cf4de2481fd-chunk-2'],
            grammarLinks: ['/grammar/modal-verbs'],
            focusSkills: ['Vocabulary Building', 'Present/Past Tenses', 'Reading Basics'],
            milestones: ['600 words total', 'Speaking Part 1 confidence', 'Reading 180+ wpm'],
            dailyHours: 2.5,
            isCompleted: true,
            isActive: false
          },
          {
            week: 3,
            title: 'Perfect Tenses Mastery',
            targetBand: '5.0',
            vocabularyGoal: 140,
            grammarUnits: 'Perfect Tenses (Present & Past Perfect)',
            grammarTheory: 'Thì hoàn thành diễn tả hành động đã xảy ra trong quá khứ và có liên quan đến hiện tại, hoặc hành động xảy ra trong một khoảng thời gian kéo dài đến hiện tại.',
            grammarKeyPoints: [
              'Present Perfect: S + have/has + V3 (kinh nghiệm, kết quả)',
              'Past Perfect: S + had + V3 (hành động xảy ra trước hành động khác trong quá khứ)',
              'Phân biệt Present Perfect vs Past Simple',
              'Time expressions: already, yet, just, since, for'
            ],
            lessonLinks: ['/lessons?level=Intermediate', '/?lesson=0ec9d9e5-d4e1-4b51-856d-1668f1e70f65-chunk-1', '/?lesson=254ba12e-766f-46ef-aaea-e1a381a5fcb4-chunk-1'],
            grammarLinks: ['/grammar/present-perfect'],
            focusSkills: ['Reading Strategies', 'Writing Task 1', 'Listening Basics'],
            milestones: ['Writing Task 1 structure', 'Skimming/Scanning skills', '900 words'],
            dailyHours: 3.0,
            isCompleted: false,
            isActive: true
          },
          {
            week: 4,
            title: 'Conditional Sentences',
            targetBand: '5.0-5.5',
            vocabularyGoal: 140,
            grammarUnits: 'Conditional Sentences (Types 0, 1, 2)',
            lessonLinks: ['/lessons?level=Intermediate', '/?lesson=a2c42066-9712-4066-a8ab-4f8918ce14de-chunk-1', '/?lesson=29684d22-bc94-42a4-b6df-b6dc9b21e82a-chunk-1'],
            grammarLinks: ['/grammar/conditional-types'],
            focusSkills: ['Speaking Fluency', 'Listening Techniques', 'Writing Task 2'],
            milestones: ['Month 1 complete', '1200 words', 'Speaking confidence', 'Target 5.0-5.5'],
            dailyHours: 3.0,
            isCompleted: false,
            isActive: false
          },
          // Foundation continues through Week 12
          {
            week: 8,
            title: 'Articles & Quantifiers',
            targetBand: '5.0-5.5',
            vocabularyGoal: 140,
            grammarUnits: 'Articles (A, An, The) and Quantifiers',
            lessonLinks: ['/lessons?level=Intermediate', '/?lesson=9344a13e-4468-44e0-86b6-222251186092-chunk-1', '/?lesson=6b0cd49d-2100-4b57-82fc-b2a9bb76c930-chunk-1'],
            grammarLinks: ['/grammar/passive-voice', '/grammar/reported-speech'],
            focusSkills: ['All Skills Integration', 'Exam Techniques'],
            milestones: ['2400 words', 'Reading 200+ wpm', 'Coherent writing', 'Target 5.5-6.0'],
            dailyHours: 3.0,
            isCompleted: false,
            isActive: false
          },
          {
            week: 12,
            title: 'Foundation Complete - Subjunctive Mood',
            targetBand: '5.5',
            vocabularyGoal: 140,
            grammarUnits: 'Subjunctive Mood',
            lessonLinks: ['/lessons?level=Foundation', '/?lesson=ed8bf3ea-f09d-45e5-9984-04c1e5328cd0-chunk-1', '/?lesson=5b2f05c6-7b0f-49a0-8b39-4bb21f40375f-chunk-1'],
            grammarLinks: ['/grammar/subjunctive-mood'],
            focusSkills: ['Foundation Mastery', 'Assessment'],
            milestones: ['1680 words total', 'Foundation grammar complete', 'Band 5.5 ready', 'Development phase prep'],
            dailyHours: 3.0,
            isCompleted: false,
            isActive: false
          },
          // Development Phase (Weeks 13-24) - Band 5.5 to 6.5
          {
            week: 16,
            title: 'Cleft Sentences & Emphasis',
            targetBand: '6.0-6.5',
            vocabularyGoal: 140,
            grammarUnits: 'Cleft Sentences',
            lessonLinks: ['/lessons?level=Intermediate', '/?lesson=457ec6a9-fbfd-4a1c-8e13-9da749828249-chunk-1', '/?lesson=d0f38a8f-c205-4120-906c-5dee0fb80d75-chunk-1'],
            grammarLinks: ['/grammar/cleft-sentences'],
            focusSkills: ['Emphasis Techniques', 'Band 6+ Skills'],
            milestones: ['2240 words total', 'Complex structures', 'Band 6.0+ writing', 'Emphasis mastery'],
            dailyHours: 3.5,
            isCompleted: false,
            isActive: false
          },
          {
            week: 20,
            title: 'Hedging & Academic Language',
            targetBand: '6.5',
            vocabularyGoal: 140,
            grammarUnits: 'Hedging and Qualifying Language',
            lessonLinks: ['/lessons?level=Advanced', '/?lesson=70b5b987-1e9b-4903-a651-d2b14bc29485-chunk-1', '/?lesson=ed8bf3ea-f09d-45e5-9984-04c1e5328cd0-chunk-2'],
            grammarLinks: ['/grammar/hedging-language'],
            focusSkills: ['Academic Writing', 'Precision'],
            milestones: ['2800 words total', 'Academic precision', 'Band 6.5 writing', 'Development complete'],
            dailyHours: 3.5,
            isCompleted: false,
            isActive: false
          },
          {
            week: 24,
            title: 'Development Complete - Error Analysis',
            targetBand: '6.5-7.0',
            vocabularyGoal: 140,
            grammarUnits: 'Error Analysis and Polish',
            lessonLinks: ['/lessons?level=Advanced', '/lessons?level=Error-Correction', '/?lesson=7302db71-188d-4079-b9cb-ec9dd42bf8c4-chunk-1'],
            grammarLinks: ['/grammar/error-analysis', '/grammar/common-mistakes'],
            focusSkills: ['Error Correction', 'Accuracy'],
            milestones: ['3360 words total', 'Error-free accuracy', 'Band 7.0 ready', 'Mastery phase prep'],
            dailyHours: 3.5,
            isCompleted: false,
            isActive: false
          },
          // Mastery Phase (Weeks 25-32) - Band 6.5 to 7.5+
          {
            week: 28,
            title: 'Sophisticated Conditionals',
            targetBand: '7.0-7.5',
            vocabularyGoal: 140,
            grammarUnits: 'Sophisticated Conditional Structures',
            lessonLinks: ['/lessons?level=Mastery', '/?lesson=mastery-conditionals-1', '/?lesson=mastery-conditionals-2'],
            grammarLinks: ['/grammar/sophisticated-conditionals'],
            focusSkills: ['Complex Conditionals', 'Band 7+ Grammar'],
            milestones: ['3920 words total', 'Advanced conditionals', 'Band 7.0+ structures', 'Mastery progress'],
            dailyHours: 4.0,
            isCompleted: false,
            isActive: false
          },
          {
            week: 32,
            title: 'Register Variation & Style',
            targetBand: '7.5+',
            vocabularyGoal: 140,
            grammarUnits: 'Register Variation & Style',
            lessonLinks: ['/lessons?level=Mastery', '/?lesson=register-variation-1', '/?lesson=style-mastery-1'],
            grammarLinks: ['/grammar/register-variation'],
            focusSkills: ['Style Mastery', 'Register Control'],
            milestones: ['4480 words total', 'Style flexibility', 'Band 7.5+ writing', 'Expert phase ready'],
            dailyHours: 4.0,
            isCompleted: false,
            isActive: false
          },
          // Expert Phase (Weeks 33-36) - Band 8.0 to 8.5+
          {
            week: 36,
            title: 'Band 8.0+ Mastery Complete',
            targetBand: '8.0-8.5+',
            vocabularyGoal: 140,
            grammarUnits: 'Error-free Complex Integration',
            lessonLinks: ['/lessons?level=Expert', '/lessons?level=Band-8-Plus', '/?lesson=expert-integration-final'],
            grammarLinks: ['/grammar/complex-integration', '/grammar/band-8-mastery'],
            focusSkills: ['Perfect Integration', 'Band 8.0+ Confidence'],
            milestones: ['5000 words total', 'Error-free complexity', 'Band 8.0+ achievement', 'IELTS mastery'],
            dailyHours: 3.5,
            isCompleted: false,
            isActive: false
          }
        ],
        todaysTasks: [
          {
            id: '1',
            time: '7:00-7:30',
            duration: 30,
            title: 'Vocabulary Review',
            description: 'Anki flashcards + 40 new words from Academic Word List',
            skill: 'vocabulary',
            isCompleted: true,
            resources: ['Anki Desktop', 'AWL Vocabulary List']
          },
          {
            id: '2',
            time: '8:00-9:00',
            duration: 60,
            title: 'Reading Practice',
            description: 'Cambridge IELTS 16 - Test 2, Passage 1 (Skimming & Scanning)',
            skill: 'reading',
            isCompleted: true,
            resources: ['Cambridge IELTS 16', 'Timer']
          },
          {
            id: '3',
            time: '14:00-14:45',
            duration: 45,
            title: 'Grammar Focus',
            description: 'Grammar in Use: Units 26-27 (Present Perfect vs Past Simple)',
            skill: 'grammar',
            isCompleted: false,
            resources: ['Grammar in Use Book', 'Exercise notebook']
          },
          {
            id: '4',
            time: '15:00-16:00',
            duration: 60,
            title: 'Writing Task 1',
            description: 'Practice bar chart description - Focus on overview and trends',
            skill: 'writing',
            isCompleted: false,
            resources: ['IELTS Liz Writing Guide', 'Sample charts']
          },
          {
            id: '5',
            time: '19:00-19:30',
            duration: 30,
            title: 'Listening Practice',
            description: 'BBC 6 Minute English + Cambridge IELTS Listening Section 2',
            skill: 'listening',
            isCompleted: false,
            resources: ['BBC 6 Minute English', 'Cambridge Audio']
          },
          {
            id: '6',
            time: '20:00-20:15',
            duration: 15,
            title: 'Speaking Practice',
            description: 'Part 1 topics: Hobbies, Work/Study - Record and self-assess',
            skill: 'speaking',
            isCompleted: false,
            resources: ['Speaking topic cards', 'Voice recorder']
          }
        ]
      }
      
      // Update weekly completion status based on real data
      try {
        const completedResponse = await fetch(`/api/daily-lesson/completed?user_id=${userId}`)
        if (completedResponse.ok) {
          const completedData = await completedResponse.json()
          const completedDays = new Set(completedData.data?.completed_days || [])
          
          // Update each week's completion status
          mockData.weeklyPlans = mockData.weeklyPlans.map(week => {
            const weekStart = (week.week - 1) * 7 + 1
            const weekEnd = week.week * 7
            
            // Count completed days in this week
            let completedDaysInWeek = 0
            for (let day = weekStart; day <= weekEnd; day++) {
              if (completedDays.has(day)) {
                completedDaysInWeek++
              }
            }
            
            const isCompleted = completedDaysInWeek >= 7 // All 7 days completed
            const isActive = week.week === realUserData.currentWeek
            const hasProgress = completedDaysInWeek > 0
            
            return {
              ...week,
              isCompleted,
              isActive,
              hasProgress,
              completedDays: completedDaysInWeek
            }
          })
        }
      } catch (completionError) {
        console.log('Could not update week completion status:', completionError)
      }
      
      setStudyData(mockData)
      setSelectedWeek(realUserData.currentWeek) // Set to current week instead of 1
      
    } catch (error) {
      console.error('Failed to load study plan:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'vocabulary': return <BookOpen className="w-4 h-4" />
      case 'grammar': return <Edit3 className="w-4 h-4" />
      case 'reading': return <BookOpen className="w-4 h-4" />
      case 'writing': return <Edit3 className="w-4 h-4" />
      case 'listening': return <Headphones className="w-4 h-4" />
      case 'speaking': return <MessageSquare className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'vocabulary': return 'text-blue-600 bg-blue-50'
      case 'grammar': return 'text-green-600 bg-green-50'
      case 'reading': return 'text-purple-600 bg-purple-50'
      case 'writing': return 'text-orange-600 bg-orange-50'
      case 'listening': return 'text-red-600 bg-red-50'
      case 'speaking': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const toggleTaskComplete = (taskId: string) => {
    if (!studyData) return
    
    const updatedTasks = studyData.todaysTasks.map(task => 
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    )
    
    setStudyData({
      ...studyData,
      todaysTasks: updatedTasks
    })
  }

  const getWeekPhase = (weekNumber: number) => {
    if (weekNumber <= 12) return { phase: 'Foundation', color: 'bg-blue-100 text-blue-800' }
    if (weekNumber <= 24) return { phase: 'Development', color: 'bg-green-100 text-green-800' }
    if (weekNumber <= 32) return { phase: 'Mastery', color: 'bg-purple-100 text-purple-800' }
    return { phase: 'Expert', color: 'bg-orange-100 text-orange-800' }
  }

  if (userLoading || isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Sign in to access your study plan
          </h2>
          <p className="text-gray-600 mb-6">
            Get a personalized 24-week IELTS study plan with daily tasks and progress tracking.
          </p>
          <button
            onClick={() => window.location.href = '/api/auth/signin'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </button>
        </div>
      </div>
    )
  }

  if (!studyData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Study plan not available
          </h2>
          <p className="text-gray-600">
            Unable to load your 24-week IELTS study plan
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📅 36-Week IELTS Study Plan (Band 8.0+)
          </h1>
          <p className="text-gray-600">
            Comprehensive journey from Band 4.0 to 8.0+ • Week {studyData.currentWeek} of {studyData.totalWeeks}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDailyView(!showDailyView)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showDailyView
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showDailyView ? 'Week View' : 'Daily Tasks'}
          </button>
          <button
            onClick={() => setShowDailyLessons(!showDailyLessons)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showDailyLessons
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📅 Daily Lessons
          </button>
          <button
            onClick={resetProgress}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            🔄 Reset về tuần 1
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Current Band</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {studyData.currentScore}
          </div>
          <div className="text-xs text-gray-500">Target: {studyData.targetScore}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Vocabulary</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {studyData.overallProgress.vocabularyLearned}
          </div>
          <div className="text-xs text-gray-500">
            / {studyData.overallProgress.vocabularyTarget} words
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Edit3 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Grammar</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {studyData.overallProgress.grammarCompleted}
          </div>
          <div className="text-xs text-gray-500">
            / {studyData.overallProgress.grammarTarget} units
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Mock Tests</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {studyData.overallProgress.mockTestsCompleted}
          </div>
          <div className="text-xs text-gray-500">tests completed</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Study Days</span>
          </div>
          <div className="text-2xl font-bold text-indigo-600">
            {studyData.overallProgress.studyDays}
          </div>
          <div className="text-xs text-gray-500">total days</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-gray-700">Streak</span>
          </div>
          <div className="text-2xl font-bold text-red-600">
            {studyData.overallProgress.currentStreak}
          </div>
          <div className="text-xs text-gray-500">days</div>
        </div>
      </div>

      {/* Achievement Header */}
      <AchievementHeader
        level={userLevel}
        totalPoints={totalPoints}
        pointsForNext={pointsForNext}
        recentAchievements={achievements.filter(a => a.isUnlocked).slice(0, 5)}
        nextAchievements={achievements.filter(a => !a.isUnlocked && (a.progress || 0) > 0).slice(0, 3)}
        onShowAll={() => setShowAchievements(true)}
      />

      {showDailyLessons ? (
        /* Daily Lessons View */
        <DailyLessonsView
          currentWeek={selectedWeek}
          onLessonSelect={setSelectedDailyLesson}
          selectedLessonId={selectedDailyLesson}
        />
      ) : showDailyView ? (
        /* Daily View */
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Today&apos;s Study Schedule - Day {studyData.currentDay}
              </h2>
              <div className="text-sm text-gray-600">
                Total: {studyData.todaysTasks.reduce((sum, task) => sum + task.duration, 0)} minutes
              </div>
            </div>

            <div className="space-y-4">
              {studyData.todaysTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                    task.isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.isCompleted
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {task.isCompleted && <CheckCircle className="w-4 h-4" />}
                  </button>

                  <div className={`flex-shrink-0 p-2 rounded-lg ${getSkillColor(task.skill)}`}>
                    {getSkillIcon(task.skill)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800">{task.title}</span>
                      <span className="text-xs text-gray-500">
                        {task.time} ({task.duration}min)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    {task.resources && task.resources.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">Resources:</span>
                        {task.resources.map((resource, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                          >
                            {resource}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    {task.skill === 'grammar' && (
                      <button
                        onClick={() => window.location.href = '/grammar'}
                        className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                      >
                        Practice
                      </button>
                    )}
                    {task.isCompleted ? (
                      <Pause className="w-4 h-4 text-green-600" />
                    ) : (
                      <Play className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Progress: {studyData.todaysTasks.filter(t => t.isCompleted).length} / {studyData.todaysTasks.length} completed
                </span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(studyData.todaysTasks.filter(t => t.isCompleted).length / studyData.todaysTasks.length) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Weekly View */
        <div className="space-y-6">
          {/* Week Selection */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Study Weeks Overview</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-1 sm:gap-2">
              {studyData.weeklyPlans.map((week) => {
                return (
                  <button
                    key={week.week}
                    onClick={() => setSelectedWeek(week.week)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedWeek === week.week
                        ? 'bg-blue-600 text-white'
                        : week.isCompleted
                        ? 'bg-green-100 text-green-700'
                        : week.hasProgress
                        ? 'bg-yellow-100 text-yellow-700'
                        : week.isActive
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div>Week {week.week}</div>
                    {week.isCompleted && <CheckCircle className="w-3 h-3 mx-auto mt-1" />}
                    {week.hasProgress && !week.isCompleted && (
                      <div className="text-xs mt-1">
                        {week.completedDays}/7
                      </div>
                    )}
                    {week.isActive && !week.hasProgress && <Clock className="w-3 h-3 mx-auto mt-1" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected Week Details */}
          {(() => {
            const selectedWeekData = studyData.weeklyPlans.find(w => w.week === selectedWeek)
            if (!selectedWeekData) return null

            const phase = getWeekPhase(selectedWeekData.week)

            return (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Week {selectedWeekData.week}: {selectedWeekData.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${phase.color}`}>
                        {phase.phase}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Target: {selectedWeekData.targetBand}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedWeekData.dailyHours}h/day
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {selectedWeekData.isCompleted && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </div>
                    )}
                    {selectedWeekData.isActive && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        Current
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">📚 Learning Goals</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Vocabulary:</span>
                          <span className="font-medium">{selectedWeekData.vocabularyGoal} words</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Grammar:</span>
                          <span className="font-medium">{selectedWeekData.grammarUnits}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">🎯 Focus Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedWeekData.focusSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">🏆 Key Milestones</h4>
                    <div className="space-y-2">
                      {selectedWeekData.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="flex-shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                          <span className="text-sm text-gray-700">{milestone}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Study Materials & Links */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">📚 Vocabulary Lessons</h4>
                      {selectedWeekData.lessonLinks && selectedWeekData.lessonLinks.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedWeekData.lessonLinks.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                            >
                              <BookOpen className="w-3 h-3" />
                              {(() => {
                                if (link.includes('level=')) return `${link.split('level=')[1]} Level`
                                
                                const getLessonName = (lessonId: string) => {
                                  if (lessonId.includes('2ed7cd0a-b814-416c-a187-3cf4de2481fd')) return 'IELTS Core 1000'
                                  if (lessonId.includes('41a70e26-5fa3-4d2b-98d3-a5d3a806467b')) return 'Band 5.0-5.5 Essential'
                                  if (lessonId.includes('41488c34-dada-4a3b-ba67-a6352c05ce21')) return 'IELTS Level 1'
                                  if (lessonId.includes('0ec9d9e5-d4e1-4b51-856d-1668f1e70f65')) return 'Academic 1000'
                                  if (lessonId.includes('254ba12e-766f-46ef-aaea-e1a381a5fcb4')) return 'AWL Sublist 1'
                                  if (lessonId.includes('a2c42066-9712-4066-a8ab-4f8918ce14de')) return 'IELTS Level 2'
                                  if (lessonId.includes('29684d22-bc94-42a4-b6df-b6dc9b21e82a')) return 'AWL Sublist 2'
                                  if (lessonId.includes('9344a13e-4468-44e0-86b6-222251186092')) return 'IELTS Level 3'
                                  if (lessonId.includes('6b0cd49d-2100-4b57-82fc-b2a9bb76c930')) return 'AWL Sublist 3'
                                  if (lessonId.includes('ed8bf3ea-f09d-45e5-9984-04c1e5328cd0')) return 'Advanced 1000'
                                  if (lessonId.includes('5b2f05c6-7b0f-49a0-8b39-4bb21f40375f')) return 'IELTS Level 4'
                                  if (lessonId.includes('457ec6a9-fbfd-4a1c-8e13-9da749828249')) return 'AWL Sublist 4'
                                  if (lessonId.includes('d0f38a8f-c205-4120-906c-5dee0fb80d75')) return 'AWL Sublist 5'
                                  if (lessonId.includes('70b5b987-1e9b-4903-a651-d2b14bc29485')) return 'Band 8.0+ Expert'
                                  if (lessonId.includes('7302db71-188d-4079-b9cb-ec9dd42bf8c4')) return 'Education & Knowledge'
                                  return `Lesson ${index + 1}`
                                }
                                
                                const lessonId = link.split('lesson=')[1] || ''
                                const baseName = getLessonName(lessonId)
                                
                                // Extract chunk number if present
                                const chunkMatch = lessonId.match(/-chunk-(\d+)$/)
                                if (chunkMatch) {
                                  return `${baseName} (Part ${chunkMatch[1]})`
                                }
                                
                                return baseName
                              })()}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">📝 Grammar Practice</h4>
                      {selectedWeekData.grammarLinks && selectedWeekData.grammarLinks.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedWeekData.grammarLinks.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                            >
                              <Edit3 className="w-3 h-3" />
                              {link.split('/grammar/')[1]?.replace(/-/g, ' ') || `Grammar ${index + 1}`}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">🧠 Grammar Theory & Examples</h4>
                      <GrammarWeekContent weekNumber={selectedWeekData.week} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Phase: {phase.phase} • Daily commitment: {selectedWeekData.dailyHours} hours
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedWeekData.week > 1 && (
                        <button
                          onClick={() => setSelectedWeek(selectedWeekData.week - 1)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                        >
                          ← Previous
                        </button>
                      )}
                      {selectedWeekData.week < studyData.totalWeeks && (
                        <button
                          onClick={() => setSelectedWeek(selectedWeekData.week + 1)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Next →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Overall Progress Visualization */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Progress Roadmap</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {studyData.weeklyPlans.map((week) => {
                  const phase = getWeekPhase(week.week)
                  return (
                    <div key={week.week} className="relative flex items-start gap-4">
                      <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        week.isCompleted 
                          ? 'bg-green-600 text-white'
                          : week.isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {week.isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          week.week
                        )}
                      </div>
                      <div className="flex-1 min-h-8">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-800">
                            Week {week.week}: {week.title}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${phase.color}`}>
                            {phase.phase}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Target: {week.targetBand} • {week.vocabularyGoal} words • {week.dailyHours}h/day
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Panel */}
      <AchievementPanel
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        achievements={achievements}
        totalPoints={totalPoints}
        level={userLevel}
        onAchievementClick={(achievement) => {
          console.log('Achievement clicked:', achievement)
        }}
      />

      {/* Achievement Toast */}
      <AchievementToast
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />
    </div>
  )
}