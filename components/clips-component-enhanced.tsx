"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  MessageSquare,
  Upload,
  Gamepad2,
  TrendingUp,
  Clock,
  Search,
  Crown,
  Filter,
  ChevronLeft,
  ChevronRight,
  Share2,
  MoreHorizontal,
  Bookmark,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ClipsComponentEnhanced() {
  const [clips, setClips] = useState([
    {
      id: 1,
      title: "Insane 1v5 Clutch in Valorant",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/placeholder.svg?height=720&width=1280",
      user: {
        name: "KingSlayer254",
        avatar: "/placeholder.svg?height=40&width=40",
        isPremium: true,
      },
      game: "Valorant",
      views: 1243,
      likes: 89,
      comments: 12,
      time: "2 hours ago",
      description: "Pulled off this crazy clutch in a ranked match. Can't believe I hit those shots!",
    },
    {
      id: 2,
      title: "FIFA 23 Last Minute Winner",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/placeholder.svg?height=720&width=1280",
      user: {
        name: "FootballMaster",
        avatar: "/placeholder.svg?height=40&width=40",
        isPremium: false,
      },
      game: "FIFA 23",
      views: 876,
      likes: 54,
      comments: 8,
      time: "5 hours ago",
      description: "90th minute goal to win the Division Rivals match. What a finish!",
    },
    {
      id: 3,
      title: "Epic Fortnite Victory Royale",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/placeholder.svg?height=720&width=1280",
      user: {
        name: "BuilderPro",
        avatar: "/placeholder.svg?height=40&width=40",
        isPremium: false,
      },
      game: "Fortnite",
      views: 2134,
      likes: 156,
      comments: 23,
      time: "1 day ago",
      description: "Last man standing in a 1v4 situation. The building skills came in clutch!",
    },
    {
      id: 4,
      title: "PUBG Mobile Sniper Montage",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/placeholder.svg?height=720&width=1280",
      user: {
        name: "SharpShooter",
        avatar: "/placeholder.svg?height=40&width=40",
        isPremium: true,
      },
      game: "PUBG Mobile",
      views: 3421,
      likes: 267,
      comments: 42,
      time: "2 days ago",
      description: "Some of my best sniper shots from the past week. That 400m headshot was insane!",
    },
    {
      id: 5,
      title: "Call of Duty Warzone Best Moments",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/placeholder.svg?height=720&width=1280",
      user: {
        name: "WarzonePro",
        avatar: "/placeholder.svg?height=40&width=40",
        isPremium: false,
      },
      game: "Call of Duty: Warzone",
      views: 1876,
      likes: 132,
      comments: 19,
      time: "3 days ago",
      description: "Compilation of my best plays this week. That snipe at 0:45 was insane!",
    },
    {
      id: 6,
      title: "Apex Legends 20 Kill Game",
      thumbnail: "/placeholder.svg?height=720&width=1280",
      videoUrl: "/placeholder.svg?height=720&width=1280",
      user: {
        name: "ApexPredator",
        avatar: "/placeholder.svg?height=40&width=40",
        isPremium: true,
      },
      game: "Apex Legends",
      views: 4532,
      likes: 321,
      comments: 47,
      time: "4 days ago",
      description: "My personal best - 20 kills and 4K damage with Wraith. Almost lost at the end!",
    },
  ])

  const [viewMode, setViewMode] = useState("grid")
  const [currentClipIndex, setCurrentClipIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("trending")

  const handleNextClip = () => {
    setCurrentClipIndex((prev) => (prev === clips.length - 1 ? 0 : prev + 1))
  }

  const handlePrevClip = () => {
    setCurrentClipIndex((prev) => (prev === 0 ? clips.length - 1 : prev - 1))
  }

  const currentClip = clips[currentClipIndex]

  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clips</h1>
            <p className="text-muted-foreground">Discover and share your best gaming moments</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search clips..." className="pl-8 w-full" />
            </div>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Tabs defaultValue="trending" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="trending">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="latest">
                <Clock className="h-4 w-4 mr-2" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="following">
                <Gamepad2 className="h-4 w-4 mr-2" />
                Following
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-2">
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="View Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid View</SelectItem>
                <SelectItem value="tiktok">TikTok Style</SelectItem>
                <SelectItem value="reels">Instagram Reels</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clips.map((clip) => (
              <Card key={clip.id} className="overflow-hidden clip-card">
                <div className="relative aspect-video">
                  <img
                    src={clip.thumbnail || "/placeholder.svg"}
                    alt={clip.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="bg-black/70 text-white border-0">
                      {clip.game}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">{clip.title}</CardTitle>
                  <CardDescription className="flex items-center pt-2">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={clip.user.avatar} />
                      <AvatarFallback>{clip.user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm flex items-center">
                      {clip.user.name}
                      {clip.user.isPremium && <Crown className="h-3 w-3 text-yellow-500 ml-1" />}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">{clip.time}</span>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Heart className="h-4 w-4 mr-1" />
                      {clip.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {clip.comments}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* TikTok Style View */}
        {viewMode === "tiktok" && (
          <div className="flex justify-center">
            <div className="max-w-md mx-auto border border-border rounded-xl overflow-hidden relative">
              <div className="h-[80vh] relative">
                <img
                  src={currentClip.thumbnail || "/placeholder.svg"}
                  alt={currentClip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <div className="text-white">
                    <h3 className="font-bold">{currentClip.title}</h3>
                    <p className="text-sm opacity-80">{currentClip.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={currentClip.user.avatar} />
                        <AvatarFallback>{currentClip.user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-white text-sm flex items-center">
                        {currentClip.user.name}
                        {currentClip.user.isPremium && <Crown className="h-3 w-3 text-yellow-500 ml-1" />}
                      </span>
                    </div>
                    <div className="flex space-x-4">
                      <Button variant="ghost" size="icon" className="text-white">
                        <Heart className="h-6 w-6" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white">
                        <MessageSquare className="h-6 w-6" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white">
                        <Share2 className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                onClick={handlePrevClip}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
                onClick={handleNextClip}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}

        {/* Instagram Reels Style View */}
        {viewMode === "reels" && (
          <div className="max-w-md mx-auto">
            <div className="border border-border rounded-xl overflow-hidden mb-6">
              <div className="p-3 flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={currentClip.user.avatar} />
                  <AvatarFallback>{currentClip.user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium flex items-center">
                    {currentClip.user.name}
                    {currentClip.user.isPremium && <Crown className="h-3 w-3 text-yellow-500 ml-1" />}
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
              <div className="aspect-square relative">
                <img
                  src={currentClip.thumbnail || "/placeholder.svg"}
                  alt={currentClip.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2">
                  <Badge variant="secondary" className="bg-black/70 text-white border-0">
                    {currentClip.game}
                  </Badge>
                </div>
              </div>
              <div className="p-3">
                <div className="flex justify-between mb-2">
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                      <Heart className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                      <MessageSquare className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                      <Share2 className="h-6 w-6" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                    <Bookmark className="h-6 w-6" />
                  </Button>
                </div>
                <div className="text-sm font-medium mb-1">{currentClip.likes} likes</div>
                <div className="text-sm">
                  <span className="font-medium">{currentClip.user.name}</span> {currentClip.description}
                </div>
                <div className="text-sm text-muted-foreground mt-1">View all {currentClip.comments} comments</div>
                <div className="text-xs text-muted-foreground mt-1">{currentClip.time}</div>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevClip}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button variant="outline" onClick={handleNextClip}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
