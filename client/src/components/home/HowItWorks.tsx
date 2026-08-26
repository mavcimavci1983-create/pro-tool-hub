import { useMemo } from "react";
import { MousePointerClick, Upload, Download, Laptop, Server } from "lucide-react";
import { tools } from "@/components/home/ToolGrid";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";

const translations = translationsData as Record<string, any>;

/**
 * "Nasil calisir" bolumu.
 *
 * Tarayici icinde calisan arac sayisi sabit yazilmaz; Image + Video +
 * Converter kategorilerinden hesaplanir. Bu uc kategorinin bilesenlerinde
 * hicbir /api cagrisi yok - islem tamamen Canvas API ve ffmpeg.wasm ile
 * kullanicinin cihazinda yapiliyor. PDF ve AI araclari ise sunucuya gidiyor.
 */
const BROWSER_CATEGORIES = ["Image", "Video", "Converter"];

export function HowItWorks() {
  const { language } = useLanguageStore();
  const t = translations[language]?.home ?? translations.en.home;

  const browserToolCount = useMemo(
    () => tools.filter((tool) => BROWSER_CATEGORIES.includes(tool.cat)).length,
    [],
  );

  const steps = [
    { icon: MousePointerClick, title: t.how_step1_title, desc: t.how_step1_desc },
    { icon: Upload, title: t.how_step2_title, desc: t.how_step2_desc },
    { icon: Download, title: t.how_step3_title, desc: t.how_step3_desc },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 mb-16" aria-label={t.how_title}>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 tracking-tight text-center">
        {t.how_title}
      </h2>

      <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {steps.map(({ icon: Icon, title, desc }, i) => (
          <li
            key={i}
            className="bg-card border rounded-2xl p-6 flex flex-col"
            data-testid={`step-how-${i + 1}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {i + 1}
              </span>
              <Icon className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">{desc}</p>
          </li>
        ))}
      </ol>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6" data-testid="box-processing-info">
        <h3 className="font-bold text-slate-900 mb-4">{t.how_browser_title}</h3>
        <div className="space-y-3">
          <p className="flex gap-3 text-sm text-slate-600 font-medium leading-relaxed">
            <Laptop className="w-5 h-5 shrink-0 text-slate-400 mt-0.5" />
            <span>{t.how_browser_desc.replace("{count}", String(browserToolCount))}</span>
          </p>
          <p className="flex gap-3 text-sm text-slate-600 font-medium leading-relaxed">
            <Server className="w-5 h-5 shrink-0 text-slate-400 mt-0.5" />
            <span>{t.how_server_desc}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
