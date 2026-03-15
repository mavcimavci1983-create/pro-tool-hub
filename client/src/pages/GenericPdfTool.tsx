import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToolWorkflow } from "@/components/tool/ToolWorkflow";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { LeaderboardAd, StickySkyscraper, BillboardAd } from "@/components/ads/AdUnit";

const translations = translationsData as Record<string, any>;

const TRANSLATE_LANGS = [
  { code: "en", label: "English" },
  { code: "tr", label: "TÃ¼rkÃ§e" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "FranÃ§ais" },
  { code: "es", label: "EspaÃ±ol" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "PortuguÃªs" },
  { code: "ru", label: "Ğ ÑƒÑÑĞºĞ¸Ğ¹" },
  { code: "ja", label: "æ—¥æœ¬èª" },
  { code: "zh", label: "ä¸­æ–‡" },
  { code: "ar", label: "Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©" },
  { code: "ko", label: "í•œêµ­ì–´" },
  { code: "nl", label: "Nederlands" },
  { code: "pl", label: "Polski" },
  { code: "sv", label: "Svenska" },
];

const WATERMARK_DEFAULTS = {
  watermark: "ProToolHub",
  fontSize: "0",
  angle: "45",
  opacity: "0.3",
  colorR: "0.75",
  colorG: "0.75",
  colorB: "0.75",
};

