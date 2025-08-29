'use client'

import { useEffect, useState, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookOpen, Mail, AlertCircle, Loader2 } from 'lucide-react'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  useEffect(() => {
    // Check if user is already signed in
    getSession().then(session => {
      if (session) {
        router.push(callbackUrl)
      }
    })
  }, [router, callbackUrl])

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await signIn('google', {
        callbackUrl,
        redirect: false
      })
      
      if (result?.error) {
        setError('Đăng nhập thất bại. Vui lòng thử lại.')
      } else if (result?.ok) {
        router.push(callbackUrl)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            IELTS Vocabulary
          </h1>
          <p className="text-gray-600">
            Đăng nhập để đồng bộ tiến độ học tập của bạn
          </p>
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            {/* Benefits */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Tại sao nên đăng nhập?
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Đồng bộ tiến độ học trên mọi thiết bị</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Theo dõi streaks và thống kê chi tiết</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Study plan cá nhân hóa</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Backup dữ liệu an toàn</span>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Mail className="w-5 h-5" />
              )}
              <span className="font-medium">
                {loading ? 'Đang đăng nhập...' : 'Tiếp tục với Google'}
              </span>
            </button>

            {/* Continue without account */}
            <div className="text-center pt-4 border-t border-gray-100">
              <button
                onClick={() => router.push('/')}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Tiếp tục không cần đăng nhập
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>Bằng việc đăng nhập, bạn đồng ý với</p>
          <p>
            <a href="#" className="underline hover:text-gray-700">Điều khoản sử dụng</a>
            {' và '}
            <a href="#" className="underline hover:text-gray-700">Chính sách bảo mật</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}