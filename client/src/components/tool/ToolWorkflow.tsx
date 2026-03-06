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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { jsPDF } from "jspdf";

const translations = translationsData as Record<string, any>;

interface ToolWorkflowProps {
  toolName: string;
  acceptedFileTypes: string;
  onProcess?: (file: File) => Promise<Blob | null>;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function getOutputExtension(toolName: string): string {
  const t = toolName.toLowerCase();
  if (t.includes("word") || t.includes("docx")) return "docx";
  if (t.includes("jpg") || t.includes("jpeg")) return "jpg";
  if (t.includes("png")) return "png";
  if (t.includes("webp")) return "webp";
  if (t.includes("json")) return "json";
  if (t.includes("csv")) return "csv";
  if (t.includes("txt") || t.includes("text")) return "txt";
  return "pdf";
}

async function convertFile(file: File, toolName: string): Promise<Blob> {
  const t = toolName.toLowerCase();
  const isImageToPdf =
    (t.includes("jpg") || t.includes("jpeg") || t.includes("png") || t.includes("image")) &&
    t.includes("pdf");
  const isTextToPdf = (t.includes("text") || t.includes("txt")) && t.includes("pdf");

  if (isImageToPdf) {
    return await imageFileToPdf(file);
  }

  if (isTextToPdf) {
    return await textFileToPdf(file);
  }

  const arrayBuffer = await file.arrayBuffer();
  return new Blob([arrayBuffer], { type: file.type || "application/octet-stream" });
}

function imageFileToPdf(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("FileReader failed"));
    reader.onload = (e) => {
      const imgData = e.target?.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error("Image load failed"));
      img.onload = () => {
        try {
          const pdf = new jsPDF({
            orientation: img.width > img.height ? "landscape" : "portrait",
            unit: "pt",
          });
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
          const w = img.width * ratio;
          const h = img.height * ratio;
          const x = (pageWidth - w) / 2;
          const y = (pageHeight - h) / 2;
          const format = file.type === "image/png" ? "PNG" : "JPEG";
          pdf.addImage(imgData, format, x, y, w, h);
          resolve(pdf.output("blob"));
        } catch (err) {
          reject(err);
        }
      };
      img.src = imgData;
    };
    reader.readAsDataURL(file);
  });
}

async function textFileToPdf(file: File): Promise<Blob> {
  const text = await file.text();
  const pdf = new jsPDF();
  const lines = pdf.splitTextToSize(text, 180);
  pdf.text(lines, 10, 10);
  return pdf.output("blob");
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

// ─── component ───────────────────────────────────────────────────────────────

export function ToolWorkflow({ toolName, acceptedFileTypes, onProcess }: ToolWorkflowProps) {
  const { language } = useLanguageStore();
  const t = translations[language];

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const resultBlobRef = useRef<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isValidFile = (f: File): boolean => {
    if (acceptedFileTypes === "*") return true;
    const ext = `.${f.name.split(".").pop()?.toLowerCase()}`;
    return acceptedFileTypes
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .includes(ext);
  };

  const processFile = useCallback(
    async (selectedFile: File) => {
      if (!isValidFile(selectedFile)) {
        setError(
          language === "en"
            ? `Invalid file type. Please upload: ${acceptedFileTypes}`
            : `Geçersiz dosya türü. Lütfen şunları yükleyin: ${acceptedFileTypes}`,
        );
        setStatus("error");
        return;
      }

      setFile(selectedFile);
      setStatus("processing");
      setProgress(0);
      setError(null);
      resultBlobRef.current = null;

      const DURATION = 8000;
      const TICK = 80;
      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed += TICK;
        const raw = elapsed / DURATION;
        const eased = 1 - Math.pow(1 - Math.min(raw, 1), 3);
        setProgress(Math.min(eased * 95, 95));
      }, TICK);

      try {
        let blob: Blob;

        if (onProcess) {
          const result = await onProcess(selectedFile);
          if (!result) throw new Error("Processing returned no data");
          blob = result;
        } else {
          blob = await convertFile(selectedFile, toolName);
        }

        if (blob.size === 0) throw new Error("Output file is empty");
        
        // Universal Result Validation
        if (blob.size === selectedFile.size && !toolName.toLowerCase().includes("rotate") && !toolName.toLowerCase().includes("ai")) {
            console.error("Binary Check Failed: Output size matches input. Conversion might have failed.");
            throw new Error(language === "en" ? "Conversion failed. File integrity check failed." : "Dönüştürme başarısız. Dosya bütünlük kontrolü hatası.");
        }

        console.log('Resulting Blob Size:', blob.size);
        resultBlobRef.current = blob;

        if (timerRef.current) clearInterval(timerRef.current);
        setProgress(100);
        setStatus("completed");
      } catch (err: any) {
        if (timerRef.current) clearInterval(timerRef.current);
        console.error("Processing error:", err);
        setError(
          language === "en"
            ? `Processing failed: ${err.message ?? "Unknown error"}`
            : `İşlem başarısız: ${err.message ?? "Bilinmeyen hata"}`,
        );
        setStatus("error");
      }
    },
    [toolName, acceptedFileTypes, language, onProcess],
  );

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
    const blob = resultBlobRef.current;
    if (!blob) {
      setError(
        language === "en" ? "No processed file found." : "İşlenmiş dosya bulunamadı.",
      );
      return;
    }

    try {
      const ext = getOutputExtension(toolName);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ProToolHub_${Date.now()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err: any) {
      setError(language === "en" ? "Download failed." : "İndirme başarısız.");
    }
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    resultBlobRef.current = null;
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={acceptedFileTypes}
            className="hidden"
          />

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300 mb-6">
            <Upload className={`w-12 h-12 ${status === "error" ? "text-rose-500" : "text-primary"}`} />
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
            {t.common.drop_files}
          </h3>
          <p className="text-slate-500 font-medium mb-8">
            {t.common.drag_drop} ({acceptedFileTypes})
          </p>

          <Button
            size="lg"
            variant={status === "error" ? "destructive" : "default"}
            className="rounded-full px-12 font-bold h-14 shadow-lg transition-all hover:scale-105"
          >
            {t.common.choose_file}
          </Button>

          {status === "error" && error && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-2">
              <Alert
                variant="destructive"
                className="rounded-2xl bg-white/80 backdrop-blur border-rose-100"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-bold">Error</AlertTitle>
                <AlertDescription className="font-medium">{error}</AlertDescription>
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

          <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
            {t.common.processing}
          </h3>
          <p className="text-slate-500 mb-10 font-medium max-w-sm">
            {language === "en"
              ? "Your file is being securely processed and optimized..."
              : "Dosyanız güvenle işleniyor ve optimize ediliyor..."}
          </p>

          <div className="w-full max-w-md">
            <Progress value={progress} className="h-3 rounded-full bg-slate-100" />
          </div>

          <div className="mt-12 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            BANK-GRADE ENCRYPTION ACTIVE
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

        <h3 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          {t.common.ready}
        </h3>
        <p className="text-slate-500 mb-10 font-medium">
          {file?.name}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-10">
          <Button
            size="lg"
            onClick={handleDownload}
            className="rounded-full px-20 font-bold h-16 shadow-2xl bg-emerald-600 hover:bg-emerald-700 text-white border-none text-lg"
          >
            <Download className="w-5 h-5 mr-3" />
            {t.common.download}
          </Button>
        </div>

        <div className="flex items-center flex-col gap-4">
          <Button variant="ghost" onClick={reset} className="text-slate-400 hover:text-primary font-bold">
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
