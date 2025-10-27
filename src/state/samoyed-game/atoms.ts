import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import {
  PetStats,
  SceneType,
  MoodType,
  InventoryItem,
  GameFlags,
  GameNotification,
  DayPhase,
  DEFAULT_PET_STATS,
  DEFAULT_INVENTORY,
  DEFAULT_FLAGS,
  calculateMood,
  calculateDayPhase,
  clampStat,
  STAT_WARNING_THRESHOLD,
  STAT_CRITICAL_THRESHOLD,
  getStatLabel,
} from './types'
import {
  applyFoodEffect,
  applyToyEffect,
  applyCleaningEffect,
  applyRestEffect,
  isValidStateTransition,
} from './interactions'

export const petStatsAtom = atomWithStorage<PetStats>(
  'samoyed-game:petStats',
  DEFAULT_PET_STATS
)

export const currentSceneAtom = atomWithStorage<SceneType>(
  'samoyed-game:currentScene',
  SceneType.Home
)

export const inventoryAtom = atomWithStorage<InventoryItem[]>(
  'samoyed-game:inventory',
  DEFAULT_INVENTORY
)

export const gameFlagsAtom = atomWithStorage<GameFlags>(
  'samoyed-game:flags',
  DEFAULT_FLAGS
)

export const notificationsAtom = atomWithStorage<GameNotification[]>(
  'samoyed-game:notifications',
  []
)

export const currentMoodAtom = atom<MoodType>((get) => {
  const stats = get(petStatsAtom)
  return calculateMood(stats)
})

export const dayPhaseAtom = atom<DayPhase>((get) => {
  const flags = get(gameFlagsAtom)
  return calculateDayPhase(flags.gameClock)
})

export const updateStatAtom = atom(
  null,
  (get, set, update: { stat: keyof PetStats; delta: number }) => {
    const currentStats = get(petStatsAtom)
    const newValue = clampStat(currentStats[update.stat] + update.delta)
    set(petStatsAtom, {
      ...currentStats,
      [update.stat]: newValue,
    })
  }
)

export const feedPetAtom = atom(
  null,
  (get, set, itemId: string) => {
    const inventory = get(inventoryAtom)
    const item = inventory.find((i) => i.id === itemId && i.type === 'food')
    
    if (!item || item.quantity <= 0) return
    
    const currentStats = get(petStatsAtom)
    if (!isValidStateTransition(currentStats, 'feed')) return
    
    const updatedInventory = inventory.map((i) =>
      i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
    )
    set(inventoryAtom, updatedInventory)
    
    const newStats = applyFoodEffect(currentStats, itemId)
    set(petStatsAtom, newStats)
  }
)

export const playWithPetAtom = atom(
  null,
  (get, set, itemId?: string) => {
    const currentStats = get(petStatsAtom)
    
    if (!isValidStateTransition(currentStats, 'play')) return
    
    if (itemId) {
      const inventory = get(inventoryAtom)
      const item = inventory.find((i) => i.id === itemId && i.type === 'toy')
      
      if (!item) return
    }
    
    const newStats = applyToyEffect(currentStats, itemId)
    set(petStatsAtom, newStats)
  }
)

export const cleanPetAtom = atom(
  null,
  (get, set, cleaningType: string = 'bath') => {
    const currentStats = get(petStatsAtom)
    
    if (!isValidStateTransition(currentStats, 'clean')) return
    
    const newStats = applyCleaningEffect(currentStats, cleaningType)
    set(petStatsAtom, newStats)
  }
)

export const restPetAtom = atom(
  null,
  (get, set, restType: string = 'sleep') => {
    const currentStats = get(petStatsAtom)
    const flags = get(gameFlagsAtom)
    
    if (!isValidStateTransition(currentStats, 'rest')) return
    
    const newStats = applyRestEffect(currentStats, restType)
    set(petStatsAtom, newStats)
    
    set(gameFlagsAtom, {
      ...flags,
      isSleeping: true,
    })
    
    setTimeout(() => {
      const currentFlags = gameFlagsAtom
      set(gameFlagsAtom, {
        ...flags,
        isSleeping: false,
      })
    }, 3000)
  }
)

export const updateLastPlayedAtom = atom(
  null,
  (get, set) => {
    const flags = get(gameFlagsAtom)
    const now = Date.now()
    const timeDiff = now - flags.lastPlayedAt
    
    set(gameFlagsAtom, {
      ...flags,
      lastPlayedAt: now,
      totalPlayTime: flags.totalPlayTime + timeDiff,
    })
  }
)

export const completeTutorialAtom = atom(
  null,
  (get, set) => {
    const flags = get(gameFlagsAtom)
    set(gameFlagsAtom, {
      ...flags,
      firstVisit: false,
      tutorialCompleted: true,
    })
  }
)

export const advanceGameClockAtom = atom(
  null,
  (get, set, deltaMs: number) => {
    const flags = get(gameFlagsAtom)
    set(gameFlagsAtom, {
      ...flags,
      gameClock: flags.gameClock + deltaMs,
    })
  }
)

export const toggleSoundAtom = atom(
  null,
  (get, set) => {
    const flags = get(gameFlagsAtom)
    set(gameFlagsAtom, {
      ...flags,
      soundEnabled: !flags.soundEnabled,
    })
  }
)

export const saveGameAtom = atom(
  null,
  (get, set) => {
    const flags = get(gameFlagsAtom)
    set(gameFlagsAtom, {
      ...flags,
      lastSavedAt: Date.now(),
    })
  }
)

export const addNotificationAtom = atom(
  null,
  (get, set, notification: Omit<GameNotification, 'id' | 'timestamp' | 'dismissed'>) => {
    const notifications = get(notificationsAtom)
    const newNotification: GameNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      dismissed: false,
    }
    set(notificationsAtom, [...notifications, newNotification])
  }
)

export const dismissNotificationAtom = atom(
  null,
  (get, set, id: string) => {
    const notifications = get(notificationsAtom)
    set(
      notificationsAtom,
      notifications.map((n) => (n.id === id ? { ...n, dismissed: true } : n))
    )
  }
)

export const clearOldNotificationsAtom = atom(
  null,
  (get, set) => {
    const notifications = get(notificationsAtom)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    set(
      notificationsAtom,
      notifications.filter((n) => !n.dismissed || n.timestamp > fiveMinutesAgo)
    )
  }
)

export const checkStatsAndNotifyAtom = atom(
  null,
  (get, set) => {
    const stats = get(petStatsAtom)
    const notifications = get(notificationsAtom)
    
    Object.entries(stats).forEach(([stat, value]) => {
      const statKey = stat as keyof PetStats
      const recentNotif = notifications.find(
        (n) => n.stat === statKey && !n.dismissed && Date.now() - n.timestamp < 60000
      )
      
      if (!recentNotif) {
        if (value <= STAT_CRITICAL_THRESHOLD) {
          set(addNotificationAtom, {
            type: 'critical',
            message: `${getStatLabel(statKey)} is critically low!`,
            stat: statKey,
          })
        } else if (value <= STAT_WARNING_THRESHOLD) {
          set(addNotificationAtom, {
            type: 'warning',
            message: `${getStatLabel(statKey)} is getting low.`,
            stat: statKey,
          })
        }
      }
    })
  }
)
