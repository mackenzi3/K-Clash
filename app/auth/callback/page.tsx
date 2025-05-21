"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getBrowserSupabaseClient } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = getBrowserSupabaseClient()

        if (!supabase) {
          throw new Error("Supabase client not initialized")
        }

        // Get the auth code from the URL
        const code = new URL(window.location.href).searchParams.get("code")

        if (!code) {
          throw new Error("No code found in URL")
        }

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          throw error
        }

        // Check if the user has a profile
        const { data: user } = await supabase.auth.getUser()

        if (!user || !user.user) {
          throw new Error("Failed to get user")
        }

        // Check if the user has a profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.user.id)
          .single()

        if (profileError && !profileError.message.includes("No rows found")) {
          throw profileError
        }

        // If the user doesn't have a profile, create one
        if (!profile) {
          // Extract username from email
          const email = user.user.email || ""
          const username = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") + Math.floor(Math.random() * 1000)

          const { error: insertError } = await supabase.from("profiles").insert({
            user_id: user.user.id,
            username,
            email: user.user.email,
            avatar_url: user.user.user_metadata.avatar_url,
            full_name: user.user.user_metadata.full_name,
          })

          if (insertError) {
            throw insertError
          }
        }

        // Redirect to the dashboard
        router.push("/")
      } catch (err) {
        console.error("Auth callback error:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">
          {error ? "Authentication Error" : "Completing Authentication..."}
        </h1>

        {error ? (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            <p>{error}</p>
            <button
              className="mt-4 w-full py-2 px-4 bg-primary text-primary-foreground rounded-md"
              onClick={() => router.push("/sign-in")}
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <svg
              className="animate-spin h-8 w-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
