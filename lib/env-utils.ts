/**
 * Gets an environment variable with a fallback
 */
export function getEnvVariable(name: string, fallback = ""): string {
  const value = process.env[name]
  return value || fallback
}

/**
 * Checks if the Supabase environment variables are correctly configured
 */
export function checkSupabaseConfig(): { isValid: boolean; error?: string } {
  const url = getEnvVariable("NEXT_PUBLIC_SUPABASE_URL")
  const key = getEnvVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY")

  if (!url) {
    return { isValid: false, error: "Missing NEXT_PUBLIC_SUPABASE_URL environment variable" }
  }

  if (!key) {
    return { isValid: false, error: "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable" }
  }

  return { isValid: true }
}
