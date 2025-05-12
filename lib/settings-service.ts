import { getBrowserSupabaseClient } from "./supabase"

export type GeneralSettings = {
  maintenance_mode: boolean
  registration_enabled: boolean
  platform_name: string
}

export type ModerationSettings = {
  auto_moderation: boolean
  content_approval: boolean
  filtered_words: string[]
}

export type PremiumSettings = {
  enabled: boolean
  price: number
  billing_cycle: "monthly" | "quarterly" | "yearly"
}

export type PlatformSettings = {
  general: GeneralSettings
  moderation: ModerationSettings
  premium: PremiumSettings
}

export async function getSettings(key: keyof PlatformSettings): Promise<any> {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  const { data, error } = await supabase.from("platform_settings").select("value").eq("key", key).single()

  if (error) {
    console.error(`Error fetching ${key} settings:`, error)
    return { data: null, error: error.message }
  }

  return { data: data.value, error: null }
}

export async function getAllSettings(): Promise<{ data: PlatformSettings | null; error: string | null }> {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { data: null, error: "Supabase client not initialized" }

  const { data, error } = await supabase.from("platform_settings").select("key, value")

  if (error) {
    console.error("Error fetching all settings:", error)
    return { data: null, error: error.message }
  }

  if (!data || data.length === 0) {
    return { data: null, error: "No settings found" }
  }

  const settings: Partial<PlatformSettings> = {}
  data.forEach((item) => {
    settings[item.key as keyof PlatformSettings] = item.value
  })

  return {
    data: {
      general: settings.general as GeneralSettings,
      moderation: settings.moderation as ModerationSettings,
      premium: settings.premium as PremiumSettings,
    },
    error: null,
  }
}

export async function updateSettings(
  key: keyof PlatformSettings,
  value: GeneralSettings | ModerationSettings | PremiumSettings,
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { success: false, error: "Supabase client not initialized" }

  const { error } = await supabase.from("platform_settings").update({ value }).eq("key", key)

  if (error) {
    console.error(`Error updating ${key} settings:`, error)
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}
