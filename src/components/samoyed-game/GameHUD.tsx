'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { gameFlagsAtom, saveGameAtom, toggleSoundAtom, dayPhaseAtom } from '@/state/samoyed-game/atoms'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { playSound, setSoundEnabled, setUserInteracted } from '@/lib/sound-effects'

export function GameHUD() {
  const flags = useAtomValue(gameFlagsAtom)
  const dayPhase = useAtomValue(dayPhaseAtom)
  const saveGame = useSetAtom(saveGameAtom)
  const toggleSound = useSetAtom(toggleSoundAtom)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      saveGame()
      await playSound('success', 0.3)
      toast.success('Game saved successfully!', {
        icon: '💾',
        duration: 2000,
      })
    } catch (error) {
      toast.error('Failed to save game', {
        icon: '❌',
        duration: 2000,
      })
    } finally {
      setTimeout(() => setIsSaving(false), 500)
    }
  }

  const handleToggleSound = () => {
    setUserInteracted()
    toggleSound()
    setSoundEnabled(!flags.soundEnabled)
    if (!flags.soundEnabled) {
      playSound('success', 0.2)
      toast('Sound effects enabled', {
        icon: '🔊',
        duration: 1500,
      })
    } else {
      toast('Sound effects disabled', {
        icon: '🔇',
        duration: 1500,
      })
    }
  }

  const getDayPhaseIcon = () => {
    const icons = {
      dawn: '🌅',
      day: '☀️',
      dusk: '🌇',
      night: '🌙',
    }
    return icons[dayPhase]
  }

  const lastSavedText = flags.lastSavedAt
    ? new Date(flags.lastSavedAt).toLocaleTimeString()
    : 'Never'

  return (
    <div className="fixed top-2 sm:top-4 left-2 sm:left-4 z-40 space-y-2">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 shadow-lg border-2 border-purple-200 flex items-center gap-2 sm:gap-3">
        <span
          className="text-xl sm:text-2xl"
          title={`Current time: ${dayPhase}`}
          aria-label={`Time of day: ${dayPhase}`}
          role="img"
        >
          {getDayPhaseIcon()}
        </span>
        <div className="text-xs text-gray-600">
          <div className="font-semibold capitalize">{dayPhase}</div>
          <div className="text-[10px] hidden sm:block">Saved: {lastSavedText}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            'px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all',
            'bg-green-100 hover:bg-green-200 text-green-800',
            'border-2 border-green-300 hover:border-green-400',
            'shadow-lg hover:shadow-xl',
            'focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isSaving && 'animate-pulse'
          )}
          aria-label="Save game"
        >
          <span role="img" aria-hidden="true">💾</span> <span className="hidden sm:inline">Save</span>
        </button>

        <button
          onClick={handleToggleSound}
          className={cn(
            'px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all',
            'border-2 shadow-lg hover:shadow-xl',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            flags.soundEnabled
              ? 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 hover:border-blue-400 focus:ring-blue-400'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300 hover:border-gray-400 focus:ring-gray-400'
          )}
          aria-label={flags.soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
        >
          <span role="img" aria-hidden="true">{flags.soundEnabled ? '🔊' : '🔇'}</span>
        </button>
      </div>
    </div>
  )
}
