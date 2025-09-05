import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Reputable IELTS listening sources data
const REPUTABLE_LISTENING_TESTS = [
  // British Council Official Practice Tests
  {
    title: 'British Council - Academic English Practice Test 1',
    audio_transcript: `Part 1: University Course Registration
Advisor: Good morning, welcome to the University Registration Office. How can I help you today?
Student: Hi, I'm here to register for courses for the upcoming semester. I'm majoring in Environmental Science.
Advisor: Great! Let me check what's available. What year are you in?
Student: I'm starting my second year, so I need some intermediate level courses.
Advisor: Perfect. We have Environmental Chemistry starting on September 15th, Tuesdays and Thursdays from 2 to 4 PM.
Student: That sounds good. What's the course code?
Advisor: It's ENV 201. The professor is Dr. Sarah Mitchell, and the textbook costs about 85 pounds.

Part 2: Campus Facilities Tour
Welcome to Greenwood University campus tour. I'm James Parker, your student guide today. 
Our campus spans 150 acres and serves over 15,000 students. The main library, built in 1987, houses over 2 million books and is open 24 hours during exam periods. 
The Student Union building offers various dining options including a vegetarian café, pizza corner, and the main cafeteria which serves hot meals from 7 AM to 9 PM.
The sports complex includes an Olympic-size swimming pool, tennis courts, and a fully equipped gymnasium. Students can use these facilities for free with their student ID.

Part 3: Study Group Discussion - Climate Change Research
Professor: Today we'll discuss your research proposals on climate change impacts.
Sarah: Our group is focusing on coastal erosion in the UK. We've collected data from 12 different locations.
Professor: That's comprehensive. What methodology are you using?
Tom: We're combining satellite imagery analysis with on-site measurements taken every three months.
Professor: Excellent approach. What about your timeline?
Sarah: We plan to complete data collection by March, analysis by May, and final report by June.
Professor: Make sure to include statistical analysis and peer review of your findings.

Part 4: Lecture - Renewable Energy Technologies
Today's lecture covers the latest developments in renewable energy. Solar panel efficiency has improved dramatically, reaching 26% in commercial applications. Wind turbines now generate electricity at competitive costs in many regions.
Hydroelectric power remains the most established renewable source, providing 16% of global electricity. However, environmental concerns about dam construction limit expansion opportunities.
Battery storage technology is crucial for renewable integration. Lithium-ion costs have dropped 85% since 2010, making grid-scale storage economically viable.
The future lies in smart grids that can balance supply and demand automatically using artificial intelligence and real-time data monitoring.`,
    duration: 1800,
    difficulty: 'intermediate',
    test_type: 'official_practice',
    description: 'Đề luyện tập chính thức từ British Council, tập trung vào chủ đề học thuật và đời sống sinh viên.',
    instructions: `Hướng dẫn từ British Council:
• Nghe mỗi đoạn audio MỘT LẦN duy nhất
• Đọc kỹ câu hỏi và dự đoán câu trả lời
• Chú ý từ khóa và từ đồng nghĩa
• Viết câu trả lời rõ ràng, chính xác chính tả
• Kiểm tra lại tất cả câu trả lời cuối bài`,
    source_url: 'https://www.britishcouncil.org',
    questions: [
      {
        part_number: 1,
        question_number: 1,
        question_type: 'fill_blank',
        question_text: 'The student is majoring in _______ Science.',
        correct_answer: 'Environmental',
        explanation: 'Sinh viên đang học chuyên ngành Environmental Science.',
        audio_timestamp: 25,
        points: 1
      },
      {
        part_number: 1,
        question_number: 2,
        question_type: 'fill_blank',
        question_text: 'The course code is _______.',
        correct_answer: 'ENV 201',
        explanation: 'Mã môn học là ENV 201.',
        audio_timestamp: 85,
        points: 1
      },
      {
        part_number: 1,
        question_number: 3,
        question_type: 'fill_blank',
        question_text: 'Classes are on _______ and Thursdays.',
        correct_answer: 'Tuesdays',
        explanation: 'Lớp học diễn ra vào thứ Ba và thứ Năm.',
        audio_timestamp: 75,
        points: 1
      }
    ]
  },
  {
    title: 'Cambridge Assessment - IELTS Practice Test Academic',
    audio_transcript: `Part 1: Library Information Service
Librarian: Good afternoon, this is the University Library. How may I assist you?
Student: Hi, I'm calling about renewing my library membership. It expires next week.
Librarian: Of course. Can you provide your student ID number?
Student: Yes, it's 2023ST4891.
Librarian: Thank you. I see your membership expires on October 15th. The renewal fee is 25 pounds for students.
Student: That's fine. Can I pay online?
Librarian: Yes, you can pay through our website or in person at the library desk.

Part 2: Museum Exhibition Guide
Good evening, and welcome to the National Science Museum's new exhibition "Future Technologies". 
This exhibition showcases innovations expected to transform our daily lives within the next decade.
The exhibition covers four main areas: artificial intelligence, biotechnology, sustainable energy, and space exploration.
Interactive displays allow visitors to experience virtual reality demonstrations and hands-on experiments.
The exhibition runs until December 31st and is open Tuesday to Sunday, 10 AM to 6 PM. Adult tickets cost 12 pounds, students pay 8 pounds with valid ID.

Part 3: Academic Seminar - Research Methodology
Dr. Smith: Let's discuss your research project proposals. What's your chosen topic, Maria?
Maria: I'm researching the impact of social media on teenage mental health.
Dr. Smith: That's very relevant. What research methods will you use?
Maria: I plan to use surveys and interviews. The survey will reach 500 participants aged 13-19.
Dr. Smith: Excellent sample size. How will you ensure ethical compliance?
Maria: All participants will provide consent, and data will be anonymized for analysis.
Dr. Smith: Good. What's your expected completion date?
Maria: I aim to finish data collection by February and complete analysis by April.

Part 4: Economics Lecture - Global Trade Patterns
Today we examine how global trade has evolved over the past century.
International trade volume has increased 40-fold since 1913, driven by technological advances and policy changes.
Container shipping revolutionized freight transport, reducing costs by 90% between 1960 and 2000.
Digital communication enables instant coordination between suppliers and buyers worldwide.
However, recent trends show regionalization, with countries trading more within their geographic regions.
Trade agreements like NAFTA and the European Union have created preferential trading zones.
The COVID-19 pandemic highlighted supply chain vulnerabilities, prompting companies to diversify suppliers and maintain larger inventories.`,
    duration: 1800,
    difficulty: 'advanced',
    test_type: 'official_practice',
    description: 'Đề thi thực hành từ Cambridge, tập trung vào kỹ năng academic listening với độ khó cao.',
    instructions: `Cambridge IELTS Instructions:
• Thời gian nghe: 30 phút (không tính thời gian chuyển đáp án)
• Mỗi phần chỉ phát MỘT LẦN
• Đọc trước câu hỏi để chuẩn bị
• Viết câu trả lời trong khi nghe
• Chính tả phải chính xác 100%
• Không sử dụng từ viết tắt`,
    source_url: 'https://www.cambridge.org',
    questions: [
      {
        part_number: 1,
        question_number: 1,
        question_type: 'fill_blank',
        question_text: 'Student ID number: _______',
        correct_answer: '2023ST4891',
        explanation: 'Số thẻ sinh viên là 2023ST4891.',
        audio_timestamp: 30,
        points: 1
      },
      {
        part_number: 1,
        question_number: 2,
        question_type: 'fill_blank',
        question_text: 'Membership expires on October _______.',
        correct_answer: '15th',
        explanation: 'Thẻ thư viện hết hạn vào ngày 15 tháng 10.',
        audio_timestamp: 45,
        points: 1
      },
      {
        part_number: 2,
        question_number: 6,
        question_type: 'fill_blank',
        question_text: 'The exhibition covers _______ main areas.',
        correct_answer: 'four',
        explanation: 'Triển lãm bao gồm bốn lĩnh vực chính.',
        audio_timestamp: 180,
        points: 1
      }
    ]
  },
  {
    title: 'IELTS Liz - Academic Listening Skills Practice',
    audio_transcript: `Part 1: Course Selection Consultation
Counselor: Welcome to Academic Planning Services. I'm here to help you choose the right courses.
Student: Thank you. I need to select electives for my Business degree.
Counselor: What areas interest you most?
Student: I'm particularly interested in digital marketing and international business.
Counselor: Perfect. We have "Digital Marketing Strategies" on Mondays and Wednesdays, 10 to 12.
Student: What about prerequisites?
Counselor: You need to have completed Marketing Fundamentals with a grade of B or higher.
Student: I got an A in that course last semester.

Part 2: University Campus Safety Briefing
Good morning, new students. I'm Officer Johnson from Campus Security.
Our campus safety program includes 24-hour security patrols, emergency call boxes every 100 meters, and a mobile safety app.
The app allows you to request escort services, report incidents, and receive emergency alerts.
Well-lit pathways connect all major buildings, and security cameras monitor common areas.
If you feel unsafe, never hesitate to call our emergency number: 555-SAFE.
Safety workshops are held monthly in the Student Center, covering personal safety, online security, and emergency procedures.

Part 3: Research Group Discussion - Sustainable Development
Professor: Let's review your group project progress on sustainable urban development.
Alex: We've identified three key challenges: transportation, waste management, and energy consumption.
Professor: Good analysis. What solutions are you proposing?
Sophie: For transportation, we suggest expanding public transit and creating bike-sharing programs.
Professor: How will you measure the environmental impact?
Alex: We'll use carbon footprint calculations and compare with current emission levels.
Professor: Remember to include economic feasibility in your final recommendations.

Part 4: Lecture - Artificial Intelligence in Healthcare
Artificial intelligence is revolutionizing healthcare delivery and patient outcomes.
Machine learning algorithms can analyze medical images with 95% accuracy, often outperforming human radiologists.
Natural language processing helps extract insights from electronic health records, identifying patterns invisible to human analysis.
Predictive analytics can forecast disease outbreaks and hospital resource needs up to six months in advance.
However, ethical concerns include patient privacy, algorithm bias, and the need for human oversight in critical decisions.
Implementation requires substantial investment in technology infrastructure and staff training.
The integration of AI must maintain the human element that patients value in healthcare relationships.`,
    duration: 1800,
    difficulty: 'intermediate',
    test_type: 'skill_practice',
    description: 'Bài luyện tập từ IELTS Liz, tập trung vào các kỹ năng nghe cần thiết cho IELTS Academic.',
    instructions: `IELTS Liz Study Tips:
• Luyện tập prediction skills trước khi nghe
• Chú ý paraphrasing và synonyms
• Thực hành note-taking hiệu quả
• Đừng panic nếu miss một câu trả lời
• Focus vào câu tiếp theo ngay lập tức
• Practice với different accents`,
    source_url: 'https://ieltsliz.com',
    questions: [
      {
        part_number: 1,
        question_number: 1,
        question_type: 'multiple_choice',
        question_text: 'What is the student studying?',
        options: ['Marketing', 'Business', 'Digital Media', 'International Relations'],
        correct_answer: 'B',
        explanation: 'Sinh viên đang học ngành Business.',
        audio_timestamp: 20,
        points: 1
      },
      {
        part_number: 1,
        question_number: 2,
        question_type: 'fill_blank',
        question_text: 'Classes are on Mondays and _______, 10 to 12.',
        correct_answer: 'Wednesdays',
        explanation: 'Lớp học diễn ra vào thứ Hai và thứ Tư.',
        audio_timestamp: 55,
        points: 1
      }
    ]
  },
  {
    title: 'BBC Learning English - Academic Listening Masterclass',
    audio_transcript: `Part 1: Student Accommodation Office
Officer: Good morning, Student Housing Office. How can I help you?
Student: Hi, I'm looking for accommodation for next semester. I'm an international student.
Officer: Certainly. Are you interested in on-campus or off-campus housing?
Student: I prefer on-campus, somewhere quiet for studying.
Officer: I recommend Scholars Hall. It's a quiet residential building with single rooms.
Student: What facilities does it have?
Officer: Each room has WiFi, a desk, and access to shared kitchen and laundry facilities.
Student: How much does it cost per week?
Officer: It's 180 pounds per week, including utilities and internet.

Part 2: Study Skills Workshop Introduction
Welcome to today's study skills workshop on effective note-taking techniques.
Research shows that students who take organized notes retain 40% more information than those who don't.
We'll cover three main methods: the Cornell system, mind mapping, and digital note-taking tools.
The Cornell method divides your page into three sections: notes, cues, and summary.
Mind mapping works well for visual learners and helps connect related concepts.
Digital tools like OneNote and Notion offer search functionality and multimedia integration.
Remember, the best method is the one that matches your learning style and subject requirements.

Part 3: Academic Tutorial - Essay Writing Skills
Tutor: Let's discuss your essay structure and argument development.
Student: I'm struggling with creating strong thesis statements.
Tutor: A good thesis should be specific, arguable, and preview your main points.
Student: Can you give me an example?
Tutor: Instead of "Social media is bad," try "Social media contributes to anxiety among teenagers through constant comparison, cyberbullying, and sleep disruption."
Student: That's much clearer. What about body paragraphs?
Tutor: Each paragraph should have one main idea, supported by evidence and analysis.
Student: How many sources should I use?
Tutor: For a 2000-word essay, aim for 8-12 credible academic sources.

Part 4: Psychology Lecture - Memory and Learning
Human memory consists of three systems: sensory, short-term, and long-term memory.
Sensory memory holds information for milliseconds, filtering relevant stimuli for further processing.
Short-term memory can hold 7±2 items for approximately 20 seconds without rehearsal.
Long-term memory has virtually unlimited capacity and can store information permanently.
The process of encoding transfers information from short-term to long-term memory through rehearsal and association.
Retrieval is enhanced by creating multiple pathways to the same information through elaborative encoding.
Sleep plays a crucial role in memory consolidation, strengthening neural connections formed during learning.
Understanding these processes helps students develop more effective study strategies.`,
    duration: 1800,
    difficulty: 'advanced',
    test_type: 'skill_practice',
    description: 'Chương trình luyện nghe từ BBC Learning English, phát triển kỹ năng nghe học thuật toàn diện.',
    instructions: `BBC Learning English Guidelines:
• Focus on understanding main ideas first
• Practice identifying supporting details
• Develop prediction and inference skills
• Pay attention to discourse markers
• Build academic vocabulary gradually
• Practice with various English accents`,
    source_url: 'https://www.bbc.co.uk/learningenglish',
    questions: [
      {
        part_number: 1,
        question_number: 1,
        question_type: 'fill_blank',
        question_text: 'The accommodation costs _______ pounds per week.',
        correct_answer: '180',
        explanation: 'Chi phí thuê phòng là 180 pounds mỗi tuần.',
        audio_timestamp: 95,
        points: 1
      },
      {
        part_number: 2,
        question_number: 6,
        question_type: 'fill_blank',
        question_text: 'Students who take organized notes retain _______% more information.',
        correct_answer: '40',
        explanation: 'Sinh viên ghi chú có tổ chức sẽ nhớ được nhiều hơn 40% thông tin.',
        audio_timestamp: 150,
        points: 1
      }
    ]
  }
]

