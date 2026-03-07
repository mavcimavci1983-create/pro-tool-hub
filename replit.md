# ProToolHub — Multi-Utility Tool Platform

## Overview
TinyWow-inspired multi-utility platform with 53+ tools across PDF, Image, Video, Converter, AI Writing, and Other categories. Built for maximum SEO/AdSense revenue with bilingual EN/TR support.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + wouter routing
- **Backend**: Express.js on port 5000 (serves both API and frontend)
- **No Database**: All file processing is client-side or ephemeral server-side

## Key Files
- `client/src/components/tool/ToolWorkflow.tsx` — Core processing engine (v7). 22-tool catalog, multi-file support, TOOL_CATALOG + detectToolType with catalog-first matching.
- `client/src/components/home/ToolGrid.tsx` — Tool catalog with 53 tools, category tabs, search.
- `client/src/pages/GenericPdfTool.tsx` — PDF tool page template
- `client/src/pages/ImageTool.tsx` — Image tool page template
- `client/src/pages/VideoTool.tsx` — Video tool page template
- `client/src/pages/GenericAiTool.tsx` — AI writing tool page template
- `client/src/pages/GenericConverterTool.tsx` — Converter tool page template
- `server/routes.ts` — Backend API routes (/api/convert, /api/convert-excel, /api/convert-image, /api/convert-text, /api/pdf-action)
- `server/index.ts` — Express server entry point
- `client/src/locales/translations.json` — EN/TR translations
- `client/src/lib/languageStore.ts` — Zustand language store

## Backend Dependencies (PINNED VERSIONS — do not upgrade)
- `multer@1.4.5-lts.1` — File upload handling (LTS, memoryStorage only)
- `pdf-parse@1.1.1` — PDF text extraction. MUST use `require('pdf-parse/lib/pdf-parse.js')` safe path (skips test/ folder). v2+ has breaking API changes.
- `pdf-lib` — PDF manipulation (merge, split, rotate, watermark, page-numbers, delete-pages, reorder, compress, protect, unlock)
- `docx@8.5.0` — Word document generation (v9+ has breaking changes)
- `xlsx@0.18.5` — Excel spreadsheet generation (v0.19+ may require commercial license)
- `pdfjs-dist@3.11.174` — PDF rendering (server-side with node-canvas for PDF→Image)
- `canvas` — Server-side canvas for PDF rendering (requires libuuid system dep)
- `jspdf` — Client-side PDF generation

## Conversion Logic (ToolWorkflow v7)

### Client-side (no server)
- **Image → PDF**: jsPDF + Canvas 2x supersampling
- **Text → PDF**: jsPDF with pagination
- **CSV → JSON**: Client-side parser
- **JSON → CSV**: Client-side serializer

### Custom endpoints
- **PDF → Word**: POST /api/convert (pdf-parse + docx)
- **PDF → Excel**: POST /api/convert-excel (pdf-parse + xlsx)
- **PDF → Image**: Client-first pdfjs-dist CDN; fallback POST /api/convert-image (pdfjs-dist/legacy + canvas)
- **PDF → Text**: POST /api/convert-text (pdf-parse)

### /api/pdf-action (actionType parameter)
- **merge**: Multi-file upload (2+), pdf-lib copyPages
- **split**: Single file → ZIP of individual page PDFs
- **rotate**: All pages rotated by `angle` param (default 90°)
- **delete-pages**: Remove pages by `pages` param (comma-separated 1-based)
- **reorder**: Reorder pages by `order` param (comma-separated 1-based)
- **page-numbers**: Add centered page numbers at bottom
- **compress**: Re-save via pdf-lib (strips unused objects)
- **protect**: Placeholder (pdf-lib lacks encryption API)
- **unlock**: Load with ignoreEncryption, re-save
- **watermark**: Diagonal centered text with 30% opacity

## Tool Type System (v7)
- TOOL_CATALOG array with 22 ToolDefinition entries
- detectToolType: catalog exact-match FIRST, then keyword fallback
- MULTI_FILE_TOOLS: Set containing "merge" (enables multi-file input)
- SERVER_TOOLS: Set of all server-side tools
- Each catalog entry has: type, category, label, labelTr, accepts, actionType?, endpoint?, multiFile?

## Category IDs
"PDF", "Image", "Video", "Converter", "AI Writing", "Other"

## Deployment / Build
- Build: `npm run build` → Vite builds client to `dist/public/`, esbuild bundles server to `dist/index.cjs` (CJS format)
- `script/build.ts` has an esbuild plugin that replaces `import.meta.url` → `__import_meta_url` and `import.meta.dirname` → `__dirname` for CJS compatibility
- Banner injects `const __import_meta_url = require("url").pathToFileURL(__filename).href;` at top of CJS bundle
- All server files (`server/index.ts`, `server/static.ts`, `server/vite.ts`) use `fileURLToPath(import.meta.url)` + `dirname()` for `__filename`/`__dirname` polyfill
- Health check: `GET /api/health` returns `{ status: "ok", timestamp }` with 200

## esbuild Externals
These packages are NEVER bundled — they use runtime `require()`:
- `pdf-parse`, `pdf-parse/lib/pdf-parse.js`
- `pdfjs-dist/legacy/build/pdf.js`
- `canvas`
- `jszip`
- `pdf-lib`

## Important Patterns
- `pdf-parse@1.1.1` MUST be imported via `createRequire` + safe path: `_require("pdf-parse/lib/pdf-parse.js")`. Never use `import from "pdf-parse"` or `require("pdf-parse")`.
- `pdf-lib` imported via `_require("pdf-lib")` — provides PDFDocument, rgb, StandardFonts, degrees
- `detectToolType` uses catalog exact-match first, then keyword-based fallback with position logic for ambiguous cases
- COOP/COEP headers set in vite.config.ts for SharedArrayBuffer (FFmpeg.wasm)
- Processing progress uses ease-out animation (8s client, 50s server)
- Success flag ref prevents download of incomplete/corrupt files
- Meta Pixel tracking wrapped in safe try/catch
- Multi-file upload uses `uploadMulti.array("file", 20)` middleware for merge operations
