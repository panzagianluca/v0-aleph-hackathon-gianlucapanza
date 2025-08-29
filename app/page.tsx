"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [visiblePacks, setVisiblePacks] = useState<number[]>([])

  const evidencePacks = [
    { id: 1, cid: "bafybeigd…xyz1", latency: 420, status: "ok" },
    { id: 2, cid: "bafybeihk…xyz2", latency: 530, status: "ok" },
    { id: 3, cid: "bafybeifq…xyz3", latency: 2100, status: "fail" },
  ]

  useEffect(() => {
    setVisiblePacks([])
    evidencePacks.forEach((pack, index) => {
      setTimeout(() => {
        setVisiblePacks((prev) => [...prev, pack.id])
      }, index * 200)
    })
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Prism-like geometric background with specified parameters */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-4xl max-h-4xl">
                {/* Main prism structure - height=3.5, baseWidth=5.5 ratio */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-60"
                  style={{
                    background: `
                      conic-gradient(from 0deg at 50% 50%, 
                        rgba(20, 184, 166, 0.15) 0deg,
                        rgba(59, 130, 246, 0.15) 60deg,
                        rgba(147, 51, 234, 0.15) 120deg,
                        rgba(236, 72, 153, 0.15) 180deg,
                        rgba(34, 197, 94, 0.15) 240deg,
                        rgba(20, 184, 166, 0.15) 300deg,
                        rgba(20, 184, 166, 0.15) 360deg
                      )
                    `,
                    clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                    animation: "prismRotate 100s linear infinite", // timeScale=0.1 -> very slow rotation
                  }}
                />

                {/* Secondary prism layer */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-48"
                  style={{
                    background: `
                      conic-gradient(from 120deg at 50% 50%, 
                        rgba(20, 184, 166, 0.1) 0deg,
                        rgba(59, 130, 246, 0.1) 72deg,
                        rgba(147, 51, 234, 0.1) 144deg,
                        rgba(236, 72, 153, 0.1) 216deg,
                        rgba(34, 197, 94, 0.1) 288deg,
                        rgba(20, 184, 166, 0.1) 360deg
                      )
                    `,
                    clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                    animation: "prismRotate 120s linear infinite reverse",
                  }}
                />

                {/* Tertiary prism layer */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-36"
                  style={{
                    background: `
                      conic-gradient(from 240deg at 50% 50%, 
                        rgba(20, 184, 166, 0.08) 0deg,
                        rgba(59, 130, 246, 0.08) 90deg,
                        rgba(147, 51, 234, 0.08) 180deg,
                        rgba(236, 72, 153, 0.08) 270deg,
                        rgba(20, 184, 166, 0.08) 360deg
                      )
                    `,
                    clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                    animation: "prismRotate 140s linear infinite",
                  }}
                />

                {/* Glow effect - glow=1 setting */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-72 opacity-60"
                  style={{
                    background: `
                      radial-gradient(ellipse at center, 
                        rgba(20, 184, 166, 0.2) 0%,
                        rgba(59, 130, 246, 0.15) 25%,
                        rgba(147, 51, 234, 0.1) 50%,
                        transparent 70%
                      )
                    `,
                    filter: "blur(20px)",
                    animation: "prismGlow 80s ease-in-out infinite alternate",
                  }}
                />

                {/* Additional geometric elements for depth */}
                <div
                  className="absolute top-1/4 left-1/4 w-32 h-24"
                  style={{
                    background: "linear-gradient(45deg, rgba(20, 184, 166, 0.1), rgba(59, 130, 246, 0.1))",
                    clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                    animation: "prismFloat 60s ease-in-out infinite",
                  }}
                />

                <div
                  className="absolute bottom-1/4 right-1/4 w-24 h-18"
                  style={{
                    background: "linear-gradient(-45deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))",
                    clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                    animation: "prismFloat 70s ease-in-out infinite reverse",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Content with higher z-index to appear above background */}
          <div className="relative z-10 space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-balance">Keep public evidence online.</h1>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto text-pretty">
              SLO-backed availability for IPFS CIDs. Restaking incentives, verifiable probes, on-chain proofs on Lisk.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap justify-center gap-2 text-sm text-neutral-500">
            <span>Built with</span>
            <span className="inline-flex items-center justify-center rounded-md border border-neutral-700 px-2 py-0.5 text-xs font-medium">
              Lisk
            </span>
            <span>·</span>
            <span className="inline-flex items-center justify-center rounded-md border border-neutral-700 px-2 py-0.5 text-xs font-medium">
              Symbiotic
            </span>
            <span>·</span>
            <span className="inline-flex items-center justify-center rounded-md border border-neutral-700 px-2 py-0.5 text-xs font-medium">
              IPFS/IPLD
            </span>
            <span>·</span>
            <span className="inline-flex items-center justify-center rounded-md border border-neutral-700 px-2 py-0.5 text-xs font-medium">
              Vercel
            </span>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-10 px-6 bg-teal-500 hover:bg-teal-400 text-white"
            >
              Register a CID
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-10 px-6 border border-neutral-700 hover:bg-neutral-900 bg-transparent"
            >
              View live demo
            </Link>
          </div>
        </section>

        {/* Value Props */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Why CID Sentinel?</h2>
            <p className="text-neutral-400">Verifiable availability with economic incentives</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <div className="w-8 h-8 text-teal-500 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 01-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">SLO-backed uptime</h3>
              <p className="text-sm text-neutral-400">Define thresholds (K/N) and windows.</p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <div className="w-8 h-8 text-teal-500 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Signed evidence packs</h3>
              <p className="text-sm text-neutral-400">Probe results, latencies, vantage points.</p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <div className="w-8 h-8 text-teal-500 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 01-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Automatic slashing</h3>
              <p className="text-sm text-neutral-400">Breach triggers deterministic penalties.</p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <div className="w-8 h-8 text-teal-500 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Open DAG</h3>
              <p className="text-sm text-neutral-400">Evidence packs linked via IPLD for auditability.</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-neutral-400">Simple process, powerful guarantees</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {[
              {
                title: "Register",
                description: "Submit your CID and define SLO thresholds (K/N) and monitoring windows.",
              },
              {
                title: "Restake",
                description: "Stake tokens to participate in the availability verification network.",
              },
              {
                title: "Probe",
                description: "Automated probes verify CID availability from multiple vantage points.",
              },
              {
                title: "Slash",
                description: "SLO breaches trigger deterministic penalties and evidence generation.",
              },
            ].map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm font-medium text-white">
                    {index + 1}
                  </div>
                  {index < 3 && <div className="mt-2 h-8 w-px bg-neutral-800" />}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-medium text-neutral-100">{step.title}</h3>
                  <p className="mt-1 text-sm text-neutral-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Snapshot */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Live Snapshot</h2>
            <p className="text-neutral-400">Real-time availability metrics</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2">Last 15 min uptime</h3>
              <p className="text-sm text-neutral-400 mb-4">Median latency (ms)</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-teal-500">650ms</div>
              </div>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2">Latest Evidence Packs</h3>
              <p className="text-sm text-neutral-400 mb-4">Recent verification results</p>
              <div className="space-y-2">
                {evidencePacks.map((pack, index) => (
                  <div
                    key={pack.id}
                    className={`flex items-center justify-between p-3 rounded-lg bg-neutral-900/50 border border-neutral-800 transition-all duration-500 ${
                      visiblePacks.includes(pack.id) ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    }`}
                    style={{
                      transitionDelay: `${index * 200}ms`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${pack.status === "ok" ? "bg-green-500" : "bg-red-500"}`} />
                      <code className="text-sm text-neutral-300">{pack.cid}</code>
                      <span className="text-sm text-neutral-400">{pack.latency}ms</span>
                    </div>
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-8 px-3 hover:bg-neutral-800"
                      title="Open pack on a gateway"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Built with */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Built with</h2>
            <p className="text-neutral-400">Powered by leading web3 infrastructure</p>
          </div>

          <div className="flex justify-center gap-6 overflow-x-auto pb-2">
            {["Lisk", "Symbiotic", "IPFS/IPLD", "Vercel"].map((tech) => (
              <div
                key={tech}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 whitespace-nowrap"
              >
                <div className="w-8 h-8 bg-neutral-700 rounded" />
                <span className="font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">FAQ</h2>
            <p className="text-neutral-400">Common questions about CID Sentinel</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "What's an Evidence Pack?",
                answer:
                  "A signed JSON snapshot containing probe results, latencies, and verification data from multiple vantage points. Each pack is pinned to IPFS and anchored on Lisk for immutable proof of availability checks.",
              },
              {
                question: "How is slashing decided?",
                answer:
                  "If SLO K/N thresholds are breached across consecutive monitoring cycles, a deterministic slash is triggered automatically. The penalty amount is calculated based on the severity and duration of the breach.",
              },
              {
                question: "Do you store private data?",
                answer:
                  "No. CID Sentinel only stores CIDs, cryptographic hashes, and evidence pack summaries. We never access or store the actual content behind the CIDs - only verify their availability.",
              },
              {
                question: "Why Lisk?",
                answer:
                  "Lisk provides clean developer experience and low-cost transactions for anchoring proofs and state updates. Its EVM compatibility makes integration seamless while keeping operational costs minimal.",
              },
            ].map((faq, index) => (
              <details key={index} className="border border-neutral-800 rounded-2xl px-6 py-4">
                <summary className="font-medium cursor-pointer hover:text-teal-400 transition-colors">
                  {faq.question}
                </summary>
                <p className="mt-2 text-neutral-400 text-sm">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="space-y-8">
          <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl mx-auto text-center p-8">
            <h2 className="text-2xl font-semibold mb-2">Protect a CID today</h2>
            <p className="text-neutral-400 mb-6">
              Register a CID, set your SLO and start generating verifiable evidence packs.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-10 px-6 bg-teal-500 hover:bg-teal-400 text-white"
            >
              Get started
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} CID Sentinel. Open-source. No financial advice.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-neutral-500 hover:text-neutral-300 flex items-center gap-1">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Link>
              <Link href="#" className="text-sm text-neutral-500 hover:text-neutral-300 flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Docs
              </Link>
              <Link href="#" className="text-sm text-neutral-500 hover:text-neutral-300 flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes prismRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes prismGlow {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
        }
        
        @keyframes prismFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(2deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
      `}</style>
    </div>
  )
}
