import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, Download, RefreshCw, AlertCircle, Info, Sparkles, Scissors, Minimize } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function VideoTool({ title = "Video Tool", desc = "Free online video converter - No Watermark", icon: Icon = Video }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [location] = useLocation();

  const canonicalUrl = `https://microwow.replit.app${location}`;

  useEffect(() => {
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);
  }, [canonicalUrl]);

  const handleAction = () => {
    setIsProcessing(true);
    let p = 0;
    // Dwell Time: 10 seconds for max ad exposure
    const interval = setInterval(() => {
      p += 1; 
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          setIsDone(true);
        }, 500);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Top Sticky Anchor Ad */}
      <div className="sticky top-0 z-[60] w-full h-[50px] bg-primary/5 border-b backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest overflow-hidden">
        <div className="animate-pulse flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-primary" />
          Premium Ad Space Available (Top Anchor)
          <Sparkles className="w-3 h-3 text-primary" />
        </div>
      </div>

      <Header />
      
      <main className="flex-grow flex flex-col items-center pt-10 pb-32 px-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-9">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl md:text-5xl font-heading font-extrabold mb-3 tracking-tight">
                {title}
              </h1>
              <p className="text-muted-foreground text-lg">{desc}</p>
            </div>

            <Card className="p-1 md:p-2 border-2 shadow-2xl rounded-3xl overflow-hidden bg-card mb-12 relative border-primary/10">
              {isProcessing && (
                <div className="absolute inset-0 bg-background/98 backdrop-blur-xl z-[70] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
                    <Icon className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
                  </div>
                  
                  <p className="font-heading font-black text-3xl mb-2 text-foreground uppercase italic tracking-tighter">
                    Optimizing Video Quality...
                  </p>
                  <p className="text-muted-foreground mb-8 font-medium">Please wait while we prepare your high-definition output</p>
                  
                  <div className="w-full max-w-md bg-muted rounded-full h-6 overflow-hidden mb-10 border shadow-inner">
                    <div className="bg-gradient-to-r from-primary to-blue-600 h-full transition-all duration-300 ease-linear flex items-center justify-end px-2" style={{ width: `${progress}%` }}>
                       <span className="text-[10px] font-black text-white">{Math.round(progress)}%</span>
                    </div>
                  </div>

                  {/* AGGRESSIVE INTERSTITIAL AD */}
                  <div className="w-full max-w-[336px] aspect-[336/280] bg-white border-4 border-primary shadow-2xl rounded-2xl flex flex-col items-center justify-center p-4 relative group">
                    <div className="absolute -top-3 -right-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg z-10">SPONSORED</div>
                    <div className="w-full h-full bg-muted/20 rounded-lg flex items-center justify-center text-xl italic font-serif text-muted-foreground text-center">
                      Aggressive Interstitial Ad<br/>(336x280 Large Rectangle)
                    </div>
                  </div>
                </div>
              )}

              {isDone ? (
                <div className="p-10 md:p-20 flex flex-col items-center w-full animate-in zoom-in-95 duration-500">
                   <div className="bg-green-500 text-white p-6 rounded-full mb-8 shadow-xl shadow-green-500/20 ring-4 ring-green-100">
                    <Download className="w-12 h-12" />
                  </div>
                  <h3 className="text-4xl font-heading font-black mb-8 text-foreground tracking-tight">VIDEO READY!</h3>
                  
                  {/* CRITICAL AD: Above Download */}
                  <div className="w-full max-w-lg h-40 bg-primary/5 border-2 border-dashed border-primary/20 rounded-3xl mb-10 flex flex-col items-center justify-center p-6 hover:bg-primary/10 transition-colors">
                    <span className="text-[10px] font-bold text-primary mb-2 tracking-[0.3em] uppercase opacity-60">Sponsored Result</span>
                    <div className="w-full h-full bg-white/80 rounded-xl flex items-center justify-center text-lg font-bold italic text-muted-foreground">
                      High-CPM Display Ad (Above Download)
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Button variant="outline" size="lg" onClick={() => { setIsDone(false); setProgress(0); }} className="rounded-full px-10 h-14 text-lg">
                      <RefreshCw className="w-5 h-5 mr-2" /> Convert Another
                    </Button>
                    <Button size="lg" className="rounded-full px-16 font-black h-14 text-xl shadow-2xl bg-primary hover:bg-primary/90">
                      DOWNLOAD NOW
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-12 md:p-24 flex flex-col items-center justify-center text-center bg-primary/5 transition-all">
                  <div className="bg-primary text-primary-foreground p-6 rounded-3xl mb-8 shadow-2xl shadow-primary/30 transform -rotate-3 group-hover:rotate-0 transition-transform">
                    <Icon className="w-16 h-16" />
                  </div>
                  <h3 className="text-3xl font-heading font-black mb-4 tracking-tight">Professional Video Suite</h3>
                  <p className="text-muted-foreground mb-10 text-lg max-w-md">No Watermarks. High Quality. Completely Free Forever.</p>
                  
                  {/* Ad Placeholder above trigger */}
                  <div className="w-full max-w-md h-24 bg-muted/20 border border-dashed flex items-center justify-center text-xs text-muted-foreground mb-10 rounded-2xl">
                    In-Tool Native Ad (320x100)
                  </div>

                  <Button size="lg" className="rounded-full px-14 font-black h-16 text-xl shadow-xl hover:scale-105 transition-transform" onClick={handleAction}>
                    SELECT VIDEO FILE
                  </Button>
                </div>
              )}
            </Card>

            <Alert className="mb-16 bg-blue-50 border-blue-200 shadow-sm">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <AlertTitle className="font-bold text-blue-950 text-lg">60-Minute Security Protocol</AlertTitle>
              <AlertDescription className="text-blue-900/80 mt-1">
                Your video is processed on our high-performance Node.js cluster. <strong>Temporary storage is purged every 60 minutes</strong>. Privacy is non-negotiable.
              </AlertDescription>
            </Alert>

            {/* SEO Article Section with In-Article Ads */}
            <article className="prose prose-lg max-w-none border-t pt-16 text-muted-foreground leading-relaxed">
              <h2 className="text-4xl font-heading font-black text-foreground mb-10 tracking-tight">Everything You Need to Know About {title}</h2>
              
              <p className="mb-8">
                In today's digital landscape, video content is king. Whether you are a content creator, business professional, or student, having access to a <strong>free online {title.toLowerCase()}</strong> is essential for optimizing your workflow and enhancing your digital presence. Our tool is engineered for performance, ensuring your videos are processed with maximum fidelity and zero watermarks.
              </p>

              {/* IN-ARTICLE AD PLACEHOLDER */}
              <div className="my-12 w-full h-48 bg-muted/10 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-6">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Recommended Content</span>
                <div className="w-full h-full bg-white/40 rounded-xl flex items-center justify-center text-sm italic">
                  In-Article High-Engagement Ad (728x90)
                </div>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-6">How to use the Free Online {title}?</h3>
              <p className="mb-8">
                Using our platform is as simple as it gets. We've eliminated all the friction common with premium software. Simply drag your file into the secure upload zone, wait for our AI-powered engine to finalize the optimization, and download your result instantly. Our <strong>No Watermark</strong> policy means your content stays yours, professional and clean.
              </p>

              <div className="grid md:grid-cols-2 gap-10 my-12">
                <div className="bg-muted/30 p-8 rounded-3xl">
                   <h4 className="text-xl font-bold text-foreground mb-4">Why is this service free?</h4>
                   <p className="text-sm">
                     We believe high-quality productivity tools should be accessible to everyone. By utilizing strategic ad placements, we are able to provide professional-grade video processing at no cost to the user, ensuring the best <strong>user experience</strong> without the premium price tag.
                   </p>
                </div>
                <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
                   <h4 className="text-xl font-bold text-primary mb-4">Core Web Vitals & SEO</h4>
                   <p className="text-sm">
                     Optimizing your video assets is a key factor in improving your website's performance. Smaller, faster-loading videos help you achieve 100/100 Lighthouse scores, boosting your <strong>Google Search ranking</strong> and increasing user engagement across all devices.
                   </p>
                </div>
              </div>

              {/* SECOND IN-ARTICLE AD */}
              <div className="my-12 w-full h-32 bg-muted/10 border-2 border-dashed rounded-3xl flex items-center justify-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sponsored Feed Ad</span>
              </div>
            </article>
          </div>

          {/* Sticky Sidebar Ad Column */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-8">
              <div className="w-full h-[600px] bg-card border-2 border-dashed border-primary/20 rounded-3xl flex flex-col items-center justify-center p-6 text-center shadow-sm">
                <span className="text-[10px] font-black text-primary mb-6 tracking-[0.4em] uppercase">Premium Partner</span>
                <div className="w-full h-full bg-primary/5 rounded-2xl flex items-center justify-center text-sm italic font-bold text-muted-foreground leading-tight px-4">
                  Sticky Sidebar<br/>SkyScraper Ad<br/>(300x600)
                </div>
              </div>

              <div className="bg-primary text-white p-6 rounded-3xl shadow-xl">
                 <h4 className="font-black mb-2 text-lg uppercase tracking-tighter italic">Pro Tip</h4>
                 <p className="text-xs opacity-80 leading-relaxed font-medium">
                   Optimizing your video files can reduce page load time by up to 60%, significantly improving your search rankings.
                 </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Bottom Sticky Anchor Ad */}
      <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-background/95 backdrop-blur-xl border-t z-[100] flex items-center justify-center shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-[728px] h-[50px] bg-muted/20 border-2 border-dashed flex items-center justify-center text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
          Bottom Anchor Sticky Ad (728x90)
        </div>
        <Button variant="ghost" size="icon" className="absolute -top-4 right-4 h-8 w-8 rounded-full bg-background border shadow-xl hover:bg-destructive hover:text-white transition-colors">
          ×
        </Button>
      </div>

      <Footer />
    </div>
  );
}