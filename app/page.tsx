import Link from "next/link"

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary p-6 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-white">BRAUNi</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl py-12">
        <div className="flex flex-col gap-6">
          {opList.map((op) => (
            <Link key={op.id} href={`/op/${op.id}/operationsbericht`} className="block">
              <div className="flex gap-6 rounded-xl border bg-white p-8 shadow-sm transition-all hover:shadow-md">
                <div
                  className={`flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-xl ${
                    op.isActive ? "bg-primary text-white" : "border-2 border-primary text-primary"
                  }`}
                >
                  <div className="text-xl font-bold">{op.date}</div>
                  <div className="text-sm font-medium">{op.time}</div>
                </div>

                <div className="flex-1">
                  <div className="mb-2 text-sm font-medium text-muted-foreground">{op.caseNumber}</div>
                  <h3 className="mb-3 text-2xl font-bold text-foreground">{op.procedure}</h3>
                  <div className="mb-6 text-base text-foreground">
                    <span className="font-semibold">{op.patientName}</span>
                    <span className="mx-2 text-muted-foreground">{op.birthDate}</span>
                    <span className="text-muted-foreground">{op.age}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-base">
                    <div className="flex">
                      <span className="w-28 font-medium text-muted-foreground">Station</span>
                      <span className="font-semibold text-foreground">{op.station}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-medium text-muted-foreground">Operateur</span>
                      <span className="font-semibold text-foreground">{op.surgeon}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 font-medium text-muted-foreground">Diagnose</span>
                      <span className="font-semibold text-foreground">{op.diagnosis}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-medium text-muted-foreground">Assistent</span>
                      <span className="font-semibold text-foreground">{op.assistant}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
