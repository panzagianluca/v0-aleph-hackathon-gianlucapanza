import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatBytes, formatDuration, generateCID, validateCID } from "@cid-sentinel/core"
import type { DashboardMetrics, PackRef } from "@cid-sentinel/core"

// Mock data for demonstration
const mockMetrics: DashboardMetrics = {
  totalPackages: 1247,
  verifiedPackages: 1198,
  failedVerifications: 49,
  lastUpdate: new Date(),
  sloCompliance: 96.1,
}

const mockPackages: PackRef[] = [
  {
    cid: generateCID("react@18.3.1"),
    name: "react",
    version: "18.3.1",
    hash: "sha256:abc123...",
    size: 2048576,
    timestamp: new Date(Date.now() - 3600000),
    signature: "ed25519:def456...",
  },
  {
    cid: generateCID("next@14.2.5"),
    name: "next",
    version: "14.2.5",
    hash: "sha256:xyz789...",
    size: 15728640,
    timestamp: new Date(Date.now() - 7200000),
    signature: "ed25519:ghi789...",
  },
  {
    cid: generateCID("tailwindcss@4.0.0"),
    name: "tailwindcss",
    version: "4.0.0",
    hash: "sha256:uvw012...",
    size: 5242880,
    timestamp: new Date(Date.now() - 10800000),
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">CID Sentinel</h1>
              <p className="text-muted-foreground mt-1">Decentralized Content Integrity Dashboard</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              Aleph Hackathon 2025
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.totalPackages.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{mockMetrics.verifiedPackages.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{mockMetrics.failedVerifications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">SLO Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{mockMetrics.sloCompliance}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Packages */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Package Verifications</CardTitle>
            <CardDescription>Latest packages verified through the CID Sentinel network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPackages.map((pkg) => (
                <div key={pkg.cid} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{pkg.name}</h3>
                      <Badge variant="outline">v{pkg.version}</Badge>
                      {pkg.signature && (
                        <Badge variant="secondary" className="text-xs">
                          Signed
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="font-mono text-xs">CID: {pkg.cid}</div>
                      <div className="flex gap-4">
                        <span>Size: {formatBytes(pkg.size)}</span>
                        <span>Verified: {formatDuration(Date.now() - pkg.timestamp.getTime())} ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${validateCID(pkg.cid) ? "bg-green-500" : "bg-red-500"}`} />
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Components</CardTitle>
              <CardDescription>Status of CID Sentinel infrastructure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Web Dashboard</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>API Server</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Smart Contracts</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Deployed
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ed25519 Signing</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" variant="default">
                  Verify New Package
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  View SLO Reports
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  Manage Verifiers
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  Export Audit Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>Built for Aleph Hackathon 2025 • Powered by Next.js, Foundry & Ed25519</div>
            <div>Last updated: {mockMetrics.lastUpdate.toLocaleTimeString()}</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
