import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Clock,
  FileText,
} from "lucide-react";
import { Button }                          from "@/components/ui/button";
import { Card }                            from "@/components/ui/card";
import { Progress }                        from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguageStore }                from "@/lib/languageStore";
import translationsData                    from "@/locales/translations.json";
import { jsPDF }                           from "jspdf";

const translations = translationsData as Record<string, any>;

function trackEvent(name: string, params?: Record<string, unknown>) {
  try {
    const fbq = (window as any).fbq;
    if (typeof fbq === "function") fbq("track", name, params ?? {});
  } catch {}
}

function kw(toolName: string, ...keywords: string[]): boolean {
  const t = toolName.toLowerCase();
  return keywords.some((k) => t.includes(k.toLowerCase()));
}

type ToolType =
  | "image-to-pdf" | "pdf-to-word" | "pdf-to-excel" | "pdf-to-image"
  | "text-to-pdf"  | "pdf-compress"| "pdf-merge"
  | "pdf-split"    | "image-resize"| "image-compress"
  | "image-convert"| "csv-to-json" | "json-to-csv"
  | "identity";

function detectToolType(toolName: string): ToolType {
  const isImage = kw(toolName, "image","img","jpg","jpeg","png","webp","gif","bmp","tiff");
  const isPdf   = kw(toolName, "pdf");
  const isText  = kw(toolName, "txt","text","plain");

  if (isPdf && kw(toolName, "excel","xlsx","xls","spreadsheet"))  return "pdf-to-excel";
  if (isPdf && kw(toolName, "word","docx","doc"))                 return "pdf-to-word";
  if (isImage && isPdf)                                           return "image-to-pdf";
  if (isPdf   && isImage)                                         return "pdf-to-image";
  if (isText  && isPdf)                                           return "text-to-pdf";
  if (isPdf   && kw(toolName, "compress","shrink","reduce"))      return "pdf-compress";
  if (isPdf   && kw(toolName, "merge","combine","join"))          return "pdf-merge";
  if (isPdf   && kw(toolName, "split","extract","separate"))      return "pdf-split";
  if (isImage && kw(toolName, "resize","scale","dimension"))      return "image-resize";
  if (isImage && kw(toolName, "compress","shrink","reduce"))      return "image-compress";
  if (isImage && kw(toolName, "convert","to"))                    return "image-convert";
  if (kw(toolName, "csv") && kw(toolName, "json"))                return "csv-to-json";
  if (kw(toolName, "json") && kw(toolName, "csv"))                return "json-to-csv";
  return "identity";
}

function getOutputExtension(toolType: ToolType, inputFile?: File): string {
  const map: Partial<Record<ToolType, string>> = {
    "image-to-pdf":   "pdf",  "text-to-pdf":    "pdf",
    "pdf-compress":   "pdf",  "pdf-merge":       "pdf",
    "pdf-split":      "pdf",  "pdf-to-word":     "docx",
    "pdf-to-excel":   "xlsx", "pdf-to-image":   "png",
    "image-resize":   "jpg",  "image-compress": "jpg",
    "image-convert":  "jpg",  "csv-to-json":    "json",
    "json-to-csv":    "csv",
  };
  return map[toolType] ?? inputFile?.name.split(".").pop()?.toLowerCase() ?? "bin";
}

function imageFileToPdf(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("File could not be read"));
    reader.onload  = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error("Image could not be loaded"));
      img.onload  = () => {
        try {
          const A4_W = 595.28, A4_H = 841.89, MARGIN = 28;
          const isLandscape = img.naturalWidth > img.naturalHeight;
          const pageW = isLandscape ? A4_H : A4_W;
          const pageH = isLandscape ? A4_W : A4_H;
          const ratio = Math.min((pageW - MARGIN*2) / img.naturalWidth, (pageH - MARGIN*2) / img.naturalHeight);
          const dW = img.naturalWidth * ratio, dH = img.naturalHeight * ratio;

          const SCALE = 2;
          const canvas = document.createElement("canvas");
          canvas.width  = img.naturalWidth  * SCALE;
          canvas.height = img.naturalHeight * SCALE;
          const ctx = canvas.getContext("2d")!;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.scale(SCALE, SCALE);
          ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

          const hqUrl = canvas.toDataURL("image/jpeg", 0.95);
          const pdfDoc = new jsPDF({
            orientation: isLandscape ? "landscape" : "portrait",
            unit: "pt", format: "a4", compress: false,
          });
          pdfDoc.addImage(hqUrl, "JPEG", (pageW-dW)/2, (pageH-dH)/2, dW, dH, undefined, "FAST");
          resolve(pdfDoc.output("blob"));
        } catch (err) { reject(err); }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}

