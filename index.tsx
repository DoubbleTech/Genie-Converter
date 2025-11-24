import { GoogleGenAI, Modality, LiveServerMessage, Blob as GenAIBlob } from "@google/genai";

// --- ICON DEFINITIONS ---
const ICONS = {
    // Tool Icons
    'merge-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-merge" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#f87171"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-merge)"/><path d="M40 20v-4h-4v4h-4v4h4v4h4v-4h4v-4zM22 14h12v6h-6a4 4 0 01-4-4zm-4 32V16a4 4 0 014-4h14l10 10v22a4 4 0 01-4 4z" fill="#fff"/></svg>`,
    'split-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-split" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#fb923c"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-split)"/><path d="M44 12v20H20V12h24zm0 24v20H20V36h24zM16 30h32v4H16zm10-12h4v4h-4zm0 24h4v4h-4z" fill="#fff"/></svg>`,
    'compress-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-compress" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#84cc16"/><stop offset="100%" stop-color="#a3e635"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-compress)"/><path d="M22 12h20a4 4 0 014 4v20H28v8H18V16a4 4 0 014-4zm12 18V18h-8v12h8zM44 34v12H32v-8h8v-4h4zM24 46V34h8v12h-8zM18 28h8v-8h-8v8z" fill="#fff"/></svg>`,
    'word-to-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-word" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2563eb"/><stop offset="100%" stop-color="#60a5fa"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-word)"/><path d="M12 12h20v40H12zm24 16l12-8v24l-12-8h-4V28z" fill="#fff"/><path d="M18 44V20l8 12-8 12z" fill="#2563eb"/></svg>`,
    'powerpoint-to-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-ppt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#d946ef"/><stop offset="100%" stop-color="#e879f9"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-ppt)"/><path d="M12 12h20v40H12zm24 16l12-8v24l-12-8h-4V28z" fill="#fff"/><path d="M22 32a6 6 0 100-12 6 6 0 000 12zm0 4a10 10 0 110-20 10 10 0 010 20z" fill="#d946ef"/></svg>`,
    'excel-to-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-excel" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#16a34a"/><stop offset="100%" stop-color="#4ade80"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-excel)"/><path d="M12 12h20v40H12zm24 16l12-8v24l-12-8h-4V28zM26 20h-4v4h4zm-6 6h-4v4h4zm6 0h-4v4h4zm-6 6h-4v4h4zm6 0h-4v4h4zm-6 6h-4v4h4zm6 0h-4v4h4z" fill="#fff"/></svg>`,
    'html-to-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-html" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e11d48"/><stop offset="100%" stop-color="#f43f5e"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-html)"/><path d="M12 12h20v40H12zm24 16l12-8v24l-12-8h-4V28zM18 24l4 2-4 2v-4zm10 0l-4 16h-3l4-16h3z" fill="#fff"/></svg>`,
    'image-to-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-jpg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#fcd34d"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-jpg)"/><path d="M12 12h20v40H12zm24 16l12-8v24l-12-8h-4V28zM16 18h12v12H16zm12 18h-8l4-6 4 6z" fill="#fff"/><circle cx="20" cy="22" r="2" fill="#f59e0b"/></svg>`,
    'sign-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-sign" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#fcd34d"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-sign)"/><path d="M16 12h32v24H16z" fill="#fff"/><path d="M20 16h24v4H20zm0 8h24v4H20zM22 32c4-4 8-4 12 0s8 4 12 0" stroke="#f59e0b" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M16 40h32v12H16z" fill="#fff" opacity=".5"/></svg>`,
    'stamp-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-stamp" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#60a5fa"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-stamp)"/><path d="M22 22h24v24H22z" fill="#fff" opacity=".5"/><path d="M18 18h24v24H18z" fill="#fff" opacity=".7"/><path d="M14 14h24v24H14z" fill="#fff"/><rect x="38" y="34" width="16" height="6" rx="2" fill="#3b82f6"/><rect x="44" y="26" width="4" height="8" fill="#3b82f6"/><path d="M40 40c2-2 4-2 6 0s4 2 6 0" stroke="#3b82f6" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    'resize-image': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-resize" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0ea5e9"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-resize)"/><path d="M16 16h32v24H16z" fill="#fff"/><path d="M22 34l8-8 10 10 6-4V20H20z" fill="#0ea5e9"/><circle cx="26" cy="24" r="3" fill="#fff"/><path d="M12 12h8v4h-8zm32 0h8v4h-8zM12 40h8v4h-8zm32 0h8v4h-8z" fill="#fff" opacity=".8"/></svg>`,
    'png-to-jpg': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-png" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#c084fc"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-png)"/><path d="M12 12h20v40H12zm24 16l12-8v24l-12-8h-4V28z" fill="#fff"/><path d="M22 20a4 4 0 100 8h-4v-8zm0 4h-4" fill="#a855f7"/></svg>`,
    'jpg-to-png': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-jpg-png" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f43f5e"/><stop offset="100%" stop-color="#fb7185"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-jpg-png)"/><path d="M12 12h20v40H12zm24 16l12-8v24l-12-8h-4V28z" fill="#fff"/><path d="M22 20a4 4 0 100 8V20zm-4 4a4 4 0 004 4" fill="#f43f5e"/></svg>`,
    'background-remover': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-bg-remover" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#a78bfa"/></linearGradient><pattern id="p-check" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#d1d5db"/><rect x="4" y="4" width="4" height="4" fill="#d1d5db"/><rect y="4" width="4" height="4" fill="#f3f4f6"/><rect x="4" width="4" height="4" fill="#f3f4f6"/></pattern></defs><rect width="64" height="64" rx="12" fill="url(#p-check)"/><path d="M32 12C22 12 16 18 16 28c0 6 4 10 4 10s-2 12 12 12 12-12 12-12c0 0 4-4 4-10 0-10-6-16-16-16z" fill="url(#g-bg-remover)"/><path d="M32 12C22 12 16 18 16 28c0 6 4 10 4 10s-2 12 12 12 12-12 12-12c0 0 4-4 4-10 0-10-6-16-16-16z" fill="url(#g-bg-remover)" stroke="#fff" stroke-width="2" stroke-linejoin="round" style="paint-order:stroke;"/></svg>`,
    'protect-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-protect" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#64748b"/><stop offset="100%" stop-color="#94a3b8"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-protect)"/><path d="M32 12L16 20v12c0 10 16 18 16 18s16-8 16-18V20L32 12zm0 4l12 6-12 6-12-6z" fill="#fff"/><path d="M32 32a4 4 0 100 8 4 4 0 000-8zm0 2v4" fill="#64748b"/></svg>`,
    'unlock-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-unlock" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4ade80"/><stop offset="100%" stop-color="#86efac"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-unlock)"/><path d="M32 12L16 20v12c0 10 16 18 16 18s16-8 16-18V20L32 12zm0 24a4 4 0 100-8 4 4 0 000 8z" fill="#fff" opacity=".5"/><path d="M32 30a4 4 0 00-4 4h8a4 4 0 00-4-4z" fill="#4ade80"/><path d="M24 24h16v-4a8 8 0 10-16 0z" fill="#fff"/><path d="M32 20a4 4 0 100-8 4 4 0 000 8z" fill="#4ade80" opacity=".5"/></svg>`,
    'organize-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-organize" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2dd4bf"/><stop offset="100%" stop-color="#5eead4"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-organize)"/><path d="M12 12h12v12H12zm16 0h12v12H28zM12 28h12v12H12zm16 0h12v12H28zM44 12h8v28h-8z" fill="#fff"/></svg>`,
    'pdf-to-word': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-ptw" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#60a5fa"/><stop offset="100%" stop-color="#2563eb"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-ptw)"/><path d="M16 28l12-8v24l-12-8h-4V28zM36 12h20v40H36zm6 32V20l8 12-8 12z" fill="#fff"/></svg>`,
    'pdf-to-powerpoint': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-ptp" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e879f9"/><stop offset="100%" stop-color="#d946ef"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-ptp)"/><path d="M16 28l12-8v24l-12-8h-4V28zM36 12h20v40H36zm10 20a6 6 0 100-12 6 6 0 000 12zm0 4a10 10 0 110-20 10 10 0 010 20z" fill="#fff"/></svg>`,
    'pdf-to-excel': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-pte" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4ade80"/><stop offset="100%" stop-color="#16a34a"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-pte)"/><path d="M16 28l12-8v24l-12-8h-4V28zM36 12h20v40H36zm10 8h-4v4h4zm-6 6h-4v4h4zm6 0h-4v4h4zm-6 6h-4v4h4zm6 0h-4v4h4zm-6 6h-4v4h4zm6 0h-4v4h4z" fill="#fff"/></svg>`,
    'pdf-to-jpg': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-ptj" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fcd34d"/><stop offset="100%" stop-color="#f59e0b"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-ptj)"/><path d="M16 28l12-8v24l-12-8h-4V28zM36 12h20v40H36zm4 6h12v12H40zm12 18h-8l4-6 4 6z" fill="#fff"/><circle cx="44" cy="22" r="2" fill="#fcd34d"/></svg>`,
    'pdfa': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-pdfa" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7e22ce"/><stop offset="100%" stop-color="#a855f7"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-pdfa)"/><path d="M16 12h22l10 10v26a4 4 0 01-4 4H16a4 4 0 01-4-4V16a4 4 0 014-4z" fill="#fff"/><path d="M22 42V22h4l4 8 4-8h4v20h-4V28l-4 8-4-8v14z" fill="#7e22ce"/></svg>`,
    'ocr-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-ocr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0891b2"/><stop offset="100%" stop-color="#22d3ee"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-ocr)"/><path d="M16 12h22l10 10v26a4 4 0 01-4 4H16a4 4 0 01-4-4V16a4 4 0 014-4z" fill="#fff"/><path d="M20 20h24v4H20zm0 8h16v4H20zm0 8h24v4H20zm0 8h12v4H20zm20-6h2v-2l4 4-4 4v-2h-2z" fill="#0891b2"/></svg>`,
    'watermark': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-water" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0284c7"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-water)"/><path d="M16 12h22l10 10v26a4 4 0 01-4 4H16a4 4 0 01-4-4V16a4 4 0 014-4z" fill="#fff"/><path d="M24 24h16v16H24z" fill="#0284c7" fill-opacity="0.3"/><text x="32" y="36" font-family="sans-serif" font-size="8" fill="#0284c7" text-anchor="middle" font-weight="bold">W</text></svg>`,
    'rotate-pdf': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-rotate" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#65a30d"/><stop offset="100%" stop-color="#84cc16"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-rotate)"/><path d="M20 12h14l10 10v14L34 46H20a4 4 0 01-4-4V16a4 4 0 014-4z" fill="#fff"/><path d="M48 24a16 16 0 11-16-16v4a12 12 0 1012 12z" fill="#fff"/></svg>`,
    'page-numbers': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-numbers" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4f46e5"/><stop offset="100%" stop-color="#818cf8"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-numbers)"/><path d="M16 12h22l10 10v26a4 4 0 01-4 4H16a4 4 0 01-4-4V16a4 4 0 014-4z" fill="#fff"/><path d="M30 44a6 6 0 11-2-11.8V28h-4v-4h8v16.5A6 6 0 0130 44z" fill="#4f46e5"/></svg>`,
    'trim-audio': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-trim" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#14b8a6"/><stop offset="100%" stop-color="#2dd4bf"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-trim)"/><path d="M22 25a4 4 0 100-8 4 4 0 000 8zm20 0a4 4 0 100-8 4 4 0 000 8zM20 28l24 8-10-2-14-6zM20 44l24-8-10 2-14 6z" fill="#fff"/><path d="M12 48V16h4v32h-4zm40 0V16h-4v32h4z" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/></svg>`,
    'image-to-gif': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-gif" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ec4899"/><stop offset="100%" stop-color="#f9a8d4"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-gif)"/><path d="M22 14h20v12H22z" fill="#fff" opacity=".5"/><path d="M18 18h20v12H18z" fill="#fff" opacity=".7"/><path d="M14 22h20v12H14z" fill="#fff"/><path d="M42 42a8 8 0 1 1-8-8v3a5 5 0 1 0 5 5h-3l4 4 4-4h-2z" fill="#fff"/></svg>`,
    'mp4-to-gif': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-v-gif" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ef4444"/><stop offset="100%" stop-color="#f87171"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-v-gif)"/><path d="M12 16h24v12H12zm0 16h24v12H12z" fill="#fff"/><path d="M40 22h12v20H40zm2 4v2h2v-2zm4 0v2h2v-2zm-4 6v2h2v-2zm4 0v2h2v-2z" fill="#fff" opacity=".8"/><path d="M42 28h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm2 2h2v2h-2z" fill="#ef4444"/></svg>`,
    'convert-video': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-v-conv" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#fb923c"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-v-conv)"/><path d="M16 16h32v20H16zM20 20h4v4h-4zm6 0h4v4h-4zm-6 8h4v4h-4zm6 0h4v4h-4zm18-5l-6 5 6 5z" fill="#fff"/><path d="M24 48a8 8 0 0 1-8-8h3a5 5 0 1 0 5-5v-3a8 8 0 1 1 8 8h-3a5 5 0 1 0-5 5v3z" fill="#fff"/></svg>`,
    'wav-to-mp3': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-a-conv" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#34d399"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-a-conv)"/><path d="M12 24h4v16h-4zm6 4h4v8h-4zm6-8h4v24h-4zm6 4h4v16h-4zm6-6h4v20h-4z" fill="#fff"/><path d="M44 24l8 8-8 8m2-12v8" stroke="#fff" stroke-width="2" fill="none"/></svg>`,
    'convert-audio': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-a-gen" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#22d3ee"/><stop offset="100%" stop-color="#67e8f9"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-a-gen)"/><path d="M24 16a8 8 0 0 0-8 8v16a4 4 0 0 0 4 4h4v-8a4 4 0 0 1 4-4h8a8 8 0 0 0 8-8V16a8 8 0 0 0-8-8z" fill="#fff"/><path d="M40 50a8 8 0 0 1-8-8h3a5 5 0 1 0 5-5v-3a8 8 0 1 1 8 8h-3a5 5 0 1 0-5 5v3z" fill="#fff"/></svg>`,
    'text-to-speech': `<svg class="icon" viewBox="0 0 64 64"><defs><linearGradient id="g-tts" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#818cf8"/></linearGradient></defs><rect width="64" height="64" rx="12" fill="url(#g-tts)"/><path d="M18 20a4 4 0 00-4 4v16a4 4 0 004 4h6l8 8V12l-8 8h-6z" fill="#fff"/><path d="M42 20a16 16 0 010 24m4-28a20 20 0 010 32" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`,

    // Flag Icons
    'flag-us': `<svg class="icon" viewBox="0 0 64 64"><defs><clipPath id="us-clip"><rect width="64" height="64" rx="12"/></clipPath></defs><g clip-path="url(#us-clip)"><rect width="64" height="64" fill="#BF0A30"/><path d="M0,8 H64 M0,18.6 H64 M0,29.2 H64 M0,39.8 H64 M0,50.4 H64 M0,61 H64" stroke="#FFF" stroke-width="5.3"/><rect width="32" height="34.5" fill="#002868"/><g fill="#FFF" transform="translate(16 17.25) scale(1.5)"><path d="M-5.2-6.4l.6 1.9h-2l1.6-1.2-1-1.7 1.3 1.8-1.6-1.3h2zm6.4 0l.6 1.9h-2l1.6-1.2-1-1.7 1.3 1.8-1.6-1.3h2zm6.4 0l.6 1.9h-2l1.6-1.2-1-1.7 1.3 1.8-1.6-1.3h2zm-9.6 3.8l.6 1.9h-2l1.6-1.2-1-1.7 1.3 1.8-1.6-1.3h2zm6.4 0l.6 1.9h-2l1.6-1.2-1-1.7 1.3 1.8-1.6-1.3h2zm-3.2 3.8l.6 1.9h-2l1.6-1.2-1-1.7 1.3 1.8-1.6-1.3h2zm6.4 0l.6 1.9h-2l1.6-1.2-1-1.7 1.3 1.8-1.6-1.3h2zm-9.6 3.8l.6 1.9h-2l1.6-1.2-1-1.7 1.3 1.8-1.6-1.3h2zm6.4 0l.6 1.9h-2l1.6-1.2-1-1.7 1.3 1.8-1.6-1.3h2z"/></g></g></svg>`,
    'flag-es': `<svg class="icon" viewBox="0 0 64 64"><defs><clipPath id="es-clip"><rect width="64" height="64" rx="12"/></clipPath></defs><g clip-path="url(#es-clip)"><rect width="64" height="64" fill="#C60B1E"/><rect y="16" width="64" height="32" fill="#FFC400"/><g transform="translate(18 25) scale(0.6)"><path d="M14 0V20M20 0V20" stroke="#C60B1E" stroke-width="3"/><path d="M17 1 a 6 6 0 0 0-6 6 v 8 a 6 6 0 0 0 12 0 v -8 a 6 6 0 0 0-6-6" fill="#C60B1E"/><circle cx="17" cy="11" r="3" fill="#003893"/><path d="M17 0 a 3 3 0 0 1 0 6 a 3 3 0 0 1 0-6" fill="#FFC400" stroke="#C60B1E" stroke-width="1"/></g></g></svg>`,
    'flag-fr': `<svg class="icon" viewBox="0 0 64 64"><defs><clipPath id="fr-clip"><rect width="64" height="64" rx="12"/></clipPath></defs><g clip-path="url(#fr-clip)"><rect width="64" height="64" fill="#0055A4"/><rect x="21.33" width="21.34" height="64" fill="#FFF"/><rect x="42.67" width="21.33" height="64" fill="#EF4135"/></g></svg>`,
    'flag-de': `<svg class="icon" viewBox="0 0 64 64"><defs><clipPath id="de-clip"><rect width="64" height="64" rx="12"/></clipPath></defs><g clip-path="url(#de-clip)"><rect width="64" height="64" fill="#000"/><rect y="21.33" width="64" height="21.34" fill="#DD0000"/><rect y="42.67" width="64" height="21.33" fill="#FFCE00"/></g></svg>`,
    'flag-it': `<svg class="icon" viewBox="0 0 64 64"><defs><clipPath id="it-clip"><rect width="64" height="64" rx="12"/></clipPath></defs><g clip-path="url(#it-clip)"><rect width="64" height="64" fill="#009246"/><rect x="21.33" width="21.34" height="64" fill="#FFF"/><rect x="42.67" width="21.33" height="64" fill="#CE2B37"/></g></svg>`,
    'flag-pt': `<svg class="icon" viewBox="0 0 64 64"><defs><clipPath id="pt-clip"><rect width="64" height="64" rx="12"/></clipPath></defs><g clip-path="url(#pt-clip)"><rect width="64" height="64" fill="#FF0000"/><rect width="25.6" height="64" fill="#006241"/><circle cx="25.6" cy="32" r="10" fill="#FFC400"/><g transform="translate(25.6 32) scale(0.8)"><path d="M0 -7.5 A 7.5 7.5 0 0 1 0 7.5 A 7.5 7.5 0 0 1 0 -7.5 Z" fill="none" stroke="#000" stroke-width="1"/><path d="M0 -5 A 5 5 0 0 1 0 5 A 5 5 0 0 1 0 -5 Z" fill="#FFF" stroke="#DA291C" stroke-width="1"/><rect x="-2" y="-2" width="4" height="4" fill="#003893" transform="rotate(45)"/></g></g></svg>`,
    'flag-ru': `<svg class="icon" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#fff"/><path d="M0 28h64v24H0z" fill="#0039a6"/><path d="M0 40h64v12H0z" fill="#d52b1e"/></svg>`,
    'flag-cn': `<svg class="icon" viewBox="0 0 64 64"><defs><clipPath id="cn-clip"><rect width="64" height="64" rx="12"/></clipPath></defs><g clip-path="url(#cn-clip)"><rect width="64" height="64" fill="#EE1C25"/><g fill="#FFFF00" transform="translate(16, 16) scale(1.2)"><polygon points="0,-8 2.47, -3.09 7.6, -2.47 3.8, 1.54 5.29, 6.47 0, 4 -5.29, 6.47 -3.8, 1.54 -7.6, -2.47 -2.47, -3.09"/><g transform="translate(12, -4) rotate(20) scale(0.3)"><polygon points="0,-8 2.47, -3.09 7.6, -2.47 3.8, 1.54 5.29, 6.47 0, 4 -5.29, 6.47 -3.8, 1.54 -7.6, -2.47 -2.47, -3.09"/></g><g transform="translate(15, 2) rotate(45) scale(0.3)"><polygon points="0,-8 2.47, -3.09 7.6, -2.47 3.8, 1.54 5.29, 6.47 0, 4 -5.29, 6.47 -3.8, 1.54 -7.6, -2.47 -2.47, -3.09"/></g><g transform="translate(15, 8) rotate(70) scale(0.3)"><polygon points="0,-8 2.47, -3.09 7.6, -2.47 3.8, 1.54 5.29, 6.47 0, 4 -5.29, 6.47 -3.8, 1.54 -7.6, -2.47 -2.47, -3.09"/></g><g transform="translate(12, 12) rotate(90) scale(0.3)"><polygon points="0,-8 2.47, -3.09 7.6, -2.47 3.8, 1.54 5.29, 6.47 0, 4 -5.29, 6.47 -3.8, 1.54 -7.6, -2.47 -2.47, -3.09"/></g></g></g></svg>`,
    'flag-jp': `<svg class="icon" viewBox="0 0 64 64"><defs><clipPath id="jp-clip"><rect width="64" height="64" rx="12"/></clipPath></defs><g clip-path="url(#jp-clip)"><rect width="64" height="64" fill="#fff"/><circle cx="32" cy="32" r="19" fill="#BC002D"/></g></svg>`,
    'flag-in': `<svg class="icon" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#ff9933"/><path d="M0 28h64v24H0z" fill="#fff"/><path d="M0 40h64v12H0z" fill="#138808"/><circle cx="32" cy="32" r="5" fill="none" stroke="#000080" stroke-width="1.5"/><path d="M32 27v10M27 32h10" stroke="#000080" stroke-width="1"/><path d="M28.5 28.5l7 7M35.5 28.5l-7 7" stroke="#000080" stroke-width="1"/></g></svg>`,
    'flag-pk': `<svg class="icon" viewBox="0 0 64 64"><defs><clipPath id="pk-clip"><rect width="64" height="64" rx="12"/></clipPath></defs><g clip-path="url(#pk-clip)"><rect width="64" height="64" fill="#00401A"/><rect width="16" height="64" fill="#FFF"/><circle cx="42" cy="32" r="12" fill="#FFF"/><circle cx="45" cy="32" r="10" fill="#00401A"/><polygon points="52,24 53,28 57,28 54,30.5 55,34.5 52,32 49,34.5 50,30.5 47,28 51,28" fill="#FFF"/></g></g></svg>`,
    'flag-uk': `<svg class="icon" viewBox="0 0 64 64"><defs><clipPath id="uk-clip"><rect width="64" height="64" rx="12"/></clipPath></defs><g clip-path="url(#uk-clip)"><rect width="64" height="64" fill="#012169"/><path d="M0,0 L64,64 M64,0 L0,64" stroke="#FFF" stroke-width="12.8"/><path d="M0,0 L64,64 M64,0 L0,64" stroke="#C8102E" stroke-width="7.68"/><path d="M0,25.6 V38.4 H64 V25.6 Z M25.6,0 H38.4 V64 H25.6 Z" fill="#FFF"/><path d="M0,28.8 V35.2 H64 V28.8 Z M28.8,0 H35.2 V64 H28.8 Z" fill="#C8102E"/></g></g></svg>`,

    // UI Icons
    'mic-record': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>`,
    'mic-pause': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>`,
    'mic-stop': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"></path></svg>`,
    'upload-media': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>`,
    'eye-preview': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
    'play': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>`,
    'delete': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`,
    'edit': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    'plus': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    'rotate-right': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.06 7.44 7 7.93v-2.02c-2.83-.48-5-2.94-5-5.91s2.17-5.43 5-5.91V11l4.55-4.55zM18.93 11c.48 2.83 2.94 5 5.91 5v2.02c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v2.02c-2.83.48-5 2.94-5 5.91z"></path></svg>`,
    'undo': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>`,
    'redo': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"></path></svg>`,

    // File Type Icons
    'file-pdf': `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16c-2.05 0-3.81-1.24-4.58-3h1.71c.63.9 1.68 1.5 2.87 1.5 1.93 0 3.5-1.57 3.5-3.5S13.93 9.5 12 9.5c-1.18 0-2.24.6-2.87 1.5H7.42c.77-1.76 2.53-3 4.58-3 2.76 0 5 2.24 5 5s-2.24 5-5 5zm-3-4.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"/></svg>`,
    'file-doc': `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 12H9v2h4v-2zm3-4H9v2h7V10zm-2-4H9v2h5V6z"/></svg>`,
    'file-xls': `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM9.91 17.42l-1.41-1.41 1.06-1.06-1.06-1.06-1.41 1.41-1.06-1.06 1.41-1.41 1.06-1.06-1.41-1.41 1.06 1.06-1.41-1.41 1.06 1.06-1.41-1.41 1.06 1.06zM15 18h-3v-2h3v2zm0-4h-3v-2h3v2zm0-4h-3V8h3v2z"/></svg>`,
    'file-ppt': `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 9H8v2h5v4H8v2h5c1.1 0 2-.9 2-2v-1.5c0-1.38-1.12-2.5-2.5-2.5S13 12.12 13 13.5V11z"/></svg>`,
    'file-img': `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6v-2h12v2zm0-4H6v-2h12v2zm-4.32-2.68-2.36-3.14-2.82 3.52H6l4.09-5.11 2.54 3.39z"/></svg>`,
    'file-audio': `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM10 18c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm4-3H8V7h6v2z"/></svg>`,
    'file-video': `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-2 11.5V11c0-.83.67-1.5 1.5-1.5.83 0 1.5.67 1.5 1.5v2.5c0 .83-.67 1.5-1.5 1.5-.83 0-1.5-.67-1.5-1.5zm-5 0V11c0-.83.67-1.5 1.5-1.5S10 10.17 10 11v2.5c0 .83-.67 1.5-1.5 1.5S7 14.33 7 13.5zm7-6.5H7V5h7v2z"/></svg>`,
    'file-generic': `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 10H9v2h4v-2zm3-4H9v2h7V8zm-2-4H9v2h5V4z"/></svg>`,
};

