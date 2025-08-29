-- Grammar Content Setup for IELTS Study Plan
-- Run this SQL in Supabase SQL Editor to create grammar tables

-- Create grammar_topics table
CREATE TABLE IF NOT EXISTS grammar_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    week_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    theory_vietnamese TEXT NOT NULL,
    theory_english TEXT,
    difficulty_level INTEGER DEFAULT 1, -- 1-5 scale
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create grammar_key_points table
CREATE TABLE IF NOT EXISTS grammar_key_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grammar_topic_id UUID NOT NULL REFERENCES grammar_topics(id) ON DELETE CASCADE,
    point_vietnamese TEXT NOT NULL,
    point_english TEXT,
    example_sentence TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create grammar_exercises table
CREATE TABLE IF NOT EXISTS grammar_exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grammar_topic_id UUID NOT NULL REFERENCES grammar_topics(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB, -- For multiple choice: ["A", "B", "C", "D"]
    correct_answer TEXT NOT NULL,
    explanation_vietnamese TEXT,
    explanation_english TEXT,
    difficulty_level INTEGER DEFAULT 1,
    exercise_type TEXT DEFAULT 'multiple_choice', -- multiple_choice, fill_blank, rewrite
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create study_resources table
CREATE TABLE IF NOT EXISTS study_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    week_number INTEGER NOT NULL,
    resource_type TEXT NOT NULL, -- 'lesson', 'grammar', 'exercise', 'video'
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS grammar_topics_week_idx ON grammar_topics(week_number);
CREATE INDEX IF NOT EXISTS grammar_key_points_topic_idx ON grammar_key_points(grammar_topic_id);
CREATE INDEX IF NOT EXISTS grammar_exercises_topic_idx ON grammar_exercises(grammar_topic_id);
CREATE INDEX IF NOT EXISTS study_resources_week_idx ON study_resources(week_number);

-- Insert sample data for Week 1-3
INSERT INTO grammar_topics (week_number, title, theory_vietnamese, difficulty_level, order_index) VALUES
(1, 'Present Simple & Present Continuous', 
 'Thì hiện tại đơn và hiện tại tiếp diễn là nền tảng cơ bản nhất trong tiếng Anh. Thì hiện tại đơn diễn tả thói quen, sự thật hiển nhiên. Thì hiện tại tiếp diễn diễn tả hành động đang xảy ra tại thời điểm nói.',
 1, 1),

(2, 'Modal Verbs', 
 'Động từ khuyết thiếu (Modal verbs) là những động từ đặc biệt diễn tả khả năng, sự cho phép, nghĩa vụ, lời khuyên. Chúng không chia theo ngôi và luôn đi với động từ nguyên mẫu không "to".',
 2, 1),

(3, 'Perfect Tenses', 
 'Thì hoàn thành diễn tả hành động đã xảy ra trong quá khứ và có liên quan đến hiện tại, hoặc hành động xảy ra trong một khoảng thời gian kéo dài đến hiện tại.',
 3, 1);

-- Insert key points for Week 1
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Present Simple: S + V/V-s/es (thói quen, sự thật)', 'I work every day. She works at a bank.', 1
FROM grammar_topics WHERE week_number = 1 AND title = 'Present Simple & Present Continuous';

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Present Continuous: S + am/is/are + V-ing (hành động đang diễn ra)', 'I am working now. She is studying English.', 2
FROM grammar_topics WHERE week_number = 1 AND title = 'Present Simple & Present Continuous';

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Cách sử dụng adverbs of frequency với Present Simple', 'I always wake up early. She never drinks coffee.', 3
FROM grammar_topics WHERE week_number = 1 AND title = 'Present Simple & Present Continuous';

-- Insert key points for Week 2
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Can/Could: khả năng, sự cho phép (có thể)', 'I can swim. Could you help me?', 1
FROM grammar_topics WHERE week_number = 2 AND title = 'Modal Verbs';

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'May/Might: khả năng, sự cho phép lịch sự (có lẽ)', 'It may rain today. You might be right.', 2
FROM grammar_topics WHERE week_number = 2 AND title = 'Modal Verbs';

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Must/Have to: nghĩa vụ, sự cần thiết (phải)', 'You must study hard. I have to go now.', 3
FROM grammar_topics WHERE week_number = 2 AND title = 'Modal Verbs';

-- Insert key points for Week 3
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Present Perfect: S + have/has + V3 (kinh nghiệm, kết quả)', 'I have visited Japan. She has finished her work.', 1
FROM grammar_topics WHERE week_number = 3 AND title = 'Perfect Tenses';

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Past Perfect: S + had + V3 (hành động xảy ra trước hành động khác trong quá khứ)', 'I had finished dinner before she arrived.', 2
FROM grammar_topics WHERE week_number = 3 AND title = 'Perfect Tenses';

-- Insert study resources
INSERT INTO study_resources (week_number, resource_type, title, url, order_index) VALUES
(1, 'lesson', 'Basic Tenses Introduction', '/lessons/1', 1),
(1, 'lesson', 'Present Simple Practice', '/lessons/2', 2),
(1, 'lesson', 'Present Continuous Usage', '/lessons/3', 3),
(1, 'grammar', 'Present Simple Rules', '/grammar/present-simple', 1),
(1, 'grammar', 'Present Continuous Rules', '/grammar/present-continuous', 2),

(2, 'lesson', 'Modal Verbs Introduction', '/lessons/4', 1),
(2, 'lesson', 'Can and Could Usage', '/lessons/5', 2),
(2, 'lesson', 'Must and Have to', '/lessons/6', 3),
(2, 'grammar', 'Modal Verbs Overview', '/grammar/modal-verbs', 1),
(2, 'grammar', 'Can vs Could', '/grammar/can-could', 2),
(2, 'grammar', 'Must vs Have to', '/grammar/must-have-to', 3),

(3, 'lesson', 'Perfect Tenses Introduction', '/lessons/7', 1),
(3, 'lesson', 'Present Perfect Usage', '/lessons/8', 2),
(3, 'lesson', 'Past Perfect Practice', '/lessons/9', 3),
(3, 'grammar', 'Present Perfect Rules', '/grammar/present-perfect', 1),
(3, 'grammar', 'Past Perfect Rules', '/grammar/past-perfect', 2);

-- Success message
SELECT 'Grammar tables and sample data created successfully!' as message;