// Original sample tests for backward compatibility
const SAMPLE_TESTS = [
  {
    title: 'IELTS Listening Practice Test 1',
    audio_transcript: `Part 1: Conversation - Photography Course Enrollment
Receptionist: Good morning, Community Learning Center. How can I help you?
Sarah: Hello, I'm calling about the photography classes. I saw your advertisement in the local newspaper.
Receptionist: Oh yes, our photography course. Are you a complete beginner?
Sarah: Well, I have a basic camera, but I really don't know how to use it properly. I'd like to learn the fundamentals.
Receptionist: Perfect. Our beginner's course starts next Monday. It runs for six weeks, every Monday from 7 to 9 PM.
Sarah: That sounds ideal. How much does it cost?
Receptionist: The course fee is 150 pounds, and that includes all materials and handouts.

Part 2: Monologue - National Botanical Gardens Tour
Good morning, and welcome to the National Botanical Gardens. I'm David Thompson, and I'll be your guide today. The National Botanical Gardens covers 85 hectares and houses over 12,000 different plant species from around the world. We're open every day from 9 AM to 6 PM, except on Christmas Day.

Part 3: Academic Discussion - Research Methods
Student A: I'm really struggling with choosing the right research method for our project.
Professor: Well, let's think about what you're trying to investigate. Are you looking at quantitative or qualitative data?
Student B: We want to understand student attitudes toward social media, so I think qualitative would be better.
Professor: That's a good start. You could use surveys for quantitative data and interviews for deeper insights.

Part 4: Academic Lecture - Archaeological Dating Methods  
Today we'll examine various dating techniques used in archaeology. Carbon dating can measure objects up to 50,000 years old. For more recent artifacts, dendrochronology is often the most accurate method. The advantage of mass spectrometry is that it works on very small samples.`,
    duration: 1800, // 30 minutes
    difficulty: 'intermediate',
    test_type: 'practice',
    description: 'Đề luyện tập cơ bản với 4 parts tiêu chuẩn IELTS, phù hợp cho người mới bắt đầu.',
    instructions: `Hướng dẫn làm bài:
• Bạn sẽ nghe mỗi đoạn audio CHỈ MỘT LẦN
• Đọc câu hỏi trước khi nghe
• Viết câu trả lời trong khi nghe
• Kiểm tra lại câu trả lời sau khi hoàn thành mỗi part
• Tổng thời gian: 30 phút (bao gồm 10 phút chuyển đáp án)`,
    questions: [
      // Part 1 Questions
      {
        part_number: 1,
        question_number: 1,
        question_type: 'fill_blank',
        question_text: 'What is the caller\'s name? _______',
        correct_answer: 'Sarah Johnson',
        explanation: 'Người gọi tự giới thiệu tên là Sarah Johnson ở phần đầu cuộc hội thoại.',
        audio_timestamp: 15,
        points: 1
      },
      {
        part_number: 1,
        question_number: 2,
        question_type: 'fill_blank',
        question_text: 'The phone number is _______',
        correct_answer: '07-4456-7890',
        explanation: 'Số điện thoại được nhắc đến khi Sarah cung cấp thông tin liên lạc.',
        audio_timestamp: 45,
        points: 1
      },
      {
        part_number: 1,
        question_number: 3,
        question_type: 'multiple_choice',
        question_text: 'What time does the class start?',
        options: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM'],
        correct_answer: 'B',
        explanation: 'Lớp học bắt đầu lúc 9:30 AM như được thông báo trong cuộc hội thoại.',
        audio_timestamp: 75,
        points: 1
      },
      {
        part_number: 1,
        question_number: 4,
        question_type: 'fill_blank',
        question_text: 'The address is _______ Street',
        correct_answer: 'Victoria',
        explanation: 'Địa chỉ được đề cập là Victoria Street.',
        audio_timestamp: 105,
        points: 1
      },
      {
        part_number: 1,
        question_number: 5,
        question_type: 'multiple_choice',
        question_text: 'How much does the course cost?',
        options: ['$150', '$200', '$250', '$300'],
        correct_answer: 'C',
        explanation: 'Giá khóa học là $250 như được thông báo.',
        audio_timestamp: 135,
        points: 1
      },

      // Part 2 Questions
      {
        part_number: 2,
        question_number: 6,
        question_type: 'multiple_choice',
        question_text: 'What is the main topic of the talk?',
        options: ['Local history', 'Tourism', 'Environmental protection', 'City planning'],
        correct_answer: 'C',
        explanation: 'Chủ đề chính của bài nói là về bảo vệ môi trường.',
        audio_timestamp: 300,
        points: 1
      },
      {
        part_number: 2,
        question_number: 7,
        question_type: 'fill_blank',
        question_text: 'The park covers _______ hectares',
        correct_answer: '85',
        explanation: 'Công viên có diện tích 85 hecta.',
        audio_timestamp: 330,
        points: 1
      },
      {
        part_number: 2,
        question_number: 8,
        question_type: 'multiple_choice',
        question_text: 'Which activity is NOT mentioned?',
        options: ['Hiking', 'Bird watching', 'Swimming', 'Cycling'],
        correct_answer: 'C',
        explanation: 'Swimming không được đề cập trong các hoạt động.',
        audio_timestamp: 360,
        points: 1
      },
      {
        part_number: 2,
        question_number: 9,
        question_type: 'fill_blank',
        question_text: 'The visitor center is open until _______ PM',
        correct_answer: '6',
        explanation: 'Trung tâm du khách mở cửa đến 6 giờ chiều.',
        audio_timestamp: 390,
        points: 1
      },
      {
        part_number: 2,
        question_number: 10,
        question_type: 'multiple_choice',
        question_text: 'What should visitors bring?',
        options: ['Comfortable shoes', 'Warm clothes', 'Sunscreen', 'All of the above'],
        correct_answer: 'D',
        explanation: 'Tất cả các vật dụng trên đều được khuyến khích mang theo.',
        audio_timestamp: 420,
        points: 1
      },

      // Part 3 Questions
      {
        part_number: 3,
        question_number: 11,
        question_type: 'multiple_choice',
        question_text: 'What is the students\' main concern?',
        options: ['The deadline', 'The research method', 'The topic choice', 'The presentation format'],
        correct_answer: 'A',
        explanation: 'Mối quan tâm chính của sinh viên là về deadline.',
        audio_timestamp: 600,
        points: 1
      },
      {
        part_number: 3,
        question_number: 12,
        question_type: 'fill_blank',
        question_text: 'The professor suggests using _______ sources',
        correct_answer: 'primary',
        explanation: 'Giáo sư gợi ý sử dụng nguồn tài liệu primary (nguồn chính).',
        audio_timestamp: 630,
        points: 1
      },
      {
        part_number: 3,
        question_number: 13,
        question_type: 'multiple_choice',
        question_text: 'How long should the presentation be?',
        options: ['10 minutes', '15 minutes', '20 minutes', '25 minutes'],
        correct_answer: 'C',
        explanation: 'Bài thuyết trình nên dài 20 phút.',
        audio_timestamp: 660,
        points: 1
      },
      {
        part_number: 3,
        question_number: 14,
        question_type: 'matching',
        question_text: 'Match the student with their responsibility:',
        options: ['Research', 'Data analysis', 'Presentation slides', 'Bibliography'],
        correct_answer: 'Research',
        explanation: 'Sinh viên này chịu tr책nhiệm phần nghiên cứu.',
        audio_timestamp: 690,
        points: 1
      },
      {
        part_number: 3,
        question_number: 15,
        question_type: 'fill_blank',
        question_text: 'The final draft is due on _______',
        correct_answer: 'Friday',
        explanation: 'Bản thảo cuối cùng phải nộp vào thứ Sáu.',
        audio_timestamp: 720,
        points: 1
      },

      // Part 4 Questions
      {
        part_number: 4,
        question_number: 16,
        question_type: 'multiple_choice',
        question_text: 'What is the lecture mainly about?',
        options: ['Ancient civilizations', 'Archaeological methods', 'Historical artifacts', 'Museum collections'],
        correct_answer: 'B',
        explanation: 'Bài giảng chủ yếu về các phương pháp khảo cổ học.',
        audio_timestamp: 900,
        points: 1
      },
      {
        part_number: 4,
        question_number: 17,
        question_type: 'fill_blank',
        question_text: 'Carbon dating can measure objects up to _______ years old',
        correct_answer: '50000|50,000',
        explanation: 'Phương pháp carbon dating có thể đo các vật thể lên đến 50,000 năm tuổi.',
        audio_timestamp: 930,
        points: 1
      },
      {
        part_number: 4,
        question_number: 18,
        question_type: 'multiple_choice',
        question_text: 'Which technique is most accurate for recent artifacts?',
        options: ['Carbon dating', 'Stratigraphy', 'Thermoluminescence', 'Dendrochronology'],
        correct_answer: 'D',
        explanation: 'Dendrochronology là kỹ thuật chính xác nhất cho các hiện vật gần đây.',
        audio_timestamp: 960,
        points: 1
      },
      {
        part_number: 4,
        question_number: 19,
        question_type: 'fill_blank',
        question_text: 'The advantage of _______ is that it works on very small samples',
        correct_answer: 'mass spectrometry',
        explanation: 'Ưu điểm của mass spectrometry là có thể hoạt động với mẫu rất nhỏ.',
        audio_timestamp: 990,
        points: 1
      },
      {
        part_number: 4,
        question_number: 20,
        question_type: 'multiple_choice',
        question_text: 'What does the professor recommend for future research?',
        options: ['More funding', 'Better equipment', 'Combining multiple methods', 'Training more researchers'],
        correct_answer: 'C',
        explanation: 'Giáo sư khuyến nghị kết hợp nhiều phương pháp cho nghiên cứu tương lai.',
        audio_timestamp: 1020,
        points: 1
      }
    ]
  },
  {
    title: 'IELTS Listening Practice Test 2',
    audio_transcript: 'This is another sample listening test focusing on academic topics and formal conversations.',
    duration: 1800,
    difficulty: 'advanced',
    test_type: 'mock_exam',
    description: 'Đề thi thử nâng cao với độ khó tương đương đề thi thật, phù hợp cho mục tiêu Band 7.0+.',
    instructions: `Hướng dẫn làm bài:
• Đây là đề thi thử với độ khó cao
• Các từ vựng và chủ đề academic chiếm nhiều
• Tập trung cao độ khi nghe
• Chú ý các từ đồng nghĩa và cách diễn đạt khác nhau
• Thời gian: 30 phút + 10 phút chuyển đáp án`,
    questions: [
      // Simplified questions for Test 2
      {
        part_number: 1,
        question_number: 1,
        question_type: 'fill_blank',
        question_text: 'Customer\'s membership number: _______',
        correct_answer: 'GH4567',
        explanation: 'Số thành viên của khách hàng là GH4567.',
        audio_timestamp: 20,
        points: 1
      },
      {
        part_number: 1,
        question_number: 2,
        question_type: 'multiple_choice',
        question_text: 'What type of room does the customer want?',
        options: ['Single', 'Double', 'Twin', 'Suite'],
        correct_answer: 'C',
        explanation: 'Khách hàng muốn đặt phòng twin (2 giường đơn).',
        audio_timestamp: 50,
        points: 1
      },
      // Add more questions...
      {
        part_number: 2,
        question_number: 6,
        question_type: 'multiple_choice',
        question_text: 'What is the speaker\'s profession?',
        options: ['Teacher', 'Researcher', 'Consultant', 'Manager'],
        correct_answer: 'B',
        explanation: 'Người nói là một nhà nghiên cứu.',
        audio_timestamp: 300,
        points: 1
      }
    ]
  }
]

