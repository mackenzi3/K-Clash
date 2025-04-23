"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"

export function EnvCheck() {
  const [envStatus, setEnvStatus] = useState<{
    supabaseUrl: boolean
    supabaseKey: boolean
  }>({
    supabaseUrl: false,
    supabaseKey: false,
  })

  useEffect(() => {
    // Check if environment variables are available
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setEnvStatus({
      supabaseUrl: !!url,
      supabaseKey: !!key,
    })
  }, [])

  const allEnvsAvailable = envStatus.supabaseUrl && envStatus.supabaseKey

  if (allEnvsAvailable) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Environment Variables Loaded</AlertTitle>
        <AlertDescription className="text-green-700">
          All required environment variables are available.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Missing Environment Variables</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-5 mt-2">
          {!envStatus.supabaseUrl && <li>NEXT_PUBLIC_SUPABASE_URL is missing</li>}
          {!envStatus.supabaseKey && <li>NEXT_PUBLIC_SUPABASE_ANON_KEY is missing</li>}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
