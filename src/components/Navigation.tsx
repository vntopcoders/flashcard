'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home,
  BookOpen, 
  BarChart3, 
  Calendar, 
  Brain,
  Target,
  Trophy,
  Database
} from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Flashcards',
      href: '/',
      icon: Home,
      description: 'Study flashcards'
    },
    {
      name: 'Review Queue',
      href: '/review',
      icon: Brain,
      description: 'Spaced repetition'
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
          </div>

          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-blue-600" />
              <span>1,987 words</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span>234 mastered</span>
            </div>
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
          </div>
        </div>
      </div>
    </nav>
  )
}
