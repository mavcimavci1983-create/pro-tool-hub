/**
 * ImageTools.tsx — ProToolHub v1.0  "Image Suite"
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 10 Araç — Tamamı Client-Side (Sıfır Backend):
 *  1.  CompressImageTool    Kalite kaydırıcı, anlık boyut tahmini, alpha-aware
 *  2.  ResizeImageTool      px / % modu, oran kilidi, sosyal medya preset'leri
 *  3.  CropImageTool        Sürükle-bırak kırpma, 6 aspect-ratio preset, ızgara
 *  4.  ConvertFormatTool    JPG ↔ PNG ↔ WebP ↔ BMP, alpha-aware dönüşüm
 *  5.  WebPToJpgTool        Tek tıkla WebP → JPG
 *  6.  WebPToPngTool        Tek tıkla WebP → PNG (alpha korunur)
 *  7.  ImageToWebpTool      Görüntü → WebP (herhangi format)
 *  8.  HeicToJpgTool        HEIC/HEIF → JPG (heic2any CDN lazy-load)
 *  9.  RemoveBackgroundTool remove.bg API + yerel edge-detection fallback
 *  10. AddTextToImageTool   Metin overlay: font, renk, konum, canlı önizleme
 *
 * MİMARİ:
 *  • MAX_SAFE_PIXELS (16MP) — canvas bellek güvenlik sınırı
 *  • Alpha compositing: PNG/WebP→JPG = beyaz arka plan otomatik
 *  • useImageTool() hook: tüm araçlarda tekrar eden state + progress mantığı
 *  • Her araç kendi state'inde izole — çapraz kirlenme yok
 *  • HEIC: heic2any@0.0.4 script tag ile CDN'den lazy-load
 *
 * KURULUM:
 *  Ek paket gerekmez. remove.bg için API key opsiyonel.
 *
 * KULLANIM:
 *  import { CompressImageTool } from "@/components/ImageTools";
 *  <CompressImageTool />
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, {
  useState, useRef, useEffect, useCallback,
} from "react";
import { removeBackground, type Config as ImglyBgConfig } from "@imgly/background-removal";
import {
  Upload, Download, RefreshCw, AlertCircle, AlertTriangle, CheckCircle2,
  Loader2, ShieldCheck, Clock, Crop, Type,
  Layers, ArrowLeftRight, Maximize2, Minimize2,
  Lock, Unlock, Zap, ImageIcon, Settings, ChevronDown,
} from "lucide-react";
import { Button }   from "@/components/ui/button";
import { Card }     from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData     from "@/locales/translations.json";

const translations = translationsData as Record<string, any>;

// ─── Meta Pixel ──────────────────────────────────────────────────────────────
function trackEvent(name: string, params?: Record<string, unknown>) {
  try {
    const fbq = (window as any).fbq;
    if (typeof fbq === "function") fbq("track", name, params ?? {});
  } catch {}
}

// ═══════════════════════════════════════════════════════════════════════════
// § CANVAS ENGINE — Bellek güvenli, alpha-aware temel fonksiyonlar
// ═══════════════════════════════════════════════════════════════════════════

/** Canvas güvenli piksel sınırı ~16MP — üzeri OOM riski */
const MAX_SAFE_PIXELS = 16_000_000;

/** File → HTMLImageElement (URL nesnesini temizler) */
function loadImageSafe(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload  = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Görüntü yüklenemedi / Image load failed")); };
    img.src = url;
  });
}

/** HTMLImageElement → güvenli ölçeklenmiş canvas */
function imgToCanvas(
  img: HTMLImageElement,
  targetW: number,
  targetH: number,
  targetMime: string,
  bgColor = "#ffffff",
): HTMLCanvasElement {
  const cv  = document.createElement("canvas");
  cv.width  = Math.round(Math.max(1, targetW));
  cv.height = Math.round(Math.max(1, targetH));
  const ctx = cv.getContext("2d")!;
  // JPG/BMP alpha yoktur → beyaz arka plan
  if (targetMime === "image/jpeg" || targetMime === "image/bmp") {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, cv.width, cv.height);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, cv.width, cv.height);
  return cv;
}

/** Canvas → Blob (kaliteli) */
function cvToBlob(cv: HTMLCanvasElement, mime: string, q = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    cv.toBlob(
      b => b && b.size > 0
        ? resolve(b)
        : reject(new Error("Canvas → Blob başarısız. Dosya formatı desteklenmiyor olabilir.")),
      mime, q
    );
  });
}

/** Yüksek çözünürlük güvenlik ölçekleme: toplam piksel > MAX_SAFE ise küçült */
function safeScale(w: number, h: number): [number, number] {
  const total = w * h;
  if (total <= MAX_SAFE_PIXELS) return [w, h];
  const factor = Math.sqrt(MAX_SAFE_PIXELS / total);
  return [Math.round(w * factor), Math.round(h * factor)];
}

