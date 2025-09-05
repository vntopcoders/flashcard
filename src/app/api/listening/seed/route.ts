import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Sample listening tests data
const SAMPLE_TESTS = [
  {
    title: 'IELTS Listening Practice Test 1',
    audio_transcript: 'This is a sample conversation between two people discussing weekend plans and activities.',
    duration: 1800, // 30 minutes
    difficulty: 'intermediate',
    test_type: 'practice',
    description: 'Đề luyện tập cơ bản với 4 parts tiêu chuẩn IELTS, phù hợp cho người mới bắt đầu.',
    instructions: `Hướng dẫn làm bài:
• Bạn sẽ nghe mỗi đoạn audio CHỈ MỘT LẦN
• Đọc câu hỏi trước khi nghe
• Viết câu trả lời trong khi nghe
• Kiểm tra lại câu trả lời sau khi hoàn thành mỗi part
• Tổng thời gian: 30 phút (bao gồm 10 phút chuyển đáp án)`,
    questions: [
      // Part 1 Questions
      {
        part_number: 1,
        question_number: 1,
        question_type: 'fill_blank',
        question_text: 'What is the caller\'s name? _______',
        correct_answer: 'Sarah Johnson',
        explanation: 'Người gọi tự giới thiệu tên là Sarah Johnson ở phần đầu cuộc hội thoại.',
        audio_timestamp: 15,
        points: 1
      },
      {
        part_number: 1,
        question_number: 2,
        question_type: 'fill_blank',
        question_text: 'The phone number is _______',
        correct_answer: '07-4456-7890',
        explanation: 'Số điện thoại được nhắc đến khi Sarah cung cấp thông tin liên lạc.',
        audio_timestamp: 45,
        points: 1
      },
      {
        part_number: 1,
        question_number: 3,
        question_type: 'multiple_choice',
        question_text: 'What time does the class start?',
        options: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM'],
        correct_answer: 'B',
        explanation: 'Lớp học bắt đầu lúc 9:30 AM như được thông báo trong cuộc hội thoại.',
        audio_timestamp: 75,
        points: 1
      },
      {
        part_number: 1,
        question_number: 4,
        question_type: 'fill_blank',
        question_text: 'The address is _______ Street',
        correct_answer: 'Victoria',
        explanation: 'Địa chỉ được đề cập là Victoria Street.',
        audio_timestamp: 105,
        points: 1
      },
      {
        part_number: 1,
        question_number: 5,
        question_type: 'multiple_choice',
        question_text: 'How much does the course cost?',
        options: ['$150', '$200', '$250', '$300'],
        correct_answer: 'C',
        explanation: 'Giá khóa học là $250 như được thông báo.',
        audio_timestamp: 135,
        points: 1
      },

      // Part 2 Questions
      {
        part_number: 2,
        question_number: 6,
        question_type: 'multiple_choice',
        question_text: 'What is the main topic of the talk?',
        options: ['Local history', 'Tourism', 'Environmental protection', 'City planning'],
        correct_answer: 'C',
        explanation: 'Chủ đề chính của bài nói là về bảo vệ môi trường.',
        audio_timestamp: 300,
        points: 1
      },
      {
        part_number: 2,
        question_number: 7,
        question_type: 'fill_blank',
        question_text: 'The park covers _______ hectares',
        correct_answer: '85',
        explanation: 'Công viên có diện tích 85 hecta.',
        audio_timestamp: 330,
        points: 1
      },
      {
        part_number: 2,
        question_number: 8,
        question_type: 'multiple_choice',
        question_text: 'Which activity is NOT mentioned?',
        options: ['Hiking', 'Bird watching', 'Swimming', 'Cycling'],
        correct_answer: 'C',
        explanation: 'Swimming không được đề cập trong các hoạt động.',
        audio_timestamp: 360,
        points: 1
      },
      {
        part_number: 2,
        question_number: 9,
        question_type: 'fill_blank',
        question_text: 'The visitor center is open until _______ PM',
        correct_answer: '6',
        explanation: 'Trung tâm du khách mở cửa đến 6 giờ chiều.',
        audio_timestamp: 390,
        points: 1
      },
      {
        part_number: 2,
        question_number: 10,
        question_type: 'multiple_choice',
        question_text: 'What should visitors bring?',
        options: ['Comfortable shoes', 'Warm clothes', 'Sunscreen', 'All of the above'],
        correct_answer: 'D',
        explanation: 'Tất cả các vật dụng trên đều được khuyến khích mang theo.',
        audio_timestamp: 420,
        points: 1
      },

      // Part 3 Questions
      {
        part_number: 3,
        question_number: 11,
        question_type: 'multiple_choice',
        question_text: 'What is the students\' main concern?',
        options: ['The deadline', 'The research method', 'The topic choice', 'The presentation format'],
        correct_answer: 'A',
        explanation: 'Mối quan tâm chính của sinh viên là về deadline.',
        audio_timestamp: 600,
        points: 1
      },
      {
        part_number: 3,
        question_number: 12,
        question_type: 'fill_blank',
        question_text: 'The professor suggests using _______ sources',
        correct_answer: 'primary',
        explanation: 'Giáo sư gợi ý sử dụng nguồn tài liệu primary (nguồn chính).',
        audio_timestamp: 630,
        points: 1
      },
      {
        part_number: 3,
        question_number: 13,
        question_type: 'multiple_choice',
        question_text: 'How long should the presentation be?',
        options: ['10 minutes', '15 minutes', '20 minutes', '25 minutes'],
        correct_answer: 'C',
        explanation: 'Bài thuyết trình nên dài 20 phút.',
        audio_timestamp: 660,
        points: 1
      },
      {
        part_number: 3,
        question_number: 14,
        question_type: 'matching',
        question_text: 'Match the student with their responsibility:',
        options: ['Research', 'Data analysis', 'Presentation slides', 'Bibliography'],
        correct_answer: 'Research',
        explanation: 'Sinh viên này chịu tr책nhiệm phần nghiên cứu.',
        audio_timestamp: 690,
        points: 1
      },
      {
        part_number: 3,
        question_number: 15,
        question_type: 'fill_blank',
        question_text: 'The final draft is due on _______',
        correct_answer: 'Friday',
        explanation: 'Bản thảo cuối cùng phải nộp vào thứ Sáu.',
        audio_timestamp: 720,
        points: 1
      },

      // Part 4 Questions
      {
        part_number: 4,
        question_number: 16,
        question_type: 'multiple_choice',
        question_text: 'What is the lecture mainly about?',
        options: ['Ancient civilizations', 'Archaeological methods', 'Historical artifacts', 'Museum collections'],
        correct_answer: 'B',
        explanation: 'Bài giảng chủ yếu về các phương pháp khảo cổ học.',
        audio_timestamp: 900,
        points: 1
      },
      {
        part_number: 4,
        question_number: 17,
        question_type: 'fill_blank',
        question_text: 'Carbon dating can measure objects up to _______ years old',
        correct_answer: '50000|50,000',
        explanation: 'Phương pháp carbon dating có thể đo các vật thể lên đến 50,000 năm tuổi.',
        audio_timestamp: 930,
        points: 1
      },
      {
        part_number: 4,
        question_number: 18,
        question_type: 'multiple_choice',
        question_text: 'Which technique is most accurate for recent artifacts?',
        options: ['Carbon dating', 'Stratigraphy', 'Thermoluminescence', 'Dendrochronology'],
        correct_answer: 'D',
        explanation: 'Dendrochronology là kỹ thuật chính xác nhất cho các hiện vật gần đây.',
        audio_timestamp: 960,
        points: 1
      },
      {
        part_number: 4,
        question_number: 19,
        question_type: 'fill_blank',
        question_text: 'The advantage of _______ is that it works on very small samples',
        correct_answer: 'mass spectrometry',
        explanation: 'Ưu điểm của mass spectrometry là có thể hoạt động với mẫu rất nhỏ.',
        audio_timestamp: 990,
        points: 1
      },
      {
        part_number: 4,
        question_number: 20,
        question_type: 'multiple_choice',
        question_text: 'What does the professor recommend for future research?',
        options: ['More funding', 'Better equipment', 'Combining multiple methods', 'Training more researchers'],
        correct_answer: 'C',
        explanation: 'Giáo sư khuyến nghị kết hợp nhiều phương pháp cho nghiên cứu tương lai.',
        audio_timestamp: 1020,
        points: 1
      }
    ]
  },
  {
    title: 'IELTS Listening Practice Test 2',
    audio_transcript: 'This is another sample listening test focusing on academic topics and formal conversations.',
    duration: 1800,
    difficulty: 'advanced',
    test_type: 'mock_exam',
    description: 'Đề thi thử nâng cao với độ khó tương đương đề thi thật, phù hợp cho mục tiêu Band 7.0+.',
    instructions: `Hướng dẫn làm bài:
• Đây là đề thi thử với độ khó cao
• Các từ vựng và chủ đề academic chiếm nhiều
• Tập trung cao độ khi nghe
• Chú ý các từ đồng nghĩa và cách diễn đạt khác nhau
• Thời gian: 30 phút + 10 phút chuyển đáp án`,
    questions: [
      // Simplified questions for Test 2
      {
        part_number: 1,
        question_number: 1,
        question_type: 'fill_blank',
        question_text: 'Customer\'s membership number: _______',
        correct_answer: 'GH4567',
        explanation: 'Số thành viên của khách hàng là GH4567.',
        audio_timestamp: 20,
        points: 1
      },
      {
        part_number: 1,
        question_number: 2,
        question_type: 'multiple_choice',
        question_text: 'What type of room does the customer want?',
        options: ['Single', 'Double', 'Twin', 'Suite'],
        correct_answer: 'C',
        explanation: 'Khách hàng muốn đặt phòng twin (2 giường đơn).',
        audio_timestamp: 50,
        points: 1
      },
      // Add more questions...
      {
        part_number: 2,
        question_number: 6,
        question_type: 'multiple_choice',
        question_text: 'What is the speaker\'s profession?',
        options: ['Teacher', 'Researcher', 'Consultant', 'Manager'],
        correct_answer: 'B',
        explanation: 'Người nói là một nhà nghiên cứu.',
        audio_timestamp: 300,
        points: 1
      }
    ]
  }
]

