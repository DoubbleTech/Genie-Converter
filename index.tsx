import { GoogleGenAI, Modality, Type } from "@google/genai";

const COLORS = {
    red: "#ef4444", 
    orange: "#f97316", 
    amber: "#f59e0b", 
    green: "#10b981", 
    blue: "#0ea5e9", 
    skyBlue: "#00aeef",
    indigo: "#6366f1", 
    violet: "#8b5cf6", 
    pink: "#ec4899", 
    rose: "#f43f5e", 
    cyan: "#06b6d4", 
    teal: "#14b8a6",
    gray: "#94a3b8",
    dark: "#1e293b"
};

/** 
 * Hyper-resilient script loader.
 * Checks multiple CDNs and uses version fallbacks to ensure library availability.
 */
const loadScript = async (id: string, src: string, retries = 1): Promise<boolean> => {
    const tryLoad = (targetSrc: string): Promise<boolean> => {
        if (document.getElementById(id)) return Promise.resolve(true);
        return new Promise<boolean>((resolve) => {
            const script = document.createElement('script');
            script.id = id;
            script.src = targetSrc;
            script.crossOrigin = "anonymous";
            
            const timeout = setTimeout(() => {
                console.warn(`Genie Warning: Script ${id} (${targetSrc}) timed out.`);
                script.remove();
                resolve(false);
            }, 120000);

            script.onload = () => {
                clearTimeout(timeout);
                resolve(true);
            };
            script.onerror = () => {
                clearTimeout(timeout);
                console.warn(`Genie: Failed to load script from ${targetSrc}`);
                script.remove();
                resolve(false);
            };
            document.head.appendChild(script);
        });
    };

    let success = await tryLoad(src);
    for (let i = 0; i < retries && !success; i++) {
        console.log(`Genie: Retrying ${id} (${i + 1}/${retries})...`);
        success = await tryLoad(src);
    }
    return success;
};

const loadPdfJs = async () => {
    await loadScript('pdf-js', 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js');
    if ((window as any).pdfjsLib) {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
    }
    return (window as any).pdfjsLib;
};

const loadPdfLib = async () => {
    await loadScript('pdf-lib', 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js');
    return (window as any).PDFLib;
};

const loadConversionLibs = async () => {
    console.log("Genie: Initializing libraries...");
    
    // node-forge is MANDATORY for PDF encryption.
    const forgeLoaded = await loadScript('forge-js', 'https://cdnjs.cloudflare.com/ajax/libs/forge/1.3.1/forge.min.js')
        || await loadScript('forge-js-fallback', 'https://cdn.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js');
    
    // Hyper-resilient paths for the encryption library
    const encPaths = [
        'https://cdn.jsdelivr.net/npm/pdf-encrypt-browser@1.0.3/dist/pdf-encrypt-browser.min.js',
        'https://unpkg.com/pdf-encrypt-browser@1.0.3/dist/pdf-encrypt-browser.min.js',
        'https://cdn.jsdelivr.net/npm/pdf-encrypt-browser/dist/pdf-encrypt-browser.min.js',
        'https://www.unpkg.com/pdf-encrypt-browser/dist/pdf-encrypt-browser.min.js',
        'https://bundle.run/pdf-encrypt-browser@1.0.3?format=umd'
    ];
    
    let encLoaded = false;
    for (let i = 0; i < encPaths.length; i++) {
        encLoaded = await loadScript(`pdf-enc-src-${i}`, encPaths[i], 0);
        if (encLoaded) break;
    }

    if (!encLoaded) console.error("Genie Critical: Encryption library failed to load across all sources.");

    await Promise.all([
        loadScript('jszip-js', 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'),
        loadScript('xlsx-js', 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js'),
        loadScript('jspdf-js', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
        loadScript('mammoth-js', 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js')
    ]);
};

/** 
 * PDF to Excel Conversion Engine (Dual Mode: Native Text & AI OCR)
 */
async function pdfToExcel(file: File) {
    const pdfjs = await loadPdfJs();
    const XLSX = (window as any).XLSX;
    if (!pdfjs || !XLSX) throw new Error("PDF.js or SheetJS not available.");

    const arr = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(arr) }).promise;
    const wb = XLSX.utils.book_new();

    const statusEl = document.getElementById('progress-pct');

    // --- AI OCR MODE (Vision Based) ---
    if (useOCR) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
            if (statusEl) statusEl.textContent = `OCR Scanning Page ${i}...`;
            
            // Render page to high-res image for AI Vision
            const canvas = await renderPageToCanvas(pdf, i, 2.5); // 2.5x scale for better text clarity
            const base64Img = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];

            try {
                // Call Gemini 3 Flash with strict schema for reliable JSON
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: [{
                        parts: [
                            { inlineData: { mimeType: 'image/jpeg', data: base64Img } },
                            { text: "Extract all visible table data from this page into a structured 2D array. Maintain row/column relationships accurately. If cells are merged, repeat the value or use empty strings as appropriate to keep grid alignment. Return a JSON object with a 'rows' property containing the array of arrays." }
                        ]
                    }],
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                rows: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    },
                                    description: "A 2D array where each inner array represents a row of the table."
                                }
                            },
                            required: ["rows"]
                        }
                    }
                });

                const json = JSON.parse(response.text || '{"rows": []}');
                if (json.rows && json.rows.length > 0) {
                    const ws = XLSX.utils.aoa_to_sheet(json.rows);
                    XLSX.utils.book_append_sheet(wb, ws, `Page ${i}`);
                } else {
                     // Fallback if AI sees no table
                     const ws = XLSX.utils.aoa_to_sheet([["(No tabular data detected on this page)"]]);
                     XLSX.utils.book_append_sheet(wb, ws, `Page ${i}`);
                }

            } catch (err) {
                console.error(`Genie OCR Error Page ${i}:`, err);
                const ws = XLSX.utils.aoa_to_sheet([["Error extracting data from this page."]]);
                XLSX.utils.book_append_sheet(wb, ws, `Page ${i}`);
            }
        }
    } 
    // --- NATIVE MODE (Text Layer Extraction) ---
    else {
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            // Group items by their vertical position (Y coordinate)
            const items = textContent.items.map((it: any) => ({
                str: it.str,
                x: it.transform[4],
                y: it.transform[5]
            }));

            // Sort by Y descending (Top to bottom)
            items.sort((a: any, b: any) => b.y - a.y);

            const rows: string[][] = [];
            let currentRow: any[] = [];
            let lastY = -1;

            for (const item of items) {
                // Group text in same line if within 5 units of vertical distance
                if (lastY === -1 || Math.abs(item.y - lastY) > 5) {
                    if (currentRow.length > 0) {
                        currentRow.sort((a, b) => a.x - b.x);
                        rows.push(currentRow.map(c => c.str));
                    }
                    currentRow = [item];
                    lastY = item.y;
                } else {
                    currentRow.push(item);
                }
            }
            if (currentRow.length > 0) {
                currentRow.sort((a, b) => a.x - b.x);
                rows.push(currentRow.map(c => c.str));
            }

            const ws = XLSX.utils.aoa_to_sheet(rows);
            XLSX.utils.book_append_sheet(wb, ws, `Page ${i}`);
        }
    }

    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    return new Blob([out], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

async function pdfToJpg(file: File) {
    const pdfjs = await loadPdfJs();
    const JSZip = (window as any).JSZip;
    if (!pdfjs) throw new Error("PDF.js not available.");
    
    const arr = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(arr) }).promise;
    
    if (pdf.numPages > 1 && JSZip) {
        const zip = new JSZip();
        for (let i = 1; i <= pdf.numPages; i++) {
            const canvas = await renderPageToCanvas(pdf, i);
            const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.9));
            zip.file(`page-${i}.jpg`, blob);
        }
        return await zip.generateAsync({ type: 'blob' });
    } else {
        const canvas = await renderPageToCanvas(pdf, 1);
        return await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.9));
    }
}

