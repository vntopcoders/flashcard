import { NextResponse } from 'next/server'
import { flashcardDb, lessonDb } from '@/lib/supabase'

const IELTS_CORE_1000 = [
  // Band 4.0-5.0 Essential Words (Core foundation)
  { english: 'ability', vietnamese: 'khả năng', ipa: '/əˈbɪləti/', difficulty: 1, category: 'General' },
  { english: 'about', vietnamese: 'về', ipa: '/əˈbaʊt/', difficulty: 1, category: 'General' },
  { english: 'above', vietnamese: 'ở trên', ipa: '/əˈbʌv/', difficulty: 1, category: 'General' },
  { english: 'accept', vietnamese: 'chấp nhận', ipa: '/ækˈsept/', difficulty: 1, category: 'General' },
  { english: 'according', vietnamese: 'theo như', ipa: '/əˈkɔːdɪŋ/', difficulty: 2, category: 'General' },
  { english: 'account', vietnamese: 'tài khoản', ipa: '/əˈkaʊnt/', difficulty: 2, category: 'Business' },
  { english: 'across', vietnamese: 'qua', ipa: '/əˈkrɒs/', difficulty: 1, category: 'General' },
  { english: 'action', vietnamese: 'hành động', ipa: '/ˈækʃən/', difficulty: 1, category: 'General' },
  { english: 'activity', vietnamese: 'hoạt động', ipa: '/ækˈtɪvəti/', difficulty: 1, category: 'General' },
  { english: 'actually', vietnamese: 'thực sự', ipa: '/ˈæktʃuəli/', difficulty: 2, category: 'General' },
  
  // Common Academic Words
  { english: 'advantage', vietnamese: 'lợi thế', ipa: '/ædˈvɑːntɪdʒ/', difficulty: 2, category: 'Academic' },
  { english: 'affect', vietnamese: 'ảnh hưởng', ipa: '/əˈfekt/', difficulty: 2, category: 'Academic' },
  { english: 'agreement', vietnamese: 'thỏa thuận', ipa: '/əˈɡriːmənt/', difficulty: 2, category: 'Business' },
  { english: 'allow', vietnamese: 'cho phép', ipa: '/əˈlaʊ/', difficulty: 1, category: 'General' },
  { english: 'although', vietnamese: 'mặc dù', ipa: '/ɔːlˈðəʊ/', difficulty: 2, category: 'Academic' },
  { english: 'amount', vietnamese: 'số lượng', ipa: '/əˈmaʊnt/', difficulty: 2, category: 'General' },
  { english: 'analysis', vietnamese: 'phân tích', ipa: '/əˈnæləsɪs/', difficulty: 3, category: 'Academic' },
  { english: 'another', vietnamese: 'khác', ipa: '/əˈnʌðə/', difficulty: 1, category: 'General' },
  { english: 'answer', vietnamese: 'trả lời', ipa: '/ˈɑːnsə/', difficulty: 1, category: 'General' },
  { english: 'appear', vietnamese: 'xuất hiện', ipa: '/əˈpɪə/', difficulty: 2, category: 'General' },
  
  // Essential Business/Work Vocabulary
  { english: 'approach', vietnamese: 'tiếp cận', ipa: '/əˈprəʊtʃ/', difficulty: 2, category: 'Business' },
  { english: 'appropriate', vietnamese: 'thích hợp', ipa: '/əˈprəʊpriət/', difficulty: 3, category: 'Academic' },
  { english: 'around', vietnamese: 'xung quanh', ipa: '/əˈraʊnd/', difficulty: 1, category: 'General' },
  { english: 'article', vietnamese: 'bài báo', ipa: '/ˈɑːtɪkəl/', difficulty: 2, category: 'Academic' },
  { english: 'assess', vietnamese: 'đánh giá', ipa: '/əˈses/', difficulty: 3, category: 'Academic' },
  { english: 'assume', vietnamese: 'giả định', ipa: '/əˈsjuːm/', difficulty: 3, category: 'Academic' },
  { english: 'attempt', vietnamese: 'cố gắng', ipa: '/əˈtempt/', difficulty: 2, category: 'General' },
  { english: 'attention', vietnamese: 'chú ý', ipa: '/əˈtenʃən/', difficulty: 2, category: 'General' },
  { english: 'attitude', vietnamese: 'thái độ', ipa: '/ˈætɪtjuːd/', difficulty: 2, category: 'General' },
  { english: 'available', vietnamese: 'có sẵn', ipa: '/əˈveɪləbəl/', difficulty: 2, category: 'General' },
  
  // Travel & Daily Life
  { english: 'background', vietnamese: 'nền tảng', ipa: '/ˈbækɡraʊnd/', difficulty: 2, category: 'General' },
  { english: 'because', vietnamese: 'bởi vì', ipa: '/bɪˈkɒz/', difficulty: 1, category: 'General' },
  { english: 'become', vietnamese: 'trở thành', ipa: '/bɪˈkʌm/', difficulty: 1, category: 'General' },
  { english: 'before', vietnamese: 'trước khi', ipa: '/bɪˈfɔː/', difficulty: 1, category: 'General' },
  { english: 'begin', vietnamese: 'bắt đầu', ipa: '/bɪˈɡɪn/', difficulty: 1, category: 'General' },
  { english: 'behaviour', vietnamese: 'hành vi', ipa: '/bɪˈheɪvjə/', difficulty: 2, category: 'Psychology' },
  { english: 'believe', vietnamese: 'tin tưởng', ipa: '/bɪˈliːv/', difficulty: 1, category: 'General' },
  { english: 'benefit', vietnamese: 'lợi ích', ipa: '/ˈbenɪfɪt/', difficulty: 2, category: 'General' },
  { english: 'better', vietnamese: 'tốt hơn', ipa: '/ˈbetə/', difficulty: 1, category: 'General' },
  { english: 'between', vietnamese: 'giữa', ipa: '/bɪˈtwiːn/', difficulty: 1, category: 'General' },
  
  // Health & Environment
  { english: 'business', vietnamese: 'kinh doanh', ipa: '/ˈbɪznəs/', difficulty: 2, category: 'Business' },
  { english: 'campaign', vietnamese: 'chiến dịch', ipa: '/kæmˈpeɪn/', difficulty: 2, category: 'Business' },
  { english: 'challenge', vietnamese: 'thách thức', ipa: '/ˈtʃælɪndʒ/', difficulty: 2, category: 'General' },
  { english: 'change', vietnamese: 'thay đổi', ipa: '/tʃeɪndʒ/', difficulty: 1, category: 'General' },
  { english: 'character', vietnamese: 'tính cách', ipa: '/ˈkærəktə/', difficulty: 2, category: 'General' },
  { english: 'choose', vietnamese: 'chọn', ipa: '/tʃuːz/', difficulty: 1, category: 'General' },
  { english: 'citizen', vietnamese: 'công dân', ipa: '/ˈsɪtɪzən/', difficulty: 2, category: 'Social' },
  { english: 'clear', vietnamese: 'rõ ràng', ipa: '/klɪə/', difficulty: 1, category: 'General' },
  { english: 'climate', vietnamese: 'khí hậu', ipa: '/ˈklaɪmət/', difficulty: 2, category: 'Environment' },
  { english: 'close', vietnamese: 'đóng', ipa: '/kləʊz/', difficulty: 1, category: 'General' },
  
  // Education & Learning
  { english: 'college', vietnamese: 'đại học', ipa: '/ˈkɒlɪdʒ/', difficulty: 2, category: 'Education' },
  { english: 'comment', vietnamese: 'bình luận', ipa: '/ˈkɒment/', difficulty: 2, category: 'General' },
  { english: 'common', vietnamese: 'phổ biến', ipa: '/ˈkɒmən/', difficulty: 1, category: 'General' },
  { english: 'community', vietnamese: 'cộng đồng', ipa: '/kəˈmjuːnəti/', difficulty: 2, category: 'Social' },
  { english: 'company', vietnamese: 'công ty', ipa: '/ˈkʌmpəni/', difficulty: 2, category: 'Business' },
  { english: 'compare', vietnamese: 'so sánh', ipa: '/kəmˈpeə/', difficulty: 2, category: 'Academic' },
  { english: 'complete', vietnamese: 'hoàn thành', ipa: '/kəmˈpliːt/', difficulty: 2, category: 'General' },
  { english: 'concept', vietnamese: 'khái niệm', ipa: '/ˈkɒnsept/', difficulty: 3, category: 'Academic' },
  { english: 'concern', vietnamese: 'lo ngại', ipa: '/kənˈsɜːn/', difficulty: 2, category: 'General' },
  { english: 'condition', vietnamese: 'điều kiện', ipa: '/kənˈdɪʃən/', difficulty: 2, category: 'General' },
  
  // Technology & Modern Life
  { english: 'conference', vietnamese: 'hội nghị', ipa: '/ˈkɒnfərəns/', difficulty: 2, category: 'Business' },
  { english: 'consider', vietnamese: 'xem xét', ipa: '/kənˈsɪdə/', difficulty: 2, category: 'General' },
  { english: 'consumer', vietnamese: 'người tiêu dùng', ipa: '/kənˈsjuːmə/', difficulty: 2, category: 'Business' },
  { english: 'contain', vietnamese: 'chứa', ipa: '/kənˈteɪn/', difficulty: 2, category: 'General' },
  { english: 'continue', vietnamese: 'tiếp tục', ipa: '/kənˈtɪnjuː/', difficulty: 1, category: 'General' },
  { english: 'control', vietnamese: 'kiểm soát', ipa: '/kənˈtrəʊl/', difficulty: 2, category: 'General' },
  { english: 'conversation', vietnamese: 'cuộc trò chuyện', ipa: '/ˌkɒnvəˈseɪʃən/', difficulty: 2, category: 'General' },
  { english: 'course', vietnamese: 'khóa học', ipa: '/kɔːs/', difficulty: 2, category: 'Education' },
  { english: 'create', vietnamese: 'tạo ra', ipa: '/kriˈeɪt/', difficulty: 2, category: 'General' },
  { english: 'culture', vietnamese: 'văn hóa', ipa: '/ˈkʌltʃə/', difficulty: 2, category: 'Social' },
  
  // More essential words continuing the pattern...
  { english: 'current', vietnamese: 'hiện tại', ipa: '/ˈkʌrənt/', difficulty: 2, category: 'General' },
  { english: 'customer', vietnamese: 'khách hàng', ipa: '/ˈkʌstəmə/', difficulty: 2, category: 'Business' },
  { english: 'damage', vietnamese: 'thiệt hại', ipa: '/ˈdæmɪdʒ/', difficulty: 2, category: 'General' },
  { english: 'decision', vietnamese: 'quyết định', ipa: '/dɪˈsɪʒən/', difficulty: 2, category: 'General' },
  { english: 'degree', vietnamese: 'bằng cấp', ipa: '/dɪˈɡriː/', difficulty: 2, category: 'Education' },
  { english: 'demand', vietnamese: 'yêu cầu', ipa: '/dɪˈmɑːnd/', difficulty: 2, category: 'Business' },
  { english: 'department', vietnamese: 'phòng ban', ipa: '/dɪˈpɑːtmənt/', difficulty: 2, category: 'Business' },
  { english: 'describe', vietnamese: 'mô tả', ipa: '/dɪˈskraɪb/', difficulty: 2, category: 'General' },
  { english: 'design', vietnamese: 'thiết kế', ipa: '/dɪˈzaɪn/', difficulty: 2, category: 'General' },
  { english: 'detail', vietnamese: 'chi tiết', ipa: '/ˈdiːteɪl/', difficulty: 2, category: 'General' },
  
  // Continue with more fundamental vocabulary...
  { english: 'develop', vietnamese: 'phát triển', ipa: '/dɪˈveləp/', difficulty: 2, category: 'General' },
  { english: 'difference', vietnamese: 'sự khác biệt', ipa: '/ˈdɪfərəns/', difficulty: 2, category: 'General' },
  { english: 'difficult', vietnamese: 'khó khăn', ipa: '/ˈdɪfɪkəlt/', difficulty: 1, category: 'General' },
  { english: 'direct', vietnamese: 'trực tiếp', ipa: '/daɪˈrekt/', difficulty: 2, category: 'General' },
  { english: 'direction', vietnamese: 'hướng', ipa: '/daɪˈrekʃən/', difficulty: 2, category: 'General' },
  { english: 'discuss', vietnamese: 'thảo luận', ipa: '/dɪˈskʌs/', difficulty: 2, category: 'General' },
  { english: 'disease', vietnamese: 'bệnh tật', ipa: '/dɪˈziːz/', difficulty: 2, category: 'Health' },
  { english: 'during', vietnamese: 'trong suốt', ipa: '/ˈdjʊərɪŋ/', difficulty: 1, category: 'General' },
  { english: 'economic', vietnamese: 'kinh tế', ipa: '/ˌiːkəˈnɒmɪk/', difficulty: 3, category: 'Business' },
  { english: 'economy', vietnamese: 'nền kinh tế', ipa: '/ɪˈkɒnəmi/', difficulty: 2, category: 'Business' },

  // Adding more words to reach closer to 1000...
  { english: 'education', vietnamese: 'giáo dục', ipa: '/ˌedjʊˈkeɪʃən/', difficulty: 2, category: 'Education' },
  { english: 'effect', vietnamese: 'tác động', ipa: '/ɪˈfekt/', difficulty: 2, category: 'Academic' },
  { english: 'effort', vietnamese: 'nỗ lực', ipa: '/ˈefət/', difficulty: 2, category: 'General' },
  { english: 'employee', vietnamese: 'nhân viên', ipa: '/ɪmˈplɔɪiː/', difficulty: 2, category: 'Business' },
  { english: 'energy', vietnamese: 'năng lượng', ipa: '/ˈenədʒi/', difficulty: 2, category: 'Science' },
  { english: 'environment', vietnamese: 'môi trường', ipa: '/ɪnˈvaɪrənmənt/', difficulty: 2, category: 'Environment' },
  { english: 'equipment', vietnamese: 'thiết bị', ipa: '/ɪˈkwɪpmənt/', difficulty: 2, category: 'General' },
  { english: 'especially', vietnamese: 'đặc biệt', ipa: '/ɪˈspeʃəli/', difficulty: 2, category: 'General' },
  { english: 'establish', vietnamese: 'thiết lập', ipa: '/ɪˈstæblɪʃ/', difficulty: 3, category: 'Academic' },
  { english: 'estimate', vietnamese: 'ước tính', ipa: '/ˈestɪmət/', difficulty: 3, category: 'Academic' },
  
  // Continue building comprehensive vocabulary...
  { english: 'evaluate', vietnamese: 'đánh giá', ipa: '/ɪˈvæljueɪt/', difficulty: 3, category: 'Academic' },
  { english: 'evening', vietnamese: 'buổi tối', ipa: '/ˈiːvnɪŋ/', difficulty: 1, category: 'Time' },
  { english: 'evidence', vietnamese: 'bằng chứng', ipa: '/ˈevɪdəns/', difficulty: 3, category: 'Academic' },
  { english: 'example', vietnamese: 'ví dụ', ipa: '/ɪɡˈzɑːmpəl/', difficulty: 1, category: 'General' },
  { english: 'exchange', vietnamese: 'trao đổi', ipa: '/ɪksˈtʃeɪndʒ/', difficulty: 2, category: 'Business' },
  { english: 'exercise', vietnamese: 'tập luyện', ipa: '/ˈeksəsaɪz/', difficulty: 2, category: 'Health' },
  { english: 'exist', vietnamese: 'tồn tại', ipa: '/ɪɡˈzɪst/', difficulty: 2, category: 'General' },
  { english: 'expect', vietnamese: 'mong đợi', ipa: '/ɪkˈspekt/', difficulty: 2, category: 'General' },
  { english: 'experience', vietnamese: 'kinh nghiệm', ipa: '/ɪkˈspɪəriəns/', difficulty: 2, category: 'General' },
  { english: 'explain', vietnamese: 'giải thích', ipa: '/ɪkˈspleɪn/', difficulty: 2, category: 'General' },

  // Continue with essential vocabulary to build toward 1000 words
  { english: 'export', vietnamese: 'xuất khẩu', ipa: '/ˈekspɔːt/', difficulty: 2, category: 'Business' },
  { english: 'express', vietnamese: 'thể hiện', ipa: '/ɪkˈspres/', difficulty: 2, category: 'General' },
  { english: 'factor', vietnamese: 'yếu tố', ipa: '/ˈfæktə/', difficulty: 2, category: 'Academic' },
  { english: 'failure', vietnamese: 'thất bại', ipa: '/ˈfeɪljə/', difficulty: 2, category: 'General' },
  { english: 'family', vietnamese: 'gia đình', ipa: '/ˈfæməli/', difficulty: 1, category: 'Family' },
  { english: 'famous', vietnamese: 'nổi tiếng', ipa: '/ˈfeɪməs/', difficulty: 1, category: 'General' },
  { english: 'feature', vietnamese: 'tính năng', ipa: '/ˈfiːtʃə/', difficulty: 2, category: 'General' },
  { english: 'feeling', vietnamese: 'cảm giác', ipa: '/ˈfiːlɪŋ/', difficulty: 1, category: 'Emotion' },
  { english: 'finance', vietnamese: 'tài chính', ipa: '/ˈfaɪnæns/', difficulty: 2, category: 'Business' },
  { english: 'final', vietnamese: 'cuối cùng', ipa: '/ˈfaɪnəl/', difficulty: 2, category: 'General' }

  // Note: This is a representative sample of 100 words. 
  // For production, we would need to expand this to include all 1000 core IELTS vocabulary words
  // covering all major categories: Academic, Business, Health, Environment, Technology, etc.
]

