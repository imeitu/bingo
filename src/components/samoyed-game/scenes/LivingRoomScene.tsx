'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { feedPetAtom, playWithPetAtom, inventoryAtom, petStatsAtom } from '@/state/samoyed-game/atoms'
import { SamoyedAvatar } from './SamoyedAvatar'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { getTransitionError } from '@/state/samoyed-game/interactions'
import toast from 'react-hot-toast'
import { playSound, setUserInteracted } from '@/lib/sound-effects'

interface LivingRoomSceneProps {
  isDark: boolean
}

export function LivingRoomScene({ isDark }: LivingRoomSceneProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const inventory = useAtomValue(inventoryAtom)
  const stats = useAtomValue(petStatsAtom)
  const feedPet = useSetAtom(feedPetAtom)
  const playWithPet = useSetAtom(playWithPetAtom)

  const foodItems = inventory.filter((item) => item.type === 'food' && item.quantity > 0)

  const handleFeed = (itemId: string) => {
    setUserInteracted()
    feedPet(itemId)
    playSound('feed')
    toast.success('Fed your Samoyed!')
  }

  const handlePlay = () => {
    const error = getTransitionError(stats, 'play')
    if (error) {
      toast.error(error)
      return
    }
    setUserInteracted()
    setIsPlaying(true)
    playWithPet()
    playSound('play')
    toast.success('Playing with your Samoyed!')
    setTimeout(() => setIsPlaying(false), 2000)
  }

  return (
    <div
      className={cn(
        'relative w-full min-h-[400px] rounded-3xl overflow-hidden',
        'transition-colors duration-1000',
        isDark
          ? 'bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900'
          : 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100'
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className={cn(
          'absolute bottom-0 left-0 right-0 h-32',
          isDark ? 'bg-gradient-to-t from-purple-950/60' : 'bg-gradient-to-t from-purple-200/40'
        )} />
        <div className={cn(
          'absolute bottom-0 left-8 w-24 h-32 rounded-t-3xl',
          isDark ? 'bg-orange-900/40' : 'bg-orange-300/60'
        )}>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl">🛋️</div>
        </div>
        <div className={cn(
          'absolute bottom-0 right-8 w-20 h-24 rounded-t-full',
          isDark ? 'bg-green-900/40' : 'bg-green-300/60'
        )}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-3xl">🪴</div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="mb-8">
          <h2 className={cn(
            'text-2xl sm:text-3xl font-bold text-center mb-2',
            isDark ? 'text-purple-200' : 'text-purple-800'
          )}>
            🏠 Living Room
          </h2>
          <p className={cn(
            'text-sm sm:text-base text-center',
            isDark ? 'text-purple-300' : 'text-purple-600'
          )}>
            A cozy place to relax and bond
          </p>
        </div>

        <SamoyedAvatar isPlaying={isPlaying} />

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <div className="flex flex-col gap-2">
            <p className={cn(
              'text-xs font-semibold text-center',
              isDark ? 'text-purple-300' : 'text-purple-700'
            )}>
              Feed
            </p>
            {foodItems.slice(0, 2).map((item) => (
              <button
                key={item.id}
                onClick={() => handleFeed(item.id)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  'bg-pink-500 hover:bg-pink-600 text-white',
                  'border-2 border-pink-600 hover:border-pink-700',
                  'shadow-lg hover:shadow-xl hover:scale-105',
                  'focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2'
                )}
                aria-label={`Feed ${item.name}`}
              >
                {item.icon} {item.name} ({item.quantity})
              </button>
            ))}
          </div>

          <button
            onClick={handlePlay}
            className={cn(
              'px-6 py-3 rounded-xl text-base font-medium transition-all',
              'bg-blue-500 hover:bg-blue-600 text-white',
              'border-2 border-blue-600 hover:border-blue-700',
              'shadow-lg hover:shadow-xl hover:scale-105',
              'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2'
            )}
            aria-label="Play with your pet"
          >
            🎮 Play Together
          </button>
        </div>
      </div>
    </div>
  )
}
