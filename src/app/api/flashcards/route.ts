import { NextRequest, NextResponse } from 'next/server'
import { prisma, initializeDatabase } from '@/lib/prisma'

export async function GET() {
  try {
    await initializeDatabase()
    const flashcards = await prisma.flashcard.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(flashcards)
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch flashcards' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase()
    const body = await request.json()
    const { english, vietnamese, category, difficulty } = body

    if (!english || !vietnamese) {
      return NextResponse.json(
        { error: 'English and Vietnamese translations are required' },
        { status: 400 }
      )
    }

    const flashcard = await prisma.flashcard.create({
      data: {
        english,
        vietnamese,
        category: category || 'general',
        difficulty: difficulty || 1
      }
    })

    return NextResponse.json(flashcard, { status: 201 })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to create flashcard' },
      { status: 500 }
    )
  }
}
