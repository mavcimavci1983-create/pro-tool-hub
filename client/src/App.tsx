import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy } from "react";

// Standard Imports for Core Stability
import Home from "@/pages/Home";
import GenericPdfTool from "@/pages/GenericPdfTool";
import VideoTool from "@/pages/VideoTool";
import ImageToWebp from "@/pages/ImageToWebp";
import NotFound from "@/pages/not-found";

const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
    <p className="font-heading font-black text-2xl text-primary animate-pulse uppercase tracking-tighter italic">MicroWow</p>
    <p className="text-muted-foreground font-medium italic text-sm">Sistem Hazırlanıyor...</p>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tools/image-to-webp" component={ImageToWebp} />
        
        {/* PDF Tools */}
        <Route path="/tools/rotate-pdf">{() => <GenericPdfTool title="Rotate PDF" desc="Rotate your PDF pages easily." />}</Route>
        <Route path="/tools/add-watermark">{() => <GenericPdfTool title="Add Watermark" desc="Add text or image watermarks." />}</Route>
        <Route path="/tools/pdf-to-text">{() => <GenericPdfTool title="PDF to Text" desc="Convert PDF to text using OCR." />}</Route>
        <Route path="/tools/pdf-to-word">{() => <GenericPdfTool title="PDF to Word" desc="Convert PDF to editable Word." />}</Route>
        <Route path="/tools/pdf-to-jpg">{() => <GenericPdfTool title="PDF to JPG" desc="Extract PDF pages as images." />}</Route>
        <Route path="/tools/pdf-to-excel">{() => <GenericPdfTool title="PDF to Excel" desc="Extract PDF tables to Excel." />}</Route>
        <Route path="/tools/pdf-to-powerpoint">{() => <GenericPdfTool title="PDF to PowerPoint" desc="Convert PDF to PPT slides." />}</Route>
        <Route path="/tools/word-to-pdf">{() => <GenericPdfTool title="Word to PDF" desc="Turn Word docs into PDF." />}</Route>
        <Route path="/tools/jpg-to-pdf">{() => <GenericPdfTool title="JPG to PDF" desc="Convert images to PDF." />}</Route>
        <Route path="/tools/merge-pdf">{() => <GenericPdfTool title="Merge PDF" desc="Combine PDF files securely." />}</Route>
        <Route path="/tools/split-pdf">{() => <GenericPdfTool title="Split PDF" desc="Separate PDF pages easily." />}</Route>
        <Route path="/tools/compress-pdf">{() => <GenericPdfTool title="Compress PDF" desc="Reduce PDF file size." />}</Route>
        <Route path="/tools/edit-pdf">{() => <GenericPdfTool title="Edit PDF" desc="Free online PDF editor." />}</Route>
        <Route path="/tools/remove-password">{() => <GenericPdfTool title="Unlock PDF" desc="Remove PDF passwords." />}</Route>
        <Route path="/tools/protect-pdf">{() => <GenericPdfTool title="Protect PDF" desc="Encrypt your PDF files." />}</Route>

        {/* Video Tools */}
        <Route path="/tools/video-to-gif">{() => <VideoTool title="Video to GIF" desc="Create animated GIFs from video." />}</Route>
        <Route path="/tools/video-to-mp3">{() => <VideoTool title="Video to MP3" desc="Extract audio from video." />}</Route>
        <Route path="/tools/mp4-to-webm">{() => <VideoTool title="MP4 to WebM" desc="Convert video for web." />}</Route>
        <Route path="/tools/mute-video">{() => <VideoTool title="Mute Video" desc="Remove video sound." />}</Route>
        <Route path="/tools/video-resizer">{() => <VideoTool title="Video Resizer" desc="Resize video for social media." />}</Route>
        <Route path="/tools/rotate-video">{() => <VideoTool title="Rotate Video" desc="Fix video orientation." />}</Route>
        <Route path="/tools/trim-video">{() => <VideoTool title="Trim Video" desc="Cut and trim video clips." />}</Route>
        <Route path="/tools/compress-video">{() => <VideoTool title="Compress Video" desc="Reduce video size." />}</Route>
        <Route path="/tools/facebook-download">{() => <VideoTool title="Facebook Download" desc="Save Facebook videos." />}</Route>
        <Route path="/tools/tiktok-downloader">{() => <VideoTool title="TikTok Downloader" desc="No watermark TikTok download." />}</Route>
        <Route path="/tools/instagram-download">{() => <VideoTool title="Instagram Download" desc="Save IG reels and videos." />}</Route>
        <Route path="/tools/twitter-download">{() => <VideoTool title="Twitter Download" desc="Download Twitter videos." />}</Route>
        <Route path="/tools/youtube-to-text">{() => <VideoTool title="YouTube to Text" desc="Convert YT video to text." />}</Route>
        <Route path="/tools/video-to-text">{() => <VideoTool title="Video to Text" desc="Transcribe video files." />}</Route>

        {/* Other & AI Tools */}
        <Route path="/tools/qr-generator">{() => <GenericPdfTool title="QR Code Generator" />}</Route>
        <Route path="/tools/password-generator">{() => <GenericPdfTool title="Password Generator" />}</Route>
        <Route path="/tools/json-formatter">{() => <GenericPdfTool title="JSON Formatter" />}</Route>
        <Route path="/tools/speed-test">{() => <GenericPdfTool title="Internet Speed Test" />}</Route>
        <Route path="/tools/paragraph-writer">{() => <GenericPdfTool title="Paragraph Writer" />}</Route>
        <Route path="/tools/essay-writer">{() => <GenericPdfTool title="Essay Writer" />}</Route>
        <Route path="/tools/remove-background">{() => <GenericPdfTool title="Remove Background" />}</Route>
        <Route path="/tools/heic-to-jpg">{() => <GenericPdfTool title="HEIC to JPG" />}</Route>
        <Route path="/tools/webp-to-jpg">{() => <GenericPdfTool title="WebP to JPG" />}</Route>

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
