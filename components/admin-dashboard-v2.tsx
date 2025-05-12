"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle, Users, Trophy, Flag, Settings, Home } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getBrowserSupabaseClient } from "@/lib/supabase"

interface User {
  id: string
  email: string
  username?: string
  created_at: string
  last_sign_in?: string
  role?: string
}

interface Tournament {
  id: number
  name: string
  start_date: string
  end_date: string
  status: string
}

interface Challenge {
  id: number
  title: string
  description: string
  points: number
  difficulty: string
}

interface Clan {
  id: number
  name: string
  created_at: string
  member_count: number
}

interface SystemSetting {
  id: number
  key: string
  value: string
  description: string
}

export function AdminDashboardV2() {
  const [activeTab, setActiveTab] = useState("overview")
  const [users, setUsers] = useState<User[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [clans, setClans] = useState<Clan[]>([])
  const [settings, setSettings] = useState<SystemSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [newSetting, setNewSetting] = useState({ key: "", value: "", description: "" })
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [registrationOpen, setRegistrationOpen] = useState(true)
  const [newClan, setNewClan] = useState({ name: "", description: "" })
  const [showNewClanForm, setShowNewClanForm] = useState(false)

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTournaments: 0,
    totalChallenges: 0,
    totalClans: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const supabase = getBrowserSupabaseClient()

        if (!supabase) {
          throw new Error("Supabase client not initialized")
        }

        // Fetch profiles for user data
        const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*")

        if (profilesError) throw new Error(`Error fetching profiles: ${profilesError.message}`)

        // Format user data from profiles
        const formattedUsers =
          profiles?.map((profile) => ({
            id: profile.id,
            email: profile.email || "No email",
            username: profile.username || "Not set",
            created_at: new Date(profile.created_at).toLocaleString(),
            last_sign_in: profile.last_sign_in_at ? new Date(profile.last_sign_in_at).toLocaleString() : "Never",
            role: profile.role || "user",
          })) || []

        setUsers(formattedUsers)

        // Fetch tournaments
        const { data: tournamentsData, error: tournamentsError } = await supabase
          .from("tournaments")
          .select("*")
          .order("start_date", { ascending: false })

        if (tournamentsError) throw new Error(`Error fetching tournaments: ${tournamentsError.message}`)
        setTournaments(tournamentsData || [])

        // Fetch challenges
        const { data: challengesData, error: challengesError } = await supabase.from("challenges").select("*")

        if (challengesError) throw new Error(`Error fetching challenges: ${challengesError.message}`)
        setChallenges(challengesData || [])

        // Fetch clans
        const { data: clansData, error: clansError } = await supabase.from("clans").select("*")

        if (clansError) throw new Error(`Error fetching clans: ${clansError.message}`)
        setClans(clansData || [])

        // Fetch settings
        const { data: settingsData, error: settingsError } = await supabase.from("system_settings").select("*")

        if (settingsError) throw new Error(`Error fetching settings: ${settingsError.message}`)
        setSettings(settingsData || [])

        // Set maintenance mode and registration status from settings
        const maintenanceSetting = settingsData?.find((s) => s.key === "maintenance_mode")
        setMaintenanceMode(maintenanceSetting?.value === "true")

        const registrationSetting = settingsData?.find((s) => s.key === "registration_open")
        setRegistrationOpen(registrationSetting?.value !== "false")

        // Update stats
        setStats({
          totalUsers: formattedUsers.length,
          activeTournaments: tournamentsData?.filter((t) => t.status === "active").length || 0,
          totalChallenges: challengesData?.length || 0,
          totalClans: clansData?.length || 0,
        })
      } catch (err) {
        console.error("Error fetching admin data:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSaveSetting = async () => {
    if (!newSetting.key || !newSetting.value) {
      setError("Key and value are required")
      return
    }

    try {
      const supabase = getBrowserSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      const { data, error } = await supabase
        .from("system_settings")
        .insert([
          {
            key: newSetting.key,
            value: newSetting.value,
            description: newSetting.description,
          },
        ])
        .select()

      if (error) throw new Error(`Error saving setting: ${error.message}`)

      setSettings([...settings, data[0]])
      setNewSetting({ key: "", value: "", description: "" })
      setSuccess("Setting saved successfully")

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("Error saving setting:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    }
  }

  const handleUpdateSetting = async (id: number, value: string) => {
    try {
      const supabase = getBrowserSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      const { error } = await supabase.from("system_settings").update({ value }).eq("id", id)

      if (error) throw new Error(`Error updating setting: ${error.message}`)

      // Update local state
      setSettings(settings.map((s) => (s.id === id ? { ...s, value } : s)))
      setSuccess("Setting updated successfully")

      setTimeout(() => setSuccess(null), 3000)

      // Handle special settings
      const setting = settings.find((s) => s.id === id)
      if (setting?.key === "maintenance_mode") {
        setMaintenanceMode(value === "true")
      } else if (setting?.key === "registration_open") {
        setRegistrationOpen(value !== "false")
      }
    } catch (err) {
      console.error("Error updating setting:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    }
  }

  const toggleMaintenanceMode = async () => {
    const maintenanceSetting = settings.find((s) => s.key === "maintenance_mode")

    if (maintenanceSetting) {
      await handleUpdateSetting(maintenanceSetting.id, (!maintenanceMode).toString())
    } else {
      // Create the setting if it doesn't exist
      setNewSetting({
        key: "maintenance_mode",
        value: (!maintenanceMode).toString(),
        description: "Whether the site is in maintenance mode",
      })
      await handleSaveSetting()
    }
  }

  const toggleRegistrationOpen = async () => {
    const registrationSetting = settings.find((s) => s.key === "registration_open")

    if (registrationSetting) {
      await handleUpdateSetting(registrationSetting.id, (!registrationOpen).toString())
    } else {
      // Create the setting if it doesn't exist
      setNewSetting({
        key: "registration_open",
        value: (!registrationOpen).toString(),
        description: "Whether new user registration is open",
      })
      await handleSaveSetting()
    }
  }

  const handleCreateClan = async () => {
    if (!newClan.name) {
      setError("Clan name is required")
      return
    }

    try {
      const supabase = getBrowserSupabaseClient()

      if (!supabase) {
        throw new Error("Supabase client not initialized")
      }

      const { data, error } = await supabase
        .from("clans")
        .insert([
          {
            name: newClan.name,
            description: newClan.description,
            member_count: 1,
          },
        ])
        .select()

      if (error) throw new Error(`Error creating clan: ${error.message}`)

      setClans([...clans, data[0]])
      setNewClan({ name: "", description: "" })
      setShowNewClanForm(false)
      setSuccess("Clan created successfully")

      // Update stats
      setStats({
        ...stats,
        totalClans: stats.totalClans + 1,
      })

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error("Error creating clan:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-muted/40">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
          <p className="text-muted-foreground">Manage your gaming platform</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Button
            variant={activeTab === "overview" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("overview")}
          >
            <Home className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button
            variant={activeTab === "users" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("users")}
          >
            <Users className="mr-2 h-4 w-4" />
            Users
          </Button>
          <Button
            variant={activeTab === "tournaments" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("tournaments")}
          >
            <Trophy className="mr-2 h-4 w-4" />
            Tournaments
          </Button>
          <Button
            variant={activeTab === "challenges" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("challenges")}
          >
            <Flag className="mr-2 h-4 w-4" />
            Challenges
          </Button>
          <Button
            variant={activeTab === "clans" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("clans")}
          >
            <Users className="mr-2 h-4 w-4" />
            Clans
          </Button>
          <Button
            variant={activeTab === "settings" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden p-4 border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="clans">Clans</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="default" className="mb-6 border-green-500 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-3xl font-bold">{stats.totalUsers}</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Tournaments</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-3xl font-bold">{stats.activeTournaments}</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-3xl font-bold">{stats.totalChallenges}</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Clans</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-3xl font-bold">{stats.totalClans}</div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.slice(0, 5).map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.username || user.email}</TableCell>
                            <TableCell>{user.created_at}</TableCell>
                          </TableRow>
                        ))}
                        {users.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center">
                              No users found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Active Tournaments</CardTitle>
                  <CardDescription>Currently running tournaments</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tournaments
                          .filter((t) => t.status === "active")
                          .slice(0, 5)
                          .map((tournament) => (
                            <TableRow key={tournament.id}>
                              <TableCell>{tournament.name}</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                  Active
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        {tournaments.filter((t) => t.status === "active").length === 0 && (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center">
                              No active tournaments
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current platform status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Maintenance Mode</p>
                      <span className="text-sm text-muted-foreground">
                        {maintenanceMode ? "Site is in maintenance mode" : "Site is operating normally"}
                      </span>
                    </div>
                    <Button
                      variant={maintenanceMode ? "destructive" : "outline"}
                      onClick={toggleMaintenanceMode}
                      disabled={loading}
                    >
                      {maintenanceMode ? "Disable" : "Enable"} Maintenance Mode
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">User Registration</p>
                      <span className="text-sm text-muted-foreground">
                        {registrationOpen ? "New users can register" : "Registration is closed"}
                      </span>
                    </div>
                    <Button
                      variant={registrationOpen ? "outline" : "default"}
                      onClick={toggleRegistrationOpen}
                      disabled={loading}
                    >
                      {registrationOpen ? "Close" : "Open"} Registration
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">User Management</h1>

            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Login</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.username || "Not set"}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role || "user"}</TableCell>
                            <TableCell>{user.created_at}</TableCell>
                            <TableCell>{user.last_sign_in || "Never"}</TableCell>
                          </TableRow>
                        ))}
                        {users.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">
                              No users found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tournaments Tab */}
        {activeTab === "tournaments" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Tournament Management</h1>

            <Card>
              <CardHeader>
                <CardTitle>All Tournaments</CardTitle>
                <CardDescription>Manage gaming tournaments</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tournaments.map((tournament) => (
                          <TableRow key={tournament.id}>
                            <TableCell>{tournament.name}</TableCell>
                            <TableCell>{new Date(tournament.start_date).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(tournament.end_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  tournament.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : tournament.status === "upcoming"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                        {tournaments.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center">
                              No tournaments found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === "challenges" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Challenge Management</h1>

            <Card>
              <CardHeader>
                <CardTitle>All Challenges</CardTitle>
                <CardDescription>Manage gaming challenges</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Points</TableHead>
                          <TableHead>Difficulty</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {challenges.map((challenge) => (
                          <TableRow key={challenge.id}>
                            <TableCell>{challenge.title}</TableCell>
                            <TableCell className="max-w-xs truncate">{challenge.description}</TableCell>
                            <TableCell>{challenge.points}</TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  challenge.difficulty === "easy"
                                    ? "bg-green-100 text-green-800"
                                    : challenge.difficulty === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                        {challenges.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center">
                              No challenges found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Clans Tab */}
        {activeTab === "clans" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Clan Management</h1>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">All Clans</h2>
              <Button onClick={() => setShowNewClanForm(!showNewClanForm)}>
                {showNewClanForm ? "Cancel" : "Create New Clan"}
              </Button>
            </div>

            {showNewClanForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Create New Clan</CardTitle>
                  <CardDescription>Add a new clan to the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="clan-name">Clan Name</Label>
                      <Input
                        id="clan-name"
                        value={newClan.name}
                        onChange={(e) => setNewClan({ ...newClan, name: e.target.value })}
                        placeholder="Enter clan name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clan-description">Description</Label>
                      <Input
                        id="clan-description"
                        value={newClan.description}
                        onChange={(e) => setNewClan({ ...newClan, description: e.target.value })}
                        placeholder="Enter clan description"
                      />
                    </div>
                    <Button onClick={handleCreateClan}>Create Clan</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>All Clans</CardTitle>
                <CardDescription>Manage gaming clans</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Members</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clans.map((clan) => (
                          <TableRow key={clan.id}>
                            <TableCell>{clan.name}</TableCell>
                            <TableCell>{new Date(clan.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{clan.member_count}</TableCell>
                          </TableRow>
                        ))}
                        {clans.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">
                              No clans found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">System Settings</h1>

            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Quick Settings</h3>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="maintenance"
                        checked={maintenanceMode}
                        onCheckedChange={(checked) => {
                          if (typeof checked === "boolean") {
                            toggleMaintenanceMode()
                          }
                        }}
                      />
                      <Label htmlFor="maintenance">Maintenance Mode</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="registration"
                        checked={registrationOpen}
                        onCheckedChange={(checked) => {
                          if (typeof checked === "boolean") {
                            toggleRegistrationOpen()
                          }
                        }}
                      />
                      <Label htmlFor="registration">Allow New Registrations</Label>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">All Settings</h3>

                    {loading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Key</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {settings.map((setting) => (
                            <TableRow key={setting.id}>
                              <TableCell>{setting.key}</TableCell>
                              <TableCell>
                                <Input
                                  value={setting.value}
                                  onChange={(e) => {
                                    setSettings(
                                      settings.map((s) => (s.id === setting.id ? { ...s, value: e.target.value } : s)),
                                    )
                                  }}
                                />
                              </TableCell>
                              <TableCell>{setting.description}</TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateSetting(setting.id, setting.value)}
                                >
                                  Save
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {settings.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">
                                No settings found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Add New Setting</h3>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <Label htmlFor="key">Key</Label>
                        <Input
                          id="key"
                          value={newSetting.key}
                          onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                          placeholder="setting_name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="value">Value</Label>
                        <Input
                          id="value"
                          value={newSetting.value}
                          onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                          placeholder="setting_value"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={newSetting.description}
                          onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                          placeholder="What this setting does"
                        />
                      </div>
                    </div>

                    <Button onClick={handleSaveSetting}>Add Setting</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
