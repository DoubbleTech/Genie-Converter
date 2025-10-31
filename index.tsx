// --- ICON DEFINITIONS ---
const ICONS = {
    'merge-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-merge" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#f87171"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-merge)"/><path d="M40 20v-4h-4v4h-4v4h4v4h4v-4h4v-4zM22 14h12v6h-6a4 4 0 01-4-4zm-4 32V16a4 4 0 014-4h14l10 10v22a4 4 0 01-4 4z" fill="#fff"/></svg>`,
    'split-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-split" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#fb923c"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-split)"/><path d="M44 12v20H20V12h24zm0 24v20H20V36h24zM16 30h32v4H16zm10-12h4v4h-4zm0 24h4v4h-4z" fill="#fff"/></svg>`,
    'compress-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-compress" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#84cc16"/><stop offset="100%" stop-color="#a3e635"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-compress)"/><path d="M22 12h20a4 4 0 014 4v20H28v8H18V16a4 4 0 014-4zm12 18V18h-8v12h8zM44 34v12H32v-8h8v-4h4zM24 46V34h8v12h-8zM18 28h8v-8h-8v8z" fill="#fff"/></svg>`,
    'word-to-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-word" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2563eb"/><stop offset="100%" stop-color="#60a5fa"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-word)"/><path d="M12 12h20v40H12zm24 16l12-8v24l-12-8h-4V28z" fill="#fff"/><path d="M18 44V20l8 12-8 12z" fill="#2563eb"/></svg>`,
    'excel-to-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-excel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#16a34a"/><stop offset="100%" stop-color="#4ade80"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-excel)"/><path d="M12 12h20v40H12zm24 16l12-8v24l-12-8h-4V28zM26 20h-4v4h4zm-6 6h-4v4h4zm6 0h-4v4h4zm-6 6h-4v4h4zm6 0h-4v4h4zm-6 6h-4v4h4zm6 0h-4v4h4z" fill="#fff"/></svg>`,
    'sign-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-sign" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#fcd34d"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-sign)"/><path d="M16 12h32v24H16z" fill="#fff"/><path d="M20 16h24v4H20zm0 8h24v4H20zM22 32c4-4 8-4 12 0s8 4 12 0" stroke="#f59e0b" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M16 40h32v12H16z" fill="#fff" opacity=".5"/></svg>`,
    'stamp-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-stamp" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#60a5fa"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-stamp)"/><path d="M22 22h24v24H22z" fill="#fff" opacity=".5"/><path d="M18 18h24v24H18z" fill="#fff" opacity=".7"/><path d="M14 14h24v24H14z" fill="#fff"/><rect x="38" y="34" width="16" height="6" rx="2" fill="#3b82f6"/><rect x="44" y="26" width="4" height="8" fill="#3b82f6"/><path d="M40 40c2-2 4-2 6 0s4 2 6 0" stroke="#3b82f6" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    'resize-image': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-resize" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0ea5e9"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-resize)"/><path d="M16 16h32v24H16z" fill="#fff"/><path d="M22 34l8-8 10 10 6-4V20H20z" fill="#0ea5e9"/><circle cx="26" cy="24" r="3" fill="#fff"/><path d="M12 12h8v4h-8zm32 0h8v4h-8zM12 40h8v4h-8zm32 0h8v4h-8z" fill="#fff" opacity=".8"/></svg>`,
    'png-to-jpg': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-png" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#d946ef"/><stop offset="100%" stop-color="#ec4899"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-png)"/><text x="8" y="30" font-family="sans-serif" font-size="13" fill="#fff" font-weight="bold">PNG</text><path d="M34 26l8 8-8 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="40" y="46" font-family="sans-serif" font-size="13" fill="#fff" font-weight="bold">JPG</text></svg>`,
    'jpg-to-png': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-jpg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ec4899"/><stop offset="100%" stop-color="#d946ef"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-jpg)"/><text x="8" y="30" font-family="sans-serif" font-size="13" fill="#fff" font-weight="bold">JPG</text><path d="M34 26l8 8-8 8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="40" y="46" font-family="sans-serif" font-size="13" fill="#fff" font-weight="bold">PNG</text></svg>`,
    'image-to-excel': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-i2e" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#34d399"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-i2e)"/><path d="M12 20h16v16H12zm2 12l4-4 6 6 2-1.5v-6H14z" fill="#fff"/><circle cx="17" cy="25" r="2" fill="#fff"/><path d="M32 32l6-4-6-4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M42 22h10v20H42zm2 2v4h6v-4zm0 6v4h2v-4zm4 0v4h2v-4zm-4 6v4h6v-4z" fill="#fff"/></svg>`,
    'remove-bg': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-rembg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#818cf8"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-rembg)"/><path d="M20 52a12 12 0 0124 0z" fill="#fff"/><circle cx="32" cy="26" r="8" fill="#fff"/><path d="M12 12h8v8h-8zm8 8h8v8h-8zm8 8h8v8h-8zm8 8h8v8h-8zM20 28h8v8h-8zm8-8h8v8h-8zm-8 16h8v8h-8z" fill="#e2e8f0" opacity=".5"/></svg>`,
    'pdf-to-word': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-p2w" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#2563eb"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-p2w)"/><path d="M16 14h12v6h-6a4 4 0 01-4-4zm-4 32V16a4 4 0 014-4h14l10 10v22a4 4 0 01-4 4z" fill="#fff" opacity=".8"/><path d="M48 24l-8 8m0-8l8 8m-4 12V32l8-6-8-6v16" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'pdf-to-excel': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-p2e" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#22c55e"/><stop offset="100%" stop-color="#16a34a"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-p2e)"/><path d="M16 14h12v6h-6a4 4 0 01-4-4zm-4 32V16a4 4 0 014-4h14l10 10v22a4 4 0 01-4 4z" fill="#fff" opacity=".8"/><path d="M42 32h10v10H42zm0-2h10m-10 6h10m-10 6h10m-12-14h-2v14h2" stroke="#fff" stroke-width="2" fill="none"/></svg>`,
    'pdf-to-jpg': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-p2j" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#d97706"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-p2j)"/><path d="M16 14h12v6h-6a4 4 0 01-4-4zm-4 32V16a4 4 0 014-4h14l10 10v22a4 4 0 01-4 4z" fill="#fff" opacity=".8"/><path d="M44 32h8v8h-8zm-2 10l6-6-8-8-8 8 4 4" stroke="#fff" stroke-width="2" fill="none"/><circle cx="50" cy="34" r="2" fill="#fff"/></svg>`,
    'rotate-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-rot" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#0d9488"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-rot)"/><path d="M24 16h16v32H24z" fill="#fff"/><path d="M52 32a12 12 0 01-18.7 10M52 32h-8m-3.3-10a12 12 0 01-3.3 20" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,
    'unlock-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-ulk" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#22c55e"/><stop offset="100%" stop-color="#4ade80"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-ulk)"/><path d="M20 20h24v24H20z" fill="#fff" opacity=".8"/><path d="M38 28a6 6 0 00-12 0v8h12zM30 28V24a2 2 0 012-2h4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="32" cy="42" r="2" fill="#fff"/></svg>`,
    'protect-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-lck" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#f87171"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-lck)"/><path d="M20 20h24v24H20z" fill="#fff" opacity=".8"/><path d="M38 28a6 6 0 01-12 0v8h12zM30 28V24a2 2 0 012-2h4a2 2 0 012 2v4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="32" cy="42" r="2" fill="#fff"/></svg>`,
    'watermark-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-wtm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0ea5e9"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-wtm)"/><path d="M20 12h24v40H20z" fill="#fff"/><path d="M26 44l6-12 6 12" stroke="#0ea5e9" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/><path d="M29 38h6" stroke="#0ea5e9" stroke-width="3" stroke-linecap="round" opacity=".7"/></svg>`,
    'organize-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-org" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#c084fc"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-org)"/><rect x="14" y="16" width="16" height="20" rx="2" fill="#fff"/><rect x="34" y="28" width="16" height="20" rx="2" fill="#fff"/><path d="M22 20h-4v12h4m16-4h4V24h-4m0 16h4V38h-4" stroke="#a855f7" stroke-width="2" fill="none"/></svg>`,
    'image-converter': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-icv" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#818cf8"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-icv)"/><path d="M16 20h16v16H16z" fill="#fff"/><path d="M20 32l6-6 8 8 4-3v-7H18z" fill="#6366f1"/><path d="M40 28l-6 6m6-6l-6-6m16 4a6 6 0 00-6-6h-4v12h4a6 6 0 006-6z" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'jpg-to-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-j2p" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#818cf8"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-j2p)"/><path d="M12 20h20v24H12zm24 6l12-8v24l-12-8h-4V26z" fill="#fff" opacity=".8"/><path d="M16 38l6-6 8 8 4-3v-7H14z" fill="#6366f1"/><circle cx="18" cy="26" r="2" fill="#6366f1"/></svg>`,
    'ppt-to-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-ppt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#fdba74"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-ppt)"/><path d="M12 12h20v40H12zm24 16l12-8v24l-12-8h-4V28zM22 20a4 4 0 00-8 0v8h8zm0 12h-8v8h8z" fill="#fff"/></svg>`,
    'html-to-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-html" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#2dd4bf"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-html)"/><path d="M12 12h20v40H12zm24 16l12-8v24l-12-8h-4V28z" fill="#fff" opacity=".8"/><path d="M20 24l-6 8 6 8m4-16l6 8-6 8" stroke="#14b8a6" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    'edit-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-edit" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#c084fc"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-edit)"/><path d="M16 14h12v6h-6a4 4 0 01-4-4zm-4 32V16a4 4 0 014-4h14l10 10v22a4 4 0 01-4 4z" fill="#fff"/><path d="M42 20l10 10-20 20H22v-10z" fill="#a855f7"/><path d="M38 24l10 10" stroke="#fff" stroke-width="2"/></svg>`,
    'excel-split': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-exs" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#34d399"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-exs)"/><path d="M14 20h12v24H14zm16-4h12v12H30zm0 16h12v12H30zM28 32h16v2H28" fill="#fff"/></svg>`,
    'excel-merge': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-exm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#16a34a"/><stop offset="100%" stop-color="#4ade80"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-exm)"/><path d="M14 16h12v12H14zm16 16h12v12H30zm0-16h12v12H30zM14 32h12v12H14zm10-4v-6h4v6h6v4h-6v6h-4v-6h-6v-4z" fill="#fff"/></svg>`,
    'placeholder': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-place" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6b7280"/><stop offset="100%" stop-color="#9ca3af"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-place)"/><path d="M22 22h20v20H22z" fill="#fff" opacity=".7"/><path d="M26 32a6 6 0 016-6c2 0 4 2 4 4s-2 4-4 4-4 2-2 4" fill="none" stroke="#6b7280" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="42" r="2" fill="#6b7280"/></svg>`,
};

