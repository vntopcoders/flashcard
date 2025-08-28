import { NextResponse } from 'next/server';
import { lessonDb, flashcardDb } from '@/lib/supabase';

export async function GET() {
  try {
    // Lấy thống kê lessons
    const lessons = await lessonDb.getAll();
    const flashcards = await flashcardDb.getAll();
    
    // Thống kê theo lesson
    const lessonStats = lessons.map(lesson => {
      const lessonFlashcards = flashcards.filter(f => f.lesson_id === lesson.id);
      return {
        id: lesson.id,
        name: lesson.name,
        description: lesson.description,
        color: lesson.color,
        flashcard_count: lessonFlashcards.length,
        difficulty_level: lesson.name.includes('Level 1') ? 'beginner' : 
                         lesson.name.includes('Level 2') ? 'beginner' :
                         lesson.name.includes('Level 3') ? 'intermediate' :
                         lesson.name.includes('Level 4') ? 'advanced' :
                         lesson.name.includes('Level 5') ? 'expert' :
                         lesson.name.includes('AWL') ? 'advanced' :
                         lesson.name.includes('Band 5') ? 'beginner' :
                         lesson.name.includes('Band 6') ? 'intermediate' :
                         lesson.name.includes('Band 7') ? 'advanced' :
                         lesson.name.includes('Band 8') ? 'expert' : 'intermediate',
        category: lesson.name.includes('Business') ? 'business' :
                 lesson.name.includes('Technology') ? 'technology' :
                 lesson.name.includes('Medicine') ? 'medicine' :
                 lesson.name.includes('Education') ? 'education' :
                 lesson.name.includes('Environment') ? 'environment' :
                 lesson.name.includes('Health') ? 'health' :
                 lesson.name.includes('Academic') ? 'academic' : 'general'
      };
    });

    // Thống kê tổng quan
    const totalFlashcards = flashcards.length;
    const totalLessons = lessons.length;
    
    // Phân loại theo độ khó
    const difficultyStats = {
      beginner: lessonStats.filter(l => l.difficulty_level === 'beginner').reduce((sum, l) => sum + l.flashcard_count, 0),
      intermediate: lessonStats.filter(l => l.difficulty_level === 'intermediate').reduce((sum, l) => sum + l.flashcard_count, 0),
      advanced: lessonStats.filter(l => l.difficulty_level === 'advanced').reduce((sum, l) => sum + l.flashcard_count, 0),
      expert: lessonStats.filter(l => l.difficulty_level === 'expert').reduce((sum, l) => sum + l.flashcard_count, 0)
    };

    // Phân loại theo chủ đề
    const categoryStats: Record<string, number> = {};
    lessonStats.forEach(lesson => {
      const category = lesson.category || 'general';
      categoryStats[category] = (categoryStats[category] || 0) + lesson.flashcard_count;
    });

    // Lessons có nhiều từ nhất
    const topLessons = lessonStats
      .sort((a, b) => b.flashcard_count - a.flashcard_count)
      .slice(0, 10);

    // Progress tracking cho từng band IELTS
    const ieltsProgress = {
      'Band 5.0-6.0': difficultyStats.beginner + Math.floor(difficultyStats.intermediate * 0.4),
      'Band 6.5-7.0': Math.floor(difficultyStats.intermediate * 0.6) + Math.floor(difficultyStats.advanced * 0.5),
      'Band 7.5-8.0': Math.floor(difficultyStats.advanced * 0.5) + Math.floor(difficultyStats.expert * 0.6),
      'Band 8.5+': Math.floor(difficultyStats.expert * 0.4)
    };

    // Thống kê theo nguồn học liệu
    const sourceStats = {
      'IELTS Complete System': lessonStats.filter(l => l.name.includes('IELTS Level')).reduce((sum, l) => sum + l.flashcard_count, 0),
      'Academic Word List': lessonStats.filter(l => l.name.includes('AWL') || l.name.includes('Academic')).reduce((sum, l) => sum + l.flashcard_count, 0),
      'IELTS Liz Method': lessonStats.filter(l => l.name.includes('Education') || l.name.includes('Technology') || l.name.includes('Environment')).reduce((sum, l) => sum + l.flashcard_count, 0),
      'IELTS 4000 Words': lessonStats.filter(l => l.name.includes('Band') && l.name.includes('Essential')).reduce((sum, l) => sum + l.flashcard_count, 0),
      'Topic Vocabulary': lessonStats.filter(l => l.name.includes('Business') || l.name.includes('Technology') || l.name.includes('Medicine')).reduce((sum, l) => sum + l.flashcard_count, 0)
    };

    const stats = {
      overview: {
        total_flashcards: totalFlashcards,
        total_lessons: totalLessons,
        total_categories: Object.keys(categoryStats).length,
        average_cards_per_lesson: Math.round(totalFlashcards / totalLessons)
      },
      difficulty: difficultyStats,
      categories: categoryStats,
      ielts_progress: ieltsProgress,
      source_distribution: sourceStats,
      top_lessons: topLessons,
      lesson_details: lessonStats,
      recommendations: {
        next_study: topLessons.slice(0, 3).map(l => ({
          name: l.name,
          flashcard_count: l.flashcard_count,
          difficulty: l.difficulty_level,
          reason: l.flashcard_count > 50 ? 'High vocabulary density' : 'Quick review session'
        })),
        study_plan: [
          {
            week: '1-2',
            focus: 'Foundation Building',
            lessons: lessonStats.filter(l => l.difficulty_level === 'beginner').slice(0, 2),
            target_words: 100
          },
          {
            week: '3-4', 
            focus: 'Core Vocabulary',
            lessons: lessonStats.filter(l => l.difficulty_level === 'intermediate').slice(0, 2),
            target_words: 150
          },
          {
            week: '5-6',
            focus: 'Advanced Terms',
            lessons: lessonStats.filter(l => l.difficulty_level === 'advanced').slice(0, 2),
            target_words: 120
          }
        ]
      }
    };

    return NextResponse.json({
      success: true,
      data: stats,
      message: `Thống kê hoàn thành: ${totalFlashcards} từ vựng trong ${totalLessons} bài học`
    });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Không thể tải thống kê'
      },
      { status: 500 }
    );
  }
}
