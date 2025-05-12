import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { handleError, withRetry } from "@/lib/error-utils"

// Cache for Supabase clients
let browserSupabaseClient: ReturnType<typeof createClient> | null = null
let serverSupabaseClient: ReturnType<typeof createClient> | null = null

/**
 * Gets environment variables with fallbacks
 */
function getSupabaseCredentials() {
  // Try different environment variable formats
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://sszdmzmzjpjtlqkxznbj.supabase.co"

  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzemRtem16anBqdGxxa3h6bmJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzQ3MTYsImV4cCI6MjA1ODA1MDcxNn0.A3LSS8Iw4YChSzI1Xg-WZWuOcynL2jgtzLJQnB3aod0"

  return { url, anonKey }
}

/**
 * Gets or creates a Supabase client with retry mechanism
 */
export async function getSupabaseClient(isServer = false) {
  try {
    if (typeof window === "undefined" && !isServer) {
      console.warn("getSupabaseClient called in server context without isServer=true")
      isServer = true
    }

    // Return cached client if available
    if (!isServer && browserSupabaseClient) return browserSupabaseClient
    if (isServer && serverSupabaseClient) return serverSupabaseClient

    const { url, anonKey } = getSupabaseCredentials()

    if (!url || !anonKey) {
      throw new Error("Missing Supabase credentials")
    }

    // Create client with retry mechanism for network issues
    const client = await withRetry(() =>
      createClient<Database>(url, anonKey, {
        auth: {
          persistSession: !isServer,
          autoRefreshToken: !isServer,
        },
      }),
    )

    // Cache the client
    if (isServer) {
      serverSupabaseClient = client
    } else {
      browserSupabaseClient = client
    }

    return client
  } catch (error) {
    handleError(error, "Failed to initialize Supabase client")

    // Return a minimal client that won't crash the app but will log errors
    return createFallbackClient()
  }
}

/**
 * Creates a fallback client that logs errors instead of crashing
 */
function createFallbackClient() {
  const { url, anonKey } = getSupabaseCredentials()
  const client = createClient<Database>(url, anonKey)

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
                handleError(error, `Supabase operation failed: ${prop}`)
                return { data: null, error }
              })
            }

            return result
          } catch (error) {
            handleError(error, `Supabase operation failed: ${prop}`)
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

/**
 * Simplified function to get a Supabase client (synchronous version)
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
    handleError(error, "Failed to initialize Supabase client")
    return createFallbackClient()
  }
}

// For backwards compatibility
export const createServerSupabaseClient = () => getSupabaseClientSync()
export const createBrowserSupabaseClient = () => getSupabaseClientSync()
