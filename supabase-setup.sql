-- Create flashcards table in Supabase
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  english TEXT NOT NULL,
  vietnamese TEXT NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_flashcards_category ON flashcards(category);
CREATE INDEX idx_flashcards_difficulty ON flashcards(difficulty);
CREATE INDEX idx_flashcards_created_at ON flashcards(created_at);

-- Insert sample data
INSERT INTO flashcards (english, vietnamese, category, difficulty) VALUES
('Hello', 'Xin chào', 'basic', 1),
('Thank you', 'Cảm ơn', 'basic', 1),
('Good morning', 'Chào buổi sáng', 'greetings', 1),
('Beautiful', 'Đẹp', 'adjectives', 2),
('Opportunity', 'Cơ hội', 'business', 3),
('Environment', 'Môi trường', 'general', 3),
('Technology', 'Công nghệ', 'technology', 2),
('Restaurant', 'Nhà hàng', 'food', 2),
('Friendship', 'Tình bạn', 'general', 2),
('Success', 'Thành công', 'business', 3);

-- Enable Row Level Security (RLS)
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for everyone (adjust as needed)
CREATE POLICY "Allow all operations on flashcards" ON flashcards
  FOR ALL USING (true) WITH CHECK (true);
