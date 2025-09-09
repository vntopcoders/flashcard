import { NextRequest, NextResponse } from 'next/server'

// Comprehensive example templates by category
const EXAMPLE_TEMPLATES = {
  Environment: [
    "Environmental {word} is crucial for sustainable development and protecting our planet.",
    "The {word} affects climate change and requires immediate global attention.",
    "Scientists study {word} to understand its impact on ecosystems worldwide."
  ],
  Science: [
    "Research shows that {word} plays a fundamental role in scientific advancement.",
    "The {word} demonstrates important principles in modern scientific theory.", 
    "Scientists use {word} to explain complex phenomena in nature."
  ],
  Social: [
    "Social {word} influences how communities interact and develop over time.",
    "Understanding {word} helps us address important societal challenges today.",
    "The concept of {word} is essential for building stronger communities."
  ],
  Business: [
    "Business {word} is essential for companies to succeed in competitive markets.",
    "The {word} strategy helped the company achieve significant growth this year.",
    "Understanding {word} principles is crucial for effective business management."
  ],
  Technology: [
    "Modern technology utilizes {word} to create innovative solutions for users.",
    "The {word} represents a breakthrough in technological advancement and efficiency.",
    "Digital {word} transforms how we work and communicate in today's world."
  ],
  Education: [
    "Educational {word} enhances student learning and academic achievement significantly.",
    "Teachers use {word} methods to engage students in meaningful learning experiences.",
    "The {word} approach proves effective in developing critical thinking skills."
  ],
  Health: [
    "Medical professionals recognize {word} as important for patient care and treatment.",
    "Research indicates that {word} contributes to overall health and well-being.",
    "Healthcare systems implement {word} protocols to improve patient outcomes."
  ],
  General: [
    "The concept of {word} is widely recognized and applied in various fields.",
    "Understanding {word} helps people make better decisions in daily life.",
    "The importance of {word} cannot be underestimated in modern society."
  ]
}

// Vietnamese translation patterns
const VIETNAMESE_PATTERNS = {
  Environment: "môi trường",
  Science: "khoa học", 
  Social: "xã hội",
  Business: "kinh doanh",
  Technology: "công nghệ",
  Education: "giáo dục",
  Health: "sức khỏe",
  General: "tổng quát"
}

interface ExampleSentence {
  sentence: string
  translation: string
  context: string
}

