'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  Home,
  BookOpen, 
  BarChart3, 
  Calendar, 
  Brain,
  Database,
  Settings,
  User,
  LogIn,
  LogOut,
  Edit3,
  Headphones
} from 'lucide-react'
import UserSettingsPanel from './UserSettingsPanel'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

export default function Navigation() {
  const pathname = usePathname()
  const [showSettings, setShowSettings] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, signIn, signOut, loading } = useAuth()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Daily tasks overview'
    },
    {
      name: 'Flashcards',
      href: '/',
      icon: BookOpen,
      description: 'Study flashcards'
    },
    {
      name: 'Review Queue',
      href: '/review',
      icon: Brain,
      description: 'Spaced repetition'
    },
    {
      name: 'Grammar',
      href: '/grammar',
      icon: Edit3,
      description: 'Grammar exercises'
    },
    {
      name: 'Listening',
      href: '/listening',
      icon: Headphones,
      description: 'IELTS Listening practice'
    },
    {
      name: 'Progress',
      href: '/progress',
      icon: BarChart3,
      description: 'Track learning'
    },
    {
      name: 'Study Plan',
      href: '/study-plan',
      icon: Calendar,
      description: '24-week IELTS plan'
    },
    {
      name: 'Admin',
      href: '/admin',
      icon: Database,
      description: 'Manage vocabulary'
    }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              IELTS Vocab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={item.description}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
            
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Audio Settings"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* User Section */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 max-w-32 truncate">
                    {user.name}
                  </span>
                </button>
                
                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Hồ sơ cá nhân
                    </Link>
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        signOut()
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signIn}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                {loading ? 'Đang tải...' : 'Đăng nhập'}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex items-center space-x-1 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}
            
            {/* Mobile Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            
            {/* Mobile Auth Button */}
            {isAuthenticated && user ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <User className="w-4 h-4" />
                {user.name?.split(' ')[0] || 'User'}
              </button>
            ) : (
              <button
                onClick={signIn}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium whitespace-nowrap hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                {loading ? 'Tải...' : 'Login'}
              </button>
            )}
          </div>
          
          {/* Mobile User Menu */}
          {showUserMenu && isAuthenticated && user && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Link
                href="/profile"
                onClick={() => setShowUserMenu(false)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Hồ sơ cá nhân
              </Link>
              <button
                onClick={() => {
                  setShowUserMenu(false)
                  signOut()
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Settings Panel */}
      <UserSettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </nav>
  )
}
