import { getSupabaseClientSync } from "@/lib/supabase-utils"
import { handleError } from "@/lib/error-utils"

export interface SignUpData {
  email: string
  password: string
  username: string
  fullName?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface UserProfile {
  id: string
  username: string
  email: string
  fullName?: string
  avatarUrl?: string
  role: string
  isPremium: boolean
  createdAt: string
}

/**
 * Sign up a new user
 */
export async function signUp(data: SignUpData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClientSync()

    // Check if username is already taken
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", data.username)
      .single()

    if (existingUser) {
      return { success: false, error: "Username is already taken" }
    }

    // Create the user in Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (authError) throw authError
    if (!authData.user) {
      return { success: false, error: "Failed to create user" }
    }

    // Create the user profile
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: authData.user.id,
      username: data.username,
      full_name: data.fullName || "",
      email: data.email,
      role: "user",
      is_premium: false,
    })

    if (profileError) throw profileError

    return { success: true }
  } catch (error) {
    const errorMessage = handleError(error, "Failed to sign up")
    return { success: false, error: errorMessage }
  }
}

/**
 * Sign in a user
 */
export async function signIn(data: SignInData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClientSync()

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    const errorMessage = handleError(error, "Failed to sign in")
    return { success: false, error: errorMessage }
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClientSync()
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    return { success: true }
  } catch (error) {
    const errorMessage = handleError(error, "Failed to sign out")
    return { success: false, error: errorMessage }
  }
}

/**
 * Get the current user's profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = getSupabaseClientSync()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Get user profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

    if (!profile) return null

    return {
      id: user.id,
      username: profile.username,
      email: profile.email,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      role: profile.role || "user",
      isPremium: profile.is_premium || false,
      createdAt: user.created_at,
    }
  } catch (error) {
    handleError(error, "Failed to get user profile", true)
    return null
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClientSync()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    const errorMessage = handleError(error, "Failed to send password reset email")
    return { success: false, error: errorMessage }
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<UserProfile>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClientSync()

    const { error } = await supabase
      .from("profiles")
      .update({
        username: data.username,
        full_name: data.fullName,
        avatar_url: data.avatarUrl,
      })
      .eq("user_id", userId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    const errorMessage = handleError(error, "Failed to update profile")
    return { success: false, error: errorMessage }
  }
}
