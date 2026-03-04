import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileStack, UploadCloud, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

export default function MergePdf() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSimulate = () => {
    setIsProcessing(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 2.5;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsProcessing(false), 500);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center pt-10 pb-20 px-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-9">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-3">Merge PDF</h1>
              <p className="text-muted-foreground">Combine multiple PDF files into one document securely.</p>
            </div>
            
            <Card className="p-10 md:p-20 border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors rounded-2xl mb-8 relative">
              {isProcessing && (
                <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-12">
                  <p className="font-bold text-xl mb-4 text-foreground">Merging Your Documents...</p>
                  <div className="w-full max-w-md bg-muted rounded-full h-4 overflow-hidden mb-6">
                    <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="w-full h-32 bg-muted/50 border border-dashed rounded flex items-center justify-center text-xs text-muted-foreground italic">
                    While waiting, check out this offer...
                  </div>
                </div>
              )}
              <div className="bg-primary text-primary-foreground p-4 rounded-full mb-6">
                <FileStack className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-foreground text-center">Upload PDF Files</h3>
              <p className="text-muted-foreground mb-6 text-center">Select two or more PDF files from your device</p>
              
              <div className="w-full max-w-md h-20 bg-muted/20 border border-dashed rounded flex items-center justify-center text-[10px] text-muted-foreground mb-6">
                Ad Placeholder (300x100)
              </div>

              <Button size="lg" className="rounded-full px-8 font-bold" onClick={handleSimulate} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Select Files"}
              </Button>
            </Card>

            <Alert className="mb-12 bg-amber-50/50 border-amber-100">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="font-bold text-amber-900 font-bold">Real-time Deletion Active</AlertTitle>
              <AlertDescription className="mt-1 text-amber-800/80">
                Your files are processed on our secure Node.js backend. <strong>All uploaded data is automatically wiped exactly 60 minutes after upload</strong>.
              </AlertDescription>
            </Alert>

            <article className="prose prose-sm max-w-none border-t pt-12 text-muted-foreground">
              <h2 className="text-2xl font-bold text-foreground mb-6">PDF Dosyaları Nasıl Birleştirilir?</h2>
              <p className="mb-4">
                Birden fazla PDF dökümanını tek bir dosya haline getirmek artık çok kolay. Dosyalarınızı seçin, sıralarını belirleyin ve birleştir butonuna basın. Backend sistemimiz dosyalarınızı hızla işleyerek size tek bir PDF sunar.
              </p>
              <h3 className="text-xl font-bold text-foreground mb-4">Ücretsiz ve Güvenli PDF Birleştirme</h3>
              <p>
                MicroWow ile yaptığınız tüm işlemler şifrelenir ve gizliliğiniz önceliğimizdir. Dosyalarınız işlem bittikten tam 1 saat sonra sunucularımızdan tamamen temizlenir.
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