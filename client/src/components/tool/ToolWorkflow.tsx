import React, { useState, useRef, useCallback } from "react";
import {
  Upload, Download, RefreshCw, AlertCircle, CheckCircle2,
  Loader2, ShieldCheck, Clock, Files,
} from "lucide-react";
import { Button }                              from "@/components/ui/button";
import { Card }                                from "@/components/ui/card";
import { Progress }                            from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguageStore }                    from "@/lib/languageStore";
import translationsData                        from "@/locales/translations.json";
import { jsPDF }                               from "jspdf";
import { BelowResultAd }                       from "@/components/ads/AdUnit";

const translations = translationsData as Record<string, any>;

function trackEvent(name: string, params?: Record<string, unknown>) {
  try {
    const fbq = (window as any).fbq;
    if (typeof fbq === "function") fbq("track", name, params ?? {});
  } catch {}
}

export type ToolCategory = "organize" | "convert-from" | "convert-to" | "security";

export type ToolType =
  | "merge" | "split" | "rotate" | "delete-pages" | "reorder" | "page-numbers"
  | "edit-pdf" | "crop-pdf" | "repair-pdf" | "flatten-pdf"
  | "pdf-to-word" | "pdf-to-excel" | "pdf-to-image" | "pdf-to-text"
  | "pdf-to-pdfa" | "ocr-pdf"
  | "image-to-pdf" | "text-to-pdf" | "word-to-pdf" | "excel-to-pdf"
  | "html-to-pdf"  | "ppt-to-pdf" | "scan-to-pdf"
  | "compress" | "protect" | "unlock" | "watermark"
  | "sign-pdf" | "compare-pdf" | "translate-pdf"
  | "csv-to-json" | "json-to-csv"
  | "identity";

type PdfActionType =
  | "merge" | "split" | "rotate" | "delete-pages"
  | "reorder" | "page-numbers" | "compress"
  | "protect" | "unlock" | "watermark";

const MULTI_FILE_TOOLS = new Set<ToolType>(["merge", "compare-pdf"]);

const SERVER_TOOLS = new Set<ToolType>([
  "merge", "split", "rotate", "delete-pages", "reorder", "page-numbers",
  "compress", "protect", "unlock", "watermark",
  "pdf-to-word", "pdf-to-excel", "pdf-to-image", "pdf-to-text",
  "word-to-pdf", "excel-to-pdf", "ppt-to-pdf", "html-to-pdf",
  "translate-pdf",
  "compare-pdf",
]);

export interface ToolDefinition {
  type:        ToolType;
  category:    ToolCategory;
  label:       string;
  labelTr:     string;
  accepts:     string;
  actionType?: PdfActionType;
  endpoint?:   string;
  multiFile?:  boolean;
  extraParams?: Record<string, string>;
}

