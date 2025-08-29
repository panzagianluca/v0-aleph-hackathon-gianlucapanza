// SLO (Service Level Objective) types
export interface SLO {
  id: string
  name: string
  target: number // percentage (0-100)
  window: string // time window (e.g., "24h", "7d", "30d")
  description?: string
  createdAt: Date
  updatedAt: Date
}

// PackRef (Package Reference) types
export interface PackRef {
  cid: string // Content Identifier
  name: string
  version: string
  hash: string
  size: number
  timestamp: Date
  signature?: string
  metadata?: Record<string, any>
}

// Content integrity verification result
export interface VerificationResult {
  cid: string
  isValid: boolean
  timestamp: Date
  signature?: string
  error?: string
}

// Dashboard metrics
export interface DashboardMetrics {
  totalPackages: number
  verifiedPackages: number
  failedVerifications: number
  lastUpdate: Date
  sloCompliance: number // percentage
}
