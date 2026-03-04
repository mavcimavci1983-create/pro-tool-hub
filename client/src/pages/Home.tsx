import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CategoryCards } from "@/components/home/CategoryCards";
import { Stats } from "@/components/home/Stats";
import { ToolGrid } from "@/components/home/ToolGrid";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

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

        {/* Hero Section */}
        <section className="w-full pt-16 pb-10 px-4 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-10 left-20 w-8 h-8 bg-pink-500 rounded-sm rotate-12 opacity-50 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-purple-500 rounded-full opacity-50 animate-bounce"></div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-4 text-foreground max-w-3xl leading-tight">
            Free Tools to Make <span className="bg-rose-600 text-white px-4 py-1 rounded-lg inline-block transform -rotate-2">Your Life</span> Simple
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl">
            We offer PDF, video, image and online tools for developers and creators.
          </p>
          
          <div className="w-full max-w-2xl relative mb-8 flex items-center shadow-lg rounded-full">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search 200+ tools..." 
              className="w-full h-14 pl-12 pr-24 rounded-full border-border bg-card text-lg focus-visible:ring-primary focus-visible:ring-offset-2"
            />
            <Button className="absolute right-2 rounded-full px-6 bg-primary hover:bg-primary/90 text-white h-10 font-bold">
              Search
            </Button>
          </div>
          
          <CategoryCards />
        </section>

        <Stats />
        
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-9">
            <ToolGrid />
            
            {/* SEO Content for Homepage */}
            <article className="prose prose-sm max-w-none border-t pt-12 text-muted-foreground">
              <h2 className="text-2xl font-bold text-foreground mb-6 underline decoration-primary/30">Ücretsiz Online Araçlar Platformu</h2>
              <p className="mb-6 leading-relaxed">
                MicroWow, modern dijital dünyanın ihtiyaç duyduğu tüm küçük araçları tek bir çatıda birleştiren, kullanıcı dostu bir platformdur. PDF birleştirme, görsel formatı dönüştürme ve arka plan silme gibi karmaşık işlemleri saniyeler içinde, hiçbir yazılım yüklemeden tarayıcınız üzerinden halledebilirsiniz.
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3">Neden Bizi Seçmelisiniz?</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Hız: Tüm araçlarımız Core Web Vitals optimizasyonuna sahiptir.</li>
                    <li>Gizlilik: Verileriniz işlemden 1 saat sonra otomatik silinir.</li>
                    <li>Mobil Uyumlu: Tüm araçlar telefon ve tabletlerde kusursuz çalışır.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3">SEO Odaklı Çözümler</h3>
                  <p>
                    Web geliştiricileri için hazırladığımız WebP dönüştürücü gibi araçlar, sitenizin Google PageSpeed puanlarını artırmanıza yardımcı olur. LCP ve CLS gibi metriklerde iyileşme sağlayarak SEO başarınızı garantileyin.
                  </p>
                </div>
              </div>
            </article>
          </div>

          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="w-full h-[600px] bg-card border border-dashed border-muted-foreground/30 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Advertisement</span>
                <div className="w-full h-full bg-muted/10 rounded flex items-center justify-center text-xs text-muted-foreground italic">
                  Sticky Sidebar Ad<br/>(300x600)
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Ad Space */}
        <div className="w-full py-10 bg-muted/5 flex items-center justify-center">
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