import express, { type Express, type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_ORIGIN = "https://protoolhub.net";

/**
 * Bilinen rotalarin kaynagi: dist/public/sitemap.xml
 *
 * Sitemap zaten aktif rotalarin tek listesi ve build ciktisinda hazir duruyor.
 * Ayri bir liste tutmak, App.tsx ile senkron kalmayan ikinci bir gercek kaynagi
 * dogururdu. Sitemap okunamazsa fonksiyon bos set doner ve asagidaki mantik
 * eski davranisa (her sey icin 200 + index.html) geri duser - yani hata
 * durumunda calisan sayfalar bozulmaz.
 */
function readKnownRoutes(distPath: string): Set<string> {
  const routes = new Set<string>();
  try {
    const xml = fs.readFileSync(path.join(distPath, "sitemap.xml"), "utf8");
    const re = /<loc>\s*https:\/\/protoolhub\.net([^<\s]*)\s*<\/loc>/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(xml)) !== null) {
      routes.add(normalizePath(m[1] || "/"));
    }
  } catch {
    // sitemap yoksa fallback: bos set
  }
  return routes;
}

/** Sondaki egik cizgiyi tekille. "/" kok icin korunur. */
function normalizePath(p: string): string {
  if (!p.startsWith("/")) p = "/" + p;
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p === "" ? "/" : p;
}

/**
 * Ham HTML'e sayfaya ozel canonical ve og:url/twitter:url yazar.
 *
 * Neden sunucu tarafinda: Google, canonical'in ham HTML yanitinda,
 * JavaScript'in render edecegi degerle ayni olmasini oneriyor. Statik bir
 * root canonical'i tarayicida JS ile degistirmek, render oncesi ve sonrasi
 * celisen sinyal uretiyor ve sayfalarin ana sayfanin kopyasi sayilmasina
 * yol acabiliyor.
 *
 * CanonicalTag.tsx tarayici tarafinda ayni degeri uretmeye devam eder;
 * ikisi cakismaz, SPA ici gezinmede etiketi guncel tutar.
 */
function withCanonical(html: string, canonicalUrl: string): string {
  return html
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/?>/i,
      `<link rel="canonical" href="${canonicalUrl}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${canonicalUrl}" />`,
    )
    .replace(
      /<meta property="twitter:url" content="[^"]*"\s*\/?>/i,
      `<meta property="twitter:url" content="${canonicalUrl}" />`,
    );
}

/** Kaldirilmis/bilinmeyen sayfalarin dizine eklenmesini engeller. */
function withNoIndex(html: string): string {
  return html.replace(
    /<head>/i,
    '<head>\n    <meta name="robots" content="noindex, follow" />',
  );
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  const indexPath = path.resolve(distPath, "index.html");
  const baseHtml = fs.readFileSync(indexPath, "utf8");
  const knownRoutes = readKnownRoutes(distPath);

  console.log(
    `[static] ${knownRoutes.size} bilinen rota yuklendi (kaynak: sitemap.xml)`,
  );

  const sendHtml = (res: Response, status: number, html: string) => {
    res.status(status).type("html").send(html);
  };

  app.get("/{*path}", (req: Request, res: Response) => {
    // ── /admin ve alt yollari: onceki davranis aynen korunur ──────────────
    // "/admin" tam eslesmesi pratikte buraya ulasmaz; routes.ts onu daha once
    // yakalayip admin panelini sunuyor. Bu blok, admin yollarinin asagidaki
    // SEO mantigina (410 / 404 / noindex / canonical) hic girmemesini garanti
    // eder; admin routing veya auth mekanizmasina dokunulmaz.
    if (req.path === "/admin" || req.path.startsWith("/admin/")) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
      if (req.path === "/admin") {
        return res.status(404).type("text/plain").send("Not found");
      }
      return res.sendFile(indexPath);
    }

    // req.path query string icermez - canonical'a sorgu parametresi girmez.
    const routePath = normalizePath(req.path);
    const canonicalUrl = `${SITE_ORIGIN}${routePath === "/" ? "/" : routePath}`;

    // Sitemap okunamadiysa eski davranisa don: her sey 200 + index.html
    if (knownRoutes.size === 0) {
      return sendHtml(res, 200, withCanonical(baseHtml, canonicalUrl));
    }

    if (knownRoutes.has(routePath)) {
      return sendHtml(res, 200, withCanonical(baseHtml, canonicalUrl));
    }

    // Kaldirilmis arac sayfalari: 410 Gone.
    // 404'e gore Google index'ten belirgin sekilde daha hizli dusuruyor.
    if (routePath.startsWith("/tools/")) {
      return sendHtml(res, 410, withNoIndex(withCanonical(baseHtml, canonicalUrl)));
    }

    // Diger bilinmeyen adresler: gercek 404 (SPA NotFound sayfasini render eder)
    return sendHtml(res, 404, withNoIndex(withCanonical(baseHtml, canonicalUrl)));
  });
}
