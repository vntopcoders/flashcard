-- IELTS Vocabulary Database Setup
-- Run this SQL in Supabase SQL Editor to create vocabulary tables

-- Create vocabulary categories table
CREATE TABLE IF NOT EXISTS vocabulary_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color_code TEXT DEFAULT '#3B82F6',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vocabulary words table
CREATE TABLE IF NOT EXISTS vocabulary_words (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    word TEXT NOT NULL,
    pronunciation TEXT, -- IPA phonetic
    audio_url TEXT,
    difficulty_level INTEGER DEFAULT 1, -- 1-5 scale
    frequency_rank INTEGER, -- How common the word is
    category_id UUID REFERENCES vocabulary_categories(id),
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(word)
);

-- Create word definitions table (multiple meanings per word)
CREATE TABLE IF NOT EXISTS word_definitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
    part_of_speech TEXT NOT NULL, -- noun, verb, adjective, etc.
    definition_english TEXT NOT NULL,
    definition_vietnamese TEXT NOT NULL,
    example_sentence TEXT,
    example_vietnamese TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create word synonyms table
CREATE TABLE IF NOT EXISTS word_synonyms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
    synonym TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create word collocations table
CREATE TABLE IF NOT EXISTS word_collocations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
    collocation TEXT NOT NULL,
    example TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user vocabulary progress table
CREATE TABLE IF NOT EXISTS user_vocabulary_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- email from NextAuth
    word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'new', -- new, learning, mastered
    confidence_level INTEGER DEFAULT 0, -- 0-5
    times_reviewed INTEGER DEFAULT 0,
    last_reviewed_at TIMESTAMPTZ,
    mastered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, word_id)
);

-- Create vocabulary lists table (like Academic Word List, Topic-based lists)
CREATE TABLE IF NOT EXISTS vocabulary_lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    total_words INTEGER DEFAULT 0,
    difficulty_level INTEGER DEFAULT 1,
    source_name TEXT,
    source_url TEXT,
    is_official BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create word list memberships table