/** Baytı okunabilir boyuta çevir */
function fmtSize(b: number): string {
  if (b < 1024)      return `${b} B`;
  if (b < 1048576)   return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(2)} MB`;
}

/** Blob indir */
function saveBlobAs(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 12_000);
}

/** Dosya adı uzantısını değiştir */
function swapExt(name: string, ext: string) {
  return name.replace(/\.[^.]+$/, "") + "." + ext;
}

/** MIME → uzantı */
const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png",
  "image/webp": "webp", "image/bmp": "bmp", "image/gif": "gif",
};
const mimeToExt = (m: string) => MIME_EXT[m] ?? "jpg";

// ═══════════════════════════════════════════════════════════════════════════
// § ORTAK STATE HOOK
// ═══════════════════════════════════════════════════════════════════════════

type ToolStatus = "idle" | "processing" | "done" | "error";

function useImageTool() {
  const { language } = useLanguageStore();
  const t    = translations[language] ?? {};
  const isEn = language === "en";

  const [file,     setFile    ] = useState<File | null>(null);
  const [status,   setStatus  ] = useState<ToolStatus>("idle");
  const [pct,      setPct     ] = useState(0);
  const [label,    setLabel   ] = useState("");
  const [error,    setError   ] = useState<string | null>(null);
  const [result,   setResult  ] = useState<Blob | null>(null);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Sahte progress animasyonu — işin uzunluğuna göre duration ayarla */
  const startAnim = useCallback((durationMs = 3000) => {
    setPct(0);
    let ms = 0;
    timer.current = setInterval(() => {
      ms += 60;
      const eased = 1 - Math.pow(1 - Math.min(ms / durationMs, 1), 3);
      setPct(Math.min(Math.round(eased * 90), 90));
    }, 60);
  }, []);

  const finish = useCallback((blob: Blob) => {
    if (timer.current) clearInterval(timer.current);
    setPct(100); setResult(blob); setStatus("done");
  }, []);

  const fail = useCallback((msg: string) => {
    if (timer.current) clearInterval(timer.current);
    setError(msg); setStatus("error");
  }, []);

  const reset = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    setFile(null); setStatus("idle"); setPct(0);
    setLabel(""); setError(null); setResult(null);
  }, []);

  // cleanup on unmount
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  return { t, isEn, file, setFile, status, setStatus, pct, label, setLabel, error, setError, result, startAnim, finish, fail, reset };
}

// ═══════════════════════════════════════════════════════════════════════════
// § ORTAK UI BİLEŞENLERİ
// ═══════════════════════════════════════════════════════════════════════════

/** Sürükle-bırak yükleme alanı */
function DropZone({
  onFiles, accept = "image/*", isEn, error, multiple = false, hint,
}: {
  onFiles: (files: File[]) => void;
  accept?: string; isEn: boolean;
  error?: string | null; multiple?: boolean;
  hint?: string;
}) {
  const [over, setOver] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full space-y-4">
      <div
        onClick={() => ref.current?.click()}
        onDragOver={e => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={e => {
          e.preventDefault(); setOver(false);
          const files = Array.from(e.dataTransfer.files);
          if (files.length) onFiles(multiple ? files : [files[0]]);
        }}
        className={[
          "relative cursor-pointer rounded-3xl border-2 border-dashed",
          "p-16 flex flex-col items-center justify-center text-center",
          "transition-all duration-300 group",
          over
            ? "border-primary bg-primary/5 scale-[1.01] shadow-xl"
            : error
              ? "border-rose-300 bg-rose-50/40"
              : "border-slate-200 bg-gradient-to-br from-slate-50 to-white hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/5 hover:bg-white",
        ].join(" ")}
      >
        <input
          ref={ref} type="file" accept={accept}
          multiple={multiple} className="hidden"
          onChange={e => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) onFiles(multiple ? files : [files[0]]);
            e.target.value = "";
          }}
        />

        {/* Animasyonlu ikon arka planı */}
        <div className={[
          "p-7 rounded-2xl shadow-sm border mb-7 transition-all duration-300",
          "group-hover:scale-110 group-hover:shadow-md",
          over ? "bg-primary/10 border-primary/30 scale-110"
               : error ? "bg-rose-50 border-rose-100"
                       : "bg-white border-slate-100",
        ].join(" ")}>
          <Upload className={`w-12 h-12 transition-colors ${over || !error ? "text-primary" : "text-rose-500"}`} />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
          {isEn ? "Drop your image here" : "Görüntüyü buraya bırakın"}
        </h3>
        <p className="text-slate-400 text-sm font-medium mb-1">
          {isEn ? "or click to browse" : "veya tıklayarak seçin"}
        </p>
        {hint && (
          <p className="text-xs text-slate-300 mb-8">{hint}</p>
        )}
        {!hint && <div className="mb-8" />}
        <Button size="lg" variant={error ? "destructive" : "default"}
          className="rounded-full px-12 font-bold h-14 shadow-lg hover:scale-105 transition-transform">
          {isEn ? "Choose Image" : "Görüntü Seç"}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-2xl border-rose-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold">Error</AlertTitle>
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

/** İşleniyor kartı */
function ProcessingCard({ pct, label, isEn }: { pct: number; label: string; isEn: boolean }) {
  return (
    <Card className="p-16 rounded-3xl border border-slate-100 bg-white shadow-xl flex flex-col items-center text-center">
      <div className="relative w-24 h-24 mb-10">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
          <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
            strokeLinecap="round" className="transition-all duration-500"/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-black text-primary text-lg">
          {Math.round(pct)}%
        </div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-1">
        {isEn ? "Processing..." : "İşleniyor..."}
      </h3>
      <p className="text-primary/70 font-semibold text-sm mb-2">{label}</p>
      <p className="text-slate-400 text-sm mb-10">
        {isEn ? "Running locally — your file never leaves your device" : "Yerel olarak çalışıyor — dosyanız cihazınızdan ayrılmaz"}
      </p>
      <div className="w-full max-w-sm">
        <Progress value={pct} className="h-2 rounded-full bg-slate-100" />
      </div>
      <div className="mt-10 flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest">
        <ShieldCheck className="w-4 h-4" /> 100% LOCAL PROCESSING
      </div>
    </Card>
  );
}

/** İndirme / tamamlandı kartı */
function DoneCard({
  blob, filename, origSize, isEn, onReset, children,
}: {
  blob: Blob; filename: string; origSize?: number;
  isEn: boolean; onReset: () => void;
  children?: React.ReactNode;
}) {
  const reduction = origSize && origSize > blob.size
    ? Math.round((1 - blob.size / origSize) * 100) : null;

  return (
    <Card className="p-14 rounded-3xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
      <div className="bg-emerald-100 text-emerald-600 p-6 rounded-full mb-6 shadow-sm ring-8 ring-emerald-50/80">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">
        {isEn ? "Done!" : "Hazır!"}
      </h3>
      <p className="text-slate-500 mb-4 font-medium text-sm truncate max-w-xs">{filename}</p>

      {/* Boyut karşılaştırması */}
      {origSize != null && (
        <div className="flex items-center gap-3 mb-6 text-sm">
          <span className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full font-mono font-medium">
            {fmtSize(origSize)}
          </span>
          <ArrowLeftRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
          <span className={`px-3 py-1.5 rounded-full font-mono font-bold ${
            reduction != null && reduction > 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
          }`}>
            {fmtSize(blob.size)}
          </span>
          {reduction != null && reduction > 0 && (
            <span className="px-2.5 py-1 bg-emerald-500 text-white rounded-full text-xs font-black">
              −{reduction}%
            </span>
          )}
        </div>
      )}

      {children}

      <Button size="lg"
        onClick={() => { saveBlobAs(blob, filename); trackEvent("ImageDownloaded", { filename }); }}
        className="rounded-full px-20 font-bold h-16 shadow-xl bg-emerald-600 hover:bg-emerald-700 text-white text-lg mb-5 w-full max-w-xs border-none">
        <Download className="w-5 h-5 mr-3" />
        {isEn ? "Download" : "İndir"}
      </Button>

      <Button variant="ghost" onClick={onReset}
        className="text-slate-400 hover:text-primary font-bold transition-colors">
        <RefreshCw className="w-4 h-4 mr-2" />
        {isEn ? "Process another image" : "Başka görüntü işle"}
      </Button>

      <div className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 text-xs font-medium">
        <Clock className="w-3.5 h-3.5 text-rose-300" />
        {isEn ? "File never uploaded — stays on your device" : "Dosya hiç yüklenmedi — cihazınızda kaldı"}
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. COMPRESS IMAGE
// Kalite kaydırıcı + gerçek zamanlı boyut tahmini + alpha-aware sıkıştırma
// ═══════════════════════════════════════════════════════════════════════════

export function CompressImageTool() {
  const { t, isEn, file, setFile, status, setStatus, pct, label, setLabel, error, result, startAnim, finish, fail, reset } = useImageTool();
  const [quality, setQuality] = useState(82);

  const qualityLabel = quality >= 90 ? (isEn ? "Near-lossless" : "Kayıpsıza yakın")
    : quality >= 70 ? (isEn ? "Balanced" : "Dengeli")
    : quality >= 50 ? (isEn ? "Web optimized" : "Web için optimize")
    : (isEn ? "Maximum compression" : "Maksimum sıkıştırma");

  const process = async (f: File) => {
    setFile(f);
    setStatus("processing");
    setLabel(isEn ? "Compressing..." : "Sıkıştırılıyor...");
    startAnim(2500);
    try {
      const img = await loadImageSafe(f);
      const [sw, sh] = safeScale(img.naturalWidth, img.naturalHeight);

      // Alpha olan PNG/WebP → WebP korunur (kalite kaybetmeden sıkıştır)
      const isAlpha   = f.type === "image/png" || f.type === "image/webp";
      const outMime   = isAlpha ? "image/webp" : "image/jpeg";

      const cv   = imgToCanvas(img, sw, sh, outMime);
      const blob = await cvToBlob(cv, outMime, quality / 100);

      finish(blob);
      trackEvent("ImageCompressed", { quality, before: f.size, after: blob.size });
    } catch (e: any) {
      fail(isEn ? `Compression failed: ${e.message}` : `Sıkıştırma hatası: ${e.message}`);
    }
  };

  if (status === "processing") return <div className="w-full max-w-4xl mx-auto"><ProcessingCard pct={pct} label={label} isEn={isEn}/></div>;
  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={swapExt(file!.name, mimeToExt(result.type))}
        origSize={file!.size} isEn={isEn} onReset={reset}/>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Ayar paneli */}
      <Card className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 rounded-2xl"><Minimize2 className="w-5 h-5 text-blue-600"/></div>
          <div>
            <h3 className="text-base font-bold text-slate-800">{isEn ? "Compression Settings" : "Sıkıştırma Ayarları"}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{isEn ? "Adjust quality vs file size" : "Kalite ve dosya boyutunu ayarlayın"}</p>
          </div>
        </div>

        {/* Quality slider */}
        <div className="mb-5">
          <div className="flex justify-between items-baseline mb-3">
            <label className="text-sm font-semibold text-slate-700">
              {isEn ? "Quality" : "Kalite"}
            </label>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-primary">{quality}</span>
              <span className="text-sm text-slate-400 font-medium">/ 100</span>
            </div>
          </div>
          <input type="range" min={10} max={100} value={quality}
            onChange={e => setQuality(Number(e.target.value))}
            className="w-full h-2 accent-primary appearance-none rounded-full bg-slate-100 mb-3
                       [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md
                       [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-300">
            <span>{isEn ? "Smallest file" : "En küçük dosya"}</span>
            <span>{isEn ? "Best quality" : "En iyi kalite"}</span>
          </div>
        </div>

        {/* Kalite bantları */}
        <div className="flex gap-2 mb-5">
          {[
            { range:[85,100], label:"High",    color:"bg-emerald-500" },
            { range:[70, 84], label:"Good",    color:"bg-blue-500"    },
            { range:[50, 69], label:"Web",     color:"bg-amber-500"   },
            { range:[10, 49], label:"Minimal", color:"bg-rose-500"    },
          ].map(({ range, label: lbl, color }) => {
            const active = quality >= range[0] && quality <= range[1];
            return (
              <button key={lbl}
                onClick={() => setQuality(Math.round((range[0] + range[1]) / 2))}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                  active ? `${color} text-white border-transparent shadow-sm scale-105` : "bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200"
                }`}>
                {lbl}
              </button>
            );
          })}
        </div>

        <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 font-medium">
          💡 {qualityLabel} — {isEn ? "PNG/WebP inputs will be exported as WebP (alpha preserved)" : "PNG/WebP dosyaları WebP olarak çıktılanır (alpha korunur)"}
        </div>
      </Card>

      <DropZone onFiles={f => process(f[0])} accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        isEn={isEn} error={error}
        hint={isEn ? "JPG, PNG, WebP — up to 50MB" : "JPG, PNG, WebP — 50MB'a kadar"}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. RESIZE IMAGE
