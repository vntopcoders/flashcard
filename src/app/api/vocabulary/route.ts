import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')

    let query = supabase
      .from('vocabulary_words')
      .select(`
        id,
        word,
        pronunciation,
        difficulty_level,
        frequency_rank,
        vocabulary_categories!inner(name, color_code),
        word_definitions(
          part_of_speech,
          definition_english,
          definition_vietnamese,
          example_sentence,
          example_vietnamese,
          order_index
        ),
        word_synonyms(synonym),
        word_collocations(collocation, example)
      `)
      .order('frequency_rank', { ascending: true })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('vocabulary_categories.name', category)
    }

    if (difficulty) {
      query = query.eq('difficulty_level', parseInt(difficulty))
    }

    if (search) {
      query = query.ilike('word', `%${search}%`)
    }

    const { data: words, error } = await query

    if (error) {
      console.error('Vocabulary fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch vocabulary' }, { status: 500 })
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('vocabulary_words')
      .select('id', { count: 'exact', head: true })

    if (category && category !== 'all') {
      countQuery = countQuery
        .select('id, vocabulary_categories!inner(name)', { count: 'exact', head: true })
        .eq('vocabulary_categories.name', category)
    }

    if (difficulty) {
      countQuery = countQuery.eq('difficulty_level', parseInt(difficulty))
    }

    if (search) {
      countQuery = countQuery.ilike('word', `%${search}%`)
    }

    const { count } = await countQuery

    // Get categories for filter options
    const { data: categories } = await supabase
      .from('vocabulary_categories')
      .select('name, color_code')
      .order('order_index')

    return NextResponse.json({
      success: true,
      data: {
        words: words || [],
        total: count || 0,
        categories: categories || [],
        pagination: {
          limit,
          offset,
          hasMore: (count || 0) > offset + limit
        }
      }
    })

  } catch (error) {
    console.error('Vocabulary API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Add vocabulary statistics endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'stats') {
      // Get vocabulary statistics
      const [
        { data: totalWords },
        { data: byCategory },
        { data: byDifficulty }
      ] = await Promise.all([
        supabase
          .from('vocabulary_words')
          .select('id', { count: 'exact', head: true }),
        
        supabase
          .from('vocabulary_words')
          .select('vocabulary_categories(name), count:id.count()')
          .group('vocabulary_categories.name'),

        supabase
          .from('vocabulary_words')
          .select('difficulty_level, count:id.count()')
          .group('difficulty_level')
      ])

      return NextResponse.json({
        success: true,
        data: {
          totalWords: totalWords?.length || 0,
          byCategory: byCategory || [],
          byDifficulty: byDifficulty || []
        }
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Vocabulary stats error:', error)
    return NextResponse.json({ error: 'Failed to get statistics' }, { status: 500 })
  }
}