import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { LeaderboardAd, StickySkyscraper, BillboardAd } from "@/components/ads/AdUnit";
import { useEffect } from "react";
import {
  VideoConverterTool,
  VideoToMp3Tool,
  VideoToGifTool,
  CompressVideoTool,
  MuteVideoTool,
  TrimVideoTool,
  RotateVideoTool,
} from "@/components/home/VideoTools";

const translations = translationsData as Record<string, any>;

const VIDSNAP_TOOLS = new Set([
  "youtube download",
  "youtube downloader",
  "youtube video downloader",
  "instagram download",
  "twitter download",
  "twitter (x) download",
  "tiktok download",
  "tiktok downloader",
  "facebook download",
]);

function isVidSnapTool(title: string) {
  return VIDSNAP_TOOLS.has(title.toLowerCase());
}

function VidSnapRedirect({ title }: { title: string }) {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  useEffect(() => {
    const timer = setTimeout(() => { window.location.href = "http://localhost:5002"; }, 1500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="p-12 rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white text-center shadow-sm">
        <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-violet-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {isEn ? "Redirecting to VidSnap..." : "VidSnap'e yonlendiriliyor..."}
        </h2>
        <p className="text-slate-500 font-medium mb-6">
          {isEn ? `${title} is powered by VidSnap — our dedicated video downloader.` : `${title} araci VidSnap tarafindan desteklenmektedir.`}
        </p>
        <a href="http://localhost:5002" className="inline-flex items-center gap-2 px-8 py-3 bg-violet-600 text-white font-bold rounded-full hover:bg-violet-700 transition-colors shadow-md">
          {isEn ? "Go to VidSnap now" : "VidSnap'e git"}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </a>
        <p className="mt-4 text-xs text-slate-400">{isEn ? "You will be redirected automatically." : "Otomatik yonlendirileceksiniz."}</p>
      </div>
    </div>
  );
}

function getInlineTool(title: string) {
  const t = title.toLowerCase();
  if (t.includes("compress"))                             return <CompressVideoTool />;
  if (t.includes("mute"))                                 return <MuteVideoTool />;
  if (t.includes("trim"))                                 return <TrimVideoTool />;
  if (t.includes("rotate"))                               return <RotateVideoTool />;
  if (t.includes("to gif") || t.includes("gif"))          return <VideoToGifTool />;
  if (t.includes("to mp3") || t.includes("mp3"))          return <VideoToMp3Tool />;
  if (t.includes("mp4 to webm") || t.includes("convert")) return <VideoConverterTool />;
  if (t.includes("resizer"))                              return <VideoConverterTool />;
  return null;
}

export default function VideoTool({ title = "Video Tool", desc = "Free online video converter - No Watermark" }) {
  const { language } = useLanguageStore();
  const isVidSnap = isVidSnapTool(title);
  const inlineTool = isVidSnap ? null : getInlineTool(title);
  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Helmet>
          <title>{`${title} - ProToolHub Free Online Video Tool`}</title>
          <meta name="description" content={desc} />
        </Helmet>
        <Header />
        <main className="flex-grow flex flex-col items-center pt-10 pb-20">
          <LeaderboardAd />
          <div className="w-full max-w-[1400px] mx-auto flex mt-10 px-4">
            <StickySkyscraper side="left" />
            <div className="flex-1 min-w-0 max-w-4xl mx-auto">
              <div className="mb-12 text-center lg:text-left">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight leading-none">{title}</h1>
                <p className="text-xl text-slate-600 font-medium opacity-80">{desc}</p>
              </div>
              {isVidSnap ? (
                <VidSnapRedirect title={title} />
              ) : inlineTool ? (
                inlineTool
              ) : (
                <div className="w-full max-w-4xl mx-auto">
                  <div className="p-12 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-center">
                    <p className="text-slate-400 font-medium">{language === "en" ? "This tool is coming soon." : "Bu arac yakinda eklenecektir."}</p>
                  </div>
                </div>
              )}
              <BillboardAd />
              <article className="prose prose-lg max-w-none border-t border-slate-100 pt-16 mt-8 text-slate-600 leading-relaxed">
                <div className="grid md:grid-cols-2 gap-12 text-left">
                  <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Professional Video Processing</h2>
                    <p className="text-md font-medium leading-relaxed">All video processing runs entirely in your browser using FFmpeg WebAssembly - nothing is uploaded to any server. Zero watermarks, 100% privacy.</p>
                  </section>
                  <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">100% Client-Side</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">Your videos never leave your device. FFmpeg runs locally in your browser - no uploads, no servers, no data collection.</p>
                  </section>
                </div>
              </article>
            </div>
            <StickySkyscraper side="right" />
          </div>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}