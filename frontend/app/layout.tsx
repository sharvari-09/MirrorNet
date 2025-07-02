import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { ThemeProvider } from "@/contexts/theme-context"
import { NotificationProvider } from "@/contexts/notification-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MirrorNet - Decentralized Cloud Backup",
  description: "Secure, encrypted, peer-to-peer file backup system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="mirrornet-ui-theme">
          <NotificationProvider>
            <div className="min-h-screen bg-background transition-colors duration-300">
              <Header />
              <div className="flex">
                <aside className="hidden w-72 border-r bg-background/50 backdrop-blur md:block">
                  <Sidebar />
                </aside>
                <main className="flex-1 p-8">{children}</main>
              </div>
            </div>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
