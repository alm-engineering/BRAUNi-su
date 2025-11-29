"use client"

export default function AbrechnungsprotokollPage() {
  const billingCodes = [
    {
      code: "5-511.11",
      description: "Cholezystektomie: Einfach, laparoskopisch: Ohne laparoskopische Revision der Gallengänge",
    },
  ]

  return (
    <div className="px-6 py-8 pb-32">
      <div className="max-w-4xl">
        <div className="rounded-lg border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Bezeichnung</th>
                </tr>
              </thead>
              <tbody>
                {billingCodes.map((item, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold">{item.code}</td>
                    <td className="px-6 py-4">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
