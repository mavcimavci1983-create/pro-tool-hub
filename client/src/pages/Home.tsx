import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Stats } from "@/components/home/Stats";
import { ToolGrid } from "@/components/home/ToolGrid";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";

const translations = translationsData as Record<string, any>;

export default function Home() {
  const { language } = useLanguageStore();
  const t = translations[language];

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>{language === 'en' ? 'MicroWow - 100+ Free Online PDF, Video & Image Tools' : 'MicroWow - 100+ Ücretsiz Online PDF, Video ve Resim Araçları'}</title>
          <meta name="description" content={t.home.hero_subtitle} />
          <meta property="og:title" content={language === 'en' ? 'MicroWow - Free Online PDF & Video Tools' : 'MicroWow - Ücretsiz Online PDF ve Video Araçları'} />
          <meta property="og:description" content={t.home.hero_subtitle} />
          <meta name="twitter:title" content={language === 'en' ? 'MicroWow - Free Online PDF & Video Tools' : 'MicroWow - Ücretsiz Online PDF ve Video Araçları'} />
          <meta name="twitter:description" content={t.home.hero_subtitle} />
        </Helmet>
        <Header />
        <main className="flex-grow flex flex-col items-center">
          {/* Ad Space */}
          <div className="w-full h-[90px] bg-muted/5 border-b flex items-center justify-center overflow-hidden">
            <div className="w-[728px] h-[60px] bg-muted/10 border border-dashed border-muted-foreground/20 flex items-center justify-center text-[10px] text-muted-foreground uppercase tracking-widest font-black rounded">
              Top Leaderboard Ad (728x90)
            </div>
          </div>

          <div className="w-full max-w-[1400px] mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-[1fr_160px] lg:grid-cols-[160px_1fr_160px] gap-8 mb-20">
            {/* Left Skyscraper */}
            <aside className="hidden lg:block w-[160px]">
              <div className="sticky top-24 h-[600px] bg-muted/5 border border-dashed border-muted-foreground/20 rounded-2xl flex items-center justify-center text-[10px] text-muted-foreground font-black uppercase tracking-tighter p-2 text-center shadow-inner">
                Skyscraper Ad<br/>(160x600)
              </div>
            </aside>

            <div className="w-full max-w-[1000px] mx-auto text-center">
              <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tighter uppercase italic text-foreground leading-[0.9]">
                  {t.home.hero_title}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium italic">
                  {t.home.hero_subtitle}
                </p>
              </div>
              
              <ToolGrid />
              
              <article className="prose prose-slate max-w-none border-t border-dashed mt-24 pt-16 text-muted-foreground text-left">
                <div className="space-y-12">
                  <section>
                    <h2 className="text-4xl font-black text-foreground mb-6 uppercase italic tracking-tighter">{t.home.seo_title}</h2>
                    <p className="leading-relaxed text-lg font-medium italic">
                      {t.home.seo_desc}
                    </p>
                  </section>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-card p-10 rounded-3xl border-2 border-dashed shadow-xl shadow-primary/5">
                      <h3 className="text-2xl font-black text-foreground mb-4 uppercase italic tracking-tighter">{t.home.security_title}</h3>
                      <p className="font-medium text-sm leading-relaxed italic opacity-80">
                        {t.home.security_desc}
                      </p>
                    </div>
                    <div className="bg-primary/5 p-10 rounded-3xl border-2 border-dashed border-primary/20 shadow-xl shadow-primary/5">
                      <h3 className="text-2xl font-black text-primary mb-4 uppercase italic tracking-tighter">{t.home.speed_title}</h3>
                      <p className="font-medium text-sm leading-relaxed italic opacity-80">
                        {t.home.speed_desc}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Right Skyscraper */}
            <aside className="hidden md:block w-[160px]">
              <div className="sticky top-24 h-[600px] bg-muted/5 border border-dashed border-muted-foreground/20 rounded-2xl flex items-center justify-center text-[10px] text-muted-foreground font-black uppercase tracking-tighter p-2 text-center shadow-inner">
                Skyscraper Ad<br/>(160x600)
              </div>
            </aside>
          </div>
          <Stats />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
