"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Loader2 } from "lucide-react"
import { testSupabaseConnection } from "@/lib/supabase"
import { checkSupabaseConfig, getEnvVariable } from "@/lib/env-check"

export function DatabaseConnectionTest() {
  const [isLoading, setIsLoading] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"loading" | "connected" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [configStatus, setConfigStatus] = useState<{ isValid: boolean; error?: string }>({ isValid: true })

  useEffect(() => {
    checkConnection()
  }, [isRetrying])

  const checkConnection = async () => {
    setIsLoading(true)
    setConnectionStatus("loading")
    setErrorMessage(null)

    // First check if environment variables are configured
    const config = checkSupabaseConfig()
    setConfigStatus(config)

    if (!config.isValid) {
      setConnectionStatus("error")
      setErrorMessage(config.error || "Invalid Supabase configuration")
      setIsLoading(false)
      return
    }

    try {
      // Test connection
      const result = await testSupabaseConnection()

      if (result.success) {
        setConnectionStatus("connected")
      } else {
        setConnectionStatus("error")
        setErrorMessage(result.error || "Unknown error connecting to Supabase")
      }
    } catch (err) {
      console.error("Error testing connection:", err)
      setConnectionStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setIsLoading(false)
      setIsRetrying(false)
    }
  }

  const retryConnection = () => {
    setIsRetrying(!isRetrying)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Supabase Connection Test</CardTitle>
        <CardDescription>Testing connection to your Supabase database</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
            <div className="flex items-center">
              <div className="mr-3">
                {connectionStatus === "loading" ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : connectionStatus === "connected" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div>
                <p className="font-medium">Supabase Connection</p>
                <p className="text-sm text-muted-foreground">
                  URL: {getEnvVariable("NEXT_PUBLIC_SUPABASE_URL") || "Not configured"}
                </p>
              </div>
            </div>
            <Badge
              variant={
                connectionStatus === "loading"
                  ? "outline"
                  : connectionStatus === "connected"
                    ? "default"
                    : "destructive"
              }
            >
              {connectionStatus === "loading"
                ? "Checking..."
                : connectionStatus === "connected"
                  ? "Connected"
                  : "Error"}
            </Badge>
          </div>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {connectionStatus === "connected" && (
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Connection Successful</AlertTitle>
              <AlertDescription>
                Successfully connected to your Supabase database. Your application is ready to use.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={retryConnection} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Test Connection
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
