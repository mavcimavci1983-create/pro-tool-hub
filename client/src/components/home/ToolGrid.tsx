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
  Sparkles
} from "lucide-react";

const toolCategories = [
  {
    title: "PDF Tools",
    desc: "Solve Your PDF Problems",
    count: "45+ tools",
    color: "bg-[#A855F7]",
    icon: <FileText className="w-6 h-6 text-white" />,
    featured: { name: "Merge PDF", href: "/tools/merge-pdf" },
    cat: "Pdf Tools"
  },
  {
    title: "Image Tools",
    desc: "Solve Your Image Problems",
    count: "30+ tools",
    color: "bg-[#F97316]",
    icon: <ImageIcon className="w-6 h-6 text-white" />,
    featured: { name: "Remove Background", href: "/tools/remove-background" },
    cat: "Image Tools"
  },
  {
    title: "Video Tools",
    desc: "Solve Your Video Problems",
    count: "10+ tools",
    color: "bg-[#EC4899]",
    icon: <Video className="w-6 h-6 text-white" />,
    featured: { name: "Mute Video", href: "/tools/mute-video" },
    cat: "Video Tools"
  },
  {
    title: "AI Write",
    desc: "Solve Your Text Problems",
    count: "10+ tools",
    color: "bg-[#3B82F6]",
    icon: <PenTool className="w-6 h-6 text-white" />,
    featured: { name: "Paragraph Writer", href: "/tools/paragraph-writer" },
    cat: "AI Write"
  },
  {
    title: "File Tools",
    desc: "Solve Your File Problems",
    count: "15+ tools",
    color: "bg-[#10B981]",
    icon: <FileCode className="w-6 h-6 text-white" />,
    featured: { name: "Split Excel", href: "/tools/split-excel" },
    cat: "Converter Tools"
  }
];

const allTools = [
  // PDF Tools
  { title: "Edit PDF", desc: "Free PDF Editor online", cat: "Pdf Tools", icon: <PenTool className="w-5 h-5 text-blue-500" />, link: "/tools/edit-pdf" },
  { title: "Merge PDF", desc: "Combine multiple PDF files", cat: "Pdf Tools", icon: <Merge className="w-5 h-5 text-purple-500" />, link: "/tools/merge-pdf" },
  { title: "PDF to Word", desc: "Convert PDF to editable Word", cat: "Pdf Tools", icon: <FileText className="w-5 h-5 text-blue-400" />, link: "/tools/pdf-to-word" },
  { title: "JPG to PDF", desc: "Convert images to PDF", cat: "Pdf Tools", icon: <ImageIcon className="w-5 h-5 text-emerald-500" />, link: "/tools/jpg-to-pdf" },
  { title: "Compress PDF", desc: "Reduce PDF file size", cat: "Pdf Tools", icon: <Minimize2 className="w-5 h-5 text-indigo-500" />, link: "/tools/compress-pdf" },
  
  // Image Tools
  { title: "Remove Background", desc: "AI background removal", cat: "Image Tools", icon: <Eraser className="w-5 h-5 text-orange-500" />, link: "/tools/remove-background" },
  { title: "Image to WebP", desc: "Convert images to WebP", cat: "Image Tools", icon: <ImageIcon className="w-5 h-5 text-orange-500" />, link: "/tools/image-to-webp" },
  { title: "Upscale Image", desc: "Increase image resolution", cat: "Image Tools", icon: <Maximize2 className="w-5 h-5 text-purple-500" />, link: "/tools/upscale-image" },
  { title: "Restore Photos", desc: "Restore old photos with AI", cat: "Image Tools", icon: <Wand2 className="w-5 h-5 text-purple-500" />, link: "/tools/restore-photos" },
  { title: "AI Image Generator", desc: "Create art from text", cat: "Image Tools", icon: <Sparkles className="w-5 h-5 text-yellow-500" />, link: "/tools/ai-generator" },

  // Video Tools
  { title: "Compress Video", desc: "Lessen video file size", cat: "Video Tools", icon: <Minimize className="w-5 h-5 text-orange-500" />, link: "/tools/compress-video" },
  { title: "Video to GIF", desc: "Convert video to GIF", cat: "Video Tools", icon: <Scissors className="w-5 h-5 text-rose-500" />, link: "/tools/video-to-gif" },
  { title: "Mute Video", desc: "Remove audio from video", cat: "Video Tools", icon: <VolumeX className="w-5 h-5 text-indigo-500" />, link: "/tools/mute-video" },
  { title: "Trim Video", desc: "Cut video clips easily", cat: "Video Tools", icon: <Scissors className="w-5 h-5 text-purple-500" />, link: "/tools/trim-video" },
  { title: "MP4 to MP3", desc: "Extract audio from video", cat: "Video Tools", icon: <Music className="w-5 h-5 text-yellow-500" />, link: "/tools/mp4-to-mp3" },

  // AI Write
  { title: "Paragraph Writer", desc: "AI Paragraph Writer", cat: "AI Write", icon: <Type className="w-5 h-5 text-blue-600" />, link: "/tools/paragraph-writer" },
  { title: "Sentence Rewriter", desc: "Improve your writing", cat: "AI Write", icon: <RefreshCw className="w-5 h-5 text-blue-500" />, link: "/tools/sentence-rewriter" },
  { title: "Essay Writer", desc: "Write essays with AI", cat: "AI Write", icon: <PenTool className="w-5 h-5 text-purple-500" />, link: "/tools/essay-writer" },
  { title: "Article Writer", desc: "Blog post generator", cat: "AI Write", icon: <FileEdit className="w-5 h-5 text-teal-500" />, link: "/tools/article-writer" },

  // Converter/File Tools
  { title: "Split Excel", desc: "Divide large excel files", cat: "Converter Tools", icon: <Table className="w-5 h-5 text-emerald-600" />, link: "/tools/split-excel" },
  { title: "Excel to PDF", desc: "Convert Excel to PDF", cat: "Converter Tools", icon: <FileText className="w-5 h-5 text-emerald-600" />, link: "/tools/excel-to-pdf" },
  { title: "XML to JSON", desc: "Convert XML to JSON", cat: "Converter Tools", icon: <FileJson className="w-5 h-5 text-blue-600" />, link: "/tools/xml-to-json" },
  { title: "Split CSV", desc: "Separate large CSV files", cat: "Converter Tools", icon: <Table className="w-5 h-5 text-emerald-500" />, link: "/tools/split-csv" }
];

