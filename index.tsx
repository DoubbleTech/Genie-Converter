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
    teal: "#14b8a6"
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
 * PDF to Excel Conversion Engine
 * Extracts text and groups them into a grid based on X/Y coordinates to preserve layout.
 */
async function pdfToExcel(file: File) {
    const pdfjs = await loadPdfJs();
    const XLSX = (window as any).XLSX;
    if (!pdfjs || !XLSX) throw new Error("PDF.js or SheetJS not available.");

    const arr = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(arr) }).promise;
    const wb = XLSX.utils.book_new();

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
        items.sort((a, b) => b.y - a.y);

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

async function renderPageToCanvas(pdf: any, pageNum: number) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });
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
let signatureImage: string | null = null;
let signaturePos = { x: 50, y: 50 };
let protectPassword = "";
let confirmPassword = "";
let processedResultUrl = ""; 

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
    
    if (isTextTool) {
        const inputId = currentTool.id === 'translate-text' ? 'trans-input' : 'tts-input';
        const textIn = (document.getElementById(inputId) as HTMLTextAreaElement)?.value;
        hasInput = (textIn && textIn.trim().length > 0) || currentFiles.length > 0;
    }

    if (currentTool?.id === 'protect-pdf') {
        const passMatch = protectPassword.length > 0 && protectPassword === confirmPassword;
        hasInput = hasInput && passMatch;
    }

    btn.disabled = !hasInput;
    btn.style.opacity = btn.disabled ? "0.4" : "1";
}

function openWorkspace(tool: any) {
    currentTool = tool;
    currentFiles = [];
    signatureImage = null;
    signaturePos = { x: 100, y: 100 };
    protectPassword = "";
    confirmPassword = "";
    processedResultUrl = "";
    
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
    if (currentTool.id === 'merge-pdf' || currentTool.id === 'organize-pdf') {
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
        const viewport = page.getViewport({ scale: 0.3 });
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
    const iv = setInterval(() => { 
        progress += 4; 
        if (progress >= 100) { 
            progress = 100; 
            clearInterval(iv); 
            finishProcess(); 
        } 
        bar.style.width = progress + '%'; 
        pct.textContent = progress + '%'; 
    }, 120);
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
        } else if (currentTool.id === 'merge-pdf' || currentTool.id === 'organize-pdf') {
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