async function renderPageToCanvas(pdf: any, pageNum: number, scale = 2.0) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = viewport.width; canvas.height = viewport.height;
    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas;
}

async function jpgToPdf(file: File) {
    const { jspdf } = (window as any).jspdf;
    if (!jspdf) throw new Error("jsPDF not available.");
    
    const doc = new jspdf();
    const url = URL.createObjectURL(file);
    const img = new Image();
    await new Promise((res) => { img.onload = res; img.src = url; });
    
    const imgProps = doc.getImageProperties(img);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    doc.addImage(img, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    URL.revokeObjectURL(url);
    return doc.output('blob');
}

/**
 * Applies a digital stamp to PDF pages.
 */
async function stampPdf(file: File) {
    const PDFLib = await loadPdfLib();
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const { StandardFonts, rgb } = PDFLib;
    
    // Parse color hex to RGB
    const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return rgb(r, g, b);
    };

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const color = hexToRgb(stampColor);
    
    // Stamp Dimensions
    // Truncate to 25 chars max
    const textStr = stampText.toUpperCase().slice(0, 25);
    const dateStr = stampDate;
    
    for (const page of pages) {
        const { width, height } = page.getSize();
        let x = 0, y = 0;
        const margin = 20;

        if (stampShape === 'round') {
            const radius = 40;
            
            // Calculate coords based on 9 positions
            if (stampPosition.includes('left')) x = margin + radius;
            else if (stampPosition.includes('right')) x = width - margin - radius;
            else x = width / 2;

            if (stampPosition.includes('top')) y = height - margin - radius;
            else if (stampPosition.includes('bottom')) y = margin + radius;
            else y = height / 2;

            // Draw outer circles
            page.drawCircle({ x, y, size: radius, borderColor: color, borderWidth: 3, opacity: 0.8 });
            page.drawCircle({ x, y, size: radius - 4, borderColor: color, borderWidth: 1, opacity: 0.6 });

            // --- CURVED TEXT ENGINE ---
            const cx = x; 
            const cy = y;
            
            // Dynamic Sizing: Reduce size if > 20 chars
            let textSize = 13;
            let spacing = 1.15;
            
            if (textStr.length > 20) {
                textSize = 9;
                spacing = 1.05; // Tighten spacing for long text
            }

            // 1. Draw Main Text (Top Curve)
            // Baseline adjustment to provide padding from inner circle (radius 36)
            const textRadius = radius - 19; 
            const textWidth = textStr.split('').reduce((acc, char) => acc + font.widthOfTextAtSize(char, textSize), 0) * spacing;
            const anglePerPixel = 1 / textRadius;
            const totalAngle = textWidth * anglePerPixel;
            
            // Start centered at 90 deg (PI/2) and move CW
            let currentAngle = (Math.PI / 2) + (totalAngle / 2);

            for (const char of textStr) {
                const w = font.widthOfTextAtSize(char, textSize);
                const charAngle = (w * spacing) * anglePerPixel;
                
                // Center char in its sector
                const drawAngle = currentAngle - (charAngle / 2);
                
                const px = cx + textRadius * Math.cos(drawAngle);
                const py = cy + textRadius * Math.sin(drawAngle);
                
                // Rotation: Tangent to circle. At 90deg, rot is 0. rot = angle - 90.
                const rotation = drawAngle - (Math.PI / 2);

                page.drawText(char, {
                    x: px, y: py,
                    size: textSize,
                    font: font,
                    color: color,
                    rotate: PDFLib.radians(rotation)
                });
                
                currentAngle -= charAngle;
            }

            // 2. Draw Date (Bottom Curve) - Only if enabled
            if (stampIncludeDate) {
                const dateRadius = radius - 12;
                const dateSize = 9;
                const dateTextWidth = dateStr.split('').reduce((acc, char) => acc + font.widthOfTextAtSize(char, dateSize), 0) * 1.15;
                const dateAnglePerPixel = 1 / dateRadius;
                const dateTotalAngle = dateTextWidth * dateAnglePerPixel;
                
                // Start centered at 270 deg (3*PI/2) and move CCW (reading L to R)
                let dateCurrentAngle = (3 * Math.PI / 2) - (dateTotalAngle / 2);
                
                for (const char of dateStr) {
                    const w = font.widthOfTextAtSize(char, dateSize);
                    const charAngle = (w * 1.15) * dateAnglePerPixel;
                    
                    const drawAngle = dateCurrentAngle + (charAngle / 2);
                    
                    const px = cx + dateRadius * Math.cos(drawAngle);
                    const py = cy + dateRadius * Math.sin(drawAngle);
                    
                    const rotation = drawAngle + (Math.PI / 2);

                    page.drawText(char, {
                        x: px, y: py,
                        size: dateSize,
                        font: font,
                        color: color,
                        rotate: PDFLib.radians(rotation)
                    });
                    
                    dateCurrentAngle += charAngle;
                }
            }

        } else {
            // Horizontal Stamp
            const stampW = 160;
            const stampH = 50;

            if (stampPosition.includes('left')) x = margin;
            else if (stampPosition.includes('right')) x = width - margin - stampW;
            else x = (width - stampW) / 2;

            if (stampPosition.includes('top')) y = height - margin - stampH;
            else if (stampPosition.includes('bottom')) y = margin;
            else y = (height - stampH) / 2;

            // Draw Rectangle border
            page.drawRectangle({
                x, y, width: stampW, height: stampH,
                borderColor: color, borderWidth: 3, opacity: 0.8
            });
            // Inner thin rect
            page.drawRectangle({
                x: x+4, y: y+4, width: stampW-8, height: stampH-8,
                borderColor: color, borderWidth: 1, opacity: 0.6
            });

            // Main Text
            let textSize = 18;
            if (textStr.length > 15) textSize = 14;
            if (textStr.length > 20) textSize = 12;

            const textWidth = font.widthOfTextAtSize(textStr, textSize);
            
            // If date is present, text is pushed up. If no date, text is centered.
            const textY = stampIncludeDate ? (y + stampH - 28) : (y + (stampH - textSize)/2 + 2);

            page.drawText(textStr, {
                x: x + (stampW - textWidth) / 2,
                y: textY,
                size: textSize,
                font: font,
                color: color
            });

            // Date Text
            if (stampIncludeDate) {
                const dateSize = 10;
                const dateWidth = font.widthOfTextAtSize(dateStr, dateSize);
                page.drawText(dateStr, {
                    x: x + (stampW - dateWidth) / 2,
                    y: y + 10,
                    size: dateSize,
                    font: font,
                    color: color
                });
            }
        }
    }

    return new Blob([await pdfDoc.save()], { type: 'application/pdf' });
}

/**
 * Applies a Text Watermark to PDF pages.
 */