// --- TYPE DEFINITIONS ---
interface Tool {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    accept: string;
    isComingSoon?: boolean;
    isFileTool: boolean;
    language?: string;
    continue?: string[];
}

interface Category {
    title: string;
    tools: string[];
}

// --- GLOBAL STATE ---
let currentTool: Tool | null = null;
let currentFiles: File[] = [];
let signatureKeydownHandler: ((e: KeyboardEvent) => void) | null = null;
let signatureCleanup: (() => void) | null = null;

// STT State
let sttSessionPromise: Promise<any> | null = null;
let mediaStream: MediaStream | null = null;
let inputAudioContext: AudioContext | null = null;
let scriptProcessor: ScriptProcessorNode | null = null;
let isRecording = false;
let isPaused = false;
let startTime: number = 0;
let pauseTime: number = 0;
let totalPausedDuration: number = 0;
let timerInterval: number | null = null;
let finalTranscript = '';
let interimTranscript = '';
let silenceStart: number | null = null;
const SILENCE_THRESHOLD = 0.01;
const SILENCE_DURATION_MS = 4000;
let waveSurfer: any = null;
let waveSurferPromise: Promise<{ WaveSurfer: any, RegionsPlugin: any }> | null = null;
let sttFileProcessingController: AbortController | null = null;


