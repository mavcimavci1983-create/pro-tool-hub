import React, { useState, useMemo, useEffect } from "react";
import { 
  Scissors, VolumeX, Minimize, Music, Play, Download, ImageIcon, Video, Youtube,
  FileText, Type, Presentation, RefreshCw, Zap, Lock, Globe, FileCode, FileJson,
  QrCode, StickyNote, Smile, Clock, Layout, Search, Sparkles, PenTool, ArrowRight,
  BookOpen, User, Heart, Monitor, Hash, Stamp, Shield, Eye, Scan, Languages,
  FileDiff, Wrench, CropIcon, FileSignature, Layers, RotateCw, Merge, Split,
  FileOutput, FileInput, Table, Code, AlignJustify, Unlock, LockOpen
} from "lucide-react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguageStore } from "@/lib/languageStore";
import translationsData from "@/locales/translations.json";

const translations = translationsData as Record<string, any>;

const CATEGORIES = ['PDF', 'Image', 'Video', 'Converter', 'AI Writing', 'Other'];

type PdfSubCategory = "organize" | "convert-from" | "convert-to" | "security";

interface ToolItem {
  title: string;
  titleTr?: string;
  desc: string;
  descTr?: string;
  cat: string;
  pdfSub?: PdfSubCategory;
  icon: React.ReactNode;
  link: string;
}

