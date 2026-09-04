import { createRequire } from "module";
import { join } from "path";

/**
 * Iletisim formu mesajlarinin kalici deposu.
 *
 * Neden ayri bir modul: /api/contact daha once `(app as any).locals.db`
 * uzerinden yazmaya calisiyordu, ama `app.locals.db` kod tabaninda hicbir
 * yerde atanmiyor. Sonuc olarak her mesaj sessizce kayboluyor, kullaniciya
 * ise "Message received!" donuyordu.
 *
 * `_require` kullanimi bilincli: script/build.ts, `_require(` cagrilarini
 * `require(` olarak yeniden yaziyor ve better-sqlite3 bundle'a dahil
 * edilmeyip calisma aninda node_modules'ten cozuluyor. Ayni kalip
 * routes.ts icinde de kullaniliyor ve uretimde calisiyor.
 *
 * NOT (server/analytics.ts): o modul `(globalThis as any)._require` yaziyor,
 * bu da build sonrasi `globalThis.require` haline geliyor ve CJS'te tanimsiz
 * oldugu icin analytics uretimde sessizce devre disi. Ayni tuzaga dusmemek
 * icin burada modul duzeyinde `_require` kullanildi.
 */
const _require = createRequire(import.meta.url);

/** Varsayilan olarak calisma dizini; kalici disk icin CONTACT_DB_PATH verin. */
const DB_PATH = process.env.CONTACT_DB_PATH || join(process.cwd(), "contact.db");

let db: any = null;
let dbFailed = false;

function getDb(): any | null {
  if (db) return db;
  if (dbFailed) return null;
  try {
    const Database = _require("better-sqlite3");
    const handle = new Database(DB_PATH);
    handle.pragma("journal_mode = WAL");
    handle.exec(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        ip TEXT,
        user_agent TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
      CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_messages(created_at);
    `);
    db = handle;
    return db;
  } catch (err: any) {
    dbFailed = true;
    console.error("[contact-store] SQLite acilamadi:", err?.message);
    return null;
  }
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  ip?: string;
  userAgent?: string;
}

/** Mesaji diske yazar. Basarili olursa satir id'sini, olmazsa null doner. */
export function saveContactMessage(msg: ContactMessage): number | null {
  const handle = getDb();
  if (!handle) return null;
  try {
    const info = handle
      .prepare(
        `INSERT INTO contact_messages (name, email, message, ip, user_agent)
         VALUES (?, ?, ?, ?, ?)`,
      )
      .run(msg.name, msg.email, msg.message, msg.ip ?? null, msg.userAgent ?? null);
    return Number(info.lastInsertRowid);
  } catch (err: any) {
    console.error("[contact-store] yazma hatasi:", err?.message);
    return null;
  }
}

/**
 * CONTACT_WEBHOOK_URL tanimliysa mesaji oraya POST eder (Slack/Discord/Zapier
 * gibi mevcut bir uca baglanabilsin diye). Tanimli degilse hicbir sey yapmaz
 * ve false doner - bu bir hata degildir.
 *
 * Yeni bagimlilik yok: Node 20+ global fetch kullaniliyor.
 */
export async function forwardContactMessage(msg: ContactMessage): Promise<boolean> {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        source: "protoolhub.net/contact",
        name: msg.name,
        email: msg.email,
        message: msg.message,
        received_at: new Date().toISOString(),
        // Slack ve Discord ayni govdeden okuyabilsin diye duz metin de eklendi.
        text: `New ProToolHub contact message\nFrom: ${msg.name} <${msg.email}>\n\n${msg.message}`,
        content: `New ProToolHub contact message\nFrom: ${msg.name} <${msg.email}>\n\n${msg.message}`,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      console.error(`[contact-store] webhook ${res.status}`);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error("[contact-store] webhook hatasi:", err?.name === "AbortError" ? "timeout" : err?.message);
    return false;
  }
}

/** Admin panelinden okumak icin: en yeni mesajlar once. */
export function listContactMessages(limit = 100, offset = 0): any[] {
  const handle = getDb();
  if (!handle) return [];
  try {
    return handle
      .prepare(
        `SELECT id, name, email, message, created_at
         FROM contact_messages ORDER BY id DESC LIMIT ? OFFSET ?`,
      )
      .all(Math.min(Math.max(1, limit), 500), Math.max(0, offset));
  } catch (err: any) {
    console.error("[contact-store] okuma hatasi:", err?.message);
    return [];
  }
}
