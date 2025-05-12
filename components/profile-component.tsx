"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Bell, Lock, CreditCard, Link2, Twitter, Instagram, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "@/contexts/theme-context"
import { STORAGE_BUCKETS, uploadToStorage } from "@/lib/supabase"

// Mock data for profile
const mockProfile = {
  username: "gamer254",
  display_name: "Pro Gamer",
  email: "gamer@example.com",
  avatar_url: "/placeholder.svg?height=128&width=128",
  banner_url: "/placeholder.svg?height=400&width=1200",
  bio: "Professional gamer from Nairobi. I specialize in FPS games and have won several local tournaments.",
  location: "Nairobi, Kenya",
  is_premium: true,
  is_admin: false,
}

const mockAchievements = [
  {
    id: "1",
    name: "First Victory",
    description: "Won your first match",
    icon: "🏆",
    unlocked_at: "2023-01-15",
  },
  {
    id: "2",
    name: "Sharpshooter",
    description: "Achieved 90% accuracy in a match",
    icon: "🎯",
    unlocked_at: "2023-02-20",
  },
  {
    id: "3",
    name: "Tournament Champion",
    description: "Won a K-Clash tournament",
    icon: "🏅",
    unlocked_at: "2023-03-10",
  },
]

const mockStats = {
  matches_count: 156,
  wins_count: 98,
  win_rate: 62.8,
  total_earnings: 25000,
  hours_played: 342,
  tournament_wins: 3,
  highest_win_streak: 12,
}

const mockMatches = [
  {
    id: "1",
    game: "Call of Duty: Warzone",
    opponent: "FalconKE",
    result: "Win",
    score: "3-1",
    prize: "KSh 1,000",
    match_date: "2023-04-15",
  },
  {
    id: "2",
    game: "FIFA 23",
    opponent: "SoccerKing",
    result: "Loss",
    score: "1-3",
    prize: "KSh 0",
    match_date: "2023-04-10",
  },
  {
    id: "3",
    game: "Fortnite",
    opponent: "BuilderPro",
    result: "Win",
    score: "Victory Royale",
    prize: "KSh 2,000",
    match_date: "2023-04-05",
  },
]

const mockClips = [
  {
    id: "1",
    title: "Insane Sniper Shot",
    thumbnail_url: "/placeholder.svg?height=200&width=300",
    video_url: "#",
    views_count: 1245,
    likes_count: 89,
    comments_count: 12,
    game: "Call of Duty: Warzone",
    description: "Hit this crazy shot from across the map!",
    created_at: "2023-04-01",
  },
  {
    id: "2",
    title: "Clutch 1v4",
    thumbnail_url: "/placeholder.svg?height=200&width=300",
    video_url: "#",
    views_count: 876,
    likes_count: 54,
    comments_count: 8,
    game: "Valorant",
    description: "Managed to clutch this round against all odds!",
    created_at: "2023-03-25",
  },
]

