-- Simple Enhanced Vocabulary Migration
-- Run this in Supabase SQL Editor to add enhanced learning features to flashcards table

-- Add enhanced learning columns to flashcards table
ALTER TABLE flashcards 
ADD COLUMN IF NOT EXISTS examples TEXT,
ADD COLUMN IF NOT EXISTS collocations TEXT,
ADD COLUMN IF NOT EXISTS synonyms TEXT,
ADD COLUMN IF NOT EXISTS antonyms TEXT,
ADD COLUMN IF NOT EXISTS etymology TEXT,
ADD COLUMN IF NOT EXISTS memory_tips TEXT;

-- Add spaced repetition columns
ALTER TABLE flashcards 
ADD COLUMN IF NOT EXISTS ease_factor DECIMAL DEFAULT 2.5,
ADD COLUMN IF NOT EXISTS interval INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS repetitions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS times_studied INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS times_correct INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS times_wrong INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS mastery_level TEXT DEFAULT 'new',
ADD COLUMN IF NOT EXISTS next_review TIMESTAMP;

-- Update existing flashcards with default spaced repetition values
UPDATE flashcards 
SET 
  ease_factor = COALESCE(ease_factor, 2.5),
  interval = COALESCE(interval, 1),
  repetitions = COALESCE(repetitions, 0),
  times_studied = COALESCE(times_studied, 0),
  times_correct = COALESCE(times_correct, 0),
  times_wrong = COALESCE(times_wrong, 0),
  mastery_level = COALESCE(mastery_level, 'new');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_flashcards_next_review ON flashcards(next_review);
CREATE INDEX IF NOT EXISTS idx_flashcards_mastery_level ON flashcards(mastery_level);
CREATE INDEX IF NOT EXISTS idx_flashcards_ease_factor ON flashcards(ease_factor);

-- Success message
SELECT 'Enhanced vocabulary learning columns added successfully!' as result;