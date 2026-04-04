import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Row = {
  client: string;
  project: string;
  billableHours: number;
};

type ReportPayload = {
  employeeName: string;
  monthCount: number;
  weekStartDate: string;
  weekEndDate: string;
  billableHours: number;
  rows: Row[];
};

function buildPdf(payload: ReportPayload) {
  const doc = new jsPDF("p", "mm", "a4");

  doc.setFillColor(99, 78, 220);
  doc.rect(0, 0, 210, 22, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Employee Monthly Timesheet Report", 14, 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toISOString().slice(0, 10)}`, 150, 14);

  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Summary", 14, 34);

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(238, 242, 255);
  doc.roundedRect(14, 38, 182, 26, 4, 4, "FD");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Employee", 18, 47);
  doc.text("Start Date", 92, 47);
  doc.text("End Date", 130, 47);
  doc.text("Billable Hours", 158, 47);

  doc.setFont("helvetica", "normal");
  doc.text(payload.employeeName || "-", 18, 55);
  doc.text(payload.weekStartDate || "-", 92, 55);
  doc.text(payload.weekEndDate || "-", 130, 55);
  doc.text(`${payload.billableHours ?? 0} h`, 158, 55);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Work Details", 14, 76);

  autoTable(doc, {
    startY: 80,
    head: [["Client", "Project", "Billable Hours"]],
    body: payload.rows.map((r) => [r.client, r.project, `${r.billableHours} h`]),
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 3,
      lineColor: [230, 230, 230],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [15, 29, 42],
      textColor: 255,
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });


  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);

  return doc;
}

export function openReportPreview(payload: ReportPayload) {
  const doc = buildPdf(payload);


  const blobUrl = doc.output("bloburl");
  const w = window.open(blobUrl, "_blank");
  if (!w) {
    doc.save(`report-${payload.employeeName}.pdf`);
    return;
  }

  w.close();

  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Report Preview</title>
  <style>
    body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto; background:#0b1220; }
    .bar {
      position: sticky; top:0; z-index:10;
      display:flex; gap:10px; align-items:center; justify-content:space-between;
      padding:12px 14px; background: rgba(255,255,255,0.08); backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255,255,255,0.12);
      color:#fff;
    }
    .title { font-weight:700; letter-spacing:0.2px; }
    .actions { display:flex; gap:10px; }
    button {
      cursor:pointer;
      border:1px solid rgba(255,255,255,0.18);
      background: rgba(255,255,255,0.10);
      color:#fff;
      padding:10px 12px;
      border-radius:12px;
      font-weight:600;
    }
    button.primary {
      background: #2563eb;
      border-color: #2563eb;
    }
    .wrap { padding: 14px; }
    .frame {
      width: 100%;
      height: calc(100vh - 70px);
      border: 0;
      border-radius: 16px;
      background:#111827;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }
    @media (max-width: 640px) {
      .bar { flex-direction: column; align-items:flex-start; gap:8px; }
      .actions { width:100%; }
      button { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="bar">
    <div>
    <div class="title">Report Preview</div>
      <div style="opacity:.8;font-size:12px;margin-top:2px;">Looks like Ctrl + P preview • Print or Download PDF</div>
    </div>
    <div class="actions">
      <button onclick="frame.contentWindow.focus(); frame.contentWindow.print();">Print</button>
      <button class="primary" onclick="download()">Download PDF</button>
    </div>
  </div>

  <div class="wrap">
    <iframe class="frame" id="frame"></iframe>
  </div>

  <script>
    const pdfUrl = ${JSON.stringify(blobUrl)};
    const frame = document.getElementById("frame");
    frame.src = pdfUrl;

    function download(){
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = ${JSON.stringify(`${payload.employeeName}-report.pdf`)};
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  </script>
</body>
</html>
  `.trim();

  const previewWin = window.open("", "_blank");
  if (!previewWin) {
    doc.save(`${payload.employeeName}-report.pdf`);
    return;
  }
  previewWin.document.open();
  previewWin.document.write(html);
  previewWin.document.close();
}







export function generatePdfBlobUrl(payload: ReportPayload): string {
  const doc = buildPdf(payload);
  return doc.output("bloburl") as any;
}
