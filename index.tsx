
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
    dark: "#1e293b",
    wordpress: "#21759b"
};

/** 
 * Hyper-resilient script loader.
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
    
    await loadScript('forge-js', 'https://cdnjs.cloudflare.com/ajax/libs/forge/1.3.1/forge.min.js')
        || await loadScript('forge-js-fallback', 'https://cdn.jsdelivr.net/npm/node-forge@1.3.1/dist/forge.min.js');
    
    await Promise.all([
        loadScript('jszip-js', 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'),
        loadScript('xlsx-js', 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js'),
        loadScript('jspdf-js', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
        loadScript('mammoth-js', 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js'),
        loadScript('gif-js', 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js'),
    ]);

    // FFmpeg 0.11.6: Single-file UMD build to avoid dynamic chunk CORS issues
    await loadScript('ffmpeg-js', 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js')
        .then(ok => !ok ? loadScript('ffmpeg-js-fb', 'https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js') : true);
};

/** 
 * Helper for FFmpeg 0.11.x to load resources from same-origin Blob URLs
 * This is CRITICAL for bypassing SharedArrayBuffer and Cross-Origin restrictions.
 */
async function toBlobURL(url: string, mimeType: string): Promise<string> {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to fetch resource: ${url}`);
    const body = await resp.blob();
    const blob = new Blob([body], { type: mimeType });
    return URL.createObjectURL(blob);
}

/** 
 * Conversion Engines
 */

async function convertImage(file: File, mimeType: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject("Canvas failure");
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject("Blob generation failed");
                }, mimeType, 0.95);
            };
            img.onerror = () => reject("Image loading error");
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject("File reading error");
        reader.readAsDataURL(file);
    });
}

async function resizeImage(file: File) {
    return new Promise<Blob>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                let targetW = 0;
                let targetH = 0;

                if (resizeMode === 'percentage') {
                    const factor = resizePercentage / 100;
                    targetW = Math.round(img.width * factor);
                    targetH = Math.round(img.height * factor);
                } else {
                    targetW = resizeWidth;
                    targetH = resizeHeight;
                }

                if (resizeNoEnlarge) {
                    if (targetW > img.width) targetW = img.width;
                    if (targetH > img.height) targetH = img.height;
                }

                const canvas = document.createElement('canvas');
                canvas.width = targetW;
                canvas.height = targetH;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject("Canvas context error");

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, targetW, targetH);

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject("Blob generation failed");
                }, file.type || 'image/jpeg', 0.95);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
}

async function getGifWorkerUrl() {
    try {
        const response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js');
        if (!response.ok) throw new Error("Failed to load worker");
        const txt = await response.text();
        const blob = new Blob([txt], { type: 'application/javascript' });
        return URL.createObjectURL(blob);
    } catch (e) {
        console.warn("Genie: Could not load local worker, trying fallback options.", e);
        return null;
    }
}

async function imageToGif(files: File[]) {
    const GIF = (window as any).GIF;
    if (!GIF) throw new Error("GIF.js not loaded");

    const workerUrl = await getGifWorkerUrl();
    const firstImage = await createImageBitmap(files[0]);
    const width = firstImage.width;
    const height = firstImage.height;
    
    const gif = new GIF({
        workers: 2,
        quality: 10,
        width: width,
        height: height,
        workerScript: workerUrl
    });

    for (const file of files) {
        const img = new Image();
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if(ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0,0,width,height);
            ctx.drawImage(img, 0, 0, width, height);
            gif.addFrame(canvas, { delay: gifDelay });
        }
    }

    return new Promise<Blob>((resolve) => {
        gif.on('finished', (blob: Blob) => {
            if(workerUrl) URL.revokeObjectURL(workerUrl);
            resolve(blob);
        });
        gif.render();
    });
}

/**
 * FIXED: Explicitly force Single-Threaded Core for all environments to avoid SharedArrayBuffer/proxy_main issues.
 */
async function convertVideo(file: File) {
    const { createFFmpeg, fetchFile } = (window as any).FFmpeg;
    if (!createFFmpeg) throw new Error("FFmpeg library failed to load.");

    // FORCE core-st (Single Threaded) to ensure maximum compatibility in sandboxed origins.
    const coreBaseURL = 'https://unpkg.com/@ffmpeg/core-st@0.11.0/dist';
    
    const corePath = await toBlobURL(`${coreBaseURL}/ffmpeg-core.js`, 'text/javascript');
    const wasmPath = await toBlobURL(`${coreBaseURL}/ffmpeg-core.wasm`, 'application/wasm');

    const ffmpeg = createFFmpeg({
        log: true,
        corePath: corePath,
        wasmPath: wasmPath 
    });

    ffmpeg.setProgress(({ ratio }: { ratio: number }) => {
        const pct = Math.round(ratio * 100);
        const bar = document.getElementById('progress-bar');
        const txt = document.getElementById('progress-pct');
        if (bar) bar.style.width = `${pct}%`;
        if (txt) txt.textContent = `${pct}%`;
    });

    try {
        await ffmpeg.load();
        const inputName = 'input_file';
        const outputName = `output.${targetVideoFormat}`;

        ffmpeg.FS('writeFile', inputName, await fetchFile(file));
        await ffmpeg.run('-i', inputName, outputName);
        
        const data = ffmpeg.FS('readFile', outputName);
        ffmpeg.exit();
        URL.revokeObjectURL(corePath);
        URL.revokeObjectURL(wasmPath);

        return new Blob([data], { type: `video/${targetVideoFormat}` });
    } catch (e: any) {
        try { ffmpeg.exit(); } catch (err) {}
        URL.revokeObjectURL(corePath);
        URL.revokeObjectURL(wasmPath);
        throw new Error(`FFmpeg Error: ${e.message || "Conversion failed. Please try a shorter video or different format."}`);
    }
}

async function videoToGif(file: File) {
    const { createFFmpeg, fetchFile } = (window as any).FFmpeg;
    if (!createFFmpeg) throw new Error("FFmpeg library failed to load.");

    const coreBaseURL = 'https://unpkg.com/@ffmpeg/core-st@0.11.0/dist';
        
    const corePath = await toBlobURL(`${coreBaseURL}/ffmpeg-core.js`, 'text/javascript');
    const wasmPath = await toBlobURL(`${coreBaseURL}/ffmpeg-core.wasm`, 'application/wasm');

    const ffmpeg = createFFmpeg({
        log: true,
        corePath: corePath,
        wasmPath: wasmPath
    });

    ffmpeg.setProgress(({ ratio }: { ratio: number }) => {
        const pct = Math.round(ratio * 100);
        const bar = document.getElementById('progress-bar');
        const txt = document.getElementById('progress-pct');
        if (bar) bar.style.width = `${pct}%`;
        if (txt) txt.textContent = `${pct}%`;
    });

    try {
        await ffmpeg.load();
        const inputName = 'input_file';
        const outputName = 'output.gif';

        ffmpeg.FS('writeFile', inputName, await fetchFile(file));
        
        await ffmpeg.run(
            '-i', inputName, 
            '-vf', 'fps=15,scale=min(600,iw):-1:flags=lanczos', 
            '-c:v', 'gif', 
            '-f', 'gif', 
            outputName
        );
        
        const data = ffmpeg.FS('readFile', outputName);
        ffmpeg.exit();
        URL.revokeObjectURL(corePath);
        URL.revokeObjectURL(wasmPath);

        return new Blob([data], { type: 'image/gif' });
    } catch (e: any) {
        try { ffmpeg.exit(); } catch (err) {}
        URL.revokeObjectURL(corePath);
        URL.revokeObjectURL(wasmPath);
        throw new Error(`FFmpeg Error: ${e.message || "Conversion failed"}`);
    }
}

async function pdfToExcel(file: File) {
    const pdfjs = await loadPdfJs();
    const XLSX = (window as any).XLSX;
    if (!pdfjs || !XLSX) throw new Error("PDF.js or SheetJS not available.");

    const arr = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(arr) }).promise;
    const wb = XLSX.utils.book_new();
    const statusEl = document.getElementById('progress-pct');

    if (useOCR) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
            if (statusEl) statusEl.textContent = `OCR Scanning Page ${i}...`;
            const canvas = await renderPageToCanvas(pdf, i, 2.5);
            const base64Img = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: [{
                        parts: [
                            { inlineData: { mimeType: 'image/jpeg', data: base64Img } },
                            { text: "Extract all visible table data from this page into a structured 2D array. Return a JSON object with a 'rows' property." }
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
                                    }
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
                }
            } catch (err) {
                console.error(`Genie OCR Error Page ${i}:`, err);
            }
        }
    } else {
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const items = textContent.items.map((it: any) => ({
                str: it.str,
                x: it.transform[4],
                y: it.transform[5]
            }));
            items.sort((a: any, b: any) => b.y - a.y);
            const rows: string[][] = [];
            let currentRow: any[] = [];
            let lastY = -1;
            for (const item of items) {
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

/**
 * FIXED: Handled jsPDF constructor resolution for UMD build.
 */
async function jpgToPdf(file: File) {
    const lib = (window as any).jspdf;
    const jsPDF = lib?.jsPDF || (window as any).jsPDF;
    if (!jsPDF) throw new Error("jsPDF not available.");
    
    const doc = new jsPDF();
    const url = URL.createObjectURL(file);
    const img = new Image();
    await new Promise((res, rej) => { 
        img.onload = res; 
        img.onerror = rej;
        img.src = url; 
    });
    
    const imgProps = doc.getImageProperties(img);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(img, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    URL.revokeObjectURL(url);
    return doc.output('blob');
}

async function stampPdf(file: File) {
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
    const color = hexToRgb(stampColor);
    const textStr = stampText.toUpperCase().slice(0, 25);
    const dateStr = stampDate;
    for (const page of pages) {
        const { width, height } = page.getSize();
        let x = 0, y = 0;
        const margin = 20;
        if (stampShape === 'round') {
            const radius = 40;
            if (stampPosition.includes('left')) x = margin + radius;
            else if (stampPosition.includes('right')) x = width - margin - radius;
            else x = width / 2;
            if (stampPosition.includes('top')) y = height - margin - radius;
            else if (stampPosition.includes('bottom')) y = margin + radius;
            else y = height / 2;
            page.drawCircle({ x, y, size: radius, borderColor: color, borderWidth: 3, opacity: 0.8 });
            page.drawCircle({ x, y, size: radius - 4, borderColor: color, borderWidth: 1, opacity: 0.6 });
            const cx = x; const cy = y;
            let textSize = textStr.length > 20 ? 9 : 13;
            let spacing = textStr.length > 20 ? 1.05 : 1.15;
            const textRadius = radius - 19; 
            const textWidth = textStr.split('').reduce((acc, char) => acc + font.widthOfTextAtSize(char, textSize), 0) * spacing;
            const anglePerPixel = 1 / textRadius;
            const totalAngle = textWidth * anglePerPixel;
            let currentAngle = (Math.PI / 2) + (totalAngle / 2);
            for (const char of textStr) {
                const charAngle = (font.widthOfTextAtSize(char, textSize) * spacing) * anglePerPixel;
                const drawAngle = currentAngle - (charAngle / 2);
                const px = cx + textRadius * Math.cos(drawAngle);
                const py = cy + textRadius * Math.sin(drawAngle);
                const rotation = drawAngle - (Math.PI / 2);
                page.drawText(char, { x: px, y: py, size: textSize, font, color, rotate: PDFLib.radians(rotation) });
                currentAngle -= charAngle;
            }
            if (stampIncludeDate) {
                const dateRadius = radius - 12;
                const dateSize = 9;
                const dateTextWidth = dateStr.split('').reduce((acc, char) => acc + font.widthOfTextAtSize(char, dateSize), 0) * 1.15;
                const dateAnglePerPixel = 1 / dateRadius;
                const dateTotalAngle = dateTextWidth * dateAnglePerPixel;
                let dateCurrentAngle = (3 * Math.PI / 2) - (dateTotalAngle / 2);
                for (const char of dateStr) {
                    const charAngle = (font.widthOfTextAtSize(char, dateSize) * 1.15) * dateAnglePerPixel;
                    const drawAngle = dateCurrentAngle + (charAngle / 2);
                    const px = cx + dateRadius * Math.cos(drawAngle);
                    const py = cy + dateRadius * Math.sin(drawAngle);
                    const rotation = drawAngle + (Math.PI / 2);
                    page.drawText(char, { x: px, y: py, size: dateSize, font, color, rotate: PDFLib.radians(rotation) });
                    dateCurrentAngle += charAngle;
                }
            }
        } else {
            const stampW = 160; const stampH = 50;
            if (stampPosition.includes('left')) x = margin;
            else if (stampPosition.includes('right')) x = width - margin - stampW;
            else x = (width - stampW) / 2;
            if (stampPosition.includes('top')) y = height - margin - stampH;
            else if (stampPosition.includes('bottom')) y = margin;
            else y = (height - stampH) / 2;
            page.drawRectangle({ x, y, width: stampW, height: stampH, borderColor: color, borderWidth: 3, opacity: 0.8 });
            page.drawRectangle({ x: x+4, y: y+4, width: stampW-8, height: stampH-8, borderColor: color, borderWidth: 1, opacity: 0.6 });
            let textSize = 18;
            if (textStr.length > 15) textSize = 14;
            if (textStr.length > 20) textSize = 12;
            const textWidth = font.widthOfTextAtSize(textStr, textSize);
            const textY = stampIncludeDate ? (y + stampH - 28) : (y + (stampH - textSize)/2 + 2);
            page.drawText(textStr, { x: x + (stampW - textWidth) / 2, y: textY, size: textSize, font, color });
            if (stampIncludeDate) {
                const dateSize = 10;
                const dateWidth = font.widthOfTextAtSize(dateStr, dateSize);
                page.drawText(dateStr, { x: x + (stampW - dateWidth) / 2, y: y + 10, size: dateSize, font, color });
            }
        }
    }
    return new Blob([await pdfDoc.save()], { type: 'application/pdf' });
}

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
        const centerX = width / 2; const centerY = height / 2;
        if (watermarkStyle === 'round') {
            const radius = Math.min(width, height) / 4; 
            const spacing = 1.15;
            const textWidth = text.split('').reduce((acc, char) => acc + font.widthOfTextAtSize(char, size), 0) * spacing;
            const anglePerPixel = 1 / radius;
            const totalAngle = textWidth * anglePerPixel;
            let currentAngle = (Math.PI / 2) + (totalAngle / 2);
            for (const char of text) {
                const charAngle = (font.widthOfTextAtSize(char, size) * spacing) * anglePerPixel;
                const drawAngle = currentAngle - (charAngle / 2);
                const px = centerX + radius * Math.cos(drawAngle);
                const py = centerY + radius * Math.sin(drawAngle);
                const rotation = drawAngle - (Math.PI / 2);
                page.drawText(char, { x: px, y: py, size, font, color, opacity, rotate: PDFLib.radians(rotation) });
                currentAngle -= charAngle;
            }
        } else {
            let angle = 0;
            if (watermarkStyle === 'diagonal') angle = 45;
            else if (watermarkStyle === 'declined') angle = -45;
            else if (watermarkStyle === 'vertical') angle = 90;
            else if (watermarkStyle === 'horizontal') angle = 0;
            else if (watermarkStyle === 'custom') angle = watermarkRotation;
            const textWidth = font.widthOfTextAtSize(text, size);
            const rad = angle * (Math.PI / 180);
            const x = centerX - (textWidth / 2) * Math.cos(rad);
            const y = centerY - (textWidth / 2) * Math.sin(rad);
            page.drawText(text, { x, y, size, font, color, opacity, rotate: PDFLib.degrees(angle) });
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
        const newRotation = (currentRotation + rotateAngle) % 360;
        page.setRotation(PDFLib.degrees(newRotation));
    }
    return new Blob([await pdfDoc.save()], { type: 'application/pdf' });
}

/**
 * AI WordPress Plugin Generator
 */
async function generateWPPlugin(prompt: string): Promise<Blob> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const JSZip = (window as any).JSZip;
    if (!JSZip) throw new Error("JSZip not available.");

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
            parts: [{
                text: `Generate the PHP source code for a WordPress plugin based on this description: "${prompt}". 
                Provide the response in JSON format with two fields: 'pluginName' (string, lowercase-kebab-case) and 'phpCode' (string). 
                The PHP code should include standard WordPress plugin headers (Plugin Name, Description, Version, Author, etc.).`
            }]
        }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    pluginName: { type: Type.STRING },
                    phpCode: { type: Type.STRING }
                },
                required: ["pluginName", "phpCode"]
            }
        }
    });

    const json = JSON.parse(response.text || '{}');
    if (!json.phpCode) throw new Error("Genie couldn't generate the code. Try a different description.");

    const zip = new JSZip();
    const folder = zip.folder(json.pluginName);
    folder.file(`${json.pluginName}.php`, json.phpCode);
    
    return await zip.generateAsync({ type: 'blob' });
}

const eyeIconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const eyeOffIconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

const getIcon = (type: string, color: string) => {
    const glyphs: Record<string, string> = {
        merge: `<path d="M40 20v-4h-4v4h4v4h4v-4h4v-4zM22 14h12v6h-6a4 4 0 01-4-4zm-4 32V16a4 4 0 014-4h14l10 10v22a4 4 0 01-4 4z"/>`,
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
        number: `<path d="M32 12v40M20 24h24m-24 16h24" stroke="#fff" stroke-width="3"/>`,
        wordpress: `<path d="M32 4c-15.4 0-28 12.6-28 28s12.6 28 28 28 28-12.6 28-28-12.6-28-28-28zm0 51.5c-4 0-7.8-1.1-11-3l8.6-24.8 5.7 15.6c-1 0.2-2.1 0.4-3.3 0.4z" />`
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
    { id: 'resize-image', title: 'Resize Image', cat: 'Images', icon: getIcon('image', COLORS.violet) },
    { id: 'image-to-gif', title: 'Image to GIF', cat: 'Images', icon: getIcon('image', COLORS.amber) },
    { id: 'jpg-to-png', title: 'JPG to PNG', cat: 'Images', icon: getIcon('image', COLORS.pink) },
    { id: 'png-to-jpg', title: 'PNG to JPG', cat: 'Images', icon: getIcon('image', COLORS.teal) },
    { id: 'convert-video', title: 'Convert Video', cat: 'Media', icon: getIcon('video', COLORS.indigo) },
    { id: 'video-to-gif', title: 'Video to GIF', cat: 'Media', icon: getIcon('video', COLORS.orange) },
    { id: 'translate-text', title: 'AI Translator', cat: 'AI Powered', icon: getIcon('translate', COLORS.violet) },
    { id: 'ocr-pdf', title: 'OCR PDF', cat: 'AI Powered', icon: getIcon('ocr', COLORS.green) },
    { id: 'wp-plugin-gen', title: 'AI Plugin Gen', cat: 'WordPress', icon: getIcon('wordpress', COLORS.wordpress) }
];

let currentTool: any = null;
let currentFiles: File[] = [];
let pagesManifest: { file: File, pageIndex: number, thumb: any }[] = [];
let protectPassword = "";
let confirmPassword = "";
let processedResultUrl = ""; 
let useOCR = false;
let wpPrompt = "";

let stampText = "APPROVED";
let stampShape = "horizontal";
let stampDate = new Date().toISOString().split('T')[0];
let stampIncludeDate = true;
let stampColor = COLORS.red;
let stampPosition = "bottom-right";

let watermarkText = "DRAFT";
let watermarkStyle = "diagonal";
let watermarkRotation = 45;
let watermarkOpacity = 30;
let watermarkSize = 60;
let watermarkColor = "#94a3b8";

let rotateAngle = 0;

let resizeMode = 'pixels'; 
let resizeWidth = 436;
let resizeHeight = 338;
let resizeMaintainRatio = true;
let resizeNoEnlarge = false;
let resizePercentage = 50; 
let originalImageRatio = 1;

let gifDelay = 500;
let gifLoop = true;

let targetVideoFormat = "mp4";

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
    let hasInput = currentFiles.length > 0;
    if (currentTool?.id === 'organize-pdf' || currentTool?.id === 'image-to-gif') hasInput = pagesManifest.length > 0;
    if (currentTool?.id === 'protect-pdf') hasInput = hasInput && (protectPassword !== "" && protectPassword === confirmPassword);
    if (currentTool?.id === 'stamp-pdf') hasInput = hasInput && stampText.trim().length > 0;
    if (currentTool?.id === 'watermark-pdf') hasInput = hasInput && watermarkText.trim().length > 0;
    if (currentTool?.id === 'wp-plugin-gen') hasInput = wpPrompt.trim().length > 10;
    
    btn.disabled = !hasInput;
    btn.style.opacity = btn.disabled ? "0.4" : "1";
}

function openWorkspace(tool: any) {
    currentTool = tool;
    currentFiles = [];
    pagesManifest = [];
    protectPassword = "";
    confirmPassword = "";
    processedResultUrl = "";
    useOCR = false;
    wpPrompt = "";
    stampText = "APPROVED"; stampShape = "horizontal"; stampColor = COLORS.red;
    watermarkText = "DRAFT"; watermarkStyle = "diagonal"; watermarkOpacity = 30;
    rotateAngle = 0; gifDelay = 500; targetVideoFormat = "mp4";

    (document.getElementById('workspace-name') as HTMLElement).textContent = `GENIE ${tool.title.toUpperCase()}`;
    resetWorkspaceUI();
    document.getElementById('tool-modal')!.classList.add('visible');
    
    if (tool.id === 'wp-plugin-gen') {
        document.getElementById('modal-initial-view')!.style.display = 'none';
        document.getElementById('modal-options-view')!.style.display = 'flex';
        updateSettingsUI();
    } else {
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        fileInput.multiple = ['merge-pdf', 'organize-pdf', 'image-to-gif'].includes(tool.id);
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
    if (currentTool.id === 'organize-pdf' || currentTool.id === 'image-to-gif') {
        if (!append) pagesManifest = [];
        document.getElementById('modal-initial-view')!.style.display = 'none';
        document.getElementById('modal-options-view')!.style.display = 'flex';
        await extractPages(arr);
        updateSettingsUI(); updateProcessButton();
        return;
    }
    if (currentTool.id === 'merge-pdf') currentFiles = append ? [...currentFiles, ...arr] : arr;
    else currentFiles = [arr[0]];
    if (['resize-image', 'jpg-to-png', 'png-to-jpg'].includes(currentTool.id) && currentFiles[0]) {
        const img = new Image();
        img.onload = () => {
            originalImageRatio = img.width / img.height;
            if (currentTool.id === 'resize-image') { resizeWidth = img.width; resizeHeight = img.height; }
            updateSettingsUI();
        };
        img.src = URL.createObjectURL(currentFiles[0]);
    }
    document.getElementById('modal-initial-view')!.style.display = 'none';
    document.getElementById('modal-options-view')!.style.display = 'flex';
    updateSettingsUI(); renderPreviews(); updateProcessButton();
}

async function extractPages(files: File[]) {
    if (currentTool.id === 'image-to-gif') {
        for (const file of files) {
            const thumb = await createImageThumb(file);
            pagesManifest.push({ file, pageIndex: 0, thumb });
        }
    } else {
        const pdfjs = await loadPdfJs();
        if (!pdfjs) return;
        for (const file of files) {
            try {
                const arr = await file.arrayBuffer();
                const pdf = await pdfjs.getDocument({ data: new Uint8Array(arr) }).promise;
                for (let i = 1; i <= pdf.numPages; i++) {
                    const thumb = await createThumb(file, i, pdfjs); 
                    pagesManifest.push({ file, pageIndex: i, thumb });
                }
            } catch (e) { console.error(e); }
        }
    }
    renderOrganizeGrid();
}

function renderOrganizeGrid() {
    const pane = document.getElementById('preview-pane')!;
    pane.innerHTML = ''; pane.className = 'file-grid';
    pagesManifest.forEach((item, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'page-thumb'; wrapper.draggable = true;
        wrapper.ondragstart = (e) => { e.dataTransfer!.setData('text/plain', index.toString()); wrapper.style.opacity = '0.4'; };
        wrapper.ondragend = () => wrapper.style.opacity = '1';
        wrapper.ondragover = (e) => e.preventDefault(); 
        wrapper.ondrop = (e) => {
            e.preventDefault();
            const from = parseInt(e.dataTransfer!.getData('text/plain'));
            const moved = pagesManifest.splice(from, 1)[0];
            pagesManifest.splice(index, 0, moved);
            renderOrganizeGrid();
        };
        const remove = document.createElement('button'); remove.className = 'remove-file-btn'; remove.innerHTML = '&times;';
        remove.onclick = () => { pagesManifest.splice(index, 1); renderOrganizeGrid(); updateProcessButton(); };
        wrapper.appendChild(remove); wrapper.appendChild(item.thumb.cloneNode(true));
        const lbl = document.createElement('div'); lbl.textContent = `${index + 1}`; lbl.style.fontSize = '0.9rem'; lbl.style.fontWeight = '800'; lbl.style.marginTop = 'auto';
        wrapper.appendChild(lbl); pane.appendChild(wrapper);
    });
}

(window as any).togglePassVisibility = (inputId: string, btn: HTMLElement) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.innerHTML = input.type === 'password' ? eyeIconSvg : eyeOffIconSvg;
};
(window as any).updateProtectPassword = (val: string) => { protectPassword = val; updateProcessButton(); };
(window as any).updateConfirmPassword = (val: string) => { confirmPassword = val; updateProcessButton(); };
(window as any).suggestStrongPassword = () => {
    const pass = Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-2) + "!";
    (document.getElementById('protect-pass') as HTMLInputElement).value = pass;
    (document.getElementById('protect-confirm') as HTMLInputElement).value = pass;
    protectPassword = confirmPassword = pass; updateProcessButton();
};
(window as any).toggleOCR = (val: boolean) => useOCR = val;
(window as any).updateStampText = (val: string) => { stampText = val; updateProcessButton(); };
(window as any).toggleStampDate = (val: boolean) => { stampIncludeDate = val; document.getElementById('stamp-date-input')!.style.display = val ? 'block' : 'none'; };
(window as any).updateStampShape = (val: string) => stampShape = val;
(window as any).updateStampColor = (val: string) => { stampColor = val; updateSettingsUI(); };
(window as any).updateStampPosition = (val: string) => { stampPosition = val; updateSettingsUI(); };
(window as any).updateWatermarkText = (val: string) => { watermarkText = val; updateProcessButton(); };
(window as any).updateWatermarkStyle = (val: string) => { watermarkStyle = val; updateSettingsUI(); };
(window as any).updateWatermarkOpacity = (val: string) => { watermarkOpacity = parseInt(val); (document.getElementById('opacity-val') as HTMLElement).textContent = val + '%'; };
(window as any).updateWatermarkSize = (val: string) => watermarkSize = parseInt(val);
(window as any).updateWatermarkColor = (val: string) => { watermarkColor = val; updateSettingsUI(); };
(window as any).adjustRotation = (deg: number) => { rotateAngle = (rotateAngle + deg) % 360; (document.getElementById('rot-label') as HTMLElement).textContent = `${rotateAngle}°`; renderPreviews(); };
(window as any).setResizeMode = (mode: string) => { resizeMode = mode; updateSettingsUI(); };
(window as any).updateResizeW = (val: string) => { resizeWidth = parseInt(val); if(resizeMaintainRatio) resizeHeight = Math.round(resizeWidth/originalImageRatio); updateSettingsUI(); };
(window as any).updateResizeH = (val: string) => { resizeHeight = parseInt(val); if(resizeMaintainRatio) resizeWidth = Math.round(resizeHeight*originalImageRatio); updateSettingsUI(); };
(window as any).updateGifDelay = (val: string) => { gifDelay = parseInt(val); (document.getElementById('gif-delay-label') as HTMLElement).textContent = `${val} ms`; };
(window as any).updateTargetVideoFormat = (val: string) => targetVideoFormat = val;
(window as any).updateWPPluginPrompt = (val: string) => { wpPrompt = val; updateProcessButton(); };

function updateSettingsUI() {
    const settings = document.getElementById('tool-settings')!; settings.innerHTML = '';
    if (currentTool.id === 'protect-pdf') {
        settings.innerHTML = `<div style="display:flex; flex-direction:column; gap:0.5rem;"><label style="font-size:0.8rem; font-weight:700;">Password</label><input type="password" id="protect-pass" oninput="window.updateProtectPassword(this.value)" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid #ddd;"></div><div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:1rem;"><label style="font-size:0.8rem; font-weight:700;">Confirm</label><input type="password" id="protect-confirm" oninput="window.updateConfirmPassword(this.value)" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid #ddd;"></div><button onclick="window.suggestStrongPassword()" style="margin-top:1rem; padding:0.6rem; border-radius:6px; border:1px solid var(--primary-blue); background:none; color:var(--primary-blue); cursor:pointer;">Suggest Password</button>`;
    } else if (currentTool.id === 'stamp-pdf') {
        settings.innerHTML = `<label style="font-size:0.8rem; font-weight:700;">Text</label><input type="text" value="${stampText}" oninput="window.updateStampText(this.value)" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid #ddd;"><div style="margin-top:1rem;"><label style="font-size:0.8rem; font-weight:700;">Include Date</label><input type="checkbox" ${stampIncludeDate?'checked':''} onchange="window.toggleStampDate(this.checked)"></div><input id="stamp-date-input" type="date" value="${stampDate}" onchange="window.updateStampDate(this.value)" style="display:${stampIncludeDate?'block':'none'}; width:100%; padding:0.8rem; border-radius:8px; border:1px solid #ddd; margin-top:0.5rem;"><select onchange="window.updateStampShape(this.value)" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid #ddd; margin-top:1rem;"><option value="horizontal">Horizontal</option><option value="round">Round</option></select>`;
    } else if (currentTool.id === 'resize-image') {
        settings.innerHTML = `<div style="display:flex; gap:0.5rem;"><button onclick="window.setResizeMode('pixels')" style="flex:1; padding:0.6rem; border-radius:6px; border:none; background:${resizeMode==='pixels'?'#eee':'#fff'}; cursor:pointer;">Pixels</button><button onclick="window.setResizeMode('percentage')" style="flex:1; padding:0.6rem; border-radius:6px; border:none; background:${resizeMode==='percentage'?'#eee':'#fff'}; cursor:pointer;">Percentage</button></div>${resizeMode==='pixels'?`<div style="margin-top:1rem;"><label style="font-size:0.8rem; font-weight:700;">Width</label><input type="number" id="resize-w" value="${resizeWidth}" oninput="window.updateResizeW(this.value)" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid #ddd;"><label style="font-size:0.8rem; font-weight:700; margin-top:0.5rem;">Height</label><input type="number" id="resize-h" value="${resizeHeight}" oninput="window.updateResizeH(this.value)" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid #ddd;"></div>`:`<select onchange="window.setResizePct(this.value)" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid #ddd; margin-top:1rem;"><option value="25">25% Smaller</option><option value="50">50% Smaller</option><option value="75">75% Smaller</option></select>`}`;
    } else if (currentTool.id === 'convert-video') {
        settings.innerHTML = `<label style="font-size:0.8rem; font-weight:700;">Format</label><select onchange="window.updateTargetVideoFormat(this.value)" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid #ddd; margin-top:0.5rem;"><option value="mp4">MP4</option><option value="avi">AVI</option><option value="mov">MOV</option></select>`;
    } else if (currentTool.id === 'pdf-to-excel') {
        settings.innerHTML = `<div style="display:flex; align-items:center; gap:0.5rem;"><input type="checkbox" onchange="window.toggleOCR(this.checked)" id="ocr-check"><label for="ocr-check" style="font-size:0.8rem; font-weight:700;">Scanned Document (AI OCR)</label></div>`;
    } else if (currentTool.id === 'wp-plugin-gen') {
        settings.innerHTML = `<label style="font-size:0.8rem; font-weight:700;">Plugin Description</label><textarea placeholder="e.g. A plugin that adds a hit counter to posts and displays it in the footer" oninput="window.updateWPPluginPrompt(this.value)" style="width:100%; height:200px; padding:0.8rem; border-radius:8px; border:1px solid #ddd; margin-top:0.5rem; font-family:inherit;"></textarea><p style="font-size:0.7rem; color:#666; margin-top:0.5rem;">Be specific for better results. Genie will generate the code and zip it for you.</p>`;
    }
}