const tools: ToolItem[] = [
  // ═══════════════════════════════════════════════════════════════════
  // PDF Tools — Organize
  // ═══════════════════════════════════════════════════════════════════
  { title: "Merge PDF", titleTr: "PDF Birleştir", desc: "Combine multiple PDF files into one.", descTr: "Birden fazla PDF dosyasını tek bir belgede birleştirin.", cat: "PDF", pdfSub: "organize", icon: <Layers className="w-5 h-5 text-red-500" />, link: "/tools/merge-pdf" },
  { title: "Split PDF", titleTr: "PDF Ayır", desc: "Separate pages into individual files.", descTr: "PDF sayfalarını ayrı dosyalara bölün.", cat: "PDF", pdfSub: "organize", icon: <Split className="w-5 h-5 text-red-500" />, link: "/tools/split-pdf" },
  { title: "Rotate PDF", titleTr: "PDF Döndür", desc: "Rotate pages to any angle.", descTr: "PDF sayfalarını istediğiniz açıda döndürün.", cat: "PDF", pdfSub: "organize", icon: <RotateCw className="w-5 h-5 text-red-500" />, link: "/tools/rotate-pdf" },
  { title: "Page Numbers", titleTr: "Sayfa Numaraları", desc: "Add page numbers to your PDF.", descTr: "PDF'ye sayfa numaraları ekleyin.", cat: "PDF", pdfSub: "organize", icon: <Hash className="w-5 h-5 text-red-500" />, link: "/tools/page-numbers" },
  { title: "Remove Pages", titleTr: "Sayfa Sil", desc: "Delete unwanted pages from PDF.", descTr: "PDF'den istenmeyen sayfaları silin.", cat: "PDF", pdfSub: "organize", icon: <Scissors className="w-5 h-5 text-red-500" />, link: "/tools/delete-pages" },
  { title: "Reorder Pages", titleTr: "Sayfa Sırala", desc: "Rearrange PDF page order.", descTr: "PDF sayfa sırasını yeniden düzenleyin.", cat: "PDF", pdfSub: "organize", icon: <AlignJustify className="w-5 h-5 text-red-500" />, link: "/tools/reorder-pages" },
  { title: "Edit PDF", titleTr: "PDF Düzenle", desc: "Edit text and images in PDF.", descTr: "PDF'deki metin ve görselleri düzenleyin.", cat: "PDF", pdfSub: "organize", icon: <PenTool className="w-5 h-5 text-red-500" />, link: "/tools/edit-pdf" },
  { title: "Crop PDF", titleTr: "PDF Kırpma", desc: "Crop and resize PDF pages.", descTr: "PDF sayfalarını kırpın ve yeniden boyutlandırın.", cat: "PDF", pdfSub: "organize", icon: <CropIcon className="w-5 h-5 text-red-500" />, link: "/tools/crop-pdf" },
  { title: "Repair PDF", titleTr: "PDF Onar", desc: "Fix corrupted PDF files.", descTr: "Bozulmuş PDF dosyalarını onarın.", cat: "PDF", pdfSub: "organize", icon: <Wrench className="w-5 h-5 text-red-500" />, link: "/tools/repair-pdf" },
  { title: "Flatten PDF", titleTr: "PDF Düzelt", desc: "Flatten forms and annotations.", descTr: "Form ve açıklamaları düzleştirin.", cat: "PDF", pdfSub: "organize", icon: <FileOutput className="w-5 h-5 text-red-500" />, link: "/tools/flatten-pdf" },

  // ═══════════════════════════════════════════════════════════════════
  // PDF Tools — Convert FROM PDF
  // ═══════════════════════════════════════════════════════════════════
  { title: "PDF to Word", titleTr: "PDF → Word", desc: "Convert PDF to editable Word files.", descTr: "PDF'yi düzenlenebilir Word dosyasına çevirin.", cat: "PDF", pdfSub: "convert-from", icon: <FileText className="w-5 h-5 text-blue-600" />, link: "/tools/pdf-to-word" },
  { title: "PDF to Excel", titleTr: "PDF → Excel", desc: "Convert PDF tables to Excel.", descTr: "PDF tablolarını Excel'e dönüştürün.", cat: "PDF", pdfSub: "convert-from", icon: <Table className="w-5 h-5 text-green-600" />, link: "/tools/pdf-to-excel" },
  { title: "PDF to PPT", titleTr: "PDF → PPT", desc: "Convert PDF to PowerPoint.", descTr: "PDF'yi PowerPoint sunumuna çevirin.", cat: "PDF", pdfSub: "convert-from", icon: <Presentation className="w-5 h-5 text-orange-600" />, link: "/tools/pdf-to-powerpoint" },
  { title: "PDF to JPG", titleTr: "PDF → JPG", desc: "Convert PDF pages to images.", descTr: "PDF sayfalarını yüksek kaliteli görsellere çevirin.", cat: "PDF", pdfSub: "convert-from", icon: <ImageIcon className="w-5 h-5 text-pink-500" />, link: "/tools/pdf-to-jpg" },
  { title: "PDF to Text", titleTr: "PDF → Metin", desc: "Extract text from PDF files.", descTr: "PDF dosyalarından metin çıkarın.", cat: "PDF", pdfSub: "convert-from", icon: <FileText className="w-5 h-5 text-orange-500" />, link: "/tools/pdf-to-text" },
  { title: "PDF to PDF/A", titleTr: "PDF → PDF/A", desc: "Convert to archival PDF/A format.", descTr: "Arşiv uyumlu PDF/A formatına dönüştürün.", cat: "PDF", pdfSub: "convert-from", icon: <FileOutput className="w-5 h-5 text-indigo-500" />, link: "/tools/pdf-to-pdfa" },
  { title: "OCR PDF", titleTr: "OCR PDF", desc: "Make scanned PDFs searchable.", descTr: "Taranmış PDF'leri aranabilir hale getirin.", cat: "PDF", pdfSub: "convert-from", icon: <Eye className="w-5 h-5 text-violet-500" />, link: "/tools/ocr-pdf" },

  // ═══════════════════════════════════════════════════════════════════
  // PDF Tools — Convert TO PDF
  // ═══════════════════════════════════════════════════════════════════
  { title: "Word to PDF", titleTr: "Word → PDF", desc: "Convert Word documents to PDF.", descTr: "Word belgelerini PDF'ye dönüştürün.", cat: "PDF", pdfSub: "convert-to", icon: <FileText className="w-5 h-5 text-blue-500" />, link: "/tools/word-to-pdf" },
  { title: "PPT to PDF", titleTr: "PPT → PDF", desc: "Convert PowerPoint to PDF.", descTr: "PowerPoint sunumlarını PDF'ye çevirin.", cat: "PDF", pdfSub: "convert-to", icon: <Presentation className="w-5 h-5 text-orange-500" />, link: "/tools/ppt-to-pdf" },
  { title: "Excel to PDF", titleTr: "Excel → PDF", desc: "Convert Excel spreadsheets to PDF.", descTr: "Excel tablolarını PDF'ye dönüştürün.", cat: "PDF", pdfSub: "convert-to", icon: <Table className="w-5 h-5 text-green-500" />, link: "/tools/excel-to-pdf" },
  { title: "JPG to PDF", titleTr: "JPG → PDF", desc: "Convert images to PDF documents.", descTr: "Görselleri PDF belgesine dönüştürün.", cat: "PDF", pdfSub: "convert-to", icon: <ImageIcon className="w-5 h-5 text-red-500" />, link: "/tools/jpg-to-pdf" },
  { title: "HTML to PDF", titleTr: "HTML → PDF", desc: "Convert web pages to PDF.", descTr: "Web sayfalarını PDF'ye dönüştürün.", cat: "PDF", pdfSub: "convert-to", icon: <Code className="w-5 h-5 text-cyan-500" />, link: "/tools/html-to-pdf" },
  { title: "Scan to PDF", titleTr: "PDF'e Tara", desc: "Scan documents directly to PDF.", descTr: "Belgeleri doğrudan PDF olarak tarayın.", cat: "PDF", pdfSub: "convert-to", icon: <Scan className="w-5 h-5 text-teal-500" />, link: "/tools/scan-to-pdf" },

  // ═══════════════════════════════════════════════════════════════════
  // PDF Tools — Security & Optimize
  // ═══════════════════════════════════════════════════════════════════
  { title: "Compress PDF", titleTr: "PDF Küçült", desc: "Reduce PDF file size.", descTr: "PDF dosya boyutunu küçültün.", cat: "PDF", pdfSub: "security", icon: <Minimize className="w-5 h-5 text-emerald-500" />, link: "/tools/compress-pdf" },
  { title: "Protect PDF", titleTr: "PDF Koru", desc: "Add password protection to PDF.", descTr: "PDF'ye şifre koruması ekleyin.", cat: "PDF", pdfSub: "security", icon: <Lock className="w-5 h-5 text-gray-700" />, link: "/tools/protect-pdf" },
  { title: "Unlock PDF", titleTr: "PDF Kilidi Aç", desc: "Remove PDF password restrictions.", descTr: "PDF şifre kısıtlamalarını kaldırın.", cat: "PDF", pdfSub: "security", icon: <LockOpen className="w-5 h-5 text-rose-500" />, link: "/tools/remove-password" },
  { title: "Add Watermark", titleTr: "Filigran Ekle", desc: "Stamp text or image on PDF.", descTr: "PDF'ye metin veya görüntü filigranı ekleyin.", cat: "PDF", pdfSub: "security", icon: <Stamp className="w-5 h-5 text-indigo-500" />, link: "/tools/add-watermark" },
  { title: "Sign PDF", titleTr: "PDF İmzala", desc: "Add electronic signatures to PDF.", descTr: "PDF'ye elektronik imza ekleyin.", cat: "PDF", pdfSub: "security", icon: <FileSignature className="w-5 h-5 text-purple-500" />, link: "/tools/sign-pdf" },
  { title: "Compare PDF", titleTr: "PDF Karşılaştır", desc: "Compare two PDF documents.", descTr: "İki PDF belgesini karşılaştırın.", cat: "PDF", pdfSub: "security", icon: <FileDiff className="w-5 h-5 text-sky-500" />, link: "/tools/compare-pdf" },
  { title: "Translate PDF", titleTr: "PDF Çevir", desc: "Translate PDF content easily.", descTr: "PDF içeriğini kolayca çevirin.", cat: "PDF", pdfSub: "security", icon: <Languages className="w-5 h-5 text-amber-500" />, link: "/tools/translate-pdf" },

  // ═══════════════════════════════════════════════════════════════════
  // Video Tools
  // ═══════════════════════════════════════════════════════════════════
  { title: "Video to GIF", desc: "Create animated GIF", cat: "Video", icon: <Scissors className="w-5 h-5 text-purple-400" />, link: "/tools/video-to-gif" },
  { title: "Video to MP3", desc: "Extract audio from video", cat: "Video", icon: <Music className="w-5 h-5 text-pink-400" />, link: "/tools/video-to-mp3" },
  { title: "MP4 to WebM", desc: "Convert MP4 to WebM", cat: "Video", icon: <Play className="w-5 h-5 text-blue-400" />, link: "/tools/mp4-to-webm" },
  { title: "Mute Video", desc: "Remove video sound", cat: "Video", icon: <VolumeX className="w-5 h-5 text-gray-500" />, link: "/tools/mute-video" },
  { title: "Video Resizer", desc: "Resize video for social", cat: "Video", icon: <Minimize className="w-5 h-5 text-indigo-400" />, link: "/tools/video-resizer" },
  { title: "Rotate Video", desc: "Fix sideways video", cat: "Video", icon: <RefreshCw className="w-5 h-5 text-sky-400" />, link: "/tools/rotate-video" },
  { title: "Trim Video", desc: "Cut video clips", cat: "Video", icon: <Scissors className="w-5 h-5 text-rose-400" />, link: "/tools/trim-video" },
  { title: "Compress Video", desc: "Reduce video size", cat: "Video", icon: <Minimize className="w-5 h-5 text-emerald-400" />, link: "/tools/compress-video" },
  { title: "Facebook Download", desc: "Download FB videos", cat: "Video", icon: <Download className="w-5 h-5 text-blue-600" />, link: "/tools/facebook-download" },
  { title: "TikTok Downloader", desc: "No watermark TikTok", cat: "Video", icon: <Download className="w-5 h-5 text-pink-600" />, link: "/tools/tiktok-downloader" },
  { title: "Instagram Download", desc: "Save IG reels & videos", cat: "Video", icon: <Download className="w-5 h-5 text-purple-600" />, link: "/tools/instagram-download" },
  { title: "Twitter Download", desc: "Download Twitter videos", cat: "Video", icon: <Download className="w-5 h-5 text-sky-600" />, link: "/tools/twitter-download" },
  { title: "YouTube to Text", desc: "Convert YT to text", cat: "Video", icon: <Youtube className="w-5 h-5 text-red-600" />, link: "/tools/youtube-to-text" },
  { title: "Video to Text", desc: "Transcribe video", cat: "Video", icon: <Type className="w-5 h-5 text-slate-600" />, link: "/tools/video-to-text" },

  // ═══════════════════════════════════════════════════════════════════
  // Image Tools
  // ═══════════════════════════════════════════════════════════════════
  { title: "Image to WebP", desc: "Convert image to WebP", cat: "Image", icon: <ImageIcon className="w-5 h-5 text-emerald-500" />, link: "/tools/image-to-webp" },
  { title: "Remove Background", desc: "AI background remover", cat: "Image", icon: <Zap className="w-5 h-5 text-purple-500" />, link: "/tools/remove-background" },
  { title: "HEIC to JPG", desc: "iPhone photo converter", cat: "Image", icon: <ImageIcon className="w-5 h-5 text-orange-500" />, link: "/tools/heic-to-jpg" },
  { title: "WebP to JPG", desc: "WebP to JPG converter", cat: "Image", icon: <ImageIcon className="w-5 h-5 text-blue-500" />, link: "/tools/webp-to-jpg" },
  { title: "WebP to PNG", desc: "WebP to PNG converter", cat: "Image", icon: <ImageIcon className="w-5 h-5 text-indigo-500" />, link: "/tools/webp-to-png" },
  { title: "Resize Image", desc: "Change image dimensions", cat: "Image", icon: <Minimize className="w-5 h-5 text-indigo-500" />, link: "/tools/resize-image" },
  { title: "Compress Image", desc: "Reduce image size", cat: "Image", icon: <Minimize className="w-5 h-5 text-emerald-500" />, link: "/tools/compress-image" },
  { title: "Crop Image", desc: "Crop photos easily", cat: "Image", icon: <Scissors className="w-5 h-5 text-rose-500" />, link: "/tools/crop-image" },
  { title: "Add Text to Image", desc: "Add text overlays", cat: "Image", icon: <Type className="w-5 h-5 text-slate-500" />, link: "/tools/add-text-to-image" },

  // ═══════════════════════════════════════════════════════════════════
  // Converter Tools
  // ═══════════════════════════════════════════════════════════════════
  { title: "CSV to JSON", desc: "CSV to JSON converter", cat: "Converter", icon: <FileCode className="w-5 h-5 text-amber-500" />, link: "/tools/csv-to-json" },
  { title: "JSON to CSV", desc: "JSON to CSV converter", cat: "Converter", icon: <FileJson className="w-5 h-5 text-blue-500" />, link: "/tools/json-to-csv" },
  { title: "XML to JSON", desc: "XML to JSON converter", cat: "Converter", icon: <FileCode className="w-5 h-5 text-cyan-500" />, link: "/tools/xml-to-json" },

  // ═══════════════════════════════════════════════════════════════════
  // AI Writing Tools
  // ═══════════════════════════════════════════════════════════════════
  { title: "Paragraph Writer", desc: "AI paragraph writing", cat: "AI Writing", icon: <PenTool className="w-5 h-5 text-rose-400" />, link: "/tools/paragraph-writer" },
  { title: "Essay Writer", desc: "AI essay assistant", cat: "AI Writing", icon: <BookOpen className="w-5 h-5 text-orange-400" />, link: "/tools/essay-writer" },
  { title: "Blog Post Idea", desc: "AI blog generator", cat: "AI Writing", icon: <Sparkles className="w-5 h-5 text-yellow-500" />, link: "/tools/blog-post-idea" },
  { title: "Story Generator", desc: "AI creative writing", cat: "AI Writing", icon: <Heart className="w-5 h-5 text-red-400" />, link: "/tools/story-generator" },
  { title: "Instagram Caption", desc: "Social media captions", cat: "AI Writing", icon: <Sparkles className="w-5 h-5 text-pink-500" />, link: "/tools/instagram-caption-generator" },
  { title: "LinkedIn Post", desc: "Professional AI posts", cat: "AI Writing", icon: <User className="w-5 h-5 text-sky-500" />, link: "/tools/linkedin-post-generator" },
  { title: "Content Improver", desc: "AI writing enhancer", cat: "AI Writing", icon: <Zap className="w-5 h-5 text-yellow-500" />, link: "/tools/content-improver" },

  // ═══════════════════════════════════════════════════════════════════
  // Other Tools
  // ═══════════════════════════════════════════════════════════════════
  { title: "QR Generator", desc: "Custom QR codes", cat: "Other", icon: <QrCode className="w-5 h-5 text-slate-900" />, link: "/tools/qr-generator" },
  { title: "Barcode Gen", desc: "Professional barcodes", cat: "Other", icon: <Hash className="w-5 h-5 text-slate-700" />, link: "/tools/barcode-generator" },
  { title: "My IP Address", desc: "Check public IP", cat: "Other", icon: <Globe className="w-5 h-5 text-blue-500" />, link: "/tools/my-ip" },
  { title: "Internet Speed", desc: "Check connection", cat: "Other", icon: <Monitor className="w-5 h-5 text-indigo-500" />, link: "/tools/speed-test" },
];

