import { Handler } from '@netlify/functions'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const handler: Handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    }

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' }
    }

    try {
        const { httpMethod, path, body } = event

        // GET /api/flashcards
        if (httpMethod === 'GET' && path === '/api/flashcards') {
            const flashcards = await prisma.flashcard.findMany({
                orderBy: { createdAt: 'desc' }
            })
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(flashcards)
            }
        }

        // POST /api/flashcards
        if (httpMethod === 'POST' && path === '/api/flashcards') {
            const data = JSON.parse(body || '{}')
            const { english, vietnamese, category, difficulty } = data

            if (!english || !vietnamese) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'English and Vietnamese translations are required' })
                }
            }

            const flashcard = await prisma.flashcard.create({
                data: {
                    english,
                    vietnamese,
                    category: category || 'general',
                    difficulty: difficulty || 1
                }
            })

            return {
                statusCode: 201,
                headers,
                body: JSON.stringify(flashcard)
            }
        }

        // Handle individual flashcard operations
        const idMatch = path.match(/\/api\/flashcards\/(.+)/)
        if (idMatch) {
            const id = idMatch[1]

            // GET /api/flashcards/[id]
            if (httpMethod === 'GET') {
                const flashcard = await prisma.flashcard.findUnique({
                    where: { id }
                })

                if (!flashcard) {
                    return {
                        statusCode: 404,
                        headers,
                        body: JSON.stringify({ error: 'Flashcard not found' })
                    }
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(flashcard)
                }
            }

            // PUT /api/flashcards/[id]
            if (httpMethod === 'PUT') {
                const data = JSON.parse(body || '{}')
                const { english, vietnamese, category, difficulty } = data

                const flashcard = await prisma.flashcard.update({
                    where: { id },
                    data: { english, vietnamese, category, difficulty }
                })

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(flashcard)
                }
            }

            // DELETE /api/flashcards/[id]
            if (httpMethod === 'DELETE') {
                await prisma.flashcard.delete({
                    where: { id }
                })

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true })
                }
            }
        }

        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Not found' })
        }

    } catch (error) {
        console.error('Error:', error)
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        }
    } finally {
        await prisma.$disconnect()
    }
}