const getIcon = (name) => ICONS[name] || ICONS['placeholder'];

// --- DYNAMIC SCRIPT LOADER ---
const loadedScripts = new Map<string, Promise<any>>();

const loadScript = (url: string, globalName: string): Promise<any> => {
    if (loadedScripts.has(url)) {
        return loadedScripts.get(url)!;
    }
    const promise = new Promise((resolve, reject) => {
        if (window[globalName]) {
            return resolve(window[globalName]);
        }
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            if (window[globalName]) {
                resolve(window[globalName]);
            } else {
                reject(new Error(`Script loaded but global '${globalName}' not found.`));
            }
        };
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(script);
    });
    loadedScripts.set(url, promise);
    return promise;
};

// --- TOOL IMPLEMENTATIONS ---
interface ToolImplementation {
    title: string;
    subtitle: string;
    icon: string;
    fileType: string;
    multiple?: boolean;
    interactive?: boolean;
    options?: (file?: File) => string;
    process?: (files: File[], opts: Record<string, any>) => Promise<void>;
    onOptionsReady?: (file: File | File[]) => void;
}

const toolImplementations: { [key: string]: ToolImplementation } = {
    'merge-pdf': {
        title: 'Merge PDF',
        subtitle: 'Combine multiple PDFs into one single document.',
        icon: getIcon('merge-pdf'),
        fileType: '.pdf',
        multiple: true,
        process: async (files, opts) => {
            const { PDFDocument } = await import('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.esm.js');
            const mergedPdf = await PDFDocument.create();
            for (const file of files) {
                const pdfBytes = await file.arrayBuffer();
                const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach(page => mergedPdf.addPage(page));
            }
            const mergedPdfBytes = await mergedPdf.save();
            showCompleteView(new Blob([mergedPdfBytes], { type: 'application/pdf' }), `GenieConverter Merge PDF merged.pdf`);
        }
    },
    'split-pdf': {
        title: 'Split PDF',
        subtitle: 'Separate one page or a whole set for easy conversion into independent PDF files.',
        icon: getIcon('split-pdf'),
        fileType: '.pdf',
        multiple: false,
        options: () => `
            <div class="option-group">
                <h4>Split options</h4>
                <p style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 1rem;">Select the pages you want to extract from the PDF file.</p>
                <div id="split-ranges-container"></div>
                <button id="add-range-btn" class="btn-secondary">+ Add Range</button>
            </div>
            <div class="option-group checkbox-group">
                <input type="checkbox" id="merge-ranges-checkbox" style="width: auto;">
                <label for="merge-ranges-checkbox">Merge all ranges in one PDF file.</label>
            </div>
        `,
        onOptionsReady: async (file) => {
            const singleFile = Array.isArray(file) ? file[0] : file;
            const rangesContainer = document.getElementById('split-ranges-container')!;
            const addRangeBtn = document.getElementById('add-range-btn')!;
            const pdfjsLib = await loadScript('https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.min.js', 'pdfjsLib');
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`;
            const arrayBuffer = await singleFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            const addRange = (from = 1, to = pdf.numPages) => {
                const rangeId = `range-${Date.now()}`;
                const item = document.createElement('div');
                item.className = 'split-range-item';
                item.innerHTML = `
                    <label for="${rangeId}-from">From page</label>
                    <input type="number" id="${rangeId}-from" value="${from}" min="1" max="${pdf.numPages}">
                    <label for="${rangeId}-to">to</label>
                    <input type="number" id="${rangeId}-to" value="${to}" min="1" max="${pdf.numPages}">
                    <button class="remove-range-btn" data-range-id="${rangeId}">&times;</button>
                `;
                rangesContainer.appendChild(item);
                item.querySelector('.remove-range-btn')!.addEventListener('click', () => item.remove());
            };

            addRangeBtn.addEventListener('click', () => addRange(1,1));
            addRange(); // Add initial range
        },
        process: async (files, opts) => {
            const { PDFDocument } = await import('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.esm.js');
            const file = files[0];
            const pdfBytes = await file.arrayBuffer();
            const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            
            const ranges: {from: number, to: number}[] = [];
            document.querySelectorAll('.split-range-item').forEach(item => {
                const from = parseInt((item.querySelector('input:first-of-type') as HTMLInputElement).value, 10);
                const to = parseInt((item.querySelector('input:last-of-type') as HTMLInputElement).value, 10);
                if (!isNaN(from) && !isNaN(to) && from > 0 && to >= from && to <= pdf.getPageCount()) {
                    ranges.push({ from, to });
                }
            });

            if (ranges.length === 0) throw new Error('No valid ranges specified.');

            const mergeRanges = (document.getElementById('merge-ranges-checkbox') as HTMLInputElement).checked;

            if (mergeRanges) {
                const newPdf = await PDFDocument.create();
                const pageIndices = new Set<number>();
                ranges.forEach(r => {
                    for (let i = r.from; i <= r.to; i++) pageIndices.add(i - 1);
                });
                const sortedIndices = Array.from(pageIndices).sort((a,b) => a - b);
                const copiedPages = await newPdf.copyPages(pdf, sortedIndices);
                copiedPages.forEach(page => newPdf.addPage(page));
                const newPdfBytes = await newPdf.save();
                showCompleteView(new Blob([newPdfBytes], { type: 'application/pdf' }), `GenieConverter Split PDF ${file.name}`);
            } else {
                const JSZip = await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', 'JSZip');
                const zip = new JSZip();
                for (let i = 0; i < ranges.length; i++) {
                    const range = ranges[i];
                    const newPdf = await PDFDocument.create();
                    const indices = Array.from({length: range.to - range.from + 1}, (_, k) => k + range.from - 1);
                    const copiedPages = await newPdf.copyPages(pdf, indices);
                    copiedPages.forEach(page => newPdf.addPage(page));
                    const newPdfBytes = await newPdf.save();
                    const baseName = file.name.replace(/\.pdf$/i, '');
                    zip.file(`${baseName}_pages_${range.from}-${range.to}.pdf`, newPdfBytes);
                }
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                showCompleteView(zipBlob, `GenieConverter Split PDF ${file.name.replace(/\.pdf$/i, '.zip')}`);
            }
        }
    },
    'compress-pdf': {
        title: 'Compress PDF',
        subtitle: 'Reduce the file size of your PDF while optimizing for maximal quality.',
        icon: getIcon('compress-pdf'),
        fileType: '.pdf',
        multiple: false,
    },
    'word-to-pdf': {
        title: 'Word to PDF',
        subtitle: 'Easily convert your DOC and DOCX files to PDF.',
        icon: getIcon('word-to-pdf'),
        fileType: '.doc,.docx',
        multiple: true,
        process: async (files, opts) => {
            const { PDFDocument } = await import('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.esm.js');
            const mammoth = await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js', 'mammoth');
            const html2pdf = await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js', 'html2pdf');
            
            if (files.length === 1) {
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();
                const { value: html } = (await mammoth.convertToHtml({ arrayBuffer })) as { value: string };
                const element = document.createElement('div');
                element.innerHTML = html;
                const pdfOpts = { margin: 1, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
                const newFilename = `GenieConverter Word to PDF ${file.name.replace(/\.(doc|docx)$/i, '.pdf')}`;
                const pdfBlob = await html2pdf().from(element).set({...pdfOpts, filename: newFilename }).output('blob');
                showCompleteView(pdfBlob, newFilename);
            } else {
                 const mergedPdf = await PDFDocument.create();
                 for (const file of files) {
                    const arrayBuffer = await file.arrayBuffer();
                    const { value: html } = (await mammoth.convertToHtml({ arrayBuffer })) as { value: string };
                    const element = document.createElement('div');
                    element.innerHTML = html;
                    const pdfOpts = { margin: 1, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
                    const pdfBytes = await html2pdf().from(element).set(pdfOpts).output('arraybuffer');
                    const pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
                    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    copiedPages.forEach(page => mergedPdf.addPage(page));
                 }
                 const mergedPdfBytes = await mergedPdf.save();
                 showCompleteView(new Blob([mergedPdfBytes], { type: 'application/pdf' }), `GenieConverter Word to PDF merged.pdf`);
            }
        }
    },
     'excel-to-pdf': {
        title: 'Excel to PDF',
        subtitle: 'Convert your Excel spreadsheets to PDF.',
        icon: getIcon('excel-to-pdf'),
        fileType: '.xlsx',
        multiple: false,
        process: async (files, opts) => {
            const XLSX = await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', 'XLSX');
            const html2pdf = await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js', 'html2pdf');
            const file = files[0];
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const html = XLSX.utils.sheet_to_html(worksheet);
            const element = document.createElement('div');
            element.innerHTML = `<style>table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ccc;padding:8px;text-align:left;}</style>${html}`;
            const newFilename = `GenieConverter Excel to PDF ${file.name.replace(/\.xlsx$/i, '.pdf')}`;
            const pdfOpts = { margin: 0.5, image: { type: 'jpeg', quality: 0.95 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' } };
            const pdfBlob = await html2pdf().from(element).set({...pdfOpts, filename: newFilename}).output('blob');
            showCompleteView(pdfBlob, newFilename);
        }
    },
    'ppt-to-pdf': { title: 'PPT to PDF', subtitle: 'Convert PowerPoint presentations to PDF.', fileType: '.pptx', icon: getIcon('ppt-to-pdf'), },
    'html-to-pdf': { title: 'HTML to PDF', subtitle: 'Convert webpages in HTML to PDF.', fileType: '.html', icon: getIcon('html-to-pdf'), },
    'jpg-to-pdf': {
        title: 'JPG to PDF',
        subtitle: 'Convert JPG images to PDF in seconds.',
        icon: getIcon('jpg-to-pdf'),
        fileType: '.jpg,.jpeg',
        multiple: true,
        process: async (files, opts) => {
            const { PDFDocument } = await import('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.esm.js');
            const pdfDoc = await PDFDocument.create();
            for (const file of files) {
                const jpgBytes = await file.arrayBuffer();
                const jpgImage = await pdfDoc.embedJpg(jpgBytes);
                const page = pdfDoc.addPage([jpgImage.width, jpgImage.height]);
                page.drawImage(jpgImage, { x: 0, y: 0, width: jpgImage.width, height: jpgImage.height });
            }
            const pdfBytes = await pdfDoc.save();
            const filename = files.length === 1 ? files[0].name.replace(/\.(jpg|jpeg)$/i, '.pdf') : 'images.pdf';
            showCompleteView(new Blob([pdfBytes], { type: 'application/pdf' }), `GenieConverter JPG to PDF ${filename}`);
        }
    },
    'sign-pdf': {
        title: 'Sign PDF',
        subtitle: 'Sign yourself or request electronic signatures from others.',
        icon: getIcon('sign-pdf'),
        fileType: '.pdf',
        multiple: false,
        interactive: true,
        process: async (files, opts) => {
            const { PDFDocument } = await import('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.esm.js');
            const file = files[0];
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            
            for (const sig of placedSignatures) {
                const page = pdfDoc.getPage(sig.pageIndex);
                const { width: pageWidth, height: pageHeight } = page.getSize();
                const sigImageBytes = atob(sig.imageDataUrl.split(',')[1]).split('').map(c => c.charCodeAt(0));
                const sigImage = await pdfDoc.embedPng(new Uint8Array(sigImageBytes));

                page.drawImage(sigImage, {
                    x: (sig.x / sig.canvasWidth) * pageWidth,
                    y: pageHeight - ((sig.y + sig.height) / sig.canvasHeight) * pageHeight,
                    width: (sig.width / sig.canvasWidth) * pageWidth,
                    height: (sig.height / sig.canvasHeight) * pageHeight,
                });
            }

            const newPdfBytes = await pdfDoc.save();
            showCompleteView(new Blob([newPdfBytes], { type: 'application/pdf' }), `GenieConverter Sign PDF ${file.name}`);
        }
    },
    'stamp-pdf': {
        title: 'Stamp PDF',
        subtitle: 'Apply a signature to the same spot on every page of your documents.',
        icon: getIcon('stamp-pdf'),
        fileType: '.pdf',
        multiple: true,
        interactive: true,
        process: async (files, opts) => {
             const { PDFDocument } = await import('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.esm.js');
             if (placedSignatures.length === 0) throw new Error("No signature has been placed.");
             
             const sig = placedSignatures[0]; // Use the first placed signature as the stamp
             const sigImageBytes = atob(sig.imageDataUrl.split(',')[1]).split('').map(c => c.charCodeAt(0));
             
             const JSZip = await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', 'JSZip');
             const zip = new JSZip();

             for (const file of files) {
                const pdfBytes = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
                const sigImage = await pdfDoc.embedPng(new Uint8Array(sigImageBytes));

                for (const page of pdfDoc.getPages()) {
                    const { width: pageWidth, height: pageHeight } = page.getSize();
                    page.drawImage(sigImage, {
                        x: (sig.x / sig.canvasWidth) * pageWidth,
                        y: pageHeight - ((sig.y + sig.height) / sig.canvasHeight) * pageHeight,
                        width: (sig.width / sig.canvasWidth) * pageWidth,
                        height: (sig.height / sig.canvasHeight) * pageHeight,
                    });
                }
                const newPdfBytes = await pdfDoc.save();
                zip.file(`stamped_${file.name}`, newPdfBytes);
             }

             if (files.length === 1) {
                const stampedFile = Object.values(zip.files)[0];
// Fix: Cast stampedFile to any to access the 'async' method from the dynamically loaded JSZip library.
                const blob = await (stampedFile as any).async('blob');
                showCompleteView(blob, `GenieConverter Stamp PDF ${files[0].name}`);
             } else {
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                showCompleteView(zipBlob, `GenieConverter Stamp PDF stamped_files.zip`);
             }
        }
    },
    'edit-pdf': { title: 'Edit PDF', subtitle: 'Edit PDF files for free.', fileType: '.pdf', icon: getIcon('edit-pdf'), },
    'pdf-to-word': { title: 'PDF to Word', subtitle: 'Easily convert your PDF files into editable DOC and DOCX documents.', fileType: '.pdf', icon: getIcon('pdf-to-word'), },
    'pdf-to-excel': { title: 'PDF to Excel', subtitle: 'Convert data from PDF to Excel spreadsheets.', fileType: '.pdf', icon: getIcon('pdf-to-excel'), },
    'pdf-to-jpg': {
        title: 'PDF to JPG',
        subtitle: 'Extract all images from a PDF or convert each page into a JPG image.',
        icon: getIcon('pdf-to-jpg'),
        fileType: '.pdf',
        multiple: false,
        options: () => `<div class="option-group"><h4>JPG Quality</h4><input type="range" id="pdf-to-jpg-quality" min="0.1" max="1" step="0.1" value="0.9"></div>`,
        process: async (files, opts) => {
            const pdfjsLib = await loadScript('https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.min.js', 'pdfjsLib');
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`;
            const JSZip = await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', 'JSZip');
            
            const quality = parseFloat((document.getElementById('pdf-to-jpg-quality') as HTMLInputElement).value);
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
            const zip = new JSZip();
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const context = canvas.getContext('2d');
                await page.render({ canvasContext: context, viewport: viewport }).promise;
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                zip.file(`page_${i}.jpg`, dataUrl.split(',')[1], { base64: true });
            }
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const newFilename = `GenieConverter PDF to JPG ${file.name.replace(/\.pdf$/i, '.zip')}`;
            showCompleteView(zipBlob, newFilename);
        }
    },
    'rotate-pdf': {
        title: 'Rotate PDF',
        subtitle: 'Rotate all or just a few pages in your PDF file.',
        icon: getIcon('rotate-pdf'),
        fileType: '.pdf',
        multiple: false,
        options: () => `
            <div class="option-group">
                <h4>Angle</h4>
                <select id="rotation-angle">
                    <option value="90">90° Clockwise</option>
                    <option value="180">180°</option>
                    <option value="270">270° Clockwise</option>
                </select>
            </div>
        `,
        process: async (files, opts) => {
            const { PDFDocument, degrees } = await import('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.esm.js');
            const angle = parseInt((document.getElementById('rotation-angle') as HTMLSelectElement).value, 10);
            const file = files[0];
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            const pages = pdfDoc.getPages();
            pages.forEach(page => page.setRotation(degrees(page.getRotation().angle + angle)));
            const newPdfBytes = await pdfDoc.save();
            showCompleteView(new Blob([newPdfBytes], { type: 'application/pdf' }), `GenieConverter Rotate PDF ${file.name}`);
        }
    },
    'watermark-pdf': {
        title: 'Watermark PDF',
        subtitle: 'Stamp an image or text over your PDF in seconds.',
        icon: getIcon('watermark-pdf'),
        fileType: '.pdf',
        multiple: false,
        interactive: true,
        options: () => `
            <div class="option-group">
                <h4>Watermark Text</h4>
                <input type="text" id="watermark-text" value="CONFIDENTIAL">
            </div>
            <div class="option-group">
                <h4>Font Size</h4>
                <input type="range" id="watermark-size" min="10" max="200" value="50">
            </div>
            <div class="option-group">
                <h4>Color</h4>
                <input type="color" id="watermark-color" value="#ff0000">
            </div>
            <div class="option-group">
                <h4>Opacity</h4>
                <input type="range" id="watermark-opacity" min="0" max="1" step="0.1" value="0.2">
            </div>
        `,
        onOptionsReady: (file) => {
            // This is handled by the complex renderer function in renderPreview
        },
        process: async (files, opts) => {
            const { PDFDocument, rgb, StandardFonts } = await import('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.esm.js');
            const file = files[0];
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            
            const text = (document.getElementById('watermark-text') as HTMLInputElement).value;
            const colorHex = (document.getElementById('watermark-color') as HTMLInputElement).value;
            const opacity = parseFloat((document.getElementById('watermark-opacity') as HTMLInputElement).value);
            const color = {
                r: parseInt(colorHex.slice(1, 3), 16) / 255,
                g: parseInt(colorHex.slice(3, 5), 16) / 255,
                b: parseInt(colorHex.slice(5, 7), 16) / 255
            };

            const watermarkEl = document.getElementById('watermark-draggable')!;
            const previewContainer = document.querySelector('.options-preview-pane')!;
            const firstPageCanvas = previewContainer.querySelector('canvas')!;
            
            const firstPage = pdfDoc.getPage(0);
            const { width: pdfWidth, height: pdfHeight } = firstPage.getSize();
            const { width: canvasWidth, height: canvasHeight } = firstPageCanvas;

            // Convert DOM position (pixels) to PDF position (points)
            const x = (watermarkEl.offsetLeft / canvasWidth) * pdfWidth;
            const y = ((canvasHeight - watermarkEl.offsetTop - watermarkEl.offsetHeight) / canvasHeight) * pdfHeight;
            const pdfSize = (parseInt(watermarkEl.style.fontSize, 10) / canvasHeight) * pdfHeight;

            for (const page of pdfDoc.getPages()) {
                page.drawText(text, {
                    x, y,
                    font,
                    size: pdfSize,
                    color: rgb(color.r, color.g, color.b),
                    opacity
                });
            }
            
            const newPdfBytes = await pdfDoc.save();
            showCompleteView(new Blob([newPdfBytes], { type: 'application/pdf' }), `GenieConverter Watermark PDF ${file.name}`);
        }
    },
    'organize-pdf': { 
        title: 'Organize PDF', 
        subtitle: 'Sort, add, and delete PDF pages.', 
        fileType: '.pdf', 
        icon: getIcon('organize-pdf'),
        interactive: true,
        multiple: false,
        process: async (files, opts) => {
            const { PDFDocument, degrees } = await import('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.esm.js');
            const file = files[0];
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            const newPdfDoc = await PDFDocument.create();

            const pageElements = document.querySelectorAll('.page-thumbnail-wrapper');
            const pageIndices = Array.from(pageElements).map(el => parseInt((el as HTMLElement).dataset.pageIndex!, 10));
            const rotations = Array.from(pageElements).map(el => parseInt((el as HTMLElement).dataset.rotation!, 10));

            const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);

            copiedPages.forEach((page, i) => {
                page.setRotation(degrees(rotations[i]));
                newPdfDoc.addPage(page);
            });

            const newPdfBytes = await newPdfDoc.save();
            showCompleteView(new Blob([newPdfBytes], { type: 'application/pdf' }), `GenieConverter Organize PDF ${file.name}`);
        }
    },
    'protect-pdf': {
        title: 'Protect PDF',
        subtitle: 'Encrypt your PDF with a password.',
        icon: getIcon('protect-pdf'),
        fileType: '.pdf',
        multiple: false,
        options: () => `<div class="option-group"><h4>Password</h4><input type="password" id="pdf-password"></div>`,
        process: async (files, opts) => {
            const { PDFDocument } = await import('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.esm.js');
            const password = (document.getElementById('pdf-password') as HTMLInputElement).value;
            if (!password) throw new Error('Password cannot be empty.');
            const file = files[0];
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const newPdfBytes = await pdfDoc.save({
                userPassword: password,
                ownerPassword: password,
                permissions: {},
            });
            showCompleteView(new Blob([newPdfBytes], { type: 'application/pdf' }), `GenieConverter Protect PDF ${file.name}`);
        }
    },
    'unlock-pdf': { title: 'Unlock PDF', subtitle: 'Remove password, encryption, and permissions from your PDF file.', fileType: '.pdf', icon: getIcon('unlock-pdf') },
    'image-converter': { title: 'Image Converter', subtitle: 'Convert images to and from many formats.', fileType: 'image/*', icon: getIcon('image-converter') },
    'resize-image': { title: 'Resize Image', subtitle: 'Define your dimensions, and we will do the rest.', fileType: 'image/*', icon: getIcon('resize-image') },
    'remove-bg': { title: 'Remove Background', subtitle: 'Remove the background from any image.', fileType: 'image/*', icon: getIcon('remove-bg') },
    'image-to-excel': { title: 'Image to Excel', subtitle: 'Extract tables from images and convert to Excel.', fileType: 'image/*', icon: getIcon('image-to-excel') },
    'png-to-jpg': {
        title: 'PNG to JPG',
        subtitle: 'Convert PNG images to JPG format.',
        icon: getIcon('png-to-jpg'),
        fileType: '.png',
        multiple: true,
        process: (files) => processImageConversion(files, 'image/jpeg', '.jpg', 'PNG to JPG')
    },
    'jpg-to-png': {
        title: 'JPG to PNG',
        subtitle: 'Convert JPG images to PNG format.',
        icon: getIcon('jpg-to-png'),
        fileType: '.jpg,.jpeg',
        multiple: true,
        process: (files) => processImageConversion(files, 'image/png', '.png', 'JPG to PNG')
    },
    'excel-split-sheets': {
        title: 'Excel Split Sheets',
        subtitle: 'Split one Excel file into separate files, one per sheet.',
        icon: getIcon('excel-split'),
        fileType: '.xlsx',
        multiple: false,
        process: async (files, opts) => {
            const XLSX = await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', 'XLSX');
            const JSZip = await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', 'JSZip');
            const file = files[0];
            const data = await file.arrayBuffer();
            const originalWorkbook = XLSX.read(data, {type: 'array'});
            const zip = new JSZip();

            for (const sheetName of originalWorkbook.SheetNames) {
                const newWorkbook = XLSX.utils.book_new();
                const sheet = originalWorkbook.Sheets[sheetName];
                XLSX.utils.book_append_sheet(newWorkbook, sheet, sheetName);
                const newXlsxData = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
                zip.file(`${sheetName}.xlsx`, newXlsxData);
            }

            const zipBlob = await zip.generateAsync({type: 'blob'});
            const newFilename = `GenieConverter Excel Split Sheets ${file.name.replace(/\.xlsx$/i, '.zip')}`;
            showCompleteView(zipBlob, newFilename);
        }
    },
    'excel-merge-sheets': {
        title: 'Excel Merge Sheets',
        subtitle: 'Combine multiple Excel files into a single workbook with multiple sheets.',
        icon: getIcon('excel-merge'),
        fileType: '.xlsx',
        multiple: true,
        process: async (files, opts) => {
            const XLSX = await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', 'XLSX');
            const newWorkbook = XLSX.utils.book_new();
            
            for (const file of files) {
                const data = await file.arrayBuffer();
                const workbook = XLSX.read(data, {type: 'array'});
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                let sheetName = file.name.replace(/\.xlsx$/i, '').substring(0, 31);
                let counter = 1;
                let finalSheetName = sheetName;
                while(newWorkbook.SheetNames.includes(finalSheetName)) {
                    finalSheetName = `${sheetName.substring(0, 30 - String(counter).length)}-${counter}`;
                    counter++;
                }
                
                XLSX.utils.book_append_sheet(newWorkbook, worksheet, finalSheetName);
            }

            const newXlsxData = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([newXlsxData], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            showCompleteView(blob, `GenieConverter Excel Merge Sheets merged.xlsx`);
        }
    },
};

