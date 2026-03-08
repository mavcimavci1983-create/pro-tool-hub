# ProToolHub — Multi-Utility Tool Platform

## Overview
TinyWow-inspired multi-utility platform with 67+ tools across PDF, Image, Video, Converter, AI Writing, and Other categories. Built for maximum SEO/AdSense revenue with bilingual EN/TR support.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + wouter routing
- **Backend**: Express.js on port 5000 (serves both API and frontend)
- **No Database**: All file processing is client-side or ephemeral server-side

## Key Files
- `client/src/components/tool/ToolWorkflow.tsx` — Core processing engine (v7). 36-entry TOOL_CATALOG, multi-file support, detectToolType with catalog-first matching + position-based keyword fallback.
- `client/src/components/home/ToolGrid.tsx` — Tool catalog with 67 tools, category tabs, search. PDF tab shows 4 sub-categories (Organize, Convert FROM PDF, Convert TO PDF, Security & Optimize) with 30 PDF tools.
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
- `pdf-lib@1.17.1` — PDF manipulation (merge, split, rotate, watermark, page-numbers, delete-pages, reorder, compress, protect, unlock). 1.17.1 is the latest published version.
- `docx@8.5.0` — Word document generation (v9+ has breaking changes)
- `xlsx@0.18.5` — Excel spreadsheet generation (v0.19+ may require commercial license)
- `pdfjs-dist@3.11.174` — PDF rendering (server-side with node-canvas for PDF→Image)
- `canvas` — Server-side canvas for PDF rendering (requires libuuid system dep)
- `jspdf` — Client-side PDF generation
- `libreoffice-convert@1.4.0` — Word/Excel/PPT → PDF via LibreOffice (requires libreoffice system dep)
- `html-to-docx@1.8.0` — HTML → DOCX conversion (pure JS, no native deps). Used with libreoffice-convert for HTML → PDF pipeline.

## PDF Sub-Categories (ToolGrid)
When PDF tab is active, tools are organized under:
1. **Organize PDF** (10 tools): Merge, Split, Rotate, Page Numbers, Remove Pages, Reorder Pages, Edit PDF, Crop PDF, Repair PDF, Flatten PDF
2. **Convert FROM PDF** (7 tools): PDF to Word, PDF to Excel, PDF to PPT, PDF to JPG, PDF to Text, PDF to PDF/A, OCR PDF
3. **Convert TO PDF** (6 tools): Word to PDF, PPT to PDF, Excel to PDF, JPG to PDF, HTML to PDF, Scan to PDF
4. **Security & Optimize** (7 tools): Compress, Protect, Unlock, Watermark, Sign PDF, Compare PDF, Translate PDF

## Conversion Logic (ToolWorkflow v7.2)

### Client-side (no server)
- **Image → PDF**: jsPDF + Canvas 2x supersampling
- **Text → PDF**: jsPDF with pagination
- **CSV → JSON**: Client-side parser
- **JSON → CSV**: Client-side serializer

### Custom endpoints
- **PDF → Word**: POST /api/convert (pdf-parse + docx)
- **PDF → Excel**: POST /api/convert-excel (pdf-parse + xlsx)
- **PDF → Image**: Client-first pdfjs-dist CDN; fallback POST /api/convert-image (pdfjs-dist/legacy + canvas). Multi-page PDFs throw "MULTI_PAGE" → server returns ZIP.
- **PDF → Text**: POST /api/convert-text (pdf-parse)

### /api/compare-pdf (Two-file JSON diff)
- **Compare PDF**: Accepts `fileA` + `fileB` multer fields, extracts text via pdf-parse, returns JSON `{textA, textB}`
- Client-side LCS diff algorithm (ComparePdfTool) displays added/removed/same lines with color-coded diff view
- 10MB per file, 55s timeout
- Download report as .txt