export const TOOL_CATALOG: ToolDefinition[] = [
  // ── Organize ──────────────────────────────────────────────────────────────
  { type: "merge",        category: "organize",     label: "Merge PDF",        labelTr: "PDF Birleştir",    accepts: ".pdf", actionType: "merge",        multiFile: true },
  { type: "split",        category: "organize",     label: "Split PDF",        labelTr: "PDF Ayır",         accepts: ".pdf", actionType: "split" },
  { type: "rotate",       category: "organize",     label: "Rotate PDF",       labelTr: "PDF Döndür",       accepts: ".pdf", actionType: "rotate" },
  { type: "page-numbers", category: "organize",     label: "Page Numbers",     labelTr: "Sayfa Numaraları", accepts: ".pdf", actionType: "page-numbers" },
  { type: "delete-pages", category: "organize",     label: "Remove Pages",     labelTr: "Sayfa Sil",        accepts: ".pdf", actionType: "delete-pages" },
  { type: "reorder",      category: "organize",     label: "Reorder Pages",    labelTr: "Sayfa Sırala",     accepts: ".pdf", actionType: "reorder" },
  { type: "edit-pdf",     category: "organize",     label: "Edit PDF",         labelTr: "PDF Düzenle",      accepts: ".pdf" },
  { type: "crop-pdf",     category: "organize",     label: "Crop PDF",         labelTr: "PDF Kırpma",       accepts: ".pdf" },
  { type: "repair-pdf",   category: "organize",     label: "Repair PDF",       labelTr: "PDF Onar",         accepts: ".pdf" },
  { type: "flatten-pdf",  category: "organize",     label: "Flatten PDF",      labelTr: "PDF Düzelt",       accepts: ".pdf" },

  // ── Convert FROM PDF ──────────────────────────────────────────────────────
  { type: "pdf-to-word",  category: "convert-from", label: "PDF to Word",      labelTr: "PDF → Word",       accepts: ".pdf", endpoint: "/api/convert" },
  { type: "pdf-to-excel", category: "convert-from", label: "PDF to Excel",     labelTr: "PDF → Excel",      accepts: ".pdf", endpoint: "/api/convert-excel" },
  { type: "pdf-to-image", category: "convert-from", label: "PDF to JPG",       labelTr: "PDF → JPG",        accepts: ".pdf", endpoint: "/api/convert-image" },
  { type: "pdf-to-text",  category: "convert-from", label: "PDF to Text",      labelTr: "PDF → Metin",      accepts: ".pdf", endpoint: "/api/convert-text" },
  { type: "identity",     category: "convert-from", label: "PDF to PPT",       labelTr: "PDF → PPT",        accepts: ".pdf" },
  { type: "pdf-to-pdfa",  category: "convert-from", label: "PDF to PDF/A",     labelTr: "PDF → PDF/A",      accepts: ".pdf" },
  { type: "ocr-pdf",      category: "convert-from", label: "OCR PDF",          labelTr: "OCR PDF",          accepts: ".pdf" },

  // ── Convert TO PDF ────────────────────────────────────────────────────────
  { type: "image-to-pdf", category: "convert-to",   label: "Image to PDF",     labelTr: "Görüntü → PDF",    accepts: ".jpg,.jpeg,.png,.webp,.gif,.bmp" },
  { type: "image-to-pdf", category: "convert-to",   label: "JPG to PDF",       labelTr: "JPG → PDF",        accepts: ".jpg,.jpeg,.png" },
  { type: "text-to-pdf",  category: "convert-to",   label: "Text to PDF",      labelTr: "Metin → PDF",      accepts: ".txt" },
  { type: "word-to-pdf",  category: "convert-to",   label: "Word to PDF",      labelTr: "Word → PDF",       accepts: ".docx,.doc",   endpoint: "/api/convert-to-pdf" },
  { type: "excel-to-pdf", category: "convert-to",   label: "Excel to PDF",     labelTr: "Excel → PDF",      accepts: ".xlsx,.xls",   endpoint: "/api/convert-to-pdf" },
  { type: "html-to-pdf",  category: "convert-to",   label: "HTML to PDF",      labelTr: "HTML → PDF",       accepts: ".html,.htm",   endpoint: "/api/convert-to-pdf" },
  { type: "ppt-to-pdf",   category: "convert-to",   label: "PowerPoint to PDF",labelTr: "PPT → PDF",        accepts: ".pptx,.ppt",   endpoint: "/api/convert-to-pdf" },
  { type: "ppt-to-pdf",   category: "convert-to",   label: "PPT to PDF",       labelTr: "PPT → PDF",        accepts: ".pptx,.ppt",   endpoint: "/api/convert-to-pdf" },
  { type: "scan-to-pdf",  category: "convert-to",   label: "Scan to PDF",      labelTr: "PDF'e Tara",       accepts: ".jpg,.jpeg,.png,.pdf,.tiff" },

  // ── Security & Optimization ───────────────────────────────────────────────
  { type: "compress",       category: "security",   label: "Compress PDF",     labelTr: "PDF Küçült",       accepts: ".pdf", actionType: "compress" },
  { type: "protect",        category: "security",   label: "Protect PDF",      labelTr: "PDF Koru",         accepts: ".pdf", actionType: "protect" },
  { type: "unlock",         category: "security",   label: "Unlock PDF",       labelTr: "PDF Kilidi Aç",    accepts: ".pdf", actionType: "unlock" },
  { type: "watermark",      category: "security",   label: "Watermark PDF",    labelTr: "Filigran Ekle",    accepts: ".pdf", actionType: "watermark" },
  { type: "watermark",      category: "security",   label: "Add Watermark",    labelTr: "Filigran Ekle",    accepts: ".pdf", actionType: "watermark" },
  { type: "sign-pdf",       category: "security",   label: "Sign PDF",         labelTr: "PDF İmzala",       accepts: ".pdf" },
  { type: "compare-pdf",    category: "security",   label: "Compare PDF",      labelTr: "PDF Karşılaştır",  accepts: ".pdf",  endpoint: "/api/compare-pdf", multiFile: true },
  { type: "translate-pdf",  category: "security",   label: "Translate PDF",    labelTr: "PDF Çevir",        accepts: ".pdf",  endpoint: "/api/translate-pdf" },

  // ── Data ──────────────────────────────────────────────────────────────────
  { type: "csv-to-json",  category: "convert-to",   label: "CSV to JSON",      labelTr: "CSV → JSON",       accepts: ".csv" },
  { type: "json-to-csv",  category: "convert-to",   label: "JSON to CSV",      labelTr: "JSON → CSV",       accepts: ".json" },
];

