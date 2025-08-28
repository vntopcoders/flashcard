import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Count lessons
    const { count: lessonCount, error: lessonError } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true });

    if (lessonError) {
      console.error('Error counting lessons:', lessonError);
      return NextResponse.json({ error: 'Failed to count lessons' }, { status: 500 });
    }

    // Count flashcards
    const { count: flashcardCount, error: flashcardError } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true });

    if (flashcardError) {
      console.error('Error counting flashcards:', flashcardError);
      return NextResponse.json({ error: 'Failed to count flashcards' }, { status: 500 });
    }

    // Get flashcards by lesson
    const { data: flashcardsByLesson, error: flashcardsByLessonError } = await supabase
      .from('flashcards')
      .select(`
        lesson_id,
        lessons(name)
      `);

    if (flashcardsByLessonError) {
      console.error('Error getting flashcards by lesson:', flashcardsByLessonError);
      return NextResponse.json({ error: 'Failed to get flashcards by lesson' }, { status: 500 });
    }

    // Count flashcards per lesson
    const flashcardsPerLesson: Record<string, number> = {};
    flashcardsByLesson?.forEach((item) => {
      const lessonName = (item.lessons as { name?: string })?.name || 'Unknown';
      flashcardsPerLesson[lessonName] = (flashcardsPerLesson[lessonName] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalLessons: lessonCount,
        totalFlashcards: flashcardCount,
        flashcardsPerLesson
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
