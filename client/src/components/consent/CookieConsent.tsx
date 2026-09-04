import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Cookie, X } from "lucide-react";
import { useLanguageStore } from "@/lib/languageStore";
import { useConsentStore } from "@/lib/consentStore";

/**
 * Cerez onayi banner'i.
 *
 * Uygulama kokunde (App.tsx) bir kez render edilir, CanonicalTag ile ayni
 * kalip. Sayfayi KAPATMAZ: sabit alt serit olarak durur, arkasindaki araclar
 * calismaya devam eder. Tarayici icinde calisan araclar (gorsel, video,
 * donusturucu) hicbir onaya bagli degildir.
 *
 * "Reddet" butonu "Kabul et" ile ayni gorunurlukte tutuldu; onay sadece
 * kabul kolaysa gecerli sayilmaz.
 *
 * Metinler Footer.tsx'teki kalibi izleyerek bilesen icinde tutuldu.
 */

const COPY: Record<string, Record<string, string>> = {
  en: {
    title: "Cookies on ProToolHub",
    body: "We use cookies to measure how the site is used and to show ads. Neither is switched on until you choose. The tools themselves work either way — nothing you upload or process depends on this.",
    accept: "Accept all",
    reject: "Reject all",
    customise: "Choose what to allow",
    save: "Save choices",
    close: "Close",
    policy: "Cookie Policy",
    analytics_label: "Analytics",
    analytics_desc: "Google Analytics, so we can see which tools get used. Off until you allow it.",
    ads_label: "Advertising",
    ads_desc: "Lets Google use cookies to select and measure ads. Without it, no advertising cookie is stored.",
    essential_label: "Essential",
    essential_desc: "Needed for the site to work. Your language and this cookie choice are kept in your browser and never sent to us.",
    always_on: "Always on",
  },
  tr: {
    title: "ProToolHub'da çerezler",
    body: "Sitenin nasıl kullanıldığını ölçmek ve reklam göstermek için çerez kullanıyoruz. Siz seçim yapana kadar ikisi de kapalıdır. Araçlar her durumda çalışır — yüklediğiniz veya işlediğiniz hiçbir şey buna bağlı değildir.",
    accept: "Tümünü kabul et",
    reject: "Tümünü reddet",
    customise: "Neye izin vereceğinizi seçin",
    save: "Seçimleri kaydet",
    close: "Kapat",
    policy: "Çerez Politikası",
    analytics_label: "Analitik",
    analytics_desc: "Hangi araçların kullanıldığını görebilmemiz için Google Analytics. İzin verene kadar kapalı.",
    ads_label: "Reklam",
    ads_desc: "Google'ın reklam seçmek ve ölçmek için çerez kullanmasına izin verir. İzin vermezseniz reklam çerezi saklanmaz.",
    essential_label: "Zorunlu",
    essential_desc: "Sitenin çalışması için gerekli. Dil tercihiniz ve bu çerez kararınız tarayıcınızda tutulur, bize gönderilmez.",
    always_on: "Her zaman açık",
  },
};

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 ${
        checked ? "bg-slate-900" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function CookieConsent() {
  const { language } = useLanguageStore();
  const t = COPY[language] ?? COPY.en;

  const choice = useConsentStore((s) => s.choice);
  const isPanelOpen = useConsentStore((s) => s.isPanelOpen);
  const closePanel = useConsentStore((s) => s.closePanel);
  const decide = useConsentStore((s) => s.decide);

  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  // Karar verilmemisse banner ilk ziyarette gorunur; verilmisse yalnizca
  // kullanici footer'dan tercihlerini yeniden actiginda.
  const visible = choice === null || isPanelOpen;

  // Panel yeniden acildiginda mevcut secimleri goster.
  useEffect(() => {
    if (!visible) return;
    setAnalytics(choice?.analytics ?? false);
    setAds(choice?.ads ?? false);
    setExpanded(isPanelOpen && choice !== null);
  }, [visible, isPanelOpen, choice]);

  // Yeniden acilan panelde Escape kapatir. Ilk ziyarette karar verilmedigi
  // icin kapatma yolu yok - Escape orada bir sey yapmaz.
  useEffect(() => {
    if (!visible || choice === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, choice, closePanel]);

  useEffect(() => {
    if (visible) regionRef.current?.focus();
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4 pointer-events-none"
      data-testid="cookie-consent"
    >
      <div
        ref={regionRef}
        role="dialog"
        aria-modal="false"
        aria-label={t.title}
        tabIndex={-1}
        className="pointer-events-auto mx-auto w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 sm:p-6 focus:outline-none"
      >
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-slate-100 rounded-lg shrink-0">
            <Cookie className="w-5 h-5 text-slate-700" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-slate-900 text-base leading-tight">{t.title}</h2>
          </div>
          {choice !== null && (
            <button
              type="button"
              onClick={closePanel}
              aria-label={t.close}
              className="p-1.5 -m-1.5 text-slate-400 hover:text-slate-700 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              data-testid="button-consent-close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4">
          {t.body}{" "}
          <Link href="/cookie-policy" className="underline hover:text-slate-900">
            {t.policy}
          </Link>
        </p>

        {expanded && (
          <div className="space-y-3 mb-5 border-t border-slate-100 pt-4" data-testid="consent-preferences">
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">{t.essential_label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{t.essential_desc}</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 shrink-0 pt-1">
                {t.always_on}
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">{t.analytics_label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{t.analytics_desc}</p>
              </div>
              <Toggle checked={analytics} onChange={setAnalytics} label={t.analytics_label} />
            </div>

            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">{t.ads_label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{t.ads_desc}</p>
              </div>
              <Toggle checked={ads} onChange={setAds} label={t.ads_label} />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => decide({ analytics: true, ads: true })}
            className="flex-1 bg-slate-900 text-white py-2.5 px-5 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
            data-testid="button-consent-accept"
          >
            {t.accept}
          </button>
          <button
            type="button"
            onClick={() => decide({ analytics: false, ads: false })}
            className="flex-1 bg-white text-slate-900 border border-slate-300 py-2.5 px-5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
            data-testid="button-consent-reject"
          >
            {t.reject}
          </button>
          {expanded ? (
            <button
              type="button"
              onClick={() => decide({ analytics, ads })}
              className="flex-1 bg-white text-slate-900 border border-slate-300 py-2.5 px-5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
              data-testid="button-consent-save"
            >
              {t.save}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="flex-1 text-slate-500 py-2.5 px-5 rounded-xl font-bold text-sm hover:text-slate-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
              data-testid="button-consent-customise"
            >
              {t.customise}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
