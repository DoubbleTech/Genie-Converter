
import { GoogleGenAI } from "@google/genai";

// --- ICON DEFINITIONS ---
const ICONS = {
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
    'flag-pk': `<svg class="icon" viewBox="0 0 64 64"><defs><clipPath id="pk-clip"><rect width="64" height="64" rx="12"/></clipPath></defs><g clip-path="url(#pk-clip)"><rect width="64" height="64" fill="#00401A"/><rect width="16" height="64" fill="#FFF"/><circle cx="42" cy="32" r="12" fill="#FFF"/><circle cx="45" cy="32" r="10" fill="#00401A"/><polygon points="52,24 53,28 57,28 54,30.5 55,34.5 52,32 49,34.5 50,30.5 47,28 51,28" fill="#FFF"/></g></svg>`,
    'flag-uk': `<svg class="icon" viewBox="0 0 64 64"><defs><clipPath id="uk-clip"><rect width="64" height="64" rx="12"/></clipPath></defs><g clip-path="url(#uk-clip)"><rect width="64" height="64" fill="#012169"/><path d="M0,0 L64,64 M64,0 L0,64" stroke="#FFF" stroke-width="12.8"/><path d="M0,0 L64,64 M64,0 L0,64" stroke="#C8102E" stroke-width="7.68"/><path d="M0,25.6 V38.4 H64 V25.6 Z M25.6,0 H38.4 V64 H25.6 Z" fill="#FFF"/><path d="M0,28.8 V35.2 H64 V28.8 Z M28.8,0 H35.2 V64 H28.8 Z" fill="#C8102E"/></g></svg>`,

    'mic-record': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>`,
    'mic-pause': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>`,
    'mic-stop': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"></path></svg>`,
    'eye-preview': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`
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
let recordingInterval: number | null = null;
let wavesurfer: any = null;


// --- API INITIALIZATION ---
let ai;
try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    // Display an error message to the user
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = 'Could not initialize AI services. Please check your API key and refresh the page.';
        errorDiv.style.display = 'block';
    }
}

// --- TOOL FACTORY ---
const createSpeechToTextTool = (languageName: string, langCode: string, icon: string): Tool => ({
    id: `speech-to-text-${langCode}`,
    title: `Speech to Text ${languageName}`,
    subtitle: `Transcribe ${languageName} audio to text`,
    icon,
    accept: 'audio/*',
    isFileTool: false,
    language: langCode,
});


// --- TOOL DEFINITIONS ---
const TOOLS: Record<string, Tool> = {
    // PDF Tools
    'merge-pdf': { id: 'merge-pdf', title: 'Merge PDF', subtitle: 'Combine multiple PDFs into one.', icon: ICONS['merge-pdf'], accept: '.pdf', isFileTool: true, continue: ['split-pdf', 'compress-pdf', 'sign-pdf'] },
    'split-pdf': { id: 'split-pdf', title: 'Split PDF', subtitle: 'Extract pages from a PDF.', icon: ICONS['split-pdf'], accept: '.pdf', isFileTool: true },
    'compress-pdf': { id: 'compress-pdf', title: 'Compress PDF', subtitle: 'Reduce the file size of your PDF.', icon: ICONS['compress-pdf'], accept: '.pdf', isFileTool: true },
    'sign-pdf': { id: 'sign-pdf', title: 'Sign PDF', subtitle: 'Add your signature to a PDF.', icon: ICONS['sign-pdf'], accept: '.pdf', isFileTool: true },
    'stamp-pdf': { id: 'stamp-pdf', title: 'Stamp PDF', subtitle: 'Add an image stamp to a PDF.', icon: ICONS['stamp-pdf'], accept: '.pdf', isFileTool: true, isComingSoon: true },
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
    'resize-image': { id: 'resize-image', title: 'Resize Image', subtitle: 'Change image dimensions.', icon: ICONS['resize-image'], accept: 'image/*', isFileTool: true, isComingSoon: true },
    'png-to-jpg': { id: 'png-to-jpg', title: 'PNG to JPG', subtitle: 'Convert PNG to JPG format.', icon: ICONS['png-to-jpg'], accept: '.png', isFileTool: true },
    'jpg-to-png': { id: 'jpg-to-png', title: 'JPG to PNG', subtitle: 'Convert JPG to PNG format.', icon: ICONS['jpg-to-png'], accept: '.jpg,.jpeg', isFileTool: true },

    // Audio Tools
    'speech-to-text-en-us': createSpeechToTextTool('English (US)', 'en-US', ICONS['flag-us']),
    'speech-to-text-en-gb': createSpeechToTextTool('English (UK)', 'en-GB', ICONS['flag-uk']),
    'speech-to-text-es': createSpeechToTextTool('Spanish', 'es-ES', ICONS['flag-es']),
    'speech-to-text-fr': createSpeechToTextTool('French', 'fr-FR', ICONS['flag-fr']),
    'speech-to-text-de': createSpeechToTextTool('German', 'de-DE', ICONS['flag-de']),
    'speech-to-text-it': createSpeechToTextTool('Italian', 'it-IT', ICONS['flag-it']),
    'speech-to-text-pt': createSpeechToTextTool('Portuguese', 'pt-PT', ICONS['flag-pt']),
    'speech-to-text-ru': createSpeechToTextTool('Russian', 'ru-RU', ICONS['flag-ru']),
    'speech-to-text-zh': createSpeechToTextTool('Chinese', 'zh-CN', ICONS['flag-cn']),
    'speech-to-text-ja': createSpeechToTextTool('Japanese', 'ja-JP', ICONS['flag-jp']),
    'speech-to-text-hi': createSpeechToTextTool('Hindi', 'hi-IN', ICONS['flag-in']),
    'speech-to-text-ur': createSpeechToTextTool('Urdu', 'ur-PK', ICONS['flag-pk']),
};

const CATEGORIES: Category[] = [
    { title: 'PDF Tools', tools: ['merge-pdf', 'split-pdf', 'compress-pdf', 'organize-pdf', 'sign-pdf', 'watermark', 'rotate-pdf', 'page-numbers', 'protect-pdf', 'unlock-pdf', 'ocr-pdf', 'pdfa', 'stamp-pdf'] },
    { title: 'Convert to PDF', tools: ['word-to-pdf', 'powerpoint-to-pdf', 'excel-to-pdf', 'html-to-pdf', 'image-to-pdf'] },
    { title: 'Convert from PDF', tools: ['pdf-to-word', 'pdf-to-powerpoint', 'pdf-to-excel', 'pdf-to-jpg'] },
    { title: 'Image Tools', tools: ['resize-image', 'png-to-jpg', 'jpg-to-png'] },
    { title: 'Audio Tools', tools: ['speech-to-text-en-us', 'speech-to-text-en-gb', 'speech-to-text-es', 'speech-to-text-fr', 'speech-to-text-de', 'speech-to-text-it', 'speech-to-text-pt', 'speech-to-text-ru', 'speech-to-text-zh', 'speech-to-text-ja', 'speech-to-text-hi', 'speech-to-text-ur'] }
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
};

// --- UTILITY FUNCTIONS ---
const showError = (message: string) => {
    DOMElements.errorMessage.textContent = message;
    DOMElements.errorMessage.style.display = 'block';
};
const hideError = () => { DOMElements.errorMessage.style.display = 'none'; };
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- "RECENTLY USED" LOGIC ---
const getRecentTools = (): string[] => {
    return JSON.parse(localStorage.getItem('genie-recent-tools') || '[]');
};

const updateRecentTools = (toolId: string) => {
    let recent = getRecentTools();
    recent = recent.filter(id => id !== toolId);
    recent.unshift(toolId);
    localStorage.setItem('genie-recent-tools', JSON.stringify(recent.slice(0, 4)));
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
            } else {
                card.onclick = () => openToolModal(tool);
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
                } else {
                    card.onclick = () => openToolModal(tool);
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

    if (!tool.isFileTool) {
        const iconWithSize = tool.icon.replace('<svg class="icon"', '<svg class="icon modal-title-icon"');
        DOMElements.modalTitle.innerHTML = `<span style="display: flex; align-items: center; justify-content: center; gap: 1rem;">${iconWithSize} ${tool.title}</span>`;
    } else {
        DOMElements.modalTitle.textContent = tool.title;
    }
    
    DOMElements.modalSubtitle.textContent = tool.subtitle;

    DOMElements.modalContent.classList.toggle('stt-active', !tool.isFileTool);

    DOMElements.initialView.style.display = 'none';
    DOMElements.optionsView.style.display = 'none';
    DOMElements.processingView.style.display = 'none';
    DOMElements.completeView.style.display = 'none';

    if (tool.isFileTool) {
        DOMElements.processBtnContainer.style.display = 'block';
        DOMElements.initialView.style.display = 'flex';
        DOMElements.fileInput.accept = tool.accept;
        const isMultiple = ['merge-pdf', 'organize-pdf'].includes(tool.id);
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
    DOMElements.modal.classList.remove('visible');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    currentTool = null;
    currentFiles = [];

    if (recognition) {
        recognition.abort();
        recognition = null;
    }
    if (recordingInterval) {
        clearInterval(recordingInterval);
        recordingInterval = null;
    }
    if (wavesurfer) {
        wavesurfer.destroy();
        wavesurfer = null;
    }
    
    DOMElements.previewPane.innerHTML = '';
    DOMElements.optionsPane.innerHTML = '';

    DOMElements.modalContent.classList.remove('stt-active');
    DOMElements.modal.removeEventListener('keydown', handleModalKeydown);
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
                    showOptionsView(currentFiles);
                }, 200);
            };
            DOMElements.continueToolsGrid.appendChild(card);
        });
        DOMElements.continueToolsGrid.parentElement!.style.display = 'block';
    } else {
        DOMElements.continueToolsGrid.parentElement!.style.display = 'none';
    }
};

const showOptionsView = (files: File[]) => {
    currentFiles = files;
    DOMElements.initialView.style.display = 'none';
    DOMElements.optionsView.style.display = 'flex';
    DOMElements.processBtn.disabled = false;

    DOMElements.previewPane.innerHTML = '';
    DOMElements.optionsPane.innerHTML = '';

    const existingFileActions = getElement('.file-actions');
    if(existingFileActions) existingFileActions.remove();

    if (currentTool?.isFileTool && files.length > 0) {
        const fileActionsContainer = document.createElement('div');
        fileActionsContainer.className = 'file-actions';

        const fileList = document.createElement('div');
        fileList.className = 'file-list';

        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';

            const fileName = document.createElement('span');
            fileName.className = 'file-name';
            fileName.textContent = file.name;

            const previewBtn = document.createElement('button');
            previewBtn.className = 'file-preview-btn';
            previewBtn.innerHTML = ICONS['eye-preview'];
            previewBtn.title = `Preview ${file.name}`;
            previewBtn.onclick = () => {
                try {
                    const url = URL.createObjectURL(file);
                    window.open(url, '_blank');
                } catch (e) {
                    console.error("Could not create preview URL", e);
                    showError("Could not generate a preview for this file.");
                }
            };
            fileItem.appendChild(fileName);
            fileItem.appendChild(previewBtn);
            fileList.appendChild(fileItem);
        });

        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        if (DOMElements.fileInput.multiple) {
            actionButtons.innerHTML = `
                <button id="add-more-files-btn" class="btn-secondary">Add More</button>
                <button id="clear-all-files-btn" class="btn-secondary danger">Clear All</button>
            `;
        } else {
            actionButtons.innerHTML = `
                <button id="change-file-btn" class="btn-secondary">Change File</button>
            `;
        }
        
        fileActionsContainer.appendChild(fileList);
        fileActionsContainer.appendChild(actionButtons);
        
        DOMElements.optionsSidebarPane.insertBefore(fileActionsContainer, DOMElements.optionsSidebarPane.firstChild);

        const addMoreBtn = getElement<HTMLButtonElement>('#add-more-files-btn', fileActionsContainer);
        if (addMoreBtn) {
            addMoreBtn.onclick = () => DOMElements.fileInput.click();
        }

        const changeFileBtn = getElement<HTMLButtonElement>('#change-file-btn', fileActionsContainer);
        if (changeFileBtn) {
            changeFileBtn.onclick = () => DOMElements.fileInput.click();
        }

        const clearAllBtn = getElement<HTMLButtonElement>('#clear-all-files-btn', fileActionsContainer);
        if (clearAllBtn) {
            clearAllBtn.onclick = () => {
                currentFiles = [];
                DOMElements.optionsView.style.display = 'none';
                DOMElements.initialView.style.display = 'flex';
            };
        }
    }


    switch (currentTool?.id) {
        case 'image-to-pdf':
            handleImageToPdfOptions();
            break;
        case 'split-pdf':
        case 'organize-pdf':
            DOMElements.previewPane.innerHTML = `<div class="placeholder-text">PDF page previews will be available here soon.</div>`;
            DOMElements.optionsPane.innerHTML = `<p>Tool options will be available here soon.</p>`;
            DOMElements.processBtn.disabled = true; // Disable until implemented
            break;
        default:
            if (!currentTool?.isFileTool) {
                handleSpeechToTextOptions();
            } else {
                 DOMElements.optionsPane.innerHTML = `<p>No options available for this tool.</p>`;
            }
            break;
    }
};


// --- TOOL-SPECIFIC LOGIC ---

// --- IMAGE TO PDF ---
const handleImageToPdfOptions = () => {
    DOMElements.optionsPane.innerHTML = `
        <div class="option-group">
            <h4>Page Settings</h4>
            <label for="page-size">Page Size</label>
            <select id="page-size">
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
            </select>
        </div>
        <div class="option-group">
            <label for="orientation">Orientation</label>
            <select id="orientation">
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
            </select>
        </div>
    `;

    currentFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.createElement('img');
            img.src = e.target?.result as string;
            img.style.maxWidth = '100px';
            img.style.maxHeight = '141px';
            img.style.margin = '5px';
            DOMElements.previewPane.appendChild(img);
        };
        reader.readAsDataURL(file);
    });

    DOMElements.processBtn.onclick = () => showProcessingView(processImageToPdf);
};

const processImageToPdf = async () => {
    const { jsPDF } = (window as any).jspdf;
    const orientation = (getElement<HTMLSelectElement>('#orientation')).value as 'portrait' | 'landscape';
    
    const pdf = new jsPDF({ orientation, unit: 'px', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < currentFiles.length; i++) {
        const file = currentFiles[i];
        if (i > 0) pdf.addPage();
        
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise(resolve => { img.onload = resolve; });

        const imgWidth = img.width;
        const imgHeight = img.height;
        
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        
        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;
        
        const x = (pdfWidth - newWidth) / 2;
        const y = (pdfHeight - newHeight) / 2;
        
        const fileType = file.type === 'image/png' ? 'PNG' : 'JPEG';
        pdf.addImage(img, fileType, x, y, newWidth, newHeight);

        const progress = ((i + 1) / currentFiles.length) * 100;
        DOMElements.progressBar.style.width = `${progress}%`;
        DOMElements.progressPercentage.textContent = `${Math.round(progress)}%`;
        DOMElements.processingText.textContent = `Processing image ${i + 1} of ${currentFiles.length}`;
        await sleep(50);
    }
    
    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    
    const resultFile = new File([pdfBlob], 'converted.pdf', { type: 'application/pdf' });

    showCompleteView('Conversion Successful!', [{ filename: 'converted.pdf', url }], [resultFile]);
};

// --- SPEECH TO TEXT ---
let recognition: any = null;
let recordingState: 'idle' | 'recording' | 'paused' = 'idle';
let sttAudioFile: File | null = null;
let recordingStartTime = 0;

const handleSpeechToTextOptions = () => {
    DOMElements.optionsPane.innerHTML = `
        <div class="speech-to-text-container">
            <div class="stt-left-pane">
                <div class="stt-input-methods">
                    <div class="stt-method-box">
                        <h4>From Microphone</h4>
                        <div id="stt-controls">
                            <div id="stt-mic-buttons">
                                <button id="stt-record-btn" class="stt-mic-icon-btn" aria-label="Start Recording">${ICONS['mic-record']}</button>
                                <button id="stt-pause-btn" class="stt-mic-icon-btn" aria-label="Pause Recording" style="display:none;">${ICONS['mic-pause']}</button>
                                <button id="stt-stop-btn" class="stt-mic-icon-btn stop" aria-label="Stop Recording" style="display:none;">${ICONS['mic-stop']}</button>
                            </div>
                            <div id="stt-status-container">
                                <p id="stt-status" aria-live="polite">Status: Idle</p>
                                <span id="stt-timer">00:00</span>
                            </div>
                        </div>
                    </div>
                    <div class="stt-method-box">
                        <h4>From Audio File</h4>
                        <div id="waveform"></div>
                        <input type="file" id="stt-file-input" accept="${currentTool?.accept}" hidden />
                        <label for="stt-file-input" class="file-input-label">
                            <span id="stt-file-label">Click to select audio file</span>
                            <small id="stt-file-name"></small>
                        </label>
                        <button id="stt-process-file-btn" class="btn-secondary btn-primary-style" disabled>Transcribe File</button>
                        <p class="api-notice">Audio files are sent securely to Google for transcription and are not stored. Live microphone recording is processed entirely in your browser.</p>
                    </div>
                </div>
            </div>
            <div class="stt-right-pane">
                <label for="stt-output" class="stt-transcript-label">Transcript:</label>
                <div class="stt-editor-container">
                    <div id="stt-toolbar">
                        <button class="stt-format-btn" data-command="bold" title="Bold"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4.25-4H7v14h7.04c2.1 0 3.71-1.7 3.71-3.78 0-1.52-.86-2.82-2.15-3.43zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg></button>
                        <button class="stt-format-btn" data-command="italic" title="Italic"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg></button>
                        <button class="stt-format-btn" data-command="insertUnorderedList" title="Bullet List"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM8 19h12v-2H8v2zm0-6h12v-2H8v2zm0-8v2h12V5H8z"/></svg></button>
                    </div>
                    <div id="stt-output" class="stt-editable-area" contenteditable="true" placeholder="Your transcribed text will appear here..."></div>
                </div>
                <div id="stt-actions">
                     <button id="stt-copy-btn" class="btn-secondary btn-primary-style" disabled>Copy Text</button>
                     <button id="stt-clear-btn" class="btn-secondary">Clear</button>
                </div>
            </div>
        </div>
    `;

    const recordBtn = getElement<HTMLButtonElement>('#stt-record-btn');
    const pauseBtn = getElement<HTMLButtonElement>('#stt-pause-btn');
    const stopBtn = getElement<HTMLButtonElement>('#stt-stop-btn');
    const statusEl = getElement('#stt-status');
    const timerEl = getElement<HTMLSpanElement>('#stt-timer');
    const outputEl = getElement<HTMLDivElement>('#stt-output');
    const copyBtn = getElement<HTMLButtonElement>('#stt-copy-btn');
    const clearBtn = getElement<HTMLButtonElement>('#stt-clear-btn');
    const sttFileInput = getElement<HTMLInputElement>('#stt-file-input');
    const sttFileLabel = getElement<HTMLLabelElement>('#stt-file-label');
    const sttFileName = getElement('#stt-file-name');
    const toolbar = getElement('#stt-toolbar');
    const sttProcessFileBtn = getElement<HTMLButtonElement>('#stt-process-file-btn');
    const waveformContainer = getElement<HTMLDivElement>('#waveform');

    const updateCopyButtonState = () => {
        copyBtn.disabled = outputEl.innerText.trim().length === 0;
    };
    
    const setCaretToEnd = () => {
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(outputEl);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
    };

    outputEl.addEventListener('input', updateCopyButtonState);

    toolbar.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).closest('.stt-format-btn');
        if (target) {
            const command = target.getAttribute('data-command');
            if (command) {
                document.execCommand(command, false);
                outputEl.focus();
            }
        }
    });

    const setupRecognition = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            showError("Speech recognition is not supported in your browser.");
            return false;
        }
        
        recognition = new SpeechRecognition();
        recognition.lang = currentTool?.language || 'en-US';
        recognition.interimResults = true;
        recognition.continuous = true;

        recognition.onresult = (event: any) => {
            const existingInterim = outputEl.querySelector('span.interim-text');
            if (existingInterim) {
                existingInterim.remove();
            }

            let interim_transcript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript_part = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    outputEl.appendChild(document.createTextNode(transcript_part + ' '));
                } else {
                    interim_transcript += transcript_part;
                }
            }

            if (interim_transcript) {
                const newInterim = document.createElement('span');
                newInterim.className = 'interim-text';
                newInterim.textContent = interim_transcript;
                outputEl.appendChild(newInterim);
            }
            
            setCaretToEnd();
            updateCopyButtonState();
        };

        recognition.onerror = (event: any) => showError(`Speech recognition error: ${event.error}`);

        recognition.onend = () => {
            if (recordingState === 'recording') { // If it stops unexpectedly
                stopRecording();
            }
        };
        return true;
    };

    const startTimer = () => {
        recordingStartTime = Date.now() - (parseInt(timerEl.dataset.elapsed || '0', 10));
        if (recordingInterval) clearInterval(recordingInterval);
        recordingInterval = window.setInterval(() => {
            const elapsedMs = Date.now() - recordingStartTime;
            const elapsedSeconds = Math.floor(elapsedMs / 1000);

            if (elapsedSeconds >= 120) {
                timerEl.textContent = '02:00';
                stopRecording();
            } else {
                timerEl.dataset.elapsed = elapsedMs.toString();
                const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
                const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
                timerEl.textContent = `${minutes}:${seconds}`;
            }
        }, 1000);
    };

    const stopTimer = () => {
        if (recordingInterval) {
            clearInterval(recordingInterval);
            recordingInterval = null;
        }
    };

    const startRecording = () => {
        // Reset file input state when starting recording
        if (sttAudioFile) {
            sttAudioFile = null;
            sttFileLabel.style.display = 'flex';
            sttFileName.textContent = '';
            sttProcessFileBtn.disabled = true;
            if (sttFileInput) sttFileInput.value = '';
            if (wavesurfer) wavesurfer.empty();
        }

        if (!setupRecognition()) return;
        outputEl.contentEditable = 'false';
        outputEl.classList.add('is-recording');
        recognition.start();
        recordingState = 'recording';
        statusEl.textContent = 'Status: Recording...';
        recordBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-flex';
        stopBtn.style.display = 'inline-flex';
        startTimer();
    };

    const pauseRecording = () => {
        recognition.stop();
        recordingState = 'paused';
        statusEl.textContent = 'Status: Paused';
        pauseBtn.style.display = 'none';
        recordBtn.style.display = 'inline-flex'; // Behaves as resume
        stopTimer();
        outputEl.contentEditable = 'true';
        outputEl.classList.remove('is-recording');
    };

    const stopRecording = () => {
        if (recognition) recognition.stop();
        recordingState = 'idle';
        statusEl.textContent = 'Status: Idle';
        recordBtn.style.display = 'inline-flex';
        pauseBtn.style.display = 'none';
        stopBtn.style.display = 'none';
        stopTimer();
        timerEl.dataset.elapsed = '0';
        outputEl.innerHTML = outputEl.innerHTML.replace(/<span class="interim-text".*?><\/span>/, ''); // Clean up final interim text
        outputEl.contentEditable = 'true';
        outputEl.classList.remove('is-recording');
    };

    recordBtn.onclick = () => {
        if (recordingState === 'idle' || recordingState === 'paused') {
            startRecording(); // This will effectively start or resume
        }
    };
    
    pauseBtn.onclick = pauseRecording;
    stopBtn.onclick = stopRecording;

    sttFileInput.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            sttAudioFile = file;
            sttFileName.textContent = file.name;
            sttFileLabel.style.display = 'none';
            sttProcessFileBtn.disabled = false;
            if (recordingState !== 'idle') {
                stopRecording();
            }

            try {
                await loadScript('https://unpkg.com/wavesurfer.js@7', 'wavesurfer-lib');
                if (wavesurfer) {
                    wavesurfer.destroy();
                }
                wavesurfer = (window as any).WaveSurfer.create({
                    container: waveformContainer,
                    waveColor: 'violet',
                    progressColor: 'purple',
                    height: 60,
                    barWidth: 2,
                    responsive: true,
                });
                wavesurfer.load(URL.createObjectURL(file));
                waveformContainer.style.display = 'block';

            } catch (err) {
                console.error("Error loading wavesurfer:", err);
                waveformContainer.style.display = 'none';
                sttFileLabel.style.display = 'flex';
                sttFileName.textContent = file.name; // Show filename as fallback
            }
        }
    };
    
    const processAudioFile = async (file: File) => {
        if (!ai) {
            showError("AI Service is not available.");
            return;
        }

        recordBtn.disabled = true;
        sttFileInput.disabled = true;
        sttProcessFileBtn.disabled = true;
        sttProcessFileBtn.textContent = 'Transcribing...';
        statusEl.textContent = `Status: Processing ${file.name}...`;
        outputEl.innerHTML = '';
        outputEl.contentEditable = 'false';
        outputEl.classList.add('is-recording');

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            await new Promise<void>(resolve => reader.onload = () => resolve());
            
            const base64Data = (reader.result as string).split(',')[1];

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { inlineData: { mimeType: file.type, data: base64Data, }, },
                        { text: "Transcribe this audio." }
                    ],
                },
            });
            
            outputEl.innerHTML = response.text;
            updateCopyButtonState();

        } catch (error: any) {
            console.error(error);
            showError(`Transcription failed: The audio format may not be supported or another error occurred.`);
            outputEl.innerHTML = `Error: ${(error as Error).message}`;
        } finally {
            recordBtn.disabled = false;
            sttFileInput.disabled = false;
            statusEl.textContent = 'Status: Idle';
            sttProcessFileBtn.disabled = false;
            sttProcessFileBtn.textContent = 'Transcribe File';
            outputEl.contentEditable = 'true';
            outputEl.classList.remove('is-recording');
        }
    };

    sttProcessFileBtn.onclick = () => {
        if (sttAudioFile) {
            processAudioFile(sttAudioFile);
        }
    };

    copyBtn.onclick = () => {
        try {
            const htmlBlob = new Blob([outputEl.innerHTML], { type: 'text/html' });
            const textBlob = new Blob([outputEl.innerText], { type: 'text/plain' });
            const clipboardItem = new ClipboardItem({
                'text/html': htmlBlob,
                'text/plain': textBlob,
            });
            navigator.clipboard.write([clipboardItem]).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => copyBtn.textContent = 'Copy Text', 2000);
            });
        } catch (error) {
            console.error('Failed to copy rich text:', error);
            navigator.clipboard.writeText(outputEl.innerText).then(() => {
                copyBtn.textContent = 'Copied as plain text!';
                setTimeout(() => copyBtn.textContent = 'Copy Text', 2000);
            });
        }
    };

    clearBtn.onclick = () => {
        outputEl.innerHTML = '';
        timerEl.textContent = '00:00';
        timerEl.dataset.elapsed = '0';
        updateCopyButtonState();
    };
};



// --- FILE HANDLING and DRAG/DROP ---
const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const allowedTypes = currentTool?.accept.split(',');
    const selectedFiles = Array.from(files);

    const validFiles = selectedFiles.filter(file => {
        if (!file.name) return false;
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        return allowedTypes?.some(type => {
            if (type.startsWith('.')) return type === extension;
            if (type.endsWith('/*')) return file.type.startsWith(type.slice(0, -1));
            return file.type === type;
        });
    });

    if (validFiles.length !== selectedFiles.length) {
        const invalidFileNames = selectedFiles.filter(f => !validFiles.includes(f)).map(f => f.name).join(', ');
        showError(`Invalid file type for: ${invalidFileNames}. Please select ${currentTool?.accept} files.`);
        return;
    }

    let filesToShow: File[];
    if (DOMElements.fileInput.multiple && currentFiles.length > 0) {
        // "Add more" mode: filter out duplicates
        const newFiles = validFiles.filter(vf => !currentFiles.some(cf => cf.name === vf.name && cf.size === vf.size && cf.lastModified === vf.lastModified));
        filesToShow = [...currentFiles, ...newFiles];
    } else {
        filesToShow = validFiles;
    }
    
    if (currentTool?.accept.includes('.pdf') && !(window as any).pdfjsLib) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js', 'pdfjs-lib');
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;
    }
    if (currentTool?.id === 'image-to-pdf' && !(window as any).jspdf) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', 'jspdf-lib');
    }

    showOptionsView(filesToShow);
};

const setupDragAndDrop = () => {
    const showOverlay = () => document.body.classList.add('is-dragging');
    const hideOverlay = () => document.body.classList.remove('is-dragging');

    ['dragenter', 'dragover'].forEach(eventName => {
        window.addEventListener(eventName, (e) => {
            e.preventDefault();
            showOverlay();
        }, false);
    });

    window.addEventListener('dragleave', (e) => {
        if (e.clientX === 0 && e.clientY === 0) {
            hideOverlay();
        }
    }, false);

    window.addEventListener('drop', (e) => {
        e.preventDefault();
        hideOverlay();
        handleFileDrop(e.dataTransfer?.files);
    }, false);
};

const handleFileDrop = (files?: FileList | null) => {
    if (!files || files.length === 0) return;

    if (currentTool) {
        handleFileSelect(files);
        return;
    }

    const file = files[0];
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    const matchingTools = Object.values(TOOLS).filter(tool => {
        const accepted = tool.accept.split(',');
        return accepted.includes(extension) || accepted.includes(file.type);
    });

    if (matchingTools.length === 1) {
        openToolModal(matchingTools[0]);
        handleFileSelect(files);
    } else if (matchingTools.length > 1) {
        openServiceSelector(matchingTools, files);
    } else {
        showError("Sorry, we don't have a tool for that file type.");
    }
};

const openServiceSelector = (tools: Tool[], files: FileList) => {
    DOMElements.serviceList.innerHTML = '';
    let selectedToolId: string | null = null;

    const renderList = (filter = '') => {
        DOMElements.serviceList.innerHTML = '';
        const filteredTools = tools.filter(t => t.title.toLowerCase().includes(filter.toLowerCase()));
        
        filteredTools.forEach(tool => {
            const item = document.createElement('div');
            item.className = 'service-item';
            item.dataset.toolId = tool.id;
            item.innerHTML = `${tool.icon} <span>${tool.title}</span>`;
            item.onclick = () => {
                document.querySelectorAll('.service-item').forEach(el => el.classList.remove('selected'));
                item.classList.add('selected');
                selectedToolId = tool.id;
                DOMElements.letGenieConvertBtn.disabled = false;
            };
            DOMElements.serviceList.appendChild(item);
        });
    };
    
    renderList();
    DOMElements.selectorSearchInput.oninput = (e) => renderList((e.target as HTMLInputElement).value);

    DOMElements.letGenieConvertBtn.onclick = () => {
        if (selectedToolId) {
            const tool = TOOLS[selectedToolId];
            DOMElements.serviceSelectorModal.classList.remove('visible');
            openToolModal(tool);
            handleFileSelect(files);
        }
    };

    DOMElements.serviceSelectorModal.classList.add('visible');
};


// --- DYNAMIC SCRIPT LOADING ---
const loadedScripts: Record<string, boolean> = {};
const loadScript = (src: string, id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (loadedScripts[id]) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.onload = () => {
            loadedScripts[id] = true;
            resolve();
        };
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.body.appendChild(script);
    });
};


// --- THEME SWITCH ---
const setupTheme = () => {
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    const applyTheme = (theme: 'dark' | 'light') => {
        document.documentElement.setAttribute('data-theme', theme);
        DOMElements.themeToggle.checked = theme === 'dark';
        localStorage.setItem('theme', theme);
    };

    if (savedTheme) {
        applyTheme(savedTheme as 'dark' | 'light');
    } else {
        applyTheme(userPrefersDark ? 'dark' : 'light');
    }

    DOMElements.themeToggle.addEventListener('change', (e) => {
        const isChecked = (e.target as HTMLInputElement).checked;
        applyTheme(isChecked ? 'dark' : 'light');
    });
};


// --- EVENT LISTENERS ---
const setupEventListeners = () => {
    DOMElements.searchInput.addEventListener('input', () => {
        const activeCategory = document.querySelector('.filter-btn.active') as HTMLElement;
        renderTools(DOMElements.searchInput.value, activeCategory?.dataset.category || 'All');
    });

    DOMElements.closeModalBtn.onclick = closeModal;
    DOMElements.modal.onclick = (e) => {
        if (e.target === DOMElements.modal) {
            closeModal();
        }
    };
    DOMElements.selectFileBtn.onclick = () => DOMElements.fileInput.click();
    DOMElements.fileInput.onchange = () => handleFileSelect(DOMElements.fileInput.files);
    
    DOMElements.closeSelectorBtn.onclick = () => DOMElements.serviceSelectorModal.classList.remove('visible');
    DOMElements.serviceSelectorModal.onclick = (e) => {
        if (e.target === DOMElements.serviceSelectorModal) {
            DOMElements.serviceSelectorModal.classList.remove('visible');
        }
    };

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (DOMElements.modal.classList.contains('visible')) {
                closeModal();
            }
            if (DOMElements.serviceSelectorModal.classList.contains('visible')) {
                DOMElements.serviceSelectorModal.classList.remove('visible');
            }
        }
    });
    
    // Hamburger Menu
    DOMElements.hamburger.addEventListener('click', () => {
        DOMElements.hamburger.classList.toggle('active');
        DOMElements.navLinks.classList.toggle('active');
    });

    // Scroll to top
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            DOMElements.scrollToTopBtn.classList.add('visible');
        } else {
            DOMElements.scrollToTopBtn.classList.remove('visible');
        }
    });
    DOMElements.scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

};

// --- INITIALIZATION ---
const init = () => {
    renderRecentTools();
    renderCategoryFilters();
    setupEventListeners();
    setupDragAndDrop();
    setupTheme();
    // Use a timeout to render tools after a short delay, allowing the skeleton to be visible
    setTimeout(() => {
        renderTools();
    }, 300);
};

init();