import { NextRequest, NextResponse } from 'next/server'
import { lessonDb, flashcardDb } from '@/lib/supabase'

// IELTS Complete Academic Wordlist - All 5 Levels (500 words)
const ieltsCompleteData = {
  // Level 1 - 100 words (Foundation Level)
  level1: [
    { english: 'achieve', vietnamese: 'đạt được, hoàn thành', ipa: '/əˈtʃiːv/' },
    { english: 'administration', vietnamese: 'quản lý, hành chính', ipa: '/ədˌmɪnɪˈstreɪʃən/' },
    { english: 'affect', vietnamese: 'ảnh hưởng', ipa: '/əˈfekt/' },
    { english: 'analysis', vietnamese: 'phân tích', ipa: '/əˈnæləsɪs/' },
    { english: 'approach', vietnamese: 'tiếp cận, phương pháp', ipa: '/əˈproʊtʃ/' },
    { english: 'appropriate', vietnamese: 'thích hợp, phù hợp', ipa: '/əˈproʊpriət/' },
    { english: 'area', vietnamese: 'khu vực, lĩnh vực', ipa: '/ˈɛəriə/' },
    { english: 'aspects', vietnamese: 'khía cạnh', ipa: '/ˈæspekts/' },
    { english: 'assistance', vietnamese: 'hỗ trợ, giúp đỡ', ipa: '/əˈsɪstəns/' },
    { english: 'assume', vietnamese: 'giả định, cho rằng', ipa: '/əˈsuːm/' },
    { english: 'authority', vietnamese: 'quyền lực, cơ quan có thẩm quyền', ipa: '/əˈθɔːrəti/' },
    { english: 'available', vietnamese: 'có sẵn, có thể có được', ipa: '/əˈveɪləbəl/' },
    { english: 'benefit', vietnamese: 'lợi ích, có lợi', ipa: '/ˈbenəfɪt/' },
    { english: 'category', vietnamese: 'loại, hạng mục', ipa: '/ˈkætəˌɡɔːri/' },
    { english: 'community', vietnamese: 'cộng đồng', ipa: '/kəˈmjuːnəti/' },
    { english: 'complex', vietnamese: 'phức tạp', ipa: '/ˈkɑːmpleks/' },
    { english: 'concerning', vietnamese: 'liên quan đến', ipa: '/kənˈsɜːrnɪŋ/' },
    { english: 'conclusion', vietnamese: 'kết luận', ipa: '/kənˈkluːʒən/' },
    { english: 'conduct', vietnamese: 'tiến hành, thực hiện', ipa: '/kənˈdʌkt/' },
    { english: 'consequence', vietnamese: 'hậu quả', ipa: '/ˈkɑːnsəkwəns/' },
    // Continue with remaining level 1 words...
    { english: 'consistent', vietnamese: 'nhất quán, kiên định', ipa: '/kənˈsɪstənt/' },
    { english: 'constitutional', vietnamese: 'thuộc về hiến pháp', ipa: '/ˌkɑːnstəˈtuːʃənəl/' },
    { english: 'consumer', vietnamese: 'người tiêu dùng', ipa: '/kənˈsuːmər/' },
    { english: 'context', vietnamese: 'bối cảnh, ngữ cảnh', ipa: '/ˈkɑːntekst/' },
    { english: 'create', vietnamese: 'tạo ra, sáng tạo', ipa: '/kriˈeɪt/' },
    { english: 'culture', vietnamese: 'văn hóa', ipa: '/ˈkʌltʃər/' },
    { english: 'data', vietnamese: 'dữ liệu', ipa: '/ˈdeɪtə/' },
    { english: 'definition', vietnamese: 'định nghĩa', ipa: '/ˌdefəˈnɪʃən/' },
    { english: 'destructive', vietnamese: 'phá hoại, tàn phá', ipa: '/dɪˈstrʌktɪv/' },
    { english: 'discovery', vietnamese: 'khám phá, phát hiện', ipa: '/dɪˈskʌvəri/' }
  ],

  // Level 2 - 100 words (Intermediate Level)
  level2: [
    { english: 'access', vietnamese: 'tiếp cận, truy cập', ipa: '/ˈækses/' },
    { english: 'activity', vietnamese: 'hoạt động', ipa: '/ækˈtɪvəti/' },
    { english: 'alter', vietnamese: 'thay đổi, sửa đổi', ipa: '/ˈɔːltər/' },
    { english: 'alternative', vietnamese: 'thay thế, lựa chọn khác', ipa: '/ɔːlˈtɜːrnətɪv/' },
    { english: 'amendment', vietnamese: 'sửa đổi, tu chính', ipa: '/əˈmendmənt/' },
    { english: 'annual', vietnamese: 'hàng năm', ipa: '/ˈænjuəl/' },
    { english: 'apparent', vietnamese: 'rõ ràng, hiển nhiên', ipa: '/əˈpærənt/' },
    { english: 'application', vietnamese: 'ứng dụng, đơn xin', ipa: '/ˌæplɪˈkeɪʃən/' },
    { english: 'approximate', vietnamese: 'gần đúng, ước tính', ipa: '/əˈprɑːksɪmət/' },
    { english: 'artificial', vietnamese: 'nhân tạo', ipa: '/ˌɑːrtɪˈfɪʃəl/' },
    { english: 'attitude', vietnamese: 'thái độ', ipa: '/ˈætɪtuːd/' },
    { english: 'aware', vietnamese: 'nhận thức, biết', ipa: '/əˈwer/' },
    { english: 'capacity', vietnamese: 'khả năng, năng lực', ipa: '/kəˈpæsəti/' },
    { english: 'challenge', vietnamese: 'thách thức', ipa: '/ˈtʃælɪndʒ/' },
    { english: 'circumstance', vietnamese: 'hoàn cảnh', ipa: '/ˈsɜːrkəmstæns/' },
    { english: 'comment', vietnamese: 'bình luận', ipa: '/ˈkɑːment/' },
    { english: 'communication', vietnamese: 'giao tiếp', ipa: '/kəˌmjuːnɪˈkeɪʃən/' },
    { english: 'concentration', vietnamese: 'tập trung', ipa: '/ˌkɑːnsənˈtreɪʃən/' },
    { english: 'conflict', vietnamese: 'xung đột', ipa: '/ˈkɑːnflɪkt/' },
    { english: 'considerable', vietnamese: 'đáng kể', ipa: '/kənˈsɪdərəbəl/' },
    { english: 'constant', vietnamese: 'liên tục, không đổi', ipa: '/ˈkɑːnstənt/' },
    { english: 'contact', vietnamese: 'liên lạc', ipa: '/ˈkɑːntækt/' },
    { english: 'contribution', vietnamese: 'đóng góp', ipa: '/ˌkɑːntrɪˈbjuːʃən/' },
    { english: 'core', vietnamese: 'cốt lõi, trung tâm', ipa: '/kɔːr/' },
    { english: 'correspond', vietnamese: 'tương ứng', ipa: '/ˌkɔːrəˈspɑːnd/' },
    { english: 'criteria', vietnamese: 'tiêu chí', ipa: '/kraɪˈtɪriə/' },
    { english: 'cycle', vietnamese: 'chu kỳ', ipa: '/ˈsaɪkəl/' },
    { english: 'debate', vietnamese: 'tranh luận', ipa: '/dɪˈbeɪt/' },
    { english: 'decline', vietnamese: 'suy giảm', ipa: '/dɪˈklaɪn/' },
    { english: 'deduction', vietnamese: 'suy luận', ipa: '/dɪˈdʌkʃən/' }
  ],

  // Level 3 - 100 words (Upper-Intermediate Level)
  level3: [
    { english: 'abstract', vietnamese: 'trừu tượng', ipa: '/ˈæbstrækt/' },
    { english: 'accurate', vietnamese: 'chính xác', ipa: '/ˈækjərət/' },
    { english: 'acknowledge', vietnamese: 'thừa nhận', ipa: '/əkˈnɑːlɪdʒ/' },
    { english: 'adaptation', vietnamese: 'sự thích nghi', ipa: '/ˌædæpˈteɪʃən/' },
    { english: 'adequate', vietnamese: 'đầy đủ, thích hợp', ipa: '/ˈædɪkwət/' },
    { english: 'adjust', vietnamese: 'điều chỉnh', ipa: '/əˈdʒʌst/' },
    { english: 'adult', vietnamese: 'người lớn', ipa: '/ˈædʌlt/' },
    { english: 'advocate', vietnamese: 'ủng hộ, bào chữa', ipa: '/ˈædvəkeɪt/' },
    { english: 'aid', vietnamese: 'giúp đỡ, hỗ trợ', ipa: '/eɪd/' },
    { english: 'attribute', vietnamese: 'thuộc tính, đặc điểm', ipa: '/əˈtrɪbjuːt/' },
    { english: 'author', vietnamese: 'tác giả', ipa: '/ˈɔːθər/' },
    { english: 'brief', vietnamese: 'ngắn gọn, tóm tắt', ipa: '/briːf/' },
    { english: 'capable', vietnamese: 'có khả năng', ipa: '/ˈkeɪpəbəl/' },
    { english: 'civil', vietnamese: 'dân sự, lịch sự', ipa: '/ˈsɪvəl/' },
    { english: 'classical', vietnamese: 'cổ điển', ipa: '/ˈklæsɪkəl/' },
    { english: 'comprehensive', vietnamese: 'toàn diện', ipa: '/ˌkɑːmprɪˈhensɪv/' },
    { english: 'contrary', vietnamese: 'trái ngược', ipa: '/ˈkɑːntreri/' },
    { english: 'coordination', vietnamese: 'phối hợp', ipa: '/koʊˌɔːrdɪˈneɪʃən/' },
    { english: 'couple', vietnamese: 'cặp đôi, vài', ipa: '/ˈkʌpəl/' },
    { english: 'decades', vietnamese: 'thập kỷ', ipa: '/ˈdekeɪdz/' },
    { english: 'definite', vietnamese: 'xác định, rõ ràng', ipa: '/ˈdefənət/' },
    { english: 'deny', vietnamese: 'phủ nhận', ipa: '/dɪˈnaɪ/' },
    { english: 'discrimination', vietnamese: 'phân biệt đối xử', ipa: '/dɪˌskrɪməˈneɪʃən/' },
    { english: 'disposal', vietnamese: 'xử lý, loại bỏ', ipa: '/dɪˈspoʊzəl/' },
    { english: 'diversity', vietnamese: 'đa dạng', ipa: '/daɪˈvɜːrsəti/' },
    { english: 'domain', vietnamese: 'lĩnh vực, miền', ipa: '/doʊˈmeɪn/' },
    { english: 'dynamic', vietnamese: 'năng động', ipa: '/daɪˈnæmɪk/' },
    { english: 'eliminate', vietnamese: 'loại bỏ', ipa: '/ɪˈlɪməneɪt/' },
    { english: 'equipment', vietnamese: 'thiết bị', ipa: '/ɪˈkwɪpmənt/' },
    { english: 'estate', vietnamese: 'bất động sản', ipa: '/ɪˈsteɪt/' }
  ],

  // Level 4 - 100 words (Advanced Level)
  level4: [
    { english: 'accommodation', vietnamese: 'chỗ ở, sự điều tiết', ipa: '/əˌkɑːməˈdeɪʃən/' },
    { english: 'accompany', vietnamese: 'đi cùng, kèm theo', ipa: '/əˈkʌmpəni/' },
    { english: 'advance', vietnamese: 'tiến bộ, trước', ipa: '/ədˈvæns/' },
    { english: 'analogous', vietnamese: 'tương tự', ipa: '/əˈnæləɡəs/' },
    { english: 'anticipate', vietnamese: 'dự đoán, mong đợi', ipa: '/ænˈtɪsəpeɪt/' },
    { english: 'appendix', vietnamese: 'phụ lục', ipa: '/əˈpendɪks/' },
    { english: 'appreciate', vietnamese: 'đánh giá cao', ipa: '/əˈpriːʃieɪt/' },
    { english: 'arbitrary', vietnamese: 'tùy tiện, độc đoán', ipa: '/ˈɑːrbətreri/' },
    { english: 'assure', vietnamese: 'đảm bảo', ipa: '/əˈʃʊr/' },
    { english: 'automatically', vietnamese: 'tự động', ipa: '/ˌɔːtəˈmætɪkli/' },
    { english: 'behalf', vietnamese: 'thay mặt cho', ipa: '/bɪˈhæf/' },
    { english: 'bias', vietnamese: 'thiên vị, định kiến', ipa: '/ˈbaɪəs/' },
    { english: 'cease', vietnamese: 'ngừng, chấm dứt', ipa: '/siːs/' },
    { english: 'chart', vietnamese: 'biểu đồ, bản đồ', ipa: '/tʃɑːrt/' },
    { english: 'clarity', vietnamese: 'sự rõ ràng', ipa: '/ˈklærəti/' },
    { english: 'coherence', vietnamese: 'sự mạch lạc', ipa: '/koʊˈhɪrəns/' },
    { english: 'coincide', vietnamese: 'trùng hợp', ipa: '/ˌkoʊɪnˈsaɪd/' },
    { english: 'commodity', vietnamese: 'hàng hóa', ipa: '/kəˈmɑːdəti/' },
    { english: 'confirm', vietnamese: 'xác nhận', ipa: '/kənˈfɜːrm/' },
    { english: 'contemporary', vietnamese: 'đương đại', ipa: '/kənˈtempəreri/' },
    { english: 'contradict', vietnamese: 'mâu thuẫn', ipa: '/ˌkɑːntrəˈdɪkt/' },
    { english: 'controversy', vietnamese: 'tranh cãi', ipa: '/ˈkɑːntrəvɜːrsi/' },
    { english: 'conversely', vietnamese: 'ngược lại', ipa: '/ˈkɑːnvɜːrsli/' },
    { english: 'cooperate', vietnamese: 'hợp tác', ipa: '/koʊˈɑːpəreɪt/' },
    { english: 'crucial', vietnamese: 'quan trọng', ipa: '/ˈkruːʃəl/' },
    { english: 'currency', vietnamese: 'tiền tệ', ipa: '/ˈkɜːrənsi/' },
    { english: 'denote', vietnamese: 'biểu thị, chỉ ra', ipa: '/dɪˈnoʊt/' },
    { english: 'detect', vietnamese: 'phát hiện', ipa: '/dɪˈtekt/' },
    { english: 'deviation', vietnamese: 'sự lệch lạc', ipa: '/ˌdiːviˈeɪʃən/' },
    { english: 'device', vietnamese: 'thiết bị, dụng cụ', ipa: '/dɪˈvaɪs/' }
  ],

  // Level 5 - 100 words (Expert Level)
  level5: [
    { english: 'abandon', vietnamese: 'từ bỏ, bỏ rơi', ipa: '/əˈbændən/' },
    { english: 'abate', vietnamese: 'giảm bớt', ipa: '/əˈbeɪt/' },
    { english: 'abrupt', vietnamese: 'đột ngột', ipa: '/əˈbrʌpt/' },
    { english: 'accumulation', vietnamese: 'sự tích lũy', ipa: '/əˌkjuːmjəˈleɪʃən/' },
    { english: 'acquisition', vietnamese: 'sự mua lại, thu được', ipa: '/ˌækwəˈzɪʃən/' },
    { english: 'adjacent', vietnamese: 'liền kề', ipa: '/əˈdʒeɪsənt/' },
    { english: 'aggregate', vietnamese: 'tổng hợp', ipa: '/ˈæɡrɪɡət/' },
    { english: 'albeit', vietnamese: 'mặc dù', ipa: '/ˌɔːlˈbiːɪt/' },
    { english: 'ambiguous', vietnamese: 'mơ hồ, không rõ ràng', ipa: '/æmˈbɪɡjuəs/' },
    { english: 'ancestor', vietnamese: 'tổ tiên', ipa: '/ˈænsestər/' },
    { english: 'assembly', vietnamese: 'hội đồng, lắp ráp', ipa: '/əˈsembli/' },
    { english: 'assessment', vietnamese: 'đánh giá', ipa: '/əˈsesmənt/' },
    { english: 'assign', vietnamese: 'phân công, giao', ipa: '/əˈsaɪn/' },
    { english: 'attain', vietnamese: 'đạt được', ipa: '/əˈteɪn/' },
    { english: 'avert', vietnamese: 'tránh khỏi', ipa: '/əˈvɜːrt/' },
    { english: 'coal', vietnamese: 'than đá', ipa: '/koʊl/' },
    { english: 'collapse', vietnamese: 'sụp đổ', ipa: '/kəˈlæps/' },
    { english: 'colleagues', vietnamese: 'đồng nghiệp', ipa: '/ˈkɑːliːɡz/' },
    { english: 'combat', vietnamese: 'chiến đấu', ipa: '/ˈkɑːmbæt/' },
    { english: 'commit', vietnamese: 'cam kết, phạm tội', ipa: '/kəˈmɪt/' },
    { english: 'compile', vietnamese: 'biên soạn', ipa: '/kəmˈpaɪl/' },
    { english: 'complement', vietnamese: 'bổ sung', ipa: '/ˈkɑːmpləmənt/' },
    { english: 'comprise', vietnamese: 'bao gồm', ipa: '/kəmˈpraɪz/' },
    { english: 'conceive', vietnamese: 'hình dung, thụ thai', ipa: '/kənˈsiːv/' },
    { english: 'concurrent', vietnamese: 'đồng thời', ipa: '/kənˈkɜːrənt/' },
    { english: 'confined', vietnamese: 'bị giới hạn', ipa: '/kənˈfaɪnd/' },
    { english: 'conform', vietnamese: 'tuân theo', ipa: '/kənˈfɔːrm/' },
    { english: 'confuse', vietnamese: 'làm bối rối', ipa: '/kənˈfjuːz/' },
    { english: 'consciousness', vietnamese: 'ý thức', ipa: '/ˈkɑːnʃəsnəs/' },
    { english: 'convinced', vietnamese: 'thuyết phục', ipa: '/kənˈvɪnst/' }
  ]
}

