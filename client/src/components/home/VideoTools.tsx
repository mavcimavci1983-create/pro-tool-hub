/**
 * VideoTools.tsx — ProToolHub v1.0  "Video Suite"
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 7 Araç — FFmpeg.wasm v0.11.6 (client-side, sıfır backend):
 *  1.  VideoConverterTool  MP4/MKV/MOV/AVI/WebM/GIF arası dönüşüm
 *  2.  VideoToMp3Tool      Ses kanalını MP3 olarak ayıkla
 *  3.  VideoToGifTool      Kısa sahne → yüksek kaliteli palette GIF
 *  4.  CompressVideoTool   CRF tabanlı kalite korumalı sıkıştırma
 *  5.  MuteVideoTool       Ses kanalını kaldır (stream copy, hızlı)
 *  6.  TrimVideoTool       Başlangıç/bitiş noktası ayarlayarak kes
 *  7.  RotateVideoTool     90°/180° döndür, yatay/dikey çevir
 *
 * MİMARİ:
 *  • FFmpeg.wasm v0.11.6  — createFFmpeg() API, SharedArrayBuffer gerektirmez
 *  • Singleton FFmpeg instance — her araç yüklenmiş motoru paylaşır
 *  • Bellek yönetimi: her işlem sonrası ffmpeg.FS('unlink') ile temizlik
 *  • Büyük dosyalar: 500MB sınırı + Uint8Array chunked write
 *  • İlerleme: ffmpeg.setProgress() ile gerçek zamanlı %
 *  • useVideoTool() hook: tüm araçlarda paylaşılan state + FFmpeg yaşam döngüsü
 *  • Hata mesajları: hem TR hem EN, ffmpeg stderr'i kullanıcıya parse edilmiş
 *
 * KURULUM (Replit Shell):
 *  Paket kurmaya gerek yok — FFmpeg.wasm CDN'den lazy-load edilir.
 *  İsteğe bağlı hız artışı için:
 *    npm install @ffmpeg/ffmpeg@0.11.6 @ffmpeg/core@0.11.0
 *
 * KULLANIM:
 *  import { VideoConverterTool, VideoToMp3Tool } from "@/components/VideoTools";
 *  <VideoConverterTool />
 *
 * ÖNEMLI NOT — SharedArrayBuffer:
 *  FFmpeg.wasm v0.11.6 SAB gerektirmez. v0.12+ kullanıyorsanız Replit'te
 *  server/index.ts'e şu header'ları ekleyin:
 *    res.setHeader("Cross-Origin-Opener-Policy",   "same-origin");
 *    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, {
  useState, useRef, useEffect, useCallback, useMemo,
} from "react";
import {
  Upload, Download, RefreshCw, AlertCircle, CheckCircle2,
  Loader2, ShieldCheck, Clock, ArrowLeftRight, Scissors,
  Volume2, VolumeX, Zap, Film, Music, Repeat, RotateCw,
  ChevronRight, Play, Pause, FastForward, Youtube, Minimize2,
} from "lucide-react";
import { Button }   from "@/components/ui/button";
import { Card }     from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguageStore } from "@/lib/languageStore";
import { fetchApiJson } from "@/lib/apiGuard";
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
// § FFMPEG ENGINE — Singleton + Lazy-load
// ═══════════════════════════════════════════════════════════════════════════

/** FFmpeg.wasm CDN URLs (v0.11.6 — SAB gerektirmez, max uyumluluk) */
const FFMPEG_CDN = "https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js";
const FFMPEG_CORE_CDN = "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js";

/** Singleton FFmpeg instance (tüm araçlar paylaşır) */
let _ffmpegInstance: any = null;
let _ffmpegLoading: Promise<any> | null = null;

/**
 * FFmpeg.wasm'ı lazy-load eder ve singleton instance döner.
 * İlk çağrıda CDN'den yükler (~20MB), sonraki çağrılar anında döner.
 */
async function getFFmpeg(
  onProgress?: (ratio: number) => void
): Promise<any> {
  // Zaten yüklüyse hemen dön
  if (_ffmpegInstance?.isLoaded?.()) return _ffmpegInstance;

  // Başka bir yükleme devam ediyorsa onu bekle
  if (_ffmpegLoading) return _ffmpegLoading;

  _ffmpegLoading = (async () => {
    try {
      if (!(window as any).FFmpeg) {
        await new Promise<void>((resolve, reject) => {
          const existing = document.querySelector(`script[src="${FFMPEG_CDN}"]`);
          if (existing) { resolve(); return; }
          const s = document.createElement("script");
          s.src = FFMPEG_CDN;
          s.onload  = () => resolve();
          s.onerror = () => reject(new Error("Could not load the FFmpeg engine. Check your internet connection and try again."));
          document.head.appendChild(s);
        });
      }

      const { createFFmpeg } = (window as any).FFmpeg;
      const ff = createFFmpeg({
        corePath: FFMPEG_CORE_CDN,
        log: false,
      });

      if (onProgress) {
        ff.setProgress(({ ratio }: { ratio: number }) => {
          onProgress(Math.max(0, Math.min(ratio, 1)));
        });
      }

      await ff.load();
      _ffmpegInstance = ff;
      _ffmpegLoading  = null;
      return ff;
    } catch (err) {
      _ffmpegLoading = null;
      throw err;
    }
  })();

  return _ffmpegLoading;
}

/** FFmpeg sanal dosya sistemini temizle (bellek sızıntısı önleme) */
function ffmpegCleanup(ff: any, ...filenames: string[]) {
  for (const name of filenames) {
    try { ff.FS("unlink", name); } catch {}
  }
}

/** Dosya boyutunu okunabilir stringe çevir */
function fmtSize(b: number): string {
  if (b < 1024)    return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1073741824) return `${(b / 1048576).toFixed(2)} MB`;
  return `${(b / 1073741824).toFixed(2)} GB`;
}

