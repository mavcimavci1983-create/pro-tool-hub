import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Menu, 
  Moon, 
  Share2, 
  ChevronDown,
  FileText,
  Image as ImageIcon,
  PenTool,
  Video,
  File
} from "lucide-react";

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

        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/">
            <span className="flex items-center gap-1 text-sm font-medium cursor-pointer hover:text-primary transition-colors">
              PDF <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </span>
          </Link>
          <Link href="/">
            <span className="flex items-center gap-1 text-sm font-medium cursor-pointer hover:text-primary transition-colors">
              Image <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </span>
          </Link>
          <Link href="/">
            <span className="flex items-center gap-1 text-sm font-medium cursor-pointer hover:text-primary transition-colors">
              Write <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </span>
          </Link>
          <Link href="/">
            <span className="flex items-center gap-1 text-sm font-medium cursor-pointer hover:text-primary transition-colors">
              Video <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </span>
          </Link>
          <Link href="/">
            <span className="flex items-center gap-1 text-sm font-medium cursor-pointer hover:text-primary transition-colors">
              File <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </span>
          </Link>
        </nav>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="hidden md:flex relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search" 
              className="w-full bg-muted/50 border-none pl-9 rounded-full focus-visible:ring-1"
            />
          </div>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex rounded-full text-muted-foreground">
            <Moon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex rounded-full text-muted-foreground">
            <Share2 className="h-5 w-5" />
          </Button>
          <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white font-semibold">
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