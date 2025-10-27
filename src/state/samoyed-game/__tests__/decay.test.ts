import { describe, it, expect, beforeEach } from 'vitest'
import { clampStat } from '../types'
import type { PetStats } from '../types'

const createTestStats = (overrides?: Partial<PetStats>): PetStats => ({
  hunger: 80,
  happiness: 90,
  cleanliness: 85,
  energy: 75,
  ...overrides,
})

function applyDecay(
  stats: PetStats,
  rates: Partial<Record<keyof PetStats, number>>
): PetStats {
  return {
    hunger: clampStat(stats.hunger + (rates.hunger ?? 0)),
    happiness: clampStat(stats.happiness + (rates.happiness ?? 0)),
    cleanliness: clampStat(stats.cleanliness + (rates.cleanliness ?? 0)),
    energy: clampStat(stats.energy + (rates.energy ?? 0)),
  }
}

describe('Stat Decay', () => {
  let stats: PetStats

  beforeEach(() => {
    stats = createTestStats()
  })

  describe('Basic Decay', () => {
    it('should reduce hunger over time', () => {
      const rates = { hunger: -1 }
      const result = applyDecay(stats, rates)
      
      expect(result.hunger).toBe(79)
    })

    it('should reduce happiness over time', () => {
      const rates = { happiness: -0.5 }
      const result = applyDecay(stats, rates)
      
      expect(result.happiness).toBe(89.5)
    })

    it('should reduce cleanliness over time', () => {
      const rates = { cleanliness: -0.3 }
      const result = applyDecay(stats, rates)
      
      expect(result.cleanliness).toBe(84.7)
    })

    it('should reduce energy over time', () => {
      const rates = { energy: -0.2 }
      const result = applyDecay(stats, rates)
      
      expect(result.energy).toBe(74.8)
    })
  })

  describe('Multiple Stat Decay', () => {
    it('should apply decay to all stats simultaneously', () => {
      const rates = {
        hunger: -1,
        happiness: -0.5,
        cleanliness: -0.3,
        energy: -0.2,
      }
      const result = applyDecay(stats, rates)
      
      expect(result.hunger).toBe(79)
      expect(result.happiness).toBe(89.5)
      expect(result.cleanliness).toBe(84.7)
      expect(result.energy).toBe(74.8)
    })

    it('should handle multiple decay cycles', () => {
      const rates = { hunger: -1, happiness: -0.5 }
      
      let result = stats
      for (let i = 0; i < 10; i++) {
        result = applyDecay(result, rates)
      }
      
      expect(result.hunger).toBe(70)
      expect(result.happiness).toBe(85)
    })
  })

  describe('Stat Clamping', () => {
    it('should not allow stats to go below 0', () => {
      const lowStats = createTestStats({
        hunger: 5,
        happiness: 3,
        cleanliness: 2,
        energy: 1,
      })
      const rates = {
        hunger: -10,
        happiness: -10,
        cleanliness: -10,
        energy: -10,
      }
      const result = applyDecay(lowStats, rates)
      
      expect(result.hunger).toBe(0)
      expect(result.happiness).toBe(0)
      expect(result.cleanliness).toBe(0)
      expect(result.energy).toBe(0)
    })

    it('should not allow stats to go above 100', () => {
      const highStats = createTestStats({
        hunger: 95,
        happiness: 98,
        cleanliness: 96,
        energy: 97,
      })
      const rates = {
        hunger: 10,
        happiness: 10,
        cleanliness: 10,
        energy: 10,
      }
      const result = applyDecay(highStats, rates)
      
      expect(result.hunger).toBe(100)
      expect(result.happiness).toBe(100)
      expect(result.cleanliness).toBe(100)
      expect(result.energy).toBe(100)
    })
  })

  describe('Configurable Decay Rates', () => {
    it('should support custom decay rates', () => {
      const rates = { hunger: -2, happiness: -1 }
      const result = applyDecay(stats, rates)
      
      expect(result.hunger).toBe(78)
      expect(result.happiness).toBe(89)
    })

    it('should support partial decay (only some stats)', () => {
      const rates = { hunger: -1 }
      const result = applyDecay(stats, rates)
      
      expect(result.hunger).toBe(79)
      expect(result.happiness).toBe(90)
      expect(result.cleanliness).toBe(85)
      expect(result.energy).toBe(75)
    })

    it('should support positive rates (stat recovery)', () => {
      const lowStats = createTestStats({ energy: 20 })
      const rates = { energy: 5 }
      const result = applyDecay(lowStats, rates)
      
      expect(result.energy).toBe(25)
    })
  })

  describe('Realistic Decay Scenarios', () => {
    it('should simulate 1 hour of decay (12 cycles @ 5s interval)', () => {
      const rates = {
        hunger: -1,
        happiness: -0.5,
        cleanliness: -0.3,
        energy: -0.2,
      }
      
      let result = stats
      for (let i = 0; i < 12; i++) {
        result = applyDecay(result, rates)
      }
      
      expect(result.hunger).toBe(68)
      expect(result.happiness).toBe(84)
      expect(result.cleanliness).toBeCloseTo(81.4, 1)
      expect(result.energy).toBeCloseTo(72.6, 1)
    })

    it('should reach critical levels after extended neglect', () => {
      const rates = {
        hunger: -1,
        happiness: -0.5,
        cleanliness: -0.3,
        energy: -0.2,
      }
      
      let result = stats
      for (let i = 0; i < 100; i++) {
        result = applyDecay(result, rates)
      }
      
      expect(result.hunger).toBe(0)
      expect(result.happiness).toBe(40)
      expect(result.cleanliness).toBeCloseTo(55, 1)
      expect(result.energy).toBeCloseTo(55, 1)
    })
  })
})
