import { sign, verify, getPublicKey } from "@noble/ed25519"

// Ed25519 signature utilities
export class Ed25519Signer {
  private privateKey: Uint8Array

  constructor(privateKey?: Uint8Array) {
    if (privateKey) {
      this.privateKey = privateKey
    } else {
      // Generate random private key for demo
      this.privateKey = crypto.getRandomValues(new Uint8Array(32))
    }
  }

  async getPublicKey(): Promise<Uint8Array> {
    return await getPublicKey(this.privateKey)
  }

  async sign(message: string | Uint8Array): Promise<Uint8Array> {
    const messageBytes = typeof message === "string" ? new TextEncoder().encode(message) : message
    return await sign(messageBytes, this.privateKey)
  }

  static async verify(signature: Uint8Array, message: string | Uint8Array, publicKey: Uint8Array): Promise<boolean> {
    const messageBytes = typeof message === "string" ? new TextEncoder().encode(message) : message
    return await verify(signature, messageBytes, publicKey)
  }

  // Convert signature to hex string for storage
  static signatureToHex(signature: Uint8Array): string {
    return Array.from(signature)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

  // Convert hex string back to signature
  static hexToSignature(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = Number.parseInt(hex.substr(i, 2), 16)
    }
    return bytes
  }
}
