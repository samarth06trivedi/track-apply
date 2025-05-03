"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Debug to console
  useEffect(() => {
    if (mounted) {
      console.log("Current theme:", theme)
    }
  }, [theme, mounted])

  if (!mounted) {
    return (
      <button
        className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
        aria-label="Loading theme toggle"
      >
        <span className="sr-only">Loading theme toggle</span>
      </button>
    )
  }

  return (
    <button
      onClick={() => {
        const newTheme = theme === "dark" ? "light" : "dark"
        console.log("Setting theme to:", newTheme)
        setTheme(newTheme)
      }}
      className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-700"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-500" />}
    </button>
  )
}
