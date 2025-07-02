"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Download,
  MoreHorizontal,
  FileText,
  ImageIcon,
  Video,
  Music,
  Calendar,
  Users,
  HardDrive,
  Trash2,
  Eye,
} from "lucide-react"

interface BackedUpFile {
  id: string
  name: string
  type: string
  size: number
  dateAdded: string
  chunks: number
  peers: string[]
  status: "available" | "partial" | "unavailable"
}

const mockFiles: BackedUpFile[] = [
  {
    id: "1",
    name: "presentation.pdf",
    type: "application/pdf",
    size: 2048000,
    dateAdded: "2024-01-15",
    chunks: 8,
    peers: ["peer_1a2b3c", "peer_4d5e6f", "peer_0j1k2l"],
    status: "available",
  },
  {
    id: "2",
    name: "vacation_photos.zip",
    type: "application/zip",
    size: 15728640,
    dateAdded: "2024-01-14",
    chunks: 15,
    peers: ["peer_1a2b3c", "peer_7g8h9i", "peer_3m4n5o"],
    status: "partial",
  },
  {
    id: "3",
    name: "demo_video.mp4",
    type: "video/mp4",
    size: 52428800,
    dateAdded: "2024-01-13",
    chunks: 25,
    peers: ["peer_4d5e6f", "peer_0j1k2l", "peer_3m4n5o"],
    status: "available",
  },
  {
    id: "4",
    name: "music_collection.mp3",
    type: "audio/mp3",
    size: 8388608,
    dateAdded: "2024-01-12",
    chunks: 12,
    peers: ["peer_1a2b3c", "peer_4d5e6f"],
    status: "unavailable",
  },
  {
    id: "5",
    name: "project_backup.tar.gz",
    type: "application/gzip",
    size: 104857600,
    dateAdded: "2024-01-11",
    chunks: 42,
    peers: ["peer_1a2b3c", "peer_4d5e6f", "peer_0j1k2l", "peer_3m4n5o"],
    status: "available",
  },
]

export default function FilesPage() {
  const [files, setFiles] = useState<BackedUpFile[]>(mockFiles)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (type.startsWith("video/")) return <Video className="h-4 w-4" />
    if (type.startsWith("audio/")) return <Music className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>
      case "partial":
        return <Badge variant="secondary">Partial</Badge>
      case "unavailable":
        return <Badge variant="destructive">Unavailable</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || file.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleRestore = (fileId: string) => {
    // Simulate restore process
    console.log(`Restoring file ${fileId}`)
  }

  const handleDelete = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const totalFiles = files.length
  const totalSize = files.reduce((acc, file) => acc + file.size, 0)
  const availableFiles = files.filter((f) => f.status === "available").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Files</h1>
        <p className="text-muted-foreground">Manage and restore your backed up files from the distributed network.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFiles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableFiles}</div>
            <p className="text-xs text-muted-foreground">{Math.round((availableFiles / totalFiles) * 100)}% of files</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>File Management</CardTitle>
          <CardDescription>Search and filter your backed up files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Filter: {filterStatus === "all" ? "All Files" : filterStatus}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Files</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("available")}>Available</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("partial")}>Partial</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("unavailable")}>Unavailable</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Files Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Chunks</TableHead>
                  <TableHead>Peers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{file.type}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {file.dateAdded}
                      </div>
                    </TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell>{file.chunks}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {file.peers.slice(0, 2).map((peer, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {peer.slice(-6)}
                          </Badge>
                        ))}
                        {file.peers.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{file.peers.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(file.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleRestore(file.id)}
                            disabled={file.status === "unavailable"}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(file.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No files found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "Start by backing up some files"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