async function watermarkPdf(file: File) {
    const PDFLib = await loadPdfLib();
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const { StandardFonts, rgb } = PDFLib;
    
    const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return rgb(r, g, b);
    };

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const color = hexToRgb(watermarkColor);
    const opacity = watermarkOpacity / 100;
    const size = watermarkSize;
    const text = watermarkText;

    for (const page of pages) {
        const { width, height } = page.getSize();
        const centerX = width / 2;
        const centerY = height / 2;

        if (watermarkStyle === 'round') {
            // Circular Watermark Logic (Centered)
            const radius = Math.min(width, height) / 4; 
            const spacing = 1.15;
            const textWidth = text.split('').reduce((acc, char) => acc + font.widthOfTextAtSize(char, size), 0) * spacing;
            const anglePerPixel = 1 / radius;
            const totalAngle = textWidth * anglePerPixel;
            
            // Center the text arc at the top of the circle (90 degrees / PI/2)
            let currentAngle = (Math.PI / 2) + (totalAngle / 2);

            for (const char of text) {
                const w = font.widthOfTextAtSize(char, size);
                const charAngle = (w * spacing) * anglePerPixel;
                const drawAngle = currentAngle - (charAngle / 2);
                
                const px = centerX + radius * Math.cos(drawAngle);
                const py = centerY + radius * Math.sin(drawAngle);
                
                // Rotate text to match curvature
                const rotation = drawAngle - (Math.PI / 2);

                page.drawText(char, {
                    x: px, y: py,
                    size: size,
                    font: font,
                    color: color,
                    opacity: opacity,
                    rotate: PDFLib.radians(rotation)
                });
                currentAngle -= charAngle;
            }

        } else {
            // Linear Styles
            let angle = 0;
            if (watermarkStyle === 'diagonal') angle = 45;
            else if (watermarkStyle === 'declined') angle = -45;
            else if (watermarkStyle === 'vertical') angle = 90;
            else if (watermarkStyle === 'horizontal') angle = 0;
            else if (watermarkStyle === 'custom') angle = watermarkRotation;

            const textWidth = font.widthOfTextAtSize(text, size);
            // Calculate offset to center the rotated text at page center
            // X offset = -halfWidth * cos(angle)
            // Y offset = -halfWidth * sin(angle)
            const rad = angle * (Math.PI / 180);
            
            // We draw at center, then subtract half the width rotated vector to start drawing so center aligns
            const x = centerX - (textWidth / 2) * Math.cos(rad);
            const y = centerY - (textWidth / 2) * Math.sin(rad);

            page.drawText(text, {
                x: x,
                y: y,
                size: size,
                font: font,
                color: color,
                opacity: opacity,
                rotate: PDFLib.degrees(angle)
            });
        }
    }

    return new Blob([await pdfDoc.save()], { type: 'application/pdf' });
}

async function rotatePdf(file: File) {
    const PDFLib = await loadPdfLib();
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    for (const page of pages) {
        const currentRotation = page.getRotation().angle;
        // Normalize rotation to 0, 90, 180, 270
        const newRotation = (currentRotation + rotateAngle) % 360;
        page.setRotation(PDFLib.degrees(newRotation));
    }
    
    return new Blob([await pdfDoc.save()], { type: 'application/pdf' });
}

const eyeIconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const eyeOffIconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

const getIcon = (type: string, color: string) => {
    const glyphs: Record<string, string> = {
        merge: `<path d="M40 20v-4h-4v4h-4v4h4v4h4v-4h4v-4zM22 14h12v6h-6a4 4 0 01-4-4zm-4 32V16a4 4 0 014-4h14l10 10v22a4 4 0 01-4 4z"/>`,
        split: `<path d="M44 12v20H20V12h24zm0 24v20H20V36h24zM16 30h32v4H16zm10-12h4v4h-4zm0 24h4v4h-4z"/>`,
        word: `<path d="M20 12h24v40H20z" opacity=".2"/><path d="M24 24l4 16 4-16m4 0l4 16 4-16" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
        excel: `<path d="M20 12h24v40H20z" opacity=".2"/><path d="M26 24l12 16m0-16L26 40" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
        image: `<path d="M20 12h24v40H20z" opacity=".2"/><circle cx="32" cy="24" r="4"/><path d="M24 44l8-12 12 12z"/>`,
        sign: `<path d="M20 44c10-10 12-20 20-20s8 10 10 10" stroke="#fff" stroke-width="3" fill="none"/><circle cx="48" cy="36" r="4" fill="#fff"/>`,
        lock: `<path d="M42 28h-2v-4a8 8 0 00-16 0v4h-2a2 2 0 00-2 2v12a2 2 0 002 2h20a2 2 0 002-2V30a2 2 0 00-2-2zm-14-4a4 4 0 018 0v4h-8v-4z"/>`,
        rotate: `<path d="M32 12a16 16 0 11-16 16" fill="none" stroke="#fff" stroke-width="3"/><polyline points="32 6 32 18 20 18" fill="none" stroke="#fff" stroke-width="3"/>`,
        audio: `<path d="M32 12v24h12V12zM20 12v24h12V12z" fill="#fff"/>`,
        video: `<path d="M48 16l-10 6v10l10 6V16zM16 12h24a4 4 0 014 4v16a4 4 0 01-4 4H16a4 4 0 01-4-4V16a4 4 0 014-4z" fill="#fff"/>`,
        translate: `<path d="M28 16h16v16h-16zM16 32h16v16h-16z" fill="#fff" opacity=".3"/><path d="M20 20l12 12m0-12L20 32" stroke="#fff" stroke-width="3"/>`,
        ocr: `<path d="M16 16h32v32H16z" fill="none" stroke="#fff" stroke-width="3"/><path d="M24 24h16m-16 8h10m-10 8h16" stroke="#fff" stroke-width="2"/>`,
        organize: `<path d="M12 12h16v16H12zM36 12h16v16H36zM12 36h16v16H12zM36 36h16v16H36z" fill="#fff"/>`,
        number: `<path d="M32 12v40M20 24h24m-24 16h24" stroke="#fff" stroke-width="3"/>`
    };
    return `<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="${color}"/><g fill="#fff">${glyphs[type] || glyphs.merge}</g></svg>`;
};

