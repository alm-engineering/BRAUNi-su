import "dotenv/config";
import { parseArgs } from "node:util";
import * as fs from "node:fs";
import * as path from "node:path";
import { OpenRouter } from "@openrouter/sdk";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("Fehler: OPENROUTER_API_KEY ist nicht gesetzt");
  process.exit(1);
}

const client = new OpenRouter({
  apiKey: OPENROUTER_API_KEY,
});

interface FrameAnalysis {
  frame: number;
  timestamp: number;
  path: string;
  analysis: string;
}

interface AnalysisData {
  video: string;
  topic: string;
  frameCount: number;
  analyses: FrameAnalysis[];
}

async function main() {
  const { values } = parseArgs({
    options: {
      input: { type: "string", short: "i", default: "data/analysis.json" },
      output: { type: "string", short: "o", default: "data/pato.txt" },
    },
  });

  const inputFile = values.input!;
  const outputFile = values.output!;

  if (!fs.existsSync(inputFile)) {
    console.error(`Datei nicht gefunden: ${inputFile}`);
    process.exit(1);
  }

  const data: AnalysisData = JSON.parse(fs.readFileSync(inputFile, "utf-8"));

  console.log(`Analysiere Pathologie-Proben aus ${inputFile}...`);
  console.log(`Thema: ${data.topic}`);
  console.log(`Frames: ${data.frameCount}\n`);

  const analysesText = data.analyses
    .map((a) => `Frame ${a.frame}:\n${a.analysis}`)
    .join("\n\n---\n\n");

  const prompt = `Du bist ein erfahrener Pathologe und analysierst einen OP-Bericht.

Basierend auf den folgenden Frame-Analysen eines OP-Videos zum Thema "${data.topic}", erstelle eine Liste der Pathologie-Proben.

Aufgabe:
1. Identifiziere alle Proben/Präparate, die im Video entnommen wurden (erkennbar durch Bergung, Entnahme, Resektion)
2. Liste zusätzlich übliche Proben auf, die bei diesem OP-Typ standardmäßig entnommen werden sollten

Format der Antwort (nur Stichwortliste, keine Sätze):

ENTNOMMENE PROBEN (im Video erkannt):
- [Probe 1]
- [Probe 2]
...

ÜBLICHE PROBEN BEI ${data.topic.toUpperCase()}:
- [Standard-Probe 1]
- [Standard-Probe 2]
...

Hier sind die Frame-Analysen:

${analysesText}

Erstelle nun die Stichwortliste:`;

  console.log("Sende Anfrage an OpenRouter...\n");

  const response = await client.chat.send({
    model: "anthropic/claude-opus-4.5",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    reasoning: { effort: "high" },
  });

  const messageContent = response.choices?.[0]?.message?.content;
  const result = typeof messageContent === "string"
    ? messageContent
    : "Fehler: Keine Analyse verfügbar";

  console.log(result);

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, result, "utf-8");
  console.log(`\nErgebnis gespeichert: ${outputFile}`);
}

main().catch(console.error);
