"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, Upload, Files, Users, Settings, Menu, Shield } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Backup",
    href: "/backup",
    icon: Upload,
  },
  {
    name: "My Files",
    href: "/files",
    icon: Files,
  },
  {
    name: "Peers",
    href: "/peers",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 h-full", className)}>
      <div className="space-y-4 py-4 h-full">
        <div className="px-3 py-2 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8 p-3 rounded-xl gradient-primary text-white">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg backdrop-blur">
              <Shield className="h-6 w-6 animate-float" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">MirrorNet</h2>
              <p className="text-xs text-white/80">Decentralized Backup</p>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-all duration-200 hover:scale-105",
                    pathname === item.href && "bg-primary/10 text-primary border border-primary/20 shadow-lg",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Status indicator at bottom */}
          <div className="mt-auto p-3 rounded-lg glass">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 w-72">
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <Sidebar />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
