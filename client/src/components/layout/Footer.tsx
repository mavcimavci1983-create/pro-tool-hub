import { Link } from "wouter";
import { 
  Github, 
  Mail, 
  ShieldCheck, 
  Zap, 
  Globe 
} from "lucide-react";
import { useLanguageStore } from "@/lib/languageStore";
import { useConsentStore } from "@/lib/consentStore";
import { tools } from "@/components/home/ToolGrid";
import translationsData from "@/locales/translations.json";

const translations = translationsData as Record<string, any>;

/**
 * Footer'daki kategori sutunlari.
 * Linkler ToolGrid'deki `tools` dizisinden uretilir - sabit yazilmaz.
 * Kategori basina ilk 5 arac gosterilir; 47 aracin tamamini listeleyip
 * footer'i sisirmemek icin sinirli tutuldu.
 */
const FOOTER_CATEGORIES = [
  { cat: "PDF", labelKey: "footer_pdf" },
  { cat: "Image", labelKey: "footer_image" },
  { cat: "Video", labelKey: "footer_video" },
  { cat: "Converter", labelKey: "footer_converter" },
  { cat: "AI Writing", labelKey: "footer_ai" },
];
const FOOTER_LINKS_PER_CATEGORY = 5;

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
      guides: "Guides",
      cookieSettings: "Cookie Settings",
      copyright: "© 2026 ProToolHub. All rights reserved."
    },
    tr: {
      about: "PDF, Video, Resim ve Yazım için profesyonel düzeyde çevrimiçi araçlar. Güvenli, hızlı ve %100 ücretsiz.",
      links: "Hızlı Bağlantılar",
      legal: "Yasal",
      privacy: "Gizlilik Politikası",
      terms: "Kullanım Şartları",
      contact: "Bize Ulaşın",
      guides: "Rehberler",
      cookieSettings: "Çerez Ayarları",
      copyright: "© 2026 ProToolHub. Tüm hakları saklıdır."
    }
  };

  const openConsentPanel = useConsentStore((s) => s.openPanel);

  const t = content[language];
  const th = translations[language]?.home ?? translations.en.home;

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8 lg:gap-6 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <Zap className="h-6 w-6 text-slate-400" />
              <span className="text-2xl font-bold tracking-tight">ProToolHub</span>
            </div>
            <p className="text-sm leading-relaxed font-medium">
              {t.about}
            </p>
            {/* Twitter ve LinkedIn ikonlari kaldirildi: her ikisi de href="#"
                gosteriyordu, yani her sayfada hicbir yere gitmeyen iki bagalanti
                vardi. Gercek hesaplar acildiginda buraya geri eklenebilir.
                E-posta adresi ise gercekten yapilandirilmis (Contact sayfasi ve
                /api/contact geri donus mesaji ayni adresi kullaniyor). */}
            <a
              href="mailto:hello@protoolhub.net"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-white transition-colors"
              data-testid="link-footer-email"
            >
              <Mail className="w-5 h-5" />
              hello@protoolhub.net
            </a>
          </div>

          {FOOTER_CATEGORIES.map(({ cat, labelKey }) => {
            const catTools = tools
              .filter((tool) => tool.cat === cat)
              .slice(0, FOOTER_LINKS_PER_CATEGORY);
            if (catTools.length === 0) return null;

            return (
              <div key={cat} data-testid={`footer-cat-${cat.toLowerCase().replace(/\s+/g, "-")}`}>
                <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
                  {th[labelKey]}
                </h4>
                <ul className="space-y-4 text-sm font-medium">
                  {catTools.map((tool) => (
                    <li key={tool.link}>
                      <Link href={tool.link} className="hover:text-white transition-colors">
                        {language === "tr" && tool.titleTr ? tool.titleTr : tool.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">{t.legal}</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">{t.privacy}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t.terms}</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li><li><Link href="/resources" className="hover:text-white transition-colors" data-testid="link-footer-resources">{t.guides}</Link></li><li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li><li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li><li><button type="button" onClick={openConsentPanel} className="hover:text-white transition-colors text-left" data-testid="button-cookie-settings">{t.cookieSettings}</button></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Security</h4>
            <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <ShieldCheck className="w-8 h-8 text-slate-400" />
              <div>
                <p className="text-white text-xs font-bold uppercase tracking-tighter">SSL Secure</p>
                <p className="text-[10px] opacity-70">HTTPS on every page</p>
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