const processImageConversion = async (files: File[], format: 'image/jpeg' | 'image/png', extension: string, toolName: string) => {
    const JSZip = await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', 'JSZip');
    const zip = new JSZip();

    const conversionPromises = files.map(file => {
        return new Promise<void>((resolve, reject) => {
            const image = new Image();
            const reader = new FileReader();
            
            reader.onload = e => {
                image.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    const ctx = canvas.getContext('2d')!;
                    if (format === 'image/jpeg') {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    ctx.drawImage(image, 0, 0);
                    canvas.toBlob(blob => {
                        if (blob) {
                            const newFilename = file.name.replace(/\.[^/.]+$/, "") + extension;
                            zip.file(newFilename, blob);
                        }
                        resolve();
                    }, format, 0.95);
                };
                image.onerror = reject;
                image.src = e.target!.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });

    await Promise.all(conversionPromises);

    if (files.length === 1) {
        const newFilename = files[0].name.replace(/\.[^/.]+$/, "") + extension;
        const blob = await zip.files[newFilename]?.async('blob');
        if (blob) showCompleteView(blob, `GenieConverter ${toolName} ${newFilename}`);
    } else {
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        showCompleteView(zipBlob, `GenieConverter ${toolName} images.zip`);
    }
}

// --- APP STATE ---
let currentToolId: string | null = null;
let currentFiles: File[] = [];
let currentBlob: Blob | null = null;
let currentFilename: string | null = null;

const modal = document.getElementById('tool-modal') as HTMLElement;
const initialView = document.getElementById('modal-initial-view') as HTMLElement;
const optionsView = document.getElementById('modal-options-view') as HTMLElement;
const processingView = document.getElementById('modal-processing-view') as HTMLElement;
const completeView = document.getElementById('modal-complete-view') as HTMLElement;
const processBtn = document.getElementById('process-btn') as HTMLButtonElement;
const errorMessage = document.getElementById('error-message') as HTMLElement;
let placedSignatures: { id: string, imageDataUrl: string, x: number, y: number, width: number, height: number, pageIndex: number, canvasWidth: number, canvasHeight: number }[] = [];


const openToolModal = (toolId: string, previousBlob: Blob | null = null, previousFilename: string | null = null) => {
    const tool = toolImplementations[toolId];
    if (!tool || !tool.process) return;

    currentToolId = toolId;
    currentFiles = [];
    placedSignatures = [];
    
    (document.getElementById('modal-title') as HTMLElement).textContent = tool.title;
    (document.getElementById('modal-subtitle') as HTMLElement).textContent = tool.subtitle;

    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.accept = tool.fileType;
    fileInput.multiple = !!tool.multiple;

    if (previousBlob && previousFilename) {
        const file = new File([previousBlob], previousFilename, { type: previousBlob.type });
        handleFilesSelected([file]);
    } else {
        showInitialView();
    }
    
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    modal.classList.remove('visible');
    document.body.style.overflow = '';
};

const showInitialView = () => {
    initialView.style.display = 'block';
    optionsView.style.display = 'none';
    processingView.style.display = 'none';
    completeView.style.display = 'none';
    errorMessage.style.display = 'none';
};

const showOptionsView = async (files: File[]) => {
    initialView.style.display = 'none';
    optionsView.style.display = 'flex';
    processingView.style.display = 'none';
    completeView.style.display = 'none';
    errorMessage.style.display = 'none';
    processBtn.disabled = true;

    const tool = toolImplementations[currentToolId!];
    const optionsContainer = document.getElementById('tool-options') as HTMLElement;
    const previewPane = optionsView.querySelector('.options-preview-pane') as HTMLElement;

    optionsContainer.innerHTML = tool.options ? tool.options(files[0]) : '';
    previewPane.innerHTML = '';
    
    await renderPreview(files, previewPane);

    if (tool.onOptionsReady) {
        tool.onOptionsReady(tool.multiple ? files : files[0]);
    }
    
    processBtn.disabled = false;
};

const showProcessingView = async (files: File[]) => {
    initialView.style.display = 'none';
    optionsView.style.display = 'none';
    processingView.style.display = 'block';
    completeView.style.display = 'none';
    errorMessage.style.display = 'none';

    (document.getElementById('processing-text') as HTMLElement).textContent = `${toolImplementations[currentToolId!].title}...`;
    const progressBar = document.getElementById('progress-bar') as HTMLElement;
    const progressPercentage = document.getElementById('progress-percentage') as HTMLElement;
    progressBar.style.width = '0%';
    progressPercentage.textContent = '0%';

    let progress = 0;
    const interval = setInterval(() => {
        progress += 100 / (15 * 10); // 15 seconds
        if (progress > 100) progress = 100;
        progressBar.style.width = `${progress}%`;
        progressPercentage.textContent = `${Math.floor(progress)}%`;
        if (progress >= 100) clearInterval(interval);
    }, 100);

    setTimeout(async () => {
        try {
            const tool = toolImplementations[currentToolId!];
            await tool.process!(files, {});
        } catch (error) {
            console.error(error);
            showError((error as Error).message);
        }
    }, 15000);
};

const showCompleteView = (blob: Blob, filename: string) => {
    currentBlob = blob;
    currentFilename = filename;

    initialView.style.display = 'none';
    optionsView.style.display = 'none';
    processingView.style.display = 'none';
    completeView.style.display = 'block';

    (document.getElementById('complete-title') as HTMLElement).textContent = `${toolImplementations[currentToolId!].title} complete!`;

    const downloadArea = document.getElementById('download-area') as HTMLElement;
    downloadArea.innerHTML = `<a href="#" id="download-btn" class="download-btn">Download ${filename}</a>`;
    const downloadBtn = document.getElementById('download-btn') as HTMLAnchorElement;

    downloadBtn.onclick = (e) => {
        e.preventDefault();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    renderContinueTools();
};

const showError = (message: string) => {
    showInitialView();
    errorMessage.textContent = `Error: ${message}`;
    errorMessage.style.display = 'block';
};

const renderContinueTools = () => {
    const grid = document.getElementById('continue-tools-grid') as HTMLElement;
    grid.innerHTML = '';
    const recommendedTools = ['compress-pdf', 'sign-pdf', 'protect-pdf', 'merge-pdf'];
    recommendedTools.forEach(toolId => {
        if (toolId === currentToolId) return;
        const tool = toolImplementations[toolId];
        if (tool) {
            const card = document.createElement('div');
            card.className = 'continue-tool-card';
            card.dataset.toolId = toolId;
            card.innerHTML = `${tool.icon}<span>${tool.title}</span>`;
            card.onclick = () => handleContinueWith(toolId);
            grid.appendChild(card);
        }
    });
};

const handleContinueWith = (toolId: string) => {
    const tool = toolImplementations[toolId];
    if (tool.fileType.includes('pdf') && currentBlob?.type !== 'application/pdf') {
       alert("The previous output is not a PDF and cannot be used with this tool.");
       return;
    }
    closeModal();
    // Use a short timeout to allow the modal to close before opening the new one
    setTimeout(() => {
        openToolModal(toolId, currentBlob, currentFilename);
    }, 300);
};

const renderPreview = async (files: File[], previewPane: HTMLElement) => {
    previewPane.innerHTML = '';
    const tool = toolImplementations[currentToolId!];
    
    // For tools that need a list view (merge, multiple file uploads)
    if (['merge-pdf', 'excel-merge-sheets'].includes(currentToolId!) || (tool.multiple && !tool.interactive)) {
         previewPane.style.flexDirection = 'column';
         previewPane.style.justifyContent = 'flex-start';
         previewPane.style.alignItems = 'stretch';
         files.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'file-list-item';
            item.draggable = true;
            item.dataset.index = String(index);
            item.innerHTML = `<span>${index + 1}. ${file.name}</span> <button>&times;</button>`;
            previewPane.appendChild(item);
         });
         // Add drag-and-drop reordering for file list
         let draggedItem: HTMLElement | null = null;
         previewPane.addEventListener('dragstart', e => {
            draggedItem = e.target as HTMLElement;
            setTimeout(() => draggedItem?.classList.add('dragging'), 0);
         });
         previewPane.addEventListener('dragend', e => {
            draggedItem?.classList.remove('dragging');
            // Re-order the actual files array
// Fix: Cast 'child' from Element to HTMLElement to access the 'dataset' property.
            const newOrder = Array.from(previewPane.children).map(child => parseInt((child as HTMLElement).dataset.index!));
            currentFiles = newOrder.map(i => files[i]);
            // Update display numbers
            Array.from(previewPane.children).forEach((child, i) => {
                (child.querySelector('span') as HTMLElement).textContent = `${i + 1}. ${currentFiles[i].name}`;
            });
         });
         previewPane.addEventListener('dragover', e => {
             e.preventDefault();
             const afterElement = getDragAfterElement(previewPane, e.clientY);
             if (afterElement == null) {
                 previewPane.appendChild(draggedItem!);
             } else {
                 previewPane.insertBefore(draggedItem!, afterElement);
             }
         });

    } else if (tool.fileType.includes('pdf') && tool.interactive) {
        // For interactive PDF tools
        previewPane.style.flexDirection = 'row';
        previewPane.style.justifyContent = 'center';
        previewPane.style.alignContent = 'flex-start';
        const file = files[0];
        const pdfjsLib = await loadScript('https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.min.js', 'pdfjsLib');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        switch (currentToolId) {
            case 'sign-pdf':
            case 'stamp-pdf':
                createSignaturePad(document.getElementById('tool-options')!, previewPane);
                // Fallthrough to render pages
            case 'watermark-pdf':
            case 'organize-pdf':
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 1.5 });
                    
                    const wrapper = document.createElement('div');
                    wrapper.className = 'page-thumbnail-wrapper';
                    wrapper.dataset.pageIndex = String(i - 1);
                    wrapper.dataset.rotation = '0';

                    const canvas = document.createElement('canvas');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const context = canvas.getContext('2d')!;
                    await page.render({ canvasContext: context, viewport: viewport }).promise;
                    
                    const thumbnail = document.createElement('div');
                    thumbnail.className = 'page-thumbnail';
                    thumbnail.appendChild(canvas);
                    
                    const pageNumEl = document.createElement('div');
                    pageNumEl.className = 'page-number';
                    pageNumEl.textContent = String(i);
                    thumbnail.appendChild(pageNumEl);

                    if (currentToolId === 'organize-pdf') {
                        wrapper.draggable = true;
                        const controls = document.createElement('div');
                        controls.className = 'page-thumbnail-controls';
                        controls.innerHTML = `
                            <button class="page-thumbnail-btn rotate" title="Rotate">&#x21bb;</button>
                            <button class="page-thumbnail-btn delete" title="Delete">&times;</button>
                        `;
                        wrapper.appendChild(controls);
                    }
                    wrapper.appendChild(thumbnail);
                    previewPane.appendChild(wrapper);
                }
                
                if (currentToolId === 'organize-pdf') {
                    setupOrganizePdfInteractions(previewPane);
                }
                if (currentToolId === 'watermark-pdf') {
                    setupWatermarkInteractions(previewPane);
                }
                break;
        }
    }
};

