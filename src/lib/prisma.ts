import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Initialize database with basic setup
export async function initializeDatabase() {
  try {
    // This will create tables if they don't exist (for SQLite)
    await prisma.$connect()
    
    // Check if we have any flashcards, if not add some sample data
    const count = await prisma.flashcard.count()
    if (count === 0) {
      await seedDatabase()
    }
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

async function seedDatabase() {
  const sampleCards = [
    {
      english: 'Hello',
      vietnamese: 'Xin chào',
      category: 'basic',
      difficulty: 1
    },
    {
      english: 'Thank you',
      vietnamese: 'Cảm ơn',
      category: 'basic',
      difficulty: 1
    },
    {
      english: 'Good morning',
      vietnamese: 'Chào buổi sáng',
      category: 'greetings',
      difficulty: 1
    }
  ]

  for (const card of sampleCards) {
    await prisma.flashcard.create({
      data: card
    })
  }
}
