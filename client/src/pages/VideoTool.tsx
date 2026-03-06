import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, Download, RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";

const translations = translationsData as Record<string, any>;

export default function VideoTool({ title = "Video Tool", desc = "Free online video converter - No Watermark", icon: Icon = Video }) {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const handleAction = () => {
    setIsProcessing(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 0.833; 
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
          <title>{`${title} - ProToolHub Free Online Video Tool`}</title>
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
                      <Button size="lg" className="rounded-full px-16 font-bold shadow-lg shadow-primary/20 bg-slate-900 hover:bg-slate-800 text-white border-none">
                        {t.common.download}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 md:p-24 flex flex-col items-center justify-center text-center">
                    <div className="bg-white text-slate-900 p-6 rounded-2xl mb-8 shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
                      <Icon className="w-16 h-16" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 tracking-tight">{t.common.drop_files}</h3>
                    <p className="text-slate-500 mb-10 text-lg font-medium">{t.common.drag_drop}</p>
                    <Button size="lg" className="rounded-full px-12 font-bold h-14 shadow-md bg-slate-900 hover:bg-slate-800 text-white border-none" onClick={handleAction}>
                      {t.common.choose_file}
                    </Button>
                  </div>
                )}
              </Card>

              <article className="prose prose-lg max-w-none border-t border-slate-100 pt-16 text-slate-600">
                <div className="grid md:grid-cols-2 gap-12 text-left">
                  <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Professional Video Processing</h2>
                    <p className="text-md font-medium leading-relaxed">Professional video suite with 100% privacy and zero watermarks. All files are processed securely and deleted within 60 minutes.</p>
                  </section>
                  <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">Secure & Private</h3>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">"{t.common.privacy_policy}"</p>
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
