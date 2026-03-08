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
  { code: "tr", label: "Türkçe" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" },
  { code: "ko", label: "한국어" },
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
  const isTranslate = tLower.includes("translate") || tLower.includes("çevir");
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
                <div className="mb-6 p-5 bg-slate-50 rounded-xl border border-slate-200" data-testid="translate-options">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {isEn ? "Target Language" : "Hedef Dil"}
                  </label>
                  <select
                    data-testid="select-target-lang"
                    value={targetLang}
                    onChange={e => setTargetLang(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {TRANSLATE_LANGS.map(l => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {isWatermark && (
                <div className="mb-6 p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4" data-testid="watermark-options">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      {isEn ? "Watermark Text" : "Filigran Metni"}
                    </label>
                    <input
                      data-testid="input-watermark-text"
                      type="text"
                      value={wmText}
                      onChange={e => setWmText(e.target.value)}
                      className="w-full max-w-sm px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                      placeholder="ProToolHub"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {isEn ? "Font Size (0=auto)" : "Yazı Boyutu (0=oto)"}
                      </label>
                      <input data-testid="input-watermark-fontsize" type="number" min="0" max="200" value={wmFontSize} onChange={e => setWmFontSize(e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {isEn ? "Angle (°)" : "Açı (°)"}
                      </label>
                      <input data-testid="input-watermark-angle" type="number" min="-180" max="180" value={wmAngle} onChange={e => setWmAngle(e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        {isEn ? "Opacity" : "Saydamlık"}
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
                <div className="grid md:grid-cols-2 gap-12 text-left">
                  <section>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Professional Performance</h3>
                    <p className="text-md font-medium leading-relaxed">Our <strong>{title}</strong> tool is engineered for maximum speed and fidelity. By leveraging browser-side processing, we ensure your documents are handled with industry standards.</p>
                  </section>
                  <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Secure & Private</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">"Your files are processed in real-time and automatically purged from our servers within 60 minutes. We never store, share, or look at your data."</p>
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
