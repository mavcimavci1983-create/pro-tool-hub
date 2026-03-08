import { Link, useLocation } from "wouter";
import { 
  Zap, 
  Languages,
  Menu,
  FileText,
  Shield,
  ArrowRightLeft,
  ArrowUpToLine,
  ImageIcon,
  Video,
  PenTool,
  Wrench,
  Layers,
  Split,
  Minimize,
  Lock,
  LockOpen,
  Stamp,
  RotateCw,
  FileSignature,
  FileDiff,
  Table,
  Presentation,
  Eye,
  Code,
  Scissors,
  Type,
  RefreshCw,
  QrCode,
  Globe,
  Hash,
  Monitor,
  Youtube,
  Download,
  Music,
  Play,
  VolumeX,
  Sparkles,
  BookOpen,
  User,
  Heart,
  FileCode,
  FileJson
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/lib/languageStore";
import { useCategoryStore } from "@/lib/categoryStore";
import translationsData from "@/locales/translations.json";

const translations = translationsData as Record<string, any>;

const NAV_CATEGORIES = [
  {
    id: "pdf-tools",
    label: "PDF Tools",
    icon: <FileText className="w-3.5 h-3.5" />,
    filterCategory: "PDF",
    filterSub: "organize" as const,
    tools: [
      { title: "Merge PDF", icon: <Layers className="w-4 h-4 text-red-500" />, href: "/tools/merge-pdf" },
      { title: "Split PDF", icon: <Split className="w-4 h-4 text-red-500" />, href: "/tools/split-pdf" },
      { title: "Compress PDF", icon: <Minimize className="w-4 h-4 text-emerald-500" />, href: "/tools/compress-pdf" },
      { title: "Protect PDF", icon: <Lock className="w-4 h-4 text-gray-700" />, href: "/tools/protect-pdf" },
      { title: "Unlock PDF", icon: <LockOpen className="w-4 h-4 text-rose-500" />, href: "/tools/remove-password" },
      { title: "Add Watermark", icon: <Stamp className="w-4 h-4 text-indigo-500" />, href: "/tools/add-watermark" },
      { title: "Sign PDF", icon: <FileSignature className="w-4 h-4 text-purple-500" />, href: "/tools/sign-pdf" },
      { title: "Rotate PDF", icon: <RotateCw className="w-4 h-4 text-red-500" />, href: "/tools/rotate-pdf" },
      { title: "Page Numbers", icon: <Hash className="w-4 h-4 text-red-500" />, href: "/tools/page-numbers" },
      { title: "Remove Pages", icon: <Scissors className="w-4 h-4 text-red-500" />, href: "/tools/delete-pages" },
      { title: "Reorder Pages", icon: <ArrowRightLeft className="w-4 h-4 text-red-500" />, href: "/tools/reorder-pages" },
      { title: "Edit PDF", icon: <PenTool className="w-4 h-4 text-red-500" />, href: "/tools/edit-pdf" },
      { title: "Crop PDF", icon: <Scissors className="w-4 h-4 text-red-500" />, href: "/tools/crop-pdf" },
      { title: "Flatten PDF", icon: <Layers className="w-4 h-4 text-red-500" />, href: "/tools/flatten-pdf" },
    ],
  },
  {
    id: "security",
    label: "Security & Optimize",
    icon: <Shield className="w-3.5 h-3.5" />,
    filterCategory: "PDF",
    filterSub: "security" as const,
    tools: [
      { title: "Watermark PDF", icon: <Stamp className="w-4 h-4 text-indigo-500" />, href: "/tools/add-watermark" },
      { title: "Sign PDF", icon: <FileSignature className="w-4 h-4 text-purple-500" />, href: "/tools/sign-pdf" },
      { title: "Compare PDF", icon: <FileDiff className="w-4 h-4 text-sky-500" />, href: "/tools/compare-pdf" },
      { title: "Translate PDF", icon: <Languages className="w-4 h-4 text-amber-500" />, href: "/tools/translate-pdf" },
      { title: "Repair PDF", icon: <Wrench className="w-4 h-4 text-orange-500" />, href: "/tools/repair-pdf" },
    ],
  },
  {
    id: "convert-from",
    label: "Convert from PDF",
    icon: <ArrowRightLeft className="w-3.5 h-3.5" />,
    filterCategory: "PDF",
    filterSub: "convert-from" as const,
    tools: [
      { title: "PDF to Word", icon: <FileText className="w-4 h-4 text-blue-600" />, href: "/tools/pdf-to-word" },
      { title: "PDF to Excel", icon: <Table className="w-4 h-4 text-green-600" />, href: "/tools/pdf-to-excel" },
      { title: "PDF to PPT", icon: <Presentation className="w-4 h-4 text-orange-600" />, href: "/tools/pdf-to-powerpoint" },
      { title: "PDF to JPG", icon: <ImageIcon className="w-4 h-4 text-pink-500" />, href: "/tools/pdf-to-jpg" },
      { title: "PDF to Text", icon: <FileText className="w-4 h-4 text-orange-500" />, href: "/tools/pdf-to-text" },
      { title: "PDF to PDF/A", icon: <FileText className="w-4 h-4 text-indigo-500" />, href: "/tools/pdf-to-pdfa" },
      { title: "OCR PDF", icon: <Eye className="w-4 h-4 text-violet-500" />, href: "/tools/ocr-pdf" },
    ],
  },
  {
    id: "convert-to",
    label: "Convert to PDF",
    icon: <ArrowUpToLine className="w-3.5 h-3.5" />,
    filterCategory: "PDF",
    filterSub: "convert-to" as const,
    tools: [
      { title: "Word to PDF", icon: <FileText className="w-4 h-4 text-blue-500" />, href: "/tools/word-to-pdf" },
      { title: "PPT to PDF", icon: <Presentation className="w-4 h-4 text-orange-500" />, href: "/tools/ppt-to-pdf" },
      { title: "Excel to PDF", icon: <Table className="w-4 h-4 text-green-500" />, href: "/tools/excel-to-pdf" },
      { title: "JPG to PDF", icon: <ImageIcon className="w-4 h-4 text-red-500" />, href: "/tools/jpg-to-pdf" },
      { title: "HTML to PDF", icon: <Code className="w-4 h-4 text-cyan-500" />, href: "/tools/html-to-pdf" },
      { title: "Scan to PDF", icon: <Eye className="w-4 h-4 text-teal-500" />, href: "/tools/scan-to-pdf" },
    ],
  },
  {
    id: "image",
    label: "Image Tools",
    icon: <ImageIcon className="w-3.5 h-3.5" />,
    filterCategory: "Image",
    filterSub: null,
    tools: [
      { title: "Compress Image", icon: <Minimize className="w-4 h-4 text-emerald-500" />, href: "/tools/compress-image" },
      { title: "Resize Image", icon: <Minimize className="w-4 h-4 text-indigo-500" />, href: "/tools/resize-image" },
      { title: "Crop Image", icon: <Scissors className="w-4 h-4 text-rose-500" />, href: "/tools/crop-image" },
      { title: "WebP to JPG", icon: <ImageIcon className="w-4 h-4 text-blue-500" />, href: "/tools/webp-to-jpg" },
      { title: "WebP to PNG", icon: <ImageIcon className="w-4 h-4 text-indigo-500" />, href: "/tools/webp-to-png" },
      { title: "HEIC to JPG", icon: <ImageIcon className="w-4 h-4 text-orange-500" />, href: "/tools/heic-to-jpg" },
      { title: "Image to WebP", icon: <ImageIcon className="w-4 h-4 text-emerald-500" />, href: "/tools/image-to-webp" },
      { title: "Add Text", icon: <Type className="w-4 h-4 text-slate-500" />, href: "/tools/add-text-to-image" },
      { title: "Remove BG", icon: <Zap className="w-4 h-4 text-purple-500" />, href: "/tools/remove-background" },
    ],
  },
  {
    id: "video",
    label: "Video",
    icon: <Video className="w-3.5 h-3.5" />,
    filterCategory: "Video",
    filterSub: null,
    tools: [
      { title: "YouTube to Text", icon: <Youtube className="w-4 h-4 text-red-500" />, href: "/tools/youtube-to-text" },
      { title: "Compress Video", icon: <Minimize className="w-4 h-4 text-emerald-400" />, href: "/tools/compress-video" },
      { title: "Video to GIF", icon: <Scissors className="w-4 h-4 text-purple-400" />, href: "/tools/video-to-gif" },
      { title: "Video to MP3", icon: <Music className="w-4 h-4 text-pink-400" />, href: "/tools/video-to-mp3" },
      { title: "MP4 to WebM", icon: <Play className="w-4 h-4 text-blue-400" />, href: "/tools/mp4-to-webm" },
      { title: "Mute Video", icon: <VolumeX className="w-4 h-4 text-gray-500" />, href: "/tools/mute-video" },
      { title: "TikTok Download", icon: <Download className="w-4 h-4 text-pink-600" />, href: "/tools/tiktok-downloader" },
      { title: "Instagram Download", icon: <Download className="w-4 h-4 text-purple-600" />, href: "/tools/instagram-download" },
      { title: "Facebook Download", icon: <Download className="w-4 h-4 text-blue-600" />, href: "/tools/facebook-download" },
      { title: "Twitter Download", icon: <Download className="w-4 h-4 text-sky-600" />, href: "/tools/twitter-download" },
      { title: "Video Resizer", icon: <Minimize className="w-4 h-4 text-indigo-400" />, href: "/tools/video-resizer" },
      { title: "Rotate Video", icon: <RotateCw className="w-4 h-4 text-sky-400" />, href: "/tools/rotate-video" },
      { title: "Trim Video", icon: <Scissors className="w-4 h-4 text-rose-400" />, href: "/tools/trim-video" },
      { title: "Video to Text", icon: <Type className="w-4 h-4 text-slate-600" />, href: "/tools/video-to-text" },
    ],
  },
  {
    id: "ai-write",
    label: "AI Write",
    icon: <PenTool className="w-3.5 h-3.5" />,
    filterCategory: "AI Writing",
    filterSub: null,
    tools: [
      { title: "Paragraph Writer", icon: <PenTool className="w-4 h-4 text-rose-400" />, href: "/tools/paragraph-writer" },
      { title: "Essay Writer", icon: <BookOpen className="w-4 h-4 text-orange-400" />, href: "/tools/essay-writer" },
      { title: "Story Generator", icon: <Heart className="w-4 h-4 text-red-400" />, href: "/tools/story-generator" },
      { title: "Blog Post Idea", icon: <Sparkles className="w-4 h-4 text-yellow-500" />, href: "/tools/blog-post-idea" },
      { title: "Instagram Caption", icon: <Sparkles className="w-4 h-4 text-pink-500" />, href: "/tools/instagram-caption-generator" },
      { title: "LinkedIn Post", icon: <User className="w-4 h-4 text-sky-500" />, href: "/tools/linkedin-post-generator" },
      { title: "Content Improver", icon: <Zap className="w-4 h-4 text-yellow-500" />, href: "/tools/content-improver" },
    ],
  },
  {
    id: "converter",
    label: "Converter",
    icon: <RefreshCw className="w-3.5 h-3.5" />,
    filterCategory: "Converter",
    filterSub: null,
    tools: [
      { title: "CSV to JSON", icon: <FileCode className="w-4 h-4 text-amber-500" />, href: "/tools/csv-to-json" },
      { title: "JSON to CSV", icon: <FileJson className="w-4 h-4 text-blue-500" />, href: "/tools/json-to-csv" },
      { title: "XML to JSON", icon: <FileCode className="w-4 h-4 text-cyan-500" />, href: "/tools/xml-to-json" },
    ],
  },
  {
    id: "other",
    label: "Other",
    icon: <Wrench className="w-3.5 h-3.5" />,
    filterCategory: "Other",
    filterSub: null,
    tools: [
      { title: "QR Generator", icon: <QrCode className="w-4 h-4 text-slate-900" />, href: "/tools/qr-generator" },
      { title: "Barcode Gen", icon: <Hash className="w-4 h-4 text-slate-700" />, href: "/tools/barcode-generator" },
      { title: "My IP Address", icon: <Globe className="w-4 h-4 text-blue-500" />, href: "/tools/my-ip" },
      { title: "Internet Speed", icon: <Monitor className="w-4 h-4 text-indigo-500" />, href: "/tools/speed-test" },
    ],
  },
];

export function Header() {
  const { language, setLanguage } = useLanguageStore();
  const { setCategory } = useCategoryStore();
  const [, navigate] = useLocation();

  const handleCategoryClick = (cat: typeof NAV_CATEGORIES[0]) => {
    setCategory(cat.filterCategory, cat.filterSub as any);
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById("tool-grid-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => useCategoryStore.getState().reset()}>
              <div className="bg-slate-900 text-white p-1.5 rounded-lg">
                <Zap className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:inline-block text-slate-900">
                ProToolHub
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-0.5">
              {NAV_CATEGORIES.map(cat => (
                <NavigationMenuItem key={cat.id}>
                  <NavigationMenuTrigger
                    className="bg-transparent hover:bg-slate-100 font-bold text-[11px] px-2.5 py-1.5 text-slate-700 uppercase tracking-wide"
                    onClick={() => handleCategoryClick(cat)}
                    data-testid={`nav-${cat.id}`}
                  >
                    <span className="mr-1.5 text-slate-400">{cat.icon}</span>
                    {cat.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className={`p-5 bg-white rounded-xl shadow-2xl ${cat.tools.length > 6 ? "min-w-[460px]" : "min-w-[260px]"}`}>
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 text-left">{cat.label}</h4>
                      <div className={`grid ${cat.tools.length > 6 ? "grid-cols-2" : "grid-cols-1"} gap-0.5`}>
                        {cat.tools.map(tool => (
                          <Link key={tool.href} href={tool.href}>
                            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group text-left">
                              {tool.icon}
                              <span className="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900">{tool.title}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
            className="font-bold text-[10px] h-8 px-2 rounded-md border-slate-200 hover:bg-slate-50 transition-all text-slate-600"
            data-testid="button-language"
          >
            <Languages className="w-3.5 h-3.5 mr-1 text-slate-900" />
            {language.toUpperCase()}
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden" data-testid="button-mobile-menu">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
