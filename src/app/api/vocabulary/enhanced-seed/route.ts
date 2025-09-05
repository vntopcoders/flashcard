import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Enhanced IELTS vocabulary with comprehensive learning data
const ENHANCED_VOCABULARY = [
  {
    english: 'abundant',
    vietnamese: 'dồi dào, phong phú',
    ipa: 'əˈbʌndənt',
    difficulty: 3,
    category: 'Academic',
    examples: [
      {
        sentence: 'The region has abundant natural resources.',
        translation: 'Vùng này có tài nguyên thiên nhiên dồi dào.',
        context: 'Geography/Economics'
      },
      {
        sentence: 'She provided abundant evidence for her theory.',
        translation: 'Cô ấy đã cung cấp bằng chứng dồi dào cho lý thuyết của mình.',
        context: 'Academic Writing'
      },
      {
        sentence: 'The garden produced an abundant harvest this year.',
        translation: 'Khu vườn cho ra một vụ mùa dồi dào năm nay.',
        context: 'Agriculture'
      }
    ],
    collocations: [
      {
        phrase: 'abundant resources',
        meaning: 'tài nguyên dồi dào',
        example: 'The country is blessed with abundant natural resources.'
      },
      {
        phrase: 'abundant evidence',
        meaning: 'bằng chứng dồi dào',
        example: 'There is abundant evidence supporting this claim.'
      },
      {
        phrase: 'abundant supply',
        meaning: 'nguồn cung dồi dào',
        example: 'We have an abundant supply of fresh water.'
      }
    ],
    synonyms: ['plentiful', 'ample', 'copious', 'extensive', 'profuse'],
    antonyms: ['scarce', 'limited', 'insufficient', 'sparse'],
    etymology: 'From Latin abundare "to overflow, to be in great plenty"',
    memory_tips: 'Think of "a BUNDle ANT" - ants work in bundles/groups, showing abundance!'
  },
  {
    english: 'deteriorate',
    vietnamese: 'xấu đi, suy thoái',
    ipa: 'dɪˈtɪəriəreɪt',
    difficulty: 4,
    category: 'Academic',
    examples: [
      {
        sentence: 'The building began to deteriorate after years of neglect.',
        translation: 'Tòa nhà bắt đầu xuống cấp sau nhiều năm bị bỏ mặc.',
        context: 'Construction/Maintenance'
      },
      {
        sentence: 'His health deteriorated rapidly.',
        translation: 'Sức khỏe của anh ấy suy giảm nhanh chóng.',
        context: 'Health/Medical'
      },
      {
        sentence: 'The relationship deteriorated due to lack of communication.',
        translation: 'Mối quan hệ xấu đi do thiếu giao tiếp.',
        context: 'Social/Relationships'
      }
    ],
    collocations: [
      {
        phrase: 'deteriorate rapidly',
        meaning: 'xấu đi nhanh chóng',
        example: 'The situation deteriorated rapidly.'
      },
      {
        phrase: 'health deteriorates',
        meaning: 'sức khỏe suy giảm',
        example: 'His health has been deteriorating for months.'
      },
      {
        phrase: 'conditions deteriorate',
        meaning: 'điều kiện xấu đi',
        example: 'Weather conditions deteriorated throughout the day.'
      }
    ],
    synonyms: ['decline', 'degenerate', 'worsen', 'decay', 'degrade'],
    antonyms: ['improve', 'enhance', 'strengthen', 'upgrade'],
    etymology: 'From Latin deterioratus "made worse"',
    memory_tips: 'DE-TERIOR-ATE: Think "getting to a TERRIBLE state"'
  },
  {
    english: 'substantial',
    vietnamese: 'đáng kể, lớn lao',
    ipa: 'səbˈstænʃəl',
    difficulty: 3,
    category: 'Academic',
    examples: [
      {
        sentence: 'The company made substantial profits this quarter.',
        translation: 'Công ty đã có lợi nhuận đáng kể trong quý này.',
        context: 'Business/Finance'
      },
      {
        sentence: 'There has been substantial progress in medical research.',
        translation: 'Đã có tiến bộ đáng kể trong nghiên cứu y học.',
        context: 'Medical/Research'
      },
      {
        sentence: 'The project requires substantial investment.',
        translation: 'Dự án cần đầu tư đáng kể.',
        context: 'Investment/Projects'
      }
    ],
    collocations: [
      {
        phrase: 'substantial amount',
        meaning: 'số lượng đáng kể',
        example: 'They donated a substantial amount to charity.'
      },
      {
        phrase: 'substantial progress',
        meaning: 'tiến bộ đáng kể',
        example: 'We have made substantial progress on the project.'
      },
      {
        phrase: 'substantial evidence',
        meaning: 'bằng chứng vững chắc',
        example: 'The lawyer presented substantial evidence.'
      }
    ],
    synonyms: ['significant', 'considerable', 'major', 'extensive', 'sizeable'],
    antonyms: ['minor', 'insignificant', 'trivial', 'negligible'],
    etymology: 'From Latin substantialis "having substance"',
    memory_tips: 'SUB-STANCE-IAL: Has real SUBSTANCE, therefore substantial!'
  },
  {
    english: 'comprehensive',
    vietnamese: 'toàn diện, bao quát',
    ipa: 'ˌkɒmprɪˈhensɪv',
    difficulty: 4,
    category: 'Academic',
    examples: [
      {
        sentence: 'The report provides a comprehensive analysis of the market.',
        translation: 'Báo cáo cung cấp phân tích toàn diện về thị trường.',
        context: 'Business/Analysis'
      },
      {
        sentence: 'Students need comprehensive health insurance.',
        translation: 'Sinh viên cần bảo hiểm y tế toàn diện.',
        context: 'Healthcare/Insurance'
      },
      {
        sentence: 'The book offers comprehensive coverage of the topic.',
        translation: 'Cuốn sách cung cấp phạm vi bao quát toàn diện về chủ đề.',
        context: 'Education/Publishing'
      }
    ],
    collocations: [
      {
        phrase: 'comprehensive study',
        meaning: 'nghiên cứu toàn diện',
        example: 'They conducted a comprehensive study of climate change.'
      },
      {
        phrase: 'comprehensive plan',
        meaning: 'kế hoạch toàn diện',
        example: 'The government announced a comprehensive healthcare plan.'
      },
      {
        phrase: 'comprehensive review',
        meaning: 'đánh giá toàn diện',
        example: 'The policy underwent a comprehensive review.'
      }
    ],
    synonyms: ['complete', 'thorough', 'extensive', 'exhaustive', 'all-inclusive'],
    antonyms: ['partial', 'incomplete', 'limited', 'selective'],
    etymology: 'From Latin comprehensivus "including much"',
    memory_tips: 'COMPRE-HENSIVE: COMPREhends everything, very HENSIVE (extensive)!'
  },
  {
    english: 'inevitable',
    vietnamese: 'không thể tránh khỏi',
    ipa: 'ɪˈnevɪtəbəl',
    difficulty: 4,
    category: 'Academic',
    examples: [
      {
        sentence: 'Climate change makes rising sea levels inevitable.',
        translation: 'Biến đổi khí hậu khiến mực nước biển dâng cao là không thể tránh khỏi.',
        context: 'Environment/Climate'
      },
      {
        sentence: 'Conflict seemed inevitable given the circumstances.',
        translation: 'Xung đột dường như không thể tránh khỏi trong hoàn cảnh đó.',
        context: 'Politics/Conflict'
      },
      {
        sentence: 'Aging is an inevitable part of life.',
        translation: 'Lão hóa là phần không thể tránh khỏi của cuộc sống.',
        context: 'Life/Philosophy'
      }
    ],
    collocations: [
      {
        phrase: 'inevitable consequence',
        meaning: 'hậu quả không thể tránh khỏi',
        example: 'Pollution is an inevitable consequence of industrialization.'
      },
      {
        phrase: 'inevitable outcome',
        meaning: 'kết quả không thể tránh khỏi',
        example: 'Given the evidence, conviction was the inevitable outcome.'
      },
      {
        phrase: 'seem inevitable',
        meaning: 'có vẻ không thể tránh khỏi',
        example: 'War seemed inevitable at that point.'
      }
    ],
    synonyms: ['unavoidable', 'inescapable', 'certain', 'destined', 'predetermined'],
    antonyms: ['avoidable', 'preventable', 'uncertain', 'optional'],
    etymology: 'From Latin inevitabilis "that cannot be avoided"',
    memory_tips: 'IN-EVITABLE: you can\'t "EVIT" (exit/avoid) it, so it\'s inevitable!'
  },
  {
    english: 'skeptical',
    vietnamese: 'hoài nghi, nghi ngờ',
    ipa: 'ˈskeptɪkəl',
    difficulty: 3,
    category: 'Academic',
    examples: [
      {
        sentence: 'Scientists remain skeptical about the new theory.',
        translation: 'Các nhà khoa học vẫn hoài nghi về lý thuyết mới.',
        context: 'Science/Research'
      },
      {
        sentence: 'Many voters are skeptical of political promises.',
        translation: 'Nhiều cử tri hoài nghi về những lời hứa chính trị.',
        context: 'Politics/Elections'
      },
      {
        sentence: 'She was skeptical about the investment opportunity.',
        translation: 'Cô ấy hoài nghi về cơ hội đầu tư.',
        context: 'Business/Investment'
      }
    ],
    collocations: [
      {
        phrase: 'remain skeptical',
        meaning: 'vẫn hoài nghi',
        example: 'Experts remain skeptical about the claims.'
      },
      {
        phrase: 'skeptical attitude',
        meaning: 'thái độ hoài nghi',
        example: 'She approached the proposal with a skeptical attitude.'
      },
      {
        phrase: 'highly skeptical',
        meaning: 'rất hoài nghi',
        example: 'The public is highly skeptical of the government\'s motives.'
      }
    ],
    synonyms: ['doubtful', 'dubious', 'suspicious', 'questioning', 'cynical'],
    antonyms: ['trusting', 'credulous', 'believing', 'accepting'],
    etymology: 'From Greek skeptikos "inquiring, reflective"',
    memory_tips: 'SKEPTICAL: Think of SKEPTIC + AL, someone who questions everything'
  }
]

