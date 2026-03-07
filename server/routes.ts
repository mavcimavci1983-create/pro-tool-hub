import type { Express } from "express";
import { type Server } from "http";
import multer from "multer";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import * as XLSX from "xlsx";
import { createRequire } from "module";
const _require = createRequire(import.meta.url);
const { PDFParse } = _require("pdf-parse");

async function extractPdfText(buffer: Buffer): Promise<{ text: string; numpages: number }> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  await parser.load();
  const totalPages = parser.doc.numPages;
  const textParts: string[] = [];
  for (let i = 1; i <= totalPages; i++) {
    const pageText = await parser.getPageText(i);
    textParts.push(pageText);
  }
  parser.destroy();
  return { text: textParts.join("\n"), numpages: totalPages };
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
      let result: { text: string; numpages: number };
      try {
        result = await extractPdfText(req.file!.buffer);
      } catch (e: any) {
        throw new Error(`PDF could not be read: ${e.message}`);
      }

      const text = result.text ?? "";
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
      let result: { text: string; numpages: number };
      try {
        result = await extractPdfText(req.file!.buffer);
      } catch (e: any) {
        throw new Error(`PDF could not be read: ${e.message}`);
      }

      const rawText = result.text ?? "";
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

  return httpServer;
}
