/**
 * SecurityTools.tsx — ProToolHub v7.1
 * ═══════════════════════════════════════════════════════════════════════════
 * Üç gelişmiş Security & Optimize bileşeni:
 *
 *  1. WatermarkTool   — metin, font boyutu, açı, opaklık ayar paneli
 *  2. SignPdfTool     — çizim canvas + PNG yükleme + PDF üzerinde sürükle/boyutlandır
 *  3. TranslatePdfTool— dil seçimi + LibreTranslate backend entegrasyonu
 *                       "Bu biraz zaman alabilir..." uyarısı dahil
 *
 * Kurulum:
 *   npm install react-signature-canvas pdfjs-dist@3.11.174
 *   npm install --save-dev @types/react-signature-canvas
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, {
  useState, useRef, useCallback, useEffect,
} from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Upload, Download, RefreshCw, AlertCircle, CheckCircle2,
  Loader2, ShieldCheck, Clock, PenLine, ImageIcon, Trash2,
  Languages, ChevronDown,
} from "lucide-react";
import { Button }   from "@/components/ui/button";
import { Card }     from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData     from "@/locales/translations.json";

const translations = translationsData as Record<string, any>;

// ─── Meta Pixel (korundu) ────────────────────────────────────────────────────
function trackEvent(name: string, params?: Record<string, unknown>) {
  try {
    const fbq = (window as any).fbq;
    if (typeof fbq === "function") fbq("track", name, params ?? {});
  } catch {}
}

// ─── XHR upload yardımcısı ───────────────────────────────────────────────────
function uploadFiles(
  files: File[],
  endpoint: string,
  extraFields?: Record<string, string>,
  onProgress?: (pct: number) => void,
  timeoutMs = 58_000,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    files.forEach(f => fd.append("file", f, f.name));
    if (extraFields) Object.entries(extraFields).forEach(([k, v]) => fd.append(k, v));

    const xhr         = new XMLHttpRequest();
    xhr.responseType  = "blob";
    xhr.timeout       = timeoutMs;
    xhr.upload.onprogress = e => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 40));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response as Blob);
      } else {
        let msg = `Sunucu hatası (${xhr.status})`;
        try { const j = JSON.parse(xhr.responseText); if (j.error) msg = j.error; } catch {}
        reject(new Error(msg));
      }
    };
    xhr.onerror   = () => reject(new Error("Ağ bağlantı hatası"));
    xhr.ontimeout = () => reject(new Error("İstek zaman aşımına uğradı"));
    xhr.open("POST", endpoint);
    xhr.send(fd);
  });
}

// ─── Ortak "işlem tamamlandı" kartı ─────────────────────────────────────────
function CompletedCard({
  fileName, blobRef, successRef, ext, toolName, onReset, isEn, t,
}: {
  fileName: string; blobRef: React.MutableRefObject<Blob | null>;
  successRef: React.MutableRefObject<boolean>; ext: string;
  toolName: string; onReset: () => void; isEn: boolean; t: any;
}) {
  const handleDownload = () => {
    const blob = blobRef.current;
    if (!blob || !successRef.current) return;
    const url = URL.createObjectURL(blob);
    const a   = document.createElement("a");
    a.href = url; a.download = `ProToolHub_${Date.now()}.${ext}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    trackEvent("FileDownloaded", { tool: toolName, ext });
  };
  return (
    <Card className="p-16 rounded-3xl border-2 border-primary/20 bg-slate-50/30 shadow-2xl flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
      <div className="bg-emerald-100 text-emerald-600 p-6 rounded-full mb-8 shadow-sm ring-8 ring-emerald-50">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      <h3 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{t.common.ready}</h3>
      <p className="text-slate-500 mb-10 font-medium">{fileName}</p>
      <Button size="lg" onClick={handleDownload} disabled={!successRef.current}
        className="rounded-full px-20 font-bold h-16 shadow-2xl bg-emerald-600 hover:bg-emerald-700 text-white border-none text-lg disabled:opacity-50 mb-6">
        <Download className="w-5 h-5 mr-3" />{t.common.download}
      </Button>
      <Button variant="ghost" onClick={onReset} className="text-slate-400 hover:text-primary font-bold">
        <RefreshCw className="w-4 h-4 mr-2" />{t.common.start_over}
      </Button>
      <div className="mt-4 flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-500 text-sm font-medium shadow-sm">
        <Clock className="w-4 h-4 text-rose-400" />
        {t.common.privacy_alert}: {t.common.privacy_desc}
      </div>
    </Card>
  );
}

// ─── Ortak "işleniyor" kartı ─────────────────────────────────────────────────
function ProcessingCard({
  progress, statusLabel, isHeavy, isEn, t,
}: {
  progress: number; statusLabel: string; isHeavy?: boolean; isEn: boolean; t: any;
}) {
  return (
    <Card className="p-16 rounded-3xl border border-slate-200 bg-white shadow-xl flex flex-col items-center justify-center text-center">
      <div className="relative w-20 h-20 mb-10">
        <Loader2 className="w-20 h-20 text-primary animate-spin opacity-20 absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center font-bold text-primary text-sm">
          {Math.round(progress)}%
        </div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">{t.common.processing}</h3>
      <p className="text-primary/70 font-semibold mb-1 text-sm">{statusLabel}</p>
      {/* FIX 4: Ağır işlemler için bekleme uyarısı */}
      {isHeavy && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-medium mb-4">
          <Clock className="w-4 h-4 flex-shrink-0" />
          {isEn
            ? "This may take a while, please don't close the tab..."
            : "Bu biraz zaman alabilir, sekmeyi kapatmayın..."}
        </div>
      )}
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
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. WATERMARK TOOL — Gelişmiş ayar paneli
// ═══════════════════════════════════════════════════════════════════════════

