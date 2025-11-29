"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Plus, Check, X } from "lucide-react"

interface BillingItem {
  code: string
  description: string
}

export default function AbrechnungsprotokollPage() {
  const [billingCodes, setBillingCodes] = useState<BillingItem[]>([
    {
      code: "5-511.11",
      description: "Cholezystektomie: Einfach, laparoskopisch: Ohne laparoskopische Revision der Gallengänge",
    },
  ])

  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editedDescription, setEditedDescription] = useState("")
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newCode, setNewCode] = useState("")
  const [newDescription, setNewDescription] = useState("")

  const startEditing = (index: number, currentDescription: string) => {
    setEditingIndex(index)
    setEditedDescription(currentDescription)
    setIsAddingNew(false)
  }

  const saveEdit = (index: number) => {
    const updated = [...billingCodes]
    updated[index].description = editedDescription
    setBillingCodes(updated)
    setEditingIndex(null)
    setEditedDescription("")
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditedDescription("")
  }

  const startAddingNew = () => {
    setIsAddingNew(true)
    setEditingIndex(null)
    setNewCode("")
    setNewDescription("")
  }

  const saveNew = () => {
    if (newCode.trim() && newDescription.trim()) {
      setBillingCodes([...billingCodes, { code: newCode, description: newDescription }])
      setIsAddingNew(false)
      setNewCode("")
      setNewDescription("")
    }
  }

  const cancelNew = () => {
    setIsAddingNew(false)
    setNewCode("")
    setNewDescription("")
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pb-32">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Abrechnungsprotokoll</h1>
        <Button onClick={startAddingNew} disabled={isAddingNew} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Neuen Eintrag hinzufügen
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold w-[200px]">Code</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Bezeichnung</th>
                <th className="px-6 py-4 text-right text-sm font-semibold w-[120px]">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {isAddingNew && (
                <tr className="border-b bg-muted/20">
                  <td className="px-6 py-4">
                    <Input
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder="z.B. 5-511.11"
                      className="font-mono"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Input
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Bezeichnung eingeben..."
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button onClick={saveNew} size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button onClick={cancelNew} size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )}

              {billingCodes.map((item, index) => (
                <tr key={index} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-semibold">{item.code}</td>
                  <td className="px-6 py-4 text-base">
                    {editingIndex === index ? (
                      <Input
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      item.description
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {editingIndex === index ? (
                        <>
                          <Button onClick={() => saveEdit(index)} size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button onClick={cancelEdit} size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => startEditing(index, item.description)}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
