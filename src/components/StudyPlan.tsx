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
  LogIn,
  User
} from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import AchievementHeader from './AchievementHeader'
import AchievementPanel from './AchievementPanel'
import AchievementToast from './AchievementToast'
import { Achievement } from './AchievementBadge'

interface StudyWeek {
  week: number
  title: string
  targetBand: string
  vocabularyGoal: number
  grammarUnits: string
  focusSkills: string[]
  milestones: string[]
  dailyHours: number
  isCompleted: boolean
  isActive: boolean
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
  totalWeeks: 24
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
  const [isLoading, setIsLoading] = useState(true)
  
  // Achievement system state
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [showAchievements, setShowAchievements] = useState(false)
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null)
  const [userLevel, setUserLevel] = useState(1)
  const [totalPoints, setTotalPoints] = useState(0)
  const [pointsForNext, setPointsForNext] = useState(100)

  useEffect(() => {
    if (!userLoading) {
      loadStudyPlan()
      loadAchievements()
    }
  }, [user, userLoading])

  const loadAchievements = async () => {
    try {
      const response = await fetch('/api/achievements')
      const result = await response.json()
      
      if (result.success) {
        setAchievements(result.data.achievements)
        setUserLevel(result.data.level)
        setTotalPoints(result.data.totalPoints)
        setPointsForNext(result.data.pointsForNext)
      }
    } catch (error) {
      console.error('Failed to load achievements:', error)
    }
  }

  const loadStudyPlan = async () => {
    try {
      setIsLoading(true)
      
      // Mock data based on the 24-week IELTS plan
      const mockData: StudyPlanData = {
        currentWeek: 3,
        currentDay: 15,
        totalWeeks: 24,
        startDate: new Date('2025-08-01'),
        targetScore: 7.0,
        currentScore: 5.5,
        overallProgress: {
          vocabularyLearned: 650,
          vocabularyTarget: 4000,
          grammarCompleted: 25,
          grammarTarget: 145,
          mockTestsCompleted: 8,
          studyDays: 22,
          currentStreak: 7
        },
        weeklyPlans: [
          // Foundation Phase (Weeks 1-8)
          {
            week: 1,
            title: 'Foundation Building - Assessment',
            targetBand: '4.0-4.5',
            vocabularyGoal: 300,
            grammarUnits: 'Units 1-12 (Tenses)',
            focusSkills: ['Vocabulary', 'Basic Grammar', 'Assessment'],
            milestones: ['Complete mock test', 'Setup Anki', 'Learn 300 words'],
            dailyHours: 2.5,
            isCompleted: true,
            isActive: false
          },
          {
            week: 2,
            title: 'Vocabulary & Grammar Foundation',
            targetBand: '4.5-5.0',
            vocabularyGoal: 600,
            grammarUnits: 'Units 13-25 (Modal verbs)',
            focusSkills: ['Vocabulary Building', 'Present/Past Tenses', 'Reading Basics'],
            milestones: ['600 words total', 'Speaking Part 1 confidence', 'Reading 180+ wpm'],
            dailyHours: 2.5,
            isCompleted: true,
            isActive: false
          },
          {
            week: 3,
            title: 'Reading & Writing Introduction',
            targetBand: '5.0',
            vocabularyGoal: 900,
            grammarUnits: 'Units 26-35 (Perfect tenses)',
            focusSkills: ['Reading Strategies', 'Writing Task 1', 'Listening Basics'],
            milestones: ['Writing Task 1 structure', 'Skimming/Scanning skills', '900 words'],
            dailyHours: 3.0,
            isCompleted: false,
            isActive: true
          },
          {
            week: 4,
            title: 'Speaking & Listening Development',
            targetBand: '5.0-5.5',
            vocabularyGoal: 1200,
            grammarUnits: 'Units 36-45 (Conditionals)',
            focusSkills: ['Speaking Fluency', 'Listening Techniques', 'Writing Task 2'],
            milestones: ['Month 1 complete', '1200 words', 'Speaking confidence', 'Target 5.0-5.5'],
            dailyHours: 3.0,
            isCompleted: false,
            isActive: false
          },
          // Development Phase (Weeks 5-12)
          {
            week: 8,
            title: 'Month 2 Milestone',
            targetBand: '5.5-6.0',
            vocabularyGoal: 2400,
            grammarUnits: 'Units 60-80',
            focusSkills: ['All Skills Integration', 'Exam Techniques'],
            milestones: ['2400 words', 'Reading 200+ wpm', 'Coherent writing', 'Target 5.5-6.0'],
            dailyHours: 3.0,
            isCompleted: false,
            isActive: false
          },
          {
            week: 12,
            title: 'Month 3 Milestone',
            targetBand: '6.0-6.5',
            vocabularyGoal: 3200,
            grammarUnits: 'Units 80-100',
            focusSkills: ['Advanced Techniques', 'Speed Building'],
            milestones: ['3200 words', 'All question types', 'Speaking 3+ minutes', 'Target 6.0-6.5'],
            dailyHours: 3.0,
            isCompleted: false,
            isActive: false
          },
          // Mastery Phase (Weeks 13-20)
          {
            week: 16,
            title: 'Month 4 Milestone',
            targetBand: '6.5+',
            vocabularyGoal: 3600,
            grammarUnits: 'Units 100-120',
            focusSkills: ['Complex Structures', 'Band 7 Techniques'],
            milestones: ['3600 words', 'Reading 220+ wpm', 'Writing under 40 min', 'Target 6.5+'],
            dailyHours: 3.5,
            isCompleted: false,
            isActive: false
          },
          {
            week: 20,
            title: 'Month 5 Milestone',
            targetBand: '7.0-',
            vocabularyGoal: 4000,
            grammarUnits: 'Units 120-145',
            focusSkills: ['Sophistication', 'Speed Mastery'],
            milestones: ['4000 words', 'Reading 250+ wpm', 'Band 7 writing', 'Target 7.0'],
            dailyHours: 3.5,
            isCompleted: false,
            isActive: false
          },
          // Final Phase (Weeks 21-24)
          {
            week: 24,
            title: 'Final Exam Preparation',
            targetBand: '7.0+',
            vocabularyGoal: 4000,
            grammarUnits: 'Review & Polish',
            focusSkills: ['Exam Strategies', 'Confidence Building'],
            milestones: ['Consistent 7.0+', 'Exam readiness', 'Final review complete'],
            dailyHours: 3.0,
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
      
      setStudyData(mockData)
      setSelectedWeek(mockData.currentWeek)
      
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
    if (weekNumber <= 8) return { phase: 'Foundation', color: 'bg-blue-100 text-blue-800' }
    if (weekNumber <= 16) return { phase: 'Development', color: 'bg-green-100 text-green-800' }
    if (weekNumber <= 20) return { phase: 'Mastery', color: 'bg-purple-100 text-purple-800' }
    return { phase: 'Final Prep', color: 'bg-orange-100 text-orange-800' }
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
            📅 24-Week IELTS Study Plan
          </h1>
          <p className="text-gray-600">
            Structured journey from Band 4.0 to 7.0+ • Week {studyData.currentWeek} of {studyData.totalWeeks}
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
            {showDailyView ? 'Week View' : 'Daily View'}
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
      {achievements.length > 0 && (
        <AchievementHeader
          level={userLevel}
          totalPoints={totalPoints}
          pointsForNext={pointsForNext}
          recentAchievements={achievements.filter(a => a.isUnlocked).slice(0, 5)}
          nextAchievements={achievements.filter(a => !a.isUnlocked && a.progress > 0).slice(0, 3)}
          onShowAll={() => setShowAchievements(true)}
        />
      )}

      {showDailyView ? (
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
                const phase = getWeekPhase(week.week)
                return (
                  <button
                    key={week.week}
                    onClick={() => setSelectedWeek(week.week)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedWeek === week.week
                        ? 'bg-blue-600 text-white'
                        : week.isCompleted
                        ? 'bg-green-100 text-green-700'
                        : week.isActive
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div>Week {week.week}</div>
                    {week.isCompleted && <CheckCircle className="w-3 h-3 mx-auto mt-1" />}
                    {week.isActive && <Clock className="w-3 h-3 mx-auto mt-1" />}
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