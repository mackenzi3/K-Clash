"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Apply theme class on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("k-clash-theme") || "default"
    if (["default", "pink", "blue", "green", "orange"].includes(savedTheme)) {
      document.documentElement.classList.add(`theme-${savedTheme}`)
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
