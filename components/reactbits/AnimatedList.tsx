"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AnimatedListItem {
  id: string | number
  content: React.ReactNode
}

interface AnimatedListProps {
  items: AnimatedListItem[]
  className?: string
  delay?: number
}

export function AnimatedList({ items, className, delay = 100 }: AnimatedListProps) {
  const [visibleItems, setVisibleItems] = useState<AnimatedListItem[]>([])

  useEffect(() => {
    setVisibleItems([])

    items.forEach((item, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, item])
      }, index * delay)
    })
  }, [items, delay])

  return (
    <div className={cn("space-y-2", className)}>
      {visibleItems.map((item, index) => (
        <div
          key={item.id}
          className="animate-in slide-in-from-right-2 fade-in duration-500"
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: "both",
          }}
        >
          {item.content}
        </div>
      ))}
    </div>
  )
}
