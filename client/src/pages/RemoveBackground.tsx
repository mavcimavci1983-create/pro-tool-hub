import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scissors, Sparkles, UploadCloud, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

export default function RemoveBackground() {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center pt-10 pb-20 px-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-9">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-3">AI Background Remover</h1>
              <p className="text-muted-foreground">Remove image backgrounds automatically in seconds with high precision AI.</p>
            </div>
            
            <Card className="p-10 md:p-20 border-2 border-dashed border-orange-500/30 bg-orange-50/30 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50/50 transition-colors rounded-2xl mb-8">
              <div className="bg-orange-500 text-white p-4 rounded-full mb-6">
                <Scissors className="w-10 h-10" />
              </div>
              <div className="flex items-center gap-2 mb-2 text-foreground">
                <h3 className="text-2xl font-bold">Upload Image</h3>
                <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
              </div>
              <p className="text-muted-foreground mb-6 text-center">Drop your image here to remove the background</p>
              <Button size="lg" variant="outline" className="rounded-full px-8 font-bold border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
                Choose Image
              </Button>
            </Card>

            <Alert className="mb-12 bg-blue-50/50 border-blue-100">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertTitle className="font-bold text-blue-900 font-bold">Processed In Your Browser</AlertTitle>
              <AlertDescription className="mt-1 text-blue-800/80">
                Processing runs in your browser. Your image is not uploaded to our server.
              </AlertDescription>
            </Alert>

            <article className="prose prose-sm max-w-none border-t pt-12 text-muted-foreground">
              <h2 className="text-2xl font-bold text-foreground mb-6">Arka Plan Nasıl Silinir?</h2>
              <p className="mb-4">
                Yapay zeka teknolojimiz sayesinde artık Photoshop gibi karmaşık programlara ihtiyacınız yok. Arka plan silme aracımız, görselinizdeki nesneyi saniyeler içinde tespit eder ve arka planı şeffaf hale getirir.
              </p>
              <h3 className="text-xl font-bold text-foreground mb-4">Neden Bizim Aracımızı Kullanmalısınız?</h3>
              <p className="mb-6">
                Hızlı, ücretsiz ve güvenli. Tüm işlemleriniz yüksek gizlilik standartlarında gerçekleştirilir ve dosyalarınız işlem bittikten sonra sunucularımızda barındırılmaz.
              </p>
            </article>
          </div>

          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="w-full h-[600px] bg-card border border-dashed border-muted-foreground/30 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Advertisement</span>
                <div className="w-full h-full bg-muted/10 rounded flex items-center justify-center text-xs text-muted-foreground italic">
                  Sticky Sidebar Ad<br/>(300x600)
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-[100px] bg-background/80 backdrop-blur-md border-t z-[100] md:hidden flex items-center justify-center">
        <div className="w-[320px] h-[50px] bg-muted/20 border border-dashed flex items-center justify-center text-[10px] text-muted-foreground">
          Mobile Anchor Ad (320x50)
        </div>
      </div>

      <Footer />
    </div>
  );
}