'use client'

import { useAtomValue } from 'jotai'
import { petStatsAtom, currentMoodAtom } from '@/state/samoyed-game/atoms'
import { STAT_WARNING_THRESHOLD, STAT_CRITICAL_THRESHOLD } from '@/state/samoyed-game/types'
import { cn } from '@/lib/utils'

export function StatusPanel() {
  const stats = useAtomValue(petStatsAtom)
  const mood = useAtomValue(currentMoodAtom)

  const getStatColor = (value: number) => {
    if (value <= STAT_CRITICAL_THRESHOLD) return 'text-red-500'
    if (value <= STAT_WARNING_THRESHOLD) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getStatBgColor = (value: number) => {
    if (value <= STAT_CRITICAL_THRESHOLD) return 'bg-red-500'
    if (value <= STAT_WARNING_THRESHOLD) return 'bg-yellow-400'
    return 'bg-green-400'
  }
  
  const shouldPulse = (value: number) => {
    return value <= STAT_CRITICAL_THRESHOLD
  }

  const getMoodEmoji = () => {
    const moodEmojis = {
      happy: '😊',
      sad: '😢',
      hungry: '😋',
      sleepy: '😴',
      dirty: '🤢',
      excited: '🤩',
    }
    return moodEmojis[mood] || '😊'
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-pink-200">
      <div className="mb-4 text-center">
        <span className="text-4xl" role="img" aria-label={`Mood: ${mood}`}>
          {getMoodEmoji()}
        </span>
        <h3 className="text-xl font-semibold text-purple-700 capitalize mt-2">
          Mood: {mood}
        </h3>
      </div>

      <div className="space-y-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 capitalize">
                {key}
              </span>
              <span
                className={cn('text-sm font-bold', getStatColor(value))}
                aria-label={`${key}: ${value} percent`}
              >
                {value}%
              </span>
            </div>
            <div
              className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"
              role="progressbar"
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${key} level`}
            >
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500 ease-out',
                  getStatBgColor(value),
                  shouldPulse(value) && 'animate-pulse'
                )}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