export async function POST() {
  try {
    console.log('🚀 Starting IELTS Core 1000 import...')
    
    // Create lesson for IELTS Core vocabulary
    const coreLesson = await lessonDb.create({
      name: 'IELTS Core 1000 Words',
      description: 'Essential vocabulary for IELTS Band 4.0-6.0. Core words that appear frequently in IELTS tests across all sections.',
      color: '#10B981' // Green color for core/essential
    })

    console.log('✅ Created IELTS Core lesson:', coreLesson.id)

    // Import flashcards in batches
    const BATCH_SIZE = 50
    let importedCount = 0
    let failedCount = 0

    for (let i = 0; i < IELTS_CORE_1000.length; i += BATCH_SIZE) {
      const batch = IELTS_CORE_1000.slice(i, i + BATCH_SIZE)
      
      for (const word of batch) {
        try {
          await flashcardDb.create({
            english: word.english,
            vietnamese: word.vietnamese,
            ipa: word.ipa,
            difficulty: word.difficulty,
            category: word.category,
            lesson_id: coreLesson.id
          })
          importedCount++
        } catch (error) {
          console.error(`Failed to import word: ${word.english}`, error)
          failedCount++
        }
      }

      // Progress logging
      console.log(`📊 Progress: ${Math.min(i + BATCH_SIZE, IELTS_CORE_1000.length)}/${IELTS_CORE_1000.length} words processed`)
    }

    console.log('✅ IELTS Core 1000 import completed')
    console.log(`📈 Results: ${importedCount} imported, ${failedCount} failed`)

    return NextResponse.json({
      success: true,
      lesson: coreLesson,
      imported: importedCount,
      failed: failedCount,
      total: IELTS_CORE_1000.length
    })

  } catch (error) {
    console.error('❌ IELTS Core import failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Import failed', 
        details: error instanceof Error ? error.message : error 
      },
      { status: 500 }
    )
  }
}