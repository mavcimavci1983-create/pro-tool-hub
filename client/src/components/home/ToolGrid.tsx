import React, { useState, useMemo, useEffect } from "react";
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
  Search,
  Sparkles,
  PenTool,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const tools = [
  // PDF Tools
  { title: "Rotate PDF", desc: "Rotate PDF online", cat: "Pdf Tools", icon: <RefreshCw className="w-5 h-5 text-blue-500" />, link: "/tools/rotate-pdf" },
  { title: "Add Watermark", desc: "Add Watermark to PDF", cat: "Pdf Tools", icon: <Type className="w-5 h-5 text-indigo-500" />, link: "/tools/add-watermark" },
  { title: "PDF to Text", desc: "Convert PDF to Text", cat: "Pdf Tools", icon: <FileText className="w-5 h-5 text-orange-500" />, link: "/tools/pdf-to-text" },
  { title: "PDF to Word", desc: "Convert PDF to Word", cat: "Pdf Tools", icon: <FileText className="w-5 h-5 text-blue-600" />, link: "/tools/pdf-to-word" },
  { title: "PDF to JPG", desc: "Convert PDF to JPG", cat: "Pdf Tools", icon: <ImageIcon className="w-5 h-5 text-pink-500" />, link: "/tools/pdf-to-jpg" },
  { title: "PDF to Excel", desc: "Convert PDF to Excel", cat: "Pdf Tools", icon: <FileText className="w-5 h-5 text-green-600" />, link: "/tools/pdf-to-excel" },
  { title: "PDF to PPT", desc: "Convert PDF to PPT", cat: "Pdf Tools", icon: <Presentation className="w-5 h-5 text-orange-600" />, link: "/tools/pdf-to-powerpoint" },
  { title: "Word to PDF", desc: "Convert Word to PDF", cat: "Pdf Tools", icon: <FileText className="w-5 h-5 text-blue-500" />, link: "/tools/word-to-pdf" },
  { title: "JPG to PDF", desc: "Convert JPG to PDF", cat: "Pdf Tools", icon: <ImageIcon className="w-5 h-5 text-red-500" />, link: "/tools/jpg-to-pdf" },
  { title: "Merge PDF", desc: "Combine multiple PDF", cat: "Pdf Tools", icon: <Zap className="w-5 h-5 text-yellow-500" />, link: "/tools/merge-pdf" },
  { title: "Split PDF", desc: "Split PDF file", cat: "Pdf Tools", icon: <Scissors className="w-5 h-5 text-purple-500" />, link: "/tools/split-pdf" },
  { title: "Compress PDF", desc: "Reduce PDF size", cat: "Pdf Tools", icon: <Minimize className="w-5 h-5 text-emerald-500" />, link: "/tools/compress-pdf" },
  { title: "Edit PDF", desc: "Free PDF editor", cat: "Pdf Tools", icon: <PenTool className="w-5 h-5 text-sky-500" />, link: "/tools/edit-pdf" },
  { title: "Unlock PDF", desc: "Remove PDF password", cat: "Pdf Tools", icon: <Lock className="w-5 h-5 text-rose-500" />, link: "/tools/remove-password" },
  { title: "Protect PDF", desc: "Encrypt PDF file", cat: "Pdf Tools", icon: <Lock className="w-5 h-5 text-gray-700" />, link: "/tools/protect-pdf" },

  // Video Tools
  { title: "Video to GIF", desc: "Create animated GIF", cat: "Video Tools", icon: <Scissors className="w-5 h-5 text-purple-400" />, link: "/tools/video-to-gif" },
  { title: "Video to MP3", desc: "Extract audio from video", cat: "Video Tools", icon: <Music className="w-5 h-5 text-pink-400" />, link: "/tools/video-to-mp3" },
  { title: "MP4 to WebM", desc: "Convert MP4 to WebM", cat: "Video Tools", icon: <Play className="w-5 h-5 text-blue-400" />, link: "/tools/mp4-to-webm" },
  { title: "Mute Video", desc: "Remove video sound", cat: "Video Tools", icon: <VolumeX className="w-5 h-5 text-gray-500" />, link: "/tools/mute-video" },
  { title: "Video Resizer", desc: "Resize video for social", cat: "Video Tools", icon: <Minimize className="w-5 h-5 text-indigo-400" />, link: "/tools/video-resizer" },
  { title: "Rotate Video", desc: "Fix sideways video", cat: "Video Tools", icon: <RefreshCw className="w-5 h-5 text-sky-400" />, link: "/tools/rotate-video" },
  { title: "Trim Video", desc: "Cut video clips", cat: "Video Tools", icon: <Scissors className="w-5 h-5 text-rose-400" />, link: "/tools/trim-video" },
  { title: "Compress Video", desc: "Reduce video size", cat: "Video Tools", icon: <Minimize className="w-5 h-5 text-emerald-400" />, link: "/tools/compress-video" },
  { title: "Facebook Download", desc: "Download FB videos", cat: "Video Tools", icon: <Download className="w-5 h-5 text-blue-600" />, link: "/tools/facebook-download" },
  { title: "TikTok Downloader", desc: "No watermark TikTok", cat: "Video Tools", icon: <Download className="w-5 h-5 text-pink-600" />, link: "/tools/tiktok-downloader" },
  { title: "Instagram Download", desc: "Save IG reels & videos", cat: "Video Tools", icon: <Download className="w-5 h-5 text-purple-600" />, link: "/tools/instagram-download" },
  { title: "Twitter Download", desc: "Download Twitter videos", cat: "Video Tools", icon: <Download className="w-5 h-5 text-sky-600" />, link: "/tools/twitter-download" },
  { title: "YouTube to Text", desc: "Convert YT to text", cat: "Video Tools", icon: <Youtube className="w-5 h-5 text-red-600" />, link: "/tools/youtube-to-text" },
  { title: "Video to Text", desc: "Transcribe video", cat: "Video Tools", icon: <Type className="w-5 h-5 text-slate-600" />, link: "/tools/video-to-text" },

  // Image Tools
  { title: "Image to WebP", desc: "Fast WebP converter", cat: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-emerald-500" />, link: "/tools/image-to-webp" },
  { title: "Remove Background", desc: "AI Background remover", cat: "Image Tools", icon: <Zap className="w-5 h-5 text-purple-500" />, link: "/tools/remove-background" },
  { title: "HEIC to JPG", desc: "iPhone photo converter", cat: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-orange-500" />, link: "/tools/heic-to-jpg" },
  { title: "WebP to JPG", desc: "Convert WebP to JPG", cat: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-blue-500" />, link: "/tools/webp-to-jpg" },
  { title: "PNG to JPG", desc: "Convert PNG to JPG", cat: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-indigo-500" />, link: "/tools/png-to-jpg" },
  { title: "Resize Image", desc: "Change dimensions", cat: "Image Tools", icon: <Minimize className="w-5 h-5 text-sky-500" />, link: "/tools/resize-image" },
  { title: "Compress Image", desc: "Reduce image size", cat: "Image Tools", icon: <Minimize className="w-5 h-5 text-green-500" />, link: "/tools/compress-image" },
  { title: "Crop Image", desc: "Crop photo easily", cat: "Image Tools", icon: <Scissors className="w-5 h-5 text-rose-500" />, link: "/tools/crop-image" },
  { title: "Add Text", desc: "Text on image", cat: "Image Tools", icon: <Type className="w-5 h-5 text-amber-500" />, link: "/tools/add-text-to-image" },
  { title: "Blur Background", desc: "Professional bokeh", cat: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-blue-400" />, link: "/tools/blur-background" },
  { title: "Profile Maker", desc: "Social profile photo", cat: "Image Tools", icon: <Smile className="w-5 h-5 text-purple-400" />, link: "/tools/profile-picture-maker" },
  { title: "AI Image Gen", desc: "Text to image AI", cat: "Image Tools", icon: <Sparkles className="w-5 h-5 text-orange-400" />, link: "/tools/ai-image-generator" },
  { title: "B&W Filter", desc: "Artistic black & white", cat: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-gray-500" />, link: "/tools/black-and-white" },
  { title: "Upscale Image", desc: "Increase resolution AI", cat: "Image Tools", icon: <Zap className="w-5 h-5 text-yellow-500" />, link: "/tools/upscale-image" },

  // Converter Tools
  { title: "Word to PDF", desc: "Fast Word to PDF", cat: "Converter Tools", icon: <FileText className="w-5 h-5 text-blue-500" />, link: "/tools/word-to-pdf" },
  { title: "Excel to PDF", desc: "Spreadsheet to PDF", cat: "Converter Tools", icon: <FileText className="w-5 h-5 text-green-600" />, link: "/tools/excel-to-pdf" },
  { title: "EPUB to PDF", desc: "Ebook to PDF converter", cat: "Converter Tools", icon: <Globe className="w-5 h-5 text-orange-500" />, link: "/tools/epub-to-pdf" },
  { title: "CSV to JSON", desc: "Convert CSV to JSON", cat: "Converter Tools", icon: <FileJson className="w-5 h-5 text-emerald-500" />, link: "/tools/csv-to-json" },
  { title: "HTML to PDF", desc: "Convert HTML to PDF", cat: "Converter Tools", icon: <Globe className="w-5 h-5 text-sky-500" />, link: "/tools/html-to-pdf" },
  { title: "Extract ZIP", desc: "Extract ZIP files online", cat: "Converter Tools", icon: <Zap className="w-5 h-5 text-emerald-500" />, link: "/tools/extract-zip" },
  { title: "Create ZIP", desc: "Create ZIP archive online", cat: "Converter Tools", icon: <Zap className="w-5 h-5 text-green-500" />, link: "/tools/create-zip" },

  // Other Tools
  { title: "QR Code Generator", desc: "Generate QR code", cat: "Other Tools", icon: <QrCode className="w-5 h-5 text-orange-400" />, link: "/tools/qr-generator" },
  { title: "Barcode Generator", desc: "Generate Barcodes", cat: "Other Tools", icon: <QrCode className="w-5 h-5 text-blue-400" />, link: "/tools/barcode-generator" },
  { title: "Password Generator", desc: "Create secure passwords", cat: "Other Tools", icon: <Lock className="w-5 h-5 text-red-400" />, link: "/tools/password-generator" },
  { title: "Lorem Ipsum Generator", desc: "Generate Lorem Ipsum placeholder text", cat: "Other Tools", icon: <StickyNote className="w-5 h-5 text-yellow-400" />, link: "/tools/lorem-ipsum" },
  { title: "HTML Viewer", desc: "Preview HTML code", cat: "Other Tools", icon: <Layout className="w-5 h-5 text-indigo-400" />, link: "/tools/html-viewer" },
  { title: "JSON Formatter", desc: "Format JSON data", cat: "Other Tools", icon: <FileJson className="w-5 h-5 text-emerald-400" />, link: "/tools/json-formatter" },
  { title: "My IP Address", desc: "Check your public IP", cat: "Other Tools", icon: <Globe className="w-5 h-5 text-sky-400" />, link: "/tools/my-ip" },
  { title: "Speed Test", desc: "Check internet speed", cat: "Other Tools", icon: <Zap className="w-5 h-5 text-amber-400" />, link: "/tools/speed-test" },
  { title: "Stop Watch", desc: "Online stopwatch", cat: "Other Tools", icon: <Clock className="w-5 h-5 text-rose-400" />, link: "/tools/stopwatch" },
  { title: "Counter", desc: "Online click counter", cat: "Other Tools", icon: <Zap className="w-5 h-5 text-blue-500" />, link: "/tools/counter" },
  { title: "Case Converter", desc: "Change text case", cat: "Other Tools", icon: <Type className="w-5 h-5 text-purple-400" />, link: "/tools/case-converter" },
  { title: "Meme Maker", desc: "Generate memes easily", cat: "Other Tools", icon: <Smile className="w-5 h-5 text-blue-400" />, link: "/tools/meme-maker" },
  { title: "Create Zip", desc: "Create Zip file Online", cat: "Other Tools", icon: <Zap className="w-5 h-5 text-green-400" />, link: "/tools/create-zip" },
  { title: "Epoch Converter", desc: "Convert epoch to human-readable date and vice versa", cat: "Other Tools", icon: <Clock className="w-5 h-5 text-rose-400" />, link: "/tools/epoch-converter" },

  // AI Write
  { title: "Content Improver", desc: "Improve your content", cat: "AI Write", icon: <Sparkles className="w-5 h-5 text-purple-400" />, link: "/tools/content-improver" },
  { title: "Essay Writer", desc: "Easily create an essay with AI", cat: "AI Write", icon: <PenTool className="w-5 h-5 text-orange-400" />, link: "/tools/essay-writer" },
  { title: "Paragraph Writer", desc: "Paragraph Writer", cat: "AI Write", icon: <Type className="w-5 h-5 text-rose-400" />, link: "/tools/paragraph-writer" },
  { title: "Sentence Expander", desc: "Expand your sentences", cat: "AI Write", icon: <Type className="w-5 h-5 text-indigo-400" />, link: "/tools/sentence-expander" },
  { title: "Instagram Caption", desc: "IG caption generator", cat: "AI Write", icon: <Type className="w-5 h-5 text-pink-500" />, link: "/tools/instagram-caption-generator" },
  { title: "YouTube Title", desc: "YT title generator", cat: "AI Write", icon: <Youtube className="w-5 h-5 text-red-600" />, link: "/tools/youtube-title-generator" },
  { title: "TikTok Script", desc: "TikTok script creator", cat: "AI Write", icon: <Video className="w-5 h-5 text-slate-700" />, link: "/tools/tiktok-script-creator" },
  { title: "Email Writer", desc: "Professional email writer", cat: "AI Write", icon: <Type className="w-5 h-5 text-blue-500" />, link: "/tools/email-writer" },
  { title: "Cover Letter", desc: "Job application helper", cat: "AI Write", icon: <FileText className="w-5 h-5 text-emerald-600" />, link: "/tools/cover-letter-generator" },
  { title: "LinkedIn Post", desc: "Professional post gen", cat: "AI Write", icon: <Type className="w-5 h-5 text-blue-700" />, link: "/tools/linkedin-post-generator" },
  { title: "Grammar Fixer", desc: "Check grammar AI", cat: "AI Write", icon: <Zap className="w-5 h-5 text-amber-500" />, link: "/tools/grammar-fixer" },
  { title: "Summarizer", desc: "Text summarizer tool", cat: "AI Write", icon: <Minimize className="w-5 h-5 text-slate-500" />, link: "/tools/content-summarizer" },
  { title: "Article Rewriter", desc: "Rewrite unique content", cat: "AI Write", icon: <RefreshCw className="w-5 h-5 text-sky-500" />, link: "/tools/article-rewriter" },
  { title: "AI Humanizer", desc: "Human-like AI text", cat: "AI Write", icon: <Smile className="w-5 h-5 text-orange-500" />, link: "/tools/ai-humanizer" },
  { title: "Tone of Voice", desc: "Tone analyzer AI", cat: "AI Write", icon: <VolumeX className="w-5 h-5 text-indigo-600" />, link: "/tools/tone-of-voice" },
];

export function ToolGrid() {
  const [activeTab, setActiveTab] = useState("All Tools");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesTab = activeTab === "All Tools" || tool.cat === activeTab;
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const tabs = ["All Tools", "Pdf Tools", "Video Tools", "Image Tools", "Converter Tools", "Other Tools", "AI Write"];

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500) {
        setVisibleCount(prev => Math.min(prev + 12, filteredTools.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredTools.length]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-10 max-w-2xl mx-auto relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="100'den fazla araç arasında ara..." 
          className="pl-12 py-6 text-lg rounded-2xl border-2 focus-visible:ring-primary/20 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => {
              setActiveTab(tab);
              setVisibleCount(24);
            }}
            className={`rounded-full px-6 py-5 font-bold transition-all ${
              activeTab === tab ? "scale-105 shadow-md shadow-primary/20" : "hover:bg-primary/5"
            }`}
          >
            {tab === "All Tools" && <Layout className="w-4 h-4 mr-2" />}
            {tab}
          </Button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.slice(0, visibleCount).map((tool, index) => (
          <Link key={`${tool.title}-${index}`} href={tool.link}>
            <Card className="p-6 h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 group relative overflow-hidden bg-gradient-to-br from-card to-card/50">
              <div className="mb-4 p-3 rounded-xl bg-background border group-hover:bg-primary/10 transition-colors w-fit shadow-sm">
                {tool.icon}
              </div>
              <h3 className="font-heading font-black text-xl mb-1 text-foreground group-hover:text-primary transition-colors tracking-tight">
                {tool.title}
              </h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 opacity-60">
                {tool.cat}
              </p>
              <p className="text-sm text-muted-foreground/80 mb-6 flex-grow font-medium leading-snug">
                {tool.desc}
              </p>
              <div className="flex items-center text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
                Hemen Başla <ArrowRight className="ml-2 w-4 h-4" />
              </div>
              
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                {React.cloneElement(tool.icon as React.ReactElement, { className: "w-24 h-24" })}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed">
          <p className="text-xl font-bold text-muted-foreground">Aradığınız kriterde bir araç bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