function kw(toolName: string, ...keywords: string[]): boolean {
  const t = toolName.toLowerCase();
  return keywords.some(k => t.includes(k.toLowerCase()));
}

export function detectToolType(toolName: string): ToolType {
  const tn = toolName.toLowerCase();

  const exact = TOOL_CATALOG.find(
    t => t.label.toLowerCase() === tn || t.labelTr.toLowerCase() === tn
  );
  if (exact) return exact.type;

  const isPdf   = kw(tn, "pdf");
  const isImage = kw(tn, "image","img","jpg","jpeg","png","webp","gif","bmp","tiff","photo","picture");
  const isText  = kw(tn, "txt","text","plain","metin");
  const isWord  = kw(tn, "word","docx","doc");
  const isExcel = kw(tn, "excel","xlsx","xls","spreadsheet","tablo");
  const isHtml  = kw(tn, "html","htm","web","webpage");
  const isPpt   = kw(tn, "ppt","pptx","powerpoint","slayt","sunum");

  if (isPdf && kw(tn, "compress","shrink","reduce","küçült","sıkıştır","optimize")) return "compress";
  if (isPdf && kw(tn, "protect","password","şifre","lock","koru"))                  return "protect";
  if (isPdf && kw(tn, "unlock","remove password","şifre kaldır","kilid"))           return "unlock";
  if (kw(tn, "watermark","filigran","damga"))                                       return "watermark";
  if (isPdf && kw(tn, "sign","imza","signature"))                                   return "sign-pdf";
  if (isPdf && kw(tn, "compare","karşılaştır","diff"))                              return "compare-pdf";
  if (isPdf && kw(tn, "translat","çevir","tercüme"))                                return "translate-pdf";

  if (isPdf && kw(tn, "merge","combine","join","birleştir","concat"))               return "merge";
  if (isPdf && kw(tn, "split","divide","separate","böl","ayır"))                    return "split";
  if (isPdf && kw(tn, "rotate","döndür"))                                           return "rotate";
  if (isPdf && kw(tn, "delete","remove","erase","sil","kaldır") && kw(tn, "page","sayfa")) return "delete-pages";
  if (isPdf && kw(tn, "reorder","rearrange","yeniden sırala","sort page"))          return "reorder";
  if (isPdf && kw(tn, "page number","numara","numbering","sayfa no"))               return "page-numbers";
  if (isPdf && kw(tn, "crop","kırp","trim page"))                                   return "crop-pdf";
  if (isPdf && kw(tn, "repair","onar","fix","bozuk"))                               return "repair-pdf";
  if (isPdf && kw(tn, "flatten","düzelt","düzleştir"))                              return "flatten-pdf";
  if (isPdf && kw(tn, "edit","düzenle"))                                             return "edit-pdf";
  if (kw(tn, "ocr"))                                                                 return "ocr-pdf";
  if (isPdf && kw(tn, "pdf/a","pdfa","archiv","arşiv"))                             return "pdf-to-pdfa";
  if (kw(tn, "scan") && isPdf)                                                       return "scan-to-pdf";

  if (isPdf && isImage) {
    const pdfPos = tn.indexOf("pdf");
    const imgPos = Math.min(
      ...(["image","img","jpg","jpeg","png","webp","gif","bmp","tiff","photo","picture"]
        .map(k => { const i = tn.indexOf(k); return i >= 0 ? i : Infinity; }))
    );
    return pdfPos < imgPos ? "pdf-to-image" : "image-to-pdf";
  }
  if (isPdf && isExcel) {
    const pdfPos = tn.indexOf("pdf");
    const excelPos = Math.min(
      ...(["excel","xlsx","xls","spreadsheet","tablo"]
        .map(k => { const i = tn.indexOf(k); return i >= 0 ? i : Infinity; }))
    );
    return pdfPos < excelPos ? "pdf-to-excel" : "excel-to-pdf";
  }
  if (isPdf && isWord) {
    const pdfPos = tn.indexOf("pdf");
    const wordPos = tn.indexOf("word");
    return pdfPos < wordPos ? "pdf-to-word" : "word-to-pdf";
  }
  if (isPdf && isText) {
    const pdfPos = tn.indexOf("pdf");
    const textPos = Math.min(
      ...(["txt","text","plain","metin"]
        .map(k => { const i = tn.indexOf(k); return i >= 0 ? i : Infinity; }))
    );
    return pdfPos < textPos ? "pdf-to-text" : "text-to-pdf";
  }
  if (isPdf && isPpt)  return "ppt-to-pdf";
  if (isPdf && isHtml) return "html-to-pdf";

  if (kw(tn, "csv") && kw(tn, "json")) return "csv-to-json";
  if (kw(tn, "json") && kw(tn, "csv")) return "json-to-csv";

  return "identity";
}

