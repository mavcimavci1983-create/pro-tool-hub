/**
 * ConverterTools.tsx — Client-side CSV ↔ JSON, XML → JSON
 * All conversion in browser; Web Worker for large files; validation + Copy + Download.
 */

import React, { useState, useRef, useCallback } from "react";
import { Upload, Download, RefreshCw, Copy, CheckCircle2, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";

const translations = translationsData as Record<string, any>;

const LARGE_FILE_THRESHOLD = 300 * 1024; // 300 KB → use worker

function runInWorker(type: "csv2json" | "json2csv" | "xml2json", payload: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("../../workers/converter.worker.ts", import.meta.url), { type: "module" });
    worker.onmessage = (e: MessageEvent<{ result?: string; error?: string }>) => {
      worker.terminate();
      if (e.data.error) reject(new Error(e.data.error));
      else resolve(e.data.result ?? "");
    };
    worker.onerror = () => {
      worker.terminate();
      reject(new Error("Worker failed"));
    };
    worker.postMessage({ type, payload });
  });
}

// ─── Validation (sync, quick) ─────────────────────────────────────────────────
function validateCSV(text: string): { ok: true } | { ok: false; message: string } {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) return { ok: false, message: "CSV file is empty." };
  return { ok: true };
}

function validateJSON(text: string): { ok: true } | { ok: false; message: string } {
  try {
    const data = JSON.parse(text);
    if (!Array.isArray(data)) return { ok: false, message: "JSON must be an array of objects." };
    if (data.length === 0) return { ok: false, message: "JSON array is empty." };
    if (data.some((x) => x === null || typeof x !== "object" || Array.isArray(x))) {
      return { ok: false, message: "Each array item must be an object." };
    }
    return { ok: true };
  } catch (e: any) {
    const msg = e?.message ?? "Invalid JSON.";
    return { ok: false, message: msg };
  }
}

function validateXML(text: string): { ok: true } | { ok: false; message: string } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/xml");
    const err = doc.querySelector("parsererror");
    if (err) return { ok: false, message: err.textContent?.trim() || "Invalid XML." };
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e?.message ?? "Invalid XML." };
  }
}

// ─── Inline (main thread) conversion for small files ──────────────────────────
function parseCSVLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (!inQuotes && (c === "," || c === "\t")) {
      out.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  out.push(cur.trim());
  return out;
}

function csvToJsonSync(text: string): string {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.length > 0);
  const headers = parseCSVLine(lines[0]);
  const data = lines.slice(1).map((row) => Object.fromEntries(headers.map((h, i) => [h, parseCSVLine(row)[i] ?? ""])));
  return JSON.stringify(data, null, 2);
}

function jsonToCsvSync(text: string): string {
  const data = JSON.parse(text) as Record<string, unknown>[];
  const headers = Object.keys(data[0]);
  const rows = data.map((r) => headers.map((h) => String(r[h] ?? "").includes(",") ? `"${String(r[h] ?? "").replace(/"/g, '""')}"` : (r[h] ?? "")));
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

function xmlToJsonSync(text: string): string {
  const doc = new DOMParser().parseFromString(text, "text/xml");
  const err = doc.querySelector("parsererror");
  if (err) throw new Error(err.textContent ?? "Invalid XML");
  function toJson(node: ChildNode): unknown {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent?.trim() || null;
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const el = node as Element;
    const children = Array.from(el.childNodes).filter((n) => n.nodeType !== Node.COMMENT_NODE);
    const textOnly = children.every((n) => n.nodeType === Node.TEXT_NODE);
    if (textOnly) {
      const t = el.textContent?.trim() ?? "";
      const attrs: Record<string, string> = {};
      el.getAttributeNames().forEach((a) => (attrs[a] = el.getAttribute(a) ?? ""));
      if (Object.keys(attrs).length === 0) return t || null;
      return { _: t, ...attrs };
    }
    const obj: Record<string, unknown> = {};
    children.forEach((child) => {
      const v = toJson(child);
      if (v === null) return;
      const name = (child as Element).tagName || "_";
      if (obj[name] === undefined) obj[name] = v;
      else if (Array.isArray(obj[name])) (obj[name] as unknown[]).push(v);
      else obj[name] = [obj[name], v];
    });
    el.getAttributeNames().forEach((a) => ((obj as Record<string, unknown>)[`@${a}`] = el.getAttribute(a) ?? ""));
    return obj;
  }
  return JSON.stringify(toJson(doc.documentElement), null, 2);
}

// ─── Hook ───────────────────────────────────────────────────────────────────
type ConvStatus = "idle" | "validating" | "processing" | "done" | "error";

function useConverterTool() {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const t = (translations[language] ?? translations.en)?.converter ?? {};
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ConvStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string>("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [outputExt, setOutputExt] = useState<string>("json");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    setResultText("");
    setResultBlob(null);
  }, []);

  const runProgressAnim = useCallback((durationMs: number) => {
    setProgress(0);
    let elapsed = 0;
    timerRef.current = setInterval(() => {
      elapsed += 80;
      const p = Math.min(95, Math.round((1 - Math.pow(1 - elapsed / durationMs, 2)) * 95));
      setProgress(p);
    }, 80);
  }, []);

  return {
    isEn,
    t,
    file,
    setFile,
    status,
    setStatus,
    progress,
    setProgress,
    error,
    setError,
    resultText,
    setResultText,
    resultBlob,
    setResultBlob,
    outputExt,
    setOutputExt,
    reset,
    runProgressAnim,
    timerRef,
  };
}

