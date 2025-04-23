"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Bell } from "@/components/bell"
import { Lock } from "@/components/lock"
import { CreditCard } from "@/components/credit-card"
import { Link2 } from "@/components/link-2"
import { Twitter } from "@/components/twitter"
import { Instagram } from "@/components/instagram"
import { MoreHorizontal } from "@/components/more-horizontal"
import { Bookmark } from "@/components/bookmark"
import { Share2 } from "@/components/share-2"
import { useProfile } from "@/hooks/use-profile"
import { useToast } from "@/hooks/use-toast"

export default function ProfileComponent({ username }: { username?: string }) {
  const { profile, achievements, stats, matches, clips, loading, error, updateProfile } = useProfile(username)
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    display_name: "",
    location: "",
    bio: "",
    avatar_url: "",
    banner_url: "",
  })

  // Initialize form data when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        location: profile.location || "",
        bio: profile.bio || "",
        avatar_url: profile.avatar_url,
        banner_url: profile.banner_url,
      })
    }
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
        <p className="text-muted-foreground mb-4">{error || "Unable to load profile data"}</p>
        <Button asChild>
          <a href="/">Return Home</a>
        </Button>
      </div>
    )
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      updateProfile(formData).then((updated) => {
        if (updated) {
          toast({
            title: "Profile Updated",
            description: "Your profile has been successfully updated.",
          })
        } else {
          toast({
            title: "Update Failed",
            description: "Failed to update profile. Please try again.",
            variant: "destructive",
          })
        }
      })
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container mx-auto py-6">
      <div className="relative mb-8">
        <div className="h-48 w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 overflow-hidden">
          {profile.banner_url && (
            <img
              src={profile.banner_url || "/placeholder.svg"}
              alt="Profile banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="absolute -bottom-16 left-8 flex items-end">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage src={profile.avatar_url} alt={profile.username} />
            <AvatarFallback>{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 mb-4">
            <h1 className="text-3xl font-bold">{profile.display_name || profile.username}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>
          </div>
        </div>
        <div className="absolute bottom-4 right-4">
          {!username && <Button onClick={handleEditToggle}>{isEditing ? "Save Profile" : "Edit Profile"}</Button>}
        </div>
      </div>

      <div className="mt-16">
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl mx-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="clips">Clips</TabsTrigger>
            <TabsTrigger value="coaches">Coaches</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
                      {profile.bio ? (
                        <p className="text-muted-foreground mb-4">{profile.bio}</p>
                      ) : (
                        <p className="text-muted-foreground mb-4">No bio provided</p>
                      )}

                      {profile.location && (
                        <div className="flex items-center mt-4">
                          <span className="text-muted-foreground mr-2">📍</span>
                          <span>{profile.location}</span>
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
                    {achievements.length > 0 ? (
                      <div className="space-y-3">
                        {achievements.slice(0, 5).map((achievement) => (
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
                  {achievements.length > 5 && (
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
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
                        <span>@{profile.username}</span>
                      </div>
                      <div className="flex items-center">
                        <Instagram className="h-5 w-5 mr-3" />
                        <span>@{profile.username}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Match History</CardTitle>
                </CardHeader>
                <CardContent>
                  {matches.length > 0 ? (
                    <div className="space-y-4">
                      {matches.map((match) => (
                        <div key={match.id} className="flex items-center justify-between border-b pb-3">
                          <div>
                            <p className="font-medium">{match.game || "Unknown Game"}</p>
                            <p className="text-sm text-muted-foreground">vs {match.opponent || "Unknown"}</p>
                          </div>
                          <div className="flex items-center">
                            <Badge variant={match.result === "Win" ? "default" : "secondary"}>{match.result}</Badge>
                            <span className="ml-3">{match.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No match history available</p>
                  )}
                </CardContent>
                {matches.length > 0 && (
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View All Matches
                    </Button>
                  </CardFooter>
                )}
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Matches</span>
                          <span className="font-medium">{stats.matches_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Wins</span>
                          <span className="font-medium">{stats.wins_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Win Rate</span>
                          <span className="font-medium">{stats.win_rate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hours Played</span>
                          <span className="font-medium">{stats.hours_played}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tournament Wins</span>
                          <span className="font-medium">{stats.tournament_wins}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Highest Win Streak</span>
                          <span className="font-medium">{stats.highest_win_streak}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No stats available</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold">KSh {stats?.total_earnings.toLocaleString() || "0"}</p>
                      <p className="text-muted-foreground">Total Earnings</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Clips Tab */}
          <TabsContent value="clips" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {clips.length > 0 ? (
                clips.map((clip) => (
                  <Card key={clip.id} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <img
                        src={clip.thumbnail_url || "/placeholder.svg"}
                        alt={clip.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Button variant="outline" size="icon" className="rounded-full bg-white/20 backdrop-blur-sm">
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
                            className="h-6 w-6"
                          >
                            <polygon points="5 3 19 12 5 21 5 3" fill="white" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold text-lg">{clip.title}</h3>
                      <p className="text-sm text-muted-foreground">{clip.game}</p>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <span>{clip.views_count} views</span>
                        <span className="mx-2">•</span>
                        <span>{clip.likes_count} likes</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between py-2">
                      <Button variant="ghost" size="icon">
                        <Bookmark className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="md:col-span-3 flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No clips uploaded yet</p>
                  {!username && <Button>Upload Your First Clip</Button>}
                </div>
              )}
            </div>
            {clips.length > 0 && (
              <div className="flex justify-center mt-6">
                <Button variant="outline">Load More</Button>
              </div>
            )}
          </TabsContent>

          {/* Coaches Tab */}
          <TabsContent value="coaches" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Coaches</CardTitle>
                  <CardDescription>Find a coach to improve your skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center border rounded-lg p-4">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="ProCoach" />
                        <AvatarFallback>PC</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">ProCoach</h3>
                        <p className="text-sm text-muted-foreground">Valorant</p>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill={star <= 4 ? "gold" : "none"}
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm ml-1">4.8 (24)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">KSh 1,500/hr</p>
                        <Button size="sm" className="mt-2">
                          Book
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center border rounded-lg p-4">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="FPSMaster" />
                        <AvatarFallback>FM</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">FPSMaster</h3>
                        <p className="text-sm text-muted-foreground">Call of Duty: Warzone</p>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill={star <= 4 ? "gold" : "none"}
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm ml-1">4.6 (18)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">KSh 1,200/hr</p>
                        <Button size="sm" className="mt-2">
                          Book
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Coaches
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Coaching Sessions</CardTitle>
                  <CardDescription>Your upcoming and past sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-muted-foreground mb-4">No coaching sessions booked</p>
                    <Button>Find a Coach</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      <CardTitle>Notifications</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="match-invites">Match Invites</Label>
                        <Switch id="match-invites" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="friend-requests">Friend Requests</Label>
                        <Switch id="friend-requests" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="clan-invites">Clan Invites</Label>
                        <Switch id="clan-invites" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="direct-messages">Direct Messages</Label>
                        <Switch id="direct-messages" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="system-announcements">System Announcements</Label>
                        <Switch id="system-announcements" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        <Switch id="marketing-emails" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 mr-2" />
                      <CardTitle>Privacy</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Profile Visibility</Label>
                        <RadioGroup defaultValue="public">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="public" id="profile-public" />
                            <Label htmlFor="profile-public">Public</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="friends" id="profile-friends" />
                            <Label htmlFor="profile-friends">Friends Only</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="private" id="profile-private" />
                            <Label htmlFor="profile-private">Private</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="online-status">Show Online Status</Label>
                        <Switch id="online-status" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="game-activity">Show Game Activity</Label>
                        <Switch id="game-activity" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Theme</Label>
                        <RadioGroup defaultValue="default">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="default" id="theme-default" />
                            <Label htmlFor="theme-default">Default</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pink" id="theme-pink" />
                            <Label htmlFor="theme-pink">Pink</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="blue" id="theme-blue" />
                            <Label htmlFor="theme-blue">Blue</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="green" id="theme-green" />
                            <Label htmlFor="theme-green">Green</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="orange" id="theme-orange" />
                            <Label htmlFor="theme-orange">Orange</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="ui-sounds">UI Sounds</Label>
                          <Switch id="ui-sounds" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notification-sounds">Notification Sounds</Label>
                          <Switch id="notification-sounds" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="achievement-sounds">Achievement Sounds</Label>
                          <Switch id="achievement-sounds" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="background-music">Background Music</Label>
                          <Switch id="background-music" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="volume">Volume</Label>
                        <Slider id="volume" defaultValue={[70]} max={100} step={1} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="reduce-animations" />
                        <Label htmlFor="reduce-animations">Reduce Animations</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="low-quality" />
                        <Label htmlFor="low-quality">Low Quality Mode</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="data-saver" />
                        <Label htmlFor="data-saver">Data Saver</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      <CardTitle>Payment Methods</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border rounded-lg p-3">
                        <div className="flex items-center">
                          <div className="bg-green-100 text-green-800 p-2 rounded-full mr-3">
                            <span>M</span>
                          </div>
                          <div>
                            <p className="font-medium">M-Pesa</p>
                            <p className="text-sm text-muted-foreground">071******78</p>
                          </div>
                        </div>
                        <Badge>Default</Badge>
                      </div>

                      <div className="flex items-center justify-between border rounded-lg p-3">
                        <div className="flex items-center">
                          <div className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                            <span>V</span>
                          </div>
                          <div>
                            <p className="font-medium">Credit Card</p>
                            <p className="text-sm text-muted-foreground">****-****-****-4567</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Set Default
                        </Button>
                      </div>

                      <Button variant="outline" className="w-full">
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center">
                      <Link2 className="h-5 w-5 mr-2" />
                      <CardTitle>Connected Accounts</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-gray-100 p-1 rounded-full mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <span>Steam</span>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                          Connected
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-gray-100 p-1 rounded-full mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <span>PlayStation</span>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                          Connected
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-gray-100 p-1 rounded-full mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <span>Xbox</span>
                        </div>
                        <Button size="sm" variant="outline">
                          Connect
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-gray-100 p-1 rounded-full mr-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <span>Epic Games</span>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                          Connected
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