const TOOLS_LIST = [
    { id: 'merge-pdf', title: 'Merge PDF', cat: 'PDF Core', icon: getIcon('merge', COLORS.rose) },
    { id: 'split-pdf', title: 'Split PDF', cat: 'PDF Core', icon: getIcon('split', COLORS.amber) },
    { id: 'compress-pdf', title: 'Compress PDF', cat: 'Optimization', icon: getIcon('merge', COLORS.green) },
    { id: 'pdf-to-word', title: 'PDF to Word', cat: 'Convert', icon: getIcon('word', COLORS.blue) },
    { id: 'word-to-pdf', title: 'Word to PDF', cat: 'Convert', icon: getIcon('word', COLORS.indigo) },
    { id: 'pdf-to-excel', title: 'PDF to Excel', cat: 'Convert', icon: getIcon('excel', COLORS.teal) },
    { id: 'pdf-to-jpg', title: 'PDF to JPG', cat: 'Convert', icon: getIcon('image', COLORS.pink) },
    { id: 'jpg-to-pdf', title: 'JPG to PDF', cat: 'Convert', icon: getIcon('image', COLORS.rose) },
    { id: 'sign-pdf', title: 'Sign PDF', cat: 'Security', icon: getIcon('sign', COLORS.teal) },
    { id: 'protect-pdf', title: 'Protect PDF', cat: 'Security', icon: getIcon('lock', COLORS.indigo) },
    { id: 'unlock-pdf', title: 'Unlock PDF', cat: 'Security', icon: getIcon('lock', COLORS.blue) },
    { id: 'rotate-pdf', title: 'Rotate PDF', cat: 'Edit', icon: getIcon('rotate', COLORS.orange) },
    { id: 'add-page-numbers', title: 'Add Page Numbers', cat: 'PDF Core', icon: getIcon('number', COLORS.blue) },
    { id: 'organize-pdf', title: 'Organize PDF', cat: 'Edit', icon: getIcon('organize', COLORS.indigo) },
    { id: 'stamp-pdf', title: 'Stamp PDF', cat: 'Security', icon: getIcon('sign', COLORS.rose) },
    { id: 'watermark-pdf', title: 'Watermark PDF', cat: 'Security', icon: getIcon('sign', COLORS.orange) },
    { id: 'pdf-to-pdfa', title: 'PDF to PDF/A', cat: 'Convert', icon: getIcon('merge', COLORS.cyan) },
    { id: 'pdf-to-ppt', title: 'PDF to PowerPoint', cat: 'Convert', icon: getIcon('word', COLORS.orange) },
    { id: 'ppt-to-pdf', title: 'PowerPoint to PDF', cat: 'Convert', icon: getIcon('word', COLORS.rose) },
    { id: 'excel-to-pdf', title: 'Excel to PDF', cat: 'Convert', icon: getIcon('excel', COLORS.green) },
    { id: 'html-to-pdf', title: 'HTML to PDF', cat: 'Convert', icon: getIcon('word', COLORS.blue) },
    { id: 'resize-image', title: 'Resize Image', cat: 'Images', icon: getIcon('image', COLORS.violet) },
    { id: 'jpg-to-png', title: 'JPG to PNG', cat: 'Images', icon: getIcon('image', COLORS.pink) },
    { id: 'png-to-jpg', title: 'PNG to JPG', cat: 'Images', icon: getIcon('image', COLORS.teal) },
    { id: 'image-to-gif', title: 'Image to GIF', cat: 'Images', icon: getIcon('image', COLORS.amber) },
    { id: 'convert-video', title: 'Convert Video', cat: 'Media', icon: getIcon('video', COLORS.indigo) },
    { id: 'mp4-to-gif', title: 'MP4 to GIF', cat: 'Media', icon: getIcon('video', COLORS.orange) },
    { id: 'wav-to-mp3', title: 'WAV to MP3', cat: 'Media', icon: getIcon('audio', COLORS.pink) },
    { id: 'trim-audio', title: 'Trim Audio', cat: 'Media', icon: getIcon('audio', COLORS.teal) },
    { id: 'translate-text', title: 'AI Translator', cat: 'AI Powered', icon: getIcon('translate', COLORS.violet) },
    { id: 'speech-to-text', title: 'Speech to Text', cat: 'AI Powered', icon: getIcon('audio', COLORS.indigo) },
    { id: 'text-to-speech', title: 'Text to Speech', cat: 'AI Powered', icon: getIcon('audio', COLORS.rose) },
    { id: 'ocr-pdf', title: 'OCR PDF', cat: 'AI Powered', icon: getIcon('ocr', COLORS.green) }
];

let currentTool: any = null;
let currentFiles: File[] = [];
let pagesManifest: { file: File, pageIndex: number, thumb: any }[] = []; // For Organize PDF
let signatureImage: string | null = null;
let signaturePos = { x: 50, y: 50 };
let protectPassword = "";
let confirmPassword = "";
let processedResultUrl = ""; 
let useOCR = false;

// Stamp State
let stampText = "APPROVED";
let stampShape = "horizontal";
let stampDate = new Date().toISOString().split('T')[0];
let stampIncludeDate = true;
let stampColor = COLORS.red;
let stampPosition = "bottom-right";

// Watermark State
let watermarkText = "DRAFT";
let watermarkStyle = "diagonal"; // inclined, declined, horizontal, vertical, round, custom
let watermarkRotation = 45;
let watermarkOpacity = 30; // 0-100
let watermarkSize = 60;
let watermarkColor = "#94a3b8"; // Slate-400

// Rotate State
let rotateAngle = 0;

function renderDashboard() {
    const grid = document.getElementById('tools-grid')!;
    grid.innerHTML = '';
    const categories = Array.from(new Set(TOOLS_LIST.map(t => t.cat)));
    categories.forEach(cat => {
        const sec = document.createElement('section');
        sec.className = 'tools-section';
        sec.innerHTML = `<div class="section-header">${cat}</div><div class="category-grid"></div>`;
        const catGrid = sec.querySelector('.category-grid')!;
        TOOLS_LIST.filter(t => t.cat === cat).forEach(tool => {
            const card = document.createElement('div');
            card.className = 'tool-card';
            card.innerHTML = `<div class="icon">${tool.icon}</div><h3>${tool.title}</h3><p>Fast Genie magic.</p>`;
            card.onclick = () => openWorkspace(tool);
            catGrid.appendChild(card);
        });
        grid.appendChild(sec);
    });
}

function updateProcessButton() {
    const btn = document.getElementById('process-btn') as HTMLButtonElement;
    if (!btn) return;
    
    const isTextTool = ['translate-text', 'text-to-speech'].includes(currentTool?.id);
    let hasInput = currentFiles.length > 0;
    
    if (currentTool?.id === 'organize-pdf') {
        hasInput = pagesManifest.length > 0;
    }

    if (isTextTool) {
        const inputId = currentTool.id === 'translate-text' ? 'trans-input' : 'tts-input';
        const textIn = (document.getElementById(inputId) as HTMLTextAreaElement)?.value;
        hasInput = (textIn && textIn.trim().length > 0) || currentFiles.length > 0;
    }

    if (currentTool?.id === 'protect-pdf') {
        const passMatch = protectPassword.length > 0 && protectPassword === confirmPassword;
        hasInput = hasInput && passMatch;
    }

    if (currentTool?.id === 'stamp-pdf') {
        hasInput = hasInput && stampText.trim().length > 0;
    }

    if (currentTool?.id === 'watermark-pdf') {
        hasInput = hasInput && watermarkText.trim().length > 0;
    }

    btn.disabled = !hasInput;
    btn.style.opacity = btn.disabled ? "0.4" : "1";
}

function openWorkspace(tool: any) {
    currentTool = tool;
    currentFiles = [];
    pagesManifest = []; // Reset pages
    signatureImage = null;
    signaturePos = { x: 100, y: 100 };
    protectPassword = "";
    confirmPassword = "";
    processedResultUrl = "";
    useOCR = false;
    
    // Reset Stamp Defaults
    stampText = "APPROVED";
    stampShape = "horizontal";
    stampDate = new Date().toISOString().split('T')[0];
    stampIncludeDate = true;
    stampColor = COLORS.red;
    stampPosition = "bottom-right";
    
    // Reset Watermark Defaults
    watermarkText = "DRAFT";
    watermarkStyle = "diagonal";
    watermarkRotation = 45;
    watermarkOpacity = 30;
    watermarkSize = 60;
    watermarkColor = "#94a3b8";

    // Reset Rotate Defaults
    rotateAngle = 0;

    (document.getElementById('workspace-name') as HTMLElement).textContent = `GENIE ${tool.title.toUpperCase()}`;
    resetWorkspaceUI();
    document.getElementById('tool-modal')!.classList.add('visible');
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.multiple = (tool.id === 'merge-pdf' || tool.id === 'organize-pdf');
    if (tool.id === 'translate-text' || tool.id === 'text-to-speech') {
        document.getElementById('modal-initial-view')!.style.display = 'none';
        document.getElementById('modal-options-view')!.style.display = 'flex';
        updateSettingsUI();
    }
    updateProcessButton();
}

function resetWorkspaceUI() {
    document.getElementById('modal-initial-view')!.style.display = 'flex';
    document.getElementById('modal-options-view')!.style.display = 'none';
    document.getElementById('modal-complete-view')!.style.display = 'none';
    document.getElementById('tool-settings')!.innerHTML = '';
    (document.querySelector('.workspace-sidebar') as HTMLElement).style.display = 'flex';
    updateProcessButton();
}

