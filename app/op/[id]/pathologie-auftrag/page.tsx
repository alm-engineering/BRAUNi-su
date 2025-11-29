"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export default function PathologieAuftragPage() {
  const [formData, setFormData] = useState({
    // Kostenträger
    ambulant: false,
    stationaer: false,
    wahlleistung: "",
    // Art des Materials
    opPraep: false,
    probeexc: false,
    infektioes: "",
    // Text fields
    organLokalisation: "",
    klinischeFragestellung: "",
    anamnese: "",
    // Bottom fields
    datum: "",
    unterschriftStempel: "",
    telefonPiepser: "",
    journalNr: "",
  })

  return (
    <div className="px-6 py-8 pb-32">
      <div className="max-w-4xl">
        <div className="space-y-6">
          {/* Kostenträger */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Kostenträger</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="ambulant"
                    checked={formData.ambulant}
                    onCheckedChange={(checked) => setFormData({ ...formData, ambulant: checked as boolean })}
                  />
                  <Label htmlFor="ambulant">Ambulant</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="stationaer"
                    checked={formData.stationaer}
                    onCheckedChange={(checked) => setFormData({ ...formData, stationaer: checked as boolean })}
                  />
                  <Label htmlFor="stationaer">Stationär</Label>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">(Überweisungsschein beifügen)</div>
              <div className="flex items-center gap-4">
                <Label>Wahlleistung:</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="wahlleistung-nein"
                      checked={formData.wahlleistung === "nein"}
                      onCheckedChange={(checked) => setFormData({ ...formData, wahlleistung: checked ? "nein" : "" })}
                    />
                    <Label htmlFor="wahlleistung-nein">nein</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="wahlleistung-ja"
                      checked={formData.wahlleistung === "ja"}
                      onCheckedChange={(checked) => setFormData({ ...formData, wahlleistung: checked ? "ja" : "" })}
                    />
                    <Label htmlFor="wahlleistung-ja">ja</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Art des Materials */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Art des Materials</h3>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="op-praep"
                    checked={formData.opPraep}
                    onCheckedChange={(checked) => setFormData({ ...formData, opPraep: checked as boolean })}
                  />
                  <Label htmlFor="op-praep">OP-Präp.</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="probeexc"
                    checked={formData.probeexc}
                    onCheckedChange={(checked) => setFormData({ ...formData, probeexc: checked as boolean })}
                  />
                  <Label htmlFor="probeexc">Probeexc.</Label>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Label>Infektiös:</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="infektioes-nein"
                      checked={formData.infektioes === "nein"}
                      onCheckedChange={(checked) => setFormData({ ...formData, infektioes: checked ? "nein" : "" })}
                    />
                    <Label htmlFor="infektioes-nein">nein</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="infektioes-ja"
                      checked={formData.infektioes === "ja"}
                      onCheckedChange={(checked) => setFormData({ ...formData, infektioes: checked ? "ja" : "" })}
                    />
                    <Label htmlFor="infektioes-ja">ja</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Organ / Lokalisation */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4 bg-muted/50 -mx-6 -mt-6 px-6 py-3 rounded-t-lg">Organ / Lokalisation</h3>
            <Textarea
              placeholder="Organ oder Lokalisation eingeben..."
              value={formData.organLokalisation}
              onChange={(e) => setFormData({ ...formData, organLokalisation: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          {/* Klinische Fragestellung */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4 bg-muted/50 -mx-6 -mt-6 px-6 py-3 rounded-t-lg">
              Klinische Fragestellung
            </h3>
            <Textarea
              placeholder="Klinische Fragestellung eingeben..."
              value={formData.klinischeFragestellung}
              onChange={(e) => setFormData({ ...formData, klinischeFragestellung: e.target.value })}
              className="min-h-[120px]"
            />
          </div>

          {/* Anamnese */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4 bg-muted/50 -mx-6 -mt-6 px-6 py-3 rounded-t-lg">
              Anamnese / Ergebnis auswärtiger histologischer Untersuchungen
            </h3>
            <div className="text-sm text-muted-foreground mb-2">(bitte Kopie beifügen)</div>
            <Textarea
              placeholder="Anamnese eingeben..."
              value={formData.anamnese}
              onChange={(e) => setFormData({ ...formData, anamnese: e.target.value })}
              className="min-h-[120px]"
            />
          </div>

          {/* Bottom Section */}
          <div className="rounded-lg border bg-card p-6">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="datum">Datum</Label>
                <Input
                  id="datum"
                  type="date"
                  value={formData.datum}
                  onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="unterschrift">ärztliche Unterschrift und Stempel</Label>
                <Input
                  id="unterschrift"
                  value={formData.unterschriftStempel}
                  onChange={(e) => setFormData({ ...formData, unterschriftStempel: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="telefon">Telefon / Piepser</Label>
                <Input
                  id="telefon"
                  value={formData.telefonPiepser}
                  onChange={(e) => setFormData({ ...formData, telefonPiepser: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="text-center text-sm font-medium mb-4">wird von der Pathologie ausgefüllt</div>
              <div>
                <Label htmlFor="journal">Journal-Nr.</Label>
                <Input
                  id="journal"
                  value={formData.journalNr}
                  onChange={(e) => setFormData({ ...formData, journalNr: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
