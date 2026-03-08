import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToolWorkflow } from "@/components/tool/ToolWorkflow";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Video } from "lucide-react";
import { LeaderboardAd, StickySkyscraper, BillboardAd } from "@/components/ads/AdUnit";

const translations = translationsData as Record<string, any>;

export default function VideoTool({ title = "Video Tool", desc = "Free online video converter - No Watermark", icon: Icon = Video }) {
  const { language } = useLanguageStore();

  const getAcceptedTypes = () => {
    const t = title.toLowerCase();
    if (t.includes("mp4")) return ".mp4";
    if (t.includes("webm")) return ".webm";
    if (t.includes("mov")) return ".mov";
    if (t.includes("avi")) return ".avi";
    return ".mp4,.webm,.mov,.avi,.mkv";
  };

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
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight leading-none">
                  {title}
                </h1>
                <p className="text-xl text-slate-600 font-medium opacity-80">{desc}</p>
              </div>

              <ToolWorkflow 
                toolName={title} 
                acceptedFileTypes={getAcceptedTypes()} 
              />

              <BillboardAd />

              <article className="prose prose-lg max-w-none border-t border-slate-100 pt-16 mt-8 text-slate-600 leading-relaxed">
                <div className="grid md:grid-cols-2 gap-12 text-left">
                  <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Professional Video Processing</h2>
                    <p className="text-md font-medium leading-relaxed">Professional video suite with 100% privacy and zero watermarks. All files are processed securely and deleted within 60 minutes.</p>
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