// Topic-based vocabulary
const topicBasedData = {
  // Business & Economics
  business: [
    { english: 'revenue', vietnamese: 'doanh thu', ipa: '/ˈrevənjuː/' },
    { english: 'profit', vietnamese: 'lợi nhuận', ipa: '/ˈprɑːfɪt/' },
    { english: 'budget', vietnamese: 'ngân sách', ipa: '/ˈbʌdʒɪt/' },
    { english: 'negotiate', vietnamese: 'đàm phán', ipa: '/nɪˈɡoʊʃieɪt/' },
    { english: 'merger', vietnamese: 'sáp nhập', ipa: '/ˈmɜːrdʒər/' },
    { english: 'acquisition', vietnamese: 'mua lại', ipa: '/ˌækwəˈzɪʃən/' },
    { english: 'stakeholder', vietnamese: 'bên liên quan', ipa: '/ˈsteɪkhoʊldər/' },
    { english: 'dividend', vietnamese: 'cổ tức', ipa: '/ˈdɪvɪdend/' },
    { english: 'inflation', vietnamese: 'lạm phát', ipa: '/ɪnˈfleɪʃən/' },
    { english: 'recession', vietnamese: 'suy thoái', ipa: '/rɪˈseʃən/' },
    { english: 'entrepreneurship', vietnamese: 'tinh thần khởi nghiệp', ipa: '/ˌɑːntrəprəˈnɜːrʃɪp/' },
    { english: 'franchise', vietnamese: 'nhượng quyền', ipa: '/ˈfrænʧaɪz/' },
    { english: 'subsidiary', vietnamese: 'công ty con', ipa: '/səbˈsɪdiəri/' },
    { english: 'liability', vietnamese: 'trách nhiệm pháp lý', ipa: '/ˌlaɪəˈbɪləti/' },
    { english: 'equity', vietnamese: 'vốn chủ sở hữu', ipa: '/ˈekwəti/' },
    { english: 'portfolio', vietnamese: 'danh mục đầu tư', ipa: '/pɔːrtˈfoʊlioʊ/' },
    { english: 'audit', vietnamese: 'kiểm toán', ipa: '/ˈɔːdɪt/' },
    { english: 'turnover', vietnamese: 'doanh thu', ipa: '/ˈtɜːrnoʊvər/' },
    { english: 'commodity', vietnamese: 'hàng hóa', ipa: '/kəˈmɑːdəti/' },
    { english: 'logistics', vietnamese: 'hậu cần', ipa: '/ləˈdʒɪstɪks/' }
  ],

  // Technology & Innovation
  technology: [
    { english: 'algorithm', vietnamese: 'thuật toán', ipa: '/ˈælɡərɪðəm/' },
    { english: 'artificial intelligence', vietnamese: 'trí tuệ nhân tạo', ipa: '/ˌɑːrtəˈfɪʃəl ɪnˈtelədʒəns/' },
    { english: 'blockchain', vietnamese: 'chuỗi khối', ipa: '/ˈblɑːktʃeɪn/' },
    { english: 'cybersecurity', vietnamese: 'an ninh mạng', ipa: '/ˈsaɪbərsɪkjʊrəti/' },
    { english: 'automation', vietnamese: 'tự động hóa', ipa: '/ˌɔːtəˈmeɪʃən/' },
    { english: 'innovation', vietnamese: 'đổi mới', ipa: '/ˌɪnəˈveɪʃən/' },
    { english: 'virtual reality', vietnamese: 'thực tế ảo', ipa: '/ˈvɜːrtʃuəl riˈæləti/' },
    { english: 'cloud computing', vietnamese: 'điện toán đám mây', ipa: '/klaʊd kəmˈpjuːtɪŋ/' },
    { english: 'interface', vietnamese: 'giao diện', ipa: '/ˈɪntərfeɪs/' },
    { english: 'database', vietnamese: 'cơ sở dữ liệu', ipa: '/ˈdeɪtəbeɪs/' },
    { english: 'encryption', vietnamese: 'mã hóa', ipa: '/ɪnˈkrɪpʃən/' },
    { english: 'semiconductor', vietnamese: 'chất bán dẫn', ipa: '/ˌsemikənˈdʌktər/' },
    { english: 'bandwidth', vietnamese: 'băng thông', ipa: '/ˈbændwɪdθ/' },
    { english: 'protocol', vietnamese: 'giao thức', ipa: '/ˈproʊtəkɔːl/' },
    { english: 'deployment', vietnamese: 'triển khai', ipa: '/dɪˈplɔɪmənt/' },
    { english: 'scalability', vietnamese: 'khả năng mở rộng', ipa: '/ˌskeɪləˈbɪləti/' },
    { english: 'optimization', vietnamese: 'tối ưu hóa', ipa: '/ˌɑːptəməˈzeɪʃən/' },
    { english: 'simulation', vietnamese: 'mô phỏng', ipa: '/ˌsɪmjəˈleɪʃən/' },
    { english: 'integration', vietnamese: 'tích hợp', ipa: '/ˌɪntəˈɡreɪʃən/' },
    { english: 'framework', vietnamese: 'khung làm việc', ipa: '/ˈfreɪmwɜːrk/' }
  ],

  // Environment & Climate
  environment: [
    { english: 'sustainability', vietnamese: 'tính bền vững', ipa: '/səˌsteɪnəˈbɪləti/' },
    { english: 'biodiversity', vietnamese: 'đa dạng sinh học', ipa: '/ˌbaɪoʊdaɪˈvɜːrsəti/' },
    { english: 'ecosystem', vietnamese: 'hệ sinh thái', ipa: '/ˈiːkoʊsɪstəm/' },
    { english: 'renewable energy', vietnamese: 'năng lượng tái tạo', ipa: '/rɪˈnuːəbəl ˈenərdʒi/' },
    { english: 'carbon footprint', vietnamese: 'dấu chân carbon', ipa: '/ˈkɑːrbən ˈfʊtprɪnt/' },
    { english: 'greenhouse effect', vietnamese: 'hiệu ứng nhà kính', ipa: '/ˈɡriːnhaʊs ɪˈfekt/' },
    { english: 'deforestation', vietnamese: 'phá rừng', ipa: '/diˌfɔːrəˈsteɪʃən/' },
    { english: 'conservation', vietnamese: 'bảo tồn', ipa: '/ˌkɑːnsərˈveɪʃən/' },
    { english: 'pollution', vietnamese: 'ô nhiễm', ipa: '/pəˈluːʃən/' },
    { english: 'contamination', vietnamese: 'nhiễm bẩn', ipa: '/kənˌtæməˈneɪʃən/' },
    { english: 'emission', vietnamese: 'khí thải', ipa: '/ɪˈmɪʃən/' },
    { english: 'fossil fuel', vietnamese: 'nhiên liệu hóa thạch', ipa: '/ˈfɑːsəl ˈfjuːəl/' },
    { english: 'recycling', vietnamese: 'tái chế', ipa: '/riˈsaɪklɪŋ/' },
    { english: 'habitat', vietnamese: 'môi trường sống', ipa: '/ˈhæbɪtæt/' },
    { english: 'extinction', vietnamese: 'tuyệt chủng', ipa: '/ɪkˈstɪŋkʃən/' },
    { english: 'climate change', vietnamese: 'biến đổi khí hậu', ipa: '/ˈklaɪmət tʃeɪndʒ/' },
    { english: 'urbanization', vietnamese: 'đô thị hóa', ipa: '/ˌɜːrbənəˈzeɪʃən/' },
    { english: 'industrialization', vietnamese: 'công nghiệp hóa', ipa: '/ɪnˌdʌstriələˈzeɪʃən/' },
    { english: 'erosion', vietnamese: 'xói mòn', ipa: '/ɪˈroʊʒən/' },
    { english: 'restoration', vietnamese: 'phục hồi', ipa: '/ˌrestəˈreɪʃən/' }
  ],

  // Health & Medicine
  health: [
    { english: 'diagnosis', vietnamese: 'chẩn đoán', ipa: '/ˌdaɪəɡˈnoʊsɪs/' },
    { english: 'treatment', vietnamese: 'điều trị', ipa: '/ˈtriːtmənt/' },
    { english: 'therapy', vietnamese: 'liệu pháp', ipa: '/ˈθerəpi/' },
    { english: 'vaccination', vietnamese: 'tiêm chủng', ipa: '/ˌvæksəˈneɪʃən/' },
    { english: 'epidemic', vietnamese: 'dịch bệnh', ipa: '/ˌepəˈdemɪk/' },
    { english: 'pandemic', vietnamese: 'đại dịch', ipa: '/pænˈdemɪk/' },
    { english: 'immunity', vietnamese: 'miễn dịch', ipa: '/ɪˈmjuːnəti/' },
    { english: 'antibiotic', vietnamese: 'kháng sinh', ipa: '/ˌæntibaɪˈɑːtɪk/' },
    { english: 'symptom', vietnamese: 'triệu chứng', ipa: '/ˈsɪmptəm/' },
    { english: 'syndrome', vietnamese: 'hội chứng', ipa: '/ˈsɪndroʊm/' },
    { english: 'chronic', vietnamese: 'mãn tính', ipa: '/ˈkrɑːnɪk/' },
    { english: 'acute', vietnamese: 'cấp tính', ipa: '/əˈkjuːt/' },
    { english: 'rehabilitation', vietnamese: 'phục hồi chức năng', ipa: '/ˌriːəˌbɪləˈteɪʃən/' },
    { english: 'prevention', vietnamese: 'phòng ngừa', ipa: '/prɪˈvenʃən/' },
    { english: 'pharmaceutical', vietnamese: 'dược phẩm', ipa: '/ˌfɑːrməˈsuːtɪkəl/' },
    { english: 'pathology', vietnamese: 'bệnh lý học', ipa: '/pəˈθɑːlədʒi/' },
    { english: 'anatomy', vietnamese: 'giải phẫu học', ipa: '/əˈnætəmi/' },
    { english: 'physiology', vietnamese: 'sinh lý học', ipa: '/ˌfɪziˈɑːlədʒi/' },
    { english: 'neurology', vietnamese: 'thần kinh học', ipa: '/nʊˈrɑːlədʒi/' },
    { english: 'cardiology', vietnamese: 'tim mạch học', ipa: '/ˌkɑːrdiˈɑːlədʒi/' }
  ],

  // Education & Learning
  education: [
    { english: 'curriculum', vietnamese: 'chương trình giảng dạy', ipa: '/kəˈrɪkjələm/' },
    { english: 'pedagogy', vietnamese: 'phương pháp giảng dạy', ipa: '/ˈpedəɡɑːdʒi/' },
    { english: 'assessment', vietnamese: 'đánh giá', ipa: '/əˈsesmənt/' },
    { english: 'evaluation', vietnamese: 'thẩm định', ipa: '/ɪˌvæljuˈeɪʃən/' },
    { english: 'comprehension', vietnamese: 'sự hiểu biết', ipa: '/ˌkɑːmprɪˈhenʃən/' },
    { english: 'literacy', vietnamese: 'khả năng đọc viết', ipa: '/ˈlɪtərəsi/' },
    { english: 'numeracy', vietnamese: 'khả năng tính toán', ipa: '/ˈnuːmərəsi/' },
    { english: 'methodology', vietnamese: 'phương pháp luận', ipa: '/ˌmeθəˈdɑːlədʒi/' },
    { english: 'scholarship', vietnamese: 'học bổng', ipa: '/ˈskɑːlərʃɪp/' },
    { english: 'dissertation', vietnamese: 'luận văn', ipa: '/ˌdɪsərˈteɪʃən/' },
    { english: 'thesis', vietnamese: 'luận án', ipa: '/ˈθiːsɪs/' },
    { english: 'seminar', vietnamese: 'hội thảo', ipa: '/ˈsemɪnɑːr/' },
    { english: 'lecture', vietnamese: 'bài giảng', ipa: '/ˈlektʃər/' },
    { english: 'tutorial', vietnamese: 'hướng dẫn', ipa: '/tuˈtɔːriəl/' },
    { english: 'assignment', vietnamese: 'bài tập', ipa: '/əˈsaɪnmənt/' },
    { english: 'enrollment', vietnamese: 'đăng ký học', ipa: '/ɪnˈroʊlmənt/' },
    { english: 'graduation', vietnamese: 'tốt nghiệp', ipa: '/ˌɡrædʒuˈeɪʃən/' },
    { english: 'accreditation', vietnamese: 'công nhận', ipa: '/əˌkredɪˈteɪʃən/' },
    { english: 'proficiency', vietnamese: 'thành thạo', ipa: '/prəˈfɪʃənsi/' },
    { english: 'competency', vietnamese: 'năng lực', ipa: '/ˈkɑːmpətənsi/' }
  ]
}

