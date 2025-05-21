import { getServerSupabaseClient, getBrowserSupabaseClient } from "./supabase"

// Default landing content as fallback
const DEFAULT_LANDING_CONTENT = {
  hero: {
    title: "Welcome to K-Clash",
    subtitle: "Kenya's premier gaming platform for competitive battles and community",
  },
  stats: [
    { id: 1, label: "Active Players", value: "5,000+" },
    { id: 2, label: "Tournaments", value: "100+" },
    { id: 3, label: "Prize Pool", value: "$50K+" },
    { id: 4, label: "Games", value: "20+" },
  ],
}

/**
 * Gets landing content from the database (server-side)
 */
export async function getLandingContent() {
  try {
    const supabase = getServerSupabaseClient()
    if (!supabase) return DEFAULT_LANDING_CONTENT

    const { data, error } = await supabase.from("system_settings").select("value").eq("key", "landing_content").single()

    if (error || !data) {
      console.error("Error fetching landing content:", error)
      return DEFAULT_LANDING_CONTENT
    }

    return data.value as typeof DEFAULT_LANDING_CONTENT
  } catch (error) {
    console.error("Exception fetching landing content:", error)
    return DEFAULT_LANDING_CONTENT
  }
}

/**
 * Gets landing content from the database (client-side)
 */
export async function getLandingContentClient() {
  try {
    const supabase = getBrowserSupabaseClient()
    if (!supabase) return DEFAULT_LANDING_CONTENT

    const { data, error } = await supabase.from("system_settings").select("value").eq("key", "landing_content").single()

    if (error || !data) {
      console.error("Error fetching landing content:", error)
      return DEFAULT_LANDING_CONTENT
    }

    return data.value as typeof DEFAULT_LANDING_CONTENT
  } catch (error) {
    console.error("Exception fetching landing content:", error)
    return DEFAULT_LANDING_CONTENT
  }
}
