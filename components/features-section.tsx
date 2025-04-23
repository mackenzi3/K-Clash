import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GamepadIcon as GameController, Users, Trophy, Zap } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features That Set Us Apart</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Experience gaming like never before with our cutting-edge platform designed for Kenyan gamers.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
          <Card className="border-0 shadow-lg transition-all hover:shadow-xl">
            <CardHeader className="pb-2">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <GameController className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Competitive Arena</CardTitle>
              <CardDescription>
                Challenge players across Kenya in various game titles and climb the leaderboards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our matchmaking system ensures fair and exciting matches every time. Track your progress and improve
                your skills.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg transition-all hover:shadow-xl">
            <CardHeader className="pb-2">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Clan Wars</CardTitle>
              <CardDescription>
                Form or join clans with friends and compete in exclusive clan tournaments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Build your team strategy, coordinate with clan members, and dominate the competition to earn special
                rewards.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg transition-all hover:shadow-xl">
            <CardHeader className="pb-2">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Tournaments & Prizes</CardTitle>
              <CardDescription>Participate in daily, weekly, and monthly tournaments with real prizes.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Showcase your skills and win cash prizes, gaming gear, and exclusive in-game items through our sponsored
                tournaments.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg transition-all hover:shadow-xl">
            <CardHeader className="pb-2">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Chill Hub</CardTitle>
              <CardDescription>
                Connect with fellow gamers in our social space designed for the Kenyan gaming community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Share gaming clips, discuss strategies, find teammates, and stay updated with the latest gaming news and
                events.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