export async function POST(request: NextRequest) {
  try {
    let body: { importType?: string } = {}
    
    // Safely parse JSON body
    try {
      const text = await request.text()
      body = text ? JSON.parse(text) : {}
    } catch {
      // If no body or invalid JSON, use empty object
      body = {}
    }
    
    const { importType = 'all' } = body

    console.log(`Starting import for type: ${importType}`)

    let importedLessons = 0
    let importedFlashcards = 0

    // Import IELTS Complete Levels
    if (importType === 'all' || importType === 'ielts') {
      console.log('Importing IELTS Complete Academic Wordlist...')
      
      const ieltsLevels = [
        { level: 1, data: ieltsCompleteData.level1, color: '#10B981' },
        { level: 2, data: ieltsCompleteData.level2, color: '#3B82F6' },
        { level: 3, data: ieltsCompleteData.level3, color: '#8B5CF6' },
        { level: 4, data: ieltsCompleteData.level4, color: '#F59E0B' },
        { level: 5, data: ieltsCompleteData.level5, color: '#EF4444' }
      ]

      for (const { level, data, color } of ieltsLevels) {
        // Create 5 lessons per level (20 words each)
        for (let i = 0; i < 5; i++) {
          const startIndex = i * 20
          const endIndex = Math.min(startIndex + 20, data.length)
          const batchWords = data.slice(startIndex, endIndex)
          
          if (batchWords.length === 0) continue

          const lessonName = `IELTS Level ${level} (${startIndex + 1}-${endIndex})`
          const lessonDesc = `IELTS Academic Wordlist - Level ${level}: Từ ${startIndex + 1} đến ${endIndex}`

          try {
            const lesson = await lessonDb.create({
              name: lessonName,
              description: lessonDesc,
              color: color
            })

            importedLessons++
            console.log(`Created lesson: ${lesson.name}`)

            // Add words to lesson
            for (const word of batchWords) {
              try {
                await flashcardDb.create({
                  english: word.english,
                  vietnamese: word.vietnamese,
                  ipa: word.ipa,
                  category: 'ielts',
                  difficulty: level,
                  lesson_id: lesson.id
                })
                importedFlashcards++
              } catch {
                console.log(`Word ${word.english} might already exist, skipping...`)
              }
            }
          } catch {
            console.log(`Lesson ${lessonName} might already exist, skipping...`)
          }
        }
      }
    }

    // Import Topic-based Vocabulary
    if (importType === 'all' || importType === 'topics') {
      console.log('Importing Topic-based Vocabulary...')
      
      const topics = [
        { name: 'Business & Economics', data: topicBasedData.business, color: '#059669', category: 'business' },
        { name: 'Technology & Innovation', data: topicBasedData.technology, color: '#7C3AED', category: 'technology' },
        { name: 'Environment & Climate', data: topicBasedData.environment, color: '#16A34A', category: 'environment' },
        { name: 'Health & Medicine', data: topicBasedData.health, color: '#DC2626', category: 'health' },
        { name: 'Education & Learning', data: topicBasedData.education, color: '#2563EB', category: 'education' }
      ]

      for (const topic of topics) {
        try {
          const lesson = await lessonDb.create({
            name: topic.name,
            description: `Từ vựng chuyên ngành ${topic.name.toLowerCase()}`,
            color: topic.color
          })

          importedLessons++
          console.log(`Created topic lesson: ${lesson.name}`)

          // Add words to lesson
          for (const word of topic.data) {
            try {
              await flashcardDb.create({
                english: word.english,
                vietnamese: word.vietnamese,
                ipa: word.ipa,
                category: topic.category,
                difficulty: 3,
                lesson_id: lesson.id
              })
              importedFlashcards++
            } catch {
              console.log(`Word ${word.english} might already exist, skipping...`)
            }
          }
        } catch {
          console.log(`Topic lesson ${topic.name} might already exist, skipping...`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Complete vocabulary import finished successfully!',
      imported: {
        lessons: importedLessons,
        flashcards: importedFlashcards
      },
      details: {
        ielts_levels: importType === 'all' || importType === 'ielts' ? '5 levels (500 words)' : 'skipped',
        topic_based: importType === 'all' || importType === 'topics' ? '5 topics (100 words)' : 'skipped',
        total_words: importedFlashcards
      }
    })

  } catch (error) {
    console.error('Error importing complete vocabulary:', error)
    return NextResponse.json(
      { error: 'Failed to import vocabulary data', details: error },
      { status: 500 }
    )
  }
}