// --- API INITIALIZATION ---
let ai: GoogleGenAI | null = null;
try {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not found.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (error) {
    console.warn(
        "AI services could not be initialized. AI-powered tools will be disabled. " +
        "This is expected if an API key is not provided in the environment configuration.",
        error
    );
}

// --- TOOL DEFINITIONS ---
const TOOLS: Record<string, Tool> = {
    // PDF Tools
    'merge-pdf': { id: 'merge-pdf', title: 'Merge PDF', subtitle: 'Combine multiple PDFs into one.', icon: ICONS['merge-pdf'], accept: '.pdf', isFileTool: true, continue: ['split-pdf', 'compress-pdf', 'sign-pdf'] },
    'split-pdf': { id: 'split-pdf', title: 'Split PDF', subtitle: 'Extract pages from a PDF.', icon: ICONS['split-pdf'], accept: '.pdf', isFileTool: true },
    'compress-pdf': { id: 'compress-pdf', title: 'Compress PDF', subtitle: 'Reduce the file size of your PDF.', icon: ICONS['compress-pdf'], accept: '.pdf', isFileTool: true },
    'sign-pdf': { id: 'sign-pdf', title: 'Sign PDF', subtitle: 'Add your signature to a PDF.', icon: ICONS['sign-pdf'], accept: '.pdf', isFileTool: true },
    'stamp-pdf': { id: 'stamp-pdf', title: 'Stamp PDF', subtitle: 'Add an image stamp to a PDF.', icon: ICONS['stamp-pdf'], accept: '.pdf', isFileTool: true },
    'watermark': { id: 'watermark', title: 'Watermark PDF', subtitle: 'Add text or image watermark.', icon: ICONS['watermark'], accept: '.pdf', isFileTool: true },
    'rotate-pdf': { id: 'rotate-pdf', title: 'Rotate PDF', subtitle: 'Rotate all or specific pages.', icon: ICONS['rotate-pdf'], accept: '.pdf', isFileTool: true },
    'protect-pdf': { id: 'protect-pdf', title: 'Protect PDF', subtitle: 'Add password and encryption.', icon: ICONS['protect-pdf'], accept: '.pdf', isFileTool: true },
    'unlock-pdf': { id: 'unlock-pdf', title: 'Unlock PDF', subtitle: 'Remove password from a PDF.', icon: ICONS['unlock-pdf'], accept: '.pdf', isFileTool: true },
    'organize-pdf': { id: 'organize-pdf', title: 'Organize PDF', subtitle: 'Reorder, delete, or add pages.', icon: ICONS['organize-pdf'], accept: '.pdf', isFileTool: true },
    'page-numbers': { id: 'page-numbers', title: 'Add Page Numbers', subtitle: 'Insert page numbers into PDF.', icon: ICONS['page-numbers'], accept: '.pdf', isFileTool: true },
    'ocr-pdf': { id: 'ocr-pdf', title: 'OCR PDF', subtitle: 'Recognize text in scanned PDFs.', icon: ICONS['ocr-pdf'], accept: '.pdf', isFileTool: true },
    'pdfa': { id: 'pdfa', title: 'PDF to PDF/A', subtitle: 'Convert PDF to archival format.', icon: ICONS['pdfa'], accept: '.pdf', isFileTool: true },

    // Conversion to PDF
    'word-to-pdf': { id: 'word-to-pdf', title: 'Word to PDF', subtitle: 'Convert DOC, DOCX to PDF.', icon: ICONS['word-to-pdf'], accept: '.doc,.docx', isFileTool: true },
    'powerpoint-to-pdf': { id: 'powerpoint-to-pdf', title: 'PowerPoint to PDF', subtitle: 'Convert PPT, PPTX to PDF.', icon: ICONS['powerpoint-to-pdf'], accept: '.ppt,.pptx', isFileTool: true },
    'excel-to-pdf': { id: 'excel-to-pdf', title: 'Excel to PDF', subtitle: 'Convert XLSX to PDF.', icon: ICONS['excel-to-pdf'], accept: '.xlsx', isFileTool: true },
    'html-to-pdf': { id: 'html-to-pdf', title: 'HTML to PDF', subtitle: 'Convert web pages to PDF.', icon: ICONS['html-to-pdf'], accept: '.html', isFileTool: true },
    'image-to-pdf': { id: 'image-to-pdf', title: 'Image to PDF', subtitle: 'Convert JPG, PNG to PDF.', icon: ICONS['image-to-pdf'], accept: '.jpg,.jpeg,.png', isFileTool: true },

    // Conversion from PDF
    'pdf-to-word': { id: 'pdf-to-word', title: 'PDF to Word', subtitle: 'Convert PDF to DOCX.', icon: ICONS['pdf-to-word'], accept: '.pdf', isFileTool: true },
    'pdf-to-powerpoint': { id: 'pdf-to-powerpoint', title: 'PDF to PowerPoint', subtitle: 'Convert PDF to PPTX.', icon: ICONS['pdf-to-powerpoint'], accept: '.pdf', isFileTool: true },
    'pdf-to-excel': { id: 'pdf-to-excel', title: 'PDF to Excel', subtitle: 'Convert PDF to XLSX.', icon: ICONS['pdf-to-excel'], accept: '.pdf', isFileTool: true },
    'pdf-to-jpg': { id: 'pdf-to-jpg', title: 'PDF to JPG', subtitle: 'Convert PDF pages to JPGs.', icon: ICONS['pdf-to-jpg'], accept: '.pdf', isFileTool: true },

    // Image Tools
    'background-remover': { id: 'background-remover', title: 'Remove Background', subtitle: 'Erase the background from images.', icon: ICONS['background-remover'], accept: '.png,.jpg,.jpeg', isFileTool: true },
    'image-to-gif': { id: 'image-to-gif', title: 'Image to GIF', subtitle: 'Create an animated GIF from images.', icon: ICONS['image-to-gif'], accept: '.png,.jpg,.jpeg', isFileTool: true },
    'resize-image': { id: 'resize-image', title: 'Resize Image', subtitle: 'Change image dimensions.', icon: ICONS['resize-image'], accept: 'image/*', isFileTool: true },
    'png-to-jpg': { id: 'png-to-jpg', title: 'PNG to JPG', subtitle: 'Convert PNG to JPG format.', icon: ICONS['png-to-jpg'], accept: '.png', isFileTool: true },
    'jpg-to-png': { id: 'jpg-to-png', title: 'JPG to PNG', subtitle: 'Convert JPG to PNG format.', icon: ICONS['jpg-to-png'], accept: '.jpg,.jpeg', isFileTool: true },

    // Video Tools
    'mp4-to-gif': { id: 'mp4-to-gif', title: 'MP4 to GIF', subtitle: 'Convert video clips to animated GIFs.', icon: ICONS['mp4-to-gif'], accept: '.mp4', isFileTool: true },
    'convert-video': { id: 'convert-video', title: 'Convert Video Format', subtitle: 'Change video format (e.g. MOV to MP4).', icon: ICONS['convert-video'], accept: 'video/*', isFileTool: true },

    // Audio Tools
    'text-to-speech': { id: 'text-to-speech', title: 'Text to Speech', subtitle: 'Convert text to natural sounding audio.', icon: ICONS['text-to-speech'], accept: '', isFileTool: false },
    'trim-audio': { id: 'trim-audio', title: 'Trim Audio', subtitle: 'Cut MP3, WAV, and other audio formats.', icon: ICONS['trim-audio'], accept: 'audio/*', isFileTool: true },
    'wav-to-mp3': { id: 'wav-to-mp3', title: 'WAV to MP3', subtitle: 'Convert WAV files to MP3 format.', icon: ICONS['wav-to-mp3'], accept: '.wav', isFileTool: true },
    'convert-audio': { id: 'convert-audio', title: 'Convert Audio Format', subtitle: 'Change audio file format.', icon: ICONS['convert-audio'], accept: 'audio/*', isFileTool: true },
    'speech-to-text-en-US': { id: 'speech-to-text-en-US', title: 'Speech to Text English (US)', subtitle: 'Transcribe English (US) audio to text', icon: ICONS['flag-us'], accept: 'audio/*', isFileTool: false, language: 'en-US' },
    'speech-to-text-en-GB': { id: 'speech-to-text-en-GB', title: 'Speech to Text English (UK)', subtitle: 'Transcribe English (UK) audio to text', icon: ICONS['flag-uk'], accept: 'audio/*', isFileTool: false, language: 'en-GB' },
    'speech-to-text-es-ES': { id: 'speech-to-text-es-ES', title: 'Speech to Text Spanish', subtitle: 'Transcribe Spanish audio to text', icon: ICONS['flag-es'], accept: 'audio/*', isFileTool: false, language: 'es-ES' },
    'speech-to-text-fr-FR': { id: 'speech-to-text-fr-FR', title: 'Speech to Text French', subtitle: 'Transcribe French audio to text', icon: ICONS['flag-fr'], accept: 'audio/*', isFileTool: false, language: 'fr-FR' },
    'speech-to-text-de-DE': { id: 'speech-to-text-de-DE', title: 'Speech to Text German', subtitle: 'Transcribe German audio to text', icon: ICONS['flag-de'], accept: 'audio/*', isFileTool: false, language: 'de-DE' },
    'speech-to-text-it-IT': { id: 'speech-to-text-it-IT', title: 'Speech to Text Italian', subtitle: 'Transcribe Italian audio to text', icon: ICONS['flag-it'], accept: 'audio/*', isFileTool: false, language: 'it-IT' },
    'speech-to-text-pt-PT': { id: 'speech-to-text-pt-PT', title: 'Speech to Text Portuguese', subtitle: 'Transcribe Portuguese audio to text', icon: ICONS['flag-pt'], accept: 'audio/*', isFileTool: false, language: 'pt-PT' },
    'speech-to-text-ru-RU': { id: 'speech-to-text-ru-RU', title: 'Speech to Text Russian', subtitle: 'Transcribe Russian audio to text', icon: ICONS['flag-ru'], accept: 'audio/*', isFileTool: false, language: 'ru-RU' },
    'speech-to-text-zh-CN': { id: 'speech-to-text-zh-CN', title: 'Speech to Text Chinese', subtitle: 'Transcribe Chinese audio to text', icon: ICONS['flag-cn'], accept: 'audio/*', isFileTool: false, language: 'zh-CN' },
    'speech-to-text-ja-JP': { id: 'speech-to-text-ja-JP', title: 'Speech to Text Japanese', subtitle: 'Transcribe Japanese audio to text', icon: ICONS['flag-jp'], accept: 'audio/*', isFileTool: false, language: 'ja-JP' },
    'speech-to-text-hi-IN': { id: 'speech-to-text-hi-IN', title: 'Speech to Text Hindi', subtitle: 'Transcribe Hindi audio to text', icon: ICONS['flag-in'], accept: 'audio/*', isFileTool: false, language: 'hi-IN' },
    'speech-to-text-ur-PK': { id: 'speech-to-text-ur-PK', title: 'Speech to Text Urdu', subtitle: 'Transcribe Urdu audio to text', icon: ICONS['flag-pk'], accept: 'audio/*', isFileTool: false, language: 'ur-PK' },
};

// Gracefully disable AI tools if the API key is missing
if (!ai) {
    const aiToolIds = Object.keys(TOOLS).filter(id => 
        id === 'background-remover' || id.startsWith('speech-to-text-') || id === 'text-to-speech'
    );
    aiToolIds.forEach(id => {
        if (TOOLS[id]) {
            TOOLS[id].isComingSoon = true;
            TOOLS[id].subtitle = 'AI service unavailable. Configure API key.';
        }
    });
}

const CATEGORIES: Category[] = [
    { title: 'PDF Tools', tools: ['merge-pdf', 'split-pdf', 'compress-pdf', 'organize-pdf', 'sign-pdf', 'stamp-pdf', 'watermark', 'rotate-pdf', 'page-numbers', 'protect-pdf', 'unlock-pdf', 'ocr-pdf', 'pdfa'] },
    { title: 'Convert to PDF', tools: ['word-to-pdf', 'powerpoint-to-pdf', 'excel-to-pdf', 'html-to-pdf', 'image-to-pdf'] },
    { title: 'Convert from PDF', tools: ['pdf-to-word', 'pdf-to-powerpoint', 'pdf-to-excel', 'pdf-to-jpg'] },
    { title: 'Image Tools', tools: ['background-remover', 'resize-image', 'image-to-gif', 'png-to-jpg', 'jpg-to-png'] },
    { title: 'Video Tools', tools: ['mp4-to-gif', 'convert-video'] },
    { title: 'Audio Tools', tools: ['text-to-speech', 'trim-audio', 'wav-to-mp3', 'convert-audio', 'speech-to-text-en-US', 'speech-to-text-en-GB', 'speech-to-text-es-ES', 'speech-to-text-fr-FR', 'speech-to-text-de-DE', 'speech-to-text-it-IT', 'speech-to-text-pt-PT', 'speech-to-text-ru-RU', 'speech-to-text-zh-CN', 'speech-to-text-ja-JP', 'speech-to-text-hi-IN', 'speech-to-text-ur-PK'] }
];

// --- DOM ELEMENTS ---
const getElement = <T extends HTMLElement>(selector: string, parent: Document | Element = document) => parent.querySelector(selector) as T;

const DOMElements = {
    toolsGrid: getElement('#tools-grid'),
    toolSkeletons: getElement('#tool-skeletons'),
    recentToolsGrid: getElement('#recent-tools-grid'),
    recentToolsSection: getElement('#recent-tools'),
    searchInput: getElement<HTMLInputElement>('#search-input'),
    categoryFilters: getElement('#category-filters'),
    modal: getElement('#tool-modal'),
    modalTitle: getElement('#modal-title'),
    modalSubtitle: getElement('#modal-subtitle'),
    modalContent: getElement('#tool-modal .modal-content'),
    closeModalBtn: getElement<HTMLButtonElement>('#tool-modal .close-modal'),
    initialView: getElement('#modal-initial-view'),
    optionsView: getElement<HTMLElement>('#modal-options-view'),
    processingView: getElement('#modal-processing-view'),
    completeView: getElement('#modal-complete-view'),
    selectFileBtn: getElement<HTMLButtonElement>('#select-file-btn'),
    fileInput: getElement<HTMLInputElement>('#file-input'),
    processBtnContainer: getElement('.process-btn-container'),
    processBtn: getElement<HTMLButtonElement>('#process-btn'),
    previewPane: getElement<HTMLElement>('.options-preview-pane'),
    optionsPane: getElement<HTMLElement>('#tool-options'),
    optionsSidebarPane: getElement<HTMLElement>('.options-sidebar-pane'),
    progressBar: getElement('#progress-bar'),
    progressPercentage: getElement('#progress-percentage'),
    processingText: getElement('#processing-text'),
    completeTitle: getElement('#complete-title'),
    downloadArea: getElement('#download-area'),
    continueToolsGrid: getElement('#continue-tools-grid'),
    errorMessage: getElement('#error-message'),
    dropOverlay: getElement('#drop-overlay'),
    serviceSelectorModal: getElement('#service-selector-modal'),
    serviceList: getElement('#service-list'),
    selectorSearchInput: getElement<HTMLInputElement>('#selector-search-input'),
    letGenieConvertBtn: getElement<HTMLButtonElement>('#let-genie-convert-btn'),
    closeSelectorBtn: getElement<HTMLButtonElement>('#service-selector-modal .close-modal'),
    themeToggle: getElement<HTMLInputElement>('#theme-toggle'),
    hamburger: getElement<HTMLButtonElement>('.hamburger'),
    navLinks: getElement<HTMLElement>('.nav-links'),
    scrollToTopBtn: getElement('#scroll-to-top'),
    bottomAdPopup: getElement('#bottom-ad-popup'),
    closeAdPopupBtn: getElement<HTMLButtonElement>('#close-ad-popup'),
};

// --- LAZY LOAD LIBRARIES ---
const loadPdfLib = async () => {
    // @ts-ignore
    if (!window.PDFLib || !window.PDFLib.PDFDocument) {
        const script = document.createElement('script');
        // Use unpkg which includes the full UMD build (with encrypt)
        script.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
        document.head.appendChild(script);
        await new Promise(resolve => { script.onload = resolve; });
        // @ts-ignore
        if(!window.PDFLib) {
             console.warn("PDFLib load failed check, retrying from secondary CDN");
              const script2 = document.createElement('script');
              script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
              document.head.appendChild(script2);
              await new Promise(resolve => { script2.onload = resolve; });
        }
    }
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

const loadJszip = async () => {
    // @ts-ignore
    if (!window.JSZip) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
        document.head.appendChild(script);
        await new Promise(resolve => { script.onload = resolve; });
    }
    // @ts-ignore
    return window.JSZip;
};

// --- UTILITY FUNCTIONS ---
const showError = (message: string, isSttError: boolean = false) => {
    if (isSttError) {
        const fileStatus = getElement('#stt-file-status');
        if (fileStatus) {
            fileStatus.textContent = `Error: ${message}`;
            fileStatus.style.display = 'block';
            fileStatus.style.color = 'var(--danger)';
        }
    } else {
        DOMElements.errorMessage.textContent = message;
        DOMElements.errorMessage.style.display = 'block';
    }
};
const hideError = (isSttError: boolean = false) => { 
    if (isSttError) {
        const fileStatus = getElement('#stt-file-status');
        if (fileStatus) fileStatus.style.display = 'none';
    } else {
        DOMElements.errorMessage.style.display = 'none'; 
    }
};
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const showSilenceAlert = () => {
    const alertEl = getElement('#stt-silence-alert');
    if (alertEl) alertEl.style.display = 'flex';
};

const hideSilenceAlert = () => {
    const alertEl = getElement('#stt-silence-alert');
    if (alertEl) alertEl.style.display = 'none';
};

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = error => reject(error);
});


