import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function RootPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="text-sm">
            Aleph Hackathon 2025
          </Badge>
          <h1 className="text-4xl font-bold text-foreground">CID Sentinel</h1>
          <p className="text-xl text-muted-foreground">Decentralized Content Integrity Dashboard</p>
          <p className="text-muted-foreground">
            A comprehensive solution for tracking and verifying content integrity using CIDs, SLOs, and Ed25519
            signatures.
          </p>
        </div>

        {/* Monorepo Apps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Web Dashboard
              </CardTitle>
              <CardDescription>Main dashboard for content integrity monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Next.js 14 App Router with Tailwind CSS, wagmi/viem integration, and real-time metrics.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/dashboard">Open Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                API Server
              </CardTitle>
              <CardDescription>Background services and cron jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Next.js API routes for automated verification tasks and blockchain integration.
                </p>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/api">View API Status</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Tech Stack</CardTitle>
            <CardDescription>Built with modern web3 technologies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <div className="font-medium">Frontend</div>
                <div className="text-muted-foreground">Next.js 14</div>
                <div className="text-muted-foreground">Tailwind CSS</div>
                <div className="text-muted-foreground">shadcn/ui</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Blockchain</div>
                <div className="text-muted-foreground">Wagmi</div>
                <div className="text-muted-foreground">Viem</div>
                <div className="text-muted-foreground">Foundry</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Crypto</div>
                <div className="text-muted-foreground">Ed25519</div>
                <div className="text-muted-foreground">Noble Crypto</div>
                <div className="text-muted-foreground">CID Validation</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">Build Tools</div>
                <div className="text-muted-foreground">Turbo</div>
                <div className="text-muted-foreground">pnpm</div>
                <div className="text-muted-foreground">TypeScript</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start */}
        <div className="text-center space-y-4">
          <Button size="lg" asChild>
            <Link href="/dashboard">Launch Dashboard</Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Ready to monitor content integrity • Built for Aleph Hackathon 2025
          </p>
        </div>
      </div>
    </div>
  )
}
