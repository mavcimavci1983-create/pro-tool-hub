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
  Crop,
  Layers,
  Eraser,
  Wand2,
  Brush,
  Palette,
  RotateCw,
  Square,
  Circle
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
    { title: "Edit PDF", desc: "Free PDF Editor", icon: <FileEdit className="w-5 h-5 text-blue-500" />, href: "/tools/edit-pdf" },
    { title: "PDF to Word", desc: "Convert a PDF to Word Document", icon: <FileText className="w-5 h-5 text-blue-400" />, href: "/tools/pdf-to-word" },
    { title: "JPG to PDF", desc: "Upload images and receive as a PDF", icon: <ImageIcon className="w-5 h-5 text-emerald-500" />, href: "/tools/jpg-to-pdf" },
    { title: "Merge PDF", desc: "Merge 2 or more PDF files", icon: <FileStack className="w-5 h-5 text-rose-500" />, href: "/tools/merge-pdf" },
  ],
  others: [
    { title: "Create PDF", href: "/tools/create-pdf" },
    { title: "PDF to JPG", href: "/tools/pdf-to-jpg" },
    { title: "Compress PDF", href: "/tools/compress-pdf" },
    { title: "Word to PDF", href: "/tools/word-to-pdf" },
    { title: "Split", href: "/tools/split-pdf" },
    { title: "Remove Password", href: "/tools/remove-password" },
    { title: "PDF Translator", href: "/tools/pdf-translator" },
    { title: "eSign", href: "/tools/esign" },
    { title: "Protect", href: "/tools/protect-pdf" },
    { title: "Rearrange", href: "/tools/rearrange-pdf" },
    { title: "Extract Text", href: "/tools/extract-text" },
  ]
};

const imageTools = {
  ai: [
    { title: "Background Remover", desc: "Easily Remove the Background", icon: <Eraser className="w-5 h-5 text-orange-500" />, href: "/tools/remove-background" },
    { title: "Restore Photos", desc: "Restore old photos with AI", icon: <Wand2 className="w-5 h-5 text-purple-500" />, href: "/tools/restore-photos" },
    { title: "Profile Photo Maker", desc: "Create professional avatars", icon: <ImageIcon className="w-5 h-5 text-blue-500" />, href: "/tools/profile-photo-maker" },
    { title: "Remove Person", desc: "Erase people from photos", icon: <Brush className="w-5 h-5 text-rose-500" />, href: "/tools/remove-person" },
    { title: "Extract Text", desc: "OCR text from image", icon: <Type className="w-5 h-5 text-teal-500" />, href: "/tools/extract-text-image" },
    { title: "AI Image Generator", desc: "Text to image AI", icon: <Sparkles className="w-5 h-5 text-yellow-500" />, href: "/tools/ai-generator" },
  ],
  featured: [
    { title: "Resize Dimensions", desc: "Resize your image", icon: <Maximize2 className="w-5 h-5 text-blue-600" />, href: "/tools/resize-image" },
    { title: "Compress", desc: "Compress your image", icon: <Minimize2 className="w-5 h-5 text-emerald-600" />, href: "/tools/compress-image" },
    { title: "Increase Resolution", desc: "Upscale your images", icon: <Layers className="w-5 h-5 text-purple-600" />, href: "/tools/upscale-image" },
  ],
  others: [
    { title: "Blur Background", href: "/tools/blur-background" },
    { title: "Transparent Background", href: "/tools/transparent-background" },
    { title: "Make Round Image", href: "/tools/round-image" },
    { title: "Colorize Photo", href: "/tools/colorize-photo" },
    { title: "Crop Image", href: "/tools/crop-image" },
    { title: "Black & White", href: "/tools/black-white" },
    { title: "Combine Images", href: "/tools/combine-images" },
    { title: "Add Border", href: "/tools/add-border" },
    { title: "Flip Image", href: "/tools/flip-image" },
    { title: "Collage Maker", href: "/tools/collage-maker" },
    { title: "Image Splitter", href: "/tools/image-splitter" },
    { title: "Unblur IMG", href: "/tools/unblur-image" },
    { title: "Remove Watermark", href: "/tools/remove-watermark" },
    { title: "Add Text to Image", href: "/tools/add-text-image" },
    { title: "HEIC to JPG", href: "/tools/heic-to-jpg" },
  ]
};

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Menu className="h-5 w-5" />
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

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-muted font-medium text-sm px-3">
                  Image
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-[250px_1fr] p-0 bg-white rounded-xl shadow-2xl min-w-[800px] overflow-hidden">
                    <div className="bg-slate-50 p-6 border-r">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 text-left">AI Tools</h4>
                      <div className="space-y-4 text-left">
                        {imageTools.ai.map((tool) => (
                          <Link key={tool.title} href={tool.href}>
                            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white hover:shadow-sm cursor-pointer transition-all group">
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
                    <div className="p-6">
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 text-left">Featured Tools</h4>
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        {imageTools.featured.map((tool) => (
                          <Link key={tool.title} href={tool.href}>
                            <div className="p-4 rounded-xl border border-transparent hover:border-primary/20 hover:bg-primary/5 cursor-pointer transition-all group text-center">
                              <div className="flex justify-center mb-3 text-primary">{tool.icon}</div>
                              <div className="text-sm font-bold group-hover:text-primary mb-1">{tool.title}</div>
                              <div className="text-[11px] text-muted-foreground">{tool.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 text-left">Other Image Tools</h4>
                      <div className="grid grid-cols-3 gap-y-3 gap-x-8 text-left">
                        {imageTools.others.map((tool) => (
                          <Link key={tool.title} href={tool.href}>
                            <span className="text-[13px] font-medium text-foreground hover:text-primary cursor-pointer transition-colors block">
                              {tool.title}
                            </span>
                          </Link>
                        ))}
                        <Link href="/tools/all-image">
                          <span className="text-[13px] font-bold text-primary hover:underline cursor-pointer">All Image Tools</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Link href="/">
            <span className="flex items-center gap-1 text-sm font-medium cursor-pointer px-3 py-2 rounded-md hover:bg-muted transition-colors">
              Write <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </span>
          </Link>
          <Link href="/">
            <span className="flex items-center gap-1 text-sm font-medium cursor-pointer px-3 py-2 rounded-md hover:bg-muted transition-colors">
              Video <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </span>
          </Link>
          <Link href="/">
            <span className="flex items-center gap-1 text-sm font-medium cursor-pointer px-3 py-2 rounded-md hover:bg-muted transition-colors">
              File <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </span>
          </Link>
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
      
      {/* Ad Placeholder Header */}
      <div className="w-full bg-muted/30 border-t py-2 text-center text-xs text-muted-foreground">
        <div className="container mx-auto max-w-3xl h-12 border border-dashed border-muted-foreground/30 bg-muted/10 flex items-center justify-center rounded">
          Advertisement Placeholder (728x90)
        </div>
      </div>
    </header>
  );
}

import { Sparkles } from "lucide-react";
