import type { Express } from "express";
import { type Server } from "http";
import multer from "multer";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import * as XLSX from "xlsx";
import { createRequire } from "module";
const _require = createRequire(import.meta.url);
const pdfParse = _require("pdf-parse/lib/pdf-parse.js");
const { PDFDocument, rgb, StandardFonts, degrees } = _require("pdf-lib");

let pdfjsLib: any = null;
let canvasModule: any = null;

async function loadPdfjsServer() {
  if (!pdfjsLib) {
    pdfjsLib = _require("pdfjs-dist/legacy/build/pdf.js");
  }
  if (!canvasModule) {
    canvasModule = _require("canvas");
  }
  return { pdfjsLib, canvasModule };
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted"));
    }
  },
});

const uploadMulti = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, files: 20 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted"));
    }
  },
});

function textToParagraphs(rawText: string): Paragraph[] {
  const lines = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const paragraphs: Paragraph[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      paragraphs.push(new Paragraph({ text: "" }));
      continue;
    }
    const isHeading =
      trimmed === trimmed.toUpperCase() &&
      trimmed.length <= 60 &&
      /[A-ZÇĞİÖŞÜ]/.test(trimmed);

    if (isHeading) {
      paragraphs.push(new Paragraph({ text: trimmed, heading: HeadingLevel.HEADING_2 }));
    } else {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [new TextRun({ text: trimmed, size: 24, font: "Calibri" })],
        })
      );
    }
  }
  return paragraphs;
}

function textToSheetData(rawText: string): (string | number)[][] {
  const lines = rawText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return lines.map((line) => {
    if (line.includes("\t")) {
      return line.split("\t").map((cell) => {
        const n = Number(cell.trim());
        return isNaN(n) || cell.trim() === "" ? cell.trim() : n;
      });
    }
    if (/\s{2,}/.test(line)) {
      return line.split(/\s{2,}/).map((cell) => {
        const n = Number(cell.trim());
        return isNaN(n) || cell.trim() === "" ? cell.trim() : n;
      });
    }
    return [line];
  });
}

function handleMulterError(req: any, res: any, next: any) {
  upload.single("file")(req, res, (err: any) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "File too large. Maximum size is 20MB." });
      }
      return res.status(400).json({ error: err.message || "Upload failed" });
    }
    next();
  });
}