### /api/translate-pdf (Google Translate)
- **Translate PDF**: Extract text via pdf-parse, chunk (max 500 chars), translate via `@vitalets/google-translate-api`, rebuild PDF via pdf-lib
- 15 supported languages: tr, en, de, fr, es, it, pt, ru, ja, zh, ar, ko, nl, pl, sv
- 10MB file limit, 55s timeout, rate-limit retry (429 → 2s wait)

### /api/convert-to-pdf (LibreOffice)
- **Word → PDF**: .doc/.docx via libreoffice-convert
- **Excel → PDF**: .xls/.xlsx via libreoffice-convert
- **PPT → PDF**: .ppt/.pptx via libreoffice-convert
- **HTML → PDF**: .html/.htm via html-to-docx → libreoffice-convert (two-step: HTML→DOCX→PDF)
- 30MB file limit, 55s timeout, lazy-loaded libs

### /api/pdf-action (actionType parameter)
- **merge**: Multi-file upload (2+), pdf-lib copyPages
- **split**: Single file → ZIP of individual page PDFs
- **rotate**: All pages rotated by `angle` param (default 90°)
- **delete-pages**: Remove pages by `pages` param (comma-separated 1-based)
- **reorder**: Reorder pages by `order` param (comma-separated 1-based, required)
- **page-numbers**: Add centered page numbers at bottom
- **compress**: Re-save via pdf-lib (strips unused objects)
- **protect**: Placeholder (pdf-lib lacks encryption API)
- **unlock**: Load with ignoreEncryption, re-save
- **watermark**: Diagonal centered text with 30% opacity

## Tool Type System (v7)
- TOOL_CATALOG array with 36 ToolDefinition entries (including aliases like JPG to PDF, Add Watermark, PPT to PDF)
- detectToolType: catalog exact-match FIRST, then keyword fallback with position-based disambiguation
- Position logic: "PDF to JPG" → pdf-to-image, "JPG to PDF" → image-to-pdf (word position determines direction)
- MULTI_FILE_TOOLS: Set containing "merge" (enables multi-file input)
- SERVER_TOOLS: Set of all server-side tools
- New tool types added: edit-pdf, crop-pdf, repair-pdf, flatten-pdf, pdf-to-pdfa, ocr-pdf, scan-to-pdf, sign-pdf, compare-pdf, translate-pdf
- Placeholder tools (identity/client-only without backend): Edit PDF, Crop PDF, Repair PDF, Flatten PDF, PDF to PPT, PDF to PDF/A, OCR PDF, Scan to PDF, Sign PDF, Compare PDF, Translate PDF

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
- `libreoffice-convert`
- `html-to-docx`
- `node-fetch`
- `@vitalets/google-translate-api`

## Frontend Dependencies
- `react-signature-canvas` — Client-side signature drawing for Sign PDF tool
- `pdf-lib` — Client-side PDF manipulation (Sign PDF embeds signature via pdf-lib in browser)

## Inline Tool Expansion (ToolGrid)
- INLINE_TOOL_LINKS: `/tools/add-watermark`, `/tools/sign-pdf`, `/tools/translate-pdf`, `/tools/compare-pdf`
- Components: WatermarkTool, SignPdfTool, TranslatePdfTool, ComparePdfTool (all standalone, no onClose prop)
- SecurityTools.tsx contains all 4 inline tool components

## Important Patterns
- `pdf-parse@1.1.1` MUST be imported via `createRequire` + safe path: `_require("pdf-parse/lib/pdf-parse.js")`. Never use `import from "pdf-parse"` or `require("pdf-parse")`.
- `pdf-lib` imported via `_require("pdf-lib")` — provides PDFDocument, rgb, StandardFonts, degrees
- `detectToolType` uses catalog exact-match first, then keyword-based fallback with position logic for ambiguous cases
- COOP/COEP headers set in vite.config.ts for SharedArrayBuffer (FFmpeg.wasm)
- Processing progress uses ease-out animation (8s client, 50s server)
- Success flag ref prevents download of incomplete/corrupt files
- Meta Pixel tracking wrapped in safe try/catch
- Multi-file upload uses `uploadMulti.array("file", 20)` middleware for merge operations