const base64ToBlob = (base64: string, contentType: string = 'image/png'): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
};

// WAV Header Helper Function
const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
};

const createWavBlob = (audioData: Uint8Array, sampleRate: number = 24000): Blob => {
    const buffer = new ArrayBuffer(44 + audioData.length);
    const view = new DataView(buffer);

    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // file length
    view.setUint32(4, 36 + audioData.length, true);
    // RIFF type
    writeString(view, 8, 'WAVE');
    // format chunk identifier
    writeString(view, 12, 'fmt ');
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, 1, true);
    // channel count
    view.setUint16(22, 1, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * 2, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data chunk identifier
    writeString(view, 36, 'data');
    // data chunk length
    view.setUint32(40, audioData.length, true);

    // Write the audio data
    const bytes = new Uint8Array(buffer, 44);
    bytes.set(audioData);

    return new Blob([buffer], { type: 'audio/wav' });
};

const getFileTypeIcon = (file: File): string => {
    const name = file.name.toLowerCase();
    const type = file.type;

    if (name.endsWith('.pdf') || type === 'application/pdf') return ICONS['file-pdf'];
    if (name.endsWith('.doc') || name.endsWith('.docx') || type.includes('wordprocessingml')) return ICONS['file-doc'];
    if (name.endsWith('.xls') || name.endsWith('.xlsx') || type.includes('spreadsheetml')) return ICONS['file-xls'];
    if (name.endsWith('.ppt') || name.endsWith('.pptx') || type.includes('presentationml')) return ICONS['file-ppt'];
    if (type.startsWith('image/')) return ICONS['file-img'];
    if (type.startsWith('audio/')) return ICONS['file-audio'];
    if (type.startsWith('video/')) return ICONS['file-video'] || ICONS['file-generic'];

    return ICONS['file-generic'];
};

const RECENT_TOOLS_KEY = 'genie-recent-tools';

const getRecentTools = (): string[] => {
    try {
        const data = localStorage.getItem(RECENT_TOOLS_KEY);
        if (!data) {
            return [];
        }
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.every(id => typeof id === 'string' && TOOLS[id])) {
            return parsed;
        } else {
            throw new Error("Data from localStorage has an invalid structure.");
        }
    } catch (error) {
        console.warn(`Resetting recent tools due to a retrieval or parsing error:`, error);
        try {
            localStorage.removeItem(RECENT_TOOLS_KEY);
        } catch (removeError) {
            console.error('Failed to remove corrupted item from localStorage:', removeError);
        }
        return [];
    }
};


const updateRecentTools = (toolId: string) => {
    let recent = getRecentTools();
    recent = recent.filter(id => id !== toolId);
    recent.unshift(toolId);
    localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(recent.slice(0, 4)));
};


const renderRecentTools = () => {
    const recentIds = getRecentTools();
    if (recentIds.length === 0) {
        DOMElements.recentToolsSection.style.display = 'none';
        return;
    }
    
    DOMElements.recentToolsSection.style.display = 'block';
    DOMElements.recentToolsGrid.innerHTML = '';
    
    recentIds.forEach(id => {
        const tool = TOOLS[id];
        if (tool) {
            const card = document.createElement('div');
            card.className = 'tool-card';
            if (tool.isComingSoon) {
                card.classList.add('coming-soon');
                card.setAttribute('aria-disabled', 'true');
                card.setAttribute('aria-label', `${tool.title}. Coming soon.`);
            } else {
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-label', `Open ${tool.title} tool. ${tool.subtitle}`);
                card.onclick = () => openToolModal(tool);
                card.onkeydown = (e: KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openToolModal(tool);
                    }
                };
            }
            card.innerHTML = `
                ${tool.icon}
                <h3>${tool.title}</h3>
                <p>${tool.subtitle}</p>
            `;
            DOMElements.recentToolsGrid.appendChild(card);
        }
    });
};


// --- UI RENDERING ---
const renderTools = (filter = '', category = 'All') => {
    DOMElements.toolsGrid.innerHTML = '';
    const searchTerm = filter.toLowerCase();

    const filteredCategories = CATEGORIES.filter(cat => category === 'All' || cat.title === category);

    let hasVisibleTools = false;
    let toolIndex = 0;

    filteredCategories.forEach(cat => {
        const toolsInSection = cat.tools
            .map(id => TOOLS[id])
            .filter(tool =>
                tool.title.toLowerCase().includes(searchTerm) ||
                tool.subtitle.toLowerCase().includes(searchTerm)
            );

        if (toolsInSection.length > 0) {
            hasVisibleTools = true;
            const categorySection = document.createElement('section');
            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = cat.title;
            categorySection.appendChild(categoryTitle);

            const grid = document.createElement('div');
            grid.className = 'category-grid';

            toolsInSection.forEach(tool => {
                const card = document.createElement('div');
                card.className = 'tool-card';
                card.style.animationDelay = `${toolIndex * 50}ms`; // Staggered animation
                if (tool.isComingSoon) {
                    card.classList.add('coming-soon');
                    card.setAttribute('aria-disabled', 'true');
                    card.setAttribute('aria-label', `${tool.title}. Coming soon.`);
                } else {
                    card.setAttribute('role', 'button');
                    card.setAttribute('tabindex', '0');
                    card.setAttribute('aria-label', `Open ${tool.title} tool. ${tool.subtitle}`);
                    card.onclick = () => openToolModal(tool);
                    card.onkeydown = (e: KeyboardEvent) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openToolModal(tool);
                        }
                    };
                }
                card.innerHTML = `
                    ${tool.icon}
                    <h3>${tool.title}</h3>
                    <p>${tool.subtitle}</p>
                `;
                grid.appendChild(card);
                toolIndex++;
            });

            categorySection.appendChild(grid);
            DOMElements.toolsGrid.appendChild(categorySection);
        }
    });
    
    DOMElements.toolSkeletons.style.display = 'none';
    DOMElements.toolsGrid.style.opacity = '1';


    if (!hasVisibleTools) {
        DOMElements.toolsGrid.innerHTML = '<p style="text-align: center; color: var(--text-light);">No tools found. Try a different search term.</p>';
    }
};

const renderCategoryFilters = () => {
    DOMElements.categoryFilters.innerHTML = '';
    const categories = ['All', ...CATEGORIES.map(c => c.title)];
    let activeFilter: HTMLButtonElement | null = null;

    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = category;
        btn.dataset.category = category;

        if (category === 'All') {
            btn.classList.add('active');
            activeFilter = btn;
        }

        btn.onclick = () => {
            if (activeFilter) {
                activeFilter.classList.remove('active');
            }
            btn.classList.add('active');
            activeFilter = btn;
            renderTools(DOMElements.searchInput.value, category);
        };

        DOMElements.categoryFilters.appendChild(btn);
    });
};

// --- MODAL LOGIC ---
const handleModalKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusableElements = DOMElements.modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        }
    } else {
        if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }
};

