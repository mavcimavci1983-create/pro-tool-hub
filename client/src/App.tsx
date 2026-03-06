import { Header } from "@/components/layout/Header";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, lazy } from "react";
import { 
  Scissors, 
  VolumeX, 
  Minimize, 
  Music, 
  Play, 
  Download, 
  ImageIcon, 
  Video, 
  Youtube, 
  FileText, 
  Type, 
  Presentation, 
  RefreshCw,
  Zap,
  Lock,
  Globe,
  FileCode,
  FileJson,
  QrCode,
  StickyNote,
  Smile,
  Clock,
  Layout,
  Sparkles,
  PenTool
} from "lucide-react";

// Lazy loading components
const Home = lazy(() => import("@/pages/Home"));
const ImageToWebp = lazy(() => import("@/pages/ImageToWebp"));
const GenericPdfTool = lazy(() => import("@/pages/GenericPdfTool"));
const VideoTool = lazy(() => import("@/pages/VideoTool"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
    <p className="font-heading font-black text-2xl text-primary animate-pulse uppercase tracking-tighter italic">
      MicroWow
    </p>
    <p className="text-muted-foreground font-medium">Sistem Hazırlanıyor...</p>
  </div>
);

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        
        {/* PDF Silo Tools */}
        <Route path="/tools/rotate-pdf">
          <GenericPdfTool title="Rotate PDF" desc="Rotate your PDF pages to the correct orientation easily." />
        </Route>
        <Route path="/tools/add-watermark">
          <GenericPdfTool title="Add Watermark" desc="Add text or image watermarks to your PDF documents." />
        </Route>
        <Route path="/tools/pdf-to-text">
          <GenericPdfTool title="PDF to Text (OCR)" desc="Convert scanned PDFs into editable text documents using OCR." />
        </Route>
        <Route path="/tools/pdf-to-word">
          <GenericPdfTool title="PDF to Word" desc="Convert PDF documents to editable Microsoft Word files with high accuracy." />
        </Route>
        <Route path="/tools/pdf-to-jpg">
          <GenericPdfTool title="PDF to JPG" desc="Extract pages from PDF as high-quality JPG images." />
        </Route>
        <Route path="/tools/pdf-to-excel">
          <GenericPdfTool title="PDF to Excel" desc="Extract tables from PDF into editable Excel sheets." />
        </Route>
        <Route path="/tools/pdf-to-powerpoint">
          <GenericPdfTool title="PDF to PowerPoint" desc="Convert PDF presentations into editable PPTX slides." />
        </Route>
        <Route path="/tools/word-to-pdf">
          <GenericPdfTool title="Word to PDF" desc="Turn Word documents into high-quality PDF files instantly." />
        </Route>
        <Route path="/tools/jpg-to-pdf">
          <GenericPdfTool title="JPG to PDF" desc="Convert multiple images to a single PDF document in seconds." />
        </Route>
        <Route path="/tools/merge-pdf">
          <GenericPdfTool title="Merge PDF" desc="Combine two or more PDF files into a single document securely." />
        </Route>
        <Route path="/tools/split-pdf">
          <GenericPdfTool title="Split PDF" desc="Separate one page or a whole set for easy conversion into independent PDF files." />
        </Route>
        <Route path="/tools/compress-pdf">
          <GenericPdfTool title="Compress PDF" desc="Reduce the file size of your PDF while maintaining quality." />
        </Route>
        <Route path="/tools/edit-pdf">
          <GenericPdfTool title="Edit PDF" desc="The best free PDF editor online. Add text, images, and shapes easily." />
        </Route>
        <Route path="/tools/remove-password">
          <GenericPdfTool title="Unlock PDF" desc="Unlock secure PDF documents and remove passwords forever." />
        </Route>
        <Route path="/tools/protect-pdf">
          <GenericPdfTool title="Protect PDF" desc="Add a password and encrypt your PDF files to keep them secure." />
        </Route>

        {/* Video Silo Tools */}
        <Route path="/tools/video-to-gif">
          <VideoTool title="Video to GIF" desc="Convert your MP4 or MOV videos to high-quality animated GIFs instantly." icon={Scissors} />
        </Route>
        <Route path="/tools/video-to-mp3">
          <VideoTool title="Video to MP3" desc="Extract high-quality audio from any video file in seconds." icon={Music} />
        </Route>
        <Route path="/tools/mp4-to-webm">
          <VideoTool title="MP4 to WebM" desc="Convert MP4 videos to WebM format for better web performance." icon={Play} />
        </Route>
        <Route path="/tools/mute-video">
          <VideoTool title="Mute Video" desc="Remove audio from your video files while keeping the visual quality." icon={VolumeX} />
        </Route>
        <Route path="/tools/video-resizer">
          <VideoTool title="Video Resizer" desc="Resize your videos for social media platforms without watermarks." icon={Minimize} />
        </Route>
        <Route path="/tools/rotate-video">
          <VideoTool title="Rotate Video" desc="Fix sideways or upside-down videos by rotating them 90, 180, or 270 degrees." icon={RefreshCw} />
        </Route>
        <Route path="/tools/trim-video">
          <VideoTool title="Trim Video" desc="Cut and trim specific parts of your video with frame-perfect accuracy." icon={Scissors} />
        </Route>
        <Route path="/tools/facebook-download">
          <VideoTool title="Facebook Download" desc="Save public Facebook videos to your device for offline viewing." icon={Download} />
        </Route>
        <Route path="/tools/instagram-download">
          <VideoTool title="Instagram Download" desc="Save Instagram reels and videos quickly and easily." icon={Download} />
        </Route>
        <Route path="/tools/twitter-download">
          <VideoTool title="Twitter Download" desc="Download videos from Twitter (X) posts instantly." icon={Download} />
        </Route>

        {/* Converter Silo Tools */}
        <Route path="/tools/excel-to-pdf">
          <GenericPdfTool title="Excel to PDF" desc="Turn Excel spreadsheets into high-quality PDF documents." />
        </Route>
        <Route path="/tools/ppt-to-pdf">
          <GenericPdfTool title="PPT to PDF" desc="Convert PowerPoint presentations to PDF slides securely." />
        </Route>
        <Route path="/tools/epub-to-pdf">
          <GenericPdfTool title="EPUB to PDF" desc="Convert EPUB e-books to standard PDF format for any device." />
        </Route>
        <Route path="/tools/mobi-to-pdf">
          <GenericPdfTool title="MOBI to PDF" desc="Convert Kindle MOBI files to PDF documents easily." />
        </Route>
        <Route path="/tools/pdf-to-epub">
          <GenericPdfTool title="PDF to EPUB" desc="Transform PDF documents into reflowable EPUB e-books." />
        </Route>
        <Route path="/tools/csv-to-json">
          <GenericPdfTool title="CSV to JSON" desc="Convert structured CSV data into JSON format for developers." />
        </Route>
        <Route path="/tools/json-to-excel">
          <GenericPdfTool title="JSON to Excel" desc="Transform JSON data into organized Excel spreadsheets." />
        </Route>
        <Route path="/tools/xml-to-json">
          <GenericPdfTool title="XML to JSON" desc="Convert XML data structures into easy-to-use JSON format." />
        </Route>
        <Route path="/tools/html-to-pdf">
          <GenericPdfTool title="HTML to PDF" desc="Save any web page or HTML code as a high-quality PDF." />
        </Route>
        <Route path="/tools/extract-zip">
          <GenericPdfTool title="Extract ZIP" desc="Uncompress and extract files from ZIP archives online." />
        </Route>
        <Route path="/tools/create-zip">
          <GenericPdfTool title="Create ZIP" desc="Compress multiple files into a single secure ZIP archive." />
        </Route>

        {/* Other Tools Silo */}
        <Route path="/tools/qr-generator">
          <GenericPdfTool title="QR Code Generator" desc="Create custom QR codes for URLs, text, or contact info instantly." />
        </Route>
        <Route path="/tools/barcode-generator">
          <GenericPdfTool title="Barcode Generator" desc="Generate professional barcodes for products and inventory." />
        </Route>
        <Route path="/tools/password-generator">
          <GenericPdfTool title="Password Generator" desc="Create strong, secure, and random passwords to protect your accounts." />
        </Route>
        <Route path="/tools/lorem-ipsum">
          <GenericPdfTool title="Lorem Ipsum Generator" desc="Generate placeholder text for your design and layout projects." />
        </Route>
        <Route path="/tools/html-viewer">
          <GenericPdfTool title="HTML Viewer" desc="Preview and inspect HTML code in real-time with our secure viewer." />
        </Route>
        <Route path="/tools/json-formatter">
          <GenericPdfTool title="JSON Formatter" desc="Clean, format, and validate your JSON data for better readability." />
        </Route>
        <Route path="/tools/my-ip">
          <GenericPdfTool title="My IP Address" desc="Instantly find and display your public IP address and location details." />
        </Route>
        <Route path="/tools/speed-test">
          <GenericPdfTool title="Internet Speed Test" desc="Check your upload and download speeds with our integrated speed test." />
        </Route>
        <Route path="/tools/stopwatch">
          <GenericPdfTool title="Stopwatch" desc="A simple and accurate online stopwatch for timing your tasks." />
        </Route>
        <Route path="/tools/counter">
          <GenericPdfTool title="Online Counter" desc="Tally anything with our easy-to-use digital click counter." />
        </Route>
        <Route path="/tools/case-converter">
          <GenericPdfTool title="Case Converter" desc="Convert text to UPPERCASE, lowercase, Title Case, and more." />
        </Route>
        <Route path="/tools/meme-maker">
          <GenericPdfTool title="Meme Maker" desc="Create funny memes from your images easily." />
        </Route>
        <Route path="/tools/epoch-converter">
          <GenericPdfTool title="Epoch Converter" desc="Convert Unix timestamps to human-readable dates." />
        </Route>

        {/* AI Write Silo Tools */}
        <Route path="/tools/paragraph-writer">
          <GenericPdfTool title="Paragraph Writer" desc="Generate high-quality paragraphs on any topic using AI." />
        </Route>
        <Route path="/tools/essay-writer">
          <GenericPdfTool title="Essay Writer" desc="Create structured essays from a single prompt using AI." />
        </Route>
        <Route path="/tools/blog-post-ideas">
          <GenericPdfTool title="Blog Post Ideas" desc="Get endless inspiration for your next content piece." />
        </Route>
        <Route path="/tools/sentence-expander">
          <GenericPdfTool title="Sentence Expander" desc="Expand short sentences into detailed and descriptive text." />
        </Route>
        <Route path="/tools/instagram-caption-generator">
          <GenericPdfTool title="Instagram Caption" desc="Create engaging captions for your Instagram photos." />
        </Route>
        <Route path="/tools/youtube-title-generator">
          <GenericPdfTool title="YouTube Title Generator" desc="Generate catchy and SEO-friendly titles for your videos." />
        </Route>
        <Route path="/tools/tiktok-script-creator">
          <GenericPdfTool title="TikTok Script Creator" desc="Create viral-ready scripts for your TikTok videos." />
        </Route>
        <Route path="/tools/email-writer">
          <GenericPdfTool title="Email Writer" desc="Write professional or casual emails for any situation." />
        </Route>
        <Route path="/tools/cover-letter-generator">
          <GenericPdfTool title="Cover Letter Generator" desc="Generate personalized cover letters for your job applications." />
        </Route>
        <Route path="/tools/linkedin-post-generator">
          <GenericPdfTool title="LinkedIn Post Generator" desc="Generate professional posts for your LinkedIn network." />
        </Route>
        <Route path="/tools/grammar-fixer">
          <GenericPdfTool title="Grammar Checker" desc="Instantly fix grammar and spelling errors in your text." />
        </Route>
        <Route path="/tools/content-summarizer">
          <GenericPdfTool title="Text Summarizer" desc="Summarize long articles and documents into key points." />
        </Route>
        <Route path="/tools/article-rewriter">
          <GenericPdfTool title="Rewrite Article" desc="Rewrite existing articles to create unique content." />
        </Route>
        <Route path="/tools/content-improver">
          <GenericPdfTool title="Content Improver" desc="Enhance the quality and readability of your existing content." />
        </Route>
        <Route path="/tools/paragraph-completer">
          <GenericPdfTool title="Paragraph Completer" desc="Finish your thoughts and complete paragraphs automatically." />
        </Route>
        <Route path="/tools/story-generator">
          <GenericPdfTool title="Story Generator" desc="Generate creative stories and narratives using AI." />
        </Route>
        <Route path="/tools/ai-humanizer">
          <GenericPdfTool title="AI Humanizer" desc="Rewrite AI text to sound more natural and human-like." />
        </Route>
        <Route path="/tools/tone-of-voice">
          <GenericPdfTool title="Tone of Voice" desc="Analyze and adjust the tone of your writing." />
        </Route>
        <Route path="/tools/youtube-script-writer">
          <GenericPdfTool title="YouTube Script Writer" desc="Generate professional scripts for your YouTube videos." />
        </Route>

        <Route path="/tools/image-to-webp" component={ImageToWebp} />
        <Route path="/tools/remove-background">
          <GenericPdfTool title="Remove Background" desc="AI-powered background removal tool. Processed locally in your browser for 100% privacy." />
        </Route>
        <Route path="/tools/heic-to-jpg">
          <GenericPdfTool title="HEIC to JPG" desc="Convert iPhone HEIC photos to compatible JPG format." />
        </Route>
        <Route path="/tools/webp-to-jpg">
          <GenericPdfTool title="WebP to JPG" desc="Convert WebP images to high-quality JPG format." />
        </Route>
        <Route path="/tools/png-to-jpg">
          <GenericPdfTool title="PNG to JPG" desc="Convert PNG images to JPG with adjustable quality." />
        </Route>
        <Route path="/tools/resize-image">
          <GenericPdfTool title="Resize Image" desc="Change image dimensions while maintaining quality." />
        </Route>
        <Route path="/tools/compress-image">
          <GenericPdfTool title="Compress Image" desc="Reduce image file size with minimal quality loss." />
        </Route>
        <Route path="/tools/crop-image">
          <GenericPdfTool title="Crop Image" desc="Crop images to specific aspect ratios or selections." />
        </Route>
        <Route path="/tools/add-text-to-image">
          <GenericPdfTool title="Add Text to Image" desc="Overlay text on your images with custom fonts." />
        </Route>
        <Route path="/tools/blur-background">
          <GenericPdfTool title="Blur Background" desc="Apply professional bokeh blur to image backgrounds." />
        </Route>
        <Route path="/tools/profile-picture-maker">
          <GenericPdfTool title="Profile Picture Maker" desc="Create professional social media profile pictures." />
        </Route>
        <Route path="/tools/ai-image-generator">
          <GenericPdfTool title="AI Image Generator" desc="Create beautiful images from text descriptions using advanced AI." />
        </Route>
        <Route path="/tools/black-and-white">
          <GenericPdfTool title="Black and White" desc="Convert color images to artistic black and white." />
        </Route>
        <Route path="/tools/upscale-image">
          <GenericPdfTool title="Upscale Image" desc="Increase the resolution and quality of your image using AI." />
        </Route>

        {/* Meta Tools */}
        <Route path="/tools/all-pdf">
          <GenericPdfTool title="All PDF Tools" desc="Browse our complete collection of 45+ PDF processing tools." />
        </Route>
        <Route path="/tools/all-image">
          <GenericPdfTool title="All Image Tools" desc="Explore 30+ AI-powered image editing and optimization tools." />
        </Route>
        <Route path="/tools/all-video">
          <VideoTool title="All Video Tools" desc="Access all our video compression, trimming, and downloading tools." icon={Video} />
        </Route>
        <Route path="/tools/all-write">
          <GenericPdfTool title="All AI Writing Tools" desc="Full suite of AI-powered content generation and editing tools." />
        </Route>
        <Route path="/tools/all-file">
          <GenericPdfTool title="All File Tools" desc="Complete set of CSV, Excel, XML, and JSON conversion utilities." />
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
