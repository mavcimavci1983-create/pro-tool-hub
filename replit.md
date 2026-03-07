# ProToolHub — Multi-Utility Tool Platform

## Overview
TinyWow-inspired multi-utility platform with 53+ tools across PDF, Image, Video, Converter, AI Writing, and Other categories. Built for maximum SEO/AdSense revenue with bilingual EN/TR support.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + wouter routing
- **Backend**: Express.js on port 5000 (serves both API and frontend)
- **No Database**: All file processing is client-side or ephemeral server-side

## Key Files
- `client/src/components/tool/ToolWorkflow.tsx` — Core processing engine (v6.1). Handles file upload, conversion, progress animation, download.
- `client/src/components/home/ToolGrid.tsx` — Tool catalog with 53 tools, category tabs, search.
- `client/src/pages/GenericPdfTool.tsx` — PDF tool page template
- `client/src/pages/ImageTool.tsx` — Image tool page template
- `client/src/pages/VideoTool.tsx` — Video tool page template
- `client/src/pages/GenericAiTool.tsx` — AI writing tool page template
- `client/src/pages/GenericConverterTool.tsx` — Converter tool page template
- `server/routes.ts` — Backend API routes (/api/convert, /api/convert-excel, /api/convert-image)
- `server/index.ts` — Express server entry point
- `client/src/locales/translations.json` — EN/TR translations
- `client/src/lib/languageStore.ts` — Zustand language store

## Backend Dependencies (PINNED VERSIONS — do not upgrade)
- `multer@1.4.5-lts.1` — File upload handling (LTS, memoryStorage only)
- `pdf-parse@1.1.1` — PDF text extraction. MUST use `require('pdf-parse/lib/pdf-parse.js')` safe path (skips test/ folder). v2+ has breaking API changes.
- `docx@8.5.0` — Word document generation (v9+ has breaking changes)
- `xlsx@0.18.5` — Excel spreadsheet generation (v0.19+ may require commercial license)
- `jspdf` — Client-side PDF generation

## Conversion Logic (ToolWorkflow v6.1)
- **Image → PDF**: Client-side via jsPDF + Canvas 2x supersampling
- **Text → PDF**: Client-side via jsPDF with pagination
- **CSV → JSON**: Client-side parser
- **JSON → CSV**: Client-side serializer
- **PDF → Word**: Server-side via POST /api/convert (multer + pdf-parse + docx)
- **PDF → Excel**: Server-side via POST /api/convert-excel (multer + pdf-parse + xlsx)
- **PDF → Image**: Client-first via pdfjs-dist browser + Canvas; fallback to server POST /api/convert-image (pdfjs-dist/legacy + node-canvas). Single page → JPG, multi-page → ZIP of JPGs.

## Category IDs
"PDF", "Image", "Video", "Converter", "AI Writing", "Other"

## Deployment / Build
- Build: `npm run build` → Vite builds client to `dist/public/`, esbuild bundles server to `dist/index.cjs` (CJS format)
- `script/build.ts` has an esbuild plugin that replaces `import.meta.url` → `__import_meta_url` and `import.meta.dirname` → `__dirname` for CJS compatibility
- Banner injects `const __import_meta_url = require("url").pathToFileURL(__filename).href;` at top of CJS bundle
- All server files (`server/index.ts`, `server/static.ts`, `server/vite.ts`) use `fileURLToPath(import.meta.url)` + `dirname()` for `__filename`/`__dirname` polyfill
- `pdf-parse` and `docx` are in the esbuild allowlist (bundled, not external)
- Health check: `GET /api/health` returns `{ status: "ok", timestamp }` with 200

## Important Patterns
- `pdf-parse@1.1.1` MUST be imported via `createRequire` + safe path: `_require("pdf-parse/lib/pdf-parse.js")`. Never use `import from "pdf-parse"` or `require("pdf-parse")` (index.js reads test/ folder → crash).
- esbuild config externalizes `pdf-parse`, `pdf-parse/lib/pdf-parse.js`, `pdfjs-dist/legacy/build/pdf.js`, `canvas`, `jszip` — never bundle them.
- `detectToolType` uses keyword-position logic to distinguish "PDF to JPG" (pdf-to-image) from "JPG to PDF" (image-to-pdf).
- COOP/COEP headers set in vite.config.ts for SharedArrayBuffer (FFmpeg.wasm)
- Processing progress uses ease-out animation (8s client, 50s server)
- Success flag ref prevents download of incomplete/corrupt files
- Meta Pixel tracking wrapped in safe try/catch
