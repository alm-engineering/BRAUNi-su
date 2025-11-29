import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { originalText, feedback } = await request.json()

    if (!originalText || !feedback) {
      return NextResponse.json({ error: "Missing originalText or feedback" }, { status: 400 })
    }

    // Call OpenAI API to modify text based on feedback
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Du bist ein Assistent für medizinische Dokumentation. Deine Aufgabe ist es, den gegebenen Text basierend auf dem Feedback des Users anzupassen. Behalte den medizinischen Ton und die Fachsprache bei. Gib nur den angepassten Text zurück, ohne zusätzliche Erklärungen.",
          },
          {
            role: "user",
            content: `Original-Text: "${originalText}"\n\nFeedback: "${feedback}"\n\nBitte passe den Text entsprechend dem Feedback an.`,
          },
        ],
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("OpenAI API error:", error)
      return NextResponse.json({ error: "Failed to apply feedback" }, { status: response.status })
    }

    const data = await response.json()
    let modifiedText = data.choices[0]?.message?.content?.trim()

    // Remove leading and trailing quotes if present
    if (modifiedText && modifiedText.startsWith('"') && modifiedText.endsWith('"')) {
      modifiedText = modifiedText.slice(1, -1)
    }

    return NextResponse.json({ modifiedText })
  } catch (error) {
    console.error("Apply feedback error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
