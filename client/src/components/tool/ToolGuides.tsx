import { Link, useLocation } from "wouter";
import { BookOpen, ArrowRight } from "lucide-react";
import { guidesForTool } from "@/lib/guides";

/**
 * Arac sayfalarinin altindaki "Helpful Guides" bolumu.
 *
 * Hangi rehberlerin gosterilecegi mevcut URL'den bulunur ve rehber verisindeki
 * `relatedTools` listesinin ters indeksinden gelir. Yani bir arac yalnizca
 * kendisini gercekten anlatan rehberleri gosterir; elle tutulan ikinci bir
 * eslesme tablosu yoktur.
 *
 * O arac icin rehber yoksa hicbir sey render edilmez (null) - arac akisinin
 * altina bos bir baslik birakilmaz.
 */
export function ToolGuides() {
  const [location] = useLocation();
  const guides = guidesForTool(location);

  if (guides.length === 0) return null;

  return (
    <section
      className="mt-12 pt-10 border-t border-slate-100"
      aria-label="Helpful guides"
      data-testid="container-tool-guides"
    >
      <div className="flex items-center gap-2 mb-5">
        <BookOpen className="w-4 h-4 text-slate-400" />
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Helpful guides
        </h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/resources/${guide.slug}`}>
            <div
              className="h-full p-5 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-sm transition-all group"
              data-testid={`link-guide-${guide.slug}`}
            >
              <p className="font-bold text-slate-900 text-sm mb-1.5 group-hover:text-primary transition-colors">
                {guide.title}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">{guide.summary}</p>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/resources"
        className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider"
      >
        All guides
        <ArrowRight className="w-3 h-3" />
      </Link>
    </section>
  );
}
