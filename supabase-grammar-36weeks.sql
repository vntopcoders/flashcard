-- Complete 36-Week Grammar System for IELTS Band 8.0+
-- Extended from 24 weeks to include Band 8.0+ advanced structures

-- Clear existing data
DELETE FROM grammar_key_points;
DELETE FROM grammar_topics;
DELETE FROM study_resources;

-- Insert complete 36-week grammar topics
INSERT INTO grammar_topics (week_number, title, theory_vietnamese, difficulty_level, order_index) VALUES

-- FOUNDATION PHASE (Weeks 1-12) - Band 4.0 to 5.5
(1, 'Present Simple & Present Continuous', 'Thì hiện tại đơn và hiện tại tiếp diễn là nền tảng cơ bản nhất trong tiếng Anh. Present Simple diễn tả thói quen, sự thật hiển nhiên, lịch trình cố định. Present Continuous diễn tả hành động đang xảy ra tại thời điểm nói hoặc kế hoạch trong tương lai gần.', 1, 1),

(2, 'Modal Verbs (Can, Could, May, Might)', 'Động từ khuyết thiếu là những động từ đặc biệt diễn tả khả năng, sự cho phép, nghĩa vụ, lời khuyên. Chúng không chia theo ngôi, không có dạng -ing, -ed và luôn đi với động từ nguyên mẫu không "to".', 2, 1),

(3, 'Perfect Tenses (Present & Past Perfect)', 'Thì hoàn thành diễn tả mối liên hệ giữa hai thời điểm. Present Perfect nối quá khứ với hiện tại, Past Perfect diễn tả hành động xảy ra trước một thời điểm/hành động khác trong quá khứ.', 3, 1),

(4, 'Conditional Sentences (Types 0, 1, 2)', 'Câu điều kiện thể hiện những tình huống giả định và kết quả của chúng. Type 0: sự thật hiển nhiên, Type 1: có thể xảy ra, Type 2: không thể xảy ra ở hiện tại.', 3, 1),

(5, 'Passive Voice (Present & Past)', 'Câu bị động được dùng khi muốn nhấn mạnh đối tượng chịu tác động của hành động hơn là người thực hiện. Cấu trúc: S + be + V3 + (by + O).', 3, 1),

(6, 'Future Tenses (Will, Going to, Present Continuous)', 'Có nhiều cách diễn đạt tương lai: will (quyết định tức thì, dự đoán), be going to (kế hoạch, dự định), Present Continuous (lịch hẹn cố định).', 2, 1),

(7, 'Gerunds and Infinitives', 'Gerund (V-ing) và Infinitive (to V) là hai dạng động từ có thể làm chủ ngữ, tân ngữ. Một số động từ chỉ đi với gerund, một số chỉ đi với infinitive, một số đi với cả hai nhưng khác nghĩa.', 4, 1),

(8, 'Articles (A, An, The) and Quantifiers', 'Mạo từ xác định (the), không xác định (a/an) và các từ chỉ số lượng (some, any, much, many, few, little) rất quan trọng trong IELTS để thể hiện độ chính xác ngữ pháp.', 2, 1),

(9, 'Relative Clauses (Defining & Non-defining)', 'Mệnh đề quan hệ bổ sung thông tin cho danh từ. Defining clauses (không có dấu phẩy) cần thiết để xác định danh từ. Non-defining clauses (có dấu phẩy) chỉ bổ sung thông tin.', 4, 1),

(10, 'Reported Speech', 'Câu gián tiếp dùng để tường thuật lời nói của người khác. Cần chú ý đổi thì, đại từ, trạng từ chỉ thời gian và nơi chốn. Reporting verbs như say, tell, ask, suggest có cách dùng khác nhau.', 4, 1),

(11, 'Conditional Sentences (Type 3 & Mixed)', 'Conditional Type 3 diễn tả điều không thể xảy ra trong quá khứ. Mixed conditionals kết hợp các type khác nhau để diễn đạt các tình huống phức tạp hơn.', 5, 1),

(12, 'Subjunctive Mood', 'Thức giả định dùng trong các cấu trúc formal như "It is important that he be on time", "I wish I were rich", "If I were you". Quan trọng trong IELTS Writing Task 2.', 4, 1),

-- DEVELOPMENT PHASE (Weeks 13-24) - Band 5.5 to 6.5
(13, 'Advanced Passive Constructions', 'Các cấu trúc bị động phức tạp: have/get something done, passive with infinitives, passive reporting structures (It is said that..., He is said to...).', 4, 1),

