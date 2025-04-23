import { createServerSupabaseClient } from "@/lib/supabase"

export async function getCurrentUser() {
  const supabase = createServerSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export async function getUserProfile(userId: string) {
  const supabase = createServerSupabaseClient()

  try {
    // First check if profile exists
    const { data: profile, error } = await supabase.from("user_profiles").select("*").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") {
      throw error
    }

    return profile
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

export async function createUserProfile(userId: string, email: string, username?: string) {
  const supabase = createServerSupabaseClient()

  // Generate a username if not provided
  const generatedUsername = username || `user${Math.floor(Math.random() * 10000)}`

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        user_id: userId,
        username: generatedUsername,
        email: email,
        display_name: generatedUsername,
      })
      .select()
      .single()

    if (error) throw error

    // Create default settings for the user
    await Promise.all([
      supabase.from("user_notification_settings").insert({ user_id: data.id }),
      supabase.from("user_privacy_settings").insert({ user_id: data.id }),
      supabase.from("user_appearance_settings").insert({ user_id: data.id }),
      supabase.from("user_stats").insert({ user_id: data.id }),
    ])

    return data
  } catch (error) {
    console.error("Error creating user profile:", error)
    return null
  }
}

export async function getOrCreateUserProfile() {
  const user = await getCurrentUser()

  if (!user) return null

  // Try to get existing profile
  let profile = await getUserProfile(user.id)

  // If no profile exists, create one
  if (!profile) {
    profile = await createUserProfile(user.id, user.email || "")
  }

  return profile
}
