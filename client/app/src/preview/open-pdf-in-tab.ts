// src/utils/open-pdf-in-tab.ts

export function openPdfInNewTab(blobUrl: string, fileName: string) {
  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${fileName}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0b1220; font-family: ui-sans-serif, system-ui, sans-serif; height: 100vh; display: flex; flex-direction: column; }

    /* ── Toolbar ── */
    .toolbar {
      display: flex; align-items: center; gap: 8px;
      padding: 0 12px; height: 48px; flex-shrink: 0;
      background: #323639; border-bottom: 1px solid #1a1a1a;
    }
    .toolbar-btn {
      display: flex; align-items: center; justify-content: center;
      width: 30px; height: 30px; border-radius: 6px; border: none;
      background: transparent; color: #e2e8f0; cursor: pointer;
      transition: background 0.15s;
    }
    .toolbar-btn:hover { background: rgba(255,255,255,0.12); }
    .toolbar-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .divider { width: 1px; height: 24px; background: #555; margin: 0 4px; flex-shrink: 0; }
    .filename { font-size: 13px; font-weight: 500; color: #cbd5e1; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .page-input {
      width: 36px; height: 26px; text-align: center; font-size: 13px;
      background: #1e2022; border: 1px solid #555; color: #fff;
      border-radius: 4px; outline: none;
    }
    .page-label { font-size: 13px; color: #94a3b8; }
    .zoom-label { font-size: 13px; color: #cbd5e1; min-width: 40px; text-align: center; tabular-nums: true; }
    .spacer { flex: 1; }
    .action-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 0 12px; height: 30px; border-radius: 6px; border: none;
      font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.15s;
    }
    .btn-ghost { background: rgba(255,255,255,0.08); color: #e2e8f0; border: 1px solid rgba(255,255,255,0.15); }
    .btn-ghost:hover { background: rgba(255,255,255,0.15); }
    .btn-primary { background: #2563eb; color: #fff; border: none; }
    .btn-primary:hover { background: #1d4ed8; }

    /* ── Body ── */
    .body { display: flex; flex: 1; overflow: hidden; }

    /* ── Sidebar ── */
    .sidebar {
      width: 180px; flex-shrink: 0; overflow-y: auto;
      background: #2b2d30; border-right: 1px solid #1a1a1a;
    }
    .thumb-item {
      display: flex; flex-direction: column; align-items: center;
      padding: 12px 8px; cursor: pointer; border-bottom: 1px solid #1e2022;
      transition: background 0.15s;
    }
    .thumb-item:hover { background: #3d4043; }
    .thumb-item.active { background: #3d4043; }
    .thumb-frame {
      width: 130px; overflow: hidden; border-radius: 3px;
      border: 2px solid transparent; line-height: 0;
    }
    .thumb-frame.active { border-color: #60a5fa; }
    .thumb-frame canvas { width: 100% !important; height: auto !important; }
    .thumb-num { font-size: 11px; margin-top: 6px; color: #94a3b8; }
    .thumb-num.active { color: #93c5fd; }

    /* ── Canvas area ── */
    .canvas-area {
      flex: 1; overflow: auto; display: flex; justify-content: center;
      padding: 24px 16px; background: #525659;
    }
    .pdf-page-wrapper { display: flex; flex-direction: column; gap: 12px; align-items: center; }
  </style>
</head>
<body>

  <!-- Toolbar -->
  <div class="toolbar">
    <!-- Sidebar toggle -->
    <button class="toolbar-btn" id="sidebarToggle" title="Toggle sidebar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>

    <span class="filename">${fileName.replace(/\.pdf$/i, "")}</span>

    <div class="divider"></div>

    <!-- Page nav -->
    <button class="toolbar-btn" id="prevPage" title="Previous page" disabled>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15,18 9,12 15,6"/></svg>
    </button>
    <input class="page-input" id="pageInput" type="text" value="1" />
    <span class="page-label">/ <span id="totalPages">—</span></span>
    <button class="toolbar-btn" id="nextPage" title="Next page">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>
    </button>

    <div class="divider"></div>

    <!-- Zoom -->
    <button class="toolbar-btn" id="zoomOut" title="Zoom out">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
    </button>
    <span class="zoom-label" id="zoomLabel">100%</span>
    <button class="toolbar-btn" id="zoomIn" title="Zoom in">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="11" y1="8" x2="11" y2="14"/></svg>
    </button>

    <div class="divider"></div>

    <!-- Rotate -->
    <button class="toolbar-btn" id="rotateCcw" title="Rotate left">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>
    </button>
    <button class="toolbar-btn" id="rotateCw" title="Rotate right">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 1 1-.49-4.95"/></svg>
    </button>

    <div class="spacer"></div>

    <!-- Actions -->
    <button class="toolbar-btn" id="printBtn" title="Print">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
    </button>
    <button class="action-btn btn-primary" id="downloadBtn">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Download PDF
    </button>
  </div>

  <!-- Body -->
  <div class="body">
    <div class="sidebar" id="sidebar">
      <div id="thumbnails"></div>
    </div>
    <div class="canvas-area">
      <div class="pdf-page-wrapper" id="pdfPages"></div>
    </div>
  </div>

  <!-- pdf.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <script>
    const pdfUrl  = ${JSON.stringify(blobUrl)};
    const fileName = ${JSON.stringify(fileName)};

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    let pdfDoc   = null;
    let currentPage = 1;
    let scale    = 1.0;
    let rotation = 0;
    let sidebarVisible = true;

    const $ = id => document.getElementById(id);

    // ── Render a single page into the main canvas area ──
    async function renderPage(num) {
      const page    = await pdfDoc.getPage(num);
      const viewport = page.getViewport({ scale, rotation });

      const canvas  = document.createElement('canvas');
      canvas.width  = viewport.width;
      canvas.height = viewport.height;
      canvas.style.borderRadius = '4px';
      canvas.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5)';

      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      return canvas;
    }

    // ── Render all pages (stacked vertically) ──
    async function renderAllPages() {
      const container = $('pdfPages');
      container.innerHTML = '';
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const canvas = await renderPage(i);
        canvas.id = 'page-' + i;
        container.appendChild(canvas);
      }
    }

    // ── Render sidebar thumbnails ──
    async function renderThumbnails() {
      const container = $('thumbnails');
      container.innerHTML = '';
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const vp   = page.getViewport({ scale: 0.3, rotation });

        const canvas  = document.createElement('canvas');
        canvas.width  = vp.width;
        canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;

        const item  = document.createElement('div');
        item.className = 'thumb-item' + (i === currentPage ? ' active' : '');
        item.dataset.page = i;

        const frame = document.createElement('div');
        frame.className = 'thumb-frame' + (i === currentPage ? ' active' : '');
        frame.appendChild(canvas);

        const num = document.createElement('div');
        num.className = 'thumb-num' + (i === currentPage ? ' active' : '');
        num.textContent = i;

        item.appendChild(frame);
        item.appendChild(num);
        item.addEventListener('click', () => goToPage(i));
        container.appendChild(item);
      }
    }

    function updateThumbnailActive() {
      document.querySelectorAll('.thumb-item').forEach((el, idx) => {
        const p = idx + 1;
        el.classList.toggle('active', p === currentPage);
        el.querySelector('.thumb-frame').classList.toggle('active', p === currentPage);
        el.querySelector('.thumb-num').classList.toggle('active', p === currentPage);
      });
    }

    function goToPage(p) {
      currentPage = Math.min(Math.max(p, 1), pdfDoc.numPages);
      $('pageInput').value = currentPage;
      $('prevPage').disabled = currentPage <= 1;
      $('nextPage').disabled = currentPage >= pdfDoc.numPages;
      updateThumbnailActive();
      // Scroll the main page into view
      const target = document.getElementById('page-' + currentPage);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Init 
    pdfjsLib.getDocument(pdfUrl).promise.then(async (doc) => {
      pdfDoc = doc;
      $('totalPages').textContent = doc.numPages;
      $('pageInput').value = 1;
      $('prevPage').disabled = true;
      $('nextPage').disabled = doc.numPages <= 1;

      await renderAllPages();
      await renderThumbnails();
    });

    // Controls 
    $('prevPage').addEventListener('click', () => goToPage(currentPage - 1));
    $('nextPage').addEventListener('click', () => goToPage(currentPage + 1));

    $('pageInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const v = parseInt(e.target.value);
        if (!isNaN(v)) goToPage(v);
      }
    });

    $('zoomIn').addEventListener('click', async () => {
      scale = Math.min(+(scale + 0.1).toFixed(1), 3.0);
      $('zoomLabel').textContent = Math.round(scale * 100) + '%';
      await renderAllPages();
      await renderThumbnails();
    });

    $('zoomOut').addEventListener('click', async () => {
      scale = Math.max(+(scale - 0.1).toFixed(1), 0.3);
      $('zoomLabel').textContent = Math.round(scale * 100) + '%';
      await renderAllPages();
      await renderThumbnails();
    });

    $('rotateCw').addEventListener('click', async () => {
      rotation = (rotation + 90) % 360;
      await renderAllPages();
      await renderThumbnails();
    });

    $('rotateCcw').addEventListener('click', async () => {
      rotation = (rotation - 90 + 360) % 360;
      await renderAllPages();
      await renderThumbnails();
    });

    $('sidebarToggle').addEventListener('click', () => {
      sidebarVisible = !sidebarVisible;
      $('sidebar').style.display = sidebarVisible ? 'block' : 'none';
    });

    $('printBtn').addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = pdfUrl;
      document.body.appendChild(iframe);
      iframe.onload = () => { iframe.contentWindow.focus(); iframe.contentWindow.print(); };
    });

    $('downloadBtn').addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = fileName;
      a.click();
    });
  </script>
</body>
</html>`.trim();

  const newTab = window.open("", "_blank");
  if (!newTab) {
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    a.click();
    return;
  }
  newTab.document.open();
  newTab.document.write(html);
  newTab.document.close();
}