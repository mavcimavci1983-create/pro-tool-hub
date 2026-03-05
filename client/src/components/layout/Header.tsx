import { Link } from "wouter";
import { 
  Search, 
  Menu, 
  Moon, 
  Share2, 
  ChevronDown,
  FileText,
  FileEdit,
  FileUp,
  Image as ImageIcon,
  FileStack,
  Lock,
  Globe,
  PenTool,
  Scissors,
  Maximize2,
  Minimize2,
  Type,
  RefreshCw,
  Eraser,
  Wand2,
  Brush,
  Palette,
  RotateCw,
  Square,
  Circle,
  Sparkles,
  VolumeX,
  Minimize,
  Languages,
  Pen,
  Video,
  File,
  Download,
  Music,
  FileJson,
  FileCode,
  Table,
  Play,
  Youtube,
  Presentation,
  QrCode,
  StickyNote,
  Smile,
  Zap,
  Clock,
  BookOpen,
  CheckCircle2,
  MessageSquare,
  Clapperboard,
  History
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    { title: "PDF to Excel", href: "/tools/pdf-to-excel" },
    { title: "PDF to PowerPoint", href: "/tools/pdf-to-powerpoint" },
    { title: "PNG to PDF", href: "/tools/png-to-pdf" },
    { title: "PDF Translator", href: "/tools/pdf-translator" },
    { title: "eSign PDF", href: "/tools/esign" },
    { title: "Protect PDF", href: "/tools/protect-pdf" },
    { title: "Extract Text", href: "/tools/extract-text" },
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
    { title: "Audio to Text", href: "/tools/audio-to-text" },
    { title: "MP4 to MP3", href: "/tools/mp4-to-mp3" },
    { title: "Extract Audio", href: "/tools/extract-audio" },
    { title: "YouTube Transcript", href: "/tools/youtube-transcript" },
    { title: "Video to GIF", href: "/tools/video-to-gif" },
    { title: "Video to Text", href: "/tools/video-to-text" },
    { title: "Twitter Download", href: "/tools/twitter-download" },
    { title: "Trim Video", href: "/tools/trim-video" },
  ]
};

const converterTools = {
  featured: [
    { title: "Excel to PDF", desc: "Convert Excel to PDF", icon: <Table className="w-5 h-5 text-green-600" />, href: "/tools/excel-to-pdf" },
    { title: "CSV to Excel", desc: "Convert CSV to Excel", icon: <Table className="w-5 h-5 text-emerald-500" />, href: "/tools/csv-to-excel" },
    { title: "Split Excel", desc: "Divide Excel files", icon: <Table className="w-5 h-5 text-green-400" />, href: "/tools/split-excel" },
    { title: "XML to Excel", desc: "Convert XML to Excel", icon: <FileCode className="w-5 h-5 text-blue-400" />, href: "/tools/xml-to-excel" },
  ],
  others: [
    { title: "Split CSV", href: "/tools/split-csv" },
    { title: "EPUB to MOBI", href: "/tools/epub-to-mobi" },
    { title: "JSON to XML", href: "/tools/json-to-xml" },
    { title: "Excel to CSV", href: "/tools/excel-to-csv" },
    { title: "XML to CSV", href: "/tools/xml-to-csv" },
    { title: "CSV to JSON", href: "/tools/csv-to-json" },
    { title: "EPUB to AZW3", href: "/tools/epub-to-azw3" },
    { title: "Excel to XML", href: "/tools/excel-to-xml" },
  ]
};

const writeTools = {
  featured: [
    { title: "Content Improver", desc: "Improve your content", icon: <Sparkles className="w-5 h-5 text-purple-400" />, href: "/tools/content-improver" },
    { title: "Essay Writer", desc: "Create AI essays", icon: <PenTool className="w-5 h-5 text-orange-400" />, href: "/tools/essay-writer" },
    { title: "Paragraph Writer", desc: "AI paragraph writer", icon: <Type className="w-5 h-5 text-rose-400" />, href: "/tools/paragraph-writer" },
    { title: "Paragraph Completer", desc: "Finish paragraphs", icon: <Type className="w-5 h-5 text-blue-400" />, href: "/tools/paragraph-completer" },
  ],
  others: [
    { title: "Story Generator", href: "/tools/story-generator" },
    { title: "Grammar Fixer", href: "/tools/grammar-fixer" },
    { title: "Sentence Rewriter", href: "/tools/sentence-rewriter" },
    { title: "Article Writer", href: "/tools/article-writer" },
    { title: "Content Summarizer", href: "/tools/content-summarizer" },
    { title: "AI Humanizer", href: "/tools/ai-humanizer" },
    { title: "Tone of Voice", href: "/tools/tone-of-voice" },
    { title: "YouTube Script", href: "/tools/youtube-script-writer" },
  ]
};

const otherTools = {
  featured: [
    { title: "QR Generator", desc: "Create QR codes", icon: <QrCode className="w-5 h-5 text-orange-400" />, href: "/tools/qr-generator" },
    { title: "Lorem Ipsum", desc: "Placeholder text", icon: <StickyNote className="w-5 h-5 text-yellow-400" />, href: "/tools/lorem-ipsum" },
    { title: "Meme Maker", desc: "Create memes", icon: <Smile className="w-5 h-5 text-blue-400" />, href: "/tools/meme-maker" },
    { title: "Create Zip", desc: "Compress files", icon: <Zap className="w-5 h-5 text-green-400" />, href: "/tools/create-zip" },
  ],
  others: [
    { title: "Epoch Converter", href: "/tools/epoch-converter" }
  ]
};

