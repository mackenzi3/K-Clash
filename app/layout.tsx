import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider as NextThemesProvider } from "@/components/theme-provider"
import { ThemeProvider } from "@/contexts/theme-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "K-Clash | Kenya's Premier Gaming Platform",
  description: "Compete in 1v1 battles, clan wars, and share your gaming moments with Kenya's gaming community.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/sounds/click.mp3" as="audio" />
        <link rel="preload" href="/sounds/hover.mp3" as="audio" />
      </head>
      <body className={inter.className}>
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </NextThemesProvider>
      </body>
    </html>
  )
}
