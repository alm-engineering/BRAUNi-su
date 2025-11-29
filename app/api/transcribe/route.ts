import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File
    const format = formData.get("format") as string | null

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Create form data for OpenAI API
    const openAIFormData = new FormData()
    openAIFormData.append("file", audioFile)
    openAIFormData.append("model", "whisper-1")
    openAIFormData.append("language", "de")

    if (format === "bullet-points") {
      openAIFormData.append(
        "prompt",
        "Formatiere die Transkription als stichwortartige Aufzählung mit Bindestrich. Jeder Punkt sollte kurz und prägnant sein.",
      )
    }

    // Call OpenAI Whisper API
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openAIFormData,
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("OpenAI API error:", error)
      return NextResponse.json({ error: "Transcription failed" }, { status: response.status })
    }

    const data = await response.json()

    let processedText = data.text
    if (format === "bullet-points") {
      // Split by common delimiters and format as bullet points
      const points = processedText
        .split(/[.;,]\s+/)
        .filter((point: string) => point.trim().length > 0)
        .map((point: string) => `- ${point.trim()}`)
        .join("\n")
      processedText = points
    }

    return NextResponse.json({ text: processedText })
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
