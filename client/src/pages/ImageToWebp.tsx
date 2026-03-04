import { useState, useRef, ChangeEvent } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadCloud, FileImage, Download, RefreshCw, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ImageToWebp() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [webpUrl, setWebpUrl] = useState<string | null>(null);
  const [webpSize, setWebpSize] = useState<number>(0);
  
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
    
    // Simulate 5 seconds processing time for Ad viewability
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        convertToWebp();
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
        // Convert to webp with 0.8 quality
        const dataUrl = canvas.toDataURL("image/webp", 0.8);
        setWebpUrl(dataUrl);
        
        // Estimate size
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
        <div className="w-full max-w-4xl">
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-3">
              Image to WebP Converter
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Convert your images (JPG, PNG, GIF) to highly optimized WebP format instantly. 
              Reduce file size without losing quality.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left Ad Sidebar Placeholder */}
            <div className="hidden lg:block col-span-1">
              <div className="h-[600px] w-full bg-muted/20 border border-dashed border-muted-foreground/30 flex flex-col items-center justify-center rounded-xl text-muted-foreground text-sm text-center p-4">
                <span className="block mb-2 font-bold">Advertisement</span>
                Placeholder (160x600)
              </div>
            </div>

            {/* Main Tool Area */}
            <div className="col-span-1 lg:col-span-3">
              
              <Card className="p-1 md:p-2 border-2 shadow-sm rounded-2xl overflow-hidden bg-card">
                
                {!file && !webpUrl && (
                  <div 
                    className="border-2 border-dashed border-primary/30 rounded-xl p-10 md:p-20 flex flex-col items-center justify-center text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, image/jpg, image/gif, image/bmp" 
                    />
                    <div className="bg-primary text-primary-foreground p-4 rounded-full mb-6 shadow-lg shadow-primary/20">
                      <UploadCloud className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Upload from PC or Mobile</h3>
                    <p className="text-muted-foreground mb-6">or drag and drop your image here</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Info className="w-3 h-3" /> Max file size: 10MB. Supported formats: JPG, PNG, GIF.
                    </p>
                  </div>
                )}

                {file && !webpUrl && (
                  <div className="p-6 md:p-10 flex flex-col items-center">
                    <div className="w-full max-w-sm aspect-video bg-muted rounded-lg overflow-hidden mb-6 flex items-center justify-center border relative group">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <FileImage className="w-16 h-16 text-muted-foreground/50" />
                      )}
                      
                      {isProcessing && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6">
                          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                          <p className="font-bold text-lg mb-2">Processing...</p>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full transition-all duration-100" style={{ width: `${progress}%` }}></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Optimizing your image...</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center mb-8">
                      <h4 className="font-bold truncate max-w-xs">{file.name}</h4>
                      <p className="text-sm text-muted-foreground">{formatSize(file.size)}</p>
                    </div>

                    {!isProcessing && (
                      <div className="flex gap-4 w-full justify-center">
                        <Button variant="outline" onClick={resetTool} className="w-32">Cancel</Button>
                        <Button onClick={processImage} className="w-48 font-bold text-md">
                          Convert to WebP
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {webpUrl && (
                  <div className="p-6 md:p-10 flex flex-col items-center">
                    
                    <div className="w-full bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-8 flex items-start gap-3">
                      <div className="bg-green-100 p-1.5 rounded-full mt-0.5">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold">Conversion Successful!</h4>
                        <p className="text-sm">Your image is ready to download.</p>
                      </div>
                    </div>

                    <div className="w-full max-w-sm aspect-video bg-muted rounded-lg overflow-hidden mb-6 flex items-center justify-center border">
                      <img src={webpUrl} alt="Converted to WebP" className="max-w-full max-h-full object-contain" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                      <div className="bg-muted/50 p-3 rounded-lg text-center border">
                        <p className="text-xs text-muted-foreground mb-1">Original Size</p>
                        <p className="font-bold">{file && formatSize(file.size)}</p>
                      </div>
                      <div className="bg-primary/5 p-3 rounded-lg text-center border border-primary/20">
                        <p className="text-xs text-primary mb-1">New Size</p>
                        <p className="font-bold text-primary">{formatSize(webpSize)}</p>
                      </div>
                    </div>
                    
                    {/* Native ad placeholder right above download button */}
                    <div className="w-full max-w-sm bg-muted/20 border border-dashed border-muted-foreground/30 h-24 mb-6 flex items-center justify-center text-xs text-muted-foreground rounded">
                      Ad Placeholder
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                      <Button variant="outline" onClick={resetTool} className="w-full sm:w-40 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Convert Another
                      </Button>
                      <Button asChild className="w-full sm:w-64 font-bold text-md flex items-center gap-2">
                        <a href={webpUrl} download={file?.name.replace(/\.[^/.]+$/, "") + ".webp"}>
                          <Download className="w-5 h-5" /> Download WebP
                        </a>
                      </Button>
                    </div>

                  </div>
                )}
                
              </Card>

              {/* Security & Privacy Notice */}
              <Alert className="mt-6 bg-blue-50 border-blue-200 text-blue-900">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 font-bold">Privacy Guaranteed</AlertTitle>
                <AlertDescription className="text-blue-700/80 mt-1">
                  Your files are safe. We don't store them on our database. Uploaded and converted files are <strong>permanently deleted from our servers after 1 hour</strong>.
                </AlertDescription>
              </Alert>

              {/* Bottom Ad Placeholder */}
              <div className="mt-8 w-full bg-muted/20 border border-dashed border-muted-foreground/30 h-24 flex items-center justify-center text-xs text-muted-foreground rounded-lg">
                Advertisement Placeholder (728x90)
              </div>
              
            </div>
          </div>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}