function getOutputExtension(toolType: ToolType, inputFile?: File, resultBlob?: Blob | null): string {
  if (toolType === "pdf-to-image" && resultBlob) {
    return resultBlob.type === "application/zip" ? "zip" : "jpg";
  }
  const map: Partial<Record<ToolType, string>> = {
    "pdf-to-word":  "docx", "pdf-to-excel": "xlsx", "pdf-to-image": "jpg",
    "pdf-to-text":  "txt",  "image-to-pdf": "pdf",  "text-to-pdf":  "pdf",
    "word-to-pdf":  "pdf",  "excel-to-pdf": "pdf",  "html-to-pdf":  "pdf",
    "ppt-to-pdf":   "pdf",  "compress":     "pdf",  "protect":      "pdf",
    "unlock":       "pdf",  "watermark":    "pdf",  "merge":        "pdf",
    "split":        "pdf",  "rotate":       "pdf",  "delete-pages": "pdf",
    "reorder":      "pdf",  "page-numbers": "pdf",  "csv-to-json":  "json",
    "json-to-csv":  "csv",
  };
  return map[toolType] ?? inputFile?.name.split(".").pop()?.toLowerCase() ?? "bin";
}

function imageFileToPdf(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("File could not be read"));
    reader.onload = e => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error("Image could not be loaded"));
      img.onload = () => {
        try {
          const A4_W = 595.28, A4_H = 841.89, MARGIN = 28;
          const landscape = img.naturalWidth > img.naturalHeight;
          const pageW = landscape ? A4_H : A4_W;
          const pageH = landscape ? A4_W : A4_H;
          const ratio = Math.min((pageW - MARGIN * 2) / img.naturalWidth, (pageH - MARGIN * 2) / img.naturalHeight);
          const dW = img.naturalWidth * ratio, dH = img.naturalHeight * ratio;
          const SCALE = 2;
          const cv = document.createElement("canvas");
          cv.width = img.naturalWidth * SCALE;
          cv.height = img.naturalHeight * SCALE;
          const ctx = cv.getContext("2d")!;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.scale(SCALE, SCALE);
          ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
          const pdf = new jsPDF({
            orientation: landscape ? "landscape" : "portrait",
            unit: "pt", format: "a4", compress: false,
          });
          pdf.addImage(cv.toDataURL("image/jpeg", 0.95), "JPEG", (pageW - dW) / 2, (pageH - dH) / 2, dW, dH, undefined, "FAST");
          resolve(pdf.output("blob"));
        } catch (err) { reject(err); }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

async function textFileToPdf(file: File): Promise<Blob> {
  const text = await file.text();
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40, maxW = pdf.internal.pageSize.getWidth() - margin * 2;
  pdf.setFontSize(11);
  const lines = pdf.splitTextToSize(text, maxW);
  let y = margin + 20;
  for (const line of lines) {
    if (y + 16 > pdf.internal.pageSize.getHeight() - margin) { pdf.addPage(); y = margin + 20; }
    pdf.text(line, margin, y);
    y += 16;
  }
  return pdf.output("blob");
}

async function csvToJson(file: File): Promise<Blob> {
  const [header, ...rows] = (await file.text()).trim().split(/\r?\n/);
  const headers = header.split(",").map(h => h.trim());
  const data = rows.map(r => Object.fromEntries(r.split(",").map((v, i) => [headers[i] ?? i, v.trim()])));
  return new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
}

async function jsonToCsv(file: File): Promise<Blob> {
  const data: Record<string, unknown>[] = JSON.parse(await file.text());
  if (!Array.isArray(data) || !data.length) throw new Error("Invalid JSON array");
  const headers = Object.keys(data[0]);
  return new Blob([[headers.join(","), ...data.map(r => headers.map(h => r[h] ?? "").join(","))].join("\n")], { type: "text/csv" });
}

async function pdfToImageClient(file: File): Promise<Blob> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const totalPages = pdf.numPages;

  if (totalPages > 1) {
    throw new Error("MULTI_PAGE");
  }

  const page = await pdf.getPage(1);
  const scale = 2.5;
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      b => (b && b.size > 0 ? resolve(b) : reject(new Error("Canvas export failed"))),
      "image/jpeg",
      0.93
    );
  });
}

