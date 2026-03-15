import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { safeJsonResponse } from "./apiGuard";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const ct = res.headers.get("Content-Type") ?? "";
    if (/^application\/json/i.test(ct)) {
      try {
        const j = await res.json();
        const msg = (j && typeof j === "object" && (j.error ?? j.message)) || res.statusText;
        throw new Error(typeof msg === "string" ? msg : `${res.status}`);
      } catch (e: any) {
        if (e?.message && !e.message.startsWith("{")) throw e;
        throw new Error(`${res.status}: ${res.statusText}`);
      }
    }
    const text = (await res.text()) || res.statusText;
    if (text.trimStart().startsWith("<")) {
      throw new Error("Server returned a page instead of data. The API may be unavailable.");
    }
    throw new Error(`${res.status}: ${text.slice(0, 200) || res.statusText}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await safeJsonResponse<T>(res);
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