async function handleFiles(files: FileList | null, append = false) {
    if (!files || files.length === 0) return;
    const arr = Array.from(files);

    if (currentTool.id === 'organize-pdf') {
        // Special Handling for Organize PDF: Extract Pages
        if (!append) pagesManifest = [];
        document.getElementById('modal-initial-view')!.style.display = 'none';
        document.getElementById('modal-options-view')!.style.display = 'flex';
        // Show temporary loading or just let it render
        await extractPages(arr);
        updateSettingsUI();
        updateProcessButton();
        return;
    }

    if (currentTool.id === 'merge-pdf') {
        currentFiles = append ? [...currentFiles, ...arr] : arr;
    } else {
        currentFiles = [arr[0]];
    }
    document.getElementById('modal-initial-view')!.style.display = 'none';
    document.getElementById('modal-options-view')!.style.display = 'flex';
    updateSettingsUI();
    renderPreviews();
    updateProcessButton();
}

async function extractPages(files: File[]) {
    const pdfjs = await loadPdfJs();
    if (!pdfjs) return;

    for (const file of files) {
        try {
            const arr = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: new Uint8Array(arr) }).promise;
            
            for (let i = 1; i <= pdf.numPages; i++) {
                // We create thumbnails immediately to show in the grid
                const thumb = await createThumb(file, i, pdfjs); 
                // We modify wrapThumb behavior for Organize mode in renderOrganizeGrid, 
                // but here we just store raw data
                pagesManifest.push({
                    file: file,
                    pageIndex: i, // 1-based index
                    thumb: thumb
                });
            }
        } catch (e) {
            console.error("Error extracting pages", e);
        }
    }
    renderOrganizeGrid();
}

function renderOrganizeGrid() {
    const pane = document.getElementById('preview-pane')!;
    pane.innerHTML = '';
    pane.className = 'file-grid'; // Use same grid class
    
    pagesManifest.forEach((item, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'page-thumb';
        wrapper.draggable = true;
        wrapper.style.cursor = 'grab';
        
        // Drag Events
        wrapper.ondragstart = (e) => {
            e.dataTransfer!.setData('text/plain', index.toString());
            wrapper.style.opacity = '0.4';
        };
        wrapper.ondragend = () => { wrapper.style.opacity = '1'; };
        wrapper.ondragover = (e) => { e.preventDefault(); }; // Allow drop
        wrapper.ondrop = (e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer!.getData('text/plain'));
            const toIndex = index;
            
            // Swap logic
            const movedItem = pagesManifest.splice(fromIndex, 1)[0];
            pagesManifest.splice(toIndex, 0, movedItem);
            
            renderOrganizeGrid(); // Re-render
        };

        // Delete Button
        const removeBtn = document.createElement('button'); 
        removeBtn.className = 'remove-file-btn';
        removeBtn.innerHTML = '&times;'; 
        removeBtn.onclick = (e) => { 
            e.stopPropagation(); 
            pagesManifest.splice(index, 1);
            renderOrganizeGrid();
            updateProcessButton();
        };

        // Clone the canvas so we don't lose it from memory if reused
        const canvas = item.thumb; 
        // Note: item.thumb is already a canvas element or div. 
        // If it's a canvas, it can only be in one place in DOM.
        // renderOrganizeGrid removes it from DOM when innerHTML='', so appending is safe.
        
        wrapper.appendChild(removeBtn);
        wrapper.appendChild(canvas);
        
        const label = document.createElement('div'); 
        label.textContent = `${index + 1}`; 
        label.style.fontSize = '0.9rem'; 
        label.style.fontWeight = '800'; 
        label.style.marginTop = 'auto'; 
        label.style.color = 'var(--text-muted)';
        wrapper.appendChild(label);
        
        pane.appendChild(wrapper);
    });
}

(window as any).togglePassVisibility = (inputId: string, btn: HTMLElement) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = eyeOffIconSvg;
    } else {
        input.type = 'password';
        btn.innerHTML = eyeIconSvg;
    }
};

(window as any).updateProtectPassword = (val: string) => {
    protectPassword = val;
    const msg = document.getElementById('pass-match-msg');
    if (msg) msg.style.display = (protectPassword === confirmPassword && protectPassword !== "") ? 'none' : 'block';
    updateProcessButton();
};

(window as any).updateConfirmPassword = (val: string) => {
    confirmPassword = val;
    const msg = document.getElementById('pass-match-msg');
    if (msg) {
        if (confirmPassword === "" || protectPassword === "") {
             msg.textContent = "Please enter passwords";
             msg.style.color = "#64748b";
        } else if (confirmPassword !== protectPassword) {
             msg.textContent = "Passwords do not match";
             msg.style.color = "#ef4444";
        } else {
             msg.textContent = "Passwords match!";
             msg.style.color = "#22c55e";
        }
    }
    updateProcessButton();
};

(window as any).suggestStrongPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_";
    let pass = "";
    for (let i = 0; i < 12; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    const pInput = document.getElementById('protect-pass') as HTMLInputElement;
    const cInput = document.getElementById('protect-confirm') as HTMLInputElement;
    if (pInput && cInput) {
        pInput.value = pass;
        cInput.value = pass;
        protectPassword = pass;
        confirmPassword = pass;
        (window as any).updateConfirmPassword(pass);
    }
};

(window as any).toggleOCR = (val: boolean) => {
    useOCR = val;
    console.log("Genie: OCR Mode", useOCR ? "Enabled" : "Disabled");
};

// Global Stamp Update Handlers
(window as any).updateStampText = (val: string) => { stampText = val; updateProcessButton(); };
(window as any).updateStampDate = (val: string) => { stampDate = val; };
(window as any).toggleStampDate = (val: boolean) => { 
    stampIncludeDate = val; 
    const dateInput = document.getElementById('stamp-date-input');
    if(dateInput) dateInput.style.display = val ? 'block' : 'none';
};
(window as any).updateStampShape = (val: string) => { stampShape = val; };
(window as any).updateStampColor = (val: string) => { 
    stampColor = val;
    document.querySelectorAll('.color-circle').forEach((el: any) => {
        el.style.border = el.dataset.color === val ? '3px solid #333' : 'none';
        el.style.transform = el.dataset.color === val ? 'scale(1.1)' : 'scale(1)';
    });
};
(window as any).updateStampPosition = (val: string) => { 
    stampPosition = val;
    document.querySelectorAll('.pos-box').forEach((el: any) => {
        el.style.backgroundColor = el.dataset.pos === val ? 'var(--primary-blue)' : '#e2e8f0';
        el.style.color = el.dataset.pos === val ? 'white' : 'transparent';
    });
};

// Watermark Handlers
(window as any).updateWatermarkText = (val: string) => { watermarkText = val; updateProcessButton(); };
(window as any).updateWatermarkStyle = (val: string) => { 
    watermarkStyle = val;
    const customDiv = document.getElementById('watermark-custom-degree');
    if (customDiv) customDiv.style.display = val === 'custom' ? 'block' : 'none';
};
(window as any).updateWatermarkRotation = (val: string) => { watermarkRotation = parseInt(val) || 0; };
(window as any).updateWatermarkOpacity = (val: string) => { 
    watermarkOpacity = parseInt(val);
    (document.getElementById('opacity-val') as HTMLElement).textContent = val + '%';
};
(window as any).updateWatermarkSize = (val: string) => { watermarkSize = parseInt(val); };
(window as any).updateWatermarkColor = (val: string) => { 
    watermarkColor = val;
    document.querySelectorAll('.wm-color-circle').forEach((el: any) => {
        el.style.border = el.dataset.color === val ? '3px solid #333' : 'none';
        el.style.transform = el.dataset.color === val ? 'scale(1.1)' : 'scale(1)';
    });
};

