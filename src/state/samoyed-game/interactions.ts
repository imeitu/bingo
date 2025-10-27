import type { PetStats } from './types'
import { clampStat } from './types'

export interface FoodEffect {
  hunger: number
  happiness: number
  energy?: number
}

export interface ToyEffect {
  happiness: number
  energy: number
  hunger?: number
  cleanliness?: number
}

export interface CleaningStep {
  name: string
  cleanliness: number
  happiness: number
  energy?: number
}

export interface RestCycle {
  duration: number
  energy: number
  hunger: number
}

export const FOOD_EFFECTS: Record<string, FoodEffect> = {
  kibble: {
    hunger: 20,
    happiness: 5,
  },
  'premium-food': {
    hunger: 30,
    happiness: 10,
    energy: 5,
  },
  treat: {
    hunger: 10,
    happiness: 15,
  },
  'healthy-meal': {
    hunger: 25,
    happiness: 8,
    energy: 10,
  },
}

export const TOY_EFFECTS: Record<string, ToyEffect> = {
  ball: {
    happiness: 15,
    energy: -10,
    hunger: -5,
  },
  'chew-toy': {
    happiness: 12,
    energy: -5,
    hunger: -3,
  },
  frisbee: {
    happiness: 20,
    energy: -15,
    hunger: -8,
  },
  'plush-toy': {
    happiness: 10,
    energy: -3,
  },
}

export const CLEANING_STEPS: Record<string, CleaningStep> = {
  bath: {
    name: 'Bath',
    cleanliness: 30,
    happiness: 5,
    energy: -5,
  },
  groom: {
    name: 'Groom',
    cleanliness: 20,
    happiness: 10,
  },
  'quick-clean': {
    name: 'Quick Clean',
    cleanliness: 15,
    happiness: 3,
  },
  'full-spa': {
    name: 'Full Spa Treatment',
    cleanliness: 50,
    happiness: 15,
    energy: -10,
  },
}

export const REST_CYCLES: Record<string, RestCycle> = {
  nap: {
    duration: 1800000,
    energy: 25,
    hunger: -5,
  },
  sleep: {
    duration: 28800000,
    energy: 50,
    hunger: -15,
  },
  'power-nap': {
    duration: 900000,
    energy: 15,
    hunger: -2,
  },
}

export function applyFoodEffect(stats: PetStats, foodId: string): PetStats {
  const effect = FOOD_EFFECTS[foodId]
  if (!effect) return stats

  return {
    hunger: clampStat(stats.hunger + effect.hunger),
    happiness: clampStat(stats.happiness + effect.happiness),
    cleanliness: stats.cleanliness,
    energy: clampStat(stats.energy + (effect.energy ?? 0)),
  }
}

export function applyToyEffect(stats: PetStats, toyId?: string): PetStats {
  const effect = toyId ? TOY_EFFECTS[toyId] : TOY_EFFECTS.ball
  if (!effect) {
    return {
      ...stats,
      happiness: clampStat(stats.happiness + 10),
      energy: clampStat(stats.energy - 8),
      hunger: clampStat(stats.hunger - 3),
    }
  }

  return {
    hunger: clampStat(stats.hunger + (effect.hunger ?? 0)),
    happiness: clampStat(stats.happiness + effect.happiness),
    cleanliness: clampStat(stats.cleanliness + (effect.cleanliness ?? 0)),
    energy: clampStat(stats.energy + effect.energy),
  }
}

export function applyCleaningEffect(stats: PetStats, cleaningType: string = 'bath'): PetStats {
  const effect = CLEANING_STEPS[cleaningType]
  if (!effect) return stats

  return {
    hunger: stats.hunger,
    happiness: clampStat(stats.happiness + effect.happiness),
    cleanliness: clampStat(stats.cleanliness + effect.cleanliness),
    energy: clampStat(stats.energy + (effect.energy ?? 0)),
  }
}

export function applyRestEffect(stats: PetStats, restType: string = 'sleep'): PetStats {
  const effect = REST_CYCLES[restType]
  if (!effect) return stats

  return {
    hunger: clampStat(stats.hunger + effect.hunger),
    happiness: stats.happiness,
    cleanliness: stats.cleanliness,
    energy: clampStat(stats.energy + effect.energy),
  }
}

export function isValidStateTransition(
  currentStats: PetStats,
  action: 'feed' | 'play' | 'clean' | 'rest'
): boolean {
  switch (action) {
    case 'feed':
      return true
    case 'play':
      return currentStats.energy > 10
    case 'clean':
      return currentStats.energy > 5
    case 'rest':
      return true
    default:
      return false
  }
}

export function getTransitionError(
  currentStats: PetStats,
  action: 'feed' | 'play' | 'clean' | 'rest'
): string | null {
  if (!isValidStateTransition(currentStats, action)) {
    switch (action) {
      case 'play':
        return 'Your pet is too tired to play. Let them rest first.'
      case 'clean':
        return 'Your pet is too tired for cleaning. Let them rest first.'
      default:
        return 'Cannot perform this action right now.'
    }
  }
  return null
}
