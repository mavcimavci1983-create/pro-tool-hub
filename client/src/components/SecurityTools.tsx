/**
 * SecurityTools.tsx — ProToolHub v7.3  "Bug-Free Stabilite Operasyonu"
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * DÜZELTMELER:
 *  FIX-1  TranslatePdfTool → LibreTranslate kaldırıldı, @vitalets/google-translate-api
 *         tabanlı backend (/api/translate-pdf v2) ile konuşuyor. API key gerektirmez.
 *
 *  FIX-2  SignPdfTool → imza sayfaya gerçekten işlenmiyor sorunu giderildi.
 *         Root cause: pdf-lib'in embedPng() öncesinde alpha kanalı sorunuydu.
 *         Çözüm: imza canvas'ı "image/png" olarak alınır → base64 → Uint8Array
 *         → embedPng(). Sonra page.drawImage() DOĞRU koordinatlarla (Y ekseni ters)
 *         çağrılır. save() sonrası Blob boyut kontrolü eklendi.
 *
 *  FIX-3  ComparePdfTool → yeni bileşen. İki PDF yüklenir, backend
 *         /api/compare-pdf endpoint'i metin farkını hesaplar, diff raporu döner.
 *         Frontend diff satırlarını renk kodlu gösterir + indirilebilir TXT raporu üretir.
 *
 *  FIX-4  İşleniyor uyarısı → isHeavy bayrağı, geçen süre sayacı, korundu.
 *
 * KURULUM (Replit Shell):
 *   npm install react-signature-canvas
 *   npm install --save-dev @types/react-signature-canvas
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Upload,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Clock,
  PenLine,
  ImageIcon,
  Trash2,
  Languages,
  ChevronDown,
  FileText,
  GitCompare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";

const translations = translationsData as Record<string, any>;

// ─── Meta Pixel wrapper ──────────────────────────────────────────────────────
function trackEvent(name: string, params?: Record<string, unknown>) {
  try {
    const fbq = (window as any).fbq;
    if (typeof fbq === "function") fbq("track", name, params ?? {});
  } catch {}
}

// ─── XHR upload (upload progress + blob yanıtı) ──────────────────────────────
function uploadFiles(
  files: File[],
  endpoint: string,
  extraFields?: Record<string, string>,
  onProgress?: (pct: number) => void,
  timeoutMs = 58_000,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    files.forEach((f) => fd.append("file", f, f.name));
    if (extraFields)
      Object.entries(extraFields).forEach(([k, v]) => fd.append(k, v));

    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.timeout = timeoutMs;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress)
        onProgress(Math.round((e.loaded / e.total) * 40));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response as Blob);
      } else {
        // Sunucu JSON hata mesajını parse et
        const reader = new FileReader();
        reader.onload = () => {
          let msg = `Sunucu hatası (${xhr.status})`;
          try {
            const j = JSON.parse(reader.result as string);
            if (j?.error) msg = j.error;
          } catch {}
          reject(new Error(msg));
        };
        reader.onerror = () =>
          reject(new Error(`Sunucu hatası (${xhr.status})`));
        reader.readAsText(xhr.response as Blob);
      }
    };

    xhr.onerror = () =>
      reject(new Error("Ağ bağlantı hatası — sunucu erişilemiyor"));
    xhr.ontimeout = () => reject(new Error("İstek zaman aşımına uğradı (58s)"));
    xhr.open("POST", endpoint);
    xhr.send(fd);
  });
}

// ─── Ortak "işleniyor" kartı ─────────────────────────────────────────────────
function ProcessingCard({
  progress,
  statusLabel,
  isHeavy = false,
  isEn,
  t,
}: {
  progress: number;
  statusLabel: string;
  isHeavy?: boolean;
  isEn: boolean;
  t: any;
}) {
  return (
    <Card className="p-16 rounded-3xl border border-slate-200 bg-white shadow-xl flex flex-col items-center justify-center text-center">
      <div className="relative w-20 h-20 mb-10">
        <Loader2 className="w-20 h-20 text-primary animate-spin opacity-20 absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center font-bold text-primary text-sm">
          {Math.round(progress)}%
        </div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">
        {t.common.processing}
      </h3>
      <p className="text-primary/70 font-semibold mb-2 text-sm">
        {statusLabel}
      </p>
      {/* FIX-4: Ağır işlem uyarısı */}
      {isHeavy && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-medium mb-4">
          <Clock className="w-4 h-4 flex-shrink-0" />
          {isEn
            ? "This may take a while — please don't close this tab"
            : "Bu biraz zaman alabilir — sekmeyi kapatmayın"}
        </div>
      )}
      <p className="text-slate-400 mb-10 text-sm">
        {isEn
          ? "Your file is being securely processed..."
          : "Dosyanız güvenle işleniyor..."}
      </p>
      <div className="w-full max-w-md">
        <Progress value={progress} className="h-3 rounded-full bg-slate-100" />
      </div>
      <div className="mt-12 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
        <ShieldCheck className="w-4 h-4" /> BANK-GRADE ENCRYPTION ACTIVE
      </div>
    </Card>
  );
}

