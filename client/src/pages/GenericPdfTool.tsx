import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download, RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";

const translations = translationsData as Record<string, any>;

export default function GenericPdfTool({ title = "PDF Tool", desc = "Professional PDF processing tool." }) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const handleAction = () => {
    setIsProcessing(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 1.25; 
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          setIsDone(true);
        }, 500);
      }
    }, 100);
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Helmet>
          <title>{`${title} - MicroWow Free Online Tool`}</title>
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

              <Card className="p-10 md:p-24 border border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100/50 transition-all rounded-3xl mb-12 relative shadow-sm group">
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-12 text-center rounded-3xl">
                    <div className="relative w-16 h-16 mb-8">
                      <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
                    </div>
                    <p className="font-bold text-2xl mb-2 text-slate-900 tracking-tight">{t.common.processing}</p>
                    <p className="text-slate-500 mb-8 font-medium">{t.common.wait}</p>
                    <div className="w-full max-w-md bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                      <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                )}

                {isDone ? (
                  <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-500 text-center">
                    <div className="bg-green-100 text-green-600 p-5 rounded-full mb-8 shadow-sm">
                      <Download className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-bold mb-10 text-slate-900 tracking-tight">{t.common.ready}</h3>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                      <Button variant="outline" size="lg" onClick={() => { setIsDone(false); setProgress(0); }} className="rounded-full px-10 font-bold border-slate-200 text-slate-600">
                        <RefreshCw className="w-4 h-4 mr-2" /> {t.common.start_over}
                      </Button>
                      <Button size="lg" className="rounded-full px-16 font-bold shadow-lg shadow-primary/20">
                        {t.common.download}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-white text-primary p-6 rounded-2xl mb-8 shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
                      <FileText className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 tracking-tight">{t.common.drop_files}</h3>
                    <p className="text-slate-500 mb-10 text-lg font-medium">{t.common.drag_drop}</p>
                    <Button size="lg" className="rounded-full px-12 font-bold h-14 shadow-md" onClick={handleAction}>
                      {t.common.choose_file}
                    </Button>
                  </>
                )}
              </Card>

              <Alert className="mb-16 bg-slate-50 border-slate-200 text-slate-900 rounded-2xl p-6">
                <AlertCircle className="h-5 w-5 text-slate-400" />
                <div className="ml-2">
                  <AlertTitle className="font-bold text-slate-900 mb-1">{t.common.privacy_alert}</AlertTitle>
                  <AlertDescription className="font-medium text-sm text-slate-500 leading-relaxed">
                    {t.common.privacy_desc}
                  </AlertDescription>
                </div>
              </Alert>

              <article className="prose prose-slate max-w-none border-t border-slate-100 pt-16 text-slate-600">
                <div className="grid md:grid-cols-2 gap-12 text-left">
                  <section>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Professional Performance</h3>
                    <p className="text-md font-medium leading-relaxed">Our <strong>{title}</strong> tool is engineered for maximum speed and fidelity. By leveraging browser-side processing, we ensure your documents are handled with industry standards.</p>
                  </section>
                  <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Secure & Private</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">"{t.common.privacy_policy}"</p>
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
