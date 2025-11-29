import Link from "next/link"
import Image from "next/image"
import { Building2, Stethoscope, UserRound, Users } from "lucide-react"

const opList = [
  {
    id: "1",
    caseNumber: "P-2025-0174",
    procedure: "Laparoskopische Cholezystektomie",
    patientName: "Anna Richter",
    birthDate: "12.04.1983",
    age: "42 Jahre",
    date: "28.11.25",
    time: "JETZT",
    isActive: true,
    station: "Chirurgie",
    diagnosis: "Gallensteine (Cholelithiasis)",
    surgeon: "Dr. med. Tobias Meier",
    assistant: "Dr. med. Julia Kranz",
  },
  {
    id: "2",
    caseNumber: "P-2025-0187",
    procedure: "Arthroskopie Kniegelenk",
    patientName: "Michael Wagner",
    birthDate: "23.08.1976",
    age: "49 Jahre",
    date: "28.11.25",
    time: "15:00 Uhr",
    isActive: false,
    station: "Orthopädie",
    diagnosis: "Meniskusriss (Meniscus tear)",
    surgeon: "Prof. Dr. Schneider",
    assistant: "Dr. med. Lukas Bauer",
  },
  {
    id: "3",
    caseNumber: "P-2025-0193",
    procedure: "Appendektomie",
    patientName: "Sophie Müller",
    birthDate: "15.03.1998",
    age: "27 Jahre",
    date: "29.11.25",
    time: "08:30 Uhr",
    isActive: false,
    station: "Chirurgie",
    diagnosis: "Akute Appendizitis",
    surgeon: "Dr. med. Sarah Fischer",
    assistant: "Dr. med. Martin Weber",
  },
  {
    id: "4",
    caseNumber: "P-2025-0201",
    procedure: "Hernien-Repair (Leiste)",
    patientName: "Hans Bergmann",
    birthDate: "07.11.1965",
    age: "60 Jahre",
    date: "29.11.25",
    time: "11:00 Uhr",
    isActive: false,
    station: "Allgemeinchirurgie",
    diagnosis: "Inguinalhernie rechts",
    surgeon: "Dr. med. Tobias Meier",
    assistant: "Dr. med. Anna Schmidt",
  },
]

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="flex h-[50px] shrink-0 items-center bg-primary shadow-sm">
        <div className="mx-auto w-full max-w-7xl px-6">
          <Image src="/brauni-logo-white.svg" alt="BRAUNi" width={140} height={20} className="h-5 w-auto" priority />
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-6 py-6">
          {/* Timeline vertical line */}
          <div className="relative flex flex-col gap-4">
            <div className="absolute left-[76px] top-0 bottom-0 w-px z-10 bg-stone-200 z-0" />

            {opList.map((op) => (
              <Link key={op.id} href={`/op/${op.id}/operationsbericht`} className="block">
                <div className="relative flex items-start gap-4 hover:bg-stone-50 transition-colors rounded-xl p-2">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center z-10">
                    <div className="flex flex-col items-end w-[70px] pr-3 shrink-0">
                      <span className="text-sm font-medium text-stone-600 whitespace-nowrap">{op.date}</span>
                      <span
                        className={`text-sm font-bold whitespace-nowrap ${op.isActive ? "text-primary" : "text-stone-400"}`}
                      >
                        {op.time}
                      </span>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full border-2 transition-colors z-20 ${
                        op.isActive
                          ? "bg-primary border-primary shadow-lg shadow-primary/50"
                          : "bg-white border-stone-300"
                      }`}
                    />
                  </div>

                  <div className="ml-24 flex-1 rounded-xl border bg-white p-5 shadow-sm transition-all ">
                    <div className="mb-1 text-xs font-medium text-muted-foreground">{op.caseNumber}</div>
                    <h3 className="mb-2 text-lg font-bold text-foreground">{op.procedure}</h3>
                    <div className="mb-3 text-sm text-foreground">
                      <span className="font-semibold">{op.patientName}</span>
                      <span className="mx-2 text-muted-foreground">{op.birthDate}</span>
                      <span className="text-muted-foreground">{op.age}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
                      <div className="flex items-center">
                        <span className="flex w-24 items-center gap-1.5 font-mono text-xs text-muted-foreground">
                          <Building2 className="h-3 w-3" />
                          Station
                        </span>
                        <span className="font-semibold text-foreground">{op.station}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="flex w-24 items-center gap-1.5 font-mono text-xs text-muted-foreground">
                          <Stethoscope className="h-3 w-3" />
                          Operateur
                        </span>
                        <span className="font-semibold text-foreground">{op.surgeon}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="flex w-24 items-center gap-1.5 font-mono text-xs text-muted-foreground">
                          <UserRound className="h-3 w-3" />
                          Diagnose
                        </span>
                        <span className="font-semibold text-foreground">{op.diagnosis}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="flex w-24 items-center gap-1.5 font-mono text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          Assistent
                        </span>
                        <span className="font-semibold text-foreground">{op.assistant}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