/** Saniyeyi MM:SS formatına çevir */
function secToTime(s: number): string {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2,"0")}:${String(Math.floor(s%60)).padStart(2,"0")}`;
}

/** Dosya uzantısını al */
const getExt = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";

/** Dosya adındaki uzantıyı değiştir */
const swapExt = (name: string, ext: string) => name.replace(/\.[^.]+$/, "") + "." + ext;

/** Blob indir */
function saveBlobAs(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 15_000);
}

// ═══════════════════════════════════════════════════════════════════════════
// § SHARED STATE HOOK — useVideoTool
// ═══════════════════════════════════════════════════════════════════════════

type ToolStatus = "idle" | "loading_ffmpeg" | "processing" | "done" | "error";

interface VideoToolState {
  t: any; isEn: boolean;
  file: File | null; setFile: (f: File | null) => void;
  status: ToolStatus; setStatus: (s: ToolStatus) => void;
  pct: number; setPct: (p: number) => void;
  label: string; setLabel: (l: string) => void;
  error: string | null; setError: (e: string | null) => void;
  result: Blob | null; setResult: (b: Blob | null) => void;
  ffRef: React.MutableRefObject<any>;
  /** FFmpeg'i hazırla, işlem için gerekli instance'ı döner */
  prepareFFmpeg: () => Promise<any>;
  finish: (blob: Blob) => void;
  fail: (msg: string) => void;
  reset: () => void;
}

function useVideoTool(): VideoToolState {
  const { language } = useLanguageStore();
  const t    = translations[language] ?? {};
  const isEn = language === "en";

  const [file,   setFile  ] = useState<File | null>(null);
  const [status, setStatus] = useState<ToolStatus>("idle");
  const [pct,    setPct   ] = useState(0);
  const [label,  setLabel ] = useState("");
  const [error,  setError ] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const ffRef = useRef<any>(null);

  const prepareFFmpeg = useCallback(async (): Promise<any> => {
    setStatus("loading_ffmpeg");
    setLabel(isEn ? "Loading FFmpeg engine (~20 MB, once only)…" : "FFmpeg motoru yükleniyor (~20 MB, tek sefer)…");
    setPct(0);

    const ff = await getFFmpeg((ratio) => {
      // WASM yüklenirken ilerleme
      if (status === "loading_ffmpeg") setPct(Math.round(ratio * 40));
    });

    ffRef.current = ff;
    // İşlem başladıktan sonra gerçek FFmpeg progress
    ff.setProgress(({ ratio }: { ratio: number }) => {
      if (ratio >= 0) setPct(Math.min(40 + Math.round(ratio * 55), 95));
    });

    return ff;
  }, [isEn, status]);

  const finish = useCallback((blob: Blob) => {
    setPct(100);
    setResult(blob);
    setStatus("done");
  }, []);

  const fail = useCallback((msg: string) => {
    // Parse FFmpeg stderr → anlamlı mesaj
    let friendly = msg;
    if (msg.includes("No such file"))        friendly = isEn ? "File could not be read by FFmpeg." : "FFmpeg dosyayı okuyamadı.";
    if (msg.includes("Invalid data found"))  friendly = isEn ? "Invalid or corrupted video file." : "Bozuk veya geçersiz video dosyası.";
    if (msg.includes("Encoder not found"))   friendly = isEn ? "Codec not supported. Try MP4 output." : "Codec desteklenmiyor. MP4 çıktısını deneyin.";
    if (msg.includes("memory"))              friendly = isEn ? "Out of memory. Try a smaller file (<200 MB)." : "Bellek yetersiz. Daha küçük dosya deneyin (<200 MB).";
    if (msg.includes("CDN"))                 friendly = msg; // CDN hatası — orijinali göster
    setError(friendly);
    setStatus("error");
  }, [isEn]);

  const reset = useCallback(() => {
    setFile(null); setStatus("idle"); setPct(0);
    setLabel(""); setError(null); setResult(null);
    // FFmpeg FS'yi temizleme (instance korunur, sadece dosyalar silinir)
    try {
      const ff = ffRef.current;
      if (ff?.isLoaded?.()) {
        const files = ff.FS("readdir", "/");
        files.forEach((f: string) => {
          if (f !== "." && f !== ".." && !f.startsWith("tmp")) {
            try { ff.FS("unlink", f); } catch {}
          }
        });
      }
    } catch {}
  }, []);

  return { t, isEn, file, setFile, status, setStatus, pct, setPct, label, setLabel, error, setError, result, setResult, ffRef, prepareFFmpeg, finish, fail, reset };
}

// ═══════════════════════════════════════════════════════════════════════════
// § ORTAK UI BİLEŞENLERİ
// ═══════════════════════════════════════════════════════════════════════════

/** Sürükle-bırak yükleme alanı */
function DropZone({
  onFile, accept, isEn, error, hint, icon: Icon = Upload, maxMB = 500,
}: {
  onFile: (f: File) => void;
  accept: string; isEn: boolean;
  error?: string | null; hint?: string;
  icon?: React.ElementType;
  maxMB?: number;
}) {
  const [over, setOver] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const MAX_BYTES = maxMB * 1024 * 1024;

  const handleFiles = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    if (f.size > MAX_BYTES) {
      alert(isEn ? `Max file size is ${maxMB} MB` : `Maksimum dosya boyutu ${maxMB} MB`);
      return;
    }
    onFile(f);
  };

  return (
    <div className="w-full space-y-4">
      <div
        onClick={() => ref.current?.click()}
        onDragOver={e => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={e => { e.preventDefault(); setOver(false); handleFiles(e.dataTransfer.files); }}
        className={[
          "relative cursor-pointer rounded-3xl border-2 border-dashed",
          "p-16 flex flex-col items-center justify-center text-center",
          "transition-all duration-300 group",
          over
            ? "border-primary bg-primary/5 scale-[1.01] shadow-2xl shadow-primary/10"
            : error
              ? "border-rose-300 bg-rose-50/40"
              : "border-slate-200 bg-gradient-to-br from-slate-50 to-white hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/5 hover:bg-white",
        ].join(" ")}
      >
        <input
          ref={ref} type="file" accept={accept} className="hidden"
          onChange={e => { handleFiles(e.target.files); e.target.value = ""; }}
        />

        <div className={[
          "p-7 rounded-2xl shadow-sm border mb-7 transition-all duration-300",
          "group-hover:scale-110 group-hover:shadow-md",
          over ? "bg-primary/10 border-primary/30 scale-110"
               : error ? "bg-rose-50 border-rose-100"
                       : "bg-white border-slate-100",
        ].join(" ")}>
          <Icon className={`w-12 h-12 transition-colors ${over || !error ? "text-primary" : "text-rose-500"}`} />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
          {isEn ? "Drop your video here" : "Videoyu buraya bırakın"}
        </h3>
        <p className="text-slate-400 text-sm font-medium mb-1">
          {isEn ? "or click to browse" : "veya tıklayarak seçin"}
        </p>
        {hint && <p className="text-xs text-slate-300 mb-8">{hint}</p>}
        {!hint && <div className="mb-8"/>}
        <Button size="lg" variant={error ? "destructive" : "default"}
          className="rounded-full px-12 font-bold h-14 shadow-lg hover:scale-105 transition-transform">
          {isEn ? "Choose Video" : "Video Seç"}
        </Button>

        <p className="mt-4 text-xs text-slate-300 font-medium">
          {isEn ? `Max ${maxMB} MB` : `Maks. ${maxMB} MB`} · {accept.replace(/,/g, " ")}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-2xl border-rose-200">
          <AlertCircle className="h-4 w-4"/>
          <AlertTitle className="font-bold">Error</AlertTitle>
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

/** FFmpeg yükleme ve işleme kartı */
function ProcessingCard({
  pct, label, status, isEn,
}: { pct: number; label: string; status: ToolStatus; isEn: boolean }) {
  const isLoading = status === "loading_ffmpeg";

  return (
    <Card className="p-16 rounded-3xl border border-slate-100 bg-white shadow-xl flex flex-col items-center text-center">

      {/* Dairesel progress */}
      <div className="relative w-28 h-28 mb-10">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
          <circle cx="56" cy="56" r="48" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
          <circle cx="56" cy="56" r="48" fill="none"
            stroke={isLoading ? "#94a3b8" : "hsl(var(--primary))"}
            strokeWidth="8"
            strokeDasharray={`${2*Math.PI*48}`}
            strokeDashoffset={`${2*Math.PI*48*(1-pct/100)}`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isLoading
            ? <Loader2 className="w-8 h-8 text-slate-400 animate-spin"/>
            : <span className="font-black text-primary text-xl">{Math.round(pct)}%</span>}
        </div>
      </div>

      {/* FFmpeg yükleme adımı göstergesi */}
      {isLoading && (
        <div className="flex items-center gap-3 mb-4">
          {[
            { step:"1", label:"CDN", done: pct > 5  },
            { step:"2", label:"WASM", done: pct > 20 },
            { step:"3", label:"Ready", done: pct >= 40},
          ].map(({ step, label: sl, done }) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center transition-all ${
                done ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
              }`}>{done ? "✓" : step}</div>
              <span className={`text-xs font-bold ${done ? "text-primary" : "text-slate-300"}`}>{sl}</span>
              {step !== "3" && <ChevronRight className="w-3 h-3 text-slate-200"/>}
            </div>
          ))}
        </div>
      )}

      <h3 className="text-2xl font-bold text-slate-900 mb-1">
        {isLoading
          ? (isEn ? "Loading FFmpeg Engine…" : "FFmpeg Motoru Yükleniyor…")
          : (isEn ? "Processing Video…" : "Video İşleniyor…")}
      </h3>
      <p className="text-primary/70 font-semibold text-sm mb-2">{label}</p>
      <p className="text-slate-400 text-sm mb-10">
        {isLoading
          ? (isEn ? "This happens once — next time it's instant" : "Bu yalnızca ilk kez olur — sonraki seferde anında başlar")
          : (isEn ? "Running locally — your file never leaves your device" : "Yerel olarak çalışıyor — dosyanız cihazınızdan ayrılmaz")}
      </p>

      <div className="w-full max-w-sm mb-4">
        <Progress value={pct} className="h-2.5 rounded-full bg-slate-100"/>
      </div>

      {!isLoading && (
        <p className="text-xs text-slate-300 font-medium mb-8">
          {isEn ? "Large files may take several minutes" : "Büyük dosyalar birkaç dakika alabilir"}
        </p>
      )}

      <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-widest">
        <ShieldCheck className="w-4 h-4"/> 100% LOCAL · NO UPLOAD · NO SERVER
      </div>
    </Card>
  );
}

