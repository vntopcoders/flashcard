-- Create lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create flashcards table with lesson reference
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  english TEXT NOT NULL,
  vietnamese TEXT NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
  category TEXT NOT NULL DEFAULT 'general',
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_flashcards_lesson_id ON flashcards(lesson_id);
CREATE INDEX idx_flashcards_category ON flashcards(category);
CREATE INDEX idx_flashcards_difficulty ON flashcards(difficulty);
CREATE INDEX idx_flashcards_created_at ON flashcards(created_at);
CREATE INDEX idx_lessons_created_at ON lessons(created_at);

-- Insert sample lessons
INSERT INTO lessons (name, description, color) VALUES
('Cơ bản - Basic', 'Từ vựng cơ bản hàng ngày', '#10B981'),
('Chào hỏi - Greetings', 'Các cách chào hỏi và giao tiếp xã giao', '#F59E0B'),
('Kinh doanh - Business', 'Từ vựng trong môi trường công việc', '#EF4444'),
('Công nghệ - Technology', 'Thuật ngữ công nghệ thông tin', '#8B5CF6'),
('Ẩm thực - Food', 'Từ vựng về đồ ăn và nhà hàng', '#F97316');

-- Insert sample flashcards with lesson associations
INSERT INTO flashcards (english, vietnamese, category, difficulty, lesson_id) VALUES
-- Basic lesson
('Hello', 'Xin chào', 'basic', 1, (SELECT id FROM lessons WHERE name = 'Cơ bản - Basic')),
('Thank you', 'Cảm ơn', 'basic', 1, (SELECT id FROM lessons WHERE name = 'Cơ bản - Basic')),
('Please', 'Xin vui lòng', 'basic', 1, (SELECT id FROM lessons WHERE name = 'Cơ bản - Basic')),
('Excuse me', 'Xin lỗi', 'basic', 1, (SELECT id FROM lessons WHERE name = 'Cơ bản - Basic')),

-- Greetings lesson
('Good morning', 'Chào buổi sáng', 'greetings', 1, (SELECT id FROM lessons WHERE name = 'Chào hỏi - Greetings')),
('Good evening', 'Chào buổi tối', 'greetings', 1, (SELECT id FROM lessons WHERE name = 'Chào hỏi - Greetings')),
('How are you?', 'Bạn có khỏe không?', 'greetings', 2, (SELECT id FROM lessons WHERE name = 'Chào hỏi - Greetings')),
('Nice to meet you', 'Rất vui được gặp bạn', 'greetings', 2, (SELECT id FROM lessons WHERE name = 'Chào hỏi - Greetings')),

-- Business lesson
('Opportunity', 'Cơ hội', 'business', 3, (SELECT id FROM lessons WHERE name = 'Kinh doanh - Business')),
('Meeting', 'Cuộc họp', 'business', 2, (SELECT id FROM lessons WHERE name = 'Kinh doanh - Business')),
('Project', 'Dự án', 'business', 2, (SELECT id FROM lessons WHERE name = 'Kinh doanh - Business')),
('Deadline', 'Hạn chót', 'business', 3, (SELECT id FROM lessons WHERE name = 'Kinh doanh - Business')),

-- Technology lesson
('Technology', 'Công nghệ', 'technology', 2, (SELECT id FROM lessons WHERE name = 'Công nghệ - Technology')),
('Computer', 'Máy tính', 'technology', 1, (SELECT id FROM lessons WHERE name = 'Công nghệ - Technology')),
('Software', 'Phần mềm', 'technology', 2, (SELECT id FROM lessons WHERE name = 'Công nghệ - Technology')),
('Database', 'Cơ sở dữ liệu', 'technology', 3, (SELECT id FROM lessons WHERE name = 'Công nghệ - Technology')),

-- Food lesson
('Restaurant', 'Nhà hàng', 'food', 2, (SELECT id FROM lessons WHERE name = 'Ẩm thực - Food')),
('Menu', 'Thực đơn', 'food', 1, (SELECT id FROM lessons WHERE name = 'Ẩm thực - Food')),
('Delicious', 'Ngon', 'food', 1, (SELECT id FROM lessons WHERE name = 'Ẩm thực - Food')),
('Breakfast', 'Bữa sáng', 'food', 1, (SELECT id FROM lessons WHERE name = 'Ẩm thực - Food'));

-- Enable Row Level Security (RLS)
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations for everyone (adjust as needed)
CREATE POLICY "Allow all operations on lessons" ON lessons
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on flashcards" ON flashcards
  FOR ALL USING (true) WITH CHECK (true);