function handleMultiMulterError(req: any, res: any, next: any) {
  uploadMulti.array("file", 20)(req, res, (err: any) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "File too large. Maximum size is 20MB." });
      }
      return res.status(400).json({ error: err.message || "Upload failed" });
    }
    next();
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const TIMEOUT_MS = 55_000;

  app.post("/api/convert", handleMulterError, async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Processing timed out (55s)")), TIMEOUT_MS)
    );

    const conversionPromise = (async () => {
      let data: any;
      try {
        data = await pdfParse(req.file!.buffer);
      } catch (e: any) {
        throw new Error(`PDF could not be read: ${e.message}`);
      }

      const text = data.text ?? "";
      if (!text.trim()) {
        throw new Error("No text could be extracted from PDF. The file may be a scanned image (OCR required).");
      }

      const paragraphs = textToParagraphs(text);
      const doc = new Document({
        creator: "ProToolHub",
        description: "Converted from PDF",
        sections: [{ properties: {}, children: paragraphs }],
      });

      return await Packer.toBuffer(doc);
    })();

    try {
      const buffer = await Promise.race([conversionPromise, timeoutPromise]);
      const originalName = req.file.originalname.replace(/\.pdf$/i, "");
      const safeFileName = encodeURIComponent(`${originalName}.docx`);

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`);
      res.setHeader("Content-Length", buffer.length.toString());
      res.send(Buffer.from(buffer));
    } catch (err: any) {
      console.error("[/api/convert] Error:", err.message);
      const status = err.message.includes("timed out") ? 504 : 422;
      res.status(status).json({ error: err.message });
    }
  });

  app.post("/api/convert-excel", handleMulterError, async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Processing timed out (55s)")), TIMEOUT_MS)
    );

    const conversionPromise = (async () => {
      let data: any;
      try {
        data = await pdfParse(req.file!.buffer);
      } catch (e: any) {
        throw new Error(`PDF could not be read: ${e.message}`);
      }

      const rawText = data.text ?? "";
      if (!rawText.trim()) {
        throw new Error("No text could be extracted from PDF. The file may be a scanned image (OCR required).");
      }

      const rows = textToSheetData(rawText);
      if (rows.length === 0) throw new Error("No data found for Excel export.");

      const ws = XLSX.utils.aoa_to_sheet(rows);

      const firstRow = rows[0];
      const isHeader = firstRow.every(
        (c) => typeof c === "string" && c === c.toUpperCase() && /[A-ZÇĞİÖŞÜ]/.test(c)
      );
      if (isHeader && ws["!ref"]) {
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddr = XLSX.utils.encode_cell({ r: 0, c: col });
          if (!ws[cellAddr]) continue;
          ws[cellAddr].s = { font: { bold: true } };
        }
      }

      const colWidths = rows.reduce<number[]>((acc, row) => {
        row.forEach((cell, i) => {
          const len = String(cell).length;
          acc[i] = Math.min(Math.max(acc[i] ?? 10, len), 60);
        });
        return acc;
      }, []);
      ws["!cols"] = colWidths.map((w) => ({ wch: w }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      const xlsxBuffer = XLSX.write(wb, {
        type: "buffer",
        bookType: "xlsx",
        compression: true,
      }) as Buffer;

      return xlsxBuffer;
    })();

    try {
      const buffer = await Promise.race([conversionPromise, timeoutPromise]);
      const originalName = req.file.originalname.replace(/\.pdf$/i, "");
      const safeFileName = encodeURIComponent(`${originalName}.xlsx`);

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`);
      res.setHeader("Content-Length", buffer.length.toString());
      res.send(buffer);
    } catch (err: any) {
      console.error("[/api/convert-excel] Error:", err.message);
      const status = err.message.includes("timed out") ? 504 : 422;
      res.status(status).json({ error: err.message });
    }
  });

  app.post("/api/convert-image", handleMulterError, async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Processing timed out (55s)")), TIMEOUT_MS)
    );

    const conversionPromise = (async () => {
      const { pdfjsLib, canvasModule } = await loadPdfjsServer();
      const { createCanvas } = canvasModule;

      const data = new Uint8Array(req.file!.buffer);
      const pdf = await pdfjsLib.getDocument({ data, disableFontFace: true }).promise;
      const totalPages: number = pdf.numPages;

      const renderPage = async (pageNum: number): Promise<Buffer> => {
        const page = await pdf.getPage(pageNum);
        const scale = 2;
        const viewport = page.getViewport({ scale });
        const canvas = createCanvas(viewport.width, viewport.height);
        const ctx = canvas.getContext("2d");

        const renderContext = {
          canvasContext: ctx,
          viewport,
          canvasFactory: {
            create(w: number, h: number) {
              const c = createCanvas(w, h);
              return { canvas: c, context: c.getContext("2d") };
            },
            reset(canvasAndContext: any, w: number, h: number) {
              canvasAndContext.canvas.width = w;
              canvasAndContext.canvas.height = h;
            },
            destroy(canvasAndContext: any) {},
          },
        };

        await page.render(renderContext).promise;
        return canvas.toBuffer("image/jpeg", { quality: 0.92 });
      };

      if (totalPages === 1) {
        return { buffer: await renderPage(1), isMultiPage: false };
      }

      const JSZip = _require("jszip");
      const zip = new JSZip();
      for (let i = 1; i <= totalPages; i++) {
        const imgBuf = await renderPage(i);
        zip.file(`page_${String(i).padStart(3, "0")}.jpg`, imgBuf);
      }
      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
      return { buffer: zipBuffer as Buffer, isMultiPage: true };
    })();

    try {
      const resultData = await Promise.race([conversionPromise, timeoutPromise]) as { buffer: Buffer; isMultiPage: boolean };
      const buffer = resultData.buffer;
      const originalName = req.file.originalname.replace(/\.pdf$/i, "");

      if (resultData.isMultiPage) {
        const safeFileName = encodeURIComponent(`${originalName}_images.zip`);
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`);
      } else {
        const safeFileName = encodeURIComponent(`${originalName}.jpg`);
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`);
      }

      res.setHeader("Content-Length", buffer.length.toString());
      res.send(buffer);
    } catch (err: any) {
      console.error("[/api/convert-image] Error:", err.message);
      const status = err.message.includes("timed out") ? 504 : 422;
      res.status(status).json({ error: err.message });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════
  // POST /api/translate-pdf
  // ═══════════════════════════════════════════════════════════════════════

  const uploadTranslate = multer({
    storage: multer.memoryStorage(),
    limits:  { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req: any, file: any, cb: any) =>
      file.mimetype === "application/pdf"
        ? cb(null, true)
        : cb(new Error("Yalnızca PDF kabul edilir")),
  });

  const SUPPORTED_LANGS = new Set([
    "tr","en","de","fr","es","it","pt","ru","ja","zh","ar","ko","nl","pl","sv",
  ]);

  async function translateChunks(
    chunks: string[],
    targetLang: string,
  ): Promise<string[]> {
    const { translate } = _require("@vitalets/google-translate-api");
    const results: string[] = [];

    for (const chunk of chunks) {
      if (!chunk.trim()) { results.push(chunk); continue; }

      try {
        const resp = await translate(chunk, { to: targetLang });
        results.push(resp.text ?? chunk);
      } catch (e: any) {
        if (e.message?.includes("429") || e.message?.includes("Too Many")) {
          await new Promise(r => setTimeout(r, 2000));
          try {
            const retry = await translate(chunk, { to: targetLang });
            results.push(retry.text ?? chunk);
          } catch {
            results.push(chunk);
          }
        } else {
          throw new Error(`Translation API error: ${e.message?.slice(0,100)}`);
        }
      }
    }

    return results;
  }

  const handleTranslateMulterError = (err: any, _req: any, res: any, next: any) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    if (err) return res.status(400).json({ error: err.message });
    next();
  };

  app.post(
    "/api/translate-pdf",
    uploadTranslate.single("file"),
    handleTranslateMulterError,
    async (req: any, res: any): Promise<void> => {
      if (!req.file) {
        res.status(400).json({ error: "PDF dosyası bulunamadı" }); return;
      }

      const { targetLang = "en" } = req.body as Record<string,string>;

      if (!SUPPORTED_LANGS.has(targetLang)) {
        res.status(400).json({
          error: `Desteklenmeyen dil: "${targetLang}"`,
          supported: [...SUPPORTED_LANGS],
        });
        return;
      }

      try {
        const TIMEOUT = 55_000;
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Çeviri zaman aşımına uğradı (55s)")), TIMEOUT)
        );

        const translatePromise = (async () => {
          let data: any;
          try {
            data = await pdfParse(req.file!.buffer);
          } catch (e: any) {
            throw new Error(`PDF okunamadı: ${e.message}`);
          }

          const rawText = data.text ?? "";
          if (!rawText.trim()) throw new Error("PDF'den metin çıkarılamadı.");

          const lines  = rawText.replace(/\r\n?/g, "\n").split("\n");
          const chunks: string[] = [];
          let   current = "";

          for (const line of lines) {
            const candidate = current ? `${current}\n${line}` : line;
            if (candidate.length > 500 && current) {
              chunks.push(current);
              current = line;
            } else {
              current = candidate;
            }
          }
          if (current) chunks.push(current);

          const translated = await translateChunks(chunks, targetLang);
          const fullText   = translated.join("\n");

          const fontkit = _require("@pdf-lib/fontkit");
          const fs = _require("fs");
          const outDoc = await PDFDocument.create();
          outDoc.registerFontkit(fontkit);

          const FONT_PATHS = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/TTF/DejaVuSans.ttf",
            "/usr/share/fonts/dejavu/DejaVuSans.ttf",
          ];
          let fontBytes: Buffer | null = null;
          for (const fp of FONT_PATHS) {
            try { fontBytes = fs.readFileSync(fp); break; } catch {}
          }
          let font: any;
          if (fontBytes) {
            font = await outDoc.embedFont(fontBytes, { subset: true });
          } else {
            font = await outDoc.embedFont(StandardFonts.Helvetica);
          }
          const fontSize = 11;
          const lineH    = fontSize * 1.4;
          const MARGIN   = 50;
          const PAGE_W   = 595.28;
          const PAGE_H   = 841.89;
          const maxW     = PAGE_W - MARGIN * 2;
          const maxLines = Math.floor((PAGE_H - MARGIN * 2) / lineH);

          const allLines: string[] = [];
          for (const paragraph of fullText.split("\n")) {
            if (!paragraph.trim()) { allLines.push(""); continue; }
            const words = paragraph.split(" ");
            let   buf   = "";
            for (const word of words) {
              const test = buf ? `${buf} ${word}` : word;
              const testW = font.widthOfTextAtSize(test, fontSize);
              if (testW > maxW && buf) {
                allLines.push(buf);
                buf = word;
              } else {
                buf = test;
              }
            }
            if (buf) allLines.push(buf);
          }

          let lineIdx = 0;
          while (lineIdx < allLines.length) {
            const page  = outDoc.addPage([PAGE_W, PAGE_H]);
            let   y     = PAGE_H - MARGIN;
            let   count = 0;
            while (lineIdx < allLines.length && count < maxLines) {
              const line = allLines[lineIdx++];
              if (line) {
                page.drawText(line, {
                  x: MARGIN, y,
                  size: fontSize,
                  font,
                  color: rgb(0, 0, 0),
                });
              }
              y -= lineH;
              count++;
            }
          }

          return Buffer.from(await outDoc.save());
        })();

        const pdfBuffer = await Promise.race([translatePromise, timeoutPromise]) as Buffer;

        const baseName     = req.file.originalname.replace(/\.pdf$/i, "");
        const safeFileName = encodeURIComponent(`${baseName}_${targetLang}.pdf`);

        res
          .setHeader("Content-Type",        "application/pdf")
          .setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`)
          .setHeader("Content-Length",      pdfBuffer.length.toString())
          .send(pdfBuffer);

      } catch (err: any) {
        console.error("[/api/translate-pdf] Error:", err.message);
        const status = err.message.includes("zaman aşımı") || err.message.includes("timed out") ? 504 : 422;
        res.status(status).json({ error: err.message });
      }
    }
  );

  // ═══════════════════════════════════════════════════════════════════════
  // POST /api/compare-pdf — Compare two PDF documents
  // ═══════════════════════════════════════════════════════════════════════
  const uploadCompareFields = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 2 },
    fileFilter: (_req: any, file: any, cb: any) =>
      file.mimetype === "application/pdf"
        ? cb(null, true)
        : cb(new Error("Only PDF files are accepted")),
  });

  function handleCompareMulterError(req: any, res: any, next: any) {
    uploadCompareFields.fields([
      { name: "fileA", maxCount: 1 },
      { name: "fileB", maxCount: 1 },
    ])(req, res, (err: any) => {
      if (err instanceof multer.MulterError) return res.status(400).json({ error: `Upload error: ${err.message}` });
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  }

  app.post("/api/compare-pdf", handleCompareMulterError, async (req: any, res: any) => {
    const filesMap = req.files as Record<string, Express.Multer.File[]> | undefined;
    const fileAArr = filesMap?.["fileA"];
    const fileBArr = filesMap?.["fileB"];

    if (!fileAArr?.[0] || !fileBArr?.[0]) {
      res.status(400).json({ error: "Two PDF files required (fileA and fileB)." });
      return;
    }

    try {
      const TIMEOUT = 55_000;
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Compare timed out (55s)")), TIMEOUT)
      );

      const comparePromise = (async () => {
        let textA: string, textB: string;
        try {
          const dataA = await pdfParse(fileAArr[0].buffer);
          textA = (dataA.text ?? "").trim();
        } catch (e: any) {
          throw new Error(`PDF A could not be read: ${e.message}`);
        }
        try {
          const dataB = await pdfParse(fileBArr[0].buffer);
          textB = (dataB.text ?? "").trim();
        } catch (e: any) {
          throw new Error(`PDF B could not be read: ${e.message}`);
        }

        return { textA, textB };
      })();

      const result = await Promise.race([comparePromise, timeoutPromise]);
      res.json(result);
    } catch (err: any) {
      console.error("[/api/compare-pdf] Error:", err.message);
      const status = err.message.includes("timed out") ? 504 : 422;
      res.status(status).json({ error: err.message });
    }
  });

  app.post("/api/convert-text", handleMulterError, async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      let data: any;
      try {
        data = await pdfParse(req.file.buffer);
      } catch (e: any) {
        throw new Error(`PDF could not be read: ${e.message}`);
      }

      const text = data.text ?? "";
      if (!text.trim()) {
        throw new Error("No text could be extracted from PDF.");
      }

      const buffer = Buffer.from(text, "utf-8");
      const originalName = req.file.originalname.replace(/\.pdf$/i, "");
      const safeFileName = encodeURIComponent(`${originalName}.txt`);

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`);
      res.setHeader("Content-Length", buffer.length.toString());
      res.send(buffer);
    } catch (err: any) {
      console.error("[/api/convert-text] Error:", err.message);
      res.status(422).json({ error: err.message });
    }
  });

  app.post("/api/pdf-action", handleMultiMulterError, async (req, res) => {
    const actionType = req.body?.actionType as string;
    const files = (req as any).files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!actionType) {
      return res.status(400).json({ error: "Missing actionType parameter" });
    }

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Processing timed out (55s)")), TIMEOUT_MS)
    );

    const actionPromise = (async (): Promise<Buffer> => {
      switch (actionType) {
        case "merge": {
          if (files.length < 2) throw new Error("At least 2 PDF files required for merge.");
          const mergedPdf = await PDFDocument.create();
          for (const f of files) {
            const srcPdf = await PDFDocument.load(f.buffer);
            const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
            copiedPages.forEach((page: any) => mergedPdf.addPage(page));
          }
          return Buffer.from(await mergedPdf.save());
        }

        case "split": {
          const srcPdf = await PDFDocument.load(files[0].buffer);
          const pageCount = srcPdf.getPageCount();
          if (pageCount <= 1) {
            return Buffer.from(await srcPdf.save());
          }
          const JSZip = _require("jszip");
          const zip = new JSZip();
          for (let i = 0; i < pageCount; i++) {
            const newDoc = await PDFDocument.create();
            const [copiedPage] = await newDoc.copyPages(srcPdf, [i]);
            newDoc.addPage(copiedPage);
            const pdfBytes = await newDoc.save();
            zip.file(`page_${String(i + 1).padStart(3, "0")}.pdf`, pdfBytes);
          }
          return zip.generateAsync({ type: "nodebuffer" });
        }

        case "rotate": {
          const angleDeg = parseInt(req.body?.angle ?? "90", 10);
          const pdfDoc = await PDFDocument.load(files[0].buffer);
          const pages = pdfDoc.getPages();
          pages.forEach((page: any) => {
            page.setRotation(degrees((page.getRotation().angle + angleDeg) % 360));
          });
          return Buffer.from(await pdfDoc.save());
        }

        case "delete-pages": {
          const pagesToDelete = (req.body?.pages ?? "1")
            .split(",")
            .map((s: string) => parseInt(s.trim(), 10) - 1)
            .filter((n: number) => !isNaN(n))
            .sort((a: number, b: number) => b - a);
          const pdfDoc = await PDFDocument.load(files[0].buffer);
          for (const idx of pagesToDelete) {
            if (idx >= 0 && idx < pdfDoc.getPageCount()) {
              pdfDoc.removePage(idx);
            }
          }
          if (pdfDoc.getPageCount() === 0) throw new Error("Cannot delete all pages.");
          return Buffer.from(await pdfDoc.save());
        }

        case "reorder": {
          const orderStr = req.body?.order ?? "";
          if (!orderStr.trim()) throw new Error("Missing 'order' parameter (comma-separated page numbers).");
          const order = orderStr
            .split(",")
            .map((s: string) => parseInt(s.trim(), 10) - 1)
            .filter((n: number) => !isNaN(n));
          if (order.length === 0) throw new Error("Invalid 'order' parameter.");
          const srcPdf = await PDFDocument.load(files[0].buffer);
          const newDoc = await PDFDocument.create();
          const copiedPages = await newDoc.copyPages(srcPdf, order);
          copiedPages.forEach((page: any) => newDoc.addPage(page));
          return Buffer.from(await newDoc.save());
        }

        case "page-numbers": {
          const pdfDoc = await PDFDocument.load(files[0].buffer);
          const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
          const pages = pdfDoc.getPages();
          pages.forEach((page: any, i: number) => {
            const { width } = page.getSize();
            const text = `${i + 1}`;
            const textWidth = font.widthOfTextAtSize(text, 10);
            page.drawText(text, {
              x: (width - textWidth) / 2,
              y: 20,
              size: 10,
              font,
              color: rgb(0.4, 0.4, 0.4),
            });
          });
          return Buffer.from(await pdfDoc.save());
        }

        case "compress": {
          const pdfDoc = await PDFDocument.load(files[0].buffer, { ignoreEncryption: true });
          const compressedBytes = await pdfDoc.save();
          return Buffer.from(compressedBytes);
        }

        case "protect": {
          const password = req.body?.password ?? "1234";
          const pdfDoc = await PDFDocument.load(files[0].buffer);
          const protectedBytes = await pdfDoc.save();
          return Buffer.from(protectedBytes);
        }

        case "unlock": {
          const pdfDoc = await PDFDocument.load(files[0].buffer, { ignoreEncryption: true });
          return Buffer.from(await pdfDoc.save());
        }

        case "watermark": {
          const watermarkText = req.body?.watermark ?? "ProToolHub";
          const rawFontSize = Number(req.body?.fontSize ?? 0);
          const wmFontSize = rawFontSize > 0 ? Math.max(8, Math.min(200, rawFontSize)) : 0;
          const wmAngle    = Number(req.body?.angle ?? 45);
          const wmOpacity  = Math.max(0.01, Math.min(1, Number(req.body?.opacity ?? 0.3)));
          const wmColorR   = Math.max(0, Math.min(1, Number(req.body?.colorR ?? 0.75)));
          const wmColorG   = Math.max(0, Math.min(1, Number(req.body?.colorG ?? 0.75)));
          const wmColorB   = Math.max(0, Math.min(1, Number(req.body?.colorB ?? 0.75)));

          const pdfDoc = await PDFDocument.load(files[0].buffer);
          const fontkit = _require("@pdf-lib/fontkit");
          const fs = _require("fs");
          pdfDoc.registerFontkit(fontkit);
          const WM_FONT_PATHS = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf",
          ];
          let wmFontBytes: Buffer | null = null;
          for (const fp of WM_FONT_PATHS) {
            try { wmFontBytes = fs.readFileSync(fp); break; } catch {}
          }
          let font: any;
          if (wmFontBytes) {
            font = await pdfDoc.embedFont(wmFontBytes, { subset: true });
          } else {
            font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
          }
          const pages = pdfDoc.getPages();
          pages.forEach((page: any) => {
            const { width, height } = page.getSize();
            const size = wmFontSize || Math.min(width, height) * 0.1;
            const textWidth = font.widthOfTextAtSize(watermarkText, size);
            page.drawText(watermarkText, {
              x: (width - textWidth) / 2,
              y: height / 2,
              size,
              font,
              color: rgb(wmColorR, wmColorG, wmColorB),
              opacity: wmOpacity,
              rotate: degrees(wmAngle),
            });
          });
          return Buffer.from(await pdfDoc.save());
        }

        default:
          throw new Error(`Unknown actionType: ${actionType}`);
      }
    })();

    try {
      const buffer = await Promise.race([actionPromise, timeoutPromise]);
      const originalName = files[0].originalname.replace(/\.pdf$/i, "");

      const isSplit = actionType === "split";
      const srcCheck = isSplit ? await PDFDocument.load(files[0].buffer) : null;
      const isZip = isSplit && srcCheck && srcCheck.getPageCount() > 1;

      if (isZip) {
        const safeFileName = encodeURIComponent(`${originalName}_split.zip`);
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`);
      } else {
        const safeFileName = encodeURIComponent(`${originalName}_${actionType}.pdf`);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`);
      }

      res.setHeader("Content-Length", buffer.length.toString());
      res.send(buffer);
    } catch (err: any) {
      console.error(`[/api/pdf-action/${actionType}] Error:`, err.message);
      const status = err.message.includes("timed out") ? 504 : 422;
      res.status(status).json({ error: err.message });
    }
  });

  // ═══════════════════════════════════════════════════════════════════════
  // POST /api/convert-to-pdf — Word/Excel/PPT/HTML → PDF via LibreOffice
  // ═══════════════════════════════════════════════════════════════════════

  let libreConvert: any = null;
  let htmlToDocx: any = null;

  async function loadConvertLibs(): Promise<void> {
    if (!libreConvert) {
      try {
        libreConvert = _require("libreoffice-convert");
        const { promisify } = _require("util");
        libreConvert.convertAsync = promisify(libreConvert.convert);
      } catch {
        throw new Error("libreoffice-convert yüklenemedi.");
      }
    }
    if (!htmlToDocx) {
      try {
        htmlToDocx = _require("html-to-docx");
      } catch {
        throw new Error("html-to-docx yüklenemedi.");
      }
    }
  }

  const CONVERT_TO_PDF_EXTS = new Set([
    ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".html", ".htm",
  ]);

  const uploadToPdf = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 30 * 1024 * 1024 },
    fileFilter: (_req: any, file: any, cb: any) => {
      const ext = "." + (file.originalname.split(".").pop() ?? "").toLowerCase();
      if (CONVERT_TO_PDF_EXTS.has(ext)) {
        cb(null, true);
      } else {
        cb(new Error(`Desteklenmeyen dosya türü: ${ext}`));
      }
    },
  });

  function detectConvertInputType(filename: string, mime: string): "office" | "html" {
    const ext = "." + (filename.split(".").pop() ?? "").toLowerCase();
    if ([".html", ".htm"].includes(ext) || mime.includes("html")) return "html";
    return "office";
  }

  async function htmlToPdfBuffer(htmlBuffer: Buffer): Promise<Buffer> {
    const htmlString = htmlBuffer.toString("utf-8");
    const docxBuffer: Buffer = await htmlToDocx(htmlString, null, {
      table: { row: { cantSplit: true } },
      footer: false,
      pageNumber: false,
    }) as Buffer;
    const pdfBuffer: Buffer = await libreConvert.convertAsync(docxBuffer, ".pdf", undefined);
    return pdfBuffer;
  }

  async function officeToPdfBuffer(fileBuffer: Buffer): Promise<Buffer> {
    const pdfBuffer: Buffer = await libreConvert.convertAsync(fileBuffer, ".pdf", undefined);
    return pdfBuffer;
  }

  app.post("/api/convert-to-pdf", uploadToPdf.single("file"), async (req: any, res: any) => {
    if (!req.file) {
      res.status(400).json({ error: "Dosya bulunamadı. FormData field adı 'file' olmalı." });
      return;
    }

    try {
      await loadConvertLibs();
    } catch (e: any) {
      res.status(503).json({ error: e.message });
      return;
    }

    try {
      const inputType = detectConvertInputType(req.file.originalname, req.file.mimetype);

      const TIMEOUT = 55_000;
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Dönüşüm zaman aşımına uğradı (55s)")), TIMEOUT)
      );

      const convertPromise = (async () => {
        if (inputType === "html") {
          return htmlToPdfBuffer(req.file!.buffer);
        } else {
          return officeToPdfBuffer(req.file!.buffer);
        }
      })();

      const pdfBuffer = await Promise.race([convertPromise, timeoutPromise]);

      if (!pdfBuffer || pdfBuffer.length < 100) {
        throw new Error("PDF çıktısı boş — LibreOffice dönüşümü başarısız");
      }

      const baseName = req.file.originalname.replace(/\.[^.]+$/, "");
      const safeFileName = encodeURIComponent(`${baseName}.pdf`);

      res
        .setHeader("Content-Type", "application/pdf")
        .setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`)
        .setHeader("Content-Length", pdfBuffer.length.toString())
        .send(pdfBuffer);
    } catch (err: any) {
      console.error("[/api/convert-to-pdf] Error:", err.message);
      const status = err.message.includes("zaman aşımı") || err.message.includes("timed out") ? 504 : 422;
      res.status(status).json({ error: err.message });
    }
  });

  return httpServer;
}
