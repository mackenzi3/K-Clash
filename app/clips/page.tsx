import { MainNav } from "@/components/main-nav"
import { ClipsComponentEnhanced } from "@/components/clips-component-enhanced"
import { Footer } from "@/components/footer"

export default function ClipsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <ClipsComponentEnhanced />
      </main>
      <Footer />
    </div>
  )
}
