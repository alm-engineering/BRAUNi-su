"use client"

import { useState } from "react"
import {
  Link,
  TrendingUp,
  Syringe,
  Droplets,
  Pill,
  AlertTriangle,
  Activity,
  Scissors,
  Play,
  Heart,
  Wind,
  Gauge,
} from "lucide-react"
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface VitalRow {
  time: string
  puls?: number
  co2?: string
  mbar?: number
  spo2?: string
  ekg?: string
  rhytm?: number
  chirurg?: { type: "spuelung" | "biopsie" | "insufflation" | "schnitt" | "other"; label: string } | null
  anesist?: { type: "adrenalin" | "propofol" | "fentanyl" | "other"; label: string } | null
  event?: { type: "puls_sprung" | "spo2_drop" | "bp_change" | "alert" | "other"; label: string } | null
}

const protocolData: VitalRow[] = [
  // 00:00 - Zugang und CO₂-Anlage
  {
    time: "00:00",
    puls: 72,
    co2: "4,8%",
    mbar: 0,
    spo2: "99%",
    ekg: "OK",
    rhytm: 72,
    chirurg: { type: "schnitt", label: "Zugang und CO₂-Anlage" },
    anesist: { type: "propofol", label: "Propofol 200mg" },
  },
  // 00:05 - Exploration und Retraktion
  {
    time: "00:05",
    puls: 68,
    co2: "5,2%",
    mbar: 12,
    spo2: "97%",
    ekg: "OK",
    rhytm: 68,
    chirurg: { type: "other", label: "Exploration und Retraktion" },
    anesist: { type: "fentanyl", label: "Fentanyl 50µg" },
  },
  // 00:10 - Präparation Calot-Dreieck
  {
    time: "00:10",
    puls: 74,
    co2: "5,4%",
    mbar: 12,
    spo2: "97%",
    ekg: "OK",
    rhytm: 74,
    chirurg: { type: "schnitt", label: "Präparation Calot-Dreieck" },
    event: { type: "puls_sprung", label: "Puls +6" },
  },
  // 00:15 - Clipapplikation und Durchtrennung
  {
    time: "00:15",
    puls: 82,
    co2: "5,6%",
    mbar: 14,
    spo2: "96%",
    ekg: "OK",
    rhytm: 82,
    chirurg: { type: "schnitt", label: "Clipapplikation und Durchtrennung" },
    anesist: { type: "propofol", label: "Propofol 50mg" },
    event: { type: "puls_sprung", label: "Puls +8" },
  },
  // 00:20 - Retrograde Dissektion
  {
    time: "00:20",
    puls: 78,
    co2: "5,4%",
    mbar: 12,
    spo2: "97%",
    ekg: "OK",
    rhytm: 78,
    chirurg: { type: "schnitt", label: "Retrograde Dissektion" },
  },
  // 00:25 - Ablösung Gallenblase
  {
    time: "00:25",
    puls: 85,
    co2: "5,8%",
    mbar: 14,
    spo2: "95%",
    ekg: "OK",
    rhytm: 85,
    chirurg: { type: "schnitt", label: "Ablösung Gallenblase" },
    anesist: { type: "adrenalin", label: "O₂ erhöht" },
    event: { type: "spo2_drop", label: "SpO₂ Drop -2%" },
  },
  // 00:30 - Einbringen Bergebeutel
  {
    time: "00:30",
    puls: 76,
    co2: "5,4%",
    mbar: 12,
    spo2: "97%",
    ekg: "OK",
    rhytm: 76,
    chirurg: { type: "other", label: "Einbringen Bergebeutel" },
    anesist: { type: "propofol", label: "Propofol 30mg" },
  },
  // 00:35 - Finale Kontrolle
  {
    time: "00:35",
    puls: 70,
    co2: "5,0%",
    mbar: 10,
    spo2: "98%",
    ekg: "OK",
    rhytm: 70,
    chirurg: { type: "spuelung", label: "Finale Kontrolle" },
  },
  // 00:40 - Extraktion und Abschluss
  {
    time: "00:40",
    puls: 66,
    co2: "4,6%",
    mbar: 0,
    spo2: "99%",
    ekg: "OK",
    rhytm: 66,
    chirurg: { type: "insufflation", label: "Extraktion und Abschluss" },
  },
]

