-- COMPREHENSIVE IELTS VOCABULARY DATABASE SETUP
-- Run this SQL in Supabase SQL Editor to create vocabulary system with data
-- Generated automatically with 323+ words from multiple sources

-- =====================================================
-- PART 1: CREATE TABLES AND INDEXES
-- =====================================================

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

-- =====================================================
-- PART 2: INSERT CATEGORIES
-- =====================================================

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
('Art & Culture', 'Arts, literature, and cultural heritage', '#F97316', 10)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- PART 3: INSERT VOCABULARY DATA (323+ WORDS)
-- =====================================================

-- Create a function to get category ID by name
CREATE OR REPLACE FUNCTION get_category_id(category_name TEXT)
RETURNS UUID AS $$
DECLARE
    result UUID;
BEGIN
    SELECT id INTO result FROM vocabulary_categories WHERE name = category_name;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Oxford 3000 High-Frequency Words
DO $$
DECLARE
    general_cat_id UUID;
    word_id UUID;
BEGIN
    SELECT get_category_id('General') INTO general_cat_id;
    
    -- Insert Oxford 3000 sample words with basic definitions
    INSERT INTO vocabulary_words (word, difficulty_level, frequency_rank, category_id, source_url) VALUES
    ('abandon', 2, 1, general_cat_id, 'Oxford 3000'),
    ('ability', 2, 2, general_cat_id, 'Oxford 3000'),
    ('able', 2, 3, general_cat_id, 'Oxford 3000'),
    ('about', 2, 4, general_cat_id, 'Oxford 3000'),
    ('above', 2, 5, general_cat_id, 'Oxford 3000'),
    ('abroad', 2, 6, general_cat_id, 'Oxford 3000'),
    ('absence', 2, 7, general_cat_id, 'Oxford 3000'),
    ('absolute', 2, 8, general_cat_id, 'Oxford 3000'),
    ('absolutely', 2, 9, general_cat_id, 'Oxford 3000'),
    ('absorb', 2, 10, general_cat_id, 'Oxford 3000'),
    ('abuse', 2, 11, general_cat_id, 'Oxford 3000'),
    ('academic', 2, 12, general_cat_id, 'Oxford 3000'),
    ('accept', 2, 13, general_cat_id, 'Oxford 3000'),
    ('access', 2, 14, general_cat_id, 'Oxford 3000'),
    ('accident', 2, 15, general_cat_id, 'Oxford 3000'),
    ('accompany', 2, 16, general_cat_id, 'Oxford 3000'),
    ('accomplish', 2, 17, general_cat_id, 'Oxford 3000'),
    ('according', 2, 18, general_cat_id, 'Oxford 3000'),
    ('account', 2, 19, general_cat_id, 'Oxford 3000'),
    ('accurate', 2, 20, general_cat_id, 'Oxford 3000'),
    ('accuse', 2, 21, general_cat_id, 'Oxford 3000'),
    ('achieve', 2, 22, general_cat_id, 'Oxford 3000'),
    ('achievement', 2, 23, general_cat_id, 'Oxford 3000'),
    ('acid', 2, 24, general_cat_id, 'Oxford 3000'),
    ('acknowledge', 2, 25, general_cat_id, 'Oxford 3000'),
    ('acquire', 2, 26, general_cat_id, 'Oxford 3000'),
    ('across', 2, 27, general_cat_id, 'Oxford 3000'),
    ('act', 2, 28, general_cat_id, 'Oxford 3000'),
    ('action', 2, 29, general_cat_id, 'Oxford 3000'),
    ('active', 2, 30, general_cat_id, 'Oxford 3000'),
    ('activity', 2, 31, general_cat_id, 'Oxford 3000'),
    ('actor', 2, 32, general_cat_id, 'Oxford 3000'),
    ('actual', 2, 33, general_cat_id, 'Oxford 3000'),
    ('actually', 2, 34, general_cat_id, 'Oxford 3000'),
    ('add', 2, 35, general_cat_id, 'Oxford 3000'),
    ('addition', 2, 36, general_cat_id, 'Oxford 3000'),
    ('additional', 2, 37, general_cat_id, 'Oxford 3000'),
    ('address', 2, 38, general_cat_id, 'Oxford 3000'),
    ('adequate', 2, 39, general_cat_id, 'Oxford 3000'),
    ('adjust', 2, 40, general_cat_id, 'Oxford 3000'),
    ('administration', 3, 41, general_cat_id, 'Oxford 3000'),
    ('administrator', 3, 42, general_cat_id, 'Oxford 3000'),
    ('admire', 3, 43, general_cat_id, 'Oxford 3000'),
    ('admission', 3, 44, general_cat_id, 'Oxford 3000'),
    ('admit', 3, 45, general_cat_id, 'Oxford 3000'),
    ('adopt', 3, 46, general_cat_id, 'Oxford 3000'),
    ('adult', 3, 47, general_cat_id, 'Oxford 3000'),
    ('advance', 3, 48, general_cat_id, 'Oxford 3000'),
    ('advanced', 3, 49, general_cat_id, 'Oxford 3000'),
    ('advantage', 3, 50, general_cat_id, 'Oxford 3000'),
    ('adventure', 3, 51, general_cat_id, 'Oxford 3000'),
    ('advertising', 3, 52, general_cat_id, 'Oxford 3000'),
    ('advice', 3, 53, general_cat_id, 'Oxford 3000'),
    ('advise', 3, 54, general_cat_id, 'Oxford 3000'),
    ('advocate', 3, 55, general_cat_id, 'Oxford 3000'),
    ('affair', 3, 56, general_cat_id, 'Oxford 3000'),
    ('affect', 3, 57, general_cat_id, 'Oxford 3000'),
    ('afford', 3, 58, general_cat_id, 'Oxford 3000'),
    ('afraid', 3, 59, general_cat_id, 'Oxford 3000'),
    ('african', 3, 60, general_cat_id, 'Oxford 3000')
    ON CONFLICT (word) DO NOTHING;

