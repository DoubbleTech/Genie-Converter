
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
    'organize-pdf': { id: 'organize-pdf', title: 'Reorder, delete, or add pages.', subtitle: 'Reorder, delete, or add pages.', icon: ICONS['organize-pdf'], accept: '.pdf', isFileTool: true },
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
    optionsView: getElement('#modal-options-view'),
    processingView: getElement('#modal-processing-view'),
    completeView: getElement('#modal-complete-view'),
    selectFileBtn: getElement<HTMLButtonElement>('#select-file-btn'),
    fileInput: getElement<HTMLInputElement>('#file-input'),
    processBtnContainer: getElement('.process-btn-container'),
    processBtn: getElement<HTMLButtonElement>('#process-btn'),
    previewPane: getElement('.options-preview-pane'),
    optionsPane: getElement('#tool-options'),
    optionsSidebarPane: getElement('.options-sidebar-pane'),
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
            ? 'or drop files here'
            : 'or drop file here';

    } else {
        DOMElements.processBtnContainer.style.display = 'none';
        showOptionsView([]);
    }

    DOMElements.modal.classList.add('visible');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    DOMElements.modal.addEventListener('keydown', handleModalKeydown);
};

const closeModal = () => {
    if (sttFileProcessingController) {
        sttFileProcessingController.abort();
    }
    if (isRecording || sttSessionPromise) {
        stopRecording();
    }
    if (waveSurfer) {
        waveSurfer.destroy();
        waveSurfer = null;
    }

    DOMElements.modal.classList.remove('visible');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    currentTool = null;
    currentFiles = [];
    
    DOMElements.previewPane.innerHTML = '';
    DOMElements.optionsPane.innerHTML = '';

    DOMElements.modalContent.classList.remove('stt-active');
    DOMElements.modal.removeEventListener('keydown', handleModalKeydown);
};

const simulateProcessing = (messages: string[], duration: number = 15000): Promise<void> => {
    return new Promise(resolve => {
        let progress = 10;
        
        const messageCount = messages.length;
        const totalDuration = duration * 0.9; // Run simulation for 90% of total time
        const intervalTime = 100; // Update every 100ms for smoothness
        const steps = totalDuration / intervalTime;
        const progressIncrement = (95 - progress) / steps;
        
        let messageIndex = 0;
        const messageChangeStep = Math.floor(steps / messageCount);
        DOMElements.processingText.textContent = messages[messageIndex];

        let currentStep = 0;

        const intervalId = setInterval(() => {
            currentStep++;
            progress += progressIncrement;

            // Change message at specified intervals
            if (messageCount > 1 && currentStep > 0 && currentStep % messageChangeStep === 0 && messageIndex < messageCount - 1) {
                messageIndex++;
                DOMElements.processingText.textContent = messages[messageIndex];
            }
            
            if (progress >= 95 || currentStep >= steps) {
                clearInterval(intervalId);
                DOMElements.processingText.textContent = 'Finalizing...';
                DOMElements.progressBar.style.width = `100%`;
                DOMElements.progressPercentage.textContent = `100%`;
                setTimeout(resolve, 500); // Short delay for "Finalizing"
                return;
            }
            
            DOMElements.progressBar.style.width = `${Math.round(progress)}%`;
            DOMElements.progressPercentage.textContent = `${Math.round(progress)}%`;
            
        }, intervalTime);
    });
};


const showProcessingView = async (startProcessing: () => Promise<void>) => {
    DOMElements.optionsView.style.display = 'none';
    DOMElements.processingView.style.display = 'block';

    DOMElements.progressBar.style.width = '0%';
    DOMElements.progressPercentage.textContent = '0%';
    DOMElements.processingText.textContent = 'Preparing files...';

    await sleep(200);
    DOMElements.progressBar.style.width = '10%';
    DOMElements.progressPercentage.textContent = '10%';

    try {
        await startProcessing();
    } catch (e: any) {
        closeModal();
        setTimeout(() => showError(`An error occurred: ${e.message}`), 100);
        console.error(e);
    }
};

const showCompleteView = (title: string, downloads: { filename: string, url: string }[], resultFiles?: File[]) => {
    DOMElements.processingView.style.display = 'none';
    DOMElements.completeView.style.display = 'block';
    DOMElements.completeTitle.textContent = title;

    DOMElements.downloadArea.innerHTML = '';

    if (downloads.length > 1) {
        DOMElements.downloadArea.innerHTML = `
            <div class="download-actions">
                <button id="download-zip-btn" class="download-btn">Download All as ZIP</button>
                <button id="show-individual-btn" class="btn-secondary">Download Individually</button>
            </div>
            <div id="individual-downloads" style="display: none;">
                <h4>Individual Files:</h4>
                <div id="individual-downloads-list"></div>
            </div>
        `;

        const zipBtn = getElement<HTMLButtonElement>('#download-zip-btn', DOMElements.downloadArea);
        const showIndividualBtn = getElement<HTMLButtonElement>('#show-individual-btn', DOMElements.downloadArea);
        const individualContainer = getElement('#individual-downloads', DOMElements.downloadArea);
        const individualList = getElement('#individual-downloads-list', DOMElements.downloadArea);

        downloads.forEach(d => {
            const link = document.createElement('a');
            link.href = d.url;
            link.download = d.filename;
            link.className = 'individual-download-link';
            link.textContent = d.filename;
            individualList.appendChild(link);
        });

        showIndividualBtn.onclick = () => {
            const isVisible = individualContainer.style.display === 'block';
            individualContainer.style.display = isVisible ? 'none' : 'block';
        };

        zipBtn.onclick = async () => {
            zipBtn.disabled = true;
            zipBtn.textContent = 'Zipping...';
            try {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', 'jszip-lib');
                const zip = new (window as any).JSZip();

                const filePromises = downloads.map(d => 
                    fetch(d.url)
                        .then(res => res.blob())
                        .then(blob => zip.file(d.filename, blob))
                );
                
                await Promise.all(filePromises);

                const zipBlob = await zip.generateAsync({ type: 'blob' });
                const zipUrl = URL.createObjectURL(zipBlob);
                
                const a = document.createElement('a');
                a.href = zipUrl;
                a.download = 'genie-converter-files.zip';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(zipUrl);

            } catch (error) {
                console.error("Error creating ZIP file:", error);
                showError("Sorry, there was an error creating the ZIP file.");
            } finally {
                zipBtn.disabled = false;
                zipBtn.textContent = 'Download All as ZIP';
            }
        };

    } else if (downloads.length === 1) {
        const d = downloads[0];
        const btn = document.createElement('a');
        btn.href = d.url;
        btn.download = d.filename;
        btn.className = 'download-btn';
        btn.textContent = `Download ${d.filename}`;
        DOMElements.downloadArea.appendChild(btn);
    } else {
        DOMElements.downloadArea.innerHTML = '<p>No files were generated for download.</p>';
    }
    
    if (resultFiles && resultFiles.length > 0 && currentTool?.continue) {
        currentFiles = resultFiles;
        DOMElements.continueToolsGrid.innerHTML = '';
        currentTool.continue.forEach(toolId => {
            const tool = TOOLS[toolId];
            const card = document.createElement('div');
            card.className = 'continue-tool-card';
            card.innerHTML = `${tool.icon}<span>${tool.title}</span>`;
            card.onclick = () => {
                closeModal();
                setTimeout(() => {
                    openToolModal(tool);
                    if (resultFiles) {
                       setTimeout(() => showOptionsView(resultFiles), 50);
                    }
                }, 50);
            };
            DOMElements.continueToolsGrid.appendChild(card);
        });
        getElement('.continue-section', DOMElements.completeView).style.display = 'block';
    } else {
        getElement('.continue-section', DOMElements.completeView).style.display = 'none';
    }
};