export async function POST() {
  try {
    let successCount = 0
    const errors: string[] = []

    for (const vocab of ENHANCED_VOCABULARY) {
      try {
        // Insert the enhanced flashcard
        const { error: flashcardError } = await supabase
          .from('flashcards')
          .insert({
            english: vocab.english,
            vietnamese: vocab.vietnamese,
            ipa: vocab.ipa,
            difficulty: vocab.difficulty,
            category: vocab.category,
            examples: JSON.stringify(vocab.examples),
            collocations: JSON.stringify(vocab.collocations),
            synonyms: JSON.stringify(vocab.synonyms),
            antonyms: JSON.stringify(vocab.antonyms),
            etymology: vocab.etymology,
            memory_tips: vocab.memory_tips
          })
          .select()
          .single()

        if (flashcardError) {
          errors.push(`Failed to create flashcard for "${vocab.english}": ${flashcardError.message}`)
          continue
        }

        successCount++

      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        errors.push(`Error processing "${vocab.english}": ${errorMsg}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Enhanced vocabulary seeding completed`,
      results: {
        total: ENHANCED_VOCABULARY.length,
        successful: successCount,
        errors: errors.length
      },
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json({
      success: false,
      message: 'Failed to seed enhanced vocabulary',
      error: errorMessage
    }, { status: 500 })
  }
}

// GET endpoint to retrieve enhanced vocabulary stats
export async function GET() {
  try {
    // Get total count
    const { count: totalCount, error: countError } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      throw new Error(`Failed to count flashcards: ${countError.message}`)
    }

    // Get enhanced vocabulary count (cards with examples)
    const { data: enhancedCards, error: enhancedError } = await supabase
      .from('flashcards')
      .select('id, english, examples, collocations, synonyms')
      .not('examples', 'is', null)

    if (enhancedError) {
      throw new Error(`Failed to get enhanced cards: ${enhancedError.message}`)
    }

    // Get category distribution
    const { data: categories, error: categoriesError } = await supabase
      .from('flashcards')
      .select('category')

    if (categoriesError) {
      throw new Error(`Failed to get categories: ${categoriesError.message}`)
    }

    const categoryStats = categories?.reduce((acc: Record<string, number>, card: { category: string }) => {
      acc[card.category] = (acc[card.category] || 0) + 1
      return acc
    }, {}) || {}

    return NextResponse.json({
      success: true,
      stats: {
        total_vocabulary: totalCount || 0,
        enhanced_vocabulary: enhancedCards?.length || 0,
        enhancement_rate: totalCount ? Math.round((enhancedCards?.length || 0) / totalCount * 100) : 0,
        categories: categoryStats,
        sample_enhanced: enhancedCards?.slice(0, 3).map(card => ({
          english: card.english,
          has_examples: !!card.examples,
          has_collocations: !!card.collocations,
          has_synonyms: !!card.synonyms
        }))
      }
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json({
      success: false,
      message: 'Failed to get vocabulary stats',
      error: errorMessage
    }, { status: 500 })
  }
}