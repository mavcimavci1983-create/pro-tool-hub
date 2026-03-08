import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToolWorkflow } from "@/components/tool/ToolWorkflow";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";

const translations = translationsData as Record<string, any>;

export default function GenericPdfTool({ title = "PDF Tool", desc = "Professional PDF processing tool." }) {
  const { language } = useLanguageStore();
  
  // Logic to determine accepted file types based on title/context
  const getAcceptedTypes = () => {
    const t = title.toLowerCase();
    if (t.includes("jpg to pdf") || t.includes("image to pdf")) return ".jpg,.jpeg,.png,.webp,.gif,.bmp";
    if (t.includes("word to pdf")) return ".doc,.docx";
    if (t.includes("excel to pdf")) return ".xls,.xlsx";
    if (t.includes("ppt to pdf") || t.includes("powerpoint")) return ".ppt,.pptx";
    if (t.includes("html to pdf")) return ".html,.htm";
    if (t.includes("scan to pdf")) return ".jpg,.jpeg,.png,.pdf,.tiff";
    return ".pdf";
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Helmet>
          <title>{`${title} - ProToolHub Free Online Tool`}</title>
          <meta name="description" content={desc} />
        </Helmet>
        <Header />
        <main className="flex-grow flex flex-col items-center pt-10 pb-20 px-4">
          <div className="w-full h-[90px] bg-slate-50 mb-10 border-b flex items-center justify-center overflow-hidden">
            <div className="w-[728px] h-[60px] bg-white border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 uppercase tracking-widest font-bold rounded">
              Leaderboard Ad (728x90)
            </div>
          </div>

          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_160px] lg:grid-cols-[160px_1fr_160px] gap-8">
            <aside className="hidden lg:block w-[160px]">
              <div className="sticky top-24 h-[600px] bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter p-2 text-center">
                Skyscraper Ad<br/>(160x600)
              </div>
            </aside>

            <div className="w-full max-w-4xl mx-auto">
              <div className="mb-12 text-center lg:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 tracking-tight">{title}</h1>
                <p className="text-lg text-slate-600 font-medium">{desc}</p>
              </div>

              <ToolWorkflow 
                toolName={title} 
                acceptedFileTypes={getAcceptedTypes()} 
              />

              <article className="prose prose-slate max-w-none border-t border-slate-100 pt-16 mt-20 text-slate-600">
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

            <aside className="hidden md:block w-[160px]">
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