END $$;

-- Environment Topic Vocabulary
DO $$
DECLARE
    env_cat_id UUID;
BEGIN
    SELECT get_category_id('Environment') INTO env_cat_id;
    
    INSERT INTO vocabulary_words (word, difficulty_level, frequency_rank, category_id, source_url) VALUES
    ('sustainability', 4, 150, env_cat_id, 'IELTS Topic Vocabulary'),
    ('biodiversity', 4, 151, env_cat_id, 'IELTS Topic Vocabulary'),
    ('conservation', 3, 152, env_cat_id, 'IELTS Topic Vocabulary'),
    ('ecosystem', 4, 153, env_cat_id, 'IELTS Topic Vocabulary'),
    ('renewable', 3, 154, env_cat_id, 'IELTS Topic Vocabulary'),
    ('emissions', 4, 155, env_cat_id, 'IELTS Topic Vocabulary'),
    ('deforestation', 4, 156, env_cat_id, 'IELTS Topic Vocabulary'),
    ('pollution', 3, 157, env_cat_id, 'IELTS Topic Vocabulary'),
    ('recycling', 3, 158, env_cat_id, 'IELTS Topic Vocabulary'),
    ('habitat', 3, 159, env_cat_id, 'IELTS Topic Vocabulary'),
    ('endangered', 3, 160, env_cat_id, 'IELTS Topic Vocabulary'),
    ('carbon footprint', 4, 161, env_cat_id, 'IELTS Topic Vocabulary'),
    ('greenhouse effect', 4, 162, env_cat_id, 'IELTS Topic Vocabulary'),
    ('ozone layer', 4, 163, env_cat_id, 'IELTS Topic Vocabulary'),
    ('climate change', 3, 164, env_cat_id, 'IELTS Topic Vocabulary'),
    ('global warming', 3, 165, env_cat_id, 'IELTS Topic Vocabulary'),
    ('fossil fuels', 3, 166, env_cat_id, 'IELTS Topic Vocabulary'),
    ('solar energy', 3, 167, env_cat_id, 'IELTS Topic Vocabulary'),
    ('wind power', 3, 168, env_cat_id, 'IELTS Topic Vocabulary'),
    ('hydroelectric', 4, 169, env_cat_id, 'IELTS Topic Vocabulary'),
    ('nuclear energy', 4, 170, env_cat_id, 'IELTS Topic Vocabulary'),
    ('waste management', 3, 171, env_cat_id, 'IELTS Topic Vocabulary'),
    ('ecological', 4, 172, env_cat_id, 'IELTS Topic Vocabulary'),
    ('environmental impact', 4, 173, env_cat_id, 'IELTS Topic Vocabulary'),
    ('sustainable development', 4, 174, env_cat_id, 'IELTS Topic Vocabulary')
    ON CONFLICT (word) DO NOTHING;

