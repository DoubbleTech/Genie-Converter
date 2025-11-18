
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
    'flag-in': `<svg class="icon" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#ff9933"/><path d="M0 28h64v24H0z" fill="#fff"/><path d="M0 40h64v12H0z" fill="#138808"/><circle cx="32" cy="32" r="5" fill="none" stroke="#000080" stroke-width="1.5"/><path d="M32 27v10M27 32h10" stroke="#000080" stroke-width="1"/><path d="M28.5 28.5l7 7M35.5 28.5l-7 7" stroke="#000080" stroke-width="1"/></svg>`,
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
    'rotate-right': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.06 7.44 7 7.93v-2.02c-2.83-.48-5-2.94-5-5.91s2.17-5.43 5-5.91V11l4.55-4.55zM18.93 11c.48 2.83 2.94 5 5.91 5v2.02c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v2.02c-2.83.48-5 2.94-5 5.91z"></path></svg>`,

    // File Type Icons
    'file-pdf': `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16c-2.05 0-3.81-1.24-4.58-3h1.71c.63.9 1.68 1.5 2.87 1.5 1.93 0 3.5-1.57 3.5-3.5S13.93 9.5 12 9.5c-1.18 0-2.24.6-2.87 1.5H7.42c.77-1.76 2.53-3 4.58-3 2.76 0 5 2.24 5 5s-2.24 5-5 5zm-3-4.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"/></svg>`,
    'file-doc': `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 12H9v2h4v-2zm3-4H9v2h7V10zm-2-4H9v2h5V6z"/></svg>`,
    'file-xls': `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM9.91 17.42l-1.41-1.41 1.06-1.06-1.06-1.06-1.41 1.41-1.06-1.06 1.41-1.41 1.06-1.06-1.41-1.41 1.06-1.06 1.41 1.41 1.41-1.41 1.06 1.06-1.41 1.41 1.06 1.06 1.41-1.41 1.06 1.06-1.41 1.41 1.41 1.41-1.06 1.06-1.41-1.41-1.06 1.06zM15 18h-3v-2h3v2zm0-4h-3v-2h3v2zm0-4h-3V8h3v2z"/></svg>`,
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
        id === 'background-remover' || id.startsWith('speech-to-text-')
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
    { title: 'Audio Tools', tools: ['trim-audio', 'wav-to-mp3', 'convert-audio', 'speech-to-text-en-US', 'speech-to-text-en-GB', 'speech-to-text-es-ES', 'speech-to-text-fr-FR', 'speech-to-text-de-DE', 'speech-to-text-it-IT', 'speech-to-text-pt-PT', 'speech-to-text-ru-RU', 'speech-to-text-zh-CN', 'speech-to-text-ja-JP', 'speech-to-text-hi-IN', 'speech-to-text-ur-PK'] }
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

const base64ToBlob = (base64: string, contentType: string = 'image/png'): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
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

    if (!tool.isFileTool || tool.id === 'trim-audio' || tool.id.startsWith('speech-to-text')) {
        const iconWithSize = tool.icon.replace('<svg class="icon"', '<svg class="icon modal-title-icon"');
        DOMElements.modalTitle.innerHTML = `<span style="display: flex; align-items: center; justify-content: center; gap: 1rem;">${iconWithSize} ${tool.title}</span>`;
    } else {
        DOMElements.modalTitle.textContent = tool.title;
    }
    
    DOMElements.modalSubtitle.textContent = tool.subtitle;

    DOMElements.modalContent.classList.toggle('stt-active', !tool.isFileTool || tool.id === 'trim-audio');


    DOMElements.initialView.style.display = 'none';
    DOMElements.optionsView.style.display = 'none';
    DOMElements.processingView.style.display = 'none';
    DOMElements.completeView.style.display = 'none';

    if (tool.isFileTool) {
        DOMElements.processBtnContainer.style.display = 'block';
        DOMElements.initialView.style.display = 'flex';
        DOMElements.fileInput.accept = tool.accept;
        const isMultiple = ['merge-pdf', 'organize-pdf', 'image-to-pdf', 'image-to-gif'].includes(tool.id);
        DOMElements.fileInput.multiple = isMultiple;
        (getElement('.drop-text')).textContent = isMultiple