import { useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useLanguageStore } from "@/lib/languageStore";
import { useCategoryStore } from "@/lib/categoryStore";
import translationsData from "@/locales/translations.json";

const translations = translationsData as Record<string, any>;

// Tools with a maintenance badge shown in nav dropdown
const MAINTENANCE_HREFS = new Set<string>([]);

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
      { title: "Unlock PDF", icon: <LockOpen className="w-4 h-4 text-rose-500" />, href: "/tools/remove-password" },
      { title: "Add Watermark", icon: <Stamp className="w-4 h-4 text-indigo-500" />, href: "/tools/add-watermark" },
      { title: "Rotate PDF", icon: <RotateCw className="w-4 h-4 text-red-500" />, href: "/tools/rotate-pdf" },
      { title: "Page Numbers", icon: <Hash className="w-4 h-4 text-red-500" />, href: "/tools/page-numbers" },
      { title: "Remove Pages", icon: <Scissors className="w-4 h-4 text-red-500" />, href: "/tools/delete-pages" },
      { title: "Reorder Pages", icon: <ArrowRightLeft className="w-4 h-4 text-red-500" />, href: "/tools/reorder-pages" },
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
      { title: "Compare PDF", icon: <FileDiff className="w-4 h-4 text-sky-500" />, href: "/tools/compare-pdf" },
      { title: "Translate PDF", icon: <Languages className="w-4 h-4 text-amber-500" />, href: "/tools/translate-pdf" },
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
      { title: "PDF to JPG", icon: <ImageIcon className="w-4 h-4 text-pink-500" />, href: "/tools/pdf-to-jpg" },
      { title: "PDF to Text", icon: <FileText className="w-4 h-4 text-orange-500" />, href: "/tools/pdf-to-text" },
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
      { title: "Compress Video", icon: <Minimize className="w-4 h-4 text-emerald-400" />, href: "/tools/compress-video" },
      { title: "Video to GIF", icon: <Scissors className="w-4 h-4 text-purple-400" />, href: "/tools/video-to-gif" },
      { title: "Video to MP3", icon: <Music className="w-4 h-4 text-pink-400" />, href: "/tools/video-to-mp3" },
      { title: "MP4 to WebM", icon: <Play className="w-4 h-4 text-blue-400" />, href: "/tools/mp4-to-webm" },
      { title: "Mute Video", icon: <VolumeX className="w-4 h-4 text-gray-500" />, href: "/tools/mute-video" },
      { title: "Video Resizer", icon: <Minimize className="w-4 h-4 text-indigo-400" />, href: "/tools/video-resizer" },
      { title: "Rotate Video", icon: <RotateCw className="w-4 h-4 text-sky-400" />, href: "/tools/rotate-video" },
      { title: "Trim Video", icon: <Scissors className="w-4 h-4 text-rose-400" />, href: "/tools/trim-video" },
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
    ],
  },
];

/**
 * Yalnizca icinde arac bulunan kategoriler gosterilir.
 *
 * "Other" kategorisinde hic arac yok; sabit listeden silmek yerine filtreleme
 * yapiliyor cunku ileride bu kategoriye arac eklenirse menu kendiliginden geri
 * gelir ve bos bir acilir menu bir daha olusamaz. Hem masaustu hem mobil menu
 * ayni listeyi kullanir.
 */
const VISIBLE_NAV_CATEGORIES = NAV_CATEGORIES.filter((cat) => cat.tools.length > 0);

