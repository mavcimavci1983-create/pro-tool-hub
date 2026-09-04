import { create } from 'zustand';

/**
 * Cerez onayi durumu.
 *
 * Google Consent Mode v2 ile calisir. Varsayilan "denied" durumu
 * client/index.html icindeki inline script tarafindan, herhangi bir Google
 * etiketi yuklenmeden ONCE ilan edilir. Buradaki kod yalnizca kullanici bir
 * karar verdiginde o durumu gunceller.
 *
 * Neden iki farkli davranis var:
 *   - AdSense etiketi her sayfada yuklenir ama "denied" durumunda calisir.
 *     Etiketin sayfada bulunmasi AdSense site dogrulamasi ve Google'in kendi
 *     Privacy & Messaging (sertifikali CMP) banner'inin teslimi icin gerekli;
 *     reklam cerezi ise ad_storage granted olmadan yazilmaz.
 *   - Google Analytics etiketi onay verilene kadar SAYFAYA HIC EKLENMEZ.
 *     Analitik icin dogrulama gereksinimi yok, bu yuzden en katı yol secildi.
 *
 * Karar localStorage'da tutulur; cerez degildir ve cihazdan disari cikmaz.
 * languageStore.ts ile ayni kalip.
 */

export const CONSENT_STORAGE_KEY = 'protoolhub_consent';

/** Kayitli karar semasi degisirse artir - eski kayitlar yok sayilir. */
export const CONSENT_VERSION = 1;

const GA_MEASUREMENT_ID = 'G-5S6SYQ3WPV';

export interface ConsentChoice {
  version: number;
  /** Google Analytics */
  analytics: boolean;
  /** AdSense reklam cerezleri ve kisisellestirme */
  ads: boolean;
  /** ISO 8601 - kararin ne zaman verildigi */
  decidedAt: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readStoredConsent(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    if (parsed?.version !== CONSENT_VERSION) return null;
    if (typeof parsed.analytics !== 'boolean' || typeof parsed.ads !== 'boolean') return null;
    return {
      version: CONSENT_VERSION,
      analytics: parsed.analytics,
      ads: parsed.ads,
      decidedAt: typeof parsed.decidedAt === 'string' ? parsed.decidedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * Consent Mode v2 sinyalini gunceller.
 *
 * gtag fonksiyonu index.html icinde tanimlanir ve global olur. Burada
 * dataLayer'a dogrudan push YAPILMAZ: gtag.js `arguments` nesnesi bekler,
 * duz dizi ayni sekilde islenmez.
 */
function pushConsentUpdate(choice: ConsentChoice): void {
  const ads = choice.ads ? 'granted' : 'denied';
  const analytics = choice.analytics ? 'granted' : 'denied';
  window.gtag?.('consent', 'update', {
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
    analytics_storage: analytics,
  });
}

let gaInjected = false;

/** Analytics onayi verildiyse gtag.js'i bir kez sayfaya ekler. */
function loadAnalytics(): void {
  if (gaInjected) return;
  const src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  if (document.querySelector(`script[src="${src}"]`)) {
    gaInjected = true;
    return;
  }
  gaInjected = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
  window.gtag?.('js', new Date());
  window.gtag?.('config', GA_MEASUREMENT_ID);
}

/** Karari uygular: Google'a sinyali gonderir, gerekiyorsa GA'yi yukler. */
export function applyConsent(choice: ConsentChoice): void {
  pushConsentUpdate(choice);
  if (choice.analytics) loadAnalytics();
}

function persist(choice: ConsentChoice): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(choice));
  } catch {
    // Ozel sekme veya kapali depolama: karar bu oturum icin gecerli kalir,
    // bir sonraki ziyarette banner tekrar gosterilir. Onay yokmus gibi
    // davranmak, onay varmis gibi davranmaktan daha guvenli.
  }
}

interface ConsentState {
  /** null = kullanici henuz karar vermedi */
  choice: ConsentChoice | null;
  /** Tercih panelinin acik olup olmadigi (footer'dan yeniden acilabilir) */
  isPanelOpen: boolean;
  decide: (opts: { analytics: boolean; ads: boolean }) => void;
  openPanel: () => void;
  closePanel: () => void;
}

const initialChoice = ((): ConsentChoice | null => {
  try {
    return readStoredConsent();
  } catch {
    return null;
  }
})();

export const useConsentStore = create<ConsentState>((set) => ({
  choice: initialChoice,
  isPanelOpen: false,
  decide: ({ analytics, ads }) => {
    const choice: ConsentChoice = {
      version: CONSENT_VERSION,
      analytics,
      ads,
      decidedAt: new Date().toISOString(),
    };
    persist(choice);
    applyConsent(choice);
    set({ choice, isPanelOpen: false });
  },
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
}));
