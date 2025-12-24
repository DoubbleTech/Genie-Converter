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

/** Load external libraries dynamically */
const loadScript = (id: string, src: string) => {
    if (document.getElementById(id)) return Promise.resolve();
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.onload = resolve;
        document.head.appendChild(script);
    });
};

const loadPdfJs = async () => {
    await loadScript('pdf-js', 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js');
    (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
    return (window as any).pdfjsLib;
};

const loadPdfLib = async () => {
    await loadScript('pdf-lib', 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js');
    return (window as any).PDFLib;
};

const loadConversionLibs = async () => {
    await Promise.all([
        loadScript('mammoth-js', 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js'),
        loadScript('html2canvas-js', 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
        loadScript('jspdf-js', 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
    ]);
};

/** Robust WAV encoder for PCM data */
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
    view.setUint16(20, 1, true); 
    view.setUint16(22, 1, true); 
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples.length, true);
    new Uint8Array(buffer, 44).set(samples);
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
let signatureImage: string | null = null;
let signaturePos = { x: 50, y: 50 };
let previewDimensions = { width: 0, height: 0 };
let signAllPages: boolean = false;
let splitMode: 'custom' | 'fixed' = 'custom';
let splitRanges: { from: number, to: number }[] = [{ from: 1, to: 1 }];
let compressionLevel: 'extreme' | 'recommended' | 'less' = 'recommended';
let pageNumMode: 'single' | 'facing' = 'single';
let pageNumPos: number = 8;
let pageNumMargin: 'recommended' | 'small' | 'big' = 'recommended';
let pageNumFirst: number = 1;
let pageNumTemplate: string = '{n}';
let pageNumStyle = { font: 'Arial', size: 11, bold: false, italic: false, underline: false, color: '#000000' };

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
}

function openWorkspace(tool: any) {
    currentTool = tool;
    currentFiles = [];
    signatureImage = null;
    signaturePos = { x: 100, y: 100 };
    signAllPages = false;
    splitMode = 'custom';
    splitRanges = [{ from: 1, to: 1 }];
    compressionLevel = 'recommended';
    
    pageNumMode = 'single';
    pageNumPos = 8;
    pageNumMargin = 'recommended';
    pageNumFirst = 1;
    pageNumTemplate = '{n}';
    pageNumStyle = { font: 'Arial', size: 11, bold: false, italic: false, underline: false, color: '#000000' };

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

(window as any).setSignMode = (mode: string) => {
    ['draw', 'type', 'upload'].forEach(m => document.getElementById(`sign-${m}-area`)!.style.display = (m === mode ? 'block' : 'none'));
    if (mode === 'draw') setTimeout(initSignCanvas, 10);
};

(window as any).applySignature = async () => {
    const type = ['draw', 'type', 'upload'].find(m => document.getElementById(`sign-${m}-area`)!.style.display !== 'none');
    if (type === 'draw') {
        const canvas = document.getElementById('sign-canvas') as HTMLCanvasElement;
        signatureImage = canvas.toDataURL();
    } else if (type === 'type') {
        const text = (document.getElementById('sign-text-input') as HTMLInputElement).value || 'Sign';
        const c = document.createElement('canvas'); c.width = 400; c.height = 120;
        const ctx = c.getContext('2d')!; 
        ctx.fillStyle = 'black'; ctx.font = 'italic 50px cursive, serif'; 
        ctx.fillText(text, 20, 75);
        signatureImage = c.toDataURL();
    } else {
        const file = (document.getElementById('sign-file-input') as HTMLInputElement).files?.[0];
        if (file) signatureImage = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result as string); fr.readAsDataURL(file); });
    }
    if (signatureImage) {
        const drag = document.getElementById('sign-draggable')!;
        drag.style.display = 'block';
        (document.getElementById('sign-draggable-img') as HTMLImageElement).src = signatureImage;
        drag.style.width = '200px'; drag.style.height = '70px';
        drag.style.left = '50px'; drag.style.top = '50px';
        signaturePos = { x: 50, y: 50 };
    }
};

(window as any).toggleSignAll = (el: HTMLInputElement) => {
    signAllPages = el.checked;
};

(window as any).setSplitMode = (mode: 'custom' | 'fixed') => {
    splitMode = mode;
    updateSettingsUI();
};

(window as any).addSplitRange = () => {
    splitRanges.push({ from: 1, to: 1 });
    updateSettingsUI();
};

(window as any).updateSplitRange = (index: number, key: 'from' | 'to', value: string) => {
    splitRanges[index][key] = parseInt(value) || 1;
};

(window as any).removeSplitRange = (index: number) => {
    if (splitRanges.length > 1) {
        splitRanges.splice(index, 1);
        updateSettingsUI();
    }
};

(window as any).setCompressionLevel = (level: 'extreme' | 'recommended' | 'less') => {
    compressionLevel = level;
    updateSettingsUI();
};

(window as any).setPageNumMode = (mode: 'single' | 'facing') => {
    pageNumMode = mode;
    updateSettingsUI();
};
(window as any).setPageNumPos = (pos: number) => {
    pageNumPos = pos;
    updateSettingsUI();
};
(window as any).setPageNumMargin = (margin: any) => {
    pageNumMargin = margin;
    updateSettingsUI();
};
(window as any).setPageNumFirst = (num: any) => {
    pageNumFirst = parseInt(num) || 1;
    updateSettingsUI();
};
(window as any).setPageNumTemplate = (tmpl: string) => {
    pageNumTemplate = tmpl === 'recommended' ? '{n}' : tmpl;
    updateSettingsUI();
};
(window as any).togglePageNumStyle = (key: 'bold' | 'italic' | 'underline') => {
    (pageNumStyle as any)[key] = !(pageNumStyle as any)[key];
    updateSettingsUI();
};

function initSignCanvas() {
    const canvas = document.getElementById('sign-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.parentElement!.clientWidth; canvas.height = canvas.parentElement!.clientHeight;
    ctx.strokeStyle = 'black'; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    let drawing = false;
    const getPos = (e: any) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };
    const start = (e: any) => { drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
    const move = (e: any) => { if (drawing) { const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); } };
    canvas.onmousedown = start; canvas.onmousemove = move;
    canvas.ontouchstart = (e) => { e.preventDefault(); start(e); };
    canvas.ontouchmove = (e) => { e.preventDefault(); move(e); };
    window.addEventListener('mouseup', () => drawing = false);
    window.addEventListener('touchend', () => drawing = false);
}

const dragEl = document.getElementById('sign-draggable')!;
dragEl.onmousedown = (e) => {
    e.preventDefault();
    const rect = dragEl.getBoundingClientRect();
    const shiftX = e.clientX - rect.left;
    const shiftY = e.clientY - rect.top;
    const onMove = (me: MouseEvent) => {
        const container = document.getElementById('preview-container-wrapper')!;
        const cRect = container.getBoundingClientRect();
        let newX = me.clientX - cRect.left - shiftX;
        let newY = me.clientY - cRect.top - shiftY;
        newX = Math.max(0, Math.min(newX, cRect.width - dragEl.offsetWidth));
        newY = Math.max(0, Math.min(newY, cRect.height - dragEl.offsetHeight));
        dragEl.style.left = newX + 'px'; dragEl.style.top = newY + 'px';
        signaturePos = { x: newX, y: newY };
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', () => document.removeEventListener('mousemove', onMove), { once: true });
};

function updateSettingsUI() {
    const settings = document.getElementById('tool-settings')!;
    settings.innerHTML = '';
    
    if (currentTool.id === 'sign-pdf') {
        settings.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:1.2rem;">
                <div style="display:flex; gap:0.5rem; background:#f1f5f9; padding:4px; border-radius:10px;">
                    <button class="btn-genie" onclick="window.setSignMode('draw')" style="font-size:0.7rem; padding:0.6rem; background:white; color:black; box-shadow:none;">Draw</button>
                    <button class="btn-genie" onclick="window.setSignMode('type')" style="font-size:0.7rem; padding:0.6rem; background:white; color:black; box-shadow:none;">Type</button>
                    <button class="btn-genie" onclick="window.setSignMode('upload')" style="font-size:0.7rem; padding:0.6rem; background:white; color:black; box-shadow:none;">Upload</button>
                </div>
                <div id="sign-draw-area" style="border:2px solid #ddd; background:white; height:150px; border-radius:12px; overflow:hidden;">
                    <canvas id="sign-canvas" style="width:100%; height:100%; cursor:crosshair;"></canvas>
                </div>
                <div id="sign-type-area" style="display:none;"><input type="text" id="sign-text-input" placeholder="Type name..." style="width:100%; padding:0.8rem; border:1px solid #ddd; border-radius:8px;"></div>
                <div id="sign-upload-area" style="display:none;"><input type="file" id="sign-file-input" accept="image/*" style="font-size:0.8rem;"></div>
                <button class="btn-genie" onclick="window.applySignature()" style="font-size:0.9rem;">Place Signature</button>
                <label style="display:flex; align-items:center; gap:0.5rem; font-size:0.85rem; font-weight:700; cursor:pointer;">
                    <input type="checkbox" onchange="window.toggleSignAll(this)"> Sign All Pages
                </label>
            </div>
        `;
        setTimeout(initSignCanvas, 10);
    } else if (currentTool.id === 'compress-pdf') {
        const options = [
            { id: 'extreme', title: 'EXTREME COMPRESSION', subtitle: 'Less quality, high compression' },
            { id: 'recommended', title: 'RECOMMENDED COMPRESSION', subtitle: 'Good quality, good compression' },
            { id: 'less', title: 'LESS COMPRESSION', subtitle: 'High quality, less compression' }
        ];

        let html = `<label style="font-weight:800; font-size:1.1rem; margin-bottom: 0.5rem; display: block;">Compression level</label><div style="display:flex; flex-direction:column; border:1px solid #cbd5e1; border-radius:10px; overflow:hidden; background:white;">`;
        
        options.forEach(opt => {
            const isActive = compressionLevel === opt.id;
            html += `
                <div onclick="window.setCompressionLevel('${opt.id}')" style="display:flex; align-items:center; justify-content:space-between; padding:1.2rem; cursor:pointer; border-bottom:1px solid #cbd5e1; background:${isActive ? '#eef2ff' : 'transparent'}; transition: background 0.2s;">
                    <div>
                        <div style="font-weight:700; color:${COLORS.skyBlue}; font-size:0.85rem; letter-spacing:0.5px;">${opt.title}</div>
                        <div style="font-size:0.8rem; color:#64748b;">${opt.subtitle}</div>
                    </div>
                    ${isActive ? `<div style="background:#22c55e; color:white; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">✓</div>` : ''}
                </div>
            `;
        });
        html += `</div>`;
        settings.innerHTML = html;
    } else if (currentTool.id === 'split-pdf') {
        let rangesHtml = splitRanges.map((r, i) => `
            <div style="margin-bottom:1rem; border:1px solid #ddd; padding:0.8rem; border-radius:10px; background:white;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
                    <span style="font-size:0.8rem; font-weight:700;">Range <span style="background:#eef2ff; padding:2px 8px; border-radius:4px;">${i+1}</span></span>
                    ${splitRanges.length > 1 ? `<button onclick="window.removeSplitRange(${i})" style="border:none; background:none; color:#ef4444; font-size:1.2rem; cursor:pointer;">&times;</button>` : ''}
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem;">
                    <div><label style="font-size:0.65rem; color:#64748b; display:block; margin-bottom:2px;">from page</label><input type="number" value="${r.from}" onchange="window.updateSplitRange(${i}, 'from', this.value)" style="width:100%; padding:0.5rem; border:1px solid #cbd5e1; border-radius:6px;"></div>
                    <div><label style="font-size:0.65rem; color:#64748b; display:block; margin-bottom:2px;">to page</label><input type="number" value="${r.to}" onchange="window.updateSplitRange(${i}, 'to', this.value)" style="width:100%; padding:0.5rem; border:1px solid #cbd5e1; border-radius:6px;"></div>
                </div>
            </div>
        `).join('');

        settings.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:1.2rem;">
                <label style="font-weight:800; font-size:1.1rem;">Range mode:</label>
                <div style="display:flex; gap:0.5rem; background:#f1f5f9; padding:4px; border-radius:10px;">
                    <button class="btn-genie" onclick="window.setSplitMode('custom')" style="font-size:0.8rem; padding:0.7rem; flex:1; background:${splitMode === 'custom' ? 'white' : 'transparent'}; color:${COLORS.skyBlue}; border:${splitMode === 'custom' ? '1px solid ' + COLORS.skyBlue : 'none'}; box-shadow:none;">Custom ranges</button>
                    <button class="btn-genie" onclick="window.setSplitMode('fixed')" style="font-size:0.8rem; padding:0.7rem; flex:1; background:${splitMode === 'fixed' ? 'white' : 'transparent'}; color:${COLORS.skyBlue}; border:${splitMode === 'fixed' ? '1px solid ' + COLORS.skyBlue : 'none'}; box-shadow:none;">Fixed ranges</button>
                </div>
                <div id="ranges-container">${rangesHtml}</div>
                <button class="btn-genie" onclick="window.addSplitRange()" style="background:transparent; color:${COLORS.skyBlue}; border:1px solid ${COLORS.skyBlue}; box-shadow:none; font-size:0.9rem;">+ Add Range</button>
            </div>
        `;
    } else if (currentTool.id === 'add-page-numbers') {
        const gridItems = Array.from({length: 9}, (_, i) => `
            <div onclick="window.setPageNumPos(${i})" style="position:relative; width:40px; height:40px; border:1px dashed #cbd5e1; background:white; cursor:pointer; display:flex; align-items:center; justify-content:center;">
                ${pageNumPos === i ? `<div style="width:10px; height:10px; background:${COLORS.skyBlue}; border-radius:50%;"></div>` : ''}
            </div>
        `).join('');

        settings.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:1.2rem; font-family:'Inter', sans-serif;">
                <div style="margin-bottom:0.5rem;">
                    <label style="display:block; font-weight:700; font-size:0.9rem; margin-bottom:0.5rem;">Page mode</label>
                    <div style="display:flex; gap:1.5rem;">
                        <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; cursor:pointer;">
                            <input type="radio" name="pagemode" ${pageNumMode === 'single' ? 'checked' : ''} onchange="window.setPageNumMode('single')"> Single page
                        </label>
                        <label style="display:flex; align-items:center; gap:0.4rem; font-size:0.85rem; cursor:pointer;">
                            <input type="radio" name="pagemode" ${pageNumMode === 'facing' ? 'checked' : ''} onchange="window.setPageNumMode('facing')"> Facing pages
                        </label>
                    </div>
                </div>

                <div style="display:flex; gap:1.5rem;">
                    <div style="flex:1;">
                        <label style="display:block; font-weight:700; font-size:0.9rem; margin-bottom:0.5rem;">Position:</label>
                        <div style="display:grid; grid-template-columns: repeat(3, 40px); grid-template-rows: repeat(3, 40px); border:1px solid #cbd5e1; width:fit-content; border-radius:4px;">
                            ${gridItems}
                        </div>
                    </div>
                    <div style="flex:1;">
                        <label style="display:block; font-weight:700; font-size:0.9rem; margin-bottom:0.5rem;">Margin:</label>
                        <select onchange="window.setPageNumMargin(this.value)" style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem;">
                            <option value="recommended" ${pageNumMargin === 'recommended' ? 'selected' : ''}>Recommended</option>
                            <option value="small" ${pageNumMargin === 'small' ? 'selected' : ''}>Small</option>
                            <option value="big" ${pageNumMargin === 'big' ? 'selected' : ''}>Big</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style="display:block; font-weight:700; font-size:0.9rem; margin-bottom:0.5rem;">Pages</label>
                    <div style="display:flex; align-items:center; border:1px solid #cbd5e1; border-radius:6px; overflow:hidden; background:white;">
                        <span style="padding:0.6rem; font-size:0.85rem; border-right:1px solid #cbd5e1;">First number:</span>
                        <input type="number" value="${pageNumFirst}" onchange="window.setPageNumFirst(this.value)" style="border:none; padding:0.6rem; width:100%; outline:none; font-size:0.85rem;">
                    </div>
                </div>

                <div>
                    <label style="display:block; font-weight:700; font-size:0.9rem; margin-bottom:0.5rem;">Text:</label>
                    <select onchange="window.setPageNumTemplate(this.value)" style="width:100%; padding:0.6rem; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem;">
                        <option value="recommended">Insert only page number (recommended)</option>
                        <option value="Page {n}">Page {n}</option>
                        <option value="Page {n} of {N}">Page {n} of {N}</option>
                    </select>
                </div>

                <div>
                    <label style="display:block; font-weight:700; font-size:0.9rem; margin-bottom:0.5rem;">Text format:</label>
                    <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                        <select style="padding:4px; border:none; font-size:0.75rem;"><option>Arial</option><option>Courier</option><option>Helvetica</option><option>Times New Roman</option></select>
                        <select style="padding:4px; border:none; font-size:0.75rem;"><option>11</option><option>12</option><option>14</option><option>16</option></select>
                        <button onclick="window.togglePageNumStyle('bold')" style="background:${pageNumStyle.bold ? '#e2e8f0' : 'transparent'}; border:none; font-weight:800; padding:4px 8px; border-radius:4px; cursor:pointer;">B</button>
                        <button onclick="window.togglePageNumStyle('italic')" style="background:${pageNumStyle.italic ? '#e2e8f0' : 'transparent'}; border:none; font-style:italic; padding:4px 8px; border-radius:4px; cursor:pointer;">I</button>
                        <button onclick="window.togglePageNumStyle('underline')" style="background:${pageNumStyle.underline ? '#e2e8f0' : 'transparent'}; border:none; text-decoration:underline; padding:4px 8px; border-radius:4px; cursor:pointer;">U</button>
                        <div style="width:20px; height:20px; background:black; border-radius:4px; border:1px solid #cbd5e1;"></div>
                    </div>
                </div>
            </div>
        `;
    } else {
        switch(currentTool.id) {
            case 'translate-text':
                settings.innerHTML = `<textarea id="trans-input" placeholder="Type text..." style="width:100%; height:120px; padding:0.8rem; border:1px solid #ddd; border-radius:8px;"></textarea><label style="font-size:0.7rem; margin-top:1rem; display:block;">TARGET LANGUAGE</label><select id="lang-select" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid #ddd;"><option>French</option><option>Italian</option><option>German</option><option>Russian</option><option>Japanese</option><option>Chinese</option><option>Urdu</option><option>Hindi</option><option>Spanish</option></select>`;
                document.getElementById('trans-input')?.addEventListener('input', updateProcessButton);
                break;
            case 'text-to-speech':
                settings.innerHTML = `<textarea id="tts-input" placeholder="Type text..." style="width:100%; height:100px; padding:0.8rem; border:1px solid #ddd; border-radius:8px;"></textarea><label style="font-size:0.7rem; margin-top:1rem; display:block;">VOICE</label><select id="voice-select" style="width:100%; padding:0.8rem; border-radius:8px; border:1px solid #ddd;"><option value="Zephyr">Male</option><option value="Kore">Female</option><option value="Puck">Young</option></select>`;
                document.getElementById('tts-input')?.addEventListener('input', updateProcessButton);
                break;
        }
    }
}

async function renderPreviews() {
    const pane = document.getElementById('preview-pane')!;
    pane.innerHTML = '';
    const pdfjs = await loadPdfJs();
    if (currentFiles.length === 0) return;
    
    if (currentTool.id === 'sign-pdf') {
        const file = currentFiles[0];
        const arr = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(arr) }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
        pane.className = 'large-preview-container';
        pane.appendChild(canvas);
        const wrapper = document.getElementById('preview-container-wrapper')!;
        wrapper.style.width = viewport.width + 'px'; wrapper.style.height = viewport.height + 'px';
        previewDimensions = { width: viewport.width, height: viewport.height };
    } else if (currentTool.id === 'split-pdf' || currentTool.id === 'add-page-numbers' || currentTool.id === 'compress-pdf' || currentTool.id === 'pdf-to-word' || currentTool.id === 'ocr-pdf' || currentTool.id === 'word-to-pdf') {
        pane.className = 'file-grid';
        const wrapper = document.getElementById('preview-container-wrapper')!;
        wrapper.style.width = '100%'; wrapper.style.height = 'auto';
        
        if (currentFiles[0].type !== 'application/pdf') {
             const thumb = document.createElement('div');
             thumb.className = 'file-placeholder';
             thumb.textContent = currentFiles[0].name.split('.').pop()?.toUpperCase() || 'DOC';
             pane.appendChild(wrapThumb(thumb, currentFiles[0].name, () => {
                currentFiles = []; resetWorkspaceUI();
             }));
             return;
        }

        const file = currentFiles[0];
        const arr = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(arr) }).promise;
        const count = currentTool.id === 'split-pdf' ? pdf.numPages : Math.min(pdf.numPages, 10);
        for (let i = 1; i <= count; i++) {
            const thumb = await createThumb(file, i, pdfjs);
            const thumbWrap = wrapThumb(thumb, `Page ${i}`, () => {});
            thumbWrap.querySelector('.remove-file-btn')!.remove();
            pane.appendChild(thumbWrap);
        }
    } else {
        pane.className = 'file-grid';
        const wrapper = document.getElementById('preview-container-wrapper')!;
        wrapper.style.width = '100%'; wrapper.style.height = 'auto';
        for (let i = 0; i < currentFiles.length; i++) {
            const file = currentFiles[i];
            const thumb = file.type === 'application/pdf' ? await createThumb(file, 1, pdfjs) : document.createElement('div');
            if (file.type !== 'application/pdf') { (thumb as HTMLElement).className = 'file-placeholder'; (thumb as HTMLElement).textContent = file.name.split('.').pop()?.toUpperCase() || 'FILE'; }
            pane.appendChild(wrapThumb(thumb as HTMLElement, file.name, () => {
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
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width; canvas.height = viewport.height;
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
    document.getElementById('sign-draggable')!.style.display = 'none';
    document.getElementById('modal-processing-view')!.style.display = 'flex';
    let progress = 0; const bar = document.getElementById('progress-bar')!; const pct = document.getElementById('progress-pct')!;
    const iv = setInterval(() => { progress += 5; if (progress >= 100) { progress = 100; clearInterval(iv); finishProcess(); } bar.style.width = progress + '%'; pct.textContent = progress + '%'; }, 100);
}

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

async function finishProcess() {
    await loadConversionLibs();
    const { PDFDocument, rgb, StandardFonts } = await loadPdfLib();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let resultBlob: Blob | null = null;
    let finalExt = 'pdf';
    
    try {
        if (currentTool.id === 'sign-pdf' && signatureImage) {
            const doc = await PDFDocument.load(await currentFiles[0].arrayBuffer());
            const signImg = await doc.embedPng(signatureImage.split(',')[1]);
            const pages = doc.getPages();
            const processPage = (page: any) => {
                const { width, height } = page.getSize();
                const pdfX = (signaturePos.x / previewDimensions.width) * width;
                const pdfY = height - ((signaturePos.y / previewDimensions.height) * height) - ((70 / previewDimensions.height) * height);
                const sw = (200 / previewDimensions.width) * width;
                const sh = (70 / previewDimensions.height) * height;
                page.drawImage(signImg, { x: pdfX, y: pdfY, width: sw, height: sh });
            };
            if (signAllPages) pages.forEach(processPage);
            else processPage(pages[0]);
            resultBlob = new Blob([await doc.save()], { type: 'application/pdf' });
        } else if (currentTool.id === 'word-to-pdf') {
            const wordBuffer = await currentFiles[0].arrayBuffer();
            const mammoth = (window as any).mammoth;
            const extraction = await mammoth.convertToHtml({ arrayBuffer: wordBuffer });
            const docHtml = extraction.value; 

            const res = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [{ parts: [{ text: `Act as a Professional Document Layout Reconstructor. Take the following HTML content from a Word document and reconstruct it into a perfectly formatted, professional HTML document. 
                REQUIREMENTS:
                1. Preserve all tables, alignment, and headings.
                2. Use standard modern CSS for layout.
                3. Ensure it looks like a high-quality formal document.
                4. DO NOT include markdown markers like **.
                5. Return ONLY the reconstructed HTML code wrapped in <html> and <body> tags.
                
                CONTENT: ${docHtml}` }] }]
            });

            let cleanHtml = res.text || "<html><body>Error reconstructing document.</body></html>";
            cleanHtml = cleanHtml.replace(/```html/g, '').replace(/```/g, '').trim();

            const renderContainer = document.createElement('div');
            renderContainer.style.width = '800px'; 
            renderContainer.style.padding = '50px';
            renderContainer.style.background = 'white';
            renderContainer.style.position = 'fixed';
            renderContainer.style.top = '-10000px';
            renderContainer.innerHTML = cleanHtml;
            document.body.appendChild(renderContainer);

            const canvas = await (window as any).html2canvas(renderContainer, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = (window as any).jspdf;
            const pdf = new jsPDF('p', 'pt', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            
            resultBlob = pdf.output('blob');
            document.body.removeChild(renderContainer);
            finalExt = 'pdf';
        } else if (currentTool.id === 'pdf-to-word' || currentTool.id === 'ocr-pdf') {
            const b64 = await fileToBase64(currentFiles[0]);
            const res = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [{ parts: [{ inlineData: { data: b64, mimeType: 'application/pdf' } }, { text: "Convert this PDF to high-quality HTML for Word. Return ONLY HTML." }] }]
            });
            let htmlContent = res.text || "<html><body>Error</body></html>";
            htmlContent = htmlContent.replace(/```html/g, '').replace(/```/g, '').trim();
            resultBlob = new Blob([htmlContent], { type: 'application/msword' });
            finalExt = 'doc';
        } else if (currentTool.id === 'text-to-speech') {
            const ttsIn = (document.getElementById('tts-input') as HTMLTextAreaElement).value;
            const voice = (document.getElementById('voice-select') as HTMLSelectElement).value;
            const res = await ai.models.generateContent({
                model: 'gemini-2.5-flash-preview-tts',
                contents: [{ parts: [{ text: ttsIn }] }],
                config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } }
            });
            const b64 = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (b64) resultBlob = new Blob([encodeWAV(Uint8Array.from(atob(b64), c => c.charCodeAt(0)))], { type: 'audio/wav' });
            finalExt = 'wav';
        } else if (currentTool.id === 'merge-pdf' || currentTool.id === 'organize-pdf') {
            const mergedPdf = await PDFDocument.create();
            for (const file of currentFiles) {
                const donor = await PDFDocument.load(await file.arrayBuffer());
                const pages = await mergedPdf.copyPages(donor, donor.getPageIndices());
                pages.forEach(p => mergedPdf.addPage(p));
            }
            resultBlob = new Blob([await mergedPdf.save()], { type: 'application/pdf' });
        } else { 
            resultBlob = currentFiles[0]; 
        }
    } catch (e) { 
        console.error("GENIE ERROR:", e); 
        resultBlob = currentFiles[0]; 
    }
    
    document.getElementById('modal-processing-view')!.style.display = 'none';
    document.getElementById('modal-complete-view')!.style.display = 'flex';
    
    if (resultBlob) {
        const url = URL.createObjectURL(resultBlob);
        document.getElementById('download-area')!.innerHTML = `<a href="${url}" download="Genie_Result.${finalExt}" class="btn-genie" style="width:auto; padding:1.2rem 5rem;">Download Result</a>`;
    }
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