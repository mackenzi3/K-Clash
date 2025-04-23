import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { getEnvVariable } from "./env-utils"

// Initialize the Supabase client with environment variables
const supabaseUrl = getEnvVariable("NEXT_PUBLIC_SUPABASE_URL") || ""
const supabaseAnonKey = getEnvVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY") || ""

// Validate environment variables
if (!supabaseUrl) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

// Create a singleton instance for the browser
let browserSupabase: ReturnType<typeof createClient> | null = null

/**
 * Gets or creates a Supabase client for browser environments
 */
export function getBrowserSupabaseClient() {
  if (typeof window === "undefined") {
    console.warn("getBrowserSupabaseClient called in a server context")
    return null
  }

  if (!browserSupabase && supabaseUrl && supabaseAnonKey) {
    browserSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }

  return browserSupabase
}

/**
 * Creates a new Supabase client for server environments
 */
export function getServerSupabaseClient() {
  if (typeof window !== "undefined") {
    console.warn("getServerSupabaseClient called in a browser context")
    return getBrowserSupabaseClient()
  }

  if (supabaseUrl && supabaseAnonKey) {
    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  }

  console.error("Failed to create Supabase client: Missing environment variables")
  return null
}

// For backwards compatibility
export const createBrowserSupabaseClient = getBrowserSupabaseClient
export const createServerSupabaseClient = getServerSupabaseClient

// Storage bucket helpers
export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  VIDEOS: "videos",
  POSTS: "posts",
}

/**
 * Gets the public URL for a file in Supabase storage
 */
export function getStorageUrl(bucket: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
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