function uploadFiles(
  files: File[],
  endpoint: string,
  extraFields?: Record<string, string>,
  onProgress?: (pct: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    files.forEach(f => fd.append("file", f, f.name));
    if (extraFields) Object.entries(extraFields).forEach(([k, v]) => fd.append(k, v));

    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = e => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 40));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response as Blob);
      } else {
        let msg = `Server error (${xhr.status})`;
        try {
          const reader = new FileReader();
          reader.onload = () => {
            try { const j = JSON.parse(reader.result as string); if (j.error) msg = j.error; } catch {}
            reject(new Error(msg));
          };
          reader.onerror = () => reject(new Error(msg));
          reader.readAsText(xhr.response);
          return;
        } catch {}
        reject(new Error(msg));
      }
    };
    xhr.onerror = () => reject(new Error("Network connection error"));
    xhr.ontimeout = () => reject(new Error("Request timed out"));
    xhr.open("POST", endpoint);
    xhr.responseType = "blob";
    xhr.timeout = 58_000;
    xhr.send(fd);
  });
}

async function convertFile(
  files: File[],
  toolType: ToolType,
  toolDef: ToolDefinition | undefined,
  extraParams?: Record<string, string>,
  onProgress?: (pct: number) => void
): Promise<Blob> {
  const file = files[0];

  if (toolDef?.actionType) {
    return uploadFiles(
      files,
      "/api/pdf-action",
      { actionType: toolDef.actionType, ...extraParams },
      onProgress
    );
  }

  if (toolDef?.endpoint) {
    if (toolType === "pdf-to-image") {
      const blob = await pdfToImageClient(file);
      if (blob.size >= 5_000) return blob;
      throw new Error("Export failed or file too small. Try a single-page PDF.");
    }
    return uploadFiles(toolDef.multiFile ? files : [file], toolDef.endpoint, extraParams, onProgress);
  }

  switch (toolType) {
    case "image-to-pdf": return imageFileToPdf(file);
    case "text-to-pdf":  return textFileToPdf(file);
    case "csv-to-json":  return csvToJson(file);
    case "json-to-csv":  return jsonToCsv(file);
    case "word-to-pdf":
    case "excel-to-pdf":
    case "ppt-to-pdf":
    case "html-to-pdf":
      return uploadFiles([file], "/api/convert-to-pdf", extraParams, onProgress);
    default: {
      const buf = await file.arrayBuffer();
      return new Blob([buf], { type: file.type || "application/octet-stream" });
    }
  }
}