(14, 'Inversion and Emphasis', 'Đảo ngữ để nhấn mạnh hoặc tạo phong cách formal: "Never have I seen...", "Not only...but also", "Should you need help...". Quan trọng trong IELTS Writing.', 5, 1),

(15, 'Participle Clauses', 'Mệnh đề phân từ giúp rút gọn câu và tạo sự liên kết: "Having finished his work, he went home", "The man standing there is my teacher".', 4, 1),

(16, 'Cleft Sentences', 'Câu chẻ để nhấn mạnh: "It was John who broke the window", "What I need is a good rest". Hữu ích trong IELTS Speaking và Writing để tạo emphasis.', 4, 1),

(17, 'Advanced Modal Verbs', 'Modal verbs phức tạp: modal + perfect infinitive (must have done, should have done), modal in the past (used to, would), degrees of certainty.', 5, 1),

(18, 'Nominalization', 'Danh từ hóa giúp câu văn academic hơn: "decide → decision", "analyze → analysis". Quan trọng trong IELTS Writing Task 2 để tăng band score.', 5, 1),

(19, 'Complex Sentence Structures', 'Cấu trúc câu phức tạp với nhiều mệnh đề: parallel structures, ellipsis, substitution. Giúp thể hiện ngữ pháp đa dạng trong IELTS.', 5, 1),

(20, 'Hedging and Qualifying Language', 'Ngôn ngữ thận trọng trong academic writing: "It seems that...", "It is likely that...", "There is a tendency to...". Essential cho IELTS Writing Task 2.', 4, 1),

(21, 'Coherence and Cohesion Devices', 'Các từ nối và cụm từ liên kết: furthermore, nevertheless, in addition to, as a result of. Quan trọng cho điểm Coherence & Cohesion trong IELTS Writing.', 4, 1),

(22, 'Advanced Verb Patterns', 'Các pattern động từ phức tạp: causative verbs (make, let, have, get), verb + object + infinitive, verb + gerund patterns với nghĩa khác nhau.', 5, 1),

(23, 'Formal vs Informal Language', 'Phân biệt register: formal language cho Writing, informal cho Speaking Part 1, semi-formal cho letters. Phrasal verbs vs Latin-based verbs.', 4, 1),

(24, 'Error Analysis and Polish', 'Tổng hợp các lỗi grammar thường gặp trong IELTS: subject-verb agreement, article usage, preposition errors, word order, dangling modifiers.', 3, 1),

-- MASTERY PHASE (Weeks 25-32) - Band 6.5 to 7.5+
(25, 'Reduced Relative Clauses & Ellipsis', 'Rút gọn mệnh đề quan hệ và lược bỏ: "The man (who is) standing there", "While (I was) studying, I heard a noise". Tạo sự súc tích trong academic writing.', 6, 1),

(26, 'Complex Participle Constructions', 'Cấu trúc phân từ phức tạp và absolute constructions: "Weather permitting, we will go", "The meeting having ended, everyone left". Band 7.5+ structures.', 6, 1),

(27, 'Advanced Inversion Patterns', 'Đảo ngữ phức tạp: "Rarely do we see...", "Under no circumstances should you...", "Had I known...", "So impressive was the performance that...". Band 8.0 sophistication.', 6, 1),

(28, 'Sophisticated Conditional Structures', 'Điều kiện phức tạp: "Were he to arrive...", "Should the weather improve...", "But for your help...", mixed conditionals với nuanced meanings.', 6, 1),

(29, 'Academic Hedging & Precision Language', 'Ngôn ngữ học thuật tinh tế: "It would appear that...", "There is a growing body of evidence to suggest...", "One might argue that...". Essential cho Band 8.0.', 6, 1),

(30, 'Complex Prepositions & Phrases', 'Giới từ và cụm từ phức tạp: "in view of", "with regard to", "in the light of", "by virtue of". Tăng sophistication trong writing.', 5, 1),

(31, 'Discourse Markers & Cohesion', 'Các từ nối tinh tế: "That said", "Be that as it may", "Granted that", "Notwithstanding". Advanced linking cho Band 8.0.', 6, 1),

(32, 'Register Variation & Style', 'Biến đổi register thành thạo: formal academic, semi-formal professional, informal conversational. Chọn style phù hợp với từng task.', 5, 1),

-- EXPERT PHASE (Weeks 33-36) - Band 8.0 to 8.5+
(33, 'Fronting & Left Dislocation', 'Đưa thành phần lên đầu câu để nhấn mạnh: "This problem, we must address immediately", "Intelligent though he is, he lacks experience". Band 8.0+ emphasis.', 7, 1),

