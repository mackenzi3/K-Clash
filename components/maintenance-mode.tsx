import type React from "react"
import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useApp } from "@/contexts/app-context"

export function MaintenanceMode({ children }: { children: React.ReactNode }) {
  const { maintenanceMode, userRole } = useApp()

  // Allow admins to bypass maintenance mode
  if (maintenanceMode && userRole !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Maintenance Mode</AlertTitle>
            <AlertDescription>K-Clash is currently undergoing maintenance. We'll be back shortly!</AlertDescription>
          </Alert>
          <div className="text-center text-sm text-muted-foreground">
            <p>We're working to improve your gaming experience.</p>
            <p>Thank you for your patience.</p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