export default function GenericPdfTool({ title = "PDF Tool", desc = "Professional PDF processing tool." }) {
  const { language } = useLanguageStore();
  const isEn = language === "en";
  const tLower = title.toLowerCase();
  const isTranslate = tLower.includes("translate") || tLower.includes("Ã§evir");
  const isWatermark = tLower.includes("watermark") || tLower.includes("filigran");

  const [targetLang, setTargetLang] = useState("en");
  const [wmText, setWmText] = useState(WATERMARK_DEFAULTS.watermark);
  const [wmFontSize, setWmFontSize] = useState(WATERMARK_DEFAULTS.fontSize);
  const [wmAngle, setWmAngle] = useState(WATERMARK_DEFAULTS.angle);
  const [wmOpacity, setWmOpacity] = useState(WATERMARK_DEFAULTS.opacity);
  const [wmColor, setWmColor] = useState("#BFBFBF");

  const getAcceptedTypes = () => {
    if (tLower.includes("jpg to pdf") || tLower.includes("image to pdf")) return ".jpg,.jpeg,.png,.webp,.gif,.bmp";
    if (tLower.includes("word to pdf")) return ".doc,.docx";
    if (tLower.includes("excel to pdf")) return ".xls,.xlsx";
    if (tLower.includes("ppt to pdf") || tLower.includes("powerpoint")) return ".ppt,.pptx";
    if (tLower.includes("html to pdf")) return ".html,.htm";
    if (tLower.includes("scan to pdf")) return ".jpg,.jpeg,.png,.pdf,.tiff";
    return ".pdf";
  };

  const hexToRgbNorm = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return { r: r.toFixed(3), g: g.toFixed(3), b: b.toFixed(3) };
  };

  const getExtraParams = (): Record<string, string> | undefined => {
    if (isTranslate) return { targetLang };
    if (isWatermark) {
      const c = hexToRgbNorm(wmColor);
      return {
        watermark: wmText,
        fontSize: wmFontSize,
        angle: wmAngle,
        opacity: wmOpacity,
        colorR: c.r,
        colorG: c.g,
        colorB: c.b,
      };
    }
    return undefined;
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Helmet>
          <title>{`${title} - ProToolHub Free Online Tool`}</title>
          <meta name="description" content={desc} />
        </Helmet>
        <Header />
        <main className="flex-grow flex flex-col items-center pt-10 pb-20">
          <LeaderboardAd />

          <div className="w-full max-w-[1400px] mx-auto flex mt-10 px-4">
            <StickySkyscraper side="left" />

            <div className="flex-1 min-w-0 max-w-4xl mx-auto">
              <div className="mb-12 text-center lg:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 tracking-tight">{title}</h1>
                <p className="text-lg text-slate-600 font-medium">{desc}</p>
              </div>

              {isTranslate && (
                <div className="mb-6 p-5 bg-slate-50 rounded-xl border border-slate-200 w-full min-w-0" data-testid="translate-options">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {isEn ? "Target Language" : "Hedef Dil"}
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      data-testid="select-target-lang"
                      value={targetLang}
                      onChange={e => setTargetLang(e.target.value)}
                      className="min-w-0 w-full sm:w-auto sm:min-w-[200px] max-w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      {TRANSLATE_LANGS.map(l => (
                        <option key={l.code} value={l.code}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {isWatermark && (
                <div className="mb-6 p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 w-full min-w-0" data-testid="watermark-options">
                  <div className="min-w-0">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      {isEn ? "Watermark Text" : "Filigran Metni"}
                    </label>
                    <input
                      data-testid="input-watermark-text"
                      type="text"
                      value={wmText}
                      onChange={e => setWmText(e.target.value)}
                      className="w-full min-w-0 max-w-sm px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                      placeholder="ProToolHub"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {isEn ? "Font Size (0=auto)" : "YazÄ± Boyutu (0=oto)"}
                      </label>
                      <input data-testid="input-watermark-fontsize" type="number" min="0" max="200" value={wmFontSize} onChange={e => setWmFontSize(e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {isEn ? "Angle (Â°)" : "AÃ§Ä± (Â°)"}
                      </label>
                      <input data-testid="input-watermark-angle" type="number" min="-180" max="180" value={wmAngle} onChange={e => setWmAngle(e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {isEn ? "Opacity" : "SaydamlÄ±k"}
                      </label>
                      <input data-testid="input-watermark-opacity" type="number" min="0.01" max="1" step="0.05" value={wmOpacity} onChange={e => setWmOpacity(e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {isEn ? "Color" : "Renk"}
                      </label>
                      <input data-testid="input-watermark-color" type="color" value={wmColor} onChange={e => setWmColor(e.target.value)} className="w-full h-9 border border-slate-300 rounded-lg cursor-pointer" />
                    </div>
                  </div>
                </div>
              )}

              <ToolWorkflow 
                toolName={title} 
                acceptedFileTypes={getAcceptedTypes()}
                extraParams={getExtraParams()}
              />

              <BillboardAd />

                  <article className="prose prose-slate max-w-none border-t border-slate-100 pt-16 mt-8 text-slate-600">
                    <div className="grid md:grid-cols-2 gap-12 text-left mb-10">
                      <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">How to Use {title}</h2>
                        <p className="text-md font-medium leading-relaxed mb-3">Using our <strong>{title}</strong> tool is simple and takes just seconds. Upload your file by dragging and dropping it into the upload area, or click to browse your device. The tool will instantly process your file with no software installation or account required.</p>
                        <p className="text-md font-medium leading-relaxed">Once complete, your file is ready to download immediately. The process typically takes under 10 seconds even for large files, and you can use it as many times as you need — completely free with no daily limits.</p>
                      </section>
                      <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Why Use ProToolHub?</h2>
                        <p className="text-md font-medium leading-relaxed mb-3">ProToolHub was built with one goal: to give everyone access to professional-grade tools without subscriptions or paywalls. Whether you are a student, freelancer, or enterprise professional, our tools work instantly in your browser with zero setup.</p>
                        <p className="text-md font-medium leading-relaxed">We process hundreds of thousands of files every month for users around the world. Our infrastructure is optimized for speed and reliability, ensuring your files are handled quickly even during peak hours.</p>
                      </section>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                      <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                        <div className="text-2xl mb-2">🔒</div>
                        <h3 className="font-bold text-slate-900 mb-2">Your Files Stay Private</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">We do not use a server for most operations — your files are processed directly in your browser. For tools that require server processing, all uploaded files are automatically and permanently deleted within 60 minutes. We never read, share, or analyze your file contents.</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                        <div className="text-2xl mb-2">⚡</div>
                        <h3 className="font-bold text-slate-900 mb-2">Fast and Reliable</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">Our tools are optimized for speed. Most operations complete in under 10 seconds. We use modern browser APIs and server-side processing powered by industry-standard libraries to ensure accurate, high-quality results every time.</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
                        <div className="text-2xl mb-2">🆓</div>
                        <h3 className="font-bold text-slate-900 mb-2">100% Free, No Limits</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">Every tool on ProToolHub is completely free to use with no hidden fees, no account registration, and no daily usage limits. Professional tools should be accessible to everyone, regardless of budget or technical expertise.</p>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-8 text-white">
                      <h3 className="text-xl font-bold mb-3">Bank-Grade Security on Every File</h3>
                      <p className="text-slate-300 leading-relaxed text-sm">All file transfers between your device and our servers are encrypted using SSL/TLS technology — the same standard used by banks and financial institutions. Files queued for server-side processing are stored in isolated, encrypted temporary storage and wiped automatically after 60 minutes with no manual intervention required. ProToolHub has never experienced a data breach and we are committed to maintaining the highest security standards.</p>
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

