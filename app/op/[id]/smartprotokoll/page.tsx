"use client"

import { useState } from "react"
import { Eye, Droplets, Camera, Play, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TimelineStep {
  id: string
  time: string
  icon: "eye" | "droplet" | "camera" | "play"
  title: string
  description?: string
  variant: "outlined" | "filled"
}

const initialSteps: TimelineStep[] = [
  {
    id: "1",
    time: "00:24",
    icon: "eye",
    title: "Endoskop eingeführt",
    variant: "outlined",
  },
  {
    id: "2",
    time: "00:45",
    icon: "droplet",
    title: "Spülung durchgeführt",
    variant: "outlined",
  },
  {
    id: "3",
    time: "01:10",
    icon: "camera",
    title: "Dokumentation und Bildaufnahme",
    variant: "filled",
  },
]

export default function SmartProtokollPage() {
  const [steps, setSteps] = useState<TimelineStep[]>(initialSteps)

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "eye":
        return <Eye className="h-5 w-5" />
      case "droplet":
        return <Droplets className="h-5 w-5" />
      case "camera":
        return <Camera className="h-5 w-5" />
      case "play":
        return <Play className="h-5 w-5" />
      default:
        return <Eye className="h-5 w-5" />
    }
  }

  const addStepAfter = (index: number) => {
    const newStep: TimelineStep = {
      id: `new-${Date.now()}`,
      time: "--:--",
      icon: "eye",
      title: "Neuer Schritt",
      variant: "outlined",
    }
    const newSteps = [...steps]
    newSteps.splice(index + 1, 0, newStep)
    setSteps(newSteps)
  }

  return (
    <div className="relative px-6 py-8 pb-32">
      <div className="absolute left-[94px] top-8 bottom-32 w-0.5 bg-[#00a78e]" />
      <div className="absolute left-[88px] top-6 h-3 w-3 rounded-full bg-[#00a78e]" />
      <div className="absolute left-[88px] bottom-28 h-3 w-3 rounded-full border-2 border-muted-foreground bg-background" />

      {/* Steps */}
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={step.id}>
            <div className="flex items-start gap-6">
              <span className="w-14 pt-3 text-right text-sm text-muted-foreground">{step.time}</span>

              {/* Icon */}
              <div className="flex h-10 w-10 items-center justify-center text-muted-foreground">
                {getIcon(step.icon)}
              </div>

              {/* Content box */}
              <div
                className={cn(
                  "flex-1 max-w-md rounded-lg px-6 py-4",
                  step.variant === "outlined" ? "border-2 border-foreground bg-background" : "bg-muted",
                )}
              >
                <p className="font-medium">{step.title}</p>
                {step.description && <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>}
              </div>
            </div>

            {/* Add step button between steps */}
            {index < steps.length - 1 && (
              <div className="ml-24 py-2">
                <button
                  onClick={() => addStepAfter(index)}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-muted-foreground/30 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pl-24">
        <Button variant="ghost" onClick={() => addStepAfter(steps.length - 1)} className="text-sm font-medium">
          + ADD STEP
        </Button>
      </div>
    </div>
  )
}
