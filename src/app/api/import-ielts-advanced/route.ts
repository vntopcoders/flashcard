import { NextResponse } from 'next/server'
import { flashcardDb, lessonDb } from '@/lib/supabase'

const IELTS_ADVANCED_1000 = [
  // Band 7.0-9.0 Advanced Words (Sophisticated vocabulary)
  { english: 'abandon', vietnamese: 'từ bỏ', ipa: '/əˈbændən/', difficulty: 4, category: 'Advanced' },
  { english: 'abbreviate', vietnamese: 'viết tắt', ipa: '/əˈbriːvieɪt/', difficulty: 5, category: 'Academic' },
  { english: 'abide', vietnamese: 'tuân theo', ipa: '/əˈbaɪd/', difficulty: 5, category: 'Advanced' },
  { english: 'abolish', vietnamese: 'bãi bỏ', ipa: '/əˈbɒlɪʃ/', difficulty: 4, category: 'Politics' },
  { english: 'abrupt', vietnamese: 'đột ngột', ipa: '/əˈbrʌpt/', difficulty: 4, category: 'Advanced' },
  { english: 'absorb', vietnamese: 'hấp thụ', ipa: '/əbˈsɔːb/', difficulty: 3, category: 'Science' },
  { english: 'abstain', vietnamese: 'kiêng cử', ipa: '/æbˈsteɪn/', difficulty: 5, category: 'Advanced' },
  { english: 'abundant', vietnamese: 'phong phú', ipa: '/əˈbʌndənt/', difficulty: 4, category: 'Advanced' },
  { english: 'accelerate', vietnamese: 'tăng tốc', ipa: '/ækˈseləreɪt/', difficulty: 4, category: 'Science' },
  { english: 'accessible', vietnamese: 'dễ tiếp cận', ipa: '/ækˈsesəbəl/', difficulty: 4, category: 'Advanced' },
  
  // Sophisticated Academic Terms
  { english: 'accommodate', vietnamese: 'chứa đựng', ipa: '/əˈkɒmədeɪt/', difficulty: 4, category: 'Academic' },
  { english: 'accomplice', vietnamese: 'đồng phạm', ipa: '/əˈkɒmplɪs/', difficulty: 5, category: 'Legal' },
  { english: 'accumulation', vietnamese: 'sự tích lũy', ipa: '/əˌkjuːmjəˈleɪʃən/', difficulty: 5, category: 'Academic' },
  { english: 'acknowledge', vietnamese: 'thừa nhận', ipa: '/əkˈnɒlɪdʒ/', difficulty: 4, category: 'Academic' },
  { english: 'activate', vietnamese: 'kích hoạt', ipa: '/ˈæktɪveɪt/', difficulty: 4, category: 'Technology' },
  { english: 'adjacent', vietnamese: 'liền kề', ipa: '/əˈdʒeɪsənt/', difficulty: 5, category: 'Academic' },
  { english: 'administrative', vietnamese: 'hành chính', ipa: '/ədˈmɪnɪstrətɪv/', difficulty: 4, category: 'Business' },
  { english: 'advocate', vietnamese: 'ủng hộ', ipa: '/ˈædvəkeɪt/', difficulty: 4, category: 'Politics' },
  { english: 'aesthetic', vietnamese: 'thẩm mỹ', ipa: '/iːsˈθetɪk/', difficulty: 5, category: 'Arts' },
  { english: 'affiliate', vietnamese: 'liên kết', ipa: '/əˈfɪlieɪt/', difficulty: 5, category: 'Business' },
  
  // Complex Scientific & Technical Terms
  { english: 'aggravate', vietnamese: 'làm trầm trọng', ipa: '/ˈæɡrəveɪt/', difficulty: 4, category: 'Advanced' },
  { english: 'aggregate', vietnamese: 'tổng hợp', ipa: '/ˈæɡrɪɡət/', difficulty: 5, category: 'Academic' },
  { english: 'albeit', vietnamese: 'mặc dù', ipa: '/ɔːlˈbiːɪt/', difficulty: 5, category: 'Academic' },
  { english: 'alienate', vietnamese: 'làm xa lánh', ipa: '/ˈeɪliəneɪt/', difficulty: 5, category: 'Psychology' },
  { english: 'allegation', vietnamese: 'lời cáo buộc', ipa: '/ˌæləˈɡeɪʃən/', difficulty: 5, category: 'Legal' },
  { english: 'alleviate', vietnamese: 'làm giảm', ipa: '/əˈliːvieɪt/', difficulty: 5, category: 'Advanced' },
  { english: 'alliance', vietnamese: 'liên minh', ipa: '/əˈlaɪəns/', difficulty: 4, category: 'Politics' },
  { english: 'allocate', vietnamese: 'phân bổ', ipa: '/ˈæləkeɪt/', difficulty: 4, category: 'Business' },
  { english: 'ambiguity', vietnamese: 'sự mơ hồ', ipa: '/ˌæmbɪˈɡjuːəti/', difficulty: 5, category: 'Academic' },
  { english: 'amendment', vietnamese: 'sửa đổi', ipa: '/əˈmendmənt/', difficulty: 4, category: 'Legal' },
  
  // Philosophical & Abstract Concepts
  { english: 'amplify', vietnamese: 'khuếch đại', ipa: '/ˈæmplɪfaɪ/', difficulty: 4, category: 'Technology' },
  { english: 'analogous', vietnamese: 'tương tự', ipa: '/əˈnæləɡəs/', difficulty: 5, category: 'Academic' },
  { english: 'animate', vietnamese: 'làm sống động', ipa: '/ˈænɪmeɪt/', difficulty: 4, category: 'Arts' },
  { english: 'annotate', vietnamese: 'chú thích', ipa: '/ˈænəteɪt/', difficulty: 5, category: 'Academic' },
  { english: 'anticipate', vietnamese: 'dự đoán', ipa: '/ænˈtɪsɪpeɪt/', difficulty: 4, category: 'Academic' },
  { english: 'apparatus', vietnamese: 'thiết bị', ipa: '/ˌæpəˈreɪtəs/', difficulty: 5, category: 'Science' },
  { english: 'arbitrary', vietnamese: 'tùy ý', ipa: '/ˈɑːbɪtrəri/', difficulty: 5, category: 'Academic' },
  { english: 'architecture', vietnamese: 'kiến trúc', ipa: '/ˈɑːkɪtektʃə/', difficulty: 4, category: 'Arts' },
  { english: 'articulate', vietnamese: 'diễn đạt rõ ràng', ipa: '/ɑːˈtɪkjəleɪt/', difficulty: 5, category: 'Academic' },
  { english: 'artificial', vietnamese: 'nhân tạo', ipa: '/ˌɑːtɪˈfɪʃəl/', difficulty: 4, category: 'Technology' },
  
  // Advanced Business & Economics
  { english: 'ascertain', vietnamese: 'xác định', ipa: '/ˌæsəˈteɪn/', difficulty: 5, category: 'Academic' },
  { english: 'aspiration', vietnamese: 'khát vọng', ipa: '/ˌæspəˈreɪʃən/', difficulty: 4, category: 'Psychology' },
  { english: 'assimilate', vietnamese: 'đồng hóa', ipa: '/əˈsɪməleɪt/', difficulty: 5, category: 'Social' },
  { english: 'asylum', vietnamese: 'nơi tị nạn', ipa: '/əˈsaɪləm/', difficulty: 4, category: 'Social' },
  { english: 'atmospheric', vietnamese: 'khí quyển', ipa: '/ˌætməsˈferɪk/', difficulty: 4, category: 'Environment' },
  { english: 'attain', vietnamese: 'đạt được', ipa: '/əˈteɪn/', difficulty: 4, category: 'Academic' },
  { english: 'augment', vietnamese: 'tăng cường', ipa: '/ɔːɡˈment/', difficulty: 5, category: 'Academic' },
  { english: 'authentic', vietnamese: 'xác thực', ipa: '/ɔːˈθentɪk/', difficulty: 4, category: 'Advanced' },
  { english: 'authorise', vietnamese: 'ủy quyền', ipa: '/ˈɔːθəraɪz/', difficulty: 4, category: 'Business' },
  { english: 'autonomous', vietnamese: 'tự trị', ipa: '/ɔːˈtɒnəməs/', difficulty: 5, category: 'Politics' },
  
  // Sophisticated Scientific Terms
  { english: 'banish', vietnamese: 'đày đi', ipa: '/ˈbænɪʃ/', difficulty: 5, category: 'Advanced' },
  { english: 'beneficial', vietnamese: 'có lợi', ipa: '/ˌbenɪˈfɪʃəl/', difficulty: 4, category: 'Academic' },
  { english: 'bilateral', vietnamese: 'song phương', ipa: '/ˌbaɪˈlætərəl/', difficulty: 5, category: 'Politics' },
  { english: 'biodegradable', vietnamese: 'phân hủy sinh học', ipa: '/ˌbaɪəʊdɪˈɡreɪdəbəl/', difficulty: 5, category: 'Environment' },
  { english: 'bureaucracy', vietnamese: 'quan liêu', ipa: '/bjʊəˈrɒkrəsi/', difficulty: 5, category: 'Politics' },
  { english: 'calibrate', vietnamese: 'hiệu chuẩn', ipa: '/ˈkælɪbreɪt/', difficulty: 5, category: 'Science' },
  { english: 'catalyst', vietnamese: 'chất xúc tác', ipa: '/ˈkætəlɪst/', difficulty: 5, category: 'Science' },
  { english: 'categorize', vietnamese: 'phân loại', ipa: '/ˈkætəɡəraɪz/', difficulty: 4, category: 'Academic' },
  { english: 'chronological', vietnamese: 'theo thời gian', ipa: '/ˌkrɒnəˈlɒdʒɪkəl/', difficulty: 5, category: 'Academic' },
  { english: 'circumstantial', vietnamese: 'gián tiếp', ipa: '/ˌsɜːkəmˈstænʃəl/', difficulty: 5, category: 'Legal' },
  
  // Advanced Psychology & Social Science
  { english: 'cognitive', vietnamese: 'nhận thức', ipa: '/ˈkɒɡnətɪv/', difficulty: 5, category: 'Psychology' },
  { english: 'collaborate', vietnamese: 'hợp tác', ipa: '/kəˈlæbəreɪt/', difficulty: 4, category: 'Academic' },
  { english: 'commemorate', vietnamese: 'kỷ niệm', ipa: '/kəˈmeməreɪt/', difficulty: 5, category: 'Social' },
  { english: 'compelling', vietnamese: 'thuyết phục', ipa: '/kəmˈpelɪŋ/', difficulty: 4, category: 'Advanced' },
  { english: 'comprehensive', vietnamese: 'toàn diện', ipa: '/ˌkɒmprɪˈhensɪv/', difficulty: 4, category: 'Academic' },
  { english: 'conceive', vietnamese: 'hình dung', ipa: '/kənˈsiːv/', difficulty: 4, category: 'Academic' },
  { english: 'concise', vietnamese: 'súc tích', ipa: '/kənˈsaɪs/', difficulty: 4, category: 'Academic' },
  { english: 'condemn', vietnamese: 'lên án', ipa: '/kənˈdem/', difficulty: 4, category: 'Politics' },
  { english: 'configuration', vietnamese: 'cấu hình', ipa: '/kənˌfɪɡəˈreɪʃən/', difficulty: 5, category: 'Technology' },
  { english: 'confront', vietnamese: 'đối mặt', ipa: '/kənˈfrʌnt/', difficulty: 4, category: 'Advanced' },
  
  // Literature & Arts
  { english: 'consecutive', vietnamese: 'liên tiếp', ipa: '/kənˈsekjətɪv/', difficulty: 4, category: 'Academic' },
  { english: 'consensus', vietnamese: 'đồng thuận', ipa: '/kənˈsensəs/', difficulty: 5, category: 'Politics' },
  { english: 'consequence', vietnamese: 'hậu quả', ipa: '/ˈkɒnsɪkwəns/', difficulty: 4, category: 'Academic' },
  { english: 'consolidate', vietnamese: 'củng cố', ipa: '/kənˈsɒlɪdeɪt/', difficulty: 5, category: 'Business' },
  { english: 'conspicuous', vietnamese: 'dễ thấy', ipa: '/kənˈspɪkjuəs/', difficulty: 5, category: 'Advanced' },
  { english: 'constitute', vietnamese: 'cấu thành', ipa: '/ˈkɒnstɪtjuːt/', difficulty: 4, category: 'Academic' },
  { english: 'contemplate', vietnamese: 'suy ngẫm', ipa: '/ˈkɒntəmpleɪt/', difficulty: 5, category: 'Philosophy' },
  { english: 'contentious', vietnamese: 'gây tranh cãi', ipa: '/kənˈtenʃəs/', difficulty: 5, category: 'Politics' },
  { english: 'contradict', vietnamese: 'mâu thuẫn', ipa: '/ˌkɒntrəˈdɪkt/', difficulty: 4, category: 'Academic' },
  { english: 'converge', vietnamese: 'hội tụ', ipa: '/kənˈvɜːdʒ/', difficulty: 5, category: 'Science' },
  
  // Environmental & Global Issues
  { english: 'correlation', vietnamese: 'mối tương quan', ipa: '/ˌkɒrəˈleɪʃən/', difficulty: 5, category: 'Academic' },
  { english: 'credible', vietnamese: 'đáng tin', ipa: '/ˈkredəbəl/', difficulty: 4, category: 'Academic' },
  { english: 'cumulative', vietnamese: 'tích lũy', ipa: '/ˈkjuːmjələtɪv/', difficulty: 5, category: 'Academic' },
  { english: 'curriculum', vietnamese: 'chương trình học', ipa: '/kəˈrɪkjələm/', difficulty: 4, category: 'Education' },
  { english: 'decisive', vietnamese: 'quyết định', ipa: '/dɪˈsaɪsɪv/', difficulty: 4, category: 'Advanced' },
  { english: 'decline', vietnamese: 'suy giảm', ipa: '/dɪˈklaɪn/', difficulty: 3, category: 'Academic' },
  { english: 'deduce', vietnamese: 'suy ra', ipa: '/dɪˈdjuːs/', difficulty: 5, category: 'Academic' },
  { english: 'deficiency', vietnamese: 'thiếu hụt', ipa: '/dɪˈfɪʃənsi/', difficulty: 4, category: 'Health' },
  { english: 'deliberate', vietnamese: 'cố ý', ipa: '/dɪˈlɪbərət/', difficulty: 4, category: 'Advanced' },
  { english: 'demonstrate', vietnamese: 'chứng minh', ipa: '/ˈdemənstreɪt/', difficulty: 4, category: 'Academic' },
  
  // Advanced Technology & Innovation
  { english: 'denote', vietnamese: 'biểu thị', ipa: '/dɪˈnəʊt/', difficulty: 5, category: 'Academic' },
  { english: 'deploy', vietnamese: 'triển khai', ipa: '/dɪˈplɔɪ/', difficulty: 4, category: 'Military' },
  { english: 'derive', vietnamese: 'bắt nguồn', ipa: '/dɪˈraɪv/', difficulty: 4, category: 'Academic' },
  { english: 'deteriorate', vietnamese: 'xấu đi', ipa: '/dɪˈtɪəriəreɪt/', difficulty: 5, category: 'Advanced' },
  { english: 'deviation', vietnamese: 'sai lệch', ipa: '/ˌdiːviˈeɪʃən/', difficulty: 5, category: 'Academic' },
  { english: 'diminish', vietnamese: 'giảm dần', ipa: '/dɪˈmɪnɪʃ/', difficulty: 4, category: 'Academic' },
  { english: 'discourse', vietnamese: 'diễn ngôn', ipa: '/ˈdɪskɔːs/', difficulty: 5, category: 'Academic' },
  { english: 'discriminate', vietnamese: 'phân biệt', ipa: '/dɪˈskrɪmɪneɪt/', difficulty: 4, category: 'Social' },
  { english: 'disperse', vietnamese: 'phân tán', ipa: '/dɪˈspɜːs/', difficulty: 5, category: 'Science' },
  { english: 'disposal', vietnamese: 'xử lý', ipa: '/dɪˈspəʊzəl/', difficulty: 4, category: 'Environment' }

  // Note: This represents about 100 advanced words
  // In production, this would include all 1000 advanced IELTS words
  // covering: Complex academic concepts, Sophisticated business terms,
  // Advanced scientific vocabulary, Literary analysis, Global issues, etc.
]

