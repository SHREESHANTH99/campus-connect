"use client";
// src/hooks/useVote.ts
import { useState, useCallback } from "react";
import { api }                   from "@/lib/api";
import { RL }                    from "@/lib/rateLimit";
import type { Confession, VoteState } from "@/types/confession";

export function useVote(c: Confession) {
  const [upvotes,   setUp]    = useState(c.upvotes);
  const [downvotes, setDown]  = useState(c.downvotes);
  const [myVote,    setMyVote]= useState<VoteState>(null);
  const [busy,      setBusy]  = useState(false);
  const [err,       setErr]   = useState<string | null>(null);

  const vote = useCallback(async (type: "up" | "down") => {
    if (busy) return;
    if (!RL.canVote()) { setErr(`Too fast — wait ${RL.voteCooldown()}s`); return; }
    setErr(null);

    // snapshot
    const prevUp = upvotes, prevDown = downvotes, prevVote = myVote;

    // optimistic
    let nUp = upvotes, nDown = downvotes, nVote: VoteState;
    if (myVote === type) {
      nVote = null;
      if (type === "up") nUp = Math.max(0, nUp - 1); else nDown = Math.max(0, nDown - 1);
    } else {
      nVote = type;
      if (type === "up") { nUp++; if (myVote === "down") nDown = Math.max(0, nDown - 1); }
      else               { nDown++; if (myVote === "up")  nUp   = Math.max(0, nUp   - 1); }
    }
    setUp(nUp); setDown(nDown); setMyVote(nVote);
    setBusy(true);

    try {
      const res = await api.confessions.vote(c.id, type);
      setUp(res.upvotes); setDown(res.downvotes);
    } catch (e: any) {
      setUp(prevUp); setDown(prevDown); setMyVote(prevVote);
      setErr(e?.message ?? "Vote failed");
    } finally { setBusy(false); }
  }, [busy, upvotes, downvotes, myVote, c.id]);

  return { upvotes, downvotes, score: upvotes - downvotes, myVote, busy, err, vote };
}