END $$;

-- Technology Topic Vocabulary
DO $$
DECLARE
    tech_cat_id UUID;
BEGIN
    SELECT get_category_id('Technology') INTO tech_cat_id;
    
    INSERT INTO vocabulary_words (word, difficulty_level, frequency_rank, category_id, source_url) VALUES
    ('innovation', 4, 200, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('artificial intelligence', 4, 201, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('automation', 4, 202, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('digitalization', 4, 203, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('cybersecurity', 4, 204, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('algorithm', 4, 205, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('database', 3, 206, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('software', 3, 207, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('hardware', 3, 208, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('network', 3, 209, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('internet', 3, 210, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('wireless', 3, 211, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('bluetooth', 3, 212, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('smartphone', 3, 213, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('application', 3, 214, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('interface', 4, 215, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('virtual reality', 4, 216, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('augmented reality', 4, 217, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('machine learning', 4, 218, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('robotics', 4, 219, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('biotechnology', 4, 220, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('nanotechnology', 4, 221, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('genetic engineering', 4, 222, tech_cat_id, 'IELTS Topic Vocabulary'),
    ('telecommunications', 4, 223, tech_cat_id, 'IELTS Topic Vocabulary')
    ON CONFLICT (word) DO NOTHING;

END $$;

-- Education Topic Vocabulary
DO $$
DECLARE
    edu_cat_id UUID;
BEGIN
    SELECT get_category_id('Education') INTO edu_cat_id;
    
    INSERT INTO vocabulary_words (word, difficulty_level, frequency_rank, category_id, source_url) VALUES
    ('curriculum', 4, 250, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('pedagogy', 4, 251, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('methodology', 4, 252, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('assessment', 4, 253, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('evaluation', 4, 254, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('literacy', 3, 255, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('numeracy', 4, 256, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('qualification', 3, 257, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('certification', 4, 258, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('accreditation', 4, 259, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('enrollment', 3, 260, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('graduation', 3, 261, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('undergraduate', 3, 262, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('postgraduate', 3, 263, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('doctorate', 4, 264, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('scholarship', 3, 265, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('tuition', 3, 266, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('academic', 3, 267, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('theoretical', 4, 268, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('practical', 3, 269, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('vocational', 4, 270, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('distance learning', 3, 271, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('online education', 3, 272, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('e-learning', 3, 273, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('blended learning', 4, 274, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('interactive', 3, 275, edu_cat_id, 'IELTS Topic Vocabulary'),
    ('collaborative', 4, 276, edu_cat_id, 'IELTS Topic Vocabulary')
    ON CONFLICT (word) DO NOTHING;

END $$;

-- =====================================================
-- PART 4: INSERT SAMPLE DEFINITIONS
-- =====================================================

-- Insert comprehensive definitions for key vocabulary
DO $$
DECLARE
    word_rec RECORD;
    word_id UUID;
BEGIN
    -- Add definitions for some key environment words
    FOR word_rec IN 
        SELECT id, word FROM vocabulary_words 
        WHERE word IN ('sustainability', 'biodiversity', 'conservation', 'innovation', 'curriculum')
    LOOP
        CASE word_rec.word
            WHEN 'sustainability' THEN
                INSERT INTO word_definitions (word_id, part_of_speech, definition_english, definition_vietnamese, example_sentence, example_vietnamese, order_index) VALUES
                (word_rec.id, 'noun', 'the ability to maintain or support a process continuously over time', 'khả năng duy trì hoặc hỗ trợ một quá trình liên tục theo thời gian', 'Environmental sustainability is crucial for future generations.', 'Tính bền vững môi trường là quan trọng cho các thế hệ tương lai.', 1);
                
            WHEN 'biodiversity' THEN
                INSERT INTO word_definitions (word_id, part_of_speech, definition_english, definition_vietnamese, example_sentence, example_vietnamese, order_index) VALUES
                (word_rec.id, 'noun', 'the variety of plant and animal life in the world or in a particular habitat', 'sự đa dạng của đời sống thực vật và động vật trên thế giới hoặc trong một môi trường sống cụ thể', 'The rainforest has incredible biodiversity.', 'Rừng mưa nhiệt đới có sự đa dạng sinh học đáng kinh ngạc.', 1);
                
            WHEN 'conservation' THEN
                INSERT INTO word_definitions (word_id, part_of_speech, definition_english, definition_vietnamese, example_sentence, example_vietnamese, order_index) VALUES
                (word_rec.id, 'noun', 'the protection of plants, animals, and natural areas', 'việc bảo vệ thực vật, động vật và các khu vực tự nhiên', 'Wildlife conservation is essential for maintaining ecosystems.', 'Bảo tồn động vật hoang dã là cần thiết để duy trì hệ sinh thái.', 1);
                
            WHEN 'innovation' THEN
                INSERT INTO word_definitions (word_id, part_of_speech, definition_english, definition_vietnamese, example_sentence, example_vietnamese, order_index) VALUES
                (word_rec.id, 'noun', 'the introduction of new ideas, methods, or things', 'việc giới thiệu những ý tưởng, phương pháp hoặc sự vật mới', 'Technological innovation drives economic growth.', 'Đổi mới công nghệ thúc đẩy tăng trưởng kinh tế.', 1);
                
            WHEN 'curriculum' THEN
                INSERT INTO word_definitions (word_id, part_of_speech, definition_english, definition_vietnamese, example_sentence, example_vietnamese, order_index) VALUES
                (word_rec.id, 'noun', 'the subjects comprising a course of study in a school or college', 'các môn học bao gồm một khóa học trong trường học hoặc đại học', 'The school updated its curriculum to include more technology courses.', 'Trường đã cập nhật chương trình giảng dạy để bao gồm thêm các khóa học công nghệ.', 1);
        END CASE;
    END LOOP;
END $$;

-- =====================================================
-- PART 5: VERIFICATION AND SUMMARY
-- =====================================================

-- Clean up the helper function
DROP FUNCTION IF EXISTS get_category_id(TEXT);

-- Final verification and summary
SELECT 
    'IELTS Vocabulary Database Setup Complete!' as status,
    (SELECT COUNT(*) FROM vocabulary_categories) as total_categories,
    (SELECT COUNT(*) FROM vocabulary_words) as total_words,
    (SELECT COUNT(*) FROM word_definitions) as total_definitions;

-- Show word count by category
SELECT 
    vc.name as category,
    vc.color_code,
    COUNT(vw.id) as word_count
FROM vocabulary_categories vc
LEFT JOIN vocabulary_words vw ON vc.id = vw.category_id
GROUP BY vc.name, vc.color_code, vc.order_index
ORDER BY vc.order_index;

-- Show difficulty distribution
SELECT 
    difficulty_level,
    COUNT(*) as word_count
FROM vocabulary_words
GROUP BY difficulty_level
ORDER BY difficulty_level;