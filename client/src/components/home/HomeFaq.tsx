import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";

const translations = translationsData as Record<string, any>;

/**
 * Ana sayfa SSS bolumu.
 *
 * Cevaplar uygulamanin gercek davranisina gore yazildi: kayit sistemi yok,
 * gorsel/video/donusturucu araclari tarayicida calisiyor, PDF ve AI araclari
 * sunucuya gidiyor, AI araclarinda 10 dakikada 10 istek siniri var.
 *
 * Bu fazda JSON-LD / FAQ structured data eklenmedi.
 */
const FAQ_KEYS = [1, 2, 3, 4, 5];

export function HomeFaq() {
  const { language } = useLanguageStore();
  const t = translations[language]?.home ?? translations.en.home;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full max-w-3xl mx-auto px-4 mb-16" aria-label={t.faq_title}>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 tracking-tight text-center">
        {t.faq_title}
      </h2>

      <div className="space-y-3">
        {FAQ_KEYS.map((n, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={n}
              className="bg-card border rounded-2xl overflow-hidden"
              data-testid={`faq-item-${n}`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 p-5 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-900/20"
              >
                <h3 className="font-bold text-slate-900 text-base">{t[`faq_q${n}`]}</h3>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 -mt-1">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {t[`faq_a${n}`]}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
