import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background to-muted/30">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-10 text-center">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Kenya's Ultimate Gaming Platform
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Join thousands of Kenyan gamers competing in tournaments, forming clans, and connecting with the local
              gaming community.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/arena">Start Gaming</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
          <div className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-2">Featured Tournament</h3>
                <p className="mb-4">Kenya National Gaming Championship 2023</p>
                <Button variant="secondary" size="sm">
                  Register Now
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold">10,000+</div>
              <div className="text-sm text-muted-foreground">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-muted-foreground">Daily Matches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">KSh 1M+</div>
              <div className="text-sm text-muted-foreground">Monthly Prizes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">200+</div>
              <div className="text-sm text-muted-foreground">Active Clans</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
