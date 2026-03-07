// src/lib/api.ts
import type { FeedResponse, Confession, VoteResult, Comment } from "@/types/confession";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

function token() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cc_token");
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function req<T>(path: string, init: RequestInit = {}, auth = false): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(init.headers as any) };
  if (auth && token()) headers["Authorization"] = `Bearer ${token()}`;
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { msg = (await res.json()).detail ?? msg; } catch {}
    throw new ApiError(res.status, msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  confessions: {
    feed: (p: { sort?: string; category?: string; college_id?: string; cursor?: string; limit?: number }) => {
      const q = new URLSearchParams();
      if (p.sort)       q.set("sort",       p.sort);
      if (p.category)   q.set("category",   p.category);
      if (p.college_id) q.set("college_id", p.college_id);
      if (p.cursor)     q.set("cursor",     p.cursor);
      if (p.limit)      q.set("limit",      String(p.limit));
      return req<FeedResponse>(`/confessions?${q}`);
    },
    get:     (id: string) => req<Confession>(`/confessions/${id}`),
    create:  (body: { content: string; category: string; college_id?: string }) =>
      req<Confession>("/confessions/", { method: "POST", body: JSON.stringify(body) }, true),
    vote:    (id: string, vote_type: string) =>
      req<VoteResult>(`/confessions/${id}/vote`, { method: "POST", body: JSON.stringify({ vote_type }) }, true),
    react:   (id: string, reaction: string) =>
      req(`/confessions/${id}/react`, { method: "POST", body: JSON.stringify({ reaction }) }),
    report:  (id: string, reason: string, description?: string) =>
      req(`/confessions/${id}/report`, { method: "POST", body: JSON.stringify({ reason, description }) }, true),
    weekly:  () => req<Confession[]>("/confessions/trending/weekly"),
    comments: (id: string) => req<Comment[]>(`/confessions/${id}/comments`),
    comment:  (id: string, content: string, parent_id?: string) =>
      req<Comment>(`/confessions/${id}/comments`, { method: "POST", body: JSON.stringify({ content, parent_id }) }, true),
  },
  auth: {
    requestOtp: (phone: string) =>
      req("/auth/request-otp", { method: "POST", body: JSON.stringify({ phone }) }),
    verifyOtp:  (phone: string, otp: string) =>
      req<{ access_token: string; anonymous_username: string; is_new_user: boolean }>(
        "/auth/verify-otp", { method: "POST", body: JSON.stringify({ phone, otp }) }),
    me: () => req<{ id: string; anonymous_username: string; karma: number }>("/auth/me", {}, true),
  },
};
