import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Cache for Supabase clients
let browserSupabaseClient: ReturnType<typeof createClient> | null = null
let serverSupabaseClient: ReturnType<typeof createClient> | null = null

/**
 * Gets environment variables with fallbacks
 */
function getSupabaseCredentials() {
  // Try different environment variable formats
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ""

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ""

  return { url, anonKey }
}

/**
 * Gets or creates a Supabase client
 */
export function getSupabaseClientSync() {
  try {
    const isServer = typeof window === "undefined"

    // Return cached client if available
    if (!isServer && browserSupabaseClient) return browserSupabaseClient
    if (isServer && serverSupabaseClient) return serverSupabaseClient

    const { url, anonKey } = getSupabaseCredentials()

    if (!url || !anonKey) {
      throw new Error("Missing Supabase credentials")
    }

    const client = createClient<Database>(url, anonKey, {
      auth: {
        persistSession: !isServer,
        autoRefreshToken: !isServer,
      },
    })

    // Cache the client
    if (isServer) {
      serverSupabaseClient = client
    } else {
      browserSupabaseClient = client
    }

    return client
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    return createFallbackClient()
  }
}

/**
 * Creates a fallback client that logs errors instead of crashing
 */
function createFallbackClient() {
  const { url, anonKey } = getSupabaseCredentials()
  const client = createClient<Database>(url || "", anonKey || "")

  // Wrap all methods to catch errors
  const handler = {
    get(target: any, prop: string) {
      const value = target[prop]

      if (typeof value === "function") {
        return (...args: any[]) => {
          try {
            const result = value.apply(target, args)

            // If result is a promise, catch any errors
            if (result && typeof result.then === "function") {
              return result.catch((error: any) => {
                console.error(`Supabase operation failed: ${prop}`, error)
                return { data: null, error }
              })
            }

            return result
          } catch (error) {
            console.error(`Supabase operation failed: ${prop}`, error)
            return { data: null, error }
          }
        }
      }

      // If it's an object, recursively wrap it
      if (typeof value === "object" && value !== null) {
        return new Proxy(value, handler)
      }

      return value
    },
  }

  return new Proxy(client, handler)
}

// For backwards compatibility
export const createServerSupabaseClient = () => getSupabaseClientSync()
export const createBrowserSupabaseClient = () => getSupabaseClientSync()
export const getBrowserSupabaseClient = () => getSupabaseClientSync()
export const getServerSupabaseClient = () => getSupabaseClientSync()

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
