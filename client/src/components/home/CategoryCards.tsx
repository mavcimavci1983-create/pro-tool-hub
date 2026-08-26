import { useMemo } from "react";
import { ArrowRight, FileText, Image as ImageIcon, Video, RefreshCw, PenTool } from "lucide-react";
import { tools } from "@/components/home/ToolGrid";
import { useCategoryStore } from "@/lib/categoryStore";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";

const translations = translationsData as Record<string, any>;

/**
 * Kategori kartlari.
 *
 * Arac sayilari ToolGrid'deki `tools` dizisinden ANLIK hesaplanir; sabit sayi
 * yazilmaz. Yeni bir arac eklendiginde kart sayisi kendiliginden guncellenir.
 *
 * Karta tiklandiginda mevcut kategori store'u guncellenir ve ToolGrid ayni
 * sayfada o kategoriye filtrelenir - yeni bir route olusturulmaz.
 */
const CATEGORY_META = [
  { cat: "PDF",        key: "pdf",       icon: FileText,  color: "bg-red-500",    text: "text-red-500",    shadow: "hover:shadow-red-500/20" },
  { cat: "Image",      key: "image",     icon: ImageIcon, color: "bg-orange-500", text: "text-orange-500", shadow: "hover:shadow-orange-500/20" },
  { cat: "Video",      key: "video",     icon: Video,     color: "bg-rose-500",   text: "text-rose-500",   shadow: "hover:shadow-rose-500/20" },
  { cat: "Converter",  key: "converter", icon: RefreshCw, color: "bg-teal-600",   text: "text-teal-600",   shadow: "hover:shadow-teal-600/20" },
  { cat: "AI Writing", key: "ai",        icon: PenTool,   color: "bg-blue-600",   text: "text-blue-600",   shadow: "hover:shadow-blue-600/20" },
];

export function CategoryCards() {
  const { language } = useLanguageStore();
  const t = translations[language]?.home ?? translations.en.home;
  const setCategory = useCategoryStore((s) => s.setCategory);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const tool of tools) map[tool.cat] = (map[tool.cat] ?? 0) + 1;
    return map;
  }, []);

  const handleSelect = (cat: string) => {
    setCategory(cat);
    document.getElementById("tool-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 mt-4 mb-16" aria-label={t.categories_title}>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 tracking-tight text-center">
        {t.categories_title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {CATEGORY_META.map(({ cat, key, icon: Icon, color, text, shadow }) => {
          const count = counts[cat] ?? 0;
          if (count === 0) return null;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleSelect(cat)}
              className={`text-left rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-sm ${shadow} bg-card border group focus:outline-none focus:ring-2 focus:ring-slate-900/20`}
              data-testid={`card-category-${key}`}
            >
              <div className={`${color} p-5 text-white flex flex-col h-32 relative overflow-hidden`}>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />

                <div className="flex justify-between items-start z-10">
                  <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                    {t.cat_count.replace("{count}", String(count))}
                  </span>
                </div>

                <div className="mt-auto z-10">
                  <h3 className="font-bold text-lg leading-tight">{t[`cat_${key}`]}</h3>
                </div>
              </div>

              <div className="p-4 bg-card border-t">
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  {t[`cat_${key}_desc`]}
                </p>
                <span className={`mt-3 inline-flex items-center gap-1 text-xs font-bold ${text}`}>
                  {t.footer_all_tools}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