const createSignaturePad = (optionsContainer: HTMLElement, previewPane: HTMLElement) => {
    optionsContainer.innerHTML = `
        <div class="signature-pad-container">
            <h4>Create Signature</h4>
            <div class="sig-tabs">
                <button class="sig-tab active" data-tab="draw">Draw</button>
                <button class="sig-tab" data-tab="type">Type</button>
                <button class="sig-tab" data-tab="upload">Upload</button>
            </div>
            <div id="sig-draw" class="sig-content active">
                <canvas id="sig-draw-canvas" width="280" height="150"></canvas>
            </div>
            <div id="sig-type" class="sig-content">
                <input type="text" id="sig-type-input" placeholder="Your Name">
                <div id="sig-type-preview">Your Name</div>
            </div>
            <div id="sig-upload" class="sig-content">
                <label for="sig-upload-input" id="sig-upload-label">Click to upload</label>
                <input type="file" id="sig-upload-input" accept="image/*" hidden>
            </div>
            <div class="sig-actions">
                <button id="clear-signature-btn" class="btn-secondary">Clear</button>
                <button id="create-signature-btn" class="btn-secondary">Create Signature</button>
            </div>
        </div>
    `;
    
    // Signature Pad Logic
    const tabs = optionsContainer.querySelectorAll('.sig-tab');
    const contents = optionsContainer.querySelectorAll('.sig-content');
    let activeTab = 'draw';
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            activeTab = (tab as HTMLElement).dataset.tab!;
            document.getElementById(`sig-${activeTab}`)!.classList.add('active');
        });
    });

    // Draw
    const canvas = document.getElementById('sig-draw-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    let drawing = false;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    const startDraw = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        drawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    };
    const doDraw = (e: MouseEvent | TouchEvent) => {
        if (!drawing) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };
    const endDraw = () => drawing = false;
    const getPos = (e: MouseEvent | TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    }
    
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', doDraw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseout', endDraw);
    canvas.addEventListener('touchstart', startDraw);
    canvas.addEventListener('touchmove', doDraw);
    canvas.addEventListener('touchend', endDraw);
    
    // Type
    const typeInput = document.getElementById('sig-type-input') as HTMLInputElement;
    const typePreview = document.getElementById('sig-type-preview') as HTMLElement;
    typeInput.addEventListener('input', () => {
        typePreview.textContent = typeInput.value || 'Your Name';
    });
    
    // Upload
    const uploadInput = document.getElementById('sig-upload-input') as HTMLInputElement;
    const uploadLabel = document.getElementById('sig-upload-label') as HTMLElement;
    uploadInput.addEventListener('change', () => {
        if (uploadInput.files && uploadInput.files[0]) {
            uploadLabel.textContent = uploadInput.files[0].name;
        }
    });

    const clearSignature = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        typeInput.value = '';
        typePreview.textContent = 'Your Name';
        uploadInput.value = '';
        uploadLabel.textContent = 'Click to upload';
    };
    document.getElementById('clear-signature-btn')!.addEventListener('click', clearSignature);
    
    document.getElementById('create-signature-btn')!.addEventListener('click', async () => {
        let imageDataUrl: string | null = null;
        if (activeTab === 'draw' && !isCanvasBlank(canvas)) {
            imageDataUrl = canvas.toDataURL();
        } else if (activeTab === 'type' && typeInput.value) {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d')!;
            const text = typeInput.value;
            tempCtx.font = "48px 'Dancing Script'";
            const metrics = tempCtx.measureText(text);
            tempCanvas.width = metrics.width + 20;
            tempCanvas.height = 60;
            tempCtx.font = "48px 'Dancing Script'";
            tempCtx.fillStyle = '#000';
            tempCtx.fillText(text, 10, 45);
            imageDataUrl = tempCanvas.toDataURL();
        } else if (activeTab === 'upload' && uploadInput.files && uploadInput.files[0]) {
            imageDataUrl = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target!.result as string);
                reader.readAsDataURL(uploadInput.files![0]);
            });
        }
        
        if (imageDataUrl) {
            createDraggableSignature(imageDataUrl, previewPane);
            clearSignature();
        }
    });
};

