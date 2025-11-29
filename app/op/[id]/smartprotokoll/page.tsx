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
  chirurg?: {
    type: "spuelung" | "biopsie" | "insufflation" | "schnitt" | "other"
    label: string
    importance: "high" | "medium" | "low"
  } | null
  anesist?: {
    type: "adrenalin" | "propofol" | "fentanyl" | "other"
    label: string
    importance: "high" | "medium" | "low"
  } | null
  event?: {
    type: "puls_sprung" | "spo2_drop" | "bp_change" | "alert" | "other"
    label: string
    importance: "high" | "medium" | "low"
  } | null
  reportText?: string
}

const protocolData: VitalRow[] = [
  {
    time: "00:00",
    puls: 72,
    co2: "4,8%",
    mbar: 0,
    spo2: "99%",
    ekg: "OK",
    rhytm: 72,
    chirurg: { type: "schnitt", label: "Zugang und CO₂-Anlage", importance: "medium" },
    anesist: { type: "propofol", label: "Propofol 200mg", importance: "high" },
    reportText:
      "Nach Einleitung der Allgemeinanästhesie und steriler Abdeckung des Operationsfeldes erfolgt der Zugang über eine subumbilikale Hautinzision. Die Veress-Nadel wird eingeführt und das Kapnoperitoneum mit CO₂ angelegt. Anschließend werden die Arbeitstrokare unter Sicht platziert. Die Trokarinzisionsstellen präsentieren sich trocken ohne aktive Blutung.",
  },
  {
    time: "00:05",
    puls: 68,
    co2: "5,2%",
    mbar: 12,
    spo2: "97%",
    ekg: "OK",
    rhytm: 68,
    chirurg: { type: "other", label: "Exploration und Retraktion", importance: "low" },
    anesist: { type: "fentanyl", label: "Fentanyl 50µg", importance: "medium" },
    reportText:
      "Nach Einbringen der 30°-Optik zeigt sich bei der initialen Exploration des rechten Oberbauchs eine prall gefüllte Gallenblase mit bläulich-livider Wandverfärbung, vereinbar mit einer chronischen Cholezystitis. Die Leberoberfläche stellt sich mit glatter, glänzender Glisson-Kapsel und regelrechter bräunlich-roter Färbung dar. Es finden sich keine relevanten Adhäsionen im Zugangsbereich. Der Gallenblasenfundus wird mit einer atraumatischen Fasszange gefasst und zur kranialen Retraktion angehoben, um die Exposition des Calot-Dreiecks vorzubereiten.",
  },
  {
    time: "00:10",
    puls: 74,
    co2: "5,4%",
    mbar: 12,
    spo2: "97%",
    ekg: "OK",
    rhytm: 74,
    chirurg: { type: "schnitt", label: "Präparation Calot-Dreieck", importance: "high" },
    event: { type: "puls_sprung", label: "Puls +6", importance: "low" },
    reportText:
      "Es erfolgt die systematische Präparation des Calot-Dreiecks zur Etablierung des Critical View of Safety. Das Gallenblaseninfundibulum wird mittels laparoskopischer Fasszange nach lateral und kranial retrahiert. Unter Verwendung eines Maryland-Dissektors wird der peritoneale Überzug sowohl stumpf als auch scharf disseziert. Der Ductus cysticus und die Arteria cystica werden sukzessive aus dem periduktalen Fett- und Bindegewebe freipräpariert und skeletonisiert. Die Dissektion gestaltet sich bei dezenten entzündlichen Veränderungen des perivaskulären Gewebes technisch unproblematisch. Das Operationsfeld bleibt während der gesamten Präparationsphase übersichtlich und weitgehend trocken, lediglich minimale Sickerblutungen im Dissektionsbereich sind zu verzeichnen.",
  },
  {
    time: "00:15",
    puls: 82,
    co2: "5,6%",
    mbar: 14,
    spo2: "96%",
    ekg: "OK",
    rhytm: 82,
    chirurg: { type: "schnitt", label: "Clipapplikation und Durchtrennung", importance: "high" },
    anesist: { type: "propofol", label: "Propofol 50mg", importance: "low" },
    event: { type: "puls_sprung", label: "Puls +8", importance: "medium" },
    reportText:
      "Nach vollständiger Darstellung des Critical View of Safety erfolgt die Clipversorgung der zystischen Strukturen. Am Ductus cysticus werden zwei Clips proximal und ein bis zwei Clips distal appliziert. Die Arteria cystica wird in gleicher Weise mit separaten Titanclips versorgt. Die korrekte Platzierung der Clips wird verifiziert. Das Operationsfeld zeigt sich nach erfolgter Clipapplikation trocken ohne Hinweise auf eine Leckage. Anschließend werden der Ductus cysticus und die Arteria cystica zwischen den applizierten Clips durchtrennt.",
  },
  {
    time: "00:20",
    puls: 78,
    co2: "5,4%",
    mbar: 12,
    spo2: "97%",
    ekg: "OK",
    rhytm: 78,
    chirurg: { type: "schnitt", label: "Retrograde Dissektion", importance: "medium" },
    reportText:
      "Nach Durchtrennung der versorgten Strukturen beginnt die retrograde Dissektion der Gallenblase aus dem Leberbett. Unter Verwendung des Elektrokauters wird die Gallenblase schrittweise von der Fossa vesicae felleae abgelöst. Kleinere Gefäße im Leberbett werden mittels monopolarer Koagulation versorgt. Es zeigen sich im Dissektionsbereich Koagulationsspuren sowie eine geringe grünliche Verfärbung als Hinweis auf minimalen Galleaustritt, welcher klinisch nicht signifikant erscheint. Die Hämostase ist während der gesamten Dissektionsphase adäquat.",
  },
  {
    time: "00:25",
    puls: 85,
    co2: "5,8%",
    mbar: 14,
    spo2: "95%",
    ekg: "OK",
    rhytm: 85,
    chirurg: { type: "schnitt", label: "Ablösung Gallenblase", importance: "medium" },
    anesist: { type: "adrenalin", label: "O₂ erhöht", importance: "medium" },
    event: { type: "spo2_drop", label: "SpO₂ Drop -2%", importance: "high" },
    reportText:
      "Die Ablösung der Gallenblase vom Leberbett wird fortgesetzt. Bei entzündlich verändertem Gewebe im Sinne einer chronischen Cholezystitis erfolgt die Präparation mit besonderer Sorgfalt. Fibrinöse Auflagerungen im Bereich des Gallenblasenbetts werden dargestellt. Die elektrochirurgische Dissektion ermöglicht eine suffiziente Blutstillung. Das Leberbett präsentiert sich nach weitgehender Mobilisation der Gallenblase mit koagulierter Oberfläche ohne aktive Blutungsquellen.",
  },
  {
    time: "00:30",
    puls: 76,
    co2: "5,4%",
    mbar: 12,
    spo2: "97%",
    ekg: "OK",
    rhytm: 76,
    chirurg: { type: "other", label: "Einbringen Bergebeutel", importance: "low" },
    anesist: { type: "propofol", label: "Propofol 30mg", importance: "low" },
    reportText:
      "Nach vollständiger Ablösung der Gallenblase vom Leberbett wird ein transparenter Bergebeutel in die Abdominalhöhle eingebracht. Die resezierte Gallenblase wird vorsichtig in den Endobag platziert. Das Präparat erscheint makroskopisch intakt ohne Hinweise auf eine Perforation. Die Gallenblasenwand zeigt eine chronisch-entzündliche Verdickung mit gelblich-bräunlicher Verfärbung, vereinbar mit dem präoperativ vermuteten Befund einer chronischen Cholezystitis.",
  },
  {
    time: "00:35",
    puls: 70,
    co2: "5,0%",
    mbar: 10,
    spo2: "98%",
    ekg: "OK",
    rhytm: 70,
    chirurg: { type: "spuelung", label: "Finale Kontrolle", importance: "low" },
    reportText:
      "Die finale Inspektion des Gallenblasenbetts zeigt eine trockene Leberoberfläche ohne aktive Blutung. Die Clipstellen am Ductus-cysticus-Stumpf und am Arteria-cystica-Stumpf stellen sich regelrecht ohne Hinweise auf eine Leckage dar. Eine Nachkoagulation ist nicht erforderlich. Das Operationsfeld wird abschließend inspiziert, es finden sich keine zurückgelassenen Fremdkörper oder pathologischen Befunde.",
  },
  {
    time: "00:40",
    puls: 66,
    co2: "4,6%",
    mbar: 0,
    spo2: "99%",
    ekg: "OK",
    rhytm: 66,
    chirurg: { type: "insufflation", label: "Extraktion und Abschluss", importance: "low" },
    reportText:
      "Die im Bergebeutel befindliche Gallenblase wird über den erweiterten Umbilikalport kontaminationsfrei extrahiert. Der Bergebeutel ist intakt, ein Steinverlust oder Gallenaustritt wird ausgeschlossen. Nach Entfernung der Trokare unter Sicht erfolgt die Deinsufflation des Pneumoperitoneums. Die Operation wird komplikationslos beendet. Das Präparat wird zur histopathologischen Untersuchung eingesandt.",
  },
]

