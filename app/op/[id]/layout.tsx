"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface OpLayoutProps {
  children: React.ReactNode
  params: { id: string }
}

export default function OpLayout({ children, params }: OpLayoutProps) {
  const pathname = usePathname()
  const id = params.id

  const tabs = [
    { id: "operationsbericht", label: "Operationsbericht", path: `/op/${id}/operationsbericht` },
    { id: "smartprotokoll", label: "SmartProtokoll", path: `/op/${id}/smartprotokoll` },
    { id: "abrechnungsprotokoll", label: "Abrechnungsprotokoll", path: `/op/${id}/abrechnungsprotokoll` },
    { id: "pathologie-auftrag", label: "Pathologie-Auftrag", path: `/op/${id}/pathologie-auftrag` },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary p-6 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="inline-flex items-center gap-2 text-white transition-opacity hover:opacity-90">
            <ChevronLeft className="h-6 w-6" />
            <span className="text-3xl font-bold">BRAUNi</span>
          </Link>
        </div>
      </header>

      <div className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl gap-8 px-6">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path
            return (
              <Link
                key={tab.id}
                href={tab.path}
                className={cn(
                  "relative pb-4 pt-6 text-sm font-semibold transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />}
              </Link>
            )
          })}
        </div>
      </div>

      {children}

      <div className="fixed bottom-0 left-0 right-0 border-t bg-white px-6 py-4 shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-4">
          <button className="rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110">
            Export in KIS
          </button>
          <button className="rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110">
            Export as PDF
          </button>
          <button className="rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110">
            Send by Email
          </button>
        </div>
      </div>
    </div>
  )
}
