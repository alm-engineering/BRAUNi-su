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

async function main() {
  const { values } = parseArgs({
    options: {
      input: { type: "string", short: "i", default: "data/report.md" },
      output: { type: "string", short: "o", default: "data/ops.txt" },
    },
  });

  const inputFile = values.input!;
  const outputFile = values.output!;

  if (!fs.existsSync(inputFile)) {
    console.error(`Datei nicht gefunden: ${inputFile}`);
    process.exit(1);
  }

  const reportContent = fs.readFileSync(inputFile, "utf-8");

  console.log(`Analysiere OP-Bericht aus ${inputFile}...`);
  console.log("Suche passende OPS-Codes mit Web-Recherche...\n");

  const prompt = `Du bist ein erfahrener medizinischer Kodierer und analysierst einen OP-Bericht.

Basierend auf dem folgenden OP-Bericht, welche OPS-Codes (Operationen- und Prozedurenschlüssel) würdest du für diese OP abrechnen?

Aufgabe:
1. Recherchiere die aktuellen OPS-Codes für die durchgeführten Prozeduren
2. Liste alle relevanten OPS-Codes auf, die für diese OP abgerechnet werden können
3. Gib für jeden Code die offizielle Bezeichnung an

Format der Antwort:

HAUPTPROZEDUR:
- [OPS-Code] - [Bezeichnung]

ZUSATZPROZEDUREN:
- [OPS-Code] - [Bezeichnung]
- [OPS-Code] - [Bezeichnung]
...

HINWEISE:
- [Eventuelle Anmerkungen zur Kodierung]

Hier ist der OP-Bericht:

${reportContent}

Erstelle nun die Liste der OPS-Codes:`;

  console.log("Sende Anfrage an OpenRouter (mit Web-Search)...\n");

  const response = await client.chat.send({
    model: "anthropic/claude-opus-4.5:online",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const messageContent = response.choices?.[0]?.message?.content;
  const result =
    typeof messageContent === "string"
      ? messageContent
      : "Fehler: Keine Analyse verfügbar";

  console.log(result);

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, result, "utf-8");
  console.log(`\nErgebnis gespeichert: ${outputFile}`);
}

main().catch(console.error);
