"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Gamepad2, Trophy, DollarSign, Clock, Users, Swords } from "lucide-react"

export function ArenaComponent() {
  const [activeTab, setActiveTab] = useState("available")

  const availableMatches = [
    {
      id: 1,
      game: "Call of Duty: Warzone",
      player: "KingSlayer254",
      stake: 200,
      time: "Now",
      players: "1v1",
      level: "Intermediate",
    },
    {
      id: 2,
      game: "FIFA 23",
      player: "FootballMaster",
      stake: 500,
      time: "Now",
      players: "1v1",
      level: "Expert",
    },
    {
      id: 3,
      game: "Fortnite",
      player: "BuilderPro",
      stake: 100,
      time: "5 min",
      players: "1v1",
      level: "Beginner",
    },
    {
      id: 4,
      game: "PUBG Mobile",
      player: "SharpShooter",
      stake: 300,
      time: "10 min",
      players: "1v1",
      level: "Intermediate",
    },
  ]

  const upcomingTournaments = [
    {
      id: 1,
      name: "Weekend Warrior Cup",
      game: "Call of Duty: Warzone",
      prize: 5000,
      entryFee: 200,
      startDate: "Sat, 10 Apr",
      participants: 32,
      status: "Registering",
    },
    {
      id: 2,
      name: "FIFA Champions League",
      game: "FIFA 23",
      prize: 10000,
      entryFee: 500,
      startDate: "Sun, 11 Apr",
      participants: 64,
      status: "Registering",
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">1v1 Arena</h1>
          <p className="text-muted-foreground">Challenge players to 1v1 battles with real money stakes</p>
        </div>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Available Matches</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="history">Match History</TabsTrigger>
          </TabsList>
          <TabsContent value="available" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Available Challenges</h2>
              <Button>
                <Swords className="mr-2 h-4 w-4" />
                Create Challenge
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableMatches.map((match) => (
                <Card key={match.id} className="futuristic-border">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{match.game}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center mt-1">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                              <AvatarFallback>{match.player.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{match.player}</span>
                          </div>
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-primary/10">
                        {match.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="flex flex-col items-center p-2 bg-secondary/50 rounded-md">
                        <DollarSign className="h-4 w-4 text-primary mb-1" />
                        <span className="text-xs text-muted-foreground">Stake</span>
                        <span className="font-medium">KSh {match.stake}</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-secondary/50 rounded-md">
                        <Clock className="h-4 w-4 text-primary mb-1" />
                        <span className="text-xs text-muted-foreground">Time</span>
                        <span className="font-medium">{match.time}</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-secondary/50 rounded-md">
                        <Users className="h-4 w-4 text-primary mb-1" />
                        <span className="text-xs text-muted-foreground">Type</span>
                        <span className="font-medium">{match.players}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Accept Challenge</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="tournaments" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Upcoming Tournaments</h2>
              <Button variant="outline">
                <Trophy className="mr-2 h-4 w-4" />
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingTournaments.map((tournament) => (
                <Card key={tournament.id} className="futuristic-border">
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{tournament.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Gamepad2 className="h-4 w-4 mr-1" />
                          {tournament.game}
                        </CardDescription>
                      </div>
                      <Badge className="bg-primary/20 text-primary border-primary/20">{tournament.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Prize Pool:</span>
                          <span className="font-medium">KSh {tournament.prize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entry Fee:</span>
                          <span className="font-medium">KSh {tournament.entryFee}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Start Date:</span>
                          <span className="font-medium">{tournament.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Participants:</span>
                          <span className="font-medium">{tournament.participants}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Register Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="history" className="pt-4">
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Match History</h3>
                <p className="text-muted-foreground mb-4">You haven't played any matches yet.</p>
                <Button>Find Opponents</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
