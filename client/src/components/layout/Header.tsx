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
  Twitter
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Zap className="h-5 w-5" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight hidden sm:inline-block">
                Micro<span className="text-primary">Wow</span>
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-muted font-medium text-sm px-3 uppercase italic tracking-tighter">PDF</NavigationMenuTrigger>
                <NavigationMenuContent>{renderToolList(pdfTools, "PDF")}</NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-muted font-medium text-sm px-3 uppercase italic tracking-tighter">VIDEO</NavigationMenuTrigger>
                <NavigationMenuContent>{renderToolList(videoTools, "Video")}</NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-muted font-medium text-sm px-3 uppercase italic tracking-tighter">WRITE</NavigationMenuTrigger>
                <NavigationMenuContent>{renderToolList(writeTools, "AI")}</NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
            className="font-black text-xs h-9 px-3 rounded-full border-2 hover:bg-primary/5 transition-all uppercase italic tracking-tighter"
          >
            <Languages className="w-4 h-4 mr-1.5 text-primary" />
            {language.toUpperCase()}
          </Button>
          <div className="hidden md:flex h-[36px] px-3 bg-muted/10 border-2 border-dashed rounded-full text-[9px] font-black items-center justify-center text-muted-foreground uppercase tracking-widest">
            AD SPACE
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
