import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadCloud, FileImage, Download, RefreshCw, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLocation } from "wouter";

export default function ImageToWebp() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [webpUrl, setWebpUrl] = useState<string | null>(null);
  const [webpSize, setWebpSize] = useState<number>(0);
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
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setWebpUrl(null);
      setProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
      setWebpUrl(null);
      setProgress(0);
    }
  };

  const processImage = () => {
    if (!file || !previewUrl) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate 8 seconds processing time for Ad viewability (Dwell Time)
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 1.25;
      setProgress(Math.min(currentProgress, 100));
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(convertToWebp, 500);
      }
    }, 100);
  };

  const convertToWebp = () => {
    if (!previewUrl) return;
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/webp", 0.8);
        setWebpUrl(dataUrl);
        const base64str = dataUrl.split(',')[1];
        const decoded = atob(base64str);
        setWebpSize(decoded.length);
      }
      setIsProcessing(false);
    };
    img.src = previewUrl;
  };

  const resetTool = () => {
    setFile(null);
    setPreviewUrl(null);
    setWebpUrl(null);
    setProgress(0);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col items-center pt-10 pb-20 px-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-3">
                Image to WebP Converter
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Convert your images (JPG, PNG, GIF) to highly optimized WebP format instantly. 
                Reduce file size without losing quality.
              </p>
            </div>

            <Card className="p-1 md:p-2 border-2 shadow-sm rounded-2xl overflow-hidden bg-card mb-8">
              {!file && !webpUrl && (
                <div 
                  className="border-2 border-dashed border-primary/30 rounded-xl p-10 md:p-20 flex flex-col items-center justify-center text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                  <div className="bg-primary text-primary-foreground p-4 rounded-full mb-6 shadow-lg shadow-primary/20">
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">Upload from PC or Mobile</h3>
                  <p className="text-muted-foreground mb-6">or drag and drop your image here</p>
                </div>
              )}

              {file && !webpUrl && (
                <div className="p-6 md:p-10 flex flex-col items-center">
                  <div className="w-full max-w-sm aspect-video bg-muted rounded-lg overflow-hidden mb-6 flex items-center justify-center border relative group">
                    {previewUrl ? <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" loading="lazy" /> : <FileImage className="w-16 h-16 text-muted-foreground/50" />}
                    {isProcessing && (
                      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                        <p className="font-bold text-lg mb-2">Processing Your Image...</p>
                        <div className="w-full bg-muted rounded-full h-3 mb-4 overflow-hidden">
                          <div className="bg-primary h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="w-full h-32 bg-muted/50 border border-dashed flex items-center justify-center text-[10px] text-muted-foreground rounded italic">
                          Special Offer Loading...
                        </div>
                      </div>
                    )}
                  </div>
                  {!isProcessing && (
                    <div className="flex flex-col items-center w-full">
                      <div className="text-center mb-6">
                        <h4 className="font-bold truncate max-w-xs">{file.name}</h4>
                        <p className="text-sm text-muted-foreground">{formatSize(file.size)}</p>
                      </div>
                      {/* Ad Placeholder above trigger */}
                      <div className="w-full max-w-md h-24 bg-muted/20 border border-dashed flex items-center justify-center text-xs text-muted-foreground mb-6 rounded">
                        Advertisement (320x100)
                      </div>
                      <div className="flex gap-4 w-full justify-center">
                        <Button variant="outline" onClick={resetTool} className="w-32">Cancel</Button>
                        <Button onClick={processImage} className="w-48 font-bold">Convert to WebP</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {webpUrl && (
                <div className="p-6 md:p-10 flex flex-col items-center">
                  <div className="w-full max-w-sm aspect-video bg-muted rounded-lg overflow-hidden mb-8 flex items-center justify-center border">
                    <img src={webpUrl} alt="Converted" className="max-w-full max-h-full object-contain" />
                  </div>
                  
                  {/* CRITICAL AD PLACEMENT: Above Download */}
                  <div className="w-full max-w-md h-32 bg-primary/5 border-2 border-primary/10 border-dashed flex flex-col items-center justify-center text-xs text-muted-foreground mb-8 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                    <span className="font-bold text-primary mb-2 tracking-widest uppercase">Sponsored Result</span>
                    <div className="w-full h-full bg-white/50 rounded border flex items-center justify-center">
                      Ad Placeholder (Display Ad 336x280)
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Button variant="outline" onClick={resetTool} className="w-full sm:w-40"><RefreshCw className="w-4 h-4 mr-2" /> Another</Button>
                    <Button asChild className="w-full sm:w-64 font-bold h-12 text-lg shadow-lg shadow-primary/20">
                      <a href={webpUrl} download={file?.name.replace(/\.[^/.]+$/, "") + ".webp"}>
                        <Download className="w-5 h-5 mr-2" /> Download WebP
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            <Alert className="mb-12 bg-blue-50/50 border-blue-100">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertTitle className="font-bold text-blue-900">Privacy & Security</AlertTitle>
              <AlertDescription className="text-blue-800/80">
                Your images are processed locally or on our secure Node.js backend. All temporary data is automatically purged after 60 minutes.
              </AlertDescription>
            </Alert>

            {/* SEO Content Section */}
            <article className="prose prose-sm max-w-none border-t pt-12 text-muted-foreground">
              <h2 className="text-2xl font-bold text-foreground mb-6">Neden WebP Kullanmalıyız?</h2>
              <p className="mb-4">
                WebP, Google tarafından geliştirilen modern bir görsel formatıdır. Geleneksel JPEG ve PNG formatlarına göre çok daha üstün sıkıştırma algoritmaları sunar. Bir görseli WebP formatına dönüştürdüğünüzde, görüntü kalitesinde gözle görülür bir kayıp olmadan dosya boyutunu %30 ile %80 arasında küçültebilirsiniz.
              </p>
              <h3 className="text-xl font-bold text-foreground mb-4">WebP Dönüştürücü Nasıl Kullanılır?</h3>
              <ol className="list-decimal pl-5 mb-6 space-y-2">
                <li>Dönüştürmek istediğiniz JPG veya PNG dosyasını yukarıdaki yükleme alanına sürükleyin.</li>
                <li>"Convert to WebP" butonuna tıklayarak işlemi başlatın.</li>
                <li>İşlem tamamlandığında optimize edilmiş görselinizi anında indirin.</li>
              </ol>
              <p>
                Sitemiz üzerinden yapacağınız tüm işlemler ücretsizdir ve Core Web Vitals skorlarınızı iyileştirmek için en iyi yoldur. LCP (Largest Contentful Paint) sürenizi düşürerek Google aramalarında daha üst sıralara çıkabilirsiniz.
              </p>
            </article>
          </div>

          {/* Sticky Sidebar Ad Column */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="w-full h-[600px] bg-card border border-dashed border-muted-foreground/30 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Advertisement</span>
                <div className="w-full h-full bg-muted/10 rounded flex items-center justify-center text-xs text-muted-foreground italic">
                  Sticky Sidebar Ad<br/>(300x600)
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                <h4 className="font-bold text-primary mb-2">Core Web Vitals Tip</h4>
                <p className="text-xs text-muted-foreground">
                  WebP formatı sitenizi hızlandırır ve kullanıcı deneyimini iyileştirir.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Anchor Ad */}
      <div className="fixed bottom-0 left-0 right-0 h-[100px] bg-background/80 backdrop-blur-md border-t z-[100] md:hidden flex items-center justify-center">
        <div className="w-[320px] h-[50px] bg-muted/20 border border-dashed flex items-center justify-center text-[10px] text-muted-foreground">
          Mobile Anchor Ad (320x50)
        </div>
        <Button variant="ghost" size="icon" className="absolute -top-4 right-2 h-8 w-8 rounded-full bg-background border shadow-sm">
          ×
        </Button>
      </div>

      <Footer />
    </div>
  );
}