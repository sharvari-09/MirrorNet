"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Settings,
  Key,
  HardDrive,
  Shield,
  Download,
  Upload,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sun, Moon, Laptop } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [storageQuota, setStorageQuota] = useState([50])
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)
  const [privateKey, setPrivateKey] = useState(
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB\nUikQpTzW9BqtXTEDcLCUzs2VWQvqyAsxO36POKy42E4xzHiCxVAMpz0gJ1TSsI1w\nYFAKdT1IvT3AyeR8wEtnUMas6+UuukjRkv4TEY2NKr9YuvJGaUI6RFXOHcmBUUaC\n8aPaP0TI4BcKYid4ZSWUtfSMVxNWP5QaFSM9SxGo/doDGkAqT7zUWOC3iqBnFLU+\nBwZXRi4JTrLFBFd5YDKJ4ydIynNh8aEFmWjNkTyrI4p3AaZlkMxjK329Xz7MYn6F\nLD+OlQNBhuTdgfrtIwlmlaZHVbBfHjcEAhUUQWNGl2yIaRhebDel97LFSOLyagHh\ncp/x1H/VAgMBAAECggEBAKTmjaS6tkK8BlPXClTQ2vpz/N6uxDeS35mXpqasqskV\nlaAidgg/sWqpjXDbXr93otIMLlWsM+X0CqMDgSXKejLS2jx4GDjI1ZplJkO4Y/vT\nM8YQb7wUFiJjNQnBNiMQBOwWbwi5NkmFwkxHzAJeo8+PVQkNVTDbNhLpGjI2a+fW\nYP56+2kkmM2NvYFGe9k+2MhLuBxXEBVd+3oEDNuOxQjGh1Bl4J/Bb7DoCcCVa6YK\nRHrFBGDX2RnbqAQdEMBRBrR4htFJn+E3+/7TgNNjicQkOht5bqkFLEyFyMLAMRfT\nOqFOu+TwTxVhvzKSPmLO0Lsw4EqhcTwMJDvQ+3vLiEECgYEA5ry7rUKAgiTNpHrE\nQgGx/xIYdvuNFSAHnRABXKOhB1Tc1MCRcoXiJLEhCJ0pRkgw0BIoxVmZ2SiM0JQB\nVBEDxMxHXAFdBqpQM1zWOjg+u+DmFBdlbJ3zHm+tau+2eMHg45k9sdpyxaGdYhvT\nTLfQaxHEqY7isAmv1eDl6VQXuQECgYEA0GNanWYb6c+6dVEaE4w4DON5QgbpZDZ4\nBcMnaYzxnffBQTjXfeqI1XuP7Yx4htXpKs15qS/7SzSHlHiHXenMuBYjvCE6Ea9T\nUzj2cR0bd7lIgcBINTBFxnhgHDfKoQa5Ap7hQRl2cqQFaRz4BrJ0liwhFG6Vqn9Y\nWQM+nFkxeaUCgYEAyq7WPUA+7myoW8uGPlriFkoLVTYKPEUtgoXAacnLUQVnPakY\nwSNraqt7TdwruGTNgqbcZSPUtfn7MLnBqkbVx8Lg4VmZLp7W3HcKnyRgM2SzDxQ2\nZQoMhOmqZWmvGHdNOzinTlYBhjEoOqwuqp+lgGY5jGM/SFXuOM+4R6+Zq0ECgYAT\nkS4cO6+fWDuLwHcmM0pO+o+zd7K1fJyWVJ0N5owHxuoOvnBiTSjVHOpJUwe/wuCm\nV2QUpmyOP3NluVwxV9KXC3yMcnDe5ypCqUmvphlBGpXrpkUekF7dQewjxOooDTyQ\nEhxTqhNkPMmND7j2ZB9EBzkp7mADTzNINKjxMQKBgBGFfVBeoMGiSdnKhKXwqCuY\nOKGGfSr+eiu5JXbPf4/DydB2Du83q7L1zdZ1hI+03TJ9HbGlBnpD8AcJpVcqaGMq\njA3P0W0qRajaXyHwuCcjn1Lade8cuynsf6kVjH0Sr5aTGMQ5chMtxNUH3RmPa8qP\n54c1entJi6d9M5B0F7bM\n-----END PRIVATE KEY-----",
  )

  const handleGenerateKey = async () => {
    setIsGeneratingKey(true)
    // Simulate key generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate a new mock key
    const newKey =
      "-----BEGIN PRIVATE KEY-----\n" +
      Array.from({ length: 20 }, () =>
        Array.from(
          { length: 64 },
          () => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[Math.floor(Math.random() * 64)],
        ).join(""),
      ).join("\n") +
      "\n-----END PRIVATE KEY-----"

    setPrivateKey(newKey)
    setIsGeneratingKey(false)
  }

  const handleCopyKey = () => {
    navigator.clipboard.writeText(privateKey)
  }

  const handleExportKey = () => {
    const blob = new Blob([privateKey], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "mirrornet-private-key.pem"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportKey = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pem,.key,.txt"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          setPrivateKey(content)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your MirrorNet client and manage your identity.</p>
      </div>

      {/* Identity Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Identity Management
          </CardTitle>
          <CardDescription>Manage your cryptographic identity and private keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your private key is used to encrypt and decrypt your files. Keep it secure and never share it with anyone.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="private-key">Private Key</Label>
            <div className="relative">
              <Textarea
                id="private-key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="font-mono text-xs min-h-[120px]"
                type={showPrivateKey ? "text" : "password"}
                placeholder="Your private key will appear here..."
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
              >
                {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate New Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Generate New Private Key
                  </DialogTitle>
                  <DialogDescription>
                    This will generate a new private key and replace your current one.
                    <strong className="text-red-600"> You will lose access to all previously encrypted files</strong>{" "}
                    unless you have backed up your current key.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {}}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateKey}
                    disabled={isGeneratingKey}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isGeneratingKey ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate New Key"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={handleImportKey}>
              <Upload className="h-4 w-4 mr-2" />
              Import Key
            </Button>

            <Button variant="outline" onClick={handleExportKey}>
              <Download className="h-4 w-4 mr-2" />
              Export Key
            </Button>

            <Button variant="outline" onClick={handleCopyKey}>
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Storage Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Settings
          </CardTitle>
          <CardDescription>Configure how much storage you want to offer to the network</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storage-quota">Storage Quota: {storageQuota[0]} GB</Label>
            <Slider
              id="storage-quota"
              min={1}
              max={500}
              step={1}
              value={storageQuota}
              onValueChange={setStorageQuota}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1 GB</span>
              <span>500 GB</span>
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              You are currently offering {storageQuota[0]} GB of storage to the network. This helps other users backup
              their files while earning you network reputation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel of your MirrorNet client</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {theme === "light" && <Sun className="mr-2 h-4 w-4" />}
                  {theme === "dark" && <Moon className="mr-2 h-4 w-4" />}
                  {theme === "system" && <Laptop className="mr-2 h-4 w-4" />}
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Laptop className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Network Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Network Settings
          </CardTitle>
          <CardDescription>Configure network and connection preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="listen-port">Listen Port</Label>
              <Input id="listen-port" type="number" placeholder="8080" defaultValue="8080" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-peers">Max Peers</Label>
              <Input id="max-peers" type="number" placeholder="50" defaultValue="50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bootstrap-nodes">Bootstrap Nodes</Label>
            <Textarea
              id="bootstrap-nodes"
              placeholder="Enter bootstrap node addresses, one per line..."
              defaultValue="bootstrap1.mirrornet.io:8080&#10;bootstrap2.mirrornet.io:8080&#10;bootstrap3.mirrornet.io:8080"
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button size="lg">Save Settings</Button>
      </div>
    </div>
  )
}