function generateExamplesForWord(english: string, vietnamese: string, category: string): ExampleSentence[] {
  const templates = EXAMPLE_TEMPLATES[category as keyof typeof EXAMPLE_TEMPLATES] || EXAMPLE_TEMPLATES.General
  const contextVN = VIETNAMESE_PATTERNS[category as keyof typeof VIETNAMESE_PATTERNS] || "tổng quát"
  
  const examples = []
  
  // Generate 2 examples per word
  for (let i = 0; i < 2 && i < templates.length; i++) {
    const template = templates[i]
    const sentence = template.replace(/\{word\}/g, english)
    
    // Create contextual Vietnamese translation
    const translation = `${sentence.replace(english, vietnamese)} - Ví dụ về từ "${english}" trong lĩnh vực ${contextVN}.`
    
    examples.push({
      sentence: sentence,
      translation: translation,
      context: category
    })
  }
  
  return examples
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      batchSize = 100, 
      startIndex = 0, 
      forceUpdate = false,
      categories = []
    } = body

    console.log(`🚀 Starting batch generation: ${startIndex} to ${startIndex + batchSize}`)

    // Get all flashcards
    const response = await fetch(`${request.nextUrl.origin}/api/flashcards`)
    const flashcards = await response.json()
    
    if (!Array.isArray(flashcards)) {
      return NextResponse.json({ error: 'Failed to fetch flashcards' }, { status: 500 })
    }

    // Filter by categories if specified
    let targetFlashcards = flashcards
    if (categories.length > 0) {
      targetFlashcards = flashcards.filter((f: { category: string }) => 
        categories.includes(f.category)
      )
    }

    // Get batch to process
    const endIndex = Math.min(startIndex + batchSize, targetFlashcards.length)
    const batchFlashcards = targetFlashcards.slice(startIndex, endIndex)
    
    const results = []
    let processed = 0
    let updated = 0
    let skipped = 0
    let failed = 0

    console.log(`📊 Processing ${batchFlashcards.length} words...`)

    for (const flashcard of batchFlashcards) {
      try {
        processed++
        
        // Skip if already has examples (unless force update)
        if (!forceUpdate && flashcard.examples && flashcard.examples !== 'null' && flashcard.examples !== null) {
          skipped++
          results.push({
            word: flashcard.english,
            status: 'skipped',
            reason: 'Already has examples'
          })
          continue
        }

        // Generate examples
        const examples = generateExamplesForWord(
          flashcard.english,
          flashcard.vietnamese,
          flashcard.category
        )

        // Update in Supabase
        const updateResponse = await fetch(`${request.nextUrl.origin}/api/flashcards/${flashcard.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            examples: JSON.stringify(examples)
          })
        })

        if (updateResponse.ok) {
          updated++
          results.push({
            word: flashcard.english,
            status: 'updated',
            exampleCount: examples.length,
            category: flashcard.category
          })
          console.log(`✅ Updated: ${flashcard.english}`)
        } else {
          failed++
          results.push({
            word: flashcard.english,
            status: 'failed',
            error: 'Update failed'
          })
        }

        // Small delay to avoid overwhelming server
        if (processed % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 200))
          console.log(`📈 Progress: ${processed}/${batchFlashcards.length} (${Math.round(processed/batchFlashcards.length*100)}%)`)
        }

      } catch (error) {
        failed++
        results.push({
          word: flashcard.english,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        console.error(`❌ Error processing ${flashcard.english}:`, error)
      }
    }

    const summary = {
      totalWords: targetFlashcards.length,
      batchSize: batchFlashcards.length,
      processed,
      updated,
      skipped,
      failed,
      hasMore: endIndex < targetFlashcards.length,
      nextStartIndex: endIndex,
      progress: `${endIndex}/${targetFlashcards.length} (${Math.round(endIndex/targetFlashcards.length*100)}%)`
    }

    console.log(`🎉 Batch complete: ${updated} updated, ${skipped} skipped, ${failed} failed`)

    return NextResponse.json({
      success: true,
      summary,
      results: results.slice(0, 20), // Return first 20 for display
      message: `Batch ${startIndex}-${endIndex}: ${updated} updated, ${skipped} skipped, ${failed} failed`
    })

  } catch (error) {
    console.error('Auto-generate examples error:', error)
    return NextResponse.json({
      error: 'Failed to auto-generate examples',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current statistics
    const response = await fetch(`${request.nextUrl.origin}/api/flashcards`)
    const flashcards = await response.json()
    
    if (!Array.isArray(flashcards)) {
      return NextResponse.json({ error: 'Failed to fetch flashcards' }, { status: 500 })
    }

    const withExamples = flashcards.filter(f => f.examples && f.examples !== 'null' && f.examples !== null)
    const withoutExamples = flashcards.filter(f => !f.examples || f.examples === 'null' || f.examples === null)

    // Group by category
    const categories: { [key: string]: { total: number, withExamples: number } } = {}
    
    flashcards.forEach((f: { category: string, examples: string | null }) => {
      const cat = f.category
      if (!categories[cat]) {
        categories[cat] = { total: 0, withExamples: 0 }
      }
      categories[cat].total++
      if (f.examples && f.examples !== 'null' && f.examples !== null) {
        categories[cat].withExamples++
      }
    })

    const stats = {
      totalWords: flashcards.length,
      withExamples: withExamples.length,
      withoutExamples: withoutExamples.length,
      completionPercentage: Math.round((withExamples.length / flashcards.length) * 100),
      categories,
      availableCategories: Object.keys(categories),
      recommendedBatchSize: 100
    }

    return NextResponse.json({
      success: true,
      statistics: stats,
      readyToProcess: withoutExamples.length > 0,
      estimatedTime: `${Math.ceil(withoutExamples.length / 100)} batches needed`
    })

  } catch (error) {
    console.error('Get statistics error:', error)
    return NextResponse.json({
      error: 'Failed to get statistics'
    }, { status: 500 })
  }
}