CREATE TABLE IF NOT EXISTS word_list_memberships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    list_id UUID NOT NULL REFERENCES vocabulary_lists(id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES vocabulary_words(id) ON DELETE CASCADE,
    sublist INTEGER, -- For AWL sublists, level numbers, etc.
    rank_in_list INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(list_id, word_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS vocabulary_words_word_idx ON vocabulary_words(word);
CREATE INDEX IF NOT EXISTS vocabulary_words_difficulty_idx ON vocabulary_words(difficulty_level);
CREATE INDEX IF NOT EXISTS vocabulary_words_frequency_idx ON vocabulary_words(frequency_rank);
CREATE INDEX IF NOT EXISTS vocabulary_words_category_idx ON vocabulary_words(category_id);

CREATE INDEX IF NOT EXISTS word_definitions_word_idx ON word_definitions(word_id);
CREATE INDEX IF NOT EXISTS word_synonyms_word_idx ON word_synonyms(word_id);
CREATE INDEX IF NOT EXISTS word_collocations_word_idx ON word_collocations(word_id);

CREATE INDEX IF NOT EXISTS user_vocabulary_progress_user_idx ON user_vocabulary_progress(user_id);
CREATE INDEX IF NOT EXISTS user_vocabulary_progress_word_idx ON user_vocabulary_progress(word_id);
CREATE INDEX IF NOT EXISTS user_vocabulary_progress_status_idx ON user_vocabulary_progress(status);

CREATE INDEX IF NOT EXISTS word_list_memberships_list_idx ON word_list_memberships(list_id);
CREATE INDEX IF NOT EXISTS word_list_memberships_word_idx ON word_list_memberships(word_id);

-- Insert initial categories
INSERT INTO vocabulary_categories (name, description, color_code, order_index) VALUES
('Academic', 'Academic Word List and scholarly vocabulary', '#8B5CF6', 1),
('General', 'General IELTS vocabulary for all topics', '#3B82F6', 2),
('Environment', 'Environmental issues and climate change', '#10B981', 3),
('Technology', 'Technology and digital world', '#6366F1', 4),
('Education', 'Education system and learning', '#F59E0B', 5),
('Health', 'Health, medicine, and lifestyle', '#EF4444', 6),
('Business', 'Business, economics, and work', '#84CC16', 7),
('Society', 'Social issues and cultural topics', '#EC4899', 8),
('Science', 'Scientific research and discoveries', '#06B6D4', 9),
('Art & Culture', 'Arts, literature, and cultural heritage', '#F97316', 10);

-- Insert initial vocabulary lists
INSERT INTO vocabulary_lists (name, description, total_words, difficulty_level, source_name, source_url, is_official) VALUES
('Academic Word List (AWL)', 'Official Academic Word List - 570 most common academic words', 570, 4, 'EAP Foundation', 'https://www.eapfoundation.com/vocab/academic/awllists/', true),
('IELTS 4000 Essential Words', 'Comprehensive IELTS vocabulary list', 4000, 3, 'Various Sources', '', false),
('Cambridge IELTS Vocabulary', 'Vocabulary from Cambridge IELTS materials', 2000, 3, 'Cambridge', '', true),
('Oxford 3000 Core Words', 'Oxford most important words to learn', 3000, 2, 'Oxford', '', true),
('IELTS Topic Vocabulary', 'Topic-based vocabulary for IELTS', 1500, 3, 'IELTS Preparation Sources', '', false);

-- Insert sample Academic Word List words (Sublist 1 - highest frequency)
INSERT INTO vocabulary_words (word, difficulty_level, frequency_rank, source_url) VALUES
-- AWL Sublist 1 (most frequent academic words)
('analysis', 4, 1, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('approach', 4, 2, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('area', 3, 3, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('assessment', 4, 4, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('assume', 4, 5, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('authority', 4, 6, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('available', 3, 7, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('benefit', 3, 8, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('concept', 4, 9, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('consistent', 4, 10, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('constitute', 5, 11, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('context', 4, 12, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('contract', 4, 13, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('create', 3, 14, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('data', 4, 15, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('define', 4, 16, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('derived', 4, 17, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('distribution', 4, 18, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('economy', 4, 19, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('environment', 3, 20, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('establish', 4, 21, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('estimate', 4, 22, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('evident', 4, 23, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('export', 4, 24, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('factor', 4, 25, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('finance', 4, 26, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('formula', 4, 27, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('function', 4, 28, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('identify', 4, 29, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('income', 3, 30, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('indicate', 4, 31, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('individual', 3, 32, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('interpret', 4, 33, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('involve', 4, 34, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('issue', 3, 35, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('labour', 4, 36, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('legal', 4, 37, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('legislate', 5, 38, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('major', 3, 39, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('method', 4, 40, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('occur', 4, 41, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('percent', 3, 42, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('period', 3, 43, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('policy', 4, 44, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('principle', 4, 45, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('proceed', 4, 46, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('process', 3, 47, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('require', 4, 48, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('research', 3, 49, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('respond', 4, 50, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('role', 3, 51, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('section', 3, 52, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('sector', 4, 53, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('significant', 4, 54, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('similar', 3, 55, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('source', 3, 56, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('specific', 4, 57, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('structure', 4, 58, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('theory', 4, 59, 'https://www.eapfoundation.com/vocab/academic/awllists/'),
('variable', 4, 60, 'https://www.eapfoundation.com/vocab/academic/awllists/');

-- Get category ID for Academic and insert definitions for sample words
DO $$
DECLARE
    academic_category_id UUID;
    word_record RECORD;
BEGIN
    SELECT id INTO academic_category_id FROM vocabulary_categories WHERE name = 'Academic';
    
    -- Update words to have academic category
    UPDATE vocabulary_words SET category_id = academic_category_id WHERE source_url LIKE '%eapfoundation%';
    
    -- Insert sample definitions for key words
    FOR word_record IN SELECT id, word FROM vocabulary_words WHERE word IN ('analysis', 'approach', 'concept', 'establish', 'significant') LOOP
        CASE word_record.word
            WHEN 'analysis' THEN
                INSERT INTO word_definitions (word_id, part_of_speech, definition_english, definition_vietnamese, example_sentence, example_vietnamese, order_index) VALUES
                (word_record.id, 'noun', 'detailed examination of elements or structure', 'sự phân tích chi tiết các yếu tố hoặc cấu trúc', 'The analysis of the data revealed interesting patterns.', 'Việc phân tích dữ liệu đã tiết lộ những mô hình thú vị.', 1);
            WHEN 'approach' THEN
                INSERT INTO word_definitions (word_id, part_of_speech, definition_english, definition_vietnamese, example_sentence, example_vietnamese, order_index) VALUES
                (word_record.id, 'noun', 'a way of dealing with something', 'cách tiếp cận để giải quyết vấn đề', 'We need a new approach to solve this problem.', 'Chúng ta cần một cách tiếp cận mới để giải quyết vấn đề này.', 1),
                (word_record.id, 'verb', 'come near or nearer to', 'đến gần hoặc tiếp cận', 'The deadline is approaching quickly.', 'Hạn chót đang đến gần nhanh chóng.', 2);
            WHEN 'concept' THEN
                INSERT INTO word_definitions (word_id, part_of_speech, definition_english, definition_vietnamese, example_sentence, example_vietnamese, order_index) VALUES
                (word_record.id, 'noun', 'an abstract idea or general notion', 'ý tưởng trừu tượng hoặc khái niệm chung', 'The concept of democracy varies across cultures.', 'Khái niệm dân chủ khác nhau giữa các nền văn hóa.', 1);
            WHEN 'establish' THEN
                INSERT INTO word_definitions (word_id, part_of_speech, definition_english, definition_vietnamese, example_sentence, example_vietnamese, order_index) VALUES
                (word_record.id, 'verb', 'set up on a firm or permanent basis', 'thiết lập trên cơ sở vững chắc hoặc lâu dài', 'The university was established in 1850.', 'Trường đại học được thành lập vào năm 1850.', 1);
            WHEN 'significant' THEN
                INSERT INTO word_definitions (word_id, part_of_speech, definition_english, definition_vietnamese, example_sentence, example_vietnamese, order_index) VALUES
                (word_record.id, 'adjective', 'sufficiently great or important to be worthy of attention', 'đủ lớn hoặc quan trọng để đáng chú ý', 'There has been a significant improvement in sales.', 'Đã có sự cải thiện đáng kể trong doanh số bán hàng.', 1);
        END CASE;
    END LOOP;
END $$;

-- Get AWL list ID and link words to it
DO $$
DECLARE
    awl_list_id UUID;
BEGIN
    SELECT id INTO awl_list_id FROM vocabulary_lists WHERE name = 'Academic Word List (AWL)';
    
    -- Link all AWL words to the list as sublist 1
    INSERT INTO word_list_memberships (list_id, word_id, sublist, rank_in_list)
    SELECT awl_list_id, id, 1, frequency_rank
    FROM vocabulary_words 
    WHERE source_url LIKE '%eapfoundation%';
END $$;

SELECT 'Vocabulary database setup completed successfully!' as message,
       (SELECT COUNT(*) FROM vocabulary_words) as total_words,
       (SELECT COUNT(*) FROM word_definitions) as total_definitions;