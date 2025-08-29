"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface CarouselProps {
  children: React.ReactNode
  className?: string
}

export function Carousel({ children, className }: CarouselProps) {
  return <div className={cn("flex gap-6 overflow-x-auto pb-2", className)}>{children}</div>
}
