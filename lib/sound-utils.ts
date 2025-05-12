// Sound utility functions for K-Clash platform
// This version maintains compatibility with existing code while disabling actual sound functionality

// Define sound types
export const SOUNDS = {
  CLICK: "click",
  HOVER: "hover",
  SUCCESS: "success",
  ERROR: "error",
  NOTIFICATION: "notification",
}

// Sound state management
let soundsEnabled = false

/**
 * Play a sound if available
 * @param soundName The name of the sound to play
 */
export const playSound = (soundName: string) => {
  // No-op function to prevent errors
  return
}

/**
 * Play a sound if sounds are enabled
 * @param soundName The name of the sound to play
 * @param isEnabled Override for sound enabled state
 */
export const playSoundIfEnabled = (soundName: string, isEnabled = true) => {
  // No-op function to prevent errors
  return
}

/**
 * Preload sounds for better performance
 */
export const preloadSounds = () => {
  // No-op function to prevent errors
  return
}

/**
 * Check if sounds are enabled
 * @returns Boolean indicating if sounds are enabled
 */
export const isSoundEnabled = () => {
  // Always return false since we're disabling sounds
  return soundsEnabled
}

/**
 * For backward compatibility
 */
export const areSoundsEnabled = isSoundEnabled

/**
 * Toggle sound enabled state
 * @param newState Optional new state, toggles current state if not provided
 * @returns New sound enabled state
 */
export const toggleSound = (newState?: boolean) => {
  if (typeof newState === "boolean") {
    soundsEnabled = newState
  } else {
    soundsEnabled = !soundsEnabled
  }
  return soundsEnabled
}

/**
 * For backward compatibility
 */
export const toggleSounds = toggleSound
