import type { Express } from "express";
import { type Server } from "http";
import multer from "multer";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import * as XLSX from "xlsx";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  saveContactMessage,
  forwardContactMessage,
  listContactMessages,
} from "./contact-store";
const _require = createRequire(import.meta.url);
const pdfParse = _require("pdf-parse/lib/pdf-parse.js");
const { PDFDocument, rgb, StandardFonts, degrees } = _require("pdf-lib");

const __routes_filename = fileURLToPath(import.meta.url);
const __routes_dirname = dirname(__routes_filename);

function resolveFontPath(fileName: string): string | null {
  const fs = _require("fs");
  const candidates = [
    join(__routes_dirname, "fonts", fileName),
    join(__routes_dirname, "..", "server", "fonts", fileName),
    join(process.cwd(), "dist", "fonts", fileName),
    join(process.cwd(), "server", "fonts", fileName),
    `/usr/share/fonts/truetype/dejavu/${fileName}`,
    `/usr/share/fonts/TTF/${fileName}`,
    `/usr/share/fonts/dejavu/${fileName}`,
  ];
  for (const p of candidates) {
    try { if (fs.existsSync(p)) return p; } catch {}
  }
  return null;
}

let pdfjsLib: any = null;

async function loadPdfjsServer() {
  if (!pdfjsLib) {
    pdfjsLib = _require("pdfjs-dist/legacy/build/pdf.js");
  }
  return { pdfjsLib };
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted"));
    }
  },
});

const uploadMulti = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, files: 20 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted"));
    }
  },
});

function textToParagraphs(rawText: string): Paragraph[] {
  const lines = rawText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const paragraphs: Paragraph[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      paragraphs.push(new Paragraph({ text: "" }));
      continue;
    }
    const isHeading =
      trimmed === trimmed.toUpperCase() &&
      trimmed.length <= 60 &&
      /[A-ZÇĞİÖŞÜ]/.test(trimmed);

    if (isHeading) {
      paragraphs.push(new Paragraph({ text: trimmed, heading: HeadingLevel.HEADING_2 }));
    } else {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          children: [new TextRun({ text: trimmed, size: 24, font: "Calibri" })],
        })
      );
    }
  }
  return paragraphs;
}

function textToSheetData(rawText: string): (string | number)[][] {
  const lines = rawText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return lines.map((line) => {
    if (line.includes("\t")) {
      return line.split("\t").map((cell) => {
        const n = Number(cell.trim());
        return isNaN(n) || cell.trim() === "" ? cell.trim() : n;
      });
    }
    if (/\s{2,}/.test(line)) {
      return line.split(/\s{2,}/).map((cell) => {
        const n = Number(cell.trim());
        return isNaN(n) || cell.trim() === "" ? cell.trim() : n;
      });
    }
    return [line];
  });
}

function handleMulterError(req: any, res: any, next: any) {
  upload.single("file")(req, res, (err: any) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "File too large. Maximum size is 20MB." });
      }
      return res.status(400).json({ error: err.message || "Upload failed" });
    }
    next();
  });
}

function handleMultiMulterError(req: any, res: any, next: any) {
  uploadMulti.array("file", 20)(req, res, (err: any) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "File too large. Maximum size is 20MB." });
      }
      return res.status(400).json({ error: err.message || "Upload failed" });
    }
    next();
  });
}

const nodeFetch = (_require("node-fetch") as typeof import("node-fetch")).default;

function isYouTubeUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "");
    return host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com" || host === "music.youtube.com";
  } catch {
    return false;
  }
}

function normalizeYouTubeUrl(url: string): string {
  try {
    const u = new URL(url.trim());
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/watch?v=${v}`;
    if (u.hostname.replace(/^www\./, "") === "youtu.be") {
      const id = u.pathname.slice(1).split("/")[0];
      if (id) return `https://www.youtube.com/watch?v=${id}`;
    }
  } catch {}
  return url.trim();
}

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
];

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]!;
}

function normalizeCookie(c: Record<string, unknown>): { name: string; value: string; domain?: string; path?: string; expirationDate?: number; secure?: boolean; httpOnly?: boolean; sameSite?: string; hostOnly?: boolean } | null {
  const name = typeof c.name === "string" ? c.name : (c as any).key;
  const value = typeof c.value === "string" ? c.value : (c as any).content;
  if (typeof name !== "string" || typeof value !== "string") return null;
  const domain = typeof c.domain === "string" ? c.domain : ".youtube.com";
  const path = typeof c.path === "string" ? c.path : "/";
  let expirationDate: number | undefined;
  if (typeof (c as any).expirationDate === "number") expirationDate = (c as any).expirationDate;
  else if (typeof (c as any).expiry === "number") expirationDate = (c as any).expiry;
  else if (typeof (c as any).expirationDate === "string") expirationDate = Math.floor(new Date((c as any).expirationDate).getTime() / 1000);
  return {
    name,
    value,
    domain: domain.startsWith(".") ? domain : `.${domain}`,
    path,
    expirationDate,
    secure: c.secure === true,
    httpOnly: c.httpOnly === true,
    sameSite: typeof c.sameSite === "string" ? c.sameSite : "lax",
    hostOnly: c.hostOnly === true,
  };
}

let _cookieLoadLogged = false;

const RED_BOLD = "\x1b[1m\x1b[31m";
const GREEN_BOLD = "\x1b[1m\x1b[32m";
const RESET = "\x1b[0m";

const COOKIE_PATHS = [
  "youtube-cookies.json",
  "server/youtube-cookies.json",
] as const;

function loadYouTubeCookies(): Array<Record<string, unknown>> {
  const fs = _require("fs");
  const path = _require("path");
  const cwd = process.cwd();
  let raw: string | undefined = process.env.YOUTUBE_COOKIES?.trim();
  let fullPath: string | null = null;
  if (!raw) {
    for (const rel of COOKIE_PATHS) {
      const p = path.join(cwd, rel);
      if (fs.existsSync(p)) {
        fullPath = p;
        try {
          raw = fs.readFileSync(p, "utf8").trim();
          break;
        } catch (e: any) {
          console.error("[ytdl-core] Cookies file read failed:", e?.message ?? e, "Path:", p);
          fullPath = null;
        }
      }
    }
    if (!raw) {
      const tried = COOKIE_PATHS.map((rel) => path.join(cwd, rel)).join(" / ");
      console.error(RED_BOLD + "[ERROR] COOKIE FILE NOT FOUND. LOOKED AT: " + tried + RESET);
      return [];
    }
  }
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : (data.cookies && Array.isArray(data.cookies) ? data.cookies : []);
    const out = arr.map((c: Record<string, unknown>) => normalizeCookie(c)).filter(Boolean) as Record<string, unknown>[];
    if (!process.env.YOUTUBE_COOKIES && out.length > 0 && !_cookieLoadLogged) {
      _cookieLoadLogged = true;
      console.log(GREEN_BOLD + "[ytdl-core] COOKIES LOADED SUCCESSFULLY (" + out.length + " cookies from " + (fullPath ?? "env") + ")" + RESET);
    }
    return out;
  } catch (e: any) {
    console.error("[ytdl] YOUTUBE_COOKIES parse failed:", e?.message);
    return [];
  }
}