const createDraggableSignature = (imageDataUrl: string, previewPane: HTMLElement) => {
    const stamp = document.createElement('div');
    stamp.className = 'signature-stamp';
    stamp.style.width = '150px';
    stamp.style.position = 'absolute';
    stamp.style.top = '10px';
    stamp.style.left = '10px';
    stamp.innerHTML = `<img src="${imageDataUrl}" alt="Signature"><button class="remove-sig-btn">&times;</button>`;
    
    const id = `sig-${Date.now()}`;
    stamp.dataset.id = id;
    
    previewPane.appendChild(stamp);

    let isDragging = false;
    let offsetX: number, offsetY: number;
    
    const onDown = (e: MouseEvent) => {
        isDragging = true;
        offsetX = e.clientX - stamp.offsetLeft;
        offsetY = e.clientY - stamp.offsetTop;
        stamp.style.cursor = 'grabbing';
    };
    
    const onMove = (e: MouseEvent) => {
        if (!isDragging) return;
        stamp.style.left = `${e.clientX - offsetX}px`;
        stamp.style.top = `${e.clientY - offsetY}px`;
    };
    
    const onUp = (e: MouseEvent) => {
        if (!isDragging) return;
        isDragging = false;
        stamp.style.cursor = 'move';
        
        // Find which page it was dropped on
        const droppedOnPage = document.elementFromPoint(e.clientX, e.clientY)?.closest('.page-thumbnail-wrapper');
        if (droppedOnPage) {
            const pageIndex = parseInt((droppedOnPage as HTMLElement).dataset.pageIndex!, 10);
            const pageCanvas = droppedOnPage.querySelector('canvas')!;
            const pageRect = pageCanvas.getBoundingClientRect();
            const previewRect = previewPane.getBoundingClientRect();
            
            // For stamp tool, only one signature is allowed
            if (currentToolId === 'stamp-pdf') {
                placedSignatures = [];
                document.querySelectorAll('.signature-stamp').forEach(s => { if (s !== stamp) s.remove(); });
            }

            placedSignatures.push({
                id,
                imageDataUrl,
                x: stamp.offsetLeft - (pageRect.left - previewRect.left),
                y: stamp.offsetTop - (pageRect.top - previewRect.top),
                width: stamp.offsetWidth,
                height: stamp.offsetHeight,
                pageIndex: pageIndex,
                canvasWidth: pageCanvas.width,
                canvasHeight: pageCanvas.height,
            });
        } else {
            stamp.remove(); // Removed if not on a page
        }
    };
    
    stamp.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    
    stamp.querySelector('.remove-sig-btn')!.addEventListener('click', () => {
        placedSignatures = placedSignatures.filter(s => s.id !== id);
        stamp.remove();
        // Clean up global listeners if this was the last signature
        if (document.querySelectorAll('.signature-stamp').length === 0) {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        }
    });
};

