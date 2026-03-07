// src/app/trending/page.tsx
import type { Metadata } from "next";
import Link              from "next/link";

export const metadata: Metadata = { title: "Trending" };

export default function TrendingPage() {
  return (
    <div className="main-content">
      <div className="page-topbar">
        <span className="page-eyebrow">top of the week</span>
        <h1 className="page-title"><em>Trending</em> Now</h1>
        <p className="page-desc">The most viral confessions, polls, and moments from engineering students this week.</p>
      </div>

      <div className="coming-soon">
        <span className="coming-soon-icon">📈</span>
        <div className="coming-soon-title">Trending Dashboard</div>
        <p className="coming-soon-desc">Weekly trending confessions, top memes, hottest polls — all in one place.</p>
        <Link href="/confessions?sort=trending" className="btn-hero" style={{ marginTop: 12 }}>
          See Trending Confessions →
        </Link>
      </div>
    </div>
  );
}
