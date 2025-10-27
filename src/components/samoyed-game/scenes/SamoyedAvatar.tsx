'use client'

import { useAtomValue } from 'jotai'
import { currentMoodAtom, gameFlagsAtom } from '@/state/samoyed-game/atoms'
import { MoodType } from '@/state/samoyed-game/types'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface SamoyedAvatarProps {
  className?: string
  isPlaying?: boolean
}

export function SamoyedAvatar({ className, isPlaying = false }: SamoyedAvatarProps) {
  const mood = useAtomValue(currentMoodAtom)
  const flags = useAtomValue(gameFlagsAtom)
  const [animationTrigger, setAnimationTrigger] = useState(0)

  useEffect(() => {
    if (isPlaying) {
      setAnimationTrigger(prev => prev + 1)
    }
  }, [isPlaying])

  const getMoodEmoji = (moodType: MoodType, isSleeping?: boolean) => {
    if (isSleeping) return '😴'
    
    const emojis = {
      [MoodType.Happy]: '😊',
      [MoodType.Sad]: '😢',
      [MoodType.Hungry]: '🤤',
      [MoodType.Sleepy]: '😪',
      [MoodType.Dirty]: '😷',
      [MoodType.Excited]: '🤩',
    }
    return emojis[moodType]
  }

  const getMoodAnimation = (moodType: MoodType, isSleeping?: boolean, playing?: boolean) => {
    if (playing) return 'animate-jump'
    if (isSleeping) return 'animate-pulse'
    
    const animations = {
      [MoodType.Happy]: 'animate-bounce',
      [MoodType.Sad]: '',
      [MoodType.Hungry]: 'animate-wiggle',
      [MoodType.Sleepy]: 'animate-pulse',
      [MoodType.Dirty]: 'animate-shake',
      [MoodType.Excited]: 'animate-jump',
    }
    return animations[moodType]
  }

  const getMoodGlow = (moodType: MoodType) => {
    const glows = {
      [MoodType.Happy]: 'shadow-[0_0_30px_rgba(251,191,36,0.5)]',
      [MoodType.Sad]: 'shadow-[0_0_30px_rgba(59,130,246,0.5)]',
      [MoodType.Hungry]: 'shadow-[0_0_30px_rgba(239,68,68,0.5)]',
      [MoodType.Sleepy]: 'shadow-[0_0_30px_rgba(139,92,246,0.5)]',
      [MoodType.Dirty]: 'shadow-[0_0_30px_rgba(107,114,128,0.5)]',
      [MoodType.Excited]: 'shadow-[0_0_30px_rgba(236,72,153,0.5)]',
    }
    return glows[moodType]
  }

  const getMoodText = (moodType: MoodType, isSleeping?: boolean) => {
    if (isSleeping) return 'Sleeping...'
    
    const texts = {
      [MoodType.Happy]: 'Happy & Content',
      [MoodType.Sad]: 'Feeling Down',
      [MoodType.Hungry]: 'Hungry!',
      [MoodType.Sleepy]: 'Getting Sleepy',
      [MoodType.Dirty]: 'Needs Cleaning',
      [MoodType.Excited]: 'Super Excited!',
    }
    return texts[moodType]
  }

  return (
    <div className={cn('relative flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full',
          'flex items-center justify-center',
          'bg-gradient-to-br from-white to-gray-100',
          'border-4 border-white',
          'transition-all duration-500',
          getMoodGlow(mood),
          getMoodAnimation(mood, flags.isSleeping, isPlaying)
        )}
        key={animationTrigger}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="text-6xl sm:text-7xl md:text-8xl">
            🐕
          </div>
          
          <div className="absolute -top-2 -right-2 text-3xl sm:text-4xl animate-bounce">
            {getMoodEmoji(mood, flags.isSleeping)}
          </div>
        </div>
      </div>

      <div className={cn(
        'mt-4 px-4 py-2 rounded-full',
        'bg-white/90 backdrop-blur-sm',
        'border-2 border-purple-300',
        'shadow-lg transition-all duration-300'
      )}>
        <p className="text-sm sm:text-base font-semibold text-purple-700 text-center">
          {getMoodText(mood, flags.isSleeping)}
        </p>
      </div>

      {isPlaying && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 animate-bounce text-2xl">✨</div>
          <div className="absolute top-0 right-1/4 animate-bounce text-2xl delay-100">⭐</div>
          <div className="absolute bottom-0 left-1/3 animate-bounce text-2xl delay-200">💫</div>
        </div>
      )}
    </div>
  )
}
