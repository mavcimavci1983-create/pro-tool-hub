import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Construction } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative inline-block">
            <div className="bg-primary/10 text-primary p-6 rounded-full inline-block relative z-10">
              <Construction className="w-16 h-16 stroke-[1.5]" />
            </div>
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-4xl font-heading font-black tracking-tighter text-foreground uppercase italic">
              Yakında Sizlerle!
            </h1>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
              Aradığınız araç şu an mutfağımızda hazırlanıyor. En kısa sürede en profesyonel haliyle hizmetinize sunulacak.
            </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="rounded-full px-8 font-bold shadow-lg shadow-primary/20 h-12 w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" /> Ana Sayfaya Dön
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full px-8 font-bold h-12 w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Geri Git
            </Button>
          </div>

          <div className="pt-8 border-t border-dashed">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60 mb-2">
              Öneri Gönderin
            </p>
            <p className="text-sm italic text-muted-foreground">
              Hangi aracın önce gelmesini istersiniz? Bize bildirin.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
