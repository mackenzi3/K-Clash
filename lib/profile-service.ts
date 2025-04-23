import { getBrowserSupabaseClient } from "@/lib/supabase"
import { createServerSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"]
export type UserAchievement = Database["public"]["Tables"]["user_achievements"]["Row"]
export type UserStat = Database["public"]["Tables"]["user_stats"]["Row"]
export type UserMatch = Database["public"]["Tables"]["user_matches"]["Row"]
export type UserClip = Database["public"]["Tables"]["user_clips"]["Row"]

// Server-side profile service
export const ServerProfileService = {
  async getProfileByAuthId(authId: string): Promise<UserProfile | null> {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("user_profiles").select("*").eq("auth_id", authId).single()

    if (error) {
      console.error("Error fetching profile by auth ID:", error)
      return null
    }

    return data
  },

  async getProfileByUsername(username: string): Promise<UserProfile | null> {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("user_profiles").select("*").eq("username", username).single()

    if (error) {
      console.error("Error fetching profile by username:", error)
      return null
    }

    return data
  },

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("user_achievements").select("*").eq("user_id", userId)

    if (error) {
      console.error("Error fetching user achievements:", error)
      return []
    }

    return data || []
  },

  async getUserStats(userId: string): Promise<UserStat | null> {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("user_stats").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Error fetching user stats:", error)
      return null
    }

    return data
  },

  async getUserMatches(userId: string, limit = 10): Promise<UserMatch[]> {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("user_matches").select("*").eq("user_id", userId).limit(limit)

    if (error) {
      console.error("Error fetching user matches:", error)
      return []
    }

    return data || []
  },

  async getUserClips(userId: string, limit = 10): Promise<UserClip[]> {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.from("user_clips").select("*").eq("user_id", userId).limit(limit)

    if (error) {
      console.error("Error fetching user clips:", error)
      return []
    }

    return data || []
  },
}

// Client-side profile service
export const ClientProfileService = {
  async getCurrentProfile(): Promise<UserProfile | null> {
    const supabase = getBrowserSupabaseClient()
    if (!supabase) return null

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase.from("user_profiles").select("*").eq("auth_id", user.id).single()

    if (error) {
      console.error("Error fetching current profile:", error)
      return null
    }

    return data
  },

  async getProfileByUsername(username: string): Promise<UserProfile | null> {
    const supabase = getBrowserSupabaseClient()
    if (!supabase) return null

    const { data, error } = await supabase.from("user_profiles").select("*").eq("username", username).single()

    if (error) {
      console.error("Error fetching profile by username:", error)
      return null
    }

    return data
  },

  async updateProfile(profileId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const supabase = getBrowserSupabaseClient()
    if (!supabase) return null

    const { data, error } = await supabase.from("user_profiles").update(updates).eq("id", profileId).select().single()

    if (error) {
      console.error("Error updating profile:", error)
      return null
    }

    return data
  },

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const supabase = getBrowserSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase.from("user_achievements").select("*").eq("user_id", userId)

    if (error) {
      console.error("Error fetching user achievements:", error)
      return []
    }

    return data || []
  },

  async getUserStats(userId: string): Promise<UserStat | null> {
    const supabase = getBrowserSupabaseClient()
    if (!supabase) return null

    const { data, error } = await supabase.from("user_stats").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Error fetching user stats:", error)
      return null
    }

    return data
  },

  async getUserMatches(userId: string, limit = 10): Promise<UserMatch[]> {
    const supabase = getBrowserSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase.from("user_matches").select("*").eq("user_id", userId).limit(limit)

    if (error) {
      console.error("Error fetching user matches:", error)
      return []
    }

    return data || []
  },

  async getUserClips(userId: string, limit = 10): Promise<UserClip[]> {
    const supabase = getBrowserSupabaseClient()
    if (!supabase) return []

    const { data, error } = await supabase.from("user_clips").select("*").eq("user_id", userId).limit(limit)

    if (error) {
      console.error("Error fetching user clips:", error)
      return []
    }

    return data || []
  },
}

export const ProfileService = ClientProfileService