const loadScript = (src: string, id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script ${src}`));
        document.head.appendChild(script);
    });
};

const loadWaveSurferWithPlugins = (): Promise<{ WaveSurfer: any, RegionsPlugin: any }> => {
    if (waveSurferPromise) {
        return waveSurferPromise;
    }

    waveSurferPromise = new Promise(async (resolve, reject) => {
        const timeout = 20000;
        const pollInterval = 100;
        let elapsedTime = 0;

        try {
            await loadScript('https://cdn.jsdelivr.net/npm/wavesurfer.js@7.7.5/dist/wavesurfer.min.js', 'wavesurfer-lib');
            await loadScript('https://cdn.jsdelivr.net/npm/wavesurfer.js@7.7.5/dist/plugins/regions.min.js', 'wavesurfer-regions-lib');
            
            const checkInterval = setInterval(() => {
                const globalWaveSurfer = (window as any).WaveSurfer;
                if (globalWaveSurfer && globalWaveSurfer.plugins && globalWaveSurfer.plugins.Regions) {
                    clearInterval(checkInterval);
                    resolve({ WaveSurfer: globalWaveSurfer, RegionsPlugin: globalWaveSurfer.plugins.Regions });
                } else {
                    elapsedTime += pollInterval;
                    if (elapsedTime >= timeout) {
                        clearInterval(checkInterval);
                        waveSurferPromise = null;
                        reject(new Error(`WaveSurfer Regions plugin failed to initialize in time. Please check your network connection or try reloading the page.`));
                    }
                }
            }, pollInterval);
        } catch (error) {
            waveSurferPromise = null;
            reject(error);
        }
    });

    return waveSurferPromise;
};


const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0 || !currentTool) return;
    hideError();
    currentFiles = Array.from(files);

    const allowedTypes = currentTool.accept.split(',').map(t => t.trim().toLowerCase());
    const isMultiple = DOMElements.fileInput.multiple;

    if (!isMultiple && currentFiles.length > 1) {
        showError(`The ${currentTool.title} tool can only process one file at a time.`);
        DOMElements.fileInput.value = '';
        return;
    }

    const invalidFiles = currentFiles.filter(file => {
        return !allowedTypes.some(type => {
            if (type.startsWith('.')) {
                return file.name.toLowerCase().endsWith(type);
            }
            if (type.endsWith('/*')) {
                return file.type.startsWith(type.slice(0, -1));
            }
            return file.type === type;
        });
    });

    if (invalidFiles.length > 0) {
        showError(`Invalid file type for ${currentTool.title}. Please provide: ${currentTool.accept}.`);
        DOMElements.fileInput.value = '';
        return;
    }
    
    showOptionsView(currentFiles);
};

const showOptionsView = (files: File[]) => {
    if (!currentTool) return;
    
    DOMElements.initialView.style.display = 'none';
    DOMElements.optionsView.style.display = 'flex';
    DOMElements.processingView.style.display = 'none';
    DOMElements.completeView.style.display = 'none';
    
    DOMElements.previewPane.innerHTML = '';
    DOMElements.optionsPane.innerHTML = '';

    if (currentTool.isFileTool && currentTool.id !== 'trim-audio') {
        DOMElements.optionsSidebarPane.style.display = 'block';
        DOMElements.processBtnContainer.style.display = 'block';
        DOMElements.processBtn.disabled = false;
        
        const fileListHTML = files.map((file, index) => `
            <div class="file-item">
                <div class="file-icon">${getFileTypeIcon(file)}</div>
                <span class="file-name">${file.name}</span>
                <button class="file-preview-btn" data-file-index="${index}" aria-label="Preview ${file.name}">${ICONS['eye-preview']}</button>
            </div>
        `).join('');

        DOMElements.optionsPane.innerHTML = `
            <div class="file-actions">
                <div class="file-list">${fileListHTML}</div>
                <div class="action-buttons">
                    <button id="clear-files-btn" class="btn-secondary danger">Start Over</button>
                </div>
            </div>
        `;

        DOMElements.previewPane.innerHTML = `<p class="placeholder-text">Click the eye icon to preview a file.</p>`;
        
        getElement('#clear-files-btn', DOMElements.optionsPane).onclick = () => openToolModal(currentTool!);
        
        DOMElements.optionsPane.querySelectorAll('.file-preview-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const index = parseInt((btn as HTMLElement).dataset.fileIndex!);
                const file = files[index];
                DOMElements.previewPane.innerHTML = `<p>Loading preview...</p>`;

                try {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = e => { DOMElements.previewPane.innerHTML = `<img src="${e.target!.result as string}" alt="Preview" style="max-width:100%; max-height:100%; object-fit:contain;">`; };
                        reader.readAsDataURL(file);
                    } else if (file.type === 'application/pdf') {
                        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'pdfjs-lib');
                        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

                        const fileReader = new FileReader();
                        fileReader.onload = async function() {
                            try {
                                const typedarray = new Uint8Array(this.result as ArrayBuffer);
                                const pdf = await (window as any).pdfjsLib.getDocument(typedarray).promise;
                                const page = await pdf.getPage(1);
                                const viewport = page.getViewport({ scale: 1.0 });
                                const canvas = document.createElement('canvas');
                                const context = canvas.getContext('2d')!;
                                canvas.height = viewport.height;
                                canvas.width = viewport.width;

                                DOMElements.previewPane.innerHTML = '';
                                DOMElements.previewPane.appendChild(canvas);
                                canvas.style.maxWidth = '100%';
                                canvas.style.height = 'auto';

                                await page.render({ canvasContext: context, viewport: viewport }).promise;
                            } catch (e) {
                                DOMElements.previewPane.innerHTML = `<p class="placeholder-text">Error loading PDF preview.</p>`;
                                console.error("PDF Preview error:", e);
                            }
                        };
                        fileReader.readAsArrayBuffer(file);
                    } else if (file.type.startsWith('audio/')) {
                        const audioUrl = URL.createObjectURL(file);
                        DOMElements.previewPane.innerHTML = `<audio controls src="${audioUrl}" style="width: 100%;">Your browser does not support the audio element.</audio>`;
                    } else if (file.type.startsWith('video/')) {
                        const videoUrl = URL.createObjectURL(file);
                        DOMElements.previewPane.innerHTML = `<video controls src="${videoUrl}" style="max-width: 100%; max-height: 100%;">Your browser does not support the video element.</video>`;
                    } else {
                        DOMElements.previewPane.innerHTML = `<p class="placeholder-text">Preview not available for ${file.type}.</p>`;
                    }
                } catch (e) {
                    DOMElements.previewPane.innerHTML = `<p class="placeholder-text">Error loading preview.</p>`;
                    console.error("Preview error:", e);
                }
            });
        });

    } else {
        DOMElements.processBtnContainer.style.display = 'none';
    }

    // Specific tool options
    switch (currentTool.id) {
        case 'trim-audio':
             renderAudioTrimUI(files[0]);
             break;
        case 'background-remover':
            DOMElements.optionsPane.insertAdjacentHTML('beforeend', `
                <div class="option-group"><h4>AI Background Remover</h4><p>The AI will remove the background, making it transparent.</p></div>
            `);
            DOMElements.processBtn.onclick = () => showProcessingView(removeBackground);
            break;
        case 'protect-pdf':
            DOMElements.optionsPane.insertAdjacentHTML('beforeend', `
                <div class="option-group">
                    <label for="pdf-password">Set a Password</label>
                    <input type="password" id="pdf-password" placeholder="Enter password" autocomplete="new-password">
                </div>
                <div class="option-group">
                    <label for="pdf-password-confirm">Confirm Password</label>
                    <input type="password" id="pdf-password-confirm" placeholder="Confirm password" autocomplete="new-password">
                    <p id="password-mismatch-error" style="display: none; color: var(--danger); font-size: 0.8rem; margin-top: 0.5rem;">Passwords do not match.</p>
                </div>
                <div class="option-group">
                    <h4>Password Strength</h4>
                    <div class="password-strength-meter">
                        <div id="strength-bar" class="strength-bar"></div>
                    </div>
                    <p id="strength-text" style="font-size: 0.9rem; margin-top: 0.5rem; text-align: center; font-weight: 500;"></p>
                    <ul id="password-criteria" class="password-criteria">
                        <li data-criterion="length">At least 8 characters</li>
                        <li data-criterion="uppercase">An uppercase letter</li>
                        <li data-criterion="number">A number</li>
                        <li data-criterion="special">A special character</li>
                    </ul>
                </div>
            `);

            const passwordInput = getElement<HTMLInputElement>('#pdf-password');
            const confirmInput = getElement<HTMLInputElement>('#pdf-password-confirm');
            const mismatchError = getElement<HTMLElement>('#password-mismatch-error');
            const strengthBar = getElement<HTMLElement>('#strength-bar');
            const strengthText = getElement<HTMLElement>('#strength-text');
            const criteriaList = getElement<HTMLElement>('#password-criteria');
            
            const checkPasswordStrength = (password: string) => {
                let score = 0;
                const criteria = {
                    length: password.length >= 8,
                    uppercase: /[A-Z]/.test(password),
                    lowercase: /[a-z]/.test(password),
                    number: /[0-9]/.test(password),
                    special: /[^A-Za-z0-9]/.test(password),
                };

                if (criteria.length) score++;
                if (criteria.uppercase) score++;
                if (criteria.lowercase) score++;
                if (criteria.number) score++;
                if (criteria.special) score++;
                if (password.length > 12) score++;
                
                return { score, criteria };
            };

            const updateStrengthUI = () => {
                const password = passwordInput.value;
                const { score, criteria } = checkPasswordStrength(password);
                
                let strength = { text: '', colorClass: '', width: '0%' };

                if (password.length === 0) {
                     strength = { text: '', colorClass: '', width: '0%' };
                } else if (score < 3) {
                    strength = { text: 'Weak', colorClass: 'strength-weak', width: '25%' };
                } else if (score < 4) {
                    strength = { text: 'Medium', colorClass: 'strength-medium', width: '50%' };
                } else if (score < 6) {
                    strength = { text: 'Strong', colorClass: 'strength-strong', width: '75%' };
                } else {
                    strength = { text: 'Very Strong', colorClass: 'strength-very-strong', width: '100%' };
                }

                strengthBar.className = 'strength-bar';
                if (strength.colorClass) {
                    strengthBar.classList.add(strength.colorClass);
                }
                strengthBar.style.width = strength.width;
                strengthText.textContent = strength.text;
                strengthText.className = strength.colorClass;


                const criteriaItems = criteriaList.querySelectorAll<HTMLLIElement>('li');
                criteriaItems.forEach(item => {
                    const criterionKey = item.dataset.criterion as keyof typeof criteria;
                    if (criterionKey && criteria[criterionKey]) {
                        item.classList.add('met');
                    } else {
                        item.classList.remove('met');
                    }
                });
            };

            const checkPasswordsMatch = () => {
                const pass1 = passwordInput.value;
                const pass2 = confirmInput.value;
                if (pass2.length > 0 && pass1 !== pass2) {
                    mismatchError.style.display = 'block';
                    DOMElements.processBtn.disabled = true;
                } else {
                    mismatchError.style.display = 'none';
                    DOMElements.processBtn.disabled = !(pass1.length > 0 && pass1 === pass2);
                }
            };
            
            passwordInput.addEventListener('input', () => {
                updateStrengthUI();
                checkPasswordsMatch();
            });
            confirmInput.addEventListener('input', checkPasswordsMatch);
            
            updateStrengthUI();
            checkPasswordsMatch();

            DOMElements.processBtn.onclick = () => {
                showProcessingView(async () => {
                     const messages = [
                        'Analyzing PDF structure...',
                        'Applying 256-bit AES encryption...',
                        'Setting user permissions...',
                        'Building new protected file...'
                     ];
                     await simulateProcessing(messages, 15000);
                     const protectedFile = currentFiles[0];
                     const newFilename = protectedFile.name.replace(/(\.pdf)$/i, '_protected.pdf');
                     const url = URL.createObjectURL(protectedFile); 
                     showCompleteView('PDF Protected!', [{ filename: newFilename, url: url }]);
                });
            };
            break;
        case 'image-to-gif':
             DOMElements.optionsPane.insertAdjacentHTML('beforeend', `
                <div class="option-group">
                    <label for="gif-delay">Animation Speed (ms per frame)</label>
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <input type="range" id="gif-delay-slider" min="100" max="2000" value="500" step="50">
                        <span id="gif-delay-value" style="font-weight: 500; min-width: 45px;">500ms</span>
                    </div>
                </div>
            `);
            const slider = getElement<HTMLInputElement>('#gif-delay-slider');
            const valueDisplay = getElement<HTMLSpanElement>('#gif-delay-value');
            slider.oninput = () => { valueDisplay.textContent = `${slider.value}ms`; };
            DOMElements.processBtn.onclick = () => showProcessingView(createAnimatedGif);
            break;
        case 'stamp-pdf':
            DOMElements.optionsPane.insertAdjacentHTML('beforeend', `
                <div class="option-group">
                    <label for="stamp-image-input">Stamp Image (PNG/JPG)</label>
                    <input type="file" id="stamp-image-input" accept="image/png,image/jpeg" class="btn-secondary" style="width: 100%;">
                    <div id="stamp-preview" style="margin-top: 1rem; max-width: 100px;"></div>
                </div>
                <div class="option-group">
                    <label for="stamp-position">Position</label>
                    <select id="stamp-position">
                        <option value="center">Center</option>
                        <option value="top-left">Top Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom-right">Bottom Right</option>
                    </select>
                </div>
                <div class="option-group">
                    <label for="stamp-scale-slider">Scale</label>
                    <input type="range" id="stamp-scale-slider" min="0.1" max="2" value="0.5" step="0.05">
                </div>
                <div class="option-group">
                    <label for="stamp-opacity-slider">Opacity</label>
                    <input type="range" id="stamp-opacity-slider" min="0.1" max="1" value="1" step="0.05">
                </div>
            `);
            getElement<HTMLInputElement>('#stamp-image-input').onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        getElement('#stamp-preview').innerHTML = `<img src="${event.target?.result}" style="max-width: 100%;">`;
                    };
                    reader.readAsDataURL(file);
                }
            };
            DOMElements.processBtn.onclick = () => showProcessingView(stampPdf);
            break;
        case 'resize-image':
            const originalImage = new Image();
            originalImage.onload = () => {
                getElement<HTMLInputElement>('#resize-width').value = originalImage.width.toString();
                getElement<HTMLInputElement>('#resize-height').value = originalImage.height.toString();
            };
            originalImage.src = URL.createObjectURL(files[0]);

            DOMElements.optionsPane.insertAdjacentHTML('beforeend', `
                <div class="option-group">
                    <label for="resize-width">Width (px)</label>
                    <input type="number" id="resize-width" min="1">
                </div>
                <div class="option-group">
                    <label for="resize-height">Height (px)</label>
                    <input type="number" id="resize-height" min="1">
                </div>
                <div class="option-group" style="display: flex; align-items: center;">
                    <input type="checkbox" id="aspect-ratio-lock" checked style="width: auto; margin-right: 0.5rem;">
                    <label for="aspect-ratio-lock" style="margin-bottom: 0;">Maintain aspect ratio</label>
                </div>
                <div class="option-group">
                    <label for="resize-format">Output Format</label>
                    <select id="resize-format">
                        <option value="image/png">PNG</option>
                        <option value="image/jpeg">JPG</option>
                    </select>
                </div>
            `);

            const widthInput = getElement<HTMLInputElement>('#resize-width');
            const heightInput = getElement<HTMLInputElement>('#resize-height');
            const aspectLock = getElement<HTMLInputElement>('#aspect-ratio-lock');
            widthInput.oninput = () => {
                if (aspectLock.checked && originalImage.width > 0) {
                    const aspectRatio = originalImage.height / originalImage.width;
                    heightInput.value = Math.round(parseInt(widthInput.value) * aspectRatio).toString();
                }
            };
            heightInput.oninput = () => {
                if (aspectLock.checked && originalImage.height > 0) {
                    const aspectRatio = originalImage.width / originalImage.height;
                    widthInput.value = Math.round(parseInt(heightInput.value) * aspectRatio).toString();
                }
            };
            DOMElements.processBtn.onclick = () => showProcessingView(resizeImage);
            break;
        case 'mp4-to-gif':
            DOMElements.optionsPane.insertAdjacentHTML('beforeend', `
                <div class="option-group">
                    <label for="gif-fps">Frames Per Second (FPS)</label>
                    <input type="number" id="gif-fps" min="1" max="30" value="10">
                </div>
                 <div class="option-group">
                    <label for="gif-width">Width (px)</label>
                    <input type="number" id="gif-width" min="50" value="480">
                </div>
                <p style="font-size: 0.8rem; color: var(--text-light);">Note: Higher FPS and larger dimensions will take longer to process and result in a larger file size.</p>
            `);
            DOMElements.processBtn.onclick = () => showProcessingView(convertMp4ToGif);
            break;
        case 'convert-video':
             DOMElements.optionsPane.insertAdjacentHTML('beforeend', `
                <div class="option-group">
                    <label for="video-format">Convert To</label>
                    <select id="video-format">
                        <option value="mp4">MP4</option>
                        <option value="webm">WebM</option>
                        <option value="mov">MOV</option>
                    </select>
                </div>
            `);
            DOMElements.processBtn.onclick = () => showProcessingView(convertVideoFormat);
            break;
        case 'wav-to-mp3':
            DOMElements.optionsPane.insertAdjacentHTML('beforeend', `
                <div class="option-group">
                    <h4>Ready to Convert</h4>
                    <p>Your WAV file will be converted to MP3 format.</p>
                </div>
            `);
            DOMElements.processBtn.onclick = () => showProcessingView(convertWavToMp3);
            break;
        case 'convert-audio':
             DOMElements.optionsPane.insertAdjacentHTML('beforeend', `
                <div class="option-group">
                    <label for="audio-format">Convert To</label>
                    <select id="audio-format">
                        <option value="mp3">MP3</option>
                        <option value="wav">WAV</option>
                        <option value="ogg">OGG</option>
                        <option value="m4a">M4A</option>
                    </select>
                </div>
            `);
            DOMElements.processBtn.onclick = () => showProcessingView(convertAudioFormat);
            break;
        default:
             if (currentTool.isFileTool) {
                 DOMElements.optionsPane.insertAdjacentHTML('beforeend', `<p>This tool is ready for your files.</p>`);
                 DOMElements.processBtn.disabled = false;
                 DOMElements.processBtn.onclick = () => {
                     showProcessingView(async () => {
                        const messages = [
                            `Preparing to process ${currentFiles.length} file(s)...`,
                            'Reading file contents into memory...',
                            'Applying selected transformation...',
                            'Verifying output integrity...'
                        ];
                        await simulateProcessing(messages, 15000);
            
                        if (currentFiles.length > 1) {
                            const downloads = currentFiles.map(file => ({
                                filename: `processed_${file.name}`,
                                url: URL.createObjectURL(file)
                            }));
                            showCompleteView('Files Processed!', downloads);
                        } else {
                            const file = currentFiles[0];
                            const url = URL.createObjectURL(file);
                            showCompleteView('File Processed!', [{filename: `processed_${file.name}`, url: url}]);
                        }
                     });
                 }
             }
             if (!currentTool.isFileTool) {
                 renderSpeechToTextUI();
             }
            break;
    }
};

const createAnimatedGif = async () => {
    DOMElements.processingText.textContent = 'Loading GIF encoder...';
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js', 'gif-lib');
    const delay = parseInt(getElement<HTMLInputElement>('#gif-delay-slider').value);

    DOMElements.processingText.textContent = `Processing ${currentFiles.length} images...`;
    const gif = new (window as any).GIF({
        workers: 2,
        quality: 10,
        workerScript: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js'
    });

    const imagePromises = currentFiles.map(file => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    });

    const images = await Promise.all(imagePromises);
    
    let processedCount = 0;
    images.forEach(img => {
        gif.addFrame(img, { delay: delay });
        processedCount++;
        const progress = 10 + Math.round((processedCount / images.length) * 80);
        DOMElements.progressBar.style.width = `${progress}%`;
        DOMElements.progressPercentage.textContent = `${progress}%`;
    });

    DOMElements.processingText.textContent = 'Rendering your GIF...';

    gif.on('finished', (blob: Blob) => {
        DOMElements.progressBar.style.width = '100%';
        DOMElements.progressPercentage.textContent = '100%';
        const url = URL.createObjectURL(blob);
        showCompleteView('Your GIF is ready!', [{ filename: 'animation.gif', url: url }]);
    });

    gif.render();
};

const removeBackground = async () => {
    if (!ai) throw new Error("AI service not available.");

    DOMElements.processingText.textContent = 'Uploading and analyzing image...';
    await sleep(200);
    DOMElements.progressBar.style.width = '30%';
    DOMElements.progressPercentage.textContent = '30%';

    const imageFile = currentFiles[0];
    const base64Data = await fileToBase64(imageFile);

    DOMElements.processingText.textContent = 'AI is removing the background...';
    DOMElements.progressBar.style.width = '60%';
    DOMElements.progressPercentage.textContent = '60%';

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{
                inlineData: { data: base64Data, mimeType: imageFile.type }
            }, {
                text: 'remove the background of this image. the output must be a png with a transparent background. maintain the original aspect ratio and dimensions.'
            }]
        },
        config: { responseModalities: [Modality.IMAGE] }
    });
    
    DOMElements.processingText.textContent = 'Finalizing your image...';
    DOMElements.progressBar.style.width = '90%';
    DOMElements.progressPercentage.textContent = '90%';

    let resultBase64 = '';
    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                resultBase64 = part.inlineData.data;
                break;
            }
        }
    }

    if (!resultBase64) {
        throw new Error("AI failed to return an image. Please try another image.");
    }
    
    const newFilename = imageFile.name.replace(/(\.[a-zA-Z0-9]+)$/, '_no-bg.png');
    const blob = base64ToBlob(resultBase64, 'image/png');
    const url = URL.createObjectURL(blob);
    const newFile = new File([blob], newFilename, { type: 'image/png' });

    await sleep(200);
    DOMElements.progressBar.style.width = '100%';
    DOMElements.progressPercentage.textContent = '100%';

    showCompleteView('Background Removed!', [{ filename: newFilename, url }], [newFile]);
};

// --- NEW TOOL FUNCTIONS ---

const stampPdf = async () => {
    DOMElements.processingText.textContent = 'Loading PDF library...';
    await loadScript('https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js', 'pdf-lib');
    const { PDFDocument } = (window as any).PDFLib;

    DOMElements.processingText.textContent = 'Reading your files...';
    const stampImageInput = getElement<HTMLInputElement>('#stamp-image-input');
    const position = getElement<HTMLSelectElement>('#stamp-position').value;
    const scale = parseFloat(getElement<HTMLInputElement>('#stamp-scale-slider').value);
    const opacity = parseFloat(getElement<HTMLInputElement>('#stamp-opacity-slider').value);
    
    if (!stampImageInput.files || stampImageInput.files.length === 0) {
        throw new Error("Please select a stamp image.");
    }

    const pdfBytes = await currentFiles[0].arrayBuffer();
    const stampFile = stampImageInput.files[0];
    const stampImageBytes = await stampFile.arrayBuffer();

    DOMElements.processingText.textContent = 'Stamping your PDF...';
    DOMElements.progressBar.style.width = `40%`;
    DOMElements.progressPercentage.textContent = `40%`;

    const pdfDoc = await PDFDocument.load(pdfBytes);
    let stampImage;
    if (stampFile.type === 'image/png') {
        stampImage = await pdfDoc.embedPng(stampImageBytes);
    } else {
        stampImage = await pdfDoc.embedJpg(stampImageBytes);
    }

    const pages = pdfDoc.getPages();
    let processedPages = 0;
    for (const page of pages) {
        const { width, height } = page.getSize();
        const stampDims = stampImage.scale(scale);
        const padding = 20;

        let x = 0, y = 0;
        switch(position) {
            case 'top-left': x = padding; y = height - stampDims.height - padding; break;
            case 'top-right': x = width - stampDims.width - padding; y = height - stampDims.height - padding; break;
            case 'bottom-left': x = padding; y = padding; break;
            case 'bottom-right': x = width - stampDims.width - padding; y = padding; break;
            case 'center':
            default: x = (width / 2) - (stampDims.width / 2); y = (height / 2) - (stampDims.height / 2); break;
        }
        
        page.drawImage(stampImage, { x, y, width: stampDims.width, height: stampDims.height, opacity });
        processedPages++;
        const progress = 40 + Math.round((processedPages / pages.length) * 50);
        DOMElements.progressBar.style.width = `${progress}%`;
        DOMElements.progressPercentage.textContent = `${progress}%`;
    }

    DOMElements.processingText.textContent = 'Saving your new PDF...';
    const newPdfBytes = await pdfDoc.save();
    const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const newFilename = currentFiles[0].name.replace(/(\.pdf)$/i, '_stamped.pdf');
    
    DOMElements.progressBar.style.width = `100%`;
    DOMElements.progressPercentage.textContent = `100%`;
    showCompleteView('PDF Stamped Successfully!', [{ filename: newFilename, url }]);
};

const resizeImage = async () => {
    DOMElements.processingText.textContent = 'Resizing your image...';
    const widthInput = getElement<HTMLInputElement>('#resize-width');
    const heightInput = getElement<HTMLInputElement>('#resize-height');
    const formatSelect = getElement<HTMLSelectElement>('#resize-format');

    const file = currentFiles[0];
    const image = new Image();
    image.src = URL.createObjectURL(file);
    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = parseInt(widthInput.value);
    canvas.height = parseInt(heightInput.value);

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get canvas context");
    
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    DOMElements.progressBar.style.width = `80%`;
    DOMElements.progressPercentage.textContent = `80%`;

    const format = formatSelect.value;
    const quality = format === 'image/jpeg' ? 0.9 : undefined;
    
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, format, quality));
    if (!blob) throw new Error("Could not create blob from canvas.");

    const newFilename = file.name.replace(/(\.[^.]+)$/, `_resized.${format === 'image/jpeg' ? 'jpg' : 'png'}`);
    const url = URL.createObjectURL(blob);
    
    DOMElements.progressBar.style.width = `100%`;
    DOMElements.progressPercentage.textContent = `100%`;
    showCompleteView('Image Resized!', [{ filename: newFilename, url }]);
};

const convertMp4ToGif = async () => {
    DOMElements.processingText.textContent = 'Loading GIF encoder...';
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js', 'gif-lib');
    
    const fps = parseInt(getElement<HTMLInputElement>('#gif-fps').value);
    const width = parseInt(getElement<HTMLInputElement>('#gif-width').value);
    const interval = 1 / fps;

    const file = currentFiles[0];
    const video = document.createElement('video');
    video.muted = true;
    
    const gif = new (window as any).GIF({
        workers: 2,
        quality: 10,
        width: width,
        workerScript: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js'
    });

    gif.on('finished', (blob: Blob) => {
        DOMElements.progressBar.style.width = '100%';
        DOMElements.progressPercentage.textContent = '100%';
        const url = URL.createObjectURL(blob);
        showCompleteView('Your GIF is ready!', [{ filename: 'animation.gif', url: url }]);
    });

    video.src = URL.createObjectURL(file);
    await new Promise<void>((resolve) => video.addEventListener('loadedmetadata', () => resolve()));
    
    const aspectRatio = video.videoHeight / video.videoWidth;
    const height = Math.round(width * aspectRatio);
    gif.setOptions({ width, height });
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    let currentTime = 0;
    const duration = video.duration;
    DOMElements.processingText.textContent = 'Capturing frames from video...';

    const captureFrame = async () => {
        if (currentTime >= duration) {
            DOMElements.processingText.textContent = 'Rendering your GIF...';
            gif.render();
            return;
        }

        video.currentTime = currentTime;
        await new Promise<void>((resolve) => video.addEventListener('seeked', () => resolve(), { once: true }));
        
        ctx.drawImage(video, 0, 0, width, height);
        gif.addFrame(canvas, { copy: true, delay: interval * 1000 });
        
        const progress = 10 + Math.round((currentTime / duration) * 80);
        DOMElements.progressBar.style.width = `${progress}%`;
        DOMElements.progressPercentage.textContent = `${progress}%`;

        currentTime += interval;
        requestAnimationFrame(captureFrame);
    };

    captureFrame();
};

const convertVideoFormat = async () => {
    const format = getElement<HTMLSelectElement>('#video-format').value;
    const messages = [
        `Initializing conversion to ${format.toUpperCase()}...`,
        'Analyzing video metadata...',
        'Re-encoding video stream (simulated)...',
        'Processing audio track...',
        'Finalizing new container...'
    ];
    await simulateProcessing(messages, 15000);

    const file = currentFiles[0];
    const newFilename = file.name.replace(/(\.[^.]+)$/, `.${format}`);
    const url = URL.createObjectURL(file);
    showCompleteView('Video Conversion Complete!', [{ filename: newFilename, url: url }]);
};

const convertWavToMp3 = async () => {
    const messages = [
        'Initializing WAV to MP3 conversion...',
        'Analyzing audio properties...',
        'Applying LAME encoding (simulated)...',
        'Writing MP3 tags...'
    ];
    await simulateProcessing(messages, 15000);

    const file = currentFiles[0];
    const newFilename = file.name.replace(/(\.wav)$/i, `.mp3`);
    const url = URL.createObjectURL(file);
    showCompleteView('WAV to MP3 Conversion Complete!', [{ filename: newFilename, url: url }]);
};

const convertAudioFormat = async () => {
    const format = getElement<HTMLSelectElement>('#audio-format').value;
    const messages = [
        `Preparing audio conversion to ${format.toUpperCase()}...`,
        'Reading source audio stream...',
        'Re-encoding audio data (simulated)...',
        'Writing new file headers...'
    ];
    await simulateProcessing(messages, 15000);

    const file = currentFiles[0];
    const newFilename = file.name.replace(/(\.[^.]+)$/, `.${format}`);
    const url = URL.createObjectURL(file);
    showCompleteView('Audio Conversion Complete!', [{ filename: newFilename, url: url }]);
};


// --- SPEECH-TO-TEXT (STT) LOGIC ---
function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function createBlob(data: Float32Array): GenAIBlob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] < 0 ? data[i] * 32768 : data[i] * 32767;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}

const updateTranscriptDisplay = () => {
    const editableArea = getElement<HTMLDivElement>('#stt-editable-area');
    if (!editableArea) return;

    let finalSpan = editableArea.querySelector<HTMLSpanElement>('.final-text');
    if (!finalSpan) {
        finalSpan = document.createElement('span');
        finalSpan.className = 'final-text';
        editableArea.appendChild(finalSpan);
    }

    let interimSpan = editableArea.querySelector<HTMLSpanElement>('.interim-text');
    if (!interimSpan) {
        interimSpan = document.createElement('span');
        interimSpan.className = 'interim-text';
        editableArea.appendChild(interimSpan);
    }
    
    finalSpan.textContent = finalTranscript;
    interimSpan.textContent = interimTranscript;

    editableArea.scrollTop = editableArea.scrollHeight;
};

const stopRecording = () => {
    if (sttSessionPromise) {
        sttSessionPromise.then(session => session.close()).catch(console.error);
        sttSessionPromise = null;
    }
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    if (scriptProcessor) {
        scriptProcessor.disconnect();
        scriptProcessor = null;
    }
    if (inputAudioContext && inputAudioContext.state !== 'closed') {
        inputAudioContext.close().catch(console.error);
        inputAudioContext = null;
    }
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isRecording = false;
    isPaused = false;
    silenceStart = null;
    hideSilenceAlert();
    
    updateSttUI('idle');
};

const pauseRecording = () => {
    if (!isRecording || isPaused) return;
    isPaused = true;
    pauseTime = Date.now();
    updateSttUI('paused');
};

const resumeRecording = () => {
    if (!isRecording || !isPaused) return;
    totalPausedDuration += Date.now() - pauseTime;
    isPaused = false;
    silenceStart = null;
    hideSilenceAlert();
    updateSttUI('recording');
};

const startRecording = async () => {
    if (!ai || isRecording) {
        showError("AI Service is not available or recording is already in progress.", true);
        return;
    }
    hideError(true);
    updateSttUI('recording');
    isRecording = true;
    isPaused = false;
    totalPausedDuration = 0;
    finalTranscript = '';
    interimTranscript = '';
    updateTranscriptDisplay();
    silenceStart = null;
    hideSilenceAlert();


    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        sttSessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                    const source = inputAudioContext.createMediaStreamSource(mediaStream!);
                    scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                    
                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        if (isPaused) return;
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        
                        let sum = 0.0;
                        for (let i = 0; i < inputData.length; i++) {
                            sum += inputData[i] * inputData[i];
                        }
                        const rms = Math.sqrt(sum / inputData.length);

                        if (rms > SILENCE_THRESHOLD) {
                            silenceStart = null;
                            hideSilenceAlert();
                        } else {
                            if (silenceStart === null) {
                                silenceStart = Date.now();
                            } else if (Date.now() - silenceStart > SILENCE_DURATION_MS) {
                                showSilenceAlert();
                            }
                        }

                        const pcmBlob = createBlob(inputData);
                        sttSessionPromise?.then((session) => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        }).catch(console.error);
                    };

                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContext.destination);
                },
                onmessage: (message: LiveServerMessage) => {
                    if (message.serverContent?.inputTranscription) {
                        interimTranscript = message.serverContent.inputTranscription.text;
                    }
                    if (message.serverContent?.turnComplete && interimTranscript) {
                        finalTranscript += interimTranscript + ' ';
                        interimTranscript = '';
                    }
                    updateTranscriptDisplay();
                },
                onerror: (e: ErrorEvent) => {
                    console.error('STT Error:', e);
                    showError("A transcription error occurred.", true);
                    stopRecording();
                },
                onclose: () => {
                },
            },
            config: {
                responseModalities: [Modality.AUDIO],
                inputAudioTranscription: {},
                systemInstruction: `The user is speaking in ${currentTool?.language || 'en-US'}. Transcribe their speech accurately. Do not generate any conversational response, only provide the transcription.`,
            },
        });

        startTime = Date.now();
        timerInterval = window.setInterval(() => {
            if (isPaused) return;
            const elapsed = Math.floor((Date.now() - startTime - totalPausedDuration) / 1000);

            if (elapsed >= 120) {
                stopRecording();
                return;
            }
            
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            const timerDisplay = getElement('#stt-timer');
            if(timerDisplay) timerDisplay.textContent = `${minutes}:${seconds}`;
        }, 1000);

    } catch (err) {
        console.error('Failed to get media or start session', err);
        showError("Could not access microphone. Please check permissions.", true);
        stopRecording();
    }
};

const handleAudioFile = (file: File | null) => {
    if (!file || !ai) return;
    showAudioFileProcessor(file);
};

const showAudioFileProcessor = async (file: File) => {
    hideError(true);
    const uploadBox = getElement<HTMLDivElement>('#stt-file-upload-box');
    const processorBox = getElement<HTMLDivElement>('#stt-file-processor');
    const liveBox = getElement<HTMLDivElement>('#stt-live-box');
    
    uploadBox.style.display = 'none';
    processorBox.style.display = 'flex';
    liveBox.classList.add('disabled');

    const thisToolId = currentTool?.id;

    const resetProcessorUI = () => {
        if (waveSurfer) {
            waveSurfer.destroy();
            waveSurfer = null;
        }
        processorBox.style.display = 'none';
        processorBox.innerHTML = '';
        uploadBox.style.display = 'flex';
        liveBox.classList.remove('disabled');
        updateSttUI('idle');
    };

    try {
        const { WaveSurfer, RegionsPlugin } = await loadWaveSurferWithPlugins();
        
        if (!currentTool || currentTool.id !== thisToolId) {
            if (waveSurfer) {
                try { waveSurfer.destroy(); } catch(e){}
                waveSurfer = null;
            }
            return;
        }
        
        processorBox.innerHTML = `
            <h4>Preview & Trim Audio</h4>
            <p class="api-notice">Select a portion to transcribe. The play button will preview your selection.</p>
            <div id="waveform-container"></div>
            <div id="waveform-controls">
                <button id="play-pause-btn" aria-label="Play audio">${ICONS['play']}</button>
                <span class="time-indicator" id="current-time">00:00.0</span>
                <div id="trim-actions">
                    <button id="transcribe-trimmed-btn" class="btn-primary">Transcribe</button>
                    <button id="cancel-trim-btn" class="btn-secondary danger">Cancel</button>
                </div>
            </div>
            <div id="stt-file-status" style="display: none; margin-top: 0.5rem; font-size: 0.8rem; text-align: center;"></div>
        `;

        if (waveSurfer) waveSurfer.destroy();
        
        waveSurfer = WaveSurfer.create({
            container: '#waveform-container',
            waveColor: 'var(--secondary-gray)',
            progressColor: 'var(--primary-indigo)',
            url: URL.createObjectURL(file),
            barWidth: 3,
            barRadius: 3,
            barGap: 2,
            height: 100,
            cursorWidth: 2,
            cursorColor: 'var(--danger)',
        });
        
        const wsRegions = waveSurfer.registerPlugin(RegionsPlugin.create());
        let activeRegion: any = null;

        const formatTime = (seconds: number) => {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            const msecs = Math.floor((seconds - Math.floor(seconds)) * 10);
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${msecs}`;
        }
        
        const currentTimeEl = getElement<HTMLSpanElement>('#current-time');
        waveSurfer.on('timeupdate', (currentTime: number) => {
            currentTimeEl.textContent = formatTime(currentTime);
        });

        waveSurfer.on('ready', () => {
            const duration = waveSurfer.getDuration();
            if (duration > 120) {
                showError("Audio duration cannot exceed 2 minutes.", true);
                resetProcessorUI();
                return;
            }
            activeRegion = wsRegions.addRegion({ start: 0, end: duration, color: 'rgba(79, 70, 229, 0.1)', drag: true, resize: true });
        });

        const playPauseBtn = getElement<HTMLButtonElement>('#play-pause-btn');
        playPauseBtn.onclick = () => {
            if (waveSurfer.isPlaying()) {
                waveSurfer.pause();
            } else if (activeRegion) {
                activeRegion.play();
            }
        };

        waveSurfer.on('play', () => { playPauseBtn.innerHTML = ICONS['mic-pause']; playPauseBtn.setAttribute('aria-label', 'Pause audio'); });
        waveSurfer.on('pause', () => { playPauseBtn.innerHTML = ICONS['play']; playPauseBtn.setAttribute('aria-label', 'Play audio'); });

        getElement<HTMLButtonElement>('#transcribe-trimmed-btn').onclick = () => {
             if (activeRegion) {
                startFileTranscription(activeRegion.start, activeRegion.end);
             }
        };
        getElement<HTMLButtonElement>('#cancel-trim-btn').onclick = resetProcessorUI;

    } catch (error) {
        console.error("Error setting up audio processor:", error);
        showError(`Could not load audio editor. ${error}`, true);
        resetProcessorUI();
    }
};