async function renderPreviews() {
    const pane = document.getElementById('preview-pane')!; pane.innerHTML = '';
    const pdfjs = await loadPdfJs(); if (currentFiles.length === 0 && currentTool.id !== 'wp-plugin-gen') return;
    
    if (currentTool.id === 'wp-plugin-gen') {
        pane.innerHTML = `<div style="text-align:center; padding:3rem; color:var(--text-muted);"><h3>AI Plugin Forge</h3><p>Your custom WordPress plugin will appear here after processing.</p></div>`;
        return;
    }

    pane.className = 'file-grid';
    for (let i = 0; i < currentFiles.length; i++) {
        const file = currentFiles[i];
        let thumb;
        if (file.type === 'application/pdf' && pdfjs) thumb = await createThumb(file, 1, pdfjs);
        else if (file.type.startsWith('video/')) thumb = await createVideoThumb(file);
        else if (file.type.startsWith('image/')) thumb = await createImageThumb(file);
        else { thumb = document.createElement('div'); (thumb as HTMLElement).className = 'file-placeholder'; (thumb as HTMLElement).textContent = 'FILE'; }
        pane.appendChild(wrapThumb(thumb as HTMLElement, file.name, () => { currentFiles.splice(i, 1); renderPreviews(); updateProcessButton(); }));
    }
}

