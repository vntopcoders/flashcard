'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'

const errorMessages = {
  Configuration: 'Có lỗi cấu hình server. Vui lòng liên hệ admin.',
  AccessDenied: 'Truy cập bị từ chối. Bạn không có quyền truy cập.',
  Verification: 'Link xác thực không hợp lệ hoặc đã hết hạn.',
  Default: 'Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.'
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const error = searchParams.get('error')
  const errorMessage = errorMessages[error as keyof typeof errorMessages] || errorMessages.Default

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Đăng nhập thất bại
          </h1>
          <p className="text-gray-600 mb-8">
            {errorMessage}
          </p>

          {/* Error Details */}
          {error && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-500 font-medium mb-1">Chi tiết lỗi:</p>
              <p className="text-sm text-gray-700 font-mono">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/auth/signin')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Thử đăng nhập lại
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Về trang chủ
            </button>
          </div>

          {/* Help */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Nếu vấn đề vẫn tiếp tục, vui lòng{' '}
              <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                liên hệ hỗ trợ
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}