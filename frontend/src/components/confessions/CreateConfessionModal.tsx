"use client";
// src/components/confessions/CreateConfessionModal.tsx
import { useState, useEffect, useRef } from "react";
import { api }              from "@/lib/api";
import { RL }               from "@/lib/rateLimit";
import { CATEGORY_META }    from "@/types/confession";
import type { Category, Confession } from "@/types/confession";

const CATS = Object.keys(CATEGORY_META) as Category[];
const MAX  = 2000;
const MIN  = 10;

interface Props {
  onClose:  () => void;
  onPosted: (c: Confession) => void;
}

export function CreateConfessionModal({ onClose, onPosted }: Props) {
  const [content,  setContent]  = useState("");
  const [category, setCategory] = useState<Category>("general");
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { taRef.current?.focus(); }, []);

  // Escape to close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // Cooldown timer
  useEffect(() => {
    const s = RL.postCooldown();
    if (s <= 0) return;
    setCooldown(s);
    const id = setInterval(() => setCooldown(x => { if (x <= 1) { clearInterval(id); return 0; } return x - 1; }), 1000);
    return () => clearInterval(id);
  }, []);

  async function post() {
    const trimmed = content.trim();
    if (trimmed.length < MIN) { setErr("Write at least 10 characters."); return; }
    if (!RL.canPost()) { const s = RL.postCooldown(); setErr(`Wait ${s}s before posting again.`); setCooldown(s); return; }
    setLoading(true); setErr(null);
    try {
      const c = await api.confessions.create({ content: trimmed, category });
      onPosted(c);
      onClose();
    } catch (e: any) {
      setErr(e?.message ?? "Failed to post. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const len      = content.length;
  const left     = MAX - len;
  const isOver   = len > MAX;
  const isWarn   = len >= 1800 && !isOver;
  const canPost  = len >= MIN && !isOver && !loading && cooldown === 0;

  const fillPct  = Math.min(100, (len / MAX) * 100);
  const fillColor = isOver ? "var(--red)" : isWarn ? "var(--a)" : "var(--green)";

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-create" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h2 className="modal-title">Post Anonymously</h2>
            <p className="modal-sub">Your identity is fully protected — no names, no faces, ever.</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Category */}
        <label className="fl">Category</label>
        <div className="cat-grid" style={{ marginBottom: 20 }}>
          {CATS.map(cat => {
            const m = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                type="button"
                className={`cat-chip ${category === cat ? "sel" : ""}`}
                style={{ "--cat-color": m.color, "--cat-bg": m.bg } as React.CSSProperties}
                onClick={() => setCategory(cat)}
              >
                {m.emoji} {m.label}
              </button>
            );
          })}
        </div>

        {/* Textarea */}
        <label className="fl" htmlFor="cc-text">Your confession</label>
        <textarea
          id="cc-text"
          ref={taRef}
          className={`textarea ${isOver ? "over" : ""}`}
          placeholder="What's on your mind? Professors, crushes, exams, placements — share it all…"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={6}
        />
        <div className="char-row">
          <span className={`char-count ${isOver ? "over" : isWarn ? "warn" : ""}`}>
            {isOver ? `${Math.abs(left)} over limit` : `${left} remaining`}
          </span>
          <div className="char-bar">
            <div className="char-fill" style={{ width: `${fillPct}%`, background: fillColor }} />
          </div>
        </div>

        {/* Privacy note */}
        <div className="privacy-row">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Your phone hash is never stored alongside your posts.
        </div>

        {cooldown > 0 && (
          <div className="cooldown-row">⏳ Next post available in <strong>{cooldown}s</strong></div>
        )}

        {err && <p className="form-err">{err}</p>}

        <div className="modal-actions">
          <button className="btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn-primary" onClick={post} disabled={!canPost}>
            {loading
              ? <><span className="spin" /> Posting…</>
              : cooldown > 0
              ? `Wait ${cooldown}s`
              : "Post Confession"}
          </button>
        </div>
      </div>
    </div>
  );
}
