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
  Brush,
  Palette,
  Layers,
  Sparkles,
  FileEdit,
  ArrowRight,
  Search,
  Lock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const toolCategories = [
  {
    title: "PDF Tools",
    desc: "Solve Your PDF Problems",
    count: "45+ tools",
    color: "bg-[#A855F7]",
    icon: <FileText className="w-6 h-6 text-white" />,
    featured: { name: "Merge PDF", href: "/tools/merge-pdf" },
    cat: "Pdf Tools",
    href: "/tools/all-pdf"
  },
  {
    title: "Image Tools",
    desc: "Solve Your Image Problems",
    count: "30+ tools",
    color: "bg-[#F97316]",
    icon: <ImageIcon className="w-6 h-6 text-white" />,
    featured: { name: "Remove Background", href: "/tools/remove-background" },
    cat: "Image Tools",
    href: "/tools/all-image"
  },
  {
    title: "Video Tools",
    desc: "Solve Your Video Problems",
    count: "10+ tools",
    color: "bg-[#EC4899]",
    icon: <Video className="w-6 h-6 text-white" />,
    featured: { name: "Mute Video", href: "/tools/mute-video" },
    cat: "Video Tools",
    href: "/tools/all-video"
  },
  {
    title: "AI Write",
    desc: "Solve Your Text Problems",
    count: "10+ tools",
    color: "bg-[#3B82F6]",
    icon: <PenTool className="w-6 h-6 text-white" />,
    featured: { name: "Paragraph Writer", href: "/tools/paragraph-writer" },
    cat: "AI Write",
    href: "/tools/all-write"
  },
  {
    title: "File Tools",
    desc: "Solve Your File Problems",
    count: "15+ tools",
    color: "bg-[#10B981]",
    icon: <FileCode className="w-6 h-6 text-white" />,
    featured: { name: "Split Excel", href: "/tools/split-excel" },
    cat: "Converter Tools",
    href: "/tools/all-file"
  }
];

const allTools = [
  // PDF Tools
  { title: "Merge PDF", desc: "Merge 2 or more PDF files into a single PDF file", cat: "Pdf Tools", icon: <Merge className="w-5 h-5 text-rose-400" />, link: "/tools/merge-pdf" },
  { title: "Edit PDF", desc: "Free PDF Editor", cat: "Pdf Tools", icon: <PenTool className="w-5 h-5 text-emerald-400" />, link: "/tools/edit-pdf" },
  { title: "PDF to JPG", desc: "Convert PDF to JPG and download each page as an image", cat: "Pdf Tools", icon: <ImageIcon className="w-5 h-5 text-blue-400" />, link: "/tools/pdf-to-jpg" },
  { title: "JPG to PDF", desc: "Upload images and receive as a PDF", cat: "Pdf Tools", icon: <ImageIcon className="w-5 h-5 text-emerald-400" />, link: "/tools/jpg-to-pdf" },
  { title: "Compress PDF", desc: "Lessen the file size of a PDF file", cat: "Pdf Tools", icon: <Minimize2 className="w-5 h-5 text-purple-400" />, link: "/tools/compress-pdf" },
  { title: "Split PDF", desc: "Split into one or multiple PDF files", cat: "Pdf Tools", icon: <Scissors className="w-5 h-5 text-purple-400" />, link: "/tools/split-pdf" },
  { title: "PDF to Word", desc: "Convert a PDF to Word Document", cat: "Pdf Tools", icon: <FileText className="w-5 h-5 text-orange-400" />, link: "/tools/pdf-to-word" },
  { title: "Unlock PDF", desc: "Remove the password from a PDF file", cat: "Pdf Tools", icon: <Lock className="w-5 h-5 text-cyan-400" />, link: "/tools/remove-password" },
  
  // Image Tools
  { title: "Remove Background", desc: "Easily Remove the Background from an image", cat: "Image Tools", icon: <Eraser className="w-5 h-5 text-orange-400" />, link: "/tools/remove-background" },
  { title: "Image to WebP", desc: "Convert your images to highly optimized WebP format.", cat: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-orange-400" />, link: "/tools/image-to-webp" },
  { title: "Upscale Image", desc: "Increase the resolution of your image", cat: "Image Tools", icon: <Maximize2 className="w-5 h-5 text-orange-400" />, link: "/tools/upscale-image" },
  { title: "Restore Photos", desc: "Restore old photos with AI", cat: "Image Tools", icon: <Wand2 className="w-5 h-5 text-purple-400" />, link: "/tools/restore-photos" },
  { title: "AI Image Generator", desc: "Text to image AI", cat: "Image Tools", icon: <Sparkles className="w-5 h-5 text-yellow-400" />, link: "/tools/ai-generator" },

  // Video Tools
  { title: "Compress Video", desc: "Lessen the file size of a Video file", cat: "Video Tools", icon: <Minimize className="w-5 h-5 text-orange-400" />, link: "/tools/compress-video" },
  { title: "Video to GIF", desc: "Upload an MP4 and convert to animated GIF", cat: "Video Tools", icon: <Scissors className="w-5 h-5 text-rose-400" />, link: "/tools/video-to-gif" },
  { title: "Mute Video", desc: "Remove audio from video online for free", cat: "Video Tools", icon: <VolumeX className="w-5 h-5 text-indigo-400" />, link: "/tools/mute-video" },
  { title: "Trim Video", desc: "Select a start and stop of a video and download", cat: "Video Tools", icon: <Scissors className="w-5 h-5 text-purple-400" />, link: "/tools/trim-video" },
  { title: "MP4 to MP3", desc: "Convert MP4 to MP3 audio", cat: "Video Tools", icon: <Music className="w-5 h-5 text-yellow-400" />, link: "/tools/mp4-to-mp3" },

  // AI Write
  { title: "Paragraph Writer", desc: "AI Paragraph Writer", cat: "AI Write", icon: <Type className="w-5 h-5 text-blue-500" />, link: "/tools/paragraph-writer" },
  { title: "Sentence Rewriter", desc: "Improve your writing", cat: "AI Write", icon: <RefreshCw className="w-5 h-5 text-blue-400" />, link: "/tools/sentence-rewriter" },
  { title: "Essay Writer", desc: "Easily create an essay with AI", cat: "AI Write", icon: <PenTool className="w-5 h-5 text-purple-400" />, link: "/tools/essay-writer" },
  { title: "Article Writer", desc: "Create an article from a title", cat: "AI Write", icon: <FileEdit className="w-5 h-5 text-teal-400" />, link: "/tools/article-writer" }
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
      {/* 2. Görseldeki 'All Tools' ve Arama Alanı */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tight mb-4">All Tools</h1>
        <p className="text-muted-foreground text-lg mb-8">Free Online Tools</p>
        
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

      {/* 1. Görseldeki Kategori Kartları Bölümü Kaldırıldı, Sadece 2. Görseldeki Popüler Araçlar Alanı Kaldı */}
      
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold mb-3">
          Our Most Popular Tools
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
        {["Pdf Tools", "Video Tools", "Image Tools", "Converter Tools", "AI Write"].map((tab) => (
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
          <Link href={tool.link} key={i}>
            <a className="group block h-full no-underline">
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full relative overflow-hidden cursor-pointer">
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
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
