import { toast } from "@/hooks/use-toast"

/**
 * Standardized error handling utility
 * @param error The error object
 * @param customMessage Optional custom message to display
 * @param silent If true, won't show a toast notification
 */
export function handleError(error: unknown, customMessage?: string, silent = false) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.error(customMessage || "An error occurred:", error)

  if (!silent) {
    toast({
      title: customMessage || "An error occurred",
      description: errorMessage,
      variant: "destructive",
    })
  }

  return errorMessage
}

/**
 * Wraps an async function with standardized error handling
 * @param fn The async function to wrap
 * @param errorMessage Custom error message
 */
export function withErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  errorMessage?: string,
): (...args: Args) => Promise<T | null> {
  return async (...args: Args) => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error, errorMessage)
      return null
    }
  }
}

/**
 * Creates a retry mechanism for async functions
 * @param fn The function to retry
 * @param retries Number of retries
 * @param delay Delay between retries in ms
 */
export async function withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) throw error
    await new Promise((resolve) => setTimeout(resolve, delay))
    return withRetry(fn, retries - 1, delay)
  }
}
