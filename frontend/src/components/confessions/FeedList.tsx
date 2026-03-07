"use client";
// src/components/confessions/FeedList.tsx
import { useEffect, useRef, useState } from "react";
import { useConfessions }              from "@/hooks/useConfessions";
import { ConfessionCard }              from "./ConfessionCard";
import { SkeletonFeed }                from "./SkeletonCard";
import { CreateConfessionModal }       from "./CreateConfessionModal";
import { CATEGORY_META, SORT_META }   from "@/types/confession";
import type { Category, SortMode, Confession } from "@/types/confession";

export function FeedList() {
  const [sort,       setSort]       = useState<SortMode>("hot");
  const [category,   setCategory]   = useState<Category | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newPost,    setNewPost]    = useState<Confession | null>(null);

  const { items, isLoading, isFetching, hasMore, error, loadMore, refresh, prepend } = useConfessions({ sort, category });

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting && hasMore && !isFetching) loadMore(); },
      { rootMargin: "300px" }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [hasMore, isFetching, loadMore]);

  function handlePosted(c: Confession) {
    prepend(c);
    setNewPost(c);
    setTimeout(() => setNewPost(null), 6000);
  }

  const allItems = newPost
    ? [newPost, ...items.filter(c => c.id !== newPost.id)]
    : items;

  return (
    <div style={{ width: "100%" }}>
      {/* Sort tabs */}
      <div className="feed-controls">
        <div className="sort-tabs" role="tablist">
          {(Object.keys(SORT_META) as SortMode[]).map(s => (
            <button
              key={s}
              role="tab"
              className={`sort-tab ${sort === s ? "active" : ""}`}
              onClick={() => setSort(s)}
              aria-selected={sort === s}
              title={SORT_META[s].desc}
            >
              <span className="sort-icon">{SORT_META[s].icon}</span>
              {SORT_META[s].label}
            </button>
          ))}
        </div>
        <button
          className={`icon-btn ${isLoading ? "spinning" : ""}`}
          onClick={refresh}
          disabled={isLoading}
          title="Refresh"
          aria-label="Refresh feed"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
        </button>
      </div>

      {/* Category filter */}
      <div className="cat-bar">
        <button className={`cat-pill ${category === null ? "active" : ""}`} onClick={() => setCategory(null)}>
          All
        </button>
        {(Object.keys(CATEGORY_META) as Category[]).map(cat => (
          <button
            key={cat}
            className={`cat-pill ${category === cat ? "active" : ""}`}
            style={{ "--cat-color": CATEGORY_META[cat].color, "--cat-bg": CATEGORY_META[cat].bg } as React.CSSProperties}
            onClick={() => setCategory(category === cat ? null : cat)}
          >
            {CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}
          </button>
        ))}
      </div>

      {/* New post banner */}
      {newPost && (
        <div className="banner">
          <span>✓ Your confession is live</span>
          <button className="banner-x" onClick={() => setNewPost(null)}>✕</button>
        </div>
      )}

      {/* Feed content */}
      {isLoading ? (
        <SkeletonFeed />
      ) : error ? (
        <div className="feed-err">
          <p>😕 {error}</p>
          <button className="btn-sm" onClick={refresh}>Try again</button>
        </div>
      ) : allItems.length === 0 ? (
        <div className="feed-empty">
          <span className="feed-empty-icon">📭</span>
          <p>No confessions yet{category ? ` in this category` : ""}.</p>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            Be the first to confess
          </button>
        </div>
      ) : (
        <div className="feed-stack">
          {allItems.map((c, i) => (
            <ConfessionCard
              key={c.id}
              confession={c}
              style={{ animationDelay: `${Math.min(i, 8) * 55}ms` }}
            />
          ))}
        </div>
      )}

      {/* Infinite scroll */}
      <div ref={sentinelRef} className="sentinel" />

      {isFetching && (
        <div className="load-more">
          <span className="spin" />
          Loading more…
        </div>
      )}

      {!hasMore && allItems.length > 0 && !isLoading && (
        <div className="feed-end">
          End of feed ·{" "}
          <button className="link-btn" onClick={refresh}>Back to top</button>
        </div>
      )}

      {/* FAB */}
      <button className="fab" onClick={() => setShowCreate(true)} aria-label="Post confession">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Confess
      </button>

      {showCreate && (
        <CreateConfessionModal onClose={() => setShowCreate(false)} onPosted={handlePosted} />
      )}
    </div>
  );
}
