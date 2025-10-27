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

export const petStatsAtom = atomWithStorage<PetStats>(
  'samoyed-game:petStats',
  DEFAULT_PET_STATS,
  undefined,
  { unstable_getOnInit: true }
)

export const currentSceneAtom = atomWithStorage<SceneType>(
  'samoyed-game:currentScene',
  SceneType.Home,
  undefined,
  { unstable_getOnInit: true }
)

export const inventoryAtom = atomWithStorage<InventoryItem[]>(
  'samoyed-game:inventory',
  DEFAULT_INVENTORY,
  undefined,
  { unstable_getOnInit: true }
)

export const gameFlagsAtom = atomWithStorage<GameFlags>(
  'samoyed-game:flags',
  DEFAULT_FLAGS,
  undefined,
  { unstable_getOnInit: true }
)

export const notificationsAtom = atomWithStorage<GameNotification[]>(
  'samoyed-game:notifications',
  [],
  undefined,
  { unstable_getOnInit: true }
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
    
    if (item && item.quantity > 0) {
      const updatedInventory = inventory.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      )
      set(inventoryAtom, updatedInventory)
      
      const currentStats = get(petStatsAtom)
      set(petStatsAtom, {
        ...currentStats,
        hunger: clampStat(currentStats.hunger + 20),
        happiness: clampStat(currentStats.happiness + 5),
      })
    }
  }
)

export const playWithPetAtom = atom(
  null,
  (get, set, itemId?: string) => {
    const currentStats = get(petStatsAtom)
    
    if (itemId) {
      const inventory = get(inventoryAtom)
      const item = inventory.find((i) => i.id === itemId && i.type === 'toy')
      
      if (!item) return
    }
    
    set(petStatsAtom, {
      ...currentStats,
      happiness: clampStat(currentStats.happiness + 15),
      energy: clampStat(currentStats.energy - 10),
      hunger: clampStat(currentStats.hunger - 5),
    })
  }
)

export const cleanPetAtom = atom(
  null,
  (get, set) => {
    const currentStats = get(petStatsAtom)
    set(petStatsAtom, {
      ...currentStats,
      cleanliness: clampStat(currentStats.cleanliness + 30),
      happiness: clampStat(currentStats.happiness + 5),
    })
  }
)

export const restPetAtom = atom(
  null,
  (get, set) => {
    const currentStats = get(petStatsAtom)
    set(petStatsAtom, {
      ...currentStats,
      energy: clampStat(currentStats.energy + 40),
      hunger: clampStat(currentStats.hunger - 10),
    })
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
