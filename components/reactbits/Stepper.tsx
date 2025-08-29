"use client"
import { cn } from "@/lib/utils"

interface Step {
  title: string
  description: string
}

interface StepperProps {
  steps: Step[]
  className?: string
}

export function Stepper({ steps, className }: StepperProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm font-medium text-white">
              {index + 1}
            </div>
            {index < steps.length - 1 && <div className="mt-2 h-8 w-px bg-neutral-800" />}
          </div>
          <div className="flex-1 pb-8">
            <h3 className="font-medium text-neutral-100">{step.title}</h3>
            <p className="mt-1 text-sm text-neutral-400">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