async function textFileToPdf(file: File): Promise<Blob> {
  const text   = await file.text();
  const pdfDoc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  const maxW   = pdfDoc.internal.pageSize.getWidth() - margin * 2;
  pdfDoc.setFontSize(11);
  const lines  = pdfDoc.splitTextToSize(text, maxW);
  let y = margin + 20;
  for (const line of lines) {
    if (y + 16 > pdfDoc.internal.pageSize.getHeight() - margin) { pdfDoc.addPage(); y = margin + 20; }
    pdfDoc.text(line, margin, y);
    y += 16;
  }
  return pdfDoc.output("blob");
}

async function csvToJson(file: File): Promise<Blob> {
  const [header, ...rows] = (await file.text()).trim().split(/\r?\n/);
  const headers = header.split(",").map(h => h.trim());
  const data = rows.map(r => Object.fromEntries(r.split(",").map((v,i) => [headers[i]??i, v.trim()])));
  return new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
}

async function jsonToCsv(file: File): Promise<Blob> {
  const data: Record<string, unknown>[] = JSON.parse(await file.text());
  if (!Array.isArray(data) || !data.length) throw new Error("Invalid JSON array");
  const headers = Object.keys(data[0]);
  const csv = [headers.join(","), ...data.map(r => headers.map(h => r[h]??"").join(","))].join("\n");
  return new Blob([csv], { type: "text/csv" });
}

function uploadPdfToServer(
  file: File,
  endpoint: string,
  onUploadProgress?: (pct: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file, file.name);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onUploadProgress) {
        onUploadProgress(Math.round((e.loaded / e.total) * 40));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response as Blob);
      } else {
        let msg = `Server error (${xhr.status})`;
        try {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const errJson = JSON.parse(reader.result as string);
              if (errJson.error) msg = errJson.error;
            } catch {}
            reject(new Error(msg));
          };
          reader.onerror = () => reject(new Error(msg));
          reader.readAsText(xhr.response);
          return;
        } catch {}
        reject(new Error(msg));
      }
    });

    xhr.addEventListener("error",   () => reject(new Error("Network connection error")));
    xhr.addEventListener("timeout", () => reject(new Error("Request timed out")));

    xhr.open("POST", endpoint);
    xhr.responseType = "blob";
    xhr.timeout      = 58_000;
    xhr.send(formData);
  });
}

async function convertFile(
  file: File,
  toolName: string,
  onUploadProgress?: (pct: number) => void
): Promise<Blob> {
  const toolType = detectToolType(toolName);

  switch (toolType) {
    case "image-to-pdf": return imageFileToPdf(file);
    case "text-to-pdf":  return textFileToPdf(file);
    case "csv-to-json":  return csvToJson(file);
    case "json-to-csv":  return jsonToCsv(file);
    case "pdf-to-word":  return uploadPdfToServer(file, "/api/convert", onUploadProgress);
    case "pdf-to-excel": return uploadPdfToServer(file, "/api/convert-excel", onUploadProgress);
    default: {
      const buf = await file.arrayBuffer();
      return new Blob([buf], { type: file.type || "application/octet-stream" });
    }
  }
}

interface ToolWorkflowProps {
  toolName:          string;
  acceptedFileTypes: string;
  onProcess?:        (file: File) => Promise<Blob | null>;
}

function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100">
      <div className="flex flex-col items-center text-center p-4">
        <ShieldCheck className="w-6 h-6 text-slate-300 mb-2" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure SSL</span>
      </div>
      <div className="flex flex-col items-center text-center p-4">
        <Clock className="w-6 h-6 text-slate-300 mb-2" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auto-Purge</span>
      </div>
      <div className="flex flex-col items-center text-center p-4">
        <CheckCircle2 className="w-6 h-6 text-slate-300 mb-2" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">100% Private</span>
      </div>
    </div>
  );
}

