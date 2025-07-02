"use client"

import { MobileSidebar } from "./sidebar"
import { Button } from "@/components/ui/button"
import { NotificationCenter } from "@/components/ui/notification-center"
import { useTheme } from "@/contexts/theme-context"
import { Shield, Wifi, Sun, Moon, Laptop } from "lucide-react"

export function Header() {
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      case "system":
        return <Laptop className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MobileSidebar />

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>

          <nav className="flex items-center space-x-2">
            {/* Network Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/50 glass">
              <Wifi className="h-3 w-3 text-green-600 animate-pulse" />
              <span className="text-xs font-medium text-green-600">Network Online</span>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleTheme}
              className="relative transition-all duration-200 hover:scale-105"
              title={`Current theme: ${theme}. Click to cycle themes.`}
            >
              {getThemeIcon()}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Notifications */}
            <NotificationCenter />

            {/* Security Status */}
            <Button variant="ghost" size="sm" className="status-online">
              <Shield className="h-4 w-4 text-green-500" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
