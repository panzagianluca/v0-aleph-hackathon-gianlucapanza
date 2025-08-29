"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [visiblePacks, setVisiblePacks] = useState<number[]>([])
  const [isNavOpen, setIsNavOpen] = useState(false)

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
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950/80 border-b border-neutral-900">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg">
            CID Sentinel
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="#about" className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors">
              About
            </Link>
            <Link href="#how" className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors">
              How
            </Link>
            <Link href="#live" className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors">
              Live
            </Link>
            <Link href="#use-cases" className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors">
              Use cases
            </Link>
            <Link href="#integrations" className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors">
              Integrations
            </Link>
            <Link href="#faq" className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors">
              FAQ
            </Link>
            <Link
              href="#register"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 bg-teal-500 hover:bg-teal-400 text-white"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsNavOpen(!isNavOpen)} className="md:hidden p-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isNavOpen && (
          <div className="md:hidden border-t border-neutral-800 bg-neutral-950">
            <div className="px-4 py-2 space-y-2">
              <Link href="#about" className="block py-2 text-sm text-neutral-400 hover:text-neutral-100">
                About
              </Link>
              <Link href="#how" className="block py-2 text-sm text-neutral-400 hover:text-neutral-100">
                How
              </Link>
              <Link href="#live" className="block py-2 text-sm text-neutral-400 hover:text-neutral-100">
                Live
              </Link>
              <Link href="#use-cases" className="block py-2 text-sm text-neutral-400 hover:text-neutral-100">
                Use cases
              </Link>
              <Link href="#integrations" className="block py-2 text-sm text-neutral-400 hover:text-neutral-100">
                Integrations
              </Link>
              <Link href="#faq" className="block py-2 text-sm text-neutral-400 hover:text-neutral-100">
                FAQ
              </Link>
              <Link
                href="#register"
                className="block py-2 text-sm bg-teal-500 hover:bg-teal-400 text-white rounded-md text-center mt-2"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-32">
        <section id="hero" className="text-center space-y-8 relative">
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

          <div className="relative z-10 space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-balance">Keep public evidence online.</h1>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto text-pretty">
              SLO-backed availability for IPFS CIDs. Restaking incentives, verifiable probes, on-chain proofs on Lisk.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#register"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-11 px-8 bg-teal-500 hover:bg-teal-400 text-white"
              >
                Register a CID
              </Link>
              <Link
                href="#live"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-11 px-8 border border-neutral-700 hover:bg-neutral-900 bg-transparent"
              >
                View live demo
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-sm text-neutral-500 pt-4">
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
          </div>
        </section>

        <section id="built-with" className="space-y-8">
          <div className="flex justify-center gap-8 overflow-x-auto pb-2">
            {[
              { name: "Lisk", desc: "EVM-compatible L2 for low-cost proofs" },
              { name: "Symbiotic", desc: "Restaking infrastructure" },
              { name: "IPFS/IPLD", desc: "Decentralized storage & linking" },
              { name: "Vercel", desc: "Edge compute & deployment" },
            ].map((tech) => (
              <div
                key={tech.name}
                className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-neutral-900/30 border border-neutral-800/50 whitespace-nowrap min-w-[160px]"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-mono">{tech.name.slice(0, 2)}</span>
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{tech.name}</div>
                  <div className="text-xs text-neutral-500 mt-1">{tech.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="problem" className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">When IPFS links die, audits break.</h2>
            <p className="text-neutral-400">The hidden costs of unreliable decentralized storage</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 text-red-400 mx-auto mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Evidence disappears</h3>
              <p className="text-sm text-neutral-400">
                Unpins and gateway outages make critical data vanish without warning.
              </p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 text-red-400 mx-auto mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No economic penalty</h3>
              <p className="text-sm text-neutral-400">
                Poor availability has zero consequences, creating misaligned incentives.
              </p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 text-red-400 mx-auto mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Tedious verification</h3>
              <p className="text-sm text-neutral-400">
                Manual uptime checks are fragmented, unreliable, and don't scale.
              </p>
            </div>
          </div>
        </section>

        <section id="solution" className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">The Solution</h2>
            <p className="text-neutral-400">Economic incentives meet verifiable monitoring</p>
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
              <p className="text-sm text-neutral-400">
                Define K/N thresholds and windows.
                <span
                  className="inline-block ml-1 text-xs text-neutral-500 cursor-help"
                  title="K successful probes out of N total probes within a time window"
                >
                  ⓘ
                </span>
              </p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <div className="w-8 h-8 text-teal-500 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Signed evidence packs</h3>
              <p className="text-sm text-neutral-400">Latencies & vantage points, pinned and verifiable.</p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <div className="w-8 h-8 text-teal-500 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Automatic slashing</h3>
              <p className="text-sm text-neutral-400">Breach → deterministic penalty.</p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <div className="w-8 h-8 text-teal-500 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Open DAG</h3>
              <p className="text-sm text-neutral-400">IPLD-linked history for audits.</p>
            </div>
          </div>
        </section>

        <section id="how" className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-neutral-400">4 steps to verifiable availability</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {[
              {
                title: "Register",
                description: "Submit your CID and define SLO thresholds (K/N) and monitoring windows.",
                icon: "M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m5 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-5 4h6",
              },
              {
                title: "Restake",
                description: "Stake tokens to participate in the availability verification network.",
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
              },
              {
                title: "Probe",
                description: "Automated probes verify CID availability from multiple vantage points.",
                icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
              },
              {
                title: "Slash",
                description: "SLO breaches trigger deterministic penalties and evidence generation.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
              },
            ].map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-sm font-medium text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                    </svg>
                  </div>
                  {index < 3 && <div className="mt-2 h-8 w-px bg-neutral-800" />}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold text-neutral-100 text-lg">{step.title}</h3>
                  <p className="mt-1 text-sm text-neutral-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="live" className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Live Snapshot</h2>
            <p className="text-neutral-400">Real-time availability metrics</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2">Last 15 minutes uptime</h3>
              <p className="text-sm text-neutral-400 mb-6">Median latency</p>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <span className="font-mono">92%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-3">
                    <div
                      className="bg-teal-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-teal-500 font-mono">650ms</div>
              </div>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-2">Latest Evidence Packs</h3>
              <p className="text-sm text-neutral-400 mb-6">Recent verification results</p>
              <div className="space-y-3">
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
                      <code className="text-sm text-neutral-300 font-mono">{pack.cid}</code>
                      <span className="text-sm text-neutral-400 font-mono">{pack.latency}ms</span>
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

        <section id="use-cases" className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Use Cases</h2>
            <p className="text-neutral-400">Who benefits from verifiable availability</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Open-data NGOs",
                description: "Publish reports, guarantee availability for investigators.",
                journey: ["Register reports", "Probe availability", "Verify for audits"],
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              },
              {
                title: "DAOs & governance",
                description: "Snapshots & proposals that must not rot.",
                journey: ["Register proposals", "Probe consensus", "Verify decisions"],
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
              },
              {
                title: "Universities",
                description: "Datasets for reproducible research.",
                journey: ["Register datasets", "Probe integrity", "Verify reproducibility"],
                icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
              },
            ].map((useCase, index) => (
              <div key={index} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                <div className="w-8 h-8 text-teal-500 mb-4">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={useCase.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                <p className="text-sm text-neutral-400 mb-4">{useCase.description}</p>
                <div className="space-y-2">
                  {useCase.journey.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center gap-2 text-xs text-neutral-500">
                      <div className="w-1 h-1 bg-teal-500 rounded-full" />
                      {step}
                    </div>
                  ))}
                </div>
                <Link
                  href="#how"
                  className="inline-flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300 mt-3"
                >
                  See how
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section id="integrations" className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Integrations & Security</h2>
            <p className="text-neutral-400">What it plays with & how it won't break</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Integrations</h3>
              <div className="space-y-3">
                {[
                  { name: "Lisk", desc: "EVM-compatible L2 for proof anchoring" },
                  { name: "Symbiotic", desc: "Restaking infrastructure & slashing" },
                  { name: "IPFS/IPLD", desc: "Content addressing & DAG linking" },
                  { name: "Vercel", desc: "Edge compute for global probes" },
                ].map((integration) => (
                  <div
                    key={integration.name}
                    className="flex items-center gap-3 p-3 rounded-lg bg-neutral-900/30 border border-neutral-800/50"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded flex items-center justify-center">
                      <span className="text-xs font-mono">{integration.name.slice(0, 2)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{integration.name}</div>
                      <div className="text-xs text-neutral-500">{integration.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Security</h3>
              <details className="border border-neutral-800 rounded-lg">
                <summary className="p-4 cursor-pointer hover:bg-neutral-900/50 font-medium">
                  Cryptographic guarantees
                </summary>
                <div className="px-4 pb-4 text-sm text-neutral-400 space-y-2">
                  <div>• Signed packs with ed25519 signatures</div>
                  <div>• Watcher allowlist for probe validation</div>
                  <div>• Pausable contracts for emergency stops</div>
                </div>
              </details>

              <details className="border border-neutral-800 rounded-lg">
                <summary className="p-4 cursor-pointer hover:bg-neutral-900/50 font-medium">SLO enforcement</summary>
                <div className="px-4 pb-4 text-sm text-neutral-400 space-y-2">
                  <div>• K/N threshold monitoring</div>
                  <div>• Consecutive breach detection</div>
                  <div>• Rate-limits on slash reports</div>
                </div>
              </details>

              <details className="border border-neutral-800 rounded-lg">
                <summary className="p-4 cursor-pointer hover:bg-neutral-900/50 font-medium">Privacy protection</summary>
                <div className="px-4 pb-4 text-sm text-neutral-400 space-y-2">
                  <div>• No PII storage</div>
                  <div>• Only CIDs and cryptographic hashes</div>
                  <div>• Content-agnostic verification</div>
                </div>
              </details>
            </div>
          </div>
        </section>

        <section id="open-source" className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Open Source & Docs</h2>
            <p className="text-neutral-400">MIT/Apache OSS. Reproduce the demo. Inspect threat model.</p>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              href="https://github.com/cid-sentinel"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-10 px-6 border border-neutral-700 hover:bg-neutral-900 bg-transparent"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-10 px-6 border border-neutral-700 hover:bg-neutral-900 bg-transparent"
            >
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
          </div>
        </section>

        <section id="faq" className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">FAQ</h2>
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
              <details key={index} className="border border-neutral-800 rounded-2xl px-6 py-4 group">
                <summary className="font-medium cursor-pointer hover:text-teal-400 transition-colors flex items-center justify-between">
                  {faq.question}
                  <svg
                    className="w-5 h-5 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-neutral-400 text-sm leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="register" className="space-y-8">
          <div className="bg-gradient-to-br from-neutral-950 to-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl mx-auto text-center p-8">
            <h2 className="text-3xl font-semibold mb-3">Protect a CID today</h2>
            <p className="text-neutral-400 mb-8 text-balance">
              Register a CID, set your SLO and start generating verifiable evidence packs.
            </p>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-11 px-8 bg-teal-500 hover:bg-teal-400 text-white">
              Get started
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <p className="text-xs text-neutral-500 mt-4">
              Opens registration form with CID field + SLO preset + Connect Wallet
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} CID Sentinel. Open-source. No financial advice.
            </p>
            <div className="flex gap-6">
              <Link
                href="https://github.com/cid-sentinel"
                className="text-sm text-neutral-500 hover:text-neutral-300 flex items-center gap-1"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Link>
              <Link href="/docs" className="text-sm text-neutral-500 hover:text-neutral-300 flex items-center gap-1">
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