function getCookiePathForYtDlp(): string | undefined {
  const fs = _require('fs');
  const path = _require('path');
  const cwd = process.cwd();

  // 1. Ãƒ"“nce doğrudan Netscape formatında dosya var mı bak (tarayıcıdan export)
  const netscapePaths = [
    'server/youtube-cookies-netscape.txt',
    'youtube-cookies-netscape.txt',
    'server/cookies.txt',
    'cookies.txt',
  ];
  for (const rel of netscapePaths) {
    const p = path.join(cwd, rel);
    if (!fs.existsSync(p)) continue;
    try {
      const content = fs.readFileSync(p, 'utf8').trim();
      if (!content.includes('# Netscape HTTP Cookie File')) continue;
      // Expiry değerlerini float'tan int'e çevir (yt-dlp gereksinimi)
      const fixed = content.replace(/([\t])(\d+)\.\d+([\t])/g, (_: string, pre: string, num: string, post: string) => pre + num + post);
      // Düzeltilmiş halini geri yaz
      if (fixed !== content) {
        fs.writeFileSync(p, fixed, 'utf8');
        console.log('[cookies] Netscape dosyası float expiry düzeltildi:', p);
      }
      console.log('[cookies] Netscape cookie dosyası bulundu:', p);
      return p;
    } catch {}
  }

  // 2. JSON dosyasını Netscape formatına çevir
  let raw: string | undefined;
  for (const rel of COOKIE_PATHS) {
    const p = path.join(cwd, rel);
    if (!fs.existsSync(p)) continue;
    try { raw = fs.readFileSync(p, 'utf8').trim(); break; } catch {}
  }
  if (!raw) return undefined;

  try {
    const data = JSON.parse(raw);
    const arr = Array.isArray(data) ? data : (data.cookies && Array.isArray(data.cookies) ? data.cookies : []);
    const cookies = arr.map((c: Record<string, unknown>) => normalizeCookie(c)).filter(Boolean) as Array<{ name: string; value: string; domain?: string; path?: string; expirationDate?: number; secure?: boolean }>;
    if (cookies.length === 0) return undefined;

    const lines = ['# Netscape HTTP Cookie File'];
    const placeholder = /^(YOUR_VALUE_HERE|gercek_deger_buraya|xxx|placeholder)$/i;
    for (const c of cookies) {
      if (placeholder.test(c.value.trim())) continue;
      const domain = '.' + (c.domain ?? 'youtube.com').replace(/^./, '');
      const pathVal = (c.path ?? '/').replace(/	/g, '');
      const secure = c.secure === true ? 'TRUE' : 'FALSE';
      // Float expiry Ã¢" "™ tam sayı (yt-dlp gereksinimi)
      let exp = c.expirationDate
        ? (c.expirationDate > 10000000000
            ? Math.floor(c.expirationDate / 1000)   // milisaniye Ã¢" "™ saniye
            : Math.floor(c.expirationDate))           // zaten saniye ama float
        : 0;
      if (!exp || exp < 1000000000) exp = 9999999999;
      const name = (c.name || '').replace(/\t/g, '');
      const value = (c.value || '').replace(/\n/g, ' ').replace(/\r/g, '');
      if (!name) continue;
      lines.push([domain, 'TRUE', pathVal, secure, String(exp), name, value].join('	'));
    }
    if (lines.length <= 1) return undefined;

    const outPath = path.join(cwd, 'server', 'youtube-cookies-netscape.txt');
    try {
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
      console.log('[cookies] Netscape dosyası oluşturuldu:', outPath, '(' + (lines.length - 1) + ' cookie)');
      return outPath;
    } catch {}
  } catch {}
  return undefined;
}

let _ytDlpBinaryLogged = false;

