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
      <div className="mb-10 max-w-2xl mx-auto relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder={t.home.search_placeholder} 
          className="pl-12 py-6 text-lg rounded-2xl border-2 focus-visible:ring-primary/20 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
            {tab === "All Tools" ? t.common.all_tools : tab}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.slice(0, visibleCount).map((tool, index) => (
          <Link key={`${tool.title}-${index}`} href={tool.link}>
            <Card className="p-6 h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 group relative overflow-hidden bg-gradient-to-br from-card to-card/50">
              <div className="mb-4 p-3 rounded-xl bg-background border group-hover:bg-primary/10 transition-colors w-fit shadow-sm">
                {tool.icon}
              </div>
              <h3 className="font-heading font-black text-xl mb-1 text-foreground group-hover:text-primary transition-colors tracking-tighter uppercase italic">
                {tool.title}
              </h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 opacity-60">
                {tool.cat}
              </p>
              <p className="text-sm text-muted-foreground/80 mb-6 flex-grow font-medium italic leading-snug">
                {tool.desc}
              </p>
              <div className="flex items-center text-primary font-bold text-sm group-hover:translate-x-1 transition-transform uppercase italic tracking-tighter">
                {t.common.start_now} <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
