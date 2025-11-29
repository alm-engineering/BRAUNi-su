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
    caseNumber: "P-2025-0174",
    procedure: "Laparoskopische Cholezystektomie",
    patientName: "Anna Richter",
    birthDate: "12.04.1983",
    age: "42 Jahre",
    date: "28.11.25",
    time: "15 Uhr",
    isActive: false,
    station: "Chirurgie",
    diagnosis: "Gallensteine (Cholelithiasis)",
    surgeon: "Dr. med. Tobias Meier",
    assistant: "Dr. med. Julia Kranz",
  },
  {
    id: "3",
    caseNumber: "P-2025-0174",
    procedure: "Laparoskopische Cholezystektomie",
    patientName: "Anna Richter",
    birthDate: "12.04.1983",
    age: "42 Jahre",
    date: "28.11.25",
    time: "15 Uhr",
    isActive: false,
    station: "Chirurgie",
    diagnosis: "Gallensteine (Cholelithiasis)",
    surgeon: "Dr. med. Tobias Meier",
    assistant: "Dr. med. Julia Kranz",
  },
  {
    id: "4",
    caseNumber: "P-2025-0174",
    procedure: "Laparoskopische Cholezystektomie",
    patientName: "Anna Richter",
    birthDate: "12.04.1983",
    age: "42 Jahre",
    date: "28.11.25",
    time: "15 Uhr",
    isActive: false,
    station: "Chirurgie",
    diagnosis: "Gallensteine (Cholelithiasis)",
    surgeon: "Dr. med. Tobias Meier",
    assistant: "Dr. med. Julia Kranz",
  },
]

export default function HomePage() {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="flex h-[50px] shrink-0 items-center bg-primary px-6 shadow-sm">
        <Image src="/brauni-logo-white.svg" alt="BRAUNi" width={140} height={20} className="h-5 w-auto" priority />
      </header>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col gap-4">
            {opList.map((op) => (
              <Link key={op.id} href={`/op/${op.id}/operationsbericht`} className="block">
                <div className="flex gap-4 rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md">
                  <div
                    className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-lg ${
                      op.isActive ? "bg-primary text-white" : "border-2 border-primary text-primary"
                    }`}
                  >
                    <div className="text-base font-bold">{op.date}</div>
                    <div className="text-xs font-medium">{op.time}</div>
                  </div>

                  <div className="flex-1">
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
