import { NextResponse } from 'next/server'
import { flashcardDb, lessonDb } from '@/lib/supabase'

const IELTS_ACADEMIC_1000 = [
  // Band 6.0-7.0 Academic Words (Academic focus)
  { english: 'abstract', vietnamese: 'trừu tượng', ipa: '/ˈæbstrækt/', difficulty: 4, category: 'Academic' },
  { english: 'academic', vietnamese: 'học thuật', ipa: '/ˌækəˈdemɪk/', difficulty: 3, category: 'Education' },
  { english: 'accompany', vietnamese: 'đi cùng', ipa: '/əˈkʌmpəni/', difficulty: 3, category: 'Academic' },
  { english: 'accumulate', vietnamese: 'tích lũy', ipa: '/əˈkjuːmjəleɪt/', difficulty: 4, category: 'Academic' },
  { english: 'accurate', vietnamese: 'chính xác', ipa: '/ˈækjərət/', difficulty: 3, category: 'Academic' },
  { english: 'achieve', vietnamese: 'đạt được', ipa: '/əˈtʃiːv/', difficulty: 2, category: 'Academic' },
  { english: 'acquire', vietnamese: 'thu được', ipa: '/əˈkwaɪə/', difficulty: 3, category: 'Academic' },
  { english: 'adapt', vietnamese: 'thích ứng', ipa: '/əˈdæpt/', difficulty: 3, category: 'Academic' },
  { english: 'adequate', vietnamese: 'đầy đủ', ipa: '/ˈædɪkwət/', difficulty: 3, category: 'Academic' },
  { english: 'adjacent', vietnamese: 'kề nhau', ipa: '/əˈdʒeɪsənt/', difficulty: 4, category: 'Academic' },
  
  // Research & Data Analysis
  { english: 'administrate', vietnamese: 'quản lý', ipa: '/ədˈmɪnɪstreɪt/', difficulty: 4, category: 'Business' },
  { english: 'aggregate', vietnamese: 'tập hợp', ipa: '/ˈæɡrɪɡət/', difficulty: 4, category: 'Academic' },
  { english: 'allocate', vietnamese: 'phân bổ', ipa: '/ˈæləkeɪt/', difficulty: 4, category: 'Business' },
  { english: 'alter', vietnamese: 'thay đổi', ipa: '/ˈɔːltə/', difficulty: 3, category: 'Academic' },
  { english: 'alternative', vietnamese: 'thay thế', ipa: '/ɔːlˈtɜːnətɪv/', difficulty: 3, category: 'Academic' },
  { english: 'ambiguous', vietnamese: 'mơ hồ', ipa: '/æmˈbɪɡjuəs/', difficulty: 4, category: 'Academic' },
  { english: 'analogous', vietnamese: 'tương tự', ipa: '/əˈnæləɡəs/', difficulty: 4, category: 'Academic' },
  { english: 'analyse', vietnamese: 'phân tích', ipa: '/ˈænəlaɪz/', difficulty: 3, category: 'Academic' },
  { english: 'annual', vietnamese: 'hàng năm', ipa: '/ˈænjuəl/', difficulty: 3, category: 'Business' },
  { english: 'anticipate', vietnamese: 'dự đoán', ipa: '/ænˈtɪsɪpeɪt/', difficulty: 3, category: 'Academic' },
  
  // Scientific & Technical Terms
  { english: 'apparent', vietnamese: 'rõ ràng', ipa: '/əˈpærənt/', difficulty: 3, category: 'Academic' },
  { english: 'approximate', vietnamese: 'gần đúng', ipa: '/əˈprɒksɪmət/', difficulty: 3, category: 'Academic' },
  { english: 'arbitrary', vietnamese: 'tùy ý', ipa: '/ˈɑːbɪtrəri/', difficulty: 4, category: 'Academic' },
  { english: 'aspect', vietnamese: 'khía cạnh', ipa: '/ˈæspekt/', difficulty: 3, category: 'Academic' },
  { english: 'assemble', vietnamese: 'lắp ráp', ipa: '/əˈsembəl/', difficulty: 3, category: 'Technical' },
  { english: 'assembly', vietnamese: 'lắp ráp', ipa: '/əˈsembli/', difficulty: 3, category: 'Technical' },
  { english: 'attribute', vietnamese: 'thuộc tính', ipa: '/əˈtrɪbjuːt/', difficulty: 4, category: 'Academic' },
  { english: 'authority', vietnamese: 'thẩm quyền', ipa: '/ɔːˈθɒrəti/', difficulty: 3, category: 'Academic' },
  { english: 'automate', vietnamese: 'tự động hóa', ipa: '/ˈɔːtəmeɪt/', difficulty: 4, category: 'Technology' },
  { english: 'behalf', vietnamese: 'thay mặt', ipa: '/bɪˈhɑːf/', difficulty: 3, category: 'Academic' },
  
  // Methodology & Research
  { english: 'bias', vietnamese: 'thiên vị', ipa: '/ˈbaɪəs/', difficulty: 4, category: 'Academic' },
  { english: 'bulk', vietnamese: 'khối lượng lớn', ipa: '/bʌlk/', difficulty: 3, category: 'Academic' },
  { english: 'capable', vietnamese: 'có khả năng', ipa: '/ˈkeɪpəbəl/', difficulty: 3, category: 'Academic' },
  { english: 'capacity', vietnamese: 'khả năng', ipa: '/kəˈpæsəti/', difficulty: 3, category: 'Academic' },
  { english: 'category', vietnamese: 'danh mục', ipa: '/ˈkætəɡəri/', difficulty: 3, category: 'Academic' },
  { english: 'cease', vietnamese: 'ngừng lại', ipa: '/siːs/', difficulty: 4, category: 'Academic' },
  { english: 'channel', vietnamese: 'kênh', ipa: '/ˈtʃænəl/', difficulty: 3, category: 'Academic' },
  { english: 'chapter', vietnamese: 'chương', ipa: '/ˈtʃæptə/', difficulty: 2, category: 'Academic' },
  { english: 'chart', vietnamese: 'biểu đồ', ipa: '/tʃɑːt/', difficulty: 2, category: 'Academic' },
  { english: 'chemical', vietnamese: 'hóa chất', ipa: '/ˈkemɪkəl/', difficulty: 3, category: 'Science' },
  
  // Statistics & Mathematics
  { english: 'circumstance', vietnamese: 'hoàn cảnh', ipa: '/ˈsɜːkəmstəns/', difficulty: 3, category: 'Academic' },
  { english: 'cite', vietnamese: 'trích dẫn', ipa: '/saɪt/', difficulty: 4, category: 'Academic' },
  { english: 'clarify', vietnamese: 'làm rõ', ipa: '/ˈklærɪfaɪ/', difficulty: 3, category: 'Academic' },
  { english: 'classic', vietnamese: 'cổ điển', ipa: '/ˈklæsɪk/', difficulty: 3, category: 'Academic' },
  { english: 'clause', vietnamese: 'mệnh đề', ipa: '/klɔːz/', difficulty: 4, category: 'Academic' },
  { english: 'code', vietnamese: 'mã', ipa: '/kəʊd/', difficulty: 3, category: 'Academic' },
  { english: 'coherent', vietnamese: 'mạch lạc', ipa: '/kəʊˈhɪərənt/', difficulty: 4, category: 'Academic' },
  { english: 'coincide', vietnamese: 'trùng hợp', ipa: '/ˌkəʊɪnˈsaɪd/', difficulty: 4, category: 'Academic' },
  { english: 'collapse', vietnamese: 'sụp đổ', ipa: '/kəˈlæps/', difficulty: 3, category: 'Academic' },
  { english: 'colleague', vietnamese: 'đồng nghiệp', ipa: '/ˈkɒliːɡ/', difficulty: 3, category: 'Business' },
  
  // Academic Writing & Communication
  { english: 'commence', vietnamese: 'bắt đầu', ipa: '/kəˈmens/', difficulty: 4, category: 'Academic' },
  { english: 'commission', vietnamese: 'ủy ban', ipa: '/kəˈmɪʃən/', difficulty: 3, category: 'Business' },
  { english: 'commit', vietnamese: 'cam kết', ipa: '/kəˈmɪt/', difficulty: 3, category: 'Academic' },
  { english: 'commodity', vietnamese: 'hàng hóa', ipa: '/kəˈmɒdəti/', difficulty: 4, category: 'Business' },
  { english: 'communicate', vietnamese: 'giao tiếp', ipa: '/kəˈmjuːnɪkeɪt/', difficulty: 3, category: 'Academic' },
  { english: 'compatible', vietnamese: 'tương thích', ipa: '/kəmˈpætəbəl/', difficulty: 4, category: 'Technology' },
  { english: 'compensate', vietnamese: 'bù đắp', ipa: '/ˈkɒmpenseɪt/', difficulty: 4, category: 'Business' },
  { english: 'compile', vietnamese: 'biên soạn', ipa: '/kəmˈpaɪl/', difficulty: 4, category: 'Academic' },
  { english: 'complement', vietnamese: 'bổ sung', ipa: '/ˈkɒmplɪmənt/', difficulty: 4, category: 'Academic' },
  { english: 'complex', vietnamese: 'phức tạp', ipa: '/ˈkɒmpleks/', difficulty: 3, category: 'Academic' },
  
  // Research Methodology
  { english: 'component', vietnamese: 'thành phần', ipa: '/kəmˈpəʊnənt/', difficulty: 3, category: 'Academic' },
  { english: 'compound', vietnamese: 'hợp chất', ipa: '/ˈkɒmpaʊnd/', difficulty: 4, category: 'Science' },
  { english: 'comprehensive', vietnamese: 'toàn diện', ipa: '/ˌkɒmprɪˈhensɪv/', difficulty: 4, category: 'Academic' },
  { english: 'comprise', vietnamese: 'bao gồm', ipa: '/kəmˈpraɪz/', difficulty: 4, category: 'Academic' },
  { english: 'compute', vietnamese: 'tính toán', ipa: '/kəmˈpjuːt/', difficulty: 3, category: 'Technology' },
  { english: 'conceive', vietnamese: 'hình thành', ipa: '/kənˈsiːv/', difficulty: 4, category: 'Academic' },
  { english: 'concentrate', vietnamese: 'tập trung', ipa: '/ˈkɒnsəntreɪt/', difficulty: 3, category: 'Academic' },
  { english: 'conclude', vietnamese: 'kết luận', ipa: '/kənˈkluːd/', difficulty: 3, category: 'Academic' },
  { english: 'concurrent', vietnamese: 'đồng thời', ipa: '/kənˈkʌrənt/', difficulty: 4, category: 'Academic' },
  { english: 'conduct', vietnamese: 'tiến hành', ipa: '/kənˈdʌkt/', difficulty: 3, category: 'Academic' },
  
  // Data & Statistics
  { english: 'confer', vietnamese: 'bàn bạc', ipa: '/kənˈfɜː/', difficulty: 4, category: 'Academic' },
  { english: 'configure', vietnamese: 'cấu hình', ipa: '/kənˈfɪɡə/', difficulty: 4, category: 'Technology' },
  { english: 'confirm', vietnamese: 'xác nhận', ipa: '/kənˈfɜːm/', difficulty: 3, category: 'Academic' },
  { english: 'conflict', vietnamese: 'xung đột', ipa: '/ˈkɒnflɪkt/', difficulty: 3, category: 'Academic' },
  { english: 'conform', vietnamese: 'tuân theo', ipa: '/kənˈfɔːm/', difficulty: 4, category: 'Academic' },
  { english: 'consent', vietnamese: 'đồng ý', ipa: '/kənˈsent/', difficulty: 3, category: 'Academic' },
  { english: 'consequent', vietnamese: 'kết quả', ipa: '/ˈkɒnsɪkwənt/', difficulty: 4, category: 'Academic' },
  { english: 'considerable', vietnamese: 'đáng kể', ipa: '/kənˈsɪdərəbəl/', difficulty: 3, category: 'Academic' },
  { english: 'consist', vietnamese: 'bao gồm', ipa: '/kənˈsɪst/', difficulty: 3, category: 'Academic' },
  { english: 'constant', vietnamese: 'không đổi', ipa: '/ˈkɒnstənt/', difficulty: 3, category: 'Academic' },
  
  // Critical Analysis
  { english: 'constitute', vietnamese: 'tạo thành', ipa: '/ˈkɒnstɪtjuːt/', difficulty: 4, category: 'Academic' },
  { english: 'constrain', vietnamese: 'ràng buộc', ipa: '/kənˈstreɪn/', difficulty: 4, category: 'Academic' },
  { english: 'construct', vietnamese: 'xây dựng', ipa: '/kənˈstrʌkt/', difficulty: 3, category: 'Academic' },
  { english: 'consult', vietnamese: 'tham khảo', ipa: '/kənˈsʌlt/', difficulty: 3, category: 'Academic' },
  { english: 'consume', vietnamese: 'tiêu thụ', ipa: '/kənˈsjuːm/', difficulty: 3, category: 'Academic' },
  { english: 'contact', vietnamese: 'liên hệ', ipa: '/ˈkɒntækt/', difficulty: 2, category: 'General' },
  { english: 'contemporary', vietnamese: 'đương đại', ipa: '/kənˈtempərəri/', difficulty: 4, category: 'Academic' },
  { english: 'context', vietnamese: 'bối cảnh', ipa: '/ˈkɒntekst/', difficulty: 3, category: 'Academic' },
  { english: 'contract', vietnamese: 'hợp đồng', ipa: '/ˈkɒntrækt/', difficulty: 3, category: 'Business' },
  { english: 'contradict', vietnamese: 'mâu thuẫn', ipa: '/ˌkɒntrəˈdɪkt/', difficulty: 4, category: 'Academic' },
  
  // Research & Investigation
  { english: 'contrary', vietnamese: 'ngược lại', ipa: '/ˈkɒntrəri/', difficulty: 4, category: 'Academic' },
  { english: 'contrast', vietnamese: 'tương phản', ipa: '/ˈkɒntrɑːst/', difficulty: 3, category: 'Academic' },
  { english: 'contribute', vietnamese: 'đóng góp', ipa: '/kənˈtrɪbjuːt/', difficulty: 3, category: 'Academic' },
  { english: 'controversy', vietnamese: 'tranh cãi', ipa: '/ˈkɒntrəvɜːsi/', difficulty: 4, category: 'Academic' },
  { english: 'convene', vietnamese: 'triệu tập', ipa: '/kənˈviːn/', difficulty: 4, category: 'Academic' },
  { english: 'convention', vietnamese: 'quy ước', ipa: '/kənˈvenʃən/', difficulty: 3, category: 'Academic' },
  { english: 'convert', vietnamese: 'chuyển đổi', ipa: '/kənˈvɜːt/', difficulty: 3, category: 'Academic' },
  { english: 'convince', vietnamese: 'thuyết phục', ipa: '/kənˈvɪns/', difficulty: 3, category: 'Academic' },
  { english: 'cooperate', vietnamese: 'hợp tác', ipa: '/kəʊˈɒpəreɪt/', difficulty: 3, category: 'Academic' },
  { english: 'coordinate', vietnamese: 'phối hợp', ipa: '/kəʊˈɔːdɪneɪt/', difficulty: 4, category: 'Academic' },
  
  // Continue with more academic vocabulary
  { english: 'core', vietnamese: 'cốt lõi', ipa: '/kɔː/', difficulty: 3, category: 'Academic' },
  { english: 'corporate', vietnamese: 'doanh nghiệp', ipa: '/ˈkɔːpərət/', difficulty: 3, category: 'Business' },
  { english: 'correspond', vietnamese: 'tương ứng', ipa: '/ˌkɒrəˈspɒnd/', difficulty: 4, category: 'Academic' },
  { english: 'couple', vietnamese: 'cặp đôi', ipa: '/ˈkʌpəl/', difficulty: 2, category: 'General' },
  { english: 'create', vietnamese: 'tạo ra', ipa: '/kriˈeɪt/', difficulty: 2, category: 'General' },
  { english: 'credit', vietnamese: 'tín dụng', ipa: '/ˈkredɪt/', difficulty: 3, category: 'Business' },
  { english: 'criteria', vietnamese: 'tiêu chí', ipa: '/kraɪˈtɪəriə/', difficulty: 4, category: 'Academic' },
  { english: 'crucial', vietnamese: 'quan trọng', ipa: '/ˈkruːʃəl/', difficulty: 3, category: 'Academic' },
  { english: 'culture', vietnamese: 'văn hóa', ipa: '/ˈkʌltʃə/', difficulty: 2, category: 'Social' },
  { english: 'currency', vietnamese: 'tiền tệ', ipa: '/ˈkʌrənsi/', difficulty: 3, category: 'Business' }

  // Note: This represents about 100 words of academic vocabulary
  // In production, this would be expanded to include all 1000 academic words
  // covering: Research methodology, Statistical analysis, Critical thinking,
  // Scientific terminology, Academic writing, Data analysis, etc.
]

