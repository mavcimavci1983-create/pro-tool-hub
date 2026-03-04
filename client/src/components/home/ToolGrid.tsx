import { Link } from "wouter";
import { 
  FileText, 
  ImageIcon, 
  Video, 
  File, 
  PenTool,
  Scissors,
  Merge,
  Type,
  Trash2,
  Minimize2,
  Maximize2
} from "lucide-react";

const tools = [
  {
    title: "Image to WebP",
    desc: "Convert your images to highly optimized WebP format.",
    cat: "Image Tools",
    icon: <ImageIcon className="w-5 h-5 text-orange-500" />,
    link: "/tool/image-to-webp"
  },
  {
    title: "Remove Background",
    desc: "AI-powered background removal with 60-min auto-wipe security.",
    cat: "Image Tools",
    icon: <Scissors className="w-5 h-5 text-green-500" />,
    link: "/tool/remove-background"
  },
  {
    title: "Merge PDF",
    desc: "Securely combine multiple PDF files on our Node.js backend.",
    cat: "Pdf Tools",
    icon: <Merge className="w-5 h-5 text-purple-500" />,
    link: "/tool/merge-pdf"
  },
  {
    title: "Edit PDF",
    desc: "Free PDF Editor",
    cat: "Pdf Tools",
    icon: <PenTool className="w-5 h-5 text-blue-500" />,
    link: "#"
  },
  {
    title: "PDF to JPG",
    desc: "Convert PDF to JPG and download each page as an image",
    cat: "Pdf Tools",
    icon: <FileText className="w-5 h-5 text-yellow-500" />,
    link: "#"
  },
  {
    title: "JPG to PDF",
    desc: "Upload images and receive as a PDF",
    cat: "Pdf Tools",
    icon: <FileText className="w-5 h-5 text-red-500" />,
    link: "#"
  },
  {
    title: "Compress PDF",
    desc: "Lessen the file size of a PDF file",
    cat: "Pdf Tools",
    icon: <Minimize2 className="w-5 h-5 text-indigo-500" />,
    link: "#"
  },
  {
    title: "Upscale Image",
    desc: "Increase the resolution of your image",
    cat: "Image Tools",
    icon: <Maximize2 className="w-5 h-5 text-orange-500" />,
    link: "#"
  },
  {
    title: "Paragraph Writer",
    desc: "Paragraph Writer",
    cat: "AI Write",
    icon: <Type className="w-5 h-5 text-blue-600" />,
    link: "#"
  }
];

export function ToolGrid() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-heading font-bold mb-3">Our Most Popular Tools</h2>
        <p className="text-muted-foreground">We present the best of the best. All free, no catch</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10 bg-card p-1.5 rounded-full border border-border shadow-sm mx-auto w-fit">
        <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 transition-colors">
          <span className="w-4 h-4 grid grid-cols-2 gap-0.5">
            <span className="bg-current rounded-sm"></span>
            <span className="bg-current rounded-sm"></span>
            <span className="bg-current rounded-sm"></span>
            <span className="bg-current rounded-sm"></span>
          </span>
          All Tools
        </button>
        {["Pdf Tools", "Video Tools", "Image Tools", "Converter Tools", "Other Tools", "AI Write"].map((tab) => (
          <button key={tab} className="px-5 py-2 rounded-full text-muted-foreground hover:bg-muted text-sm font-semibold flex items-center gap-2 transition-colors">
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool, i) => (
          <Link href={tool.link} key={i}>
            <div className="bg-card border rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-1 group h-full flex items-start gap-4">
              <div className="bg-muted p-3 rounded-xl">
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