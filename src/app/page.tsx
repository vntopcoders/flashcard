'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { Plus, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react'
import FlashcardComponent from '@/components/FlashcardComponent'
import AddFlashcardForm from '@/components/AddFlashcardForm'
import WelcomeDashboard from '@/components/WelcomeDashboard'
import LessonChunksSelector from '@/components/LessonChunksSelector'
import DailyLessonCompletion from '@/components/DailyLessonCompletion'
import UserInfo from '@/components/UserInfo'
import HomeDashboard from '@/components/HomeDashboard'
import { Flashcard, Lesson } from '@/types/flashcard'
import { useSearchParams } from 'next/navigation'
import { getCurrentUserId } from '@/lib/user-utils'

function FlashcardApp() {
  const searchParams = useSearchParams()
  
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    searchParams.get('lesson')
  )
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [showChunkSelector, setShowChunkSelector] = useState(false)
  const [lessonTotalWords, setLessonTotalWords] = useState(0)
  
  // Daily lesson support
  const [dailyLessonNumber, setDailyLessonNumber] = useState<number | null>(
    searchParams.get('daily-lesson') ? parseInt(searchParams.get('daily-lesson')!) : null
  )
  const [dailyLessonPhase, setDailyLessonPhase] = useState<string | null>(
    searchParams.get('phase')
  )
  
  // Daily lesson completion
  const [showCompletion, setShowCompletion] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  // Get lesson from URL params
  useEffect(() => {
    const lessonParam = searchParams.get('lesson')
    const dailyLessonParam = searchParams.get('daily-lesson')
    const phaseParam = searchParams.get('phase')
    
    console.log('🔗 URL params:', { lesson: lessonParam, dailyLesson: dailyLessonParam, phase: phaseParam })
    
    if (lessonParam !== selectedLessonId) {
      setSelectedLessonId(lessonParam)
    }
    
    if (dailyLessonParam) {
      const dayNum = parseInt(dailyLessonParam)
      if (dayNum !== dailyLessonNumber) {
        setDailyLessonNumber(dayNum)
        setDailyLessonPhase(phaseParam)
        // For daily lessons, we'll use a mock lesson setup
        setSelectedLessonId(`daily-lesson-${dayNum}`)
      }
    }
  }, [searchParams, selectedLessonId, dailyLessonNumber])

  // Fetch lessons and initialize user if needed
  useEffect(() => {
    fetchLessons()
    // Auto-initialize user when accessing daily lessons
    if (dailyLessonNumber) {
      initializeUserIfNeeded()
    }
  }, [dailyLessonNumber])

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons')
      if (response.ok) {
        const data = await response.json()
        setLessons(data)
      }
    } catch (error) {
      console.error('Error fetching lessons:', error)
    }
  }

  // Auto-initialize user progress for daily lessons
  const initializeUserIfNeeded = async () => {
    try {
      const userId = getCurrentUserId()
      
      // Check if user exists
      const checkResponse = await fetch(`/api/user/initialize?user_id=${userId}`)
      const checkData = await checkResponse.json()
      
      if (checkData.success && checkData.data.needs_initialization) {
        console.log('🚀 Auto-initializing user for daily lessons...')
        
        // Initialize user
        const initResponse = await fetch('/api/user/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId })
        })
        
        const initData = await initResponse.json()
        if (initData.success) {
          console.log('✅ User initialized successfully for daily lessons')
        }
      }
    } catch (error) {
      console.error('Error initializing user:', error)
    }
  }

  // Generate mock daily lesson flashcards
  const generateDailyLessonFlashcards = (dayNumber: number, phase: string): Flashcard[] => {
    // Expanded vocabulary list with more IELTS academic words
    const baseWords = [
      // Foundation Phase (Days 1-84): Core Academic Words
      'achieve', 'administration', 'affect', 'analysis', 'approach', 'appropriate', 'area', 'aspects',
      'assistance', 'assume', 'authority', 'available', 'benefit', 'category', 'community', 'complex',
      'concerning', 'conclusion', 'conduct', 'consequence', 'consistent', 'constitutional', 'context', 'contract',
      'create', 'data', 'definition', 'derived', 'distribution', 'economic', 'environment', 'established',
      'estimate', 'evidence', 'export', 'factors', 'financial', 'formula', 'function', 'identified',
      
      // Development Phase (Days 85-168): Intermediate Academic Words
      'indicate', 'individual', 'interpret', 'involved', 'issues', 'labour', 'legal', 'legislation',
      'major', 'method', 'occur', 'percent', 'period', 'policy', 'principle', 'procedure',
      'process', 'required', 'research', 'response', 'role', 'section', 'significant', 'similar',
      'source', 'specific', 'structure', 'theory', 'variables', 'concept', 'constitute', 'criteria',
      'dimension', 'emphasis', 'feature', 'initial', 'instance', 'investment', 'location', 'maintenance',
      
      // Mastery Phase (Days 169-224): Advanced Academic Words
      'objective', 'obtain', 'obvious', 'occupational', 'option', 'overall', 'parallel', 'parameter',
      'phase', 'phenomenon', 'portion', 'potential', 'previous', 'primary', 'purchase', 'range',
      'region', 'regulation', 'relevant', 'resident', 'resource', 'restriction', 'security', 'seek',
      'select', 'site', 'strategy', 'survey', 'target', 'task', 'technique', 'technology',
      'temporary', 'topic', 'tradition', 'transfer', 'trend', 'ultimate', 'version', 'welfare',
      
      // Expert Phase (Days 225-252): Sophisticated Academic Words
      'acknowledge', 'aggregate', 'appreciate', 'arbitrary', 'commodity', 'compensate', 'complement', 'conceive',
      'concurrent', 'controversy', 'convert', 'coordinate', 'core', 'corporate', 'correspond', 'couple',
      'decade', 'deny', 'differentiate', 'dimension', 'discrete', 'discriminate', 'displace', 'dispose',
      'distinct', 'distort', 'diverse', 'domain', 'edit', 'element', 'eliminate', 'emerge',
      'enable', 'encounter', 'enforce', 'enhance', 'enormous', 'ensure', 'entity', 'equate',
      'error', 'ethnic', 'evaluate', 'eventual', 'evident', 'evolve', 'exceed', 'exclude',
      'exhibit', 'expand', 'explicit', 'exploit', 'expose', 'external', 'facilitate', 'factor',
      'feature', 'federal', 'file', 'final', 'focus', 'format', 'forthcoming', 'foundation',
      'framework', 'function', 'fund', 'fundamental', 'furthermore', 'gender', 'generate', 'generation',
      'globe', 'goal', 'grade', 'grant', 'guarantee', 'guideline', 'hence', 'hierarchy',
      'highlight', 'hypothesis', 'identical', 'ideology', 'ignorant', 'illustrate', 'image', 'immigrate',
      'impact', 'implement', 'implicate', 'implicit', 'imply', 'impose', 'incentive', 'incidence',
      'incline', 'income', 'incorporate', 'index', 'indicate', 'individual', 'induce', 'inevitable',
      'infer', 'infrastructure', 'inherent', 'inhibit', 'initial', 'initiate', 'injure', 'innovate',
      'input', 'insert', 'insight', 'inspect', 'instance', 'institute', 'instruct', 'integral',
      'integrate', 'integrity', 'intelligence', 'intense', 'interact', 'intermediate', 'internal', 'interpret',
      'interval', 'intervention', 'intrinsic', 'invest', 'investigate', 'invoke', 'isolate', 'issue',
      'item', 'job', 'journal', 'justify', 'label', 'labor', 'layer', 'lecture',
      'legal', 'legislate', 'levy', 'liberal', 'license', 'likewise', 'link', 'locate',
      'logic', 'maintain', 'major', 'manipulate', 'manual', 'margin', 'mature', 'maximize',
      'mechanism', 'media', 'mediate', 'medical', 'medium', 'mental', 'method', 'migrate',
      'military', 'minimal', 'minimize', 'minimum', 'minor', 'mode', 'modify', 'monitor',
      'motive', 'mutual', 'negate', 'network', 'neutral', 'nevertheless', 'norm', 'normal',
      'notion', 'notwithstanding', 'nuclear', 'objective', 'obtain', 'obvious', 'occupy', 'occur',
      'odd', 'offset', 'ongoing', 'option', 'orient', 'outcome', 'output', 'overall',
      'overlap', 'overseas', 'panel', 'paradigm', 'paragraph', 'parallel', 'parameter', 'participate',
      'partner', 'passive', 'perceive', 'percent', 'period', 'persist', 'perspective', 'phase',
      'phenomenon', 'philosophy', 'physical', 'plus', 'policy', 'portion', 'pose', 'positive',
      'potential', 'practitioner', 'precede', 'precise', 'predict', 'preliminary', 'presume', 'previous',
      'primary', 'prime', 'principal', 'principle', 'prior', 'priority', 'proceed', 'process',
      'professional', 'prohibit', 'project', 'promote', 'proportion', 'prospect', 'protocol', 'psychology',
      'publication', 'publish', 'purchase', 'pursue', 'qualitative', 'quote', 'radical', 'random',
      'range', 'ratio', 'rational', 'react', 'recover', 'refine', 'reform', 'region',
      'register', 'regulate', 'reinforce', 'reject', 'relax', 'release', 'relevant', 'reluctance',
      'rely', 'remove', 'require', 'research', 'reside', 'resolve', 'resource', 'respond',
      'restore', 'restrain', 'restrict', 'retain', 'reveal', 'revenue', 'reverse', 'revise',
      'revolution', 'rigid', 'role', 'route', 'scenario', 'schedule', 'scheme', 'scope',
      'section', 'sector', 'secure', 'seek', 'select', 'sequence', 'series', 'sex',
      'shift', 'significant', 'similar', 'simulate', 'site', 'so-called', 'sole', 'somewhat',
      'source', 'specific', 'specify', 'sphere', 'stable', 'statistic', 'status', 'straightforward',
      'strategy', 'stress', 'structure', 'style', 'submit', 'subordinate', 'subsequent', 'subsidy',
      'substitute', 'successor', 'sufficient', 'sum', 'summary', 'supplement', 'survey', 'survive',
      'suspend', 'sustain', 'symbol', 'tape', 'target', 'task', 'team', 'technical',
      'technique', 'technology', 'temporary', 'tense', 'terminate', 'text', 'theme', 'theory',
      'thereby', 'thesis', 'topic', 'trace', 'track', 'tradition', 'transfer', 'transform',
      'transit', 'transmit', 'transport', 'trend', 'trigger', 'ultimate', 'undergo', 'underlie',
      'undertake', 'uniform', 'unify', 'unique', 'unity', 'university', 'unlike', 'update',
      'upset', 'urban', 'usage', 'utilize', 'valid', 'vary', 'vehicle', 'version',
      'versus', 'via', 'violate', 'virtual', 'visible', 'vision', 'visual', 'volume',
      'voluntary', 'welfare', 'whereas', 'whereby', 'widespread'
    ]
    
    const meanings = [
      // Foundation Phase Vietnamese meanings (Days 1-84)
      'đạt được', 'quản lý', 'ảnh hưởng', 'phân tích', 'tiếp cận', 'thích hợp', 'khu vực', 'khía cạnh',
      'hỗ trợ', 'giả định', 'quyền lực', 'có sẵn', 'lợi ích', 'loại', 'cộng đồng', 'phức tạp',
      'liên quan', 'kết luận', 'tiến hành', 'hậu quả', 'nhất quán', 'hiến pháp', 'ngữ cảnh', 'hợp đồng',
      'tạo ra', 'dữ liệu', 'định nghĩa', 'bắt nguồn', 'phân phối', 'kinh tế', 'môi trường', 'thành lập',
      'ước tính', 'bằng chứng', 'xuất khẩu', 'yếu tố', 'tài chính', 'công thức', 'chức năng', 'xác định',
      
      // Development Phase Vietnamese meanings (Days 85-168)
      'chỉ ra', 'cá nhân', 'giải thích', 'tham gia', 'vấn đề', 'lao động', 'pháp lý', 'luật pháp',
      'chính', 'phương pháp', 'xảy ra', 'phần trăm', 'thời kỳ', 'chính sách', 'nguyên tắc', 'thủ tục',
      'quá trình', 'yêu cầu', 'nghiên cứu', 'phản ứng', 'vai trò', 'phần', 'quan trọng', 'tương tự',
      'nguồn', 'cụ thể', 'cấu trúc', 'lý thuyết', 'biến số', 'khái niệm', 'cấu thành', 'tiêu chí',
      'chiều kích', 'nhấn mạnh', 'đặc điểm', 'ban đầu', 'ví dụ', 'đầu tư', 'vị trí', 'bảo trì',
      
      // Mastery Phase Vietnamese meanings (Days 169-224)
      'mục tiêu', 'có được', 'rõ ràng', 'nghề nghiệp', 'lựa chọn', 'tổng thể', 'song song', 'tham số',
      'giai đoạn', 'hiện tượng', 'phần', 'tiềm năng', 'trước đó', 'chủ yếu', 'mua', 'phạm vi',
      'vùng', 'quy định', 'liên quan', 'dân cư', 'tài nguyên', 'hạn chế', 'an ninh', 'tìm kiếm',
      'chọn lựa', 'địa điểm', 'chiến lược', 'khảo sát', 'mục tiêu', 'nhiệm vụ', 'kỹ thuật', 'công nghệ',
      'tạm thời', 'chủ đề', 'truyền thống', 'chuyển giao', 'xu hướng', 'cuối cùng', 'phiên bản', 'phúc lợi',
      
      // Expert Phase Vietnamese meanings (Days 225-252) - simplified for demo
      'thừa nhận', 'tổng hợp', 'đánh giá cao', 'tùy ý', 'hàng hóa', 'bù đắp', 'bổ sung', 'hình thành',
      'đồng thời', 'tranh cãi', 'chuyển đổi', 'phối hợp', 'cốt lõi', 'doanh nghiệp', 'tương ứng', 'cặp đôi',
      'thập kỷ', 'từ chối', 'phân biệt', 'chiều kích', 'rời rạc', 'phân biệt đối xử', 'di chuyển', 'xử lý',
      'riêng biệt', 'bóp méo', 'đa dạng', 'lĩnh vực', 'chỉnh sửa', 'yếu tố', 'loại bỏ', 'nổi lên',
      'cho phép', 'gặp phải', 'thực thi', 'nâng cao', 'to lớn', 'đảm bảo', 'thực thể', 'cân bằng',
      'lỗi', 'dân tộc', 'đánh giá', 'cuối cùng', 'rõ ràng', 'phát triển', 'vượt quá', 'loại trừ',
      'thể hiện', 'mở rộng', 'rõ ràng', 'khai thác', 'phơi bày', 'bên ngoài', 'tạo điều kiện', 'yếu tố',
      'đặc điểm', 'liên bang', 'hồ sơ', 'cuối cùng', 'tập trung', 'định dạng', 'sắp tới', 'nền tảng',
      'khung', 'chức năng', 'quỹ', 'cơ bản', 'hơn nữa', 'giới tính', 'tạo ra', 'thế hệ',
      'toàn cầu', 'mục tiêu', 'cấp độ', 'cấp', 'đảm bảo', 'hướng dẫn', 'do đó', 'thứ bậc',
      'làm nổi bật', 'giả thuyết', 'giống hệt', 'ý thức hệ', 'thiếu hiểu biết', 'minh họa', 'hình ảnh', 'nhập cư',
      'tác động', 'thực hiện', 'liên quan', 'ngầm ẩn', 'ngụ ý', 'áp đặt', 'khuyến khích', 'sự cố',
      'thiên về', 'thu nhập', 'kết hợp', 'chỉ số', 'chỉ ra', 'cá nhân', 'gây ra', 'không thể tránh',
      'suy ra', 'cơ sở hạ tầng', 'vốn có', 'ức chế', 'ban đầu', 'khởi xướng', 'làm tổn thương', 'đổi mới',
      'đầu vào', 'chèn', 'hiểu biết', 'kiểm tra', 'ví dụ', 'viện', 'hướng dẫn', 'không thể thiếu',
      'tích hợp', 'toàn vẹn', 'trí thông minh', 'dữ dội', 'tương tác', 'trung gian', 'nội bộ', 'giải thích',
      'khoảng', 'can thiệp', 'nội tại', 'đầu tư', 'điều tra', 'gọi', 'cô lập', 'vấn đề',
      'mục', 'công việc', 'tạp chí', 'biện minh', 'nhãn', 'lao động', 'lớp', 'bài giảng',
      'pháp lý', 'lập pháp', 'thu', 'tự do', 'giấy phép', 'tương tự', 'liên kết', 'định vị',
      'logic', 'duy trì', 'chính', 'thao tác', 'thủ công', 'lề', 'trưởng thành', 'tối đa hóa',
      'cơ chế', 'truyền thông', 'hòa giải', 'y tế', 'phương tiện', 'tinh thần', 'phương pháp', 'di cư',
      'quân sự', 'tối thiểu', 'giảm thiểu', 'tối thiểu', 'nhỏ', 'chế độ', 'sửa đổi', 'giám sát',
      'động cơ', 'lẫn nhau', 'phủ định', 'mạng lưới', 'trung lập', 'tuy nhiên', 'chuẩn mực', 'bình thường',
      'khái niệm', 'mặc dù', 'hạt nhân', 'mục tiêu', 'có được', 'rõ ràng', 'chiếm', 'xảy ra',
      'lẻ', 'bù đắp', 'đang diễn ra', 'lựa chọn', 'định hướng', 'kết quả', 'đầu ra', 'tổng thể',
      'chồng chéo', 'nước ngoài', 'hội đồng', 'mô hình', 'đoạn văn', 'song song', 'tham số', 'tham gia',
      'đối tác', 'thụ động', 'cảm nhận', 'phần trăm', 'thời kỳ', 'kiên trì', 'quan điểm', 'giai đoạn',
      'hiện tượng', 'triết học', 'vật lý', 'cộng', 'chính sách', 'phần', 'đặt ra', 'tích cực',
      'tiềm năng', 'thực hành viên', 'đi trước', 'chính xác', 'dự đoán', 'sơ bộ', 'giả định', 'trước đó',
      'chủ yếu', 'chính', 'hiệu trưởng', 'nguyên tắc', 'trước', 'ưu tiên', 'tiến hành', 'quá trình',
      'chuyên nghiệp', 'cấm', 'dự án', 'thúc đẩy', 'tỷ lệ', 'triển vọng', 'giao thức', 'tâm lý học',
      'xuất bản', 'xuất bản', 'mua', 'theo đuổi', 'định tính', 'trích dẫn', 'cấp tiến', 'ngẫu nhiên',
      'phạm vi', 'tỷ lệ', 'hợp lý', 'phản ứng', 'phục hồi', 'tinh chế', 'cải cách', 'vùng',
      'đăng ký', 'điều chỉnh', 'củng cố', 'từ chối', 'thư giãn', 'phát hành', 'liên quan', 'miễn cưỡng',
      'dựa vào', 'loại bỏ', 'yêu cầu', 'nghiên cứu', 'cư trú', 'giải quyết', 'tài nguyên', 'phản hồi',
      'khôi phục', 'kiềm chế', 'hạn chế', 'giữ lại', 'tiết lộ', 'doanh thu', 'đảo ngược', 'sửa đổi',
      'cách mạng', 'cứng nhắc', 'vai trò', 'tuyến đường', 'kịch bản', 'lịch trình', 'kế hoạch', 'phạm vi',
      'phần', 'lĩnh vực', 'an toàn', 'tìm kiếm', 'chọn', 'chuỗi', 'loạt', 'giới tính',
      'chuyển', 'quan trọng', 'tương tự', 'mô phỏng', 'địa điểm', 'cái gọi là', 'duy nhất', 'hơi',
      'nguồn', 'cụ thể', 'chỉ định', 'lĩnh vực', 'ổn định', 'thống kê', 'trạng thái', 'đơn giản',
      'chiến lược', 'căng thẳng', 'cấu trúc', 'phong cách', 'nộp', 'cấp dưới', 'tiếp theo', 'trợ cấp',
      'thay thế', 'người kế nhiệm', 'đủ', 'tổng', 'tóm tắt', 'bổ sung', 'khảo sát', 'sống sót',
      'tạm ngưng', 'duy trì', 'biểu tượng', 'băng', 'mục tiêu', 'nhiệm vụ', 'đội', 'kỹ thuật',
      'kỹ thuật', 'công nghệ', 'tạm thời', 'căng thẳng', 'chấm dứt', 'văn bản', 'chủ đề', 'lý thuyết',
      'do đó', 'luận án', 'chủ đề', 'dấu vết', 'theo dõi', 'truyền thống', 'chuyển giao', 'chuyển đổi',
      'vận chuyển', 'truyền', 'vận chuyển', 'xu hướng', 'kích hoạt', 'cuối cùng', 'trải qua', 'nền tảng',
      'thực hiện', 'đồng phục', 'thống nhất', 'độc đáo', 'thống nhất', 'đại học', 'không giống', 'cập nhật',
      'buồn bã', 'đô thị', 'sử dụng', 'sử dụng', 'hợp lệ', 'thay đổi', 'phương tiện', 'phiên bản',
      'so với', 'qua', 'vi phạm', 'ảo', 'có thể nhìn thấy', 'tầm nhìn', 'hình ảnh', 'âm lượng',
      'tự nguyện', 'phúc lợi', 'trong khi', 'nhờ đó', 'rộng rãi'
    ]

    const ipaTranscriptions = [
      // Foundation Phase IPA (Days 1-84)
      '/əˈtʃiːv/', '/ədˌmɪnɪˈstreɪʃn/', '/əˈfekt/', '/əˈnæləsɪs/', '/əˈproʊtʃ/', '/əˈproʊpriət/', '/ˈeriə/', '/ˈæspekts/',
      '/əˈsɪstəns/', '/əˈsuːm/', '/əˈθɔːrəti/', '/əˈveɪləbl/', '/ˈbenɪfɪt/', '/ˈkætəɡɔːri/', '/kəˈmjuːnəti/', '/kəmˈpleks/',
      '/kənˈsɜːrnɪŋ/', '/kənˈkluːʒn/', '/kənˈdʌkt/', '/ˈkɑːnsəkwəns/', '/kənˈsɪstənt/', '/ˌkɑːnstəˈtuːʃənl/', '/ˈkɑːntekst/', '/ˈkɑːntrækt/',
      '/kriˈeɪt/', '/ˈdeɪtə/', '/ˌdefəˈnɪʃn/', '/dɪˈraɪvd/', '/ˌdɪstrəˈbjuːʃn/', '/ˌiːkəˈnɑːmɪk/', '/ɪnˈvaɪrənmənt/', '/ɪˈstæblɪʃt/',
      '/ˈestəmət/', '/ˈevɪdəns/', '/ɪkˈspɔːrt/', '/ˈfæktərz/', '/faɪˈnænʃl/', '/ˈfɔːrmjələ/', '/ˈfʌŋkʃn/', '/aɪˈdentəˌfaɪd/',
      
      // Development Phase IPA (Days 85-168)
      '/ˈɪndəˌkeɪt/', '/ˌɪndəˈvɪdʒuəl/', '/ɪnˈtɜːrprət/', '/ɪnˈvɑːlvd/', '/ˈɪʃuːz/', '/ˈleɪbər/', '/ˈliːɡəl/', '/ˌledʒəsˈleɪʃn/',
      '/ˈmeɪdʒər/', '/ˈmeθəd/', '/əˈkɜːr/', '/pərˈsent/', '/ˈpɪriəd/', '/ˈpɑːləsi/', '/ˈprɪnsəpəl/', '/prəˈsiːdʒər/',
      '/ˈprɑːses/', '/rɪˈkwaɪərd/', '/rɪˈsɜːrtʃ/', '/rɪˈspɑːns/', '/roʊl/', '/ˈsekʃn/', '/sɪɡˈnɪfəkənt/', '/ˈsɪmələr/',
      '/sɔːrs/', '/spəˈsɪfɪk/', '/ˈstrʌktʃər/', '/ˈθiːəri/', '/ˈveriəbəlz/', '/ˈkɑːnsept/', '/ˈkɑːnstəˌtuːt/', '/kraɪˈtɪriə/',
      '/daɪˈmenʃn/', '/ˈemfəsɪs/', '/ˈfiːtʃər/', '/ɪˈnɪʃl/', '/ˈɪnstəns/', '/ɪnˈvestmənt/', '/loʊˈkeɪʃn/', '/ˈmeɪntənəns/',
      
      // Mastery Phase IPA (Days 169-224)
      '/əbˈdʒektɪv/', '/əbˈteɪn/', '/ˈɑːbviəs/', '/ˌɑːkjuˈpeɪʃənl/', '/ˈɑːpʃn/', '/ˈoʊvərˌɔːl/', '/ˈpærəˌlel/', '/pəˈræmətər/',
      '/feɪz/', '/fəˈnɑːməˌnɑːn/', '/ˈpɔːrʃn/', '/pəˈtenʃl/', '/ˈpriːviəs/', '/ˈpraɪˌmeri/', '/ˈpɜːrtʃəs/', '/reɪndʒ/',
      '/ˈriːdʒən/', '/ˌreɡjuˈleɪʃn/', '/ˈreləvənt/', '/ˈrezədənt/', '/rɪˈsɔːrs/', '/rɪˈstrɪkʃn/', '/sɪˈkjʊrəti/', '/siːk/',
      '/səˈlekt/', '/saɪt/', '/ˈstrætədʒi/', '/ˈsɜːrveɪ/', '/ˈtɑːrɡət/', '/tæsk/', '/tekˈniːk/', '/tekˈnɑːlədʒi/',
      '/ˈtempəˌreri/', '/ˈtɑːpɪk/', '/trəˈdɪʃn/', '/trænsˈfɜːr/', '/trend/', '/ˈʌltəmət/', '/ˈvɜːrʒn/', '/ˈwelˌfer/',
      
      // Expert Phase IPA (Days 225-252) - simplified for space
      '/əkˈnɑːlɪdʒ/', '/ˈæɡrəˌɡeɪt/', '/əˈpriːʃiˌeɪt/', '/ˈɑːrbəˌtreri/', '/kəˈmɑːdəti/', '/ˈkɑːmpənˌseɪt/', '/ˈkɑːmpləmənt/', '/kənˈsiːv/',
      '/kənˈkɜːrənt/', '/ˈkɑːntrəˌvɜːrsi/', '/kənˈvɜːrt/', '/koʊˈɔːrdəˌneɪt/', '/kɔːr/', '/ˈkɔːrpərət/', '/ˌkɔːrəˈspɑːnd/', '/ˈkʌpəl/',
      '/ˈdekeɪd/', '/dɪˈnaɪ/', '/ˌdɪfəˈrenʃiˌeɪt/', '/daɪˈmenʃn/', '/dɪˈskriːt/', '/dɪˈskrɪməˌneɪt/', '/dɪˈspleɪs/', '/dɪˈspoʊz/',
      '/dɪˈstɪŋkt/', '/dɪˈstɔːrt/', '/daɪˈvɜːrs/', '/doʊˈmeɪn/', '/ˈedət/', '/ˈeləmənt/', '/ɪˈlɪməˌneɪt/', '/ɪˈmɜːrdʒ/',
      '/ɪˈneɪbəl/', '/ɪnˈkaʊntər/', '/ɪnˈfɔːrs/', '/ɪnˈhæns/', '/ɪˈnɔːrməs/', '/ɪnˈʃʊr/', '/ˈentəti/', '/ɪˈkweɪt/',
      '/ˈerər/', '/ˈeθnɪk/', '/ɪˈvæljuˌeɪt/', '/ɪˈventʃuəl/', '/ˈevədənt/', '/ɪˈvɑːlv/', '/ɪkˈsiːd/', '/ɪkˈskluːd/',
      '/ɪɡˈzɪbət/', '/ɪkˈspænd/', '/ɪkˈsplɪsət/', '/ɪkˈsplɔɪt/', '/ɪkˈspoʊz/', '/ɪkˈstɜːrnl/', '/fəˈsɪləˌteɪt/', '/ˈfæktər/',
      '/ˈfiːtʃər/', '/ˈfedərəl/', '/faɪl/', '/ˈfaɪnl/', '/ˈfoʊkəs/', '/ˈfɔːrmæt/', '/ˈfɔːrθˌkʌmɪŋ/', '/faʊnˈdeɪʃn/',
      '/ˈfreɪmˌwɜːrk/', '/ˈfʌŋkʃn/', '/fʌnd/', '/ˌfʌndəˈmentl/', '/ˈfɜːrðərˌmɔːr/', '/ˈdʒendər/', '/ˈdʒenəˌreɪt/', '/ˌdʒenəˈreɪʃn/',
      '/ɡloʊb/', '/ɡoʊl/', '/ɡreɪd/', '/ɡrænt/', '/ˌɡærənˈtiː/', '/ˈɡaɪdˌlaɪn/', '/hens/', '/ˈhaɪəˌrɑːrki/'
      // ... continuing with abbreviated IPA for remaining words to save space
    ]

    // Calculate proper word index without duplication
    const startIndex = (dayNumber - 1) * 20
    const dailyWords = []
    
    for (let i = 0; i < 20; i++) {
      const wordIndex = startIndex + i
      // Ensure we don't go beyond our vocabulary list
      const safeWordIndex = wordIndex < baseWords.length ? wordIndex : wordIndex % baseWords.length
      
      dailyWords.push({
        id: `daily-${dayNumber}-${i + 1}`,
        english: baseWords[safeWordIndex] + (wordIndex >= baseWords.length ? ` (${Math.floor(wordIndex / baseWords.length) + 1})` : ''),
        vietnamese: meanings[safeWordIndex],
        pronunciation_guide: ipaTranscriptions[safeWordIndex] || '/unknown/',
        difficulty: phase === 'foundation' ? 1 : phase === 'development' ? 2 : phase === 'mastery' ? 3 : 4,
        category: 'daily-lesson',
        lesson_id: `daily-lesson-${dayNumber}`,
        lessonId: `daily-lesson-${dayNumber}`,
        ipa: ipaTranscriptions[safeWordIndex] || '/unknown/',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Enhanced learning fields
        examples: null,
        collocations: null,
        synonyms: null,
        antonyms: null,
        etymology: null,
        memory_tips: null,
        // Spaced repetition fields
        ease_factor: 2.5,
        interval: 1,
        repetitions: 0,
        times_studied: 0,
        times_correct: 0,
        times_wrong: 0,
        mastery_level: 'new' as 'new' | 'learning' | 'familiar' | 'mastered',
        next_review: null
      })
    }
    
    return dailyWords
  }

  // Fetch flashcards from API  
  const fetchFlashcards = useCallback(async () => {
    try {
      // Handle daily lesson flashcards
      if (dailyLessonNumber && dailyLessonPhase) {
        console.log('📚 Loading daily lesson:', dailyLessonNumber, dailyLessonPhase)
        const mockFlashcards = generateDailyLessonFlashcards(dailyLessonNumber, dailyLessonPhase)
        setFlashcards(mockFlashcards)
        setLessonTotalWords(mockFlashcards.length)
        setIsLoading(false)
        return
      }
      
      let url = '/api/flashcards'
      
      if (selectedLessonId) {
        // Check if it's a chunk ID
        if (selectedLessonId.includes('-chunk-')) {
          url = `/api/flashcards/chunk?id=${selectedLessonId}`
          setShowChunkSelector(false)
        } else {
          // First check lesson size to decide if we need chunk selector
          const countResponse = await fetch(`/api/flashcards?lesson=${selectedLessonId}`)
          if (countResponse.ok) {
            const allFlashcards = await countResponse.json()
            const wordCount = allFlashcards.length
            setLessonTotalWords(wordCount)
            
            // If lesson has more than 50 words, show chunk selector instead of loading all
            if (wordCount > 50) {
              setShowChunkSelector(true)
              setFlashcards([])
              setIsLoading(false)
              return
            }
          }
          
          url = `/api/flashcards?lesson=${selectedLessonId}`
          setShowChunkSelector(false)
        }
      } else {
        setShowChunkSelector(false)
      }

      console.log('🔍 Fetching flashcards:', { url, selectedLessonId })

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Received flashcards:', { count: data.length, lessonId: selectedLessonId })
        setFlashcards(data)
        setCurrentIndex(0) // Reset to first card when changing lessons
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedLessonId, dailyLessonNumber, dailyLessonPhase])

  // Call fetchFlashcards when component mounts or selectedLessonId changes
  useEffect(() => {
    fetchFlashcards()
  }, [fetchFlashcards])

  // Update selected lesson info when selectedLessonId changes
  useEffect(() => {
    if (selectedLessonId && lessons.length > 0) {
      const lesson = lessons.find(l => l.id === selectedLessonId)
      setSelectedLesson(lesson || null)
    } else {
      setSelectedLesson(null)
    }
  }, [selectedLessonId, lessons])

  const handleAddFlashcard = async (newFlashcard: {
    english: string
    vietnamese: string
    category: string
    difficulty: number
    lesson_id: string | null
  }) => {
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFlashcard),
      })

      if (response.ok) {
        const flashcard = await response.json()
        setFlashcards([flashcard, ...flashcards])
      }
    } catch (error) {
      console.error('Error adding flashcard:', error)
      throw error
    }
  }

  const nextCard = () => {
    if (flashcards.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length)
    }
  }

  const prevCard = () => {
    if (flashcards.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    }
  }

  const resetProgress = () => {
    setCurrentIndex(0)
  }

  // Handle daily lesson completion
  const handleDailyLessonComplete = async (completionData: {
    wordsLearned: number
    studyTimeMinutes: number
    accuracyPercentage: number
    grammarCompleted: boolean
    skillsPracticed: string[]
  }) => {
    if (!dailyLessonNumber) return

    try {
      setIsCompleting(true)
      
      const response = await fetch('/api/daily-lesson/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: getCurrentUserId(),
          day_number: dailyLessonNumber,
          words_learned: completionData.wordsLearned,
          study_time_minutes: completionData.studyTimeMinutes,
          accuracy_percentage: completionData.accuracyPercentage,
          grammar_completed: completionData.grammarCompleted,
          skills_practiced: completionData.skillsPracticed
        })
      })

      const result = await response.json()

      if (result.success) {
        console.log('✅ Day completed successfully:', result)
        alert(`🎉 Day ${dailyLessonNumber} completed! Next: Day ${result.data.next_day || 'Complete!'}`)
        
        // Navigate to next day or study plan
        if (result.data.next_day && result.data.next_day <= 252) {
          window.location.href = `/?daily-lesson=${result.data.next_day}&phase=${result.data.next_phase.toLowerCase()}`
        } else {
          window.location.href = '/study-plan'
        }
      } else {
        console.error('❌ Completion failed:', result)
        alert('Failed to complete day. Please try again.')
      }
    } catch (error) {
      console.error('Error completing daily lesson:', error)
      alert('Error completing day. Please try again.')
    } finally {
      setIsCompleting(false)
    }
  }

  const handleSkipCompletion = () => {
    setShowCompletion(false)
  }

  const handleChunkSelect = (chunkId: string) => {
    // Update URL with chunk ID and trigger flashcard fetch
    const url = new URL(window.location.href)
    url.searchParams.set('lesson', chunkId)
    window.history.pushState({}, '', url.toString())
    setSelectedLessonId(chunkId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải flashcards...</p>
        </div>
      </div>
    )
  }

  // Show HomeDashboard when no lesson is selected
  if (!selectedLessonId && !dailyLessonNumber && !showChunkSelector) {
    return <HomeDashboard />
  }

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-8">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Chưa có flashcard nào
          </h2>
          <p className="text-gray-600 mb-6">
            Hãy thêm từ vựng đầu tiên để bắt đầu học!
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm từ đầu tiên
          </button>
        </div>

        {showAddForm && (
          <AddFlashcardForm
            onAdd={handleAddFlashcard}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </div>
    )
  }

  const currentCard = flashcards[currentIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Lesson Filter Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {dailyLessonNumber ? (
                  <>📅 Day {dailyLessonNumber} - {dailyLessonPhase?.charAt(0).toUpperCase()}{dailyLessonPhase?.slice(1)} Phase</>
                ) : selectedLesson ? (
                  <>{selectedLesson.name}</>
                ) : (
                  <>🏠 IELTS Flashcards</>
                )}
              </h2>
              {selectedLesson && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                  style={{ backgroundColor: selectedLesson.color + '20', color: selectedLesson.color }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedLesson.color }} />
                  {selectedLesson.name}
                </div>
              )}
              <div className="flex items-center gap-2">
                <a
                  href="/lessons"
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  📚 Browse All Lessons
                </a>
                <Link
                  href={dailyLessonNumber ? `/grammar?day=${dailyLessonNumber}&week=${Math.ceil(dailyLessonNumber / 7)}` : "/grammar"}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  📝 Grammar Practice
                  {dailyLessonNumber && (
                    <span className="ml-1 text-xs">
                      (Day {dailyLessonNumber})
                    </span>
                  )}
                </Link>
                <a
                  href="/study-plan"
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  📅 Study Plan
                </a>
                {dailyLessonNumber && (
                  <button
                    onClick={() => setShowCompletion(true)}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors"
                  >
                    ✅ Complete Day {dailyLessonNumber}
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* User Info */}
              <UserInfo />
              
              {/* Lesson Selector */}
              <select
                value={selectedLessonId || ''}
                onChange={(e) => {
                  const newLessonId = e.target.value || null
                  setSelectedLessonId(newLessonId)
                  // Update URL without reload
                  const url = new URL(window.location.href)
                  if (newLessonId) {
                    url.searchParams.set('lesson', newLessonId)
                  } else {
                    url.searchParams.delete('lesson')
                  }
                  window.history.pushState({}, '', url.toString())
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả bài học</option>
                {lessons.map((lesson) => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {showChunkSelector && selectedLessonId ? (
          <LessonChunksSelector
            lessonId={selectedLessonId}
            onChunkSelect={handleChunkSelect}
          />
        ) : flashcards.length === 0 && !showChunkSelector ? (
          <WelcomeDashboard
            onAddFlashcard={() => setShowAddForm(true)}
            selectedLessonId={selectedLessonId}
            selectedLessonName={selectedLesson?.name}
          />
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Học Tiếng Anh với Flashcards
              </h1>
              <p className="text-gray-600">
                Thẻ {currentIndex + 1} / {flashcards.length}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Thêm từ mới
              </button>
              <button
                onClick={resetProgress}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Bắt đầu lại
              </button>
            </div>

            {/* Flashcard */}
            <div className="mb-8">
              <FlashcardComponent flashcard={currentCard} />
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4">
              <button
                onClick={prevCard}
                disabled={flashcards.length <= 1}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Trước
              </button>
              <button
                onClick={nextCard}
                disabled={flashcards.length <= 1}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Tiếp
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-8">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / flashcards.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Add form modal */}
        {showAddForm && (
          <AddFlashcardForm
            onAdd={handleAddFlashcard}
            onClose={() => setShowAddForm(false)}
            selectedLessonId={selectedLessonId}
          />
        )}

        {/* Daily Lesson Completion Modal */}
        {showCompletion && dailyLessonNumber && dailyLessonPhase && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <DailyLessonCompletion
                dayNumber={dailyLessonNumber}
                phase={dailyLessonPhase}
                onComplete={handleDailyLessonComplete}
                onSkip={handleSkipCompletion}
                isCompleting={isCompleting}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    }>
      <FlashcardApp />
    </Suspense>
  )
}
