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
        <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-9">
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

          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="w-full h-[600px] bg-card border border-dashed border-muted-foreground/30 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Advertisement</span>
                <div className="w-full h-full bg-muted/10 rounded flex items-center justify-center text-xs text-muted-foreground italic font-bold">
                  STICKY SIDEBAR AD<br/>(300x600)
                </div>
              </div>
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
