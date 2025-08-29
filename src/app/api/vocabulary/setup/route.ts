import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const SETUP_QUERIES = [
  // Create vocabulary categories table
  `CREATE TABLE IF NOT EXISTS vocabulary_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color_code TEXT DEFAULT '#3B82F6',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`,
  
  // Create vocabulary words table
  `CREATE TABLE IF NOT EXISTS vocabulary_words (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    word TEXT NOT NULL,
    pronunciation TEXT,
    audio_url TEXT,
    difficulty_level INTEGER DEFAULT 1,
    frequency_rank INTEGER,
    category_id UUID REFERENCES vocabulary_categories(id),
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(word)
  );`,
  
  // Create word definitions table
  `CREATE TABLE IF NOT EXISTS word_definitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
    part_of_speech TEXT NOT NULL,
    definition_english TEXT NOT NULL,
    definition_vietnamese TEXT NOT NULL,
    example_sentence TEXT,
    example_vietnamese TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`,
  
  // Create word synonyms table
  `CREATE TABLE IF NOT EXISTS word_synonyms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
    synonym TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`,
  
  // Create word collocations table
  `CREATE TABLE IF NOT EXISTS word_collocations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
    collocation TEXT NOT NULL,
    example TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`,
  
  // Create user vocabulary progress table
  `CREATE TABLE IF NOT EXISTS user_vocabulary_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'new',
    confidence_level INTEGER DEFAULT 0,
    times_reviewed INTEGER DEFAULT 0,
    last_reviewed_at TIMESTAMPTZ,
    mastered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, word_id)
  );`,
]

const INDEX_QUERIES = [
  `CREATE INDEX IF NOT EXISTS vocabulary_words_word_idx ON vocabulary_words(word);`,
  `CREATE INDEX IF NOT EXISTS vocabulary_words_difficulty_idx ON vocabulary_words(difficulty_level);`,
  `CREATE INDEX IF NOT EXISTS vocabulary_words_frequency_idx ON vocabulary_words(frequency_rank);`,
  `CREATE INDEX IF NOT EXISTS vocabulary_words_category_idx ON vocabulary_words(category_id);`,
  `CREATE INDEX IF NOT EXISTS word_definitions_word_idx ON word_definitions(word_id);`,
  `CREATE INDEX IF NOT EXISTS word_synonyms_word_idx ON word_synonyms(word_id);`,
  `CREATE INDEX IF NOT EXISTS word_collocations_word_idx ON word_collocations(word_id);`,
  `CREATE INDEX IF NOT EXISTS user_vocabulary_progress_user_idx ON user_vocabulary_progress(user_id);`,
  `CREATE INDEX IF NOT EXISTS user_vocabulary_progress_word_idx ON user_vocabulary_progress(word_id);`,
  `CREATE INDEX IF NOT EXISTS user_vocabulary_progress_status_idx ON user_vocabulary_progress(status);`,
]

const CATEGORY_DATA = [
  { name: 'Academic', description: 'Academic Word List and scholarly vocabulary', color_code: '#8B5CF6', order_index: 1 },
  { name: 'General', description: 'General IELTS vocabulary for all topics', color_code: '#3B82F6', order_index: 2 },
  { name: 'Environment', description: 'Environmental issues and climate change', color_code: '#10B981', order_index: 3 },
  { name: 'Technology', description: 'Technology and digital world', color_code: '#6366F1', order_index: 4 },
  { name: 'Education', description: 'Education system and learning', color_code: '#F59E0B', order_index: 5 },
  { name: 'Health', description: 'Health, medicine, and lifestyle', color_code: '#EF4444', order_index: 6 },
  { name: 'Business', description: 'Business, economics, and work', color_code: '#84CC16', order_index: 7 },
  { name: 'Society', description: 'Social issues and cultural topics', color_code: '#EC4899', order_index: 8 },
  { name: 'Science', description: 'Scientific research and discoveries', color_code: '#06B6D4', order_index: 9 },
  { name: 'Art & Culture', description: 'Arts, literature, and cultural heritage', color_code: '#F97316', order_index: 10 }
]

export async function POST(request: Request) {
  try {
    console.log('Starting vocabulary database setup...')
    
    return NextResponse.json({
      success: false,
      message: 'Please run the SQL setup manually in Supabase SQL Editor',
      instructions: [
        '1. Go to your Supabase project dashboard',
        '2. Open the SQL Editor',
        '3. Copy and paste the contents of /Users/quangduy/projects/trainning/flashcard/supabase-vocabulary-setup.sql',
        '4. Run the SQL script',
        '5. Then use the vocabulary import API at /api/vocabulary/import'
      ],
      sqlFile: '/Users/quangduy/projects/trainning/flashcard/supabase-vocabulary-setup.sql'
    })
    
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ 
      error: 'Failed to setup vocabulary database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}