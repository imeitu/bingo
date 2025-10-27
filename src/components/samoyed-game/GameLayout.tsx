'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GameLayoutProps {
  children: ReactNode
  className?: string
}

export function GameLayout({ children, className }: GameLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50', className)}>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
            Samoyed Care Game
          </h1>
          <p className="text-gray-600 mt-2">Take care of your fluffy friend! 🐾</p>
        </header>
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
