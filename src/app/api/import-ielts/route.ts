import { NextRequest, NextResponse } from 'next/server'
import { lessonDb, flashcardDb } from '@/lib/supabase'

// IELTS Level 1 data with Vietnamese meanings and IPA pronunciation
const ieltsLevel1Data = [
  // Words 1-20
  { english: 'achieve', vietnamese: 'đạt được, hoàn thành', ipa: '/əˈtʃiːv/' },
  { english: 'administration', vietnamese: 'quản lý, hành chính', ipa: '/ədˌmɪnɪˈstreɪʃən/' },
  { english: 'affect', vietnamese: 'ảnh hưởng', ipa: '/əˈfekt/' },
  { english: 'analysis', vietnamese: 'phân tích', ipa: '/əˈnæləsɪs/' },
  { english: 'approach', vietnamese: 'tiếp cận, phương pháp', ipa: '/əˈproʊtʃ/' },
  { english: 'appropriate', vietnamese: 'thích hợp, phù hợp', ipa: '/əˈproʊpriət/' },
  { english: 'area', vietnamese: 'khu vực, lĩnh vực', ipa: '/ˈɛəriə/' },
  { english: 'aspects', vietnamese: 'khía cạnh', ipa: '/ˈæspekts/' },
  { english: 'assistance', vietnamese: 'hỗ trợ, giúp đỡ', ipa: '/əˈsɪstəns/' },
  { english: 'assume', vietnamese: 'giả định, cho rằng', ipa: '/əˈsuːm/' },
  { english: 'authority', vietnamese: 'quyền lực, cơ quan có thẩm quyền', ipa: '/əˈθɔːrəti/' },
  { english: 'available', vietnamese: 'có sẵn, có thể có được', ipa: '/əˈveɪləbəl/' },
  { english: 'benefit', vietnamese: 'lợi ích, có lợi', ipa: '/ˈbenəfɪt/' },
  { english: 'category', vietnamese: 'loại, hạng mục', ipa: '/ˈkætəˌɡɔːri/' },
  { english: 'community', vietnamese: 'cộng đồng', ipa: '/kəˈmjuːnəti/' },
  { english: 'complex', vietnamese: 'phức tạp', ipa: '/ˈkɑːmpleks/' },
  { english: 'concerning', vietnamese: 'liên quan đến, về vấn đề', ipa: '/kənˈsɜːrnɪŋ/' },
  { english: 'conclusion', vietnamese: 'kết luận', ipa: '/kənˈkluːʒən/' },
  { english: 'conduct', vietnamese: 'tiến hành, thực hiện', ipa: '/kənˈdʌkt/' },
  { english: 'consequence', vietnamese: 'hậu quả', ipa: '/ˈkɑːnsəkwəns/' },

  // Words 21-40
  { english: 'consistent', vietnamese: 'nhất quán, kiên định', ipa: '/kənˈsɪstənt/' },
  { english: 'constitutional', vietnamese: 'thuộc về hiến pháp', ipa: '/ˌkɑːnstəˈtuːʃənəl/' },
  { english: 'consumer', vietnamese: 'người tiêu dùng', ipa: '/kənˈsuːmər/' },
  { english: 'context', vietnamese: 'bối cảnh, ngữ cảnh', ipa: '/ˈkɑːntekst/' },
  { english: 'create', vietnamese: 'tạo ra, sáng tạo', ipa: '/kriˈeɪt/' },
  { english: 'culture', vietnamese: 'văn hóa', ipa: '/ˈkʌltʃər/' },
  { english: 'data', vietnamese: 'dữ liệu', ipa: '/ˈdeɪtə/' },
  { english: 'definition', vietnamese: 'định nghĩa', ipa: '/ˌdefəˈnɪʃən/' },
  { english: 'destructive', vietnamese: 'phá hoại, tàn phá', ipa: '/dɪˈstrʌktɪv/' },
  { english: 'discovery', vietnamese: 'khám phá, phát hiện', ipa: '/dɪˈskʌvəri/' },
  { english: 'distinction', vietnamese: 'sự phân biệt, khác biệt', ipa: '/dɪˈstɪŋkʃən/' },
  { english: 'economic', vietnamese: 'kinh tế', ipa: '/ˌiːkəˈnɑːmɪk/' },
  { english: 'element', vietnamese: 'yếu tố, nguyên tố', ipa: '/ˈeləmənt/' },
  { english: 'environment', vietnamese: 'môi trường', ipa: '/ɪnˈvaɪrənmənt/' },
  { english: 'error', vietnamese: 'lỗi, sai lầm', ipa: '/ˈerər/' },
  { english: 'equation', vietnamese: 'phương trình', ipa: '/ɪˈkweɪʒən/' },
  { english: 'establish', vietnamese: 'thiết lập, thành lập', ipa: '/ɪˈstæblɪʃ/' },
  { english: 'estimate', vietnamese: 'ước tính', ipa: '/ˈestəmeɪt/' },
  { english: 'evaluation', vietnamese: 'đánh giá', ipa: '/ɪˌvæljuˈeɪʃən/' },
  { english: 'evidence', vietnamese: 'bằng chứng', ipa: '/ˈevədəns/' },

  // Words 41-60
  { english: 'factors', vietnamese: 'các yếu tố', ipa: '/ˈfæktərz/' },
  { english: 'feature', vietnamese: 'đặc điểm, tính năng', ipa: '/ˈfiːtʃər/' },
  { english: 'final', vietnamese: 'cuối cùng', ipa: '/ˈfaɪnəl/' },
  { english: 'financial', vietnamese: 'tài chính', ipa: '/faɪˈnænʃəl/' },
  { english: 'focus', vietnamese: 'tập trung', ipa: '/ˈfoʊkəs/' },
  { english: 'function', vietnamese: 'chức năng, hoạt động', ipa: '/ˈfʌŋkʃən/' },
  { english: 'global', vietnamese: 'toàn cầu', ipa: '/ˈɡloʊbəl/' },
  { english: 'identify', vietnamese: 'nhận dạng, xác định', ipa: '/aɪˈdentəˌfaɪ/' },
  { english: 'impact', vietnamese: 'tác động', ipa: '/ˈɪmpækt/' },
  { english: 'income', vietnamese: 'thu nhập', ipa: '/ˈɪnkʌm/' },
  { english: 'indicate', vietnamese: 'chỉ ra, biểu thị', ipa: '/ˈɪndəkeɪt/' },
  { english: 'individual', vietnamese: 'cá nhân', ipa: '/ˌɪndəˈvɪdʒuəl/' },
  { english: 'injury', vietnamese: 'chấn thương', ipa: '/ˈɪndʒəri/' },
  { english: 'investment', vietnamese: 'đầu tư', ipa: '/ɪnˈvestmənt/' },
  { english: 'involve', vietnamese: 'liên quan, bao gồm', ipa: '/ɪnˈvɑːlv/' },
  { english: 'issue', vietnamese: 'vấn đề', ipa: '/ˈɪʃuː/' },
  { english: 'item', vietnamese: 'mục, món đồ', ipa: '/ˈaɪtəm/' },
  { english: 'legal', vietnamese: 'pháp lý', ipa: '/ˈliːɡəl/' },
  { english: 'maintenance', vietnamese: 'bảo trì, duy trì', ipa: '/ˈmeɪntənəns/' },
  { english: 'major', vietnamese: 'chính, lớn', ipa: '/ˈmeɪdʒər/' },

  // Words 61-80
  { english: 'media', vietnamese: 'truyền thông', ipa: '/ˈmiːdiə/' },
  { english: 'method', vietnamese: 'phương pháp', ipa: '/ˈmeθəd/' },
  { english: 'modern', vietnamese: 'hiện đại', ipa: '/ˈmɑːdərn/' },
  { english: 'normal', vietnamese: 'bình thường', ipa: '/ˈnɔːrməl/' },
  { english: 'obtain', vietnamese: 'có được, đạt được', ipa: '/əbˈteɪn/' },
  { english: 'restrict', vietnamese: 'hạn chế', ipa: '/rɪˈstrɪkt/' },
  { english: 'occur', vietnamese: 'xảy ra', ipa: '/əˈkɜːr/' },
  { english: 'participation', vietnamese: 'sự tham gia', ipa: '/pɑːrˌtɪsəˈpeɪʃən/' },
  { english: 'percent', vietnamese: 'phần trăm', ipa: '/pərˈsent/' },
  { english: 'period', vietnamese: 'thời kỳ', ipa: '/ˈpɪriəd/' },
  { english: 'policy', vietnamese: 'chính sách', ipa: '/ˈpɑːləsi/' },
  { english: 'positive', vietnamese: 'tích cực', ipa: '/ˈpɑːzətɪv/' },
  { english: 'potential', vietnamese: 'tiềm năng', ipa: '/pəˈtenʃəl/' },
  { english: 'previous', vietnamese: 'trước đó', ipa: '/ˈpriːviəs/' },
  { english: 'primary', vietnamese: 'chính, cơ bản', ipa: '/ˈpraɪmeri/' },
  { english: 'process', vietnamese: 'quá trình', ipa: '/ˈprɑːses/' },
  { english: 'purchase', vietnamese: 'mua', ipa: '/ˈpɜːrtʃəs/' },
  { english: 'range', vietnamese: 'phạm vi', ipa: '/reɪndʒ/' },
  { english: 'recent', vietnamese: 'gần đây', ipa: '/ˈriːsənt/' },
  { english: 'region', vietnamese: 'vùng, khu vực', ipa: '/ˈriːdʒən/' },

  // Words 81-100
  { english: 'regulations', vietnamese: 'quy định', ipa: '/ˌreɡjəˈleɪʃənz/' },
  { english: 'relevant', vietnamese: 'liên quan', ipa: '/ˈreləvənt/' },
  { english: 'require', vietnamese: 'yêu cầu', ipa: '/rɪˈkwaɪər/' },
  { english: 'research', vietnamese: 'nghiên cứu', ipa: '/rɪˈsɜːrtʃ/' },
  { english: 'resident', vietnamese: 'cư dân', ipa: '/ˈrezədənt/' },
  { english: 'resources', vietnamese: 'tài nguyên', ipa: '/rɪˈsɔːrsɪz/' },
  { english: 'response', vietnamese: 'phản ứng, đáp lại', ipa: '/rɪˈspɑːns/' },
  { english: 'sector', vietnamese: 'lĩnh vực', ipa: '/ˈsektər/' },
  { english: 'security', vietnamese: 'an ninh, bảo mật', ipa: '/sɪˈkjʊrəti/' },
  { english: 'significant', vietnamese: 'đáng kể, quan trọng', ipa: '/sɪɡˈnɪfɪkənt/' },
  { english: 'similar', vietnamese: 'tương tự', ipa: '/ˈsɪmələr/' },
  { english: 'solution', vietnamese: 'giải pháp', ipa: '/səˈluːʃən/' },
  { english: 'source', vietnamese: 'nguồn', ipa: '/sɔːrs/' },
  { english: 'specific', vietnamese: 'cụ thể', ipa: '/spəˈsɪfɪk/' },
  { english: 'strategy', vietnamese: 'chiến lược', ipa: '/ˈstrætədʒi/' },
  { english: 'structure', vietnamese: 'cấu trúc', ipa: '/ˈstrʌktʃər/' },
  { english: 'theory', vietnamese: 'lý thuyết', ipa: '/ˈθɪri/' },
  { english: 'threat', vietnamese: 'mối đe dọa', ipa: '/θret/' },
  { english: 'traditional', vietnamese: 'truyền thống', ipa: '/trəˈdɪʃənəl/' },
  { english: 'transport', vietnamese: 'vận chuyển', ipa: '/ˈtrænspɔːrt/' }
]

