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
      <div className="min-h-screen flex flex-col relative">
        <Helmet>
          <title>{`${title} - MicroWow Free Online Video Tool`}</title>
          <meta name="description" content={desc} />
          <meta property="og:title" content={`${title} - MicroWow`} />
          <meta property="og:description" content={desc} />
          <meta name="twitter:title" content={`${title} - MicroWow`} />
          <meta name="twitter:description" content={desc} />
        </Helmet>
        
        <div className="sticky top-0 z-[60] w-full h-[50px] bg-primary/5 border-b backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest overflow-hidden">
          <div className="animate-pulse flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-primary" />
            Premium Ad Space Available
            <Sparkles className="w-3 h-3 text-primary" />
          </div>
        </div>

        <Header />
        
        <main className="flex-grow flex flex-col items-center pt-10 pb-32 px-4">
          <div className="w-full h-[90px] bg-muted/5 mb-10 border-b flex items-center justify-center overflow-hidden">
            <div className="w-[728px] h-[60px] bg-muted/10 border border-dashed border-muted-foreground/20 flex items-center justify-center text-[10px] text-muted-foreground uppercase tracking-widest font-black rounded">
              Leaderboard Ad (728x90)
            </div>
          </div>

          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-9">
              <div className="mb-12 text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-heading font-black mb-4 uppercase italic tracking-tighter leading-none">
                  {title}
                </h1>
                <p className="text-xl text-muted-foreground font-medium italic opacity-80">{desc}</p>
              </div>

              <Card className="p-10 md:p-24 border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 transition-all rounded-[2rem] mb-12 relative shadow-2xl shadow-primary/5 group">
                {isProcessing && (
                  <div className="absolute inset-0 bg-background/98 backdrop-blur-xl z-[70] flex flex-col items-center justify-center p-8 text-center rounded-[2rem]">
                    <div className="relative w-24 h-24 mb-10">
                      <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
                      <Icon className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
                    </div>
                    
                    <p className="font-heading font-black text-3xl mb-2 text-foreground uppercase italic tracking-tighter">
                      {t.common.processing}
                    </p>
                    <p className="text-muted-foreground mb-8 font-medium italic">{t.common.wait}</p>
                    
                    <div className="w-full max-w-md bg-muted rounded-full h-6 overflow-hidden mb-10 border shadow-inner">
                      <div className="bg-primary h-full transition-all duration-300 ease-linear flex items-center justify-end px-2" style={{ width: `${progress}%` }}>
                         <span className="text-[10px] font-black text-white">{Math.round(progress)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {isDone ? (
                  <div className="p-10 md:p-20 flex flex-col items-center w-full animate-in zoom-in-95 duration-500 text-center">
                     <div className="bg-green-500 text-white p-6 rounded-full mb-8 shadow-xl shadow-green-500/20 ring-4 ring-green-100">
                      <Download className="w-12 h-12" />
                    </div>
                    <h3 className="text-4xl font-heading font-black mb-10 text-foreground tracking-tighter uppercase italic">{t.common.ready}</h3>
                    
                    <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
                      <Button variant="outline" size="lg" onClick={() => { setIsDone(false); setProgress(0); }} className="rounded-full px-10 h-14 text-lg font-bold">
                        <RefreshCw className="w-5 h-5 mr-2" /> {t.common.start_over}
                      </Button>
                      <Button size="lg" className="rounded-full px-16 font-black h-14 text-xl shadow-2xl bg-primary hover:bg-primary/90 uppercase italic tracking-tighter">
                        {t.common.download}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 md:p-24 flex flex-col items-center justify-center text-center bg-primary/5">
                    <div className="bg-primary text-primary-foreground p-7 rounded-[1.5rem] mb-10 shadow-2xl shadow-primary/30 transform -rotate-3 group-hover:rotate-0 transition-transform">
                      <Icon className="w-16 h-16" />
                    </div>
                    <h3 className="text-3xl font-black mb-4 uppercase italic tracking-tighter">{t.common.drop_files}</h3>
                    <p className="text-muted-foreground mb-12 text-lg font-medium italic opacity-70">{t.common.drag_drop}</p>
                    <Button size="lg" className="rounded-full px-16 font-black h-16 text-xl shadow-xl hover:scale-105 transition-transform uppercase italic tracking-tighter" onClick={handleAction}>
                      {t.common.choose_file}
                    </Button>
                  </div>
                )}
              </Card>

              <Alert className="mb-16 bg-rose-50 border-rose-100 text-rose-900 rounded-3xl p-8 shadow-sm">
                <AlertCircle className="h-6 w-6 text-rose-600" />
                <div className="ml-4">
                  <AlertTitle className="font-black text-xl uppercase italic tracking-tighter mb-2">{t.common.privacy_alert}</AlertTitle>
                  <AlertDescription className="font-medium italic text-sm leading-relaxed opacity-80">
                    {t.common.privacy_desc}
                  </AlertDescription>
                </div>
              </Alert>

              <article className="prose prose-lg max-w-none border-t border-dashed pt-20 text-muted-foreground leading-relaxed">
                {language === 'en' ? (
                  <div className="grid md:grid-cols-2 gap-12 text-left">
                    <section>
                      <h2 className="text-4xl font-heading font-black text-foreground mb-6 uppercase italic tracking-tighter leading-none">Everything You Need to Know About {title}</h2>
                      <p className="text-lg font-medium italic leading-relaxed">Professional video suite with 100% privacy and zero watermarks. All files are processed securely and deleted within 60 minutes.</p>
                    </section>
                    <section className="bg-primary/5 p-10 rounded-3xl border-2 border-dashed border-primary/20">
                      <h3 className="text-2xl font-black text-primary mb-4 uppercase italic tracking-tighter">100% Secure & Private</h3>
                      <p className="text-sm font-bold italic opacity-70 leading-relaxed italic">"{t.common.privacy_policy}"</p>
                    </section>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-12 text-left">
                    <section>
                      <h2 className="text-4xl font-heading font-black text-foreground mb-6 uppercase italic tracking-tighter leading-none">{title} Hakkında Her Şey</h2>
                      <p className="text-lg font-medium italic leading-relaxed">%100 gizlilik ve sıfır filigran ile profesyonel video paketi. Tüm dosyalar güvenli bir şekilde işlenir ve 60 dakika içinde silinir.</p>
                    </section>
                    <section className="bg-primary/5 p-10 rounded-3xl border-2 border-dashed border-primary/20">
                      <h3 className="text-2xl font-black text-primary mb-4 uppercase italic tracking-tighter">100% Güvenli ve Gizli</h3>
                      <p className="text-sm font-bold italic opacity-70 leading-relaxed italic">"{t.common.privacy_policy}"</p>
                    </section>
                  </div>
                )}
              </article>
            </div>

            <aside className="lg:col-span-3">
              <div className="sticky top-24 space-y-8">
                <div className="sticky top-24 h-[600px] bg-muted/5 border border-dashed border-muted-foreground/20 rounded-2xl flex items-center justify-center text-[10px] text-muted-foreground font-black uppercase tracking-tighter p-2 text-center shadow-inner">
                  Skyscraper Ad<br/>(160x600)
                </div>
              </div>
            </aside>
          </div>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
}