export default function ProfileComponent({ username }: { username?: string }) {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [soundsEnabled, setSoundsEnabled] = useState(true)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const postInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    display_name: mockProfile.display_name,
    location: mockProfile.location,
    bio: mockProfile.bio,
    avatar_url: mockProfile.avatar_url,
    banner_url: mockProfile.banner_url,
  })

  // Initialize sounds enabled state
  useEffect(() => {
    if (typeof window !== "undefined") {
      // setSoundsEnabled(areSoundsEnabled())
    }
  }, [])

  // Handle click with sound
  const handleClick = () => {
    // playSound(SOUNDS.CLICK, 0.3)
  }

  const handleEditToggle = () => {
    // handleClick()
    if (isEditing) {
      // Save changes
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
      // playSound(SOUNDS.SUCCESS, 0.5)
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleThemeChange = (newTheme: string) => {
    // handleClick()
    setTheme(newTheme as any)
    toast({
      title: "Theme Updated",
      description: `Theme has been changed to ${newTheme}.`,
    })
  }

  const handleSoundsToggle = () => {
    // const enabled = toggleSounds()
    // setSoundsEnabled(enabled)
    // if (enabled) {
    //   playSound(SOUNDS.SUCCESS, 0.5)
    // }
    // toast({
    //   title: enabled ? "Sounds Enabled" : "Sounds Disabled",
    //   description: enabled ? "UI sounds have been turned on." : "UI sounds have been turned off.",
    // })
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    bucket: string,
    type: "avatar" | "banner" | "video" | "post",
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    // handleClick()

    try {
      // Generate a unique file path
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${mockProfile.username}/${type}/${fileName}`

      // Upload to Supabase storage
      const { url, error } = await uploadToStorage(bucket, filePath, file, {
        contentType: file.type,
        upsert: true,
      })

      if (error) {
        throw error
      }

      // Update form data if it's avatar or banner
      if (type === "avatar") {
        setFormData((prev) => ({ ...prev, avatar_url: url || prev.avatar_url }))
      } else if (type === "banner") {
        setFormData((prev) => ({ ...prev, banner_url: url || prev.banner_url }))
      }

      // Show success message
      toast({
        title: "Upload Successful",
        description: `Your ${type} has been uploaded successfully.`,
      })
      // playSound(SOUNDS.SUCCESS, 0.5)
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      })
      // playSound(SOUNDS.ERROR, 0.5)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="relative mb-8">
        <div className="h-48 w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 overflow-hidden">
          {formData.banner_url && (
            <img
              src={formData.banner_url || "/placeholder.svg"}
              alt="Profile banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="absolute -bottom-16 left-8 flex items-end">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={formData.avatar_url || "/placeholder.svg"} alt={mockProfile.username} />
              <AvatarFallback>{mockProfile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {!username && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-0 right-0 bg-black/20 hover:bg-black/40 rounded-full h-8 w-8"
                onClick={() => {
                  // handleClick()
                  avatarInputRef.current?.click()
                }}
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Change avatar</span>
              </Button>
            )}
            <input
              type="file"
              ref={avatarInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, STORAGE_BUCKETS.AVATARS, "avatar")}
            />
          </div>
          <div className="ml-4 mb-4">
            <h1 className="text-3xl font-bold">{formData.display_name || mockProfile.username}</h1>
            <p className="text-muted-foreground">@{mockProfile.username}</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          {!username && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="button-with-sound"
                onClick={() => {
                  // handleClick()
                  bannerInputRef.current?.click()
                }}
              >
                <Camera className="h-4 w-4 mr-2" />
                Change Banner
              </Button>
              <input
                type="file"
                ref={bannerInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, STORAGE_BUCKETS.AVATARS, "banner")}
              />
              <Button onClick={handleEditToggle} className="button-with-sound">
                {isEditing ? "Save Profile" : "Edit Profile"}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mt-16">
        <Tabs
          defaultValue="profile"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value)
            // handleClick()
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 w-full max-w-4xl mx-auto">
            <TabsTrigger value="profile" className="button-with-sound">
              Profile
            </TabsTrigger>
            <TabsTrigger value="stats" className="button-with-sound">
              Stats
            </TabsTrigger>
            <TabsTrigger value="clips" className="button-with-sound">
              Clips
            </TabsTrigger>
            <TabsTrigger value="coaches" className="button-with-sound">
              Coaches
            </TabsTrigger>
            <TabsTrigger value="settings" className="button-with-sound">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="display_name">Display Name</Label>
                        <Input
                          id="display_name"
                          name="display_name"
                          value={formData.display_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" value={formData.location} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
                      </div>
                    </div>
                  ) : (
                    <>
                      {formData.bio ? (
                        <p className="text-muted-foreground mb-4">{formData.bio}</p>
                      ) : (
                        <p className="text-muted-foreground mb-4">No bio provided</p>
                      )}

                      {formData.location && (
                        <div className="flex items-center mt-4">
                          <span className="text-muted-foreground mr-2">📍</span>
                          <span>{formData.location}</span>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mockAchievements.length > 0 ? (
                      <div className="space-y-3">
                        {mockAchievements.slice(0, 5).map((achievement) => (
                          <div key={achievement.id} className="flex items-center">
                            <div className="mr-3 text-xl">{achievement.icon || "🏆"}</div>
                            <div>
                              <p className="font-medium">{achievement.name}</p>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No achievements yet</p>
                    )}
                  </CardContent>
                  {mockAchievements.length > 5 && (
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full button-with-sound" onClick={() => {}}>
                        View All
                      </Button>
                    </CardFooter>
                  )}
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Twitter className="h-5 w-5 mr-3" />
                        <span>@{mockProfile.username}</span>
                      </div>
                      <div className="flex items-center">
                        <Instagram className="h-5 w-5 mr-3" />
                        <span>@{mockProfile.username}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your account settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      <Tabs defaultValue="appearance" orientation="vertical" className="w-full">
                        <TabsList className="flex flex-col items-start w-full rounded-none border-r border-border/40 h-auto">
                          <TabsTrigger
                            value="appearance"
                            className="w-full justify-start px-4 py-2 h-auto button-with-sound"
                            onClick={() => {}}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4 mr-2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 2a7 7 0 1 0 0 14 7 7 0 1 0 0-14" />
                            </svg>
                            Appearance
                          </TabsTrigger>
                          <TabsTrigger
                            value="notifications"
                            className="w-full justify-start px-4 py-2 h-auto button-with-sound"
                            onClick={() => {}}
                          >
                            <Bell className="h-4 w-4 mr-2" />
                            Notifications
                          </TabsTrigger>
                          <TabsTrigger
                            value="privacy"
                            className="w-full justify-start px-4 py-2 h-auto button-with-sound"
                            onClick={() => {}}
                          >
                            <Lock className="h-4 w-4 mr-2" />
                            Privacy
                          </TabsTrigger>
                          <TabsTrigger
                            value="payment"
                            className="w-full justify-start px-4 py-2 h-auto button-with-sound"
                            onClick={() => {}}
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Payment Methods
                          </TabsTrigger>
                          <TabsTrigger
                            value="connected"
                            className="w-full justify-start px-4 py-2 h-auto button-with-sound"
                            onClick={() => {}}
                          >
                            <Link2 className="h-4 w-4 mr-2" />
                            Connected Accounts
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="appearance" className="p-4 flex-1">
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-sm font-medium mb-3">Theme Color</h3>
                              <div className="flex flex-wrap gap-3">
                                {[
                                  { name: "Default", color: "bg-purple-500", value: "default" },
                                  { name: "Pink", color: "bg-pink-500", value: "pink" },
                                  { name: "Blue", color: "bg-blue-500", value: "blue" },
                                  { name: "Green", color: "bg-green-500", value: "green" },
                                  { name: "Orange", color: "bg-orange-500", value: "orange" },
                                ].map((themeOption) => (
                                  <div key={themeOption.value} className="text-center">
                                    <button
                                      className={`h-10 w-10 rounded-full ${themeOption.color} mb-1 ring-2 ring-offset-2 ring-offset-background ${
                                        theme === themeOption.value ? "ring-white" : "ring-transparent"
                                      } button-with-sound`}
                                      aria-label={`Select ${themeOption.name} theme`}
                                      onClick={() => handleThemeChange(themeOption.value)}
                                    />
                                    <div className="text-xs">{themeOption.name}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium mb-3">Sound Effects</h3>
                              <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                                  <div>
                                    <div className="font-medium">UI Sounds</div>
                                    <div className="text-xs text-muted-foreground">
                                      Button clicks and interface sounds
                                    </div>
                                  </div>
                                  <Switch checked={soundsEnabled} onCheckedChange={() => {}} />
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                              <Button variant="outline" className="button-with-sound" onClick={() => {}}>
                                Reset to Default
                              </Button>
                              <Button className="button-with-sound" onClick={() => {}}>
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        </TabsContent>

                        {/* Other tabs content */}
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Other tabs content */}
        </Tabs>
      </div>
    </div>
  )
}
