"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { useNotifications } from "@/contexts/notification-context"
import {
  Users,
  Files,
  HardDrive,
  Wifi,
  WifiOff,
  Activity,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data
const mockPeers = [
  { id: "peer_1a2b3c", status: "online", latency: 45 },
  { id: "peer_4d5e6f", status: "online", latency: 78 },
  { id: "peer_7g8h9i", status: "offline", latency: null },
  { id: "peer_0j1k2l", status: "online", latency: 123 },
  { id: "peer_3m4n5o", status: "online", latency: 67 },
]

const mockLogs = [
  { time: "14:32:15", type: "info", message: "File 'document.pdf' successfully backed up to 3 peers" },
  { time: "14:31:42", type: "success", message: "New peer peer_3m4n5o connected" },
  { time: "14:30:18", type: "warning", message: "Peer peer_7g8h9i disconnected" },
  { time: "14:29:55", type: "info", message: "Chunk verification completed for 'image.jpg'" },
  { time: "14:28:33", type: "info", message: "Storage quota updated to 50GB" },
]

export default function Dashboard() {
  const [showLogs, setShowLogs] = useState(false)
  const [stats, setStats] = useState({
    connectedPeers: 0,
    filesBackedUp: 0,
    storageUsed: 0,
  })
  const { addNotification } = useNotifications()

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const newConnectedPeers = mockPeers.filter((p) => p.status === "online").length
      const newFilesBackedUp = Math.floor(Math.random() * 50) + 150
      const newStorageUsed = Math.floor(Math.random() * 10) + 25

      // Add notification for new peer connections
      if (newConnectedPeers > stats.connectedPeers) {
        addNotification({
          title: "New Peer Connected",
          message: `A new peer has joined your network. Total: ${newConnectedPeers}`,
          type: "success",
        })
      }

      setStats({
        connectedPeers: newConnectedPeers,
        filesBackedUp: newFilesBackedUp,
        storageUsed: newStorageUsed,
      })
    }, 10000)

    // Initial load
    setStats({
      connectedPeers: mockPeers.filter((p) => p.status === "online").length,
      filesBackedUp: 167,
      storageUsed: 28.5,
    })

    return () => clearInterval(interval)
  }, [stats.connectedPeers, addNotification])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back to MirrorNet. Your files are secure and distributed.
          </p>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl glass">
          <Shield className="h-6 w-6 text-green-500 animate-pulse-glow" />
          <div>
            <span className="text-sm font-medium text-green-500">Network Secure</span>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card-hover gradient-primary text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Connected Peers</CardTitle>
            <Users className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.connectedPeers}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-white/80" />
              <p className="text-xs text-white/80">+2 from last hour</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover gradient-secondary text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Files Backed Up</CardTitle>
            <Files className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.filesBackedUp}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-white/80" />
              <p className="text-xs text-white/80">+12 from yesterday</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.storageUsed}GB</div>
            <Progress value={stats.storageUsed} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2">of 100GB available</p>
          </CardContent>
        </Card>
      </div>

      {/* Peer Status */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Peer Network Status
          </CardTitle>
          <CardDescription>Real-time status of connected peers in your network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockPeers.map((peer, index) => (
              <div
                key={peer.id}
                className={cn(
                  "flex items-center justify-between p-4 border rounded-xl transition-all duration-300 hover:scale-105",
                  peer.status === "online"
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  {peer.status === "online" ? (
                    <div className="relative">
                      <Wifi className="h-5 w-5 text-green-500" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                    </div>
                  ) : (
                    <WifiOff className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{peer.id}</p>
                    {peer.latency && (
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{peer.latency}ms</p>
                      </div>
                    )}
                  </div>
                </div>
                <Badge
                  variant={peer.status === "online" ? "default" : "secondary"}
                  className={peer.status === "online" ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {peer.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Logs */}
      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                System Logs
              </CardTitle>
              <CardDescription>Recent activity and system events</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLogs(!showLogs)}
              className="transition-all duration-200 hover:scale-105"
            >
              {showLogs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showLogs ? "Hide" : "Show"} Logs
            </Button>
          </div>
        </CardHeader>
        {showLogs && (
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {mockLogs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-muted-foreground font-mono text-xs bg-background px-2 py-1 rounded">
                      {log.time}
                    </span>
                    <Badge
                      variant={
                        log.type === "success" ? "default" : log.type === "warning" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {log.type}
                    </Badge>
                    <span className="flex-1 text-sm">{log.message}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
