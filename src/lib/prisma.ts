import { PrismaClient } from '@prisma/client'
import { memoryDb } from './memory-db'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Fallback database interface
export const db = {
    flashcard: {
        findMany: async (options?: { orderBy?: { createdAt: 'desc' | 'asc' } }) => {
            try {
                await prisma.$connect()
                return await prisma.flashcard.findMany(options)
            } catch (error) {
                console.log('Falling back to memory DB:', error)
                return await memoryDb.flashcard.findMany(options)
            }
        },

        findUnique: async (options: { where: { id: string } }) => {
            try {
                await prisma.$connect()
                return await prisma.flashcard.findUnique(options)
            } catch (error) {
                console.log('Falling back to memory DB:', error)
                return await memoryDb.flashcard.findUnique(options)
            }
        },

        create: async (options: { 
            data: { 
                english: string; 
                vietnamese: string; 
                ipa?: string; 
                difficulty: number; 
                category: string; 
                lesson_id?: string 
            } 
        }) => {
            try {
                await prisma.$connect()
                return await prisma.flashcard.create(options)
            } catch (error) {
                console.log('Falling back to memory DB:', error)
                return await memoryDb.flashcard.create(options)
            }
        },

        update: async (options: { 
            where: { id: string }; 
            data: { 
                english?: string; 
                vietnamese?: string; 
                ipa?: string; 
                difficulty?: number; 
                category?: string; 
                lesson_id?: string 
            } 
        }) => {
            try {
                await prisma.$connect()
                return await prisma.flashcard.update(options)
            } catch (error) {
                console.log('Falling back to memory DB:', error)
                return await memoryDb.flashcard.update(options)
            }
        },

        delete: async (options: { where: { id: string } }) => {
            try {
                await prisma.$connect()
                return await prisma.flashcard.delete(options)
            } catch (error) {
                console.log('Falling back to memory DB:', error)
                return await memoryDb.flashcard.delete(options)
            }
        },

        count: async () => {
            try {
                await prisma.$connect()
                return await prisma.flashcard.count()
            } catch (error) {
                console.log('Falling back to memory DB:', error)
                return await memoryDb.flashcard.count()
            }
        }
    }
}

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
        console.log('Database initialization using fallback memory DB:', error)
        // Memory DB already has sample data
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