function getYtDlpBinaryPath(): string | null {
  const path = _require("path");
  const fs = _require("fs");
  try {
    const constants = _require(path.join(process.cwd(), "node_modules", "yt-dlp-exec", "src", "constants.js"));
    const binaryPath = constants.YOUTUBE_DL_PATH;
    if (binaryPath && fs.existsSync(binaryPath)) return binaryPath;
  } catch {}
  // Fallback: bin/ klasöründe ara
  const binCandidates = [
    path.join(process.cwd(), "bin", "yt-dlp"),
    path.join(process.cwd(), "bin", "yt-dlp.exe"),
  ];
  for (const p of binCandidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function getYtDlpInfo(url: string): Promise<{ title: string; formats: Array<{ format_id?: string; height?: number; url?: string; vcodec?: string; format_note?: string }> } | null> {
  const videoUrl = normalizeYouTubeUrl(url);
  if (!_ytDlpBinaryLogged) {
    _ytDlpBinaryLogged = true;
    const bin = getYtDlpBinaryPath();
    if (bin) console.log("[yt-dlp] Binary bulundu:", bin);
    else console.error("[yt-dlp] Binary BULUNAMADI.");
  }
  const binaryPath = getYtDlpBinaryPath();
  if (!binaryPath) return null;

  const cookiePath = getCookiePathForYtDlp();

  const buildArgs = (withCookies: boolean) => {
    const a = [
      "--dump-single-json",
      "--no-warnings",
      "--no-check-certificate", "--extractor-args", "youtube:player_client=tv_embedded", "--user-agent", getRandomUserAgent(),
    ];
    if (withCookies && cookiePath) a.push("--cookies", cookiePath);
    a.push(videoUrl);
    return a;
  };

  const runYtDlp = async (args: string[]) => {
    const { execFile } = _require("child_process");
    const { promisify } = _require("util");
    const execFileP = promisify(execFile);
    const { stdout } = await execFileP(binaryPath, args, {
      encoding: "utf8",
      maxBuffer: 50 * 1024 * 1024,
      timeout: 60000,
    });
    return typeof stdout === "string" ? stdout : String(stdout);
  };

  try {
    let stdout: string;
    try {
      stdout = await runYtDlp(buildArgs(true));
    } catch (cookieErr: any) {
      const stderr = (cookieErr.stderr || cookieErr.message || "").toString();
      if (stderr.includes("cookiejar") || stderr.includes("cookies") || stderr.includes("CookieLoadError")) {
        console.warn("[yt-dlp] Cookie dosyasi gecersiz, cookie olmadan deneniyor.");
        stdout = await runYtDlp(buildArgs(false));
      } else {
        throw cookieErr;
      }
    }
    const trimmed = stdout.trim();
    if (!trimmed || (!trimmed.startsWith("{") && !trimmed.startsWith("["))) {
      console.error("DETAYLI YT-DLP HATASI: stdout JSON degil (ilk 200 karakter):", trimmed.slice(0, 200));
      return null;
    }
    const info = JSON.parse(trimmed);
    const title = (info && info.title) ? String(info.title) : "YouTube video";
    const formats = Array.isArray(info.formats) ? info.formats : [];
    // Debug: ses formatı var mı kontrol et
    const audioCount = formats.filter((f) => f.acodec && f.acodec !== 'none' && f.vcodec === 'none').length;
    const videoCount = formats.filter((f) => f.vcodec && f.vcodec !== 'none').length;
    console.log('[yt-dlp] Toplam format:', formats.length, '| Video:', videoCount, '| Ses:', audioCount);
    return { title, formats };
  } catch (e: any) {
    console.error("YT-DLP FULL ERROR:", e);
    console.error("YT-DLP STDERR:", e?.stderr || "(boş)");
    console.error("YT-DLP EXIT CODE:", e?.code || e?.exitCode || "?");
    const stderr = (e?.stderr || e?.message || "").toString();
    _lastYtDlpStderr = stderr.slice(0, 500);
    return null;
  }
}

let _lastYtDlpStderr = "";

async function resolveYouTube(url: string): Promise<{ title: string; videoUrl: string | null; hint?: string }> {
  const info = await getYtDlpInfo(url);
  if (!info || info.formats.length === 0) {
    return {
      title: "YouTube",
      videoUrl: null,
      hint: "YouTube download is limited on this server (rate limit or region). Try again later or use a direct video link from another site.",
    };
  }
  const withUrl = info.formats.filter((f: any) => f.url);
  const best = withUrl.find((f: any) => f.height) ?? withUrl[0];
  return { title: info.title, videoUrl: best?.url ?? null };
}

async function getYouTubeFormats(url: string): Promise<{ title: string; formats: Array<{ qualityLabel: string; height?: number; url: string; formatIndex: number }>; hint?: string }> {
  _lastYtDlpStderr = "";
  const info = await getYtDlpInfo(url);
  if (!info) {
    let hint = "Could not load formats. The video may be restricted or unavailable. Try again later.";
    const err = _lastYtDlpStderr.toLowerCase();
    if (err.includes("sign in") || err.includes("age") || err.includes("confirm your age")) {
      hint = "This video may be age-restricted or require login. Export cookies from YouTube (see YOUTUBE_COOKIES_SETUP.md) and add youtube-cookies.json to the project root.";
    } else if (err.includes("unavailable") || err.includes("private") || err.includes("removed")) {
      hint = "Video is unavailable, private, or has been removed.";
    } else if (err.includes("timeout") || err.includes("timed out")) {
      hint = "Request timed out. Try again or use a shorter video.";
    }
    return { title: "YouTube", formats: [], hint };
  }
  const withVideo = info.formats.filter((f: any) => (f.height != null || (f.vcodec && f.vcodec !== "none")) && (f.url != null || f.format_id));
  const byHeight = withVideo
    .map((f: any) => ({
      qualityLabel: f.height ? `${f.height}p` : (f.format_note || "Unknown"),
      height: f.height,
      url: f.url || "",
      formatIndex: info.formats.indexOf(f),
    }))
    .filter((f: any) => f.formatIndex >= 0);
  const seen = new Set<number>();
  const uniq: Array<{ qualityLabel: string; height?: number; url: string; formatIndex: number }> = [];
  for (const f of byHeight.sort((a: any, b: any) => (b.height || 0) - (a.height || 0))) {
    const h = f.height || 0;
    if (seen.has(h)) continue;
    seen.add(h);
    uniq.push(f);
  }
  if (uniq.length === 0) {
    const fallback = info.formats.find((f: any) => f.url || f.format_id);
    if (fallback) {
      const idx = info.formats.indexOf(fallback);
      uniq.push({ qualityLabel: "Best", height: undefined, url: (fallback as any).url || "", formatIndex: idx >= 0 ? idx : 0 });
    }
  }
  if (uniq.length === 0 && info.formats.length > 0) {
    info.formats.forEach((f: any, idx: number) => {
      uniq.push({
        qualityLabel: f.height ? `${f.height}p` : (f.format_note || f.format_id || "Format " + idx),
        height: f.height,
        url: f.url || "",
        formatIndex: idx,
      });
    });
  }
  return { title: info.title, formats: uniq };
}

function extractOgVideo(html: string, requestedUrl?: string): { title: string; videoUrl: string | null } {
  const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i) || html.match(/<meta\s+content="([^"]*)"\s+property="og:title"/i);
  const title = titleMatch ? decodeURIComponent(titleMatch[1].replace(/&amp;/g, "&")) : "Video";
  let videoUrl: string | null = null;

  const ogVideo = html.match(/<meta\s+property="og:video:url"\s+content="([^"]*)"/i)
    || html.match(/<meta\s+property="og:video:secure_url"\s+content="([^"]*)"/i)
    || html.match(/<meta\s+content="([^"]*)"\s+property="og:video"/i)
    || html.match(/<meta\s+property="og:video"\s+content="([^"]*)"/i);
  if (ogVideo) videoUrl = ogVideo[1].trim();

  if (!videoUrl) {
    const twitterStream = html.match(/<meta\s+property="twitter:player:stream"\s+content="([^"]*)"/i) || html.match(/<meta\s+content="([^"]*)"\s+property="twitter:player:stream"/i);
    if (twitterStream) videoUrl = twitterStream[1].trim();
  }
  if (!videoUrl) {
    const videoUrlInJson = html.match(/"video_url"\s*:\s*"([^"]+)"/) || html.match(/"playback_url"\s*:\s*"([^"]+)"/) || html.match(/"contentUrl"\s*:\s*"([^"]+)"/);
    if (videoUrlInJson) videoUrl = videoUrlInJson[1].replace(/\\u0026/g, "&").replace(/\\\//g, "/").replace(/\\"/g, '"').trim();
  }
  if (!videoUrl && (requestedUrl || "").includes("twitter.com")) {
    const twimgAlt = html.match(/https?:\/\/[^"'\s]+\.twimg\.com[^"'\s]*\.mp4/);
    if (twimgAlt) videoUrl = twimgAlt[0].trim();
    if (!videoUrl) {
      const twimgEscaped = html.match(/https?:\\?\/\\?\/[^"'\s]*twimg[^"'\s]*\.mp4/);
      if (twimgEscaped) videoUrl = twimgEscaped[0].replace(/\\\//g, "/").replace(/\\u0026/g, "&").trim();
    }
  }
  if (!videoUrl) {
    const anyMp4 = html.match(/"url"\s*:\s*"(https?:[^"]*\.mp4[^"]*)"/);
    if (anyMp4) videoUrl = anyMp4[1].replace(/\\\//g, "/").replace(/\\u0026/g, "&").trim();
  }
  return { title, videoUrl };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const TIMEOUT_MS = 55_000;

  function sendJson(res: any, status: number, body: object) {
    res.setHeader("Content-Type", "application/json");
    res.status(status).json(body);
  }

  app.get("/api/resolve-video", async (req, res) => {
    const url = req.query.url as string;
    if (!url || typeof url !== "string") {
      return sendJson(res, 400, { error: "Missing url query parameter." });
    }
    try {
      if (isYouTubeUrl(url)) {
        const result = await resolveYouTube(url);
        return sendJson(res, 200, { title: result.title, videoUrl: result.videoUrl, hint: result.hint });
      }
      const response = await (nodeFetch as any)(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
        redirect: "follow",
        timeout: 15_000,
      });
      const html = await response.text();
      const { title, videoUrl } = extractOgVideo(html, url);
      const hint = !videoUrl && (url || "").includes("twitter.com")
        ? "Twitter often blocks automated access. Try opening the tweet in a browser, or use a direct video link from another site."
        : undefined;
      return sendJson(res, 200, { title, videoUrl, hint });
    } catch (e: any) {
      return sendJson(res, 422, { error: e?.message ?? "Could not fetch URL." });
    }
  });


  app.post("/api/convert", handleMulterError, async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Processing timed out (55s)")), TIMEOUT_MS)
    );

    const conversionPromise = (async () => {
      let data: any;
      try {
        data = await pdfParse(req.file!.buffer);
      } catch (e: any) {
        throw new Error(`PDF could not be read: ${e.message}`);
      }

      const text = data.text ?? "";
      if (!text.trim()) {
        throw new Error("No text could be extracted from PDF. The file may be a scanned image (OCR required).");
      }

      const paragraphs = textToParagraphs(text);
      const doc = new Document({
        creator: "ProToolHub",
        description: "Converted from PDF",
        sections: [{ properties: {}, children: paragraphs }],
      });

      return await Packer.toBuffer(doc);
    })();

    try {
      const buffer = await Promise.race([conversionPromise, timeoutPromise]);
      const originalName = req.file.originalname.replace(/\.pdf$/i, "");
      const safeFileName = encodeURIComponent(`${originalName}.docx`);

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`);
      res.setHeader("Content-Length", buffer.length.toString());
      res.send(Buffer.from(buffer));
    } catch (err: any) {
      console.error("[/api/convert] Error:", err.message);
      const status = err.message.includes("timed out") ? 504 : 422;
      res.status(status).json({ error: err.message });
    }
  });

  app.post("/api/convert-excel", handleMulterError, async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Processing timed out (55s)")), TIMEOUT_MS)
    );

    const conversionPromise = (async () => {
      let data: any;
      try {
        data = await pdfParse(req.file!.buffer);
      } catch (e: any) {
        throw new Error(`PDF could not be read: ${e.message}`);
      }

      const rawText = data.text ?? "";
      if (!rawText.trim()) {
        throw new Error("No text could be extracted from PDF. The file may be a scanned image (OCR required).");
      }

      const rows = textToSheetData(rawText);
      if (rows.length === 0) throw new Error("No data found for Excel export.");

      const ws = XLSX.utils.aoa_to_sheet(rows);

      const firstRow = rows[0];
      const isHeader = firstRow.every(
        (c) => typeof c === "string" && c === c.toUpperCase() && /[A-ZÇĞİÖŞÜ]/.test(c)
      );
      if (isHeader && ws["!ref"]) {
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddr = XLSX.utils.encode_cell({ r: 0, c: col });
          if (!ws[cellAddr]) continue;
          ws[cellAddr].s = { font: { bold: true } };
        }
      }

      const colWidths = rows.reduce<number[]>((acc, row) => {
        row.forEach((cell, i) => {
          const len = String(cell).length;
          acc[i] = Math.min(Math.max(acc[i] ?? 10, len), 60);
        });
        return acc;
      }, []);
      ws["!cols"] = colWidths.map((w) => ({ wch: w }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      const xlsxBuffer = XLSX.write(wb, {
        type: "buffer",
        bookType: "xlsx",
        compression: true,
      }) as Buffer;

      return xlsxBuffer;
    })();

    try {
      const buffer = await Promise.race([conversionPromise, timeoutPromise]);
      const originalName = req.file.originalname.replace(/\.pdf$/i, "");
      const safeFileName = encodeURIComponent(`${originalName}.xlsx`);

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`);
      res.setHeader("Content-Length", buffer.length.toString());
      res.send(buffer);
    } catch (err: any) {
      console.error("[/api/convert-excel] Error:", err.message);
      const status = err.message.includes("timed out") ? 504 : 422;
      res.status(status).json({ error: err.message });
    }
  });

  app.post("/api/convert-image", handleMulterError, async (_req, res) => {
    return res.status(503).json({
      error: "PDF to Image server conversion is temporarily disabled on this environment.",
    });
  });

  // Ã¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢Â
  // POST /api/translate-pdf
  // Ã¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢Â

  const uploadTranslate = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req: any, file: any, cb: any) =>
      file.mimetype === "application/pdf"
        ? cb(null, true)
        : cb(new Error("Yalnızca PDF kabul edilir")),
  });

  const SUPPORTED_LANGS = new Set([
    "tr","en","de","fr","es","it","pt","ru","ja","zh","ar","ko","nl","pl","sv",
  ]);

  async function translateChunks(chunks: string[], targetLang: string): Promise<string[]> {
    const { translate } = _require("@vitalets/google-translate-api");
    const results: string[] = [];

    for (const chunk of chunks) {
      if (!chunk.trim()) { results.push(chunk); continue; }
      try {
        const resp = await translate(chunk, { to: targetLang });
        results.push(resp.text ?? chunk);
      } catch (e: any) {
        if (e.message?.includes("429") || e.message?.includes("Too Many")) {
          await new Promise(r => setTimeout(r, 2000));
          try {
            const retry = await translate(chunk, { to: targetLang });
            results.push(retry.text ?? chunk);
          } catch {
            results.push(chunk);
          }
        } else {
          throw new Error(`Translation API error: ${e.message?.slice(0,100)}`);
        }
      }
    }
    return results;
  }

  const handleTranslateMulterError = (err: any, _req: any, res: any, next: any) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    if (err) return res.status(400).json({ error: err.message });
    next();
  };

  app.post(
    "/api/translate-pdf",
    uploadTranslate.single("file"),
    handleTranslateMulterError,
    async (req: any, res: any): Promise<void> => {
      if (!req.file) {
        res.status(400).json({ error: "PDF dosyası bulunamadı" }); return;
      }

      const { targetLang = "en" } = req.body as Record<string, string>;

      if (!SUPPORTED_LANGS.has(targetLang)) {
        res.status(400).json({
          error: `Desteklenmeyen dil: "${targetLang}"`,
          supported: [...SUPPORTED_LANGS],
        });
        return;
      }

      try {
        const TIMEOUT = 55_000;
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Çeviri zaman aşımına uğradı (55s)")), TIMEOUT)
        );

        const translatePromise = (async () => {
          let data: any;
          try {
            data = await pdfParse(req.file!.buffer);
          } catch (e: any) {
            throw new Error(`PDF okunamadı: ${e.message}`);
          }

          const rawText = data.text ?? "";
          if (!rawText.trim()) throw new Error("PDF'den metin çıkarılamadı.");

          const lines = rawText.replace(/\r\n?/g, "\n").split("\n");
          const chunks: string[] = [];
          let current = "";

          for (const line of lines) {
            const candidate = current ? `${current}\n${line}` : line;
            if (candidate.length > 500 && current) {
              chunks.push(current);
              current = line;
            } else {
              current = candidate;
            }
          }
          if (current) chunks.push(current);

          const translated = await translateChunks(chunks, targetLang);
          const fullText = translated.join("\n");

          const fontkit = _require("@pdf-lib/fontkit");
          const fs = _require("fs");
          const outDoc = await PDFDocument.create();
          outDoc.registerFontkit(fontkit);

          const resolvedFont = resolveFontPath("DejaVuSans.ttf");
          if (!resolvedFont) {
            throw new Error("Unicode font not found — cannot render translated text");
          }
          const fontBytes = fs.readFileSync(resolvedFont);
          const font = await outDoc.embedFont(fontBytes, { subset: true });
          const fontSize = 11;
          const lineH = fontSize * 1.4;
          const MARGIN = 50;
          const PAGE_W = 595.28;
          const PAGE_H = 841.89;
          const maxW = PAGE_W - MARGIN * 2;
          const maxLines = Math.floor((PAGE_H - MARGIN * 2) / lineH);

          const allLines: string[] = [];
          for (const paragraph of fullText.split("\n")) {
            if (!paragraph.trim()) { allLines.push(""); continue; }
            const words = paragraph.split(" ");
            let buf = "";
            for (const word of words) {
              const test = buf ? `${buf} ${word}` : word;
              const testW = font.widthOfTextAtSize(test, fontSize);
              if (testW > maxW && buf) {
                allLines.push(buf);
                buf = word;
              } else {
                buf = test;
              }
            }
            if (buf) allLines.push(buf);
          }

          let lineIdx = 0;
          while (lineIdx < allLines.length) {
            const page = outDoc.addPage([PAGE_W, PAGE_H]);
            let y = PAGE_H - MARGIN;
            let count = 0;
            while (lineIdx < allLines.length && count < maxLines) {
              const line = allLines[lineIdx++];
              if (line) {
                page.drawText(line, {
                  x: MARGIN, y,
                  size: fontSize,
                  font,
                  color: rgb(0, 0, 0),
                });
              }
              y -= lineH;
              count++;
            }
          }

          return Buffer.from(await outDoc.save());
        })();

        const pdfBuffer = await Promise.race([translatePromise, timeoutPromise]) as Buffer;

        const baseName = req.file.originalname.replace(/\.pdf$/i, "");
        const safeFileName = encodeURIComponent(`${baseName}_${targetLang}.pdf`);

        res
          .setHeader("Content-Type", "application/pdf")
          .setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`)
          .setHeader("Content-Length", pdfBuffer.length.toString())
          .send(pdfBuffer);

      } catch (err: any) {
        console.error("[/api/translate-pdf] Error:", err.message);
        const status = err.message.includes("zaman aşımı") || err.message.includes("timed out") ? 504 : 422;
        res.status(status).json({ error: err.message });
      }
    }
  );

  // Ã¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢Â
  // POST /api/compare-pdf
  // Ã¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢Â
  const uploadCompareFields = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 2 },
    fileFilter: (_req: any, file: any, cb: any) =>
      file.mimetype === "application/pdf"
        ? cb(null, true)
        : cb(new Error("Only PDF files are accepted")),
  });

  function handleCompareMulterError(req: any, res: any, next: any) {
    uploadCompareFields.fields([
      { name: "fileA", maxCount: 1 },
      { name: "fileB", maxCount: 1 },
    ])(req, res, (err: any) => {
      if (err instanceof multer.MulterError) return res.status(400).json({ error: `Upload error: ${err.message}` });
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  }

  app.post("/api/compare-pdf", handleCompareMulterError, async (req: any, res: any) => {
    const filesMap = req.files as Record<string, Express.Multer.File[]> | undefined;
    const fileAArr = filesMap?.["fileA"];
    const fileBArr = filesMap?.["fileB"];

    if (!fileAArr?.[0] || !fileBArr?.[0]) {
      res.status(400).json({ error: "Two PDF files required (fileA and fileB)." });
      return;
    }

    try {
      const TIMEOUT = 55_000;
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Compare timed out (55s)")), TIMEOUT)
      );

      const comparePromise = (async () => {
        let textA: string, textB: string;
        try {
          const dataA = await pdfParse(fileAArr[0].buffer);
          textA = (dataA.text ?? "").trim();
        } catch (e: any) {
          throw new Error(`PDF A could not be read: ${e.message}`);
        }
        try {
          const dataB = await pdfParse(fileBArr[0].buffer);
          textB = (dataB.text ?? "").trim();
        } catch (e: any) {
          throw new Error(`PDF B could not be read: ${e.message}`);
        }
        return { textA, textB };
      })();

      const result = await Promise.race([comparePromise, timeoutPromise]);
      res.json(result);
    } catch (err: any) {
      console.error("[/api/compare-pdf] Error:", err.message);
      const status = err.message.includes("timed out") ? 504 : 422;
      res.status(status).json({ error: err.message });
    }
  });

  app.post("/api/convert-text", handleMulterError, async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      let data: any;
      try {
        data = await pdfParse(req.file.buffer);
      } catch (e: any) {
        throw new Error(`PDF could not be read: ${e.message}`);
      }

      const text = data.text ?? "";
      if (!text.trim()) {
        throw new Error("No text could be extracted from PDF.");
      }

      const buffer = Buffer.from(text, "utf-8");
      const originalName = req.file.originalname.replace(/\.pdf$/i, "");
      const safeFileName = encodeURIComponent(`${originalName}.txt`);

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`);
      res.setHeader("Content-Length", buffer.length.toString());
      res.send(buffer);
    } catch (err: any) {
      console.error("[/api/convert-text] Error:", err.message);
      res.status(422).json({ error: err.message });
    }
  });

  app.post("/api/pdf-action", handleMultiMulterError, async (req, res) => {
    const actionType = req.body?.actionType as string;
    const files = (req as any).files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!actionType) {
      return res.status(400).json({ error: "Missing actionType parameter" });
    }

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Processing timed out (55s)")), TIMEOUT_MS)
    );

    const actionPromise = (async (): Promise<Buffer> => {
      switch (actionType) {
        case "merge": {
          if (files.length < 2) throw new Error("At least 2 PDF files required for merge.");
          const mergedPdf = await PDFDocument.create();
          for (const f of files) {
            const srcPdf = await PDFDocument.load(f.buffer);
            const copiedPages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
            copiedPages.forEach((page: any) => mergedPdf.addPage(page));
          }
          return Buffer.from(await mergedPdf.save());
        }

        case "split": {
          const srcPdf = await PDFDocument.load(files[0].buffer);
          const pageCount = srcPdf.getPageCount();
          if (pageCount <= 1) {
            return Buffer.from(await srcPdf.save());
          }
          const JSZip = _require("jszip");
          const zip = new JSZip();
          for (let i = 0; i < pageCount; i++) {
            const newDoc = await PDFDocument.create();
            const [copiedPage] = await newDoc.copyPages(srcPdf, [i]);
            newDoc.addPage(copiedPage);
            const pdfBytes = await newDoc.save();
            zip.file(`page_${String(i + 1).padStart(3, "0")}.pdf`, pdfBytes);
          }
          return zip.generateAsync({ type: "nodebuffer" });
        }

        case "rotate": {
          const angleDeg = parseInt(req.body?.angle ?? "90", 10);
          const pdfDoc = await PDFDocument.load(files[0].buffer);
          const pages = pdfDoc.getPages();
          pages.forEach((page: any) => {
            page.setRotation(degrees((page.getRotation().angle + angleDeg) % 360));
          });
          return Buffer.from(await pdfDoc.save());
        }

        case "delete-pages": {
          const pagesToDelete = (req.body?.pages ?? "1")
            .split(",")
            .map((s: string) => parseInt(s.trim(), 10) - 1)
            .filter((n: number) => !isNaN(n))
            .sort((a: number, b: number) => b - a);
          const pdfDoc = await PDFDocument.load(files[0].buffer);
          for (const idx of pagesToDelete) {
            if (idx >= 0 && idx < pdfDoc.getPageCount()) {
              pdfDoc.removePage(idx);
            }
          }
          if (pdfDoc.getPageCount() === 0) throw new Error("Cannot delete all pages.");
          return Buffer.from(await pdfDoc.save());
        }

        case "reorder": {
          const orderStr = req.body?.order ?? "";
          if (!orderStr.trim()) throw new Error("Missing 'order' parameter (comma-separated page numbers).");
          const order = orderStr
            .split(",")
            .map((s: string) => parseInt(s.trim(), 10) - 1)
            .filter((n: number) => !isNaN(n));
          if (order.length === 0) throw new Error("Invalid 'order' parameter.");
          const srcPdf = await PDFDocument.load(files[0].buffer);
          const newDoc = await PDFDocument.create();
          const copiedPages = await newDoc.copyPages(srcPdf, order);
          copiedPages.forEach((page: any) => newDoc.addPage(page));
          return Buffer.from(await newDoc.save());
        }

        case "page-numbers": {
          const pdfDoc = await PDFDocument.load(files[0].buffer);
          const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
          const pages = pdfDoc.getPages();
          pages.forEach((page: any, i: number) => {
            const { width } = page.getSize();
            const text = `${i + 1}`;
            const textWidth = font.widthOfTextAtSize(text, 10);
            page.drawText(text, {
              x: (width - textWidth) / 2,
              y: 20,
              size: 10,
              font,
              color: rgb(0.4, 0.4, 0.4),
            });
          });
          return Buffer.from(await pdfDoc.save());
        }

        case "compress": {
          const pdfDoc = await PDFDocument.load(files[0].buffer, { ignoreEncryption: true });
          const compressedBytes = await pdfDoc.save();
          return Buffer.from(compressedBytes);
        }

        case "protect": {
          const pdfDoc = await PDFDocument.load(files[0].buffer);
          const protectedBytes = await pdfDoc.save();
          return Buffer.from(protectedBytes);
        }

        case "unlock": {
          const pdfDoc = await PDFDocument.load(files[0].buffer, { ignoreEncryption: true });
          return Buffer.from(await pdfDoc.save());
        }

        case "watermark": {
          const watermarkText = req.body?.watermark ?? "ProToolHub";
          const rawFontSize = Number(req.body?.fontSize ?? 0);
          const wmFontSize = rawFontSize > 0 ? Math.max(8, Math.min(200, rawFontSize)) : 0;
          const wmAngle = Number(req.body?.angle ?? 45);
          const wmOpacity = Math.max(0.01, Math.min(1, Number(req.body?.opacity ?? 0.3)));
          const wmColorR = Math.max(0, Math.min(1, Number(req.body?.colorR ?? 0.75)));
          const wmColorG = Math.max(0, Math.min(1, Number(req.body?.colorG ?? 0.75)));
          const wmColorB = Math.max(0, Math.min(1, Number(req.body?.colorB ?? 0.75)));

          const pdfDoc = await PDFDocument.load(files[0].buffer);
          const fontkit = _require("@pdf-lib/fontkit");
          const fs = _require("fs");
          pdfDoc.registerFontkit(fontkit);
          const resolvedBoldFont = resolveFontPath("DejaVuSans-Bold.ttf");
          let font: any;
          if (resolvedBoldFont) {
            const boldBytes = fs.readFileSync(resolvedBoldFont);
            font = await pdfDoc.embedFont(boldBytes, { subset: true });
          } else {
            font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
          }
          const pages = pdfDoc.getPages();
          pages.forEach((page: any) => {
            const { width, height } = page.getSize();
            const size = wmFontSize || Math.min(width, height) * 0.1;
            const textWidth = font.widthOfTextAtSize(watermarkText, size);
            page.drawText(watermarkText, {
              x: (width - textWidth) / 2,
              y: height / 2,
              size,
              font,
              color: rgb(wmColorR, wmColorG, wmColorB),
              opacity: wmOpacity,
              rotate: degrees(wmAngle),
            });
          });
          return Buffer.from(await pdfDoc.save());
        }

        default:
          throw new Error(`Unknown actionType: ${actionType}`);
      }
    })();

    try {
      const buffer = await Promise.race([actionPromise, timeoutPromise]);
      const originalName = files[0].originalname.replace(/\.pdf$/i, "");

      const isSplit = actionType === "split";
      const srcCheck = isSplit ? await PDFDocument.load(files[0].buffer) : null;
      const isZip = isSplit && srcCheck && srcCheck.getPageCount() > 1;

      if (isZip) {
        const safeFileName = encodeURIComponent(`${originalName}_split.zip`);
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`);
      } else {
        const safeFileName = encodeURIComponent(`${originalName}_${actionType}.pdf`);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`);
      }

      res.setHeader("Content-Length", buffer.length.toString());
      res.send(buffer);
    } catch (err: any) {
      console.error(`[/api/pdf-action/${actionType}] Error:`, err.message);
      const status = err.message.includes("timed out") ? 504 : 422;
      res.status(status).json({ error: err.message });
    }
  });

  // Ã¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢Â
  // POST /api/convert-to-pdf — Word/Excel/PPT/HTML Ã¢" "™ PDF via LibreOffice
  // Ã¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢Â

  let libreConvert: any = null;
  let htmlToDocx: any = null;

  async function loadConvertLibs(): Promise<void> {
    if (!libreConvert) {
      try {
        libreConvert = _require("libreoffice-convert");
        const { promisify } = _require("util");
        libreConvert.convertAsync = (buf, fmt, filter, opts) => new Promise((resolve, reject) => { libreConvert.convertWithOptions(buf, fmt, filter, opts, (err, result) => { if (err) reject(err); else resolve(result); }); });
      } catch {
        throw new Error("libreoffice-convert yüklenemedi.");
      }
    }
    if (!htmlToDocx) {
      try {
        htmlToDocx = _require("html-to-docx");
      } catch {
        throw new Error("html-to-docx yüklenemedi.");
      }
    }
  }

  const CONVERT_TO_PDF_EXTS = new Set([
    ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".html", ".htm",
  ]);

  const uploadToPdf = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 30 * 1024 * 1024 },
    fileFilter: (_req: any, file: any, cb: any) => {
      const ext = "." + (file.originalname.split(".").pop() ?? "").toLowerCase();
      if (CONVERT_TO_PDF_EXTS.has(ext)) {
        cb(null, true);
      } else {
        cb(new Error(`Desteklenmeyen dosya türü: ${ext}`));
      }
    },
  });

  function detectConvertInputType(filename: string, mime: string): "office" | "html" {
    const ext = "." + (filename.split(".").pop() ?? "").toLowerCase();
    if ([".html", ".htm"].includes(ext) || mime.includes("html")) return "html";
    return "office";
  }

  async function htmlToPdfBuffer(htmlBuffer: Buffer): Promise<Buffer> {
    const htmlString = htmlBuffer.toString("utf-8");
    const docxBuffer: Buffer = await htmlToDocx(htmlString, null, {
      table: { row: { cantSplit: true } },
      footer: false,
      pageNumber: false,
    }) as Buffer;
    const pdfBuffer: Buffer = await libreConvert.convertAsync(docxBuffer, ".pdf", undefined, { sofficeBinaryPaths: ["C:\\Program Files\\LibreOffice\\program\\soffice.exe"] });
    return pdfBuffer;
  }

  async function officeToPdfBuffer(fileBuffer: Buffer): Promise<Buffer> {
    const pdfBuffer: Buffer = await libreConvert.convertAsync(fileBuffer, ".pdf", undefined, { sofficeBinaryPaths: ["C:\\Program Files\\LibreOffice\\program\\soffice.exe"] });
    return pdfBuffer;
  }

  app.post("/api/convert-to-pdf", uploadToPdf.single("file"), async (req: any, res: any) => {
    if (!req.file) {
      res.status(400).json({ error: "Dosya bulunamadı. FormData field adı 'file' olmalı." });
      return;
    }

    try {
      await loadConvertLibs();
    } catch (e: any) {
      res.status(503).json({ error: e.message });
      return;
    }

    try {
      const inputType = detectConvertInputType(req.file.originalname, req.file.mimetype);

      const TIMEOUT = 55_000;
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Dönüşüm zaman aşımına uğradı (55s)")), TIMEOUT)
      );

      const convertPromise = (async () => {
        if (inputType === "html") {
          return htmlToPdfBuffer(req.file!.buffer);
        } else {
          return officeToPdfBuffer(req.file!.buffer);
        }
      })();

      const pdfBuffer = await Promise.race([convertPromise, timeoutPromise]);

      if (!pdfBuffer || pdfBuffer.length < 100) {
        throw new Error("PDF çıktısı boş — LibreOffice dönüşümü başarısız");
      }

      const baseName = req.file.originalname.replace(/\.[^.]+$/, "");
      const safeFileName = encodeURIComponent(`${baseName}.pdf`);

      res
        .setHeader("Content-Type", "application/pdf")
        .setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`)
        .setHeader("Content-Length", pdfBuffer.length.toString())
        .send(pdfBuffer);
    } catch (err: any) {
      console.error("[/api/convert-to-pdf] Error:", err.message);
      const status = err.message.includes("zaman aşımı") || err.message.includes("timed out") ? 504 : 422;
      res.status(status).json({ error: err.message });
    }
  });

  // ── Image araçları multer config ─────────────────────────────────
  const uploadImage = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (_req: any, file: any, cb: any) => {
      if (/^image\/(jpeg|png|webp|gif|bmp|tiff|avif)$/i.test(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only image files are accepted"));
      }
    },
  });

  function handleImageMulterError(req: any, res: any, next: any) {
    uploadImage.single("file")(req, res, (err: any) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") return res.status(413).json({ error: "File too large. Maximum size is 20MB." });
        return res.status(400).json({ error: err.message || "Upload failed" });
      }
      next();
    });
  }

  let _jimp: any = null;
  async function loadJimp() {
    if (_jimp) return _jimp;
    try {
      const j = _require("jimp");
      _jimp = { Jimp: j.Jimp, MIME_JPEG: "image/jpeg", MIME_PNG: "image/png" };
      return _jimp;
    } catch(e) {}
    throw new Error("jimp not available: " + String(e));
  }

  async function jimpProcess(J, buffer, fn, mime, opts) {
    const img = await J.Jimp.fromBuffer(buffer);
    fn(img);
    return img.getBuffer(mime, opts || {});
  }

  app.post("/api/compress-image", handleImageMulterError, async (req: any, res: any) => {
    if (!req.file) return res.status(400).json({ error: "No image file uploaded" });
    try {
      const quality = Math.max(1, Math.min(100, parseInt(req.body?.quality ?? "80", 10)));
      const J = await loadJimp();
      let outputBuffer: Buffer; let mimeType = "image/jpeg";
      if (J._sharp) {
        outputBuffer = await J._sharp(req.file.buffer).jpeg({ quality }).toBuffer();
      } else {
        outputBuffer = await jimpProcess(J, req.file.buffer, (img) => { }, J.MIME_JPEG, {quality});
        mimeType = "image/jpeg";
      }
      const origName = req.file.originalname.replace(/\.[^.]+$/, "");
      const safeFileName = encodeURIComponent(`${origName}_compressed.jpg`);
      res.setHeader("Content-Type", mimeType)
         .setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`)
         .setHeader("Content-Length", outputBuffer.length.toString())
         .send(outputBuffer);
    } catch (err: any) {
      console.error("[/api/compress-image]", err.message);
      res.status(422).json({ error: err.message });
    }
  });

  app.post("/api/resize-image", handleImageMulterError, async (req: any, res: any) => {
    if (!req.file) return res.status(400).json({ error: "No image file uploaded" });
    try {
      const width = req.body?.width ? parseInt(req.body.width, 10) : null;
      const height = req.body?.height ? parseInt(req.body.height, 10) : null;
      if (!width && !height) return res.status(400).json({ error: "width or height required" });
      const quality = Math.max(1, Math.min(100, parseInt(req.body?.quality ?? "90", 10)));
      const J = await loadJimp();
      let outputBuffer: Buffer; let mimeType = "image/jpeg";
      if (J._sharp) {
        outputBuffer = await J._sharp(req.file.buffer).resize(width, height, { fit: "inside" }).jpeg({ quality }).toBuffer();
      } else {
        outputBuffer = await jimpProcess(J, req.file.buffer, (img) => { img.scaleToFit({ w: width || img.bitmap.width, h: height || img.bitmap.height }); }, J.MIME_JPEG, {quality});
        mimeType = "image/jpeg";
      }
      const origName = req.file.originalname.replace(/\.[^.]+$/, "");
      const suffix = width && height ? `_${width}x${height}` : width ? `_w${width}` : `_h${height}`;
      const safeFileName = encodeURIComponent(`${origName}${suffix}.jpg`);
      res.setHeader("Content-Type", mimeType)
         .setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`)
         .setHeader("Content-Length", outputBuffer.length.toString())
         .send(outputBuffer);
    } catch (err: any) {
      console.error("[/api/resize-image]", err.message);
      res.status(422).json({ error: err.message });
    }
  });

  app.post("/api/image-action", handleImageMulterError, async (req: any, res: any) => {
    if (!req.file) return res.status(400).json({ error: "No image file uploaded" });
    const actionType = req.body?.actionType as string;
    if (!actionType) return res.status(400).json({ error: "Missing actionType" });
    try {
      const quality = Math.max(1, Math.min(100, parseInt(req.body?.quality ?? "85", 10)));
      const J = await loadJimp();
      let outputBuffer: Buffer; let mimeType = "image/jpeg";
      if (J._sharp) {
        let s = J._sharp(req.file.buffer);
        if (actionType === "compress") { s = s.jpeg({ quality }); }
        else if (actionType === "rotate") { s = s.rotate(parseInt(req.body?.angle ?? "90", 10)); }
        else if (actionType === "flip") { s = req.body?.direction === "vertical" ? s.flip() : s.flop(); }
        else if (actionType === "grayscale") { s = s.grayscale(); }
        else if (actionType === "resize") { s = s.resize(req.body?.width ? parseInt(req.body.width,10) : null, req.body?.height ? parseInt(req.body.height,10) : null, { fit: "inside" }); }
        else if (actionType === "convert") {
          const fmt = (req.body?.format ?? "jpeg").replace("jpg","jpeg");
          if (fmt === "png") { s = s.png(); mimeType = "image/png"; }
          else if (fmt === "webp") { s = s.webp({ quality }); mimeType = "image/webp"; }
          else { s = s.jpeg({ quality }); }
        } else return res.status(400).json({ error: `Unknown actionType: ${actionType}` });
        outputBuffer = await s.toBuffer();
      } else {
        if (actionType === "compress") {
          outputBuffer = await jimpProcess(J, req.file.buffer, (img) => { }, J.MIME_JPEG, {quality});
        } else if (actionType === "rotate") {
          outputBuffer = await jimpProcess(J, req.file.buffer, (img) => { img.rotate(parseInt(req.body && req.body.angle || "90", 10)); }, J.MIME_JPEG, {quality});
        } else if (actionType === "flip") {
          const isV = req.body && req.body.direction === "vertical";
          outputBuffer = await jimpProcess(J, req.file.buffer, (img) => { img.flip({ horizontal: !isV, vertical: isV }); }, J.MIME_JPEG);
        } else if (actionType === "grayscale") {
          outputBuffer = await jimpProcess(J, req.file.buffer, (img) => { img.greyscale(); }, J.MIME_JPEG);
        } else if (actionType === "resize") {
          outputBuffer = await jimpProcess(J, req.file.buffer, (img) => {
            img.scaleToFit({ w: req.body && req.body.width ? parseInt(req.body.width,10) : img.bitmap.width, h: req.body && req.body.height ? parseInt(req.body.height,10) : img.bitmap.height });
            }, J.MIME_JPEG, {quality});
        } else if (actionType === "convert") {
          const fmt = ((req.body && req.body.format) || "jpeg").replace("jpg","jpeg");
          if (fmt === "png") { outputBuffer = await jimpProcess(J, req.file.buffer, () => {}, J.MIME_PNG); mimeType = "image/png"; }
          else { outputBuffer = await jimpProcess(J, req.file.buffer, (img) => { }, J.MIME_JPEG, {quality}); }
        } else { return res.status(400).json({ error: "Unknown actionType: " + actionType }); }
      }
      const origName = req.file.originalname.replace(/\.[^.]+$/, "");
      const ext = mimeType.split("/")[1].replace("jpeg","jpg");
      const safeFileName = encodeURIComponent(`${origName}_${actionType}.${ext}`);
      res.setHeader("Content-Type", mimeType)
         .setHeader("Content-Disposition", `attachment; filename*=UTF-8''${safeFileName}`)
         .setHeader("Content-Length", outputBuffer.length.toString())
         .send(outputBuffer);
    } catch (err: any) {
      console.error(`[/api/image-action/${req.body?.actionType}]`, err.message);
      res.status(422).json({ error: err.message });
    }
  });



  // ========== CONTACT FORM ==========
  app.post("/api/contact", async (req: any, res: any) => {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ error: "All fields are required" });
    if (!email.includes("@")) return res.status(400).json({ error: "Invalid email address" });
    if (message.length < 10) return res.status(400).json({ error: "Message too short" });

    const payload = {
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      message: String(message).slice(0, 5000),
      ip: String(req.headers["x-forwarded-for"] || req.ip || "").split(",")[0].trim() || undefined,
      userAgent: String(req.headers["user-agent"] || "").slice(0, 300) || undefined,
    };

    // Once diske yaz, sonra (tanimliysa) webhook'a ilet. Ikisi de basarisiz
    // olursa kullaniciya basarili demeyiz - mesajin kayboldugunu soyleriz.
    let stored: number | null = null;
    let forwarded = false;
    try {
      stored = saveContactMessage(payload);
      forwarded = await forwardContactMessage(payload);
    } catch (err: any) {
      console.error("[/api/contact] store error:", err?.message);
    }

    if (stored === null && !forwarded) {
      // Mesaj hicbir yere yazilamadi. Sessizce yutmak yerine kullaniciya
      // dogrudan e-posta adresini veriyoruz.
      console.error(`[CONTACT][LOST] ${payload.name} <${payload.email}>: ${payload.message}`);
      return res.status(503).json({
        error:
          "We could not save your message right now. Please email us directly at hello@protoolhub.net and we will get back to you.",
      });
    }

    console.log(
      `[CONTACT] #${stored ?? "-"} from ${payload.name} <${payload.email}>` +
        (forwarded ? " (forwarded)" : ""),
    );
    res.json({
      success: true,
      message: "Message received! We will get back to you within 24-48 hours.",
    });
  });


  // ========== AI WRITING TOOLS ==========
  // Anthropic Messages API uzerinden metin uretimi.
  // Yeni bagimlilik eklenmedi: Node 20+ global fetch kullaniliyor.

  const AI_MODEL = "claude-sonnet-4-6";
  const AI_MAX_TOKENS = 1400;
  const AI_INPUT_MAX = 4000;

  // Arac basina sistem talimati. Anahtar = title.toLowerCase().trim()
  const AI_PROMPTS: Record<string, string> = {
    "paragraph writer":
      "You are a precise writing assistant. Write a single, well-structured paragraph (90-150 words) on the topic the user provides. Use clear, natural prose. No headings, no bullet points, no preamble.",
    "essay writer":
      "You are an academic writing assistant. Write a structured essay (450-650 words) on the user's topic: a short introduction, two or three body paragraphs each making one argument with a concrete example, and a brief conclusion. Neutral, informative register. No headings unless the topic clearly needs them.",
    "story generator":
      "You are a fiction writer. Write a short story (400-600 words) from the user's premise. Establish a character with a want, introduce a complication, and end on a resolution or a deliberate open note. Concrete sensory detail over abstraction. No title, no preamble.",
    "content improver":
      "You are a line editor. Rewrite the user's text to be clearer and tighter while preserving their meaning, facts, and voice. Fix grammar and awkward phrasing. Do not add new claims, do not pad the length. Return only the improved text with no commentary.",
    "blog post idea":
      "You are a content strategist. From the user's topic or niche, produce 8 blog post ideas. For each: a specific working title, one sentence on the angle, and the reader it serves. Number them. Avoid generic listicle titles.",
    "instagram caption":
      "You are a social media copywriter. From the user's description, write 5 Instagram caption options of varying length and tone (one short and punchy, one story-led, one question-led, one value-led, one playful). Number them. Add 5-8 relevant hashtags on a separate line after each caption.",
    "linkedin post":
      "You are a LinkedIn ghostwriter. From the user's topic, write a post of 120-220 words: a hook line that earns the click, a short body with a concrete specific or a number, and a closing line that invites replies. Short paragraphs, no hashtag spam (max 3), no emoji walls.",
  };

  // Basit IP bazli hiz siniri: 10 istek / 10 dakika.
  const aiHits = new Map<string, number[]>();
  const AI_WINDOW_MS = 10 * 60 * 1000;
  const AI_LIMIT = 10;

  function aiRateLimited(ip: string): boolean {
    const now = Date.now();
    const hits = (aiHits.get(ip) ?? []).filter((t) => now - t < AI_WINDOW_MS);
    if (hits.length >= AI_LIMIT) {
      aiHits.set(ip, hits);
      return true;
    }
    hits.push(now);
    aiHits.set(ip, hits);
    if (aiHits.size > 5000) aiHits.clear(); // kaba bellek koruması
    return false;
  }

  app.post("/api/ai-generate", async (req: any, res: any) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("[/api/ai-generate] ANTHROPIC_API_KEY tanimli degil");
      return res.status(503).json({
        error: "The AI writing service is not configured right now. Please try again later.",
      });
    }

    const { tool, input } = req.body || {};
    if (typeof input !== "string" || input.trim().length < 3) {
      return res.status(400).json({ error: "Please enter a topic or some text first." });
    }
    if (input.length > AI_INPUT_MAX) {
      return res.status(413).json({
        error: `Input is too long. Please keep it under ${AI_INPUT_MAX} characters.`,
      });
    }

    const ip = String(req.headers["x-forwarded-for"] || req.ip || "unknown").split(",")[0].trim();
    if (aiRateLimited(ip)) {
      return res.status(429).json({
        error: "You have reached the free usage limit. Please wait a few minutes and try again.",
      });
    }

    const key = String(tool || "").toLowerCase().trim();
    const system =
      AI_PROMPTS[key] ??
      "You are a helpful writing assistant. Respond to the user's request with clean, well-organised prose. No preamble.";

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: AI_MODEL,
          max_tokens: AI_MAX_TOKENS,
          system,
          messages: [{ role: "user", content: input.trim() }],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!r.ok) {
        const detail = await r.text().catch(() => "");
        console.error(`[/api/ai-generate] upstream ${r.status}: ${detail.slice(0, 300)}`);
        if (r.status === 429) {
          return res.status(429).json({ error: "The service is busy right now. Please try again in a moment." });
        }
        return res.status(502).json({ error: "Could not generate text right now. Please try again." });
      }

      const data: any = await r.json();
      const output = (data?.content ?? [])
        .filter((b: any) => b?.type === "text")
        .map((b: any) => b.text)
        .join("\n")
        .trim();

      if (!output) {
        return res.status(502).json({ error: "The response came back empty. Please try rephrasing your input." });
      }

      res.json({ output });
    } catch (err: any) {
      const aborted = err?.name === "AbortError";
      console.error("[/api/ai-generate]", aborted ? "timeout" : err?.message);
      res.status(aborted ? 504 : 500).json({
        error: aborted
          ? "The request took too long. Please try a shorter input."
          : "Something went wrong generating your text. Please try again.",
      });
    }
  });

  // ========== ADMIN PANEL ==========
  const ADMIN_TOKENS = new Set<string>();

  app.post("/admin/api/login", (req: any, res: any) => {
    const { password } = req.body || {};
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not defined!");
      return res.status(500).json({ ok: false, message: "Server security configuration missing" });
    }

    if (password === adminPassword) {
      const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
      ADMIN_TOKENS.add(token);
      return res.json({ ok: true, token });
    }
    return res.status(401).json({ ok: false });
  });

  function adminAuth(req: any, res: any, next: any) {
    const auth = req.headers.authorization || "";
    const token = auth.replace("Bearer ", "");
    if (!ADMIN_TOKENS.has(token)) return res.status(401).json({ error: "Unauthorized" });
    next();
  }

  app.get("/admin/api/stats", adminAuth, (req: any, res: any) => {
    try {
      const { getStats } = _require("./analytics");
      const stats = getStats();
      res.json(stats || {});
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/admin/api/contact-messages", adminAuth, (req: any, res: any) => {
    try {
      const limit = Number(req.query.limit) || 100;
      const offset = Number(req.query.offset) || 0;
      res.json({ messages: listContactMessages(limit, offset) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/admin/api/track", (req: any, res: any) => {
    try {
      const { trackEvent } = _require("./analytics");
      trackEvent(req.body);
      res.json({ ok: true });
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/admin/api/track-ad", (req: any, res: any) => {
    try {
      const { trackAdClick } = _require("./analytics");
      trackAdClick(req.body);
      res.json({ ok: true });
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/admin", (_req: any, res: any) => {
    const fs = _require("fs");
    const path = _require("path");
    const htmlPath = path.join(process.cwd(), "server", "admin.html");
    // Belt and braces with robots.txt: an X-Robots-Tag keeps the panel out of
    // the index even if the URL is discovered through a link rather than a crawl.
    res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
    res.setHeader("Content-Type", "text/html");
    res.send(fs.readFileSync(htmlPath, "utf8"));
  });
  return httpServer;
}

