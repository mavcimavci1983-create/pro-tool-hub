# ProToolHub — Multi-Utility Tool Platform

## Overview
TinyWow-inspired multi-utility platform with 53+ tools across PDF, Image, Video, Converter, AI Writing, and Other categories. Built for maximum SEO/AdSense revenue with bilingual EN/TR support.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + wouter routing
- **Backend**: Express.js on port 5000 (serves both API and frontend)
- **No Database**: All file processing is client-side or ephemeral server-side

## Key Files
- `client/src/components/tool/ToolWorkflow.tsx` — Core processing engine (v4). Handles file upload, conversion, progress animation, download.
- `client/src/components/home/ToolGrid.tsx` — Tool catalog with 53 tools, category tabs, search.
- `client/src/pages/GenericPdfTool.tsx` — PDF tool page template
- `client/src/pages/ImageTool.tsx` — Image tool page template
- `client/src/pages/VideoTool.tsx` — Video tool page template
- `client/src/pages/GenericAiTool.tsx` — AI writing tool page template
- `client/src/pages/GenericConverterTool.tsx` — Converter tool page template
- `server/routes.ts` — Backend API routes (/api/convert for PDF-to-Word)
- `server/index.ts` — Express server entry point
- `client/src/locales/translations.json` — EN/TR translations
- `client/src/lib/languageStore.ts` — Zustand language store

## Backend Dependencies
- `multer` — File upload handling
- `pdf-parse` — PDF text extraction (CJS module, imported via createRequire)
- `docx` — Word document generation
- `jspdf` — Client-side PDF generation

## Conversion Logic (ToolWorkflow v4)
- **Image → PDF**: Client-side via jsPDF + Canvas 2x supersampling
- **Text → PDF**: Client-side via jsPDF with pagination
- **CSV → JSON**: Client-side parser
- **JSON → CSV**: Client-side serializer
- **PDF → Word**: Server-side via /api/convert (multer + pdf-parse + docx)

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
- `pdf-parse` must be imported via `createRequire` (no ESM default export)
- COOP/COEP headers set in vite.config.ts for SharedArrayBuffer (FFmpeg.wasm)
- Processing progress uses ease-out animation (8s client, 50s server)
- Success flag ref prevents download of incomplete/corrupt files
- Meta Pixel tracking wrapped in safe try/catch
