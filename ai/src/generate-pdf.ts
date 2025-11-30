import "dotenv/config";
import { parseArgs } from "node:util";
import * as fs from "node:fs";
import * as path from "node:path";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToFile,
} from "@react-pdf/renderer";
import { OpenRouter } from "@openrouter/sdk";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("Fehler: OPENROUTER_API_KEY ist nicht gesetzt");
  process.exit(1);
}

const client = new OpenRouter({
  apiKey: OPENROUTER_API_KEY,
});

const { values } = parseArgs({
  options: {
    input: { type: "string", short: "i", default: "data/report.md" },
    output: { type: "string", short: "o", default: "data/op-bericht.pdf" },
    patient: { type: "string", short: "p", default: "" },
    datum: { type: "string", short: "d", default: "" },
    diagnose: { type: "string", default: "" },
    operation: { type: "string", default: "" },
    operateure: { type: "string", default: "" },
  },
});

const inputFile = values.input!;
const outputFile = values.output!;

if (!fs.existsSync(inputFile)) {
  console.error(`Datei nicht gefunden: ${inputFile}`);
  process.exit(1);
}

const reportContent = fs.readFileSync(inputFile, "utf-8");

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    fontSize: 9,
  },
  headerRight: {
    fontSize: 9,
    textAlign: "right",
  },
  logo: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  date: {
    textAlign: "right",
    marginBottom: 20,
    fontSize: 10,
  },
  infoTable: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#000",
  },
  infoRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  infoRowLast: {
    flexDirection: "row",
  },
  infoLabel: {
    width: 100,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
    backgroundColor: "#f5f5f5",
  },
  infoValue: {
    flex: 1,
    padding: 5,
  },
  paragraph: {
    marginBottom: 8,
    fontSize: 10,
    lineHeight: 1.4,
    textAlign: "justify",
  },
  procedere: {
    marginTop: 20,
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 7,
    color: "#666",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
});

const today = new Date().toLocaleDateString("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function createOPBericht(reportText: string) {
  return React.createElement(Document, null,
    React.createElement(Page, { size: "A4", style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(View, { style: styles.headerLeft },
          React.createElement(Text, null, "UNIVERSITÄTSKLINIKUM FREIBURG"),
          React.createElement(Text, null, "Klinik für Hals-, Nasen- und Ohrenheilkunde"),
          React.createElement(Text, null, "Killianstraße 5 · 79106 Freiburg")
        ),
        React.createElement(View, { style: styles.headerRight },
          React.createElement(Text, { style: styles.logo }, "UNIVERSITÄTS"),
          React.createElement(Text, { style: styles.logo }, "KLINIKUM FREIBURG"),
          React.createElement(Text, null, "Klinik für Hals-, Nasen- und"),
          React.createElement(Text, null, "Ohrenheilkunde"),
          React.createElement(Text, null, "Ärztlicher Direktor"),
          React.createElement(Text, null, "Univ.-Prof. Dr. Andreas Knopf"),
          React.createElement(Text, null, "Station Zange")
        )
      ),

      // Title
      React.createElement(Text, { style: styles.title }, "OPERATIONSBERICHT"),

      // Date
      React.createElement(Text, { style: styles.date }, `Freiburg, ${values.datum || today}`),

      // Info Table
      React.createElement(View, { style: styles.infoTable },
        React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoLabel }, "Patient"),
          React.createElement(Text, { style: styles.infoValue }, values.patient || "")
        ),
        React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoLabel }, "OP-Datum"),
          React.createElement(Text, { style: styles.infoValue }, values.datum || "")
        ),
        React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoLabel }, "OP-Diagnose"),
          React.createElement(Text, { style: styles.infoValue }, values.diagnose || "")
        ),
        React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoLabel }, "Operation"),
          React.createElement(Text, { style: styles.infoValue }, values.operation || "")
        ),
        React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoLabel }, "Operateure"),
          React.createElement(Text, { style: styles.infoValue }, values.operateure || "")
        ),
        React.createElement(View, { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoLabel }, "Anästhesist"),
          React.createElement(Text, { style: styles.infoValue }, "Siehe Anästhesieprotokoll")
        ),
        React.createElement(View, { style: styles.infoRowLast },
          React.createElement(Text, { style: styles.infoLabel }, "OP-Pflege"),
          React.createElement(Text, { style: styles.infoValue }, "Siehe OP-Protokoll")
        )
      ),

      // OP-Bericht Fließtext
      React.createElement(Text, { style: styles.paragraph }, reportText),

      // Footer
      React.createElement(View, { style: styles.footer },
        React.createElement(Text, null, "UNIVERSITÄTSKLINIKUM FREIBURG · Anstalt des öffentlichen Rechts · Sitz Freiburg"),
        React.createElement(Text, null, "www.uniklinik-freiburg.de")
      )
    )
  );
}

async function main() {
  console.log(`Generiere PDF aus ${inputFile}...`);
  console.log("Bereite OP-Bericht mit Claude auf...\n");

  const prompt = `Bereite den folgenden OP-Bericht für ein PDF-Dokument auf.

Regeln:
- Entferne alle Zeitstempel (z.B. "(0:00 – 0:15)") am Anfang der Absätze
- Kürze den Bericht auf ca. 1/2 DIN-A4 Seite (etwa 150-200 Wörter)
- Fasse Routine-Schritte zusammen, beschreibe nur das Wesentliche
- Besondere Vorkommnisse, Komplikationen oder unerwartete Befunde müssen detailliert beschrieben werden
- Bei komplikationslosem Verlauf reicht eine knappe Zusammenfassung der Hauptschritte
- Korrigiere eventuelle Rechtschreib- oder Grammatikfehler
- Gib den Text als einzelne Absätze zurück

Schreibstil:
- Typische kompakte medizinische Sprache
- Verzichte überwiegend auf Verben (Telegrammstil)
- Beispiel: "Darstellung des Calot-Dreiecks. Clippen von A. cystica und Ductus cysticus. Durchtrennung. Auslösen der Gallenblase aus dem Leberbett mittels Elektrohaken. Blutstillung. Bergung im Bergebeutel."
- Keine ganzen Sätze nötig, Substantivierungen bevorzugen
- Objektiv und sachlich und neutral

Hier ist der OP-Bericht:

${reportContent}

Gib nur die aufbereiteten, gekürzten Absätze zurück, ohne weitere Erklärungen:`;

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
  const cleanedReport = typeof messageContent === "string"
    ? messageContent
    : reportContent;

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });

  await renderToFile(createOPBericht(cleanedReport), outputFile);

  console.log(`\nPDF gespeichert: ${outputFile}`);
}

main().catch(console.error);
