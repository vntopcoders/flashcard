import { NextRequest, NextResponse } from 'next/server'

// Sample examples data for common words
const SAMPLE_EXAMPLES = {
  // Environment words
  "disposal": [
    {
      sentence: "The disposal of nuclear waste requires careful planning and safety measures.",
      translation: "Việc xử lý chất thải hạt nhân đòi hỏi lập kế hoạch cẩn thận và các biện pháp an toàn.",
      context: "Environmental protection"
    },
    {
      sentence: "The company improved its waste disposal methods to reduce environmental impact.",
      translation: "Công ty cải thiện phương pháp xử lý chất thải để giảm tác động môi trường.",
      context: "Corporate responsibility"
    }
  ],
  "disperse": [
    {
      sentence: "The protesters began to disperse when police arrived at the scene.",
      translation: "Những người biểu tình bắt đầu giải tán khi cảnh sát đến hiện trường.",
      context: "Social events"
    },
    {
      sentence: "Seeds are dispersed by wind and animals to new locations.",
      translation: "Hạt giống được phân tán bởi gió và động vật đến những nơi mới.",
      context: "Biology"
    }
  ],
  "achieve": [
    {
      sentence: "She worked hard to achieve her goal of becoming a doctor.",
      translation: "Cô ấy làm việc chăm chỉ để đạt được mục tiêu trở thành bác sĩ.",
      context: "Personal goals"
    },
    {
      sentence: "The company achieved record profits this quarter.",
      translation: "Công ty đã đạt được lợi nhuận kỷ lục trong quý này.",
      context: "Business"
    }
  ],
  "analysis": [
    {
      sentence: "The data analysis revealed interesting patterns in consumer behavior.",
      translation: "Phân tích dữ liệu tiết lộ những mô hình thú vị trong hành vi người tiêu dùng.",
      context: "Research"
    },
    {
      sentence: "A thorough analysis of the situation is needed before making decisions.",
      translation: "Cần phân tích kỹ lưỡng tình hình trước khi đưa ra quyết định.",
      context: "Decision making"
    }
  ],
  "approach": [
    {
      sentence: "We need a new approach to solve this complex problem.",
      translation: "Chúng ta cần một cách tiếp cận mới để giải quyết vấn đề phức tạp này.",
      context: "Problem solving"
    },
    {
      sentence: "The teacher's innovative approach made learning more engaging.",
      translation: "Cách tiếp cận sáng tạo của giáo viên làm cho việc học trở nên hấp dẫn hơn.",
      context: "Education"
    }
  ],
  "appropriate": [
    {
      sentence: "Please dress appropriately for the formal business meeting.",
      translation: "Vui lòng ăn mặc phù hợp cho cuộc họp kinh doanh trang trọng.",
      context: "Professional"
    },
    {
      sentence: "The teacher chose age-appropriate materials for the children.",
      translation: "Giáo viên chọn tài liệu phù hợp với lứa tuổi cho trẻ em.",
      context: "Education"
    }
  ],
  "evidence": [
    {
      sentence: "The detective gathered evidence to solve the mysterious case.",
      translation: "Thám tử thu thập bằng chứng để giải quyết vụ án bí ẩn.",
      context: "Investigation"
    },
    {
      sentence: "There is clear evidence that exercise improves mental health.",
      translation: "Có bằng chứng rõ ràng rằng tập thể dục cải thiện sức khỏe tinh thần.",
      context: "Health research"
    }
  ],
  "significant": [
    {
      sentence: "The discovery represents a significant breakthrough in medical research.",
      translation: "Khám phá này đại diện cho một bước đột phá quan trọng trong nghiên cứu y học.",
      context: "Scientific research"
    },
    {
      sentence: "There has been a significant increase in online shopping this year.",
      translation: "Đã có sự gia tăng đáng kể trong mua sắm trực tuyến năm nay.",
      context: "Market trends"
    }
  ],
  "develop": [
    {
      sentence: "The company plans to develop new software solutions for businesses.",
      translation: "Công ty dự định phát triển các giải pháp phần mềm mới cho doanh nghiệp.",
      context: "Technology"
    },
    {
      sentence: "Children develop language skills at different rates.",
      translation: "Trẻ em phát triển kỹ năng ngôn ngữ với tốc độ khác nhau.",
      context: "Child development"
    }
  ],
  "environment": [
    {
      sentence: "We must protect the environment for future generations.",
      translation: "Chúng ta phải bảo vệ môi trường cho các thế hệ tương lai.",
      context: "Environmental protection"
    },
    {
      sentence: "The work environment greatly affects employee productivity.",
      translation: "Môi trường làm việc ảnh hưởng rất lớn đến năng suất của nhân viên.",
      context: "Workplace"
    }
  ]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, words } = body

    if (action === 'add-sample-examples') {
      // Add sample examples to words that match our database
      const results = []
      
      for (const [english, examples] of Object.entries(SAMPLE_EXAMPLES)) {
        try {
          // Find the flashcard by english word
          const response = await fetch(`${request.nextUrl.origin}/api/flashcards`)
          const flashcards = await response.json()
          
          const flashcard = flashcards.find((f: { english: string; id: string }) => 
            f.english.toLowerCase() === english.toLowerCase()
          )
          
          if (flashcard) {
            // Update with examples
            const updateResponse = await fetch(`${request.nextUrl.origin}/api/flashcards/${flashcard.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                examples: JSON.stringify(examples)
              })
            })
            
            if (updateResponse.ok) {
              results.push({
                word: english,
                status: 'updated',
                exampleCount: examples.length
              })
            } else {
              results.push({
                word: english,
                status: 'failed',
                error: 'Update failed'
              })
            }
          } else {
            results.push({
              word: english,
              status: 'not_found'
            })
          }
        } catch (error) {
          results.push({
            word: english,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
      
      return NextResponse.json({
        success: true,
        message: `Processed ${results.length} words`,
        results
      })
    }

    if (action === 'custom-update' && words) {
      // Custom update for specific words
      const results = []
      
      for (const wordData of words) {
        try {
          const { english, examples } = wordData
          
          // Find and update flashcard
          const response = await fetch(`${request.nextUrl.origin}/api/flashcards`)
          const flashcards = await response.json()
          
          const flashcard = flashcards.find((f: { english: string; id: string }) => 
            f.english.toLowerCase() === english.toLowerCase()
          )
          
          if (flashcard) {
            const updateResponse = await fetch(`${request.nextUrl.origin}/api/flashcards/${flashcard.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                examples: JSON.stringify(examples)
              })
            })
            
            if (updateResponse.ok) {
              results.push({
                word: english,
                status: 'updated',
                exampleCount: examples.length
              })
            }
          }
        } catch (error) {
          results.push({
            word: wordData.english,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }
      
      return NextResponse.json({
        success: true,
        results
      })
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "add-sample-examples" or "custom-update"' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Bulk update examples error:', error)
    return NextResponse.json(
      { error: 'Failed to update examples' },
      { status: 500 }
    )
  }
}

export async function GET(_request: NextRequest) {
  try {
    // Return available sample examples
    const availableWords = Object.keys(SAMPLE_EXAMPLES)
    
    return NextResponse.json({
      message: 'Available sample examples',
      words: availableWords,
      totalWords: availableWords.length,
      sampleData: SAMPLE_EXAMPLES
    })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to get sample examples' },
      { status: 500 }
    )
  }
}