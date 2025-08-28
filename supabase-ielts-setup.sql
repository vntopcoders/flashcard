-- Add IPA column to flashcards table
ALTER TABLE flashcards ADD COLUMN ipa TEXT;

-- Delete existing sample data to create IELTS lessons
DELETE FROM flashcards;
DELETE FROM lessons;

-- Create IELTS lessons with more comprehensive coverage
INSERT INTO lessons (name, description, color) VALUES
('IELTS Level 1 (1-20)', 'IELTS Academic Wordlist - Level 1: Từ cơ bản nhất (1-20)', '#10B981'),
('IELTS Level 1 (21-40)', 'IELTS Academic Wordlist - Level 1: Từ cơ bản nhất (21-40)', '#059669'),
('IELTS Level 1 (41-60)', 'IELTS Academic Wordlist - Level 1: Từ cơ bản nhất (41-60)', '#047857'),
('IELTS Level 1 (61-80)', 'IELTS Academic Wordlist - Level 1: Từ cơ bản nhất (61-80)', '#065F46'),
('IELTS Level 1 (81-100)', 'IELTS Academic Wordlist - Level 1: Từ cơ bản nhất (81-100)', '#064E3B'),
('IELTS Level 2 (101-150)', 'IELTS Academic Wordlist - Level 2: Từ trung cấp (101-150)', '#3B82F6'),
('IELTS Level 2 (151-200)', 'IELTS Academic Wordlist - Level 2: Từ trung cấp (151-200)', '#2563EB'),
('IELTS Level 2 (201-250)', 'IELTS Academic Wordlist - Level 2: Từ trung cấp (201-250)', '#1D4ED8'),
('IELTS Level 3 (251-300)', 'IELTS Academic Wordlist - Level 3: Từ nâng cao (251-300)', '#7C2D12'),
('IELTS Level 3 (301-350)', 'IELTS Academic Wordlist - Level 3: Từ nâng cao (301-350)', '#92400E'),
('IELTS Level 4 (351-400)', 'IELTS Academic Wordlist - Level 4: Từ cao cấp (351-400)', '#BE185D'),
('IELTS Level 4 (401-450)', 'IELTS Academic Wordlist - Level 4: Từ cao cấp (401-450)', '#C2410C'),
('IELTS Level 5 (451-500)', 'IELTS Academic Wordlist - Level 5: Từ chuyên sâu (451-500)', '#7E22CE'),
('AWL Sublist 1', 'Academic Word List - Sublist 1: Từ học thuật quan trọng nhất', '#DC2626'),
('AWL Sublist 2', 'Academic Word List - Sublist 2: Từ học thuật cần thiết', '#EA580C');

