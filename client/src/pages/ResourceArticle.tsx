import { Link, useRoute } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ArrowLeft, ArrowRight, Info, Wrench } from "lucide-react";
import type { GuideBlock } from "@/data/resources";
import { getGuide, relatedGuides } from "@/lib/guides";
import NotFound from "@/pages/NotFound";

const SITE_ORIGIN = "https://protoolhub.net";

function Blocks({ blocks }: { blocks: GuideBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={i} className="text-2xl font-bold text-slate-900 mt-12 mb-4 tracking-tight">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="text-lg font-bold text-slate-900 mt-8 mb-3 tracking-tight">
                {block.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="text-slate-700 leading-relaxed mb-4">
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="list-disc pl-6 space-y-2 mb-5 text-slate-700 leading-relaxed">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <ol key={i} className="list-decimal pl-6 space-y-2 mb-5 text-slate-700 leading-relaxed">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ol>
            );
          case "note":
            return (
              <aside
                key={i}
                className="my-8 flex gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl"
              >
                <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 mb-1.5 text-sm">{block.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{block.text}</p>
                </div>
              </aside>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

/**
 * /resources/:slug - tek rehber sayfasi.
 *
 * Bilinmeyen slug NotFound render eder; sunucu tarafinda zaten sitemap
 * allowlist'i disindaki adresler 404 donuyor, bu istemci tarafi karsiligidir.
 *
 * JSON-LD (Article + FAQPage) Helmet uzerinden yaziliyor - yeni bagimlilik yok.
 */
export default function ResourceArticle() {
  const [, params] = useRoute("/resources/:slug");
  const guide = getGuide(params?.slug);

  if (!guide) return <NotFound />;

  const url = `${SITE_ORIGIN}/resources/${guide.slug}`;
  const related = relatedGuides(guide);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: guide.updated,
    dateModified: guide.updated,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "ProToolHub", url: SITE_ORIGIN },
    publisher: { "@type": "Organization", name: "ProToolHub", url: SITE_ORIGIN },
  };

  const faqLd = guide.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: guide.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{guide.metaTitle}</title>
        <meta name="description" content={guide.metaDescription} />
        <script type="application/ld+json">{JSON.stringify(articleLd)}</script>
        {faqLd && <script type="application/ld+json">{JSON.stringify(faqLd)}</script>}
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All guides
        </Link>

        <article>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            {guide.category}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5 tracking-tight leading-tight">
            {guide.title}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-3 font-medium">
            {guide.summary}
          </p>
          <p className="text-xs text-slate-400 font-medium mb-10 pb-8 border-b border-slate-100">
            Updated {new Date(guide.updated).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <Blocks blocks={guide.blocks} />

          {guide.faqs && guide.faqs.length > 0 && (
            <section className="mt-14 pt-10 border-t border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
                Common questions
              </h2>
              <div className="space-y-6">
                {guide.faqs.map((faq, i) => (
                  <div key={i}>
                    <h3 className="font-bold text-slate-900 mb-1.5">{faq.q}</h3>
                    <p className="text-slate-600 leading-relaxed text-[15px]">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* ── Bu rehberin anlattigi araclar ─────────────────────────────── */}
        <section className="mt-14 pt-10 border-t border-slate-100" aria-label="Tools used in this guide">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
            Tools in this guide
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {guide.relatedTools.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all group">
                  <Wrench className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-bold text-slate-800 text-sm flex-1 group-hover:text-primary transition-colors">
                    {tool.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-12 pt-10 border-t border-slate-100" aria-label="Related guides">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">
              Read next
            </h2>
            <ul className="space-y-3 list-none p-0">
              {related.map((g) => (
                <li key={g.slug}>
                  <Link href={`/resources/${g.slug}`} className="group">
                    <span className="font-bold text-slate-800 group-hover:text-primary transition-colors">
                      {g.title}
                    </span>
                    <span className="block text-sm text-slate-500 leading-relaxed mt-0.5">
                      {g.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </HelmetProvider>
  );
}
