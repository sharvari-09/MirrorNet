"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  Wifi,
  WifiOff,
  Activity,
  Clock,
  HardDrive,
  MoreHorizontal,
  Search,
  RefreshCw,
  UserPlus,
  Shield,
  Zap,
} from "lucide-react"

interface Peer {
  id: string
  address: string
  status: "online" | "offline" | "connecting"
  latency: number | null
  lastSeen: string
  storageOffered: number
  storageUsed: number
  filesShared: number
  reputation: number
  version: string
}

export default function PeersPage() {
  const [peers, setPeers] = useState<Peer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-500" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />
      case "connecting":
        return <Activity className="h-4 w-4 text-yellow-500 animate-pulse" />
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500">Online</Badge>
      case "offline":
        return <Badge variant="secondary">Offline</Badge>
      case "connecting":
        return <Badge className="bg-yellow-500">Connecting</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getReputationColor = (reputation: number) => {
    if (reputation >= 95) return "text-green-500"
    if (reputation >= 85) return "text-yellow-500"
    return "text-red-500"
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate network refresh
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simulate some status changes
    setPeers((prev) =>
      prev.map((peer) => ({
        ...peer,
        latency: peer.status === "online" ? Math.floor(Math.random() * 200) + 20 : null,
        lastSeen: peer.status === "online" ? new Date().toLocaleString() : peer.lastSeen,
      })),
    )

    setIsRefreshing(false)
  }

  const filteredPeers = peers.filter(
    (peer) =>
      peer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      peer.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const onlinePeers = peers.filter((p) => p.status === "online").length
  const totalStorage = peers.reduce((acc, peer) => acc + peer.storageOffered, 0)
  const usedStorage = peers.reduce((acc, peer) => acc + peer.storageUsed, 0)

  // --- Networking config ---
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const port = '8080'; // your backend port on Codespaces
  const url = `${protocol}//${host}:${port}/api/peers`;

  // --- Fetch peers on mount ---
  useEffect(() => {
    const fetchPeers = async () => {
      try {
        // Use correct Codespaces endpoint for backend
        const res = await fetch("https://urban-space-memory-9p6p9grvjj2xqrj-8080.app.github.dev/api/peers");
        const data = await res.json();
        setPeers(data.peers);
      } catch (err) {
        console.error("Failed to fetch peers:", err);
      }
    };
    fetchPeers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Peer Network</h1>
          <p className="text-muted-foreground">Monitor and manage connections to peers in the distributed network.</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Peers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{peers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <Wifi className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{onlinePeers}</div>
            <p className="text-xs text-muted-foreground">{peers.length > 0 ? Math.round((onlinePeers / peers.length) * 100) : 0}% connected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(totalStorage)}</div>
            <p className="text-xs text-muted-foreground">{formatFileSize(usedStorage)} used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {peers.filter((p) => p.latency).length > 0
                ? Math.round(
                    peers.filter((p) => p.latency).reduce((acc, p) => acc + (p.latency || 0), 0) /
                      peers.filter((p) => p.latency).length,
                  )
                : 0}
              ms
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peer List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Connected Peers
              </CardTitle>
              <CardDescription>Live status of all peers in your network</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Peer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search peers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Peer ID</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Latency</TableHead>
                  <TableHead>Storage</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead>Reputation</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPeers.map((peer) => (
                  <TableRow key={peer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getStatusIcon(peer.status)}
                        <div>
                          <p className="font-mono text-sm">{peer.id}</p>
                          <p className="text-xs text-muted-foreground">v{peer.version}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{peer.address}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(peer.status)}</TableCell>
                    <TableCell>
                      {peer.latency ? (
                        <span className="text-sm">{peer.latency}ms</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {formatFileSize(peer.storageUsed)} / {formatFileSize(peer.storageOffered)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((peer.storageUsed / peer.storageOffered) * 100)}% used
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{peer.filesShared}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className={`h-4 w-4 ${getReputationColor(peer.reputation)}`} />
                        <span className={`font-medium ${getReputationColor(peer.reputation)}`}>{peer.reputation}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {new Date(peer.lastSeen).toLocaleTimeString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Test Connection</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Disconnect</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPeers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No peers found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "No peers are currently connected"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
