'use client'

import { useAtom, useAtomValue } from 'jotai'
import { currentSceneAtom, dayPhaseAtom } from '@/state/samoyed-game/atoms'
import { SceneType, DayPhase } from '@/state/samoyed-game/types'
import { cn } from '@/lib/utils'
import { useState, useEffect, ReactNode } from 'react'
import { LivingRoomScene } from './LivingRoomScene'
import { GardenScene } from './GardenScene'
import { BathroomScene } from './BathroomScene'

interface SceneSwitcherProps {
  className?: string
}

export function SceneSwitcher({ className }: SceneSwitcherProps) {
  const [currentScene, setCurrentScene] = useAtom(currentSceneAtom)
  const dayPhase = useAtomValue(dayPhaseAtom)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayScene, setDisplayScene] = useState(currentScene)

  useEffect(() => {
    if (currentScene !== displayScene) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setDisplayScene(currentScene)
        setIsTransitioning(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [currentScene, displayScene])

  const scenes = [
    { id: SceneType.Home, label: 'Living Room', emoji: '🏠' },
    { id: SceneType.Park, label: 'Garden', emoji: '🌳' },
    { id: SceneType.Kitchen, label: 'Kitchen', emoji: '🍽️' },
    { id: SceneType.Bedroom, label: 'Bedroom', emoji: '🛏️' },
    { id: SceneType.Bathroom, label: 'Bathroom', emoji: '🛁' },
  ]

  const isDark = dayPhase === DayPhase.Night || dayPhase === DayPhase.Dusk

  const renderScene = (scene: SceneType) => {
    switch (scene) {
      case SceneType.Home:
        return <LivingRoomScene isDark={isDark} />
      case SceneType.Park:
        return <GardenScene isDark={isDark} />
      case SceneType.Bathroom:
        return <BathroomScene isDark={isDark} />
      case SceneType.Kitchen:
        return <PlaceholderScene icon="🍽️" name="Kitchen" isDark={isDark} />
      case SceneType.Bedroom:
        return <PlaceholderScene icon="🛏️" name="Bedroom" isDark={isDark} />
      default:
        return <PlaceholderScene icon="🏠" name="Home" isDark={isDark} />
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex gap-2 justify-center flex-wrap">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => setCurrentScene(scene.id)}
            className={cn(
              'px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-all',
              'border-2',
              'focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2',
              currentScene === scene.id
                ? 'bg-purple-500 text-white border-purple-600 shadow-lg scale-105'
                : 'bg-white/80 text-purple-700 border-purple-300 hover:bg-purple-100 hover:scale-105'
            )}
            aria-label={`Go to ${scene.label}`}
            aria-pressed={currentScene === scene.id}
          >
            <span role="img" aria-hidden="true">{scene.emoji}</span> {scene.label}
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden">
        <div
          className={cn(
            'transition-all duration-500',
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          )}
        >
          {renderScene(displayScene)}
        </div>
      </div>
    </div>
  )
}

interface PlaceholderSceneProps {
  icon: string
  name: string
  isDark: boolean
}

function PlaceholderScene({ icon, name, isDark }: PlaceholderSceneProps) {
  return (
    <div
      className={cn(
        'relative w-full min-h-[400px] rounded-3xl overflow-hidden',
        'transition-colors duration-1000',
        'flex items-center justify-center',
        isDark
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800'
          : 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100'
      )}
    >
      <div className="text-center space-y-4 p-8">
        <div className="text-8xl animate-bounce">{icon}</div>
        <h2 className={cn(
          'text-2xl sm:text-3xl font-bold',
          isDark ? 'text-gray-200' : 'text-gray-800'
        )}>
          {name}
        </h2>
        <p className={cn(
          'text-sm sm:text-base',
          isDark ? 'text-gray-400' : 'text-gray-600'
        )}>
          Coming soon! This scene is under construction.
        </p>
      </div>
    </div>
  )
}
