import { useEffect } from "react";
import { useLocation } from "wouter";

const SITE_ORIGIN = "https://protoolhub.net";

/**
 * Her rota degisiminde <link rel="canonical"> etiketini o sayfanin kendi
 * adresine gunceller.
 *
 * Neden gerekli: index.html icindeki canonical statiktir ve tum SPA rotalarina
 * ayni degeri ("https://protoolhub.net/") verir. Bu, her arac sayfasinin
 * Google'a "benim asli ana sayfadir" demesi anlamina gelir ve sayfalarin
 * yinelenen icerik sayilip dizine eklenmemesine yol acar.
 *
 * Uygulama koku icinde bir kez render edilir.
 */
export function CanonicalTag() {
  const [location] = useLocation();

  useEffect(() => {
    // Sondaki egik cizgiyi tekille: "/" kok icin kalir, digerlerinde silinir.
    const path = location === "/" ? "/" : location.replace(/\/+$/, "");
    const href = `${SITE_ORIGIN}${path}`;

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);

    // og:url ve twitter:url de sayfaya ozel olmali; aksi halde paylasimlar
    // her zaman ana sayfayi gosterir.
    for (const selector of ['meta[property="og:url"]', 'meta[property="twitter:url"]']) {
      const meta = document.querySelector<HTMLMetaElement>(selector);
      if (meta) meta.setAttribute("content", href);
    }
  }, [location]);

  return null;
}
