"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { LoadingSpinner } from "@/components/loading-spinner"

interface SiteLayoutProps {
  children: React.ReactNode
  hideNav?: boolean
  hideFooter?: boolean
}

export function SiteLayout({ children, hideNav = false, hideFooter = false }: SiteLayoutProps) {
  const [isPageLoading, setIsPageLoading] = useState(true)
  const pathname = usePathname()

  // Simulate page loading for better UX
  useEffect(() => {
    setIsPageLoading(true)
    const timer = setTimeout(() => {
      setIsPageLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      {!hideNav && (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <MainNav />
          </div>
        </header>
      )}

      <main className="flex-1">
        {isPageLoading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <LoadingSpinner text="Loading..." />
          </div>
        ) : (
          children
        )}
      </main>

      {!hideFooter && <Footer />}
    </div>
  )
}