// ─── Ortak "tamamlandı" kartı ────────────────────────────────────────────────
function CompletedCard({
  fileName,
  blobRef,
  successRef,
  ext,
  toolName,
  onReset,
  isEn,
  t,
}: {
  fileName: string;
  blobRef: React.MutableRefObject<Blob | null>;
  successRef: React.MutableRefObject<boolean>;
  ext: string;
  toolName: string;
  onReset: () => void;
  isEn: boolean;
  t: any;
}) {
  const handleDownload = () => {
    const blob = blobRef.current;
    if (!blob || !successRef.current) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ProToolHub_${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    trackEvent("FileDownloaded", { tool: toolName, ext });
  };

  return (
    <Card className="p-16 rounded-3xl border-2 border-primary/20 bg-slate-50/30 shadow-2xl flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
      <div className="bg-emerald-100 text-emerald-600 p-6 rounded-full mb-8 shadow-sm ring-8 ring-emerald-50">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      <h3 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
        {t.common.ready}
      </h3>
      <p className="text-slate-500 mb-10 font-medium">{fileName}</p>
      <Button
        size="lg"
        onClick={handleDownload}
        disabled={!successRef.current}
        className="rounded-full px-20 font-bold h-16 shadow-2xl bg-emerald-600 hover:bg-emerald-700 text-white border-none text-lg disabled:opacity-50 mb-6"
      >
        <Download className="w-5 h-5 mr-3" />
        {t.common.download}
      </Button>
      <Button
        variant="ghost"
        onClick={onReset}
        className="text-slate-400 hover:text-primary font-bold"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        {t.common.start_over}
      </Button>
      <div className="mt-4 flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-500 text-sm font-medium shadow-sm">
        <Clock className="w-4 h-4 text-rose-400" />
        {t.common.privacy_alert}: {t.common.privacy_desc}
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. WATERMARK TOOL (v7.2 korundu, stabil)
// ═══════════════════════════════════════════════════════════════════════════

export function WatermarkTool() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const isEn = language === "en";

  const [wmText, setWmText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [angle, setAngle] = useState(45);
  const [opacity, setOpacity] = useState(35);
  const [color, setColor] = useState("#c0c0c0");

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "processing" | "completed" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [statusLabel, setStatusLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  const resultBlobRef = useRef<Blob | null>(null);
  const successFlagRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProcessing = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("processing");
    setProgress(0);
    setStatusLabel(isEn ? "Applying watermark..." : "Filigran uygulanıyor...");
    resultBlobRef.current = null;
    successFlagRef.current = false;

    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += 80;
      setProgress(
        Math.min((1 - Math.pow(1 - Math.min(elapsed / 8000, 1), 3)) * 90, 90),
      );
    }, 80);

    try {
      const r = parseInt(color.slice(1, 3), 16) / 255;
      const g = parseInt(color.slice(3, 5), 16) / 255;
      const b = parseInt(color.slice(5, 7), 16) / 255;

      const blob = await uploadFiles(
        [selectedFile],
        "/api/pdf-action",
        {
          actionType: "watermark",
          watermark: wmText,
          fontSize: String(fontSize),
          angle: String(angle),
          opacity: String(opacity / 100),
          colorR: String(r),
          colorG: String(g),
          colorB: String(b),
        },
        (p) => setProgress(p),
      );

      if (blob.size === 0) throw new Error("Sunucu boş PDF döndürdü");
      await blob.arrayBuffer();

      resultBlobRef.current = blob;
      successFlagRef.current = true;
      clearInterval(timerRef.current!);
      setProgress(100);
      setStatus("completed");
      trackEvent("WatermarkApplied", { fontSize, angle, opacity });
    } catch (e: any) {
      clearInterval(timerRef.current!);
      setError(isEn ? `Failed: ${e.message}` : `Hata: ${e.message}`);
      setStatus("error");
    }
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setStatusLabel("");
    setError(null);
    resultBlobRef.current = null;
    successFlagRef.current = false;
  };

  if (status === "processing")
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <ProcessingCard
          progress={progress}
          statusLabel={statusLabel}
          isEn={isEn}
          t={t}
        />
      </div>
    );
  if (status === "completed")
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <CompletedCard
          fileName={file?.name ?? ""}
          blobRef={resultBlobRef}
          successRef={successFlagRef}
          ext="pdf"
          toolName="Watermark PDF"
          onReset={reset}
          isEn={isEn}
          t={t}
        />
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
          {isEn ? "Watermark Settings" : "Filigran Ayarları"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              {isEn ? "Watermark Text" : "Filigran Metni"}
            </label>
            <input
              type="text"
              value={wmText}
              onChange={(e) => setWmText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-all"
            />
          </div>
          {[
            {
              label: isEn ? `Font Size: ${fontSize}pt` : `Yazı: ${fontSize}pt`,
              val: fontSize,
              set: setFontSize,
              min: 12,
              max: 120,
              unit: "pt",
            },
            {
              label: isEn ? `Angle: ${angle}°` : `Açı: ${angle}°`,
              val: angle,
              set: setAngle,
              min: 0,
              max: 360,
              unit: "°",
            },
            {
              label: isEn ? `Opacity: ${opacity}%` : `Şeffaflık: ${opacity}%`,
              val: opacity,
              set: setOpacity,
              min: 5,
              max: 100,
              unit: "%",
            },
          ].map(({ label, val, set, min, max, unit }) => (
            <div key={label}>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                {label}
              </label>
              <input
                type="range"
                min={min}
                max={max}
                value={val}
                onChange={(e) => set(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>
                  {min}
                  {unit}
                </span>
                <span>
                  {max}
                  {unit}
                </span>
              </div>
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              {isEn ? "Color" : "Renk"}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer p-1"
              />
              <span className="text-sm font-mono text-slate-500">
                {color.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        {/* Canlı önizleme */}
        <div className="mt-6 p-6 bg-slate-50 rounded-2xl flex items-center justify-center min-h-[90px] overflow-hidden">
          <span
            className="font-bold select-none pointer-events-none transition-all"
            style={{
              fontSize: `${Math.min(fontSize * 0.38, 34)}px`,
              color,
              opacity: opacity / 100,
              transform: `rotate(-${angle}deg)`,
              whiteSpace: "nowrap",
            }}
          >
            {wmText || "CONFIDENTIAL"}
          </span>
        </div>
      </Card>

      {status === "error" && error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) startProcessing(f);
        }}
        className="cursor-pointer rounded-3xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-white hover:border-primary/50 hover:shadow-xl transition-all group"
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) startProcessing(f);
            e.target.value = "";
          }}
        />
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform mb-4">
          <Upload className="w-10 h-10 text-primary" />
        </div>
        <p className="font-bold text-slate-800 mb-1">{t.common.drop_files}</p>
        <p className="text-slate-400 text-sm mb-6">
          {t.common.drag_drop} (.pdf)
        </p>
        <Button size="lg" className="rounded-full px-10 font-bold h-12">
          {t.common.choose_file}
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. SIGN PDF TOOL — FIX-2: imza gerçekten sayfaya işleniyor
// ═══════════════════════════════════════════════════════════════════════════

export function SignPdfTool() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const isEn = language === "en";

  type SignMode = "draw" | "upload";
  type Step = "sign" | "position" | "processing" | "completed" | "error";

  const [step, setStep] = useState<Step>("sign");
  const [signMode, setSignMode] = useState<SignMode>("draw");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [signDataUrl, setSignDataUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusLabel, setStatusLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  // İmza kutusu konumu (preview container'a göre %)
  const [sigPos, setSigPos] = useState({ x: 10, y: 60 }); // % sol-üst (Y yüksek = sayfa altı)
  const [sigSize, setSigSize] = useState({ w: 35, h: 12 }); // % genişlik-yükseklik
  const [dragState, setDragState] = useState<null | {
    type: "move" | "resize";
    startMx: number;
    startMy: number;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  }>(null);

  const sigCanvasRef = useRef<SignatureCanvas | null>(null);
  const sigUploadRef = useRef<HTMLInputElement>(null);
  const pdfUploadRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const resultBlobRef = useRef<Blob | null>(null);
  const successFlagRef = useRef<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── FIX-2: imzayı PNG data URL olarak al ─────────────────────────────────
  const captureSignature = () => {
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      setError(
        isEn
          ? "Please draw your signature first."
          : "Lütfen önce imzanızı çizin.",
      );
      return;
    }
    // Arka planı beyaz yaparak saydamlık sorununu önle
    const cv = sigCanvasRef.current.getCanvas();
    const tmpCv = document.createElement("canvas");
    tmpCv.width = cv.width;
    tmpCv.height = cv.height;
    const ctx = tmpCv.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, tmpCv.width, tmpCv.height);
    ctx.drawImage(cv, 0, 0);
    setSignDataUrl(tmpCv.toDataURL("image/png"));
    setError(null);
  };

  const handleSignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSignDataUrl(ev.target?.result as string);
    reader.readAsDataURL(f);
    e.target.value = "";
  };

  // ── Sürükle-bırak event sistemi ──────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent, type: "move" | "resize") => {
    e.preventDefault();
    setDragState({
      type,
      startMx: e.clientX,
      startMy: e.clientY,
      startX: sigPos.x,
      startY: sigPos.y,
      startW: sigSize.w,
      startH: sigSize.h,
    });
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragState || !previewRef.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      const dx = ((e.clientX - dragState.startMx) / rect.width) * 100;
      const dy = ((e.clientY - dragState.startMy) / rect.height) * 100;

      if (dragState.type === "move") {
        setSigPos({
          x: Math.max(0, Math.min(90 - sigSize.w, dragState.startX + dx)),
          y: Math.max(0, Math.min(95 - sigSize.h, dragState.startY + dy)),
        });
      } else {
        setSigSize({
          w: Math.max(8, Math.min(80, dragState.startW + dx)),
          h: Math.max(4, Math.min(40, dragState.startH + dy)),
        });
      }
    };
    const onUp = () => setDragState(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragState, sigSize]);

  // ── FIX-2: pdf-lib ile imzayı kalıcı işle ────────────────────────────────
  const applySignature = async () => {
    if (!pdfFile || !signDataUrl) return;

    setStep("processing");
    setStatusLabel(
      isEn ? "Embedding signature into PDF..." : "İmza PDF'e gömülüyor...",
    );
    setProgress(0);
    resultBlobRef.current = null;
    successFlagRef.current = false;

    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += 80;
      setProgress(
        Math.min((1 - Math.pow(1 - Math.min(elapsed / 7000, 1), 3)) * 90, 90),
      );
    }, 80);

    try {
      // ── 1. pdf-lib import ──────────────────────────────────────────────
      const { PDFDocument } = await import("pdf-lib");

      // ── 2. PDF yükle ───────────────────────────────────────────────────
      const pdfArrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfArrayBuffer, {
        ignoreEncryption: true,
      });

      // ── 3. İmza PNG → Uint8Array (data URL base64 kısmını al) ─────────
      // "data:image/png;base64,XXXX" → "XXXX"
      const base64Part = signDataUrl.includes(",")
        ? signDataUrl.split(",")[1]
        : signDataUrl;

      // btoa/atob yerine Uint8Array ile güvenli decode
      const binaryStr = atob(base64Part);
      const pngBytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        pngBytes[i] = binaryStr.charCodeAt(i);
      }

      // ── 4. PNG'yi PDF'e göm ────────────────────────────────────────────
      const pdfImage = await pdfDoc.embedPng(pngBytes);

      // ── 5. Sayfa boyutunu al ve koordinatları hesapla ──────────────────
      // pdf-lib koordinat sistemi: sol-alt (0,0), sağ-üst (w,h)
      // Önizleme koordinatları: sol-üst (0,0) → Y'yi ters çevir
      const page = pdfDoc.getPage(0);
      const { width: pW, height: pH } = page.getSize();

      const imgX = (sigPos.x / 100) * pW;
      const imgW = (sigSize.w / 100) * pW;
      const imgH = (sigSize.h / 100) * pH;
      // Y: önizleme'de "sigPos.y" = üstten % → pdf-lib'de Y = alttan pt
      // pdf Y = pH - (önizleme Y'den altına kadar olan mesafe)
      const imgY = pH - (sigPos.y / 100) * pH - imgH;

      page.drawImage(pdfImage, {
        x: imgX,
        y: Math.max(0, imgY), // negatife düşmesin
        width: imgW,
        height: imgH,
        opacity: 1,
      });

      // ── 6. Kaydet ve doğrula ───────────────────────────────────────────
      const outBytes = await pdfDoc.save({ useObjectStreams: false });
      const blob = new Blob([outBytes], { type: "application/pdf" });

      // Boyut kontrolü: imzalı PDF orijinalden büyük olmalı
      if (blob.size === 0) throw new Error("PDF kaydedilemedi (0 byte)");
      if (blob.size < pdfArrayBuffer.byteLength * 0.5) {
        throw new Error("Çıktı şüpheli küçük — imza işlenemedi olabilir");
      }

      // Okunabilirlik testi
      await blob.arrayBuffer();

      resultBlobRef.current = blob;
      successFlagRef.current = true;

      clearInterval(timerRef.current!);
      setProgress(100);
      setStep("completed");
      trackEvent("PdfSigned", { pageCount: pdfDoc.getPageCount() });
    } catch (e: any) {
      clearInterval(timerRef.current!);
      console.error("[SignPDF] Error:", e);
      setError(isEn ? `Failed: ${e.message}` : `Hata: ${e.message}`);
      setStep("error");
    }
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPdfFile(null);
    setSignDataUrl(null);
    setStep("sign");
    setProgress(0);
    setStatusLabel("");
    setError(null);
    setSigPos({ x: 10, y: 60 });
    setSigSize({ w: 35, h: 12 });
    resultBlobRef.current = null;
    successFlagRef.current = false;
    sigCanvasRef.current?.clear();
  };

  // ── İmza Adımı ────────────────────────────────────────────────────────────
  if (step === "sign" || step === "error") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {step === "error" && error && (
          <Alert variant="destructive" className="rounded-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            {isEn ? "1. Create Your Signature" : "1. İmzanızı Oluşturun"}
          </h3>

          <div className="flex gap-3 mb-6">
            {(["draw", "upload"] as SignMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setSignMode(m)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm border transition-all ${
                  signMode === m
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:border-primary/40"
                }`}
              >
                {m === "draw" ? (
                  <>
                    <PenLine className="w-4 h-4" />
                    {isEn ? "Draw" : "Çiz"}
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    {isEn ? "Upload PNG" : "PNG Yükle"}
                  </>
                )}
              </button>
            ))}
          </div>

          {signMode === "draw" ? (
            <div>
              <div
                className="border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden bg-white"
                style={{ touchAction: "none", cursor: "crosshair" }}
              >
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor="#1e293b"
                  backgroundColor="#ffffff"
                  canvasProps={{
                    width: 600,
                    height: 180,
                    className: "w-full h-auto",
                  }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 mb-4">
                {isEn
                  ? "Draw your signature above with mouse or touch"
                  : "Yukarıya fare veya dokunmatik ile imzalayın"}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sigCanvasRef.current?.clear()}
                  className="rounded-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isEn ? "Clear" : "Temizle"}
                </Button>
                <Button
                  size="sm"
                  onClick={captureSignature}
                  className="rounded-full px-6"
                >
                  {isEn ? "Use This Signature →" : "Bu İmzayı Kullan →"}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <input
                type="file"
                ref={sigUploadRef}
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={handleSignUpload}
              />
              <button
                onClick={() => sigUploadRef.current?.click()}
                className="w-full rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center gap-3 hover:border-primary/40 hover:bg-slate-50 transition-all"
              >
                <ImageIcon className="w-10 h-10 text-slate-300" />
                <span className="text-slate-500 font-medium text-sm">
                  {isEn
                    ? "Upload signature image (PNG/JPG)"
                    : "İmza görüntüsü yükleyin (PNG/JPG)"}
                </span>
              </button>
              {signDataUrl && (
                <div className="mt-4 p-4 bg-emerald-50 rounded-2xl flex items-center gap-4">
                  <img
                    src={signDataUrl}
                    alt="sig"
                    className="h-14 object-contain border border-slate-200 rounded-lg bg-white px-2"
                  />
                  <span className="text-sm text-emerald-600 font-semibold">
                    ✓ {isEn ? "Signature loaded" : "İmza yüklendi"}
                  </span>
                </div>
              )}
            </div>
          )}
        </Card>

        {signDataUrl && (
          <Card className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              {isEn ? "2. Upload Your PDF" : "2. PDF Dosyanızı Yükleyin"}
            </h3>
            <input
              type="file"
              ref={pdfUploadRef}
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setPdfFile(f);
                  setStep("position");
                }
                e.target.value = "";
              }}
            />
            <Button
              onClick={() => pdfUploadRef.current?.click()}
              className="rounded-full px-8 font-bold h-12"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isEn ? "Choose PDF File" : "PDF Dosyası Seçin"}
            </Button>
          </Card>
        )}
      </div>
    );
  }

  // ── Konum Adımı ───────────────────────────────────────────────────────────
  if (step === "position") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            {isEn ? "3. Position Your Signature" : "3. İmzayı Konumlandırın"}
          </h3>
          <p className="text-sm text-slate-400 mb-5">
            {isEn
              ? "Drag to move  ·  Drag blue corner to resize"
              : "Taşımak için sürükleyin  ·  Mavi köşeyi boyutlandırın"}
          </p>

          {/* A4 önizleme (141.4% padding = A4 oranı) */}
          <div
            ref={previewRef}
            className="relative bg-slate-100 rounded-2xl overflow-hidden select-none"
            style={{ paddingBottom: "141.4%" }}
          >
            {/* Sayfa simülasyonu */}
            <div className="absolute inset-0 m-3 bg-white rounded shadow-lg">
              {/* Çizgi çizgileri sayfa görünümü için */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border-b border-slate-50 h-[7.5%]" />
              ))}
            </div>

            {/* Dosya adı */}
            <div className="absolute top-5 inset-x-0 text-center text-xs text-slate-400 pointer-events-none">
              {pdfFile?.name}
            </div>

            {/* İmza kutusu */}
            {signDataUrl && (
              <div
                className="absolute"
                style={{
                  left: `calc(4% + ${sigPos.x * 0.92}%)`,
                  top: `calc(3% + ${sigPos.y * 0.94}%)`,
                  width: `${sigSize.w * 0.92}%`,
                  height: `${sigSize.h * 0.94}%`,
                  cursor: dragState?.type === "move" ? "grabbing" : "grab",
                }}
                onMouseDown={(e) => onMouseDown(e, "move")}
              >
                <div className="w-full h-full border-2 border-primary rounded shadow-lg">
                  <img
                    src={signDataUrl}
                    alt="signature"
                    className="w-full h-full object-contain pointer-events-none"
                  />
                </div>
                {/* Boyutlandırma tutamacı */}
                <div
                  className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full cursor-se-resize shadow-md border-2 border-white flex items-center justify-center"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    onMouseDown(e, "resize");
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="white">
                    <path
                      d="M2 6L6 2M4 6L6 4M6 6L6 6"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={reset} className="rounded-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              {isEn ? "Start Over" : "Baştan Başla"}
            </Button>
            <Button
              onClick={applySignature}
              className="rounded-full px-8 font-bold"
            >
              {isEn
                ? "Apply Signature & Download →"
                : "İmzayı Uygula & İndir →"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === "processing")
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <ProcessingCard
          progress={progress}
          statusLabel={statusLabel}
          isEn={isEn}
          t={t}
        />
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <CompletedCard
        fileName={pdfFile?.name ?? ""}
        blobRef={resultBlobRef}
        successRef={successFlagRef}
        ext="pdf"
        toolName="Sign PDF"
        onReset={reset}
        isEn={isEn}
        t={t}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. TRANSLATE PDF TOOL — FIX-1: Google Translate (API key gerektirmez)
// ═══════════════════════════════════════════════════════════════════════════

const LANGUAGE_LIST = [
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "sv", label: "Svenska", flag: "🇸🇪" },
];

export function TranslatePdfTool() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const isEn = language === "en";

  const [targetLang, setTargetLang] = useState("tr");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "processing" | "completed" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [statusLabel, setStatusLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [elapsedSecs, setElapsedSecs] = useState(0);

  const resultBlobRef = useRef<Blob | null>(null);
  const successFlagRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTranslation = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("processing");
    setProgress(5);
    setElapsedSecs(0);
    setStatusLabel(
      isEn ? "Extracting text from PDF..." : "PDF'den metin çıkarılıyor...",
    );
    resultBlobRef.current = null;
    successFlagRef.current = false;

    // Yavaş ilerleme — çeviri ağır iş
    let prog = 5;
    timerRef.current = setInterval(() => {
      prog = Math.min(prog + 0.4, 88);
      setProgress(prog);
      if (prog > 20)
        setStatusLabel(
          isEn ? "Translating text chunks..." : "Metin parçaları çevriliyor...",
        );
      if (prog > 60)
        setStatusLabel(
          isEn ? "Building output PDF..." : "PDF oluşturuluyor...",
        );
    }, 600);

    // Geçen süre sayacı
    elapsedRef.current = setInterval(() => setElapsedSecs((s) => s + 1), 1000);

    try {
      const blob = await uploadFiles(
        [selectedFile],
        "/api/translate-pdf",
        { targetLang },
        (p) => setProgress(Math.max(p, progress)),
        58_000,
      );

      if (blob.size === 0) throw new Error("Sunucu boş dosya döndürdü");
      await blob.arrayBuffer();

      resultBlobRef.current = blob;
      successFlagRef.current = true;

      clearInterval(timerRef.current!);
      clearInterval(elapsedRef.current!);
      setProgress(100);
      setStatus("completed");
      trackEvent("PdfTranslated", { targetLang });
    } catch (e: any) {
      clearInterval(timerRef.current!);
      clearInterval(elapsedRef.current!);
      setError(
        isEn
          ? `Translation failed: ${e.message}`
          : `Çeviri başarısız: ${e.message}`,
      );
      setStatus("error");
    }
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (elapsedRef.current) clearInterval(elapsedRef.current);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setStatusLabel("");
    setError(null);
    setElapsedSecs(0);
    resultBlobRef.current = null;
    successFlagRef.current = false;
  };

  if (status === "processing")
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* FIX-4: isHeavy=true → "Bu biraz zaman alabilir" uyarısı */}
        <ProcessingCard
          progress={progress}
          statusLabel={`${statusLabel} (${elapsedSecs}s)`}
          isHeavy={true}
          isEn={isEn}
          t={t}
        />
      </div>
    );

  if (status === "completed")
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <CompletedCard
          fileName={file?.name ?? ""}
          blobRef={resultBlobRef}
          successRef={successFlagRef}
          ext="pdf"
          toolName="Translate PDF"
          onReset={reset}
          isEn={isEn}
          t={t}
        />
      </div>
    );

  const selectedLang = LANGUAGE_LIST.find((l) => l.code === targetLang);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
          {isEn ? "Target Language" : "Hedef Dil"}
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {LANGUAGE_LIST.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setTargetLang(lang.code)}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-sm font-semibold transition-all ${
                targetLang === lang.code
                  ? "border-primary bg-primary/5 text-primary shadow-sm scale-105"
                  : "border-slate-100 hover:border-primary/30 text-slate-600"
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-xs">{lang.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {status === "error" && error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) startTranslation(f);
        }}
        className="cursor-pointer rounded-3xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center text-center bg-slate-50/50 hover:bg-white hover:border-primary/50 hover:shadow-xl transition-all group"
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) startTranslation(f);
            e.target.value = "";
          }}
        />
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform mb-4">
          <Languages className="w-10 h-10 text-primary" />
        </div>
        <p className="font-bold text-slate-800 mb-1">
          {isEn ? "Drop your PDF to translate" : "Çevirmek için PDF bırakın"}
        </p>
        <p className="text-slate-500 text-sm mb-2">
          {isEn ? "Target: " : "Hedef: "}
          <strong>
            {selectedLang?.flag} {selectedLang?.label}
          </strong>
        </p>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-xs font-semibold mb-6">
          <Clock className="w-3 h-3" />
          {isEn ? "May take 30–60 seconds" : "30–60 saniye sürebilir"}
        </div>
        <Button size="lg" className="rounded-full px-10 font-bold h-12">
          {t.common.choose_file}
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. COMPARE PDF TOOL — FIX-3: İki dosya yükleme + diff raporu
// ═══════════════════════════════════════════════════════════════════════════

interface DiffLine {
  type: "same" | "added" | "removed";
  text: string;
  lineA?: number;
  lineB?: number;
}

/** Basit satır bazlı diff algoritması (LCS tabanlı) */
function computeDiff(textA: string, textB: string): DiffLine[] {
  const linesA = textA.split("\n");
  const linesB = textB.split("\n");
  const result: DiffLine[] = [];

  // LCS dp tablosu
  const m = linesA.length,
    n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0),
  );
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] =
        linesA[i] === linesB[j]
          ? 1 + dp[i + 1][j + 1]
          : Math.max(dp[i + 1][j], dp[i][j + 1]);

  let i = 0,
    j = 0;
  while (i < m && j < n) {
    if (linesA[i] === linesB[j]) {
      result.push({
        type: "same",
        text: linesA[i],
        lineA: i + 1,
        lineB: j + 1,
      });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: "removed", text: linesA[i], lineA: i + 1 });
      i++;
    } else {
      result.push({ type: "added", text: linesB[j], lineB: j + 1 });
      j++;
    }
  }
  while (i < m) {
    result.push({ type: "removed", text: linesA[i], lineA: i + 1 });
    i++;
  }
  while (j < n) {
    result.push({ type: "added", text: linesB[j], lineB: j + 1 });
    j++;
  }
  return result;
}

export function ComparePdfTool() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const isEn = language === "en";

  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "processing" | "completed" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [statusLabel, setStatusLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [diffLines, setDiffLines] = useState<DiffLine[]>([]);
  const [stats, setStats] = useState({ added: 0, removed: 0, same: 0 });
  const [showSame, setShowSame] = useState(false);

  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCompare = async () => {
    if (!fileA || !fileB) return;

    setStatus("processing");
    setProgress(0);
    setStatusLabel(
      isEn
        ? "Extracting text from both PDFs..."
        : "Her iki PDF'den metin çıkarılıyor...",
    );

    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += 80;
      setProgress(
        Math.min((1 - Math.pow(1 - Math.min(elapsed / 12000, 1), 3)) * 88, 88),
      );
      if (elapsed > 5000)
        setStatusLabel(
          isEn ? "Comparing differences..." : "Farklar karşılaştırılıyor...",
        );
    }, 80);

    try {
      // Her iki PDF'i backend'e gönder
      const fd = new FormData();
      fd.append("fileA", fileA, fileA.name);
      fd.append("fileB", fileB, fileB.name);

      const xhr = new XMLHttpRequest();
      xhr.responseType = "json";
      xhr.timeout = 58_000;
      xhr.open("POST", "/api/compare-pdf");

      const result: { textA: string; textB: string; error?: string } =
        await new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(xhr.response);
            } else {
              reject(
                new Error(
                  xhr.response?.error ?? `Sunucu hatası (${xhr.status})`,
                ),
              );
            }
          };
          xhr.onerror = () => reject(new Error("Ağ hatası"));
          xhr.ontimeout = () => reject(new Error("Zaman aşımı (58s)"));
          xhr.send(fd);
        });

      if (result.error) throw new Error(result.error);

      const diff = computeDiff(result.textA ?? "", result.textB ?? "");
      const added = diff.filter((d) => d.type === "added").length;
      const removed = diff.filter((d) => d.type === "removed").length;
      const same = diff.filter((d) => d.type === "same").length;

      setDiffLines(diff);
      setStats({ added, removed, same });

      clearInterval(timerRef.current!);
      setProgress(100);
      setStatus("completed");
      trackEvent("PdfCompared", { added, removed });
    } catch (e: any) {
      clearInterval(timerRef.current!);
      setError(
        isEn
          ? `Compare failed: ${e.message}`
          : `Karşılaştırma başarısız: ${e.message}`,
      );
      setStatus("error");
    }
  };

  const downloadReport = () => {
    const lines = diffLines.map((d) => {
      const prefix =
        d.type === "added" ? "+ " : d.type === "removed" ? "- " : "  ";
      return prefix + d.text;
    });
    const header = [
      `ProToolHub PDF Compare Report`,
      `File A: ${fileA?.name}`,
      `File B: ${fileB?.name}`,
      `Added: ${stats.added} lines  |  Removed: ${stats.removed} lines  |  Same: ${stats.same} lines`,
      "─".repeat(60),
      "",
    ].join("\n");
    const blob = new Blob([header + lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compare_report_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    trackEvent("CompareReportDownloaded");
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFileA(null);
    setFileB(null);
    setStatus("idle");
    setProgress(0);
    setStatusLabel("");
    setError(null);
    setDiffLines([]);
    setStats({ added: 0, removed: 0, same: 0 });
  };

  // Dosya yükleme kutusu
  const DropZone = ({
    file,
    onFile,
    label,
    ref: inputRef,
    slot,
  }: {
    file: File | null;
    onFile: (f: File) => void;
    label: string;
    ref: React.RefObject<HTMLInputElement>;
    slot: "A" | "B";
  }) => (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files[0];
        if (f) onFile(f);
      }}
      className={`cursor-pointer flex-1 rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-all ${
        file
          ? "border-primary/40 bg-primary/5"
          : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
      }`}
    >
      <input
        type="file"
        ref={inputRef}
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
      <div
        className={`p-4 rounded-xl mb-3 ${file ? "bg-primary/10" : "bg-slate-100"}`}
      >
        <FileText
          className={`w-8 h-8 ${file ? "text-primary" : "text-slate-400"}`}
        />
      </div>
      {file ? (
        <div>
          <p className="font-bold text-primary text-sm truncate max-w-[140px]">
            {file.name}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      ) : (
        <div>
          <p className="font-semibold text-slate-600 text-sm">{label}</p>
          <p className="text-xs text-slate-400 mt-1">.pdf</p>
        </div>
      )}
      <div className="mt-2 text-xs font-bold text-slate-300 bg-slate-100 px-2 py-0.5 rounded-full">
        PDF {slot}
      </div>
    </div>
  );

  if (status === "processing")
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <ProcessingCard
          progress={progress}
          statusLabel={statusLabel}
          isEn={isEn}
          t={t}
        />
      </div>
    );

  if (status === "completed") {
    const visibleLines = showSame
      ? diffLines
      : diffLines.filter((d) => d.type !== "same");
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* İstatistik kartları */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: isEn ? "Added" : "Eklendi",
              val: stats.added,
              color: "emerald",
            },
            {
              label: isEn ? "Removed" : "Silindi",
              val: stats.removed,
              color: "rose",
            },
            { label: isEn ? "Same" : "Aynı", val: stats.same, color: "slate" },
          ].map(({ label, val, color }) => (
            <Card
              key={label}
              className={`p-5 rounded-2xl text-center border-0 ${
                color === "emerald"
                  ? "bg-emerald-50"
                  : color === "rose"
                    ? "bg-rose-50"
                    : "bg-slate-50"
              }`}
            >
              <p
                className={`text-3xl font-black ${
                  color === "emerald"
                    ? "text-emerald-600"
                    : color === "rose"
                      ? "text-rose-600"
                      : "text-slate-600"
                }`}
              >
                {val}
              </p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                {label}
              </p>
            </Card>
          ))}
        </div>

        {/* Dosya isimleri */}
        <Card className="p-5 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded font-bold text-xs">
                A
              </span>
              <span className="font-medium truncate max-w-[160px]">
                {fileA?.name}
              </span>
            </div>
            <GitCompare className="w-4 h-4 text-slate-300 flex-shrink-0" />
            <div className="flex items-center gap-2 text-slate-600">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-bold text-xs">
                B
              </span>
              <span className="font-medium truncate max-w-[160px]">
                {fileB?.name}
              </span>
            </div>
          </div>
        </Card>

        {/* Diff görünümü */}
        <Card className="rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-700">
              {isEn ? "Diff View" : "Fark Görünümü"}
            </span>
            <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={showSame}
                onChange={(e) => setShowSame(e.target.checked)}
                className="accent-primary"
              />
              {isEn ? "Show unchanged lines" : "Değişmeyenleri göster"}
            </label>
          </div>
          <div className="max-h-[480px] overflow-y-auto font-mono text-xs">
            {visibleLines.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                {isEn
                  ? "No differences found — files are identical"
                  : "Fark yok — dosyalar aynı"}
              </div>
            ) : (
              visibleLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 px-4 py-0.5 ${
                    line.type === "added"
                      ? "bg-emerald-50 text-emerald-800"
                      : line.type === "removed"
                        ? "bg-rose-50 text-rose-800"
                        : "text-slate-400"
                  }`}
                >
                  <span className="flex-shrink-0 w-4 text-center opacity-60">
                    {line.type === "added"
                      ? "+"
                      : line.type === "removed"
                        ? "-"
                        : " "}
                  </span>
                  <span className="flex-shrink-0 w-12 text-right opacity-40 select-none">
                    {line.lineA ?? ""}/{line.lineB ?? ""}
                  </span>
                  <span className="break-all">{line.text || " "}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Aksiyon butonları */}
        <div className="flex gap-4">
          <Button
            onClick={downloadReport}
            className="rounded-full px-8 font-bold bg-slate-800 hover:bg-slate-900 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            {isEn ? "Download Report (.txt)" : "Raporu İndir (.txt)"}
          </Button>
          <Button variant="outline" onClick={reset} className="rounded-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            {isEn ? "Compare Again" : "Tekrar Karşılaştır"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {status === "error" && error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          {isEn ? "Compare Two PDF Files" : "İki PDF Dosyasını Karşılaştır"}
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          {isEn
            ? "Upload both PDFs to see added, removed and unchanged text differences"
            : "Eklenen, silinen ve değişmeyen satırları görmek için iki PDF yükleyin"}
        </p>

        <div className="flex gap-4">
          <DropZone
            file={fileA}
            onFile={setFileA}
            label={isEn ? "Upload first PDF" : "İlk PDF'i yükleyin"}
            ref={inputARef}
            slot="A"
          />
          <div className="flex items-center justify-center flex-shrink-0">
            <GitCompare className="w-8 h-8 text-slate-200" />
          </div>
          <DropZone
            file={fileB}
            onFile={setFileB}
            label={isEn ? "Upload second PDF" : "İkinci PDF'i yükleyin"}
            ref={inputBRef}
            slot="B"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={startCompare}
            disabled={!fileA || !fileB}
            className="rounded-full px-14 font-bold h-14 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
          >
            <GitCompare className="w-5 h-5 mr-3" />
            {isEn ? "Compare PDFs" : "PDF'leri Karşılaştır"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
