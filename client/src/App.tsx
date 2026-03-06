import { Switch, Route } from "wouter";
import Home from "./pages/Home";
import GenericPdfTool from "./pages/GenericPdfTool";
import VideoTool from "./pages/VideoTool";
import ImageTool from "./pages/ImageTool";
import GenericConverterTool from "./pages/GenericConverterTool";
import GenericAiTool from "./pages/GenericAiTool";
import NotFound from "./pages/NotFound";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* PDF Tools */}
      <Route path="/tools/merge-pdf">{(params) => <GenericPdfTool title="Merge PDF" desc="Combine multiple PDF files into one." />}</Route>
      <Route path="/tools/edit-pdf">{(params) => <GenericPdfTool title="Edit PDF" desc="Edit PDF text and images directly." />}</Route>
      <Route path="/tools/pdf-to-jpg">{(params) => <GenericPdfTool title="PDF to JPG" desc="Convert PDF pages into high-quality images." />}</Route>
      <Route path="/tools/jpg-to-pdf">{(params) => <GenericPdfTool title="JPG to PDF" desc="Convert JPG images to PDF documents." />}</Route>
      <Route path="/tools/compress-pdf">{(params) => <GenericPdfTool title="Compress PDF" desc="Reduce the size of your PDF files." />}</Route>
      <Route path="/tools/split-pdf">{(params) => <GenericPdfTool title="Split PDF" desc="Separate pages of a PDF into individual files." />}</Route>
      <Route path="/tools/pdf-to-word">{(params) => <GenericPdfTool title="PDF to Word" desc="Convert PDF documents to editable Word files." />}</Route>
      <Route path="/tools/word-to-pdf">{(params) => <GenericPdfTool title="Word to PDF" desc="Convert Word documents to PDF files." />}</Route>
      <Route path="/tools/remove-password">{(params) => <GenericPdfTool title="Unlock PDF" desc="Remove passwords and restrictions from PDFs." />}</Route>
      <Route path="/tools/protect-pdf">{(params) => <GenericPdfTool title="Protect PDF" desc="Add a password to secure your PDF file." />}</Route>
      <Route path="/tools/rotate-pdf">{(params) => <GenericPdfTool title="Rotate PDF" desc="Rotate pages of your PDF document." />}</Route>
      <Route path="/tools/add-watermark">{(params) => <GenericPdfTool title="Add Watermark" desc="Stamp an image or text over your PDF." />}</Route>
      <Route path="/tools/pdf-to-text">{(params) => <GenericPdfTool title="PDF to Text" desc="Extract text from your PDF file." />}</Route>
      <Route path="/tools/pdf-to-excel">{(params) => <GenericPdfTool title="PDF to Excel" desc="Convert PDF tables to Excel spreadsheets." />}</Route>
      <Route path="/tools/pdf-to-powerpoint">{(params) => <GenericPdfTool title="PDF to PPT" desc="Convert PDF files to PowerPoint presentations." />}</Route>

      {/* Video Tools */}
      <Route path="/tools/youtube-to-text">{(params) => <VideoTool title="YouTube to Text" desc="Extract transcription from any YouTube video." />}</Route>
      <Route path="/tools/compress-video">{(params) => <VideoTool title="Compress Video" desc="Reduce video file size without quality loss." />}</Route>
      <Route path="/tools/instagram-download">{(params) => <VideoTool title="Instagram Download" desc="Download videos and reels from Instagram." />}</Route>
      <Route path="/tools/tiktok-downloader">{(params) => <VideoTool title="TikTok Downloader" desc="Download TikTok videos without watermarks." />}</Route>
      <Route path="/tools/video-to-gif">{(params) => <VideoTool title="Video to GIF" desc="Convert video clips into animated GIFs." />}</Route>
      <Route path="/tools/video-to-mp3">{(params) => <VideoTool title="Video to MP3" desc="Extract high-quality audio from videos." />}</Route>
      <Route path="/tools/mp4-to-webm">{(params) => <VideoTool title="MP4 to WebM" desc="Convert MP4 videos to WebM format." />}</Route>
      <Route path="/tools/mute-video">{(params) => <VideoTool title="Mute Video" desc="Remove audio track from any video file." />}</Route>
      <Route path="/tools/video-resizer">{(params) => <VideoTool title="Video Resizer" desc="Resize video dimensions for social media." />}</Route>
      <Route path="/tools/rotate-video">{(params) => <VideoTool title="Rotate Video" desc="Rotate your video 90, 180, or 270 degrees." />}</Route>
      <Route path="/tools/trim-video">{(params) => <VideoTool title="Trim Video" desc="Cut and trim video segments easily." />}</Route>
      <Route path="/tools/facebook-download">{(params) => <VideoTool title="Facebook Download" desc="Download videos directly from Facebook." />}</Route>
      <Route path="/tools/twitter-download">{(params) => <VideoTool title="Twitter Download" desc="Download videos from Twitter/X." />}</Route>
      <Route path="/tools/video-to-text">{(params) => <VideoTool title="Video to Text" desc="Transcribe your local video files to text." />}</Route>

      {/* Image Tools */}
      <Route path="/tools/image-to-webp">{(params) => <ImageTool title="Image to WebP" desc="Convert images to next-gen WebP format." />}</Route>
      <Route path="/tools/remove-background">{(params) => <ImageTool title="Remove Background" desc="AI-powered background removal tool." />}</Route>
      <Route path="/tools/heic-to-jpg">{(params) => <ImageTool title="HEIC to JPG" desc="Convert Apple HEIC photos to JPG format." />}</Route>
      <Route path="/tools/webp-to-jpg">{(params) => <ImageTool title="WebP to JPG" desc="Convert WebP images to standard JPG." />}</Route>
      <Route path="/tools/resize-image">{(params) => <ImageTool title="Resize Image" desc="Change image dimensions easily." />}</Route>
      <Route path="/tools/compress-image">{(params) => <ImageTool title="Compress Image" desc="Reduce image file size with quality control." />}</Route>
      <Route path="/tools/crop-image">{(params) => <ImageTool title="Crop Image" desc="Crop images to specific aspect ratios." />}</Route>
      <Route path="/tools/add-text-to-image">{(params) => <ImageTool title="Add Text" desc="Add stylish text overlays to your images." />}</Route>

      {/* Converter Tools */}
      <Route path="/tools/csv-to-json">{(params) => <GenericConverterTool title="CSV to JSON" desc="Convert CSV spreadsheets to JSON data." />}</Route>
      <Route path="/tools/json-to-csv">{(params) => <GenericConverterTool title="JSON to CSV" desc="Convert JSON data to CSV spreadsheets." />}</Route>
      <Route path="/tools/excel-to-pdf">{(params) => <GenericConverterTool title="Excel to PDF" desc="Turn Excel spreadsheets into PDF documents." />}</Route>

      {/* AI Tools */}
      <Route path="/tools/paragraph-writer">{(params) => <GenericAiTool title="Paragraph Writer" desc="Generate professional paragraphs instantly." />}</Route>
      <Route path="/tools/essay-writer">{(params) => <GenericAiTool title="Essay Writer" desc="AI-powered essay writing assistant." />}</Route>
      <Route path="/tools/story-generator">{(params) => <GenericAiTool title="Story Generator" desc="AI-powered creative story writing." />}</Route>
      <Route path="/tools/content-improver">{(params) => <GenericAiTool title="Content Improver" desc="Enhance and polish your writing with AI." />}</Route>
      <Route path="/tools/instagram-caption-generator">{(params) => <GenericAiTool title="Instagram Caption" desc="Create engaging captions for your reels." />}</Route>
      <Route path="/tools/linkedin-post-generator">{(params) => <GenericAiTool title="LinkedIn Post" desc="Professional posts for your network." />}</Route>

      {/* Generic Tool Catch-all */}
      <Route path="/tools/:id">{(params) => <GenericPdfTool title={params.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} desc="Professional online tool for your digital needs." />}</Route>
      
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
