"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, Search, Headphones, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export function ChillHubComponent() {
  const { theme } = useTheme()
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "KingSlayer254",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Anyone up for a quick Warzone match?",
      time: "2 min ago",
      isPremium: true,
      reactions: { likes: 3, dislikes: 0 },
    },
    {
      id: 2,
      user: "GameMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Just hit Diamond rank in Valorant! 🎮",
      time: "5 min ago",
      isPremium: false,
      reactions: { likes: 5, dislikes: 0 },
    },
    {
      id: 3,
      user: "ProGamer123",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "The new update is amazing! So many new features.",
      time: "10 min ago",
      isPremium: false,
      reactions: { likes: 2, dislikes: 0 },
    },
    {
      id: 4,
      user: "NairobiGamer",
      avatar: "/placeholder.svg?height=40&width=40",
      message: "Anyone from Nairobi want to form a clan?",
      time: "15 min ago",
      isPremium: true,
      reactions: { likes: 7, dislikes: 0 },
    },
    {
      id: 5,
      user: "System",
      avatar: "",
      message: "Welcome to the Chill Hub! Remember to be respectful to other gamers.",
      time: "20 min ago",
      isSystem: true,
      reactions: { likes: 0, dislikes: 0 },
    },
  ])

  const [onlineUsers, setOnlineUsers] = useState([
    {
      id: 1,
      name: "KingSlayer254",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "In Match",
      game: "Call of Duty: Warzone",
      isPremium: true,
      isFriend: true,
    },
    {
      id: 2,
      name: "GameMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Online",
      isPremium: false,
      isFriend: true,
    },
    {
      id: 3,
      name: "ProGamer123",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Online",
      isPremium: false,
      isFriend: false,
    },
    {
      id: 4,
      name: "NairobiGamer",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "In Match",
      game: "FIFA 23",
      isPremium: true,
      isFriend: true,
    },
    {
      id: 5,
      name: "GamerGirl",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "Online",
      isPremium: false,
      isFriend: false,
    },
  ])

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState({
    title: "Gaming Vibes",
    artist: "DJ Gamer",
    cover: "/placeholder.svg?height=60&width=60",
  })
  const [volume, setVolume] = useState(70)
  const [currentTime, setCurrentTime] = useState(83) // in seconds
  const [duration, setDuration] = useState(225) // in seconds
  const [activeChat, setActiveChat] = useState("global")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [messageInput, setMessageInput] = useState("")
  const [activeTab, setActiveTab] = useState("chat")
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Preload sounds on component mount
  useEffect(() => {}, [])

  // Handle click with sound
  const handleClick = () => {}

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: "You",
          avatar: "/placeholder.svg?height=40&width=40",
          message: messageInput,
          time: "Just now",
          isUser: true,
          reactions: { likes: 0, dislikes: 0 },
        },
      ])
      setMessageInput("")
    }
  }

  const handleReaction = (messageId: number, type: "likes" | "dislikes") => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions }
          reactions[type] += 1
          return { ...msg, reactions }
        }
        return msg
      }),
    )
  }

  const toggleFriend = (userId: number) => {
    setOnlineUsers(
      onlineUsers.map((user) => {
        if (user.id === userId) {
          return { ...user, isFriend: !user.isFriend }
        }
        return user
      }),
    )
  }

  const playlists = [
    { name: "Gaming Beats", tracks: 15, creator: "K-Clash Official" },
    { name: "Focus Mode", tracks: 12, creator: "ProGamer123" },
    { name: "Chill Vibes", tracks: 20, creator: "MusicMaster" },
    { name: "Hype Tracks", tracks: 18, creator: "DJ Gamer" },
  ]

  const chatRooms = [
    { id: "global", name: "Global Chat", members: 243, isOfficial: true },
    { id: "valorant", name: "Valorant", members: 87, isOfficial: true },
    { id: "cod", name: "Call of Duty", members: 124, isOfficial: true },
    { id: "fifa", name: "FIFA", members: 56, isOfficial: true },
    { id: "nairobi", name: "Nairobi Gamers", members: 32, isOfficial: false },
    { id: "beginners", name: "Beginners", members: 45, isOfficial: false },
  ]

  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case "pink":
        return {
          gradientFrom: "from-pink-500",
          gradientTo: "to-purple-500",
          accentColor: "bg-pink-500/10 text-pink-500 border-pink-500/20",
          iconColor: "text-pink-500",
          buttonHover: "hover:bg-pink-500/90",
          messageBubble: "bg-pink-50 dark:bg-pink-950/20",
          userMessageBubble: "bg-pink-500 text-white",
        }
      case "blue":
        return {
          gradientFrom: "from-blue-500",
          gradientTo: "to-indigo-500",
          accentColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          iconColor: "text-blue-500",
          buttonHover: "hover:bg-blue-500/90",
          messageBubble: "bg-blue-50 dark:bg-blue-950/20",
          userMessageBubble: "bg-blue-500 text-white",
        }
      case "green":
        return {
          gradientFrom: "from-green-500",
          gradientTo: "to-emerald-500",
          accentColor: "bg-green-500/10 text-green-500 border-green-500/20",
          iconColor: "text-green-500",
          buttonHover: "hover:bg-green-500/90",
          messageBubble: "bg-green-50 dark:bg-green-950/20",
          userMessageBubble: "bg-green-500 text-white",
        }
      case "orange":
        return {
          gradientFrom: "from-orange-500",
          gradientTo: "to-amber-500",
          accentColor: "bg-orange-500/10 text-orange-500 border-orange-500/20",
          iconColor: "text-orange-500",
          buttonHover: "hover:bg-orange-500/90",
          messageBubble: "bg-orange-50 dark:bg-orange-950/20",
          userMessageBubble: "bg-orange-500 text-white",
        }
      default:
        return {
          gradientFrom: "from-purple-500",
          gradientTo: "to-blue-500",
          accentColor: "bg-primary/10 text-primary border-primary/20",
          iconColor: "text-primary",
          buttonHover: "hover:bg-primary/90",
          messageBubble: "bg-gray-50 dark:bg-gray-800/50",
          userMessageBubble: "bg-primary text-white",
        }
    }
  }

  const themeStyles = getThemeStyles()

  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Rooms Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <MessageSquare className={`h-4 w-4 mr-2 ${themeStyles.iconColor}`} />
                Chat Rooms
              </CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search rooms..." className="pl-8 w-full" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                {chatRooms.map((room) => (
                  <div key={room.id} className="px-4 py-2">
                    <Button
                      variant={activeChat === room.id ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setActiveChat(room.id)
                      }}
                    >
                      <div className="flex items-center w-full">
                        <div className="flex-1 text-left">
                          <div className="flex items-center">
                            <span>{room.name}</span>
                            {room.isOfficial && (
                              <Badge variant="outline" className={`ml-2 ${themeStyles.accentColor} text-xs`}>
                                Official
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{room.members} members</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Button>
                  </div>
                ))}
              </ScrollArea>
              <div className="p-4 border-t border-border/40">
                <Button className={`w-full bg-primary ${themeStyles.buttonHover}`}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Create Room
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <Card className="h-[calc(100vh-12rem)]">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{chatRooms.find((room) => room.id === activeChat)?.name || "Global Chat"}</CardTitle>
                  <CardDescription>Connect with gamers from all over Kenya</CardDescription>
                </div>
                <Badge variant="outline" className={`flex items-center ${themeStyles.accentColor}`}>
                  <Users className="h-3 w-3 mr-1" />
                  {chatRooms.find((room) => room.id === activeChat)?.members || onlineUsers.length} Online
                </Badge>
              </div>
              <Tabs
                defaultValue="chat"
                className="mt-2"
                value={activeTab}
                onValueChange={(value) => {
                  setActiveTab(value)
                }}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="chat">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="voice">
                    <Headphones className="h-4 w-4 mr-2" />
                    Voice
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="m-0">
                  <div className="flex flex-col h-[calc(100vh-20rem)]">
                    <ScrollArea className="flex-1 px-4">
                      {messages.map((msg) => (
                        <div key={msg.id} className="mb-4">
                          {msg.isSystem ? (
                            <div className="bg-secondary/30 rounded-md p-3 text-center text-sm text-muted-foreground">
                              {msg.message}
                            </div>
                          ) : (
                            <div className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                              <div className={`flex max-w-[80%] ${msg.isUser ? "flex-row-reverse" : "flex-row"}`}>
                                {!msg.isUser && (
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                                    <AvatarFallback>{msg.user.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                )}
                                <div>
                                  <div className="flex items-center mb-1">
                                    <span className={`text-xs font-medium ${msg.isUser ? "text-right ml-auto" : ""}`}>
                                      {msg.user}
                                    </span>
                                    {msg.isPremium && (
                                      <Badge
                                        variant="outline"
                                        className={`ml-1 ${themeStyles.accentColor} text-[10px] px-1 py-0`}
                                      >
                                        PRO
                                      </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground ml-2">{msg.time}</span>
                                  </div>
                                  <div
                                    className={`rounded-lg p-3 ${
                                      msg.isUser ? themeStyles.userMessageBubble : themeStyles.messageBubble
                                    }`}
                                  >
                                    {msg.message}
                                  </div>
                                  <div className={`flex mt-1 text-xs ${msg.isUser ? "justify-end" : "justify-start"}`}>
                                    <button
                                      onClick={() => handleReaction(msg.id, "likes")}
                                      className="flex items-center mr-2 text-muted-foreground hover:text-primary"
                                    >
                                      <ThumbsUp className="h-3 w-3 mr-1" />
                                      {msg.reactions.likes}
                                    </button>
                                    <button
                                      onClick={() => handleReaction(msg.id, "dislikes")}
                                      className="flex items-center text-muted-foreground hover:text-primary"
                                    >
                                      <ThumbsDown className="h-3 w-3 mr-1" />
                                      {msg.reactions.dislikes}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </ScrollArea>
                    <div className="p-4 border-t border-border/40">
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Type a message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" className={`bg-primary ${themeStyles.buttonHover}`}>
                          Send
                        </Button>
                      </form>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="voice" className="m-0">
                  <div className="flex flex-col items-center justify-center h-[calc(100vh-20rem)]">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold mb-2">Voice Chat</h3>
                      <p className="text-muted-foreground">Connect with other gamers using voice chat</p>
                    </div>
                    <Button className={`mb-2 bg-primary ${themeStyles.buttonHover}`}>Join Voice Chat</Button>
                    <p className="text-xs text-muted-foreground">Make sure your microphone is connected and working</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>

        {/* Online Users & Music Sidebar */}
        <div className="lg:col-span-1 order-3">
          <div className="space-y-6">
            {/* Online Users */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Users className={`h-4 w-4 mr-2 ${themeStyles.iconColor}`} />
                  Online Users
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
                  {onlineUsers.map((user) => (
                    <div key={user.id} className="px-4 py-2 border-b border-border/40 last:border-0">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium text-sm">{user.name}</span>
                            {user.isPremium && (
                              <Badge
                                variant="outline"
                                className={`ml-1 ${themeStyles.accentColor} text-[10px] px-1 py-0`}
                              >
                                PRO
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-xs">
                            <div
                              className={`h-1.5 w-1.5 rounded-full mr-1 ${
                                user.status === "Online" ? "bg-green-500" : "bg-amber-500"
                              }`}
                            />
                            <span className="text-muted-foreground">
                              {user.status}
                              {user.game && ` • ${user.game}`}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => toggleFriend(user.id)}>
                          <span className={user.isFriend ? "text-primary" : "text-muted-foreground"}>
                            {user.isFriend ? "✓" : "+"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Music Player */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Headphones className={`h-4 w-4 mr-2 ${themeStyles.iconColor}`} />
                  Music Player
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="h-14 w-14 rounded-md overflow-hidden mr-3">
                    <img
                      src={currentTrack.cover || "/placeholder.svg"}
                      alt={currentTrack.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{currentTrack.title}</h4>
                    <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${themeStyles.gradientFrom} ${themeStyles.gradientTo} bg-gradient-to-r`}
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-center space-x-2 mt-3">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <polygon points="19 20 9 12 19 4 19 20"></polygon>
                        <line x1="5" y1="19" x2="5" y2="5"></line>
                      </svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setIsPlaying(!isPlaying)
                      }}
                    >
                      {isPlaying ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <rect x="6" y="4" width="4" height="16"></rect>
                          <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      )}
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <polygon points="5 4 15 12 5 20 5 4"></polygon>
                        <line x1="19" y1="5" x2="19" y2="19"></line>
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sponsored Section */}
            <Card className={`bg-gradient-to-br ${themeStyles.gradientFrom} ${themeStyles.gradientTo} text-white`}>
              <CardHeader>
                <CardTitle className="text-base">Sponsored</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <h3 className="font-bold text-lg mb-2">Upgrade to K-Clash Pro</h3>
                  <p className="text-sm mb-4 opacity-90">Get exclusive access to premium features and tournaments</p>
                  <Button variant="secondary" className="w-full">
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
