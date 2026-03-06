import type { Express } from "express";
import { type Server } from "http";
import multer from "multer";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/convert", (req, res, next) => {
    upload.single("file")(req, res, (err: any) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({ error: "File too large. Maximum size is 10MB." });
        }
        return res.status(400).json({ error: err.message || "Upload failed" });
      }
      next();
    });
  }, async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ error: "Only PDF files are supported" });
      }

      console.log(`[convert] Processing PDF: ${req.file.originalname} (${req.file.size} bytes)`);

      const data = await pdf(req.file.buffer);
      const text = data.text;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: "PDF contains no extractable text" });
      }

      const paragraphs = text
        .split(/\n+/)
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) =>
          new Paragraph({
            children: [new TextRun({ text: line.trim(), size: 24 })],
            spacing: { after: 200 },
          })
        );

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs,
        }],
      });

      const buffer = await Packer.toBuffer(doc);

      console.log(`[convert] Generated DOCX: ${buffer.byteLength} bytes from ${data.numpages} page(s)`);

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", `attachment; filename=ProToolHub_${Date.now()}.docx`);
      res.send(Buffer.from(buffer));

    } catch (error: any) {
      console.error("[convert] Error:", error);
      res.status(500).json({ error: error.message || "Internal server error during conversion" });
    }
  });

  return httpServer;
}
