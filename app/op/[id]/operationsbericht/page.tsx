"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Mic, MicOff, Loader2, Undo2 } from "lucide-react"
import { toast } from "sonner"

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

  const [originalSentences] = useState([...sentences])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [editedText, setEditedText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [isTranscribing, setIsTranscribing] = useState(false)

  const [postoperativeText, setPostoperativeText] = useState("")
  const [isRecordingPostop, setIsRecordingPostop] = useState(false)
  const [isTranscribingPostop, setIsTranscribingPostop] = useState(false)
  const mediaRecorderPostopRef = useRef<MediaRecorder | null>(null)
  const audioChunksPostopRef = useRef<Blob[]>([])

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        await transcribeAndApplyFeedback(audioBlob)

        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Fehler beim Zugriff auf das Mikrofon. Bitte Berechtigungen überprüfen.")
    }
  }

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const transcribeAndApplyFeedback = async (audioBlob: Blob) => {
    setIsTranscribing(true)

    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.webm")

      const transcribeResponse = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!transcribeResponse.ok) {
        throw new Error("Transcription failed")
      }

      const transcribeData = await transcribeResponse.json()
      const feedback = transcribeData.text

      if (!feedback) {
        alert("Kein Feedback erkannt. Bitte erneut versuchen.")
        return
      }

      setIsTranscribing(false)

      const applyFeedbackResponse = await fetch("/api/apply-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalText: sentences[selectedIndex],
          feedback: feedback,
        }),
      })

      if (!applyFeedbackResponse.ok) {
        throw new Error("Failed to apply feedback")
      }

      const applyFeedbackData = await applyFeedbackResponse.json()
      const modifiedText = applyFeedbackData.modifiedText

      if (modifiedText) {
        const newSentences = [...sentences]
        newSentences[selectedIndex] = modifiedText
        setSentences(newSentences)
        setEditedText(modifiedText)
      }
    } catch (error) {
      console.error("Feedback processing error:", error)
      alert("Fehler bei der Verarbeitung des Feedbacks. Bitte erneut versuchen.")
    } finally {
      setIsTranscribing(false)
    }
  }

  const startPostopRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      audioChunksPostopRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksPostopRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksPostopRef.current, { type: "audio/webm" })
        await transcribePostop(audioBlob)

        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      mediaRecorderPostopRef.current = mediaRecorder
      setIsRecordingPostop(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Fehler beim Zugriff auf das Mikrofon. Bitte Berechtigungen überprüfen.")
    }
  }

  const stopPostopRecording = () => {
    if (mediaRecorderPostopRef.current && isRecordingPostop) {
      mediaRecorderPostopRef.current.stop()
      setIsRecordingPostop(false)
    }
  }

  const transcribePostop = async (audioBlob: Blob) => {
    setIsTranscribingPostop(true)

    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.webm")

      const transcribeResponse = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!transcribeResponse.ok) {
        throw new Error("Transcription failed")
      }

      const transcribeData = await transcribeResponse.json()
      const transcribedText = transcribeData.text

      if (transcribedText) {
        setPostoperativeText((prev) => (prev ? prev + " " + transcribedText : transcribedText))
        toast.success("Diktat transkribiert", {
          description: "Der Text wurde erfolgreich hinzugefügt.",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Transcription error:", error)
      alert("Fehler bei der Transkription. Bitte erneut versuchen.")
    } finally {
      setIsTranscribingPostop(false)
    }
  }

  const handleSave = () => {
    if (selectedIndex === null) return
    if (editedText.trim()) {
      const newSentences = [...sentences]
      newSentences[selectedIndex] = editedText
      setSentences(newSentences)
      toast.success("Erfolgreich gespeichert", {
        description: "Der Text wurde erfolgreich aktualisiert.",
        duration: 3000,
      })
    }
  }

  const handleUndoAI = () => {
    if (selectedIndex === null) return
    const originalText = originalSentences[selectedIndex]
    setEditedText(originalText)
    const newSentences = [...sentences]
    newSentences[selectedIndex] = originalText
    setSentences(newSentences)
  }

  const handleSelectSentence = (index: number) => {
    setSelectedIndex(index)
    setEditedText(sentences[index])
  }

  const handleExportPDF = async () => {
    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sentences,
          postoperativeText,
          patientInfo: {
            name: "Anna Richter, 12.04.1983, 42 Jahre",
            opDate: "28.11.2025",
            diagnosis: "Gallensteine (Cholelithiasis)",
            operation: "Laparoskopische Cholezystektomie",
            surgeons: "Dr. med. Tobias Meier",
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Export failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "operationsbericht.pdf"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export error:", error)
      alert("Fehler beim Export des PDFs")
    }
  }

  useEffect(() => {
    const pathParts = window.location.pathname.split("/")
    const id = pathParts[2] // /op/[id]/operationsbericht
    if (id) {
      localStorage.setItem(`op-${id}-sentences`, JSON.stringify(sentences))
      console.log("[v0] Saved sentences to localStorage:", `op-${id}-sentences`, sentences.length)
    }
  }, [sentences])

  useEffect(() => {
    const pathParts = window.location.pathname.split("/")
    const id = pathParts[2]
    if (id) {
      const saved = localStorage.getItem(`op-${id}-postoperative`)
      if (saved) {
        setPostoperativeText(saved)
      }
    }
  }, [])

  useEffect(() => {
    const pathParts = window.location.pathname.split("/")
    const id = pathParts[2]
    if (id) {
      localStorage.setItem(`op-${id}-postoperative`, postoperativeText)
    }
  }, [postoperativeText])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pb-24">
      <h1 className="text-2xl font-semibold mb-6">Operationsbericht</h1>

      <div className="relative">
        <div className="grid md:grid-cols-[2fr_1fr] gap-6 items-start">
          {/* Main Content */}
          <div>
            <div id="operationsbericht-container">
              <div className="rounded-lg border bg-card p-8">
                <p className="text-muted-foreground leading-loose">
                  {sentences.map((sentence, index) => (
                    <span
                      key={index}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => handleSelectSentence(index)}
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
          </div>

          <aside className="self-start sticky top-6">
            <div className="rounded-lg border bg-card p-6 h-full">
              {selectedIndex === null ? (
                <div className="flex items-center justify-center h-full min-h-[300px] text-muted-foreground text-sm">
                  Klicken Sie auf einen Satz, um ihn zu bearbeiten
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4 h-8">
                    <h3 className="font-semibold">Ausgewählter Text</h3>
                    {editedText !== originalSentences[selectedIndex] && (
                      <Button
                        onClick={handleUndoAI}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Änderungen verwerfen"
                      >
                        <Undo2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="text-xs text-muted-foreground">Satz {selectedIndex + 1}</div>

                    <Textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="min-h-[200px] text-sm"
                      placeholder="Text bearbeiten..."
                      disabled={isRecording || isTranscribing}
                    />

                    {isRecording && (
                      <p className="text-xs text-muted-foreground animate-pulse">Sprechen Sie Ihr Feedback...</p>
                    )}
                    {isTranscribing && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Transkription läuft...
                      </div>
                    )}

                    <div className="space-y-2">
                      <Button
                        onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        disabled={isTranscribing}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="w-4 h-4 mr-2" />
                            Feedback stoppen
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-2" />
                            Feedback starten
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={handleSave}
                        size="sm"
                        className="w-full"
                        disabled={isRecording || isTranscribing}
                      >
                        Speichern
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold">Postoperative Anforderungen</h2>

        <div className="rounded-lg border bg-card p-8">
          <div className="space-y-4">
            <Textarea
              value={postoperativeText}
              onChange={(e) => setPostoperativeText(e.target.value)}
              className="min-h-[200px]"
              placeholder="Postoperative Anforderungen eingeben..."
              disabled={isRecordingPostop || isTranscribingPostop}
            />

            {isRecordingPostop && (
              <p className="text-xs text-muted-foreground animate-pulse">Sprechen Sie die Anforderungen...</p>
            )}
            {isTranscribingPostop && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" />
                Transkription läuft...
              </div>
            )}

            <Button
              onClick={isRecordingPostop ? stopPostopRecording : startPostopRecording}
              variant="outline"
              size="sm"
              disabled={isTranscribingPostop}
            >
              {isRecordingPostop ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Diktat stoppen
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Diktat starten
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
