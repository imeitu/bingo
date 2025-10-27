'use client'

import { useEffect } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { GameLayout } from './GameLayout'
import { SceneViewport } from './SceneViewport'
import { StatusPanel } from './StatusPanel'
import { ActionPanel } from './ActionPanel'
import { updateLastPlayedAtom, gameFlagsAtom } from '@/state/samoyed-game/atoms'

export function SamoyedGameShell() {
  const updateLastPlayed = useSetAtom(updateLastPlayedAtom)
  const flags = useAtomValue(gameFlagsAtom)

  useEffect(() => {
    updateLastPlayed()
    
    const interval = setInterval(() => {
      updateLastPlayed()
    }, 60000)

    return () => clearInterval(interval)
  }, [updateLastPlayed])

  return (
    <GameLayout>
      {flags.firstVisit && (
        <div className="mb-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-yellow-300 shadow-lg">
          <h2 className="text-2xl font-bold text-purple-700 mb-2">
            Welcome to Samoyed Care Game! 👋
          </h2>
          <p className="text-gray-700">
            Take care of your Samoyed by feeding, playing, cleaning, and letting them rest.
            Watch their stats and keep them happy! 🐕✨
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SceneViewport />
        </div>
        
        <div className="space-y-6">
          <StatusPanel />
          <ActionPanel />
        </div>
      </div>
    </GameLayout>
  )
}