export default function Header() {
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
              {/* PDF Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-muted font-medium text-sm px-3">
                  PDF
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-[300px_450px] p-6 gap-6 bg-white rounded-xl shadow-2xl">
                    <div className="border-r pr-6">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 text-left">Featured Tools</h4>
                      <div className="space-y-4 text-left">
                        {pdfTools.featured.map((tool) => (
                          <Link key={tool.title} href={tool.href}>
                            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors group text-left">
                              <div className="mt-1">{tool.icon}</div>
                              <div>
                                <div className="text-sm font-bold group-hover:text-primary">{tool.title}</div>
                                <div className="text-[11px] text-muted-foreground">{tool.desc}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 text-left">Other PDF Tools</h4>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-left">
                        {pdfTools.others.map((tool) => (
                          <Link key={tool.title} href={tool.href}>
                            <span className="text-[13px] font-medium text-foreground hover:text-primary cursor-pointer transition-colors block">
                              {tool.title}
                            </span>
                          </Link>
                        ))}
                        <Link href="/tools/all-pdf">
                          <span className="text-[13px] font-bold text-primary hover:underline cursor-pointer">All Pdf Tools</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Video Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-muted font-medium text-sm px-3">
                  Video
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-[300px_450px] p-6 gap-6 bg-white rounded-xl shadow-2xl min-w-[750px]">
                    <div className="border-r pr-6">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 text-left">Featured Tools</h4>
                      <div className="space-y-4 text-left">
                        {videoTools.featured.map((tool) => (
                          <Link key={tool.title} href={tool.href}>
                            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors group text-left">
                              <div className="mt-1">{tool.icon}</div>
                              <div>
                                <div className="text-sm font-bold group-hover:text-primary">{tool.title}</div>
                                <div className="text-[11px] text-muted-foreground">{tool.desc}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 text-left">Other Video Tools</h4>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-left">
                        {videoTools.others.map((tool) => (
                          <Link key={tool.title} href={tool.href}>
                            <span className="text-[13px] font-medium text-foreground hover:text-primary cursor-pointer transition-colors block">
                              {tool.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Converter Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-muted font-medium text-sm px-3">
                  Converter
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-[300px_450px] p-6 gap-6 bg-white rounded-xl shadow-2xl min-w-[750px]">
                    <div className="border-r pr-6">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 text-left">Featured Tools</h4>
                      <div className="space-y-4 text-left">
                        {converterTools.featured.map((tool) => (
                          <Link key={tool.title} href={tool.href}>
                            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors group text-left">
                              <div className="mt-1">{tool.icon}</div>
                              <div>
                                <div className="text-sm font-bold group-hover:text-primary">{tool.title}</div>
                                <div className="text-[11px] text-muted-foreground">{tool.desc}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 text-left">Other Converter Tools</h4>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-left">
                        {converterTools.others.map((tool) => (
                          <Link key={tool.title} href={tool.href}>
                            <span className="text-[13px] font-medium text-foreground hover:text-primary cursor-pointer transition-colors block">
                              {tool.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Write Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-muted font-medium text-sm px-3">
                  Write
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-[300px_450px] p-6 gap-6 bg-white rounded-xl shadow-2xl min-w-[750px]">
                    <div className="border-r pr-6">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 text-left">Featured Tools</h4>
                      <div className="space-y-4 text-left">
                        {writeTools.featured.map((tool) => (
                          <Link key={tool.title} href={tool.href}>
                            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors group text-left">
                              <div className="mt-1">{tool.icon}</div>
                              <div>
                                <div className="text-sm font-bold group-hover:text-primary">{tool.title}</div>
                                <div className="text-[11px] text-muted-foreground">{tool.desc}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 text-left">Other AI Tools</h4>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-left">
                        {writeTools.others.map((tool) => (
                          <Link key={tool.title} href={tool.href}>
                            <span className="text-[13px] font-medium text-foreground hover:text-primary cursor-pointer transition-colors block">
                              {tool.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Other Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-muted font-medium text-sm px-3">
                  Other
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-[300px_450px] p-6 gap-6 bg-white rounded-xl shadow-2xl min-w-[750px]">
                    <div className="border-r pr-6">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 text-left">Featured Tools</h4>
                      <div className="space-y-4 text-left">
                        {otherTools.featured.map((tool) => (
                          <Link key={tool.title} href={tool.href}>
                            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors group text-left">
                              <div className="mt-1">{tool.icon}</div>
                              <div>
                                <div className="text-sm font-bold group-hover:text-primary">{tool.title}</div>
                                <div className="text-[11px] text-muted-foreground">{tool.desc}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 text-left">Other Tools</h4>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-left">
                        {otherTools.others.map((tool) => (
                          <Link key={tool.title} href={tool.href}>
                            <span className="text-[13px] font-medium text-foreground hover:text-primary cursor-pointer transition-colors block">
                              {tool.title}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="hidden md:flex relative w-full max-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search tools" 
              className="w-full bg-muted/50 border-none pl-9 rounded-full h-9 text-sm"
            />
          </div>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground h-9 w-9">
            <Moon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground h-9 w-9">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button className="rounded-full px-5 bg-primary hover:bg-primary/90 text-white font-bold h-9 text-sm">
            Sign In
          </Button>
        </div>
      </div>
      
      <div className="w-full bg-muted/30 border-t py-2 text-center text-xs text-muted-foreground">
        <div className="container mx-auto max-w-3xl h-12 border border-dashed border-muted-foreground/30 bg-muted/10 flex items-center justify-center rounded">
          Advertisement Placeholder (728x90)
        </div>
      </div>
    </header>
  );
}
