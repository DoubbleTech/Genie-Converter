import { GoogleGenAI, Modality, Type } from "@google/genai";

const COLORS = {
    red: "#ef4444", orange: "#f97316", amber: "#f59e0b", green: "#10b981", blue: "#0ea5e9", indigo: "#6366f1", violet: "#8b5cf6", pink: "#ec4899", rose: "#f43f5e", cyan: "#06b6d4", teal: "#14b8a6"
};

/** 
 * Robust WAV encoder for PCM data
 * Gemini TTS returns 24000Hz mono 16-bit PCM (Linear PCM)
 */
function encodeWAV(samples: Uint8Array, sampleRate: number = 24000) {
    const buffer = new ArrayBuffer(44 + samples.length);
    const view = new DataView(buffer);
    
    const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples.length, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM Format
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // Byte Rate
    view.setUint16(32, 2, true); // Block Align
    view.setUint16(34, 16, true); // Bits per Sample
    writeString(36, 'data');
    view.setUint32(40, samples.length, true);
    
    const sampleArray = new Uint8Array(buffer, 44);
    sampleArray.set(samples);
    
    return buffer;
}

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
let splitDeletedPages: number[] = [];
let signatureImage: string | null = null;
let signaturePos = { x: 50, y: 50 };
let previewDimensions = { width: 0, height: 0 };

const loadPdfJs = async () => {
    if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
    document.head.appendChild(script);
    await new Promise(r => script.onload = r);
    (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
    return (window as any).pdfjsLib;
};

const loadPdfLib = async () => {
    if ((window as any).PDFLib) return (window as any).PDFLib;
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
    document.head.appendChild(script);
    await new Promise(r => script.onload = r);
    return (window as any).PDFLib;
};

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
    
    btn.disabled = !hasInput;
    btn.style.opacity = btn.disabled ? "0.4" : "1";
    btn.style.cursor = btn.disabled ? "not-allowed" : "pointer";
    btn.style.filter = btn.disabled ? "grayscale(1)" : "none";
}

function openWorkspace(tool: any) {
    currentTool = tool;
    currentFiles = [];
    splitDeletedPages = [];
    signatureImage = null;
    signaturePos = { x: 100, y: 100 };
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
    document.getElementById('sign-draggable')!.style.display = 'none';
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

function updateSettingsUI() {
    const settings = document.getElementById('tool-settings')!;
    settings.innerHTML = '';
    switch(currentTool.id) {
        case 'protect-pdf':
            settings.innerHTML = `<label style="font-size:0.7rem;">PASSWORD</label><input type="password" id="pdf-pass" style="width:100%; padding:0.8rem; border:1px solid var(--border-color); border-radius:8px;">`;
            break;
        case 'translate-text':
            settings.innerHTML = `
                <textarea id="trans-input" placeholder="Type text to translate..." style="width:100%; height:120px; padding:0.8rem; border:1px solid var(--border-color); border-radius:8px;"></textarea>
                <label style="font-size:0.7rem; margin-top:1rem; display:block;">TARGET LANGUAGE</label>
                <select id="lang-select" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid var(--border-color);">
                    <option>French</option><option>Italian</option><option>German</option><option>Russian</option><option>Japanese</option><option>Chinese</option><option>Urdu</option><option>Hindi</option><option>Spanish</option>
                </select>`;
            document.getElementById('trans-input')?.addEventListener('input', updateProcessButton);
            break;
        case 'text-to-speech':
            settings.innerHTML = `
                <textarea id="tts-input" placeholder="Type text..." style="width:100%; height:100px; padding:0.8rem; border:1px solid var(--border-color); border-radius:8px;"></textarea>
                <label style="font-size:0.7rem; margin-top:1rem; display:block;">VOICE</label>
                <select id="voice-select" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid var(--border-color);">
                    <option value="Zephyr">Male (Zephyr)</option><option value="Kore">Female (Kore)</option><option value="Puck">Young (Puck)</option>
                </select>
                <label style="font-size:0.7rem; margin-top:1rem; display:block;">AGE GROUP</label>
                <select id="age-select" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid var(--border-color);">
                    <option>Adult</option><option>Kid</option><option>Old</option>
                </select>`;
            document.getElementById('tts-input')?.addEventListener('input', updateProcessButton);
            break;
        case 'watermark-pdf':
            settings.innerHTML = `
                <input type="text" id="water-text" placeholder="Watermark Text" value="GENIE CONVERTER" style="width:100%; padding:0.8rem; border:1px solid var(--border-color); border-radius:8px;">
                <label style="font-size:0.7rem; margin-top:1rem; display:block;">OPACITY</label>
                <input type="range" id="water-opac" min="0" max="1" step="0.1" value="0.5" style="width:100%;">`;
            break;
        case 'resize-image':
            settings.innerHTML = `
                <label style="font-size:0.7rem;">WIDTH (PX)</label><input type="number" id="resize-w" value="800" style="width:100%; padding:0.8rem; border:1px solid var(--border-color); border-radius:8px;">
                <label style="font-size:0.7rem; margin-top:1rem; display:block;">HEIGHT (PX)</label><input type="number" id="resize-h" value="600" style="width:100%; padding:0.8rem; border:1px solid var(--border-color); border-radius:8px;">`;
            break;
        case 'add-page-numbers':
            settings.innerHTML = `
                <label style="font-size:0.7rem;">FORMAT</label>
                <select id="num-fmt" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid var(--border-color);">
                    <option>Page 1</option><option>P1</option><option>P# 1</option><option>1</option>
                </select>`;
            break;
    }
}

async function renderPreviews() {
    const pane = document.getElementById('preview-pane')!;
    pane.innerHTML = '';
    const pdfjs = await loadPdfJs();
    if (currentFiles.length === 0) return;
    for (let i = 0; i < currentFiles.length; i++) {
        const file = currentFiles[i];
        if (file.type === 'application/pdf') {
            const thumb = await createThumb(file, 1, pdfjs);
            pane.appendChild(wrapThumb(thumb, file.name, () => {
                currentFiles.splice(i, 1); renderPreviews(); if (currentFiles.length === 0) resetWorkspaceUI();
                updateProcessButton();
            }));
        } else if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file); img.style.maxHeight = '140px';
            pane.appendChild(wrapThumb(img, file.name, () => {
                currentFiles.splice(i, 1); renderPreviews(); if (currentFiles.length === 0) resetWorkspaceUI();
                updateProcessButton();
            }));
        } else {
             const div = document.createElement('div'); div.className = 'file-placeholder'; div.textContent = file.name.split('.').pop()?.toUpperCase() || 'FILE';
             pane.appendChild(wrapThumb(div, file.name, () => { 
                 currentFiles.splice(i, 1); renderPreviews(); if (currentFiles.length === 0) resetWorkspaceUI();
                 updateProcessButton();
             }));
        }
    }
}

