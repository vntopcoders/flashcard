import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface VocabularyWord {
  word: string
  pronunciation?: string
  difficulty_level: number
  frequency_rank?: number
  category?: string
  definitions: Array<{
    part_of_speech: string
    definition_english: string
    definition_vietnamese: string
    example_sentence?: string
    example_vietnamese?: string
  }>
  synonyms?: string[]
  collocations?: Array<{
    collocation: string
    example?: string
  }>
}

// Comprehensive IELTS Vocabulary Data
const IELTS_VOCABULARY_SETS = {
  // Academic Word List Sublist 2
  awl_sublist2: [
    {
      word: 'achieve',
      pronunciation: '/əˈtʃiːv/',
      difficulty_level: 4,
      frequency_rank: 61,
      category: 'Academic',
      definitions: [
        {
          part_of_speech: 'verb',
          definition_english: 'successfully bring about or reach a desired objective',
          definition_vietnamese: 'đạt được hoặc thành công trong một mục tiêu mong muốn',
          example_sentence: 'She achieved her goal of becoming a doctor.',
          example_vietnamese: 'Cô ấy đã đạt được mục tiêu trở thành bác sĩ.'
        }
      ],
      synonyms: ['accomplish', 'attain', 'reach', 'realize'],
      collocations: [
        { collocation: 'achieve success', example: 'Hard work helps achieve success.' },
        { collocation: 'achieve a goal', example: 'We must work together to achieve our goal.' }
      ]
    },
    {
      word: 'acquire',
      pronunciation: '/əˈkwaɪər/',
      difficulty_level: 4,
      frequency_rank: 62,
      category: 'Academic',
      definitions: [
        {
          part_of_speech: 'verb',
          definition_english: 'buy or obtain an asset or object for oneself',
          definition_vietnamese: 'mua hoặc có được tài sản hoặc đồ vật cho bản thân',
          example_sentence: 'The company acquired several smaller firms.',
          example_vietnamese: 'Công ty đã mua lại một số công ty nhỏ hơn.'
        }
      ],
      synonyms: ['obtain', 'gain', 'get', 'purchase'],
      collocations: [
        { collocation: 'acquire knowledge', example: 'Students acquire knowledge through study.' },
        { collocation: 'acquire skills', example: 'You can acquire new skills through practice.' }
      ]
    },
    {
      word: 'administration',
      pronunciation: '/ədˌmɪnɪˈstreɪʃən/',
      difficulty_level: 4,
      frequency_rank: 63,
      category: 'Academic',
      definitions: [
        {
          part_of_speech: 'noun',
          definition_english: 'the process or activity of running a business or organization',
          definition_vietnamese: 'quá trình hoặc hoạt động điều hành doanh nghiệp hoặc tổ chức',
          example_sentence: 'The administration of the university is very efficient.',
          example_vietnamese: 'Ban quản trí của trường đại học rất hiệu quả.'
        }
      ],
      synonyms: ['management', 'governance', 'direction', 'control'],
      collocations: [
        { collocation: 'public administration', example: 'He studied public administration in college.' },
        { collocation: 'business administration', example: 'She has a degree in business administration.' }
      ]
    }
  ],

  // IELTS Environment Vocabulary
  environment: [
    {
      word: 'sustainability',
      pronunciation: '/səˌsteɪnəˈbɪləti/',
      difficulty_level: 4,
      frequency_rank: 150,
      category: 'Environment',
      definitions: [
        {
          part_of_speech: 'noun',
          definition_english: 'the ability to maintain or support a process continuously over time',
          definition_vietnamese: 'khả năng duy trì hoặc hỗ trợ một quá trình liên tục theo thời gian',
          example_sentence: 'Environmental sustainability is crucial for future generations.',
          example_vietnamese: 'Tính bền vững môi trường là quan trọng cho các thế hệ tương lai.'
        }
      ],
      synonyms: ['durability', 'continuity', 'permanence'],
      collocations: [
        { collocation: 'environmental sustainability', example: 'The company focuses on environmental sustainability.' },
        { collocation: 'sustainable development', example: 'Sustainable development meets present needs without compromising the future.' }
      ]
    },
    {
      word: 'biodiversity',
      pronunciation: '/ˌbaɪoʊdaɪˈvɜːrsəti/',
      difficulty_level: 4,
      frequency_rank: 200,
      category: 'Environment',
      definitions: [
        {
          part_of_speech: 'noun',
          definition_english: 'the variety of plant and animal life in the world or in a particular habitat',
          definition_vietnamese: 'sự đa dạng của đời sống thực vật và động vật trên thế giới hoặc trong một môi trường sống cụ thể',
          example_sentence: 'The rainforest has incredible biodiversity.',
          example_vietnamese: 'Rừng mưa nhiệt đới có sự đa dạng sinh học đáng kinh ngạc.'
        }
      ],
      synonyms: ['biological diversity', 'ecological variety'],
      collocations: [
        { collocation: 'protect biodiversity', example: 'We must protect biodiversity for future generations.' },
        { collocation: 'loss of biodiversity', example: 'Climate change causes loss of biodiversity.' }
      ]
    },
    {
      word: 'conservation',
      pronunciation: '/ˌkɑːnsərˈveɪʃən/',
      difficulty_level: 3,
      frequency_rank: 180,
      category: 'Environment',
      definitions: [
        {
          part_of_speech: 'noun',
          definition_english: 'the protection of plants, animals, and natural areas',
          definition_vietnamese: 'việc bảo vệ thực vật, động vật và các khu vực tự nhiên',
          example_sentence: 'Wildlife conservation is essential for maintaining ecosystems.',
          example_vietnamese: 'Bảo tồn động vật hoang dã là cần thiết để duy trì hệ sinh thái.'
        }
      ],
      synonyms: ['preservation', 'protection', 'safeguarding'],
      collocations: [
        { collocation: 'wildlife conservation', example: 'The park focuses on wildlife conservation.' },
        { collocation: 'energy conservation', example: 'Energy conservation reduces environmental impact.' }
      ]
    }
  ],

  // IELTS Technology Vocabulary
  technology: [
    {
      word: 'innovation',
      pronunciation: '/ˌɪnəˈveɪʃən/',
      difficulty_level: 4,
      frequency_rank: 120,
      category: 'Technology',
      definitions: [
        {
          part_of_speech: 'noun',
          definition_english: 'the introduction of new ideas, methods, or things',
          definition_vietnamese: 'việc giới thiệu những ý tưởng, phương pháp hoặc sự vật mới',
          example_sentence: 'Technological innovation drives economic growth.',
          example_vietnamese: 'Đổi mới công nghệ thúc đẩy tăng trưởng kinh tế.'
        }
      ],
      synonyms: ['invention', 'creativity', 'novelty', 'breakthrough'],
      collocations: [
        { collocation: 'technological innovation', example: 'Technological innovation changes our daily lives.' },
        { collocation: 'drive innovation', example: 'Competition drives innovation in the tech industry.' }
      ]
    },
    {
      word: 'artificial',
      pronunciation: '/ˌɑːrtɪˈfɪʃəl/',
      difficulty_level: 3,
      frequency_rank: 140,
      category: 'Technology',
      definitions: [
        {
          part_of_speech: 'adjective',
          definition_english: 'made by humans rather than occurring naturally',
          definition_vietnamese: 'được con người tạo ra thay vì xuất hiện tự nhiên',
          example_sentence: 'Artificial intelligence is revolutionizing many industries.',
          example_vietnamese: 'Trí tuệ nhân tạo đang cách mạng hóa nhiều ngành công nghiệp.'
        }
      ],
      synonyms: ['synthetic', 'man-made', 'manufactured'],
      collocations: [
        { collocation: 'artificial intelligence', example: 'Artificial intelligence helps automate complex tasks.' },
        { collocation: 'artificial materials', example: 'Many products use artificial materials instead of natural ones.' }
      ]
    }
  ],

  // IELTS Education Vocabulary
  education: [
    {
      word: 'curriculum',
      pronunciation: '/kəˈrɪkjələm/',
      difficulty_level: 4,
      frequency_rank: 160,
      category: 'Education',
      definitions: [
        {
          part_of_speech: 'noun',
          definition_english: 'the subjects comprising a course of study in a school or college',
          definition_vietnamese: 'các môn học bao gồm một khóa học trong trường học hoặc đại học',
          example_sentence: 'The school updated its curriculum to include more technology courses.',
          example_vietnamese: 'Trường đã cập nhật chương trình giảng dạy để bao gồm thêm các khóa học công nghệ.'
        }
      ],
      synonyms: ['syllabus', 'program', 'course of study'],
      collocations: [
        { collocation: 'school curriculum', example: 'The school curriculum covers all essential subjects.' },
        { collocation: 'develop curriculum', example: 'Teachers work together to develop curriculum.' }
      ]
    },
    {
      word: 'pedagogy',
      pronunciation: '/ˈpɛdəˌɡɑdʒi/',
      difficulty_level: 5,
      frequency_rank: 250,
      category: 'Education',
      definitions: [
        {
          part_of_speech: 'noun',
          definition_english: 'the method and practice of teaching',
          definition_vietnamese: 'phương pháp và thực hành giảng dạy',
          example_sentence: 'Modern pedagogy emphasizes student-centered learning.',
          example_vietnamese: 'Phương pháp giảng dạy hiện đại nhấn mạnh việc học tập lấy học sinh làm trung tâm.'
        }
      ],
      synonyms: ['teaching methodology', 'educational theory'],
      collocations: [
        { collocation: 'effective pedagogy', example: 'Effective pedagogy engages all students.' },
        { collocation: 'pedagogy research', example: 'Pedagogy research improves teaching methods.' }
      ]
    }
  ],

  // High-frequency IELTS Words
  common_ielts: [
    {
      word: 'demonstrate',
      pronunciation: '/ˈdemənˌstreɪt/',
      difficulty_level: 4,
      frequency_rank: 80,
      category: 'Academic',
      definitions: [
        {
          part_of_speech: 'verb',
          definition_english: 'clearly show the existence or truth of something by giving proof or evidence',
          definition_vietnamese: 'thể hiện rõ ràng sự tồn tại hoặc sự thật của điều gì đó bằng cách đưa ra bằng chứng',
          example_sentence: 'The experiment demonstrates the theory clearly.',
          example_vietnamese: 'Thí nghiệm chứng minh lý thuyết một cách rõ ràng.'
        }
      ],
      synonyms: ['prove', 'show', 'illustrate', 'exhibit'],
      collocations: [
        { collocation: 'demonstrate ability', example: 'Students must demonstrate their ability through tests.' },
        { collocation: 'demonstrate knowledge', example: 'The presentation demonstrates deep knowledge of the subject.' }
      ]
    },
    {
      word: 'facilitate',
      pronunciation: '/fəˈsɪləˌteɪt/',
      difficulty_level: 4,
      frequency_rank: 90,
      category: 'Academic',
      definitions: [
        {
          part_of_speech: 'verb',
          definition_english: 'make an action or process easier or help bring about',
          definition_vietnamese: 'làm cho một hành động hoặc quá trình dễ dàng hơn hoặc giúp thực hiện',
          example_sentence: 'Technology can facilitate learning in many ways.',
          example_vietnamese: 'Công nghệ có thể tạo điều kiện thuận lợi cho việc học tập theo nhiều cách.'
        }
      ],
      synonyms: ['assist', 'enable', 'help', 'support'],
      collocations: [
        { collocation: 'facilitate communication', example: 'The internet facilitates communication worldwide.' },
        { collocation: 'facilitate learning', example: 'Interactive tools facilitate learning.' }
      ]
    }
  ]
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { dataset = 'all', overwrite = false } = body

    let totalInserted = 0
    const errors: string[] = []

    // Get or create categories
    const categoryMap: Record<string, string> = {}
    const { data: categories } = await supabase
      .from('vocabulary_categories')
      .select('id, name')

    categories?.forEach(cat => {
      categoryMap[cat.name] = cat.id
    })

    // Process each vocabulary set
    const setsToProcess = dataset === 'all' 
      ? Object.entries(IELTS_VOCABULARY_SETS)
      : [[dataset, IELTS_VOCABULARY_SETS[dataset as keyof typeof IELTS_VOCABULARY_SETS]]]

    for (const [setName, words] of setsToProcess) {
      if (!words) continue

      for (const wordData of words) {
        try {
          // Check if word exists
          const { data: existingWord } = await supabase
            .from('vocabulary_words')
            .select('id')
            .eq('word', wordData.word.toLowerCase())
            .single()

          let wordId: string

          if (existingWord && !overwrite) {
            wordId = existingWord.id
          } else {
            // Insert or update word
            const wordInsert = {
              word: wordData.word.toLowerCase(),
              pronunciation: wordData.pronunciation,
              difficulty_level: wordData.difficulty_level,
              frequency_rank: wordData.frequency_rank,
              category_id: wordData.category ? categoryMap[wordData.category] : null,
              source_url: `import-${setName}`,
            }

            if (existingWord && overwrite) {
              const { data: updatedWord, error } = await supabase
                .from('vocabulary_words')
                .update(wordInsert)
                .eq('id', existingWord.id)
                .select('id')
                .single()

              if (error) throw error
              wordId = updatedWord.id
            } else {
              const { data: newWord, error } = await supabase
                .from('vocabulary_words')
                .insert(wordInsert)
                .select('id')
                .single()

              if (error) throw error  
              wordId = newWord.id
              totalInserted++
            }
          }

          // Insert definitions
          if (wordData.definitions) {
            // Clear existing definitions if overwriting
            if (overwrite) {
              await supabase
                .from('word_definitions')  
                .delete()
                .eq('word_id', wordId)
            }

            for (let i = 0; i < wordData.definitions.length; i++) {
              const def = wordData.definitions[i]
              await supabase
                .from('word_definitions')
                .insert({
                  word_id: wordId,
                  part_of_speech: def.part_of_speech,
                  definition_english: def.definition_english,
                  definition_vietnamese: def.definition_vietnamese,
                  example_sentence: def.example_sentence,
                  example_vietnamese: def.example_vietnamese,
                  order_index: i + 1
                })
            }
          }

          // Insert synonyms
          if (wordData.synonyms) {
            if (overwrite) {
              await supabase
                .from('word_synonyms')
                .delete()
                .eq('word_id', wordId)
            }

            for (const synonym of wordData.synonyms) {
              await supabase
                .from('word_synonyms')
                .insert({
                  word_id: wordId,
                  synonym: synonym
                })
            }
          }

          // Insert collocations
          if (wordData.collocations) {
            if (overwrite) {
              await supabase
                .from('word_collocations')
                .delete()
                .eq('word_id', wordId)
            }

            for (const collocation of wordData.collocations) {
              await supabase
                .from('word_collocations')
                .insert({
                  word_id: wordId,
                  collocation: collocation.collocation,
                  example: collocation.example
                })
            }
          }

        } catch (error) {
          errors.push(`Error processing word "${wordData.word}": ${error}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Vocabulary import completed',
      totalInserted,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ 
      error: 'Failed to import vocabulary',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}