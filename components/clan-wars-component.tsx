"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, Search, Plus, Shield, Swords, Calendar, Clock, ChevronRight, UserPlus } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function ClanWarsComponent() {
  const [clans, setClans] = useState([
    {
      id: 1,
      name: "Nairobi Ninjas",
      tag: "NRB",
      logo: "/placeholder.svg?height=60&width=60",
      members: 12,
      points: 5678,
      rank: 1,
      wins: 34,
      losses: 8,
    },
    {
      id: 2,
      name: "Mombasa Marauders",
      tag: "MMB",
      logo: "/placeholder.svg?height=60&width=60",
      members: 10,
      points: 4532,
      rank: 2,
      wins: 28,
      losses: 12,
    },
    {
      id: 3,
      name: "Kisumu Kings",
      tag: "KSM",
      logo: "/placeholder.svg?height=60&width=60",
      members: 8,
      points: 3876,
      rank: 3,
      wins: 24,
      losses: 14,
    },
    {
      id: 4,
      name: "Eldoret Eagles",
      tag: "ELD",
      logo: "/placeholder.svg?height=60&width=60",
      members: 9,
      points: 3245,
      rank: 4,
      wins: 20,
      losses: 16,
    },
    {
      id: 5,
      name: "Nakuru Nobles",
      tag: "NKR",
      logo: "/placeholder.svg?height=60&width=60",
      members: 7,
      points: 2987,
      rank: 5,
      wins: 18,
      losses: 15,
    },
  ])

  const [wars, setWars] = useState([
    {
      id: 1,
      clan1: {
        name: "Nairobi Ninjas",
        tag: "NRB",
        logo: "/placeholder.svg?height=60&width=60",
      },
      clan2: {
        name: "Mombasa Marauders",
        tag: "MMB",
        logo: "/placeholder.svg?height=60&width=60",
      },
      status: "ongoing",
      score: "2-1",
      prize: 5000,
      startDate: "2023-04-08",
      endDate: "2023-04-10",
    },
    {
      id: 2,
      clan1: {
        name: "Kisumu Kings",
        tag: "KSM",
        logo: "/placeholder.svg?height=60&width=60",
      },
      clan2: {
        name: "Eldoret Eagles",
        tag: "ELD",
        logo: "/placeholder.svg?height=60&width=60",
      },
      status: "scheduled",
      score: "0-0",
      prize: 3000,
      startDate: "2023-04-12",
      endDate: "2023-04-14",
    },
    {
      id: 3,
      clan1: {
        name: "Nairobi Ninjas",
        tag: "NRB",
        logo: "/placeholder.svg?height=60&width=60",
      },
      clan2: {
        name: "Nakuru Nobles",
        tag: "NKR",
        logo: "/placeholder.svg?height=60&width=60",
      },
      status: "completed",
      score: "3-1",
      prize: 4000,
      startDate: "2023-04-01",
      endDate: "2023-04-03",
    },
  ])

  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clan Wars</h1>
            <p className="text-muted-foreground">Form or join clans and compete in epic clan battles</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search clans..." className="pl-8 w-full" />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Clan
            </Button>
          </div>
        </div>

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leaderboard">
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="wars">
              <Swords className="h-4 w-4 mr-2" />
              Active Wars
            </TabsTrigger>
            <TabsTrigger value="my-clan">
              <Shield className="h-4 w-4 mr-2" />
              My Clan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Clan Leaderboard</CardTitle>
                <CardDescription>Top clans ranked by points earned in clan wars</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {clans.map((clan) => (
                    <div key={clan.id} className="flex items-center">
                      <div className="w-8 text-center font-bold text-lg">{clan.rank}</div>
                      <Avatar className="h-12 w-12 mx-4">
                        <AvatarImage src={clan.logo} />
                        <AvatarFallback>{clan.tag}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="font-medium">{clan.name}</div>
                          <Badge variant="outline" className="ml-2">
                            {clan.tag}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-3 w-3 mr-1" />
                          {clan.members} members
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{clan.points}</div>
                        <div className="text-sm text-muted-foreground">
                          {clan.wins}W - {clan.losses}L
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="ml-2">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t border-border/40 pt-4">
                <Button variant="outline">View All Clans</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="wars" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wars.map((war) => (
                <Card key={war.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>Clan War #{war.id}</CardTitle>
                      <Badge
                        className={`${
                          war.status === "ongoing"
                            ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/20"
                            : war.status === "completed"
                              ? "bg-green-500/20 text-green-500 border-green-500/20"
                              : "bg-blue-500/20 text-blue-500 border-blue-500/20"
                        }`}
                      >
                        {war.status.charAt(0).toUpperCase() + war.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>Prize Pool: KSh {war.prize}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between py-4">
                      <div className="text-center">
                        <Avatar className="h-16 w-16 mx-auto">
                          <AvatarImage src={war.clan1.logo} />
                          <AvatarFallback>{war.clan1.tag}</AvatarFallback>
                        </Avatar>
                        <div className="mt-2 font-medium">{war.clan1.name}</div>
                        <div className="text-sm text-muted-foreground">[{war.clan1.tag}]</div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold mb-2">{war.score}</div>
                        <Badge variant="outline">{war.status === "scheduled" ? "Upcoming" : "Battle Score"}</Badge>
                      </div>

                      <div className="text-center">
                        <Avatar className="h-16 w-16 mx-auto">
                          <AvatarImage src={war.clan2.logo} />
                          <AvatarFallback>{war.clan2.tag}</AvatarFallback>
                        </Avatar>
                        <div className="mt-2 font-medium">{war.clan2.name}</div>
                        <div className="text-sm text-muted-foreground">[{war.clan2.tag}]</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {war.startDate} - {war.endDate}
                      </div>
                      {war.status === "ongoing" && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          In progress
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-border/40">
                    <Button className="w-full">
                      {war.status === "scheduled" ? "Watch" : war.status === "ongoing" ? "Watch Live" : "View Results"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-clan" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Nairobi Ninjas
                </CardTitle>
                <CardDescription>[NRB] • Rank #1 • 12 Members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Clan Points</div>
                    <div className="text-2xl font-bold">5,678</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                    <div className="text-2xl font-bold">81%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Wars</div>
                    <div className="text-2xl font-bold">34W - 8L</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Level Progress</span>
                    <span>Level 12</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">3,678 / 5,000 XP to Level 13</div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Upcoming Wars</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>KSM</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">vs Kisumu Kings</div>
                          <div className="text-xs text-muted-foreground">April 15 - 17</div>
                        </div>
                      </div>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>ELD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">vs Eldoret Eagles</div>
                          <div className="text-xs text-muted-foreground">April 20 - 22</div>
                        </div>
                      </div>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium">Members (12)</h3>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Invite
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex items-center p-2 bg-secondary/20 rounded-lg">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                          <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{i === 1 ? "KingSlayer254" : `Member${i}`}</div>
                          <div className="text-xs text-muted-foreground">
                            {i === 1 ? "Leader" : i < 4 ? "Officer" : "Member"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/40 flex justify-between">
                <Button variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Clan Settings
                </Button>
                <Button>
                  <Swords className="mr-2 h-4 w-4" />
                  Start War
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
