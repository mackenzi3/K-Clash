"use client"

import { Button } from "@/components/ui/button"
import { getLandingContentClient } from "@/lib/landing-data"
import { useEffect, useState } from "react"

export function HeroSectionClient() {
  const [data, setData] = useState<{
    hero: any
    stats: any[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const landingData = await getLandingContentClient()
        setData(landingData)
      } catch (error) {
        console.error("Error fetching landing data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="py-12 md:py-16 text-center">Loading...</div>
  }

  if (!data) {
    return <div className="py-12 md:py-16 text-center">Failed to load content</div>
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
