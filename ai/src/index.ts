import "dotenv/config";
import { parseArgs } from "node:util";
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { OpenRouter } from "@openrouter/sdk";
import type { ChatMessageContentItem } from "@openrouter/sdk/models/chatmessagecontentitem.js";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("Fehler: OPENROUTER_API_KEY ist nicht gesetzt");
  process.exit(1);
}

const client = new OpenRouter({
  apiKey: OPENROUTER_API_KEY,
});

function getVideoDuration(videoPath: string): number {
  const result = execSync(
    `ffprobe -v error -show_entries format=duration -of csv=p=0 "${videoPath}"`,
    { encoding: "utf-8" }
  );
  return parseFloat(result.trim());
}

function extractFrames(
  videoPath: string,
  outputDir: string,
  frameCount: number
): string[] {
  const duration = getVideoDuration(videoPath);
  const interval = duration / (frameCount + 1);
  const framePaths: string[] = [];

  fs.mkdirSync(outputDir, { recursive: true });

  for (let i = 1; i <= frameCount; i++) {
    const timestamp = interval * i;
    const outputPath = path.join(outputDir, `frame_${i.toString().padStart(3, "0")}.jpg`);

    execSync(
      `ffmpeg -y -ss ${timestamp} -i "${videoPath}" -frames:v 1 -q:v 2 "${outputPath}"`,
      { stdio: "pipe" }
    );

    framePaths.push(outputPath);
    console.log(`Frame ${i}/${frameCount} extrahiert: ${outputPath}`);
  }

  return framePaths;
}

async function main() {
  const { values } = parseArgs({
    options: {
      video: { type: "string", short: "v", default: "data/video.mov" },
      topic: { type: "string", short: "t", default: "Laparoskopie der Gallenblase" },
      frames: { type: "string", short: "f", default: "25" },
    },
  });

  const videoPath = values.video!;
  const topic = values.topic!;
  const frameCount = parseInt(values.frames!, 10);
  const outputDir = "data/frames";

  if (!fs.existsSync(videoPath)) {
    console.error(`Video nicht gefunden: ${videoPath}`);
    process.exit(1);
  }

  console.log(`Extrahiere ${frameCount} Frames aus ${videoPath}...\n`);

  const framePaths = extractFrames(videoPath, outputDir, frameCount);

  console.log(`\n${framePaths.length} Frames extrahiert nach ${outputDir}`);

  console.log(`\nAnalysiere Frames mit OpenRouter (Thema: ${topic})...\n`);

  async function analyzeFrame(framePath: string, frameNumber: number, totalFrames: number): Promise<string> {
    console.log(`Starte Analyse Frame ${frameNumber}/${totalFrames}...`);

    const imageBuffer = fs.readFileSync(framePath);
    const base64Image = imageBuffer.toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    const content: ChatMessageContentItem[] = [
      {
        type: "text",
        text: `Du analysierst Frame ${frameNumber} von ${totalFrames} aus einem OP-Video zum Thema: "${topic}".

Ziel ist die Erstellung eines OP-Berichts. Extrahiere alle relevanten Informationen aus diesem Bild:

- Aktueller OP-Schritt / Phase des Eingriffs
- Sichtbare anatomische Strukturen (Organe, Gefäße, Gewebe)
- Verwendete Instrumente und Geräte
- Durchgeführte Maßnahmen (Präparation, Koagulation, Clippen, Schneiden, etc.)
- Pathologische Befunde oder Auffälligkeiten
- Blutungssituation und Hämostase
- Besondere Vorkommnisse oder Komplikationen

Antworte strukturiert und präzise im medizinischen Fachstil.`,
      },
      {
        type: "image_url",
        imageUrl: { url: dataUrl },
      },
    ];

    const response = await client.chat.send({
      model: "anthropic/claude-opus-4.5",
      messages: [
        {
          role: "user",
          content,
        },
      ],
      reasoning: { effort: "high" },
    });

    const messageContent = response.choices?.[0]?.message?.content;
    const analysis = typeof messageContent === "string"
      ? messageContent
      : "Keine Analyse verfügbar";

    console.log(`Frame ${frameNumber}/${totalFrames} abgeschlossen.`);
    return analysis;
  }

  const analysisPromises = framePaths.map((framePath, i) =>
    analyzeFrame(framePath, i + 1, framePaths.length)
  );

  const analyses = await Promise.all(analysisPromises);

  for (let i = 0; i < analyses.length; i++) {
    console.log(`\n--- Frame ${i + 1} ---`);
    console.log(analyses[i]);
    console.log("");
  }

  console.log("\n=== Analyse abgeschlossen ===");

  const outputFile = path.join("data", "analysis.json");
  const duration = getVideoDuration(videoPath);
  const interval = duration / (frameCount + 1);

  const output = {
    video: videoPath,
    topic,
    frameCount,
    analyses: analyses.map((analysis, i) => ({
      frame: i + 1,
      timestamp: interval * (i + 1),
      path: framePaths[i],
      analysis,
    })),
  };

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\nErgebnis gespeichert: ${outputFile}`);
}

main().catch(console.error);
