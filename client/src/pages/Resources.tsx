import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ArrowRight, BookOpen } from "lucide-react";
import { GUIDES } from "@/data/resources";
import { guidesByCategory } from "@/lib/guides";

/**
 * /resources - rehber dizini.
 *
 * Kategoriye gore gruplanir; gruplar da rehber verisinden turetilir, elle
 * yazilmaz. Sayfa duzeni mevcut legal sayfalarla (AboutUs, Contact) ayni
 * kabuk ve tipografiyi kullanir.
 */
export default function Resources() {
  const groups = guidesByCategory();

  return (
    <HelmetProvider>
      <Helmet>
        <title>Guides &amp; Resources - ProToolHub</title>
        <meta
          name="description"
          content="Practical guides on working with PDFs, images and video: what each tool actually does, where its limits are, and which one to reach for."
        />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Guides
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">
            Guides &amp; Resources
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
            Short, practical write-ups about the jobs these tools exist to do — how the
            formats differ, where each tool stops being the right one, and what it cannot
            do. Written against how this site actually works, so the limits described here
            are the real ones.
          </p>
          <p className="text-sm text-slate-400 mt-4 font-medium">
            {GUIDES.length} guides
          </p>
        </div>

        <div className="space-y-14">
          {groups.map(({ category, guides }) => (
            <section key={category} aria-label={category}>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 pb-3 border-b border-slate-100">
                {category}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {guides.map((guide) => (
                  <Link key={guide.slug} href={`/resources/${guide.slug}`}>
                    <article
                      className="h-full p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group flex flex-col"
                      data-testid={`card-guide-${guide.slug}`}
                    >
                      <h3 className="font-bold text-slate-900 text-lg mb-2 tracking-tight group-hover:text-primary transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium flex-grow">
                        {guide.summary}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                        Read guide
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-slate-100">
          <p className="text-slate-600 font-medium">
            Looking for the tools themselves?{" "}
            <Link href="/" className="text-blue-600 hover:underline font-bold">
              Browse all {47} tools
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </HelmetProvider>
  );
}
