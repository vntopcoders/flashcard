import { notFound } from 'next/navigation'
import GrammarLessonContent from '@/components/GrammarLessonContent'

// IELTS Grammar Lessons Organization
const GRAMMAR_LESSONS = {
  // Basic Grammar (Beginner)
  'present-simple': {
    title: 'Present Simple Tense',
    level: 'Basic',
    week: 1,
    description: 'Learn how to use present simple for facts, habits, and general truths'
  },
  'present-continuous': {
    title: 'Present Continuous Tense', 
    level: 'Basic',
    week: 1,
    description: 'Express actions happening now or temporary situations'
  },
  'past-simple': {
    title: 'Past Simple Tense',
    level: 'Basic', 
    week: 2,
    description: 'Talk about completed actions in the past'
  },
  'past-continuous': {
    title: 'Past Continuous Tense',
    level: 'Basic',
    week: 2, 
    description: 'Describe ongoing actions in the past'
  },
  'present-perfect': {
    title: 'Present Perfect Tense',
    level: 'Intermediate',
    week: 3,
    description: 'Connect past actions to the present moment'
  },
  'present-perfect-continuous': {
    title: 'Present Perfect Continuous',
    level: 'Intermediate', 
    week: 3,
    description: 'Express duration of actions from past to present'
  },
  'future-tenses': {
    title: 'Future Tenses',
    level: 'Intermediate',
    week: 4,
    description: 'Master will, going to, and present continuous for future'
  },
  
  // Intermediate Grammar
  'conditional-types': {
    title: 'Conditional Sentences',
    level: 'Intermediate',
    week: 5,
    description: 'Master zero, first, second, and third conditionals'
  },
  'passive-voice': {
    title: 'Passive Voice',
    level: 'Intermediate',
    week: 6,
    description: 'Transform active sentences to passive for formal writing'
  },
  'reported-speech': {
    title: 'Reported Speech',
    level: 'Intermediate',
    week: 7,
    description: 'Report what others have said with accuracy'
  },
  'modal-verbs': {
    title: 'Modal Verbs',
    level: 'Intermediate',
    week: 8,
    description: 'Express possibility, necessity, and advice'
  },
  'relative-clauses': {
    title: 'Relative Clauses',
    level: 'Intermediate',
    week: 9,
    description: 'Combine sentences with who, which, that, where'
  },
  
  // Advanced Grammar
  'subjunctive-mood': {
    title: 'Subjunctive Mood',
    level: 'Advanced',
    week: 10,
    description: 'Express wishes, recommendations, and hypothetical situations'
  },
  'inversion': {
    title: 'Inversion',
    level: 'Advanced',
    week: 11,
    description: 'Use inverted word order for emphasis and formality'
  },
  'cleft-sentences': {
    title: 'Cleft Sentences',
    level: 'Advanced',
    week: 12,
    description: 'Emphasize information with it-cleft and wh-cleft structures'
  },
  'mixed-conditionals': {
    title: 'Mixed Conditionals',
    level: 'Advanced',
    week: 13,
    description: 'Combine different time periods in conditional sentences'
  },
  'advanced-passive': {
    title: 'Advanced Passive Structures',
    level: 'Advanced',
    week: 14,
    description: 'Complex passive constructions for academic writing'
  },
  
  // IELTS Specific Grammar
  'academic-writing-grammar': {
    title: 'Academic Writing Grammar',
    level: 'IELTS',
    week: 15,
    description: 'Grammar structures specifically for IELTS Writing Task 2'
  },
  'complex-sentence-structures': {
    title: 'Complex Sentence Structures',
    level: 'IELTS',
    week: 16,
    description: 'Build sophisticated sentences for high band scores'
  },
  'cohesive-devices': {
    title: 'Cohesive Devices',
    level: 'IELTS',
    week: 17,
    description: 'Link ideas effectively in IELTS writing'
  },
  'formal-register': {
    title: 'Formal Register',
    level: 'IELTS',
    week: 18,
    description: 'Use appropriate formality level in IELTS tasks'
  },
  'error-correction': {
    title: 'Common Grammar Errors',
    level: 'IELTS',
    week: 19,
    description: 'Identify and fix typical mistakes in IELTS'
  }
}

interface PageProps {
  params: Promise<{ lesson: string }>
}

export default async function GrammarLessonPage({ params }: PageProps) {
  const { lesson } = await params
  
  const lessonData = GRAMMAR_LESSONS[lesson as keyof typeof GRAMMAR_LESSONS]
  
  if (!lessonData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Lesson Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                lessonData.level === 'Basic' ? 'bg-green-100 text-green-800' :
                lessonData.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                lessonData.level === 'Advanced' ? 'bg-purple-100 text-purple-800' :
                'bg-red-100 text-red-800'
              }`}>
                {lessonData.level}
              </div>
              <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                Week {lessonData.week}
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {lessonData.title}
          </h1>
          
          <p className="text-gray-600 text-lg">
            {lessonData.description}
          </p>
        </div>

        {/* Lesson Content */}
        <GrammarLessonContent lesson={lesson} lessonData={lessonData} />
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  return Object.keys(GRAMMAR_LESSONS).map((lesson) => ({
    lesson,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { lesson } = await params
  const lessonData = GRAMMAR_LESSONS[lesson as keyof typeof GRAMMAR_LESSONS]
  
  if (!lessonData) {
    return {
      title: 'Lesson Not Found - IELTS Grammar',
      description: 'The requested grammar lesson could not be found'
    }
  }

  return {
    title: `${lessonData.title} - IELTS Grammar`,
    description: lessonData.description
  }
}