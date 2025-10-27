'use client'

import { ReactNode } from 'react'
import { useAtomValue } from 'jotai'
import { dayPhaseAtom } from '@/state/samoyed-game/atoms'
import { DayPhase } from '@/state/samoyed-game/types'
import { cn } from '@/lib/utils'

interface GameLayoutProps {
  children: ReactNode
  className?: string
}

export function GameLayout({ children, className }: GameLayoutProps) {
  const dayPhase = useAtomValue(dayPhaseAtom)

  const getBackgroundForPhase = (phase: DayPhase) => {
    const backgrounds = {
      [DayPhase.Dawn]: 'from-orange-100 via-pink-100 to-purple-100',
      [DayPhase.Day]: 'from-pink-50 via-purple-50 to-blue-50',
      [DayPhase.Dusk]: 'from-orange-200 via-red-100 to-purple-200',
      [DayPhase.Night]: 'from-indigo-900 via-purple-900 to-blue-900',
    }
    return backgrounds[phase]
  }

  const getTextColorForPhase = (phase: DayPhase) => {
    return phase === DayPhase.Night ? 'text-white' : 'text-gray-600'
  }

  return (
    <div
      className={cn(
        'min-h-screen bg-gradient-to-br transition-colors duration-1000',
        getBackgroundForPhase(dayPhase),
        className
      )}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
            Samoyed Care Game
          </h1>
          <p className={cn('mt-2 transition-colors duration-1000', getTextColorForPhase(dayPhase))}>
            Take care of your fluffy friend! 🐾
          </p>
        </header>
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
