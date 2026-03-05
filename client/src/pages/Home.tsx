import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Stats } from "@/components/home/Stats";
import { ToolGrid } from "@/components/home/ToolGrid";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center">
        {/* Header Ad Space */}
        <div className="w-full h-[120px] bg-muted/10 border-b flex items-center justify-center overflow-hidden">
          <div className="w-[728px] h-[90px] bg-muted/20 border border-dashed border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground rounded">
            Header Leaderboard Ad (728x90)
          </div>
        </div>

        {/* All Tools Section (Moved to Top, CategoryCards Removed) */}
        <div className="w-full max-w-[1400px] mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-[1fr_160px] lg:grid-cols-[160px_1fr_160px] gap-6 mb-20">
          {/* Left Skyscraper - Hidden on Tablet and Mobile */}
          <aside className="hidden lg:block w-[160px]">
            <div className="sticky top-24 h-[600px] bg-muted/5 border border-dashed border-muted-foreground/20 rounded-xl flex items-center justify-center text-[10px] text-muted-foreground font-bold uppercase tracking-tighter p-2 text-center">
              Skyscraper Ad<br/>(160x600)
            </div>
          </aside>

          <div className="w-full max-w-[1000px] mx-auto">
            <ToolGrid />
            
            {/* SEO Content for Homepage */}
            <article className="prose prose-slate max-w-none border-t pt-12 text-muted-foreground">
              <h2 className="text-3xl font-extrabold text-foreground mb-8">Ücretsiz Online PDF ve Dosya Araçları</h2>
              <p className="mb-8 leading-relaxed text-lg">
                MicroWow, modern dijital dünyanın ihtiyaç duyduğu tüm PDF ve görsel işleme araçlarını tek bir platformda sunar. İster <strong>PDF to Word</strong> çevirisi yapın, ister <strong>Image to WebP</strong> ile web sitenizi hızlandırın; tüm işlemleriniz en yüksek güvenlik standartlarında gerçekleştirilir.
              </p>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-muted/30 p-8 rounded-2xl border">
                  <h3 className="text-xl font-bold text-foreground mb-4">Güvenlik ve Gizlilik</h3>
                  <p className="mb-4">
                    Kullanıcı verilerinin güvenliği bizim önceliğimizdir. Sunucularımızda barındırılan tüm dosyalar, işlemin tamamlanmasından tam 1 saat sonra <strong>otonom node-cron</strong> sistemimiz tarafından kalıcı olarak silinir.
                  </p>
                </div>
                <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                  <h3 className="text-xl font-bold text-primary mb-4">Hız ve Performans</h3>
                  <p className="mb-4">
                    Tüm araçlarımız <strong>Google Core Web Vitals</strong> metriklerine uygun olarak optimize edilmiştir. Hızlı yükleme süreleri ve kesintisiz kullanıcı deneyimi ile işlemlerinizi saniyeler içinde tamamlayın.
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Right Skyscraper - Hidden on Mobile */}
          <aside className="hidden md:block w-[160px]">
            <div className="sticky top-24 h-[600px] bg-muted/5 border border-dashed border-muted-foreground/20 rounded-xl flex items-center justify-center text-[10px] text-muted-foreground font-bold uppercase tracking-tighter p-2 text-center">
              Skyscraper Ad<br/>(160x600)
            </div>
          </aside>
        </div>

        <Stats />

        {/* Bottom Ad Space */}
        <div className="w-full py-16 bg-muted/5 border-t flex items-center justify-center">
          <div className="w-[728px] h-[90px] bg-muted/20 border border-dashed border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground rounded">
            Footer Leaderboard Ad (728x90)
          </div>
        </div>
      </main>

      {/* Mobile Anchor Ad */}
      <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-background/95 backdrop-blur-sm border-t z-[100] md:hidden flex items-center justify-center">
        <div className="w-[320px] h-[50px] bg-muted/20 border border-dashed flex items-center justify-center text-[10px] text-muted-foreground">
          Mobile Anchor Ad (320x50)
        </div>
      </div>

      <Footer />
    </div>
  );
}
