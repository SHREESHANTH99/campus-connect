"use client";
// src/app/page.tsx
import Link from "next/link";
import dynamic from "next/dynamic";

const HeroScene = dynamic(
  () => import("@/components/3d/FloatingBlob").then(m => ({ default: m.HeroScene })),
  { ssr: false, loading: () => null }
);
const FloatingShapes = dynamic(
  () => import("@/components/3d/FloatingShapes").then(m => ({ default: m.FloatingShapes })),
  { ssr: false, loading: () => null }
);
const ParticleField = dynamic(
  () => import("@/components/3d/ParticleField").then(m => ({ default: m.ParticleField })),
  { ssr: false, loading: () => null }
);

const FEATURES = [
  { title: "Confession Wall",      desc: "Post anonymously, react in real-time, and join comment threads safely.", tone: "indigo" },
  { title: "Events Radar",         desc: "Track hackathons, workshops, and fests with one-tap RSVP reminders.", tone: "amber" },
  { title: "Club Discovery",       desc: "Find active clubs, follow updates, and jump into campus communities fast.", tone: "cyan" },
  { title: "Anonymous Match Chat", desc: "Switch between Study, Vent, and Fun modes with zero identity exposure.", tone: "violet" },
  { title: "Live Poll Arena",      desc: "Start debates and watch crowd sentiment update live on every vote.", tone: "indigo" },
  { title: "Karma Ladder",         desc: "Earn trust points and rise on the leaderboard through positive impact.", tone: "amber" },
];

const METRICS = [
  { num: "12+", lbl: "Core modules" },
  { num: "24/7", lbl: "Live activity" },
  { num: "100%", lbl: "Anonymous mode" },
  { num: "0", lbl: "Identity leaks" },
];

export default function LandingPage() {
  return (
    <div className="landing-root">
      <div className="landing-bg-layer landing-bg-layer-a" />
      <div className="landing-bg-layer landing-bg-layer-b" />

      <section className="hero-section">
        <div className="hero-backdrop-grid" />
        <div className="hero-particles">
          <ParticleField count={140} color="#818CF8" />
        </div>

        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="hero-dot" />
            <span className="eyebrow">NyxWall Neural Space</span>
          </div>

          <h1 className="hero-title">
            Campus social,
            <br />
            <span className="accent">reimagined in 3D.</span>
            <br />
            <span className="amber">Private by default.</span>
          </h1>

          <p className="hero-sub">
            A cinematic space for confessions, chat, clubs, and live polls.
            Designed for engineering campuses where expression stays anonymous
            and discovery feels alive.
          </p>

          <div className="hero-actions">
            <Link href="/dashboard" className="btn btn-primary btn-lg">
              Launch Dashboard
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/confessions" className="btn btn-ghost btn-lg">Explore Feed</Link>
          </div>

          <div className="hero-signals">
            <div className="signal-pill">Confessions</div>
            <div className="signal-pill">Clubs</div>
            <div className="signal-pill">Events</div>
            <div className="signal-pill">Polls</div>
          </div>

          <div className="hero-scroll">
            <div className="scroll-line" />
            <span className="scroll-text">Shift into exploration</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-main-canvas">
            <HeroScene />
          </div>
          <div className="hero-gradient-mask" />
        </div>
      </section>

      <div className="stats-bar">
        {METRICS.map(({num,lbl})=>(
          <div key={lbl} className="stat-cell">
            <span className="stat-num">{num}</span>
            <span className="stat-lbl">{lbl}</span>
          </div>
        ))}
      </div>

      <section className="features-section">
        <div className="features-canvas-overlay">
          <FloatingShapes style={{position:"absolute",inset:0}} />
        </div>

        <div className="section-header">
          <span className="eyebrow">Platform systems</span>
          <h2 className="section-title">
            Every interaction tuned for
            <br />
            <em>anonymous campus energy</em>
          </h2>
        </div>

        <div className="features-grid">
          {FEATURES.map(({title,desc,tone})=>(
            <div key={title} className={`feature-cell tone-${tone}`}>
              <div className="feature-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
              </div>
              <div className="feature-title">{title}</div>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-cta-panel">
          <span className="eyebrow">Get started</span>
          <h2>Ready to enter the most honest digital zone on campus?</h2>
          <p>Phone OTP only. No real names. Built to keep identity separate from expression.</p>
          <div className="landing-cta-actions">
            <Link href="/register" className="btn btn-primary btn-lg">
              Create Account
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/login" className="btn btn-ghost btn-lg">I already have access</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
