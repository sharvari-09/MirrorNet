"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Shield, Users, CheckCircle, X, FileText, Video, Music, ImageIcon } from "lucide-react"
import { useNotifications } from "@/contexts/notification-context"

interface UploadFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: "uploading" | "encrypting" | "distributing" | "completed" | "error"
  chunks?: number
  peersDistributed?: string[]
}

export default function BackupPage() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const { addNotification } = useNotifications()

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

  const simulateUpload = (file: UploadFile) => {
    const steps = ["uploading", "encrypting", "distributing", "completed"] as const
    let currentStep = 0
    let progress = 0

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5

      if (progress >= 100) {
        progress = 100
        currentStep = Math.min(currentStep + 1, steps.length - 1)

        if (currentStep === steps.length - 1) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? {
                    ...f,
                    progress: 100,
                    status: "completed",
                    chunks: Math.floor(Math.random() * 10) + 5,
                    peersDistributed: ["peer_1a2b3c", "peer_4d5e6f", "peer_0j1k2l"],
                  }
                : f,
            ),
          )

          // Add success notification
          addNotification({
            title: "Backup Completed",
            message: `${file.name} has been successfully backed up to the network.`,
            type: "success",
          })

          clearInterval(interval)
          return
        }
        progress = 0
      }

      setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress, status: steps[currentStep] } : f)))
    }, 200)
  }

  const handleFileSelect = (selectedFiles: FileList) => {
    const newFiles: UploadFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "uploading",
    }))

    setFiles((prev) => [...prev, ...newFiles])
    newFiles.forEach(simulateUpload)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500"
      case "error":
        return "text-red-500"
      default:
        return "text-blue-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "uploading":
        return "Uploading..."
      case "encrypting":
        return "Encrypting..."
      case "distributing":
        return "Distributing to peers..."
      case "completed":
        return "Backup completed"
      case "error":
        return "Upload failed"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Backup Files</h1>
        <p className="text-muted-foreground">
          Upload and encrypt your files for distributed backup across the peer network.
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            File Upload
          </CardTitle>
          <CardDescription>Drag and drop files or click to select files for backup</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/10 scale-105 shadow-lg"
                : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/20"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="animate-float">
              <Upload className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Drop files here</h3>
            <p className="text-muted-foreground mb-6">or click to browse your computer</p>
            <Button
              size="lg"
              className="gradient-primary text-white border-0 hover:scale-105 transition-transform"
              onClick={() => {
                const input = document.createElement("input")
                input.type = "file"
                input.multiple = true
                input.onchange = (e) => {
                  const target = e.target as HTMLInputElement
                  if (target.files) {
                    handleFileSelect(target.files)
                  }
                }
                input.click()
              }}
            >
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Upload Progress
            </CardTitle>
            <CardDescription>Files are being encrypted and distributed to peers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getStatusColor(file.status)}`}>
                        {getStatusText(file.status)}
                      </span>
                      {file.status !== "completed" && (
                        <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <Progress value={file.progress} className="mb-2" />

                  {file.status === "completed" && file.chunks && file.peersDistributed && (
                    <Alert className="mt-3">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center gap-4 text-sm">
                          <span>✓ {file.chunks} chunks created</span>
                          <span>✓ Distributed to {file.peersDistributed.length} peers</span>
                          <div className="flex gap-1">
                            {file.peersDistributed.map((peer, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {peer}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Encryption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              All files are encrypted with AES-256 before being split into chunks and distributed across the peer
              network. Only you have the decryption key.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Files are automatically distributed across multiple peers for redundancy. Each chunk is stored on at least
              3 different peers for maximum availability.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