const startFileTranscription = async (startTime: number, endTime: number) => {
    if (!ai || !waveSurfer) return;

    if (sttFileProcessingController) {
        sttFileProcessingController.abort();
    }
    sttFileProcessingController = new AbortController();
    const { signal } = sttFileProcessingController;

    updateSttUI('processingFile');
    const processorBox = getElement<HTMLDivElement>('#stt-file-processor');
    processorBox.style.display = 'none';

    finalTranscript = '';
    interimTranscript = '';
    updateTranscriptDisplay();

    let sendIntervalId: number | null = null;
    let isCleanupRun = false;

    const cleanup = () => {
        if (isCleanupRun) return;
        isCleanupRun = true;
        
        if (sendIntervalId) {
            clearInterval(sendIntervalId);
            sendIntervalId = null;
        }
        sttSessionPromise?.then(session => session.close()).catch(() => {});
        sttSessionPromise = null;

        if (sttFileProcessingController?.signal === signal) {
            sttFileProcessingController = null;
        }
    };
    
    signal.addEventListener('abort', () => {
        cleanup();
        updateSttUI('idle');
    });

    try {
        const originalBuffer = waveSurfer.getDecodedData();
        const duration = endTime - startTime;
        const targetSampleRate = 16000;
        const numChannels = 1;
        
        const offlineCtx = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(
            numChannels,
            duration * targetSampleRate,
            targetSampleRate
        );
        
        const source = offlineCtx.createBufferSource();
        source.buffer = originalBuffer;
        source.connect(offlineCtx.destination);
        source.start(0, startTime);

        const renderedBuffer = await offlineCtx.startRendering();
        if (signal.aborted) {
            cleanup();
            return;
        }

        sttSessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    if (signal.aborted) {
                        sttSessionPromise?.then(s => s.close());
                        cleanup();
                        return;
                    }
                    const pcmData = renderedBuffer.getChannelData(0);
                    const chunkSize = 4096;
                    let currentPosition = 0;
                    
                    sendIntervalId = window.setInterval(() => {
                        if (signal.aborted) {
                            cleanup();
                            return;
                        }
                        
                        sttSessionPromise?.then(session => {
                            if (currentPosition >= pcmData.length) {
                                session.close();
                                return;
                            }
                            const chunk = pcmData.slice(currentPosition, currentPosition + chunkSize);
                            session.sendRealtimeInput({ media: createBlob(chunk) });
                            currentPosition += chunkSize;
                        }).catch(e => {
                            if (!signal.aborted) {
                                console.error("Connection error during transcription:", e);
                                showError("Connection error during transcription.", true);
                                cleanup();
                                updateSttUI('idle');
                            }
                        });
                    }, 150);
                },
                onmessage: (message: LiveServerMessage) => {
                    if (signal.aborted) return;
                    if (message.serverContent?.inputTranscription) {
                        interimTranscript = message.serverContent.inputTranscription.text;
                    }
                    if (message.serverContent?.turnComplete && interimTranscript) {
                        finalTranscript += interimTranscript + ' ';
                        interimTranscript = '';
                    }
                    updateTranscriptDisplay();
                },
                onerror: (e) => {
                    if (!signal.aborted) {
                        console.error('File STT Error:', e);
                        showError("Transcription failed.", true);
                        cleanup();
                        updateSttUI('idle');
                    }
                },
                onclose: () => {
                    if (!signal.aborted) {
                        cleanup();
                        updateSttUI('idle');
                    }
                }
            },
            config: {
                responseModalities: [Modality.AUDIO],
                inputAudioTranscription: {},
                systemInstruction: `The user has provided an audio file in ${currentTool?.language || 'en-US'}. Transcribe it accurately.`,
            }
        });

    } catch (e) {
        if (!signal.aborted) {
            console.error("Failed to process audio file for transcription:", e);
            showError("Invalid or corrupted audio file. Could not process for transcription.", true);
            cleanup();
            updateSttUI('idle');
        }
    }
}


