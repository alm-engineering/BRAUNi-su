import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Create form data for OpenAI API
    const openAIFormData = new FormData()
    openAIFormData.append("file", audioFile)
    openAIFormData.append("model", "whisper-1")
    openAIFormData.append("language", "de")

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
    return NextResponse.json({ text: data.text })
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