async function createThumb(file: File, pageNum: number, pdfjs: any) {
    try {
        const arr = await file.arrayBuffer(); const pdf = await pdfjs.getDocument({ data: new Uint8Array(arr) }).promise;
        const page = await pdf.getPage(pageNum); let rot = currentTool.id === 'rotate-pdf' ? rotateAngle : 0;
        const viewport = page.getViewport({ scale: 0.3, rotation: page.rotate + rot });
        const canvas = document.createElement('canvas'); canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise; return canvas;
    } catch { const div = document.createElement('div'); div.className = 'file-placeholder'; div.textContent = 'PDF'; return div; }
}

async function createVideoThumb(file: File) {
    const video = document.createElement('video'); video.src = URL.createObjectURL(file);
    video.muted = true; video.currentTime = 1; await new Promise((res) => { video.onloadeddata = res; video.onerror = res; });
    const canvas = document.createElement('canvas'); canvas.width = 200; canvas.height = 120;
    const ctx = canvas.getContext('2d'); if(ctx) { ctx.fillStyle = '#000'; ctx.fillRect(0,0,200,120); ctx.drawImage(video, 0, 0, 200, 120); }
    return canvas;
}

async function createImageThumb(file: File) {
    const img = document.createElement('img'); img.src = URL.createObjectURL(file);
    img.style.maxWidth = '100%'; img.style.maxHeight = '200px'; return img;
}