export async function POST(request: NextRequest) {
  try {
    console.log('Seeding listening test data...')

    let createdCount = 0
    const errors: string[] = []

    // Combine both reputable sources and sample tests
    const ALL_TESTS = [...REPUTABLE_LISTENING_TESTS, ...SAMPLE_TESTS]
    
    for (const testData of ALL_TESTS) {
      try {
        // Create the test
        const { data: test, error: testError } = await supabase
          .from('listening_tests')
          .insert([{
            title: testData.title,
            audio_transcript: testData.audio_transcript,
            duration: testData.duration,
            difficulty: testData.difficulty,
            test_type: testData.test_type,
            description: testData.description,
            instructions: testData.instructions,
            total_questions: testData.questions.length,
            // source_url: testData.source_url || null // TODO: Add after manual column creation
          }])
          .select()
          .single()

        if (testError) {
          errors.push(`Error creating test "${testData.title}": ${testError.message}`)
          continue
        }

        // Create questions for this test
        const questionsWithTestId = testData.questions.map(q => ({
          test_id: test.id,
          part_number: q.part_number,
          question_number: q.question_number,
          question_type: q.question_type,
          question_text: q.question_text,
          options: q.options || null,
          correct_answer: q.correct_answer,
          explanation: q.explanation || null,
          audio_timestamp: q.audio_timestamp || null,
          points: q.points || 1
        }))

        const { error: questionsError } = await supabase
          .from('listening_questions')
          .insert(questionsWithTestId)

        if (questionsError) {
          errors.push(`Error creating questions for "${testData.title}": ${questionsError.message}`)
          // Try to clean up the test
          await supabase.from('listening_tests').delete().eq('id', test.id)
          continue
        }

        createdCount++
        console.log(`✓ Created test: ${testData.title} with ${testData.questions.length} questions`)

      } catch (error) {
        const errorMsg = `Error processing test "${testData.title}": ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMsg)
        console.error(errorMsg)
      }
    }

    if (errors.length > 0) {
      console.log('Errors encountered:', errors)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdCount} listening tests`,
      created: createdCount,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Seed listening data error:', error)
    return NextResponse.json({
      error: 'Failed to seed listening data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET method to check existing data
export async function GET() {
  try {
    const { data: tests, error } = await supabase
      .from('listening_tests')
      .select('id, title, total_questions, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch tests', details: error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      tests: tests || [],
      count: tests?.length || 0
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check listening data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}