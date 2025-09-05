-- Add source_url column to listening_tests table
-- Run this in Supabase SQL Editor

ALTER TABLE listening_tests 
ADD COLUMN IF NOT EXISTS source_url TEXT;

COMMENT ON COLUMN listening_tests.source_url IS 'URL to the original source (British Council, Cambridge, etc.)';

-- Update existing rows with default values if needed
UPDATE listening_tests 
SET source_url = 'https://www.ielts.org' 
WHERE source_url IS NULL;