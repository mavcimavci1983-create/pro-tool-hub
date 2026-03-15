/**
 * Converter Web Worker — CSV ↔ JSON, XML → JSON.
 * Keeps main thread responsive for large files.
 */

function parseCSVLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (!inQuotes && (c === "," || c === "\t")) {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur.trim());
  return out;
}

function csvToJson(text: string): string {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) throw new Error("CSV file is empty");
  const headers = parseCSVLine(lines[0]);
  const data = lines.slice(1).map((row) => {
    const values = parseCSVLine(row);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
  return JSON.stringify(data, null, 2);
}

function jsonToCsv(text: string): string {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (e: any) {
    throw new Error(`Invalid JSON: ${e.message ?? "parse error"}`);
  }
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("JSON must be a non-empty array of objects");
  }
  const first = data[0];
  if (first === null || typeof first !== "object" || Array.isArray(first)) {
    throw new Error("Each array item must be an object");
  }
  const headers = Object.keys(first as Record<string, unknown>);
  const rows = (data as Record<string, unknown>[]).map((row) =>
    headers.map((h) => {
      const v = row[h];
      if (v === null || v === undefined) return "";
      const s = String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

function xmlNodeToJson(node: ChildNode): unknown {
  if (node.nodeType === Node.TEXT_NODE) {
    const t = node.textContent?.trim();
    return t ? t : null;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const el = node as Element;
  const tag = el.tagName;
  const childNodes = Array.from(el.childNodes).filter((n) => n.nodeType !== Node.COMMENT_NODE);
  const textOnly = childNodes.every((n) => n.nodeType === Node.TEXT_NODE);
  if (textOnly) {
    const text = el.textContent?.trim() ?? "";
    const attrs: Record<string, string> = {};
    for (const a of Array.from(el.attributes)) attrs[a.name] = a.value;
    if (Object.keys(attrs).length === 0) return text || null;
    return { _: text, ...attrs };
  }
  const obj: Record<string, unknown> = {};
  for (const child of childNodes) {
    const v = xmlNodeToJson(child);
    if (v === null) continue;
    const name = (child as Element).tagName || "_";
    if (obj[name] === undefined) {
      obj[name] = v;
    } else if (Array.isArray(obj[name])) {
      (obj[name] as unknown[]).push(v);
    } else {
      obj[name] = [obj[name], v];
    }
  }
  if (el.attributes.length > 0) {
    for (const a of Array.from(el.attributes)) (obj as Record<string, unknown>)[`@${a.name}`] = a.value;
  }
  return obj;
}

function xmlToJson(text: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    const msg = parseError.textContent?.trim() || "Invalid XML";
    throw new Error(msg);
  }
  const root = doc.documentElement;
  const out = root ? xmlNodeToJson(root) : null;
  return JSON.stringify(out, null, 2);
}

self.onmessage = (e: MessageEvent<{ type: "csv2json" | "json2csv" | "xml2json"; payload: string }>) => {
  const { type, payload } = e.data;
  try {
    let result: string;
    switch (type) {
      case "csv2json":
        result = csvToJson(payload);
        break;
      case "json2csv":
        result = jsonToCsv(payload);
        break;
      case "xml2json":
        result = xmlToJson(payload);
        break;
      default:
        throw new Error(`Unknown type: ${type}`);
    }
    self.postMessage({ result });
  } catch (err: any) {
    self.postMessage({ error: err?.message ?? "Conversion failed" });
  }
};