(34, 'Expletive & Complex Constructions', 'Cấu trúc it/there phức tạp: "It stands to reason that...", "There remains the question of...", "It is incumbent upon us to...". Sophisticated expressions.', 7, 1),

(35, 'Subjunctive in Advanced Contexts', 'Thức giả định trong ngữ cảnh phức tạp: "Lest we forget", "Come what may", "Be that as it may", formulaic subjunctives. Band 8.5 precision.', 7, 1),

(36, 'Error-free Complex Integration', 'Tích hợp tất cả cấu trúc phức tạp không lỗi: mixing advanced structures naturally, maintaining accuracy while showing range. Final Band 8.5+ polish.', 6, 1);

-- Insert key points for Foundation Phase (Weeks 1-12)
-- Week 1: Present Simple & Present Continuous
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Present Simple: S + V/V-s/es - thói quen, sự thật, lịch trình', 'I work every day. The sun rises in the east. The train leaves at 9 AM.', 1
FROM grammar_topics WHERE week_number = 1;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Present Continuous: S + am/is/are + V-ing - hành động đang diễn ra, kế hoạch tương lai', 'I am working now. We are meeting tomorrow at 3 PM.', 2
FROM grammar_topics WHERE week_number = 1;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Stative verbs không dùng continuous: know, love, hate, believe, understand', 'I know the answer (NOT: I am knowing). She loves chocolate.', 3
FROM grammar_topics WHERE week_number = 1;

-- Week 25: Reduced Relative Clauses & Ellipsis (NEW - Band 7.5+)
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Reduced relative clauses với -ing: rút gọn mệnh đề quan hệ chủ động', 'The man standing there is my teacher. (= The man who is standing there)', 1
FROM grammar_topics WHERE week_number = 25;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Reduced relative clauses với -ed: rút gọn mệnh đề quan hệ bị động', 'The book written by Shakespeare is famous. (= The book which was written by)', 2
FROM grammar_topics WHERE week_number = 25;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Ellipsis trong time clauses: lược bỏ chủ ngữ và be', 'While studying, I heard a noise. (= While I was studying)', 3
FROM grammar_topics WHERE week_number = 25;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Ellipsis trong comparison: tránh lặp lại', 'She is more intelligent than he (is). I can swim better than you (can).', 4
FROM grammar_topics WHERE week_number = 25;

-- Week 26: Complex Participle Constructions (NEW - Band 8.0)
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Absolute constructions: cấu trúc phân từ độc lập', 'Weather permitting, we will have the picnic. The meeting having ended, everyone left.', 1
FROM grammar_topics WHERE week_number = 26;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Participle phrases expressing cause: diễn đạt nguyên nhân', 'Being tired, he went to bed early. Having finished his work, he relaxed.', 2
FROM grammar_topics WHERE week_number = 26;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Participle phrases expressing condition: diễn đạt điều kiện', 'Speaking frankly, I disagree. Considering his age, he did well.', 3
FROM grammar_topics WHERE week_number = 26;

-- Week 27: Advanced Inversion Patterns (NEW - Band 8.0)
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Inversion với negative adverbs: Never, Rarely, Seldom', 'Never have I seen such beauty. Rarely do we encounter such problems.', 1
FROM grammar_topics WHERE week_number = 27;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Inversion với "So/Such": nhấn mạnh mức độ', 'So beautiful was she that everyone stared. Such was his anger that he left.', 2
FROM grammar_topics WHERE week_number = 27;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Inversion trong conditionals: Had, Were, Should', 'Had I known, I would have come. Were he here, things would be different.', 3
FROM grammar_topics WHERE week_number = 27;

-- Week 28: Sophisticated Conditional Structures (NEW - Band 8.0)
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Were to + infinitive: điều kiện formal', 'Were the company to expand, we would need more staff.', 1
FROM grammar_topics WHERE week_number = 28;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'But for + noun: nếu không có (thay thế if)', 'But for your help, I would have failed. (= If it had not been for your help)', 2
FROM grammar_topics WHERE week_number = 28;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Mixed conditionals phức tạp: kết hợp thời gian khác nhau', 'If she had studied harder (past), she would be successful now (present).', 3
FROM grammar_topics WHERE week_number = 28;

-- Week 29: Academic Hedging & Precision Language (NEW - Band 8.0)
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Tentative language: It would appear/seem that', 'It would appear that the results support our hypothesis.', 1
FROM grammar_topics WHERE week_number = 29;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Qualifying statements: There is evidence to suggest', 'There is growing evidence to suggest that climate change is accelerating.', 2
FROM grammar_topics WHERE week_number = 29;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Academic caution: One might argue that', 'One might argue that technology has both benefits and drawbacks.', 3
FROM grammar_topics WHERE week_number = 29;

