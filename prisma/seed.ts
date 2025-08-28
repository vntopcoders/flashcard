import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Sample flashcards data
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
    },
    {
      english: 'Beautiful',
      vietnamese: 'Đẹp',
      category: 'adjectives',
      difficulty: 2
    },
    {
      english: 'Opportunity',
      vietnamese: 'Cơ hội',
      category: 'business',
      difficulty: 3
    },
    {
      english: 'Environment',
      vietnamese: 'Môi trường',
      category: 'general',
      difficulty: 3
    },
    {
      english: 'Technology',
      vietnamese: 'Công nghệ',
      category: 'technology',
      difficulty: 2
    },
    {
      english: 'Restaurant',
      vietnamese: 'Nhà hàng',
      category: 'food',
      difficulty: 2
    }
  ]

  console.log('Seeding database...')

  for (const card of sampleCards) {
    await prisma.flashcard.create({
      data: card
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
