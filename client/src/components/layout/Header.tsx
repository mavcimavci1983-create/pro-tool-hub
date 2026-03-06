import { Link } from "wouter";
import { 
  Zap, 
  Languages,
  Menu,
  FileStack,
  FileEdit,
  Image as ImageIcon,
  Youtube,
  Minimize,
  Download,
  Table,
  Type,
  PenTool,
  Instagram,
  Twitter,
  Video,
  FileText
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
import translationsData from "@/locales/translations.json";

const translations = translationsData as Record<string, any>;

const pdfTools = {
  featured: [
    { title: "Merge PDF", desc: "Merge 2 or more PDF files", icon: <FileStack className="w-5 h-5 text-rose-500" />, href: "/tools/merge-pdf" },
    { title: "Edit PDF", desc: "Free PDF Editor", icon: <FileEdit className="w-5 h-5 text-blue-500" />, href: "/tools/edit-pdf" },
    { title: "PDF to JPG", desc: "Convert PDF pages to images", icon: <ImageIcon className="w-5 h-5 text-blue-400" />, href: "/tools/pdf-to-jpg" },
    { title: "JPG to PDF", desc: "Upload images and receive as a PDF", icon: <ImageIcon className="w-5 h-5 text-emerald-500" />, href: "/tools/jpg-to-pdf" },
  ],
  others: [
    { title: "Compress PDF", href: "/tools/compress-pdf" },
    { title: "Split PDF", href: "/tools/split-pdf" },
    { title: "PDF to Word", href: "/tools/pdf-to-word" },
    { title: "Word to PDF", href: "/tools/word-to-pdf" },
    { title: "Unlock PDF", href: "/tools/remove-password" },
    { title: "Protect PDF", href: "/tools/protect-pdf" },
    { title: "Rotate PDF", href: "/tools/rotate-pdf" },
    { title: "Add Watermark", href: "/tools/add-watermark" },
  ]
};

const videoTools = {
  featured: [
    { title: "YouTube to Text", desc: "Convert video to text", icon: <Youtube className="w-5 h-5 text-red-500" />, href: "/tools/youtube-to-text" },
    { title: "Compress Video", desc: "Lessen video file size", icon: <Minimize className="w-5 h-5 text-orange-500" />, href: "/tools/compress-video" },
    { title: "Instagram Download", desc: "Download from Instagram", icon: <Download className="w-5 h-5 text-pink-500" />, href: "/tools/instagram-download" },
    { title: "TikTok Download", desc: "Download from TikTok", icon: <Download className="w-5 h-5 text-black" />, href: "/tools/tiktok-downloader" },
  ],
  others: [
    { title: "Video to GIF", href: "/tools/video-to-gif" },
    { title: "Video to MP3", href: "/tools/video-to-mp3" },
    { title: "MP4 to WebM", href: "/tools/mp4-to-webm" },
    { title: "Mute Video", href: "/tools/mute-video" },
  ]
};

const imageTools = {
  featured: [
    { title: "Image to WebP", desc: "Fast WebP converter", icon: <ImageIcon className="w-5 h-5 text-emerald-500" />, href: "/tools/image-to-webp" },
    { title: "Remove Background", desc: "AI Background remover", icon: <Zap className="w-5 h-5 text-purple-500" />, href: "/tools/remove-background" },
    { title: "HEIC to JPG", desc: "iPhone photo converter", icon: <ImageIcon className="w-5 h-5 text-orange-500" />, href: "/tools/heic-to-jpg" },
    { title: "WebP to JPG", desc: "Convert WebP to JPG", icon: <ImageIcon className="w-5 h-5 text-blue-500" />, href: "/tools/webp-to-jpg" },
  ],
  others: [
    { title: "Resize Image", href: "/tools/resize-image" },
    { title: "Compress Image", href: "/tools/compress-image" },
    { title: "Crop Image", href: "/tools/crop-image" },
    { title: "Add Text", href: "/tools/add-text-to-image" },
  ]
};

const writeTools = {
  featured: [
    { title: "Paragraph Writer", desc: "AI paragraph writer", icon: <Type className="w-5 h-5 text-rose-400" />, href: "/tools/paragraph-writer" },
    { title: "Essay Writer", desc: "Create AI essays", icon: <PenTool className="w-5 h-5 text-orange-400" />, href: "/tools/essay-writer" },
    { title: "Instagram Caption", desc: "Social media captions", icon: <Instagram className="w-5 h-5 text-pink-500" />, href: "/tools/instagram-caption-generator" },
    { title: "LinkedIn Post", desc: "Professional networking", icon: <Twitter className="w-5 h-5 text-sky-500" />, href: "/tools/linkedin-post-generator" },
  ],
  others: [
    { title: "Sentence Expander", href: "/tools/sentence-expander" },
    { title: "YouTube Title", href: "/tools/youtube-title-generator" },
    { title: "TikTok Script", href: "/tools/tiktok-script-creator" },
    { title: "Email Writer", href: "/tools/email-writer" },
  ]
};

export function Header() {
  const { language, setLanguage } = useLanguageStore();

  const renderToolList = (category: any, title: string) => (
    <div className="grid grid-cols-[300px_450px] p-6 gap-6 bg-white rounded-xl shadow-2xl min-w-[750px]">
      <div className="border-r pr-6">
        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 text-left">Featured Tools</h4>
        <div className="space-y-4 text-left">
          {category.featured.map((tool: any) => (
            <div key={tool.title}>
              <Link href={tool.href}>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors group text-left">
                  <div className="mt-1">{tool.icon}</div>
                  <div>
                    <div className="text-sm font-bold group-hover:text-primary">{tool.title}</div>
                    <div className="text-[11px] text-muted-foreground">{tool.desc}</div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 text-left">Other {title} Tools</h4>
        <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-left">
          {category.others.map((tool: any) => (
            <div key={tool.title}>
              <Link href={tool.href}>
                <span className="text-[13px] font-medium text-foreground hover:text-primary cursor-pointer transition-colors block">
                  {tool.title}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Zap className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:inline-block text-slate-900">
                Micro<span className="text-primary">Wow</span>
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-slate-100 font-bold text-xs px-3 text-slate-700">PDF</NavigationMenuTrigger>
                <NavigationMenuContent>{renderToolList(pdfTools, "PDF")}</NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-slate-100 font-bold text-xs px-3 text-slate-700">IMAGE</NavigationMenuTrigger>
                <NavigationMenuContent>{renderToolList(imageTools, "Image")}</NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-slate-100 font-bold text-xs px-3 text-slate-700">VIDEO</NavigationMenuTrigger>
                <NavigationMenuContent>{renderToolList(videoTools, "Video")}</NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-slate-100 font-bold text-xs px-3 text-slate-700">CONVERTER</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-6 bg-white rounded-xl shadow-2xl min-w-[300px]">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Converter Tools</h4>
                    <div className="space-y-2">
                      <Link href="/tools/csv-to-json"><span className="text-sm font-medium hover:text-primary cursor-pointer block">CSV to JSON</span></Link>
                      <Link href="/tools/excel-to-pdf"><span className="text-sm font-medium hover:text-primary cursor-pointer block">Excel to PDF</span></Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-slate-100 font-bold text-xs px-3 text-slate-700">WRITE</NavigationMenuTrigger>
                <NavigationMenuContent>{renderToolList(writeTools, "AI")}</NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-slate-100 font-bold text-xs px-3 text-slate-700">OTHER</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-6 bg-white rounded-xl shadow-2xl min-w-[300px]">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Utilities</h4>
                    <div className="space-y-2">
                      <Link href="/tools/qr-generator"><span className="text-sm font-medium hover:text-primary cursor-pointer block">QR Generator</span></Link>
                      <Link href="/tools/password-generator"><span className="text-sm font-medium hover:text-primary cursor-pointer block">Password Generator</span></Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
            className="font-bold text-[10px] h-8 px-2 rounded-md border-slate-200 hover:bg-slate-50 transition-all text-slate-600"
          >
            <Languages className="w-3.5 h-3.5 mr-1 text-primary" />
            {language.toUpperCase()}
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