function EmptyCell() {
  return <div className="h-9 w-full rounded-md bg-stone-50 border border-stone-100" />
}

function ActionTag({
  type,
  label,
  importance,
}: {
  type: string
  label: string
  importance: "high" | "medium" | "low"
}) {
  const importanceColors = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-emerald-500",
  }

  const iconColor = "text-stone-400"

  return (
    <div className="flex items-center gap-2 rounded-md bg-white border border-stone-200 px-3 py-2">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${importanceColors[importance]}`} />
      <span className={iconColor}>
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
      <span className="text-sm font-medium text-stone-700">{label}</span>
    </div>
  )
}

const chartData = protocolData.map((row) => ({
  time: row.time,
  puls: row.puls || 0,
  co2: Number.parseFloat(row.co2?.replace(",", ".").replace("%", "") || "0"),
  mbar: row.mbar || 0,
  spo2: Number.parseFloat(row.spo2?.replace("%", "") || "0"),
  rhytm: row.rhytm || 0,
}))

export default function SmartProtokollPage() {
  const [selectedRow, setSelectedRow] = useState<VitalRow | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleRowClick = (row: VitalRow) => {
    setSelectedRow(row)
    setIsDrawerOpen(true)
  }

  return (
    <div className="px-6 py-8">
      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <div className="relative">
          <div className="absolute left-10 top-0 bottom-0 w-px bg-stone-200" />

          <div className="flex items-center gap-4 mb-6 pl-24">
            <span className="text-xs uppercase tracking-wide text-stone-400 font-medium w-[35%]">Chirurg</span>
            <span className="text-xs uppercase tracking-wide text-stone-400 font-medium w-[35%]">Anästhesist</span>
            <span className="text-xs uppercase tracking-wide text-stone-400 font-medium flex-1">Events</span>
          </div>

          <div className="flex flex-col">
            {protocolData.map((row, index) => (
              <div
                key={index}
                onClick={() => handleRowClick(row)}
                className="relative flex items-start gap-4 py-3 pl-24 pr-2 hover:bg-stone-50 cursor-pointer transition-colors group rounded-lg"
              >
                <div className="absolute left-0 flex items-center gap-2">
                  <span className="font-mono text-sm text-stone-400 group-hover:text-stone-900 transition-colors w-16 text-right">
                    {row.time}
                  </span>
                  <div className="w-3 h-3 rounded-full bg-white border-2 border-stone-300 group-hover:border-stone-500 group-hover:bg-stone-500 transition-colors z-10" />
                </div>

                <div className="flex items-start gap-4 flex-1 min-h-[44px]">
                  <div className="w-[35%]">
                    {row.chirurg ? (
                      <div className="flex items-center gap-2 rounded-md bg-white border border-stone-200 px-3 py-2 group-hover:border-stone-300 transition-colors">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            row.chirurg.importance === "high"
                              ? "bg-red-500"
                              : row.chirurg.importance === "medium"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }`}
                        />
                        <span className="text-stone-400">
                          {row.chirurg.type === "spuelung" && <Droplets className="h-4 w-4" />}
                          {row.chirurg.type === "schnitt" && <Scissors className="h-4 w-4" />}
                          {row.chirurg.type === "insufflation" && <Activity className="h-4 w-4" />}
                          {row.chirurg.type === "other" && <Activity className="h-4 w-4" />}
                        </span>
                        <span className="text-sm font-medium text-stone-700 truncate">{row.chirurg.label}</span>
                      </div>
                    ) : (
                      <div className="h-10 w-full rounded-md bg-stone-50 border border-stone-100" />
                    )}
                  </div>

                  <div className="w-[35%]">
                    {row.anesist ? (
                      <div className="flex items-center gap-2 rounded-md bg-white border border-stone-200 px-3 py-2 group-hover:border-stone-300 transition-colors">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            row.anesist.importance === "high"
                              ? "bg-red-500"
                              : row.anesist.importance === "medium"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }`}
                        />
                        <span className="text-stone-400">
                          {row.anesist.type === "propofol" && <Pill className="h-4 w-4" />}
                          {row.anesist.type === "fentanyl" && <Syringe className="h-4 w-4" />}
                          {row.anesist.type === "adrenalin" && <Syringe className="h-4 w-4" />}
                          {row.anesist.type === "other" && <Pill className="h-4 w-4" />}
                        </span>
                        <span className="text-sm font-medium text-stone-700 truncate">{row.anesist.label}</span>
                      </div>
                    ) : (
                      <div className="h-10 w-full rounded-md bg-stone-50 border border-stone-100" />
                    )}
                  </div>

                  <div className="flex-1">
                    {row.event ? (
                      <div className="flex items-center gap-2 rounded-md bg-white border border-stone-200 px-3 py-2 group-hover:border-stone-300 transition-colors">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            row.event.importance === "high"
                              ? "bg-red-500"
                              : row.event.importance === "medium"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }`}
                        />
                        <span className="text-stone-400">
                          {row.event.type === "puls_sprung" && <TrendingUp className="h-4 w-4" />}
                          {row.event.type === "spo2_drop" && <AlertTriangle className="h-4 w-4" />}
                          {row.event.type === "bp_change" && <Activity className="h-4 w-4" />}
                        </span>
                        <span className="text-sm font-medium text-stone-700 truncate">{row.event.label}</span>
                      </div>
                    ) : (
                      <div className="h-10 w-full rounded-md bg-stone-50 border border-stone-100" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-[520px] sm:w-[580px] px-6 py-4 flex flex-col h-full overflow-hidden">
          <SheetHeader className="flex-shrink-0 mb-2">
            <SheetTitle className="text-lg font-semibold text-stone-900">Zeitblock {selectedRow?.time}</SheetTitle>
            <p className="text-xs text-stone-500">{selectedRow?.chirurg?.label}</p>
          </SheetHeader>

          {selectedRow && (
            <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
              <div className="flex-shrink-0">
                <div className="relative aspect-video w-full max-h-32 rounded-lg overflow-hidden bg-stone-900 group cursor-pointer">
                  <video
                    className="w-full h-full object-cover opacity-90"
                    poster={`/placeholder.svg?height=128&width=400&query=endoscopy laparoscopic surgery video frame cholecystectomy ${selectedRow.time}`}
                  >
                    <source src={`/videos/op-${selectedRow.time.replace(":", "-")}.mp4`} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 text-stone-900 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between">
                    <span className="text-white text-[10px] font-medium bg-stone-900/50 px-1.5 py-0.5 rounded-full">
                      {selectedRow.time} - {selectedRow.time.split(":")[0]}:
                      {String(Number(selectedRow.time.split(":")[1]) + 5).padStart(2, "0")}
                    </span>
                    <span className="text-white/80 text-[10px] bg-stone-900/50 px-1.5 py-0.5 rounded-full">5:00</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 border border-stone-200 rounded-lg p-2 bg-white">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <Heart className="w-3 h-3 text-rose-500" />
                    <span className="text-xs font-semibold text-stone-900">{selectedRow.puls}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <Wind className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs font-semibold text-stone-900">{selectedRow.spo2}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <Gauge className="w-3 h-3 text-amber-500" />
                    <span className="text-xs font-semibold text-stone-900">{selectedRow.mbar}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <Activity className="w-3 h-3 text-blue-500" />
                    <span className="text-xs font-semibold text-stone-900">{selectedRow.co2}</span>
                  </div>
                </div>
              </div>

              {selectedRow.reportText && (
                <div className="flex-shrink-0 border border-stone-200 rounded-lg p-3 bg-stone-50">
                  <h4 className="text-[10px] uppercase tracking-wide text-stone-400 font-medium mb-1">OP-Bericht</h4>
                  <p className="text-xs text-stone-700 leading-relaxed">{selectedRow.reportText}</p>
                </div>
              )}

              <div className="flex flex-col gap-2 flex-1 min-h-0">
                <div className="rounded-lg border border-stone-200 bg-white p-2">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span className="text-[10px] text-stone-500">Puls</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-stone-500">SpO₂</span>
                    </div>
                  </div>
                  <div className="h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 2, right: 2, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="pulsGradientCompact" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#e11d48" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#e11d48" stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="spo2GradientCompact" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 8, fill: "#a8a29e" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[50, 100]}
                          tick={{ fontSize: 8, fill: "#a8a29e" }}
                          axisLine={false}
                          tickLine={false}
                          width={20}
                        />
                        <Area
                          type="monotone"
                          dataKey="puls"
                          stroke="#e11d48"
                          strokeWidth={1.5}
                          fill="url(#pulsGradientCompact)"
                        />
                        <Area
                          type="monotone"
                          dataKey="spo2"
                          stroke="#10b981"
                          strokeWidth={1.5}
                          fill="url(#spo2GradientCompact)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-lg border border-stone-200 bg-white p-2">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-[10px] text-stone-500">CO₂</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-[10px] text-stone-500">MBAR</span>
                    </div>
                  </div>
                  <div className="h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 2, right: 2, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="co2GradientCompact" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                          </linearGradient>
                          <linearGradient id="mbarGradientCompact" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                        <XAxis
                          dataKey="time"
                          tick={{ fontSize: 8, fill: "#a8a29e" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 16]}
                          tick={{ fontSize: 8, fill: "#a8a29e" }}
                          axisLine={false}
                          tickLine={false}
                          width={20}
                        />
                        <Area
                          type="monotone"
                          dataKey="co2"
                          stroke="#3b82f6"
                          strokeWidth={1.5}
                          fill="url(#co2GradientCompact)"
                        />
                        <Area
                          type="monotone"
                          dataKey="mbar"
                          stroke="#f59e0b"
                          strokeWidth={1.5}
                          fill="url(#mbarGradientCompact)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
