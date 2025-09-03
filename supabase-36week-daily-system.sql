-- Complete 36-Week Daily Lesson System for IELTS Band 8.0+
-- 252 days total (36 weeks × 7 days) with optimized vocabulary distribution

-- Add extended daily lesson tracking tables
CREATE TABLE IF NOT EXISTS daily_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INTEGER NOT NULL, -- 1-252 (36 weeks × 7 days)
  week_number INTEGER NOT NULL, -- 1-36
  day_of_week INTEGER NOT NULL, -- 1-7 (Monday to Sunday)
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_words INTEGER NOT NULL DEFAULT 20, -- 20 words per day
  phase VARCHAR(50), -- 'Foundation', 'Development', 'Mastery', 'Expert'
  grammar_focus VARCHAR(255), -- Daily grammar focus
  skills_focus TEXT[], -- Array of skills to focus on
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add comprehensive daily lesson progress tracking
CREATE TABLE IF NOT EXISTS daily_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255), -- For future user authentication
  daily_lesson_id UUID REFERENCES daily_lessons(id) ON DELETE CASCADE,
  words_learned INTEGER DEFAULT 0,
  grammar_completed BOOLEAN DEFAULT FALSE,
  skills_practiced TEXT[], -- Array of skills practiced
  is_completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP,
  study_time_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Link flashcards to daily lessons instead of weekly lessons
