"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSupabaseClientSync } from "@/lib/supabase-utils"
import { handleError } from "@/lib/error-utils"
import { useToast } from "@/hooks/use-toast"

interface AppContextType {
  isLoading: boolean
  isAuthenticated: boolean
  userId: string | null
  userRole: string | null
  isPremium: boolean
  maintenanceMode: boolean
  setMaintenanceMode: (value: boolean) => void
  refreshUserStatus: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const { toast } = useToast()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const supabase = getSupabaseClientSync()

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setIsAuthenticated(true)
          setUserId(user.id)

          // Get user profile for additional info
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, is_premium")
            .eq("user_id", user.id)
            .single()

          if (profile) {
            setUserRole(profile.role || "user")
            setIsPremium(profile.is_premium || false)
          }
        } else {
          setIsAuthenticated(false)
          setUserId(null)
          setUserRole(null)
          setIsPremium(false)
        }

        // Check system settings
        const { data: settings } = await supabase
          .from("system_settings")
          .select("value")
          .eq("key", "maintenance_mode")
          .single()

        setMaintenanceMode(settings?.value === "true")
      } catch (error) {
        handleError(error, "Failed to load user data", true)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Set up auth state change listener
    const supabase = getSupabaseClientSync()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setIsAuthenticated(true)
        setUserId(session.user.id)
        toast({
          title: "Signed in successfully",
          variant: "default",
        })
        await refreshUserStatus()
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false)
        setUserId(null)
        setUserRole(null)
        setIsPremium(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [toast])

  // Function to refresh user status
  const refreshUserStatus = async () => {
    try {
      if (!userId) return

      const supabase = getSupabaseClientSync()
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, is_premium")
        .eq("user_id", userId)
        .single()

      if (profile) {
        setUserRole(profile.role || "user")
        setIsPremium(profile.is_premium || false)
      }
    } catch (error) {
      handleError(error, "Failed to refresh user status", true)
    }
  }

  return (
    <AppContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        userId,
        userRole,
        isPremium,
        maintenanceMode,
        setMaintenanceMode,
        refreshUserStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
