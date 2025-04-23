// Sound utility for playing UI sounds

// Define sound file paths
export const SOUNDS = {
  CLICK: "/sounds/click.mp3",
  HOVER: "/sounds/hover.mp3",
  SUCCESS: "/sounds/success.mp3",
  ERROR: "/sounds/error.mp3",
  NOTIFICATION: "/sounds/notification.mp3",
}

// Local storage key for sound settings
const SOUNDS_ENABLED_KEY = "k-clash-sounds-enabled"

// Cache for audio objects
const audioCache: Record<string, HTMLAudioElement | null> = {}
const audioLoaded: Record<string, boolean> = {}

/**
 * Preload sound files to improve performance
 */
export function preloadSounds(): void {
  if (typeof window === "undefined") return

  Object.values(SOUNDS).forEach((soundPath) => {
    try {
      if (!audioCache[soundPath]) {
        const audio = new Audio()

        // Add error handling
        audio.onerror = () => {
          console.warn(`Failed to load sound: ${soundPath}`)
          audioLoaded[soundPath] = false
          audioCache[soundPath] = null
        }

        // Add load handling
        audio.oncanplaythrough = () => {
          audioLoaded[soundPath] = true
        }

        audio.src = soundPath
        audio.load()
        audioCache[soundPath] = audio
      }
    } catch (error) {
      console.warn(`Error preloading sound: ${soundPath}`, error)
      audioLoaded[soundPath] = false
      audioCache[soundPath] = null
    }
  })
}

/**
 * Play a sound effect with error handling
 * @param sound The sound identifier from SOUNDS
 * @param volume Volume level (0.0 to 1.0)
 */
export function playSound(sound: string, volume = 0.5): void {
  // Check if sounds are enabled in local storage
  const soundsEnabled = localStorage.getItem(SOUNDS_ENABLED_KEY) !== "false"
  if (!soundsEnabled) return

  try {
    // Skip if we already know this sound failed to load
    if (audioLoaded[sound] === false) return

    // Create or get cached audio
    if (!audioCache[sound]) {
      // Check if we're in a browser environment
      if (typeof window === "undefined") return

      const audio = new Audio()

      // Add error handling for missing sound files
      audio.onerror = () => {
        console.warn(`Sound file not found: ${sound}`)
        audioLoaded[sound] = false
        audioCache[sound] = null
      }

      audio.src = sound
      audioCache[sound] = audio
    }

    const audio = audioCache[sound]
    if (!audio) return // Skip if audio failed to load previously

    // Create a clone for overlapping sounds
    const audioClone = audio.cloneNode() as HTMLAudioElement
    audioClone.volume = volume

    // Reset audio to beginning if it's already playing
    audioClone.currentTime = 0

    // Play the sound with proper error handling
    const playPromise = audioClone.play()
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Handle autoplay restrictions or other errors
        console.warn("Could not play sound:", err)
      })
    }
  } catch (error) {
    console.warn("Error playing sound:", error)
  }
}

/**
 * Toggle sound effects on/off
 * @returns The new sound enabled state
 */
export function toggleSounds(): boolean {
  const currentSetting = localStorage.getItem(SOUNDS_ENABLED_KEY) !== "false"
  const newSetting = !currentSetting
  localStorage.setItem(SOUNDS_ENABLED_KEY, newSetting.toString())
  return newSetting
}

/**
 * Check if sound effects are enabled
 * @returns True if sounds are enabled
 */
export function areSoundsEnabled(): boolean {
  return localStorage.getItem(SOUNDS_ENABLED_KEY) !== "false"
}
