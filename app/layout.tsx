import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider as NextThemesProvider } from "@/components/theme-provider"
import { ThemeProvider } from "@/contexts/theme-context"
import { AppProvider } from "@/contexts/app-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "K-Clash | Kenya's Premier Gaming Platform",
  description: "Compete in 1v1 battles, clan wars, and share your gaming moments with Kenya's gaming community.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#8b5cf6",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ThemeProvider>
            <AppProvider>
              {children}
              <Toaster />
            </AppProvider>
          </ThemeProvider>
        </NextThemesProvider>
      </body>
    </html>
  )
}
