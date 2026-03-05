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
  FileCode
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
  {
    title: "Video to GIF",
    desc: "Free online video to gif converter - No Watermark",
    cat: "Video Tools",
    icon: <Scissors className="w-5 h-5 text-rose-500" />,
    link: "/tools/video-to-gif"
  },
  {
    title: "Mute Video",
    desc: "Remove audio from video online for free - Fast & Secure",
    cat: "Video Tools",
    icon: <VolumeX className="w-5 h-5 text-indigo-500" />,
    link: "/tools/mute-video"
  },
  {
    title: "Video Resizer",
    desc: "Resize video online for social media - No Watermark",
    cat: "Video Tools",
    icon: <Minimize className="w-5 h-5 text-blue-500" />,
    link: "/tools/video-resizer"
  },
  {
    title: "Image to WebP",
    desc: "Convert your images to highly optimized WebP format.",
    cat: "Image Tools",
    icon: <ImageIcon className="w-5 h-5 text-orange-500" />,
    link: "/tools/image-to-webp"
  },
  {
    title: "Remove Background",
    desc: "AI-powered background removal with 60-min auto-wipe security.",
    cat: "Image Tools",
    icon: <Scissors className="w-5 h-5 text-green-500" />,
    link: "/tools/remove-background"
  },
  {
    title: "Merge PDF",
    desc: "Securely combine multiple PDF files on our Node.js backend.",
    cat: "Pdf Tools",
    icon: <Merge className="w-5 h-5 text-purple-500" />,
    link: "/tools/merge-pdf"
  },
  {
    title: "Edit PDF",
    desc: "Free PDF Editor",
    cat: "Pdf Tools",
    icon: <PenTool className="w-5 h-5 text-blue-500" />,
    link: "/tools/edit-pdf"
  },
  {
    title: "PDF to JPG",
    desc: "Convert PDF to JPG and download each page as an image",
    cat: "Pdf Tools",
    icon: <FileText className="w-5 h-5 text-yellow-500" />,
    link: "/tools/pdf-to-jpg"
  },
  {
    title: "JPG to PDF",
    desc: "Upload images and receive as a PDF",
    cat: "Pdf Tools",
    icon: <FileText className="w-5 h-5 text-red-500" />,
    link: "/tools/jpg-to-pdf"
  },
  {
    title: "Compress PDF",
    desc: "Lessen the file size of a PDF file",
    cat: "Pdf Tools",
    icon: <Minimize2 className="w-5 h-5 text-indigo-500" />,
    link: "/tools/compress-pdf"
  },
  {
    title: "Upscale Image",
    desc: "Increase the resolution of your image",
    cat: "Image Tools",
    icon: <Maximize2 className="w-5 h-5 text-orange-500" />,
    link: "/tools/upscale-image"
  },
  {
    title: "Paragraph Writer",
    desc: "Paragraph Writer",
    cat: "AI Write",
    icon: <Type className="w-5 h-5 text-blue-600" />,
    link: "/tools/paragraph-writer"
  }
];

export function ToolGrid() {
  const [activeTab, setActiveTab] = useState("All Tools");

  const filteredTools = activeTab === "All Tools" 
    ? allTools 
    : allTools.filter(tool => tool.cat === activeTab);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-20">
      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
        {toolCategories.map((category) => (
          <div key={category.title} className="group cursor-pointer" onClick={() => setActiveTab(category.cat)}>
            <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${category.color} ${activeTab === category.cat ? 'ring-4 ring-primary/20 scale-[1.02]' : ''}`}>
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
        {filteredTools.map((tool, i) => (
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
        ))}
      </div>
    </div>
  );
}