const PDF_SUB_CATEGORIES: { id: PdfSubCategory; labelEn: string; labelTr: string; color: string; bgColor: string }[] = [
  { id: "organize",     labelEn: "Organize PDF",       labelTr: "PDF Düzenle",           color: "text-red-600",    bgColor: "bg-red-50 border-red-200" },
  { id: "convert-from", labelEn: "Convert FROM PDF",   labelTr: "PDF'den Dönüştür",      color: "text-blue-600",   bgColor: "bg-blue-50 border-blue-200" },
  { id: "convert-to",   labelEn: "Convert TO PDF",     labelTr: "PDF'ye Dönüştür",       color: "text-green-600",  bgColor: "bg-green-50 border-green-200" },
  { id: "security",     labelEn: "Security & Optimize", labelTr: "Güvenlik & Optimizasyon", color: "text-purple-600", bgColor: "bg-purple-50 border-purple-200" },
];

function ToolCard({ tool, t, language }: { tool: ToolItem; t: any; language: string }) {
  const title = language === "tr" && tool.titleTr ? tool.titleTr : tool.title;
  const desc = language === "tr" && tool.descTr ? tool.descTr : tool.desc;

  return (
    <Link href={tool.link}>
      <Card
        data-testid={`card-tool-${tool.link.split("/").pop()}`}
        className="p-5 h-full flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 cursor-pointer border shadow-sm group relative overflow-hidden bg-white"
      >
        <div className="mb-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-primary/5 transition-colors w-fit">
          {tool.icon}
        </div>
        <h3 className="font-bold text-sm mb-1 text-slate-900 group-hover:text-primary transition-colors tracking-tight">
          {title}
        </h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 opacity-60">
          {tool.cat}
        </p>
        <p className="text-[11px] text-slate-500 mb-4 flex-grow font-medium leading-relaxed">
          {desc}
        </p>
        <div className="flex items-center text-primary font-bold text-[10px] group-hover:translate-x-1 transition-transform uppercase tracking-wider">
          {t.common.start_now} <ArrowRight className="ml-1.5 w-3 h-3" />
        </div>
      </Card>
    </Link>
  );
}