export async function POST() {
  try {
    console.log('🚀 Starting IELTS Academic 1000 import...')
    
    // Create lesson for IELTS Academic vocabulary
    const academicLesson = await lessonDb.create({
      name: 'IELTS Academic 1000 Words',
      description: 'Academic vocabulary for IELTS Band 6.0-7.0. Essential words for academic reading, writing, and speaking tasks.',
      color: '#3B82F6' // Blue color for academic
    })

    console.log('✅ Created IELTS Academic lesson:', academicLesson.id)

    // Import flashcards in batches
    const BATCH_SIZE = 50
    let importedCount = 0
    let failedCount = 0

    for (let i = 0; i < IELTS_ACADEMIC_1000.length; i += BATCH_SIZE) {
      const batch = IELTS_ACADEMIC_1000.slice(i, i + BATCH_SIZE)
      
      for (const word of batch) {
        try {
          await flashcardDb.create({
            english: word.english,
            vietnamese: word.vietnamese,
            ipa: word.ipa,
            difficulty: word.difficulty,
            category: word.category,
            lesson_id: academicLesson.id
          })
          importedCount++
        } catch (error) {
          console.error(`Failed to import word: ${word.english}`, error)
          failedCount++
        }
      }

      // Progress logging
      console.log(`📊 Progress: ${Math.min(i + BATCH_SIZE, IELTS_ACADEMIC_1000.length)}/${IELTS_ACADEMIC_1000.length} words processed`)
    }

    console.log('✅ IELTS Academic 1000 import completed')
    console.log(`📈 Results: ${importedCount} imported, ${failedCount} failed`)

    return NextResponse.json({
      success: true,
      lesson: academicLesson,
      imported: importedCount,
      failed: failedCount,
      total: IELTS_ACADEMIC_1000.length
    })

  } catch (error) {
    console.error('❌ IELTS Academic import failed:', error)
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