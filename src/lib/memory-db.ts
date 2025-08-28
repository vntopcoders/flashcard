// Simple in-memory storage for production
export interface Flashcard {
    id: string
    english: string
    vietnamese: string
    difficulty: number
    category: string
    createdAt: string
    updatedAt: string
}

// In-memory storage
const flashcards: Flashcard[] = [
    {
        id: '1',
        english: 'Hello',
        vietnamese: 'Xin chào',
        category: 'basic',
        difficulty: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '2',
        english: 'Thank you',
        vietnamese: 'Cảm ơn',
        category: 'basic',
        difficulty: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '3',
        english: 'Good morning',
        vietnamese: 'Chào buổi sáng',
        category: 'greetings',
        difficulty: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '4',
        english: 'Beautiful',
        vietnamese: 'Đẹp',
        category: 'adjectives',
        difficulty: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '5',
        english: 'Opportunity',
        vietnamese: 'Cơ hội',
        category: 'business',
        difficulty: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
]

export const memoryDb = {
    flashcard: {
        findMany: (options?: { orderBy?: { createdAt: 'desc' | 'asc' } }) => {
            const result = [...flashcards]
            if (options?.orderBy?.createdAt === 'desc') {
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            }
            return Promise.resolve(result)
        },

        findUnique: (options: { where: { id: string } }) => {
            const card = flashcards.find(f => f.id === options.where.id)
            return Promise.resolve(card || null)
        },

        create: (options: { data: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'> }) => {
            const newCard: Flashcard = {
                id: Date.now().toString(),
                ...options.data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            flashcards.unshift(newCard)
            return Promise.resolve(newCard)
        },

        update: (options: {
            where: { id: string },
            data: Partial<Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>>
        }) => {
            const index = flashcards.findIndex(f => f.id === options.where.id)
            if (index === -1) throw new Error('Flashcard not found')

            flashcards[index] = {
                ...flashcards[index],
                ...options.data,
                updatedAt: new Date().toISOString()
            }
            return Promise.resolve(flashcards[index])
        },

        delete: (options: { where: { id: string } }) => {
            const index = flashcards.findIndex(f => f.id === options.where.id)
            if (index === -1) throw new Error('Flashcard not found')

            const deleted = flashcards[index]
            flashcards.splice(index, 1)
            return Promise.resolve(deleted)
        },

        count: () => {
            return Promise.resolve(flashcards.length)
        }
    }
}
