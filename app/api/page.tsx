import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ApiStatusPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">CID Sentinel API</h1>
          <p className="text-muted-foreground">Background services and automation endpoints</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
              <CardDescription>Current status of API services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>API Server</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cron Jobs</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Running
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Blockchain Sync</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Endpoints</CardTitle>
              <CardDescription>API routes for integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm font-mono">
                <div>/api/verify - Package verification</div>
                <div>/api/slo - SLO management</div>
                <div>/api/cron - Scheduled tasks</div>
                <div>/api/health - Health check</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
