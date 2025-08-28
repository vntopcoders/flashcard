import { NextResponse } from 'next/server';
import { lessonDb, flashcardDb } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('Bắt đầu import Academic Word List...');

    // Tạo các lessons cho AWL
    const awlLessons = [
      {
        title: 'AWL Sublist 1 - Core Academic Vocabulary',
        description: 'Từ vựng học thuật cơ bản nhất (60 từ)',
        category: 'Academic Word List'
      },
      {
        title: 'AWL Sublist 2 - Advanced Academic Terms',
        description: 'Từ vựng học thuật nâng cao (60 từ)',
        category: 'Academic Word List'
      },
      {
        title: 'AWL Sublist 3 - Complex Academic Concepts',
        description: 'Khái niệm học thuật phức tạp (60 từ)',
        category: 'Academic Word List'
      },
      {
        title: 'AWL Sublist 4 - Specialized Academic Language',
        description: 'Ngôn ngữ học thuật chuyên biệt (60 từ)',
        category: 'Academic Word List'
      },
      {
        title: 'AWL Sublist 5 - Advanced Academic Discourse',
        description: 'Diễn ngôn học thuật nâng cao (60 từ)',
        category: 'Academic Word List'
      }
    ];

    // Academic Word List vocabulary data - 300 từ quan trọng nhất
    const awlVocabulary: Record<string, Array<{english: string; vietnamese: string; ipa: string}>> = {
      'AWL Sublist 1 - Core Academic Vocabulary': [
        // Sublist 1 - 60 từ quan trọng nhất
        { english: 'analyse', vietnamese: 'phân tích', ipa: '/ˈænəlaɪz/' },
        { english: 'approach', vietnamese: 'tiếp cận, cách tiếp cận', ipa: '/əˈproʊtʃ/' },
        { english: 'area', vietnamese: 'khu vực, lĩnh vực', ipa: '/ˈɛriə/' },
        { english: 'assess', vietnamese: 'đánh giá', ipa: '/əˈsɛs/' },
        { english: 'assume', vietnamese: 'giả định, cho rằng', ipa: '/əˈsum/' },
        { english: 'authority', vietnamese: 'thẩm quyền, cơ quan có thẩm quyền', ipa: '/əˈθɔrəti/' },
        { english: 'available', vietnamese: 'có sẵn, có thể sử dụng', ipa: '/əˈveɪləbəl/' },
        { english: 'benefit', vietnamese: 'lợi ích, có lợi', ipa: '/ˈbɛnəfɪt/' },
        { english: 'concept', vietnamese: 'khái niệm', ipa: '/ˈkɑnsɛpt/' },
        { english: 'consist', vietnamese: 'bao gồm, cấu thành', ipa: '/kənˈsɪst/' },
        { english: 'constitute', vietnamese: 'tạo thành, cấu thành', ipa: '/ˈkɑnstəˌtut/' },
        { english: 'context', vietnamese: 'bối cảnh, ngữ cảnh', ipa: '/ˈkɑntɛkst/' },
        { english: 'contract', vietnamese: 'hợp đồng', ipa: '/ˈkɑntrækt/' },
        { english: 'create', vietnamese: 'tạo ra, sáng tạo', ipa: '/kriˈeɪt/' },
        { english: 'data', vietnamese: 'dữ liệu', ipa: '/ˈdeɪtə/' },
        { english: 'define', vietnamese: 'định nghĩa', ipa: '/dɪˈfaɪn/' },
        { english: 'derive', vietnamese: 'có nguồn gốc từ, dẫn xuất', ipa: '/dɪˈraɪv/' },
        { english: 'distribute', vietnamese: 'phân phối, phân bố', ipa: '/dɪˈstrɪbjut/' },
        { english: 'economy', vietnamese: 'nền kinh tế', ipa: '/ɪˈkɑnəmi/' },
        { english: 'environment', vietnamese: 'môi trường', ipa: '/ɪnˈvaɪrənmənt/' },
        { english: 'establish', vietnamese: 'thiết lập, thành lập', ipa: '/ɪˈstæblɪʃ/' },
        { english: 'estimate', vietnamese: 'ước tính', ipa: '/ˈɛstəˌmeɪt/' },
        { english: 'evident', vietnamese: 'rõ ràng, hiển nhiên', ipa: '/ˈɛvədənt/' },
        { english: 'export', vietnamese: 'xuất khẩu', ipa: '/ˈɛkspɔrt/' },
        { english: 'factor', vietnamese: 'yếu tố', ipa: '/ˈfæktər/' },
        { english: 'finance', vietnamese: 'tài chính', ipa: '/ˈfaɪnæns/' },
        { english: 'formula', vietnamese: 'công thức', ipa: '/ˈfɔrmjələ/' },
        { english: 'function', vietnamese: 'chức năng, hoạt động', ipa: '/ˈfʌŋkʃən/' },
        { english: 'identify', vietnamese: 'xác định, nhận dạng', ipa: '/aɪˈdɛntəˌfaɪ/' },
        { english: 'income', vietnamese: 'thu nhập', ipa: '/ˈɪnˌkʌm/' },
        { english: 'indicate', vietnamese: 'chỉ ra, biểu thị', ipa: '/ˈɪndəˌkeɪt/' },
        { english: 'individual', vietnamese: 'cá nhân, cá thể', ipa: '/ˌɪndəˈvɪdʒuəl/' },
        { english: 'interpret', vietnamese: 'diễn giải, giải thích', ipa: '/ɪnˈtɜrprət/' },
        { english: 'involve', vietnamese: 'liên quan, bao gồm', ipa: '/ɪnˈvɑlv/' },
        { english: 'issue', vietnamese: 'vấn đề, phát hành', ipa: '/ˈɪʃu/' },
        { english: 'labour', vietnamese: 'lao động', ipa: '/ˈleɪbər/' },
        { english: 'legal', vietnamese: 'hợp pháp, về pháp luật', ipa: '/ˈligəl/' },
        { english: 'legislate', vietnamese: 'ban hành luật', ipa: '/ˈlɛdʒəsˌleɪt/' },
        { english: 'major', vietnamese: 'chủ yếu, lớn', ipa: '/ˈmeɪdʒər/' },
        { english: 'method', vietnamese: 'phương pháp', ipa: '/ˈmɛθəd/' },
        { english: 'occur', vietnamese: 'xảy ra, xuất hiện', ipa: '/əˈkɜr/' },
        { english: 'percent', vietnamese: 'phần trăm', ipa: '/pərˈsɛnt/' },
        { english: 'period', vietnamese: 'giai đoạn, thời kỳ', ipa: '/ˈpɪriəd/' },
        { english: 'policy', vietnamese: 'chính sách', ipa: '/ˈpɑləsi/' },
        { english: 'principle', vietnamese: 'nguyên tắc', ipa: '/ˈprɪnsəpəl/' },
        { english: 'proceed', vietnamese: 'tiến hành, tiếp tục', ipa: '/prəˈsid/' },
        { english: 'process', vietnamese: 'quá trình, xử lý', ipa: '/ˈprɑsɛs/' },
        { english: 'require', vietnamese: 'yêu cầu, đòi hỏi', ipa: '/rɪˈkwaɪər/' },
        { english: 'research', vietnamese: 'nghiên cứu', ipa: '/rɪˈsɜrtʃ/' },
        { english: 'respond', vietnamese: 'phản hồi, đáp ứng', ipa: '/rɪˈspɑnd/' },
        { english: 'role', vietnamese: 'vai trò', ipa: '/roʊl/' },
        { english: 'section', vietnamese: 'phần, mục', ipa: '/ˈsɛkʃən/' },
        { english: 'sector', vietnamese: 'lĩnh vực, khu vực', ipa: '/ˈsɛktər/' },
        { english: 'significant', vietnamese: 'có ý nghĩa, quan trọng', ipa: '/sɪgˈnɪfɪkənt/' },
        { english: 'similar', vietnamese: 'tương tự', ipa: '/ˈsɪmələr/' },
        { english: 'source', vietnamese: 'nguồn', ipa: '/sɔrs/' },
        { english: 'specific', vietnamese: 'cụ thể', ipa: '/spəˈsɪfɪk/' },
        { english: 'structure', vietnamese: 'cấu trúc', ipa: '/ˈstrʌktʃər/' },
        { english: 'theory', vietnamese: 'lý thuyết', ipa: '/ˈθɪri/' },
        { english: 'vary', vietnamese: 'thay đổi, biến đổi', ipa: '/ˈvɛri/' }
      ],
      'AWL Sublist 2 - Advanced Academic Terms': [
        // Sublist 2 - 60 từ tiếp theo
        { english: 'achieve', vietnamese: 'đạt được, thành tựu', ipa: '/əˈtʃiv/' },
        { english: 'acquire', vietnamese: 'có được, thu được', ipa: '/əˈkwaɪər/' },
        { english: 'administrate', vietnamese: 'quản lý, điều hành', ipa: '/ədˈmɪnəˌstreɪt/' },
        { english: 'affect', vietnamese: 'ảnh hưởng', ipa: '/əˈfɛkt/' },
        { english: 'appropriate', vietnamese: 'thích hợp, phù hợp', ipa: '/əˈproʊpriət/' },
        { english: 'aspect', vietnamese: 'khía cạnh', ipa: '/ˈæspɛkt/' },
        { english: 'assist', vietnamese: 'hỗ trợ, giúp đỡ', ipa: '/əˈsɪst/' },
        { english: 'category', vietnamese: 'loại, danh mục', ipa: '/ˈkætəˌgɔri/' },
        { english: 'chapter', vietnamese: 'chương', ipa: '/ˈtʃæptər/' },
        { english: 'commission', vietnamese: 'hoa hồng, ủy ban', ipa: '/kəˈmɪʃən/' },
        { english: 'community', vietnamese: 'cộng đồng', ipa: '/kəˈmjunəti/' },
        { english: 'complex', vietnamese: 'phức tạp', ipa: '/kəmˈplɛks/' },
        { english: 'compute', vietnamese: 'tính toán', ipa: '/kəmˈpjut/' },
        { english: 'conclude', vietnamese: 'kết luận', ipa: '/kənˈklud/' },
        { english: 'conduct', vietnamese: 'tiến hành, thực hiện', ipa: '/kənˈdʌkt/' },
        { english: 'consequent', vietnamese: 'kết quả, hệ quả', ipa: '/ˈkɑnsəkwənt/' },
        { english: 'construct', vietnamese: 'xây dựng, kiến tạo', ipa: '/kənˈstrʌkt/' },
        { english: 'consume', vietnamese: 'tiêu thụ, sử dụng', ipa: '/kənˈsum/' },
        { english: 'credit', vietnamese: 'tín dụng, ghi có', ipa: '/ˈkrɛdət/' },
        { english: 'culture', vietnamese: 'văn hóa', ipa: '/ˈkʌltʃər/' },
        { english: 'design', vietnamese: 'thiết kế', ipa: '/dɪˈzaɪn/' },
        { english: 'distinct', vietnamese: 'riêng biệt, khác biệt', ipa: '/dɪˈstɪŋkt/' },
        { english: 'element', vietnamese: 'yếu tố, nguyên tố', ipa: '/ˈɛləmənt/' },
        { english: 'equate', vietnamese: 'đồng nhất, coi như bằng nhau', ipa: '/ɪˈkweɪt/' },
        { english: 'evaluate', vietnamese: 'đánh giá, định giá', ipa: '/ɪˈvæljuˌeɪt/' },
        { english: 'feature', vietnamese: 'đặc điểm, tính năng', ipa: '/ˈfitʃər/' },
        { english: 'final', vietnamese: 'cuối cùng, kết thúc', ipa: '/ˈfaɪnəl/' },
        { english: 'focus', vietnamese: 'tập trung, tiêu điểm', ipa: '/ˈfoʊkəs/' },
        { english: 'impact', vietnamese: 'tác động', ipa: '/ˈɪmpækt/' },
        { english: 'injure', vietnamese: 'làm tổn thương', ipa: '/ˈɪndʒər/' },
        { english: 'institute', vietnamese: 'viện, học viện', ipa: '/ˈɪnstəˌtut/' },
        { english: 'invest', vietnamese: 'đầu tư', ipa: '/ɪnˈvɛst/' },
        { english: 'item', vietnamese: 'mục, món đồ', ipa: '/ˈaɪtəm/' },
        { english: 'journal', vietnamese: 'tạp chí, nhật ký', ipa: '/ˈdʒɜrnəl/' },
        { english: 'maintain', vietnamese: 'duy trì, bảo trì', ipa: '/meɪnˈteɪn/' },
        { english: 'normal', vietnamese: 'bình thường', ipa: '/ˈnɔrməl/' },
        { english: 'obtain', vietnamese: 'có được, đạt được', ipa: '/əbˈteɪn/' },
        { english: 'participate', vietnamese: 'tham gia', ipa: '/pɑrˈtɪsəˌpeɪt/' },
        { english: 'perceive', vietnamese: 'nhận thức, cảm nhận', ipa: '/pərˈsiv/' },
        { english: 'positive', vietnamese: 'tích cực, dương tính', ipa: '/ˈpɑzətɪv/' },
        { english: 'potential', vietnamese: 'tiềm năng', ipa: '/pəˈtɛnʃəl/' },
        { english: 'previous', vietnamese: 'trước đó', ipa: '/ˈpriviəs/' },
        { english: 'primary', vietnamese: 'chủ yếu, ban đầu', ipa: '/ˈpraɪˌmɛri/' },
        { english: 'purchase', vietnamese: 'mua', ipa: '/ˈpɜrtʃəs/' },
        { english: 'range', vietnamese: 'phạm vi', ipa: '/reɪndʒ/' },
        { english: 'region', vietnamese: 'vùng, khu vực', ipa: '/ˈridʒən/' },
        { english: 'regulate', vietnamese: 'điều chỉnh, quy định', ipa: '/ˈrɛgjəˌleɪt/' },
        { english: 'relevant', vietnamese: 'liên quan, thích hợp', ipa: '/ˈrɛləvənt/' },
        { english: 'reside', vietnamese: 'cư trú, sống', ipa: '/rɪˈzaɪd/' },
        { english: 'resource', vietnamese: 'tài nguyên', ipa: '/ˈrisɔrs/' },
        { english: 'restrict', vietnamese: 'hạn chế', ipa: '/rɪˈstrɪkt/' },
        { english: 'secure', vietnamese: 'an toàn, bảo đảm', ipa: '/sɪˈkjʊr/' },
        { english: 'seek', vietnamese: 'tìm kiếm', ipa: '/sik/' },
        { english: 'select', vietnamese: 'chọn lựa', ipa: '/səˈlɛkt/' },
        { english: 'site', vietnamese: 'địa điểm, trang web', ipa: '/saɪt/' },
        { english: 'strategy', vietnamese: 'chiến lược', ipa: '/ˈstrætədʒi/' },
        { english: 'survey', vietnamese: 'khảo sát', ipa: '/ˈsɜrveɪ/' },
        { english: 'text', vietnamese: 'văn bản', ipa: '/tɛkst/' },
        { english: 'tradition', vietnamese: 'truyền thống', ipa: '/trəˈdɪʃən/' },
        { english: 'transfer', vietnamese: 'chuyển đổi, di chuyển', ipa: '/trænsˈfɜr/' }
      ],
      'AWL Sublist 3 - Complex Academic Concepts': [
        // Sublist 3 - 60 từ quan trọng
        { english: 'alternative', vietnamese: 'thay thế, lựa chọn khác', ipa: '/ɔlˈtɜrnətɪv/' },
        { english: 'circumstance', vietnamese: 'hoàn cảnh, tình huống', ipa: '/ˈsɜrkəmˌstæns/' },
        { english: 'comment', vietnamese: 'bình luận, nhận xét', ipa: '/ˈkɑmɛnt/' },
        { english: 'compensate', vietnamese: 'bù đắp, đền bù', ipa: '/ˈkɑmpənˌseɪt/' },
        { english: 'component', vietnamese: 'thành phần', ipa: '/kəmˈpoʊnənt/' },
        { english: 'consent', vietnamese: 'đồng ý, sự đồng thuận', ipa: '/kənˈsɛnt/' },
        { english: 'considerable', vietnamese: 'đáng kể', ipa: '/kənˈsɪdərəbəl/' },
        { english: 'constant', vietnamese: 'liên tục, không đổi', ipa: '/ˈkɑnstənt/' },
        { english: 'constrain', vietnamese: 'hạn chế, ràng buộc', ipa: '/kənˈstreɪn/' },
        { english: 'contribute', vietnamese: 'đóng góp', ipa: '/kənˈtrɪbjut/' },
        { english: 'convene', vietnamese: 'triệu tập, tập hợp', ipa: '/kənˈvin/' },
        { english: 'coordinate', vietnamese: 'phối hợp, điều phối', ipa: '/koʊˈɔrdəˌneɪt/' },
        { english: 'core', vietnamese: 'cốt lõi, trung tâm', ipa: '/kɔr/' },
        { english: 'corporate', vietnamese: 'thuộc về công ty', ipa: '/ˈkɔrpərət/' },
        { english: 'correspond', vietnamese: 'tương ứng, liên lạc', ipa: '/ˌkɔrəˈspɑnd/' },
        { english: 'criteria', vietnamese: 'tiêu chí', ipa: '/kraɪˈtɪriə/' },
        { english: 'deduce', vietnamese: 'suy luận', ipa: '/dɪˈdus/' },
        { english: 'demonstrate', vietnamese: 'chứng minh, thể hiện', ipa: '/ˈdɛmənˌstreɪt/' },
        { english: 'document', vietnamese: 'tài liệu', ipa: '/ˈdɑkjəmənt/' },
        { english: 'dominate', vietnamese: 'thống trị, chi phối', ipa: '/ˈdɑməˌneɪt/' },
        { english: 'emphasis', vietnamese: 'sự nhấn mạnh', ipa: '/ˈɛmfəsəs/' },
        { english: 'ensure', vietnamese: 'đảm bảo', ipa: '/ɪnˈʃʊr/' },
        { english: 'exclude', vietnamese: 'loại trừ', ipa: '/ɪkˈsklud/' },
        { english: 'framework', vietnamese: 'khung, khuôn khổ', ipa: '/ˈfreɪmˌwɜrk/' },
        { english: 'fund', vietnamese: 'quỹ, tài trợ', ipa: '/fʌnd/' },
        { english: 'illustrate', vietnamese: 'minh họa', ipa: '/ˈɪləˌstreɪt/' },
        { english: 'immigrate', vietnamese: 'nhập cư', ipa: '/ˈɪməˌgreɪt/' },
        { english: 'imply', vietnamese: 'ngụ ý, hàm ý', ipa: '/ɪmˈplaɪ/' },
        { english: 'initial', vietnamese: 'ban đầu', ipa: '/ɪˈnɪʃəl/' },
        { english: 'instance', vietnamese: 'trường hợp, ví dụ', ipa: '/ˈɪnstəns/' },
        { english: 'interact', vietnamese: 'tương tác', ipa: '/ˌɪntərˈækt/' },
        { english: 'justify', vietnamese: 'biện minh, chứng minh', ipa: '/ˈdʒʌstəˌfaɪ/' },
        { english: 'layer', vietnamese: 'lớp', ipa: '/ˈleɪər/' },
        { english: 'link', vietnamese: 'liên kết', ipa: '/lɪŋk/' },
        { english: 'locate', vietnamese: 'định vị, tìm thấy', ipa: '/ˈloʊkeɪt/' },
        { english: 'maximise', vietnamese: 'tối đa hóa', ipa: '/ˈmæksəˌmaɪz/' },
        { english: 'minor', vietnamese: 'nhỏ, phụ', ipa: '/ˈmaɪnər/' },
        { english: 'negate', vietnamese: 'phủ định', ipa: '/nɪˈgeɪt/' },
        { english: 'outcome', vietnamese: 'kết quả', ipa: '/ˈaʊtˌkʌm/' },
        { english: 'partner', vietnamese: 'đối tác', ipa: '/ˈpɑrtnər/' },
        { english: 'philosophy', vietnamese: 'triết học', ipa: '/fəˈlɑsəfi/' },
        { english: 'physical', vietnamese: 'vật lý, thể chất', ipa: '/ˈfɪzɪkəl/' },
        { english: 'proportion', vietnamese: 'tỷ lệ', ipa: '/prəˈpɔrʃən/' },
        { english: 'publish', vietnamese: 'xuất bản', ipa: '/ˈpʌblɪʃ/' },
        { english: 'react', vietnamese: 'phản ứng', ipa: '/riˈækt/' },
        { english: 'register', vietnamese: 'đăng ký', ipa: '/ˈrɛdʒəstər/' },
        { english: 'rely', vietnamese: 'dựa vào, tin cậy', ipa: '/rɪˈlaɪ/' },
        { english: 'remove', vietnamese: 'loại bỏ, di chuyển', ipa: '/rɪˈmuv/' },
        { english: 'scheme', vietnamese: 'kế hoạch, phương án', ipa: '/skim/' },
        { english: 'sequence', vietnamese: 'trình tự, chuỗi', ipa: '/ˈsikwəns/' },
        { english: 'sex', vietnamese: 'giới tính', ipa: '/sɛks/' },
        { english: 'shift', vietnamese: 'chuyển đổi, ca làm việc', ipa: '/ʃɪft/' },
        { english: 'specify', vietnamese: 'chỉ định, cụ thể hóa', ipa: '/ˈspɛsəˌfaɪ/' },
        { english: 'sufficient', vietnamese: 'đủ, đầy đủ', ipa: '/səˈfɪʃənt/' },
        { english: 'task', vietnamese: 'nhiệm vụ', ipa: '/tæsk/' },
        { english: 'technical', vietnamese: 'kỹ thuật', ipa: '/ˈtɛknɪkəl/' },
        { english: 'technique', vietnamese: 'kỹ thuật, phương pháp', ipa: '/tɛkˈnik/' },
        { english: 'technology', vietnamese: 'công nghệ', ipa: '/tɛkˈnɑlədʒi/' },
        { english: 'valid', vietnamese: 'hợp lệ, có giá trị', ipa: '/ˈvælɪd/' },
        { english: 'volume', vietnamese: 'âm lượng, khối lượng', ipa: '/ˈvɑljum/' }
      ],
      'AWL Sublist 4 - Specialized Academic Language': [
        // Sublist 4 - 60 từ chuyên biệt
        { english: 'access', vietnamese: 'truy cập, tiếp cận', ipa: '/ˈækˌsɛs/' },
        { english: 'adequate', vietnamese: 'thích đáng, đủ', ipa: '/ˈædəkwət/' },
        { english: 'annual', vietnamese: 'hàng năm', ipa: '/ˈænjuəl/' },
        { english: 'apparent', vietnamese: 'rõ ràng, có vẻ như', ipa: '/əˈpærənt/' },
        { english: 'approximate', vietnamese: 'xấp xỉ', ipa: '/əˈprɑksəmət/' },
        { english: 'attitude', vietnamese: 'thái độ', ipa: '/ˈætəˌtud/' },
        { english: 'attribute', vietnamese: 'thuộc tính, quy cho', ipa: '/ˈætrəˌbjut/' },
        { english: 'civil', vietnamese: 'dân sự, văn minh', ipa: '/ˈsɪvəl/' },
        { english: 'code', vietnamese: 'mã, bộ luật', ipa: '/koʊd/' },
        { english: 'commit', vietnamese: 'cam kết, phạm tội', ipa: '/kəˈmɪt/' },
        { english: 'communicate', vietnamese: 'giao tiếp', ipa: '/kəˈmjunəˌkeɪt/' },
        { english: 'concentrate', vietnamese: 'tập trung', ipa: '/ˈkɑnsənˌtreɪt/' },
        { english: 'confer', vietnamese: 'bàn bạc, trao', ipa: '/kənˈfɜr/' },
        { english: 'contrast', vietnamese: 'tương phản', ipa: '/ˈkɑntræst/' },
        { english: 'cycle', vietnamese: 'chu kỳ', ipa: '/ˈsaɪkəl/' },
        { english: 'debate', vietnamese: 'tranh luận', ipa: '/dɪˈbeɪt/' },
        { english: 'despite', vietnamese: 'bất chấp', ipa: '/dɪˈspaɪt/' },
        { english: 'dimension', vietnamese: 'chiều, kích thước', ipa: '/daɪˈmɛnʃən/' },
        { english: 'domestic', vietnamese: 'trong nước, gia đình', ipa: '/dəˈmɛstɪk/' },
        { english: 'emerge', vietnamese: 'nổi lên, xuất hiện', ipa: '/ɪˈmɜrdʒ/' },
        { english: 'error', vietnamese: 'lỗi', ipa: '/ˈɛrər/' },
        { english: 'ethnic', vietnamese: 'dân tộc', ipa: '/ˈɛθnɪk/' },
        { english: 'goal', vietnamese: 'mục tiêu', ipa: '/goʊl/' },
        { english: 'grant', vietnamese: 'cấp, cho phép', ipa: '/grænt/' },
        { english: 'hence', vietnamese: 'do đó', ipa: '/hɛns/' },
        { english: 'hypothesis', vietnamese: 'giả thuyết', ipa: '/haɪˈpɑθəsəs/' },
        { english: 'implement', vietnamese: 'thực hiện', ipa: '/ˈɪmpləmənt/' },
        { english: 'implicate', vietnamese: 'liên quan, ngụ ý', ipa: '/ˈɪmpləˌkeɪt/' },
        { english: 'impose', vietnamese: 'áp đặt', ipa: '/ɪmˈpoʊz/' },
        { english: 'integrate', vietnamese: 'tích hợp', ipa: '/ˈɪntəˌgreɪt/' },
        { english: 'internal', vietnamese: 'nội bộ', ipa: '/ɪnˈtɜrnəl/' },
        { english: 'investigate', vietnamese: 'điều tra', ipa: '/ɪnˈvɛstəˌgeɪt/' },
        { english: 'job', vietnamese: 'công việc', ipa: '/dʒɑb/' },
        { english: 'label', vietnamese: 'nhãn', ipa: '/ˈleɪbəl/' },
        { english: 'mechanism', vietnamese: 'cơ chế', ipa: '/ˈmɛkəˌnɪzəm/' },
        { english: 'obvious', vietnamese: 'rõ ràng', ipa: '/ˈɑbviəs/' },
        { english: 'occupy', vietnamese: 'chiếm đóng', ipa: '/ˈɑkjəˌpaɪ/' },
        { english: 'option', vietnamese: 'lựa chọn', ipa: '/ˈɑpʃən/' },
        { english: 'output', vietnamese: 'đầu ra', ipa: '/ˈaʊtˌpʊt/' },
        { english: 'overall', vietnamese: 'tổng thể', ipa: '/ˌoʊvərˈɔl/' },
        { english: 'parallel', vietnamese: 'song song', ipa: '/ˈpærəˌlɛl/' },
        { english: 'parameter', vietnamese: 'tham số', ipa: '/pəˈræmətər/' },
        { english: 'phase', vietnamese: 'giai đoạn', ipa: '/feɪz/' },
        { english: 'predict', vietnamese: 'dự đoán', ipa: '/prɪˈdɪkt/' },
        { english: 'principal', vietnamese: 'chủ yếu, hiệu trưởng', ipa: '/ˈprɪnsəpəl/' },
        { english: 'prior', vietnamese: 'trước đó', ipa: '/ˈpraɪər/' },
        { english: 'professional', vietnamese: 'chuyên nghiệp', ipa: '/prəˈfɛʃənəl/' },
        { english: 'project', vietnamese: 'dự án', ipa: '/ˈprɑdʒɛkt/' },
        { english: 'promote', vietnamese: 'thúc đẩy', ipa: '/prəˈmoʊt/' },
        { english: 'regime', vietnamese: 'chế độ', ipa: '/reɪˈʒim/' },
        { english: 'resolve', vietnamese: 'giải quyết', ipa: '/rɪˈzɑlv/' },
        { english: 'retain', vietnamese: 'giữ lại', ipa: '/rɪˈteɪn/' },
        { english: 'series', vietnamese: 'chuỗi, loạt', ipa: '/ˈsɪriz/' },
        { english: 'statistic', vietnamese: 'thống kê', ipa: '/stəˈtɪstɪk/' },
        { english: 'status', vietnamese: 'tình trạng, địa vị', ipa: '/ˈsteɪtəs/' },
        { english: 'stress', vietnamese: 'căng thẳng, nhấn mạnh', ipa: '/strɛs/' },
        { english: 'subsequent', vietnamese: 'tiếp theo', ipa: '/ˈsʌbsəkwənt/' },
        { english: 'sum', vietnamese: 'tổng', ipa: '/sʌm/' },
        { english: 'summary', vietnamese: 'tóm tắt', ipa: '/ˈsʌməri/' },
        { english: 'undertake', vietnamese: 'đảm nhận', ipa: '/ˌʌndərˈteɪk/' }
      ],
      'AWL Sublist 5 - Advanced Academic Discourse': [
        // Sublist 5 - 60 từ nâng cao
        { english: 'academy', vietnamese: 'học viện', ipa: '/əˈkædəmi/' },
        { english: 'adjust', vietnamese: 'điều chỉnh', ipa: '/əˈdʒʌst/' },
        { english: 'alter', vietnamese: 'thay đổi', ipa: '/ˈɔltər/' },
        { english: 'amend', vietnamese: 'sửa đổi', ipa: '/əˈmɛnd/' },
        { english: 'aware', vietnamese: 'nhận thức', ipa: '/əˈwɛr/' },
        { english: 'capacity', vietnamese: 'năng lực', ipa: '/kəˈpæsəti/' },
        { english: 'challenge', vietnamese: 'thách thức', ipa: '/ˈtʃælɪndʒ/' },
        { english: 'clause', vietnamese: 'điều khoản', ipa: '/klɔz/' },
        { english: 'compound', vietnamese: 'hợp chất', ipa: '/ˈkɑmpaʊnd/' },
        { english: 'conflict', vietnamese: 'xung đột', ipa: '/ˈkɑnflɪkt/' },
        { english: 'consult', vietnamese: 'tham khảo', ipa: '/kənˈsʌlt/' },
        { english: 'contact', vietnamese: 'liên lạc', ipa: '/ˈkɑntækt/' },
        { english: 'decline', vietnamese: 'suy giảm', ipa: '/dɪˈklaɪn/' },
        { english: 'discrete', vietnamese: 'riêng biệt', ipa: '/dɪˈskrit/' },
        { english: 'draft', vietnamese: 'bản thảo', ipa: '/dræft/' },
        { english: 'enable', vietnamese: 'cho phép', ipa: '/ɪˈneɪbəl/' },
        { english: 'energy', vietnamese: 'năng lượng', ipa: '/ˈɛnərdʒi/' },
        { english: 'enforce', vietnamese: 'thực thi', ipa: '/ɪnˈfɔrs/' },
        { english: 'entity', vietnamese: 'thực thể', ipa: '/ˈɛntəti/' },
        { english: 'equivalent', vietnamese: 'tương đương', ipa: '/ɪˈkwɪvələnt/' },
        { english: 'evolve', vietnamese: 'tiến hóa', ipa: '/ɪˈvɑlv/' },
        { english: 'expand', vietnamese: 'mở rộng', ipa: '/ɪkˈspænd/' },
        { english: 'expose', vietnamese: 'phơi bày', ipa: '/ɪkˈspoʊz/' },
        { english: 'external', vietnamese: 'bên ngoài', ipa: '/ɪkˈstɜrnəl/' },
        { english: 'facilitate', vietnamese: 'tạo điều kiện', ipa: '/fəˈsɪləˌteɪt/' },
        { english: 'fundamental', vietnamese: 'cơ bản', ipa: '/ˌfʌndəˈmɛntəl/' },
        { english: 'generate', vietnamese: 'tạo ra', ipa: '/ˈdʒɛnəˌreɪt/' },
        { english: 'generation', vietnamese: 'thế hệ', ipa: '/ˌdʒɛnəˈreɪʃən/' },
        { english: 'image', vietnamese: 'hình ảnh', ipa: '/ˈɪmɪdʒ/' },
        { english: 'liberal', vietnamese: 'tự do', ipa: '/ˈlɪbərəl/' },
        { english: 'licence', vietnamese: 'giấy phép', ipa: '/ˈlaɪsəns/' },
        { english: 'logic', vietnamese: 'logic', ipa: '/ˈlɑdʒɪk/' },
        { english: 'margin', vietnamese: 'lề, biên', ipa: '/ˈmɑrdʒən/' },
        { english: 'medical', vietnamese: 'y tế', ipa: '/ˈmɛdəkəl/' },
        { english: 'mental', vietnamese: 'tinh thần', ipa: '/ˈmɛntəl/' },
        { english: 'modify', vietnamese: 'sửa đổi', ipa: '/ˈmɑdəˌfaɪ/' },
        { english: 'monitor', vietnamese: 'giám sát', ipa: '/ˈmɑnətər/' },
        { english: 'network', vietnamese: 'mạng lưới', ipa: '/ˈnɛtˌwɜrk/' },
        { english: 'notion', vietnamese: 'khái niệm', ipa: '/ˈnoʊʃən/' },
        { english: 'objective', vietnamese: 'mục tiêu', ipa: '/əbˈdʒɛktɪv/' },
        { english: 'orient', vietnamese: 'định hướng', ipa: '/ˈɔriɛnt/' },
        { english: 'perspective', vietnamese: 'quan điểm', ipa: '/pərˈspɛktɪv/' },
        { english: 'precise', vietnamese: 'chính xác', ipa: '/prɪˈsaɪs/' },
        { english: 'prime', vietnamese: 'chính, đầu tiên', ipa: '/praɪm/' },
        { english: 'psychology', vietnamese: 'tâm lý học', ipa: '/saɪˈkɑlədʒi/' },
        { english: 'pursue', vietnamese: 'theo đuổi', ipa: '/pərˈsu/' },
        { english: 'ratio', vietnamese: 'tỷ lệ', ipa: '/ˈreɪʃioʊ/' },
        { english: 'reject', vietnamese: 'từ chối', ipa: '/rɪˈdʒɛkt/' },
        { english: 'revenue', vietnamese: 'doanh thu', ipa: '/ˈrɛvəˌnu/' },
        { english: 'stable', vietnamese: 'ổn định', ipa: '/ˈsteɪbəl/' },
        { english: 'style', vietnamese: 'phong cách', ipa: '/staɪl/' },
        { english: 'substitute', vietnamese: 'thay thế', ipa: '/ˈsʌbstəˌtut/' },
        { english: 'sustain', vietnamese: 'duy trì', ipa: '/səˈsteɪn/' },
        { english: 'symbol', vietnamese: 'biểu tượng', ipa: '/ˈsɪmbəl/' },
        { english: 'target', vietnamese: 'mục tiêu', ipa: '/ˈtɑrgət/' },
        { english: 'transit', vietnamese: 'quá cảnh', ipa: '/ˈtrænzət/' },
        { english: 'trend', vietnamese: 'xu hướng', ipa: '/trɛnd/' },
        { english: 'version', vietnamese: 'phiên bản', ipa: '/ˈvɜrʒən/' },
        { english: 'welfare', vietnamese: 'phúc lợi', ipa: '/ˈwɛlˌfɛr/' },
        { english: 'whereas', vietnamese: 'trong khi', ipa: '/wɛrˈæz/' }
      ]
    };

    const results = [];

    // Import từng lesson
    for (const lessonData of awlLessons) {
      console.log(`Tạo lesson: ${lessonData.title}`);
      
      const lesson = await lessonDb.create({
        name: lessonData.title,
        description: lessonData.description,
        color: '#2563eb'
      });

      if (lesson?.id) {
        const vocabularyList = awlVocabulary[lessonData.title] || [];
        console.log(`Import ${vocabularyList.length} từ vựng cho lesson: ${lessonData.title}`);

        // Import flashcards cho lesson này
        for (const vocab of vocabularyList) {
          try {
            await flashcardDb.create({
              english: vocab.english,
              vietnamese: vocab.vietnamese,
              ipa: vocab.ipa,
              category: 'Academic',
              difficulty: 3,
              lesson_id: lesson.id
            });
          } catch (error) {
            console.error(`Lỗi khi tạo flashcard cho từ "${vocab.english}":`, error);
          }
        }

        results.push({
          lesson: lessonData.title,
          flashcards_count: vocabularyList.length
        });
      }
    }

    console.log('Hoàn thành import Academic Word List!');
    
    return NextResponse.json({
      success: true,
      message: 'Import Academic Word List thành công!',
      results: results,
      total_lessons: results.length,
      total_flashcards: results.reduce((sum, r) => sum + r.flashcards_count, 0)
    });

  } catch (error) {
    console.error('Lỗi khi import Academic Word List:', error);
    return NextResponse.json({
      success: false,
      error: 'Có lỗi xảy ra khi import Academic Word List',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
