import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Stats } from "@/components/home/Stats";
import { ToolGrid } from "@/components/home/ToolGrid";
import { CategoryCards } from "@/components/home/CategoryCards";
import { HowItWorks } from "@/components/home/HowItWorks";
import { HomeFaq } from "@/components/home/HomeFaq";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";
import { Helmet, HelmetProvider } from "react-helmet-async";

const translations = translationsData as Record<string, any>;

/**
 * NOT — reklam alanlari hakkinda:
 * AdUnit.tsx ve icindeki tum yer tutucu bilesenler kaldirildi. Bunlar gercek
 * AdSense yuklemiyor, sadece uzerinde "LEADERBOARD AD (728X90)" yazan gri
 * kutular ciziyorlardi; site yarim kalmis gosteriyor ve mobilde ekranin
 * ustunde yuzlerce piksel bos alan biraktiriyorlardi.
 *
 * Gercek AdSense birimleri (<ins class="adsbygoogle"> + adsbygoogle.push)
 * onay alindiktan sonra eklenecek. O zamana kadar sitede hicbir reklam
 * yuvasi bulunmuyor.
 */

export default function Home() {
  const { language } = useLanguageStore();
  const t = translations[language] ?? translations.en;

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
