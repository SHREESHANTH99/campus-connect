"use client";
// src/hooks/useConfessions.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { api }                                      from "@/lib/api";
import type { Confession, Category, SortMode }      from "@/types/confession";

export function useConfessions(opts: { sort?: SortMode; category?: Category | null; limit?: number } = {}) {
  const { sort = "hot", category = null, limit = 20 } = opts;

  const [items,      setItems]      = useState<Confession[]>([]);
  const [cursor,     setCursor]     = useState<string | null>(null);
  const [hasMore,    setHasMore]    = useState(true);
  const [isLoading,  setIsLoading]  = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (nextCursor: string | null, reset: boolean) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    reset ? setIsLoading(true) : setIsFetching(true);
    setError(null);

    try {
      const data = await api.confessions.feed({
        sort, category: category ?? undefined, cursor: nextCursor ?? undefined, limit,
      });
      setItems(prev => {
        if (reset) return data.items;
        const ids = new Set(prev.map(c => c.id));
        return [...prev, ...data.items.filter(c => !ids.has(c.id))];
      });
      setCursor(data.next_cursor);
      setHasMore(!!data.next_cursor);
    } catch (e: any) {
      if (e.name !== "AbortError") setError(e?.message ?? "Failed to load.");
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [sort, category, limit]);

  useEffect(() => {
    setCursor(null);
    setHasMore(true);
    load(null, true);
  }, [sort, category]);

  const loadMore = useCallback(() => {
    if (!isFetching && !isLoading && hasMore) load(cursor, false);
  }, [isFetching, isLoading, hasMore, cursor, load]);

  const refresh = useCallback(() => {
    setCursor(null);
    setHasMore(true);
    load(null, true);
  }, [load]);

  const upsert = useCallback((id: string, patch: Partial<Confession>) => {
    setItems(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  }, []);

  const prepend = useCallback((c: Confession) => {
    setItems(prev => [c, ...prev.filter(x => x.id !== c.id)]);
  }, []);

  return { items, isLoading, isFetching, hasMore, error, loadMore, refresh, upsert, prepend };
}
