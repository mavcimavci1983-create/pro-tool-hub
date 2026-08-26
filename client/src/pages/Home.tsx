import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Stats } from "@/components/home/Stats";
import { ToolGrid, tools } from "@/components/home/ToolGrid";
import { CategoryCards } from "@/components/home/CategoryCards";
import { HowItWorks } from "@/components/home/HowItWorks";
import { HomeFaq } from "@/components/home/HomeFaq";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";

const translations = translationsData as Record<string, any>;

/**
 * NOT — reklam alanlari hakkinda:
 * LeaderboardAd / SidebarAd / StickySkyscraper / BillboardAd bilesenleri
 * AdUnit.tsx icinde duruyor ve silinmedi. Ancak bunlar su an gercek AdSense
 * yuklemiyor (adsbygoogle push cagrisi yok), sadece gri "AD" yer tutucu
 * kutulari cizivorlar. Onay alinmadan bu kutulari gostermek kullaniciya
 * yarim kalmis bir site izlenimi verdigi icin ana sayfadan cikarildilar.
 * Gercek AdSense entegrasyonu yapildiginda buraya geri eklenebilirler.
 */

export default function Home() {
  const { language } = useLanguageStore();
  const t = translations[language] ?? translations.en;
  const toolCount = tools.length;

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Helmet>
          <title>{t.home.hero_title}</title>
          <meta name="description" content={t.home.hero_subtitle} />
        </Helmet>

        <Header />

        <main className="flex-grow flex flex-col items-center w-full">
          <div className="w-full max-w-[1400px] mx-auto px-4 py-16">
            {/* ── HERO ─────────────────────────────────────────────── */}
            <div className="text-center mb-14">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-slate-900">
                {t.home.hero_title}
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                {t.home.hero_subtitle}
              </p>
              <p className="text-sm text-slate-400 mt-4 font-bold uppercase tracking-widest">
                {t.home.hero_note.replace("{count}", String(toolCount))}
              </p>
            </div>

            {/* ── CATEGORY CARDS ───────────────────────────────────── */}
            <CategoryCards />

            {/* ── HOW IT WORKS ─────────────────────────────────────── */}
            <HowItWorks />

            {/* ── TOOL GRID ────────────────────────────────────────── */}
            <div id="tool-grid" className="scroll-mt-24">
              <ToolGrid />
            </div>

            {/* ── WHY PROTOOLHUB ───────────────────────────────────── */}
            <section
              className="max-w-3xl mx-auto border-t border-slate-100 mt-16 pt-16 mb-16"
              aria-label={t.home.why_title}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 tracking-tight text-center">
                {t.home.why_title}
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium text-center">
                {t.home.why_desc}
              </p>
            </section>

            {/* ── FAQ ──────────────────────────────────────────────── */}
            <HomeFaq />
          </div>

          <Stats />
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
}
