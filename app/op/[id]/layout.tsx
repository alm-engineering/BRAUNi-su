"use client"

import React, { use } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface OpLayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default function OpLayout({ children, params }: OpLayoutProps) {
  const pathname = usePathname()
  const { id } = use(params)

  const tabs = [
    { id: "operationsbericht", label: "Operationsbericht", path: `/op/${id}/operationsbericht` },
    { id: "smartprotokoll", label: "SmartProtokoll", path: `/op/${id}/smartprotokoll` },
    { id: "abrechnungsprotokoll", label: "Abrechnungsprotokoll", path: `/op/${id}/abrechnungsprotokoll` },
    { id: "pathologie-auftrag", label: "Pathologie-Auftrag", path: `/op/${id}/pathologie-auftrag` },
  ]

  const handlePdfExport = async () => {
    try {
      const storageKey = `op-${id}-sentences`
      console.log("[v0] Attempting to read from localStorage:", storageKey)

      const storedData = localStorage.getItem(storageKey)
      console.log("[v0] Raw localStorage data:", storedData)

      const sentences = storedData ? JSON.parse(storedData) : []
      console.log("[v0] Parsed sentences:", sentences.length)

      if (sentences.length === 0) {
        console.error("[v0] No sentences found in localStorage")
        alert("Keine Daten zum Exportieren gefunden. Bitte zuerst den Operationsbericht öffnen.")
        return
      }

      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sentences,
          patientInfo: {
            name: "Anna Richter, 12.04.1983, 42 Jahre",
            opDate: "28.11.2025",
            diagnosis: "Gallensteine (Cholelithiasis)",
            operation: "Laparoskopische Cholezystektomie",
            surgeons: "Dr. med. Tobias Meier",
          },
        }),
      })

      if (!response.ok) {
        throw new Error("PDF generation failed")
      }

      const { html } = await response.json()

      // Open in new window and trigger print
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(html)
        printWindow.document.close()

        // Wait for images to load then print
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print()
          }, 500)
        }
      }
    } catch (error) {
      console.error("PDF export error:", error)
      alert("Fehler beim PDF-Export")
    }
  }

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
            In KIS exportieren
          </button>
          <button
            onClick={handlePdfExport}
            className="rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
          >
            PDF exportieren
          </button>
        </div>
      </div>
    </div>
  )
}
