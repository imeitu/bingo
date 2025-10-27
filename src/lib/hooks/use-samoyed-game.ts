'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useRef, useCallback } from 'react'
import {
  petStatsAtom,
  currentSceneAtom,
  currentMoodAtom,
  inventoryAtom,
  gameFlagsAtom,
  dayPhaseAtom,
  feedPetAtom,
  playWithPetAtom,
  cleanPetAtom,
  restPetAtom,
  updateStatAtom,
} from '@/state/samoyed-game/atoms'
import {
  isHungryAtom,
  isDirtyAtom,
  isSleepyAtom,
  isUnhappyAtom,
  decayStatsAtom,
  isSleepingAtom,
} from '@/state/samoyed-game/derived-atoms'
import type { PetStats, SceneType } from '@/state/samoyed-game/types'

export interface DecayConfig {
  enabled: boolean
  intervalMs: number
  rates: {
    hunger: number
    happiness: number
    cleanliness: number
    energy: number
  }
}

export const DEFAULT_DECAY_CONFIG: DecayConfig = {
  enabled: true,
  intervalMs: 5000,
  rates: {
    hunger: -1,
    happiness: -0.5,
    cleanliness: -0.3,
    energy: -0.2,
  },
}

export function useSamoyedGame(decayConfig: DecayConfig = DEFAULT_DECAY_CONFIG) {
  const [stats, setStats] = useAtom(petStatsAtom)
  const [scene, setScene] = useAtom(currentSceneAtom)
  const [inventory, setInventory] = useAtom(inventoryAtom)
  const [flags, setFlags] = useAtom(gameFlagsAtom)
  
  const mood = useAtomValue(currentMoodAtom)
  const dayPhase = useAtomValue(dayPhaseAtom)
  const isHungry = useAtomValue(isHungryAtom)
  const isDirty = useAtomValue(isDirtyAtom)
  const isSleepy = useAtomValue(isSleepyAtom)
  const isUnhappy = useAtomValue(isUnhappyAtom)
  const isSleeping = useAtomValue(isSleepingAtom)
  
  const feedPet = useSetAtom(feedPetAtom)
  const playWithPet = useSetAtom(playWithPetAtom)
  const cleanPet = useSetAtom(cleanPetAtom)
  const restPet = useSetAtom(restPetAtom)
  const updateStat = useSetAtom(updateStatAtom)
  const decayStats = useSetAtom(decayStatsAtom)
  
  const decayIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startDecay = useCallback(() => {
    if (decayIntervalRef.current) {
      clearInterval(decayIntervalRef.current)
    }

    if (decayConfig.enabled) {
      decayIntervalRef.current = setInterval(() => {
        decayStats(decayConfig.rates)
      }, decayConfig.intervalMs)
    }
  }, [decayConfig, decayStats])

  const stopDecay = useCallback(() => {
    if (decayIntervalRef.current) {
      clearInterval(decayIntervalRef.current)
      decayIntervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isSleeping) {
      startDecay()
    } else {
      stopDecay()
    }

    return () => {
      stopDecay()
    }
  }, [isSleeping, startDecay, stopDecay])

  return {
    stats,
    scene,
    mood,
    dayPhase,
    inventory,
    flags,
    
    thresholds: {
      isHungry,
      isDirty,
      isSleepy,
      isUnhappy,
      isSleeping,
    },
    
    actions: {
      feed: feedPet,
      play: playWithPet,
      clean: cleanPet,
      rest: restPet,
      updateStat,
    },
    
    setters: {
      setStats,
      setScene,
      setInventory,
      setFlags,
    },
    
    decay: {
      start: startDecay,
      stop: stopDecay,
    },
  }
}