const chartData = protocolData.map((row) => ({
  time: row.time,
  puls: row.puls || 0,
  co2: Number.parseFloat(row.co2?.replace(",", ".").replace("%", "") || "0"),
  mbar: row.mbar || 0,
  spo2: Number.parseFloat(row.spo2?.replace("%", "") || "0"),
  rhytm: row.rhytm || 0,
}))

function EmptyCell() {
  return <div className="h-8 w-full rounded-md bg-stone-50 border border-stone-100" />
}

function ActionTag({
  type,
  label,
  variant,
}: {
  type: string
  label: string
  variant: "surgeon" | "anesist" | "event"
}) {
  const styles = {
    surgeon: "bg-teal-50 text-teal-700 border border-teal-200",
    anesist: "bg-sky-50 text-sky-700 border border-sky-200",
    event: "bg-amber-50 text-amber-700 border border-amber-200",
  }

  const iconStyles = {
    surgeon: "text-teal-500",
    anesist: "text-sky-500",
    event: "text-amber-500",
  }

  return (
    <div className={`flex items-center gap-2 rounded-md ${styles[variant]} px-3 py-2`}>
      <span className={iconStyles[variant]}>
        {type === "spuelung" && <Droplets className="h-4 w-4" />}
        {type === "biopsie" && <Link className="h-4 w-4" />}
        {type === "insufflation" && <Activity className="h-4 w-4" />}
        {type === "schnitt" && <Scissors className="h-4 w-4" />}
        {type === "other" && <Activity className="h-4 w-4" />}
        {type === "adrenalin" && <Syringe className="h-4 w-4" />}
        {type === "propofol" && <Pill className="h-4 w-4" />}
        {type === "fentanyl" && <Syringe className="h-4 w-4" />}
        {type === "puls_sprung" && <TrendingUp className="h-4 w-4" />}
        {type === "spo2_drop" && <AlertTriangle className="h-4 w-4" />}
        {type === "bp_change" && <Activity className="h-4 w-4" />}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

function VitalChart({
  data,
  dataKey,
  dataKey2,
  color,
  color2,
  gradientId,
  gradientId2,
  label,
  label2,
  unit,
  domain,
}: {
  data: typeof chartData
  dataKey: string
  dataKey2?: string
  color: string
  color2?: string
  gradientId: string
  gradientId2?: string
  label: string
  label2?: string
  unit: string
  domain?: [number, number]
}) {
  return (
    <div className="h-28 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
            {gradientId2 && color2 && (
              <linearGradient id={gradientId2} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color2} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color2} stopOpacity={0.02} />
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} tickLine={false} />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#a8a29e" }} axisLine={false} />
          <YAxis
            domain={domain || ["auto", "auto"]}
            tick={{ fontSize: 10, fill: "#a8a29e" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}${unit}`}
            width={40}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            name={label}
          />
          {dataKey2 && color2 && gradientId2 && (
            <Area
              type="monotone"
              dataKey={dataKey2}
              stroke={color2}
              strokeWidth={2}
              fill={`url(#${gradientId2})`}
              name={label2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function SmartProtokollPage() {
  const [selectedRow, setSelectedRow] = useState<VitalRow | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleRowClick = (row: VitalRow) => {
    setSelectedRow(row)
    setIsDrawerOpen(true)
  }

  return (
    <div className="px-6 py-8">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-stone-400">
              <th className="w-16 pb-4 text-left font-medium"></th>
              <th className="w-48 pb-4 text-center font-medium">CHIRURG</th>
              <th className="w-48 pb-4 text-center font-medium">ANÄSTHESIST</th>
              <th className="w-48 pb-4 text-center font-medium">EVENTS</th>
            </tr>
          </thead>
          <tbody>
            {protocolData.map((row, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(row)}
                className="border-b border-stone-100 transition-colors duration-150 hover:bg-stone-100 cursor-pointer group"
              >
                {/* Time column */}
                <td className="py-3 pr-4 font-mono text-sm text-stone-500 group-hover:text-stone-900 transition-colors">
                  {row.time}
                </td>

                {/* CHIRURG column */}
                <td className="px-2 py-2">
                  {row.chirurg ? (
                    <ActionTag type={row.chirurg.type} label={row.chirurg.label} variant="surgeon" />
                  ) : (
                    <EmptyCell />
                  )}
                </td>

                {/* ANESIST column */}
                <td className="px-2 py-2">
                  {row.anesist ? (
                    <ActionTag type={row.anesist.type} label={row.anesist.label} variant="anesist" />
                  ) : (
                    <EmptyCell />
                  )}
                </td>

                {/* EVENTS column */}
                <td className="px-2 py-2">
                  {row.event ? (
                    <ActionTag type={row.event.type} label={row.event.label} variant="event" />
                  ) : (
                    <EmptyCell />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[600px] sm:w-[680px] px-8 py-6 overflow-y-auto overflow-x-hidden">
          <SheetHeader className="mb-5">
            <SheetTitle className="text-xl font-semibold text-stone-900">Zeitblock {selectedRow?.time}</SheetTitle>
            <p className="text-sm text-stone-500">5-Minuten Aufnahme und Vitalwerte</p>
          </SheetHeader>

          {selectedRow && (
            <div className="flex flex-col gap-4">
              {/* Video Section */}
              <div className="flex-shrink-0">
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-stone-900 group cursor-pointer">
                  <video
                    className="w-full h-full object-cover opacity-90"
                    poster={`/placeholder.svg?height=280&width=640&query=endoscopy laparoscopic surgery video frame cholecystectomy ${selectedRow.time}`}
                  >
                    <source src={`/videos/op-${selectedRow.time.replace(":", "-")}.mp4`} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-stone-900 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-white text-xs font-medium bg-stone-900/50 px-2.5 py-1 rounded-full">
                      {selectedRow.time} - {selectedRow.time.split(":")[0]}:
                      {String(Number(selectedRow.time.split(":")[1]) + 5).padStart(2, "0")}
                    </span>
                    <span className="text-white/80 text-xs bg-stone-900/50 px-2 py-1 rounded-full">5:00</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span className="text-sm text-stone-600">Puls</span>
                    <span className="text-base font-semibold text-stone-900">{selectedRow.puls}</span>
                    <span className="text-xs text-stone-400">bpm</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <Wind className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-stone-600">SpO₂</span>
                    <span className="text-base font-semibold text-stone-900">{selectedRow.spo2}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <Gauge className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-stone-600">MBAR</span>
                    <span className="text-base font-semibold text-stone-900">{selectedRow.mbar}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-stone-600">CO₂</span>
                    <span className="text-base font-semibold text-stone-900">{selectedRow.co2}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {/* Puls & SpO2 combined */}
                <div className="rounded-lg border border-stone-200 bg-white p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="text-xs text-stone-500">Puls</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs text-stone-500">SpO₂</span>
                    </div>
                  </div>
                  <VitalChart
                    data={chartData}
                    dataKey="puls"
                    dataKey2="spo2"
                    color="#e11d48"
                    color2="#10b981"
                    gradientId="pulsGradientNew"
                    gradientId2="spo2GradientNew"
                    label="Puls"
                    label2="SpO₂"
                    unit=""
                    domain={[50, 100]}
                  />
                </div>

                {/* CO2 & MBAR combined */}
                <div className="rounded-lg border border-stone-200 bg-white p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-xs text-stone-500">CO₂ (x10)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-xs text-stone-500">MBAR</span>
                    </div>
                  </div>
                  <VitalChart
                    data={chartData.map((d) => ({ ...d, co2Scaled: d.co2 * 10 }))}
                    dataKey="co2Scaled"
                    dataKey2="mbar"
                    color="#3b82f6"
                    color2="#f59e0b"
                    gradientId="co2GradientNew"
                    gradientId2="mbarGradientNew"
                    label="CO₂"
                    label2="MBAR"
                    unit=""
                    domain={[0, 60]}
                  />
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
