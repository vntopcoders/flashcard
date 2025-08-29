import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import fs from 'fs/promises'
import path from 'path'

interface VocabularyWord {
  word: string
  difficulty_level: number
  frequency_rank: number
  category: string
  source: string
  definitions: Array<{
    part_of_speech: string
    definition_english: string
    definition_vietnamese: string
  }>
}

export async function POST(request: Request) {
  try {
    const { filePath = 'ielts_vocabulary_complete.json', batchSize = 50 } = await request.json()
    
    // Read vocabulary from JSON file
    const jsonPath = path.join(process.cwd(), filePath)
    const fileContent = await fs.readFile(jsonPath, 'utf-8')
    const vocabularyData: VocabularyWord[] = JSON.parse(fileContent)
    
    console.log(`Found ${vocabularyData.length} words in ${filePath}`)
    
    // Get category mapping
    const { data: categories } = await supabase
      .from('vocabulary_categories')
      .select('id, name')
    
    const categoryMap: Record<string, string> = {}
    categories?.forEach(cat => {
      categoryMap[cat.name] = cat.id
    })
    
    let totalInserted = 0
    let totalSkipped = 0
    const errors: string[] = []
    
    // Process in batches
    for (let i = 0; i < vocabularyData.length; i += batchSize) {
      const batch = vocabularyData.slice(i, i + batchSize)
      
      for (const wordData of batch) {
        try {
          // Check if word already exists
          const { data: existingWord } = await supabase
            .from('vocabulary_words')
            .select('id')
            .eq('word', wordData.word.toLowerCase())
            .single()
          
          if (existingWord) {
            totalSkipped++
            continue
          }
          
          // Insert new word
          const { data: newWord, error: wordError } = await supabase
            .from('vocabulary_words')
            .insert({
              word: wordData.word.toLowerCase(),
              difficulty_level: wordData.difficulty_level,
              frequency_rank: wordData.frequency_rank,
              category_id: categoryMap[wordData.category] || null,
              source_url: wordData.source
            })
            .select('id')
            .single()
          
          if (wordError) {
            errors.push(`Error inserting word "${wordData.word}": ${wordError.message}`)
            continue
          }
          
          // Insert definitions
          if (wordData.definitions && wordData.definitions.length > 0) {
            for (let defIndex = 0; defIndex < wordData.definitions.length; defIndex++) {
              const def = wordData.definitions[defIndex]
              await supabase
                .from('word_definitions')
                .insert({
                  word_id: newWord.id,
                  part_of_speech: def.part_of_speech || 'unknown',
                  definition_english: def.definition_english,
                  definition_vietnamese: def.definition_vietnamese,
                  order_index: defIndex + 1
                })
            }
          }
          
          totalInserted++
          
          // Log progress every 100 words
          if (totalInserted % 100 === 0) {
            console.log(`Progress: ${totalInserted} words inserted, ${totalSkipped} skipped`)
          }
          
        } catch (error) {
          errors.push(`Error processing word "${wordData.word}": ${error}`)
        }
      }
      
      // Small delay between batches to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    return NextResponse.json({
      success: true,
      message: 'Bulk vocabulary import completed',
      totalWords: vocabularyData.length,
      totalInserted,
      totalSkipped,
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined // Show first 10 errors only
    })
    
  } catch (error) {
    console.error('Bulk import error:', error)
    return NextResponse.json({
      error: 'Failed to bulk import vocabulary',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}