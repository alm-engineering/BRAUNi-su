"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Mic, MicOff } from "lucide-react"

export default function OperationsberichtPage() {
  const [sentences, setSentences] = useState([
    "Nach sterilem Abwaschen und Abdecken des Operationsgebiets erfolgt zunächst ein subumbilikaler Hautschnitt.",
    "Hierüber wird die Verres-Kanüle eingebracht.",
    "Schlürfprobe positiv.",
    "Problemlose Anlage des Kapnoperitoneums mit CO2 auf einen Druck von ca. 12mmHg.",
    "Nach Setzen des 10mm Kameratrokars wird explorativ laparoskopiert.",
    "Anschließend wird subxyphoidal ein 5mm Trokar, im linken Mittelbauch ein 10mm Trokar sowie im rechten Mittelbauch in der vorderen Axillarlinie ein 5mm Trokar eingebracht.",
    "Uber den subxyphoidalen Zugang wird eine Fasszange eingebracht, mit der die Gallenblase nach kranial exponiert wird.",
    "Zunächst werden die pericholezystischen Adhäsionen mittels Elektrokoagulation gelöst.",
    "Anschließend problemlose Darstellung des Calot-Dreiecks.",
    "Nach Präparation und eindeutiger Darstellung des Ductus cysticus sowie der A. cystica werden die Strukturen jeweils mit drei Clips versorgt und dann mit Hakenschere durchtrennt.",
    "Nun Auslösen der Gallenblase aus dem Leberbett mit dem Elektrohaken.",
    "Nun wird die Gallenblase in einen Bergebeutel verpackt.",
    "Anschließend Blutstillung mittels Elektrokoagulation.",
    "Umsetzen der Kamera in den Trokar im linken Mittelbauch.",
    "Nun Erweiterung der umbilikalen Faszieninzision um ca. 1cm entlang des Trokars und Extraktion der Gallenblase in toto.",
    "Nun subumbilikaler Faszienverschluss und anschließend Kontrolle der Fasziennaht von intraabdominell.",
    "Nun Ablassen des Kapnoperitoneums und Entfernen der drei verbleibenden Trokare.",
    "Die 10mm Trokarinzision im linken Mittelbauch wird mit einer Fasziennaht versorgt.",
    "Nun intrakutane Hautnaht, steriler Verband.",
  ])

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  const startVoiceRecording = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Spracherkennung wird in diesem Browser nicht unterstützt.")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognitionInstance = new SpeechRecognition()

    recognitionInstance.lang = "de-DE"
    recognitionInstance.continuous = true
    recognitionInstance.interimResults = true

    recognitionInstance.onstart = () => {
      setIsRecording(true)
    }

    recognitionInstance.onresult = (event: any) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " "
        } else {
          interimTranscript += transcript
        }
      }

      if (finalTranscript) {
        setEditedText((prev) => prev + finalTranscript)
      }
    }

    recognitionInstance.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
      setIsRecording(false)
    }

    recognitionInstance.onend = () => {
      setIsRecording(false)
    }

    recognitionInstance.start()
    setRecognition(recognitionInstance)
  }

  const stopVoiceRecording = () => {
    if (recognition) {
      recognition.stop()
      setRecognition(null)
    }
    setIsRecording(false)
  }

  const handleEdit = () => {
    setEditedText(sentences[selectedIndex])
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editedText.trim()) {
      const newSentences = [...sentences]
      newSentences[selectedIndex] = editedText
      setSentences(newSentences)
      setIsEditing(false)
      if (isRecording) {
        stopVoiceRecording()
      }
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedText("")
    if (isRecording) {
      stopVoiceRecording()
    }
  }

  return (
    <div className="px-6 py-8 pb-24">
      <div className="flex gap-6 items-start">
        {/* Main Content */}
        <div className="flex-1">
          <div className="rounded-lg border bg-card p-8">
            <p className="text-muted-foreground leading-relaxed">
              {sentences.map((sentence, index) => (
                <span
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedIndex(index)}
                  className={`
                    px-1 py-0.5 rounded transition-colors duration-200 cursor-pointer
                    ${hoveredIndex === index || selectedIndex === index ? "bg-blue-100" : "bg-transparent"}
                  `}
                >
                  {sentence}{" "}
                </span>
              ))}
            </p>
          </div>
        </div>

        <aside className="w-80 sticky top-6">
          <div className="rounded-lg border bg-card p-6 h-full">
            <h3 className="font-semibold mb-4">Ausgewählter Text</h3>

            <div className="space-y-4">
              <div className="text-sm">
                <p className="text-muted-foreground mb-2">Satz {selectedIndex + 1}</p>
                {isEditing ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="min-h-32 leading-relaxed"
                    />
                    <Button
                      onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-4 h-4 mr-2" />
                          Aufnahme stoppen
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 mr-2" />
                          Sprachaufnahme starten
                        </>
                      )}
                    </Button>
                    {isRecording && (
                      <p className="text-xs text-muted-foreground text-center animate-pulse">Aufnahme läuft...</p>
                    )}
                  </div>
                ) : (
                  <p className="leading-relaxed">{sentences[selectedIndex]}</p>
                )}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} size="sm" className="flex-1">
                      Speichern
                    </Button>
                    <Button onClick={handleCancel} size="sm" variant="outline" className="flex-1 bg-transparent">
                      Abbrechen
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEdit} size="sm" className="w-full">
                    Bearbeiten
                  </Button>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