export function WatermarkTool() {
  const { language } = useLanguageStore();
  const t    = translations[language];
  const isEn = language === "en";

  // Ayar paneli state'leri
  const [wmText,    setWmText   ] = useState("CONFIDENTIAL");
  const [fontSize,  setFontSize ] = useState(48);       // pt
  const [angle,     setAngle    ] = useState(45);        // derece
  const [opacity,   setOpacity  ] = useState(35);        // %
  const [color,     setColor    ] = useState("#c0c0c0"); // hex

  // İşlem state'leri
  const [file,       setFile      ] = useState<File | null>(null);
  const [status,     setStatus    ] = useState<"idle"|"processing"|"completed"|"error">("idle");
  const [progress,   setProgress  ] = useState(0);
  const [statusLabel,setStatusLabel]=useState("");
  const [error,      setError     ] = useState<string | null>(null);

  const resultBlobRef  = useRef<Blob | null>(null);
  const successFlagRef = useRef<boolean>(false);
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProcessing = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("processing");
    setProgress(0);
    setStatusLabel(isEn ? "Applying watermark..." : "Filigran uygulanıyor...");
    resultBlobRef.current  = null;
    successFlagRef.current = false;

    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += 80;
      const eased = 1 - Math.pow(1 - Math.min(elapsed / 8000, 1), 3);
      setProgress(Math.min(eased * 90, 90));
    }, 80);

    try {
      // Hex rengi rgb 0-1 aralığına çevir
      const r = parseInt(color.slice(1,3),16)/255;
      const g = parseInt(color.slice(3,5),16)/255;
      const b = parseInt(color.slice(5,7),16)/255;

      const blob = await uploadFiles(
        [selectedFile],
        "/api/pdf-action",
        {
          actionType: "watermark",
          watermark:  wmText,
          fontSize:   String(fontSize),
          angle:      String(angle),
          opacity:    String(opacity / 100),
          colorR:     String(r),
          colorG:     String(g),
          colorB:     String(b),
        },
        p => setProgress(p)
      );

      if (blob.size === 0) throw new Error("Boş çıktı");
      await blob.arrayBuffer();
      resultBlobRef.current  = blob;
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
    setFile(null); setStatus("idle"); setProgress(0);
    setStatusLabel(""); setError(null);
    resultBlobRef.current = null; successFlagRef.current = false;
  };

  if (status === "processing") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <ProcessingCard progress={progress} statusLabel={statusLabel} isEn={isEn} t={t} />
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <CompletedCard
          fileName={file?.name ?? ""}
          blobRef={resultBlobRef} successRef={successFlagRef}
          ext="pdf" toolName="Watermark PDF"
          onReset={reset} isEn={isEn} t={t}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Ayar Paneli */}
      <Card className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
          {isEn ? "Watermark Settings" : "Filigran Ayarları"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Metin */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              {isEn ? "Watermark Text" : "Filigran Metni"}
            </label>
            <input
              type="text"
              value={wmText}
              onChange={e => setWmText(e.target.value)}
              placeholder="CONFIDENTIAL"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-slate-800 font-medium transition-all"
            />
          </div>

          {/* Font Boyutu */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              {isEn ? `Font Size: ${fontSize}pt` : `Yazı Boyutu: ${fontSize}pt`}
            </label>
            <input type="range" min={12} max={120} value={fontSize}
              onChange={e => setFontSize(Number(e.target.value))}
              className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>12pt</span><span>120pt</span>
            </div>
          </div>

          {/* Açı */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              {isEn ? `Angle: ${angle}°` : `Açı: ${angle}°`}
            </label>
            <input type="range" min={0} max={360} value={angle}
              onChange={e => setAngle(Number(e.target.value))}
              className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0°</span><span>360°</span>
            </div>
          </div>

          {/* Opaklık */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              {isEn ? `Opacity: ${opacity}%` : `Şeffaflık: ${opacity}%`}
            </label>
            <input type="range" min={5} max={100} value={opacity}
              onChange={e => setOpacity(Number(e.target.value))}
              className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>5%</span><span>100%</span>
            </div>
          </div>

          {/* Renk */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              {isEn ? "Color" : "Renk"}
            </label>
            <div className="flex items-center gap-3">
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                className="w-12 h-12 rounded-xl border border-slate-200 cursor-pointer p-1" />
              <span className="text-sm font-mono text-slate-500">{color.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Önizleme metni */}
        <div className="mt-6 p-4 bg-slate-50 rounded-2xl flex items-center justify-center min-h-[80px] overflow-hidden">
          <span
            className="font-bold select-none pointer-events-none"
            style={{
              fontSize:  `${Math.min(fontSize * 0.4, 36)}px`,
              color,
              opacity:   opacity / 100,
              transform: `rotate(-${angle}deg)`,
              whiteSpace: "nowrap",
            }}
          >
            {wmText || "CONFIDENTIAL"}
          </span>
        </div>
      </Card>

      {/* Upload Alanı */}
      {status === "error" && error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if(f) startProcessing(f); }}
        className="cursor-pointer rounded-3xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-white hover:border-primary/50 hover:shadow-xl transition-all group"
      >
        <input type="file" ref={fileInputRef} accept=".pdf" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if(f) startProcessing(f); e.target.value=""; }} />
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform mb-4">
          <Upload className="w-10 h-10 text-primary" />
        </div>
        <p className="font-bold text-slate-800 mb-1">{t.common.drop_files}</p>
        <p className="text-slate-400 text-sm mb-6">{t.common.drag_drop} (.pdf)</p>
        <Button size="lg" className="rounded-full px-10 font-bold h-12">
          {t.common.choose_file}
        </Button>
      </div>
    </div>
  );
}

