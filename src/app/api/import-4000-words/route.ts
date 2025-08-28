import { NextResponse } from 'next/server';
import { lessonDb, flashcardDb } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('Bắt đầu import IELTS 4000 Words...');

    // Tạo các lessons cho IELTS 4000 Words theo band scores
    const ielts4000Lessons = [
      {
        title: 'IELTS 4000 - Band 5.0-5.5 Essential',
        description: 'Từ vựng cần thiết để đạt Band 5.0-5.5',
        category: 'IELTS 4000'
      },
      {
        title: 'IELTS 4000 - Band 6.0-6.5 Intermediate',
        description: 'Từ vựng trung cấp để đạt Band 6.0-6.5',
        category: 'IELTS 4000'
      },
      {
        title: 'IELTS 4000 - Band 7.0-7.5 Advanced',
        description: 'Từ vựng nâng cao để đạt Band 7.0-7.5',
        category: 'IELTS 4000'
      },
      {
        title: 'IELTS 4000 - Band 8.0+ Expert',
        description: 'Từ vựng chuyên sâu để đạt Band 8.0+',
        category: 'IELTS 4000'
      }
    ];

    // IELTS 4000 Words vocabulary - 240 từ được chọn lọc
    const ielts4000Vocabulary: Record<string, Array<{english: string; vietnamese: string; ipa: string}>> = {
      'IELTS 4000 - Band 5.0-5.5 Essential': [
        // Band 5.0-5.5 Essential vocabulary - 60 từ
        { english: 'accommodation', vietnamese: 'chỗ ở', ipa: '/əˌkɑːməˈdeɪʃn/' },
        { english: 'advantage', vietnamese: 'lợi thế', ipa: '/ədˈvæntɪdʒ/' },
        { english: 'behavior', vietnamese: 'hành vi', ipa: '/bɪˈheɪvjər/' },
        { english: 'challenge', vietnamese: 'thách thức', ipa: '/ˈtʃælɪndʒ/' },
        { english: 'develop', vietnamese: 'phát triển', ipa: '/dɪˈveləp/' },
        { english: 'experience', vietnamese: 'kinh nghiệm', ipa: '/ɪkˈspɪriəns/' },
        { english: 'facility', vietnamese: 'cơ sở vật chất', ipa: '/fəˈsɪləti/' },
        { english: 'generation', vietnamese: 'thế hệ', ipa: '/ˌdʒenəˈreɪʃn/' },
        { english: 'influence', vietnamese: 'ảnh hưởng', ipa: '/ˈɪnfluəns/' },
        { english: 'knowledge', vietnamese: 'kiến thức', ipa: '/ˈnɑːlɪdʒ/' },
        { english: 'lifestyle', vietnamese: 'lối sống', ipa: '/ˈlaɪfstaɪl/' },
        { english: 'opportunity', vietnamese: 'cơ hội', ipa: '/ˌɑːpərˈtuːnəti/' },
        { english: 'population', vietnamese: 'dân số', ipa: '/ˌpɑːpjəˈleɪʃn/' },
        { english: 'relationship', vietnamese: 'mối quan hệ', ipa: '/rɪˈleɪʃnʃɪp/' },
        { english: 'society', vietnamese: 'xã hội', ipa: '/səˈsaɪəti/' },
        { english: 'technology', vietnamese: 'công nghệ', ipa: '/tekˈnɑːlədʒi/' },
        { english: 'university', vietnamese: 'đại học', ipa: '/ˌjuːnɪˈvɜːrsəti/' },
        { english: 'volunteer', vietnamese: 'tình nguyện viên', ipa: '/ˌvɑːlənˈtɪr/' },
        { english: 'achievement', vietnamese: 'thành tựu', ipa: '/əˈtʃiːvmənt/' },
        { english: 'competition', vietnamese: 'cuộc thi', ipa: '/ˌkɑːmpəˈtɪʃn/' },
        { english: 'disadvantage', vietnamese: 'bất lợi', ipa: '/ˌdɪsədˈvæntɪdʒ/' },
        { english: 'environment', vietnamese: 'môi trường', ipa: '/ɪnˈvaɪrənmənt/' },
        { english: 'government', vietnamese: 'chính phủ', ipa: '/ˈɡʌvərnmənt/' },
        { english: 'improvement', vietnamese: 'cải thiện', ipa: '/ɪmˈpruːvmənt/' },
        { english: 'independence', vietnamese: 'độc lập', ipa: '/ˌɪndɪˈpendəns/' },
        { english: 'responsibility', vietnamese: 'trách nhiệm', ipa: '/rɪˌspɑːnsəˈbɪləti/' },
        { english: 'transportation', vietnamese: 'giao thông', ipa: '/ˌtrænspərˈteɪʃn/' },
        { english: 'communication', vietnamese: 'giao tiếp', ipa: '/kəˌmjuːnɪˈkeɪʃn/' },
        { english: 'education', vietnamese: 'giáo dục', ipa: '/ˌedʒuˈkeɪʃn/' },
        { english: 'entertainment', vietnamese: 'giải trí', ipa: '/ˌentərˈteɪnmənt/' },
        { english: 'organization', vietnamese: 'tổ chức', ipa: '/ˌɔːrɡənəˈzeɪʃn/' },
        { english: 'participant', vietnamese: 'người tham gia', ipa: '/pɑːrˈtɪsəpənt/' },
        { english: 'advertisement', vietnamese: 'quảng cáo', ipa: '/ˌædvərˈtaɪzmənt/' },
        { english: 'community', vietnamese: 'cộng đồng', ipa: '/kəˈmjuːnəti/' },
        { english: 'employment', vietnamese: 'việc làm', ipa: '/ɪmˈplɔɪmənt/' },
        { english: 'friendship', vietnamese: 'tình bạn', ipa: '/ˈfrendʃɪp/' },
        { english: 'leadership', vietnamese: 'lãnh đạo', ipa: '/ˈliːdərʃɪp/' },
        { english: 'membership', vietnamese: 'thành viên', ipa: '/ˈmembərʃɪp/' },
        { english: 'partnership', vietnamese: 'đối tác', ipa: '/ˈpɑːrtnərʃɪp/' },
        { english: 'scholarship', vietnamese: 'học bổng', ipa: '/ˈskɑːlərʃɪp/' },
        { english: 'citizenship', vietnamese: 'quyền công dân', ipa: '/ˈsɪtɪzənʃɪp/' },
        { english: 'ownership', vietnamese: 'quyền sở hữu', ipa: '/ˈoʊnərʃɪp/' },
        { english: 'sponsorship', vietnamese: 'tài trợ', ipa: '/ˈspɑːnsərʃɪp/' },
        { english: 'championship', vietnamese: 'giải vô địch', ipa: '/ˈtʃæmpiənʃɪp/' },
        { english: 'apprenticeship', vietnamese: 'học nghề', ipa: '/əˈprentɪsʃɪp/' },
        { english: 'entrepreneurship', vietnamese: 'tinh thần kinh doanh', ipa: '/ˌɑːntrəprəˈnɜːrʃɪp/' },
        { english: 'relationship', vietnamese: 'mối quan hệ', ipa: '/rɪˈleɪʃnʃɪp/' },
        { english: 'championship', vietnamese: 'chức vô địch', ipa: '/ˈtʃæmpiənʃɪp/' },
        { english: 'establishment', vietnamese: 'thành lập', ipa: '/ɪˈstæblɪʃmənt/' },
        { english: 'development', vietnamese: 'phát triển', ipa: '/dɪˈveləpmənt/' },
        { english: 'investment', vietnamese: 'đầu tư', ipa: '/ɪnˈvestmənt/' },
        { english: 'management', vietnamese: 'quản lý', ipa: '/ˈmænɪdʒmənt/' },
        { english: 'treatment', vietnamese: 'điều trị', ipa: '/ˈtriːtmənt/' },
        { english: 'equipment', vietnamese: 'thiết bị', ipa: '/ɪˈkwɪpmənt/' },
        { english: 'requirement', vietnamese: 'yêu cầu', ipa: '/rɪˈkwaɪərmənt/' },
        { english: 'department', vietnamese: 'phòng ban', ipa: '/dɪˈpɑːrtmənt/' },
        { english: 'experiment', vietnamese: 'thí nghiệm', ipa: '/ɪkˈsperəmənt/' },
        { english: 'statement', vietnamese: 'tuyên bố', ipa: '/ˈsteɪtmənt/' },
        { english: 'movement', vietnamese: 'phong trào', ipa: '/ˈmuːvmənt/' },
        { english: 'agreement', vietnamese: 'thỏa thuận', ipa: '/əˈɡriːmənt/' },
        { english: 'assignment', vietnamese: 'bài tập', ipa: '/əˈsaɪnmənt/' }
      ],
      'IELTS 4000 - Band 6.0-6.5 Intermediate': [
        // Band 6.0-6.5 Intermediate vocabulary - 60 từ
        { english: 'accelerate', vietnamese: 'tăng tốc', ipa: '/ækˈseləreɪt/' },
        { english: 'accomplish', vietnamese: 'hoàn thành', ipa: '/əˈkɑːmplɪʃ/' },
        { english: 'accumulate', vietnamese: 'tích lũy', ipa: '/əˈkjuːmjəleɪt/' },
        { english: 'acquire', vietnamese: 'có được', ipa: '/əˈkwaɪər/' },
        { english: 'adequate', vietnamese: 'đủ', ipa: '/ˈædəkwət/' },
        { english: 'advocate', vietnamese: 'ủng hộ', ipa: '/ˈædvəkeɪt/' },
        { english: 'allocate', vietnamese: 'phân bổ', ipa: '/ˈæləkeɪt/' },
        { english: 'anticipate', vietnamese: 'dự đoán', ipa: '/ænˈtɪsəpeɪt/' },
        { english: 'appreciate', vietnamese: 'đánh giá cao', ipa: '/əˈpriːʃieɪt/' },
        { english: 'articulate', vietnamese: 'diễn đạt rõ ràng', ipa: '/ɑːrˈtɪkjəleɪt/' },
        { english: 'aspiration', vietnamese: 'khát vọng', ipa: '/ˌæspəˈreɪʃn/' },
        { english: 'beneficial', vietnamese: 'có lợi', ipa: '/ˌbenəˈfɪʃl/' },
        { english: 'categorize', vietnamese: 'phân loại', ipa: '/ˈkætəɡəraɪz/' },
        { english: 'collaborate', vietnamese: 'hợp tác', ipa: '/kəˈlæbəreɪt/' },
        { english: 'compensate', vietnamese: 'bù đắp', ipa: '/ˈkɑːmpenseɪt/' },
        { english: 'comprehensive', vietnamese: 'toàn diện', ipa: '/ˌkɑːmprɪˈhensɪv/' },
        { english: 'consequence', vietnamese: 'hậu quả', ipa: '/ˈkɑːnsəkwəns/' },
        { english: 'considerable', vietnamese: 'đáng kể', ipa: '/kənˈsɪdərəbl/' },
        { english: 'contemporary', vietnamese: 'đương đại', ipa: '/kənˈtempəreri/' },
        { english: 'contribute', vietnamese: 'đóng góp', ipa: '/kənˈtrɪbjuːt/' },
        { english: 'controversial', vietnamese: 'gây tranh cãi', ipa: '/ˌkɑːntrəˈvɜːrʃl/' },
        { english: 'coordinate', vietnamese: 'phối hợp', ipa: '/koʊˈɔːrdəneɪt/' },
        { english: 'deteriorate', vietnamese: 'xấu đi', ipa: '/dɪˈtɪriəreɪt/' },
        { english: 'differentiate', vietnamese: 'phân biệt', ipa: '/ˌdɪfəˈrenʃieɪt/' },
        { english: 'dimension', vietnamese: 'chiều kích', ipa: '/daɪˈmenʃn/' },
        { english: 'eliminate', vietnamese: 'loại bỏ', ipa: '/ɪˈlɪməneɪt/' },
        { english: 'emphasize', vietnamese: 'nhấn mạnh', ipa: '/ˈemfəsaɪz/' },
        { english: 'enhance', vietnamese: 'tăng cường', ipa: '/ɪnˈhæns/' },
        { english: 'equivalent', vietnamese: 'tương đương', ipa: '/ɪˈkwɪvələnt/' },
        { english: 'evaluate', vietnamese: 'đánh giá', ipa: '/ɪˈvæljueɪt/' },
        { english: 'fluctuate', vietnamese: 'dao động', ipa: '/ˈflʌktʃueɪt/' },
        { english: 'generate', vietnamese: 'tạo ra', ipa: '/ˈdʒenəreɪt/' },
        { english: 'implement', vietnamese: 'thực hiện', ipa: '/ˈɪmpləment/' },
        { english: 'inevitable', vietnamese: 'không thể tránh khỏi', ipa: '/ɪnˈevətəbl/' },
        { english: 'infrastructure', vietnamese: 'cơ sở hạ tầng', ipa: '/ˈɪnfrəstrʌktʃər/' },
        { english: 'innovative', vietnamese: 'sáng tạo', ipa: '/ˈɪnəveɪtɪv/' },
        { english: 'integrate', vietnamese: 'tích hợp', ipa: '/ˈɪntəɡreɪt/' },
        { english: 'intensity', vietnamese: 'cường độ', ipa: '/ɪnˈtensəti/' },
        { english: 'interpretation', vietnamese: 'diễn giải', ipa: '/ɪnˌtɜːrprəˈteɪʃn/' },
        { english: 'investigate', vietnamese: 'điều tra', ipa: '/ɪnˈvestɪɡeɪt/' },
        { english: 'legitimate', vietnamese: 'hợp pháp', ipa: '/lɪˈdʒɪtəmət/' },
        { english: 'magnificent', vietnamese: 'tráng lệ', ipa: '/mæɡˈnɪfəsnt/' },
        { english: 'manipulate', vietnamese: 'thao túng', ipa: '/məˈnɪpjəleɪt/' },
        { english: 'maximize', vietnamese: 'tối đa hóa', ipa: '/ˈmæksəmaɪz/' },
        { english: 'methodology', vietnamese: 'phương pháp luận', ipa: '/ˌmeθəˈdɑːlədʒi/' },
        { english: 'minimize', vietnamese: 'tối thiểu hóa', ipa: '/ˈmɪnəmaɪz/' },
        { english: 'moderate', vietnamese: 'vừa phải', ipa: '/ˈmɑːdərət/' },
        { english: 'motivate', vietnamese: 'thúc đẩy', ipa: '/ˈmoʊtəveɪt/' },
        { english: 'navigate', vietnamese: 'điều hướng', ipa: '/ˈnævəɡeɪt/' },
        { english: 'optimize', vietnamese: 'tối ưu hóa', ipa: '/ˈɑːptəmaɪz/' },
        { english: 'participate', vietnamese: 'tham gia', ipa: '/pɑːrˈtɪsəpeɪt/' },
        { english: 'perspective', vietnamese: 'quan điểm', ipa: '/pərˈspektɪv/' },
        { english: 'phenomenon', vietnamese: 'hiện tượng', ipa: '/fəˈnɑːmənɑːn/' },
        { english: 'preliminary', vietnamese: 'sơ bộ', ipa: '/prɪˈlɪməneri/' },
        { english: 'prioritize', vietnamese: 'ưu tiên', ipa: '/praɪˈɔːrətaɪz/' },
        { english: 'procedure', vietnamese: 'quy trình', ipa: '/prəˈsiːdʒər/' },
        { english: 'regulate', vietnamese: 'điều chỉnh', ipa: '/ˈreɡjəleɪt/' },
        { english: 'significant', vietnamese: 'quan trọng', ipa: '/sɪɡˈnɪfəkənt/' },
        { english: 'substitute', vietnamese: 'thay thế', ipa: '/ˈsʌbstətuːt/' },
        { english: 'sustainable', vietnamese: 'bền vững', ipa: '/səˈsteɪnəbl/' },
        { english: 'transparent', vietnamese: 'minh bạch', ipa: '/trænsˈpærənt/' }
      ],
      'IELTS 4000 - Band 7.0-7.5 Advanced': [
        // Band 7.0-7.5 Advanced vocabulary - 60 từ
        { english: 'accommodate', vietnamese: 'chứa đựng, thích ứng', ipa: '/əˈkɑːmədeɪt/' },
        { english: 'ambiguous', vietnamese: 'mơ hồ', ipa: '/æmˈbɪɡjuəs/' },
        { english: 'analogous', vietnamese: 'tương tự', ipa: '/əˈnæləɡəs/' },
        { english: 'arbitrary', vietnamese: 'tùy ý', ipa: '/ˈɑːrbətreri/' },
        { english: 'assert', vietnamese: 'khẳng định', ipa: '/əˈsɜːrt/' },
        { english: 'attain', vietnamese: 'đạt được', ipa: '/əˈteɪn/' },
        { english: 'attribute', vietnamese: 'quy cho', ipa: '/əˈtrɪbjuːt/' },
        { english: 'coherent', vietnamese: 'mạch lạc', ipa: '/koʊˈhɪrənt/' },
        { english: 'compelling', vietnamese: 'thuyết phục', ipa: '/kəmˈpelɪŋ/' },
        { english: 'concise', vietnamese: 'ngắn gọn', ipa: '/kənˈsaɪs/' },
        { english: 'consensus', vietnamese: 'sự đồng thuận', ipa: '/kənˈsensəs/' },
        { english: 'constraint', vietnamese: 'ràng buộc', ipa: '/kənˈstreɪnt/' },
        { english: 'contemplate', vietnamese: 'suy ngẫm', ipa: '/ˈkɑːntəmpleɪt/' },
        { english: 'controversial', vietnamese: 'gây tranh cãi', ipa: '/ˌkɑːntrəˈvɜːrʃl/' },
        { english: 'decisive', vietnamese: 'quyết định', ipa: '/dɪˈsaɪsɪv/' },
        { english: 'deterioration', vietnamese: 'sự suy thoái', ipa: '/dɪˌtɪriəˈreɪʃn/' },
        { english: 'diminish', vietnamese: 'giảm bớt', ipa: '/dɪˈmɪnɪʃ/' },
        { english: 'discrepancy', vietnamese: 'sự khác biệt', ipa: '/dɪsˈkrepənsi/' },
        { english: 'diversity', vietnamese: 'sự đa dạng', ipa: '/daɪˈvɜːrsəti/' },
        { english: 'elaborate', vietnamese: 'trình bày chi tiết', ipa: '/ɪˈlæbəreɪt/' },
        { english: 'enhance', vietnamese: 'nâng cao', ipa: '/ɪnˈhæns/' },
        { english: 'ethics', vietnamese: 'đạo đức', ipa: '/ˈeθɪks/' },
        { english: 'exceed', vietnamese: 'vượt quá', ipa: '/ɪkˈsiːd/' },
        { english: 'explicit', vietnamese: 'rõ ràng', ipa: '/ɪkˈsplɪsət/' },
        { english: 'fluctuation', vietnamese: 'sự dao động', ipa: '/ˌflʌktʃuˈeɪʃn/' },
        { english: 'fundamental', vietnamese: 'cơ bản', ipa: '/ˌfʌndəˈmentl/' },
        { english: 'hierarchy', vietnamese: 'thứ bậc', ipa: '/ˈhaɪərɑːrki/' },
        { english: 'hypothesis', vietnamese: 'giả thuyết', ipa: '/haɪˈpɑːθəsəs/' },
        { english: 'immerse', vietnamese: 'đắm chìm', ipa: '/ɪˈmɜːrs/' },
        { english: 'imperative', vietnamese: 'cấp thiết', ipa: '/ɪmˈperətɪv/' },
        { english: 'incentive', vietnamese: 'động lực', ipa: '/ɪnˈsentɪv/' },
        { english: 'inconsistent', vietnamese: 'không nhất quán', ipa: '/ˌɪnkənˈsɪstənt/' },
        { english: 'inherent', vietnamese: 'vốn có', ipa: '/ɪnˈhɪrənt/' },
        { english: 'innovative', vietnamese: 'đổi mới', ipa: '/ˈɪnəveɪtɪv/' },
        { english: 'integrity', vietnamese: 'toàn vẹn', ipa: '/ɪnˈteɡrəti/' },
        { english: 'intermediate', vietnamese: 'trung gian', ipa: '/ˌɪntərˈmiːdiət/' },
        { english: 'justify', vietnamese: 'biện minh', ipa: '/ˈdʒʌstəfaɪ/' },
        { english: 'legitimate', vietnamese: 'chính đáng', ipa: '/lɪˈdʒɪtəmət/' },
        { english: 'magnitude', vietnamese: 'quy mô', ipa: '/ˈmæɡnətuːd/' },
        { english: 'manifestation', vietnamese: 'biểu hiện', ipa: '/ˌmænəfeˈsteɪʃn/' },
        { english: 'meticulous', vietnamese: 'tỉ mỉ', ipa: '/məˈtɪkjələs/' },
        { english: 'mutual', vietnamese: 'lẫn nhau', ipa: '/ˈmjuːtʃuəl/' },
        { english: 'notion', vietnamese: 'khái niệm', ipa: '/ˈnoʊʃn/' },
        { english: 'objective', vietnamese: 'khách quan', ipa: '/əbˈdʒektɪv/' },
        { english: 'paradox', vietnamese: 'nghịch lý', ipa: '/ˈpærədɑːks/' },
        { english: 'perceive', vietnamese: 'nhận thức', ipa: '/pərˈsiːv/' },
        { english: 'persistent', vietnamese: 'bền bỉ', ipa: '/pərˈsɪstənt/' },
        { english: 'plausible', vietnamese: 'hợp lý', ipa: '/ˈplɔːzəbl/' },
        { english: 'pragmatic', vietnamese: 'thực dụng', ipa: '/præɡˈmætɪk/' },
        { english: 'prerequisite', vietnamese: 'điều kiện tiên quyết', ipa: '/priˈrekwəzət/' },
        { english: 'profound', vietnamese: 'sâu sắc', ipa: '/prəˈfaʊnd/' },
        { english: 'rational', vietnamese: 'hợp lý', ipa: '/ˈræʃənl/' },
        { english: 'reconcile', vietnamese: 'hòa giải', ipa: '/ˈrekənsaɪl/' },
        { english: 'refine', vietnamese: 'tinh chế', ipa: '/rɪˈfaɪn/' },
        { english: 'reluctant', vietnamese: 'miễn cưỡng', ipa: '/rɪˈlʌktənt/' },
        { english: 'rigorous', vietnamese: 'nghiêm ngặt', ipa: '/ˈrɪɡərəs/' },
        { english: 'scrutinize', vietnamese: 'xem xét kỹ', ipa: '/ˈskruːtənaɪz/' },
        { english: 'sophisticated', vietnamese: 'tinh vi', ipa: '/səˈfɪstəkeɪtəd/' },
        { english: 'submit', vietnamese: 'đệ trình', ipa: '/səbˈmɪt/' },
        { english: 'synthesis', vietnamese: 'sự tổng hợp', ipa: '/ˈsɪnθəsəs/' }
      ],
      'IELTS 4000 - Band 8.0+ Expert': [
        // Band 8.0+ Expert vocabulary - 60 từ
        { english: 'abstraction', vietnamese: 'sự trừu tượng', ipa: '/æbˈstrækʃn/' },
        { english: 'ambivalent', vietnamese: 'mâu thuẫn', ipa: '/æmˈbɪvələnt/' },
        { english: 'articulation', vietnamese: 'sự diễn đạt', ipa: '/ɑːrˌtɪkjəˈleɪʃn/' },
        { english: 'assimilation', vietnamese: 'sự đồng hóa', ipa: '/əˌsɪməˈleɪʃn/' },
        { english: 'catalyst', vietnamese: 'chất xúc tác', ipa: '/ˈkætəlɪst/' },
        { english: 'cogent', vietnamese: 'thuyết phục', ipa: '/ˈkoʊdʒənt/' },
        { english: 'comprehensive', vietnamese: 'toàn diện', ipa: '/ˌkɑːmprɪˈhensɪv/' },
        { english: 'conceptualize', vietnamese: 'khái niệm hóa', ipa: '/kənˈseptʃuəlaɪz/' },
        { english: 'connotation', vietnamese: 'hàm ý', ipa: '/ˌkɑːnəˈteɪʃn/' },
        { english: 'contingent', vietnamese: 'tùy thuộc', ipa: '/kənˈtɪndʒənt/' },
        { english: 'corroborate', vietnamese: 'xác nhận', ipa: '/kəˈrɑːbəreɪt/' },
        { english: 'culmination', vietnamese: 'đỉnh cao', ipa: '/ˌkʌlməˈneɪʃn/' },
        { english: 'delineate', vietnamese: 'phác thảo', ipa: '/dɪˈlɪnieɪt/' },
        { english: 'dichotomy', vietnamese: 'sự phân đôi', ipa: '/daɪˈkɑːtəmi/' },
        { english: 'disparity', vietnamese: 'sự chênh lệch', ipa: '/dɪˈspærəti/' },
        { english: 'eloquent', vietnamese: 'hùng biện', ipa: '/ˈeləkwənt/' },
        { english: 'empirical', vietnamese: 'thực nghiệm', ipa: '/ɪmˈpɪrɪkl/' },
        { english: 'exemplify', vietnamese: 'minh họa', ipa: '/ɪɡˈzempləfaɪ/' },
        { english: 'extrapolate', vietnamese: 'ngoại suy', ipa: '/ɪkˈstræpəleɪt/' },
        { english: 'formidable', vietnamese: 'đáng gờm', ipa: '/ˈfɔːrmədəbl/' },
        { english: 'genesis', vietnamese: 'nguồn gốc', ipa: '/ˈdʒenəsəs/' },
        { english: 'hegemony', vietnamese: 'quyền bá chủ', ipa: '/hɪˈdʒeməni/' },
        { english: 'idiom', vietnamese: 'thành ngữ', ipa: '/ˈɪdiəm/' },
        { english: 'impetus', vietnamese: 'động lực', ipa: '/ˈɪmpətəs/' },
        { english: 'incarnation', vietnamese: 'hiện thân', ipa: '/ˌɪnkɑːrˈneɪʃn/' },
        { english: 'ingenious', vietnamese: 'tài tình', ipa: '/ɪnˈdʒiːniəs/' },
        { english: 'intrinsic', vietnamese: 'nội tại', ipa: '/ɪnˈtrɪnzɪk/' },
        { english: 'juxtaposition', vietnamese: 'sự đặt cạnh nhau', ipa: '/ˌdʒʌkstəpəˈzɪʃn/' },
        { english: 'lucid', vietnamese: 'rõ ràng', ipa: '/ˈluːsəd/' },
        { english: 'meticulous', vietnamese: 'tỉ mỉ', ipa: '/məˈtɪkjələs/' },
        { english: 'nuance', vietnamese: 'sắc thái', ipa: '/ˈnuːɑːns/' },
        { english: 'omnipresent', vietnamese: 'có mặt khắp nơi', ipa: '/ˌɑːmnɪˈpreznt/' },
        { english: 'paradigm', vietnamese: 'mô hình', ipa: '/ˈpærədaɪm/' },
        { english: 'pervasive', vietnamese: 'lan tỏa', ipa: '/pərˈveɪsɪv/' },
        { english: 'precedent', vietnamese: 'tiền lệ', ipa: '/ˈpresədənt/' },
        { english: 'quintessential', vietnamese: 'tinh túy', ipa: '/ˌkwɪntəˈsenʃl/' },
        { english: 'ramification', vietnamese: 'hệ quả', ipa: '/ˌræməfəˈkeɪʃn/' },
        { english: 'repertoire', vietnamese: 'kho tàng', ipa: '/ˈrepərtwɑːr/' },
        { english: 'rhetoric', vietnamese: 'hùng biện', ipa: '/ˈretərɪk/' },
        { english: 'salient', vietnamese: 'nổi bật', ipa: '/ˈseɪliənt/' },
        { english: 'substantiate', vietnamese: 'chứng minh', ipa: '/səbˈstænʃieɪt/' },
        { english: 'symbiosis', vietnamese: 'cộng sinh', ipa: '/ˌsɪmbaɪˈoʊsəs/' },
        { english: 'tangible', vietnamese: 'hữu hình', ipa: '/ˈtændʒəbl/' },
        { english: 'ubiquitous', vietnamese: 'có mặt khắp nơi', ipa: '/juˈbɪkwətəs/' },
        { english: 'unprecedented', vietnamese: 'chưa từng có', ipa: '/ʌnˈpresədentəd/' },
        { english: 'validate', vietnamese: 'xác nhận', ipa: '/ˈvælədeɪt/' },
        { english: 'versatile', vietnamese: 'đa năng', ipa: '/ˈvɜːrsətl/' },
        { english: 'viable', vietnamese: 'khả thi', ipa: '/ˈvaɪəbl/' },
        { english: 'vigilant', vietnamese: 'cảnh giác', ipa: '/ˈvɪdʒələnt/' },
        { english: 'volatile', vietnamese: 'không ổn định', ipa: '/ˈvɑːlətl/' },
        { english: 'zealous', vietnamese: 'nhiệt tình', ipa: '/ˈzeləs/' },
        { english: 'adversity', vietnamese: 'nghịch cảnh', ipa: '/ədˈvɜːrsəti/' },
        { english: 'allegory', vietnamese: 'ngụ ngôn', ipa: '/ˈæləɡɔːri/' },
        { english: 'anthology', vietnamese: 'tuyển tập', ipa: '/ænˈθɑːlədʒi/' },
        { english: 'bureaucracy', vietnamese: 'quan liêu', ipa: '/bjʊˈrɑːkrəsi/' },
        { english: 'capitulate', vietnamese: 'đầu hàng', ipa: '/kəˈpɪtʃəleɪt/' },
        { english: 'chronology', vietnamese: 'niên đại', ipa: '/krəˈnɑːlədʒi/' },
        { english: 'deliberate', vietnamese: 'có chủ ý', ipa: '/dɪˈlɪbərət/' },
        { english: 'erudite', vietnamese: 'uyên bác', ipa: '/ˈerjədaɪt/' },
        { english: 'metamorphosis', vietnamese: 'sự biến hóa', ipa: '/ˌmetəˈmɔːrfəsəs/' }
      ]
    };

    const results = [];

    // Import từng lesson
    for (const lessonData of ielts4000Lessons) {
      console.log(`Tạo lesson: ${lessonData.title}`);
      
      const lesson = await lessonDb.create({
        name: lessonData.title,
        description: lessonData.description,
        color: '#dc2626'
      });

      if (lesson?.id) {
        const vocabularyList = ielts4000Vocabulary[lessonData.title] || [];
        console.log(`Import ${vocabularyList.length} từ vựng cho lesson: ${lessonData.title}`);

        // Import flashcards cho lesson này
        for (const vocab of vocabularyList) {
          try {
            await flashcardDb.create({
              english: vocab.english,
              vietnamese: vocab.vietnamese,
              ipa: vocab.ipa,
              category: 'IELTS',
              difficulty: lessonData.title.includes('5.0-5.5') ? 2 :
                        lessonData.title.includes('6.0-6.5') ? 3 :
                        lessonData.title.includes('7.0-7.5') ? 4 : 5,
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

    console.log('Hoàn thành import IELTS 4000 Words!');
    
    return NextResponse.json({
      success: true,
      message: 'Import IELTS 4000 Words thành công!',
      results: results,
      total_lessons: results.length,
      total_flashcards: results.reduce((sum, r) => sum + r.flashcards_count, 0)
    });

  } catch (error) {
    console.error('Lỗi khi import IELTS 4000 Words:', error);
    return NextResponse.json({
      success: false,
      error: 'Có lỗi xảy ra khi import IELTS 4000 Words',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
