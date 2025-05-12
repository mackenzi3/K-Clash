"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart3,
  Users,
  Trophy,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Settings,
  Home,
  FileText,
  Database,
  Shield,
  UserPlus,
  LogOut,
} from "lucide-react"
import { getBrowserSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { getEnvVariable } from "@/lib/env-utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Define types for our data
type User = {
  id: string
  username?: string
  display_name?: string
  email?: string
  avatar_url?: string
  created_at: string
  is_admin?: boolean
  is_premium?: boolean
}

type Tournament = {
  id: string
  name: string
  game_name: string
  prize_pool: number
  entry_fee: number
  start_date: string
  registration_deadline: string
  max_participants: number
  description?: string
  rules?: string
  status: "registering" | "upcoming" | "in_progress" | "completed" | "cancelled"
  created_by: string
  created_at: string
}

type ChallengeRequest = {
  id: string
  user_id: string
  game_name: string
  stake: number
  preferred_time?: string
  description?: string
  status: "pending" | "approved" | "rejected"
  admin_notes?: string
  created_at: string
  user?: {
    username?: string
    display_name?: string
  }
}

type ClanRequest = {
  id: string
  user_id: string
  name: string
  tag: string
  description?: string
  logo_url?: string
  status: "pending" | "approved" | "rejected"
  admin_notes?: string
  created_at: string
  user?: {
    username?: string
    display_name?: string
  }
}

type Setting = {
  id: string
  key: string
  value: any
  updated_at: string
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [isRetrying, setIsRetrying] = useState(false)
  const [supabaseStatus, setSupabaseStatus] = useState<"loading" | "connected" | "error">("loading")
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const { toast } = useToast()

  // Stats state
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalMatches: 0,
    totalClips: 0,
    premiumUsers: 0,
    revenue: 0,
  })

  // User state
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [userStatusFilter, setUserStatusFilter] = useState("all")

  // Tournament state
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loadingTournaments, setLoadingTournaments] = useState(false)
  const [tournamentDialogOpen, setTournamentDialogOpen] = useState(false)
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null)
  const [tournamentForm, setTournamentForm] = useState<Partial<Tournament>>({
    name: "",
    game_name: "",
    prize_pool: 0,
    entry_fee: 0,
    max_participants: 32,
    description: "",
    rules: "",
    status: "registering",
  })
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [registrationDeadline, setRegistrationDeadline] = useState<Date | undefined>(undefined)

  // Challenge requests state
  const [challengeRequests, setChallengeRequests] = useState<ChallengeRequest[]>([])
  const [loadingChallengeRequests, setLoadingChallengeRequests] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ChallengeRequest | null>(null)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [requestAction, setRequestAction] = useState<"approve" | "reject" | "view">("view")
  const [adminNotes, setAdminNotes] = useState("")
  const [challengeLevel, setChallengeLevel] = useState("Intermediate")

  // Clan requests state
  const [clanRequests, setClanRequests] = useState<ClanRequest[]>([])
  const [loadingClanRequests, setLoadingClanRequests] = useState(false)
  const [selectedClanRequest, setSelectedClanRequest] = useState<ClanRequest | null>(null)
  const [clanRequestDialogOpen, setClanRequestDialogOpen] = useState(false)
  const [clanRequestAction, setClanRequestAction] = useState<"approve" | "reject" | "view">("view")
  const [clanAdminNotes, setClanAdminNotes] = useState("")

  // Settings state
  const [settings, setSettings] = useState<Setting[]>([])
  const [loadingSettings, setLoadingSettings] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [registrationEnabled, setRegistrationEnabled] = useState(true)
  const [autoModeration, setAutoModeration] = useState(true)
  const [contentApproval, setContentApproval] = useState(false)
  const [premiumEnabled, setPremiumEnabled] = useState(true)
  const [premiumPrice, setPremiumPrice] = useState("500")
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [filteredWords, setFilteredWords] = useState("")
  const [platformName, setPlatformName] = useState("K-Clash")
  const [settingsChanged, setSettingsChanged] = useState(false)

  // Database tables state
  const [dbTables, setDbTables] = useState<Record<string, boolean>>({
    tournaments: false,
    challenge_requests: false,
    clan_creation_requests: false,
    user_profiles: false,
    settings: false,
  })
  const [checkingTables, setCheckingTables] = useState(false)

  // Check if Supabase environment variables are configured
  const checkSupabaseConfig = () => {
    const url = getEnvVariable("NEXT_PUBLIC_SUPABASE_URL")
    const key = getEnvVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    if (!url) {
      return { isValid: false, error: "Missing NEXT_PUBLIC_SUPABASE_URL environment variable" }
    }

    if (!key) {
      return { isValid: false, error: "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable" }
    }

    return { isValid: true }
  }

  // Check Supabase connection
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        // First check if environment variables are configured
        const configCheck = checkSupabaseConfig()
        if (!configCheck.isValid) {
          setSupabaseStatus("error")
          setConnectionError(configCheck.error || "Invalid Supabase configuration")
          setIsLoading(false)
          return
        }

        const supabase = getBrowserSupabaseClient()
        if (!supabase) {
          setSupabaseStatus("error")
          setConnectionError("Failed to initialize Supabase client")
          setIsLoading(false)
          return
        }

        // Test connection with a simple health check
        try {
          // Simple ping to check if Supabase is reachable
          await fetch(getEnvVariable("NEXT_PUBLIC_SUPABASE_URL") || "", {
            method: "HEAD",
            mode: "no-cors", // This prevents CORS errors but won't give us response data
          })

          // If we get here, at least the domain is reachable
          setSupabaseStatus("connected")

          // Check database tables
          checkDatabaseTables()
        } catch (err) {
          console.error("Network error connecting to Supabase:", err)
          setSupabaseStatus("error")
          setConnectionError(
            "Network error: Unable to reach Supabase. Check your internet connection or Supabase service status.",
          )
          setIsLoading(false)
          return
        }
      } catch (err) {
        console.error("Error checking Supabase connection:", err)
        setSupabaseStatus("error")
        setConnectionError(err instanceof Error ? err.message : "Unknown error checking Supabase connection")
      } finally {
        setIsLoading(false)
        setIsRetrying(false)
      }
    }

    checkSupabaseConnection()
  }, [isRetrying])

  // Check database tables
  const checkDatabaseTables = async () => {
    setCheckingTables(true)
    const supabase = getBrowserSupabaseClient()
    if (!supabase) return

    const tables = ["tournaments", "challenge_requests", "clan_creation_requests", "user_profiles", "settings"]
    const tableStatus: Record<string, boolean> = {}

    for (const table of tables) {
      try {
        const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true })
        tableStatus[table] = !error
      } catch (err) {
        console.error(`Error checking table ${table}:`, err)
        tableStatus[table] = false
      }
    }

    setDbTables(tableStatus)
    setCheckingTables(false)
  }

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === "overview") {
      loadStats()
    } else if (activeTab === "users") {
      loadUsers()
    } else if (activeTab === "tournaments") {
      loadTournaments()
    } else if (activeTab === "challenges") {
      loadChallengeRequests()
    } else if (activeTab === "clans") {
      loadClanRequests()
    } else if (activeTab === "settings") {
      loadSettings()
    }
  }, [activeTab])

  // Function to retry connection check
  const retryConnectionCheck = () => {
    setIsLoading(true)
    setSupabaseStatus("loading")
    setConnectionError(null)
    setIsRetrying(!isRetrying) // Toggle to trigger useEffect
  }

  // Load stats
  const loadStats = async () => {
    const supabase = getBrowserSupabaseClient()
    if (!supabase) return

    try {
      // Get total users
      const { count: totalUsers, error: usersError } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })

      // Get premium users
      const { count: premiumUsers, error: premiumError } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_premium", true)

      // Get total matches
      const { count: totalMatches, error: matchesError } = await supabase
        .from("matches")
        .select("*", { count: "exact", head: true })

      // Get total clips
      const { count: totalClips, error: clipsError } = await supabase
        .from("clips")
        .select("*", { count: "exact", head: true })

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: totalUsers || 0, // For now, assume all users are active
        totalMatches: totalMatches || 0,
        totalClips: totalClips || 0,
        premiumUsers: premiumUsers || 0,
        revenue: (premiumUsers || 0) * 500, // Assuming 500 KSh per premium user
      })
    } catch (err) {
      console.error("Error loading stats:", err)
    }
  }

  // Load users
  const loadUsers = async () => {
    setLoadingUsers(true)
    const supabase = getBrowserSupabaseClient()
    if (!supabase) {
      setLoadingUsers(false)
      return
    }

    try {
      let query = supabase.from("user_profiles").select("*")

      // Apply filters if any
      if (userSearchQuery) {
        query = query.or(
          `username.ilike.%${userSearchQuery}%,display_name.ilike.%${userSearchQuery}%,email.ilike.%${userSearchQuery}%`,
        )
      }

      if (userStatusFilter === "active") {
        query = query.eq("is_active", true)
      } else if (userStatusFilter === "inactive") {
        query = query.eq("is_active", false)
      } else if (userStatusFilter === "premium") {
        query = query.eq("is_premium", true)
      } else if (userStatusFilter === "admin") {
        query = query.eq("is_admin", true)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching users:", error.message)
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setUsers(data || [])
      }
    } catch (err) {
      console.error("Error in loadUsers:", err)
    } finally {
      setLoadingUsers(false)
    }
  }

  // Load tournaments
  const loadTournaments = async () => {
    setLoadingTournaments(true)
    const supabase = getBrowserSupabaseClient()
    if (!supabase) {
      setLoadingTournaments(false)
      return
    }

    try {
      const { data, error } = await supabase.from("tournaments").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching tournaments:", error.message)
        toast({
          title: "Error fetching tournaments",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setTournaments(data || [])
      }
    } catch (err) {
      console.error("Error in loadTournaments:", err)
    } finally {
      setLoadingTournaments(false)
    }
  }

  // Load challenge requests
  const loadChallengeRequests = async () => {
    setLoadingChallengeRequests(true)
    const supabase = getBrowserSupabaseClient()
    if (!supabase) {
      setLoadingChallengeRequests(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("challenge_requests")
        .select(`
          *,
          user:user_id (
            username,
            display_name
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching challenge requests:", error.message)
        toast({
          title: "Error fetching challenge requests",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setChallengeRequests(data || [])
      }
    } catch (err) {
      console.error("Error in loadChallengeRequests:", err)
    } finally {
      setLoadingChallengeRequests(false)
    }
  }

  // Load clan requests
  const loadClanRequests = async () => {
    setLoadingClanRequests(true)
    const supabase = getBrowserSupabaseClient()
    if (!supabase) {
      setLoadingClanRequests(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("clan_creation_requests")
        .select(`
          *,
          user:user_id (
            username,
            display_name
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching clan requests:", error.message)
        toast({
          title: "Error fetching clan requests",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setClanRequests(data || [])
      }
    } catch (err) {
      console.error("Error in loadClanRequests:", err)
    } finally {
      setLoadingClanRequests(false)
    }
  }

  // Load settings
  const loadSettings = async () => {
    setLoadingSettings(true)
    const supabase = getBrowserSupabaseClient()
    if (!supabase) {
      setLoadingSettings(false)
      return
    }

    try {
      const { data, error } = await supabase.from("settings").select("*")

      if (error) {
        console.error("Error fetching settings:", error.message)
        toast({
          title: "Error fetching settings",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setSettings(data || [])

        // Parse settings
        const settingsMap: Record<string, any> = {}
        data?.forEach((setting) => {
          settingsMap[setting.key] = setting.value
        })

        // Set state from settings
        setMaintenanceMode(settingsMap.maintenance_mode || false)
        setRegistrationEnabled(settingsMap.registration_enabled !== false)
        setPlatformName(settingsMap.platform_name || "K-Clash")
        setAutoModeration(settingsMap.auto_moderation !== false)
        setContentApproval(settingsMap.content_approval || false)
        setFilteredWords(Array.isArray(settingsMap.filtered_words) ? settingsMap.filtered_words.join(", ") : "")
        setPremiumEnabled(settingsMap.premium_enabled !== false)
        setPremiumPrice(String(settingsMap.premium_price || 500))
        setBillingCycle(settingsMap.billing_cycle || "monthly")
      }
    } catch (err) {
      console.error("Error in loadSettings:", err)
    } finally {
      setLoadingSettings(false)
      setSettingsChanged(false)
    }
  }

  // Save settings
  const saveSettings = async () => {
    const supabase = getBrowserSupabaseClient()
    if (!supabase) return

    try {
      // Process filtered words
      const processedFilteredWords = filteredWords
        .split(",")
        .map((word) => word.trim())
        .filter((word) => word.length > 0)

      // Prepare settings
      const settingsToUpdate = [
        { key: "maintenance_mode", value: maintenanceMode },
        { key: "registration_enabled", value: registrationEnabled },
        { key: "platform_name", value: platformName },
        { key: "auto_moderation", value: autoModeration },
        { key: "content_approval", value: contentApproval },
        { key: "filtered_words", value: processedFilteredWords },
        { key: "premium_enabled", value: premiumEnabled },
        { key: "premium_price", value: Number(premiumPrice) },
        { key: "billing_cycle", value: billingCycle },
      ]

      // Update or insert settings
      for (const setting of settingsToUpdate) {
        const { error } = await supabase.from("settings").upsert({ key: setting.key, value: setting.value })

        if (error) {
          console.error(`Error updating setting ${setting.key}:`, error.message)
          toast({
            title: "Error saving settings",
            description: `Failed to update ${setting.key}: ${error.message}`,
            variant: "destructive",
          })
          return
        }
      }

      toast({
        title: "Settings saved",
        description: "Platform settings have been updated successfully",
      })

      setSettingsChanged(false)
    } catch (err) {
      console.error("Error saving settings:", err)
      toast({
        title: "Error saving settings",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  // Create database tables
  const createDatabaseTables = async () => {
    const supabase = getBrowserSupabaseClient()
    if (!supabase) return

    toast({
      title: "Creating tables",
      description: "Setting up database tables...",
    })

    try {
      // Create tournaments table
      if (!dbTables.tournaments) {
        const { error: tournamentsError } = await supabase.rpc("create_tournaments_table")
        if (tournamentsError) {
          console.error("Error creating tournaments table:", tournamentsError)
        }
      }

      // Create challenge_requests table
      if (!dbTables.challenge_requests) {
        const { error: challengesError } = await supabase.rpc("create_challenge_requests_table")
        if (challengesError) {
          console.error("Error creating challenge_requests table:", challengesError)
        }
      }

      // Create clan_creation_requests table
      if (!dbTables.clan_creation_requests) {
        const { error: clansError } = await supabase.rpc("create_clan_requests_table")
        if (clansError) {
          console.error("Error creating clan_creation_requests table:", clansError)
        }
      }

      // Create settings table
      if (!dbTables.settings) {
        const { error: settingsError } = await supabase.rpc("create_settings_table")
        if (settingsError) {
          console.error("Error creating settings table:", settingsError)
        }
      }

      toast({
        title: "Tables created",
        description: "Database tables have been set up successfully",
      })

      // Recheck tables
      checkDatabaseTables()
    } catch (err) {
      console.error("Error creating database tables:", err)
      toast({
        title: "Error creating tables",
        description: "Failed to set up database tables",
        variant: "destructive",
      })
    }
  }

  // Handle tournament form submission
  const handleTournamentSubmit = async () => {
    if (!startDate || !registrationDeadline) {
      toast({
        title: "Missing dates",
        description: "Please select both start date and registration deadline",
        variant: "destructive",
      })
      return
    }

    const supabase = getBrowserSupabaseClient()
    if (!supabase) return

    // Get the current user ID (in a real app, this would come from auth)
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id || "system"

    const tournamentData = {
      ...tournamentForm,
      name: tournamentForm.name || "",
      game_name: tournamentForm.game_name || "",
      prize_pool: tournamentForm.prize_pool || 0,
      entry_fee: tournamentForm.entry_fee || 0,
      start_date: startDate.toISOString(),
      registration_deadline: registrationDeadline.toISOString(),
      max_participants: tournamentForm.max_participants || 32,
      description: tournamentForm.description || "",
      rules: tournamentForm.rules || "",
      status: tournamentForm.status as "registering" | "upcoming" | "in_progress" | "completed" | "cancelled",
      created_by: userId,
    }

    try {
      if (editingTournament) {
        // Update existing tournament
        const { error } = await supabase.from("tournaments").update(tournamentData).eq("id", editingTournament.id)

        if (error) {
          toast({
            title: "Error updating tournament",
            description: error.message,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Tournament updated",
            description: "The tournament has been updated successfully",
          })
          loadTournaments()
          setTournamentDialogOpen(false)
          resetTournamentForm()
        }
      } else {
        // Create new tournament
        const { error } = await supabase.from("tournaments").insert(tournamentData)

        if (error) {
          toast({
            title: "Error creating tournament",
            description: error.message,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Tournament created",
            description: "The tournament has been created successfully",
          })
          loadTournaments()
          setTournamentDialogOpen(false)
          resetTournamentForm()
        }
      }
    } catch (err) {
      console.error("Error submitting tournament:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  // Reset tournament form
  const resetTournamentForm = () => {
    setTournamentForm({
      name: "",
      game_name: "",
      prize_pool: 0,
      entry_fee: 0,
      max_participants: 32,
      description: "",
      rules: "",
      status: "registering",
    })
    setStartDate(undefined)
    setRegistrationDeadline(undefined)
    setEditingTournament(null)
  }

  // Handle tournament edit
  const handleEditTournament = (tournament: Tournament) => {
    setEditingTournament(tournament)
    setTournamentForm({
      name: tournament.name,
      game_name: tournament.game_name,
      prize_pool: tournament.prize_pool,
      entry_fee: tournament.entry_fee,
      max_participants: tournament.max_participants,
      description: tournament.description || "",
      rules: tournament.rules || "",
      status: tournament.status,
    })
    setStartDate(new Date(tournament.start_date))
    setRegistrationDeadline(new Date(tournament.registration_deadline))
    setTournamentDialogOpen(true)
  }

  // Handle tournament delete
  const handleDeleteTournament = async (id: string) => {
    if (confirm("Are you sure you want to delete this tournament?")) {
      const supabase = getBrowserSupabaseClient()
      if (!supabase) return

      try {
        const { error } = await supabase.from("tournaments").delete().eq("id", id)

        if (error) {
          toast({
            title: "Error deleting tournament",
            description: error.message,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Tournament deleted",
            description: "The tournament has been deleted successfully",
          })
          loadTournaments()
        }
      } catch (err) {
        console.error("Error deleting tournament:", err)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      }
    }
  }

  // Handle challenge request action
  const handleRequestAction = async () => {
    if (!selectedRequest) return

    const supabase = getBrowserSupabaseClient()
    if (!supabase) return

    try {
      if (requestAction === "approve") {
        // Update request status
        const { error: updateError } = await supabase
          .from("challenge_requests")
          .update({
            status: "approved",
            admin_notes: adminNotes || null,
          })
          .eq("id", selectedRequest.id)

        if (updateError) {
          toast({
            title: "Error approving request",
            description: updateError.message,
            variant: "destructive",
          })
          return
        }

        // Create challenge
        const { error: createError } = await supabase.from("challenges").insert({
          game_name: selectedRequest.game_name,
          creator_id: selectedRequest.user_id,
          stake: selectedRequest.stake,
          time_availability: selectedRequest.preferred_time || "Flexible",
          players: "1v1",
          level: challengeLevel,
          request_id: selectedRequest.id,
        })

        if (createError) {
          toast({
            title: "Error creating challenge",
            description: createError.message,
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Request approved",
          description: "The challenge request has been approved and is now available",
        })
      } else if (requestAction === "reject") {
        // Reject the request
        const { error } = await supabase
          .from("challenge_requests")
          .update({
            status: "rejected",
            admin_notes: adminNotes || null,
          })
          .eq("id", selectedRequest.id)

        if (error) {
          toast({
            title: "Error rejecting request",
            description: error.message,
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Request rejected",
          description: "The challenge request has been rejected",
        })
      }

      loadChallengeRequests()
      setRequestDialogOpen(false)
      setSelectedRequest(null)
      setAdminNotes("")
      setChallengeLevel("Intermediate")
    } catch (err) {
      console.error("Error handling challenge request:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  // Handle clan request action
  const handleClanRequestAction = async () => {
    if (!selectedClanRequest) return

    const supabase = getBrowserSupabaseClient()
    if (!supabase) return

    try {
      if (clanRequestAction === "approve") {
        // Update request status
        const { error: updateError } = await supabase
          .from("clan_creation_requests")
          .update({
            status: "approved",
            admin_notes: clanAdminNotes || null,
          })
          .eq("id", selectedClanRequest.id)

        if (updateError) {
          toast({
            title: "Error approving clan request",
            description: updateError.message,
            variant: "destructive",
          })
          return
        }

        // Create clan
        const { error: createError } = await supabase.from("clans").insert({
          name: selectedClanRequest.name,
          tag: selectedClanRequest.tag,
          description: selectedClanRequest.description || null,
          logo_url: selectedClanRequest.logo_url || null,
          owner_id: selectedClanRequest.user_id,
          request_id: selectedClanRequest.id,
        })

        if (createError) {
          toast({
            title: "Error creating clan",
            description: createError.message,
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Clan request approved",
          description: "The clan has been created successfully",
        })
      } else if (clanRequestAction === "reject") {
        // Reject the request
        const { error } = await supabase
          .from("clan_creation_requests")
          .update({
            status: "rejected",
            admin_notes: clanAdminNotes || null,
          })
          .eq("id", selectedClanRequest.id)

        if (error) {
          toast({
            title: "Error rejecting clan request",
            description: error.message,
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Clan request rejected",
          description: "The clan creation request has been rejected",
        })
      }

      loadClanRequests()
      setClanRequestDialogOpen(false)
      setSelectedClanRequest(null)
      setClanAdminNotes("")
    } catch (err) {
      console.error("Error handling clan request:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  // Navigation items
  const navItems = [
    { id: "overview", label: "Overview", icon: <Home className="h-5 w-5" /> },
    { id: "users", label: "Users", icon: <Users className="h-5 w-5" /> },
    { id: "tournaments", label: "Tournaments", icon: <Trophy className="h-5 w-5" /> },
    { id: "challenges", label: "Challenges", icon: <Flag className="h-5 w-5" /> },
    { id: "clans", label: "Clans", icon: <Shield className="h-5 w-5" /> },
    { id: "content", label: "Content", icon: <FileText className="h-5 w-5" /> },
    { id: "database", label: "Database", icon: <Database className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="w-64 border-r bg-background flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">K-Clash Management</p>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={cn("justify-start", activeTab === item.id ? "bg-secondary" : "hover:bg-secondary/50")}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100/20">
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container py-6">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">
                {navItems.find((item) => item.id === activeTab)?.label || "Dashboard"}
              </h1>
              <p className="text-muted-foreground">
                {activeTab === "overview"
                  ? "Platform overview and statistics"
                  : activeTab === "users"
                    ? "Manage user accounts and permissions"
                    : activeTab === "tournaments"
                      ? "Create and manage tournaments"
                      : activeTab === "challenges"
                        ? "Manage user challenge requests"
                        : activeTab === "clans"
                          ? "Manage clan creation requests"
                          : activeTab === "content"
                            ? "Manage content and moderation"
                            : activeTab === "database"
                              ? "Database management and migrations"
                              : "Configure platform settings"}
              </p>
            </div>
            {activeTab === "tournaments" && (
              <Button
                onClick={() => {
                  resetTournamentForm()
                  setTournamentDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tournament
              </Button>
            )}
          </div>

          {/* Page Content */}
          <div className="space-y-6">
            {/* Supabase Connection Status */}
            {activeTab === "overview" && (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Supabase Integration Status</CardTitle>
                    <CardDescription>Connection status with Supabase</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {supabaseStatus === "loading" ? (
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            ) : supabaseStatus === "connected" ? (
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
                            {connectionError && <p className="text-sm text-red-500 mt-1">{connectionError}</p>}
                          </div>
                        </div>
                        <Badge
                          variant={
                            supabaseStatus === "loading"
                              ? "outline"
                              : supabaseStatus === "connected"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {supabaseStatus === "loading"
                            ? "Checking..."
                            : supabaseStatus === "connected"
                              ? "Connected"
                              : "Error"}
                        </Badge>
                      </div>

                      {/* Database Tables Status */}
                      <div className="p-3 bg-secondary/20 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-medium">Database Tables</h3>
                          {checkingTables ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <Button variant="outline" size="sm" onClick={checkDatabaseTables}>
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Refresh
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {Object.entries(dbTables).map(([table, exists]) => (
                            <div key={table} className="flex justify-between items-center p-2 bg-background/50 rounded">
                              <span className="text-sm">{table}</span>
                              <Badge variant={exists ? "default" : "outline"} className={exists ? "bg-green-500" : ""}>
                                {exists ? "Available" : "Not Found"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Troubleshooting tips */}
                      {supabaseStatus === "error" && (
                        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <h3 className="text-sm font-medium flex items-center mb-2">
                            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                            Troubleshooting Tips
                          </h3>
                          <ul className="text-sm space-y-1 list-disc pl-5">
                            <li>Check your internet connection</li>
                            <li>Verify that your Supabase project is active</li>
                            <li>Confirm that your environment variables are correctly set</li>
                            <li>Check for CORS issues if you're running in development mode</li>
                            <li>Try accessing the Supabase dashboard directly to verify service status</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="flex items-center"
                      onClick={retryConnectionCheck}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry Connection Check
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-500" />
                        Total Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalUsers}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats.totalUsers > 0 ? `${stats.premiumUsers} premium users` : "No users found"}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                        Total Matches
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalMatches}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats.totalMatches > 0 ? "Matches played" : "No matches found"}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-green-500" />
                        Revenue (KSh)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.revenue.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats.revenue > 0 ? "From premium subscriptions" : "No revenue yet"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeTab === "users" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage user accounts and permissions</CardDescription>
                    </div>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Feature coming soon",
                          description: "User creation will be available soon",
                        })
                      }}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="relative w-full md:max-w-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.3-4.3" />
                        </svg>
                        <Input
                          type="search"
                          placeholder="Search users..."
                          className="pl-8 w-full"
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2 w-full md:w-auto">
                        <Label htmlFor="filter-status" className="whitespace-nowrap">
                          Status:
                        </Label>
                        <Select value={userStatusFilter} onValueChange={setUserStatusFilter}>
                          <SelectTrigger className="w-full md:w-[120px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={loadUsers}>
                          <RefreshCw className="h-4 w-4" />
                          Refresh
                        </Button>
                      </div>
                    </div>

                    {loadingUsers ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : users.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Users className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">No users found</p>
                        <p className="text-sm text-muted-foreground mt-1 mb-4">
                          {userSearchQuery ? "Try a different search term" : "No users match the selected filters"}
                        </p>
                        <Button variant="outline" onClick={loadUsers}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-md border overflow-hidden">
                        <div className="grid grid-cols-6 p-3 text-sm font-medium border-b bg-muted/50">
                          <div className="col-span-2">User</div>
                          <div>Status</div>
                          <div>Role</div>
                          <div>Joined</div>
                          <div className="text-right">Actions</div>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                          {users.map((user) => (
                            <div
                              key={user.id}
                              className="grid grid-cols-6 p-3 text-sm items-center border-b last:border-0"
                            >
                              <div className="col-span-2 flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarImage src={user.avatar_url || "/placeholder.svg?height=32&width=32"} />
                                  <AvatarFallback>
                                    {(user.username || user.display_name || "User").substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {user.display_name || user.username || "Unnamed User"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {user.email || `@${user.username || "user"}`}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Badge
                                  variant={user.is_admin ? "default" : user.is_premium ? "secondary" : "outline"}
                                  className={user.is_admin ? "bg-purple-500" : user.is_premium ? "bg-yellow-500" : ""}
                                >
                                  {user.is_admin ? "Admin" : user.is_premium ? "Premium" : "Standard"}
                                </Badge>
                              </div>
                              <div>{user.is_admin ? "Admin" : "User"}</div>
                              <div>
                                {user.created_at ? format(new Date(user.created_at), "MMM d, yyyy") : "Unknown"}
                              </div>
                              <div className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    toast({
                                      title: "Feature coming soon",
                                      description: "User editing will be available soon",
                                    })
                                  }}
                                >
                                  Edit
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Showing {users.length} users</div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}

            {activeTab === "tournaments" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Tournament Management</CardTitle>
                      <CardDescription>Create and manage tournaments</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingTournaments ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : tournaments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-muted-foreground">No tournaments available</p>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">Create your first tournament</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          resetTournamentForm()
                          setTournamentDialogOpen(true)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Tournament
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-md border overflow-hidden">
                        <div className="grid grid-cols-7 p-3 text-sm font-medium border-b bg-muted/50">
                          <div className="col-span-2">Tournament</div>
                          <div>Prize Pool</div>
                          <div>Entry Fee</div>
                          <div>Start Date</div>
                          <div>Status</div>
                          <div className="text-right">Actions</div>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                          {tournaments.map((tournament) => (
                            <div
                              key={tournament.id}
                              className="grid grid-cols-7 p-3 text-sm items-center border-b last:border-0"
                            >
                              <div className="col-span-2">
                                <div className="font-medium">{tournament.name}</div>
                                <div className="text-xs text-muted-foreground">{tournament.game_name}</div>
                              </div>
                              <div>KSh {tournament.prize_pool?.toLocaleString() || 0}</div>
                              <div>KSh {tournament.entry_fee?.toLocaleString() || 0}</div>
                              <div>
                                {tournament.start_date ? format(new Date(tournament.start_date), "MMM d, yyyy") : "TBD"}
                              </div>
                              <div>
                                <Badge
                                  variant={
                                    tournament.status === "registering"
                                      ? "default"
                                      : tournament.status === "upcoming"
                                        ? "secondary"
                                        : tournament.status === "in_progress"
                                          ? "outline"
                                          : tournament.status === "completed"
                                            ? "default"
                                            : "destructive"
                                  }
                                  className={
                                    tournament.status === "registering"
                                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                      : tournament.status === "upcoming"
                                        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                        : tournament.status === "in_progress"
                                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                                          : tournament.status === "completed"
                                            ? "bg-gray-500/10 text-gray-500 border-gray-500/20"
                                            : ""
                                  }
                                >
                                  {tournament.status === "registering"
                                    ? "Registering"
                                    : tournament.status === "upcoming"
                                      ? "Upcoming"
                                      : tournament.status === "in_progress"
                                        ? "In Progress"
                                        : tournament.status === "completed"
                                          ? "Completed"
                                          : "Cancelled"}
                                </Badge>
                              </div>
                              <div className="text-right space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEditTournament(tournament)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteTournament(tournament.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={loadTournaments}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "challenges" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Challenge Requests</CardTitle>
                      <CardDescription>Manage user challenge requests and approvals</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingChallengeRequests ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : challengeRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Flag className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-muted-foreground">No challenge requests</p>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">
                        Users haven't submitted any challenge requests yet
                      </p>
                      <Button variant="outline" onClick={loadChallengeRequests}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-md border overflow-hidden">
                        <div className="grid grid-cols-7 p-3 text-sm font-medium border-b bg-muted/50">
                          <div className="col-span-2">Request</div>
                          <div>Game</div>
                          <div>Stake</div>
                          <div>Preferred Time</div>
                          <div>Status</div>
                          <div className="text-right">Actions</div>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                          {challengeRequests.map((request) => (
                            <div
                              key={request.id}
                              className="grid grid-cols-7 p-3 text-sm items-center border-b last:border-0"
                            >
                              <div className="col-span-2">
                                <div className="font-medium">
                                  {request.user?.username || request.user?.display_name || "Unknown User"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {request.created_at
                                    ? format(new Date(request.created_at), "MMM d, yyyy")
                                    : "Unknown date"}
                                </div>
                              </div>
                              <div>{request.game_name}</div>
                              <div>KSh {request.stake?.toLocaleString() || 0}</div>
                              <div>{request.preferred_time || "Flexible"}</div>
                              <div>
                                <Badge
                                  variant={
                                    request.status === "pending"
                                      ? "outline"
                                      : request.status === "approved"
                                        ? "default"
                                        : "destructive"
                                  }
                                  className={
                                    request.status === "pending"
                                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                      : request.status === "approved"
                                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                                        : ""
                                  }
                                >
                                  {request.status === "pending"
                                    ? "Pending"
                                    : request.status === "approved"
                                      ? "Approved"
                                      : "Rejected"}
                                </Badge>
                              </div>
                              <div className="text-right space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRequest(request)
                                    setRequestAction("view")
                                    setRequestDialogOpen(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {request.status === "pending" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-green-500"
                                      onClick={() => {
                                        setSelectedRequest(request)
                                        setRequestAction("approve")
                                        setRequestDialogOpen(true)
                                      }}
                                    >
                                      <ThumbsUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500"
                                      onClick={() => {
                                        setSelectedRequest(request)
                                        setRequestAction("reject")
                                        setRequestDialogOpen(true)
                                      }}
                                    >
                                      <ThumbsDown className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={loadChallengeRequests}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "clans" && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Clan Creation Requests</CardTitle>
                      <CardDescription>Manage user clan creation requests and approvals</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingClanRequests ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : clanRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Shield className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium text-muted-foreground">No clan creation requests</p>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">
                        Users haven't submitted any clan creation requests yet
                      </p>
                      <Button variant="outline" onClick={loadClanRequests}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-md border overflow-hidden">
                        <div className="grid grid-cols-7 p-3 text-sm font-medium border-b bg-muted/50">
                          <div className="col-span-2">Request</div>
                          <div>Clan Name</div>
                          <div>Tag</div>
                          <div>Created</div>
                          <div>Status</div>
                          <div className="text-right">Actions</div>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto">
                          {clanRequests.map((request) => (
                            <div
                              key={request.id}
                              className="grid grid-cols-7 p-3 text-sm items-center border-b last:border-0"
                            >
                              <div className="col-span-2">
                                <div className="font-medium">
                                  {request.user?.username || request.user?.display_name || "Unknown User"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {request.created_at
                                    ? format(new Date(request.created_at), "MMM d, yyyy")
                                    : "Unknown date"}
                                </div>
                              </div>
                              <div>{request.name}</div>
                              <div>{request.tag}</div>
                              <div>
                                {request.created_at ? format(new Date(request.created_at), "MMM d, yyyy") : "Unknown"}
                              </div>
                              <div>
                                <Badge
                                  variant={
                                    request.status === "pending"
                                      ? "outline"
                                      : request.status === "approved"
                                        ? "default"
                                        : "destructive"
                                  }
                                  className={
                                    request.status === "pending"
                                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                      : request.status === "approved"
                                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                                        : ""
                                  }
                                >
                                  {request.status === "pending"
                                    ? "Pending"
                                    : request.status === "approved"
                                      ? "Approved"
                                      : "Rejected"}
                                </Badge>
                              </div>
                              <div className="text-right space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedClanRequest(request)
                                    setClanRequestAction("view")
                                    setClanRequestDialogOpen(true)
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {request.status === "pending" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-green-500"
                                      onClick={() => {
                                        setSelectedClanRequest(request)
                                        setClanRequestAction("approve")
                                        setClanRequestDialogOpen(true)
                                      }}
                                    >
                                      <ThumbsUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500"
                                      onClick={() => {
                                        setSelectedClanRequest(request)
                                        setClanRequestAction("reject")
                                        setClanRequestDialogOpen(true)
                                      }}
                                    >
                                      <ThumbsDown className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={loadClanRequests}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>Configure platform settings and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingSettings ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Maintenance Mode */}
                      <div className="flex items-center justify-between">
                        <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                        <Switch
                          id="maintenance-mode"
                          checked={maintenanceMode}
                          onCheckedChange={(checked) => {
                            setMaintenanceMode(checked)
                            setSettingsChanged(true)
                          }}
                        />
                      </div>

                      {/* Registration Enabled */}
                      <div className="flex items-center justify-between">
                        <Label htmlFor="registration-enabled">Registration Enabled</Label>
                        <Switch
                          id="registration-enabled"
                          checked={registrationEnabled}
                          onCheckedChange={(checked) => {
                            setRegistrationEnabled(checked)
                            setSettingsChanged(true)
                          }}
                        />
                      </div>

                      {/* Platform Name */}
                      <div>
                        <Label htmlFor="platform-name">Platform Name</Label>
                        <Input
                          type="text"
                          id="platform-name"
                          value={platformName}
                          onChange={(e) => {
                            setPlatformName(e.target.value)
                            setSettingsChanged(true)
                          }}
                        />
                      </div>

                      {/* Auto Moderation */}
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-moderation">Auto Moderation</Label>
                        <Switch
                          id="auto-moderation"
                          checked={autoModeration}
                          onCheckedChange={(checked) => {
                            setAutoModeration(checked)
                            setSettingsChanged(true)
                          }}
                        />
                      </div>

                      {/* Content Approval */}
                      <div className="flex items-center justify-between">
                        <Label htmlFor="content-approval">Content Approval</Label>
                        <Switch
                          id="content-approval"
                          checked={contentApproval}
                          onCheckedChange={(checked) => {
                            setContentApproval(checked)
                            setSettingsChanged(true)
                          }}
                        />
                      </div>

                      {/* Filtered Words */}
                      <div>
                        <Label htmlFor="filtered-words">Filtered Words (comma separated)</Label>
                        <Textarea
                          id="filtered-words"
                          value={filteredWords}
                          onChange={(e) => {
                            setFilteredWords(e.target.value)
                            setSettingsChanged(true)
                          }}
                        />
                      </div>

                      {/* Premium Enabled */}
                      <div className="flex items-center justify-between">
                        <Label htmlFor="premium-enabled">Premium Enabled</Label>
                        <Switch
                          id="premium-enabled"
                          checked={premiumEnabled}
                          onCheckedChange={(checked) => {
                            setPremiumEnabled(checked)
                            setSettingsChanged(true)
                          }}
                        />
                      </div>

                      {/* Premium Price */}
                      <div>
                        <Label htmlFor="premium-price">Premium Price (KSh)</Label>
                        <Input
                          type="number"
                          id="premium-price"
                          value={premiumPrice}
                          onChange={(e) => {
                            setPremiumPrice(e.target.value)
                            setSettingsChanged(true)
                          }}
                        />
                      </div>

                      {/* Billing Cycle */}
                      <div>
                        <Label htmlFor="billing-cycle">Billing Cycle</Label>
                        <Select
                          value={billingCycle}
                          onValueChange={(value) => {
                            setBillingCycle(value)
                            setSettingsChanged(true)
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select billing cycle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="primary" onClick={saveSettings} disabled={!settingsChanged}>
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>

        {/* Tournament Dialog */}
        <Dialog open={tournamentDialogOpen} onOpenChange={setTournamentDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingTournament ? "Edit Tournament" : "Create Tournament"}</DialogTitle>
              <DialogDescription>
                {editingTournament ? "Update tournament details" : "Create a new tournament"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  value={tournamentForm.name || ""}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="game-name" className="text-right">
                  Game Name
                </Label>
                <Input
                  type="text"
                  id="game-name"
                  value={tournamentForm.game_name || ""}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, game_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="prize-pool" className="text-right">
                  Prize Pool
                </Label>
                <Input
                  type="number"
                  id="prize-pool"
                  value={tournamentForm.prize_pool || 0}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, prize_pool: Number(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="entry-fee" className="text-right">
                  Entry Fee
                </Label>
                <Input
                  type="number"
                  id="entry-fee"
                  value={tournamentForm.entry_fee || 0}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, entry_fee: Number(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="max-participants" className="text-right">
                  Max Participants
                </Label>
                <Input
                  type="number"
                  id="max-participants"
                  value={tournamentForm.max_participants || 32}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, max_participants: Number(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start-date" className="text-right">
                  Start Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="registration-deadline" className="text-right">
                  Registration Deadline
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !registrationDeadline && "text-muted-foreground",
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {registrationDeadline ? format(registrationDeadline, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={registrationDeadline}
                      onSelect={registrationDeadline}
                      disabled={(date) => date > (startDate || new Date(2100, 0, 1)) || date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={tournamentForm.description || ""}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="rules" className="text-right mt-2">
                  Rules
                </Label>
                <Textarea
                  id="rules"
                  value={tournamentForm.rules || ""}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, rules: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={tournamentForm.status || "registering"}
                  onValueChange={(value) =>
                    setTournamentForm({
                      ...tournamentForm,
                      status: value as "registering" | "upcoming" | "in_progress" | "completed" | "cancelled",
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="registering">Registering</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleTournamentSubmit}>
                {editingTournament ? "Update Tournament" : "Create Tournament"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Challenge Request Dialog */}
        <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Challenge Request Details</DialogTitle>
              <DialogDescription>View and manage challenge request details</DialogDescription>
            </DialogHeader>
            {selectedRequest ? (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">User</Label>
                  <div className="col-span-3 font-medium">
                    {selectedRequest.user?.username || selectedRequest.user?.display_name || "Unknown User"}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Game</Label>
                  <div className="col-span-3">{selectedRequest.game_name}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Stake</Label>
                  <div className="col-span-3">KSh {selectedRequest.stake?.toLocaleString() || 0}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Preferred Time</Label>
                  <div className="col-span-3">{selectedRequest.preferred_time || "Flexible"}</div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right mt-2">Description</Label>
                  <div className="col-span-3">{selectedRequest.description || "No description provided"}</div>
                </div>
                {requestAction !== "view" && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="challenge-level" className="text-right">
                        Challenge Level
                      </Label>
                      <Select value={challengeLevel} onValueChange={setChallengeLevel}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="admin-notes" className="text-right mt-2">
                        Admin Notes
                      </Label>
                      <Textarea
                        id="admin-notes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <DialogFooter>
              {selectedRequest && requestAction === "view" ? (
                <Button onClick={() => setRequestDialogOpen(false)}>Close</Button>
              ) : (
                <>
                  <Button type="submit" onClick={handleRequestAction}>
                    {requestAction === "approve" ? "Approve Request" : "Reject Request"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Clan Request Dialog */}
        <Dialog open={clanRequestDialogOpen} onOpenChange={setClanRequestDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Clan Creation Request Details</DialogTitle>
              <DialogDescription>View and manage clan creation request details</DialogDescription>
            </DialogHeader>
            {selectedClanRequest ? (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">User</Label>
                  <div className="col-span-3 font-medium">
                    {selectedClanRequest.user?.username || selectedClanRequest.user?.display_name || "Unknown User"}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Clan Name</Label>
                  <div className="col-span-3">{selectedClanRequest.name}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Tag</Label>
                  <div className="col-span-3">{selectedClanRequest.tag}</div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right mt-2">Description</Label>
                  <div className="col-span-3">{selectedClanRequest.description || "No description provided"}</div>
                </div>
                {clanRequestAction !== "view" && (
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="admin-notes" className="text-right mt-2">
                      Admin Notes
                    </Label>
                    <Textarea
                      id="admin-notes"
                      value={clanAdminNotes}
                      onChange={(e) => setClanAdminNotes(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <DialogFooter>
              {selectedClanRequest && clanRequestAction === "view" ? (
                <Button onClick={() => setClanRequestDialogOpen(false)}>Close</Button>
              ) : (
                <>
                  <Button type="submit" onClick={handleClanRequestAction}>
                    {clanRequestAction === "approve" ? "Approve Request" : "Reject Request"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
