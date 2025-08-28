'use client'

import { useState, useEffect } from 'react'
import { Plus, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react'
import FlashcardComponent from '@/components/FlashcardComponent'
import AddFlashcardForm from '@/components/AddFlashcardForm'
import { Flashcard } from '@/types/flashcard'

export default function Home() {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showAddForm, setShowAddForm] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Fetch flashcards from API
    useEffect(() => {
        fetchFlashcards()
    }, [])

    const fetchFlashcards = async () => {
        try {
            const response = await fetch('/api/flashcards')
            if (response.ok) {
                const data = await response.json()
                setFlashcards(data)
            }
        } catch (error) {
            console.error('Error fetching flashcards:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddFlashcard = async (newFlashcard: {
        english: string
        vietnamese: string
        category: string
        difficulty: number
    }) => {
        try {
            const response = await fetch('/api/flashcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newFlashcard),
            })

            if (response.ok) {
                const flashcard = await response.json()
                setFlashcards([flashcard, ...flashcards])
            }
        } catch (error) {
            console.error('Error adding flashcard:', error)
            throw error
        }
    }

    const nextCard = () => {
        if (flashcards.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % flashcards.length)
        }
    }

    const prevCard = () => {
        if (flashcards.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
        }
    }

    const resetProgress = () => {
        setCurrentIndex(0)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải flashcards...</p>
                </div>
            </div>
        )
    }

    if (flashcards.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mb-8">
                    <div className="text-6xl mb-4">📚</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Chưa có flashcard nào
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Hãy thêm từ vựng đầu tiên để bắt đầu học!
                    </p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm từ đầu tiên
                    </button>
                </div>

                {showAddForm && (
                    <AddFlashcardForm
                        onAdd={handleAddFlashcard}
                        onClose={() => setShowAddForm(false)}
                    />
                )}
            </div>
        )
    }

    const currentCard = flashcards[currentIndex]

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Học Tiếng Anh với Flashcards
                </h1>
                <p className="text-gray-600">
                    Thẻ {currentIndex + 1} / {flashcards.length}
                </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mb-8">
                <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Thêm từ mới
                </button>
                <button
                    onClick={resetProgress}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Bắt đầu lại
                </button>
            </div>

            {/* Flashcard */}
            <div className="mb-8">
                <FlashcardComponent flashcard={currentCard} />
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={prevCard}
                    disabled={flashcards.length <= 1}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Trước
                </button>
                <button
                    onClick={nextCard}
                    disabled={flashcards.length <= 1}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Tiếp
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Progress bar */}
            <div className="mt-8">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                            width: `${((currentIndex + 1) / flashcards.length) * 100}%`
                        }}
                    ></div>
                </div>
            </div>

            {/* Add form modal */}
            {showAddForm && (
                <AddFlashcardForm
                    onAdd={handleAddFlashcard}
                    onClose={() => setShowAddForm(false)}
                />
            )}
        </div>
    )
}
