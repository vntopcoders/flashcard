import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// IELTS Listening Band Score Calculator
function calculateBandScore(correctAnswers: number, totalQuestions: number): number {
  const percentage = (correctAnswers / totalQuestions) * 100
  
  // IELTS Listening Band Score Table (approximate)
  if (percentage >= 97) return 9.0
  if (percentage >= 89) return 8.5
  if (percentage >= 82) return 8.0
  if (percentage >= 75) return 7.5
  if (percentage >= 68) return 7.0
  if (percentage >= 58) return 6.5
  if (percentage >= 50) return 6.0
  if (percentage >= 42) return 5.5
  if (percentage >= 35) return 5.0
  if (percentage >= 27) return 4.5
  if (percentage >= 18) return 4.0
  if (percentage >= 13) return 3.5
  if (percentage >= 8) return 3.0
  if (percentage >= 5) return 2.5
  if (percentage >= 3) return 2.0
  if (percentage >= 2) return 1.5
  return 1.0
}

// Normalize answer for comparison (case-insensitive, trim spaces)
function normalizeAnswer(answer: string): string {
  return answer.toString().trim().toLowerCase()
}

// Check if answer is correct (handles multiple possible answers)
function isAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
  const normalizedUser = normalizeAnswer(userAnswer)
  const normalizedCorrect = normalizeAnswer(correctAnswer)
  
  // Handle multiple correct answers separated by |
  if (correctAnswer.includes('|')) {
    const possibleAnswers = correctAnswer.split('|').map(a => normalizeAnswer(a))
    return possibleAnswers.includes(normalizedUser)
  }
  
  return normalizedUser === normalizedCorrect
}

// POST /api/listening/submit - Submit listening test answers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      testId,
      userId,
      answers, // {"1": "A", "2": "library", "3": "B", ...}
      timeTaken, // seconds
      startedAt
    } = body

    if (!testId || !userId || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get test questions
    const { data: questions, error: questionsError } = await supabase
      .from('listening_questions')
      .select('*')
      .eq('test_id', testId)
      .order('question_number')

    if (questionsError) {
      console.error('Error fetching questions:', questionsError)
      return NextResponse.json({ error: 'Failed to fetch questions', details: questionsError }, { status: 500 })
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: 'No questions found for this test' }, { status: 404 })
    }

    // Grade the answers
    let correctCount = 0
    const incorrectAnswers: Array<{
      questionNumber: number
      partNumber: number
      questionText: string
      userAnswer: string
      correctAnswer: string
      explanation?: string
    }> = []
    const partScores: Record<string, { correct: number, total: number }> = {}

    questions.forEach((question) => {
      const questionNum = question.question_number.toString()
      const userAnswer = answers[questionNum] || ''
      const isCorrect = isAnswerCorrect(userAnswer, question.correct_answer)
      
      // Track part scores
      const partKey = `part${question.part_number}`
      if (!partScores[partKey]) {
        partScores[partKey] = { correct: 0, total: 0 }
      }
      partScores[partKey].total += 1
      
      if (isCorrect) {
        correctCount += 1
        partScores[partKey].correct += 1
      } else {
        incorrectAnswers.push({
          questionNumber: question.question_number,
          partNumber: question.part_number,
          questionText: question.question_text,
          userAnswer: userAnswer,
          correctAnswer: question.correct_answer,
          explanation: question.explanation
        })
      }
    })

    const totalQuestions = questions.length
    const percentage = Math.round((correctCount / totalQuestions) * 100 * 100) / 100
    const bandScore = calculateBandScore(correctCount, totalQuestions)

    // Convert part scores to percentages
    const partScoresSummary = Object.keys(partScores).reduce((acc, part) => {
      const { correct, total } = partScores[part]
      acc[part] = {
        correct,
        total,
        percentage: Math.round((correct / total) * 100 * 100) / 100
      }
      return acc
    }, {} as Record<string, { correct: number; total: number; percentage: number }>)

    // Save progress to database
    const { data: progress, error: progressError } = await supabase
      .from('listening_progress')
      .insert([{
        user_id: userId,
        test_id: testId,
        answers,
        score: correctCount,
        total_questions: totalQuestions,
        percentage,
        band_score: bandScore,
        time_taken: timeTaken,
        part_scores: partScoresSummary,
        incorrect_answers: incorrectAnswers,
        started_at: startedAt,
        completed_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (progressError) {
      console.error('Error saving progress:', progressError)
      return NextResponse.json({ error: 'Failed to save progress', details: progressError }, { status: 500 })
    }

    // Generate performance feedback
    const feedback = generateFeedback(bandScore, partScoresSummary, incorrectAnswers.length)

    return NextResponse.json({
      success: true,
      results: {
        score: correctCount,
        totalQuestions,
        percentage,
        bandScore,
        timeTaken,
        partScores: partScoresSummary,
        incorrectAnswers,
        feedback,
        progressId: progress.id
      }
    })

  } catch (error) {
    console.error('Submit listening test error:', error)
    return NextResponse.json({
      error: 'Failed to submit test',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Generate performance feedback based on results
function generateFeedback(
  bandScore: number, 
  partScores: Record<string, { correct: number; total: number; percentage: number }>, 
  incorrectCount: number
) {
  const feedback: {
    overall: string
    strengths: string[]
    improvements: string[]
    nextSteps: string[]
  } = {
    overall: '',
    strengths: [],
    improvements: [],
    nextSteps: []
  }

  // Overall feedback
  if (bandScore >= 8.0) {
    feedback.overall = 'Xuất sắc! Kỹ năng listening của bạn rất tốt.'
  } else if (bandScore >= 7.0) {
    feedback.overall = 'Tốt lắm! Bạn có nền tảng listening vững chắc.'
  } else if (bandScore >= 6.0) {
    feedback.overall = 'Khá tốt! Bạn cần cải thiện thêm một chút.'
  } else if (bandScore >= 5.0) {
    feedback.overall = 'Cần cải thiện. Hãy luyện tập thường xuyên hơn.'
  } else {
    feedback.overall = 'Cần nhiều luyện tập. Đừng nản chí, hãy kiên trì!'
  }

  // Analyze part performance
  Object.keys(partScores).forEach(part => {
    const score = partScores[part]
    if (score.percentage >= 80) {
      feedback.strengths.push(`${part.toUpperCase()}: Rất tốt (${score.correct}/${score.total})`)
    } else if (score.percentage < 50) {
      feedback.improvements.push(`${part.toUpperCase()}: Cần cải thiện (${score.correct}/${score.total})`)
    }
  })

  // Next steps recommendations
  if (bandScore < 6.0) {
    feedback.nextSteps.push('Luyện tập nghe các đoạn hội thoại đơn giản hàng ngày')
    feedback.nextSteps.push('Tập trung vào từ vựng cơ bản và cách phát âm')
  } else if (bandScore < 7.0) {
    feedback.nextSteps.push('Luyện nghe các chủ đề academic và formal')
    feedback.nextSteps.push('Cải thiện kỹ năng note-taking')
  } else {
    feedback.nextSteps.push('Thử các đề thi thực tế để duy trì trình độ')
    feedback.nextSteps.push('Nghe các nội dung nâng cao về khoa học, kinh tế')
  }

  return feedback
}