const isCanvasBlank = (canvas: HTMLCanvasElement) => {
    return !canvas.getContext('2d')!
        .getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0);
};

function getDragAfterElement(container: HTMLElement, y: number) {
    const draggableElements = [...container.querySelectorAll('.file-list-item:not(.dragging), .page-thumbnail-wrapper:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
// Fix: The initial value for reduce must match the structure of the object being returned in the callback. Added 'element: null' to the initial object.
    }, { offset: Number.NEGATIVE_INFINITY, element: null as Element | null }).element;
}

const setupOrganizePdfInteractions = (previewPane: HTMLElement) => {
    let draggedItem: HTMLElement | null = null;
    previewPane.addEventListener('dragstart', (e) => {
        draggedItem = (e.target as HTMLElement).closest('.page-thumbnail-wrapper');
        if (draggedItem) setTimeout(() => draggedItem!.classList.add('dragging'), 0);
    });
    previewPane.addEventListener('dragend', () => {
        if(draggedItem) draggedItem.classList.remove('dragging');
    });
    previewPane.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(previewPane, e.clientY);
        if (draggedItem) {
             if (afterElement == null) {
                previewPane.appendChild(draggedItem);
            } else {
                previewPane.insertBefore(draggedItem, afterElement);
            }
        }
    });
    previewPane.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const wrapper = target.closest('.page-thumbnail-wrapper');
        if (!wrapper) return;

        if (target.classList.contains('delete')) {
            wrapper.remove();
// Fix: Cast 'wrapper' from Element to HTMLElement to access the 'dataset' property.
        } else if (target.classList.contains('rotate')) {
            const currentRotation = parseInt((wrapper as HTMLElement).dataset.rotation || '0', 10);
            const newRotation = (currentRotation + 90) % 360;
            (wrapper as HTMLElement).dataset.rotation = String(newRotation);
            (wrapper.querySelector('canvas') as HTMLElement).style.transform = `rotate(${newRotation}deg)`;
        }
    });
}