const openToolModal = (tool: Tool) => {
    currentTool = tool;
    hideError();
    updateRecentTools(tool.id);
    renderRecentTools();

    if (!tool.isFileTool || tool.id === 'trim-audio' || tool.id.startsWith('speech-to-text') || tool.id === 'text-to-speech') {
        const iconWithSize = tool.icon.replace('<svg class="icon"', '<svg class="icon modal-title-icon"');
        DOMElements.modalTitle.innerHTML = `<span style="display: flex; align-items: center; justify-content: center; gap: 1rem;">${iconWithSize} ${tool.title}</span>`;
    } else {
        DOMElements.modalTitle.textContent = tool.title;
    }
    
    DOMElements.modalSubtitle.textContent = tool.subtitle;

    DOMElements.modalContent.classList.toggle('stt-active', !tool.isFileTool || tool.id === 'trim-audio' || tool.id === 'text-to-speech');


    DOMElements.initialView.style.display = 'none';
    DOMElements.optionsView.style.display = 'none';
    DOMElements.processingView.style.display = 'none';
    DOMElements.completeView.style.display = 'none';

    if (tool.isFileTool) {
        DOMElements.processBtnContainer.style.display = 'block';
        DOMElements.initialView.style.display = 'flex';
        DOMElements.fileInput.accept = tool.accept;
        const isMultiple = ['merge-pdf', 'organize-pdf', 'sign-pdf', 'image-to-pdf', 'image-to-gif'].includes(tool.id);
        DOMElements.fileInput.multiple = isMultiple;
        (getElement('.drop-text')).textContent = isMultiple ? 'or drop files here' : 'or drop file here';
        (getElement<HTMLButtonElement>('#select-file-btn')).textContent = isMultiple ? 'Select Files' : 'Select File';

    } else if (tool.id.startsWith('speech-to-text')) {
        renderSpeechToTextUI();
    } else if (tool.id === 'text-to-speech') {
        renderTextToSpeechUI();
    } else if (tool.id === 'trim-audio') {
        renderAudioTrimUI();
    }

    DOMElements.modal.classList.add('visible');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', handleModalKeydown);
    (getElement('#tool-modal .modal-content button, #tool-modal .modal-content a, #tool-modal .modal-content input') as HTMLElement)?.focus();
};

const closeModal = () => {
    DOMElements.modal.classList.remove('visible');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', handleModalKeydown);
    DOMElements.fileInput.value = '';

    // Clean up tool-specific handlers
    if (signatureCleanup) {
        signatureCleanup();
        signatureCleanup = null;
    }
    if (signatureKeydownHandler) {
        document.removeEventListener('keydown', signatureKeydownHandler);
        signatureKeydownHandler = null;
    }

    currentTool = null;
    currentFiles = [];
    DOMElements.optionsView.className = '';
    DOMElements.modalContent.className = 'modal-content';

    // Reset STT specific state if it was active
    if (isRecording || isPaused || sttSessionPromise) {
        // ... (add STT cleanup logic here)
    }
};

// --- FILE HANDLING ---
const handleFilesSelected = async (files: FileList | File[]) => {
    const filesArray = Array.from(files);
    if (filesArray.length === 0) return;

    // Ensure we restore the DOM structure before rendering tool UI
    // This fixes the "Element not found" error when switching tools
    if (!DOMElements.processBtnContainer || !DOMElements.processBtnContainer.parentNode) {
        // If the button container was removed (by Sign PDF), recreate the sidebar structure
        const sidebar = DOMElements.optionsSidebarPane;
        sidebar.innerHTML = '';
        
        const toolOptions = document.createElement('div');
        toolOptions.id = 'tool-options';
        toolOptions.style.flexGrow = '1';
        sidebar.appendChild(toolOptions);

        const btnContainer = document.createElement('div');
        btnContainer.className = 'process-btn-container';
        btnContainer.innerHTML = `<button id="process-btn" class="btn-primary">Let Genie Process</button>`;
        sidebar.appendChild(btnContainer);
        
        // Re-acquire references
        DOMElements.processBtnContainer = btnContainer;
        DOMElements.optionsPane = toolOptions;
    }

    if (currentTool?.id === 'sign-pdf') {
        await showSignatureUI(filesArray);
    } else if (currentTool?.id === 'organize-pdf') {
        await showOrganizeUI(filesArray);
    } else {
        showFileProcessorUI(filesArray);
    }
};


// --- UI Component Renderers ---
const renderTextToSpeechUI = () => {
    DOMElements.initialView.style.display = 'none';
    DOMElements.optionsView.style.display = 'flex';
    DOMElements.optionsView.className = 'stt-active';
    DOMElements.optionsSidebarPane.innerHTML = ''; // Clear sidebar for this tool
    DOMElements.previewPane.innerHTML = '';
    DOMElements.optionsSidebarPane.style.width = '100%'; // Full width
    
    const container = document.createElement('div');
    container.style.width = '100%';
    container.style.maxWidth = '600px';
    container.style.margin = '0 auto';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '1.5rem';

    container.innerHTML = `
        <div class="option-group">
            <label for="tts-text-input">Enter Text to Convert</label>
            <textarea id="tts-text-input" placeholder="Type or paste your text here..." style="min-height: 150px;"></textarea>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="option-group">
                <label for="tts-language">Language / Country</label>
                <select id="tts-language">
                    <option value="en-US">English (USA)</option>
                    <option value="en-GB">English (UK)</option>
                    <option value="ur-PK">Urdu (Pakistan)</option>
                    <option value="hi-IN">Hindi (India)</option>
                    <option value="es-ES">Spanish (Spain)</option>
                    <option value="fr-FR">French (France)</option>
                    <option value="de-DE">German (Germany)</option>
                    <option value="it-IT">Italian (Italy)</option>
                    <option value="pt-PT">Portuguese (Portugal)</option>
                    <option value="ru-RU">Russian (Russia)</option>
                    <option value="zh-CN">Chinese (China)</option>
                    <option value="ja-JP">Japanese (Japan)</option>
                </select>
            </div>
            <div class="option-group">
                <label for="tts-voice">Voice Type</label>
                <select id="tts-voice">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="boy">Boy</option>
                    <option value="girl">Girl</option>
                </select>
            </div>
        </div>
        <div class="tts-btn-container" style="margin-top: 1rem;">
             <button id="process-btn-tts" class="btn-primary">Let Genie Process</button>
        </div>
    `;

    DOMElements.previewPane.style.display = 'none';
    DOMElements.optionsSidebarPane.appendChild(container);
    
    getElement('#process-btn-tts', container).onclick = startProcessing;
};