// ─── Shared UI ──────────────────────────────────────────────────────────────
function ConverterDropZone({
  accept,
  hint,
  onFiles,
  isEn,
  error,
}: {
  accept: string;
  hint: string;
  onFiles: (files: File[]) => void;
  isEn: boolean;
  error?: string | null;
}) {
  const [over, setOver] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="w-full space-y-4">
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const files = Array.from(e.dataTransfer.files);
          if (files.length) onFiles([files[0]]);
        }}
        className={
          "rounded-3xl border-2 border-dashed p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all " +
          (over ? "border-primary bg-primary/5" : error ? "border-rose-300 bg-rose-50/40" : "border-slate-200 bg-slate-50/50 hover:border-primary/60 hover:bg-white")
        }
      >
        <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files; if (f?.length) onFiles([f[0]]); e.target.value = ""; }} />
        <div className={"p-6 rounded-2xl border mb-6 " + (error ? "bg-rose-50 border-rose-100" : "bg-white border-slate-100")}>
          <Upload className={"w-12 h-12 " + (error ? "text-rose-500" : "text-primary")} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">{isEn ? "Drop file here" : "Dosyayı buraya bırakın"}</h3>
        <p className="text-slate-500 text-sm mb-4">{hint}</p>
        <Button size="lg" variant={error ? "destructive" : "default"} className="rounded-full px-10 font-bold">
          {isEn ? "Choose File" : "Dosya Seç"}
        </Button>
      </div>
      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{isEn ? "Error" : "Hata"}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function saveBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function ConverterResultCard({
  resultText,
  resultBlob,
  filename,
  outputExt,
  onReset,
  isEn,
  inputName,
}: {
  resultText: string;
  resultBlob: Blob;
  filename: string;
  outputExt: string;
  onReset: () => void;
  isEn: boolean;
  inputName?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(resultText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <Card className="p-10 rounded-3xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white shadow-2xl max-w-4xl mx-auto">
      <div className="flex flex-col items-center text-center">
        <div className="bg-emerald-100 text-emerald-600 p-5 rounded-full mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{isEn ? "Done!" : "Hazır!"}</h3>
        <p className="text-slate-500 text-sm mb-6 truncate max-w-xs">{inputName}</p>
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <Button size="lg" onClick={copy} variant="outline" className="rounded-full px-6 font-bold">
            {copied ? <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" /> : <Copy className="w-5 h-5 mr-2" />}
            {copied ? (isEn ? "Copied!" : "Kopyalandı!") : (isEn ? "Copy to Clipboard" : "Panoya Kopyala")}
          </Button>
          <Button size="lg" onClick={() => saveBlob(resultBlob, filename)} className="rounded-full px-6 font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
            <Download className="w-5 h-5 mr-2" />
            {isEn ? `Download .${outputExt}` : `İndir .${outputExt}`}
          </Button>
        </div>
        <Button variant="ghost" onClick={onReset} className="text-slate-500 hover:text-primary font-semibold">
          <RefreshCw className="w-4 h-4 mr-2" />
          {isEn ? "Convert another file" : "Başka dosya dönüştür"}
        </Button>
        <div className="mt-6 flex items-center gap-2 text-slate-400 text-xs">
          <ShieldCheck className="w-4 h-4" />
          {isEn ? "100% client-side — file never uploaded" : "Tamamen tarayıcıda — dosya yüklenmedi"}
        </div>
      </div>
    </Card>
  );
}

// ─── CSV to JSON ─────────────────────────────────────────────────────────────
export function CsvToJsonTool() {
  const hook = useConverterTool();
  const { isEn, t, status, setStatus, setError, setResultText, setResultBlob, setOutputExt, setFile, progress, runProgressAnim, timerRef, reset, resultText, resultBlob, file, error } = hook;

  const process = useCallback(
    async (f: File) => {
      setFile(f);
      setError(null);
      setStatus("validating");
      let text: string;
      try {
        text = await f.text();
      } catch {
        setError(isEn ? "Could not read file." : "Dosya okunamadı.");
        setStatus("error");
        return;
      }
      const valid = validateCSV(text);
      if (!valid.ok) {
        setError(valid.message);
        setStatus("error");
        return;
      }
      setStatus("processing");
      setOutputExt("json");
      runProgressAnim(2000);
      try {
        let result: string;
        if (f.size > LARGE_FILE_THRESHOLD) {
          result = await runInWorker("csv2json", text);
        } else {
          result = csvToJsonSync(text);
        }
        if (timerRef.current) clearInterval(timerRef.current);
        hook.setProgress(100);
        const blob = new Blob([result], { type: "application/json" });
        setResultText(result);
        setResultBlob(blob);
        setStatus("done");
      } catch (e: any) {
        if (timerRef.current) clearInterval(timerRef.current);
        setError(e?.message ?? (isEn ? "Conversion failed." : "Dönüşüm başarısız."));
        setStatus("error");
      }
    },
    [isEn, runProgressAnim, timerRef]
  );

  if (status === "processing" || status === "validating") {
    return (
      <Card className="p-12 rounded-3xl border border-slate-200 bg-white shadow-xl flex flex-col items-center text-center max-w-4xl mx-auto">
        <Loader2 className="w-14 h-14 text-primary animate-spin mb-6" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">{isEn ? "Converting…" : "Dönüştürülüyor…"}</h3>
        <p className="text-slate-500 text-sm mb-6">{isEn ? "Processing in browser — your file never leaves your device." : "Tarayıcıda işleniyor — dosyanız cihazınızdan ayrılmaz."}</p>
        <Progress value={progress} className="w-full max-w-sm h-2 rounded-full" />
      </Card>
    );
  }

  if (status === "done" && resultBlob) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
      navigator.clipboard.writeText(resultText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
    };
    const filename = (file?.name ?? "converted").replace(/\.[^.]+$/, "") + ".json";
    return (
      <Card className="p-10 rounded-3xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white shadow-2xl max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="bg-emerald-100 text-emerald-600 p-5 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{isEn ? "Done!" : "Hazır!"}</h3>
          <p className="text-slate-500 text-sm mb-6 truncate max-w-xs">{file?.name}</p>
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <Button size="lg" onClick={copy} variant="outline" className="rounded-full px-6 font-bold">
              {copied ? <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" /> : <Copy className="w-5 h-5 mr-2" />}
              {copied ? (isEn ? "Copied!" : "Kopyalandı!") : (isEn ? "Copy to Clipboard" : "Panoya Kopyala")}
            </Button>
            <Button size="lg" onClick={() => saveBlob(resultBlob, filename)} className="rounded-full px-6 font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
              <Download className="w-5 h-5 mr-2" />
              {isEn ? "Download .json" : "İndir .json"}
            </Button>
          </div>
          <Button variant="ghost" onClick={reset} className="text-slate-500 hover:text-primary font-semibold">
            <RefreshCw className="w-4 h-4 mr-2" />
            {isEn ? "Convert another file" : "Başka dosya dönüştür"}
          </Button>
          <div className="mt-6 flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4" />
            {isEn ? "100% client-side — file never uploaded" : "Tamamen tarayıcıda — dosya yüklenmedi"}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <ConverterDropZone
        accept=".csv,text/csv,text/plain"
        hint={isEn ? "CSV or comma-separated file. Format is validated on drop." : "CSV veya virgülle ayrılmış dosya. Biçim seçildiğinde doğrulanır."}
        onFiles={(files) => process(files[0])}
        isEn={isEn}
        error={error}
      />
    </div>
  );
}

// ─── JSON to CSV ─────────────────────────────────────────────────────────────
export function JsonToCsvTool() {
  const hook = useConverterTool();
  const { isEn, status, setStatus, setError, setResultText, setResultBlob, setOutputExt, setFile, runProgressAnim, timerRef, reset, resultText, resultBlob, file, error } = hook;

  const process = useCallback(
    async (f: File) => {
      setFile(f);
      setError(null);
      setStatus("validating");
      let text: string;
      try {
        text = await f.text();
      } catch {
        setError(isEn ? "Could not read file." : "Dosya okunamadı.");
        setStatus("error");
        return;
      }
      const valid = validateJSON(text);
      if (!valid.ok) {
        setError(valid.message);
        setStatus("error");
        return;
      }
      setStatus("processing");
      setOutputExt("csv");
      runProgressAnim(2000);
      try {
        let result: string;
        if (f.size > LARGE_FILE_THRESHOLD) {
          result = await runInWorker("json2csv", text);
        } else {
          result = jsonToCsvSync(text);
        }
        if (timerRef.current) clearInterval(timerRef.current);
        hook.setProgress(100);
        const blob = new Blob([result], { type: "text/csv" });
        setResultText(result);
        setResultBlob(blob);
        setStatus("done");
      } catch (e: any) {
        if (timerRef.current) clearInterval(timerRef.current);
        setError(e?.message ?? (isEn ? "Conversion failed." : "Dönüşüm başarısız."));
        setStatus("error");
      }
    },
    [isEn, runProgressAnim, timerRef]
  );

  if (status === "processing" || status === "validating") {
    return (
      <Card className="p-12 rounded-3xl border border-slate-200 bg-white shadow-xl flex flex-col items-center text-center max-w-4xl mx-auto">
        <Loader2 className="w-14 h-14 text-primary animate-spin mb-6" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">{isEn ? "Converting…" : "Dönüştürülüyor…"}</h3>
        <p className="text-slate-500 text-sm mb-6">{isEn ? "Processing in browser." : "Tarayıcıda işleniyor."}</p>
        <Progress value={hook.progress} className="w-full max-w-sm h-2 rounded-full" />
      </Card>
    );
  }

  if (status === "done" && resultBlob) {
    const filename = (file?.name ?? "converted").replace(/\.[^.]+$/, "") + ".csv";
    return (
      <ConverterResultCard resultText={resultText} resultBlob={resultBlob} filename={filename} outputExt="csv" onReset={reset} isEn={isEn} inputName={file?.name} />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <ConverterDropZone
        accept=".json,application/json"
        hint={isEn ? "JSON file (array of objects). Format is validated on drop." : "JSON dosyası (nesneler dizisi). Biçim seçildiğinde doğrulanır."}
        onFiles={(files) => process(files[0])}
        isEn={isEn}
        error={error}
      />
    </div>
  );
}

// ─── XML to JSON ─────────────────────────────────────────────────────────────
export function XmlToJsonTool() {
  const hook = useConverterTool();
  const { isEn, status, setStatus, setError, setResultText, setResultBlob, setOutputExt, setFile, runProgressAnim, timerRef, reset, resultText, resultBlob, file, error } = hook;

  const process = useCallback(
    async (f: File) => {
      setFile(f);
      setError(null);
      setStatus("validating");
      let text: string;
      try {
        text = await f.text();
      } catch {
        setError(isEn ? "Could not read file." : "Dosya okunamadı.");
        setStatus("error");
        return;
      }
      const valid = validateXML(text);
      if (!valid.ok) {
        setError(valid.message);
        setStatus("error");
        return;
      }
      setStatus("processing");
      setOutputExt("json");
      runProgressAnim(2000);
      try {
        let result: string;
        if (f.size > LARGE_FILE_THRESHOLD) {
          result = await runInWorker("xml2json", text);
        } else {
          result = xmlToJsonSync(text);
        }
        if (timerRef.current) clearInterval(timerRef.current);
        hook.setProgress(100);
        const blob = new Blob([result], { type: "application/json" });
        setResultText(result);
        setResultBlob(blob);
        setStatus("done");
      } catch (e: any) {
        if (timerRef.current) clearInterval(timerRef.current);
        setError(e?.message ?? (isEn ? "Conversion failed." : "Dönüşüm başarısız."));
        setStatus("error");
      }
    },
    [isEn, runProgressAnim, timerRef]
  );

  if (status === "processing" || status === "validating") {
    return (
      <Card className="p-12 rounded-3xl border border-slate-200 bg-white shadow-xl flex flex-col items-center text-center max-w-4xl mx-auto">
        <Loader2 className="w-14 h-14 text-primary animate-spin mb-6" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">{isEn ? "Converting…" : "Dönüştürülüyor…"}</h3>
        <p className="text-slate-500 text-sm mb-6">{isEn ? "Processing in browser." : "Tarayıcıda işleniyor."}</p>
        <Progress value={hook.progress} className="w-full max-w-sm h-2 rounded-full" />
      </Card>
    );
  }

  if (status === "done" && resultBlob) {
    const filename = (file?.name ?? "converted").replace(/\.[^.]+$/, "") + ".json";
    return (
      <ConverterResultCard resultText={resultText} resultBlob={resultBlob} filename={filename} outputExt="json" onReset={reset} isEn={isEn} inputName={file?.name} />
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <ConverterDropZone
        accept=".xml,application/xml,text/xml"
        hint={isEn ? "XML file. Format is validated on drop." : "XML dosyası. Biçim seçildiğinde doğrulanır."}
        onFiles={(files) => process(files[0])}
        isEn={isEn}
        error={error}
      />
    </div>
  );
}

// Done card uses useState for "copied" — ResultCard component handles Copy + Download + copied state. `useState` hook'u kullanıldığı için bunu ayrı bir bileşene taşıyorum.