export async function POST(request: NextRequest) {
  try {
    console.log('Seeding listening test data...')

    let createdCount = 0
    const errors: string[] = []

    for (const testData of SAMPLE_TESTS) {
      try {
        // Create the test
        const { data: test, error: testError } = await supabase
          .from('listening_tests')
          .insert([{
            title: testData.title,
            audio_transcript: testData.audio_transcript,
            duration: testData.duration,
            difficulty: testData.difficulty,
            test_type: testData.test_type,
            description: testData.description,
            instructions: testData.instructions,
            total_questions: testData.questions.length
          }])
          .select()
          .single()

        if (testError) {
          errors.push(`Error creating test "${testData.title}": ${testError.message}`)
          continue
        }

        // Create questions for this test
        const questionsWithTestId = testData.questions.map(q => ({
          test_id: test.id,
          part_number: q.part_number,
          question_number: q.question_number,
          question_type: q.question_type,
          question_text: q.question_text,
          options: q.options || null,
          correct_answer: q.correct_answer,
          explanation: q.explanation || null,
          audio_timestamp: q.audio_timestamp || null,
          points: q.points || 1
        }))

        const { error: questionsError } = await supabase
          .from('listening_questions')
          .insert(questionsWithTestId)

        if (questionsError) {
          errors.push(`Error creating questions for "${testData.title}": ${questionsError.message}`)
          // Try to clean up the test
          await supabase.from('listening_tests').delete().eq('id', test.id)
          continue
        }

        createdCount++
        console.log(`✓ Created test: ${testData.title} with ${testData.questions.length} questions`)

      } catch (error) {
        const errorMsg = `Error processing test "${testData.title}": ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMsg)
        console.error(errorMsg)
      }
    }

    if (errors.length > 0) {
      console.log('Errors encountered:', errors)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdCount} listening tests`,
      created: createdCount,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Seed listening data error:', error)
    return NextResponse.json({
      error: 'Failed to seed listening data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET method to check existing data
export async function GET() {
  try {
    const { data: tests, error } = await supabase
      .from('listening_tests')
      .select('id, title, total_questions, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch tests', details: error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      tests: tests || [],
      count: tests?.length || 0
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check listening data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}