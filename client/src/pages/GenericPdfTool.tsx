import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download, RefreshCw, AlertCircle, Info, FileEdit, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function GenericPdfTool({ title = "PDF Tool", desc = "Professional PDF processing tool." }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [location] = useLocation();

  const canonicalUrl = `https://microwow.replit.app${location}`;

  useEffect(() => {
    // Add canonical tag dynamically
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
    const interval = setInterval(() => {
      p += 1; // 10 seconds (100ms * 100 = 10s)
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center pt-10 pb-20 px-4">
        <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_160px] lg:grid-cols-[160px_1fr_160px] gap-6">
          {/* Left Skyscraper */}
          <aside className="hidden lg:block w-[160px]">
            <div className="sticky top-24 h-[600px] bg-muted/5 border border-dashed border-muted-foreground/20 rounded-xl flex items-center justify-center text-[10px] text-muted-foreground font-bold uppercase tracking-tighter p-2 text-center">
              Skyscraper Ad<br/>(160x600)
            </div>
          </aside>

          <div className="w-full max-w-[1000px] mx-auto">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-3">{title}</h1>
              <p className="text-muted-foreground">{desc}</p>
            </div>

            <Card className="p-10 md:p-20 border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors rounded-2xl mb-8 relative">
              {isProcessing && (
                <div className="absolute inset-0 bg-background/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
                  <p className="font-bold text-2xl mb-4 text-foreground tracking-tight">Analyzing and Encrypting PDF...</p>
                  <div className="w-full max-w-md bg-muted rounded-full h-4 overflow-hidden mb-8 shadow-inner">
                    <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="w-full max-w-lg aspect-video bg-muted/40 border border-dashed rounded-xl flex flex-col items-center justify-center text-xs text-muted-foreground p-4">
                    <span className="mb-2 uppercase tracking-widest font-bold opacity-50">Advertisement</span>
                    <div className="w-full h-full bg-white/50 rounded-lg flex items-center justify-center text-lg italic font-serif">
                      High Value Display Ad Placeholder
                    </div>
                  </div>
                </div>
              )}

              {isDone ? (
                <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-500">
                   <div className="bg-green-100 text-green-700 p-4 rounded-full mb-6">
                    <Download className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-foreground">Your file is ready!</h3>
                  
                  {/* CRITICAL AD: Above Download */}
                  <div className="w-full max-w-md h-32 bg-primary/5 border border-dashed border-primary/20 rounded-xl mb-8 flex items-center justify-center text-xs text-muted-foreground font-bold">
                    PRE-DOWNLOAD SPONSORED CONTENT (336x280)
                  </div>

                  <div className="flex gap-4 w-full justify-center">
                    <Button variant="outline" onClick={() => { setIsDone(false); setProgress(0); }} className="rounded-full px-8">
                      <RefreshCw className="w-4 h-4 mr-2" /> Start Over
                    </Button>
                    <Button className="rounded-full px-12 font-bold h-12 text-lg shadow-lg">
                      Download Result
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-primary text-primary-foreground p-5 rounded-2xl mb-6 shadow-xl shadow-primary/20">
                    <FileText className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">Drop your files here</h3>
                  <p className="text-muted-foreground mb-8">Click to browse or drag & drop</p>
                  <Button size="lg" className="rounded-full px-10 font-bold h-12" onClick={handleAction}>
                    Choose File
                  </Button>
                </>
              )}
            </Card>

            <Alert className="mb-12 bg-rose-50 border-rose-100 text-rose-900">
              <AlertCircle className="h-4 w-4 text-rose-600" />
              <AlertTitle className="font-bold">1-Hour Auto-Destruct Active</AlertTitle>
              <AlertDescription className="mt-1">
                For your privacy, your file will be **permanently deleted from our servers exactly 1 hour after upload** using our automated node-cron system. We do not store any metadata or logs.
              </AlertDescription>
            </Alert>

            {/* SEO Article Section */}
            <article className="prose prose-slate max-w-none border-t pt-16">
              <h2 className="text-3xl font-extrabold text-foreground mb-8">How to {title}?</h2>
              <div className="grid md:grid-cols-2 gap-12 text-muted-foreground leading-relaxed">
                <div>
                  <p className="mb-6">
                    Our {title} is a professional-grade solution designed for speed, security, and simplicity. Whether you are a student or a business professional, managing documents should never be a hassle.
                  </p>
                  <h3 className="text-xl font-bold text-foreground mb-4">Step-by-Step Guide</h3>
                  <ol className="list-decimal pl-5 mb-6 space-y-2">
                    <li>Upload your file using the secure drop zone above.</li>
                    <li>Wait for our AI-powered engine to process and secure your data.</li>
                    <li>Download your high-quality result instantly.</li>
                  </ol>
                  <h3 className="text-xl font-bold text-foreground mb-4">Is this service free?</h3>
                  <p className="mb-6">
                    Yes, MicroWow provides all {title} services 100% free of charge. Unlike other premium platforms, we do not require registration or credit card details. Our mission is to democratize high-quality document tools for everyone.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Privacy Guaranteed</h3>
                  <p className="mb-6">
                    We take security seriously. Every upload is encrypted with 256-bit SSL technology. Our autonomous backend system ensures that your data is wiped after 60 minutes, giving you complete peace of mind.
                  </p>
                  <h3 className="text-xl font-bold text-foreground mb-4">Fast & High Quality</h3>
                  <p className="mb-6">
                    Optimized for <strong>Core Web Vitals</strong>, our tools ensure that you get the highest quality output without the wait. Perfect for SEO-conscious developers and speed-focused creators.
                  </p>
                  <h3 className="text-xl font-bold text-foreground mb-4">Why use MicroWow?</h3>
                  <p>
                    MicroWow offers a comprehensive suite of tools that are not only free but also respect your privacy. With our 60-minute auto-delete policy, your files are never stored longer than necessary, making it the safest choice for processing sensitive documents.
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Right Skyscraper */}
          <aside className="hidden md:block w-[160px]">
            <div className="sticky top-24 h-[600px] bg-muted/5 border border-dashed border-muted-foreground/20 rounded-xl flex items-center justify-center text-[10px] text-muted-foreground font-bold uppercase tracking-tighter p-2 text-center">
              Skyscraper Ad<br/>(160x600)
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
