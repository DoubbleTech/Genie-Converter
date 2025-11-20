const loadPdfLib = async () => {
    // @ts-ignore
    if (window.PDFLib) return window.PDFLib;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
    document.head.appendChild(script);
    await new Promise(resolve => { script.onload = resolve; });

    // @ts-ignore
    return window.PDFLib;
};

const loadPdfJs = async () => {
    // @ts-ignore
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    if (!pdfjsLib) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
        document.head.appendChild(script);
        await new Promise(resolve => { script.onload = resolve; });
        // @ts-ignore
        window['pdfjs-dist/build/pdf'].GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
    }
    // @ts-ignore
    return window['pdfjs-dist/build/pdf'];
};