'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { cleanPetAtom, petStatsAtom } from '@/state/samoyed-game/atoms'
import { SamoyedAvatar } from './SamoyedAvatar'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { getTransitionError } from '@/state/samoyed-game/interactions'
import toast from 'react-hot-toast'
import { playSound, setUserInteracted } from '@/lib/sound-effects'

interface BathroomSceneProps {
  isDark: boolean
}

export function BathroomScene({ isDark }: BathroomSceneProps) {
  const [isGrooming, setIsGrooming] = useState(false)
  const [groomingStep, setGroomingStep] = useState<'bath' | 'groom' | 'quick-clean' | 'full-spa' | null>(null)
  const stats = useAtomValue(petStatsAtom)
  const cleanPet = useSetAtom(cleanPetAtom)

  const handleGrooming = (cleaningType: 'bath' | 'groom' | 'quick-clean' | 'full-spa') => {
    const error = getTransitionError(stats, 'clean')
    if (error) {
      toast.error(error)
      return
    }
    setUserInteracted()
    setIsGrooming(true)
    setGroomingStep(cleaningType)
    cleanPet(cleaningType)
    playSound('clean')
    
    const messages = {
      bath: 'Giving a relaxing bath! 🛁',
      groom: 'Grooming that fluffy coat! ✨',
      'quick-clean': 'Quick cleanup done! 💨',
      'full-spa': 'Full spa treatment! 🌟',
    }
    toast.success(messages[cleaningType])
    
    setTimeout(() => {
      setIsGrooming(false)
      setGroomingStep(null)
    }, 2000)
  }

  return (
    <div
      className={cn(
        'relative w-full min-h-[400px] rounded-3xl overflow-hidden',
        'transition-colors duration-1000',
        isDark
          ? 'bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900'
          : 'bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100'
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className={cn(
          'absolute bottom-0 left-0 right-0 h-32',
          isDark ? 'bg-gradient-to-t from-blue-950/60' : 'bg-gradient-to-t from-blue-300/40'
        )} />
        
        <div className={cn(
          'absolute top-8 right-8 w-20 h-16 rounded-lg',
          isDark ? 'bg-white/10' : 'bg-white/60',
          'border-2',
          isDark ? 'border-blue-700' : 'border-blue-300'
        )}>
          <div className="absolute top-1 right-1 text-xs">🚿</div>
          <div className="absolute bottom-1 left-1 text-xs">💧</div>
        </div>

        <div className={cn(
          'absolute bottom-0 left-8 w-32 h-24 rounded-t-3xl',
          isDark ? 'bg-white/10' : 'bg-white/70',
          'border-2 border-t-2',
          isDark ? 'border-blue-700' : 'border-blue-300'
        )}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl">🛁</div>
        </div>

        {isGrooming && (
          <>
            <div className="absolute top-1/4 left-1/4 text-2xl animate-bounce">💧</div>
            <div className="absolute top-1/3 right-1/3 text-2xl animate-bounce" style={{ animationDelay: '200ms' }}>🫧</div>
            <div className="absolute top-1/2 left-1/3 text-2xl animate-bounce" style={{ animationDelay: '400ms' }}>✨</div>
          </>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="mb-8">
          <h2 className={cn(
            'text-2xl sm:text-3xl font-bold text-center mb-2',
            isDark ? 'text-cyan-200' : 'text-cyan-800'
          )}>
            🛁 Bathroom & Grooming
          </h2>
          <p className={cn(
            'text-sm sm:text-base text-center',
            isDark ? 'text-cyan-300' : 'text-cyan-600'
          )}>
            Keep your Samoyed clean and fluffy
          </p>
        </div>

        <SamoyedAvatar isPlaying={isGrooming} />

        <div className="mt-8 space-y-4">
          <div className="text-center">
            <p className={cn(
              'text-xs font-semibold mb-3',
              isDark ? 'text-cyan-300' : 'text-cyan-700'
            )}>
              Choose a grooming activity
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            <button
              onClick={() => handleGrooming('quick-clean')}
              className={cn(
                'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                'bg-gradient-to-br from-teal-400 to-cyan-500',
                'hover:from-teal-500 hover:to-cyan-600',
                'text-white',
                'border-2 border-teal-500 hover:border-teal-600',
                'shadow-lg hover:shadow-xl hover:scale-105',
                'focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2',
                groomingStep === 'quick-clean' && 'ring-2 ring-yellow-400'
              )}
              aria-label="Quick cleanup"
            >
              <div className="text-2xl mb-1">💨</div>
              <div>Quick Clean</div>
              <div className="text-xs opacity-80 mt-1">+15 cleanliness</div>
            </button>

            <button
              onClick={() => handleGrooming('bath')}
              className={cn(
                'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                'bg-gradient-to-br from-blue-400 to-indigo-500',
                'hover:from-blue-500 hover:to-indigo-600',
                'text-white',
                'border-2 border-blue-500 hover:border-blue-600',
                'shadow-lg hover:shadow-xl hover:scale-105',
                'focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2',
                groomingStep === 'bath' && 'ring-2 ring-yellow-400'
              )}
              aria-label="Give bath"
            >
              <div className="text-2xl mb-1">🛁</div>
              <div>Bath Time</div>
              <div className="text-xs opacity-80 mt-1">+30 cleanliness</div>
            </button>

            <button
              onClick={() => handleGrooming('groom')}
              className={cn(
                'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                'bg-gradient-to-br from-purple-400 to-pink-500',
                'hover:from-purple-500 hover:to-pink-600',
                'text-white',
                'border-2 border-purple-500 hover:border-purple-600',
                'shadow-lg hover:shadow-xl hover:scale-105',
                'focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2',
                groomingStep === 'groom' && 'ring-2 ring-yellow-400'
              )}
              aria-label="Groom fur"
            >
              <div className="text-2xl mb-1">✨</div>
              <div>Grooming</div>
              <div className="text-xs opacity-80 mt-1">+20 cleanliness</div>
            </button>

            <button
              onClick={() => handleGrooming('full-spa')}
              className={cn(
                'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                'bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-500',
                'hover:from-yellow-500 hover:via-pink-600 hover:to-purple-600',
                'text-white',
                'border-2 border-pink-500 hover:border-pink-600',
                'shadow-lg hover:shadow-xl hover:scale-105',
                'focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2',
                groomingStep === 'full-spa' && 'ring-2 ring-yellow-400'
              )}
              aria-label="Full spa treatment"
            >
              <div className="text-2xl mb-1">🌟</div>
              <div>Full Spa</div>
              <div className="text-xs opacity-80 mt-1">+50 cleanliness</div>
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <div className={cn(
              'px-3 py-1 rounded-full text-xs',
              isDark ? 'bg-cyan-800/60 text-cyan-200' : 'bg-cyan-200/60 text-cyan-800'
            )}>
              🧼 Washing
            </div>
            <div className={cn(
              'px-3 py-1 rounded-full text-xs',
              isDark ? 'bg-cyan-800/60 text-cyan-200' : 'bg-cyan-200/60 text-cyan-800'
            )}>
              💇 Brushing
            </div>
            <div className={cn(
              'px-3 py-1 rounded-full text-xs',
              isDark ? 'bg-cyan-800/60 text-cyan-200' : 'bg-cyan-200/60 text-cyan-800'
            )}>
              💅 Nail Trim
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
