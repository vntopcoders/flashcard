import { NextRequest, NextResponse } from 'next/server'
import { flashcardDb } from '@/lib/supabase'

interface Params {
  id: string
}

export async function GET(
  _request: NextRequest,
  props: { params: Promise<Params> }
) {
  try {
    const params = await props.params
    const flashcard = await flashcardDb.getById(params.id)

    if (!flashcard) {
      return NextResponse.json(
        { error: 'Flashcard not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(flashcard)
  } catch (error) {
    console.error('Failed to fetch flashcard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flashcard' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<Params> }
) {
  try {
    const params = await props.params
    const body = await request.json()
    const { english, vietnamese, ipa, category, difficulty, lesson_id, examples, collocations, synonyms, antonyms, etymology, memory_tips } = body

    const updates: Record<string, unknown> = {}
    
    if (english !== undefined) updates.english = english
    if (vietnamese !== undefined) updates.vietnamese = vietnamese
    if (ipa !== undefined) updates.ipa = ipa
    if (category !== undefined) updates.category = category
    if (difficulty !== undefined) updates.difficulty = difficulty
    if (lesson_id !== undefined) updates.lesson_id = lesson_id || null
    if (examples !== undefined) updates.examples = examples
    if (collocations !== undefined) updates.collocations = collocations
    if (synonyms !== undefined) updates.synonyms = synonyms
    if (antonyms !== undefined) updates.antonyms = antonyms
    if (etymology !== undefined) updates.etymology = etymology
    if (memory_tips !== undefined) updates.memory_tips = memory_tips

    const flashcard = await flashcardDb.update(params.id, updates)
    return NextResponse.json(flashcard)
  } catch (error) {
    console.error('Failed to update flashcard:', error)
    return NextResponse.json(
      { error: 'Failed to update flashcard' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  props: { params: Promise<Params> }
) {
  try {
    const params = await props.params
    await flashcardDb.delete(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete flashcard:', error)
    return NextResponse.json(
      { error: 'Failed to delete flashcard' },
      { status: 500 }
    )
  }
}
