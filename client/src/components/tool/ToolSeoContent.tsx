import { TOOL_SEO_DATA } from "@/data/toolSEO";

/**
 * Arac basina ozgun icerik blogu.
 *
 * TOOL_SEO_DATA icinde o arac icin girdi varsa "How to Use" adimlarini,
 * kullanim senaryolarini ve SSS'leri render eder. Girdi yoksa hicbir sey
 * dondurmez (null) — bu durumda sayfadaki mevcut genel metin gorunmeye devam eder.
 *
 * Anahtar uretimi GenericPdfTool ile ayni: title.toLowerCase().trim()
 */
export function ToolSeoContent({ title }: { title: string }) {
  const seo = TOOL_SEO_DATA[title.toLowerCase().trim()];
  if (!seo) return null;

  return (
    <div className="mb-12" data-testid="container-tool-seo">
      <div className="grid md:grid-cols-2 gap-12 text-left">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
            How to Use {title}
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-md font-medium leading-relaxed">
            {seo.howTo.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
            Practical Use Cases
          </h2>
          <p className="text-md font-medium leading-relaxed">{seo.useCases}</p>
        </section>
      </div>

      {seo.faqs?.length > 0 && (
        <div className="mt-12 pt-10 border-t border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            {seo.faqs.map((faq, idx) => (
              <div key={idx}>
                <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-md font-medium leading-relaxed text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Bu arac icin ozgun icerik var mi? Genel metni gizlemek icin kullanilir. */
export function hasToolSeo(title: string): boolean {
  return Boolean(TOOL_SEO_DATA[title.toLowerCase().trim()]);
}
