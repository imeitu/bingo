import { atom } from 'jotai'
import { petStatsAtom, gameFlagsAtom } from './atoms'
import { STAT_WARNING_THRESHOLD, STAT_CRITICAL_THRESHOLD, clampStat } from './types'
import type { PetStats } from './types'

export const isHungryAtom = atom((get) => {
  const stats = get(petStatsAtom)
  return stats.hunger < STAT_WARNING_THRESHOLD
})

export const isDirtyAtom = atom((get) => {
  const stats = get(petStatsAtom)
  return stats.cleanliness < STAT_WARNING_THRESHOLD
})

export const isSleepyAtom = atom((get) => {
  const stats = get(petStatsAtom)
  return stats.energy < STAT_WARNING_THRESHOLD
})

export const isUnhappyAtom = atom((get) => {
  const stats = get(petStatsAtom)
  return stats.happiness < STAT_WARNING_THRESHOLD
})

export const isCriticallyHungryAtom = atom((get) => {
  const stats = get(petStatsAtom)
  return stats.hunger < STAT_CRITICAL_THRESHOLD
})

export const isCriticallyDirtyAtom = atom((get) => {
  const stats = get(petStatsAtom)
  return stats.cleanliness < STAT_CRITICAL_THRESHOLD
})

export const isCriticallySleepyAtom = atom((get) => {
  const stats = get(petStatsAtom)
  return stats.energy < STAT_CRITICAL_THRESHOLD
})

export const isCriticallyUnhappyAtom = atom((get) => {
  const stats = get(petStatsAtom)
  return stats.happiness < STAT_CRITICAL_THRESHOLD
})

export const isSleepingAtom = atom((get) => {
  const flags = get(gameFlagsAtom)
  return flags.isSleeping ?? false
})

export const decayStatsAtom = atom(
  null,
  (get, set, rates: Partial<Record<keyof PetStats, number>>) => {
    const currentStats = get(petStatsAtom)
    const isSleeping = get(isSleepingAtom)
    
    if (isSleeping) {
      return
    }
    
    const newStats: PetStats = {
      hunger: clampStat(currentStats.hunger + (rates.hunger ?? 0)),
      happiness: clampStat(currentStats.happiness + (rates.happiness ?? 0)),
      cleanliness: clampStat(currentStats.cleanliness + (rates.cleanliness ?? 0)),
      energy: clampStat(currentStats.energy + (rates.energy ?? 0)),
    }
    
    set(petStatsAtom, newStats)
  }
)
