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
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";

const translations = translationsData as Record<string, any>;

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
  { title: "Image to WebP", desc: "Convert image to WebP", cat: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-emerald-500" />, link: "/tools/image-to-webp" },
  { title: "Remove Background", desc: "AI background remover", cat: "Image Tools", icon: <Zap className="w-5 h-5 text-purple-500" />, link: "/tools/remove-background" },
  { title: "HEIC to JPG", desc: "iPhone photo converter", cat: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-orange-500" />, link: "/tools/heic-to-jpg" },
  { title: "WebP to JPG", desc: "WebP to JPG converter", cat: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-blue-500" />, link: "/tools/webp-to-jpg" },
  { title: "Resize Image", desc: "Change image dimensions", cat: "Image Tools", icon: <Minimize className="w-5 h-5 text-indigo-500" />, link: "/tools/resize-image" },
  { title: "Compress Image", desc: "Reduce image size", cat: "Image Tools", icon: <Minimize className="w-5 h-5 text-emerald-500" />, link: "/tools/compress-image" },
  { title: "Crop Image", desc: "Crop photos easily", cat: "Image Tools", icon: <Scissors className="w-5 h-5 text-rose-500" />, link: "/tools/crop-image" },
  { title: "Add Text to Image", desc: "Add text overlays", cat: "Image Tools", icon: <Type className="w-5 h-5 text-slate-500" />, link: "/tools/add-text-to-image" },

  // AI Tools
  { title: "Paragraph Writer", desc: "AI paragraph writing", cat: "AI Write", icon: <PenTool className="w-5 h-5 text-rose-400" />, link: "/tools/paragraph-writer" },
  { title: "Essay Writer", desc: "AI essay assistant", cat: "AI Write", icon: <PenTool className="w-5 h-5 text-orange-400" />, link: "/tools/essay-writer" },
  { title: "Instagram Caption", desc: "Social media captions", cat: "AI Write", icon: <PenTool className="w-5 h-5 text-pink-500" />, link: "/tools/instagram-caption-generator" },
  { title: "LinkedIn Post", desc: "Professional AI posts", cat: "AI Write", icon: <PenTool className="w-5 h-5 text-sky-500" />, link: "/tools/linkedin-post-generator" },
];

export function ToolGrid() {
  const { language } = useLanguageStore();
  const t = translations[language];
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

  const tabs = [
    { id: "All Tools", label: t.common.all_tools, icon: <Layout className="w-3.5 h-3.5" /> },
    { id: "Pdf Tools", label: "Pdf Tools", icon: <FileText className="w-3.5 h-3.5" /> },
    { id: "Video Tools", label: "Video Tools", icon: <Video className="w-3.5 h-3.5" /> },
    { id: "Image Tools", label: "Image Tools", icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: "Converter Tools", label: "Converter Tools", icon: <Layout className="w-3.5 h-3.5" /> },
    { id: "Other Tools", label: "Other Tools", icon: <Layout className="w-3.5 h-3.5" /> },
    { id: "AI Write", label: "AI Write", icon: <PenTool className="w-3.5 h-3.5" /> },
  ];

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
    <div className="w-full">
      <div className="mb-12 max-w-2xl mx-auto relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder={t.home.search_placeholder} 
          className="pl-12 py-6 text-lg rounded-xl border-slate-200 focus-visible:ring-primary/20 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Modern Filter Bar */}
      <div className="flex justify-center mb-16 px-4">
        <div className="bg-white border border-slate-100 rounded-full p-1.5 shadow-xl shadow-slate-200/20 flex flex-wrap gap-1 items-center max-w-fit overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setVisibleCount(24);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ring-1 ${
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/30 ring-primary" 
                  : "text-slate-500 hover:bg-slate-50 ring-slate-100"
              }`}
            >
              <span className={activeTab === tab.id ? "text-white" : "text-slate-400"}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {filteredTools.slice(0, visibleCount).map((tool, index) => (
          <Link key={`${tool.title}-${index}`} href={tool.link}>
            <Card className="p-5 h-full flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 cursor-pointer border shadow-sm group relative overflow-hidden bg-white">
              <div className="mb-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-primary/5 transition-colors w-fit">
                {tool.icon}
              </div>
              <h3 className="font-bold text-sm mb-1 text-slate-900 group-hover:text-primary transition-colors tracking-tight">
                {tool.title}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 opacity-60">
                {tool.cat}
              </p>
              <p className="text-[11px] text-slate-500 mb-4 flex-grow font-medium leading-relaxed">
                {tool.desc}
              </p>
              <div className="flex items-center text-primary font-bold text-[10px] group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                {t.common.start_now} <ArrowRight className="ml-1.5 w-3 h-3" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
