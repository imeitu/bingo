'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  feedPetAtom,
  playWithPetAtom,
  cleanPetAtom,
  restPetAtom,
  inventoryAtom,
  dayPhaseAtom,
} from '@/state/samoyed-game/atoms'
import { DayPhase } from '@/state/samoyed-game/types'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { playSound, setUserInteracted } from '@/lib/sound-effects'

export function ActionPanel() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const inventory = useAtomValue(inventoryAtom)
  const dayPhase = useAtomValue(dayPhaseAtom)
  const feedPet = useSetAtom(feedPetAtom)
  const playWithPet = useSetAtom(playWithPetAtom)
  const cleanPet = useSetAtom(cleanPetAtom)
  const restPet = useSetAtom(restPetAtom)

  const foodItems = inventory.filter((item) => item.type === 'food' && item.quantity > 0)
  const toyItems = inventory.filter((item) => item.type === 'toy' && item.quantity > 0)
  
  const isNightTime = dayPhase === DayPhase.Night || dayPhase === DayPhase.Dusk

  const handleFeed = (itemId: string) => {
    setUserInteracted()
    feedPet(itemId)
    playSound('feed')
    setSelectedItem(null)
  }

  const handlePlay = (itemId?: string) => {
    setUserInteracted()
    playWithPet(itemId)
    playSound('play')
    setSelectedItem(null)
  }

  const handleClean = () => {
    setUserInteracted()
    cleanPet()
    playSound('clean')
  }

  const handleRest = () => {
    setUserInteracted()
    restPet()
    playSound('rest')
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-blue-200">
      <h3 className="text-xl font-semibold text-purple-700 mb-4">Actions</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Feed 🍖</h4>
          <div className="grid grid-cols-2 gap-2">
            {foodItems.length > 0 ? (
              foodItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleFeed(item.id)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    'bg-pink-100 hover:bg-pink-200 text-pink-800',
                    'border-2 border-pink-300 hover:border-pink-400',
                    'flex items-center justify-between',
                    'focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2'
                  )}
                  aria-label={`Feed ${item.name}`}
                >
                  <span>
                    {item.icon} {item.name}
                  </span>
                  <span className="text-xs bg-pink-300 px-2 py-1 rounded-full">
                    {item.quantity}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-sm text-gray-500 col-span-2">No food available</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Play 🎾</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handlePlay()}
              className={cn(
                'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                'bg-blue-100 hover:bg-blue-200 text-blue-800',
                'border-2 border-blue-300 hover:border-blue-400',
                'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2'
              )}
              aria-label="Play without toy"
            >
              Play (no toy)
            </button>
            {toyItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handlePlay(item.id)}
                className={cn(
                  'px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  'bg-blue-100 hover:bg-blue-200 text-blue-800',
                  'border-2 border-blue-300 hover:border-blue-400',
                  'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2'
                )}
                aria-label={`Play with ${item.name}`}
              >
                {item.icon} {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleClean}
            className={cn(
              'px-4 py-3 rounded-xl text-sm font-medium transition-all',
              'bg-teal-100 hover:bg-teal-200 text-teal-800',
              'border-2 border-teal-300 hover:border-teal-400',
              'focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2'
            )}
            aria-label="Clean your pet"
          >
            🛁 Clean
          </button>
          <button
            onClick={handleRest}
            className={cn(
              'px-4 py-3 rounded-xl text-sm font-medium transition-all relative',
              'bg-purple-100 hover:bg-purple-200 text-purple-800',
              'border-2 border-purple-300 hover:border-purple-400',
              'focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2',
              isNightTime && 'ring-2 ring-yellow-400 ring-offset-2'
            )}
            aria-label="Let your pet rest"
          >
            😴 Rest
            {isNightTime && (
              <span className="absolute -top-1 -right-1 text-xs bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                ⭐
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
