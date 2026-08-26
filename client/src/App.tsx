import { Switch, Route } from "wouter";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import AboutUs from "@/pages/AboutUs";
import Contact from "@/pages/Contact";
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
import { CanonicalTag } from "@/components/seo/CanonicalTag";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* PDF Tools â€” Organize */}
      <Route path="/tools/merge-pdf">{() => <GenericPdfTool title="Merge PDF" desc="Combine multiple PDF files into one." />}</Route>
      <Route path="/tools/split-pdf">{() => <GenericPdfTool title="Split PDF" desc="Separate pages into individual files." />}</Route>
      <Route path="/tools/rotate-pdf">{() => <GenericPdfTool title="Rotate PDF" desc="Rotate pages of your PDF document." />}</Route>
      <Route path="/tools/page-numbers">{() => <GenericPdfTool title="Page Numbers" desc="Add page numbers to your PDF." />}</Route>
      <Route path="/tools/delete-pages">{() => <GenericPdfTool title="Remove Pages" desc="Delete unwanted pages from PDF." />}</Route>
      <Route path="/tools/reorder-pages">{() => <GenericPdfTool title="Reorder Pages" desc="Rearrange PDF page order." />}</Route>

      {/* PDF Tools â€” Convert FROM PDF */}
      <Route path="/tools/pdf-to-word">{() => <GenericPdfTool title="PDF to Word" desc="Convert PDF to editable Word files." />}</Route>
      <Route path="/tools/pdf-to-excel">{() => <GenericPdfTool title="PDF to Excel" desc="Convert PDF tables to Excel spreadsheets." />}</Route>
      <Route path="/tools/pdf-to-jpg">{() => <GenericPdfTool title="PDF to JPG" desc="Convert PDF pages to high-quality images." />}</Route>
      <Route path="/tools/pdf-to-text">{() => <GenericPdfTool title="PDF to Text" desc="Extract text from your PDF file." />}</Route>

      {/* PDF Tools â€” Convert TO PDF */}
      <Route path="/tools/word-to-pdf">{() => <GenericPdfTool title="Word to PDF" desc="Convert Word documents to PDF files." />}</Route>
      <Route path="/tools/ppt-to-pdf">{() => <GenericPdfTool title="PPT to PDF" desc="Convert PowerPoint presentations to PDF." />}</Route>
      <Route path="/tools/jpg-to-pdf">{() => <GenericPdfTool title="JPG to PDF" desc="Convert images to PDF documents." />}</Route>
      <Route path="/tools/html-to-pdf">{() => <GenericPdfTool title="HTML to PDF" desc="Convert web pages to PDF." />}</Route>

      {/* PDF Tools â€” Security & Optimize */}
      <Route path="/tools/compress-pdf">{() => <GenericPdfTool title="Compress PDF" desc="Reduce the size of your PDF files." />}</Route>
      <Route path="/tools/remove-password">{() => <GenericPdfTool title="Unlock PDF" desc="Remove passwords and restrictions from PDFs." />}</Route>
      <Route path="/tools/add-watermark">{() => <GenericPdfTool title="Add Watermark" desc="Stamp text or image on your PDF." />}</Route>
      <Route path="/tools/compare-pdf">{() => <GenericPdfTool title="Compare PDF" desc="Compare two PDF documents." />}</Route>
      <Route path="/tools/translate-pdf">{() => <GenericPdfTool title="Translate PDF" desc="Translate PDF content easily." />}</Route>

      {/* Video Tools */}
      <Route path="/tools/compress-video">{(params) => <VideoTool title="Compress Video" desc="Reduce video file size without quality loss." />}</Route>
      <Route path="/tools/video-to-gif">{(params) => <VideoTool title="Video to GIF" desc="Convert video clips into animated GIFs." />}</Route>
      <Route path="/tools/video-to-mp3">{(params) => <VideoTool title="Video to MP3" desc="Extract high-quality audio from videos." />}</Route>
      <Route path="/tools/mp4-to-webm">{(params) => <VideoTool title="MP4 to WebM" desc="Convert MP4 videos to WebM format." />}</Route>
      <Route path="/tools/mute-video">{(params) => <VideoTool title="Mute Video" desc="Remove audio track from any video file." />}</Route>
      <Route path="/tools/video-resizer">{(params) => <VideoTool title="Video Resizer" desc="Resize video dimensions for social media." />}</Route>
      <Route path="/tools/rotate-video">{(params) => <VideoTool title="Rotate Video" desc="Rotate your video 90, 180, or 270 degrees." />}</Route>
      <Route path="/tools/trim-video">{(params) => <VideoTool title="Trim Video" desc="Cut and trim video segments easily." />}</Route>

      {/* Image Tools */}
      <Route path="/tools/image-to-webp">{(params) => <ImageTool title="Image to WebP" desc="Convert images to next-gen WebP format." />}</Route>
      <Route path="/tools/remove-background">{(params) => <ImageTool title="Remove Background" desc="AI-powered background removal tool." />}</Route>
      <Route path="/tools/heic-to-jpg">{(params) => <ImageTool title="HEIC to JPG" desc="Convert Apple HEIC photos to JPG format." />}</Route>
      <Route path="/tools/webp-to-jpg">{(params) => <ImageTool title="WebP to JPG" desc="Convert WebP images to standard JPG." />}</Route>
      <Route path="/tools/webp-to-png">{(params) => <ImageTool title="WebP to PNG" desc="Convert WebP images to PNG format." />}</Route>
      <Route path="/tools/resize-image">{(params) => <ImageTool title="Resize Image" desc="Change image dimensions easily." />}</Route>
      <Route path="/tools/compress-image">{(params) => <ImageTool title="Compress Image" desc="Reduce image file size with quality control." />}</Route>
      <Route path="/tools/crop-image">{(params) => <ImageTool title="Crop Image" desc="Crop images to specific aspect ratios." />}</Route>
      <Route path="/tools/add-text-to-image">{(params) => <ImageTool title="Add Text" desc="Add stylish text overlays to your images." />}</Route>

      <Route path="/tools/csv-to-json">{(params) => <GenericConverterTool title="CSV to JSON" desc="Convert CSV spreadsheets to JSON data." />}</Route>
      <Route path="/tools/json-to-csv">{(params) => <GenericConverterTool title="JSON to CSV" desc="Convert JSON data to CSV spreadsheets." />}</Route>
      <Route path="/tools/excel-to-pdf">{(params) => <GenericConverterTool title="Excel to PDF" desc="Turn Excel spreadsheets into PDF documents." />}</Route>
      <Route path="/tools/xml-to-json">{(params) => <GenericConverterTool title="XML to JSON" desc="Convert XML data to JSON format." />}</Route>

      {/* AI Tools */}
      <Route path="/tools/paragraph-writer">{(params) => <GenericAiTool title="Paragraph Writer" desc="Generate professional paragraphs instantly." />}</Route>
      <Route path="/tools/essay-writer">{(params) => <GenericAiTool title="Essay Writer" desc="AI-powered essay writing assistant." />}</Route>
      <Route path="/tools/story-generator">{(params) => <GenericAiTool title="Story Generator" desc="AI-powered creative story writing." />}</Route>
      <Route path="/tools/content-improver">{(params) => <GenericAiTool title="Content Improver" desc="Enhance and polish your writing with AI." />}</Route>
      <Route path="/tools/blog-post-idea">{(params) => <GenericAiTool title="Blog Post Idea" desc="Generate unique blog ideas with AI." />}</Route>
      <Route path="/tools/instagram-caption-generator">{(params) => <GenericAiTool title="Instagram Caption" desc="Create engaging captions for your reels." />}</Route>
      <Route path="/tools/linkedin-post-generator">{(params) => <GenericAiTool title="LinkedIn Post" desc="Professional posts for your network." />}</Route>

      {/* Other Tools */}

      <Route path="/privacy-policy"><PrivacyPolicy /></Route>
      <Route path="/terms"><TermsOfService /></Route>
      <Route path="/cookie-policy"><CookiePolicy /></Route>
      <Route path="/about"><AboutUs /></Route>
      <Route path="/contact"><Contact /></Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CanonicalTag />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}



