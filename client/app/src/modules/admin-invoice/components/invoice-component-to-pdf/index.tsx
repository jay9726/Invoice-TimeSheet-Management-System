import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function reactNodeToPdfBlobUrl(element: HTMLElement): Promise<string> {
    function removeOklchRules(clonedDoc: Document) {
        try {
            const sheets = Array.from(clonedDoc.styleSheets);
            for (const sheet of sheets) {
                let rules: CSSRuleList;
                try { rules = sheet.cssRules; } catch { continue; }
                for (let i = rules.length - 1; i >= 0; i--) {
                    try {
                        if (rules[i].cssText.includes("oklch")) sheet.deleteRule(i);
                    } catch { }
                }
            }
        } catch { }
    }

    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc: any) => {
            removeOklchRules(clonedDoc);
            Array.from(clonedDoc.styleSheets).forEach((sheet: any) => {
                try {
                    Array.from(sheet.cssRules || []).forEach((rule) => {
                        if (rule instanceof CSSStyleRule) {
                            const style = rule.style;
                            for (let i = 0; i < style.length; i++) {
                                const prop = style[i];
                                const val = style.getPropertyValue(prop);
                                if (val.includes("oklch")) {
                                    style.setProperty(prop, val.replace(/oklch\([^)]*\)/gi, "#ffffff"));
                                }
                            }
                        }
                    });
                } catch { }
            });
        },
    });

    const imgData = canvas.toDataURL("image/png");

    const pageWidthMm = 210;
    const pageHeightMm = 297;

    const totalImgHeightMm = (canvas.height * pageWidthMm) / canvas.width;

    if (totalImgHeightMm <= pageHeightMm) {
        const pdf = new jsPDF("p", "mm", [pageWidthMm, totalImgHeightMm]);
        pdf.addImage(imgData, "PNG", 0, 0, pageWidthMm, totalImgHeightMm);
        return pdf.output("bloburl") as any;
    } else {
        const pdf = new jsPDF("p", "mm", "a4");

        const pageHeightPx = Math.floor((pageHeightMm / pageWidthMm) * canvas.width);
        const totalPages = Math.ceil(canvas.height / pageHeightPx);

        for (let page = 0; page < totalPages; page++) {
            if (page > 0) pdf.addPage();

            const srcY = page * pageHeightPx;
            const srcH = Math.min(pageHeightPx, canvas.height - srcY); // last page may be shorter

            const pageCanvas = document.createElement("canvas");
            pageCanvas.width = canvas.width;
            pageCanvas.height = srcH;

            const ctx = pageCanvas.getContext("2d")!;
            ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);

            const pageImgData = pageCanvas.toDataURL("image/png");

            const sliceHeightMm = (srcH * pageWidthMm) / canvas.width;

            pdf.addImage(pageImgData, "PNG", 0, 0, pageWidthMm, sliceHeightMm);
        }

        return pdf.output("bloburl") as any;
    }
}