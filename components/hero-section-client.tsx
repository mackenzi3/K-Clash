"use client"

import { Button } from "@/components/ui/button"
import { getLandingContentClient } from "@/lib/landing-data"
import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function HeroSectionClient() {
  const [data, setData] = useState<{
    hero: any
    stats: any[]
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const landingData = await getLandingContentClient()
        setData(landingData)
      } catch (error) {
        console.error("Error fetching landing data:", error)
        setError("Failed to load content. Please try refreshing the page.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 py-12 md:py-16">
        <div className="container relative px-4 md:px-6">
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-pulse flex flex-col items-center space-y-4 w-full max-w-md">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="flex space-x-4 w-full justify-center mt-4">
                <div className="h-10 bg-muted rounded w-32"></div>
                <div className="h-10 bg-muted rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 py-12 md:py-16">
        <div className="container relative px-4 md:px-6">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }

  if (!data) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 py-12 md:py-16">
        <div className="container relative px-4 md:px-6 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
            Welcome to K-Clash
          </h1>
          <p className="mt-4 max-w-[600px] mx-auto text-muted-foreground md:text-xl">
            Kenya's premier gaming platform for competitive battles and community
          </p>
        </div>
      </section>
    )
  }

  const { hero, stats } = data

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 py-12 md:py-16">
      <div className="absolute inset-0 bg-[url(/grid-pattern.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="container relative px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                {hero.title}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">{hero.subtitle}</p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Get Started
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full overflow-hidden rounded-lg bg-muted md:h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm">
                <div className="flex h-full items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-2 md:gap-8 md:p-10">
                    {stats.map((stat, i) => (
                      <div
                        key={stat.id}
                        className="flex flex-col items-center justify-center rounded-lg bg-background/80 p-4 shadow-lg backdrop-blur"
                      >
                        <div className="text-2xl font-bold text-primary md:text-4xl">{stat.value}</div>
                        <div className="text-xs text-muted-foreground md:text-sm">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
