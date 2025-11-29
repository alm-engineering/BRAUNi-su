"use client"

import { Link, TrendingUp, Syringe, Droplets, Pill, AlertTriangle, Activity } from "lucide-react"

interface VitalRow {
  time: string
  puls?: number
  co2?: string
  mbar?: number
  spo2?: string
  ekg?: string
  rhytm?: number
  chirurg?: { type: "spuelung" | "biopsie" | "insufflation" | "other"; label: string } | null
  anesist?: { type: "adrenalin" | "propofol" | "fentanyl" | "other"; label: string } | null
  event?: { type: "puls_sprung" | "spo2_drop" | "bp_change" | "alert" | "other"; label: string } | null
}

const protocolData: VitalRow[] = [
  // Start of procedure - patient sedation
  {
    time: "00:00",
    puls: 72,
    co2: "4,8%",
    mbar: 0,
    spo2: "99%",
    ekg: "OK",
    rhytm: 72,
    anesist: { type: "propofol", label: "Propofol 200mg" },
  },
  { time: "00:01", puls: 68, co2: "4,6%", mbar: 0, spo2: "98%", ekg: "OK", rhytm: 68 },
  {
    time: "00:02",
    puls: 65,
    co2: "4,5%",
    mbar: 0,
    spo2: "98%",
    ekg: "OK",
    rhytm: 65,
    anesist: { type: "fentanyl", label: "Fentanyl 50µg" },
  },
  {
    time: "00:03",
    puls: 64,
    co2: "4,5%",
    mbar: 8,
    spo2: "97%",
    ekg: "OK",
    rhytm: 64,
    chirurg: { type: "insufflation", label: "Insufflation Start" },
  },
  { time: "00:04", puls: 66, co2: "4,7%", mbar: 10, spo2: "97%", ekg: "OK", rhytm: 66 },
  { time: "00:05", puls: 68, co2: "4,8%", mbar: 12, spo2: "97%", ekg: "OK", rhytm: 68 },
  // Scope insertion
  {
    time: "00:06",
    puls: 74,
    co2: "5,0%",
    mbar: 12,
    spo2: "96%",
    ekg: "OK",
    rhytm: 74,
    event: { type: "puls_sprung", label: "Puls +6" },
  },
  { time: "00:07", puls: 76, co2: "5,1%", mbar: 12, spo2: "96%", ekg: "OK", rhytm: 76 },
  {
    time: "00:08",
    puls: 78,
    co2: "5,2%",
    mbar: 14,
    spo2: "95%",
    ekg: "OK",
    rhytm: 78,
    chirurg: { type: "spuelung", label: "Spülung" },
  },
  { time: "00:09", puls: 75, co2: "5,1%", mbar: 12, spo2: "96%", ekg: "OK", rhytm: 75 },
  { time: "00:10", puls: 72, co2: "5,0%", mbar: 12, spo2: "97%", ekg: "OK", rhytm: 72 },
  // Examination phase
  { time: "00:12", puls: 70, co2: "4,9%", mbar: 12, spo2: "97%", ekg: "OK", rhytm: 70 },
  {
    time: "00:14",
    puls: 71,
    co2: "4,9%",
    mbar: 14,
    spo2: "97%",
    ekg: "OK",
    rhytm: 71,
    chirurg: { type: "spuelung", label: "Spülung" },
  },
  { time: "00:16", puls: 69, co2: "4,8%", mbar: 12, spo2: "97%", ekg: "OK", rhytm: 69 },
  {
    time: "00:18",
    puls: 68,
    co2: "4,8%",
    mbar: 12,
    spo2: "98%",
    ekg: "OK",
    rhytm: 68,
    anesist: { type: "propofol", label: "Propofol 50mg" },
  },
  { time: "00:20", puls: 65, co2: "4,7%", mbar: 12, spo2: "97%", ekg: "OK", rhytm: 65 },
  // Biopsy taken
  {
    time: "00:22",
    puls: 82,
    co2: "5,4%",
    mbar: 14,
    spo2: "95%",
    ekg: "OK",
    rhytm: 82,
    chirurg: { type: "biopsie", label: "Biopsie Antrum" },
    event: { type: "puls_sprung", label: "Puls +17" },
  },
  {
    time: "00:23",
    puls: 85,
    co2: "5,5%",
    mbar: 14,
    spo2: "94%",
    ekg: "OK",
    rhytm: 85,
    event: { type: "spo2_drop", label: "SpO₂ Drop" },
  },
  {
    time: "00:24",
    puls: 80,
    co2: "5,3%",
    mbar: 12,
    spo2: "95%",
    ekg: "OK",
    rhytm: 80,
    anesist: { type: "adrenalin", label: "O₂ erhöht" },
  },
  { time: "00:25", puls: 76, co2: "5,1%", mbar: 12, spo2: "96%", ekg: "OK", rhytm: 76 },
  {
    time: "00:26",
    puls: 74,
    co2: "5,0%",
    mbar: 12,
    spo2: "97%",
    ekg: "OK",
    rhytm: 74,
    chirurg: { type: "spuelung", label: "Spülung" },
  },
  // Second biopsy
  { time: "00:28", puls: 72, co2: "4,9%", mbar: 12, spo2: "97%", ekg: "OK", rhytm: 72 },
  {
    time: "00:30",
    puls: 78,
    co2: "5,2%",
    mbar: 14,
    spo2: "96%",
    ekg: "OK",
    rhytm: 78,
    chirurg: { type: "biopsie", label: "Biopsie Corpus" },
  },
  { time: "00:32", puls: 74, co2: "5,0%", mbar: 12, spo2: "97%", ekg: "OK", rhytm: 74 },
  {
    time: "00:34",
    puls: 71,
    co2: "4,9%",
    mbar: 12,
    spo2: "97%",
    ekg: "OK",
    rhytm: 71,
    anesist: { type: "propofol", label: "Propofol 30mg" },
  },
  {
    time: "00:36",
    puls: 68,
    co2: "4,8%",
    mbar: 10,
    spo2: "98%",
    ekg: "OK",
    rhytm: 68,
    chirurg: { type: "spuelung", label: "Spülung" },
  },
  // Withdrawal phase
  { time: "00:38", puls: 66, co2: "4,7%", mbar: 8, spo2: "98%", ekg: "OK", rhytm: 66 },
  {
    time: "00:40",
    puls: 64,
    co2: "4,6%",
    mbar: 6,
    spo2: "98%",
    ekg: "OK",
    rhytm: 64,
    chirurg: { type: "insufflation", label: "Insufflation Stop" },
  },
  { time: "00:42", puls: 66, co2: "4,5%", mbar: 0, spo2: "99%", ekg: "OK", rhytm: 66 },
  { time: "00:44", puls: 68, co2: "4,5%", mbar: 0, spo2: "99%", ekg: "OK", rhytm: 68 },
  { time: "00:45", puls: 70, co2: "4,6%", mbar: 0, spo2: "99%", ekg: "OK", rhytm: 70 },
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
      {type === "spuelung" && <Droplets className="h-4 w-4" />}
      {type === "biopsie" && <Link className="h-4 w-4" />}
      {type === "insufflation" && <Activity className="h-4 w-4" />}
      {type === "adrenalin" && <Syringe className="h-4 w-4" />}
      {type === "propofol" && <Pill className="h-4 w-4" />}
      {type === "fentanyl" && <Syringe className="h-4 w-4" />}
      {type === "puls_sprung" && <TrendingUp className="h-4 w-4" />}
      {type === "spo2_drop" && <AlertTriangle className="h-4 w-4" />}
      {type === "bp_change" && <Activity className="h-4 w-4" />}
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
              <tr
                key={index}
                className="border-b border-stone-100 transition-colors duration-150 hover:bg-stone-50 cursor-pointer"
              >
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
