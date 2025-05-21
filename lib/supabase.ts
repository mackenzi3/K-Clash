import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Cache for Supabase clients
let browserSupabaseClient: ReturnType<typeof createClient> | null = null
let serverSupabaseClient: ReturnType<typeof createClient> | null = null

/**
 * Gets the Supabase URL and anon key from environment variables
 */
function getSupabaseCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  return { url, anonKey }
}

/**
 * Creates a Supabase client for the browser
 */
export function getBrowserSupabaseClient() {
  if (browserSupabaseClient) return browserSupabaseClient

  const { url, anonKey } = getSupabaseCredentials()

  if (!url || !anonKey) {
    console.error("Missing Supabase credentials")
    return null
  }

  browserSupabaseClient = createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return browserSupabaseClient
}

/**
 * Creates a Supabase client for the server
 */
export function getServerSupabaseClient() {
  if (serverSupabaseClient) return serverSupabaseClient

  const { url, anonKey } = getSupabaseCredentials()

  if (!url || !anonKey) {
    console.error("Missing Supabase credentials")
    return null
  }

  serverSupabaseClient = createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
    },
  })

  return serverSupabaseClient
}

/**
 * Tests the Supabase connection
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

    // Try a simple query
    const { error } = await supabase.from("profiles").select("count", { count: "exact", head: true })

    if (error) {
      if (error.message && error.message.includes("does not exist")) {
        return {
          success: false,
          error: "Table 'profiles' does not exist. You may need to run migrations.",
          isMissingTable: true,
        }
      }

      return {
        success: false,
        error: `Database query error: ${error.message}`,
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Handles Supabase errors
 */
export function handleSupabaseError(error: unknown, fallbackMessage = "An error occurred"): string {
  if (!error) return fallbackMessage

  if (typeof error === "object" && error !== null && "message" in error) {
    return error.message as string
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  return fallbackMessage
}