export function Header() {
  const { language, setLanguage } = useLanguageStore();
  const { setCategory } = useCategoryStore();
  const [, navigate] = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const isEn = language === "en";

  const handleCategoryClick = (cat: typeof NAV_CATEGORIES[0]) => {
    setCategory(cat.filterCategory, cat.filterSub as any);
    navigate("/");
    // Scroll to grid after route and category state have updated
    setTimeout(() => {
      const el = document.getElementById("tool-grid-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenSection(null);
  };

  // Mobilde kategoriye dokunmak once menuyu kapatir, sonra masaustuyle ayni
  // filtreleme + kaydirma davranisini calistirir.
  const handleMobileCategoryClick = (cat: typeof NAV_CATEGORIES[0]) => {
    closeMobile();
    handleCategoryClick(cat);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => useCategoryStore.getState().reset()}
            >
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
          <ul className="flex list-none items-center justify-center space-x-0.5">
            {VISIBLE_NAV_CATEGORIES.map((cat) => (
              <li key={cat.id} className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent hover:bg-slate-100 font-bold text-[11px] px-2.5 py-1.5 text-slate-700 uppercase tracking-wide outline-none data-[state=open]:bg-slate-100"
                    onClick={() => handleCategoryClick(cat)}
                    data-testid={`nav-${cat.id}`}
                  >
                    <span className="mr-1.5 text-slate-400">{cat.icon}</span>
                    {cat.label}
                    <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180" aria-hidden />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={8}
                    className="absolute top-full left-0 z-[50] mt-0 min-w-0 p-0 border-0 shadow-2xl bg-transparent overflow-visible"
                  >
                    <div
                      className={`p-5 bg-white rounded-xl shadow-2xl ${
                        cat.tools.length > 6 ? "min-w-[460px]" : "min-w-[260px]"
                      }`}
                    >
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 text-left">
                        {cat.label}
                      </h4>
                      <div
                        className={`grid ${
                          cat.tools.length > 6 ? "grid-cols-2" : "grid-cols-1"
                        } gap-0.5`}
                      >
                        {cat.tools.map((tool) => {
                          const isMaintenance = MAINTENANCE_HREFS.has(tool.href);
                          return (
                            <Link key={tool.href} href={tool.href}>
                              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group text-left">
                                {tool.icon}
                                <span className="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900 flex-1">
                                  {tool.title}
                                </span>
                                {isMaintenance && (
                                  <span className="text-[9px] font-bold uppercase tracking-wide bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">
                                    {language === "tr" ? "Bakım" : "Maint."}
                                  </span>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
            <li>
              <Link href="/resources">
                <span className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent hover:bg-slate-100 font-bold text-[11px] px-2.5 py-1.5 text-slate-700 uppercase tracking-wide cursor-pointer" data-testid="nav-resources">
                  <span className="mr-1.5 text-slate-400"><BookOpen className="w-3.5 h-3.5" /></span>
                  Guides
                </span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "tr" : "en")}
            className="font-bold text-[10px] h-8 px-2 rounded-md border-slate-200 hover:bg-slate-50 transition-all text-slate-600"
            data-testid="button-language"
          >
            <Languages className="w-3.5 h-3.5 mr-1 text-slate-900" />
            {language.toUpperCase()}
          </Button>
          {/* ── MOBIL MENU ────────────────────────────────────────────────
              lg altinda masaustu navigasyonu gizli oldugu icin tum kategori ve
              arac erisimi buradan saglanir. Sheet (Radix Dialog) odak tuzagi,
              Escape ile kapanma ve overlay davranisini hazir getiriyor. */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label={isEn ? "Open menu" : "Menüyü aç"}
                data-testid="button-mobile-menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[88vw] max-w-sm p-0 flex flex-col"
              data-testid="mobile-menu"
            >
              <SheetHeader className="px-5 py-4 border-b shrink-0">
                <SheetTitle className="flex items-center gap-2 text-left">
                  <div className="bg-slate-900 text-white p-1.5 rounded-lg">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-lg tracking-tight text-slate-900">
                    ProToolHub
                  </span>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label={isEn ? "Tool categories" : "Araç kategorileri"}>
                <Link href="/" onClick={closeMobile}>
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-50 font-bold text-sm text-slate-700">
                    <Layers className="w-4 h-4 text-slate-400" />
                    {isEn ? "All tools" : "Tüm araçlar"}
                  </div>
                </Link>

                <Link href="/resources" onClick={closeMobile}>
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-50 font-bold text-sm text-slate-700" data-testid="mobile-nav-resources">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    {isEn ? "Guides" : "Rehberler"}
                  </div>
                </Link>

                <ul className="mt-1 space-y-0.5 list-none p-0">
                  {VISIBLE_NAV_CATEGORIES.map((cat) => {
                    const isOpen = openSection === cat.id;
                    const panelId = `mobile-section-${cat.id}`;
                    return (
                      <li key={cat.id}>
                        <div className="flex items-stretch gap-1">
                          {/* Kategori adi: grid'i o kategoriye filtreler */}
                          <button
                            type="button"
                            onClick={() => handleMobileCategoryClick(cat)}
                            className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left font-bold text-sm text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                            data-testid={`mobile-nav-${cat.id}`}
                          >
                            <span className="text-slate-400">{cat.icon}</span>
                            {cat.label}
                          </button>
                          {/* Ok: kategoriyi acip araclari listeler */}
                          <button
                            type="button"
                            onClick={() => setOpenSection(isOpen ? null : cat.id)}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            aria-label={
                              isEn
                                ? `${isOpen ? "Hide" : "Show"} ${cat.label} tools`
                                : `${cat.label} araçlarını ${isOpen ? "gizle" : "göster"}`
                            }
                            className="px-3 rounded-lg hover:bg-slate-50 text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                            data-testid={`mobile-nav-toggle-${cat.id}`}
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        </div>

                        {isOpen && (
                          <ul id={panelId} className="pl-3 pb-2 space-y-0.5 list-none">
                            {cat.tools.map((tool) => (
                              <li key={tool.href}>
                                <Link href={tool.href} onClick={closeMobile}>
                                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-[13px] font-semibold text-slate-600">
                                    {tool.icon}
                                    <span className="flex-1">{tool.title}</span>
                                    {MAINTENANCE_HREFS.has(tool.href) && (
                                      <span className="text-[9px] font-bold uppercase tracking-wide bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">
                                        {isEn ? "Maint." : "Bakım"}
                                      </span>
                                    )}
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-3 pt-3 border-t space-y-0.5">
                  {[
                    { href: "/about", en: "About Us", tr: "Hakkımızda" },
                    { href: "/contact", en: "Contact", tr: "İletişim" },
                    { href: "/privacy-policy", en: "Privacy Policy", tr: "Gizlilik Politikası" },
                    { href: "/terms", en: "Terms of Service", tr: "Kullanım Şartları" },
                    { href: "/cookie-policy", en: "Cookie Policy", tr: "Çerez Politikası" },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} onClick={closeMobile}>
                      <div className="px-3 py-2 rounded-lg hover:bg-slate-50 text-[13px] font-semibold text-slate-500">
                        {isEn ? item.en : item.tr}
                      </div>
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
