"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useTheme as useNextTheme } from "next-themes"

export type Theme = "default" | "pink" | "blue" | "green" | "orange"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  systemTheme: "light" | "dark" | undefined
  toggleColorMode: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "default",
  setTheme: () => {},
  systemTheme: undefined,
  toggleColorMode: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("default")
  const { theme: colorMode, setTheme: setColorMode, systemTheme } = useNextTheme()

  useEffect(() => {
    // Load theme from localStorage on client side
    const savedTheme = localStorage.getItem("k-clash-theme") as Theme
    if (savedTheme && ["default", "pink", "blue", "green", "orange"].includes(savedTheme)) {
      setThemeState(savedTheme)
    }
  }, [])

  const updateTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    if (typeof window !== "undefined") {
      localStorage.setItem("k-clash-theme", newTheme)

      // Apply theme-specific CSS variables
      const root = document.documentElement

      // Reset all theme-specific classes
      root.classList.remove("theme-default", "theme-pink", "theme-blue", "theme-green", "theme-orange")

      // Add the new theme class
      root.classList.add(`theme-${newTheme}`)
    }
  }

  const toggleColorMode = () => {
    setColorMode(colorMode === "dark" ? "light" : "dark")
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: updateTheme,
        systemTheme: systemTheme as "light" | "dark" | undefined,
        toggleColorMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