export async function POST(request: NextRequest) {
  try {
    console.log('Starting IELTS data import...')

    // Create lessons
    const lessons = [
      {
        name: 'IELTS Level 1 (1-20)',
        description: 'IELTS Academic Wordlist - Level 1: Từ cơ bản nhất (1-20)',
        color: '#10B981'
      },
      {
        name: 'IELTS Level 1 (21-40)',
        description: 'IELTS Academic Wordlist - Level 1: Từ cơ bản nhất (21-40)',
        color: '#059669'
      },
      {
        name: 'IELTS Level 1 (41-60)',
        description: 'IELTS Academic Wordlist - Level 1: Từ cơ bản nhất (41-60)',
        color: '#047857'
      },
      {
        name: 'IELTS Level 1 (61-80)',
        description: 'IELTS Academic Wordlist - Level 1: Từ cơ bản nhất (61-80)',
        color: '#065F46'
      },
      {
        name: 'IELTS Level 1 (81-100)',
        description: 'IELTS Academic Wordlist - Level 1: Từ cơ bản nhất (81-100)',
        color: '#064E3B'
      }
    ]

    console.log('Creating lessons...')
    const createdLessons = []
    for (const lesson of lessons) {
      try {
        const createdLesson = await lessonDb.create(lesson)
        createdLessons.push(createdLesson)
        console.log(`Created lesson: ${createdLesson.name}`)
      } catch (error) {
        console.log(`Lesson ${lesson.name} might already exist, skipping...`)
        // Try to find existing lesson
        const existingLessons = await lessonDb.getAll()
        const existingLesson = existingLessons.find(l => l.name === lesson.name)
        if (existingLesson) {
          createdLessons.push(existingLesson)
        }
      }
    }

    // Import flashcards in batches
    console.log('Importing flashcards...')
    const batchSize = 20
    let importedCount = 0
    
    for (let i = 0; i < ieltsLevel1Data.length; i += batchSize) {
      const batch = ieltsLevel1Data.slice(i, i + batchSize)
      const lessonIndex = Math.floor(i / batchSize)
      const lesson = createdLessons[lessonIndex]

      if (!lesson) {
        console.log(`No lesson found for batch ${lessonIndex + 1}, skipping...`)
        continue
      }

      console.log(`Importing batch ${lessonIndex + 1} to lesson: ${lesson.name}`)
      
      for (const word of batch) {
        try {
          await flashcardDb.create({
            english: word.english,
            vietnamese: word.vietnamese,
            ipa: word.ipa,
            category: 'ielts',
            difficulty: 1,
            lesson_id: lesson.id
          })
          importedCount++
        } catch (error) {
          console.log(`Word ${word.english} might already exist, skipping...`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'IELTS data import completed successfully!',
      imported: {
        lessons: createdLessons.length,
        flashcards: importedCount
      }
    })

  } catch (error) {
    console.error('Error importing IELTS data:', error)
    return NextResponse.json(
      { error: 'Failed to import IELTS data', details: error },
      { status: 500 }
    )
  }
}
