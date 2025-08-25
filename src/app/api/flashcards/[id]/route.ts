import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const flashcard = await prisma.flashcard.findUnique({
      where: { id }
    })

    if (!flashcard) {
      return NextResponse.json(
        { error: 'Flashcard not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(flashcard)
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch flashcard' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { english, vietnamese, category, difficulty } = body

    const flashcard = await prisma.flashcard.update({
      where: { id },
      data: {
        english,
        vietnamese,
        category,
        difficulty
      }
    })

    return NextResponse.json(flashcard)
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to update flashcard' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.flashcard.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to delete flashcard' },
      { status: 500 }
    )
  }
}
