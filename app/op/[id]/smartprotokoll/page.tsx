"use client"

import { Link, TrendingUp, Syringe, Droplets, Pill, AlertTriangle, Activity, Scissors } from "lucide-react"

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

export default function SmartProtokollPage() {
  return (
    <div className="px-6 py-8">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-collapse">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-stone-400">
              <th className="w-16 pb-4 text-left font-medium"></th>
              <th className="w-14 pb-4 text-center font-medium">PULS</th>
              <th className="w-14 pb-4 text-center font-medium">CO2</th>
              <th className="w-14 pb-4 text-center font-medium">MBAR</th>
              <th className="w-14 pb-4 text-center font-medium">
                SPO<sub>2</sub>
              </th>
              <th className="w-14 pb-4 text-center font-medium">EKG</th>
              <th className="w-14 pb-4 text-center font-medium">RHYTM</th>
              <th className="w-48 pb-4 text-center font-medium">CHIRURG</th>
              <th className="w-48 pb-4 text-center font-medium">ANÄSTHESIST</th>
              <th className="w-48 pb-4 text-center font-medium">EVENTS</th>
            </tr>
          </thead>
          <tbody>
            {protocolData.map((row, index) => (
              <tr
                key={index}
                className="border-b border-stone-100 transition-colors duration-150 hover:bg-stone-50 cursor-pointer"
              >
                {/* Time column */}
                <td className="py-3 pr-4 font-mono text-sm text-stone-500">{row.time}</td>

                {/* Vital signs */}
                <td className="py-3 text-center text-sm text-stone-700">{row.puls}</td>
                <td className="py-3 text-center text-sm text-stone-700">{row.co2}</td>
                <td className="py-3 text-center text-sm text-stone-700">{row.mbar}</td>
                <td className="py-3 text-center text-sm text-stone-700">{row.spo2}</td>
                <td className="py-3 text-center text-sm text-stone-700">{row.ekg}</td>
                <td className="py-3 text-center text-sm text-stone-700">{row.rhytm}</td>

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
    </div>
  )
}