-- Insert IELTS Level 1 vocabulary (1-20)
INSERT INTO flashcards (english, vietnamese, ipa, category, difficulty, lesson_id) VALUES
('achieve', 'đạt được, hoàn thành', '/əˈtʃiːv/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('administration', 'quản lý, hành chính', '/ədˌmɪnɪˈstreɪʃən/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('affect', 'ảnh hưởng', '/əˈfekt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('analysis', 'phân tích', '/əˈnæləsɪs/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('approach', 'tiếp cận, phương pháp', '/əˈproʊtʃ/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('appropriate', 'thích hợp, phù hợp', '/əˈproʊpriət/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('area', 'khu vực, lĩnh vực', '/ˈɛəriə/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('aspects', 'khía cạnh', '/ˈæspekts/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('assistance', 'hỗ trợ, giúp đỡ', '/əˈsɪstəns/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('assume', 'giả định, cho rằng', '/əˈsuːm/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('authority', 'quyền lực, cơ quan có thẩm quyền', '/əˈθɔːrəti/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('available', 'có sẵn, có thể có được', '/əˈveɪləbəl/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('benefit', 'lợi ích, có lợi', '/ˈbenəfɪt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('category', 'loại, hạng mục', '/ˈkætəˌɡɔːri/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('community', 'cộng đồng', '/kəˈmjuːnəti/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('complex', 'phức tạp', '/ˈkɑːmpleks/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('concerning', 'liên quan đến, về vấn đề', '/kənˈsɜːrnɪŋ/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('conclusion', 'kết luận', '/kənˈkluːʒən/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('conduct', 'tiến hành, thực hiện', '/kənˈdʌkt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)')),
('consequence', 'hậu quả', '/ˈkɑːnsəkwəns/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (1-20)'));

-- Insert IELTS Level 1 vocabulary (21-40)
INSERT INTO flashcards (english, vietnamese, ipa, category, difficulty, lesson_id) VALUES
('consistent', 'nhất quán, kiên định', '/kənˈsɪstənt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('constitutional', 'thuộc về hiến pháp', '/ˌkɑːnstəˈtuːʃənəl/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('consumer', 'người tiêu dùng', '/kənˈsuːmər/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('context', 'bối cảnh, ngữ cảnh', '/ˈkɑːntekst/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('create', 'tạo ra, sáng tạo', '/kriˈeɪt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('culture', 'văn hóa', '/ˈkʌltʃər/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('data', 'dữ liệu', '/ˈdeɪtə/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('definition', 'định nghĩa', '/ˌdefəˈnɪʃən/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('destructive', 'phá hoại, tàn phá', '/dɪˈstrʌktɪv/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('discovery', 'khám phá, phát hiện', '/dɪˈskʌvəri/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('distinction', 'sự phân biệt, khác biệt', '/dɪˈstɪŋkʃən/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('economic', 'kinh tế', '/ˌiːkəˈnɑːmɪk/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('element', 'yếu tố, nguyên tố', '/ˈeləmənt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('environment', 'môi trường', '/ɪnˈvaɪrənmənt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('error', 'lỗi, sai lầm', '/ˈerər/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('equation', 'phương trình', '/ɪˈkweɪʒən/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('establish', 'thiết lập, thành lập', '/ɪˈstæblɪʃ/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('estimate', 'ước tính', '/ˈestəmeɪt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('evaluation', 'đánh giá', '/ɪˌvæljuˈeɪʃən/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)')),
('evidence', 'bằng chứng', '/ˈevədəns/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (21-40)'));

-- Insert IELTS Level 1 vocabulary (41-60)
INSERT INTO flashcards (english, vietnamese, ipa, category, difficulty, lesson_id) VALUES
('factors', 'các yếu tố', '/ˈfæktərz/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('feature', 'đặc điểm, tính năng', '/ˈfiːtʃər/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('final', 'cuối cùng', '/ˈfaɪnəl/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('financial', 'tài chính', '/faɪˈnænʃəl/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('focus', 'tập trung', '/ˈfoʊkəs/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('function', 'chức năng, hoạt động', '/ˈfʌŋkʃən/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('global', 'toàn cầu', '/ˈɡloʊbəl/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('identify', 'nhận dạng, xác định', '/aɪˈdentəˌfaɪ/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('impact', 'tác động', '/ˈɪmpækt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('income', 'thu nhập', '/ˈɪnkʌm/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('indicate', 'chỉ ra, biểu thị', '/ˈɪndəkeɪt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('individual', 'cá nhân', '/ˌɪndəˈvɪdʒuəl/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('injury', 'chấn thương', '/ˈɪndʒəri/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('investment', 'đầu tư', '/ɪnˈvestmənt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('involve', 'liên quan, bao gồm', '/ɪnˈvɑːlv/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('issue', 'vấn đề', '/ˈɪʃuː/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('item', 'mục, món đồ', '/ˈaɪtəm/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('legal', 'pháp lý', '/ˈliːɡəl/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('maintenance', 'bảo trì, duy trì', '/ˈmeɪntənəns/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)')),
('major', 'chính, lớn', '/ˈmeɪdʒər/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (41-60)'));

-- Insert IELTS Level 1 vocabulary (61-80)
INSERT INTO flashcards (english, vietnamese, ipa, category, difficulty, lesson_id) VALUES
('media', 'truyền thông', '/ˈmiːdiə/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('method', 'phương pháp', '/ˈmeθəd/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('modern', 'hiện đại', '/ˈmɑːdərn/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('normal', 'bình thường', '/ˈnɔːrməl/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('obtain', 'có được, đạt được', '/əbˈteɪn/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('restrict', 'hạn chế', '/rɪˈstrɪkt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('occur', 'xảy ra', '/əˈkɜːr/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('participation', 'sự tham gia', '/pɑːrˌtɪsəˈpeɪʃən/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('percent', 'phần trăm', '/pərˈsent/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('period', 'thời kỳ', '/ˈpɪriəd/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('policy', 'chính sách', '/ˈpɑːləsi/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('positive', 'tích cực', '/ˈpɑːzətɪv/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('potential', 'tiềm năng', '/pəˈtenʃəl/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('previous', 'trước đó', '/ˈpriːviəs/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('primary', 'chính, cơ bản', '/ˈpraɪmeri/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('process', 'quá trình', '/ˈprɑːses/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('purchase', 'mua', '/ˈpɜːrtʃəs/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('range', 'phạm vi', '/reɪndʒ/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('recent', 'gần đây', '/ˈriːsənt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)')),
('region', 'vùng, khu vực', '/ˈriːdʒən/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (61-80)'));

-- Insert IELTS Level 1 vocabulary (81-100)
INSERT INTO flashcards (english, vietnamese, ipa, category, difficulty, lesson_id) VALUES
('regulations', 'quy định', '/ˌreɡjəˈleɪʃənz/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('relevant', 'liên quan', '/ˈreləvənt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('require', 'yêu cầu', '/rɪˈkwaɪər/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('research', 'nghiên cứu', '/rɪˈsɜːrtʃ/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('resident', 'cư dân', '/ˈrezədənt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('resources', 'tài nguyên', '/rɪˈsɔːrsɪz/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('response', 'phản ứng, đáp lại', '/rɪˈspɑːns/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('sector', 'lĩnh vực', '/ˈsektər/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('security', 'an ninh, bảo mật', '/sɪˈkjʊrəti/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('significant', 'đáng kể, quan trọng', '/sɪɡˈnɪfɪkənt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('similar', 'tương tự', '/ˈsɪmələr/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('solution', 'giải pháp', '/səˈluːʃən/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('source', 'nguồn', '/sɔːrs/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('specific', 'cụ thể', '/spəˈsɪfɪk/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('strategy', 'chiến lược', '/ˈstrætədʒi/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('structure', 'cấu trúc', '/ˈstrʌktʃər/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('theory', 'lý thuyết', '/ˈθɪri/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('threat', 'mối đe dọa', '/θret/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('traditional', 'truyền thống', '/trəˈdɪʃənəl/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)')),
('transport', 'vận chuyển', '/ˈtrænspɔːrt/', 'ielts', 1, (SELECT id FROM lessons WHERE name = 'IELTS Level 1 (81-100)'));

-- Create indexes for better performance on new columns
CREATE INDEX idx_flashcards_ipa ON flashcards(ipa);
