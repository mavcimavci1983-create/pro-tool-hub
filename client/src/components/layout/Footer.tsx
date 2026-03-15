import { Link } from "wouter";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  ShieldCheck, 
  Zap, 
  Globe 
} from "lucide-react";
import { useLanguageStore } from "@/lib/languageStore";

export function Footer() {
  const { language } = useLanguageStore();
  
  const content: Record<string, any> = {
    en: {
      about: "Professional-grade online tools for PDF, Video, Image, and Writing. Secure, fast, and 100% free.",
      links: "Quick Links",
      legal: "Legal",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact Us",
      copyright: "Â© 2026 ProToolHub. All rights reserved."
    },
    tr: {
      about: "PDF, Video, Resim ve YazÄ±m iÃ§in profesyonel dÃ¼zeyde Ã§evrimiÃ§i araÃ§lar. GÃ¼venli, hÄ±zlÄ± ve %100 Ã¼cretsiz.",
      links: "HÄ±zlÄ± BaÄŸlantÄ±lar",
      legal: "Yasal",
      privacy: "Gizlilik PolitikasÄ±",
      terms: "KullanÄ±m ÅartlarÄ±",
      contact: "Bize UlaÅŸÄ±n",
      copyright: "Â© 2026 ProToolHub. TÃ¼m haklarÄ± saklÄ±dÄ±r."
    }
  };

  const t = content[language];

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <Zap className="h-6 w-6 text-slate-400" />
              <span className="text-2xl font-bold tracking-tight">ProToolHub</span>
            </div>
            <p className="text-sm leading-relaxed font-medium">
              {t.about}
            </p>
            <div className="flex gap-4">
              <Link href="#"><Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" /></Link>
              <Link href="#"><Linkedin className="w-5 h-5 hover:text-white cursor-pointer transition-colors" /></Link>
              <Link href="#"><Mail className="w-5 h-5 hover:text-white cursor-pointer transition-colors" /></Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">{t.links}</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/tools/merge-pdf" className="hover:text-white transition-colors">Merge PDF</Link></li>
              <li><Link href="/tools/video-to-gif" className="hover:text-white transition-colors">Video to GIF</Link></li>
              <li><Link href="/tools/remove-background" className="hover:text-white transition-colors">Remove Background</Link></li>
              <li><Link href="/tools/essay-writer" className="hover:text-white transition-colors">Essay Writer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">{t.legal}</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">{t.privacy}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t.terms}</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li><li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li><li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Security</h4>
            <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <ShieldCheck className="w-8 h-8 text-slate-400" />
              <div>
                <p className="text-white text-xs font-bold uppercase tracking-tighter">SSL Secure</p>
                <p className="text-[10px] opacity-70">Bank-grade encryption</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 text-center text-xs font-bold tracking-widest uppercase opacity-50">
          {t.copyright}
        </div>
      </div>
    </footer>
  );
}

