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

const FEATURES = [
  { title: "Confession Wall",      desc: "Post anonymously. React, comment — all without revealing your identity." },
  { title: "Events & RSVPs",       desc: "Discover hackathons, workshops, and cultural fests. One-tap RSVP." },
  { title: "Club Discovery",       desc: "Explore all campus clubs, track their events, and join instantly." },
  { title: "Anonymous Chat",       desc: "Get matched in Study, Vent, or Fun Mode. Zero identity shared." },
  { title: "Live Polls",           desc: "Anonymous campus debates with live vote counts." },
  { title: "Karma & Leaderboard",  desc: "Earn points, unlock badges, climb the anonymous leaderboard." },
];

export default function LandingPage() {
  return (
    <div className="landing-root">
      <section className="hero-section">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="hero-dot" />
            <span className="eyebrow">Engineering Students Only</span>
          </div>
          <h1 className="hero-title">
            Your campus.<br />
            <span className="accent">Unfiltered.</span><br />
            <span className="amber">Anonymous.</span>
          </h1>
          <p className="hero-sub">
            The social platform built exclusively for engineering students.
            Confess without fear. Discover events. Connect anonymously.
          </p>
          <div className="hero-actions">
            <Link href="/dashboard" className="btn btn-primary btn-lg">
              Enter Campus
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/confessions" className="btn btn-ghost btn-lg">View Wall</Link>
          </div>
          <div className="hero-scroll">
            <div className="scroll-line" />
            <span className="scroll-text">Scroll to explore</span>
          </div>
        </div>
        <div className="hero-right">
          <HeroScene />
          <div style={{ position:"absolute",left:0,top:0,width:80,height:"100%",background:"linear-gradient(to right,var(--bg),transparent)",pointerEvents:"none",zIndex:1 }} />
        </div>
      </section>

      <div className="stats-bar">
        {[{num:"12+",lbl:"Features"},{num:"100%",lbl:"Anonymous"},{num:"0",lbl:"Identity Exposed"},{num:"Real",lbl:"Campus Stories"}].map(({num,lbl})=>(
          <div key={lbl} className="stat-cell">
            <span className="stat-num">{num}</span>
            <span className="stat-lbl">{lbl}</span>
          </div>
        ))}
      </div>

      <section className="features-section" style={{position:"relative"}}>
        <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",opacity:0.3}}>
          <FloatingShapes style={{position:"absolute",inset:0}} />
        </div>
        <div className="section-header" style={{position:"relative",zIndex:1}}>
          <span className="eyebrow" style={{display:"block",marginBottom:16}}>What you get</span>
          <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(32px,4vw,52px)",color:"var(--t1)",lineHeight:1.05,fontWeight:700}}>
            Everything you cannot<br /><em style={{color:"var(--indigo-2)"}}>say out loud</em>
          </h2>
        </div>
        <div className="features-grid" style={{position:"relative",zIndex:1}}>
          {FEATURES.map(({title,desc})=>(
            <div key={title} className="feature-cell">
              <div className="feature-icon-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
              </div>
              <div className="feature-title">{title}</div>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{textAlign:"center",padding:"80px 40px",borderTop:"1px solid var(--b)"}}>
        <span className="eyebrow" style={{display:"block",marginBottom:20}}>Get started</span>
        <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(26px,3vw,38px)",color:"var(--t1)",marginBottom:16,maxWidth:480,margin:"0 auto 16px",lineHeight:1.1}}>
          Ready to join the most honest community on campus?
        </h2>
        <p style={{color:"var(--t2)",fontSize:15,margin:"0 auto 36px",maxWidth:400}}>
          Phone OTP only. No names stored. Fully anonymous.
        </p>
        <Link href="/register" className="btn btn-primary btn-lg">
          Create Account
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </section>
    </div>
  );
}
