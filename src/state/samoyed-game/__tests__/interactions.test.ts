import { describe, it, expect } from 'vitest'
import {
  applyFoodEffect,
  applyToyEffect,
  applyCleaningEffect,
  applyRestEffect,
  isValidStateTransition,
  getTransitionError,
} from '../interactions'
import type { PetStats } from '../types'

const createTestStats = (overrides?: Partial<PetStats>): PetStats => ({
  hunger: 50,
  happiness: 50,
  cleanliness: 50,
  energy: 50,
  ...overrides,
})

describe('Interaction Effects', () => {
  describe('applyFoodEffect', () => {
    it('should apply kibble effect correctly', () => {
      const stats = createTestStats()
      const result = applyFoodEffect(stats, 'kibble')
      
      expect(result.hunger).toBe(70)
      expect(result.happiness).toBe(55)
      expect(result.energy).toBe(50)
    })

    it('should apply treat effect correctly', () => {
      const stats = createTestStats()
      const result = applyFoodEffect(stats, 'treat')
      
      expect(result.hunger).toBe(60)
      expect(result.happiness).toBe(65)
    })

    it('should clamp values at 100', () => {
      const stats = createTestStats({ hunger: 90 })
      const result = applyFoodEffect(stats, 'kibble')
      
      expect(result.hunger).toBe(100)
    })

    it('should return unchanged stats for unknown food', () => {
      const stats = createTestStats()
      const result = applyFoodEffect(stats, 'unknown')
      
      expect(result).toEqual(stats)
    })
  })

  describe('applyToyEffect', () => {
    it('should apply ball effect correctly', () => {
      const stats = createTestStats()
      const result = applyToyEffect(stats, 'ball')
      
      expect(result.happiness).toBe(65)
      expect(result.energy).toBe(40)
      expect(result.hunger).toBe(45)
    })

    it('should apply chew-toy effect correctly', () => {
      const stats = createTestStats()
      const result = applyToyEffect(stats, 'chew-toy')
      
      expect(result.happiness).toBe(62)
      expect(result.energy).toBe(45)
      expect(result.hunger).toBe(47)
    })

    it('should apply default effect when no toy specified', () => {
      const stats = createTestStats()
      const result = applyToyEffect(stats, undefined)
      
      expect(result.happiness).toBe(65)
      expect(result.energy).toBe(40)
    })

    it('should not allow energy to go below 0', () => {
      const stats = createTestStats({ energy: 5 })
      const result = applyToyEffect(stats, 'ball')
      
      expect(result.energy).toBe(0)
    })
  })

  describe('applyCleaningEffect', () => {
    it('should apply bath effect correctly', () => {
      const stats = createTestStats({ cleanliness: 40 })
      const result = applyCleaningEffect(stats, 'bath')
      
      expect(result.cleanliness).toBe(70)
      expect(result.happiness).toBe(55)
      expect(result.energy).toBe(45)
    })

    it('should apply groom effect correctly', () => {
      const stats = createTestStats({ cleanliness: 40 })
      const result = applyCleaningEffect(stats, 'groom')
      
      expect(result.cleanliness).toBe(60)
      expect(result.happiness).toBe(60)
    })

    it('should cap cleanliness at 100', () => {
      const stats = createTestStats({ cleanliness: 90 })
      const result = applyCleaningEffect(stats, 'bath')
      
      expect(result.cleanliness).toBe(100)
    })
  })

  describe('applyRestEffect', () => {
    it('should apply sleep effect correctly', () => {
      const stats = createTestStats({ energy: 30 })
      const result = applyRestEffect(stats, 'sleep')
      
      expect(result.energy).toBe(80)
      expect(result.hunger).toBe(35)
    })

    it('should apply nap effect correctly', () => {
      const stats = createTestStats({ energy: 40 })
      const result = applyRestEffect(stats, 'nap')
      
      expect(result.energy).toBe(65)
      expect(result.hunger).toBe(45)
    })

    it('should not allow hunger to go below 0', () => {
      const stats = createTestStats({ hunger: 5 })
      const result = applyRestEffect(stats, 'sleep')
      
      expect(result.hunger).toBe(0)
    })
  })

  describe('isValidStateTransition', () => {
    it('should allow feed action always', () => {
      const stats = createTestStats({ energy: 0 })
      expect(isValidStateTransition(stats, 'feed')).toBe(true)
    })

    it('should allow rest action always', () => {
      const stats = createTestStats({ energy: 0 })
      expect(isValidStateTransition(stats, 'rest')).toBe(true)
    })

    it('should prevent play when energy is too low', () => {
      const stats = createTestStats({ energy: 5 })
      expect(isValidStateTransition(stats, 'play')).toBe(false)
    })

    it('should allow play when energy is sufficient', () => {
      const stats = createTestStats({ energy: 50 })
      expect(isValidStateTransition(stats, 'play')).toBe(true)
    })

    it('should prevent clean when energy is too low', () => {
      const stats = createTestStats({ energy: 3 })
      expect(isValidStateTransition(stats, 'clean')).toBe(false)
    })

    it('should allow clean when energy is sufficient', () => {
      const stats = createTestStats({ energy: 10 })
      expect(isValidStateTransition(stats, 'clean')).toBe(true)
    })
  })

  describe('getTransitionError', () => {
    it('should return error message for invalid play', () => {
      const stats = createTestStats({ energy: 5 })
      const error = getTransitionError(stats, 'play')
      
      expect(error).toBe('Your pet is too tired to play. Let them rest first.')
    })

    it('should return error message for invalid clean', () => {
      const stats = createTestStats({ energy: 3 })
      const error = getTransitionError(stats, 'clean')
      
      expect(error).toBe('Your pet is too tired for cleaning. Let them rest first.')
    })

    it('should return null for valid transitions', () => {
      const stats = createTestStats({ energy: 50 })
      const error = getTransitionError(stats, 'play')
      
      expect(error).toBeNull()
    })
  })
})