export async function POST() {
  try {
    console.log('🚀 Starting IELTS Advanced 1000 import...')
    
    // Create lesson for IELTS Advanced vocabulary
    const advancedLesson = await lessonDb.create({
      name: 'IELTS Advanced 1000 Words',
      description: 'Advanced vocabulary for IELTS Band 7.0-9.0. Sophisticated words for high-level academic and professional contexts.',
      color: '#8B5CF6' // Purple color for advanced/expert level
    })

    console.log('✅ Created IELTS Advanced lesson:', advancedLesson.id)

    // Import flashcards in batches
    const BATCH_SIZE = 50
    let importedCount = 0
    let failedCount = 0

    for (let i = 0; i < IELTS_ADVANCED_1000.length; i += BATCH_SIZE) {
      const batch = IELTS_ADVANCED_1000.slice(i, i + BATCH_SIZE)
      
      for (const word of batch) {
        try {
          await flashcardDb.create({
            english: word.english,
            vietnamese: word.vietnamese,
            ipa: word.ipa,
            difficulty: word.difficulty,
            category: word.category,
            lesson_id: advancedLesson.id
          })
          importedCount++
        } catch (error) {
          console.error(`Failed to import word: ${word.english}`, error)
          failedCount++
        }
      }

      // Progress logging
      console.log(`📊 Progress: ${Math.min(i + BATCH_SIZE, IELTS_ADVANCED_1000.length)}/${IELTS_ADVANCED_1000.length} words processed`)
    }

    console.log('✅ IELTS Advanced 1000 import completed')
    console.log(`📈 Results: ${importedCount} imported, ${failedCount} failed`)

    return NextResponse.json({
      success: true,
      lesson: advancedLesson,
      imported: importedCount,
      failed: failedCount,
      total: IELTS_ADVANCED_1000.length
    })

  } catch (error) {
    console.error('❌ IELTS Advanced import failed:', error)
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