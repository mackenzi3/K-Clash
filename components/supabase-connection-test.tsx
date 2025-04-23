"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { testSupabaseConnection } from "@/lib/supabase-utils"

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<{
    loading: boolean
    success: boolean | null
    error: string | null
    isMissingTable: boolean
  }>({
    loading: true,
    success: null,
    error: null,
    isMissingTable: false,
  })

  const checkConnection = async () => {
    setStatus((prev) => ({ ...prev, loading: true }))

    const result = await testSupabaseConnection()

    setStatus({
      loading: false,
      success: result.success,
      error: result.error || null,
      isMissingTable: result.isMissingTable || false,
    })
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Supabase Connection Test
          {status.loading && <RefreshCw className="h-4 w-4 animate-spin" />}
        </CardTitle>
        <CardDescription>Testing connection to your Supabase database</CardDescription>
      </CardHeader>
      <CardContent>
        {status.loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
            <span>Testing connection...</span>
          </div>
        ) : (
          <>
            {status.success === true && (
              <Alert className="bg-green-500/10 text-green-700 border-green-500/20">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Connection Successful</AlertTitle>
                <AlertDescription>Your application is successfully connected to Supabase.</AlertDescription>
              </Alert>
            )}

            {status.success === false && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Failed</AlertTitle>
                <AlertDescription>
                  {status.error}
                  {status.isMissingTable && (
                    <div className="mt-2">
                      <p>This usually happens when your database schema hasn't been set up yet.</p>
                      <p className="mt-1">You may need to run the database migrations.</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkConnection} disabled={status.loading} variant="outline" className="ml-auto">
          <RefreshCw className={`h-4 w-4 mr-2 ${status.loading ? "animate-spin" : ""}`} />
          Test Again
        </Button>
      </CardFooter>
    </Card>
  )
}
