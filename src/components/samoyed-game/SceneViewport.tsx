'use client'

import { useAtom } from 'jotai'
import { currentSceneAtom } from '@/state/samoyed-game/atoms'
import { SceneType } from '@/state/samoyed-game/types'
import { cn } from '@/lib/utils'

export function SceneViewport() {
  const [currentScene, setCurrentScene] = useAtom(currentSceneAtom)

  const scenes = [
    { id: SceneType.Home, label: 'Home', emoji: '🏠' },
    { id: SceneType.Park, label: 'Park', emoji: '🌳' },
    { id: SceneType.Kitchen, label: 'Kitchen', emoji: '🍽️' },
    { id: SceneType.Bedroom, label: 'Bedroom', emoji: '🛏️' },
    { id: SceneType.Bathroom, label: 'Bathroom', emoji: '🛁' },
  ]

  const getSceneBackground = (scene: SceneType) => {
    const backgrounds = {
      [SceneType.Home]: 'bg-gradient-to-b from-pink-100 to-pink-200',
      [SceneType.Park]: 'bg-gradient-to-b from-green-100 to-green-200',
      [SceneType.Kitchen]: 'bg-gradient-to-b from-orange-100 to-orange-200',
      [SceneType.Bedroom]: 'bg-gradient-to-b from-purple-100 to-purple-200',
      [SceneType.Bathroom]: 'bg-gradient-to-b from-blue-100 to-blue-200',
    }
    return backgrounds[scene]
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center flex-wrap">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => setCurrentScene(scene.id)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              'border-2',
              currentScene === scene.id
                ? 'bg-purple-500 text-white border-purple-600 shadow-lg'
                : 'bg-white/80 text-purple-700 border-purple-300 hover:bg-purple-100'
            )}
          >
            {scene.emoji} {scene.label}
          </button>
        ))}
      </div>

      <div
        className={cn(
          'relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white',
          'min-h-[400px] flex items-center justify-center',
          getSceneBackground(currentScene)
        )}
      >
        <div className="text-center space-y-4 p-8">
          <div className="text-8xl animate-bounce">
            <img
              src="/samoyed-game/samoyed-placeholder.svg"
              alt="Samoyed"
              className="w-48 h-48 mx-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextElementSibling?.classList.remove('hidden')
              }}
            />
            <div className="hidden text-8xl">🐕</div>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {scenes.find((s) => s.id === currentScene)?.emoji}{' '}
            {scenes.find((s) => s.id === currentScene)?.label}
          </p>
        </div>
      </div>
    </div>
  )
}
