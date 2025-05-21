/**
 * Utility functions for working with Supabase
 */
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { getBrowserSupabaseClient, getServerSupabaseClient } from "./supabase"

// Cache for Supabase clients
let supabaseClientSync: ReturnType<typeof createClient> | null = null

/**
 * Gets or creates a Supabase client synchronously
 * This is a compatibility function for code that expects the old API
 */
export function getSupabaseClientSync() {
  if (supabaseClientSync) return supabaseClientSync

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    if (!url || !anonKey) {
      console.error("Missing Supabase credentials")
      return null
    }

    supabaseClientSync = createClient<Database>(url, anonKey, {
      auth: {
        persistSession: typeof window !== "undefined",
        autoRefreshToken: typeof window !== "undefined",
      },
    })

    return supabaseClientSync
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return null
  }
}

/**
 * Tests the Supabase connection by performing a simple query
 * This is a required export
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
    const { error } = await supabase.from("profiles").select("count", { count: "exact", head: true })

    if (error) {
      // Check if the error is about missing table
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
 * This is a required export
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

/**
 * Checks if a table exists in the database
 */
export async function checkTableExists(tableName: string, isServer = false): Promise<boolean> {
  try {
    const supabase = isServer ? getServerSupabaseClient() : getBrowserSupabaseClient()
    if (!supabase) return false

    const { error } = await supabase.from(tableName).select("*", { count: "exact", head: true })

    // If the error contains "does not exist", the table doesn't exist
    if (error && error.message.includes("does not exist")) {
      return false
    }

    // If there's another error, we can't determine if the table exists
    if (error) {
      console.error(`Error checking if table ${tableName} exists:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Exception checking if table ${tableName} exists:`, error)
    return false
  }
}

/**
 * Executes a SQL query
 */
export async function executeSql(sql: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getServerSupabaseClient()
    if (!supabase) {
      return { success: false, error: "Supabase client not initialized" }
    }

    const { error } = await supabase.rpc("execute_sql", { sql_query: sql })

    if (error) {
      return { success: false, error: error.message }
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
 * Formats a Supabase error message for display
 */
export function formatSupabaseError(error: unknown): string {
  if (!error) return "Unknown error"

  if (typeof error === "object" && error !== null) {
    if ("message" in error) return error.message as string
    if ("error" in error) return error.error as string
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  return "An unexpected error occurred"
}

/**
 * Checks if the current user has admin privileges
 */
export async function checkIsAdmin(): Promise<boolean> {
  try {
    const supabase = getBrowserSupabaseClient()
    if (!supabase) return false

    const { data: user } = await supabase.auth.getUser()
    if (!user || !user.user) return false

    // Check if user has admin role in profiles table
    const { data, error } = await supabase.from("profiles").select("role").eq("id", user.user.id).single()

    if (error || !data) return false

    return data.role === "admin"
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}