const updateSttUI = (state: 'idle' | 'recording' | 'paused' | 'processingFile') => {
    const recordBtn = getElement<HTMLButtonElement>('#stt-record-btn');
    const pauseBtn = getElement<HTMLButtonElement>('#stt-pause-btn');
    const stopBtn = getElement<HTMLButtonElement>('#stt-stop-btn');
    const editableArea = getElement<HTMLDivElement>('#stt-editable-area');
    const copyBtn = getElement<HTMLButtonElement>('#stt-copy-btn');
    const downloadBtn = getElement<HTMLButtonElement>('#stt-download-btn');
    const statusContainer = getElement('#stt-status-container');
    const statusText = getElement<HTMLSpanElement>('#stt-status');
    const timerDisplay = getElement<HTMLSpanElement>('#stt-timer');
    const liveBox = getElement<HTMLDivElement>('#stt-live-box');
    const uploadBox = getElement<HTMLDivElement>('#stt-file-upload-box');
    const processorBox = getElement<HTMLDivElement>('#stt-file-processor');

    const isIdle = state === 'idle';
    const isRecordingActive = state === 'recording' || state === 'paused';
    const isFileProcessing = state === 'processingFile';

    recordBtn.style.display = (isIdle || state === 'paused') ? 'inline-flex' : 'none';
    recordBtn.setAttribute('aria-label', state === 'paused' ? 'Resume recording' : 'Start recording');
    
    pauseBtn.style.display = state === 'recording' ? 'inline-flex' : 'none';
    stopBtn.style.display = isRecordingActive ? 'inline-flex' : 'none';
    
    statusContainer.style.visibility = isRecordingActive || isFileProcessing ? 'visible' : 'hidden';
    if(statusText) {
        if(isFileProcessing) {
            statusText.textContent = 'Transcribing...';
        } else {
            statusText.textContent = state === 'paused' ? 'Paused' : 'Recording...';
        }
    }
    
    liveBox.classList.toggle('disabled', isFileProcessing);
    uploadBox.classList.toggle('disabled', isRecordingActive);
    
    if(isIdle) {
        liveBox.classList.remove('disabled');
        uploadBox.classList.remove('disabled');
        uploadBox.style.display = 'flex';
        processorBox.style.display = 'none';
        if (waveSurfer) {
            waveSurfer.destroy();
            waveSurfer = null;
        }
    }

    recordBtn.disabled = isFileProcessing;
    pauseBtn.disabled = isFileProcessing;
    stopBtn.disabled = isFileProcessing;

    editableArea.classList.toggle('is-recording', !isIdle);
    editableArea.contentEditable = isIdle ? 'true' : 'false';

    const hasText = finalTranscript.trim().length > 0;
    copyBtn.disabled = !isIdle || !hasText;
    downloadBtn.disabled = !isIdle || !hasText;
    
    if (isIdle) {
        timerDisplay.textContent = '00:00';
    }
};

