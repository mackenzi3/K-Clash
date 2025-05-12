"use client"

import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DevModeWarning() {
  // Only show in development mode
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <Alert variant="warning" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Development Mode</AlertTitle>
      <AlertDescription>
        You are running in development mode. CORS issues may prevent Supabase connections from working correctly.
        Consider testing in production mode or adding localhost to your Supabase CORS allowed origins.
      </AlertDescription>
    </Alert>
  )
}
