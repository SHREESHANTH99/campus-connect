// src/types/confession.ts

export type Category =
  | "academics"
  | "love_crush"
  | "hostel_life"
  | "professor_roast"
  | "campus_secrets"
  | "career_anxiety"
  | "placement_tea"
  | "general";

export type SortMode    = "hot" | "new" | "top" | "trending";
export type ReportReason = "harassment" | "explicit_content" | "spam" | "hate_speech" | "misinformation" | "other";
export type ReactionType = "relatable" | "shocking" | "supportive" | "spicy";
export type VoteState    = "up" | "down" | null;

export interface Reactions {
  relatable:  number;
  shocking:   number;
  supportive: number;
  spicy:      number;
}

export interface Comment {
  id:         string;
  content:    string;
  upvotes:    number;
  downvotes:  number;
  parent_id:  string | null;
  created_at: string;
  replies:    Comment[];
}

export interface Confession {
  id:             string;
  content:        string;
  category:       Category;
  college_id:     string | null;
  score:          number;
  upvotes:        number;
  downvotes:      number;
  view_count:     number;
  comment_count:  number;
  reactions:      Reactions;
  trending_score: number;
  created_at:     string;
  comments?:      Comment[];
}

export interface FeedResponse {
  items:       Confession[];
  next_cursor: string | null;
  total_hint:  number | null;
}

export interface VoteResult {
  score:     number;
  upvotes:   number;
  downvotes: number;
}

export const CATEGORY_META: Record<Category, { label: string; color: string; bg: string; emoji: string }> = {
  academics:       { label: "Academics",       color: "#60A5FA", bg: "rgba(96,165,250,0.1)",  emoji: "📚" },
  love_crush:      { label: "Love & Crush",    color: "#F472B6", bg: "rgba(244,114,182,0.1)", emoji: "💕" },
  hostel_life:     { label: "Hostel Life",     color: "#FB923C", bg: "rgba(251,146,60,0.1)",  emoji: "🏠" },
  professor_roast: { label: "Prof Roast",      color: "#F87171", bg: "rgba(248,113,113,0.1)", emoji: "🔥" },
  campus_secrets:  { label: "Campus Secrets",  color: "#C084FC", bg: "rgba(192,132,252,0.1)", emoji: "🤫" },
  career_anxiety:  { label: "Career Anxiety",  color: "#34D399", bg: "rgba(52,211,153,0.1)",  emoji: "😰" },
  placement_tea:   { label: "Placement Tea",   color: "#FBBF24", bg: "rgba(251,191,36,0.1)",  emoji: "☕" },
  general:         { label: "General",         color: "#94A3B8", bg: "rgba(148,163,184,0.1)", emoji: "💬" },
};

export const SORT_META: Record<SortMode, { label: string; icon: string; desc: string }> = {
  hot:      { label: "Hot",      icon: "🔥", desc: "Score + recency"    },
  new:      { label: "New",      icon: "✨", desc: "Most recent first"   },
  top:      { label: "Top",      icon: "🏆", desc: "Most upvoted"        },
  trending: { label: "Trending", icon: "📈", desc: "Algorithm pick"      },
};

export const REACTION_META: Record<ReactionType, { label: string; emoji: string }> = {
  relatable:  { label: "Relatable",  emoji: "😭" },
  shocking:   { label: "Shocking",   emoji: "😱" },
  supportive: { label: "Supportive", emoji: "🤗" },
  spicy:      { label: "Spicy",      emoji: "🌶️" },
};

export const REPORT_REASONS: Record<ReportReason, string> = {
  harassment:       "Harassment or bullying",
  explicit_content: "Explicit / NSFW content",
  spam:             "Spam or repeated posting",
  hate_speech:      "Hate speech or discrimination",
  misinformation:   "False or misleading info",
  other:            "Something else",
};