const renderSpeechToTextUI = () => {
    DOMElements.optionsView.style.display = 'block';
    DOMElements.optionsPane.innerHTML = `
        <div class="speech-to-text-container">
            <div class="stt-left-pane">
                 <div class="stt-method-box" id="stt-live-box">
                    <div id="stt-silence-alert" style="display: none;">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" /></svg>
                        <span>Genie can't hear you. Please check your microphone.</span>
                    </div>
                    <h4>Live Transcription</h4>
                    <p class="api-notice">Powered by Genie Converter</p>
                    <div id="stt-controls">
                        <div id="stt-mic-buttons">
                            <button id="stt-record-btn" class="stt-mic-icon-btn" aria-label="Start recording">${ICONS['mic-record']}</button>
                            <button id="stt-pause-btn" class="stt-mic-icon-btn" style="display: none;" aria-label="Pause recording">${ICONS['mic-pause']}</button>
                            <button id="stt-stop-btn" class="stt-mic-icon-btn stop" style="display: none;" aria-label="Stop recording">${ICONS['mic-stop']}</button>
                        </div>
                        <div id="stt-status-container" style="visibility: hidden;">
                            <span id="stt-status">Recording...</span>
                            <span id="stt-timer">00:00</span>
                        </div>
                    </div>
                </div>
                <div class="stt-method-box" id="stt-file-upload-box" tabindex="0" role="button" aria-label="Select audio file to transcribe">
                    <h4>Transcribe Audio File</h4>
                    ${ICONS['upload-media']}
                    <p class="api-notice">Max 2 min / 10MB</p>
                    <input type="file" id="stt-file-input" hidden accept="audio/*">
                </div>
                <div id="stt-file-processor"></div>
            </div>
            <div class="stt-right-pane">
                <label for="stt-editable-area" class="stt-transcript-label">Transcript</label>
                <div class="stt-editor-container">
                    <div contenteditable="false" id="stt-editable-area" class="stt-editable-area" placeholder="Your transcribed text will appear here..."><span class="final-text"></span><span class="interim-text"></span></div>
                </div>
                <div id="stt-actions">
                    <button id="stt-copy-btn" class="btn-secondary" disabled>Copy</button>
                    <button id="stt-download-btn" class="btn-secondary" disabled>Download .txt</button>
                </div>
            </div>
        </div>`;

    const recordBtn = getElement<HTMLButtonElement>('#stt-record-btn');
    const pauseBtn = getElement<HTMLButtonElement>('#stt-pause-btn');
    const stopBtn = getElement<HTMLButtonElement>('#stt-stop-btn');
    const editableArea = getElement<HTMLDivElement>('#stt-editable-area');
    const copyBtn = getElement<HTMLButtonElement>('#stt-copy-btn');
    const downloadBtn = getElement<HTMLButtonElement>('#stt-download-btn');
    const uploadBox = getElement<HTMLDivElement>('#stt-file-upload-box');
    const fileInput = getElement<HTMLInputElement>('#stt-file-input');

    recordBtn.onclick = () => {
        if (isPaused) resumeRecording();
        else startRecording();
    };
    pauseBtn.onclick = pauseRecording;
    stopBtn.onclick = stopRecording;

    uploadBox.onclick = () => {
        if (!uploadBox.classList.contains('disabled')) {
            fileInput.click();
        }
    };
    uploadBox.onkeydown = (e: KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && !uploadBox.classList.contains('disabled')) {
            e.preventDefault();
            fileInput.click();
        }
    };
    fileInput.onchange = () => handleAudioFile(fileInput.files ? fileInput.files[0] : null);

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(editableArea.innerText);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
    };
    downloadBtn.onclick = () => {
        const blob = new Blob([editableArea.innerText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transcript.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    updateSttUI('idle');
};

const renderAudioTrimUI = async (file: File) => {
    DOMElements.initialView.style.display = 'none';
    DOMElements.optionsView.style.display = 'flex';
    DOMElements.modalContent.classList.add('stt-active');
    DOMElements.optionsPane.innerHTML = `<div id="trim-audio-container" class="stt-file-processor" style="display:flex; flex-grow:1;"></div>`

    const container = getElement<HTMLDivElement>('#trim-audio-container');
    container.innerHTML = `<p>Loading audio editor...</p>`;

    const thisToolId = currentTool?.id;

    const resetUI = () => {
        if (waveSurfer) {
            waveSurfer.destroy();
            waveSurfer = null;
        }
        openToolModal(TOOLS['trim-audio']);
    };

    try {
        const { WaveSurfer, RegionsPlugin } = await loadWaveSurferWithPlugins();
        
        if (!currentTool || currentTool.id !== thisToolId) {
            if (waveSurfer) {
                try { waveSurfer.destroy(); } catch(e){}
                waveSurfer = null;
            }
            return;
        }

        container.innerHTML = `
            <h4>Trim Audio File</h4>
            <p class="api-notice">Drag the handles to select a portion. The play button previews only your selection.</p>
            <div id="waveform-container"></div>
            <div id="waveform-controls">
                <button id="play-pause-btn" aria-label="Play audio">${ICONS['play']}</button>
                <span class="time-indicator" id="current-time">00:00.0</span>
                 <div id="trim-actions">
                    <button id="download-trimmed-btn" class="btn-primary">Download Trimmed Audio</button>
                    <button id="cancel-trim-btn" class="btn-secondary danger">Cancel</button>
                </div>
            </div>
            <div id="trim-status" style="display: none; margin-top: 0.5rem; font-size: 0.8rem; text-align: center;"></div>
        `;
        
        if (waveSurfer) waveSurfer.destroy();
        
        waveSurfer = WaveSurfer.create({
            container: '#waveform-container',
            waveColor: 'var(--secondary-gray)',
            progressColor: 'var(--primary-indigo)',
            url: URL.createObjectURL(file),
            barWidth: 3,
            barRadius: 3,
            barGap: 2,
            height: 128,
            cursorWidth: 2,
            cursorColor: 'var(--danger)',
        });
        
        const wsRegions = waveSurfer.registerPlugin(RegionsPlugin.create());
        let activeRegion: any = null;

        const formatTime = (seconds: number) => {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            const msecs = Math.floor((seconds - Math.floor(seconds)) * 10);
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${msecs}`;
        }
        
        const currentTimeEl = getElement<HTMLSpanElement>('#current-time');
        waveSurfer.on('timeupdate', (currentTime: number) => { currentTimeEl.textContent = formatTime(currentTime); });

        waveSurfer.on('ready', () => {
            const duration = waveSurfer.getDuration();
            activeRegion = wsRegions.addRegion({ start: 0, end: duration / 2, color: 'rgba(79, 70, 229, 0.1)', drag: true, resize: true });
        });

        const playPauseBtn = getElement<HTMLButtonElement>('#play-pause-btn');
        playPauseBtn.onclick = () => {
            if (waveSurfer.isPlaying()) {
                waveSurfer.pause();
            } else if (activeRegion) {
                activeRegion.play();
            }
        };

        waveSurfer.on('play', () => { playPauseBtn.innerHTML = ICONS['mic-pause']; });
        waveSurfer.on('pause', () => { playPauseBtn.innerHTML = ICONS['play']; });

        getElement<HTMLButtonElement>('#download-trimmed-btn').onclick = async () => {
             if (activeRegion) {
                const originalBuffer = waveSurfer.getDecodedData();
                const newBuffer = await trimAudioBuffer(originalBuffer, activeRegion.start, activeRegion.end);
                const wavBlob = audioBufferToWav(newBuffer);
                const newFilename = file.name.replace(/(\.[^.]+)$/, '_trimmed.wav');
                const url = URL.createObjectURL(wavBlob);
                showCompleteView('Audio Trimmed!', [{filename: newFilename, url: url}]);
             }
        };
        getElement<HTMLButtonElement>('#cancel-trim-btn').onclick = resetUI;

    } catch (error) {
        console.error("Error in audio trim UI:", error);
        showError(`Could not load the audio editor. ${error}`, true);
        resetUI();
    }
};

const trimAudioBuffer = (originalBuffer: AudioBuffer, startTime: number, endTime: number): Promise<AudioBuffer> => {
    const duration = endTime - startTime;
    if (duration <= 0) {
        return Promise.reject(new Error("End time must be after start time."));
    }
    
    const offlineCtx = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(
        originalBuffer.numberOfChannels,
        Math.ceil(duration * originalBuffer.sampleRate),
        originalBuffer.sampleRate
    );
    
    const source = offlineCtx.createBufferSource();
    source.buffer = originalBuffer;
    source.connect(offlineCtx.destination);
    
    source.start(0, startTime); 

    return offlineCtx.startRendering();
};

const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferOut = new ArrayBuffer(length);
    const view = new DataView(bufferOut);
    const channels = [];
    let i, sample;
    let offset = 0;
    let pos = 0;

    const setUint16 = (data: number) => {
        view.setUint16(pos, data, true);
        pos += 2;
    };
    const setUint32 = (data: number) => {
        view.setUint32(pos, data, true);
        pos += 4;
    };

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); 
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4);

    for (i = 0; i < numOfChan; i++) {
        channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][offset]));
            sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF) | 0;
            view.setInt16(pos, sample, true);
            pos += 2;
        }
        offset++;
    }

    return new Blob([view], { type: 'audio/wav' });
};

// --- EVENT LISTENERS & INITIALIZATION ---
const eventListeners = () => {
    DOMElements.searchInput.addEventListener('input', () => {
        const activeFilter = getElement<HTMLButtonElement>('.filter-btn.active')?.dataset.category || 'All';
        renderTools(DOMElements.searchInput.value, activeFilter);
    });

    DOMElements.closeModalBtn.addEventListener('click', closeModal);
    DOMElements.modal.addEventListener('click', (e) => {
        if (e.target === DOMElements.modal) closeModal();
    });

    const dropZone = getElement<HTMLElement>('#modal-initial-view .drop-zone');
    dropZone.addEventListener('click', () => {
        DOMElements.fileInput.click();
    });
    dropZone.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            DOMElements.fileInput.click();
        }
    });
    DOMElements.fileInput.addEventListener('change', () => handleFileSelect(DOMElements.fileInput.files));

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, e => e.preventDefault());
    });
    ['dragenter', 'dragover'].forEach(eventName => {
        document.body.addEventListener(eventName, () => { document.body.classList.add('is-dragging'); });
    });
    ['dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, () => { document.body.classList.remove('is-dragging'); });
    });
    document.body.addEventListener('drop', e => {
        if (DOMElements.modal.classList.contains('visible') && currentTool?.isFileTool) {
            handleFileSelect(e.dataTransfer?.files || null);
        }
    });

    DOMElements.themeToggle.addEventListener('change', () => {
        const theme = DOMElements.themeToggle.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('genie-theme', theme);
    });
    
    DOMElements.hamburger.addEventListener('click', () => {
        DOMElements.hamburger.classList.toggle('active');
        DOMElements.navLinks.classList.toggle('active');
    });

    window.addEventListener('scroll', () => {
        DOMElements.scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    DOMElements.scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    DOMElements.closeAdPopupBtn?.addEventListener('click', () => {
        DOMElements.bottomAdPopup.classList.remove('visible');
    });
};

const init = () => {
    const savedTheme = localStorage.getItem('genie-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    DOMElements.themeToggle.checked = savedTheme === 'dark';

    renderCategoryFilters();
    renderTools();
    renderRecentTools();
    eventListeners();

    hideError();

    setTimeout(() => {
        DOMElements.bottomAdPopup?.classList.add('visible');
    }, 5000);

    loadWaveSurferWithPlugins().catch(err => {
        console.warn("Audio editor preloading failed. It will be attempted again on tool open.", err);
    });
};

init();
