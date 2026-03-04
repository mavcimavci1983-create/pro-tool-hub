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
  Scissors
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Featured Tools</h4>
                      <div className="space-y-4">
                        {pdfTools.featured.map((tool) => (
                          <Link key={tool.title} href={tool.href}>
                            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors group">
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
                      <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Other PDF Tools</h4>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-8">
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
            </NavigationMenuList>
          </NavigationMenu>
          
          <Link href="/">
            <span className="flex items-center gap-1 text-sm font-medium cursor-pointer px-3 py-2 rounded-md hover:bg-muted transition-colors">
              Image <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </span>
          </Link>
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

import { Input } from "@/components/ui/button"; // Bu yanlış import, Header'da Button kullanılıyor ama Input için ayrı bileşen lazım. Header.tsx içinde Input zaten kullanılıyordu. Fix: import { Input } from "@/components/ui/input";
