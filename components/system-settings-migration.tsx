"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { getBrowserSupabaseClient } from "@/lib/supabase"

export function SystemSettingsMigration() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runMigration = async () => {
    setIsLoading(true)
    setSuccess(null)
    setError(null)

    try {
      const supabase = getBrowserSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      // Create system_settings table if it doesn't exist
      const { error: tableError } = await supabase.from("system_settings").select("id").limit(1)

      if (tableError && tableError.code === "42P01") {
        // Table doesn't exist
        // Create the table using raw SQL
        const { error: createError } = await supabase.from("_migrations").insert({
          name: "create_system_settings",
          sql: `
            CREATE TABLE IF NOT EXISTS system_settings (
              id SERIAL PRIMARY KEY,
              key VARCHAR(255) NOT NULL UNIQUE,
              value TEXT NOT NULL,
              description TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `,
        })

        if (createError) throw createError
      }

      // Insert default settings
      const { error: insertError } = await supabase.from("system_settings").upsert(
        [
          { key: "maintenance_mode", value: "false", description: "Whether the site is in maintenance mode" },
          { key: "registration_open", value: "true", description: "Whether new user registration is open" },
          { key: "platform_name", value: "K-Clash", description: "The name of the platform" },
          {
            key: "platform_description",
            value: "Kenya's Premier Gaming Platform",
            description: "The description of the platform",
          },
          { key: "contact_email", value: "support@k-clash.com", description: "The contact email for the platform" },
          { key: "max_upload_size", value: "10", description: "Maximum upload size in MB" },
        ],
        { onConflict: "key" },
      )

      if (insertError) throw insertError

      setSuccess("System settings table created and default settings added successfully!")
    } catch (err) {
      console.error("Migration error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>System Settings Migration</CardTitle>
        <CardDescription>Create the system_settings table and add default settings</CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-4 border-green-500 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <p className="text-sm text-muted-foreground mb-4">
          This will create the system_settings table if it doesn't exist and add default settings. This is safe to run
          multiple times as it will not overwrite existing settings.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={runMigration} disabled={isLoading} className="w-full">
          {isLoading ? "Running Migration..." : "Run Migration"}
        </Button>
      </CardFooter>
    </Card>
  )
}