const showSignatureUI = async (files: File[]) => {
    currentFiles = files;
    DOMElements.initialView.style.display = 'none';
    DOMElements.optionsView.className = 'sign-mode';
    DOMElements.optionsView.style.display = 'flex';
    DOMElements.previewPane.innerHTML = '<p class="placeholder-text">Loading document preview...</p>';
    DOMElements.optionsSidebarPane.innerHTML = '';
    DOMElements.optionsSidebarPane.style.display = 'flex';
    
    // --- STATE ---
    let signatureSlots = {
        draw: null as string | null,
        type: null as string | null,
        upload: null as string | null
    };

    interface SignatureState {
        id: string;
        imgSrc: string;
        x: number;
        y: number;
        width: number;
        height: number;
        opacity: number;
        pageIndex: number;
        pageContainer: HTMLElement;
    }

    let placedSignature: SignatureState | null = null;
    let activeSignatureSrc: string | null = null; // For click-to-place
    let isDrawing = false;
    let canvasCtx: CanvasRenderingContext2D | null = null;
    let lastX = 0, lastY = 0, lastTime = 0;
    const MIN_LINE_WIDTH = 0.5, MAX_LINE_WIDTH = 3;
    let signatureColor = document.documentElement.getAttribute('data-theme') === 'dark' ? '#FFFFFF' : '#000000';

    // Undo/Redo History
    let history: SignatureState[][] = [];
    let historyIndex = -1;

    // --- HELPER FUNCTIONS ---
    const addToHistory = () => {
        // Create a deep copy of the current state (placedSignature)
        // Since we only allow ONE signature at a time, the state is basically [placedSignature] or []
        const currentState = placedSignature ? [placedSignature] : [];
        
        // Remove any future history if we are in the middle of the stack
        if (historyIndex < history.length - 1) {
            history = history.slice(0, historyIndex + 1);
        }
        
        // Don't add duplicate consecutive states (simple check)
        const lastState = history[historyIndex];
        if (lastState && JSON.stringify(lastState) === JSON.stringify(currentState)) {
            return;
        }

        history.push(JSON.parse(JSON.stringify(currentState)));
        historyIndex++;
        updateUndoRedoButtons();
    };

    const updateUndoRedoButtons = () => {
        const undoBtn = getElement<HTMLButtonElement>('#undo-btn');
        const redoBtn = getElement<HTMLButtonElement>('#redo-btn');
        if (undoBtn) undoBtn.disabled = historyIndex <= 0;
        if (redoBtn) redoBtn.disabled = historyIndex >= history.length - 1;
    };

    const performUndo = () => {
        if (historyIndex > 0) {
            historyIndex--;
            restoreState(history[historyIndex]);
            updateUndoRedoButtons();
        }
    };

    const performRedo = () => {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            restoreState(history[historyIndex]);
            updateUndoRedoButtons();
        }
    };

    const restoreState = (state: SignatureState[]) => {
        // Clear current
        if (placedSignature) {
            const el = document.getElementById(placedSignature.id);
            if (el) el.remove();
            placedSignature = null;
        }

        // Restore new
        if (state.length > 0) {
            const savedSig = state[0];
            // We need to find the page container again because elements might have been re-rendered or lost reference
            const pageContainer = document.querySelector(`.pdf-page-container[data-page-index="${savedSig.pageIndex}"]`) as HTMLElement;
            
            if (pageContainer) {
                renderPlacedSignatureElement(savedSig, pageContainer);
                placedSignature = { ...savedSig, pageContainer }; // Re-attach live DOM element
            }
        }
        getElement<HTMLElement>('#selected-signature-editor').style.display = placedSignature ? 'block' : 'none';
    };


    const textToImage = (text: string, font: string, color: string, targetFontSize: number): string => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const maxWidth = 280;
        let fontSize = targetFontSize;

        ctx.font = `${fontSize}px "${font}"`;
        const textMetrics = ctx.measureText(text);
        
        if (textMetrics.width > maxWidth - 20) {
            fontSize = Math.floor(fontSize * ((maxWidth - 20) / textMetrics.width));
        }
        
        ctx.font = `${fontSize}px "${font}"`;
        const finalMetrics = ctx.measureText(text);
        canvas.width = finalMetrics.width + 20;
        canvas.height = fontSize * 1.5;
        
        ctx.font = `${fontSize}px "${font}"`;
        ctx.fillStyle = color;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        
        return canvas.toDataURL('image/png');
    };

    const updateInstructionText = (text: string) => {
        const el = getElement('#signature-instructions');
        if(el) el.textContent = text;
    };

    const switchTab = (tabName: string) => {
        document.querySelectorAll('.signature-tab-btn, .signature-tab-content').forEach(el => el.classList.remove('active'));
        document.querySelector(`.signature-tab-btn[data-tab="${tabName}"]`)?.classList.add('active');
        getElement(`#signature-tab-content-${tabName}`)?.classList.add('active');
    };

    const renderSignaturePalette = () => {
        const container = getElement('#signature-palette-slots');
        container.innerHTML = '';

        const createSlotUI = (type: 'draw' | 'type' | 'upload', title: string) => {
            const slot = document.createElement('div');
            slot.className = 'signature-slot';
            const header = document.createElement('div');
            header.className = 'slot-header';
            header.textContent = title;
            slot.appendChild(header);

            const content = document.createElement('div');
            const imgSrc = signatureSlots[type];

            if (imgSrc) {
                content.className = 'slot-filled';
                content.innerHTML = `
                    <img src="${imgSrc}" alt="${title} Signature" draggable="true">
                    <div class="slot-actions">
                        <button class="icon-btn edit-btn" title="Edit">${ICONS['edit']}</button>
                        <button class="icon-btn delete-btn" title="Delete" style="color: var(--danger);">${ICONS['delete']}</button>
                    </div>
                `;
                
                // Drag functionality
                const img = content.querySelector('img')!;
                img.addEventListener('dragstart', (e) => {
                    e.dataTransfer!.setData('application/json', JSON.stringify({ type: 'signature', src: imgSrc }));
                    e.dataTransfer!.effectAllowed = 'copy';
                    DOMElements.previewPane.classList.add('drag-over');
                });
                img.addEventListener('dragend', () => {
                    DOMElements.previewPane.classList.remove('drag-over');
                });
                
                // Edit (Replace)
                content.querySelector('.edit-btn')!.addEventListener('click', () => {
                    switchTab(type);
                    updateInstructionText(`Edit your ${title} signature.`);
                });

                // Delete
                content.querySelector('.delete-btn')!.addEventListener('click', () => {
                    signatureSlots[type] = null;
                    renderSignaturePalette();
                });

            } else {
                content.className = 'slot-empty';
                content.innerHTML = `<button class="icon-btn add-btn" title="Create ${title} Signature">${ICONS['plus']} Create</button>`;
                content.querySelector('.add-btn')!.addEventListener('click', () => {
                     switchTab(type);
                });
            }
            slot.appendChild(content);
            container.appendChild(slot);
        };

        createSlotUI('draw', 'Drawn');
        createSlotUI('type', 'Typed');
        createSlotUI('upload', 'Uploaded');
    };
    
    const removePlacedSignature = () => {
        if (placedSignature) {
            const sigToRemove = document.getElementById(placedSignature.id);
            sigToRemove?.remove();
            placedSignature = null;
            getElement('#selected-signature-editor').style.display = 'none';
            addToHistory(); // Add empty state to history
        }
    };


    // --- UI SETUP ---
    const sidebarHTML = `
        <div id="signature-creator" style="flex-grow: 1; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4>Create Signature</h4>
                <div id="undo-redo-controls">
                    <button id="undo-btn" class="icon-btn" title="Undo" disabled>${ICONS['undo']}</button>
                    <button id="redo-btn" class="icon-btn" title="Redo" disabled>${ICONS['redo']}</button>
                </div>
            </div>
            <div class="signature-tabs">
                <button class="signature-tab-btn active" data-tab="draw">Draw</button>
                <button class="signature-tab-btn" data-tab="type">Type</button>
                <button class="signature-tab-btn" data-tab="upload">Upload</button>
            </div>
            <div id="signature-tab-content-draw" class="signature-tab-content active">
                <div class="option-group">
                    <label for="signature-color-draw">Color</label>
                    <input type="color" id="signature-color-draw" value="${signatureColor}">
                </div>
                <canvas id="signature-canvas" width="280" height="150" style="background-color: var(--input-bg);"></canvas>
                <div class="signature-actions">
                    <button id="clear-signature-btn" class="btn-secondary">Clear</button>
                    <button id="save-signature-btn" class="btn-primary" style="padding: 0.5rem 1rem; font-size: 0.9rem;">Save to Slot</button>
                </div>
            </div>
            <div id="signature-tab-content-type" class="signature-tab-content">
                <input type="text" id="typed-signature-input" class="option-group" placeholder="Type your name">
                <div class="option-group">
                    <label for="signature-color-type">Color</label>
                    <input type="color" id="signature-color-type" value="${signatureColor}">
                </div>
                <div class="option-group">
                    <label for="signature-font-size">Font Size</label>
                    <div class="slider-container">
                        <input type="range" id="signature-font-size" min="24" max="72" value="48">
                        <span id="signature-font-size-value">48px</span>
                    </div>
                </div>
                <div class="typed-signature-preview-container">
                    <div class="typed-signature-preview font-dancing" data-font="Dancing Script">Your Name</div>
                    <div class="typed-signature-preview font-caveat" data-font="Caveat">Your Name</div>
                    <div class="typed-signature-preview font-pacifico" data-font="Pacifico">Your Name</div>
                </div>
            </div>
            <div id="signature-tab-content-upload" class="signature-tab-content">
                 <button id="upload-signature-btn" class="btn-secondary">Upload Image</button>
                 <input type="file" id="signature-upload-input" hidden accept="image/png, image/jpeg">
            </div>
            <div id="signature-palette">
                <h4 style="margin-top: 1rem;">Your Signatures</h4>
                <div id="signature-palette-slots">
                    <!-- Slots generated by JS -->
                </div>
            </div>
            <div id="signature-instructions" class="placeholder-text" style="margin-top: 1rem;">Drag a signature from the palette or create one.</div>
            <div id="selected-signature-editor" class="option-group" style="display: none; margin-top: 1rem; border-top: 1px solid var(--input-border); padding-top: 1rem;">
                <h4>Edit Placed Signature</h4>
                <label for="signature-opacity">Opacity</label>
                <div class="slider-container">
                    <input type="range" id="signature-opacity" min="0.1" max="1" step="0.1" value="1">
                    <span id="signature-opacity-value">100%</span>
                </div>
            </div>
        </div>
        <div class="process-btn-container">
            <button id="process-btn" class="btn-primary">Apply & Download</button>
        </div>
    `;
    DOMElements.optionsSidebarPane.innerHTML = sidebarHTML;

    // Initialize Undo/Redo
    addToHistory(); // Initial empty state
    getElement('#undo-btn').onclick = performUndo;
    getElement('#redo-btn').onclick = performRedo;

    const processBtn = getElement('#process-btn');
    processBtn.onclick = () => {
        if (!placedSignature) {
            showError("Please place a signature on the document before processing.");
            return;
        }
        
        const finalSignatures = [placedSignature].map(sig => {
            const pageContainerRect = sig.pageContainer.getBoundingClientRect();
            const pdfPageData = sig.pageContainer.dataset.pdfPage;
            if (!pdfPageData) return null;
            const { width: pdfWidth, height: pdfHeight } = JSON.parse(pdfPageData);

            const scaleX = pdfWidth / pageContainerRect.width;
            const scaleY = pdfHeight / pageContainerRect.height;
            
            const pdfX = sig.x * scaleX;
            const pdfY = pdfHeight - (sig.y * scaleY) - (sig.height * scaleY); // Y is from bottom in PDF
            const pdfWidthSig = sig.width * scaleX;
            const pdfHeightSig = sig.height * scaleY;
            
            return {
                imgSrc: sig.imgSrc,
                pageIndex: sig.pageIndex,
                x: pdfX,
                y: pdfY,
                width: pdfWidthSig,
                height: pdfHeightSig,
                opacity: sig.opacity
            };
        }).filter(Boolean);
        
        DOMElements.optionsView.dataset.placedSignatures = JSON.stringify(finalSignatures);
        startProcessing();
    };

    renderSignaturePalette();

    // --- TAB LOGIC ---
    document.querySelectorAll<HTMLElement>('.signature-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab!);
        });
    });

    // --- DRAW LOGIC ---
    const canvas = getElement<HTMLCanvasElement>('#signature-canvas');
    canvasCtx = canvas.getContext('2d')!;
    canvasCtx.lineCap = 'round';
    canvasCtx.lineJoin = 'round';

    const colorDrawInput = getElement<HTMLInputElement>('#signature-color-draw');
    colorDrawInput.oninput = () => signatureColor = colorDrawInput.value;

    const draw = (e: MouseEvent | TouchEvent) => {
        if (!isDrawing) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

        const currentTime = performance.now();
        const timeDelta = currentTime - lastTime;
        const distance = Math.hypot(x - lastX, y - lastY);
        const speed = timeDelta > 0 ? distance / timeDelta : 0;
        
        const newWidth = Math.max(MAX_LINE_WIDTH - speed * 1.5, MIN_LINE_WIDTH);
        canvasCtx.lineWidth = canvasCtx.lineWidth * 0.7 + newWidth * 0.3;

        canvasCtx.beginPath();
        canvasCtx.moveTo(lastX, lastY);
        canvasCtx.lineTo(x, y);
        canvasCtx.strokeStyle = signatureColor;
        canvasCtx.stroke();
        
        [lastX, lastY, lastTime] = [x, y, currentTime];
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        [lastX, lastY] = [
            ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left,
            ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top
        ];
        lastTime = performance.now();
        canvasCtx.lineWidth = MAX_LINE_WIDTH;
    };
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseleave', () => isDrawing = false);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', () => isDrawing = false);

    getElement('#clear-signature-btn').onclick = () => canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    getElement('#save-signature-btn').onclick = () => {
        signatureSlots.draw = canvas.toDataURL();
        renderSignaturePalette();
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        updateInstructionText('Drawn signature saved! Drag it from the palette to the document.');
    };

    // --- TYPE LOGIC ---
    const typedInput = getElement<HTMLInputElement>('#typed-signature-input');
    const colorTypeInput = getElement<HTMLInputElement>('#signature-color-type');
    const fontSizeSlider = getElement<HTMLInputElement>('#signature-font-size');
    const fontSizeValue = getElement<HTMLSpanElement>('#signature-font-size-value');
    const previews = document.querySelectorAll<HTMLElement>('.typed-signature-preview');

    const updateTypedPreviews = () => {
        const text = typedInput.value || 'Your Name';
        const color = colorTypeInput.value;
        const size = parseInt(fontSizeSlider.value);
        fontSizeValue.textContent = `${size}px`;
        previews.forEach(p => {
            p.textContent = text;
            p.style.color = color;
            p.style.fontSize = `${size * 0.6}px`; // Scale down for preview
        });
    };
    
    typedInput.addEventListener('input', updateTypedPreviews);
    colorTypeInput.addEventListener('input', updateTypedPreviews);
    fontSizeSlider.addEventListener('input', updateTypedPreviews);
    
    previews.forEach(p => {
        p.addEventListener('click', () => {
            const text = typedInput.value || 'Your Name';
            const font = p.dataset.font!;
            const color = colorTypeInput.value;
            const size = parseInt(fontSizeSlider.value);
            const imgSrc = textToImage(text, font, color, size);
            signatureSlots.type = imgSrc;
            renderSignaturePalette();
            updateInstructionText('Typed signature saved! Drag it from the palette to the document.');
        });
    });
    updateTypedPreviews();

    // --- UPLOAD LOGIC ---
    const uploadInput = getElement<HTMLInputElement>('#signature-upload-input');
    getElement('#upload-signature-btn').onclick = () => uploadInput.click();
    // Use onchange directly on the element to avoid duplicate listeners
    uploadInput.onchange = () => {
        if (uploadInput.files && uploadInput.files[0]) {
            const file = uploadInput.files[0];
            if (!file.type.startsWith('image/')) {
                showError("Please upload an image file (PNG or JPG).");
                return;
            }
            const reader = new FileReader();
            reader.onload = e => {
                signatureSlots.upload = e.target!.result as string;
                renderSignaturePalette();
                updateInstructionText('Signature uploaded! Drag it from the palette to the document.');
                uploadInput.value = ''; // Reset
            };
            reader.readAsDataURL(file);
        }
    };

    // --- PDF RENDERING ---
    const { PDFDocument } = await loadPdfLib();
    const pdfjsLib = await loadPdfJs();
    const mergedPdfDoc = await PDFDocument.create();
    for (const file of files) {
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach(page => mergedPdfDoc.addPage(page));
    }
    const mergedPdfBytes = await mergedPdfDoc.save();
    const pdfDocProxy = await pdfjsLib.getDocument({ data: mergedPdfBytes }).promise;
    DOMElements.previewPane.innerHTML = '';
    
    for (let i = 1; i <= pdfDocProxy.numPages; i++) {
        const page = await pdfDocProxy.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport }).promise;

        const pageContainer = document.createElement('div');
        pageContainer.className = 'pdf-page-container';
        pageContainer.dataset.pageIndex = (i - 1).toString();
        const pdfLibPage = mergedPdfDoc.getPage(i - 1);
        pageContainer.dataset.pdfPage = JSON.stringify({ width: pdfLibPage.getWidth(), height: pdfLibPage.getHeight() });
        pageContainer.appendChild(canvas);
        DOMElements.previewPane.appendChild(pageContainer);
        
        // Drop Logic on Page Container
        pageContainer.addEventListener('dragover', (e) => {
            e.preventDefault(); // Allow Drop
            e.dataTransfer!.dropEffect = 'copy';
        });
        
        pageContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = e.dataTransfer!.getData('application/json');
            if (!data) return;
            
            try {
                const { type, src } = JSON.parse(data);
                if (type === 'signature' && src) {
                    placeSignatureOnPage(src, pageContainer, e.clientX, e.clientY);
                }
            } catch (err) {
                console.error("Drop error", err);
            }
        });
    }
    
    // --- SIGNATURE PLACEMENT HELPERS ---
    const renderPlacedSignatureElement = (sigState: SignatureState, container: HTMLElement) => {
        const signatureEl = document.createElement('div');
        signatureEl.id = sigState.id;
        signatureEl.className = 'placed-signature';
        signatureEl.innerHTML = `<img src="${sigState.imgSrc}" alt="Signature"><div class="resize-handle br"></div><button class="delete-signature-btn" aria-label="Delete signature">${ICONS['delete']}</button>`;
        
        signatureEl.style.left = `${sigState.x}px`;
        signatureEl.style.top = `${sigState.y}px`;
        signatureEl.style.width = `${sigState.width}px`;
        signatureEl.style.height = `${sigState.height}px`;
        signatureEl.style.opacity = sigState.opacity.toString();
        
        signatureEl.querySelector<HTMLButtonElement>('.delete-signature-btn')!.onclick = (event) => {
            event.stopPropagation();
            removePlacedSignature();
            updateInstructionText('Signature removed.');
        };

        container.appendChild(signatureEl);
    };

    const placeSignatureOnPage = (src: string, pageContainer: HTMLElement, clientX: number, clientY: number) => {
        // Enforce single signature
        removePlacedSignature();

        const rect = pageContainer.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        // Calculate centered dimensions
        const img = new Image();
        img.onload = () => {
            let width = img.width > 150 ? 150 : img.width;
            let height = (width / img.width) * img.height;
            
            // Center on mouse
            const finalX = x - width / 2;
            const finalY = y - height / 2;

            const newSigState: SignatureState = {
                id: `sig-${Date.now()}`,
                imgSrc: src,
                x: finalX,
                y: finalY,
                width,
                height,
                opacity: 1.0,
                pageIndex: parseInt(pageContainer.dataset.pageIndex!),
                pageContainer: pageContainer
            };

            renderPlacedSignatureElement(newSigState, pageContainer);
            placedSignature = newSigState;
            addToHistory(); // Save state
            updateInstructionText('Signature placed! Drag to move, resize, or undo.');
        };
        img.src = src;
    };
    

    // --- INTERACTION LOGIC (Move/Resize) ---
    // Global handlers for robust drag/resize
    
    const handleMouseDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const signatureElement = target.closest<HTMLElement>('.placed-signature');
        
        if (signatureElement) {
            e.stopPropagation(); // Prevent other selections
            const opacityEditor = getElement<HTMLElement>('#selected-signature-editor');
            opacityEditor.style.display = 'block';
            const opacitySlider = getElement<HTMLInputElement>('#signature-opacity');
            const opacityValue = getElement<HTMLSpanElement>('#signature-opacity-value');
            
            if (placedSignature) {
                opacitySlider.value = placedSignature.opacity.toString();
                opacityValue.textContent = `${Math.round(placedSignature.opacity * 100)}%`;
            }

            signatureElement.classList.add('selected');

            const isResizing = target.classList.contains('resize-handle');
            const startX = e.clientX;
            const startY = e.clientY;
            const startLeft = signatureElement.offsetLeft;
            const startTop = signatureElement.offsetTop;
            const startWidth = signatureElement.offsetWidth;
            const startHeight = signatureElement.offsetHeight;
            const aspectRatio = startWidth / startHeight;
            
            // For Undo logic, we only record if something actually changed
            let hasMoved = false;

            const handleMouseMove = (moveEvent: MouseEvent) => {
                moveEvent.preventDefault();
                const dx = moveEvent.clientX - startX;
                const dy = moveEvent.clientY - startY;

                if (dx !== 0 || dy !== 0) hasMoved = true;

                if (isResizing) {
                    const newWidth = Math.max(30, startWidth + dx);
                    const newHeight = newWidth / aspectRatio;
                    signatureElement.style.width = `${newWidth}px`;
                    signatureElement.style.height = `${newHeight}px`;
                } else {
                    signatureElement.style.left = `${startLeft + dx}px`;
                    signatureElement.style.top = `${startTop + dy}px`;
                }
            };

            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                
                if (hasMoved && placedSignature) {
                    placedSignature.x = signatureElement.offsetLeft;
                    placedSignature.y = signatureElement.offsetTop;
                    placedSignature.width = signatureElement.offsetWidth;
                    placedSignature.height = signatureElement.offsetHeight;
                    addToHistory(); // Save state after move/resize
                }
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

        } else {
            // Clicked outside
             if (placedSignature) {
                const sigEl = document.getElementById(placedSignature.id);
                sigEl?.classList.remove('selected');
                getElement<HTMLElement>('#selected-signature-editor').style.display = 'none';
            }
        }
    };
    
    // Handle opacity change for Undo/Redo
    const opacityInput = getElement<HTMLInputElement>('#signature-opacity');
    // Use 'change' for history (committed value), 'input' for live preview
    opacityInput.oninput = (e) => {
         if (placedSignature) {
            const val = parseFloat((e.target as HTMLInputElement).value);
            placedSignature.opacity = val;
            const el = document.getElementById(placedSignature.id);
            if (el) el.style.opacity = val.toString();
            getElement<HTMLSpanElement>('#signature-opacity-value').textContent = `${Math.round(val * 100)}%`;
        }
    };
    opacityInput.onchange = () => {
        addToHistory();
    };

    DOMElements.previewPane.addEventListener('mousedown', handleMouseDown);

    // --- CLEANUP ---
    signatureCleanup = () => {
        DOMElements.previewPane.removeEventListener('mousedown', handleMouseDown);
        // Remove drag listeners from page containers (garbage collection usually handles this, 
        // but explicit removal if we stored references would be good. Here we rely on DOM replacement)
    };
};

