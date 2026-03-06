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
      <div className="min-h-screen flex flex-col bg-white">
        <Helmet>
          <title>{language === 'en' ? 'MicroWow - 100+ Free Online PDF, Video & Image Tools' : 'MicroWow - 100+ Ücretsiz Online PDF, Video ve Resim Araçları'}</title>
          <meta name="description" content={t.home.hero_subtitle} />
        </Helmet>
        <Header />
        <main className="flex-grow flex flex-col items-center">
          <div className="w-full h-[90px] bg-slate-50 border-b flex items-center justify-center overflow-hidden">
            <div className="w-[728px] h-[60px] bg-white border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 uppercase tracking-widest font-bold rounded">
              Leaderboard Ad (728x90)
            </div>
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-slate-900">
                {t.home.hero_title}
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                {t.home.hero_subtitle}
              </p>
            </div>
            
            <ToolGrid />
            
            <article className="prose prose-slate max-w-none border-t border-slate-100 mt-24 pt-16 text-slate-600">
              <div className="space-y-12">
                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">{t.home.seo_title}</h2>
                  <p className="leading-relaxed text-lg font-medium">
                    {t.home.seo_desc}
                  </p>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-slate-50 p-10 rounded-2xl border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{t.home.security_title}</h3>
                    <p className="font-medium text-sm leading-relaxed text-slate-500">
                      {t.home.security_desc}
                    </p>
                  </div>
                  <div className="bg-blue-50/50 p-10 rounded-2xl border border-blue-100/50">
                    <h3 className="text-xl font-bold text-primary mb-4 tracking-tight">{t.home.speed_title}</h3>
                    <p className="font-medium text-sm leading-relaxed text-slate-500">
                      {t.home.speed_desc}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <Stats />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
