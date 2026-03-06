import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import Home from "@/pages/Home";
import GenericPdfTool from "@/pages/GenericPdfTool";
import VideoTool from "@/pages/VideoTool";
import ImageToWebp from "@/pages/ImageToWebp";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tools/image-to-webp" component={ImageToWebp} />
      
      {/* PDF Tools */}
      <Route path="/tools/rotate-pdf">{() => <GenericPdfTool title="Rotate PDF" desc="Rotate your PDF pages easily." />}</Route>
      <Route path="/tools/add-watermark">{() => <GenericPdfTool title="Add Watermark" desc="Add text or image watermarks." />}</Route>
      <Route path="/tools/pdf-to-text">{() => <GenericPdfTool title="PDF to Text" desc="Convert PDF to text using OCR." />}</Route>
      <Route path="/tools/pdf-to-word">{() => <GenericPdfTool title="PDF to Word" desc="Convert PDF documents to editable Microsoft Word files." />}</Route>
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

      {/* Other & AI Tools - Standardizing slugs */}
      <Route path="/tools/qr-generator">{() => <GenericPdfTool title="QR Code Generator" desc="Create custom QR codes instantly." />}</Route>
      <Route path="/tools/barcode-generator">{() => <GenericPdfTool title="Barcode Generator" desc="Generate professional barcodes." />}</Route>
      <Route path="/tools/password-generator">{() => <GenericPdfTool title="Password Generator" desc="Create secure passwords." />}</Route>
      <Route path="/tools/lorem-ipsum">{() => <GenericPdfTool title="Lorem Ipsum" desc="Generate placeholder text." />}</Route>
      <Route path="/tools/html-viewer">{() => <GenericPdfTool title="HTML Viewer" desc="Preview HTML code." />}</Route>
      <Route path="/tools/json-formatter">{() => <GenericPdfTool title="JSON Formatter" desc="Format and validate JSON." />}</Route>
      <Route path="/tools/my-ip">{() => <GenericPdfTool title="My IP Address" desc="Check your public IP." />}</Route>
      <Route path="/tools/speed-test">{() => <GenericPdfTool title="Internet Speed Test" desc="Check your internet speed." />}</Route>
      <Route path="/tools/stopwatch">{() => <GenericPdfTool title="Stopwatch" desc="Online timing tool." />}</Route>
      <Route path="/tools/counter">{() => <GenericPdfTool title="Counter" desc="Online click counter." />}</Route>
      <Route path="/tools/case-converter">{() => <GenericPdfTool title="Case Converter" desc="Change text case." />}</Route>
      <Route path="/tools/meme-maker">{() => <GenericPdfTool title="Meme Maker" desc="Generate memes easily." />}</Route>
      <Route path="/tools/epoch-converter">{() => <GenericPdfTool title="Epoch Converter" desc="Convert unix timestamps." />}</Route>
      
      {/* AI Writing */}
      <Route path="/tools/paragraph-writer">{() => <GenericPdfTool title="Paragraph Writer" desc="AI-powered paragraph generation." />}</Route>
      <Route path="/tools/essay-writer">{() => <GenericPdfTool title="Essay Writer" desc="AI essay writing assistant." />}</Route>
      <Route path="/tools/content-improver">{() => <GenericPdfTool title="Content Improver" desc="Enhance your writing with AI." />}</Route>
      <Route path="/tools/sentence-expander">{() => <GenericPdfTool title="Sentence Expander" desc="Expand your thoughts with AI." />}</Route>
      <Route path="/tools/instagram-caption-generator">{() => <GenericPdfTool title="Instagram Caption" desc="AI IG captions." />}</Route>
      <Route path="/tools/youtube-title-generator">{() => <GenericPdfTool title="YouTube Title Generator" desc="AI YT titles." />}</Route>
      <Route path="/tools/tiktok-script-creator">{() => <GenericPdfTool title="TikTok Script Creator" desc="AI TikTok scripts." />}</Route>
      <Route path="/tools/email-writer">{() => <GenericPdfTool title="Email Writer" desc="Professional AI emails." />}</Route>
      <Route path="/tools/cover-letter-generator">{() => <GenericPdfTool title="Cover Letter Generator" desc="AI job applications." />}</Route>
      <Route path="/tools/linkedin-post-generator">{() => <GenericPdfTool title="LinkedIn Post Generator" desc="AI professional posts." />}</Route>
      <Route path="/tools/grammar-fixer">{() => <GenericPdfTool title="Grammar Checker" desc="AI grammar correction." />}</Route>
      <Route path="/tools/content-summarizer">{() => <GenericPdfTool title="Text Summarizer" desc="AI summarization." />}</Route>
      <Route path="/tools/article-rewriter">{() => <GenericPdfTool title="Rewrite Article" desc="AI unique content." />}</Route>
      <Route path="/tools/ai-humanizer">{() => <GenericPdfTool title="AI Humanizer" desc="Natural AI text." />}</Route>
      <Route path="/tools/tone-of-voice">{() => <GenericPdfTool title="Tone of Voice" desc="Tone analysis AI." />}</Route>

      {/* Image Tools */}
      <Route path="/tools/remove-background">{() => <GenericPdfTool title="Remove Background" desc="AI background removal." />}</Route>
      <Route path="/tools/heic-to-jpg">{() => <GenericPdfTool title="HEIC to JPG" desc="iPhone photo converter." />}</Route>
      <Route path="/tools/webp-to-jpg">{() => <GenericPdfTool title="WebP to JPG" desc="WebP to JPG converter." />}</Route>
      <Route path="/tools/png-to-jpg">{() => <GenericPdfTool title="PNG to JPG" desc="PNG to JPG converter." />}</Route>
      <Route path="/tools/resize-image">{() => <GenericPdfTool title="Resize Image" desc="Change image size." />}</Route>
      <Route path="/tools/compress-image">{() => <GenericPdfTool title="Compress Image" desc="Reduce image size." />}</Route>
      <Route path="/tools/crop-image">{() => <GenericPdfTool title="Crop Image" desc="Crop photos easily." />}</Route>
      <Route path="/tools/add-text-to-image">{() => <GenericPdfTool title="Add Text to Image" desc="Text on photos." />}</Route>
      <Route path="/tools/blur-background">{() => <GenericPdfTool title="Blur Background" desc="Bokeh blur effects." />}</Route>
      <Route path="/tools/profile-picture-maker">{() => <GenericPdfTool title="Profile Picture Maker" desc="Social profiles." />}</Route>
      <Route path="/tools/ai-image-generator">{() => <GenericPdfTool title="AI Image Generator" desc="Text to image AI." />}</Route>
      <Route path="/tools/black-and-white">{() => <GenericPdfTool title="Black and White" desc="B&W photo filters." />}</Route>
      <Route path="/tools/upscale-image">{() => <GenericPdfTool title="Upscale Image" desc="AI image enhancement." />}</Route>

      {/* Catch-all for tools/* to prevent 404 on valid tool paths not yet fully mapped */}
      <Route path="/tools/:id">{(params) => <GenericPdfTool title={params.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} desc="Professional utility tool." />}</Route>

      <Route component={NotFound} />
    </Switch>
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
