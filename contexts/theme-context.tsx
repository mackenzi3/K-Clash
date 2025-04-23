"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Theme = "default" | "pink" | "blue" | "green" | "orange"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "default",
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("default")

  useEffect(() => {
    // Load theme from localStorage on client side
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme && ["default", "pink", "blue", "green", "orange"].includes(savedTheme)) {
      setTheme(savedTheme)
    }
  }, [])

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme)
    }
  }

  return <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
