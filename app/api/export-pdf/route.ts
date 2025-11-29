import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sentences, patientInfo } = await request.json()

    // Combine sentences into full text
    const fullText = sentences.join(" ")

    // Create HTML template matching the medical document format
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @page {
              size: A4;
              margin: 2cm;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 11pt;
              line-height: 1.6;
              color: #000;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: start;
              margin-bottom: 30px;
            }
            .header-left {
              font-size: 9pt;
            }
            .header-right {
              text-align: right;
              font-size: 9pt;
            }
            .logo {
              text-align: right;
              margin-bottom: 20px;
            }
            .logo img {
              max-width: 200px;
              height: auto;
            }
            h1 {
              font-size: 16pt;
              font-weight: bold;
              margin: 30px 0 20px 0;
            }
            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
            }
            .info-table td {
              border: 1px solid #000;
              padding: 8px 12px;
            }
            .info-table td:first-child {
              background-color: #f0f0f0;
              font-weight: bold;
              width: 30%;
            }
            .content {
              margin-top: 30px;
              text-align: justify;
            }
            .footer-note {
              margin-top: 30px;
              font-style: italic;
            }
            .date {
              text-align: right;
              margin-bottom: 30px;
            }
          </style>
        </head>
        <body>
          <div class="logo">
            <img src="https://www.uniklinik-freiburg.de/_assets/9b4f71c2f88293f1ecfce329ee8fc102/Images/logo-fixi.jpg" alt="Universitätsklinikum Freiburg">
          </div>

          <div class="header">
            <div class="header-left">
              <strong>UNIVERSITÄTSKLINIKUM FREIBURG</strong><br>
              Klinik für Hals-, Nasen- und Ohrenheilkunde<br>
              Killianstraße 5 · 79106 Freiburg
            </div>
            <div class="header-right">
              <strong>Klinik für Hals-, Nasen- und Ohrenheilkunde</strong><br>
              Ärztlicher Direktor<br>
              Univ.-Prof. Dr. Andreas Knopf<br>
              <strong>Station Zange</strong>
            </div>
          </div>

          <h1>OPERATIONSBERICHT</h1>

          <div class="date">
            Freiburg, ${new Date().toLocaleDateString("de-DE")}
          </div>

          <table class="info-table">
            <tr>
              <td>Patient</td>
              <td>${patientInfo?.name || "Anna Richter, 12.04.1983, 42 Jahre"}</td>
            </tr>
            <tr>
              <td>OP-Datum</td>
              <td>${patientInfo?.opDate || "28.11.2025"}</td>
            </tr>
            <tr>
              <td>OP-Diagnose</td>
              <td>${patientInfo?.diagnosis || "Gallensteine (Cholelithiasis)"}</td>
            </tr>
            <tr>
              <td>Operation</td>
              <td>${patientInfo?.operation || "Laparoskopische Cholezystektomie"}</td>
            </tr>
            <tr>
              <td>Operateure</td>
              <td>${patientInfo?.surgeons || "Dr. med. Tobias Meier"}</td>
            </tr>
            <tr>
              <td>Anästhesist</td>
              <td>Siehe Anästhesieprotokoll</td>
            </tr>
            <tr>
              <td>OP-Pflege</td>
              <td>Siehe OP-Protokoll</td>
            </tr>
          </table>

          <div class="content">
            <p>${fullText}</p>
          </div>

          <div class="footer-note">
            <p><strong>Procedere:</strong> Siehe Anordnungen und Einträge in MEONA.</p>
          </div>
        </body>
      </html>
    `

    // Use a PDF generation service API
    // For this implementation, we'll use jsPDF with html2canvas approach via client-side
    // Return the HTML to be processed on client
    return NextResponse.json({ html })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