function PdfCategorizedGrid({ t, language }: { t: any; language: string }) {
  const isEn = language === "en";
  const pdfTools = tools.filter(tool => tool.cat === "PDF");

  return (
    <div className="space-y-12">
      {PDF_SUB_CATEGORIES.map(sub => {
        const subTools = pdfTools.filter(tool => tool.pdfSub === sub.id);
        if (subTools.length === 0) return null;

        return (
          <div key={sub.id}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-6 ${sub.bgColor} ${sub.color}`}>
              {isEn ? sub.labelEn : sub.labelTr}
              <span className="text-xs opacity-60">({subTools.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {subTools.map((tool, index) => (
                <ToolCard key={`${tool.title}-${index}`} tool={tool} t={t} language={language} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ToolGrid() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState("All Tools");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);

  const filteredTools = useMemo(() => {
    try {
      const filtered = tools.filter(tool => {
        const matchesTab = activeTab === "All Tools" || tool.cat === activeTab;
        const matchesSearch = !searchQuery || 
          tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          tool.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tool.titleTr && tool.titleTr.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (tool.descTr && tool.descTr.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
      });
      console.log(`Filtered ${filtered.length} tools for category: ${activeTab}`);
      return filtered;
    } catch (err) {
      console.error("Filtering error:", err);
      return [];
    }
  }, [activeTab, searchQuery]);

  const tabs = [
    { id: "All Tools", label: t.common.all_tools, icon: <Layout className="w-3.5 h-3.5" /> },
    { id: "PDF", label: "PDF", icon: <FileText className="w-3.5 h-3.5" /> },
    { id: "Image", label: "Image", icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: "Video", label: "Video", icon: <Video className="w-3.5 h-3.5" /> },
    { id: "Converter", label: "Converter", icon: <RefreshCw className="w-3.5 h-3.5" /> },
    { id: "AI Writing", label: "AI Writing", icon: <PenTool className="w-3.5 h-3.5" /> },
    { id: "Other", label: "Other", icon: <Zap className="w-3.5 h-3.5" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500) {
        setVisibleCount(prev => Math.min(prev + 12, filteredTools.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [filteredTools.length]);

  const showPdfCategorized = activeTab === "PDF" && !searchQuery;

  return (
    <div className="w-full">
      <div className="mb-12 max-w-2xl mx-auto relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder={t.home.search_placeholder} 
          className="pl-12 py-6 text-lg rounded-xl border-slate-200 focus-visible:ring-primary/20 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search"
        />
      </div>

      <div className="flex justify-center mb-16 px-4">
        <div className="bg-white border border-slate-100 rounded-full p-1.5 shadow-xl shadow-slate-200/20 flex flex-wrap gap-1 items-center max-w-fit overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-testid={`tab-${tab.id.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => {
                setActiveTab(tab.id);
                setVisibleCount(24);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ring-1 ${
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/30 ring-primary" 
                  : "text-slate-500 hover:bg-slate-50 ring-slate-100"
              }`}
            >
              <span className={activeTab === tab.id ? "text-white" : "text-slate-400"}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {showPdfCategorized ? (
        <PdfCategorizedGrid t={t} language={language} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredTools.slice(0, visibleCount).map((tool, index) => (
            <ToolCard key={`${tool.title}-${index}`} tool={tool} t={t} language={language} />
          ))}
        </div>
      )}
    </div>
  );
}
