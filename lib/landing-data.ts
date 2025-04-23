import { getBrowserSupabaseClient, getServerSupabaseClient } from "./supabase"

export type LandingContent = {
  id: string
  section_name: string
  title: string | null
  subtitle: string | null
  content: string | null
  order_index: number
}

export type Feature = {
  id: string
  title: string
  description: string
  icon_name: string
  order_index: number
}

export type Stat = {
  id: string
  label: string
  value: string
  order_index: number
}

const fallbackHero = {
  id: "fallback-hero",
  section_name: "hero",
  title: "DOMINATE THE BATTLEFIELD",
  subtitle: "Kenya's premier gaming platform for competitive 1v1 battles, clan wars, and gaming community",
  content: null,
  order_index: 1,
}

const fallbackFeatures = [
  {
    id: "fallback-1",
    title: "1v1 Arena",
    description: "Challenge players to 1v1 battles with real money stakes and climb the leaderboards",
    icon_name: "Trophy",
    order_index: 1,
  },
  {
    id: "fallback-2",
    title: "Clan Wars",
    description: "Form or join clans, participate in clan wars, and earn clan points and rewards",
    icon_name: "Users",
    order_index: 2,
  },
  {
    id: "fallback-3",
    title: "Chill Hub",
    description: "Hang out in the global chat while listening to music from Spotify playlists",
    icon_name: "MessageSquare",
    order_index: 3,
  },
  {
    id: "fallback-4",
    title: "Clips",
    description: "Share your best gaming moments as short clips for the community to enjoy",
    icon_name: "Video",
    order_index: 4,
  },
]

const fallbackStats = [
  {
    id: "fallback-stat-1",
    label: "Active Gamers",
    value: "10K+",
    order_index: 1,
  },
  {
    id: "fallback-stat-2",
    label: "Daily Matches",
    value: "500+",
    order_index: 2,
  },
  {
    id: "fallback-stat-3",
    label: "Active Clans",
    value: "200+",
    order_index: 3,
  },
  {
    id: "fallback-stat-4",
    label: "Prize Money",
    value: "KSh 1M+",
    order_index: 4,
  },
]

// Server-side function to get landing content
export async function getLandingContent() {
  try {
    // Use the appropriate Supabase client based on the execution context
    const supabase = typeof window === "undefined" ? getServerSupabaseClient() : getBrowserSupabaseClient()

    const { data: landingContent, error: landingError } = await supabase
      .from("landing_content")
      .select("*")
      .order("order_index")

    const { data: features, error: featuresError } = await supabase.from("features").select("*").order("order_index")

    const { data: stats, error: statsError } = await supabase.from("stats").select("*").order("order_index")

    // If we have data and no errors, use it
    if (landingContent && features && stats && !landingError && !featuresError && !statsError) {
      return {
        hero: landingContent.find((item) => item.section_name === "hero") || fallbackHero,
        features: features || fallbackFeatures,
        stats: stats || fallbackStats,
      }
    }
  } catch (error) {
    console.error("Error fetching landing data:", error)
  }

  // Return fallback data if anything fails
  return {
    hero: fallbackHero,
    features: fallbackFeatures,
    stats: fallbackStats,
  }
}

// Client-side function to get landing content
export async function getLandingContentClient() {
  try {
    const supabase = getBrowserSupabaseClient()

    const { data: landingContent, error: landingError } = await supabase
      .from("landing_content")
      .select("*")
      .order("order_index")

    const { data: features, error: featuresError } = await supabase.from("features").select("*").order("order_index")

    const { data: stats, error: statsError } = await supabase.from("stats").select("*").order("order_index")

    // If we have data and no errors, use it
    if (landingContent && features && stats && !landingError && !featuresError && !statsError) {
      return {
        hero: landingContent.find((item) => item.section_name === "hero") || fallbackHero,
        features: features || fallbackFeatures,
        stats: stats || fallbackStats,
      }
    }
  } catch (error) {
    console.error("Error fetching landing data client-side:", error)
  }

  // Return fallback data if anything fails
  return {
    hero: fallbackHero,
    features: fallbackFeatures,
    stats: fallbackStats,
  }
}
