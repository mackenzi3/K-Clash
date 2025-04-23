"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { getBrowserSupabaseClient } from "@/lib/supabase"

export function EnvVariablesCheck() {
  const [status, setStatus] = useState<{
    supabaseUrl: boolean
    supabaseAnonKey: boolean
    supabaseConnection: boolean
    loading: boolean
    error: string | null
  }>({
    supabaseUrl: false,
    supabaseAnonKey: false,
    supabaseConnection: false,
    loading: true,
    error: null,
  })

  useEffect(() => {
    async function checkConnection() {
      try {
        // Check if environment variables are available
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.undefined_NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey =
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          process.env.undefined_NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          process.env.SUPABASE_ANON_KEY ||
          process.env.undefined_SUPABASE_ANON_KEY ||
          process.env.anon_public

        // Update status for environment variables
        setStatus((prev) => ({
          ...prev,
          supabaseUrl: !!supabaseUrl,
          supabaseAnonKey: !!supabaseAnonKey,
        }))

        // Try to connect to Supabase
        const supabase = getBrowserSupabaseClient()
        if (supabase) {
          try {
            // Simple query to check connection - using try/catch instead of .catch()
            const { data, error } = await supabase.from("user_profiles").select("id").limit(1)

            if (error) {
              throw error
            }

            setStatus((prev) => ({
              ...prev,
              supabaseConnection: true,
              loading: false,
            }))
          } catch (queryError) {
            console.error("Supabase query error:", queryError)
            setStatus((prev) => ({
              ...prev,
              supabaseConnection: false,
              loading: false,
              error: queryError instanceof Error ? queryError.message : "Unknown query error occurred",
            }))
          }
        } else {
          throw new Error("Failed to initialize Supabase client")
        }
      } catch (error) {
        console.error("Supabase connection error:", error)
        setStatus((prev) => ({
          ...prev,
          supabaseConnection: false,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error occurred",
        }))
      }
    }

    checkConnection()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables Check</CardTitle>
      </CardHeader>
      <CardContent>
        {status.loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
            <span>Checking environment variables...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between p-2 rounded-md bg-secondary/20">
                <span>NEXT_PUBLIC_SUPABASE_URL</span>
                {status.supabaseUrl ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-md bg-secondary/20">
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY / anon_public</span>
                {status.supabaseAnonKey ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-md bg-secondary/20">
                <span>Supabase Connection</span>
                {status.supabaseConnection ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>

            {status.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{status.error}</AlertDescription>
              </Alert>
            )}

            {status.supabaseUrl && status.supabaseAnonKey && status.supabaseConnection && (
              <Alert className="bg-green-500/10 text-green-700 border-green-500/20">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>All environment variables are properly configured!</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
