import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToolWorkflow } from "@/components/tool/ToolWorkflow";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ImageIcon } from "lucide-react";

const translations = translationsData as Record<string, any>;

export default function ImageTool({ title = "Image Tool", desc = "Professional image processing tool." }) {
  const { language } = useLanguageStore();

  const getAcceptedTypes = () => {
    const t = title.toLowerCase();
    if (t.includes("heic")) return ".heic";
    if (t.includes("webp")) return ".webp";
    return ".jpg,.jpeg,.png,.webp,.heic";
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Helmet>
          <title>{`${title} - ProToolHub Free Online Image Tool`}</title>
          <meta name="description" content={desc} />
        </Helmet>
        <Header />
        <main className="flex-grow flex flex-col items-center pt-10 pb-32 px-4">
          <div className="w-full h-[90px] bg-slate-50 mb-10 border-b flex items-center justify-center overflow-hidden">
            <div className="w-[728px] h-[60px] bg-white border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 uppercase tracking-widest font-bold rounded">
              Leaderboard Ad (728x90)
            </div>
          </div>

          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9">
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

              <article className="prose prose-lg max-w-none border-t border-slate-100 pt-16 mt-20 text-slate-600 leading-relaxed">
                <div className="grid md:grid-cols-2 gap-12 text-left">
                  <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Professional Image Processing</h2>
                    <p className="text-md font-medium leading-relaxed">High-performance image suite with 100% privacy and zero watermarks. All files are processed securely and deleted within 60 minutes.</p>
                  </section>
                  <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Secure & Private</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">"Your images are processed in real-time and automatically purged from our servers within 60 minutes. We never store, share, or look at your data."</p>
                  </section>
                </div>
              </article>
            </div>

            <aside className="lg:col-span-3">
              <div className="sticky top-24 h-[600px] bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter p-2 text-center">
                Skyscraper Ad<br/>(160x600)
              </div>
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
}