// Backend'deki watermark endpoint'ini genişletmek için
// server/index.ts'deki "watermark" case'ini şu şekilde güncelleyin:
/*
case "watermark": {
  const text     = watermark?.trim() || "CONFIDENTIAL";
  const fSize    = parseFloat(req.body.fontSize  ?? "48");
  const angleDeg = parseFloat(req.body.angle     ?? "45");
  const opacVal  = parseFloat(req.body.opacity   ?? "0.35");
  const rVal     = parseFloat(req.body.colorR    ?? "0.75");
  const gVal     = parseFloat(req.body.colorG    ?? "0.75");
  const bVal     = parseFloat(req.body.colorB    ?? "0.75");

  const doc  = await loadDoc(files[0].buffer);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  doc.getPages().forEach(page => {
    const { width, height } = page.getSize();
    const tW = font.widthOfTextAtSize(text, fSize);
    page.drawText(text, {
      x:       (width  - tW) / 2,
      y:       (height - fSize) / 2,
      size:    fSize,
      font,
      color:   rgb(rVal, gVal, bVal),
      opacity: opacVal,
      rotate:  degrees(angleDeg),
    });
  });

  return { buffer: Buffer.from(await doc.save()), ext:"pdf", mime:"application/pdf", suffix:"_watermarked" };
}
*/

