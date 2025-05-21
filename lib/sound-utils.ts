// Sound constants
export const SOUNDS = {
  CLICK: "/sounds/click.mp3",
  HOVER: "/sounds/hover.mp3",
  SUCCESS: "/sounds/success.mp3",
  ERROR: "/sounds/error.mp3",
  NOTIFICATION: "/sounds/notification.mp3",
}

// Track if sounds are enabled
let soundsEnabled = true

// Initialize audio context
let audioContext: AudioContext | null = null

// Initialize audio elements
const audioElements: { [key: string]: HTMLAudioElement } = {}

/**
 * Initialize the audio context (must be called after user interaction)
 */
export function initAudio() {
  if (typeof window === "undefined") return

  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    // Pre-load sound files
    Object.entries(SOUNDS).forEach(([key, path]) => {
      if (!audioElements[key]) {
        const audio = new Audio(path)
        audio.preload = "auto"
        audioElements[key] = audio
      }
    })

    return true
  } catch (error) {
    console.error("Failed to initialize audio:", error)
    return false
  }
}

/**
 * Play a sound with the given volume
 */
export function playSound(soundPath: string, volume = 1.0) {
  if (!soundsEnabled || typeof window === "undefined") return

  try {
    // Initialize audio if not already done
    if (!audioContext) {
      const initialized = initAudio()
      if (!initialized) return
    }

    // Use cached audio element if available
    const soundKey = Object.entries(SOUNDS).find(([_, path]) => path === soundPath)?.[0]

    if (soundKey && audioElements[soundKey]) {
      const audio = audioElements[soundKey]
      audio.volume = volume
      audio.currentTime = 0
      audio.play().catch((err) => console.error("Error playing sound:", err))
      return
    }

    // Otherwise create a new audio element
    const audio = new Audio(soundPath)
    audio.volume = volume
    audio.play().catch((err) => console.error("Error playing sound:", err))
  } catch (error) {
    console.error("Failed to play sound:", error)
  }
}

/**
 * Toggle sounds on/off
 */
export function toggleSound() {
  soundsEnabled = !soundsEnabled
  return soundsEnabled
}

/**
 * Check if sounds are enabled
 */
export function isSoundEnabled() {
  return soundsEnabled
}

// Aliases for compatibility
export const toggleSounds = toggleSound
export const areSoundsEnabled = isSoundEnabled