-- Week 30: Complex Prepositions & Phrases (NEW - Band 7.5+)
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'In view of / In light of: xem xét, căn cứ vào', 'In view of recent developments, we must reconsider our strategy.', 1
FROM grammar_topics WHERE week_number = 30;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'With regard to / In relation to: liên quan đến', 'With regard to your inquiry, we are pleased to inform you that...', 2
FROM grammar_topics WHERE week_number = 30;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'By virtue of / On account of: nhờ vào, do', 'By virtue of his experience, he was promoted quickly.', 3
FROM grammar_topics WHERE week_number = 30;

-- Week 31: Discourse Markers & Cohesion (NEW - Band 8.0)
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'That said / Having said that: tuy nhiên, mặc dù vậy', 'The plan has merit. That said, there are several concerns to address.', 1
FROM grammar_topics WHERE week_number = 31;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Be that as it may: dù sao đi nữa', 'Be that as it may, we must proceed with the original plan.', 2
FROM grammar_topics WHERE week_number = 31;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Granted that / Admittedly: thừa nhận rằng', 'Granted that the evidence is limited, the conclusion seems reasonable.', 3
FROM grammar_topics WHERE week_number = 31;

-- Week 32: Register Variation & Style (NEW - Band 8.0)
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Formal academic register: sophisticated vocabulary', 'The data demonstrates → The findings substantiate / corroborate', 1
FROM grammar_topics WHERE week_number = 32;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Semi-formal professional: balanced tone', 'I am writing to inquire about → I would like to inquire regarding', 2
FROM grammar_topics WHERE week_number = 32;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Register mixing: combining formal/informal appropriately', 'While the research is compelling (formal), it raises some questions (neutral).', 3
FROM grammar_topics WHERE week_number = 32;

-- Week 33: Fronting & Left Dislocation (NEW - Band 8.5)
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Fronting for emphasis: đưa tân ngữ lên đầu', 'This problem, we must address immediately. These results, we cannot ignore.', 1
FROM grammar_topics WHERE week_number = 33;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Left dislocation: tách thành phần ra để nhấn mạnh', 'That book, I have never read it. The solution, we need to find it quickly.', 2
FROM grammar_topics WHERE week_number = 33;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Concessive fronting: nhường bộ ở đầu câu', 'Intelligent though he is, he lacks experience. Rich as they are, they are unhappy.', 3
FROM grammar_topics WHERE week_number = 33;

-- Week 34: Expletive & Complex Constructions (NEW - Band 8.5)
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'It + sophisticated verbs: It stands to reason', 'It stands to reason that prices will increase. It behoves us to consider all options.', 1
FROM grammar_topics WHERE week_number = 34;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'There + complex structures: There remains', 'There remains the question of funding. There exists a fundamental problem.', 2
FROM grammar_topics WHERE week_number = 34;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'It + be + adjective + that: formal evaluation', 'It is incumbent upon us to act. It is imperative that we respond quickly.', 3
FROM grammar_topics WHERE week_number = 34;

-- Week 35: Subjunctive in Advanced Contexts (NEW - Band 8.5)
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Formulaic subjunctives: Lest, Come what may', 'Lest we forget the lessons of history. Come what may, we will persevere.', 1
FROM grammar_topics WHERE week_number = 35;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Subjunctive với sophisticated expressions', 'Be that as it may, we must proceed. Suffice it to say that we disagree.', 2
FROM grammar_topics WHERE week_number = 35;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Mandative subjunctive: formal requirements', 'It is essential that he be present. We demand that the policy be changed.', 3
FROM grammar_topics WHERE week_number = 35;

-- Week 36: Error-free Complex Integration (NEW - Band 8.5+)
INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Mixing advanced structures naturally', 'Having considered the evidence (participle), it would appear that (hedging) the conclusion, sophisticated though it may be (fronting), merits further investigation.', 1
FROM grammar_topics WHERE week_number = 36;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Maintaining accuracy với complex grammar', 'Error-free usage của tất cả cấu trúc Band 8.0+ trong context tự nhiên', 2
FROM grammar_topics WHERE week_number = 36;

INSERT INTO grammar_key_points (grammar_topic_id, point_vietnamese, example_sentence, order_index) 
SELECT id, 'Final polish: confidence và fluency', 'Seamless integration của advanced grammar cho Band 8.5+ performance', 3
FROM grammar_topics WHERE week_number = 36;