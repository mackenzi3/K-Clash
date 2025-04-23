import { MainNav } from "@/components/main-nav"
import { ClanWarsComponent } from "@/components/clan-wars-component"
import { Footer } from "@/components/footer"

export default function ClanWarsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <ClanWarsComponent />
      </main>
      <Footer />
    </div>
  )
}