function wrapThumb(el: HTMLElement, labelText: string, onDelete: () => void) {
    const wrap = document.createElement('div'); wrap.className = 'page-thumb';
    const del = document.createElement('button'); del.className = 'remove-file-btn'; del.innerHTML = '&times;'; del.onclick = onDelete;
    wrap.appendChild(del); wrap.appendChild(el);
    const lbl = document.createElement('div'); lbl.textContent = labelText; lbl.style.fontSize = '0.7rem'; wrap.appendChild(lbl);
    return wrap;
}

async function startProcess() {
    document.getElementById('modal-options-view')!.style.display = 'none';
    (document.querySelector('.workspace-sidebar') as HTMLElement).style.display = 'none';
    document.getElementById('modal-processing-view')!.style.display = 'flex';
    let progress = 0; const bar = document.getElementById('progress-bar')!; const pct = document.getElementById('progress-pct')!;
    const iv = setInterval(() => { if(progress < 90) { progress += 5; bar.style.width = progress + '%'; pct.textContent = progress + '%'; } }, 200);
    try { 
        await finishProcess(); 
        clearInterval(iv); 
        bar.style.width = '100%'; 
        pct.textContent = '100%'; 
    } catch(e) { 
        console.error(e); 
        clearInterval(iv);
        showErrorUI(e.message || "An error occurred during conversion.");
    }
}