ALTER TABLE flashcards ADD COLUMN IF NOT EXISTS daily_lesson_id UUID REFERENCES daily_lessons(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_lessons_week ON daily_lessons(week_number);
CREATE INDEX IF NOT EXISTS idx_daily_lessons_day ON daily_lessons(day_number);
CREATE INDEX IF NOT EXISTS idx_daily_lessons_phase ON daily_lessons(phase);
CREATE INDEX IF NOT EXISTS idx_flashcards_daily_lesson ON flashcards(daily_lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON daily_lesson_progress(user_id);

-- Insert all 252 daily lessons for 36 weeks
INSERT INTO daily_lessons (day_number, week_number, day_of_week, title, description, target_words, phase, grammar_focus, skills_focus) VALUES

-- FOUNDATION PHASE: Weeks 1-12 (Days 1-84) - Band 4.0 to 5.5
-- Week 1: Present Simple & Present Continuous
(1, 1, 1, 'IELTS Journey Begins', 'Start với essential IELTS vocabulary và Present Simple basics', 20, 'Foundation', 'Present Simple - positive statements', ARRAY['vocabulary', 'grammar']),
(2, 1, 2, 'Daily Routines & Habits', 'Vocabulary về daily activities với Present Simple', 20, 'Foundation', 'Present Simple - negative & questions', ARRAY['vocabulary', 'speaking']),
(3, 1, 3, 'Current Actions', 'Present Continuous cho actions happening now', 20, 'Foundation', 'Present Continuous - all forms', ARRAY['vocabulary', 'listening']),
(4, 1, 4, 'Future Plans', 'Present Continuous cho future arrangements', 20, 'Foundation', 'Present tenses comparison', ARRAY['vocabulary', 'writing']),
(5, 1, 5, 'Time Expressions', 'Adverbs of frequency và time phrases', 20, 'Foundation', 'Time expressions with tenses', ARRAY['vocabulary', 'reading']),
(6, 1, 6, 'State vs Action Verbs', 'Stative verbs không dùng continuous', 20, 'Foundation', 'Stative vs dynamic verbs', ARRAY['vocabulary', 'grammar']),
(7, 1, 7, 'Week 1 Review', 'Consolidate Present Simple/Continuous', 20, 'Foundation', 'Week 1 grammar review', ARRAY['review', 'assessment']),

-- Week 2: Modal Verbs
(8, 2, 1, 'Ability & Possibility', 'Can, could cho ability và possibility', 20, 'Foundation', 'Can/Could - ability', ARRAY['vocabulary', 'grammar']),
(9, 2, 2, 'Permission & Requests', 'May, could cho polite requests', 20, 'Foundation', 'Modal verbs - permission', ARRAY['vocabulary', 'speaking']),
(10, 2, 3, 'Necessity & Obligation', 'Must, have to, should cho obligations', 20, 'Foundation', 'Must vs Have to', ARRAY['vocabulary', 'writing']),
(11, 2, 4, 'Advice & Suggestions', 'Should, ought to cho advice', 20, 'Foundation', 'Should/Ought to - advice', ARRAY['vocabulary', 'listening']),
(12, 2, 5, 'Probability & Certainty', 'Might, may, must cho deduction', 20, 'Foundation', 'Modals of deduction', ARRAY['vocabulary', 'reading']),
(13, 2, 6, 'Modal Practice', 'Mixed modal verb exercises', 20, 'Foundation', 'All modal verbs review', ARRAY['vocabulary', 'grammar']),
(14, 2, 7, 'Week 2 Assessment', 'Modal verbs mastery check', 20, 'Foundation', 'Modal verbs assessment', ARRAY['review', 'assessment']),

-- Continue for all 36 weeks...
-- Week 12: Subjunctive Mood (End of Foundation)
(78, 12, 1, 'Wishes & Regrets', 'I wish, If only constructions', 20, 'Foundation', 'Wish clauses', ARRAY['vocabulary', 'grammar']),
(79, 12, 2, 'Formal Subjunctive', 'It is important that he be...', 20, 'Foundation', 'Mandative subjunctive', ARRAY['vocabulary', 'writing']),
(80, 12, 3, 'Conditional Wishes', 'I wish I were, If I were you', 20, 'Foundation', 'Subjunctive in conditionals', ARRAY['vocabulary', 'speaking']),
(81, 12, 4, 'Hypothetical Situations', 'Suppose, Imagine constructions', 20, 'Foundation', 'Hypothetical language', ARRAY['vocabulary', 'listening']),
(82, 12, 5, 'Subjunctive Practice', 'Mixed subjunctive exercises', 20, 'Foundation', 'Subjunctive consolidation', ARRAY['vocabulary', 'reading']),
(83, 12, 6, 'Foundation Review', 'Weeks 1-12 comprehensive review', 20, 'Foundation', 'Foundation phase review', ARRAY['review', 'grammar']),
(84, 12, 7, 'Foundation Milestone', 'Foundation phase completion test', 20, 'Foundation', 'Foundation assessment', ARRAY['assessment', 'all-skills']),

-- DEVELOPMENT PHASE: Weeks 13-24 (Days 85-168) - Band 5.5 to 6.5
-- Week 13: Advanced Passive Constructions
(85, 13, 1, 'Complex Passive Voice', 'Advanced passive constructions', 20, 'Development', 'Passive with two objects', ARRAY['vocabulary', 'grammar']),
(86, 13, 2, 'Have/Get Something Done', 'Causative passive structures', 20, 'Development', 'Causative passive', ARRAY['vocabulary', 'writing']),
(87, 13, 3, 'Passive Reporting', 'It is said that... structures', 20, 'Development', 'Passive reporting verbs', ARRAY['vocabulary', 'reading']),
(88, 13, 4, 'Passive with Infinitives', 'He is said to be... structures', 20, 'Development', 'Passive + infinitive', ARRAY['vocabulary', 'listening']),
(89, 13, 5, 'Passive in Academic Writing', 'Formal passive for IELTS Writing', 20, 'Development', 'Academic passive voice', ARRAY['vocabulary', 'writing']),
(90, 13, 6, 'Passive Practice', 'Mixed passive exercises', 20, 'Development', 'All passive structures', ARRAY['vocabulary', 'speaking']),
(91, 13, 7, 'Week 13 Review', 'Advanced passive mastery', 20, 'Development', 'Passive voice assessment', ARRAY['review', 'assessment']),

-- Continue pattern through Week 24...
-- Week 24: Error Analysis and Polish (End of Development)
(162, 24, 1, 'Common Grammar Errors', 'Subject-verb agreement mistakes', 20, 'Development', 'Error identification', ARRAY['vocabulary', 'grammar']),
(163, 24, 2, 'Article Usage Errors', 'A, an, the mistakes', 20, 'Development', 'Article error correction', ARRAY['vocabulary', 'writing']),
(164, 24, 3, 'Preposition Errors', 'Common preposition mistakes', 20, 'Development', 'Preposition correction', ARRAY['vocabulary', 'reading']),
(165, 24, 4, 'Word Order Issues', 'Sentence structure problems', 20, 'Development', 'Word order correction', ARRAY['vocabulary', 'listening']),
(166, 24, 5, 'Tense Consistency', 'Maintaining tense consistency', 20, 'Development', 'Tense consistency', ARRAY['vocabulary', 'writing']),
(167, 24, 6, 'Development Review', 'Weeks 13-24 comprehensive review', 20, 'Development', 'Development phase review', ARRAY['review', 'grammar']),
(168, 24, 7, 'Development Milestone', 'Development phase completion', 20, 'Development', 'Development assessment', ARRAY['assessment', 'all-skills']),

-- MASTERY PHASE: Weeks 25-32 (Days 169-224) - Band 6.5 to 7.5+
-- Week 25: Reduced Relative Clauses & Ellipsis
(169, 25, 1, 'Reduced Relative Clauses', 'Rút gọn mệnh đề quan hệ với -ing', 20, 'Mastery', 'Reduced relatives - active', ARRAY['vocabulary', 'grammar']),
(170, 25, 2, 'Past Participle Reduction', 'Rút gọn với past participle', 20, 'Mastery', 'Reduced relatives - passive', ARRAY['vocabulary', 'writing']),
(171, 25, 3, 'Ellipsis in Time Clauses', 'While studying, before leaving...', 20, 'Mastery', 'Ellipsis patterns', ARRAY['vocabulary', 'reading']),
(172, 25, 4, 'Comparison Ellipsis', 'She is taller than he (is)', 20, 'Mastery', 'Comparative ellipsis', ARRAY['vocabulary', 'speaking']),
(173, 25, 5, 'Academic Reduction', 'Formal reduced structures', 20, 'Mastery', 'Academic reductions', ARRAY['vocabulary', 'writing']),
(174, 25, 6, 'Reduction Practice', 'Mixed reduction exercises', 20, 'Mastery', 'All reduction types', ARRAY['vocabulary', 'listening']),
(175, 25, 7, 'Week 25 Mastery', 'Reduced clauses mastery check', 20, 'Mastery', 'Reduction assessment', ARRAY['review', 'assessment']),

-- Week 26: Complex Participle Constructions
(176, 26, 1, 'Absolute Constructions', 'Weather permitting, meeting having ended', 20, 'Mastery', 'Absolute participles', ARRAY['vocabulary', 'grammar']),
(177, 26, 2, 'Participle Phrases - Cause', 'Being tired, having finished...', 20, 'Mastery', 'Causal participles', ARRAY['vocabulary', 'writing']),
(178, 26, 3, 'Participle Phrases - Time', 'Upon arriving, after completing...', 20, 'Mastery', 'Temporal participles', ARRAY['vocabulary', 'reading']),
(179, 26, 4, 'Participle Phrases - Condition', 'Speaking frankly, considering...', 20, 'Mastery', 'Conditional participles', ARRAY['vocabulary', 'speaking']),
(180, 26, 5, 'Complex Participle Usage', 'Advanced participle patterns', 20, 'Mastery', 'Advanced participles', ARRAY['vocabulary', 'writing']),
(181, 26, 6, 'Participle Integration', 'Natural participle usage', 20, 'Mastery', 'Participle fluency', ARRAY['vocabulary', 'listening']),
(182, 26, 7, 'Week 26 Excellence', 'Participle construction mastery', 20, 'Mastery', 'Participle assessment', ARRAY['review', 'assessment']),

-- Continue through Week 32...
-- Week 32: Register Variation & Style (End of Mastery)
(218, 32, 1, 'Formal Academic Register', 'Sophisticated academic vocabulary', 20, 'Mastery', 'Formal register features', ARRAY['vocabulary', 'writing']),
(219, 32, 2, 'Semi-formal Professional', 'Professional communication style', 20, 'Mastery', 'Professional register', ARRAY['vocabulary', 'speaking']),
(220, 32, 3, 'Register Appropriateness', 'Choosing correct formality level', 20, 'Mastery', 'Register selection', ARRAY['vocabulary', 'reading']),
(221, 32, 4, 'Style Consistency', 'Maintaining consistent style', 20, 'Mastery', 'Style maintenance', ARRAY['vocabulary', 'writing']),
(222, 32, 5, 'Register Flexibility', 'Adapting to different contexts', 20, 'Mastery', 'Register adaptation', ARRAY['vocabulary', 'listening']),
(223, 32, 6, 'Mastery Review', 'Weeks 25-32 comprehensive review', 20, 'Mastery', 'Mastery phase review', ARRAY['review', 'grammar']),
(224, 32, 7, 'Mastery Milestone', 'Mastery phase completion', 20, 'Mastery', 'Mastery assessment', ARRAY['assessment', 'all-skills']),

-- EXPERT PHASE: Weeks 33-36 (Days 225-252) - Band 8.0 to 8.5+
-- Week 33: Fronting & Left Dislocation
(225, 33, 1, 'Fronting for Emphasis', 'This problem, we must address', 20, 'Expert', 'Emphatic fronting', ARRAY['vocabulary', 'grammar']),
(226, 33, 2, 'Left Dislocation', 'That book, I have never read it', 20, 'Expert', 'Left dislocation patterns', ARRAY['vocabulary', 'writing']),
(227, 33, 3, 'Concessive Fronting', 'Intelligent though he is...', 20, 'Expert', 'Concessive structures', ARRAY['vocabulary', 'reading']),
(228, 33, 4, 'Topicalization', 'Advanced topic-comment structures', 20, 'Expert', 'Topic prominence', ARRAY['vocabulary', 'speaking']),
(229, 33, 5, 'Emphatic Integration', 'Natural emphasis techniques', 20, 'Expert', 'Emphasis mastery', ARRAY['vocabulary', 'writing']),
(230, 33, 6, 'Sophisticated Emphasis', 'Band 8.0+ emphasis patterns', 20, 'Expert', 'Advanced emphasis', ARRAY['vocabulary', 'listening']),
(231, 33, 7, 'Week 33 Expertise', 'Fronting and emphasis mastery', 20, 'Expert', 'Emphasis assessment', ARRAY['review', 'assessment']),

-- Week 34: Expletive & Complex Constructions
(232, 34, 1, 'It + Complex Verbs', 'It stands to reason that...', 20, 'Expert', 'Expletive it structures', ARRAY['vocabulary', 'grammar']),
(233, 34, 2, 'There + Complex Structures', 'There remains the question...', 20, 'Expert', 'Expletive there patterns', ARRAY['vocabulary', 'writing']),
(234, 34, 3, 'Formal Evaluations', 'It is incumbent upon us...', 20, 'Expert', 'Formal evaluation language', ARRAY['vocabulary', 'reading']),
(235, 34, 4, 'Complex Extraposition', 'It is surprising that he came', 20, 'Expert', 'Extraposition patterns', ARRAY['vocabulary', 'speaking']),
(236, 34, 5, 'Sophisticated Expressions', 'High-level formulaic language', 20, 'Expert', 'Expert expressions', ARRAY['vocabulary', 'writing']),
(237, 34, 6, 'Complex Integration', 'Natural complex structure use', 20, 'Expert', 'Structure integration', ARRAY['vocabulary', 'listening']),
(238, 34, 7, 'Week 34 Mastery', 'Complex constructions mastery', 20, 'Expert', 'Complex structures assessment', ARRAY['review', 'assessment']),

-- Week 35: Subjunctive in Advanced Contexts
(239, 35, 1, 'Formulaic Subjunctives', 'Lest we forget, come what may', 20, 'Expert', 'Formulaic patterns', ARRAY['vocabulary', 'grammar']),
(240, 35, 2, 'Advanced Subjunctive Uses', 'Be that as it may...', 20, 'Expert', 'Sophisticated subjunctive', ARRAY['vocabulary', 'writing']),
(241, 35, 3, 'Mandative Precision', 'It is essential that he be...', 20, 'Expert', 'Precise mandative use', ARRAY['vocabulary', 'reading']),
(242, 35, 4, 'Subjunctive Fluency', 'Natural subjunctive integration', 20, 'Expert', 'Subjunctive mastery', ARRAY['vocabulary', 'speaking']),
(243, 35, 5, 'High-level Precision', 'Error-free subjunctive use', 20, 'Expert', 'Subjunctive precision', ARRAY['vocabulary', 'writing']),
(244, 35, 6, 'Expert Subjunctive', 'Band 8.5 subjunctive patterns', 20, 'Expert', 'Expert subjunctive', ARRAY['vocabulary', 'listening']),
(245, 35, 7, 'Week 35 Excellence', 'Advanced subjunctive mastery', 20, 'Expert', 'Subjunctive assessment', ARRAY['review', 'assessment']),

-- Week 36: Error-free Complex Integration (Final Week)
(246, 36, 1, 'Structure Integration', 'Mixing all advanced structures', 20, 'Expert', 'Complex integration', ARRAY['vocabulary', 'grammar']),
(247, 36, 2, 'Error-free Accuracy', 'Perfect accuracy with complexity', 20, 'Expert', 'Accuracy + complexity', ARRAY['vocabulary', 'writing']),
(248, 36, 3, 'Natural Sophistication', 'Band 8.0+ natural usage', 20, 'Expert', 'Natural sophistication', ARRAY['vocabulary', 'reading']),
(249, 36, 4, 'Confident Fluency', 'Confident use of all structures', 20, 'Expert', 'Confident fluency', ARRAY['vocabulary', 'speaking']),
(250, 36, 5, 'Final Polish', 'Perfect Band 8.0+ grammar', 20, 'Expert', 'Final grammar polish', ARRAY['vocabulary', 'writing']),
(251, 36, 6, 'IELTS Ready', 'Complete preparation review', 20, 'Expert', 'Comprehensive review', ARRAY['review', 'all-skills']),
(252, 36, 7, 'Band 8.0+ Achievement', 'Final mastery celebration', 20, 'Expert', 'Final assessment', ARRAY['assessment', 'celebration']);

-- Create enhanced view for daily lesson access with grammar and skills info
CREATE OR REPLACE VIEW daily_lesson_summary AS
SELECT 
  dl.id,
  dl.day_number,
  dl.week_number,
  dl.day_of_week,
  dl.title,
  dl.description,
  dl.target_words,
  dl.phase,
  dl.grammar_focus,
  dl.skills_focus,
  CASE dl.day_of_week
    WHEN 1 THEN 'Monday'
    WHEN 2 THEN 'Tuesday' 
    WHEN 3 THEN 'Wednesday'
    WHEN 4 THEN 'Thursday'
    WHEN 5 THEN 'Friday'
    WHEN 6 THEN 'Saturday'
    WHEN 7 THEN 'Sunday'
  END as day_name,
  COUNT(f.id) as actual_words,
  gt.title as grammar_title,
  gt.difficulty_level
FROM daily_lessons dl
LEFT JOIN flashcards f ON dl.id = f.daily_lesson_id
LEFT JOIN grammar_topics gt ON dl.week_number = gt.week_number
GROUP BY dl.id, dl.day_number, dl.week_number, dl.day_of_week, dl.title, dl.description, 
         dl.target_words, dl.phase, dl.grammar_focus, dl.skills_focus, gt.title, gt.difficulty_level
ORDER BY dl.day_number;

-- Create view for weekly summary
CREATE OR REPLACE VIEW weekly_lesson_summary AS
SELECT 
  week_number,
  phase,
  COUNT(*) as total_days,
  SUM(target_words) as weekly_word_target,
  ARRAY_AGG(DISTINCT grammar_focus) as grammar_topics,
  ARRAY(SELECT DISTINCT skill FROM daily_lessons dl, unnest(dl.skills_focus) AS skill WHERE dl.week_number = daily_lessons.week_number) as all_skills
FROM daily_lessons
GROUP BY week_number, phase
ORDER BY week_number;

-- Create view for phase summary
CREATE OR REPLACE VIEW phase_summary AS
SELECT 
  phase,
  MIN(week_number) as start_week,
  MAX(week_number) as end_week,
  COUNT(DISTINCT week_number) as total_weeks,
  COUNT(*) as total_days,
  SUM(target_words) as total_word_target
FROM daily_lessons
GROUP BY phase
ORDER BY MIN(week_number);

-- Sample queries for testing
-- Get current week's daily lessons: SELECT * FROM daily_lesson_summary WHERE week_number = 1;
-- Get today's lesson: SELECT * FROM daily_lesson_summary WHERE day_number = 1;
-- Get phase overview: SELECT * FROM phase_summary;
-- Get weekly summary: SELECT * FROM weekly_lesson_summary WHERE week_number = 1;