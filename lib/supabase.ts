import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Cache for Supabase clients
let browserSupabaseClient: ReturnType<typeof createClient> | null = null
let serverSupabaseClient: ReturnType<typeof createClient> | null = null

// Storage bucket constants
export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  VIDEOS: "videos",
  POSTS: "posts",
}

/**
 * Creates a Supabase client for the browser
 */
export function getBrowserSupabaseClient() {
  if (browserSupabaseClient) return browserSupabaseClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

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

// For backwards compatibility
export const createBrowserSupabaseClient = getBrowserSupabaseClient
export const createServerSupabaseClient = getServerSupabaseClient

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
 * Gets the public URL for a file in Supabase storage
 */
export function getStorageUrl(bucket: string, path: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  return `${url}/storage/v1/object/public/${bucket}/${path}`
}

/**
 * Uploads a file to Supabase storage
 */
export async function uploadToStorage(
  bucket: string,
  path: string,
  file: File,
  options?: { contentType?: string; upsert?: boolean },
) {
  const supabase = getBrowserSupabaseClient()
  if (!supabase) return { error: { message: "Supabase client not initialized" } }

  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      contentType: options?.contentType,
      upsert: options?.upsert ?? false,
    })

    if (error) {
      console.error(`Error uploading to ${bucket}/${path}:`, error)
      return { error }
    }

    return { data, url: getStorageUrl(bucket, path) }
  } catch (error) {
    console.error(`Exception uploading to ${bucket}/${path}:`, error)
    return { error: { message: error instanceof Error ? error.message : "Unknown error" } }
  }
}