// px / % modu, oran kilidi, sosyal medya preset'leri
// ═══════════════════════════════════════════════════════════════════════════

const SOCIAL_PRESETS = [
  { name:"HD 720p",       w:1280, h:720  },
  { name:"Full HD",       w:1920, h:1080 },
  { name:"4K UHD",        w:3840, h:2160 },
  { name:"Instagram",     w:1080, h:1080 },
  { name:"Instagram Story",w:1080,h:1920 },
  { name:"Twitter Post",  w:1200, h:675  },
  { name:"Facebook Cover",w:820,  h:312  },
  { name:"LinkedIn",      w:1200, h:627  },
  { name:"Thumbnail",     w:320,  h:180  },
  { name:"Avatar 512",    w:512,  h:512  },
];

export function ResizeImageTool() {
  const { t, isEn, file, setFile, status, setStatus, pct, label, setLabel, error, setError, result, startAnim, finish, fail, reset } = useImageTool();
  const [orig, setOrig] = useState<{w:number;h:number}|null>(null);
  const [tw, setTw]     = useState("");
  const [th, setTh]     = useState("");
  const [unit, setUnit] = useState<"px"|"%">("px");
  const [lock, setLock] = useState(true);

  const onFileSelect = async (f: File) => {
    setFile(f);
    try {
      const img = await loadImageSafe(f);
      setOrig({ w: img.naturalWidth, h: img.naturalHeight });
      setTw(String(img.naturalWidth));
      setTh(String(img.naturalHeight));
    } catch (e: any) { fail(e.message); }
  };

  const onWChange = (v: string) => {
    setTw(v);
    if (lock && orig && v) {
      const n = parseFloat(v);
      if (!isNaN(n) && n > 0) setTh(String(unit === "%" ? n : Math.round(n * orig.h / orig.w)));
    }
  };
  const onHChange = (v: string) => {
    setTh(v);
    if (lock && orig && v) {
      const n = parseFloat(v);
      if (!isNaN(n) && n > 0) setTw(String(unit === "%" ? n : Math.round(n * orig.w / orig.h)));
    }
  };

  const applyPreset = (pw: number, ph: number) => {
    setUnit("px"); setLock(false);
    setTw(String(pw)); setTh(String(ph));
  };

  const process = async () => {
    if (!file || !orig) return;
    const wn = parseFloat(tw), hn = parseFloat(th);
    if (isNaN(wn) || isNaN(hn) || wn <= 0 || hn <= 0) {
      setError(isEn ? "Enter valid dimensions" : "Geçerli boyutlar girin"); return;
    }
    const fw = unit === "%" ? Math.round(orig.w * wn / 100) : Math.round(wn);
    const fh = unit === "%" ? Math.round(orig.h * hn / 100) : Math.round(hn);
    if (fw > 16000 || fh > 16000) {
      setError(isEn ? "Max 16,000 × 16,000 px" : "Maks. 16.000 × 16.000 px"); return;
    }
    setStatus("processing");
    setLabel(isEn ? `Resizing to ${fw}×${fh}px…` : `${fw}×${fh}px'e yeniden boyutlandırılıyor…`);
    startAnim(2000);
    try {
      const img  = await loadImageSafe(file);
      const mime = file.type || "image/jpeg";
      const cv   = imgToCanvas(img, fw, fh, mime);
      finish(await cvToBlob(cv, mime, 0.93));
      trackEvent("ImageResized", { from:`${orig.w}x${orig.h}`, to:`${fw}x${fh}` });
    } catch (e: any) { fail(e.message); }
  };

  if (status === "processing") return <div className="w-full max-w-4xl mx-auto"><ProcessingCard pct={pct} label={label} isEn={isEn}/></div>;
  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={file!.name} origSize={file!.size} isEn={isEn} onReset={reset}/>
    </div>
  );

  if (!file) return (
    <div className="w-full max-w-4xl mx-auto">
      <DropZone onFiles={f => onFileSelect(f[0])} isEn={isEn} error={error}
        hint={isEn ? "Any image format" : "Tüm görüntü formatları"}/>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm">
        {/* Başlık */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-violet-50 rounded-2xl"><Maximize2 className="w-5 h-5 text-violet-600"/></div>
          <div>
            <h3 className="text-base font-bold text-slate-800">{isEn?"Resize Settings":"Boyut Ayarları"}</h3>
            {orig && <p className="text-xs text-slate-400 mt-0.5">{isEn?"Original:":"Orijinal:"} {orig.w} × {orig.h} px — {fmtSize(file.size)}</p>}
          </div>
        </div>

        {/* Birim seçici */}
        <div className="flex gap-2 mb-6">
          {(["px", "%"] as const).map(u => (
            <button key={u} onClick={() => { setUnit(u); if(u==="%"){ setTw("100"); setTh("100"); } else if(orig){ setTw(String(orig.w)); setTh(String(orig.h)); } }}
              className={`px-6 py-2 rounded-full text-sm font-bold border transition-all ${unit===u ? "bg-violet-600 text-white border-violet-600 shadow-sm" : "border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600"}`}>
              {u}
            </button>
          ))}
        </div>

        {/* Boyut inputları */}
        <div className="flex items-end gap-4 mb-6">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              {isEn?"Width":"Genişlik"} ({unit})
            </label>
            <input type="number" value={tw} onChange={e => onWChange(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none font-mono text-2xl font-black text-slate-800 transition-all text-center"/>
          </div>

          {/* Kilit butonu */}
          <button onClick={() => setLock(l => !l)}
            className={`flex flex-col items-center gap-1 pb-4 transition-colors ${lock ? "text-violet-600" : "text-slate-300 hover:text-slate-400"}`}>
            <div className={`p-3 rounded-2xl border-2 transition-all ${lock ? "border-violet-300 bg-violet-50" : "border-slate-200"}`}>
              {lock ? <Lock className="w-5 h-5"/> : <Unlock className="w-5 h-5"/>}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{lock?"Locked":"Free"}</span>
          </button>

          <div className="flex-1 space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              {isEn?"Height":"Yükseklik"} ({unit})
            </label>
            <input type="number" value={th} onChange={e => onHChange(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none font-mono text-2xl font-black text-slate-800 transition-all text-center"/>
          </div>
        </div>

        {/* Sosyal medya preset'leri */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            {isEn?"Quick Presets":"Hızlı Ön Ayarlar"}
          </p>
          <div className="flex flex-wrap gap-2">
            {SOCIAL_PRESETS.map(p => (
              <button key={p.name} onClick={() => applyPreset(p.w, p.h)}
                className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-500 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition-all whitespace-nowrap">
                {p.name}
                <span className="ml-1.5 text-slate-300 font-normal">{p.w}×{p.h}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="rounded-2xl mb-4">
            <AlertCircle className="h-4 w-4"/><AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={reset} className="rounded-full">
            <RefreshCw className="w-4 h-4 mr-2"/>{isEn?"Change file":"Dosya değiştir"}
          </Button>
          <Button onClick={process} className="rounded-full px-10 font-bold flex-1 h-12">
            <Maximize2 className="w-4 h-4 mr-2"/>{isEn?"Resize Image":"Boyutlandır"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. CROP IMAGE
// Sürükle-bırak kırpma kutusu + aspect-ratio preset'leri
// ═══════════════════════════════════════════════════════════════════════════

export function CropImageTool() {
  const { t, isEn, file, setFile, status, setStatus, pct, label, setLabel, error, result, startAnim, finish, fail, reset } = useImageTool();
  const [imgEl,      setImgEl     ] = useState<HTMLImageElement|null>(null);
  const [thumbUrl,   setThumbUrl  ] = useState<string|null>(null);
  const [crop, setCrop] = useState({ x:10, y:10, w:80, h:80 }); // %

  const dragRef = useRef<{
    type:"move"|"ne"|"nw"|"se"|"sw";
    mx0:number; my0:number;
    x0:number; y0:number; w0:number; h0:number;
  }|null>(null);
  const boxRef  = useRef<HTMLDivElement>(null);

  useEffect(() => () => { if (thumbUrl) URL.revokeObjectURL(thumbUrl); }, [thumbUrl]);

  const onFileSelect = async (f: File) => {
    setFile(f);
    try {
      const img = await loadImageSafe(f);
      setImgEl(img);
      setThumbUrl(URL.createObjectURL(f));
      setCrop({ x:10, y:10, w:80, h:80 });
    } catch (e: any) { fail(e.message); }
  };

  const startDrag = (e: React.MouseEvent, type: "move"|"nw"|"ne"|"sw"|"se") => {
    e.preventDefault(); e.stopPropagation();
    dragRef.current = { type, mx0:e.clientX, my0:e.clientY, x0:crop.x, y0:crop.y, w0:crop.w, h0:crop.h };
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const d = dragRef.current; if (!d || !boxRef.current) return;
      const rect = boxRef.current.getBoundingClientRect();
      const dx = ((e.clientX - d.mx0) / rect.width)  * 100;
      const dy = ((e.clientY - d.my0) / rect.height) * 100;
      setCrop(prev => {
        let { x, y, w, h } = { x:d.x0, y:d.y0, w:d.w0, h:d.h0 };
        const MIN = 5;
        switch (d.type) {
          case "move": x = Math.max(0,Math.min(100-w,x+dx)); y = Math.max(0,Math.min(100-h,y+dy)); break;
          case "se":   w = Math.max(MIN,Math.min(100-x,w+dx)); h = Math.max(MIN,Math.min(100-y,h+dy)); break;
          case "sw":   { const nw=Math.max(MIN,w-dx); x=Math.min(x+w-MIN,x+dx); w=nw; h=Math.max(MIN,Math.min(100-y,h+dy)); break; }
          case "ne":   w = Math.max(MIN,Math.min(100-x,w+dx)); { const nh=Math.max(MIN,h-dy); y=Math.min(y+h-MIN,y+dy); h=nh; break; }
          case "nw":   { const nw2=Math.max(MIN,w-dx); x=Math.min(x+w-MIN,x+dx); w=nw2; const nh2=Math.max(MIN,h-dy); y=Math.min(y+h-MIN,y+dy); h=nh2; break; }
        }
        return { x:Math.max(0,x), y:Math.max(0,y), w:Math.max(MIN,Math.min(100-x,w)), h:Math.max(MIN,Math.min(100-y,h)) };
      });
    };
    const up = () => { dragRef.current = null; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup",   up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);

  const ASPECT_PRESETS = [
    { label:"Free",  r:null    }, { label:"1:1",  r:1      },
    { label:"16:9",  r:16/9   }, { label:"4:3",  r:4/3    },
    { label:"3:2",   r:3/2    }, { label:"9:16", r:9/16   },
  ];

  const applyAspect = (r: number | null) => {
    if (r === null) { setCrop({ x:10, y:10, w:80, h:80 }); return; }
    const w = 80, h = Math.min(80, Math.round(w / r));
    setCrop({ x:10, y:10, w, h });
  };

  const applyCrop = async () => {
    if (!imgEl || !file) return;
    setStatus("processing");
    setLabel(isEn ? "Cropping image…" : "Görüntü kırpılıyor…");
    startAnim(1500);
    try {
      const sx = Math.round(imgEl.naturalWidth  * crop.x / 100);
      const sy = Math.round(imgEl.naturalHeight * crop.y / 100);
      const sw = Math.max(1, Math.round(imgEl.naturalWidth  * crop.w / 100));
      const sh = Math.max(1, Math.round(imgEl.naturalHeight * crop.h / 100));
      const cv = document.createElement("canvas");
      cv.width = sw; cv.height = sh;
      const ctx = cv.getContext("2d")!;
      ctx.drawImage(imgEl, sx, sy, sw, sh, 0, 0, sw, sh);
      const mime = file.type || "image/png";
      finish(await cvToBlob(cv, mime, 0.94));
      trackEvent("ImageCropped", { cropW:sw, cropH:sh });
    } catch (e: any) { fail(e.message); }
  };

  if (status === "processing") return <div className="w-full max-w-4xl mx-auto"><ProcessingCard pct={pct} label={label} isEn={isEn}/></div>;
  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={file!.name} origSize={file!.size} isEn={isEn} onReset={reset}/>
    </div>
  );
  if (!thumbUrl) return (
    <div className="w-full max-w-4xl mx-auto">
      <DropZone onFiles={f=>onFileSelect(f[0])} isEn={isEn} error={null}
        hint={isEn?"Drag the selection box to define crop area":"Seçim kutusunu sürükleyerek kırpma alanını belirleyin"}/>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      <Card className="p-7 rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-orange-50 rounded-2xl"><Crop className="w-5 h-5 text-orange-600"/></div>
          <div>
            <h3 className="text-base font-bold text-slate-800">{isEn?"Drag to crop":"Sürükleyerek kırp"}</h3>
            {imgEl && <p className="text-xs text-slate-400 mt-0.5">{imgEl.naturalWidth} × {imgEl.naturalHeight} px</p>}
          </div>
        </div>

        {/* Aspect ratio preset'leri */}
        <div className="flex gap-2 flex-wrap mb-5">
          {ASPECT_PRESETS.map(({label:lbl, r}) => (
            <button key={lbl} onClick={() => applyAspect(r)}
              className="px-4 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-500 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-all">
              {lbl}
            </button>
          ))}
        </div>

        {/* Önizleme + kırpma kutusu */}
        <div ref={boxRef}
          className="relative rounded-2xl overflow-hidden bg-slate-900 select-none"
          style={{ maxHeight: 440, cursor: "default" }}>
          <img src={thumbUrl} alt="preview"
            className="w-full h-auto object-contain max-h-[440px]" draggable={false}/>

          {/* Karartma: sadece dışarısı */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <mask id="crop-mask">
                  <rect width="100%" height="100%" fill="white"/>
                  <rect x={`${crop.x}%`} y={`${crop.y}%`} width={`${crop.w}%`} height={`${crop.h}%`} fill="black"/>
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="rgba(0,0,0,0.5)" mask="url(#crop-mask)"/>
            </svg>
          </div>

          {/* Kırpma kutusu kenarlığı + tutamaçlar */}
          <div className="absolute border-2 border-white"
            style={{
              left:`${crop.x}%`, top:`${crop.y}%`,
              width:`${crop.w}%`, height:`${crop.h}%`,
              cursor:"move",
            }}
            onMouseDown={e => startDrag(e, "move")}
          >
            {/* Izgara çizgileri */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px)",
                backgroundSize: "33.33% 33.33%",
              }}/>

            {/* Köşe tutamaçları */}
            {([["nw","cursor-nw-resize",{top:-5,left:-5}],["ne","cursor-ne-resize",{top:-5,right:-5}],["sw","cursor-sw-resize",{bottom:-5,left:-5}],["se","cursor-se-resize",{bottom:-5,right:-5}]] as const).map(([h,cur,st]) => (
              <div key={h} className={`absolute w-3.5 h-3.5 bg-white rounded-full shadow-lg border-2 border-orange-500 ${cur}`}
                style={st as React.CSSProperties}
                onMouseDown={e => { e.stopPropagation(); startDrag(e, h as any); }}/>
            ))}

            {/* Piksel bilgisi */}
            {imgEl && (
              <div className="absolute -bottom-7 left-0 text-white text-[11px] font-mono bg-black/70 px-2 py-0.5 rounded whitespace-nowrap pointer-events-none">
                {Math.round(imgEl.naturalWidth*crop.w/100)} × {Math.round(imgEl.naturalHeight*crop.h/100)} px
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" onClick={reset} className="rounded-full">
            <RefreshCw className="w-4 h-4 mr-2"/>{isEn?"Change file":"Dosya değiştir"}
          </Button>
          <Button onClick={applyCrop} className="rounded-full px-10 font-bold flex-1 h-12">
            <Crop className="w-4 h-4 mr-2"/>{isEn?"Crop Image":"Kırp"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. CONVERT FORMAT  (JPG ↔ PNG ↔ WebP ↔ BMP)
// Alpha-aware dönüşüm, kalite kaydırıcı
// ═══════════════════════════════════════════════════════════════════════════

const FMT = [
  { mime:"image/jpeg", ext:"jpg",  label:"JPG",  icon:"🟡", desc:"Best for photos, no transparency" },
  { mime:"image/png",  ext:"png",  label:"PNG",  icon:"🔵", desc:"Lossless, transparency preserved"  },
  { mime:"image/webp", ext:"webp", label:"WebP", icon:"🟢", desc:"Modern, small size, alpha support" },
  { mime:"image/bmp",  ext:"bmp",  label:"BMP",  icon:"🔴", desc:"Uncompressed bitmap"               },
];

export function ConvertFormatTool() {
  const { t, isEn, file, setFile, status, setStatus, pct, label, setLabel, error, result, startAnim, finish, fail, reset } = useImageTool();
  const [targetMime, setTargetMime] = useState("image/png");
  const [quality,    setQuality   ] = useState(92);

  const process = async (f: File) => {
    setFile(f);
    const fmt = FMT.find(x => x.mime === targetMime)!;
    setStatus("processing");
    setLabel(isEn ? `Converting to ${fmt.label}…` : `${fmt.label}'e dönüştürülüyor…`);
    startAnim(2500);
    try {
      const img = await loadImageSafe(f);
      const [sw, sh] = safeScale(img.naturalWidth, img.naturalHeight);
      const cv  = imgToCanvas(img, sw, sh, targetMime);
      finish(await cvToBlob(cv, targetMime, quality / 100));
      trackEvent("FormatConverted", { from:f.type, to:targetMime });
    } catch (e: any) { fail(e.message); }
  };

  if (status === "processing") return <div className="w-full max-w-4xl mx-auto"><ProcessingCard pct={pct} label={label} isEn={isEn}/></div>;
  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={swapExt(file!.name, FMT.find(x=>x.mime===targetMime)!.ext)}
        origSize={file!.size} isEn={isEn} onReset={reset}/>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-50 rounded-2xl"><Layers className="w-5 h-5 text-emerald-600"/></div>
          <h3 className="text-base font-bold text-slate-800">{isEn?"Target Format":"Hedef Format"}</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {FMT.map(f => (
            <button key={f.mime} onClick={() => setTargetMime(f.mime)}
              className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
                targetMime === f.mime
                  ? "border-primary bg-primary/5 scale-105 shadow-sm"
                  : "border-slate-100 hover:border-primary/30 hover:bg-slate-50"
              }`}>
              <span className="text-3xl">{f.icon}</span>
              <span className={`font-black text-base ${targetMime===f.mime?"text-primary":"text-slate-600"}`}>.{f.ext}</span>
              <span className="text-[10px] text-slate-400 text-center leading-tight">{isEn?f.desc:f.desc}</span>
            </button>
          ))}
        </div>

        {/* Kalite kaydırıcı (sadece JPEG/WebP için) */}
        {(targetMime === "image/jpeg" || targetMime === "image/webp") && (
          <div className="p-4 bg-slate-50 rounded-2xl mb-4">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-slate-600">{isEn?"Output Quality":"Çıktı Kalitesi"}</label>
              <span className="text-sm font-black text-primary">{quality}%</span>
            </div>
            <input type="range" min={10} max={100} value={quality}
              onChange={e => setQuality(Number(e.target.value))} className="w-full accent-primary"/>
          </div>
        )}

        {/* Alpha uyarısı */}
        {targetMime === "image/jpeg" && (
          <div className="p-3 bg-amber-50 rounded-xl text-amber-700 text-xs font-medium">
            ⚠️ {isEn ? "Transparency will be composited on white background" : "Şeffaflık beyaz arka plan üzerine aktarılacak"}
          </div>
        )}
        {(targetMime === "image/png" || targetMime === "image/webp") && (
          <div className="p-3 bg-blue-50 rounded-xl text-blue-700 text-xs font-medium">
            ✅ {isEn ? "Transparency (alpha channel) will be preserved" : "Şeffaflık (alpha kanalı) korunacak"}
          </div>
        )}
      </Card>

      <DropZone onFiles={f=>process(f[0])} isEn={isEn} error={error}
        hint={isEn?"Drop any image to convert":"Dönüştürmek için görüntü bırakın"}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// §  Tek-adım dönüşüm yardımcı bileşeni (5, 6, 7)
// ═══════════════════════════════════════════════════════════════════════════

function QuickConvertTool({
  fromAccept, toMime, toExt, toolName, hint,
}: { fromAccept:string; toMime:string; toExt:string; toolName:string; hint?:string }) {
  const { t, isEn, file, setFile, status, setStatus, pct, label, setLabel, error, result, startAnim, finish, fail, reset } = useImageTool();

  const process = async (f: File) => {
    setFile(f);
    setStatus("processing");
    setLabel(isEn ? `Converting to ${toExt.toUpperCase()}…` : `${toExt.toUpperCase()}'ye dönüştürülüyor…`);
    startAnim(2000);
    try {
      const img = await loadImageSafe(f);
      const [sw, sh] = safeScale(img.naturalWidth, img.naturalHeight);
      const cv  = imgToCanvas(img, sw, sh, toMime);
      const b   = await cvToBlob(cv, toMime, 0.93);
      finish(b);
      trackEvent(toolName.replace(/\s/g,"") + "Done", { size: f.size });
    } catch (e: any) { fail(e.message); }
  };

  if (status === "processing") return <div className="w-full max-w-4xl mx-auto"><ProcessingCard pct={pct} label={label} isEn={isEn}/></div>;
  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={swapExt(file!.name, toExt)} origSize={file!.size} isEn={isEn} onReset={reset}/>
    </div>
  );
  return (
    <div className="w-full max-w-4xl mx-auto">
      <DropZone onFiles={f=>process(f[0])} accept={fromAccept} isEn={isEn} error={error} hint={hint}/>
    </div>
  );
}

// 5. WebP → JPG
export function WebPToJpgTool() {
  return <QuickConvertTool fromAccept=".webp,image/webp" toMime="image/jpeg" toExt="jpg"
    toolName="WebP to JPG" hint="Drop a .webp file — transparency fills white"/>;
}

// 6. WebP → PNG
export function WebPToPngTool() {
  return <QuickConvertTool fromAccept=".webp,image/webp" toMime="image/png" toExt="png"
    toolName="WebP to PNG" hint="Transparency (alpha) is fully preserved"/>;
}

// 7. Image → WebP
export function ImageToWebpTool() {
  return <QuickConvertTool fromAccept="image/jpeg,image/png,image/gif,image/bmp,.jpg,.jpeg,.png,.gif,.bmp"
    toMime="image/webp" toExt="webp" toolName="Image to WebP"
    hint="Smaller files than JPG/PNG, supports transparency"/>;
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. HEIC → JPG
// heic2any@0.0.4 CDN lazy-load
// ═══════════════════════════════════════════════════════════════════════════

export function HeicToJpgTool() {
  const { t, isEn, file, setFile, status, setStatus, pct, label, setLabel, error, result, startAnim, finish, fail, reset } = useImageTool();

  const process = async (f: File) => {
    setFile(f);
    setStatus("processing");
    setLabel(isEn ? "Loading HEIC decoder…" : "HEIC dekoder yükleniyor…");
    startAnim(9000); // HEIC dönüşümü yavaş olabilir

    try {
      // lazy-load heic2any from CDN (bir kere yüklenir)
      if (!(window as any).heic2any) {
        await new Promise<void>((resolve, reject) => {
          const s   = document.createElement("script");
          s.src     = "https://cdnjs.cloudflare.com/ajax/libs/heic2any/0.0.4/heic2any.min.js";
          s.onload  = () => resolve();
          s.onerror = () => reject(new Error("heic2any CDN yüklenemedi — internet bağlantısını kontrol edin"));
          document.head.appendChild(s);
        });
      }

      setLabel(isEn ? "Decoding HEIC…" : "HEIC kodu çözülüyor…");
      const h2a = (window as any).heic2any;
      let resultBlob: Blob = await h2a({ blob: f, toType: "image/jpeg", quality: 0.92 });
      // heic2any bazen Blob[] döndürür (çoklu sayfa)
      if (Array.isArray(resultBlob)) resultBlob = resultBlob[0];
      if (!resultBlob || resultBlob.size === 0)
        throw new Error(isEn ? "Conversion produced empty file — is this a valid HEIC?" : "Geçerli bir HEIC dosyası mı? Çıktı boş.");

      finish(resultBlob);
      trackEvent("HeicConverted", { size: f.size });
    } catch (e: any) { fail(e.message); }
  };

  if (status === "processing") return <div className="w-full max-w-4xl mx-auto"><ProcessingCard pct={pct} label={label} isEn={isEn}/></div>;
  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={swapExt(file!.name, "jpg")} origSize={file!.size} isEn={isEn} onReset={reset}/>
    </div>
  );
  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-700 text-sm">
        <span className="text-xl">📱</span>
        <div>
          <p className="font-bold mb-0.5">{isEn?"Apple HEIC Format":"Apple HEIC Formatı"}</p>
          <p className="text-xs font-medium opacity-80">
            {isEn
              ? "HEIC is the default photo format on iPhone/iPad. Conversion runs entirely in your browser — nothing is uploaded."
              : "HEIC, iPhone/iPad'in varsayılan fotoğraf formatıdır. Dönüşüm tarayıcınızda gerçekleşir — yükleme yapılmaz."}
          </p>
        </div>
      </div>
      <DropZone onFiles={f=>process(f[0])} accept=".heic,.heif,image/heic,image/heif"
        isEn={isEn} error={error}
        hint={isEn?"iPhone/iPad photos (.heic, .heif)":"iPhone/iPad fotoğrafları (.heic, .heif)"}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. REMOVE BACKGROUND
// Tamamen tarayıcı tabanlı, @imgly/background-removal ile AI arka plan silme
// ═══════════════════════════════════════════════════════════════════════════

export function RemoveBackgroundTool() {
  const { t, isEn, file, setFile, status, setStatus, pct, label, setLabel, error, result, startAnim, finish, fail, reset } = useImageTool();

  const processWithAi = async (f: File) => {
    setFile(f);
    setStatus("processing");
    setLabel(isEn ? "Preparing AI background remover…" : "Yapay zeka arka plan silici hazırlanıyor…");
    startAnim(12_000);

    try {
      const config: ImglyBgConfig = {
        output: {
          format: "image/png",
          quality: 0.9,
          type: "foreground",
        },
        progress: (_key: string, current: number, total: number) => {
          if (!total) return;
          const p = Math.min(100, Math.round((current / total) * 100));
          if (p < 100) {
            setLabel(
              isEn
                ? `Downloading AI model… ${p}%`
                : `Yapay zeka modeli indiriliyor… ${p}%`,
            );
          } else {
            setLabel(isEn ? "Removing background…" : "Arka plan kaldırılıyor…");
          }
        },
      } as ImglyBgConfig;

      const blob = await removeBackground(f, config);
      if (!blob || blob.size === 0) {
        throw new Error(isEn ? "Empty output" : "Boş çıktı");
      }

      finish(blob);
      trackEvent("BgRemoved", { method: "imgly" });
    } catch (e: any) {
      const msg = e?.message ?? (isEn ? "Background removal failed." : "Arka plan silme başarısız oldu.");
      fail(msg);
    }
  };

  const handleReset = () => {
    reset();
  };

  if (status === "processing") {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <ProcessingCard pct={pct} label={label} isEn={isEn} />
      </div>
    );
  }

  if (status === "done" && result) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <DoneCard
          blob={result}
          filename={swapExt(file!.name, "png")}
          origSize={file!.size}
          isEn={isEn}
          onReset={handleReset}
        >
          <div
            className="mb-4 p-3 bg-blue-50 rounded-xl text-blue-700 text-xs font-medium"
            data-testid="text-bg-removed-info"
          >
            ✅ {isEn ? "Saved as PNG — transparency preserved" : "PNG olarak kaydedildi — şeffaflık korundu"}
          </div>
        </DoneCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <DropZone
        onFiles={f => processWithAi(f[0])}
        accept="image/jpeg,image/png,image/webp,.jpg,.png,.webp"
        isEn={isEn}
        error={error}
        hint={
          isEn
            ? "Drop an image — AI will remove the background directly in your browser"
            : "Bir görsel bırakın — yapay zeka arka planı tamamen tarayıcıda silecek"
        }
      />

      {status === "error" && error && (
        <div className="w-full max-w-4xl mx-auto">
          <Card className="p-6 rounded-3xl border-2 border-red-100 bg-red-50/50 shadow-sm text-center">
            <p className="text-sm text-red-600 font-semibold mb-3">{error}</p>
            <Button
              variant="outline"
              onClick={handleReset}
              className="rounded-full px-8"
              data-testid="button-reset-error"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {isEn ? "Try again" : "Tekrar dene"}
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. ADD TEXT TO IMAGE
// Font, boyut, renk, konum seçimi + gerçek zamanlı canvas önizleme
// ═══════════════════════════════════════════════════════════════════════════

export function AddTextToImageTool() {
  const { t, isEn, file, setFile, status, setStatus, pct, label, setLabel, error, result, startAnim, finish, fail, reset } = useImageTool();
  const [imgEl,      setImgEl     ] = useState<HTMLImageElement|null>(null);
  const [thumbUrl,   setThumbUrl  ] = useState<string|null>(null);
  const [text,       setText      ] = useState(isEn?"Your Text Here":"Metniniz Burada");
  const [fontSize,   setFontSize  ] = useState(48);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor,  setTextColor ] = useState("#ffffff");
  const [bold,       setBold      ] = useState(true);
  const [italic,     setItalic    ] = useState(false);
  const [shadow,     setShadow    ] = useState(true);
  const [bgPad,      setBgPad     ] = useState(true);
  const [bgColor,    setBgColor   ] = useState("#000000");
  const [bgOpacity,  setBgOpacity ] = useState(50); // %
  const [posX,       setPosX      ] = useState(50);
  const [posY,       setPosY      ] = useState(85);
  const [align,      setAlign     ] = useState<CanvasTextAlign>("center");
  const previewCv = useRef<HTMLCanvasElement>(null);

  useEffect(() => () => { if (thumbUrl) URL.revokeObjectURL(thumbUrl); }, [thumbUrl]);

  const onFileSelect = async (f: File) => {
    setFile(f);
    try {
      const img = await loadImageSafe(f);
      setImgEl(img);
      setThumbUrl(URL.createObjectURL(f));
    } catch (e: any) { fail(e.message); }
  };

  /** Ortak metin çizim mantığı (önizleme + final için) */
  const drawText = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, scale=1) => {
    if (!text.trim()) return;
    const fs     = fontSize * scale;
    const weight = bold   ? "bold"   : "normal";
    const stl    = italic ? "italic" : "normal";
    ctx.font      = `${stl} ${weight} ${fs}px ${fontFamily}`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    const x = w * posX / 100;
    const y = h * posY / 100;

    // Yarı-saydam arka plan
    if (bgPad) {
      const m   = ctx.measureText(text);
      const pad = fs * 0.35;
      const bw  = m.width + pad * 2;
      const bh  = fs + pad * 2;
      const bx  = align==="center" ? x-bw/2 : align==="right" ? x-bw : x;
      const [r,g,b2] = [
        parseInt(bgColor.slice(1,3),16),
        parseInt(bgColor.slice(3,5),16),
        parseInt(bgColor.slice(5,7),16),
      ];
      ctx.fillStyle = `rgba(${r},${g},${b2},${bgOpacity/100})`;
      ctx.beginPath();
      (ctx as any).roundRect?.(bx, y-bh/2, bw, bh, fs*0.15) ??
        ctx.rect(bx, y-bh/2, bw, bh);
      ctx.fill();
    }

    // Gölge
    if (shadow) {
      ctx.shadowColor   = "rgba(0,0,0,0.6)";
      ctx.shadowBlur    = fs * 0.15;
      ctx.shadowOffsetX = fs * 0.04;
      ctx.shadowOffsetY = fs * 0.04;
    }
    ctx.fillStyle = textColor;
    ctx.fillText(text, x, y);
    ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
  }, [text, fontSize, fontFamily, textColor, bold, italic, shadow, bgPad, bgColor, bgOpacity, posX, posY, align]);

  // Canlı önizleme
  useEffect(() => {
    if (!imgEl || !previewCv.current) return;
    const cv  = previewCv.current;
    const MAX = 580;
    const sc  = Math.min(1, MAX/imgEl.naturalWidth, MAX/imgEl.naturalHeight);
    cv.width  = Math.round(imgEl.naturalWidth*sc);
    cv.height = Math.round(imgEl.naturalHeight*sc);
    const ctx = cv.getContext("2d")!;
    ctx.drawImage(imgEl, 0, 0, cv.width, cv.height);
    drawText(ctx, cv.width, cv.height, sc);
  }, [imgEl, drawText]);

  const applyAndSave = async () => {
    if (!imgEl || !file) return;
    setStatus("processing");
    setLabel(isEn?"Rendering text overlay…":"Metin katmanı işleniyor…");
    startAnim(1800);
    try {
      const cv  = document.createElement("canvas");
      cv.width  = imgEl.naturalWidth; cv.height = imgEl.naturalHeight;
      const ctx = cv.getContext("2d")!;
      ctx.drawImage(imgEl, 0, 0);
      drawText(ctx, cv.width, cv.height, 1);
      const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
      finish(await cvToBlob(cv, mime, 0.94));
      trackEvent("TextAddedToImage", { font:fontFamily, size:fontSize });
    } catch (e: any) { fail(e.message); }
  };

  if (status === "processing") return <div className="w-full max-w-4xl mx-auto"><ProcessingCard pct={pct} label={label} isEn={isEn}/></div>;
  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={file!.name} origSize={file!.size} isEn={isEn} onReset={reset}/>
    </div>
  );

  if (!imgEl) return (
    <div className="w-full max-w-4xl mx-auto">
      <DropZone onFiles={f=>onFileSelect(f[0])} isEn={isEn} error={error}
        hint={isEn?"Upload an image to add text overlay":"Metin eklemek için görüntü yükleyin"}/>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Ayar Paneli (2/5) ── */}
        <Card className="lg:col-span-2 p-6 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-5 h-fit">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-xl"><Type className="w-5 h-5 text-indigo-600"/></div>
            <h3 className="text-base font-bold text-slate-800">{isEn?"Text Settings":"Metin Ayarları"}</h3>
          </div>

          {/* Metin */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {isEn?"Text":"Metin"}
            </label>
            <textarea value={text} onChange={e=>setText(e.target.value)} rows={2}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none font-medium text-slate-800 text-sm resize-none transition-all"/>
          </div>

          {/* Font */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Font</label>
            <div className="grid grid-cols-2 gap-1.5">
              {["Arial","Georgia","Impact","Courier New","Verdana","Trebuchet MS"].map(f => (
                <button key={f} onClick={()=>setFontFamily(f)}
                  className={`py-2 px-3 rounded-xl text-xs border transition-all text-left ${
                    fontFamily===f ? "border-indigo-400 bg-indigo-50 text-indigo-700 font-bold" : "border-slate-200 text-slate-500 hover:border-indigo-200"
                  }`} style={{ fontFamily:f }}>
                  {f.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Font boyutu + stil */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                {isEn?"Size":"Boyut"}
              </label>
              <span className="text-sm font-black text-indigo-600">{fontSize}px</span>
            </div>
            <input type="range" min={8} max={250} value={fontSize}
              onChange={e=>setFontSize(Number(e.target.value))} className="w-full accent-indigo-600 mb-3"/>
            <div className="flex gap-2">
              <button onClick={()=>setBold(b=>!b)}
                className={`flex-1 py-2 rounded-xl text-sm font-black border transition-all ${bold?"bg-indigo-600 text-white border-indigo-600":"border-slate-200 text-slate-400"}`}>
                B
              </button>
              <button onClick={()=>setItalic(i=>!i)}
                className={`flex-1 py-2 rounded-xl text-sm italic border transition-all ${italic?"bg-indigo-600 text-white border-indigo-600":"border-slate-200 text-slate-400"}`}>
                I
              </button>
              <button onClick={()=>setShadow(s=>!s)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${shadow?"bg-indigo-600 text-white border-indigo-600":"border-slate-200 text-slate-400"}`}>
                Shadow
              </button>
            </div>
          </div>

          {/* Renkler */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                {isEn?"Text Color":"Metin Rengi"}
              </label>
              <input type="color" value={textColor} onChange={e=>setTextColor(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-200 cursor-pointer p-1"/>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bg</label>
                <input type="checkbox" checked={bgPad} onChange={e=>setBgPad(e.target.checked)} className="accent-indigo-600"/>
              </div>
              {bgPad && (
                <div className="space-y-1">
                  <input type="color" value={bgColor} onChange={e=>setBgColor(e.target.value)}
                    className="w-full h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5"/>
                  <input type="range" min={0} max={100} value={bgOpacity}
                    onChange={e=>setBgOpacity(Number(e.target.value))} className="w-full accent-indigo-600"/>
                </div>
              )}
            </div>
          </div>

          {/* Konum grid */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {isEn?"Position":"Konum"}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {([
                {px:10,py:12,al:"left"   as CanvasTextAlign,label:"↖"},
                {px:50,py:12,al:"center" as CanvasTextAlign,label:"↑"},
                {px:90,py:12,al:"right"  as CanvasTextAlign,label:"↗"},
                {px:10,py:50,al:"left"   as CanvasTextAlign,label:"←"},
                {px:50,py:50,al:"center" as CanvasTextAlign,label:"✛"},
                {px:90,py:50,al:"right"  as CanvasTextAlign,label:"→"},
                {px:10,py:88,al:"left"   as CanvasTextAlign,label:"↙"},
                {px:50,py:88,al:"center" as CanvasTextAlign,label:"↓"},
                {px:90,py:88,al:"right"  as CanvasTextAlign,label:"↘"},
              ] as const).map(({px,py,al,label:lbl}) => (
                <button key={lbl} onClick={()=>{setPosX(px);setPosY(py);setAlign(al);}}
                  className={`py-2 rounded-xl text-sm border transition-all ${
                    posX===px&&posY===py ? "border-indigo-400 bg-indigo-50 text-indigo-700 font-bold" : "border-slate-100 text-slate-400 hover:border-indigo-200"
                  }`}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={reset} size="sm" className="rounded-full flex-1">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5"/>{isEn?"New":"Yeni"}
            </Button>
            <Button onClick={applyAndSave} size="sm" className="rounded-full flex-1 font-bold">
              <Download className="w-3.5 h-3.5 mr-1.5"/>{isEn?"Save":"Kaydet"}
            </Button>
          </div>
        </Card>

        {/* ── Canlı Önizleme (3/5) ── */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              {isEn?"Live Preview":"Canlı Önizleme"}
            </p>
            <span className="text-xs text-slate-300 font-medium">
              {imgEl ? `${imgEl.naturalWidth}×${imgEl.naturalHeight}px` : ""}
            </span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-[repeating-conic-gradient(#f8fafc_0%_25%,#fff_0%_50%)] bg-[length:24px_24px]">
            <canvas ref={previewCv} className="w-full h-auto"/>
          </div>
          <p className="text-xs text-slate-400 text-center">
            {isEn?"Preview is scaled — final output is full resolution":"Önizleme ölçekli — final çıktı tam çözünürlükte"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT — hazır kullanım listesi
// ═══════════════════════════════════════════════════════════════════════════


// ════════════════════════════════════════════════════════════════════════════
// WatermarkRemoverTool
// ════════════════════════════════════════════════════════════════════════════
export function WatermarkRemoverTool() {
  const { isEn, file, setFile, status, error, result, startAnim, finish, fail, reset, label, setLabel, pct } = useImageTool();

  const process = async (f: File) => {
    setFile(f);
    setLabel(isEn ? "Removing watermark…" : "Filigran kaldırılıyor…");
    startAnim(5000);
    try {
      const fd = new FormData();
      fd.append("image", f);
      const res = await fetch("/api/remove-watermark", { method: "POST", body: fd });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || "Failed"); }
      const blob = await res.blob();
      if (!blob || blob.size === 0) throw new Error("Empty output");
      finish(blob);
    } catch (e: any) {
      fail(e?.message ?? (isEn ? "Watermark removal failed." : "Filigran silme başarısız."));
    }
  };

  if (status === "processing") return <div className="w-full max-w-4xl mx-auto"><ProcessingCard pct={pct} label={label} isEn={isEn} /></div>;
  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={swapExt(file!.name, "png")} origSize={file!.size} isEn={isEn} onReset={reset}>
        <div className="mb-4 p-3 bg-green-50 rounded-xl text-green-700 text-xs font-medium">
          ✅ {isEn ? "Watermark removed — saved as PNG" : "Filigran kaldırıldı — PNG olarak kaydedildi"}
        </div>
      </DoneCard>
    </div>
  );
  return (
    <div className="w-full max-w-4xl mx-auto">
      {error && <div className="mb-4 p-3 bg-red-50 rounded-xl text-red-700 text-sm">{error}</div>}
      <DropZone onFile={process} accept="image/*" isEn={isEn} labelEn="Drop image here" labelTr="Görseli buraya bırakın" subEn="JPG, PNG, WebP — watermark will be detected and removed" subTr="JPG, PNG, WebP — filigran tespit edilip kaldırılır" />
    </div>
  );
}
export default CompressImageTool;

/*
 KULLANIM:
 ─────────
 import {
   CompressImageTool,   // Kalite kaydırıcı sıkıştırma
   ResizeImageTool,     // px/% yeniden boyutlandırma
   CropImageTool,       // Sürükle-bırak kırpma
   ConvertFormatTool,   // JPG/PNG/WebP/BMP dönüşümü
   WebPToJpgTool,       // WebP → JPG
   WebPToPngTool,       // WebP → PNG
   ImageToWebpTool,     // Herhangi → WebP
   HeicToJpgTool,       // HEIC → JPG (iPhone)
   RemoveBackgroundTool,// Arka plan kaldırma
   AddTextToImageTool,  // Görüntüye metin ekleme
 } from "@/components/ImageTools";
*/

