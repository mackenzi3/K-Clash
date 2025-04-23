"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, Users, Trophy, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { getBrowserSupabaseClient, STORAGE_BUCKETS } from "@/lib/supabase"
import { playSound, SOUNDS } from "@/lib/sound-utils"
import { useToast } from "@/hooks/use-toast"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [supabaseStatus, setSupabaseStatus] = useState<"loading" | "connected" | "error">("loading")
  const [storageStatus, setStorageStatus] = useState<Record<string, "loading" | "available" | "error">>({
    [STORAGE_BUCKETS.AVATARS]: "loading",
    [STORAGE_BUCKETS.VIDEOS]: "loading",
    [STORAGE_BUCKETS.POSTS]: "loading",
  })
  const { toast } = useToast()

  // Handle click with sound
  const handleClick = () => {
    playSound(SOUNDS.CLICK, 0.3)
  }

  // Check Supabase connection and storage buckets
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const supabase = getBrowserSupabaseClient()
        if (!supabase) {
          setSupabaseStatus("error")
          return
        }

        // Test connection with a system-level query that doesn't depend on specific tables
        let data = null
        let error = null

        try {
          // Use Postgres system catalog to check connection instead of a specific table
          const response = await supabase.from("pg_catalog.pg_tables").select("schemaname, tablename").limit(1)

          data = response.data
          error = response.error
        } catch (err) {
          console.error("Error executing Supabase query:", err)
          error = { message: "Failed to connect to Supabase" }
        }

        if (error) {
          console.error("Supabase connection error:", error.message)

          // Try a simple health check query that should work on any Postgres database
          let pingData = null
          let pingError = null

          try {
            // Simple query to check if database is responsive
            const pingResponse = await supabase.rpc("version")
            pingData = pingResponse.data
            pingError = pingResponse.error

            // If RPC fails, try a raw query as fallback
            if (pingError) {
              const rawResponse = await supabase.from("_http_response").select("*").limit(1)
              pingData = rawResponse.data
              pingError = rawResponse.error
            }
          } catch (err) {
            console.error("Error pinging Supabase:", err)
            pingError = { message: "Failed to ping Supabase" }
          }

          if (pingError) {
            setSupabaseStatus("error")
          } else {
            // Connection works but the specific table doesn't exist
            setSupabaseStatus("connected")
          }
        } else {
          setSupabaseStatus("connected")
        }

        // Check storage buckets
        await Promise.all(
          Object.values(STORAGE_BUCKETS).map(async (bucket) => {
            try {
              // Try to list files in the bucket instead of getting bucket info
              const { data: bucketData, error: bucketError } = await supabase.storage.from(bucket).list()

              if (bucketError) {
                console.error(`Error checking bucket ${bucket}:`, bucketError)

                // Try to create the bucket
                let createError = null
                try {
                  const createResponse = await supabase.storage.createBucket(bucket, {
                    public: true,
                  })
                  createError = createResponse.error
                } catch (err) {
                  console.error(`Error creating bucket ${bucket}:`, err)
                  createError = { message: "Failed to create bucket" }
                }

                if (createError) {
                  setStorageStatus((prev) => ({ ...prev, [bucket]: "error" }))
                } else {
                  setStorageStatus((prev) => ({ ...prev, [bucket]: "available" }))
                }
              } else {
                setStorageStatus((prev) => ({ ...prev, [bucket]: "available" }))
              }
            } catch (err) {
              console.error(`Error checking bucket ${bucket}:`, err)
              setStorageStatus((prev) => ({ ...prev, [bucket]: "error" }))
            }
          }),
        )
      } catch (err) {
        console.error("Error checking Supabase connection:", err)
        setSupabaseStatus("error")
      } finally {
        setIsLoading(false)
      }
    }

    checkSupabaseConnection()
  }, [])

  // Mock data for admin dashboard
  const stats = {
    totalUsers: 1245,
    activeUsers: 876,
    totalMatches: 3567,
    totalClips: 892,
    premiumUsers: 342,
    revenue: 156000,
  }

  const recentUsers = [
    { id: 1, username: "NewGamer123", email: "newgamer@example.com", joined: "2 hours ago", status: "active" },
    { id: 2, username: "ProPlayer", email: "proplayer@example.com", joined: "5 hours ago", status: "active" },
    { id: 3, username: "GameMaster", email: "gamemaster@example.com", joined: "1 day ago", status: "inactive" },
  ]

  const recentReports = [
    {
      id: 1,
      type: "User",
      reporter: "GameMaster",
      reported: "ToxicPlayer",
      reason: "Abusive language",
      status: "pending",
    },
    {
      id: 2,
      type: "Clip",
      reporter: "CleanGamer",
      reported: "Video #452",
      reason: "Inappropriate content",
      status: "resolved",
    },
    { id: 3, type: "Chat", reporter: "SafePlayer", reported: "GlobalChat", reason: "Spam messages", status: "pending" },
  ]

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your gaming platform and monitor user activity</p>
        </div>

        {/* Supabase Connection Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Supabase Integration Status</CardTitle>
            <CardDescription>Connection status with Supabase and storage buckets</CardDescription>
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
                    <p className="text-sm text-muted-foreground">URL: https://sszdmzmzjpjtlqkxznbj.supabase.co</p>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(storageStatus).map(([bucket, status]) => (
                  <div key={bucket} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                    <div className="flex items-center">
                      <div className="mr-3">
                        {status === "loading" ? (
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        ) : status === "available" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{bucket} Bucket</p>
                        <p className="text-sm text-muted-foreground">
                          Storage for{" "}
                          {bucket === STORAGE_BUCKETS.AVATARS
                            ? "profile pictures"
                            : bucket === STORAGE_BUCKETS.VIDEOS
                              ? "user videos"
                              : "image posts"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={status === "loading" ? "outline" : status === "available" ? "default" : "destructive"}
                    >
                      {status === "loading" ? "Checking..." : status === "available" ? "Available" : "Error"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="button-with-sound"
              onClick={() => {
                handleClick()
                window.location.reload()
              }}
            >
              Refresh Connection Status
            </Button>
          </CardFooter>
        </Card>

        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => {
            setActiveTab(value)
            handleClick()
          }}
        >
          <TabsList className="grid grid-cols-5 w-full max-w-4xl">
            <TabsTrigger value="overview" className="button-with-sound">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="button-with-sound">
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="button-with-sound">
              Content
            </TabsTrigger>
            <TabsTrigger value="reports" className="button-with-sound">
              Reports
            </TabsTrigger>
            <TabsTrigger value="settings" className="button-with-sound">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
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
                    <span className="text-green-500">+12%</span> from last month
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
                    <span className="text-green-500">+8%</span> from last month
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
                    <span className="text-green-500">+15%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>New users who joined recently</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="h-9 w-9 mr-3">
                            <AvatarImage src={`/placeholder.svg?height=36&width=36`} />
                            <AvatarFallback>{user.username.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-sm text-muted-foreground mr-3">{user.joined}</div>
                          <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full button-with-sound" onClick={handleClick}>
                    View All Users
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Reports that need attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                            {report.type} Report
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {report.reporter} reported {report.reported}
                          </div>
                          <div className="text-xs text-muted-foreground">{report.reason}</div>
                        </div>
                        <Badge
                          variant={report.status === "pending" ? "outline" : "secondary"}
                          className={
                            report.status === "pending" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : ""
                          }
                        >
                          {report.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full button-with-sound" onClick={handleClick}>
                    View All Reports
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                  <Button className="button-with-sound" onClick={handleClick}>
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="relative w-full max-w-sm">
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
                      <Input type="search" placeholder="Search users..." className="pl-8 w-full" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="filter-status">Status:</Label>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="banned">Banned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 p-3 text-sm font-medium border-b">
                      <div className="col-span-2">User</div>
                      <div>Status</div>
                      <div>Role</div>
                      <div>Joined</div>
                      <div className="text-right">Actions</div>
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="grid grid-cols-6 p-3 text-sm items-center">
                        <div className="col-span-2 flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">User{i + 1}</div>
                            <div className="text-xs text-muted-foreground">user{i + 1}@example.com</div>
                          </div>
                        </div>
                        <div>
                          <Badge
                            variant={i % 3 === 0 ? "default" : i % 3 === 1 ? "secondary" : "outline"}
                            className={i % 3 === 2 ? "bg-red-500/10 text-red-500 border-red-500/20" : ""}
                          >
                            {i % 3 === 0 ? "Active" : i % 3 === 1 ? "Inactive" : "Banned"}
                          </Badge>
                        </div>
                        <div>{i === 0 ? "Admin" : "User"}</div>
                        <div>{`${Math.floor(Math.random() * 30) + 1} days ago`}</div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm" className="button-with-sound" onClick={handleClick}>
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">Showing 5 of 1,245 users</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="button-with-sound" onClick={handleClick}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="button-with-sound" onClick={handleClick}>
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Content Management</CardTitle>
                    <CardDescription>Manage clips, posts, and other content</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Select defaultValue="clips">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Content Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clips">Clips</SelectItem>
                        <SelectItem value="posts">Posts</SelectItem>
                        <SelectItem value="comments">Comments</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="button-with-sound" onClick={handleClick}>
                      Add Content
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="relative aspect-video">
                          <img
                            src={`/placeholder.svg?height=200&width=300`}
                            alt={`Clip ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 right-2">
                            <Badge variant="secondary" className="bg-black/70 text-white border-0">
                              {["Valorant", "Call of Duty", "FIFA", "Fortnite"][i % 4]}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-sm">Clip Title {i + 1}</h3>
                              <p className="text-xs text-muted-foreground">By User{i + 1}</p>
                            </div>
                            <Badge variant={i % 3 === 0 ? "default" : "outline"}>
                              {i % 3 === 0 ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="p-3 pt-0 flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" className="button-with-sound" onClick={handleClick}>
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="button-with-sound" onClick={handleClick}>
                            Edit
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">Showing 6 of 892 clips</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="button-with-sound" onClick={handleClick}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="button-with-sound" onClick={handleClick}>
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports Management</CardTitle>
                <CardDescription>Handle user reports and content moderation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="relative w-full max-w-sm">
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
                      <Input type="search" placeholder="Search reports..." className="pl-8 w-full" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="filter-status">Status:</Label>
                      <Select defaultValue="pending">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="dismissed">Dismissed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <div className="grid grid-cols-6 p-3 text-sm font-medium border-b">
                      <div>Type</div>
                      <div>Reporter</div>
                      <div>Reported</div>
                      <div>Reason</div>
                      <div>Status</div>
                      <div className="text-right">Actions</div>
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="grid grid-cols-6 p-3 text-sm items-center">
                        <div>
                          <Badge variant="outline">{["User", "Clip", "Comment", "Chat", "Match"][i % 5]}</Badge>
                        </div>
                        <div>User{i + 10}</div>
                        <div>
                          {["User", "Clip", "Comment", "Chat", "Match"][i % 5]}
                          {i + 1}
                        </div>
                        <div className="truncate max-w-[200px]">
                          {["Abusive language", "Inappropriate content", "Cheating", "Spam", "Harassment"][i % 5]}
                        </div>
                        <div>
                          <Badge
                            variant={i % 3 === 0 ? "outline" : i % 3 === 1 ? "default" : "secondary"}
                            className={
                              i % 3 === 0
                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                : i % 3 === 1
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : ""
                            }
                          >
                            {i % 3 === 0 ? "Pending" : i % 3 === 1 ? "Resolved" : "Dismissed"}
                          </Badge>
                        </div>
                        <div className="text-right space-x-2">
                          <Button variant="ghost" size="sm" className="button-with-sound" onClick={handleClick}>
                            View
                          </Button>
                          {i % 3 === 0 && (
                            <Button variant="outline" size="sm" className="button-with-sound" onClick={handleClick}>
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">Showing 5 of 42 reports</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="button-with-sound" onClick={handleClick}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="button-with-sound" onClick={handleClick}>
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure global platform settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">General Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                          <p className="text-sm text-muted-foreground">Put the platform in maintenance mode</p>
                        </div>
                        <Switch id="maintenance-mode" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="registration">User Registration</Label>
                          <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                        </div>
                        <Switch id="registration" defaultChecked />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="platform-name">Platform Name</Label>
                        <Input id="platform-name" defaultValue="K-Clash" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Content Moderation</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-moderation">Auto Moderation</Label>
                          <p className="text-sm text-muted-foreground">Automatically filter inappropriate content</p>
                        </div>
                        <Switch id="auto-moderation" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="content-approval">Content Approval</Label>
                          <p className="text-sm text-muted-foreground">Require approval for user-submitted content</p>
                        </div>
                        <Switch id="content-approval" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filtered-words">Filtered Words</Label>
                        <Textarea id="filtered-words" placeholder="Enter comma-separated words to filter" rows={3} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Premium Features</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="premium-enabled">Premium Subscriptions</Label>
                          <p className="text-sm text-muted-foreground">Enable premium subscriptions</p>
                        </div>
                        <Switch id="premium-enabled" defaultChecked />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="premium-price">Premium Price (KSh)</Label>
                          <Input id="premium-price" type="number" defaultValue="500" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="premium-duration">Billing Cycle</Label>
                          <Select defaultValue="monthly">
                            <SelectTrigger>
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
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" className="button-with-sound" onClick={handleClick}>
                  Cancel
                </Button>
                <Button
                  className="button-with-sound"
                  onClick={() => {
                    handleClick()
                    toast({
                      title: "Settings Saved",
                      description: "Your platform settings have been updated successfully.",
                    })
                    playSound(SOUNDS.SUCCESS, 0.5)
                  }}
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
