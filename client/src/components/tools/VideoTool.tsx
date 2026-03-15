import { useState, useRef } from "react";
import {
  Youtube,
  Download,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  FileText,
  ImageIcon,
  ArrowRight,
  Wrench,
  Instagram,
  Twitter,
  Music,
  Video,
  ExternalLink,
} from "lucide-react";
import { Link } from "wouter";
import { useLanguageStore } from "@/lib/languageStore";

// ─── helpers ────────────────────────────────────────────────────────────────

function isYouTubeUrl(url: string) {
  return /youtube\.com|youtu\.be/i.test(url);
}

function isInstagramUrl(url: string) {
  return /instagram\.com/i.test(url);
}

function isTwitterUrl(url: string) {
  return /twitter\.com|x\.com/i.test(url);
}

// ─── Quick Navigation ────────────────────────────────────────────────────────

function QuickNav({ language }: { language: string }) {
  const isEn = language === "en";
  const links = [
    {
      href: "/tools/merge-pdf",
      icon: <FileText className="w-4 h-4 text-red-500" />,
      label: isEn ? "Merge PDF" : "PDF Birleştir",
    },
    {
      href: "/tools/compress-pdf",
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
      label: isEn ? "Compress PDF" : "PDF Sıkıştır",
    },
    {
      href: "/tools/compress-image",
      icon: <ImageIcon className="w-4 h-4 text-indigo-500" />,
      label: isEn ? "Compress Image" : "Görsel Sıkıştır",
    },
    {
      href: "/tools/pdf-to-word",
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      label: isEn ? "PDF to Word" : "PDF → Word",
    },
    {
      href: "/tools/resize-image",
      icon: <ImageIcon className="w-4 h-4 text-purple-500" />,
      label: isEn ? "Resize Image" : "Görsel Boyutlandır",
    },
  ];

  return (
    <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
        {isEn ? "Quick Navigation" : "Hızlı Erişim"}
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-50 cursor-pointer transition-all text-xs font-semibold text-slate-700 group">
              {l.icon}
              {l.label}
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── YouTube Maintenance Banner ───────────────────────────────────────────────

function YouTubeMaintenanceBanner({ language }: { language: string }) {
  const isEn = language === "en";
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-red-50 p-2 rounded-xl border border-red-100">
          <Youtube className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {isEn ? "YouTube Video Downloader" : "YouTube Video İndirici"}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {isEn ? "720p / 1080p quality" : "720p / 1080p kalite"}
          </p>
        </div>
      </div>

      {/* Maintenance Notice */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-4">
        <div className="mt-0.5 shrink-0">
          <Wrench className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <p className="font-bold text-amber-800 text-sm mb-1">
            {isEn
              ? "YouTube Engine is under maintenance."
              : "YouTube Motoru bakımda."}
          </p>
          <p className="text-amber-700 text-xs leading-relaxed">
            {isEn
              ? "We are currently improving our YouTube download engine. Please try Instagram or Twitter (X) links in the meantime."
              : "YouTube indirme motorumuzu geliştiriyoruz. Bu süreçte lütfen Instagram veya Twitter (X) linklerini deneyin."}
          </p>
        </div>
      </div>

      {/* Alternative downloaders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/tools/instagram-download">
          <div className="group flex items-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer transition-all">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 rounded-xl">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800 text-sm">
                {isEn ? "Instagram Download" : "Instagram İndir"}
              </p>
              <p className="text-xs text-slate-500">
                {isEn ? "Reels, videos & photos" : "Reels, video & fotoğraf"}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link href="/tools/twitter-download">
          <div className="group flex items-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 cursor-pointer transition-all">
            <div className="bg-slate-900 p-2.5 rounded-xl">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-800 text-sm">
                {isEn ? "Twitter (X) Download" : "Twitter (X) İndir"}
              </p>
              <p className="text-xs text-slate-500">
                {isEn ? "Videos & GIFs" : "Video & GIF"}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      <QuickNav language={language} />
    </div>
  );
}

// ─── Social Downloader (Instagram / Twitter) ─────────────────────────────────

type SocialStatus = "idle" | "loading" | "done" | "error";

interface SocialFormat {
  formatIndex: number;
  qualityLabel: string;
}

function SocialDownloader({
  platform,
  language,
}: {
  platform: "instagram" | "twitter";
  language: string;
}) {
  const isEn = language === "en";
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<SocialStatus>("idle");
  const [formats, setFormats] = useState<SocialFormat[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const isIG = platform === "instagram";

  const labels = {
    en: {
      placeholder: isIG
        ? "https://www.instagram.com/reel/..."
        : "https://twitter.com/... or https://x.com/...",
      getOptions: "Get Download Options",
      download: "Download",
      loading: "Fetching video info...",
      selectQuality: "Select Quality",
      invalidUrl: isIG
        ? "Please enter a valid Instagram URL."
        : "Please enter a valid Twitter / X URL.",
      noFormats: "No downloadable formats found for this URL.",
    },
    tr: {
      placeholder: isIG
        ? "https://www.instagram.com/reel/..."
        : "https://twitter.com/... veya https://x.com/...",
      getOptions: "İndirme Seçeneklerini Getir",
      download: "İndir",
      loading: "Video bilgisi alınıyor...",
      selectQuality: "Kalite Seç",
      invalidUrl: isIG
        ? "Lütfen geçerli bir Instagram URL'si girin."
        : "Lütfen geçerli bir Twitter / X URL'si girin.",
      noFormats: "Bu URL için indirilebilir format bulunamadı.",
    },
  };

  const t = isEn ? labels.en : labels.tr;

  const validateUrl = (u: string) => {
    if (isIG) return isInstagramUrl(u);
    return isTwitterUrl(u);
  };

  const handleFetch = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!validateUrl(trimmed)) {
      setError(t.invalidUrl);
      return;
    }

    setError(null);
    setFormats([]);
    setStatus("loading");

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(
        `/api/youtube-formats?url=${encodeURIComponent(trimmed)}`,
        { credentials: "include", signal: abortRef.current.signal }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || data?.hint || res.statusText);

      setTitle(data.title ?? (isIG ? "Instagram video" : "Twitter video"));
      const fetched: SocialFormat[] = data.formats ?? [];

      if (fetched.length === 0) throw new Error(t.noFormats);

      setFormats(fetched);
      setSelectedIndex(0);
      setStatus("done");
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setError(e?.message || "Unknown error");
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (!url.trim() || formats.length === 0) return;
    window.open(
      `/api/stream-youtube?url=${encodeURIComponent(url.trim())}&formatIndex=${selectedIndex}`,
      "_blank"
    );
  };

  const platformColor = isIG
    ? "from-purple-500 to-pink-500"
    : "from-slate-700 to-slate-900";

  const PlatformIcon = isIG ? Download : Download;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className={`bg-gradient-to-br ${platformColor} p-2 rounded-xl`}>
          <PlatformIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {isIG
              ? isEn ? "Instagram Download" : "Instagram İndirici"
              : isEn ? "Twitter (X) Download" : "Twitter (X) İndirici"}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {isIG
              ? isEn ? "Reels, videos & photos" : "Reels, video & fotoğraf"
              : isEn ? "Videos & GIFs" : "Video & GIF"}
          </p>
        </div>
      </div>

      {/* URL Input */}
      <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleFetch()}
          placeholder={t.placeholder}
          className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-800 placeholder:text-slate-400"
        />

        <button
          onClick={handleFetch}
          disabled={status === "loading" || !url.trim()}
          className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center gap-2 transition-all"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t.loading}
            </>
          ) : (
            t.getOptions
          )}
        </button>
      </div>

      {/* Error */}
      {status === "error" && error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Format selector + Download */}
      {status === "done" && formats.length > 0 && (
        <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
          <p className="text-sm font-bold text-slate-800 truncate">{title}</p>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              {t.selectQuality}
            </label>
            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium mb-4 text-sm"
            >
              {formats.map((f, i) => (
                <option key={i} value={f.formatIndex}>
                  {f.qualityLabel}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDownload}
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-bold py-3 flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            {t.download}
          </button>
        </div>
      )}

      <QuickNav language={language} />
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

interface VideoToolProps {
  /** The tool slug, e.g. "youtube-downloader", "instagram-download", "twitter-download" */
  tool: string;
}

export function VideoTool({ tool }: VideoToolProps) {
  const { language } = useLanguageStore();

  if (tool === "youtube-downloader") {
    return <YouTubeMaintenanceBanner language={language} />;
  }

  if (tool === "instagram-download") {
    return <SocialDownloader platform="instagram" language={language} />;
  }

  if (tool === "twitter-download") {
    return <SocialDownloader platform="twitter" language={language} />;
  }

  // Fallback — generic social downloader
  return <SocialDownloader platform="instagram" language={language} />;
}

export default VideoTool;