function showErrorUI(msg: string) {
    document.getElementById('modal-processing-view')!.style.display = 'none';
    const completeView = document.getElementById('modal-complete-view')!;
    completeView.style.display = 'flex';
    const icon = completeView.querySelector('div') as HTMLElement;
    const h2 = completeView.querySelector('h2') as HTMLElement;
    const footerSpan = completeView.querySelector('.success-footer span') as HTMLElement;
    
    icon.style.background = '#ef4444'; icon.innerHTML = '!';
    h2.textContent = "Error"; h2.style.color = '#ef4444';
    footerSpan.textContent = msg; footerSpan.style.color = '#ef4444';
    document.getElementById('download-area')!.innerHTML = '';
}

async function finishProcess() {
    let result: Blob | null = null;
    let ext = 'pdf';
    try {
        await loadConversionLibs(); const PDFLib = await loadPdfLib();
        if (currentTool.id === 'merge-pdf') {
            const merged = await PDFLib.PDFDocument.create();
            for (const f of currentFiles) { const donor = await PDFLib.PDFDocument.load(await f.arrayBuffer()); const pages = await merged.copyPages(donor, donor.getPageIndices()); pages.forEach((p: any) => merged.addPage(p)); }
            result = new Blob([await merged.save()], { type: 'application/pdf' });
        } else if (currentTool.id === 'pdf-to-excel') { result = await pdfToExcel(currentFiles[0]); ext = 'xlsx'; }
        else if (currentTool.id === 'pdf-to-jpg') { result = await pdfToJpg(currentFiles[0]); ext = 'jpg'; }
        else if (currentTool.id === 'jpg-to-pdf') { result = await jpgToPdf(currentFiles[0]); }
        else if (currentTool.id === 'stamp-pdf') { result = await stampPdf(currentFiles[0]); }
        else if (currentTool.id === 'watermark-pdf') { result = await watermarkPdf(currentFiles[0]); }
        else if (currentTool.id === 'rotate-pdf') { result = await rotatePdf(currentFiles[0]); }
        else if (currentTool.id === 'resize-image') { result = await resizeImage(currentFiles[0]); ext = 'jpg'; }
        else if (currentTool.id === 'convert-video') { result = await convertVideo(currentFiles[0]); ext = targetVideoFormat; }
        else if (currentTool.id === 'video-to-gif') { result = await videoToGif(currentFiles[0]); ext = 'gif'; }
        else if (currentTool.id === 'wp-plugin-gen') { result = await generateWPPlugin(wpPrompt); ext = 'zip'; }
        
        if (result && result.size > 0) {
            processedResultUrl = URL.createObjectURL(result);
            document.getElementById('download-area')!.innerHTML = `<a href="${processedResultUrl}" download="Genie_Result.${ext}" class="btn-genie" style="width:auto; padding:1.2rem 5rem;">Download Result</a>`;
            
            // Show normal success UI
            document.getElementById('modal-processing-view')!.style.display = 'none';
            const completeView = document.getElementById('modal-complete-view')!;
            completeView.style.display = 'flex';
            const icon = completeView.querySelector('div') as HTMLElement;
            const h2 = completeView.querySelector('h2') as HTMLElement;
            const footerSpan = completeView.querySelector('.success-footer span') as HTMLElement;
            icon.style.background = '#22c55e'; icon.innerHTML = '✓';
            h2.textContent = "Success!"; h2.style.color = 'var(--text-main)';
            footerSpan.textContent = "Genie has finished processing your file securely in your browser.";
            footerSpan.style.color = 'var(--text-muted)';
        } else {
            throw new Error("Conversion resulted in an empty file. This usually happens if the video codec is unsupported.");
        }
    } catch (e: any) { 
        throw e; 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    document.getElementById('theme-btn')!.onclick = () => {
        const cur = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
    };
    document.getElementById('select-file-btn')!.onclick = () => (document.getElementById('file-input') as HTMLInputElement).click();
    (document.getElementById('file-input') as HTMLInputElement).onchange = (e) => handleFiles((e.target as HTMLInputElement).files);
    document.getElementById('process-btn')!.onclick = startProcess;
    document.getElementById('btn-restart')!.onclick = resetWorkspaceUI;
    (document.querySelector('.close-modal') as HTMLElement).onclick = () => document.getElementById('tool-modal')!.classList.remove('visible');
});