export interface ToolWorkflowProps {
  toolName: string;
  acceptedFileTypes?: string;
  onProcess?: (files: File[]) => Promise<Blob | null>;
  extraParams?: Record<string, string>;
}

function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100">
      {[
        { icon: <ShieldCheck className="w-6 h-6 text-slate-300 mb-2" />, label: "Secure SSL" },
        { icon: <Clock className="w-6 h-6 text-slate-300 mb-2" />, label: "60-Min Auto-Purge" },
        { icon: <CheckCircle2 className="w-6 h-6 text-slate-300 mb-2" />, label: "100% Private" },
      ].map(({ icon, label }) => (
        <div key={label} className="flex flex-col items-center text-center p-4">
          {icon}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function ToolWorkflow({ toolName, acceptedFileTypes, onProcess, extraParams }: ToolWorkflowProps) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const isEn = language === "en";

  const toolType = detectToolType(toolName);
  const toolDef = TOOL_CATALOG.find(d => d.type === toolType);
  const isMulti = toolDef?.multiFile ?? MULTI_FILE_TOOLS.has(toolType);
  const isServer = SERVER_TOOLS.has(toolType) || !!toolDef?.endpoint || !!toolDef?.actionType;
  const accepts = acceptedFileTypes ?? toolDef?.accepts ?? ".pdf";

  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [statusLabel, setStatusLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  const resultBlobRef = useRef<Blob | null>(null);
  const successFlagRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isValidFile = (f: File): boolean => {
    if (accepts === "*") return true;
    const ext = `.${f.name.split(".").pop()?.toLowerCase()}`;
    return accepts.split(",").map(s => s.trim().toLowerCase()).includes(ext);
  };

  const processFiles = useCallback(async (selectedFiles: File[]) => {
    const invalid = selectedFiles.find(f => !isValidFile(f));
    if (invalid) {
      setError(isEn
        ? `Invalid file type. Accepted: ${accepts}`
        : `Geçersiz dosya türü. Kabul edilen: ${accepts}`);
      setStatus("error");
      return;
    }
    if (isMulti && selectedFiles.length < 2) {
      setError(isEn ? "Please select at least 2 files." : "En az 2 dosya seçin.");
      setStatus("error");
      return;
    }

    setFiles(selectedFiles);
    setStatus("processing");
    setProgress(0);
    setError(null);
    resultBlobRef.current = null;
    successFlagRef.current = false;

    const DURATION = isServer ? 50_000 : 7_000;
    const TICK = 80;
    let elapsed = 0;
    const cap = isServer ? 88 : 93;

    setStatusLabel(isEn ? "Uploading..." : "Yükleniyor...");

    timerRef.current = setInterval(() => {
      elapsed += TICK;
      const eased = 1 - Math.pow(1 - Math.min(elapsed / DURATION, 1), 3);
      setProgress(prev => {
        const n = Math.min(eased * cap, cap);
        return n > prev ? n : prev;
      });
      if (elapsed > 5_000 && isServer)
        setStatusLabel(isEn ? "Processing on server..." : "Sunucuda işleniyor...");
    }, TICK);

    try {
      let blob: Blob;

      if (onProcess) {
        const r = await onProcess(selectedFiles);
        if (!r) throw new Error("onProcess returned empty");
        blob = r;
      } else {
        blob = await convertFile(selectedFiles, toolType, toolDef, extraParams, pct => setProgress(pct));
      }

      if (blob.size === 0) throw new Error(isEn ? "Output file is empty (0 bytes)" : "Çıktı dosyası boş (0 byte)");
      await blob.arrayBuffer();

      resultBlobRef.current = blob;
      successFlagRef.current = true;

      if (timerRef.current) clearInterval(timerRef.current);
      setProgress(100);
      setStatusLabel(isEn ? "Done!" : "Tamamlandı!");
      setStatus("completed");

      trackEvent("FileConverted", {
        tool: toolName, toolType,
        inputSize: selectedFiles.reduce((a, f) => a + f.size, 0),
        outputSize: blob.size,
      });
    } catch (err: any) {
      if (timerRef.current) clearInterval(timerRef.current);
      console.error("[ToolWorkflow]", err);
      setError(isEn
        ? `Processing failed: ${err.message ?? "Unknown error"}`
        : `İşlem başarısız: ${err.message ?? "Bilinmeyen hata"}`);
      setStatus("error");
    }
  }, [toolName, toolType, toolDef, accepts, isMulti, isServer, extraParams, language, onProcess]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = Array.from(e.target.files ?? []);
    if (fs.length) processFiles(fs);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fs = Array.from(e.dataTransfer.files);
    if (fs.length) processFiles(fs);
  };

  const handleDownload = () => {
    if (!successFlagRef.current) {
      setError(isEn ? "File not ready yet." : "Dosya henüz hazır değil.");
      return;
    }
    const blob = resultBlobRef.current;
    if (!blob || blob.size === 0) {
      setError(isEn ? "File is empty or missing." : "Dosya boş veya eksik.");
      return;
    }
    try {
      const ext = getOutputExtension(toolType, files[0], blob);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ProToolHub_${Date.now()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      trackEvent("FileDownloaded", { tool: toolName, ext });
    } catch {
      setError(isEn ? "Download failed." : "İndirme başarısız.");
    }
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setStatusLabel("");
    setError(null);
    resultBlobRef.current = null;
    successFlagRef.current = false;
  };

  if (status === "idle" || status === "error") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={[
            "relative group cursor-pointer transition-all duration-300 rounded-3xl border-2 border-dashed",
            "p-16 flex flex-col items-center justify-center text-center",
            "bg-slate-50/50 hover:bg-white hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5",
            status === "error" ? "border-rose-200 bg-rose-50/30" : "border-slate-200",
          ].join(" ")}
        >
          <input
            type="file" ref={fileInputRef} onChange={handleFileChange}
            accept={accepts} multiple={isMulti} className="hidden"
            data-testid="input-file"
          />

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300 mb-6">
            {isMulti
              ? <Files className={`w-12 h-12 ${status === "error" ? "text-rose-500" : "text-primary"}`} />
              : <Upload className={`w-12 h-12 ${status === "error" ? "text-rose-500" : "text-primary"}`} />
            }
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight" data-testid="text-upload-title">
            {isMulti
              ? (isEn ? "Drop multiple PDF files" : "Birden fazla PDF bırakın")
              : t.common.drop_files}
          </h3>
          <p className="text-slate-500 font-medium mb-8" data-testid="text-upload-hint">
            {isMulti
              ? (isEn ? "Select 2 or more files to merge" : "Birleştirmek için 2+ dosya seçin")
              : t.common.drag_drop}
            {" "}({accepts})
          </p>

          <Button size="lg" variant={status === "error" ? "destructive" : "default"}
            className="rounded-full px-12 font-bold h-14 shadow-lg transition-all hover:scale-105"
            data-testid="button-choose-file">
            {isMulti
              ? (isEn ? "Choose Files" : "Dosyaları Seç")
              : t.common.choose_file}
          </Button>

          {status === "error" && error && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-2">
              <Alert variant="destructive" className="rounded-2xl bg-white/80 backdrop-blur border-rose-100" data-testid="status-error">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-bold">Error</AlertTitle>
                <AlertDescription className="font-medium" data-testid="text-error-message">{error}</AlertDescription>
              </Alert>
            </div>
          )}
        </div>
        <TrustBadges />
      </div>
    );
  }

  if (status === "processing") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <Card className="p-16 rounded-3xl border border-slate-200 bg-white shadow-xl flex flex-col items-center justify-center text-center">
          <div className="relative w-20 h-20 mb-10">
            <Loader2 className="w-20 h-20 text-primary animate-spin opacity-20 absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center font-bold text-primary text-sm">
              {Math.round(progress)}%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight" data-testid="text-processing-title">{t.common.processing}</h3>
          <p className="text-primary/70 font-semibold mb-1 text-sm" data-testid="text-status-label">{statusLabel}</p>
          <p className="text-slate-500 mb-10 font-medium max-w-sm text-sm">
            {isEn ? "Your file is being securely processed..." : "Dosyanız güvenle işleniyor..."}
          </p>
          <div className="w-full max-w-md">
            <Progress value={progress} className="h-3 rounded-full bg-slate-100" />
          </div>
          <div className="mt-12 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> BANK-GRADE ENCRYPTION ACTIVE
          </div>
        </Card>
        <BelowResultAd />
        <TrustBadges />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="p-16 rounded-3xl border-2 border-primary/20 bg-slate-50/30 shadow-2xl flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
        <div className="bg-emerald-100 text-emerald-600 p-6 rounded-full mb-8 shadow-sm ring-8 ring-emerald-50">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{t.common.ready}</h3>
        <p className="text-slate-500 mb-10 font-medium" data-testid="text-filename">
          {files.length > 1 ? `${files.length} ${isEn ? "files" : "dosya"}` : files[0]?.name}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-10">
          <Button
            size="lg"
            onClick={handleDownload}
            disabled={!successFlagRef.current}
            className="rounded-full px-20 font-bold h-16 shadow-2xl bg-emerald-600 hover:bg-emerald-700 text-white border-none text-lg"
            data-testid="button-download"
          >
            <Download className="w-5 h-5 mr-3" />
            {t.common.download}
          </Button>
        </div>
        <div className="flex items-center flex-col gap-4">
          <Button variant="ghost" onClick={reset} className="text-slate-400 hover:text-primary font-bold" data-testid="button-start-over">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t.common.start_over}
          </Button>
          <div className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-500 text-sm font-medium shadow-sm">
            <Clock className="w-4 h-4 text-rose-400" />
            {t.common.privacy_alert}: {t.common.privacy_desc}
          </div>
        </div>
      </Card>
      <BelowResultAd />
      <TrustBadges />
    </div>
  );
}

