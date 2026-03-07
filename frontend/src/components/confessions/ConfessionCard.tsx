"use client";
// src/components/confessions/ConfessionCard.tsx
import { useState, useEffect, useCallback } from "react";
import { ReportModal }    from "./ReportModal";
import { api }            from "@/lib/api";
import { RL }             from "@/lib/rateLimit";
import { useVote }        from "@/hooks/useVote";
import { timeAgo, formatCount } from "@/lib/time";
import { CATEGORY_META, REACTION_META } from "@/types/confession";
import type { Confession, ReactionType, Comment } from "@/types/confession";

const MAX = 280;

interface Props {
  confession: Confession;
  style?:     React.CSSProperties;
}

export function ConfessionCard({ confession, style }: Props) {
  const meta    = CATEGORY_META[confession.category];
  const isLong  = confession.content.length > MAX;

  const [expanded,     setExpanded]     = useState(false);
  const [showReport,   setShowReport]   = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [reactions,    setReactions]    = useState({ ...confession.reactions });
  const [myReaction,   setMyReaction]   = useState<ReactionType | null>(null);

  const { upvotes, downvotes, score, myVote, busy, err: voteErr, vote } = useVote(confession);

  const handleReact = useCallback(async (type: ReactionType) => {
    if (myReaction !== null || !RL.canReact()) return;
    setMyReaction(type);
    setReactions(prev => ({ ...prev, [type]: prev[type] + 1 }));
    try {
      await api.confessions.react(confession.id, type);
    } catch {
      setMyReaction(null);
      setReactions(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
    }
  }, [myReaction, confession.id]);

  const text = isLong && !expanded
    ? confession.content.slice(0, MAX).trimEnd() + "…"
    : confession.content;

  return (
    <>
      <article className="c-card" style={style}>
        {/* Header */}
        <div className="c-card-header">
          <span
            className="c-badge"
            style={{ "--cat-color": meta.color, "--cat-bg": meta.bg } as React.CSSProperties}
          >
            {meta.emoji} {meta.label}
          </span>
          <div className="c-meta">
            <span className="c-meta-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              {formatCount(confession.view_count)}
            </span>
            <time dateTime={confession.created_at}>{timeAgo(confession.created_at)}</time>
          </div>
        </div>

        {/* Content */}
        <div className="c-body">
          <p className="c-text">{text}</p>
          {isLong && (
            <button className="c-expand" onClick={() => setExpanded(e => !e)}>
              {expanded ? "Show less ↑" : "Read more ↓"}
            </button>
          )}
        </div>

        {/* Reactions */}
        <div className="reactions">
          {(Object.keys(REACTION_META) as ReactionType[]).map(type => (
            <button
              key={type}
              className={`reaction-btn ${myReaction === type ? "reacted" : ""}`}
              onClick={() => handleReact(type)}
              disabled={myReaction !== null && myReaction !== type}
              title={REACTION_META[type].label}
            >
              <span className="rx-emoji">{REACTION_META[type].emoji}</span>
              {reactions[type] > 0 && <span className="rx-count">{reactions[type]}</span>}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="c-footer">
          {/* Vote */}
          <div className="vote-row">
            <button
              className={`vote-btn vote-btn--up ${myVote === "up" ? "on" : ""}`}
              onClick={() => vote("up")}
              disabled={busy}
              aria-label="Upvote"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
              {upvotes}
            </button>

            <span className={`score ${score > 0 ? "pos" : score < 0 ? "neg" : ""}`}>
              {score > 0 ? "+" : ""}{score}
            </span>

            <button
              className={`vote-btn vote-btn--down ${myVote === "down" ? "on" : ""}`}
              onClick={() => vote("down")}
              disabled={busy}
              aria-label="Downvote"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7"/>
              </svg>
              {downvotes}
            </button>
          </div>

          {/* Comments toggle */}
          <button
            className="action-btn"
            onClick={() => setShowComments(s => !s)}
            aria-label="Toggle comments"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {confession.comment_count > 0 && confession.comment_count}
          </button>

          {/* Report */}
          <button className="action-btn danger" onClick={() => setShowReport(true)} aria-label="Report" title="Report">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
            </svg>
          </button>

          {voteErr && (
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--red)" }}>{voteErr}</span>
          )}
        </div>

        {/* Comments */}
        {showComments && <CommentsSection confessionId={confession.id} />}
      </article>

      {showReport && <ReportModal id={confession.id} onClose={() => setShowReport(false)} />}
    </>
  );
}

/* ── Comments — useEffect fixed ──────────────────────────────────── */
function CommentsSection({ confessionId }: { confessionId: string }) {
  const [comments,  setComments]  = useState<Comment[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [text,      setText]      = useState("");
  const [posting,   setPosting]   = useState(false);
  const [postErr,   setPostErr]   = useState<string | null>(null);

  // FIXED: was useState, now correctly useEffect
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.confessions.comments(confessionId)
      .then(data => { if (!cancelled) { setComments(data); setLoading(false); } })
      .catch(()   => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [confessionId]);

  async function post() {
    if (!text.trim() || posting) return;
    if (!RL.canComment()) { setPostErr("Too many comments. Wait a moment."); return; }
    setPosting(true); setPostErr(null);
    try {
      const c = await api.confessions.comment(confessionId, text.trim());
      setComments(prev => [c, ...prev]);
      setText("");
    } catch (e: any) {
      setPostErr(e?.message ?? "Failed to post.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="comments-box">
      <div className="comment-input-row">
        <input
          className="comment-input"
          placeholder="Reply anonymously…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && post()}
          maxLength={500}
        />
        <button className="comment-post" onClick={post} disabled={posting || !text.trim()}>
          {posting ? "…" : "Post"}
        </button>
      </div>
      {postErr && <p className="form-err" style={{ marginBottom: 8 }}>{postErr}</p>}

      {loading ? (
        <p className="comments-empty">Loading…</p>
      ) : comments.length === 0 ? (
        <p className="comments-empty">No comments yet. Be the first.</p>
      ) : (
        <div className="comments-list">
          {comments.map(c => (
            <div key={c.id} className="comment-item">
              <p className="comment-text">{c.content}</p>
              <span className="comment-time">{timeAgo(c.created_at)}</span>
              {c.replies?.map(r => (
                <div key={r.id} className="comment-reply">
                  <p className="comment-text">{r.content}</p>
                  <span className="comment-time">{timeAgo(r.created_at)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
