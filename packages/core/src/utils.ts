// Utility functions for CID Sentinel
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

export function generateCID(content: string): string {
  // Simplified CID generation for demo purposes
  // In production, use proper IPFS CID generation
  const hash = btoa(content)
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 32)
  return `bafybei${hash.toLowerCase()}`
}

export function validateCID(cid: string): boolean {
  // Basic CID validation
  return /^bafy[a-z0-9]{52}$/.test(cid) || /^Qm[a-zA-Z0-9]{44}$/.test(cid)
}
