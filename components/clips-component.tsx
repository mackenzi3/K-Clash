"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare, Share2, Upload, Gamepad2, TrendingUp, Clock, Search, Crown } from "lucide-react"

export function ClipsComponent() {
  const [clips, setClips] = useState([
    {
      id: 1,
      title: "Insane 1v5 Clutch in Valorant",
      thumbnail: "/placeholder.svg?height=720&width=1280",
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
    },
    {
      id: 2,
      title: "FIFA 23 Last Minute Winner",
      thumbnail: "/placeholder.svg?height=720&width=1280",
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
    },
    {
      id: 3,
      title: "Epic Fortnite Victory Royale",
      thumbnail: "/placeholder.svg?height=720&width=1280",
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
    },
    {
      id: 4,
      title: "PUBG Mobile Sniper Montage",
      thumbnail: "/placeholder.svg?height=720&width=1280",
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
    },
    {
      id: 5,
      title: "Call of Duty Warzone Best Moments",
      thumbnail: "/placeholder.svg?height=720&width=1280",
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
    },
    {
      id: 6,
      title: "Apex Legends 20 Kill Game",
      thumbnail: "/placeholder.svg?height=720&width=1280",
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
    },
  ])

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

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
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
          <TabsContent value="trending" className="pt-6">
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
          </TabsContent>
          <TabsContent value="latest" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...clips]
                .sort((a, b) => a.id - b.id)
                .map((clip) => (
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
          </TabsContent>
          <TabsContent value="following" className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Following Content</h3>
                <p className="text-muted-foreground mb-4">You're not following any creators yet.</p>
                <Button>Discover Creators</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
