import { getBrowserSupabaseClient, getServerSupabaseClient } from "./supabase"

/**
 * Tests the Supabase connection by performing a simple query
 * @param isServer Whether to use the server client
 * @returns Object containing success status and error message if any
 */
export async function testSupabaseConnection(isServer = false) {
  try {
    const supabase = isServer ? getServerSupabaseClient() : getBrowserSupabaseClient()

    if (!supabase) {
      return {
        success: false,
        error: "Supabase client not initialized. Check your environment variables.",
      }
    }

    // Try a simple query to test the connection
    const { error } = await supabase.from("user_profiles").select("count", { count: "exact", head: true })

    if (error) {
      // Check if the error is about missing table
      if (error.message && error.message.includes("does not exist")) {
        return {
          success: false,
          error: "Table 'user_profiles' does not exist. You may need to run migrations.",
          isMissingTable: true,
        }
      }

      return {
        success: false,
        error: `Database query error: ${error.message}`,
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Handles Supabase errors in a consistent way
 * @param error The error object from Supabase
 * @param fallbackMessage A fallback message if the error is not a Supabase error
 * @returns A user-friendly error message
 */
export function handleSupabaseError(error: unknown, fallbackMessage = "An error occurred"): string {
  if (!error) return fallbackMessage

  // Handle Supabase error object
  if (typeof error === "object" && error !== null && "message" in error) {
    return error.message as string
  }

  // Handle Error instance
  if (error instanceof Error) {
    return error.message
  }

  // Handle string error
  if (typeof error === "string") {
    return error
  }

  return fallbackMessage
}