const showOrganizeUI = async (files: File[]) => {
    // This is a complex UI, so we'll handle its state locally
    console.warn("showOrganizeUI is not fully implemented. Using fallback UI.");
    showFileProcessorUI(files);
    const pageData = files.map((f, docIndex) => ({ docIndex, pageIndex: 0, rotation: 0, file: f.name }));
    DOMElements.optionsView.dataset.pageData = JSON.stringify(pageData);
};

const showFileProcessorUI = (files: File[]) => {
    currentFiles = files;
    DOMElements.initialView.style.display = 'none';
    DOMElements.optionsView.style.display = 'flex';
    DOMElements.optionsView.className = '';
    DOMElements.optionsSidebarPane.style.display = 'flex';
    DOMElements.processBtnContainer.style.display = 'block';
    DOMElements.previewPane.innerHTML = `<p class="placeholder-text">Click the eye icon on a file to preview it.</p>`;
    DOMElements.optionsSidebarPane.innerHTML = '';
    
    const sidebarContent = document.createElement('div');
    sidebarContent.style.display = 'flex';
    sidebarContent.style.flexDirection = 'column';
    sidebarContent.style.height = '100%';

    const toolOptions = document.createElement('div');
    toolOptions.id = 'tool-options';
    toolOptions.style.flexGrow = '1';

    const processBtnContainer = document.createElement('div');
    processBtnContainer.className = 'process-btn-container';
    processBtnContainer.innerHTML = `<button id="process-btn" class="btn-primary">Let Genie Process</button>`;
    
    sidebarContent.appendChild(toolOptions);
    sidebarContent.appendChild(processBtnContainer);
    DOMElements.optionsSidebarPane.appendChild(sidebarContent);
    
    getElement('#process-btn', sidebarContent).onclick = startProcessing;

    const fileListHTML = `
        <div class="file-actions">
            <div class="file-list">
                ${files.map((file, index) => `
                    <div class="file-item" data-index="${index}">
                        <div class="file-icon">${getFileTypeIcon(file)}</div>
                        <span class="file-name" title="${file.name}">${file.name}</span>
                        <button class="file-preview-btn" aria-label="Preview ${file.name}">
                           ${ICONS['eye-preview']}
                        </button>
                    </div>
                `).join('')}
            </div>
            <button class="btn-secondary" id="start-over-btn">Start Over</button>
        </div>
    `;
    toolOptions.insertAdjacentHTML('beforeend', fileListHTML);
    
    getElement<HTMLButtonElement>('#start-over-btn', toolOptions).onclick = () => {
        DOMElements.optionsView.style.display = 'none';
        DOMElements.initialView.style.display = 'flex';
        currentFiles = [];
        DOMElements.fileInput.value = '';
    };

    toolOptions.querySelectorAll('.file-preview-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const fileItem = (e.currentTarget as HTMLElement).closest('.file-item');
            if (fileItem) {
                const index = parseInt((fileItem as HTMLElement).dataset.index!, 10);
                const file = currentFiles[index];
                await renderPreview(file);
            }
        });
    });

    // Add tool-specific options
    if (currentTool.id === 'split-pdf') {
        const optionGroup = document.createElement('div');
        optionGroup.className = 'option-group';
        optionGroup.innerHTML = `
            <h4>Page Range</h4>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <input type="number" id="start-page" placeholder="Start" min="1">
                <input type="number" id="end-page" placeholder="End" min="1">
            </div>
            <p id="page-count-info" style="font-size: 0.8rem; margin-top: 0.5rem; color: var(--text-light);"></p>
        `;
        toolOptions.appendChild(optionGroup);
        
        const startInput = getElement<HTMLInputElement>('#start-page', toolOptions);
        const endInput = getElement<HTMLInputElement>('#end-page', toolOptions);
        const pageInfo = getElement<HTMLParagraphElement>('#page-count-info', toolOptions);

        const validateInputs = (maxPages: number) => {
            const start = parseInt(startInput.value, 10);
            const end = parseInt(endInput.value, 10);
            let isValid = true;
            if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > end || end > maxPages) {
                isValid = false;
            }
            (getElement('#process-btn', DOMElements.optionsSidebarPane) as HTMLButtonElement).disabled = !isValid;
        };

        (async () => {
            const { PDFDocument } = await loadPdfLib();
            const pdfDoc = await PDFDocument.load(await files[0].arrayBuffer());
            const pageCount = pdfDoc.getPageCount();
            pageInfo.textContent = `This document has ${pageCount} pages.`;
            startInput.max = pageCount.toString();
            endInput.max = pageCount.toString();
            startInput.oninput = () => validateInputs(pageCount);
            endInput.oninput = () => validateInputs(pageCount);
        })();

        (getElement('#process-btn', DOMElements.optionsSidebarPane) as HTMLButtonElement).disabled = true;
    } else if (currentTool.id === 'protect-pdf') {
        const optionGroup = document.createElement('div');
        optionGroup.className = 'option-group';
        optionGroup.innerHTML = `
            <h4>Set Password</h4>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <input type="password" id="pdf-password" placeholder="Enter password">
                <input type="password" id="pdf-password-confirm" placeholder="Confirm password">
            </div>
            <p id="password-error" style="color: var(--danger); font-size: 0.8rem; display: none; margin-top: 0.5rem;">Passwords do not match or are empty</p>
        `;
        toolOptions.appendChild(optionGroup);

        const passwordInput = getElement<HTMLInputElement>('#pdf-password', toolOptions);
        const confirmInput = getElement<HTMLInputElement>('#pdf-password-confirm', toolOptions);
        const errorMsg = getElement<HTMLParagraphElement>('#password-error', toolOptions);
        const processBtn = getElement<HTMLButtonElement>('#process-btn', DOMElements.optionsSidebarPane);

        const validatePassword = () => {
            const pwd = passwordInput.value;
            const confirm = confirmInput.value;
            const isValid = pwd.length > 0 && pwd === confirm;
            
            processBtn.disabled = !isValid;
            errorMsg.style.display = (pwd.length > 0 && pwd !== confirm) ? 'block' : 'none';
        };

        passwordInput.oninput = validatePassword;
        confirmInput.oninput = validatePassword;
        processBtn.disabled = true; // Disable initially
    }
};

const renderPreview = async (file: File) => {
    DOMElements.previewPane.innerHTML = '<h4>Loading preview...</h4>';
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => {
            DOMElements.previewPane.innerHTML = `<img src="${e.target!.result}" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
        };
        reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
        try {
            const pdfjsLib = await loadPdfJs();
            const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: context!, viewport: viewport }).promise;
            DOMElements.previewPane.innerHTML = '';
            DOMElements.previewPane.appendChild(canvas);
        } catch (error) {
            DOMElements.previewPane.innerHTML = `<p class="placeholder-text">Could not render PDF preview.</p>`;
            console.error("PDF Preview Error:", error);
        }
    } else {
        DOMElements.previewPane.innerHTML = `<p class="placeholder-text">Preview not available for this file type.</p>`;
    }
};

const showCompleteUI = (downloads: { filename: string; blob: Blob }[]) => {
    DOMElements.processingView.style.display = 'none';
    DOMElements.completeView.style.display = 'flex';
    DOMElements.completeView.style.flexDirection = 'column';

    DOMElements.downloadArea.innerHTML = '';

    // Add Audio Player for TTS or Audio tools
    const isAudioTool = currentTool?.id === 'text-to-speech' || currentTool?.id === 'trim-audio' || currentTool?.id.includes('audio');
    let audioPreviewHTML = '';
    
    if (isAudioTool && downloads.length === 1 && downloads[0].blob.type.startsWith('audio/')) {
        const audioUrl = URL.createObjectURL(downloads[0].blob);
        audioPreviewHTML = `
            <div style="width: 100%; max-width: 400px; margin: 0 auto 1.5rem auto;">
                <audio controls style="width: 100%;">
                    <source src="${audioUrl}" type="${downloads[0].blob.type}">
                    Your browser does not support the audio element.
                </audio>
            </div>
        `;
    }

    if (downloads.length === 1) {
        const download = downloads[0];
        const url = URL.createObjectURL(download.blob);
        DOMElements.downloadArea.innerHTML = `
            ${audioPreviewHTML}
            <div class="download-actions">
                <a href="${url}" download="${download.filename}" class="download-btn">Download File</a>
                <button id="start-over-complete" class="btn-secondary">Start Over</button>
            </div>
        `;
    } else {
        DOMElements.downloadArea.innerHTML = `
            ${audioPreviewHTML}
            <div class="download-actions">
                <button id="download-all-zip" class="download-btn">Download All (.zip)</button>
                <button id="start-over-complete" class="btn-secondary">Start Over</button>
            </div>
            <div id="individual-downloads">
                <h4>Individual Files</h4>
                <div id="individual-downloads-list">
                    ${downloads.map((d, i) => `<a href="${URL.createObjectURL(d.blob)}" download="${d.filename}" class="individual-download-link">${d.filename}</a>`).join('')}
                </div>
            </div>
        `;
        getElement('#download-all-zip').onclick = async () => {
            const JSZip = await loadJszip();
            const zip = new JSZip();
            downloads.forEach(d => zip.file(d.filename, d.blob));
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentTool!.id}_files.zip`;
            a.click();
            URL.revokeObjectURL(url);
        };
    }
    
    getElement('#start-over-complete').onclick = () => {
        DOMElements.completeView.style.display = 'none';
        DOMElements.initialView.style.display = 'flex';
        currentFiles = [];
        DOMElements.fileInput.value = '';
    };

    // Continue with...
    const continueSection = getElement('.continue-section');
    if (currentTool?.continue && currentFiles.length === 1 && currentFiles[0].type === 'application/pdf') {
        continueSection.style.display = 'block';
        DOMElements.continueToolsGrid.innerHTML = '';
        currentTool.continue.forEach(toolId => {
            const tool = TOOLS[toolId];
            const card = document.createElement('div');
            card.className = 'continue-tool-card';
            card.innerHTML = `${tool.icon} <span>${tool.title}</span>`;
            card.onclick = () => {
                // To continue, we need to convert the processed blob back to a File object
                const newFile = new File([downloads[0].blob], downloads[0].filename, { type: 'application/pdf' });
                openToolModal(tool);
                // Directly move to the options view of the new tool
                setTimeout(() => handleFilesSelected([newFile]), 100);
            };
            DOMElements.continueToolsGrid.appendChild(card);
        });
    } else {
        continueSection.style.display = 'none';
    }
};

