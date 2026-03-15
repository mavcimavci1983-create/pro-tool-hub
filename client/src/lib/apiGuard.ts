/**
 * API response guard — ensures we never parse HTML as JSON (prevents "Unexpected token <").
 * Use for all /api fetch calls so invalid or 404 HTML responses become a clear error.
 */

const JSON_CONTENT_TYPE = /^application\/json(\s*;|$)/i;

export async function safeJsonResponse<T = unknown>(res: Response): Promise<T> {
  const contentType = res.headers.get("Content-Type") ?? "";
  if (!JSON_CONTENT_TYPE.test(contentType)) {
    const text = await res.text();
    if (text.trimStart().startsWith("<")) {
      throw new Error("Server returned a page instead of data. The API may be unavailable or the URL may be wrong.");
    }
    throw new Error(res.ok ? "Invalid response format." : `Error ${res.status}: ${text.slice(0, 200) || res.statusText}`);
  }
  try {
    return (await res.json()) as T;
  } catch {
    throw new Error("Invalid JSON in response.");
  }
}

export async function fetchApi(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const res = await fetch(url, { credentials: "include", ...options });
  return res;
}

/**
 * fetch + safeJsonResponse in one. Use for GET /api/... when you expect JSON.
 * Throws if response is not OK or body is not JSON (e.g. HTML 404).
 */
export async function fetchApiJson<T = { error?: string }>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", ...options });
  const data = await safeJsonResponse<T>(res);
  if (!res.ok) {
    const msg = (data && typeof data === "object" && "error" in data && data.error) || res.statusText || "Request failed";
    throw new Error(typeof msg === "string" ? msg : "Request failed");
  }
  return data;
}