// Rotate Handlers
(window as any).adjustRotation = (deg: number) => {
    rotateAngle = (rotateAngle + deg) % 360;
    const label = document.getElementById('rot-label');
    if(label) label.textContent = (rotateAngle > 0 ? '+' : '') + rotateAngle + '°';
    // Re-render previews to show rotation
    renderPreviews();
};

function updateSettingsUI() {
    const settings = document.getElementById('tool-settings')!;
    settings.innerHTML = '';
    
    if (currentTool.id === 'protect-pdf') {
        settings.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:1.2rem; font-family:'Inter', sans-serif;">
                <p style="font-size:0.85rem; color:#64748b; line-height:1.4;">Add a genuine password to your PDF. The file will be encrypted and prompt for access in any viewer.</p>
                <div>
                    <label style="display:block; font-weight:700; font-size:0.9rem; margin-bottom:0.5rem;">Password</label>
                    <div style="position:relative; width:100%;">
                        <input type="password" id="protect-pass" oninput="window.updateProtectPassword(this.value)" placeholder="Enter password" style="width:100%; padding:0.8rem; padding-right:2.8rem; border:1px solid #cbd5e1; border-radius:10px; outline:none; font-size:1rem;">
                        <button onclick="window.togglePassVisibility('protect-pass', this)" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; color:#94a3b8; cursor:pointer;">${eyeIconSvg}</button>
                    </div>
                </div>
                <div>
                    <label style="display:block; font-weight:700; font-size:0.9rem; margin-bottom:0.5rem;">Confirm Password</label>
                    <div style="position:relative; width:100%;">
                        <input type="password" id="protect-confirm" oninput="window.updateConfirmPassword(this.value)" placeholder="Repeat password" style="width:100%; padding:0.8rem; padding-right:2.8rem; border:1px solid #cbd5e1; border-radius:10px; outline:none; font-size:1rem;">
                        <button onclick="window.togglePassVisibility('protect-confirm', this)" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; color:#94a3b8; cursor:pointer;">${eyeIconSvg}</button>
                    </div>
                </div>
                <div id="pass-match-msg" style="font-size:0.75rem; font-weight:600; color:#64748b; margin-top:-0.5rem;">Passwords must match</div>
                <button class="btn-genie" onclick="window.suggestStrongPassword()" style="background:transparent; color:${COLORS.skyBlue}; border:1px solid ${COLORS.skyBlue}; box-shadow:none; font-size:0.85rem; padding:0.6rem;">Suggest Strong Password</button>
            </div>
        `;
    } else if (currentTool.id === 'pdf-to-excel') {
        settings.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:1.2rem;">
                <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:1rem; border-radius:12px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
                        <span style="font-weight:700; font-size:0.95rem; color:#334155;">Scanned Mode (AI OCR)</span>
                        <label class="switch" style="position:relative; display:inline-block; width:44px; height:24px;">
                            <input type="checkbox" onchange="window.toggleOCR(this.checked)" style="opacity:0; width:0; height:0;">
                            <span class="slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#cbd5e1; transition:.4s; border-radius:34px;"></span>
                            <span class="knob" style="position:absolute; content:''; height:18px; width:18px; left:3px; bottom:3px; background-color:white; transition:.4s; border-radius:50%;"></span>
                        </label>
                    </div>
                    <p style="font-size:0.8rem; color:#64748b; line-height:1.4;">
                        Enable this for scanned documents or images. It uses Gemini AI Vision to visually read and structure tables. Slower but more accurate for non-text PDFs.
                    </p>
                    <style>
                        .switch input:checked + .slider { background-color: var(--primary-blue); }
                        .switch input:checked ~ .knob { transform: translateX(20px); }
                    </style>
                </div>
            </div>
        `;
    } else if (currentTool.id === 'stamp-pdf') {
        const colors = [COLORS.red, COLORS.blue, COLORS.green, "#000000"];
        const colorHtml = colors.map(c => `
            <div class="color-circle" onclick="window.updateStampColor('${c}')" data-color="${c}"
                style="width:32px; height:32px; border-radius:50%; background:${c}; cursor:pointer; transition:all 0.2s; ${stampColor === c ? 'border:3px solid #333; transform:scale(1.1);' : ''}">
            </div>
        `).join('');

        const positions = [
            'top-left', 'top-center', 'top-right',
            'mid-left', 'mid-center', 'mid-right',
            'bottom-left', 'bottom-center', 'bottom-right'
        ];
        const gridHtml = positions.map(p => `
            <div class="pos-box" onclick="window.updateStampPosition('${p}')" data-pos="${p}"
                style="width:100%; height:35px; background:${stampPosition === p ? 'var(--primary-blue)' : '#e2e8f0'}; border-radius:6px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:0.2s;">
                <div style="width:6px; height:6px; background:${stampPosition === p ? 'white' : '#94a3b8'}; border-radius:50%;"></div>
            </div>
        `).join('');

        settings.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:1.2rem;">
                <div>
                    <label style="font-size:0.8rem; font-weight:700; color:#64748b; text-transform:uppercase;">Stamp Text (Max 25)</label>
                    <input type="text" maxlength="25" value="${stampText}" oninput="window.updateStampText(this.value)" style="width:100%; padding:0.8rem; margin-top:0.4rem; border:1px solid #cbd5e1; border-radius:8px; font-weight:700;">
                </div>
                <div>
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
                        <label style="font-size:0.8rem; font-weight:700; color:#64748b; text-transform:uppercase;">Include Date</label>
                        <label class="switch" style="position:relative; display:inline-block; width:36px; height:20px;">
                            <input type="checkbox" ${stampIncludeDate ? 'checked' : ''} onchange="window.toggleStampDate(this.checked)" style="opacity:0; width:0; height:0;">
                            <span class="slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#cbd5e1; transition:.4s; border-radius:34px;"></span>
                            <span class="knob" style="position:absolute; content:''; height:14px; width:14px; left:3px; bottom:3px; background-color:white; transition:.4s; border-radius:50%;"></span>
                        </label>
                        <style>
                            .switch input:checked + .slider { background-color: var(--primary-blue); }
                            .switch input:checked ~ .knob { transform: translateX(16px); }
                        </style>
                    </div>
                    <input id="stamp-date-input" type="date" value="${stampDate}" onchange="window.updateStampDate(this.value)" style="width:100%; padding:0.8rem; border:1px solid #cbd5e1; border-radius:8px; display:${stampIncludeDate ? 'block' : 'none'};">
                </div>
                <div>
                    <label style="font-size:0.8rem; font-weight:700; color:#64748b; text-transform:uppercase;">Shape</label>
                    <select onchange="window.updateStampShape(this.value)" style="width:100%; padding:0.8rem; margin-top:0.4rem; border:1px solid #cbd5e1; border-radius:8px; background:white;">
                        <option value="horizontal" ${stampShape === 'horizontal' ? 'selected' : ''}>Horizontal (Rectangle)</option>
                        <option value="round" ${stampShape === 'round' ? 'selected' : ''}>Round (Circular)</option>
                    </select>
                </div>
                <div>
                    <label style="font-size:0.8rem; font-weight:700; color:#64748b; text-transform:uppercase;">Color</label>
                    <div style="display:flex; gap:0.8rem; margin-top:0.5rem;">${colorHtml}</div>
                </div>
                <div>
                    <label style="font-size:0.8rem; font-weight:700; color:#64748b; text-transform:uppercase;">Position</label>
                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.5rem; margin-top:0.5rem;">${gridHtml}</div>
                </div>
            </div>
        `;
    } else if (currentTool.id === 'watermark-pdf') {
        const colors = [COLORS.gray, COLORS.red, COLORS.blue, COLORS.dark];
        const colorHtml = colors.map(c => `
            <div class="wm-color-circle" onclick="window.updateWatermarkColor('${c}')" data-color="${c}"
                style="width:32px; height:32px; border-radius:50%; background:${c}; cursor:pointer; transition:all 0.2s; ${watermarkColor === c ? 'border:3px solid #333; transform:scale(1.1);' : ''}">
            </div>
        `).join('');

        settings.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:1.2rem;">
                <div>
                    <label style="font-size:0.8rem; font-weight:700; color:#64748b; text-transform:uppercase;">Watermark Text</label>
                    <input type="text" value="${watermarkText}" oninput="window.updateWatermarkText(this.value)" style="width:100%; padding:0.8rem; margin-top:0.4rem; border:1px solid #cbd5e1; border-radius:8px; font-weight:700;">
                </div>
                
                <div>
                    <label style="font-size:0.8rem; font-weight:700; color:#64748b; text-transform:uppercase;">Placement / Style</label>
                    <select onchange="window.updateWatermarkStyle(this.value)" style="width:100%; padding:0.8rem; margin-top:0.4rem; border:1px solid #cbd5e1; border-radius:8px; background:white;">
                        <option value="diagonal" ${watermarkStyle === 'diagonal' ? 'selected' : ''}>Inclined (45°)</option>
                        <option value="declined" ${watermarkStyle === 'declined' ? 'selected' : ''}>Declined (-45°)</option>
                        <option value="horizontal" ${watermarkStyle === 'horizontal' ? 'selected' : ''}>Horizontal (0°)</option>
                        <option value="vertical" ${watermarkStyle === 'vertical' ? 'selected' : ''}>Vertical (90°)</option>
                        <option value="round" ${watermarkStyle === 'round' ? 'selected' : ''}>Round Circle</option>
                        <option value="custom" ${watermarkStyle === 'custom' ? 'selected' : ''}>Custom Degree</option>
                    </select>
                </div>

                <div id="watermark-custom-degree" style="display:${watermarkStyle === 'custom' ? 'block' : 'none'};">
                    <label style="font-size:0.8rem; font-weight:700; color:#64748b; text-transform:uppercase;">Rotation (Degrees)</label>
                    <input type="number" value="${watermarkRotation}" oninput="window.updateWatermarkRotation(this.value)" style="width:100%; padding:0.8rem; margin-top:0.4rem; border:1px solid #cbd5e1; border-radius:8px;">
                </div>

                <div>
                    <div style="display:flex; justify-content:space-between;">
                        <label style="font-size:0.8rem; font-weight:700; color:#64748b; text-transform:uppercase;">Transparency</label>
                        <span id="opacity-val" style="font-size:0.8rem; font-weight:700; color:var(--primary-blue);">${watermarkOpacity}%</span>
                    </div>
                    <input type="range" min="0" max="100" value="${watermarkOpacity}" oninput="window.updateWatermarkOpacity(this.value)" style="width:100%; margin-top:0.5rem; accent-color:var(--primary-blue);">
                </div>

                <div>
                     <label style="font-size:0.8rem; font-weight:700; color:#64748b; text-transform:uppercase;">Font Size</label>
                     <input type="number" value="${watermarkSize}" oninput="window.updateWatermarkSize(this.value)" style="width:100%; padding:0.8rem; margin-top:0.4rem; border:1px solid #cbd5e1; border-radius:8px;">
                </div>

                <div>
                    <label style="font-size:0.8rem; font-weight:700; color:#64748b; text-transform:uppercase;">Color</label>
                    <div style="display:flex; gap:0.8rem; margin-top:0.5rem;">${colorHtml}</div>
                </div>
            </div>
        `;
    } else if (currentTool.id === 'rotate-pdf') {
        settings.innerHTML = `
            <div style="text-align:center; padding:1rem 0;">
                <p style="color:#64748b; font-size:0.9rem; margin-bottom:1.5rem; line-height:1.5;">
                    Rotate all pages in your document. <br>The preview updates instantly.
                </p>
                <div style="display:flex; gap:1.2rem; justify-content:center; margin-bottom:2rem;">
                    <button onclick="window.adjustRotation(-90)" title="Rotate Left 90°"
                        style="background:white; border:1px solid #cbd5e1; border-radius:12px; width:64px; height:64px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; box-shadow:0 2px 5px rgba(0,0,0,0.05); transition:all 0.2s;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        <span style="font-size:0.65rem; font-weight:700; color:#64748b;">LEFT</span>
                    </button>
                    <button onclick="window.adjustRotation(90)" title="Rotate Right 90°"
                        style="background:white; border:1px solid #cbd5e1; border-radius:12px; width:64px; height:64px; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; box-shadow:0 2px 5px rgba(0,0,0,0.05); transition:all 0.2s;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                        <span style="font-size:0.65rem; font-weight:700; color:#64748b;">RIGHT</span>
                    </button>
                </div>
                <div style="background:#f1f5f9; padding:1rem; border-radius:12px; display:inline-block; min-width:140px;">
                    <div style="font-size:0.75rem; color:#64748b; font-weight:700; text-transform:uppercase; margin-bottom:0.2rem;">Added Rotation</div>
                    <div style="font-weight:900; color:var(--primary-blue); font-size:1.8rem;" id="rot-label">0°</div>
                </div>
            </div>
        `;
    } else if (currentTool.id === 'organize-pdf') {
        settings.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:1.2rem;">
                <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.5;">
                    Drag and drop pages to reorder them.<br>Hover over a page to delete it.
                </p>
                <button class="btn-genie" onclick="document.getElementById('file-input').click()" 
                    style="background:white; color:var(--primary-blue); border:2px dashed var(--primary-blue); box-shadow:none; padding:1rem;">
                    <span style="font-size:1.2rem;">+</span> Add More Pages
                </button>
            </div>
        `;
    } else {
        settings.innerHTML = `<p style="font-size:0.9rem; color:var(--text-muted);">Genie will automatically handle the best settings for ${currentTool.title}.</p>`;
    }
}

async function renderPreviews() {
    const pane = document.getElementById('preview-pane')!;
    pane.innerHTML = '';
    const pdfjs = await loadPdfJs();
    if (currentFiles.length === 0) return;
    
    pane.className = 'file-grid';
    for (let i = 0; i < currentFiles.length; i++) {
        const file = currentFiles[i];
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        const thumb = isPdf && pdfjs ? await createThumb(file, 1, pdfjs) : document.createElement('div');
        if (!isPdf || !pdfjs) { (thumb as HTMLElement).className = 'file-placeholder'; (thumb as HTMLElement).textContent = file.name.split('.').pop()?.toUpperCase() || 'FILE'; }
        pane.appendChild(wrapThumb(thumb as HTMLElement, file.name, () => {
            currentFiles.splice(i, 1); renderPreviews(); if (currentFiles.length === 0) resetWorkspaceUI();
            updateProcessButton();
        }));
    }
}

async function createThumb(file: File, pageNum: number, pdfjs: any) {
    try {
        const arr = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(arr) }).promise;
        const page = await pdf.getPage(pageNum);
        
        // Add current rotation if tool is rotate-pdf
        let rot = 0;
        if (currentTool && currentTool.id === 'rotate-pdf') rot = rotateAngle;
        
        // pdf.js page.rotate gives the PDF's internal rotation (0, 90, 180, 270)
        // We add our UI rotation to it
        const viewport = page.getViewport({ scale: 0.3, rotation: page.rotate + rot });
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
        return canvas;
    } catch (e) {
        const div = document.createElement('div');
        div.className = 'file-placeholder'; div.textContent = 'PDF';
        return div;
    }
}

function wrapThumb(el: HTMLElement, labelText: string, onDelete: () => void) {
    const wrap = document.createElement('div'); wrap.className = 'page-thumb';
    const removeBtn = document.createElement('button'); removeBtn.className = 'remove-file-btn';
    removeBtn.innerHTML = '&times;'; removeBtn.onclick = (e) => { e.stopPropagation(); onDelete(); };
    wrap.appendChild(removeBtn); wrap.appendChild(el);
    const label = document.createElement('div'); label.textContent = labelText; label.style.fontSize = '0.7rem'; label.style.fontWeight = '700'; label.style.marginTop = 'auto'; label.style.textAlign = 'center';
    wrap.appendChild(label);
    return wrap;
}

async function startProcess() {
    document.getElementById('modal-options-view')!.style.display = 'none';
    (document.querySelector('.workspace-sidebar') as HTMLElement).style.display = 'none';
    document.getElementById('modal-processing-view')!.style.display = 'flex';
    let progress = 0; 
    const bar = document.getElementById('progress-bar')!; 
    const pct = document.getElementById('progress-pct')!;
    
    // Progress simulation - if OCR is on, we update it manually in the function
    const iv = setInterval(() => { 
        if (!useOCR && progress < 100) progress += 4;
        // If OCR is on, the loop inside pdfToExcel updates the text, we just keep bar moving slightly
        if (useOCR && progress < 90) progress += 0.5;

        if (progress >= 100 && !useOCR) { 
            progress = 100; 
            clearInterval(iv); 
            finishProcess(); 
        }
        
        bar.style.width = progress + '%'; 
        if (!useOCR) pct.textContent = Math.round(progress) + '%'; 
    }, 120);

    // If OCR, we trigger finishProcess immediately so the async logic runs while interval updates visuals
    if (useOCR) {
        try {
            await finishProcess();
        } catch(e) { console.error(e); }
        clearInterval(iv);
        bar.style.width = '100%';
        pct.textContent = '100%';
    }
}

async function finishProcess() {
    try {
        await loadConversionLibs();
        const PDFLib = await loadPdfLib();
        let resultBlob: Blob | null = null;
        let finalExtension = 'pdf';

        if (currentTool.id === 'protect-pdf') {
            const arr = await currentFiles[0].arrayBuffer();
            const password = protectPassword;
            const PDFEncrypt = (window as any).pdfEncrypt || (window as any).PDFEncrypt || (window as any).pdf_encrypt_browser || (window as any).pdfEncryptBrowser;
            
            if (PDFEncrypt && PDFEncrypt.encrypt) {
                const encryptedBytes = await PDFEncrypt.encrypt(new Uint8Array(arr), password);
                resultBlob = new Blob([encryptedBytes], { type: 'application/pdf' });
            } else {
                const doc = await PDFLib.PDFDocument.load(arr);
                resultBlob = new Blob([await doc.save()], { type: 'application/pdf' });
            }
        } else if (currentTool.id === 'pdf-to-excel') {
            resultBlob = await pdfToExcel(currentFiles[0]);
            finalExtension = 'xlsx';
        } else if (currentTool.id === 'pdf-to-jpg') {
            resultBlob = await pdfToJpg(currentFiles[0]);
            finalExtension = resultBlob.type.includes('zip') ? 'zip' : 'jpg';
        } else if (currentTool.id === 'jpg-to-pdf') {
            resultBlob = await jpgToPdf(currentFiles[0]);
            finalExtension = 'pdf';
        } else if (currentTool.id === 'stamp-pdf') {
            resultBlob = await stampPdf(currentFiles[0]);
        } else if (currentTool.id === 'watermark-pdf') {
            resultBlob = await watermarkPdf(currentFiles[0]);
        } else if (currentTool.id === 'rotate-pdf') {
            resultBlob = await rotatePdf(currentFiles[0]);
        } else if (currentTool.id === 'organize-pdf') {
            const newPdf = await PDFLib.PDFDocument.create();
            // Cache loaded source documents to avoid parsing multiple times
            const loadedDocs = new Map();

            for (const item of pagesManifest) {
                let sourceDoc = loadedDocs.get(item.file);
                if (!sourceDoc) {
                    const arr = await item.file.arrayBuffer();
                    sourceDoc = await PDFLib.PDFDocument.load(arr);
                    loadedDocs.set(item.file, sourceDoc);
                }
                
                // Copy the specific page (0-based index for pdf-lib)
                const [copiedPage] = await newPdf.copyPages(sourceDoc, [item.pageIndex - 1]);
                newPdf.addPage(copiedPage);
            }
            resultBlob = new Blob([await newPdf.save()], { type: 'application/pdf' });
        } else if (currentTool.id === 'merge-pdf') {
            const mergedPdf = await PDFLib.PDFDocument.create();
            for (const file of currentFiles) {
                const donor = await PDFLib.PDFDocument.load(await file.arrayBuffer());
                const pages = await mergedPdf.copyPages(donor, donor.getPageIndices());
                pages.forEach((p: any) => mergedPdf.addPage(p));
            }
            resultBlob = new Blob([await mergedPdf.save()], { type: 'application/pdf' });
        } else { 
            resultBlob = currentFiles[0]; 
        }

        if (resultBlob) {
            processedResultUrl = URL.createObjectURL(resultBlob);
            const downloadZone = document.getElementById('download-area')!;
            downloadZone.style.display = 'flex';
            downloadZone.innerHTML = `<a href="${processedResultUrl}" download="Genie_Result.${finalExtension}" class="btn-genie" style="width:auto; padding:1.2rem 5rem;">Download Result</a>`;
        }
    } catch (e) {
        console.error("Genie Fatal Process Error:", e);
    } finally {
        document.getElementById('modal-processing-view')!.style.display = 'none';
        document.getElementById('modal-complete-view')!.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    (document.getElementById('theme-btn') as HTMLElement).onclick = () => {
        const cur = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
        (document.getElementById('theme-btn') as HTMLElement).textContent = cur === 'dark' ? '🌙' : '☀️';
    };
    (document.getElementById('select-file-btn') as HTMLElement).onclick = () => (document.getElementById('file-input') as HTMLInputElement).click();
    (document.getElementById('file-input') as HTMLInputElement).onchange = (e) => handleFiles((e.target as HTMLInputElement).files);
    (document.getElementById('process-btn') as HTMLElement).onclick = startProcess;
    (document.getElementById('btn-restart') as HTMLElement).onclick = resetWorkspaceUI;
    (document.querySelector('.close-modal') as HTMLElement).onclick = () => {
        document.getElementById('tool-modal')!.classList.remove('visible');
        document.body.style.overflow = 'auto';
    };
    const search = document.getElementById('search-input') as HTMLInputElement;
    search.oninput = () => {
        const val = search.value.toLowerCase();
        document.querySelectorAll('.tool-card').forEach(card => {
            const h3 = card.querySelector('h3')!.textContent!.toLowerCase();
            (card as HTMLElement).style.display = h3.includes(val) ? 'flex' : 'none';
        });
    };
    updateProcessButton();
});