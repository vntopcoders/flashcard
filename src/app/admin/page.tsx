'use client'

import { useState } from 'react'
import { Download, CheckCircle, AlertCircle, BookOpen, Globe, BarChart3 } from 'lucide-react'

export default function AdminPage() {
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    success: boolean
    message: string
    imported?: {
      lessons: number
      flashcards: number
    }
    details?: {
      ielts_levels: number
      topic_based: number
      total_words: number
    }
    data?: {
      overview: {
        total_flashcards: number
        total_lessons: number
        total_categories: number
        average_cards_per_lesson: number
      }
      ielts_progress: Record<string, number>
      top_lessons: Array<{
        id: string
        name: string
        flashcard_count: number
        difficulty_level: string
      }>
    }
  } | null>(null)

  const handleImport = async (endpoint: string) => {
    setIsImporting(true)
    setImportResult(null)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const result = await response.json()
      setImportResult(result)
    } catch (err) {
      setImportResult({
        success: false,
        message: err instanceof Error ? err.message : 'Có lỗi xảy ra khi import'
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            🎓 Hệ thống quản lý từ vựng IELTS
          </h1>

          <div className="grid gap-6">
            {/* Complete Import Section */}
            <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    📚 Import toàn bộ hệ thống từ vựng
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Import đầy đủ 1500+ từ vựng IELTS từ nhiều nguồn uy tín với phiên âm IPA và nghĩa tiếng Việt chi tiết.
                  </p>
                  
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">🎯 Nội dung siêu hoàn chỉnh:</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-2">
                        <div className="font-medium text-blue-700">IELTS Academic (500 từ):</div>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Level 1: Foundation (100 từ)</li>
                          <li>Level 2: Intermediate (100 từ)</li>
                          <li>Level 3: Upper-Intermediate (100 từ)</li>
                          <li>Level 4: Advanced (100 từ)</li>
                          <li>Level 5: Expert (100 từ)</li>
                        </ul>
                        <div className="font-medium text-indigo-700 mt-3">Academic Word List (300 từ):</div>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>AWL Sublist 1: Core Academic (60 từ)</li>
                          <li>AWL Sublist 2: Advanced Terms (60 từ)</li>
                          <li>AWL Sublist 3: Complex Concepts (60 từ)</li>
                          <li>AWL Sublist 4: Specialized Language (60 từ)</li>
                          <li>AWL Sublist 5: Academic Discourse (60 từ)</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <div className="font-medium text-purple-700">Chuyên ngành (100 từ):</div>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Business & Economics (20 từ)</li>
                          <li>Technology & Innovation (20 từ)</li>
                          <li>Environment & Climate (20 từ)</li>
                          <li>Health & Medicine (20 từ)</li>
                          <li>Education & Learning (20 từ)</li>
                        </ul>
                        <div className="font-medium text-yellow-700 mt-3">IELTS Liz Method (360 từ):</div>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Education & Knowledge (60 từ)</li>
                          <li>Technology & Media (60 từ)</li>
                          <li>Environment & Nature (60 từ)</li>
                          <li>Health & Lifestyle (60 từ)</li>
                          <li>Crime & Society (60 từ)</li>
                          <li>Work & Business (60 từ)</li>
                        </ul>
                        <div className="font-medium text-red-700 mt-3">IELTS 4000 Words (240 từ):</div>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Band 5.0-5.5 Essential (60 từ)</li>
                          <li>Band 6.0-6.5 Intermediate (60 từ)</li>
                          <li>Band 7.0-7.5 Advanced (60 từ)</li>
                          <li>Band 8.0+ Expert (60 từ)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Progress Tracking */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <h3 className="text-lg font-semibold text-green-800 mb-4">📊 Thống kê tổng quan</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-green-700">Tổng số từ vựng:</span>
                          <span className="font-bold text-green-800">1,500+ từ</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Số chủ đề:</span>
                          <span className="font-bold text-green-800">15+ chủ đề</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Độ khó:</span>
                          <span className="font-bold text-green-800">Band 5.0 - 8.0+</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Nguồn học liệu:</span>
                          <span className="font-bold text-green-800">4 nguồn uy tín</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4">🎯 Mục tiêu IELTS</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Band 5.0-6.0:</span>
                          <span className="font-bold text-blue-800">620 từ cơ bản</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Band 6.5-7.0:</span>
                          <span className="font-bold text-blue-800">540 từ trung cấp</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Band 7.5-8.0:</span>
                          <span className="font-bold text-blue-800">240 từ nâng cao</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Band 8.5+:</span>
                          <span className="font-bold text-blue-800">100 từ chuyên gia</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleImport('/api/import-complete')}
                      disabled={isImporting}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                      {isImporting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Đang import...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Import tất cả (1500+ từ)
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleImport('/api/import-awl')}
                      disabled={isImporting}
                      className="inline-flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      Academic Word List (300 từ)
                    </button>

                    <button
                      onClick={() => handleImport('/api/import-ielts-liz')}
                      disabled={isImporting}
                      className="inline-flex items-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      IELTS Liz (360 từ)
                    </button>

                    <button
                      onClick={() => handleImport('/api/import-4000-words')}
                      disabled={isImporting}
                      className="inline-flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      IELTS 4000 Words (240 từ)
                    </button>

                    <button
                      onClick={async () => {
                        setIsImporting(true);
                        try {
                          const response = await fetch('/api/stats');
                          const data = await response.json();
                          if (data.success) {
                            setImportResult({
                              success: true,
                              message: 'Thống kê được tải thành công',
                              data: data.data
                            });
                          } else {
                            setImportResult({
                              success: false,
                              message: data.message || data.error || 'Không thể tải thống kê'
                            });
                          }
                        } catch (error) {
                          setImportResult({
                            success: false,
                            message: `Lỗi kết nối: ${error}`
                          });
                        } finally {
                          setIsImporting(false);
                        }
                      }}
                      disabled={isImporting}
                      className="inline-flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                      📊 Xem thống kê chi tiết
                    </button>
                  </div>

                  {/* Import Result */}
                  {importResult && (
                    <div className={`mt-6 p-4 rounded-lg border ${
                      importResult.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        {importResult.success ? (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className={`font-medium ${
                            importResult.success ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {importResult.message}
                          </p>
                          {importResult.success && importResult.imported && (
                            <div className="mt-3 space-y-2 text-sm text-green-700">
                              <p>✅ Đã tạo <strong>{importResult.imported.lessons}</strong> bài học</p>
                              <p>✅ Đã import <strong>{importResult.imported.flashcards}</strong> flashcard</p>
                              {importResult.details && (
                                <div className="mt-2 p-3 bg-green-100 rounded border-l-4 border-green-500">
                                  <p className="font-medium">Chi tiết import:</p>
                                  <ul className="mt-1 space-y-1">
                                    <li>• IELTS Levels: {importResult.details.ielts_levels}</li>
                                    <li>• Chuyên ngành: {importResult.details.topic_based}</li>
                                    <li>• Tổng từ: <strong>{importResult.details.total_words}</strong></li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Hiển thị thống kê nếu có */}
                          {importResult.data && importResult.data.overview && (
                            <div className="mt-4">
                              <h5 className="font-medium text-gray-800 mb-3">📊 Tổng quan hệ thống:</h5>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="bg-white p-3 rounded border border-blue-200">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {importResult.data.overview.total_flashcards}
                                  </div>
                                  <div className="text-sm text-gray-600">Tổng từ vựng</div>
                                </div>
                                <div className="bg-white p-3 rounded border border-green-200">
                                  <div className="text-2xl font-bold text-green-600">
                                    {importResult.data.overview.total_lessons}
                                  </div>
                                  <div className="text-sm text-gray-600">Tổng bài học</div>
                                </div>
                                <div className="bg-white p-3 rounded border border-purple-200">
                                  <div className="text-2xl font-bold text-purple-600">
                                    {importResult.data.overview.total_categories}
                                  </div>
                                  <div className="text-sm text-gray-600">Chủ đề</div>
                                </div>
                                <div className="bg-white p-3 rounded border border-orange-200">
                                  <div className="text-2xl font-bold text-orange-600">
                                    {importResult.data.overview.average_cards_per_lesson}
                                  </div>
                                  <div className="text-sm text-gray-600">Từ/bài học</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Hiển thị thống kê IELTS Progress */}
                          {importResult.data && importResult.data.ielts_progress && (
                            <div className="mt-4">
                              <h5 className="font-medium text-gray-800 mb-3">🎯 Phân bố theo Band IELTS:</h5>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {Object.entries(importResult.data.ielts_progress).map(([band, count]) => (
                                  <div key={band} className="bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded border border-indigo-200 text-center">
                                    <div className="text-lg font-bold text-indigo-600">{count as number}</div>
                                    <div className="text-xs text-gray-600">{band}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Hiển thị top lessons */}
                          {importResult.data && importResult.data.top_lessons && (
                            <div className="mt-4">
                              <h5 className="font-medium text-gray-800 mb-3">🏆 Top 5 bài học phong phú nhất:</h5>
                              <div className="space-y-2">
                                {importResult.data.top_lessons.slice(0, 5).map((lesson, index: number) => (
                                  <div key={lesson.id} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200 hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                        {index + 1}
                                      </span>
                                      <span className="text-sm font-medium text-gray-800">
                                        {lesson.name}
                                      </span>
                                    </div>
                                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                                      {lesson.flashcard_count} từ
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📖 Hướng dẫn sử dụng hệ thống hoàn chỉnh
              </h2>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">🚀 Bước 1: Import dữ liệu</h3>
                  <ul className="space-y-1 ml-4">
                    <li>• <strong>Import tất cả:</strong> Tải về 600+ từ vựng đầy đủ (khuyến nghị)</li>
                    <li>• <strong>Chỉ IELTS:</strong> 500 từ IELTS Academic từ cơ bản đến nâng cao</li>
                    <li>• <strong>Chỉ chuyên ngành:</strong> 100 từ chuyên ngành quan trọng</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">📚 Bước 2: Học từ vựng</h3>
                  <ul className="space-y-1 ml-4">
                    <li>• Vào trang chính và chọn bài học phù hợp với trình độ</li>
                    <li>• Bắt đầu từ IELTS Level 1 nếu bạn mới học</li>
                    <li>• Học 20-30 từ mỗi ngày để đạt hiệu quả tốt nhất</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800 mb-2">🎯 Bước 3: Tính năng học tập</h3>
                  <ul className="space-y-1 ml-4">
                    <li>• <strong>Lật thẻ:</strong> Click để xem nghĩa tiếng Việt</li>
                    <li>• <strong>Nghe phát âm:</strong> Click biểu tượng loa</li>
                    <li>• <strong>Xem phiên âm IPA:</strong> Học phát âm chuẩn quốc tế</li>
                    <li>• <strong>Hình ảnh minh họa:</strong> Ghi nhớ qua hình ảnh</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-medium text-blue-800 mb-2">💡 Lộ trình học tối ưu (1500+ từ)</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Giai đoạn 1 - Nền tảng (Tuần 1-10):</strong></p>
                    <p>• IELTS Levels 1-5 (500 từ cốt lõi)</p>
                    <p>• IELTS 4000 Band 5.0-6.5 (120 từ thiết yếu)</p>
                    
                    <p className="pt-2"><strong>Giai đoạn 2 - Nâng cao (Tuần 11-20):</strong></p>
                    <p>• Academic Word List Sublists 1-3 (180 từ học thuật)</p>
                    <p>• IELTS Liz Education & Technology (120 từ)</p>
                    
                    <p className="pt-2"><strong>Giai đoạn 3 - Chuyên sâu (Tuần 21-30):</strong></p>
                    <p>• Academic Word List Sublists 4-5 (120 từ cao cấp)</p>
                    <p>• IELTS 4000 Band 7.0+ (120 từ chuyên gia)</p>
                    
                    <p className="pt-2"><strong>Giai đoạn 4 - Hoàn thiện (Tuần 31+):</strong></p>
                    <p>• IELTS Liz Environment, Health, Society (180 từ)</p>
                    <p>• Chuyên ngành: Business, Tech, Medicine (100 từ)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics & Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  📊 Thống kê hệ thống
                </h2>
                  <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tổng từ vựng:</span>
                    <span className="font-bold text-blue-600">1500+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">IELTS Levels:</span>
                    <span className="font-bold text-green-600">5 levels</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Academic Word List:</span>
                    <span className="font-bold text-indigo-600">5 sublists</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">IELTS Liz Topics:</span>
                    <span className="font-bold text-yellow-600">6 chủ đề</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">IELTS 4000 Bands:</span>
                    <span className="font-bold text-red-600">4 band scores</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Chuyên ngành:</span>
                    <span className="font-bold text-purple-600">5 lĩnh vực</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Phiên âm IPA:</span>
                    <span className="font-bold text-orange-600">100%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hình ảnh:</span>
                    <span className="font-bold text-pink-600">Tự động</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  🎨 Tính năng nổi bật
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Flashcards 3D với hiệu ứng lật mượt</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Phát âm bằng AI text-to-speech</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">Hình ảnh từ Unsplash API</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-600">Phiên âm IPA chuẩn quốc tế</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">Responsive trên mọi thiết bị</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Source Information */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                🔗 Nguồn dữ liệu chất lượng cao
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">IELTS Academic Sources:</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• <a href="https://ielts-up.com/writing/ielts-academic-wordlist.html" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">IELTS UP Official Wordlist</a></li>
                    <li>• <a href="https://www.eapfoundation.com/vocab/academic/awllists/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Academic Word List (AWL)</a></li>
                    <li>• <a href="https://ieltsliz.com/vocabulary/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">IELTS Liz Vocabulary</a></li>
                    <li>• IELTS 4000 Academic Wordlist PDF</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-700">Professional References:</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Cambridge Academic Vocabulary</li>
                    <li>• Oxford Academic Word List</li>
                    <li>• Professional English Dictionaries</li>
                    <li>• Industry-specific Glossaries</li>
                    <li>• Academic Writing Resources</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
