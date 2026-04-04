import { useState, useCallback, useRef } from "react";
import { Document, Page, pdfjs, Thumbnail } from "react-pdf";
import { X, ZoomIn, ZoomOut, Download, Printer, Maximize2, RotateCcw, RotateCw, MoreVertical, AlignJustify } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface ReportPdfViewerProps {
  blobUrl: string;
  fileName: string;
  onClose: () => void;
}

export default function ReportPdfViewer({ blobUrl, fileName, onClose }: ReportPdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pageInput, setPageInput] = useState("1");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rotation, setRotation] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPageInput("1");
  }, []);

  const goToPage = (p: number) => {
    const clamped = Math.min(Math.max(p, 1), numPages ?? 1);
    setPageNumber(clamped);
    setPageInput(String(clamped));
  };

  const handlePageInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = parseInt((e.target as HTMLInputElement).value);
      if (!isNaN(val)) goToPage(val);
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePrint = () => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };
  };

  const zoomPercent = Math.round(scale * 100);

  return (
    <div className=" fixed inset-0 z-50 flex flex-col" style={{ background: "#fff" }}>

      {/* Top bar — matches screenshot exactly */}
      <div
        className="flex items-center shrink-0 px-3 gap-2"
        style={{
          height: 48,
          background: "#323639",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        {/* Hamburger / sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(v => !v)}
          className="flex items-center justify-center rounded hover:bg-white/10 transition"
          style={{ width: 32, height: 32, color: "#e2e8f0" }}
        >
          <AlignJustify size={18} />
        </button>

        {/* File name truncated */}
        <span
          className="text-sm font-medium truncate max-w-[220px]"
          style={{ color: "#cbd5e1" }}
        >
          {fileName.replace(/\.pdf$/i, "")}
        </span>

        {/* Page input + total */}
        <div className="flex items-center gap-1 ml-2" style={{ color: "#cbd5e1" }}>
          <input
            type="text"
            value={pageInput}
            onChange={e => setPageInput(e.target.value)}
            onKeyDown={handlePageInput}
            onBlur={() => {
              const val = parseInt(pageInput);
              if (!isNaN(val)) goToPage(val);
              else setPageInput(String(pageNumber));
            }}
            className="text-center text-sm rounded"
            style={{
              width: 36,
              height: 26,
              background: "#1e2022",
              border: "1px solid #555",
              color: "#fff",
              outline: "none",
            }}
          />
          <span className="text-sm" style={{ color: "#94a3b8" }}>
            / {numPages ?? "—"}
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: "#555", margin: "0 4px" }} />

        {/* Zoom out */}
        <button
          onClick={() => setScale(s => Math.max(+(s - 0.1).toFixed(1), 0.3))}
          className="flex items-center justify-center rounded hover:bg-white/10 transition"
          style={{ width: 30, height: 30, color: "#e2e8f0" }}
        >
          <ZoomOut size={16} />
        </button>

        {/* Zoom percent display */}
        <span
          className="text-sm tabular-nums"
          style={{ color: "#cbd5e1", minWidth: 40, textAlign: "center" }}
        >
          {zoomPercent}%
        </span>

        {/* Zoom in */}
        <button
          onClick={() => setScale(s => +(s + 0.1).toFixed(1))}
          className="flex items-center justify-center rounded hover:bg-white/10 transition"
          style={{ width: 30, height: 30, color: "#e2e8f0" }}
        >
          <ZoomIn size={16} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: "#555", margin: "0 4px" }} />

        {/* Rotate CCW */}
        <button
          onClick={() => setRotation(r => (r - 90 + 360) % 360)}
          className="flex items-center justify-center rounded hover:bg-white/10 transition"
          style={{ width: 30, height: 30, color: "#e2e8f0" }}
          title="Rotate counter-clockwise"
        >
          <RotateCcw size={15} />
        </button>

        {/* Rotate CW */}
        <button
          onClick={() => setRotation(r => (r + 90) % 360)}
          className="flex items-center justify-center rounded hover:bg-white/10 transition"
          style={{ width: 30, height: 30, color: "#e2e8f0" }}
          title="Rotate clockwise"
        >
          <RotateCw size={15} />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right actions */}
        <button
          onClick={handlePrint}
          className="flex items-center justify-center rounded hover:bg-white/10 transition"
          style={{ width: 32, height: 32, color: "#e2e8f0" }}
          title="Print"
        >
          <Printer size={17} />
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center justify-center rounded hover:bg-white/10 transition"
          style={{ width: 32, height: 32, color: "#e2e8f0" }}
          title="Download"
        >
          <Download size={17} />
        </button>

        <button
          className="flex items-center justify-center rounded hover:bg-white/10 transition"
          style={{ width: 32, height: 32, color: "#e2e8f0" }}
          title="More options"
        >
          <MoreVertical size={17} />
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: "#555", margin: "0 2px" }} />

        {/* Maximize */}
        <button
          className="flex items-center justify-center rounded hover:bg-white/10 transition"
          style={{ width: 32, height: 32, color: "#e2e8f0" }}
          title="Full screen"
        >
          <Maximize2 size={16} />
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          className="flex items-center justify-center rounded hover:bg-white/10 transition"
          style={{ width: 32, height: 32, color: "#e2e8f0" }}
          title="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Body: sidebar + canvas */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left sidebar — dark, page thumbnails */}
        {sidebarOpen && (
          <div
            className="flex flex-col shrink-0 overflow-y-auto"
            style={{
              width: 200,
              background: "#2b2d30",
              borderRight: "1px solid #1a1a1a",
            }}
          >
            <Document
              file={blobUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={null}
            >
              {numPages &&
                Array.from({ length: numPages }, (_, i) => i + 1).map(p => (
                  <div
                    key={p}
                    onClick={() => goToPage(p)}
                    className="flex flex-col items-center py-3 px-2 cursor-pointer transition"
                    style={{
                      borderBottom: "1px solid #1e2022",
                      background: pageNumber === p ? "#3d4043" : "transparent",
                    }}
                  >
                    <div
                      className="overflow-hidden rounded"
                      style={{
                        border: pageNumber === p
                          ? "2px solid #60a5fa"
                          : "2px solid transparent",
                        lineHeight: 0,
                      }}
                    >
                      <Thumbnail
                        pageNumber={p}
                        width={140}
                        rotate={rotation}
                      />
                    </div>
                    <span
                      className="text-xs mt-2"
                      style={{ color: pageNumber === p ? "#93c5fd" : "#94a3b8" }}
                    >
                      {p}
                    </span>
                  </div>
                ))
              }
            </Document>
          </div>
        )}

        {/* Main PDF canvas */}
        <div
          ref={mainRef}
          className="flex-1 overflow-auto flex justify-center py-6"
          style={{ background: "#525659" }}
        >
          <Document
            file={blobUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-64 text-white/40 text-sm">
                Loading…
              </div>
            }
            error={
              <div className="flex items-center justify-center h-64 text-red-400 text-sm">
                Failed to load PDF.
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              renderTextLayer
              renderAnnotationLayer
            />
          </Document>
        </div>
      </div>
    </div>
  );
}