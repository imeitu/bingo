'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { playWithPetAtom, inventoryAtom, petStatsAtom } from '@/state/samoyed-game/atoms'
import { SamoyedAvatar } from './SamoyedAvatar'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { getTransitionError } from '@/state/samoyed-game/interactions'
import toast from 'react-hot-toast'
import { playSound, setUserInteracted } from '@/lib/sound-effects'

interface GardenSceneProps {
  isDark: boolean
}

export function GardenScene({ isDark }: GardenSceneProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedToy, setSelectedToy] = useState<string | null>(null)
  const inventory = useAtomValue(inventoryAtom)
  const stats = useAtomValue(petStatsAtom)
  const playWithPet = useSetAtom(playWithPetAtom)

  const toyItems = inventory.filter((item) => item.type === 'toy')

  const handlePlayWithToy = (toyId?: string) => {
    const error = getTransitionError(stats, 'play')
    if (error) {
      toast.error(error)
      return
    }
    setUserInteracted()
    setIsPlaying(true)
    playWithPet(toyId)
    playSound('play')
    const toyName = toyId ? inventory.find(i => i.id === toyId)?.name : 'nothing'
    toast.success(`Playing with ${toyName}!`)
    setTimeout(() => {
      setIsPlaying(false)
      setSelectedToy(null)
    }, 2000)
  }

  return (
    <div
      className={cn(
        'relative w-full min-h-[400px] rounded-3xl overflow-hidden',
        'transition-colors duration-1000',
        isDark
          ? 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900'
          : 'bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100'
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className={cn(
          'absolute bottom-0 left-0 right-0 h-24',
          isDark ? 'bg-gradient-to-t from-green-950/60' : 'bg-gradient-to-t from-green-300/40'
        )} />
        
        <div className="absolute top-8 left-8 text-4xl animate-bounce" style={{ animationDelay: '0ms' }}>🌳</div>
        <div className="absolute top-12 right-12 text-3xl animate-bounce" style={{ animationDelay: '200ms' }}>🌻</div>
        <div className="absolute top-24 left-1/4 text-2xl animate-bounce" style={{ animationDelay: '400ms' }}>🦋</div>
        <div className="absolute top-20 right-1/4 text-2xl animate-bounce" style={{ animationDelay: '600ms' }}>🐝</div>
        
        <div className={cn(
          'absolute bottom-0 right-16 w-16 h-16 rounded-lg',
          isDark ? 'bg-yellow-900/40' : 'bg-yellow-300/60'
        )}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">⛳</div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="mb-8">
          <h2 className={cn(
            'text-2xl sm:text-3xl font-bold text-center mb-2',
            isDark ? 'text-green-200' : 'text-green-800'
          )}>
            🌳 Garden Park
          </h2>
          <p className={cn(
            'text-sm sm:text-base text-center',
            isDark ? 'text-green-300' : 'text-green-600'
          )}>
            Perfect for outdoor play and exercise
          </p>
        </div>

        <SamoyedAvatar isPlaying={isPlaying} />

        <div className="mt-8 space-y-4">
          <div className="text-center">
            <p className={cn(
              'text-xs font-semibold mb-2',
              isDark ? 'text-green-300' : 'text-green-700'
            )}>
              Choose a toy to play with
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handlePlayWithToy()}
              className={cn(
                'px-5 py-3 rounded-xl text-sm font-medium transition-all',
                'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600',
                'text-white',
                'border-2 border-blue-600 hover:border-blue-700',
                'shadow-lg hover:shadow-xl hover:scale-105',
                'focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2',
                !selectedToy && 'ring-2 ring-yellow-400'
              )}
              aria-label="Run around freely"
            >
              🏃 Run Freely
            </button>

            {toyItems.map((toy) => (
              <button
                key={toy.id}
                onClick={() => {
                  setSelectedToy(toy.id)
                  handlePlayWithToy(toy.id)
                }}
                className={cn(
                  'px-5 py-3 rounded-xl text-sm font-medium transition-all',
                  'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
                  'text-white',
                  'border-2 border-purple-600 hover:border-purple-700',
                  'shadow-lg hover:shadow-xl hover:scale-105',
                  'focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2',
                  selectedToy === toy.id && 'ring-2 ring-yellow-400'
                )}
                aria-label={`Play with ${toy.name}`}
              >
                {toy.icon} {toy.name}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <div className={cn(
              'px-3 py-1 rounded-full text-xs',
              isDark ? 'bg-green-800/60 text-green-200' : 'bg-green-200/60 text-green-800'
            )}>
              🎾 Fetch Games
            </div>
            <div className={cn(
              'px-3 py-1 rounded-full text-xs',
              isDark ? 'bg-green-800/60 text-green-200' : 'bg-green-200/60 text-green-800'
            )}>
              🏃 Running
            </div>
            <div className={cn(
              'px-3 py-1 rounded-full text-xs',
              isDark ? 'bg-green-800/60 text-green-200' : 'bg-green-200/60 text-green-800'
            )}>
              🦴 Catch
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
