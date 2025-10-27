export enum SceneType {
  Home = 'home',
  Park = 'park',
  Kitchen = 'kitchen',
  Bedroom = 'bedroom',
  Bathroom = 'bathroom',
}

export interface PetStats {
  hunger: number
  happiness: number
  cleanliness: number
  energy: number
}

export enum MoodType {
  Happy = 'happy',
  Sad = 'sad',
  Hungry = 'hungry',
  Sleepy = 'sleepy',
  Dirty = 'dirty',
  Excited = 'excited',
}

export enum DayPhase {
  Dawn = 'dawn',
  Day = 'day',
  Dusk = 'dusk',
  Night = 'night',
}

export interface GameNotification {
  id: string
  type: 'warning' | 'critical' | 'info' | 'success'
  message: string
  stat?: keyof PetStats
  timestamp: number
  dismissed: boolean
}

export interface InventoryItem {
  id: string
  name: string
  type: 'food' | 'toy' | 'accessory' | 'medicine'
  icon: string
  quantity: number
}

export interface GameFlags {
  firstVisit: boolean
  tutorialCompleted: boolean
  lastPlayedAt: number
  totalPlayTime: number
  lastSavedAt: number
  gameClock: number
  soundEnabled: boolean
}

export interface GameState {
  petStats: PetStats
  currentScene: SceneType
  currentMood: MoodType
  inventory: InventoryItem[]
  flags: GameFlags
  dayPhase: DayPhase
  notifications: GameNotification[]
}

export const STAT_MIN = 0
export const STAT_MAX = 100
export const STAT_WARNING_THRESHOLD = 30
export const STAT_CRITICAL_THRESHOLD = 10

export const DEFAULT_PET_STATS: PetStats = {
  hunger: 80,
  happiness: 90,
  cleanliness: 85,
  energy: 75,
}

export const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: 'kibble',
    name: 'Dog Kibble',
    type: 'food',
    icon: '🍖',
    quantity: 5,
  },
  {
    id: 'ball',
    name: 'Tennis Ball',
    type: 'toy',
    icon: '🎾',
    quantity: 1,
  },
]

export const DEFAULT_FLAGS: GameFlags = {
  firstVisit: true,
  tutorialCompleted: false,
  lastPlayedAt: Date.now(),
  totalPlayTime: 0,
  lastSavedAt: Date.now(),
  gameClock: 0,
  soundEnabled: false,
}

export function clampStat(value: number): number {
  return Math.max(STAT_MIN, Math.min(STAT_MAX, value))
}

export function calculateMood(stats: PetStats): MoodType {
  if (stats.hunger < STAT_CRITICAL_THRESHOLD) return MoodType.Hungry
  if (stats.energy < STAT_CRITICAL_THRESHOLD) return MoodType.Sleepy
  if (stats.cleanliness < STAT_WARNING_THRESHOLD) return MoodType.Dirty
  if (stats.happiness < STAT_WARNING_THRESHOLD) return MoodType.Sad
  if (stats.happiness > 90) return MoodType.Excited
  return MoodType.Happy
}

export function calculateDayPhase(gameClock: number): DayPhase {
  const hourInMs = 60 * 1000
  const dayLength = hourInMs * 24
  const timeOfDay = gameClock % dayLength
  const hour = (timeOfDay / hourInMs) % 24

  if (hour >= 5 && hour < 8) return DayPhase.Dawn
  if (hour >= 8 && hour < 17) return DayPhase.Day
  if (hour >= 17 && hour < 20) return DayPhase.Dusk
  return DayPhase.Night
}

export function getStatLabel(stat: keyof PetStats): string {
  const labels: Record<keyof PetStats, string> = {
    hunger: 'Hunger',
    happiness: 'Happiness',
    cleanliness: 'Cleanliness',
    energy: 'Energy',
  }
  return labels[stat]
}
