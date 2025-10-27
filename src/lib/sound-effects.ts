export type SoundEffectType = 'feed' | 'play' | 'clean' | 'rest' | 'notification' | 'success'

const soundFiles: Record<SoundEffectType, string> = {
  feed: '/samoyed-game/sfx/feed.mp3',
  play: '/samoyed-game/sfx/play.mp3',
  clean: '/samoyed-game/sfx/clean.mp3',
  rest: '/samoyed-game/sfx/rest.mp3',
  notification: '/samoyed-game/sfx/notification.mp3',
  success: '/samoyed-game/sfx/success.mp3',
}

let audioContext: AudioContext | null = null
let soundEnabled = false
let userInteracted = false

export function initSoundSystem(enabled: boolean) {
  soundEnabled = enabled
  if (typeof window !== 'undefined' && enabled && !audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
}

export function setUserInteracted() {
  userInteracted = true
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume()
  }
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled
  if (enabled && typeof window !== 'undefined' && !audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
}

export function getSoundEnabled(): boolean {
  return soundEnabled
}

export async function playSound(type: SoundEffectType, volume: number = 0.3) {
  if (!soundEnabled || !userInteracted || typeof window === 'undefined') {
    return
  }

  try {
    const audio = new Audio(soundFiles[type])
    audio.volume = Math.max(0, Math.min(1, volume))
    
    audio.addEventListener('error', () => {
      console.warn(`Failed to load sound: ${soundFiles[type]}`)
    })
    
    await audio.play()
  } catch (error) {
    console.warn('Sound playback failed:', error)
  }
}