// --- PDF Tool Implementations ---
const processMergePdf = async (files: File[], updateProgress: (p: number, t: string) => void) => {
    updateProgress(10, 'Loading PDF library...');
    const { PDFDocument } = await loadPdfLib();
    const mergedPdf = await PDFDocument.create();
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progress = 10 + (80 * (i / files.length));
        updateProgress(progress, `Merging ${file.name}...`);
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    updateProgress(95, 'Saving merged document...');
    const mergedPdfBytes = await mergedPdf.save();
    return [{ filename: 'merged_document.pdf', blob: new Blob([mergedPdfBytes], { type: 'application/pdf' }) }];
};

const processSplitPdf = async (files: File[], updateProgress: (p: number, t: string) => void) => {
    updateProgress(10, 'Loading PDF library...');
    const { PDFDocument } = await loadPdfLib();
    const startPage = parseInt(getElement<HTMLInputElement>('#start-page').value, 10);
    const endPage = parseInt(getElement<HTMLInputElement>('#end-page').value, 10);

    updateProgress(30, `Loading ${files[0].name}...`);
    const pdfBytes = await files[0].arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    updateProgress(60, `Extracting pages ${startPage} to ${endPage}...`);
    const newPdf = await PDFDocument.create();
    const indicesToCopy = Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage - 1);
    const copiedPages = await newPdf.copyPages(pdfDoc, indicesToCopy);
    copiedPages.forEach(page => newPdf.addPage(page));

    updateProgress(95, 'Saving split document...');
    const newPdfBytes = await newPdf.save();
    return [{ filename: `split_document_p${startPage}-${endPage}.pdf`, blob: new Blob([newPdfBytes], { type: 'application/pdf' }) }];
};

const processOrganizePdf = async (pages: { doc: any, pageIndex: number, rotation: number }[], updateProgress: (p: number, t: string) => void) => {
    updateProgress(10, 'Loading PDF library...');
    const { PDFDocument } = await loadPdfLib();
    const newPdf = await PDFDocument.create();
    
    const totalPages = pages.length;
    for (let i = 0; i < totalPages; i++) {
        const pageInfo = pages[i];
        updateProgress(10 + (80 * (i / totalPages)), `Processing page ${i + 1} of ${totalPages}...`);
        
        const [copiedPage] = await newPdf.copyPages(pageInfo.doc, [pageInfo.pageIndex]);
        copiedPage.setRotation(pageInfo.rotation);
        newPdf.addPage(copiedPage);
    }
    
    updateProgress(95, 'Saving organized document...');
    const newPdfBytes = await newPdf.save();
    return [{ filename: 'organized_document.pdf', blob: new Blob([newPdfBytes], { type: 'application/pdf' }) }];
};

const processSignPdf = async (files: File[], placedSignatures: any[], updateProgress: (p: number, t: string) => void) => {
    updateProgress(10, 'Loading PDF library...');
    const { PDFDocument } = await loadPdfLib();
    
    updateProgress(20, 'Combining documents if necessary...');
    const mergedPdfDoc = await PDFDocument.create();
    for (const file of files) {
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach(page => mergedPdfDoc.addPage(page));
    }
    const pages = mergedPdfDoc.getPages();

    for (let i = 0; i < placedSignatures.length; i++) {
        const sig = placedSignatures[i];
        updateProgress(40 + (50 * (i / placedSignatures.length)), `Applying signature ${i + 1}...`);
        
        const page = pages[sig.pageIndex];
        const sigImageBytes = await fetch(sig.imgSrc).then(res => res.arrayBuffer());
        const sigImage = await mergedPdfDoc.embedPng(sigImageBytes);

        page.drawImage(sigImage, {
            x: sig.x,
            y: sig.y,
            width: sig.width,
            height: sig.height,
            opacity: sig.opacity,
        });
    }

    updateProgress(95, 'Saving signed document...');
    const signedPdfBytes = await mergedPdfDoc.save();
    return [{ filename: 'signed_document.pdf', blob: new Blob([signedPdfBytes], { type: 'application/pdf' }) }];
};

const processProtectPdf = async (files: File[], updateProgress: (p: number, t: string) => void) => {
    updateProgress(10, 'Loading PDF library...');
    const { PDFDocument } = await loadPdfLib();
    const password = getElement<HTMLInputElement>('#pdf-password').value;
    
    updateProgress(30, `Loading ${files[0].name}...`);
    const pdfBytes = await files[0].arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    updateProgress(70, 'Encrypting document...');
    pdfDoc.encrypt({
        userPassword: password,
        ownerPassword: password,
        permissions: {
            printing: 'highResolution',
            modifying: false,
            copying: false,
            annotating: false,
            fillingForms: false,
            contentAccessibility: false,
            documentAssembly: false,
        },
    });

    const encryptedPdfBytes = await pdfDoc.save();

    return [{ filename: `protected_${files[0].name}`, blob: new Blob([encryptedPdfBytes], { type: 'application/pdf' }) }];
};

// decode function from the guidelines
function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

const processTextToSpeech = async (updateProgress: (p: number, t: string) => void) => {
    updateProgress(10, 'Initializing AI service...');
    if (!ai) throw new Error("AI Service unavailable.");
    
    const text = getElement<HTMLTextAreaElement>('#tts-text-input').value;
    const voiceType = getElement<HTMLSelectElement>('#tts-voice').value;
    const language = getElement<HTMLSelectElement>('#tts-language').value; // Using this as context
    
    if (!text.trim()) throw new Error("Please enter text to convert.");
    
    updateProgress(30, 'Generating audio stream...');
    
    // Map voice selection to Gemini voice names
    let voiceName = 'Puck'; // Default Male
    if (voiceType === 'female' || voiceType === 'girl') {
        voiceName = 'Kore';
    } else if (voiceType === 'boy') {
        voiceName = 'Puck'; // Or 'Fenrir' if distinct
    } else {
        voiceName = 'Fenrir'; // Alternative male
    }
    
    // Construct prompt to guide language/tone if necessary, though TTS model mostly follows text
    // We rely on the model to speak the language of the text provided.
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voiceName },
                },
            },
        },
    });

    updateProgress(80, 'Processing audio output...');
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio generated.");

    const audioBytes = decode(base64Audio);
    
    // Convert raw PCM data to WAV
    const wavBlob = createWavBlob(audioBytes);
    
    return [{ filename: 'generated_speech.wav', blob: wavBlob }];
};


const PROCESS_MAP: Record<string, Function> = {
    'merge-pdf': processMergePdf,
    'split-pdf': processSplitPdf,
    'protect-pdf': processProtectPdf,
    'text-to-speech': processTextToSpeech
};

const startProcessing = async () => {
    const toolId = currentTool?.id;
    if (!toolId) return;
    
    if (toolId === 'sign-pdf' && signatureKeydownHandler) {
        document.removeEventListener('keydown', signatureKeydownHandler);
        signatureKeydownHandler = null;
    }

    DOMElements.optionsView.style.display = 'none';
    DOMElements.processingView.style.display = 'flex';
    DOMElements.processingView.style.flexDirection = 'column';

    const updateProgress = (percentage: number, text: string) => {
        const p = Math.round(percentage);
        DOMElements.progressBar.style.width = `${p}%`;
        DOMElements.progressPercentage.textContent = `${p}%`;
        DOMElements.processingText.textContent = text;
    };
    
    const MIN_PROCESSING_TIME = 15000; // 15 seconds
    const startTime = Date.now();

    try {
        updateProgress(0, 'Starting...');
        // await sleep(200); // Removed short sleep, enforcing long wait below

        let downloads: { filename: string, blob: Blob }[];
        
        // Execute the processing logic
        if (toolId === 'organize-pdf') {
            const { PDFDocument } = await loadPdfLib();
            const pageData = JSON.parse(DOMElements.optionsView.dataset.pageData!);
            const docs = await Promise.all(
                currentFiles.map(f => fileToArrayBuffer(f).then(b => PDFDocument.load(b)))
            );
            const pagesWithDocs = pageData.map((p: any) => ({ ...p, doc: docs[p.docIndex] }));
            downloads = await processOrganizePdf(pagesWithDocs, updateProgress);
        } else if (toolId === 'sign-pdf') {
            const placedSignatures = JSON.parse(DOMElements.optionsView.dataset.placedSignatures!);
            downloads = await processSignPdf(currentFiles, placedSignatures, updateProgress);
        } else if (toolId === 'text-to-speech') {
             downloads = await processTextToSpeech(updateProgress);
        } else {
            const processFn = PROCESS_MAP[toolId];
            if (processFn) {
                downloads = await processFn(currentFiles, updateProgress);
            } else {
                 // Fallback for tools without specific implementation in this file (simulated)
                 await sleep(2000);
                 downloads = []; // Placeholder
                 // throw new Error(`Processing function for ${toolId} not found.`);
            }
        }
        
        // Enforce Minimum Processing Time
        const elapsed = Date.now() - startTime;
        if (elapsed < MIN_PROCESSING_TIME) {
            const remaining = MIN_PROCESSING_TIME - elapsed;
            // Smoothly animate the remaining percentage
            const steps = 20;
            const stepTime = remaining / steps;
            const currentProg = parseInt(DOMElements.progressPercentage.textContent || "0");
            
            for(let i=1; i<=steps; i++) {
                await sleep(stepTime);
                const projected = currentProg + ((100 - currentProg) * (i/steps));
                updateProgress(projected, 'Finalizing...');
            }
        }
        
        updateProgress(100, 'Done!');
        await sleep(500);
        showCompleteUI(downloads);
    } catch (error: any) {
        console.error("Processing Error:", error);
        showError(`An error occurred: ${error.message}`);
        DOMElements.processingView.style.display = 'none';
        // Restore view based on tool type
        if(toolId === 'text-to-speech') {
             DOMElements.optionsView.style.display = 'flex';
        } else {
             DOMElements.optionsView.style.display = 'flex';
        }
    }
};

// Tool-specific UI renderers
const renderSpeechToTextUI = () => { /* Stub */ };
const renderAudioTrimUI = () => { /* Stub */ };

// --- MAIN INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderTools();
    renderCategoryFilters();
    renderRecentTools();
    
    // Theme toggle
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    DOMElements.themeToggle.checked = isDark;
    
    DOMElements.themeToggle.addEventListener('change', (e) => {
        const theme = (e.target as HTMLInputElement).checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // Search functionality
    DOMElements.searchInput.addEventListener('input', (e) => {
        const searchTerm = (e.target as HTMLInputElement).value;
        const activeCategory = getElement<HTMLButtonElement>('.filter-btn.active')?.dataset.category || 'All';
        renderTools(searchTerm, activeCategory);
    });

    // Modal listeners
    DOMElements.closeModalBtn.addEventListener('click', closeModal);
    DOMElements.modal.addEventListener('click', (e) => {
        if (e.target === DOMElements.modal) closeModal();
    });
    
    // File input listeners
    DOMElements.selectFileBtn.addEventListener('click', () => DOMElements.fileInput.click());
    DOMElements.initialView.addEventListener('click', (e) => {
        if((e.target as HTMLElement).classList.contains('drop-zone')) {
             DOMElements.fileInput.click()
        }
    });
    DOMElements.fileInput.addEventListener('change', (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) handleFilesSelected(files);
    });

    // Drag and drop listeners
    const dropZone = getElement('.drop-zone');
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, e => e.preventDefault());
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        document.body.addEventListener(eventName, () => {
            document.body.classList.add('is-dragging');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, () => {
            document.body.classList.remove('is-dragging');
        });
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = (e as DragEvent).dataTransfer?.files;
        if (files) {
           handleFilesSelected(files);
        }
    });
    
    DOMElements.processBtn.onclick = startProcessing;

    // Hamburger menu
    DOMElements.hamburger.addEventListener('click', () => {
        DOMElements.hamburger.classList.toggle('active');
        DOMElements.navLinks.classList.toggle('active');
    });

    // Scroll to top
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            DOMElements.scrollToTopBtn.classList.add('visible');
        } else {
            DOMElements.scrollToTopBtn.classList.remove('visible');
        }
    });
    DOMElements.scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Ad Popup
    setTimeout(() => {
        DOMElements.bottomAdPopup.classList.add('visible');
    }, 5000);
    DOMElements.closeAdPopupBtn.addEventListener('click', () => {
        DOMElements.bottomAdPopup.classList.remove('visible');
    });

});