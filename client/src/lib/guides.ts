import { GUIDES, type Guide } from "@/data/resources";

/**
 * Rehber arama yardimcilari.
 *
 * Arac -> rehber eslesmesi ELDE YAZILMAZ: her rehberin `relatedTools` listesi
 * ters cevrilerek uretilir. Boylece tek bir gercek kaynak vardir ve bir rehbere
 * arac eklendiginde arac sayfasindaki "Helpful Guides" bolumu kendiliginde
 * guncellenir; iki liste birbirinden kayamaz.
 */

export const GUIDES_BY_SLUG: Record<string, Guide> = Object.fromEntries(
  GUIDES.map((g) => [g.slug, g]),
);

export function getGuide(slug: string | undefined): Guide | null {
  if (!slug) return null;
  return GUIDES_BY_SLUG[slug] ?? null;
}

/** Ters indeks: arac yolu -> o araci anan rehberler. */
const GUIDES_BY_TOOL: Record<string, Guide[]> = (() => {
  const map: Record<string, Guide[]> = {};
  for (const guide of GUIDES) {
    for (const tool of guide.relatedTools) {
      (map[tool.href] ??= []).push(guide);
    }
  }
  return map;
})();

/**
 * Bir arac sayfasi icin gercekten ilgili rehberler.
 *
 * `max` ile sinirlanir - arac sayfasinin altina uzun bir link listesi
 * koymuyoruz; birkac gercek baglanti yeterli.
 */
export function guidesForTool(toolHref: string, max = 3): Guide[] {
  return (GUIDES_BY_TOOL[toolHref] ?? []).slice(0, max);
}

/** Rehber sayfalarinda gosterilen "ilgili rehberler". */
export function relatedGuides(guide: Guide, max = 3): Guide[] {
  return guide.relatedGuides
    .map((slug) => GUIDES_BY_SLUG[slug])
    .filter((g): g is Guide => Boolean(g))
    .slice(0, max);
}

export const GUIDE_CATEGORY_ORDER: Guide["category"][] = ["PDF", "Images", "Video", "How it works"];

export function guidesByCategory(): { category: Guide["category"]; guides: Guide[] }[] {
  return GUIDE_CATEGORY_ORDER.map((category) => ({
    category,
    guides: GUIDES.filter((g) => g.category === category),
  })).filter((group) => group.guides.length > 0);
}