const setupWatermarkInteractions = (previewPane: HTMLElement) => {
    const textInput = document.getElementById('watermark-text') as HTMLInputElement;
    const sizeInput = document.getElementById('watermark-size') as HTMLInputElement;
    const colorInput = document.getElementById('watermark-color') as HTMLInputElement;
    const opacityInput = document.getElementById('watermark-opacity') as HTMLInputElement;

    const watermarkEl = document.createElement('div');
    watermarkEl.id = 'watermark-draggable';
    watermarkEl.textContent = textInput.value;
    
    // Initial styling
    watermarkEl.style.fontSize = `${sizeInput.value}px`;
    watermarkEl.style.color = colorInput.value;
    watermarkEl.style.opacity = opacityInput.value;
    
    previewPane.appendChild(watermarkEl);

    textInput.addEventListener('input', () => watermarkEl.textContent = textInput.value);
    sizeInput.addEventListener('input', () => watermarkEl.style.fontSize = `${sizeInput.value}px`);
    colorInput.addEventListener('input', () => watermarkEl.style.color = colorInput.value);
    opacityInput.addEventListener('input', () => watermarkEl.style.opacity = opacityInput.value);
    
    let isDragging = false, offsetX: number, offsetY: number;
    watermarkEl.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - watermarkEl.offsetLeft;
        offsetY = e.clientY - watermarkEl.offsetTop;
    });
    document.addEventListener('mousemove', e => {
        if (isDragging) {
            watermarkEl.style.left = `${e.clientX - offsetX}px`;
            watermarkEl.style.top = `${e.clientY - offsetY}px`;
        }
    });
    document.addEventListener('mouseup', () => isDragging = false);
}


