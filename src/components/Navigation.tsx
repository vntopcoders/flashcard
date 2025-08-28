'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Settings, Home, Database } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      label: 'Học Flashcards',
      icon: Home,
      active: pathname === '/'
    },
    {
      href: '/lessons',
      label: 'Quản lý Bài học',
      icon: Settings,
      active: pathname === '/lessons'
    },
    {
      href: '/admin',
      label: 'Quản lý Dữ liệu',
      icon: Database,
      active: pathname === '/admin'
    }
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">English Flashcards</span>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${item.active
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
