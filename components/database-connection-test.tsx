"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Database } from "lucide-react"
import { getSupabaseClientSync } from "@/lib/supabase-utils"

export function DatabaseConnectionTest() {
  const [isLoading, setIsLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<{
    success: boolean
    error?: string
    isMissingTable?: boolean
  } | null>(null)

  const testConnection = async () => {
    setIsLoading(true)
    setConnectionStatus(null)

    try {
      const supabase = getSupabaseClientSync()

      if (!supabase) {
        setConnectionStatus({
          success: false,
          error: "Failed to initialize Supabase client. Check your environment variables.",
        })
        return
      }

      // Try a simple query to test the connection
      const { error } = await supabase.from("profiles").select("count", { count: "exact", head: true })

      if (error) {
        // Check if the error is about missing table
        if (error.message && error.message.includes("does not exist")) {
          setConnectionStatus({
            success: false,
            error: "Table 'profiles' does not exist. You may need to run migrations.",
            isMissingTable: true,
          })
          return
        }

        setConnectionStatus({
          success: false,
          error: `Database query error: ${error.message}`,
        })
        return
      }

      setConnectionStatus({
        success: true,
      })
    } catch (error) {
      setConnectionStatus({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Database Connection</CardTitle>
        <CardDescription>Test your connection to the Supabase database</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : connectionStatus ? (
          <Alert
            variant={connectionStatus.success ? "default" : "destructive"}
            className={
              connectionStatus.success ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900" : ""
            }
          >
            {connectionStatus.success ? (
              <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{connectionStatus.success ? "Connected" : "Connection Failed"}</AlertTitle>
            <AlertDescription>
              {connectionStatus.success ? "Successfully connected to the Supabase database." : connectionStatus.error}
            </AlertDescription>
          </Alert>
        ) : null}

        {connectionStatus?.isMissingTable && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/20 dark:border-yellow-900">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Database tables not found</h3>
            <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              It looks like your database is connected, but the required tables are missing. You need to run the
              database setup to create the necessary tables.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={testConnection} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⟳</span> Testing Connection...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" /> Test Connection Again
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