const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    currentFiles = Array.from(files);
    showOptionsView(currentFiles);
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    const toolsGrid = document.getElementById('tools-grid') as HTMLElement;
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const categoryFiltersContainer = document.getElementById('category-filters') as HTMLElement;

    const categories: Record<string, string[]> = {
        'PDF Tools': ['merge-pdf', 'split-pdf', 'compress-pdf', 'word-to-pdf', 'excel-to-pdf', 'ppt-to-pdf', 'html-to-pdf', 'jpg-to-pdf', 'sign-pdf', 'stamp-pdf', 'edit-pdf', 'pdf-to-word', 'pdf-to-excel', 'pdf-to-jpg', 'rotate-pdf', 'watermark-pdf', 'organize-pdf', 'protect-pdf', 'unlock-pdf'],
        'Image Tools': ['png-to-jpg', 'jpg-to-png', 'resize-image', 'remove-bg', 'image-converter', 'image-to-excel'],
        'Excel Tools': ['excel-split-sheets', 'excel-merge-sheets']
    };

    const renderTools = (filter = '', categoryFilter = 'All') => {
        toolsGrid.innerHTML = '';
        const lowerCaseFilter = filter.toLowerCase();

        const displayCategories = categoryFilter === 'All' ? Object.keys(categories) : [categoryFilter];

        displayCategories.forEach(categoryName => {
            const categoryTools = categories[categoryName]
                .map(id => ({ id, ...toolImplementations[id] }))
                .filter(tool => tool.title && (tool.title.toLowerCase().includes(lowerCaseFilter) || tool.subtitle.toLowerCase().includes(lowerCaseFilter)));

            if (categoryTools.length > 0) {
                const categorySection = document.createElement('div');
                categorySection.innerHTML = `<h2 class="category-title">${categoryName}</h2>`;
                const categoryGrid = document.createElement('div');
                categoryGrid.className = 'category-grid';
                
                categoryTools.forEach(tool => {
                    const card = document.createElement('div');
                    card.className = 'tool-card';
                    card.dataset.toolId = tool.id;
                    card.innerHTML = `
                        ${tool.icon}
                        <div>
                            <h3>${tool.title}</h3>
                            <p>${tool.subtitle}</p>
                        </div>
                    `;
                    if (!tool.process) {
                        card.classList.add('coming-soon');
                    } else {
                        card.addEventListener('click', () => openToolModal(tool.id));
                    }
                    categoryGrid.appendChild(card);
                });
                categorySection.appendChild(categoryGrid);
                toolsGrid.appendChild(categorySection);
            }
        });
    };
    
    // Render Category Filters
    ['All', ...Object.keys(categories)].forEach((cat, index) => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        if (index === 0) btn.classList.add('active');
        btn.textContent = cat;
        btn.dataset.category = cat;
        categoryFiltersContainer.appendChild(btn);
    });

    categoryFiltersContainer.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('filter-btn')) {
            categoryFiltersContainer.querySelector('.active')?.classList.remove('active');
            target.classList.add('active');
            renderTools(searchInput.value, target.dataset.category);
        }
    });

    searchInput.addEventListener('input', () => {
        const activeCategory = categoryFiltersContainer.querySelector('.active') as HTMLElement;
        renderTools(searchInput.value, activeCategory.dataset.category);
    });

    renderTools();
    
    // Modal events
    document.getElementById('select-file-btn')!.addEventListener('click', () => {
        (document.getElementById('file-input') as HTMLInputElement).click();
    });

    document.getElementById('file-input')!.addEventListener('change', e => {
        const files = (e.target as HTMLInputElement).files;
        if (files) handleFilesSelected(Array.from(files));
    });

    processBtn.addEventListener('click', () => {
        showProcessingView(currentFiles);
    });

    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });
    modal.querySelector('.close-modal')!.addEventListener('click', closeModal);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('visible')) {
            closeModal();
        }
    });

    // Global drag and drop
    const dropOverlay = document.getElementById('drop-overlay') as HTMLElement;
    window.addEventListener('dragenter', (e) => {
        e.preventDefault();
        dropOverlay.style.display = 'flex';
    });
    window.addEventListener('dragleave', (e) => {
        // Check if the leave event is going to a child element
        if (e.relatedTarget === null) {
            dropOverlay.style.display = 'none';
        }
    });
    window.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropOverlay.style.display = 'none';
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            const firstFileExtension = `.${fileArray[0].name.split('.').pop()?.toLowerCase()}`;
            const matchingTools = Object.entries(toolImplementations)
                .filter(([id, tool]) => tool.process && tool.fileType.includes(firstFileExtension))
                .map(([id, tool]) => ({ id, ...tool }));
            
            if (matchingTools.length === 1) {
                openToolModal(matchingTools[0].id, null, null);
                setTimeout(() => handleFilesSelected(fileArray), 100);
            } else if (matchingTools.length > 1) {
                showServiceSelector(matchingTools, fileArray);
            } else {
                alert(`No tool available for file type: ${firstFileExtension}`);
            }
        }
    });

    const selectorModal = document.getElementById('service-selector-modal')!;
    const showServiceSelector = (tools: any[], files: File[]) => {
        const serviceList = document.getElementById('service-list')!;
        serviceList.innerHTML = '';
        tools.forEach(tool => {
            const item = document.createElement('div');
            item.className = 'service-item';
            item.dataset.toolId = tool.id;
            item.innerHTML = `${tool.icon} <span>${tool.title}</span>`;
            serviceList.appendChild(item);
        });

        selectorModal.classList.add('visible');
        let selectedToolId: string | null = null;
        
        serviceList.addEventListener('click', e => {
            const target = (e.target as HTMLElement).closest('.service-item');
            if (target) {
                serviceList.querySelector('.selected')?.classList.remove('selected');
                target.classList.add('selected');
                selectedToolId = (target as HTMLElement).dataset.toolId!;
                (document.getElementById('let-genie-convert-btn') as HTMLButtonElement).disabled = false;
            }
        });
        
        document.getElementById('let-genie-convert-btn')!.onclick = () => {
            if (selectedToolId) {
                selectorModal.classList.remove('visible');
                openToolModal(selectedToolId, null, null);
                setTimeout(() => handleFilesSelected(files), 100);
            }
        };
        selectorModal.querySelector('.close-modal')!.addEventListener('click', () => selectorModal.classList.remove('visible'));
    };

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') themeToggle.checked = true;
    }
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger') as HTMLElement;
    const navLinks = document.querySelector('.nav-links') as HTMLElement;
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scroll-to-top') as HTMLButtonElement;
    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});