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

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

async function main() {
  const { values } = parseArgs({
    options: {
      input: { type: "string", short: "i", default: "data/analysis.json" },
      output: { type: "string", short: "o", default: "data/report.md" },
    },
  });

  const inputFile = values.input!;
  const outputFile = values.output!;

  if (!fs.existsSync(inputFile)) {
    console.error(`Datei nicht gefunden: ${inputFile}`);
    process.exit(1);
  }

  const data: AnalysisData = JSON.parse(fs.readFileSync(inputFile, "utf-8"));

  console.log(`Generiere OP-Bericht aus ${inputFile}...`);
  console.log(`Video: ${data.video}`);
  console.log(`Thema: ${data.topic}`);
  console.log(`Frames: ${data.frameCount}\n`);

  const analysesText = data.analyses
    .map((a) => `[${formatTimestamp(a.timestamp)}] Frame ${a.frame}:\n${a.analysis}`)
    .join("\n\n---\n\n");

  const prompt = `Du bist ein erfahrener Chirurg und verfasst einen OP-Bericht als Fließtext.

Basierend auf den folgenden Frame-Analysen eines OP-Videos zum Thema "${data.topic}", erstelle einen professionellen OP-Bericht.

Der Bericht soll als fortlaufender Fließtext verfasst werden, ohne Überschriften. Jeder OP-Schritt wird als eigener Absatz beschrieben. Beginne jeden Absatz mit dem Zeitstempel in Klammern.

Beispielformat:
(0:00 – 0:15) Einführen der 30°-Optik über den umbilikalen Zugang. Problemlose Anlage des Kapnoperitoneums mit CO₂.

(0:15 – 0:30) Subumbilikaler Hautschnitt mittels Skalpell. Präparation bis auf die Faszie.

Regeln:
- Fasse zusammengehörige Schritte zu sinnvollen Zeitabschnitten zusammen
- Beschreibe jeden Schritt präzise im medizinischen Fachstil
- Verwende korrekte deutsche medizinische Terminologie und Rechtschreibung
- Schreibe in der dritten Person Singular Präsens oder im Passiv
- Keine Aufzählungen, keine Tabellen, keine Überschriften – nur Fließtext
- Die Zeitangaben basieren auf den Timestamps der Frame-Analysen
- Achte auf grammatikalisch korrekte, vollständige Sätze

Hier sind die Frame-Analysen:

${analysesText}

Erstelle nun den OP-Bericht als Fließtext:`;

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
  const report = typeof messageContent === "string"
    ? messageContent
    : "Fehler: Kein Bericht generiert";

  console.log(report);

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, report, "utf-8");
  console.log(`\nBericht gespeichert: ${outputFile}`);
}

main().catch(console.error);