export const PdfMergeTool = () => <ToolWorkflow toolName="Merge PDF" />;
export const PdfSplitTool = () => <ToolWorkflow toolName="Split PDF" />;
export const PdfRotateTool = () => <ToolWorkflow toolName="Rotate PDF" />;
export const PdfDeletePagesTool = () => <ToolWorkflow toolName="Remove Pages" />;
export const PdfReorderTool = () => <ToolWorkflow toolName="Reorder Pages" />;
export const PdfPageNumbersTool = () => <ToolWorkflow toolName="Page Numbers" />;
export const PdfToWordTool = () => <ToolWorkflow toolName="PDF to Word" />;
export const PdfToExcelTool = () => <ToolWorkflow toolName="PDF to Excel" />;
export const PdfToJpgTool = () => <ToolWorkflow toolName="PDF to JPG" />;
export const PdfToTextTool = () => <ToolWorkflow toolName="PDF to Text" />;
export const ImageToPdfTool = () => <ToolWorkflow toolName="Image to PDF" />;
export const TextToPdfTool = () => <ToolWorkflow toolName="Text to PDF" />;
export const PdfCompressTool = () => <ToolWorkflow toolName="Compress PDF" />;
export const PdfProtectTool = (p: { password: string }) =>
  <ToolWorkflow toolName="Protect PDF" extraParams={{ password: p.password }} />;
export const PdfUnlockTool = (p: { password: string }) =>
  <ToolWorkflow toolName="Unlock PDF" extraParams={{ password: p.password }} />;
export const PdfWatermarkTool = (p: { text: string }) =>
  <ToolWorkflow toolName="Watermark PDF" extraParams={{ watermark: p.text }} />;