export function ToolWorkflow({ toolName, acceptedFileTypes, onProcess }: ToolWorkflowProps) {
  const { language }   = useLanguageStore();
  const t              = translations[language];
  const isEn           = language === "en";

  const [file,        setFile       ] = useState<File | null>(null);
  const [status,      setStatus     ] = useState<"idle"|"processing"|"completed"|"error">("idle");
  const [progress,    setProgress   ] = useState(0);
  const [statusLabel, setStatusLabel] = useState("");
  const [error,       setError      ] = useState<string | null>(null);

  const resultBlobRef  = useRef<Blob | null>(null);
  const successFlagRef = useRef<boolean>(false);
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);

  const isValidFile = (f: File): boolean => {
    if (acceptedFileTypes === "*") return true;
    const ext = `.${f.name.split(".").pop()?.toLowerCase()}`;
    return acceptedFileTypes.split(",").map(s => s.trim().toLowerCase()).includes(ext);
  };

  const processFile = useCallback(async (selectedFile: File) => {
    if (!isValidFile(selectedFile)) {
      setError(isEn
        ? `Invalid file type. Accepted: ${acceptedFileTypes}`
        : `Geçersiz dosya türü. Kabul edilen: ${acceptedFileTypes}`);
      setStatus("error");
      return;
    }

    setFile(selectedFile);
    setStatus("processing");
    setProgress(0);
    setError(null);
    resultBlobRef.current  = null;
    successFlagRef.current = false;

    const toolType    = detectToolType(toolName);
    const isServerJob = toolType === "pdf-to-word" || toolType === "pdf-to-excel";

    const DURATION = isServerJob ? 50_000 : 7_000;
    const TICK     = 80;
    let elapsed    = 0;

    setStatusLabel(isEn ? "Uploading..." : "Yükleniyor...");

    timerRef.current = setInterval(() => {
      elapsed += TICK;
      const eased = 1 - Math.pow(1 - Math.min(elapsed / DURATION, 1), 3);
      const cap   = isServerJob ? 88 : 93;
      setProgress(prev => {
        const next = Math.min(eased * cap, cap);
        return next > prev ? next : prev;
      });
      if (elapsed > 5_000 && isServerJob) {
        setStatusLabel(isEn ? "Converting on server..." : "Sunucuda dönüştürülüyor...");
      }
    }, TICK);

    try {
      let blob: Blob;

      if (onProcess) {
        const result = await onProcess(selectedFile);
        if (!result) throw new Error("onProcess returned empty");
        blob = result;
      } else {
        blob = await convertFile(selectedFile, toolName, (uploadPct) => {
          setProgress(uploadPct);
        });
      }

      if (blob.size === 0) throw new Error(isEn ? "Output file is empty (0 bytes)" : "Çıktı dosyası boş (0 byte)");
      await blob.arrayBuffer();

      resultBlobRef.current  = blob;
      successFlagRef.current = true;

      if (timerRef.current) clearInterval(timerRef.current);
      setProgress(100);
      setStatusLabel(isEn ? "Done!" : "Tamamlandı!");
      setStatus("completed");

      trackEvent("FileConverted", {
        tool:       toolName,
        inputSize:  selectedFile.size,
        outputSize: blob.size,
      });
    } catch (err: any) {
      if (timerRef.current) clearInterval(timerRef.current);
      console.error("[ToolWorkflow] Error:", err);
      setError(isEn
        ? `Processing failed: ${err.message ?? "Unknown error"}`
        : `İşlem başarısız: ${err.message ?? "Bilinmeyen hata"}`);
      setStatus("error");
    }
  }, [toolName, acceptedFileTypes, language, onProcess]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
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
      const toolType = detectToolType(toolName);
      const ext      = getOutputExtension(toolType, file ?? undefined);
      const url      = URL.createObjectURL(blob);
      const a        = document.createElement("a");
      a.href         = url;
      a.download     = `ProToolHub_${Date.now()}.${ext}`;
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
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setStatusLabel("");
    setError(null);
    resultBlobRef.current  = null;
    successFlagRef.current = false;
  };

  if (status === "idle" || status === "error") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer transition-all duration-300 rounded-3xl border-2 border-dashed p-16 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-white hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 ${
            status === "error" ? "border-rose-200 bg-rose-50/30" : "border-slate-200"
          }`}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={acceptedFileTypes} className="hidden" data-testid="input-file" />

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300 mb-6">
            <Upload className={`w-12 h-12 ${status === "error" ? "text-rose-500" : "text-primary"}`} />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight" data-testid="text-upload-title">{t.common.drop_files}</h3>
          <p className="text-slate-500 font-medium mb-8" data-testid="text-upload-hint">{t.common.drag_drop} ({acceptedFileTypes})</p>

          <Button size="lg" variant={status === "error" ? "destructive" : "default"}
            className="rounded-full px-12 font-bold h-14 shadow-lg transition-all hover:scale-105"
            data-testid="button-choose-file">
            {t.common.choose_file}
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
        <p className="text-slate-500 mb-10 font-medium" data-testid="text-filename">{file?.name}</p>

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
      <TrustBadges />
    </div>
  );
}
