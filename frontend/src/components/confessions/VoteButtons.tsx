"use client";
// src/components/confessions/VoteButtons.tsx

import { useVote }        from "@/hooks/useVote";
import type { Confession } from "@/types/confession";

interface Props {
  confession: Confession;
  compact?:   boolean;
}

export function VoteButtons({ confession, compact = false }: Props) {
  const { upvotes, downvotes, score, voteState, isVoting, castVote, error } = useVote(confession);

  return (
    <div className={`vote-cluster ${compact ? "vote-cluster--compact" : ""}`}>
      {/* Upvote */}
      <button
        className={`vote-btn vote-btn--up ${voteState === "up" ? "active" : ""}`}
        onClick={() => castVote("up")}
        disabled={isVoting}
        aria-label="Upvote"
        title="Relatable"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
        <span className="vote-count">{upvotes}</span>
      </button>

      {/* Score pill */}
      <span
        className={`score-pill ${score > 0 ? "positive" : score < 0 ? "negative" : ""}`}
        title="Net score"
      >
        {score > 0 ? "+" : ""}{score}
      </span>

      {/* Downvote */}
      <button
        className={`vote-btn vote-btn--down ${voteState === "down" ? "active" : ""}`}
        onClick={() => castVote("down")}
        disabled={isVoting}
        aria-label="Downvote"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
        <span className="vote-count">{downvotes}</span>
      </button>

      {/* Inline error */}
      {error && (
        <span className="vote-error" role="alert">{error}</span>
      )}
    </div>
  );
}
