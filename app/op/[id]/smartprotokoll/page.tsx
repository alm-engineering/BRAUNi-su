"use client"

import { Link, TrendingUp, Syringe } from "lucide-react"

interface VitalRow {
  time: string
  puls?: number
  co2?: string
  mbar?: number
  spo2?: string
  ekg?: string
  rhytm?: number
  chirurg?: { type: "spuelung" | "other"; label: string } | null
  anesist?: { type: "adrenalin" | "other"; label: string } | null
  event?: { type: "puls_sprung" | "alert" | "other"; label: string } | null
}

const protocolData: VitalRow[] = [
  { time: "00:00", puls: 82, co2: "5,6%", mbar: 12, spo2: "97%", ekg: "OK", rhytm: 82 },
  { time: "00:05", puls: 82, co2: "5,6%", mbar: 12, spo2: "97%", ekg: "OK", rhytm: 82 },
  { time: "00:10", puls: 82, co2: "5,6%", mbar: 12, spo2: "97%", ekg: "OK", rhytm: 82 },
  {
    time: "00:05",
    puls: 82,
    co2: "5,6%",
    mbar: 12,
    spo2: "97%",
    ekg: "OK",
    rhytm: 82,
    event: { type: "puls_sprung", label: "Puls Sprung +12" },
  },
  {
    time: "00:10",
    puls: 82,
    co2: "5,6%",
    mbar: 12,
    spo2: "97%",
    ekg: "OK",
    rhytm: 82,
    chirurg: { type: "spuelung", label: "Spülung" },
  },
  { time: "00:05", anesist: { type: "adrenalin", label: "Adrenalin" } },
  { time: "00:10" },
  { time: "00:05" },
  { time: "00:10" },
  { time: "" },
  { time: "" },
  { time: "" },
  { time: "" },
  { time: "" },
  { time: "" },
  { time: "" },
  { time: "" },
  { time: "" },
  { time: "" },
  { time: "" },
]

function EmptyCell() {
  return <div className="h-8 w-full rounded-md bg-stone-100" />
}

function ActionTag({
  type,
  label,
  variant,
}: {
  type: string
  label: string
  variant: "green" | "orange"
}) {
  const bgColor = variant === "green" ? "bg-[#00a78e]" : "bg-[#e8894a]"

  return (
    <div className={`flex items-center gap-2 rounded-md ${bgColor} px-3 py-2 text-white`}>
      {type === "spuelung" && <Link className="h-4 w-4" />}
      {type === "adrenalin" && <Syringe className="h-4 w-4" />}
      {type === "puls_sprung" && <TrendingUp className="h-4 w-4" />}
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

export default function SmartProtokollPage() {
  return (
    <div className="px-6 py-8">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse">
          <thead>
            <tr className="text-sm text-muted-foreground">
              <th className="w-16 pb-4 text-left font-normal"></th>
              <th className="w-14 pb-4 text-center font-medium">PULS</th>
              <th className="w-14 pb-4 text-center font-medium">CO2</th>
              <th className="w-14 pb-4 text-center font-medium">MBAR</th>
              <th className="w-14 pb-4 text-center font-medium">
                SPO<sub>2</sub>
              </th>
              <th className="w-14 pb-4 text-center font-medium">EKG</th>
              <th className="w-14 pb-4 text-center font-medium">RHYTM</th>
              <th className="w-48 pb-4 text-center font-medium">CHIRURG</th>
              <th className="w-48 pb-4 text-center font-medium">ANESIST</th>
              <th className="w-48 pb-4 text-center font-medium">EVENTS</th>
            </tr>
          </thead>
          <tbody>
            {protocolData.map((row, index) => (
              <tr key={index} className="border-b border-stone-100">
                {/* Time column */}
                <td className="py-3 pr-4 font-mono text-sm text-muted-foreground">{row.time}</td>

                {/* Vital signs */}
                <td className="py-3 text-center text-sm">{row.puls}</td>
                <td className="py-3 text-center text-sm">{row.co2}</td>
                <td className="py-3 text-center text-sm">{row.mbar}</td>
                <td className="py-3 text-center text-sm">{row.spo2}</td>
                <td className="py-3 text-center text-sm">{row.ekg}</td>
                <td className="py-3 text-center text-sm">{row.rhytm}</td>

                {/* CHIRURG column */}
                <td className="px-2 py-2">
                  {row.chirurg ? (
                    <ActionTag type={row.chirurg.type} label={row.chirurg.label} variant="green" />
                  ) : (
                    <EmptyCell />
                  )}
                </td>

                {/* ANESIST column */}
                <td className="px-2 py-2">
                  {row.anesist ? (
                    <ActionTag type={row.anesist.type} label={row.anesist.label} variant="green" />
                  ) : (
                    <EmptyCell />
                  )}
                </td>

                {/* EVENTS column */}
                <td className="px-2 py-2">
                  {row.event ? (
                    <ActionTag type={row.event.type} label={row.event.label} variant="orange" />
                  ) : (
                    <EmptyCell />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
