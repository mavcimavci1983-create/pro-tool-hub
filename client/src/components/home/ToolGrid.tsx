import { useState } from "react";
import { Link } from "wouter";
import { 
  FileText, 
  ImageIcon, 
  Video, 
  PenTool,
  Scissors,
  Merge,
  Type,
  Minimize2,
  Maximize2,
  VolumeX,
  Minimize,
  FileCode,
  Music,
  Play,
  Download,
  Table,
  FileJson,
  RefreshCw,
  Eraser,
  Wand2,
  Sparkles,
  FileEdit,
  ArrowRight,
  Search,
  Lock,
  Youtube,
  Instagram,
  Twitter,
  FileSearch,
  Languages,
  Signature,
  Layout,
  History,
  EyeOff,
  Files,
  QrCode,
  StickyNote,
  Smile,
  Zap,
  Clock,
  BookOpen,
  CheckCircle2,
  MessageSquare,
  Building2,
  Clapperboard,
  Contrast
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const allTools = [
  // PDF Tools (Görsel 1)
  { title: "Merge PDF", desc: "Merge 2 or more PDF files into a single PDF file", cat: "Pdf Tools", icon: <Merge className="w-5 h-5 text-rose-500" />, link: "/tools/merge-pdf" },
  { title: "Edit PDF", desc: "Free PDF Editor online", cat: "Pdf Tools", icon: <PenTool className="w-5 h-5 text-emerald-500" />, link: "/tools/edit-pdf" },
  { title: "PDF to JPG", desc: "Convert PDF to JPG and download each page as an image", cat: "Pdf Tools", icon: <ImageIcon className="w-5 h-5 text-blue-500" />, link: "/tools/pdf-to-jpg" },
  { title: "JPG to PDF", desc: "Upload images and receive as a PDF", cat: "Pdf Tools", icon: <ImageIcon className="w-5 h-5 text-emerald-500" />, link: "/tools/jpg-to-pdf" },
  { title: "Compress PDF", desc: "Lessen the file size of a PDF file", cat: "Pdf Tools", icon: <Minimize2 className="w-5 h-5 text-purple-500" />, link: "/tools/compress-pdf" },
  { title: "Split PDF", desc: "Split into one or multiple PDF files", cat: "Pdf Tools", icon: <Scissors className="w-5 h-5 text-purple-500" />, link: "/tools/split-pdf" },
  { title: "PDF to Word", desc: "Convert a PDF to Word Document", cat: "Pdf Tools", icon: <FileText className="w-5 h-5 text-orange-500" />, link: "/tools/pdf-to-word" },
  { title: "Word to PDF", desc: "Convert a Word Document to PDF", cat: "Pdf Tools", icon: <FileText className="w-5 h-5 text-blue-600" />, link: "/tools/word-to-pdf" },
  { title: "Unlock PDF", desc: "Remove the password from a PDF file", cat: "Pdf Tools", icon: <Lock className="w-5 h-5 text-cyan-500" />, link: "/tools/remove-password" },
  { title: "PDF to Excel", desc: "Convert from PDF to XLSX", cat: "Pdf Tools", icon: <Table className="w-5 h-5 text-green-600" />, link: "/tools/pdf-to-excel" },
  { title: "PDF to Powerpoint", desc: "Upload a PDF and Download as a PPTX", cat: "Pdf Tools", icon: <Presentation className="w-5 h-5 text-orange-600" />, link: "/tools/pdf-to-powerpoint" },
  { title: "PNG to PDF", desc: "Upload images and receive as a PDF", cat: "Pdf Tools", icon: <ImageIcon className="w-5 h-5 text-emerald-500" />, link: "/tools/png-to-pdf" },
  { title: "Rotate PDF", desc: "Rotate your PDF pages easily", cat: "Pdf Tools", icon: <RefreshCw className="w-5 h-5 text-indigo-500" />, link: "/tools/rotate-pdf" },
  { title: "Add Watermark", desc: "Add watermark to your PDF", cat: "Pdf Tools", icon: <Signature className="w-5 h-5 text-blue-400" />, link: "/tools/add-watermark" },
  { title: "PDF to Text (OCR)", desc: "Extract text from PDF with AI", cat: "Pdf Tools", icon: <Type className="w-5 h-5 text-rose-400" />, link: "/tools/pdf-to-text" },
  { title: "Protect PDF", desc: "Add password to your PDF", cat: "Pdf Tools", icon: <Lock className="w-5 h-5 text-red-500" />, link: "/tools/protect-pdf" },

  // Video Tools (Görsel 2)
  { title: "Youtube to Text", desc: "Convert video to text", cat: "Video Tools", icon: <Youtube className="w-5 h-5 text-red-500" />, link: "/tools/youtube-to-text" },
  { title: "Compress Video", desc: "Lessen the file size of a Video file", cat: "Video Tools", icon: <Minimize className="w-5 h-5 text-orange-400" />, link: "/tools/compress-video" },
  { title: "Instagram Download", desc: "Download Video from Instagram", cat: "Video Tools", icon: <Instagram className="w-5 h-5 text-pink-500" />, link: "/tools/instagram-download" },
  { title: "TikTok Video Download", desc: "Download Video from TikTok", cat: "Video Tools", icon: <Download className="w-5 h-5 text-black" />, link: "/tools/tiktok-downloader" },
  { title: "Audio to Text", desc: "Transcribe audio to text", cat: "Video Tools", icon: <VolumeX className="w-5 h-5 text-indigo-400" />, link: "/tools/audio-to-text" },
  { title: "MP4 to MP3", desc: "Convert MP4 to MP3 audio", cat: "Video Tools", icon: <Music className="w-5 h-5 text-yellow-400" />, link: "/tools/mp4-to-mp3" },
  { title: "Extract Audio from Video", desc: "Extract audio from your video", cat: "Video Tools", icon: <Music className="w-5 h-5 text-blue-400" />, link: "/tools/extract-audio" },
  { title: "YouTube Transcript", desc: "Transcribe YouTube Video", cat: "Video Tools", icon: <FileText className="w-5 h-5 text-red-400" />, link: "/tools/youtube-transcript" },
  { title: "Video to Gif", desc: "Upload an MP4 and convert to animated GIF", cat: "Video Tools", icon: <Clapperboard className="w-5 h-5 text-rose-400" />, link: "/tools/video-to-gif" },
  { title: "Video to Text", desc: "Transcribe video to text", cat: "Video Tools", icon: <Type className="w-5 h-5 text-blue-400" />, link: "/tools/video-to-text" },
  { title: "Twitter Download", desc: "Download Video from Twitter", cat: "Video Tools", icon: <Twitter className="w-5 h-5 text-sky-500" />, link: "/tools/twitter-download" },
  { title: "Trim Video", desc: "Select a start and stop of a video and download the trimmed video", cat: "Video Tools", icon: <Scissors className="w-5 h-5 text-purple-400" />, link: "/tools/trim-video" },

  // Converter Tools (Görsel 3)
  { title: "Excel to PDF", desc: "Convert Excel to PDF", cat: "Converter Tools", icon: <Table className="w-5 h-5 text-green-600" />, link: "/tools/excel-to-pdf" },
  { title: "CSV to Excel", desc: "Convert CSV to Excel", cat: "Converter Tools", icon: <Table className="w-5 h-5 text-emerald-500" />, link: "/tools/csv-to-excel" },
  { title: "Split Excel", desc: "Split into one or multiple Excel files", cat: "Converter Tools", icon: <Table className="w-5 h-5 text-green-400" />, link: "/tools/split-excel" },
  { title: "XML to Excel", desc: "Convert XML to Excel", cat: "Converter Tools", icon: <FileCode className="w-5 h-5 text-blue-400" />, link: "/tools/xml-to-excel" },
  { title: "Split CSV", desc: "Split into one or multiple PDF files", cat: "Converter Tools", icon: <Scissors className="w-5 h-5 text-rose-400" />, link: "/tools/split-csv" },
  { title: "EPUB to MOBI", desc: "Convert EPUB file to MOBI file", cat: "Converter Tools", icon: <BookOpen className="w-5 h-5 text-orange-400" />, link: "/tools/epub-to-mobi" },
  { title: "JSON to XML", desc: "Convert JSON to XML", cat: "Converter Tools", icon: <FileJson className="w-5 h-5 text-yellow-500" />, link: "/tools/json-to-xml" },
  { title: "Excel to CSV", desc: "Convert Excel to CSV", cat: "Converter Tools", icon: <Table className="w-5 h-5 text-green-500" />, link: "/tools/excel-to-csv" },
  { title: "XML to CSV", desc: "Convert XML to CSV", cat: "Converter Tools", icon: <FileCode className="w-5 h-5 text-blue-500" />, link: "/tools/xml-to-csv" },
  { title: "CSV to JSON", desc: "Convert CSV to JSON", cat: "Converter Tools", icon: <FileJson className="w-5 h-5 text-yellow-400" />, link: "/tools/csv-to-json" },
  { title: "EPUB to AZW3", desc: "Convert EPUB file to AZW3 file", cat: "Converter Tools", icon: <BookOpen className="w-5 h-5 text-orange-500" />, link: "/tools/epub-to-azw3" },
  { title: "Excel to XML", desc: "Convert Excel to XML", cat: "Converter Tools", icon: <FileCode className="w-5 h-5 text-blue-600" />, link: "/tools/excel-to-xml" },

  // Other Tools (Görsel 4)
  { title: "QR Code Generator", desc: "Generate QR code", cat: "Other Tools", icon: <QrCode className="w-5 h-5 text-orange-400" />, link: "/tools/qr-generator" },
  { title: "Lorem Ipsum Generator", desc: "Generate Lorem Ipsum placeholder text", cat: "Other Tools", icon: <StickyNote className="w-5 h-5 text-yellow-400" />, link: "/tools/lorem-ipsum" },
  { title: "Meme Maker", desc: "Generate memes easily", cat: "Other Tools", icon: <Smile className="w-5 h-5 text-blue-400" />, link: "/tools/meme-maker" },
  { title: "Create Zip", desc: "Create Zip file Online", cat: "Other Tools", icon: <Zap className="w-5 h-5 text-green-400" />, link: "/tools/create-zip" },
  { title: "Epoch Converter", desc: "Convert epoch to human-readable date and vice versa", cat: "Other Tools", icon: <Clock className="w-5 h-5 text-rose-400" />, link: "/tools/epoch-converter" },

  // AI Write (Görsel 5)
  { title: "Content Improver", desc: "Improve your content", cat: "AI Write", icon: <Sparkles className="w-5 h-5 text-purple-400" />, link: "/tools/content-improver" },
  { title: "Essay Writer", desc: "Easily create an essay with AI", cat: "AI Write", icon: <PenTool className="w-5 h-5 text-orange-400" />, link: "/tools/essay-writer" },
  { title: "Paragraph Writer", desc: "Paragraph Writer", cat: "AI Write", icon: <Type className="w-5 h-5 text-rose-400" />, link: "/tools/paragraph-writer" },
  { title: "Paragraph Completer", desc: "Paragraph Completer", cat: "AI Write", icon: <Type className="w-5 h-5 text-blue-400" />, link: "/tools/paragraph-completer" },
  { title: "Story Generator", desc: "Generate a Story", cat: "AI Write", icon: <BookOpen className="w-5 h-5 text-yellow-400" />, link: "/tools/story-generator" },
  { title: "Grammar Fixer", desc: "Easily fix the grammar in a block of text", cat: "AI Write", icon: <CheckCircle2 className="w-5 h-5 text-orange-400" />, link: "/tools/grammar-fixer" },
  { title: "Sentence Rewriter", desc: "Sentence Rewriter", cat: "AI Write", icon: <RefreshCw className="w-5 h-5 text-yellow-500" />, link: "/tools/sentence-rewriter" },
  { title: "Article Writer", desc: "Create an article from a title", cat: "AI Write", icon: <FileEdit className="w-5 h-5 text-rose-500" />, link: "/tools/article-writer" },
  { title: "Content Summarizer", desc: "Summarize text", cat: "AI Write", icon: <Minimize2 className="w-5 h-5 text-orange-400" />, link: "/tools/content-summarizer" },
  { title: "AI Humanizer", desc: "Use the AI Humanizer to makes AI text sound more human", cat: "AI Write", icon: <Type className="w-5 h-5 text-rose-400" />, link: "/tools/ai-humanizer" },
  { title: "Tone of Voice", desc: "Tone of Voice Tool", cat: "AI Write", icon: <MessageSquare className="w-5 h-5 text-green-500" />, link: "/tools/tone-of-voice" },
  { title: "YouTube Script Writer", desc: "Generate a YouTube script", cat: "AI Write", icon: <Youtube className="w-5 h-5 text-red-500" />, link: "/tools/youtube-script-writer" },

  { title: "Remove Background", desc: "Easily remove the background from any image using AI.", cat: "Image Tools", icon: <Eraser className="w-5 h-5 text-rose-500" />, link: "/tools/remove-background" },
  { title: "Image to WebP", desc: "Convert your images to highly optimized WebP format.", cat: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-blue-500" />, link: "/tools/image-to-webp" },
  { title: "Upscale Image", desc: "Increase the resolution and quality of your image.", cat: "Image Tools", icon: <Maximize2 className="w-5 h-5 text-emerald-500" />, link: "/tools/upscale-image" },
  { title: "AI Image Generator", desc: "Create beautiful images from text descriptions.", cat: "Image Tools", icon: <Sparkles className="w-5 h-5 text-amber-500" />, link: "/tools/ai-image-generator" },
  { title: "JPG to PDF", desc: "Convert JPG images to PDF documents instantly.", cat: "Image Tools", icon: <FileText className="w-5 h-5 text-primary" />, link: "/tools/jpg-to-pdf" },
  { title: "PDF to JPG", desc: "Extract pages from PDF as high-quality JPG images.", cat: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-primary" />, link: "/tools/pdf-to-jpg" },
  { title: "HEIC to JPG", desc: "Convert iPhone HEIC photos to compatible JPG format.", cat: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-primary" />, link: "/tools/heic-to-jpg" },
  { title: "PNG to JPG", desc: "Convert PNG images to JPG with adjustable quality.", cat: "Image Tools", icon: <RefreshCw className="w-5 h-5 text-primary" />, link: "/tools/png-to-jpg" },
  { title: "WebP to JPG", desc: "Convert WebP images to high-quality JPG format.", cat: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-primary" />, link: "/tools/webp-to-jpg" },
  { title: "Resize Image", desc: "Change image dimensions while maintaining quality.", cat: "Image Tools", icon: <Maximize2 className="w-5 h-5 text-primary" />, link: "/tools/resize-image" },
  { title: "Compress Image", desc: "Reduce image file size with minimal quality loss.", cat: "Image Tools", icon: <Zap className="w-5 h-5 text-primary" />, link: "/tools/compress-image" },
  { title: "Crop Image", desc: "Crop images to specific aspect ratios or selections.", cat: "Image Tools", icon: <Scissors className="w-5 h-5 text-primary" />, link: "/tools/crop-image" },
  { title: "Add Text to Image", desc: "Overlay text on your images with custom fonts.", cat: "Image Tools", icon: <Type className="w-5 h-5 text-primary" />, link: "/tools/add-text-to-image" },
  { title: "Blur Background", desc: "Apply professional bokeh blur to image backgrounds.", cat: "Image Tools", icon: <Sparkles className="w-5 h-5 text-primary" />, link: "/tools/blur-background" },
  { title: "Profile Picture Maker", desc: "Create professional social media profile pictures.", cat: "Image Tools", icon: <Smile className="w-5 h-5 text-primary" />, link: "/tools/profile-picture-maker" },
  { title: "Black and White", desc: "Convert color images to artistic black and white.", cat: "Image Tools", icon: <Contrast className="w-5 h-5 text-primary" />, link: "/tools/black-and-white" }
];

export function ToolGrid() {
  const [activeTab, setActiveTab] = useState("All Tools");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = (activeTab === "All Tools" 
    ? allTools 
    : allTools.filter(tool => tool.cat === activeTab)
  ).filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-20 pt-12 relative overflow-visible">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tight mb-4">{activeTab === "All Tools" ? "All Tools" : activeTab}</h1>
        <p className="text-muted-foreground text-lg mb-8">Free Online {activeTab === "All Tools" ? "" : activeTab} Tools</p>
        
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
          <input 
            className="w-full pl-12 pr-24 py-4 rounded-full border-2 border-slate-100 shadow-sm text-lg focus:outline-none focus:border-primary/50 transition-all"
            placeholder="Search tools"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-8 bg-[#0091FF] hover:bg-[#007EE6]">
            Search
          </Button>
        </div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold mb-3">
          {activeTab === "All Tools" ? "Our Most Popular Tools" : `${activeTab} Category`}
        </h2>
        <p className="text-muted-foreground">Premium tools, 100% free, forever.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10 bg-card p-1.5 rounded-full border border-border shadow-sm mx-auto w-fit">
        <button 
          onClick={() => setActiveTab("All Tools")}
          className={`px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
            activeTab === "All Tools" 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <span className="w-4 h-4 grid grid-cols-2 gap-0.5">
            <span className="bg-current rounded-sm opacity-80"></span>
            <span className="bg-current rounded-sm opacity-80"></span>
            <span className="bg-current rounded-sm opacity-80"></span>
            <span className="bg-current rounded-sm opacity-80"></span>
          </span>
          All Tools
        </button>
        {["Pdf Tools", "Video Tools", "Image Tools", "Converter Tools", "Other Tools", "AI Write"].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredTools.map((tool, i) => (
          <div key={i}>
            <Link href={tool.link}>
              <div className="group bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full relative overflow-hidden cursor-pointer">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl w-fit mb-4 group-hover:bg-primary/10 transition-colors transform group-hover:scale-110">
                  {tool.icon}
                </div>
                
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors pr-6">{tool.title}</h3>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-3">{tool.cat}</span>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-grow">{tool.desc}</p>
                
                <div className="mt-auto">
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto font-bold text-primary group-hover:translate-x-1 transition-transform">
                    Hemen Başla <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function Presentation({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M2 3h20" />
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
      <path d="m7 21 5-5 5 5" />
    </svg>
  );
}
