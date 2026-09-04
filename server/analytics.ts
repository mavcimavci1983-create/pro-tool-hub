import { createRequire } from "module";
import { join } from "path";

/**
 * `_require` kullanimi bilincli, ayni kalip routes.ts ve contact-store.ts
 * icinde de var: script/build.ts `_require(` cagrilarini `require(` olarak
 * yeniden yaziyor ve better-sqlite3 bundle'a girmeyip calisma aninda
 * node_modules'ten cozuluyor.
 *
 * Onceden burada `(globalThis as any)._require(...)` yaziyordu. Build sonrasi
 * bu `globalThis.require(...)` haline geliyordu; `require` CJS'te modul yerel
 * bir degisken olup globalThis uzerinde bulunmadigi icin cagri her seferinde
 * TypeError firlatiyor, asagidaki try/catch bunu yutuyordu. Sonuc: uretimde
 * hicbir olay kaydedilmiyordu.
 */
const _require = createRequire(import.meta.url);

/**
 * Varsayilan olarak calisma dizini; kalici disk icin ANALYTICS_DB_PATH verin.
 * Docker imajinda WORKDIR /app oldugu icin varsayilan uretimde
 * /app/analytics.db olarak cozulur - yani mevcut davranis aynen korunur.
 * contact-store.ts icindeki CONTACT_DB_PATH ile ayni kalip.
 */
const DB_PATH = process.env.ANALYTICS_DB_PATH || join(process.cwd(), "analytics.db");

let db: any = null;

function getDb() {
  if (db) return db;
  const Database = _require("better-sqlite3");
  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site TEXT NOT NULL,
      event_type TEXT NOT NULL,
      tool TEXT,
      platform TEXT,
      extra TEXT,
      ip TEXT,
      user_agent TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
    CREATE INDEX IF NOT EXISTS idx_events_tool ON events(tool);
    CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
    CREATE TABLE IF NOT EXISTS ad_clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site TEXT NOT NULL,
      ad_slot TEXT NOT NULL,
      ip TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );
    CREATE INDEX IF NOT EXISTS idx_ad_clicks_created_at ON ad_clicks(created_at);
  `);
  return db;
}

export function trackEvent(opts: {
  site: string; event_type: "page_view"|"tool_click"|"tool_use"|"download"|"ad_impression";
  tool?: string; platform?: string; extra?: string; ip?: string; user_agent?: string;
}) {
  try {
    getDb().prepare(`INSERT INTO events (site,event_type,tool,platform,extra,ip,user_agent) VALUES (?,?,?,?,?,?,?)`)
      .run(opts.site, opts.event_type, opts.tool??null, opts.platform??null, opts.extra??null, opts.ip??null, opts.user_agent??null);
  } catch(e) { console.error("[analytics] track error:", e); }
}

export function trackAdClick(opts: { site: string; ad_slot: string; ip?: string }) {
  try {
    getDb().prepare(`INSERT INTO ad_clicks (site,ad_slot,ip) VALUES (?,?,?)`)
      .run(opts.site, opts.ad_slot, opts.ip??null);
  } catch(e) { console.error("[analytics] ad click error:", e); }
}

export function getStats() {
  try {
    const db = getDb();
    const now = Math.floor(Date.now()/1000);
    const todayStart = now - (now % 86400);
    const weekAgo = now - 7*86400;
    const monthAgo = now - 30*86400;
    return {
      summary: {
        totalPageViews: db.prepare(`SELECT COUNT(*) as c FROM events WHERE event_type='page_view'`).get().c,
        totalToolUses: db.prepare(`SELECT COUNT(*) as c FROM events WHERE event_type='tool_use'`).get().c,
        totalDownloads: db.prepare(`SELECT COUNT(*) as c FROM events WHERE event_type='download'`).get().c,
        totalAdClicks: db.prepare(`SELECT COUNT(*) as c FROM ad_clicks`).get().c,
        todayViews: db.prepare(`SELECT COUNT(*) as c FROM events WHERE event_type='page_view' AND created_at>=?`).get(todayStart).c,
        todayUses: db.prepare(`SELECT COUNT(*) as c FROM events WHERE event_type='tool_use' AND created_at>=?`).get(todayStart).c,
        todayDownloads: db.prepare(`SELECT COUNT(*) as c FROM events WHERE event_type='download' AND created_at>=?`).get(todayStart).c,
      },
      dailyViews: db.prepare(`SELECT date(created_at,'unixepoch') as day, COUNT(*) as count FROM events WHERE event_type='page_view' AND created_at>=? GROUP BY day ORDER BY day`).all(monthAgo),
      dailyUses: db.prepare(`SELECT date(created_at,'unixepoch') as day, COUNT(*) as count FROM events WHERE event_type='tool_use' AND created_at>=? GROUP BY day ORDER BY day`).all(monthAgo),
      topTools: db.prepare(`SELECT tool, COUNT(*) as count FROM events WHERE event_type='tool_use' AND tool IS NOT NULL AND created_at>=? GROUP BY tool ORDER BY count DESC LIMIT 20`).all(monthAgo),
      siteStats: db.prepare(`SELECT site, event_type, COUNT(*) as count FROM events WHERE created_at>=? GROUP BY site, event_type`).all(monthAgo),
      hourlyToday: db.prepare(`SELECT strftime('%H',created_at,'unixepoch') as hour, COUNT(*) as count FROM events WHERE created_at>=? GROUP BY hour ORDER BY hour`).all(todayStart),
      adStats: db.prepare(`SELECT ad_slot, site, COUNT(*) as count FROM ad_clicks WHERE created_at>=? GROUP BY ad_slot, site ORDER BY count DESC`).all(monthAgo),
      weeklyDownloads: db.prepare(`SELECT date(created_at,'unixepoch') as day, platform, COUNT(*) as count FROM events WHERE event_type='download' AND created_at>=? GROUP BY day, platform ORDER BY day`).all(weekAgo),
    };
  } catch(e) { console.error("[analytics] getStats error:", e); return null; }
}