export function ToolGrid() {
  const [activeTab, setActiveTab] = useState("All Tools");

  const filteredTools = activeTab === "All Tools" 
    ? allTools 
    : allTools.filter(tool => tool.cat === activeTab);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-20">
      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16 pt-8">
        {toolCategories.map((category) => (
          <div key={category.title} className="group cursor-pointer" onClick={() => setActiveTab(category.cat)}>
            <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${category.color} ${activeTab === category.cat ? 'ring-4 ring-white/50 scale-[1.02]' : ''}`}>
              <div className="flex justify-between items-start mb-8">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  {category.icon}
                </div>
                <span className="text-[10px] font-bold bg-black/10 px-2 py-1 rounded-full backdrop-blur-sm uppercase">
                  {category.count}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-1">{category.title}</h3>
              <p className="text-sm text-white/80 mb-4 flex items-center gap-1">
                {category.desc} <span className="text-lg">→</span>
              </p>
            </div>
            
            <div className="mt-3 bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between shadow-sm group-hover:border-primary/20 transition-colors">
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Featured:</span>
              <Link href={category.featured.href}>
                <span className="text-xs font-bold text-primary hover:underline">{category.featured.name}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold mb-3">
          {activeTab === "All Tools" ? "Our Most Popular Tools" : `${activeTab} Category`}
        </h2>
        <p className="text-muted-foreground">We present the best of the best. All free, no catch</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool, i) => (
            <Link href={tool.link} key={i}>
              <div className="bg-card border rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1 group h-full flex items-start gap-4">
                <div className="bg-muted p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
                  {tool.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">{tool.title}</h3>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">{tool.cat}</span>
                  <p className="text-sm text-muted-foreground line-clamp-2">{tool.desc}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-muted/30 rounded-3xl border-2 border-dashed">
            <p className="text-muted-foreground">No tools found for this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