/** Tamamlandı / indirme kartı */
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
    <Card className="p-14 rounded-3xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
      <div className="bg-emerald-100 text-emerald-600 p-6 rounded-full mb-6 shadow-sm ring-8 ring-emerald-50/80">
        <CheckCircle2 className="w-12 h-12"/>
      </div>

      <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">
        {isEn ? "Done!" : "Hazır!"}
      </h3>
      <p className="text-slate-500 mb-4 font-medium text-sm truncate max-w-xs">{filename}</p>

      {origSize != null && (
        <div className="flex items-center gap-3 mb-6 text-sm">
          <span className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full font-mono">{fmtSize(origSize)}</span>
          <ArrowLeftRight className="w-4 h-4 text-slate-300 flex-shrink-0"/>
          <span className={`px-3 py-1.5 rounded-full font-mono font-bold ${reduction != null && reduction > 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
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
        onClick={() => { saveBlobAs(blob, filename); trackEvent("VideoDownloaded", { filename }); }}
        className="rounded-full px-20 font-bold h-16 shadow-xl bg-emerald-600 hover:bg-emerald-700 text-white text-lg mb-5 w-full max-w-xs border-none">
        <Download className="w-5 h-5 mr-3"/>
        {isEn ? "Download" : "İndir"}
      </Button>

      <Button variant="ghost" onClick={onReset}
        className="text-slate-400 hover:text-primary font-bold">
        <RefreshCw className="w-4 h-4 mr-2"/>
        {isEn ? "Process another video" : "Başka video işle"}
      </Button>

      <div className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 text-xs font-medium">
        <Clock className="w-3.5 h-3.5 text-rose-300"/>
        {isEn ? "File processed locally — never uploaded" : "Dosya yerel olarak işlendi — asla yüklenmedi"}
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. VIDEO CONVERTER — MP4/MKV/MOV/AVI/WebM/GIF
// ═══════════════════════════════════════════════════════════════════════════

const OUTPUT_FORMATS = [
  {
    ext: "mp4", label: "MP4", icon: "🎬",
    desc: "Best compatibility, H.264",
    cmd: ["-c:v","libx264","-crf","23","-preset","fast","-c:a","aac","-b:a","128k"],
    mime: "video/mp4",
  },
  {
    ext: "webm", label: "WebM", icon: "🌐",
    desc: "Web-native, VP9",
    cmd: ["-c:v","libvpx-vp9","-crf","33","-b:v","0","-c:a","libopus"],
    mime: "video/webm",
  },
  {
    ext: "mkv", label: "MKV", icon: "📦",
    desc: "Container, multi-track",
    cmd: ["-c:v","libx264","-crf","23","-preset","fast","-c:a","copy"],
    mime: "video/x-matroska",
  },
  {
    ext: "mov", label: "MOV", icon: "🍎",
    desc: "Apple QuickTime",
    cmd: ["-c:v","libx264","-crf","23","-preset","fast","-c:a","aac"],
    mime: "video/quicktime",
  },
  {
    ext: "avi", label: "AVI", icon: "🗂",
    desc: "Legacy Windows format",
    cmd: ["-c:v","libx264","-crf","23","-c:a","mp3"],
    mime: "video/x-msvideo",
  },
  {
    ext: "gif", label: "GIF", icon: "✨",
    desc: "Animated (max 480px)",
    cmd: ["-vf","fps=10,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse","-loop","0"],
    mime: "image/gif",
  },
];

export function VideoConverterTool() {
  const core = useVideoTool();
  const { t, isEn, file, setFile, status, setStatus, pct, setPct, label, setLabel, error, result, prepareFFmpeg, finish, fail, reset } = core;
  const [targetFmt, setTargetFmt] = useState(OUTPUT_FORMATS[0]);

  const process = async (f: File) => {
    setFile(f);
    try {
      const ff  = await prepareFFmpeg();
      const ext = getExt(f.name);

      setStatus("processing");
      setLabel(isEn ? `Converting to ${targetFmt.label}…` : `${targetFmt.label}'e dönüştürülüyor…`);

      // Dosyayı FFmpeg sanal FS'ye yaz
      const inName  = `input.${ext}`;
      const outName = `output.${targetFmt.ext}`;
      ff.FS("writeFile", inName, new Uint8Array(await f.arrayBuffer()));

      // FFmpeg komutunu çalıştır
      await ff.run("-i", inName, ...targetFmt.cmd, "-y", outName);

      // Çıktıyı oku
      const data = ff.FS("readFile", outName);
      ffmpegCleanup(ff, inName, outName);

      if (!data || data.byteLength < 100) throw new Error("FFmpeg produced an empty file.");
      finish(new Blob([data.buffer], { type: targetFmt.mime }));
      trackEvent("VideoConverted", { from: ext, to: targetFmt.ext, size: f.size });
    } catch (e: any) { fail(e.message); }
  };

  if (status === "loading_ffmpeg" || status === "processing") return (
    <div className="w-full max-w-4xl mx-auto">
      <ProcessingCard pct={pct} label={label} status={status} isEn={isEn}/>
    </div>
  );
  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={swapExt(file!.name, targetFmt.ext)}
        origSize={file!.size} isEn={isEn} onReset={reset}/>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Format seçimi */}
      <Card className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 rounded-2xl"><ArrowLeftRight className="w-5 h-5 text-blue-600"/></div>
          <div>
            <h3 className="text-base font-bold text-slate-800">{isEn?"Output Format":"Çıktı Formatı"}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{isEn?"Select the format to convert to":"Dönüştürmek istediğiniz formatı seçin"}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {OUTPUT_FORMATS.map(fmt => (
            <button key={fmt.ext} onClick={() => setTargetFmt(fmt)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                targetFmt.ext === fmt.ext
                  ? "border-primary bg-primary/5 scale-105 shadow-sm"
                  : "border-slate-100 hover:border-primary/30 hover:bg-slate-50"
              }`}>
              <span className="text-2xl">{fmt.icon}</span>
              <span className={`font-black text-sm ${targetFmt.ext===fmt.ext?"text-primary":"text-slate-600"}`}>{fmt.label}</span>
              <span className="text-[10px] text-slate-400 text-center leading-tight">{fmt.desc}</span>
            </button>
          ))}
        </div>

        {/* Seçilen format bilgisi */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 font-medium">
          📌 {isEn?"Selected:":"Seçili:"} <strong>{targetFmt.label}</strong> — {targetFmt.desc}
          {targetFmt.ext === "gif" && ` · ${isEn?"Max 480px width for optimal file size":"Optimal dosya boyutu için maks. 480px genişlik"}`}
          {targetFmt.ext === "webm" && ` · ${isEn?"May take longer due to VP9 encoding":"VP9 kodlaması nedeniyle daha uzun sürebilir"}`}
        </div>
      </Card>

      <DropZone onFile={f=>process(f)}
        accept=".mp4,.mkv,.mov,.avi,.webm,.flv,.wmv,.m4v,.3gp,video/*"
        isEn={isEn} error={error} icon={Film}
        hint={isEn?"MP4, MKV, MOV, AVI, WebM, FLV — max 500 MB":"MP4, MKV, MOV, AVI, WebM, FLV — maks. 500 MB"}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. VIDEO TO MP3 — Ses kanalını ayıkla
// ═══════════════════════════════════════════════════════════════════════════

const AUDIO_QUALITIES = [
  { label:"320 kbps", value:"0", desc:"Studio quality" },
  { label:"192 kbps", value:"2", desc:"High quality"   },
  { label:"128 kbps", value:"4", desc:"Standard"       },
  { label:"96 kbps",  value:"6", desc:"Small file"     },
];

export function VideoToMp3Tool() {
  const core = useVideoTool();
  const { t, isEn, file, setFile, status, setStatus, pct, label, setLabel, error, result, prepareFFmpeg, finish, fail, reset } = core;
  const [quality, setQuality] = useState(AUDIO_QUALITIES[0]);
  const [format,  setFormat ] = useState<"mp3"|"aac"|"wav">("mp3");

  const FORMATS = {
    mp3: { cmd:["-vn","-acodec","libmp3lame","-q:a",quality.value], ext:"mp3", mime:"audio/mpeg"      },
    aac: { cmd:["-vn","-acodec","aac","-b:a","192k"],               ext:"m4a", mime:"audio/aac"       },
    wav: { cmd:["-vn","-acodec","pcm_s16le"],                        ext:"wav", mime:"audio/wav"       },
  };

  const process = async (f: File) => {
    setFile(f);
    try {
      const ff  = await prepareFFmpeg();
      const fmt = FORMATS[format];
      setStatus("processing");
      setLabel(isEn ? `Extracting audio as ${format.toUpperCase()}…` : `${format.toUpperCase()} olarak ses ayıklanıyor…`);

      const inName  = `input.${getExt(f.name)}`;
      const outName = `output.${fmt.ext}`;
      ff.FS("writeFile", inName, new Uint8Array(await f.arrayBuffer()));
      await ff.run("-i", inName, ...fmt.cmd, "-y", outName);
      const data = ff.FS("readFile", outName);
      ffmpegCleanup(ff, inName, outName);

      if (!data || data.byteLength < 100) throw new Error("No audio track was found in this video.");
      finish(new Blob([data.buffer], { type: fmt.mime }));
      trackEvent("VideoToMp3", { format, quality: quality.label, size: f.size });
    } catch (e: any) { fail(e.message); }
  };

  if (status === "loading_ffmpeg" || status === "processing") return (
    <div className="w-full max-w-4xl mx-auto">
      <ProcessingCard pct={pct} label={label} status={status} isEn={isEn}/>
    </div>
  );
  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={swapExt(file!.name, FORMATS[format].ext)}
        origSize={file!.size} isEn={isEn} onReset={reset}>
        <div className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-blue-50 rounded-xl text-blue-700 text-sm font-medium">
          <Music className="w-4 h-4"/>
          {isEn?"Audio extracted successfully":"Ses başarıyla ayıklandı"} · {quality.label}
        </div>
      </DoneCard>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-pink-50 rounded-2xl"><Music className="w-5 h-5 text-pink-600"/></div>
          <h3 className="text-base font-bold text-slate-800">{isEn?"Audio Settings":"Ses Ayarları"}</h3>
        </div>

        {/* Format seçimi */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            {isEn?"Output Format":"Çıktı Formatı"}
          </label>
          <div className="flex gap-3">
            {(["mp3","aac","wav"] as const).map(f => (
              <button key={f} onClick={() => setFormat(f)}
                className={`flex-1 py-3 rounded-2xl border-2 text-sm font-black transition-all uppercase ${
                  format===f ? "border-pink-400 bg-pink-50 text-pink-700" : "border-slate-100 text-slate-400 hover:border-pink-200"
                }`}>
                {f}
                <span className={`block text-[10px] font-normal normal-case mt-0.5 ${format===f?"text-pink-500":"text-slate-300"}`}>
                  {f==="mp3"?"Universal":""}
                  {f==="aac"?"iOS/Android":""}
                  {f==="wav"?"Lossless":""}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Kalite (sadece MP3 için) */}
        {format === "mp3" && (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              {isEn?"Bit Rate":"Bit Hızı"}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AUDIO_QUALITIES.map(q => (
                <button key={q.value} onClick={() => setQuality(q)}
                  className={`py-2.5 rounded-xl border-2 text-center transition-all ${
                    quality.value===q.value ? "border-pink-400 bg-pink-50 text-pink-700" : "border-slate-100 text-slate-400 hover:border-pink-200"
                  }`}>
                  <div className="font-black text-sm">{q.label}</div>
                  <div className={`text-[10px] mt-0.5 ${quality.value===q.value?"text-pink-400":"text-slate-300"}`}>{q.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      <DropZone onFile={f=>process(f)}
        accept=".mp4,.mkv,.mov,.avi,.webm,.flv,.wmv,.m4v,video/*"
        isEn={isEn} error={error} icon={Music}
        hint={isEn?"Any video format — audio track will be extracted":"Herhangi video formatı — ses kanalı ayıklanır"}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. VIDEO TO GIF — Palette tabanlı yüksek kalite GIF
// ═══════════════════════════════════════════════════════════════════════════

export function VideoToGifTool() {
  const core = useVideoTool();
  const { t, isEn, file, setFile, status, setStatus, pct, label, setLabel, error, result, prepareFFmpeg, finish, fail, reset } = core;
  const [startSec, setStartSec] = useState(0);
  const [durSec,   setDurSec  ] = useState(5);
  const [fps,      setFps     ] = useState(12);
  const [width,    setWidth   ] = useState(480);
  const [loop,     setLoop    ] = useState(true);
  const vidRef = useRef<HTMLVideoElement>(null);
  const [thumbUrl, setThumbUrl] = useState<string|null>(null);
  const [vidDur,   setVidDur  ] = useState<number|null>(null);

  useEffect(() => () => { if (thumbUrl) URL.revokeObjectURL(thumbUrl); }, [thumbUrl]);

  const onFileSelect = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setThumbUrl(url);
  };

  const process = async () => {
    if (!file) return;
    try {
      const ff = await prepareFFmpeg();
      setStatus("processing");
      setLabel(isEn
        ? `Generating GIF (${durSec}s @ ${fps}fps)…`
        : `GIF oluşturuluyor (${durSec}s @ ${fps}fps)…`);

      const inName  = `input.${getExt(file.name)}`;
      const paletteFile = "palette.png";
      const outName = "output.gif";

      ff.FS("writeFile", inName, new Uint8Array(await file.arrayBuffer()));

      // İki aşamalı GIF: 1) Palette oluştur  2) Palette ile render
      const scaleFilter = `fps=${fps},scale=${width}:-1:flags=lanczos`;

      // Aşama 1: palette
      await ff.run(
        "-ss", String(startSec),
        "-t",  String(durSec),
        "-i",  inName,
        "-vf", `${scaleFilter},palettegen=max_colors=256:stats_mode=diff`,
        "-y",  paletteFile
      );

      // Aşama 2: GIF render
      await ff.run(
        "-ss", String(startSec),
        "-t",  String(durSec),
        "-i",  inName,
        "-i",  paletteFile,
        "-lavfi", `${scaleFilter} [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=5`,
        "-loop",  loop ? "0" : "-1",
        "-y",     outName
      );

      const data = ff.FS("readFile", outName);
      ffmpegCleanup(ff, inName, paletteFile, outName);

      if (!data || data.byteLength < 100) throw new Error("The GIF could not be created.");
      finish(new Blob([data.buffer], { type: "image/gif" }));
      trackEvent("VideoToGif", { fps, width, dur: durSec, size: file.size });
    } catch (e: any) { fail(e.message); }
  };

  if (status === "loading_ffmpeg" || status === "processing") return (
    <div className="w-full max-w-4xl mx-auto">
      <ProcessingCard pct={pct} label={label} status={status} isEn={isEn}/>
    </div>
  );
  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={swapExt(file!.name, "gif")}
        origSize={file!.size} isEn={isEn} onReset={reset}>
        <p className="mb-4 text-xs text-slate-500 font-medium">
          ✨ {isEn?"2-pass palette GIF — best possible quality":"2-geçişli palette GIF — mümkün en iyi kalite"}
        </p>
      </DoneCard>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* GIF Ayarları */}
      <Card className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-50 rounded-2xl">
            <span className="text-xl">✨</span>
          </div>
          <h3 className="text-base font-bold text-slate-800">{isEn?"GIF Settings":"GIF Ayarları"}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Başlangıç & Süre */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {isEn?`Start: ${secToTime(startSec)}`:`Başlangıç: ${secToTime(startSec)}`}
            </label>
            <input type="range" min={0} max={Math.max(0, (vidDur??30)-1)} step={0.5} value={startSec}
              onChange={e=>setStartSec(Number(e.target.value))}
              className="w-full accent-amber-500"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {isEn?`Duration: ${durSec}s`:`Süre: ${durSec}s`}
              <span className="ml-2 font-normal text-rose-400">{isEn?"(max 15s recommended)":"(maks. 15s önerilir)"}</span>
            </label>
            <input type="range" min={1} max={30} step={0.5} value={durSec}
              onChange={e=>setDurSec(Number(e.target.value))}
              className="w-full accent-amber-500"/>
          </div>

          {/* FPS & Genişlik */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {isEn?`Frame Rate: ${fps} fps`:`Kare Hızı: ${fps} fps`}
            </label>
            <div className="flex gap-2">
              {[8, 12, 15, 24].map(f => (
                <button key={f} onClick={() => setFps(f)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${
                    fps===f ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-100 text-slate-400 hover:border-amber-200"
                  }`}>{f}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {isEn?`Width: ${width}px`:`Genişlik: ${width}px`}
            </label>
            <div className="flex gap-2">
              {[320, 480, 640, 800].map(w => (
                <button key={w} onClick={() => setWidth(w)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    width===w ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-100 text-slate-400 hover:border-amber-200"
                  }`}>{w}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Loop */}
        <div className="mt-4 flex items-center gap-3">
          <input type="checkbox" id="gif-loop" checked={loop} onChange={e=>setLoop(e.target.checked)} className="accent-amber-500 w-4 h-4"/>
          <label htmlFor="gif-loop" className="text-sm font-semibold text-slate-600 cursor-pointer">
            {isEn?"Loop infinitely":"Sonsuz döngü"}
          </label>
        </div>

        {/* Tahmini boyut uyarısı */}
        {durSec > 10 && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl text-amber-700 text-xs font-medium">
            ⚠️ {isEn?`${durSec}s GIF may be large. Consider reducing duration or FPS.`:`${durSec}s GIF büyük olabilir. Süre veya FPS'i azaltmayı düşünün.`}
          </div>
        )}
      </Card>

      {/* Video yükleme + önizleme */}
      {!file ? (
        <DropZone onFile={onFileSelect}
          accept=".mp4,.mkv,.mov,.avi,.webm,.flv,video/*"
          isEn={isEn} error={error} icon={Film}
          hint={isEn?"Select a scene from your video to convert to GIF":"GIF'e dönüştürmek için videonuzdan bir sahne seçin"}/>
      ) : (
        <Card className="p-6 rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="space-y-4">
            {thumbUrl && (
              <video ref={vidRef} src={thumbUrl} controls muted
                onLoadedMetadata={e => setVidDur((e.target as HTMLVideoElement).duration)}
                className="w-full rounded-2xl max-h-64 bg-black object-contain"/>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={reset} className="rounded-full flex-shrink-0">
                <RefreshCw className="w-4 h-4 mr-2"/>{isEn?"Change file":"Dosya değiştir"}
              </Button>
              <Button onClick={process} className="rounded-full px-10 font-bold flex-1 h-12">
                <span className="mr-2">✨</span>
                {isEn?"Create GIF":"GIF Oluştur"}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. COMPRESS VIDEO — CRF tabanlı kalite korumalı sıkıştırma
// ═══════════════════════════════════════════════════════════════════════════

export function CompressVideoTool() {
  const core = useVideoTool();
  const { t, isEn, file, setFile, status, setStatus, pct, label, setLabel, error, result, prepareFFmpeg, finish, fail, reset } = core;
  const [level, setLevel] = useState<"light"|"medium"|"heavy"|"custom">("medium");
  const [crf,   setCrf  ] = useState(28);
  const [resScale, setResScale] = useState<"original"|"720p"|"480p"|"360p">("original");

  const LEVELS = {
    light:  { crf:20, label:isEn?"Light (best quality)":"Hafif (en iyi kalite)",  icon:"🔵", desc:"~40% smaller" },
    medium: { crf:28, label:isEn?"Medium (balanced)":"Orta (dengeli)",           icon:"🟢", desc:"~60% smaller" },
    heavy:  { crf:35, label:isEn?"Heavy (smallest file)":"Ağır (en küçük)","icon":"🟡", desc:"~75% smaller" },
    custom: { crf,    label:isEn?"Custom CRF":"Özel CRF",                        icon:"⚙️", desc:`CRF ${crf}`  },
  };

  const RES_MAP: Record<string, string[]> = {
    original: [],
    "720p":   ["-vf","scale=-2:720"],
    "480p":   ["-vf","scale=-2:480"],
    "360p":   ["-vf","scale=-2:360"],
  };

  const process = async (f: File) => {
    setFile(f);
    const activeCrf = level === "custom" ? crf : LEVELS[level].crf;
    try {
      const ff = await prepareFFmpeg();
      setStatus("processing");
      setLabel(isEn ? `Compressing (CRF ${activeCrf})…` : `Sıkıştırılıyor (CRF ${activeCrf})…`);

      const inName  = `input.${getExt(f.name)}`;
      const outName = "output.mp4";
      ff.FS("writeFile", inName, new Uint8Array(await f.arrayBuffer()));

      const resArgs = RES_MAP[resScale];
      await ff.run(
        "-i", inName,
        "-c:v","libx264",
        "-crf", String(activeCrf),
        "-preset","fast",
        ...resArgs,
        // Çift sayıya yuvarla (libx264 gerekliliği)
        ...(resArgs.length ? [] : ["-vf","scale=trunc(iw/2)*2:trunc(ih/2)*2"]),
        "-c:a","aac","-b:a","96k",
        "-movflags","+faststart",
        "-y", outName
      );

      const data = ff.FS("readFile", outName);
      ffmpegCleanup(ff, inName, outName);

      if (!data || data.byteLength < 100) throw new Error("Compression produced an empty file.");
      finish(new Blob([data.buffer], { type: "video/mp4" }));
      trackEvent("VideoCompressed", { crf:activeCrf, res:resScale, before:f.size });
    } catch (e: any) { fail(e.message); }
  };

  if (status === "loading_ffmpeg" || status === "processing") return (
    <div className="w-full max-w-4xl mx-auto">
      <ProcessingCard pct={pct} label={label} status={status} isEn={isEn}/>
    </div>
  );
  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={swapExt(file!.name, "mp4")}
        origSize={file!.size} isEn={isEn} onReset={reset}/>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-50 rounded-2xl"><Zap className="w-5 h-5 text-green-600"/></div>
          <h3 className="text-base font-bold text-slate-800">{isEn?"Compression Level":"Sıkıştırma Seviyesi"}</h3>
        </div>

        {/* Sıkıştırma seviyesi */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {(Object.entries(LEVELS) as [string, typeof LEVELS.medium][]).map(([key, val]) => (
            <button key={key} onClick={() => { setLevel(key as any); if(key!=="custom") setCrf(val.crf); }}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                level===key ? "border-green-400 bg-green-50 scale-105 shadow-sm" : "border-slate-100 hover:border-green-200"
              }`}>
              <span className="text-xl">{val.icon}</span>
              <span className={`text-xs font-black text-center leading-tight ${level===key?"text-green-700":"text-slate-500"}`}>{val.label}</span>
              <span className={`text-[10px] ${level===key?"text-green-500":"text-slate-300"}`}>{val.desc}</span>
            </button>
          ))}
        </div>

        {/* Custom CRF slider */}
        {level === "custom" && (
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-slate-600">CRF (Constant Rate Factor)</label>
              <span className="text-sm font-black text-green-600">{crf}</span>
            </div>
            <input type="range" min={15} max={51} value={crf} onChange={e=>setCrf(Number(e.target.value))}
              className="w-full accent-green-600 mb-2"/>
            <div className="flex justify-between text-xs text-slate-300">
              <span>15 = {isEn?"Best quality":"En iyi kalite"}</span>
              <span>51 = {isEn?"Worst quality":"En düşük kalite"}</span>
            </div>
          </div>
        )}

        {/* Çözünürlük ölçekleme */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            {isEn?"Resolution":"Çözünürlük"}
          </label>
          <div className="flex gap-2 flex-wrap">
            {(["original","720p","480p","360p"] as const).map(r => (
              <button key={r} onClick={() => setResScale(r)}
                className={`px-4 py-2 rounded-full border-2 text-xs font-bold transition-all ${
                  resScale===r ? "border-green-400 bg-green-50 text-green-700" : "border-slate-100 text-slate-400 hover:border-green-200"
                }`}>
                {r === "original" ? (isEn?"Original":"Orijinal") : r}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <DropZone onFile={f=>process(f)}
        accept=".mp4,.mkv,.mov,.avi,.webm,.flv,video/*"
        isEn={isEn} error={error} icon={Zap}
        hint={isEn?"H.264 output — max 500 MB input":"H.264 çıktı — maks. 500 MB girdi"}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. MUTE VIDEO — Ses kanalını kaldır (stream copy, çok hızlı)
// ═══════════════════════════════════════════════════════════════════════════

export function MuteVideoTool() {
  const core = useVideoTool();
  const { t, isEn, file, setFile, status, setStatus, pct, label, setLabel, error, result, prepareFFmpeg, finish, fail, reset } = core;

  const process = async (f: File) => {
    setFile(f);
    try {
      const ff  = await prepareFFmpeg();
      const ext = getExt(f.name);
      setStatus("processing");
      setLabel(isEn ? "Removing audio track…" : "Ses kanalı kaldırılıyor…");

      const inName  = `input.${ext}`;
      const outExt  = ext === "mkv" || ext === "mov" ? ext : "mp4";
      const outName = `output.${outExt}`;

      ff.FS("writeFile", inName, new Uint8Array(await f.arrayBuffer()));
      // -an: ses kanalını sil, -c:v copy: video yeniden kodlama yapma (hızlı!)
      await ff.run("-i", inName, "-c:v","copy", "-an", "-y", outName);

      const data = ff.FS("readFile", outName);
      ffmpegCleanup(ff, inName, outName);

      if (!data || data.byteLength < 100) throw new Error("Removing the audio track failed.");
      finish(new Blob([data.buffer], { type: "video/mp4" }));
      trackEvent("VideoMuted", { size: f.size });
    } catch (e: any) { fail(e.message); }
  };

  if (status === "loading_ffmpeg" || status === "processing") return (
    <div className="w-full max-w-4xl mx-auto">
      <ProcessingCard pct={pct} label={label} status={status} isEn={isEn}/>
    </div>
  );
  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={swapExt(file!.name, "mp4")}
        origSize={file!.size} isEn={isEn} onReset={reset}>
        <div className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-slate-100 rounded-xl text-slate-600 text-sm font-medium">
          <VolumeX className="w-4 h-4"/>
          {isEn?"Audio track removed — video stream was not re-encoded (fast!)":"Ses kanalı kaldırıldı — video yeniden kodlanmadı (hızlı!)"}
        </div>
      </DoneCard>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      <div className="flex items-start gap-3 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
        <VolumeX className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5"/>
        <div>
          <p className="font-bold text-slate-700 text-sm mb-1">{isEn?"Stream Copy Mode":"Stream Kopyalama Modu"}</p>
          <p className="text-xs text-slate-400 font-medium">
            {isEn
              ? "The video track is NOT re-encoded — just audio is stripped. This is very fast and doesn't reduce video quality."
              : "Video kanalı yeniden kodlanmaz — sadece ses kaldırılır. Bu çok hızlıdır ve video kalitesini düşürmez."}
          </p>
        </div>
      </div>
      <DropZone onFile={f=>process(f)}
        accept=".mp4,.mkv,.mov,.avi,.webm,.flv,video/*"
        isEn={isEn} error={error} icon={VolumeX}
        hint={isEn?"Upload any video — audio will be completely removed":"Herhangi video yükleyin — ses tamamen kaldırılır"}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. TRIM VIDEO — Başlangıç/bitiş noktası ile kes
// ═══════════════════════════════════════════════════════════════════════════

export function TrimVideoTool() {
  const core = useVideoTool();
  const { t, isEn, file, setFile, status, setStatus, pct, label, setLabel, error, result, prepareFFmpeg, finish, fail, reset } = core;
  const [thumbUrl,  setThumbUrl ] = useState<string|null>(null);
  const [duration,  setDuration ] = useState<number>(0);
  const [startSec,  setStartSec ] = useState<number>(0);
  const [endSec,    setEndSec   ] = useState<number>(0);
  const [reEncode,  setReEncode ] = useState(false);
  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => () => { if (thumbUrl) URL.revokeObjectURL(thumbUrl); }, [thumbUrl]);

  const onFileSelect = (f: File) => {
    setFile(f);
    const url = URL.createObjectURL(f);
    setThumbUrl(url);
  };

  const onMetaLoaded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const d = (e.target as HTMLVideoElement).duration;
    setDuration(d);
    setEndSec(d);
  };

  const setVideoTime = (t: number) => {
    if (vidRef.current) vidRef.current.currentTime = t;
  };

  const process = async () => {
    if (!file || startSec >= endSec) return;
    try {
      const ff  = await prepareFFmpeg();
      const ext = getExt(file.name);
      setStatus("processing");
      const dur = (endSec - startSec).toFixed(2);
      setLabel(isEn
        ? `Trimming ${secToTime(startSec)} → ${secToTime(endSec)}…`
        : `${secToTime(startSec)} → ${secToTime(endSec)} arası kesiliyor…`);

      const inName  = `input.${ext}`;
      const outExt  = ["mp4","mov","mkv"].includes(ext) ? ext : "mp4";
      const outName = `output.${outExt}`;

      ff.FS("writeFile", inName, new Uint8Array(await file.arrayBuffer()));

      if (reEncode) {
        // Yeniden kodlama: her karede kesin kesim ama yavaş
        await ff.run(
          "-ss", String(startSec), "-t", dur,
          "-i", inName,
          "-c:v","libx264","-crf","20","-preset","fast",
          "-c:a","aac","-b:a","128k",
          "-y", outName
        );
      } else {
        // Stream copy: hızlı ama en yakın keyframe'e yuvarlanır
        await ff.run(
          "-ss", String(startSec), "-t", dur,
          "-i", inName,
          "-c","copy",
          "-avoid_negative_ts","make_zero",
          "-y", outName
        );
      }

      const data = ff.FS("readFile", outName);
      ffmpegCleanup(ff, inName, outName);

      if (!data || data.byteLength < 100) throw new Error("Trimming produced an empty file.");
      finish(new Blob([data.buffer], { type: "video/mp4" }));
      trackEvent("VideoTrimmed", { start:startSec, end:endSec, dur:endSec-startSec });
    } catch (e: any) { fail(e.message); }
  };

  if (status === "loading_ffmpeg" || status === "processing") return (
    <div className="w-full max-w-4xl mx-auto">
      <ProcessingCard pct={pct} label={label} status={status} isEn={isEn}/>
    </div>
  );
  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={swapExt(file!.name, "mp4")}
        origSize={file!.size} isEn={isEn} onReset={reset}>
        <p className="mb-4 text-xs text-emerald-600 font-medium">
          ✂️ {secToTime(startSec)} → {secToTime(endSec)} ({(endSec-startSec).toFixed(1)}s)
        </p>
      </DoneCard>
    </div>
  );

  if (!file) return (
    <div className="w-full max-w-4xl mx-auto">
      <DropZone onFile={onFileSelect} accept=".mp4,.mkv,.mov,.avi,.webm,.flv,video/*"
        isEn={isEn} error={error} icon={Scissors}
        hint={isEn?"Upload video — then set start and end points":"Video yükleyin — başlangıç ve bitiş noktasını ayarlayın"}/>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      <Card className="p-6 rounded-3xl border border-slate-100 bg-white shadow-sm">
        {/* Video önizleme */}
        {thumbUrl && (
          <video ref={vidRef} src={thumbUrl} controls className="w-full rounded-2xl max-h-60 bg-black object-contain mb-5"
            onLoadedMetadata={onMetaLoaded}/>
        )}

        {/* Trim kontrolleri */}
        <div className="space-y-5">
          {/* Başlangıç */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-emerald-500"/>
                {isEn?"Start":"Başlangıç"}
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-slate-700 text-sm">{secToTime(startSec)}</span>
                <button onClick={() => setVideoTime(startSec)}
                  className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 font-medium">
                  {isEn?"Preview":"Önizle"}
                </button>
              </div>
            </div>
            <input type="range" min={0} max={Math.max(0, endSec-0.1)} step={0.1} value={startSec}
              onChange={e => { const v=Number(e.target.value); setStartSec(v); setVideoTime(v); }}
              className="w-full accent-emerald-500"/>
          </div>

          {/* Bitiş */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FastForward className="w-3.5 h-3.5 text-rose-500"/>
                {isEn?"End":"Bitiş"}
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-slate-700 text-sm">{secToTime(endSec)}</span>
                <button onClick={() => setVideoTime(endSec)}
                  className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 font-medium">
                  {isEn?"Preview":"Önizle"}
                </button>
              </div>
            </div>
            <input type="range" min={startSec+0.1} max={duration||100} step={0.1} value={endSec}
              onChange={e => { const v=Number(e.target.value); setEndSec(v); setVideoTime(v); }}
              className="w-full accent-rose-500"/>
          </div>

          {/* Seçim özeti */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-sm">
            <span className="text-slate-500 font-medium">
              ✂️ {secToTime(startSec)} → {secToTime(endSec)}
            </span>
            <span className="font-black text-primary">
              {(endSec - startSec).toFixed(1)}s {isEn?"selected":"seçildi"}
            </span>
          </div>

          {/* Re-encode seçeneği */}
          <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100">
            <input type="checkbox" id="reencode" checked={reEncode} onChange={e=>setReEncode(e.target.checked)}
              className="accent-primary mt-0.5"/>
            <label htmlFor="reencode" className="text-xs text-slate-600 cursor-pointer">
              <span className="font-bold block">{isEn?"Re-encode (precise cut)":"Yeniden Kodla (hassas kesim)"}</span>
              <span className="text-slate-400">
                {isEn
                  ? "Slower but cuts exactly at the selected point. Without this, cut snaps to nearest keyframe."
                  : "Daha yavaş ama tam seçilen noktada keser. Kapalıysa en yakın keyframe'e yuvarlanır."}
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <Button variant="outline" onClick={reset} className="rounded-full flex-shrink-0">
            <RefreshCw className="w-4 h-4 mr-2"/>{isEn?"Change file":"Dosya değiştir"}
          </Button>
          <Button onClick={process} disabled={startSec >= endSec || duration === 0}
            className="rounded-full px-10 font-bold flex-1 h-12 disabled:opacity-40">
            <Scissors className="w-4 h-4 mr-2"/>
            {isEn?"Trim Video":"Videoyu Kes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. ROTATE VIDEO — 90°/180°/çevir
// ═══════════════════════════════════════════════════════════════════════════

const ROTATE_OPTIONS = [
  { label:"90° CW",      icon:"↻", vf:"transpose=1",                   desc:"Clockwise"         },
  { label:"90° CCW",     icon:"↺", vf:"transpose=2",                   desc:"Counter-clockwise" },
  { label:"180°",        icon:"🔄", vf:"transpose=2,transpose=2",       desc:"Upside down"       },
  { label:"Flip H",      icon:"↔️", vf:"hflip",                         desc:"Mirror horizontal" },
  { label:"Flip V",      icon:"↕️", vf:"vflip",                         desc:"Mirror vertical"   },
  { label:"90° CW + FH", icon:"🔀", vf:"transpose=1,hflip",             desc:"Rotate & mirror"   },
];

export function RotateVideoTool() {
  const core = useVideoTool();
  const { t, isEn, file, setFile, status, setStatus, pct, label, setLabel, error, result, prepareFFmpeg, finish, fail, reset } = core;
  const [selected, setSelected] = useState(ROTATE_OPTIONS[0]);

  const process = async (f: File) => {
    setFile(f);
    try {
      const ff  = await prepareFFmpeg();
      const ext = getExt(f.name);
      setStatus("processing");
      setLabel(isEn ? `Applying ${selected.label}…` : `${selected.label} uygulanıyor…`);

      const inName  = `input.${ext}`;
      const outExt  = ["mp4","mov"].includes(ext) ? ext : "mp4";
      const outName = `output.${outExt}`;

      ff.FS("writeFile", inName, new Uint8Array(await f.arrayBuffer()));
      await ff.run(
        "-i",   inName,
        "-vf",  selected.vf,
        "-c:v","libx264","-crf","20","-preset","fast",
        "-c:a","copy",
        "-y",   outName
      );

      const data = ff.FS("readFile", outName);
      ffmpegCleanup(ff, inName, outName);

      if (!data || data.byteLength < 100) throw new Error("Rotating produced an empty file.");
      finish(new Blob([data.buffer], { type: "video/mp4" }));
      trackEvent("VideoRotated", { transform: selected.label, size: f.size });
    } catch (e: any) { fail(e.message); }
  };

  if (status === "loading_ffmpeg" || status === "processing") return (
    <div className="w-full max-w-4xl mx-auto">
      <ProcessingCard pct={pct} label={label} status={status} isEn={isEn}/>
    </div>
  );
  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={swapExt(file!.name, "mp4")}
        origSize={file!.size} isEn={isEn} onReset={reset}>
        <p className="mb-4 text-xs text-slate-500 font-medium">
          {selected.icon} {selected.label} — {selected.desc}
        </p>
      </DoneCard>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-50 rounded-2xl"><RotateCw className="w-5 h-5 text-indigo-600"/></div>
          <h3 className="text-base font-bold text-slate-800">{isEn?"Rotation & Flip":"Döndürme & Çevirme"}</h3>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {ROTATE_OPTIONS.map(opt => (
            <button key={opt.label} onClick={() => setSelected(opt)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                selected.label===opt.label
                  ? "border-indigo-400 bg-indigo-50 scale-105 shadow-sm"
                  : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50"
              }`}>
              <span className="text-2xl">{opt.icon}</span>
              <span className={`font-black text-xs text-center leading-tight ${
                selected.label===opt.label ? "text-indigo-700" : "text-slate-500"
              }`}>{opt.label}</span>
              <span className={`text-[10px] text-center ${
                selected.label===opt.label ? "text-indigo-400" : "text-slate-300"
              }`}>{opt.desc}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 font-medium">
          📌 {isEn?"Selected:":"Seçili:"} <strong>{selected.icon} {selected.label}</strong> — {selected.desc}
          <br/>
          <span className="text-slate-400">{isEn?"FFmpeg filter:":"FFmpeg filtresi:"} <code className="font-mono bg-slate-100 px-1 rounded">{selected.vf}</code></span>
        </div>
      </Card>

      <DropZone onFile={f=>process(f)}
        accept=".mp4,.mkv,.mov,.avi,.webm,.flv,video/*"
        isEn={isEn} error={error} icon={RotateCw}
        hint={isEn?"Upload sideways or flipped video":"Yan veya çevrilmiş video yükleyin"}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// § EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export default VideoConverterTool;

/*
 KULLANIM:
 ─────────
 import {
   VideoConverterTool,  // MP4/MKV/MOV/AVI/WebM/GIF dönüşümü
   VideoToMp3Tool,      // Ses ayıklama (MP3/AAC/WAV)
   VideoToGifTool,      // 2-pass palette GIF
   CompressVideoTool,   // CRF sıkıştırma
   MuteVideoTool,       // Ses kaldırma (stream copy)
   TrimVideoTool,       // Başlangıç/bitiş kırpma
   RotateVideoTool,     // 90°/180°/flip
 } from "@/components/VideoTools";

 REPLIT KURULUM:
   Paket kurmak zorunlu değil — FFmpeg.wasm CDN'den otomatik yüklenir.
   İlk yüklemede ~20 MB indirilir, sonraki oturumlarda cache'ten gelir.
*/

// ═══════════════════════════════════════════════════════════════════════════
// § VIDEO RESIZER — gercek boyut degistirme
// ═══════════════════════════════════════════════════════════════════════════
//
// /tools/video-resizer daha once VideoConverterTool bilesenini ciziyordu:
// sayfa "Resize video dimensions for social media" diyor ama ekranda yalnizca
// kap/format secici vardi, tek bir boyut kontrolu yoktu. Bu bilesen isin
// kendisini yapar.
//
// Filtre stringleri yerel ffmpeg ile dogrulandi:
//   scale=-2:720                    1920x1080 -> 1280x720
//   scale=-2:480                    1920x1080 ->  854x480   (-2: cift sayiya yuvarlar)
//   scale=1080:1080:...decrease,pad 1920x1080 -> 1080x1080
//
// "-2" onemli: h264 tek sayili boyut kodlayamaz; hesaplanan genislik tek
// cikarsa encoder hata verir. min(H\,ih) ifadesi ise kucuk videolari
// buyutmemek icin - 360p bir klip 720p secilse bile 360p kalir. Ifadedeki
// virgul kacisli olmali, aksi halde filtre grafiginde ayirac sayilir.

interface ResizePreset {
  id: string;
  label: string;
  descEn: string;
  descTr: string;
  vf: string;
}

const RESIZE_PRESETS: ResizePreset[] = [
  { id: "1080p", label: "1080p", descEn: "Full HD", descTr: "Full HD", vf: "scale=-2:min(1080\\,ih)" },
  { id: "720p",  label: "720p",  descEn: "HD",      descTr: "HD",      vf: "scale=-2:min(720\\,ih)" },
  { id: "480p",  label: "480p",  descEn: "SD",      descTr: "SD",      vf: "scale=-2:min(480\\,ih)" },
  { id: "360p",  label: "360p",  descEn: "Small",   descTr: "Kucuk",   vf: "scale=-2:min(360\\,ih)" },
  {
    id: "square",
    label: "1:1",
    descEn: "1080x1080 feed post",
    descTr: "1080x1080 gonderi",
    vf: "scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:black",
  },
  {
    id: "vertical",
    label: "9:16",
    descEn: "1080x1920 reels / shorts",
    descTr: "1080x1920 reels / shorts",
    vf: "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black",
  },
];

/** Bir video blobunun gercek piksel boyutlarini okur. */
function readVideoDimensions(src: Blob | File): Promise<{ w: number; h: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(src);
    const video = document.createElement("video");
    let settled = false;
    const done = (value: { w: number; h: number } | null) => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(url);
      resolve(value);
    };
    video.preload = "metadata";
    video.onloadedmetadata = () => done({ w: video.videoWidth, h: video.videoHeight });
    video.onerror = () => done(null);
    // Tarayici bu kabi cozemezse (orn. MKV) olculeri gostermeden devam ederiz.
    setTimeout(() => done(null), 5000);
    video.src = url;
  });
}

export function VideoResizerTool() {
  const core = useVideoTool();
  const { isEn, file, setFile, status, setStatus, pct, label, setLabel, error, result,
          prepareFFmpeg, finish, fail, reset } = core;

  const [preset, setPreset] = useState<ResizePreset>(RESIZE_PRESETS[1]); // 720p
  const [srcDims, setSrcDims] = useState<{ w: number; h: number } | null>(null);
  const [outDims, setOutDims] = useState<{ w: number; h: number } | null>(null);

  const process = async (f: File) => {
    setFile(f);
    setSrcDims(await readVideoDimensions(f));
    setOutDims(null);
    try {
      const ff = await prepareFFmpeg();
      const ext = getExt(f.name);

      setStatus("processing");
      setLabel(isEn ? `Resizing to ${preset.label}...` : `${preset.label} boyutuna getiriliyor...`);

      const inName = `input.${ext}`;
      const outName = "output.mp4";
      ff.FS("writeFile", inName, new Uint8Array(await f.arrayBuffer()));

      await ff.run(
        "-i", inName,
        "-vf", preset.vf,
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-crf", "23",
        "-pix_fmt", "yuv420p",
        "-c:a", "copy",
        "-y", outName,
      );

      const data = ff.FS("readFile", outName);
      ffmpegCleanup(ff, inName, outName);
      if (!data || data.byteLength < 100) throw new Error("FFmpeg produced an empty file.");

      const blob = new Blob([data.buffer], { type: "video/mp4" });
      setOutDims(await readVideoDimensions(blob));
      finish(blob);
      trackEvent("VideoResized", { preset: preset.id, size: f.size });
    } catch (e: any) { fail(e.message); }
  };

  if (status === "loading_ffmpeg" || status === "processing") return (
    <div className="w-full max-w-4xl mx-auto">
      <ProcessingCard pct={pct} label={label} status={status} isEn={isEn}/>
    </div>
  );

  if (status === "done" && result) return (
    <div className="w-full max-w-4xl mx-auto">
      <DoneCard blob={result} filename={swapExt(file!.name, "mp4")}
        origSize={file!.size} isEn={isEn}
        onReset={() => { setSrcDims(null); setOutDims(null); reset(); }}>
        {srcDims && outDims && (
          <div className="mb-4 flex items-center justify-center gap-3 px-4 py-2.5 bg-slate-100 rounded-xl text-slate-600 text-sm font-medium"
               data-testid="text-resize-dimensions">
            <span className="font-mono">{srcDims.w}x{srcDims.h}</span>
            <ArrowLeftRight className="w-4 h-4 text-slate-400"/>
            <span className="font-mono font-bold text-slate-900">{outDims.w}x{outDims.h}</span>
          </div>
        )}
        {srcDims && outDims && srcDims.w === outDims.w && srcDims.h === outDims.h && (
          <p className="mb-4 text-xs text-slate-500 font-medium max-w-sm leading-relaxed">
            {isEn
              ? "This video was already at or below the size you picked, so its dimensions were left alone rather than upscaled."
              : "Bu video zaten sectiginiz boyutta veya daha kucuktu; buyutmek yerine boyutlari oldugu gibi birakildi."}
          </p>
        )}
      </DoneCard>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-8 rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-50 rounded-2xl"><Minimize2 className="w-5 h-5 text-indigo-600"/></div>
          <div>
            <h3 className="text-base font-bold text-slate-800">{isEn ? "Target Size" : "Hedef Boyut"}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEn
                ? "Heights keep the original aspect ratio. 1:1 and 9:16 pad the video instead of cropping it."
                : "Yukseklikler en-boy oranini korur. 1:1 ve 9:16 videoyu kirpmak yerine kenarlarini doldurur."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {RESIZE_PRESETS.map(p => (
            <button key={p.id} onClick={() => setPreset(p)}
              data-testid={`resize-preset-${p.id}`}
              className={`flex flex-col items-center gap-1 p-4 rounded-2xl border-2 transition-all ${
                preset.id === p.id
                  ? "border-primary bg-primary/5 scale-105 shadow-sm"
                  : "border-slate-100 hover:border-primary/30 hover:bg-slate-50"
              }`}>
              <span className={`font-black text-lg ${preset.id === p.id ? "text-primary" : "text-slate-600"}`}>{p.label}</span>
              <span className="text-[10px] text-slate-400 text-center leading-tight">{isEn ? p.descEn : p.descTr}</span>
            </button>
          ))}
        </div>
      </Card>

      <DropZone onFile={f => process(f)}
        accept=".mp4,.mkv,.mov,.avi,.webm,.flv,video/*"
        isEn={isEn} error={error} icon={Minimize2}
        hint={isEn
          ? "Upload a video - it will be re-encoded at the size you picked"
          : "Video yukleyin - sectiginiz boyutta yeniden kodlanacak"}/>
    </div>
  );
}
