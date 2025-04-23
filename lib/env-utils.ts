/**
 * Gets an environment variable with fallbacks for different naming formats
 * This helps handle cases where environment variables might have different prefixes
 */
export function getEnvVariable(name: string): string | undefined {
  // Try standard format
  let value = process.env[name]

  // Try with undefined_ prefix
  if (!value) {
    value = process.env[`undefined_${name}`]
  }

  // For Supabase anon key, try additional formats
  if (!value && (name === "NEXT_PUBLIC_SUPABASE_ANON_KEY" || name === "SUPABASE_ANON_KEY")) {
    value =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.undefined_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.undefined_SUPABASE_ANON_KEY ||
      process.env.anon_public
  }

  return value
}

/**
 * Gets a required environment variable, throws an error if not found
 */
export function getRequiredEnvVariable(name: string): string {
  const value = getEnvVariable(name)
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`)
  }
  return value
}

/**
 * Checks if all required environment variables are set
 * Returns an object with the status of each variable
 */
export function checkRequiredEnvVariables(names: string[]): Record<string, boolean> {
  const result: Record<string, boolean> = {}

  for (const name of names) {
    result[name] = !!getEnvVariable(name)
  }

  return result
}