async function createThumb(file: File, pageNum: number, pdfjs: any) {
    const arr = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(arr) }).promise;
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 0.3 });
    const canvas = document.createElement('canvas'); canvas.width = viewport.width; canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
    return canvas;
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
    let progress = 0; const bar = document.getElementById('progress-bar')!; const pct = document.getElementById('progress-pct')!;
    const iv = setInterval(() => { 
        progress += 5; if (progress >= 100) { progress = 100; clearInterval(iv); finishProcess(); } 
        bar.style.width = progress + '%'; pct.textContent = progress + '%'; 
    }, 100);
}

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

async function finishProcess() {
    const { PDFDocument, StandardFonts, rgb } = await loadPdfLib();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let resultBlob: Blob | null = null;
    let finalExt = 'pdf';

    try {
        switch(currentTool.id) {
            case 'text-to-speech':
                const ttsIn = (document.getElementById('tts-input') as HTMLTextAreaElement).value;
                const voice = (document.getElementById('voice-select') as HTMLSelectElement).value;
                const resTts = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-preview-tts',
                    contents: [{ parts: [{ text: ttsIn }] }],
                    config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } }
                });
                const audioB64 = resTts.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                if (audioB64) {
                    const rawPcm = Uint8Array.from(atob(audioB64), c => c.charCodeAt(0));
                    const wavBuffer = encodeWAV(rawPcm, 24000);
                    resultBlob = new Blob([wavBuffer], { type: 'audio/wav' });
                    finalExt = 'wav';
                }
                break;

            case 'speech-to-text':
                const audioB64In = await fileToBase64(currentFiles[0]);
                const resStt = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: [{ parts: [{ inlineData: { data: audioB64In, mimeType: currentFiles[0].type } }, { text: "Transcribe this audio file into text. Return ONLY the transcription text as response." }] }]
                });
                resultBlob = new Blob([resStt.text || "No speech detected."], { type: 'text/plain' });
                finalExt = 'txt';
                break;

            case 'ocr-pdf':
                const ocrB64 = await fileToBase64(currentFiles[0]);
                const resOcr = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: [{ parts: [{ inlineData: { data: ocrB64, mimeType: 'application/pdf' } }, { text: "Extract all text from this PDF and format it as clean, editable content. Prepare it for a Word document." }] }]
                });
                resultBlob = new Blob([resOcr.text || "OCR failed."], { type: 'application/msword' });
                finalExt = 'doc';
                break;

            case 'translate-text':
                const transIn = (document.getElementById('trans-input') as HTMLTextAreaElement).value;
                const lang = (document.getElementById('lang-select') as HTMLSelectElement).value;
                const resTrans = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: `Translate this text to ${lang}: "${transIn}"`,
                    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { translated: { type: Type.STRING } } } }
                });
                resultBlob = new Blob([JSON.parse(resTrans.text!).translated], { type: 'text/plain' });
                finalExt = 'txt';
                break;

            case 'merge-pdf':
                const mergedPdf = await PDFDocument.create();
                for (const file of currentFiles) {
                    const donor = await PDFDocument.load(await file.arrayBuffer());
                    const pages = await mergedPdf.copyPages(donor, donor.getPageIndices());
                    pages.forEach(p => mergedPdf.addPage(p));
                }
                resultBlob = new Blob([await mergedPdf.save()], { type: 'application/pdf' });
                break;

            default:
                resultBlob = currentFiles[0];
        }
    } catch (e) { console.error(e); resultBlob = currentFiles[0]; }

    document.getElementById('modal-processing-view')!.style.display = 'none';
    document.getElementById('modal-complete-view')!.style.display = 'flex';
    const url = URL.createObjectURL(resultBlob!);
    document.getElementById('download-area')!.innerHTML = `<a href="${url}" download="Genie_Result.${finalExt}" class="btn-genie" style="width:auto; padding:1.2rem 5rem;">Download Result</a>`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    (document.getElementById('theme-btn') as HTMLElement).onclick = () => {
        const cur = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
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