// ═══════════════════════════════════════════════════════════════════════════
// 2. SIGN PDF TOOL — Çiz veya PNG yükle + PDF üzerinde konumlandır
// ═══════════════════════════════════════════════════════════════════════════

export function SignPdfTool() {
  const { language } = useLanguageStore();
  const t    = translations[language];
  const isEn = language === "en";

  type SignMode = "draw" | "upload";
  type Step     = "sign" | "position" | "processing" | "completed" | "error";

  const [step,        setStep       ] = useState<Step>("sign");
  const [signMode,    setSignMode   ] = useState<SignMode>("draw");
  const [pdfFile,     setPdfFile    ] = useState<File | null>(null);
  const [signDataUrl, setSignDataUrl] = useState<string | null>(null);
  const [progress,    setProgress   ] = useState(0);
  const [statusLabel, setStatusLabel] = useState("");
  const [error,       setError      ] = useState<string | null>(null);

  // İmza konumu (PDF preview üzerinde %)
  const [sigPos, setSigPos]       = useState({ x: 10, y: 10 });   // % sol-üst
  const [sigSize, setSigSize]     = useState({ w: 30, h: 10 });    // % genişlik-yükseklik
  const [dragging, setDragging]   = useState(false);
  const [resizing, setResizing]   = useState(false);
  const [dragStart, setDragStart] = useState({ mx: 0, my: 0, ox: 0, oy: 0 });

  const sigCanvasRef   = useRef<SignatureCanvas | null>(null);
  const sigUploadRef   = useRef<HTMLInputElement>(null);
  const pdfUploadRef   = useRef<HTMLInputElement>(null);
  const previewRef     = useRef<HTMLDivElement>(null);
  const resultBlobRef  = useRef<Blob | null>(null);
  const successFlagRef = useRef<boolean>(false);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);

  // İmzayı data URL olarak al (çizim modunda)
  const captureSignature = () => {
    if (sigCanvasRef.current?.isEmpty()) {
      setError(isEn ? "Please draw your signature first." : "Lütfen önce imzanızı çizin.");
      return;
    }
    setSignDataUrl(sigCanvasRef.current!.toDataURL("image/png"));
    setError(null);
  };

  // İmza PNG yükleme
  const handleSignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setSignDataUrl(ev.target?.result as string);
    reader.readAsDataURL(f);
    e.target.value = "";
  };

  // PDF sürükleme/boyutlandırma (konum %)
  const onMouseDown = (e: React.MouseEvent, type: "drag" | "resize") => {
    e.preventDefault();
    if (type === "drag") {
      setDragging(true);
      setDragStart({ mx: e.clientX, my: e.clientY, ox: sigPos.x, oy: sigPos.y });
    } else {
      setResizing(true);
      setDragStart({ mx: e.clientX, my: e.clientY, ox: sigSize.w, oy: sigSize.h });
    }
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!previewRef.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      const dx = ((e.clientX - dragStart.mx) / rect.width)  * 100;
      const dy = ((e.clientY - dragStart.my) / rect.height) * 100;

      if (dragging) {
        setSigPos({
          x: Math.max(0, Math.min(70, dragStart.ox + dx)),
          y: Math.max(0, Math.min(85, dragStart.oy + dy)),
        });
      }
      if (resizing) {
        setSigSize({
          w: Math.max(5,  Math.min(80, dragStart.ox + dx)),
          h: Math.max(3,  Math.min(40, dragStart.oy + dy)),
        });
      }
    };
    const onUp = () => { setDragging(false); setResizing(false); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [dragging, resizing, dragStart]);

  // PDF'e imzayı işle
  const applySignature = async () => {
    if (!pdfFile || !signDataUrl) return;
    setStep("processing");
    setStatusLabel(isEn ? "Embedding signature..." : "İmza yerleştiriliyor...");
    setProgress(0);
    resultBlobRef.current  = null;
    successFlagRef.current = false;

    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += 80;
      const eased = 1 - Math.pow(1 - Math.min(elapsed / 7000, 1), 3);
      setProgress(Math.min(eased * 90, 90));
    }, 80);

    try {
      // pdf-lib ile client-side imza ekleme
      const { PDFDocument, degrees } = await import("pdf-lib");

      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc   = await PDFDocument.load(pdfBytes);

      // PNG data URL → Uint8Array
      const base64 = signDataUrl.split(",")[1];
      const imgBuf = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const pdfImg = await pdfDoc.embedPng(imgBuf);

      const page       = pdfDoc.getPage(0);
      const { width: pW, height: pH } = page.getSize();

      // % konumunu pt'ye çevir
      const x = (sigPos.x  / 100) * pW;
      const y = pH - ((sigPos.y + sigSize.h) / 100) * pH;  // PDF y-ekseni ters
      const w = (sigSize.w / 100) * pW;
      const h = (sigSize.h / 100) * pH;

      page.drawImage(pdfImg, { x, y, width: w, height: h });

      const outBytes = await pdfDoc.save();
      const blob     = new Blob([outBytes], { type: "application/pdf" });

      if (blob.size === 0) throw new Error("Boş çıktı");
      await blob.arrayBuffer();

      resultBlobRef.current  = blob;
      successFlagRef.current = true;

      clearInterval(timerRef.current!);
      setProgress(100);
      setStep("completed");
      trackEvent("PdfSigned");
    } catch (e: any) {
      clearInterval(timerRef.current!);
      setError(isEn ? `Failed: ${e.message}` : `Hata: ${e.message}`);
      setStep("error");
    }
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPdfFile(null); setSignDataUrl(null); setStep("sign");
    setProgress(0); setStatusLabel(""); setError(null);
    setSigPos({ x: 10, y: 10 }); setSigSize({ w: 30, h: 10 });
    resultBlobRef.current = null; successFlagRef.current = false;
    sigCanvasRef.current?.clear();
  };

  // ── İmza adımı ────────────────────────────────────────────────────────────
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

        {/* Mod seçici */}
        <Card className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            {isEn ? "1. Create Your Signature" : "1. İmzanızı Oluşturun"}
          </h3>

          <div className="flex gap-3 mb-6">
            {(["draw","upload"] as SignMode[]).map(m => (
              <button key={m} onClick={() => setSignMode(m)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm border transition-all ${
                  signMode === m
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-white text-slate-600 border-slate-200 hover:border-primary/50"
                }`}>
                {m === "draw"
                  ? <><PenLine className="w-4 h-4" />{isEn?"Draw":"Çiz"}</>
                  : <><ImageIcon className="w-4 h-4" />{isEn?"Upload PNG":"PNG Yükle"}</>
                }
              </button>
            ))}
          </div>

          {signMode === "draw" ? (
            <div>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden bg-slate-50"
                style={{ touchAction: "none" }}>
                <SignatureCanvas
                  ref={sigCanvasRef}
                  penColor="#1e293b"
                  canvasProps={{ width: 600, height: 200, className: "w-full h-auto" }}
                />
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" size="sm" onClick={() => sigCanvasRef.current?.clear()}
                  className="rounded-full">
                  <Trash2 className="w-4 h-4 mr-2" />{isEn?"Clear":"Temizle"}
                </Button>
                <Button size="sm" onClick={captureSignature}
                  className="rounded-full px-6">
                  {isEn ? "Use This Signature →" : "Bu İmzayı Kullan →"}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <input type="file" ref={sigUploadRef} accept=".png,.jpg,.jpeg" className="hidden"
                onChange={handleSignUpload} />
              <button onClick={() => sigUploadRef.current?.click()}
                className="w-full rounded-2xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-slate-50 transition-all">
                <ImageIcon className="w-10 h-10 text-slate-300" />
                <span className="text-slate-500 font-medium">
                  {isEn ? "Click to upload signature image (PNG/JPG)" : "İmza görüntüsü yükleyin (PNG/JPG)"}
                </span>
              </button>
              {signDataUrl && (
                <div className="mt-4 p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                  <img src={signDataUrl} alt="sig" className="h-16 object-contain" />
                  <span className="text-sm text-emerald-600 font-semibold">
                    ✓ {isEn ? "Signature loaded" : "İmza yüklendi"}
                  </span>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* PDF yükleme */}
        {signDataUrl && (
          <Card className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              {isEn ? "2. Upload Your PDF" : "2. PDF Dosyanızı Yükleyin"}
            </h3>
            <input type="file" ref={pdfUploadRef} accept=".pdf" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if(f) { setPdfFile(f); setStep("position"); } e.target.value=""; }} />
            <Button onClick={() => pdfUploadRef.current?.click()}
              className="rounded-full px-8 font-bold h-12">
              <Upload className="w-4 h-4 mr-2" />
              {isEn ? "Choose PDF File" : "PDF Dosyası Seçin"}
            </Button>
          </Card>
        )}
      </div>
    );
  }

  // ── Konum adımı ───────────────────────────────────────────────────────────
  if (step === "position") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            {isEn ? "3. Position Your Signature" : "3. İmzayı Konumlandırın"}
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            {isEn
              ? "Drag to move · Drag corner handle to resize"
              : "Hareket ettirmek için sürükleyin · Köşeden boyutlandırın"}
          </p>

          {/* PDF preview alanı (gri arka plan = sayfa simülasyonu) */}
          <div
            ref={previewRef}
            className="relative bg-slate-100 rounded-2xl overflow-hidden select-none"
            style={{ paddingBottom: "141.4%", cursor: dragging ? "grabbing" : "default" }} // A4 oranı
          >
            {/* Sayfa arka planı */}
            <div className="absolute inset-0 bg-white m-4 rounded shadow-lg" />

            {/* PDF adı */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs text-slate-400 font-medium">
              {pdfFile?.name}
            </div>

            {/* İmza kutusu */}
            {signDataUrl && (
              <div
                className="absolute border-2 border-primary/70 rounded cursor-grab shadow-lg"
                style={{
                  left:   `${sigPos.x}%`,
                  top:    `${sigPos.y}%`,
                  width:  `${sigSize.w}%`,
                  height: `${sigSize.h}%`,
                }}
                onMouseDown={e => onMouseDown(e, "drag")}
              >
                <img src={signDataUrl} alt="sig"
                  className="w-full h-full object-contain pointer-events-none" />

                {/* Boyutlandırma tutamacı */}
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-tl cursor-se-resize"
                  onMouseDown={e => { e.stopPropagation(); onMouseDown(e, "resize"); }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={reset} className="rounded-full">
              <RefreshCw className="w-4 h-4 mr-2" />{isEn?"Start Over":"Baştan Başla"}
            </Button>
            <Button onClick={applySignature} className="rounded-full px-8 font-bold">
              {isEn ? "Apply Signature →" : "İmzayı Uygula →"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <ProcessingCard progress={progress} statusLabel={statusLabel} isEn={isEn} t={t} />
      </div>
    );
  }

  // completed
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <CompletedCard
        fileName={pdfFile?.name ?? ""}
        blobRef={resultBlobRef} successRef={successFlagRef}
        ext="pdf" toolName="Sign PDF"
        onReset={reset} isEn={isEn} t={t}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. TRANSLATE PDF TOOL — Dil seçimi + LibreTranslate backend
// ═══════════════════════════════════════════════════════════════════════════

const LANGUAGE_LIST = [
  { code: "tr", label: "Türkçe",    flag: "🇹🇷" },
  { code: "en", label: "English",   flag: "🇬🇧" },
  { code: "de", label: "Deutsch",   flag: "🇩🇪" },
  { code: "fr", label: "Français",  flag: "🇫🇷" },
  { code: "es", label: "Español",   flag: "🇪🇸" },
  { code: "it", label: "Italiano",  flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ru", label: "Русский",   flag: "🇷🇺" },
  { code: "ja", label: "日本語",    flag: "🇯🇵" },
  { code: "zh", label: "中文",      flag: "🇨🇳" },
  { code: "ar", label: "العربية",   flag: "🇸🇦" },
  { code: "ko", label: "한국어",    flag: "🇰🇷" },
  { code: "nl", label: "Nederlands",flag: "🇳🇱" },
  { code: "pl", label: "Polski",    flag: "🇵🇱" },
  { code: "sv", label: "Svenska",   flag: "🇸🇪" },
];

export function TranslatePdfTool() {
  const { language } = useLanguageStore();
  const t    = translations[language];
  const isEn = language === "en";

  const [targetLang,  setTargetLang  ] = useState("tr");
  const [apiUrl,      setApiUrl      ] = useState("https://libretranslate.com");
  const [apiKey,      setApiKey      ] = useState("");
  const [showAdvanced,setShowAdvanced] = useState(false);

  const [file,        setFile        ] = useState<File | null>(null);
  const [status,      setStatus      ] = useState<"idle"|"processing"|"completed"|"error">("idle");
  const [progress,    setProgress    ] = useState(0);
  const [statusLabel, setStatusLabel ] = useState("");
  const [error,       setError       ] = useState<string | null>(null);
  const [elapsed,     setElapsedSecs ] = useState(0);

  const resultBlobRef  = useRef<Blob | null>(null);
  const successFlagRef = useRef<boolean>(false);
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTranslation = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus("processing");
    setProgress(0);
    setElapsedSecs(0);
    setStatusLabel(isEn ? "Extracting text..." : "Metin çıkarılıyor...");
    resultBlobRef.current  = null;
    successFlagRef.current = false;

    // Progress animasyonu (çeviri ağır iş — yavaş ilerler)
    let prog = 0;
    timerRef.current = setInterval(() => {
      prog += 0.3;
      const eased = 1 - Math.pow(1 - Math.min(prog / 100, 1), 3);
      setProgress(Math.min(eased * 88, 88));
      if (prog > 15) setStatusLabel(isEn ? "Translating chunks..." : "Parçalar çevriliyor...");
      if (prog > 50) setStatusLabel(isEn ? "Building PDF..."       : "PDF oluşturuluyor...");
    }, 500);

    // Geçen süre sayacı
    elapsedRef.current = setInterval(() => setElapsedSecs(s => s + 1), 1000);

    try {
      const blob = await uploadFiles(
        [selectedFile],
        "/api/translate-pdf",
        { targetLang, apiUrl, apiKey },
        p => setProgress(Math.max(p, progress)),
        58_000  // 58s timeout
      );

      if (blob.size === 0) throw new Error("Boş çıktı");
      await blob.arrayBuffer();

      resultBlobRef.current  = blob;
      successFlagRef.current = true;

      clearInterval(timerRef.current!);
      clearInterval(elapsedRef.current!);
      setProgress(100);
      setStatus("completed");
      trackEvent("PdfTranslated", { targetLang });
    } catch (e: any) {
      clearInterval(timerRef.current!);
      clearInterval(elapsedRef.current!);
      setError(isEn ? `Failed: ${e.message}` : `Hata: ${e.message}`);
      setStatus("error");
    }
  };

  const reset = () => {
    if (timerRef.current)   clearInterval(timerRef.current);
    if (elapsedRef.current) clearInterval(elapsedRef.current);
    setFile(null); setStatus("idle"); setProgress(0);
    setStatusLabel(""); setError(null); setElapsedSecs(0);
    resultBlobRef.current = null; successFlagRef.current = false;
  };

  if (status === "processing") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* FIX 4: Çeviri = ağır iş → isHeavy=true */}
        <ProcessingCard
          progress={progress}
          statusLabel={`${statusLabel} (${elapsed}s)`}
          isHeavy={true}
          isEn={isEn}
          t={t}
        />
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <CompletedCard
          fileName={file?.name ?? ""}
          blobRef={resultBlobRef} successRef={successFlagRef}
          ext="pdf" toolName="Translate PDF"
          onReset={reset} isEn={isEn} t={t}
        />
      </div>
    );
  }

  const selectedLang = LANGUAGE_LIST.find(l => l.code === targetLang);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Dil Seçimi */}
      <Card className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
          {isEn ? "Translation Settings" : "Çeviri Ayarları"}
        </h3>

        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-3">
            {isEn ? "Target Language" : "Hedef Dil"}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {LANGUAGE_LIST.map(lang => (
              <button key={lang.code} onClick={() => setTargetLang(lang.code)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-sm font-semibold transition-all ${
                  targetLang === lang.code
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-slate-100 hover:border-primary/30 text-slate-600"
                }`}>
                <span className="text-xl">{lang.flag}</span>
                <span className="text-xs">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Gelişmiş ayarlar (LibreTranslate URL + API key) */}
        <button onClick={() => setShowAdvanced(!showAdvanced)}
          className="mt-6 flex items-center gap-2 text-sm text-slate-400 hover:text-primary font-medium transition-colors">
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced?"rotate-180":""}`} />
          {isEn ? "Advanced (Custom LibreTranslate)" : "Gelişmiş (Özel LibreTranslate)"}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isEn ? "LibreTranslate API URL" : "LibreTranslate API Adresi"}
              </label>
              <input type="url" value={apiUrl} onChange={e => setApiUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary transition-all"
                placeholder="https://libretranslate.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                {isEn ? "API Key (optional)" : "API Anahtarı (opsiyonel)"}
              </label>
              <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary transition-all"
                placeholder={isEn ? "Leave empty for public endpoint" : "Public endpoint için boş bırakın"} />
            </div>
            <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-xl">
              {isEn
                ? "⚠ Public endpoint has rate limits. For production use, host your own LibreTranslate instance."
                : "⚠ Public endpoint rate-limit içerir. Prodüksiyonda kendi LibreTranslate sunucunuzu barındırın."}
            </p>
          </div>
        )}
      </Card>

      {/* Hata */}
      {status === "error" && error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Alanı */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f=e.dataTransfer.files[0]; if(f) startTranslation(f); }}
        className="cursor-pointer rounded-3xl border-2 border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-white hover:border-primary/50 hover:shadow-xl transition-all group"
      >
        <input type="file" ref={fileInputRef} accept=".pdf" className="hidden"
          onChange={e => { const f=e.target.files?.[0]; if(f) startTranslation(f); e.target.value=""; }} />

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform mb-4">
          <Languages className="w-10 h-10 text-primary" />
        </div>
        <p className="font-bold text-slate-800 mb-1">
          {isEn ? "Drop your PDF to translate" : "Çevirmek için PDF bırakın"}
        </p>
        <p className="text-slate-400 text-sm mb-2">
          {isEn ? `Will translate to: ` : `Hedef dil: `}
          <strong className="text-slate-700">{selectedLang?.flag} {selectedLang?.label}</strong>
        </p>
        <p className="text-amber-600 text-xs font-medium bg-amber-50 px-3 py-1.5 rounded-full mb-6">
          {isEn ? "⏱ Translation may take 30–60 seconds" : "⏱ Çeviri 30–60 saniye sürebilir"}
        </p>
        <Button size="lg" className="rounded-full px-10 font-bold h-12">
          {t.common.choose_file}
        </Button>
      </div>
    </div>
  );
}