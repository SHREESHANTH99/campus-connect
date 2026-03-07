"use client";
// src/app/login/page.tsx
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const FloatingBlob = dynamic(
  () => import("@/components/3d/FloatingBlob").then(m => ({ default: m.FloatingBlob })),
  { ssr: false, loading: () => null }
);
const ParticleField = dynamic(
  () => import("@/components/3d/ParticleField").then(m => ({ default: m.ParticleField })),
  { ssr: false, loading: () => null }
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <div className="auth-root">
      {/* Left — visual */}
      <div className="auth-visual">
        <div className="auth-canvas-wrap">
          <ParticleField count={80} color="#6366F1" style={{position:"absolute",inset:0,width:"100%",height:"100%"}} />
        </div>
        {/* Center blob */}
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1}}>
          <div style={{width:280,height:280}}>
            <FloatingBlob color="#6366F1" style={{width:"100%",height:"100%"}} />
          </div>
        </div>
        <div className="auth-visual-content">
          <div className="auth-tagline">
            Your campus.<br /><em>No filters.</em>
          </div>
          <p className="auth-sub">
            Connect with your campus community. Discover events, clubs, and opportunities — completely anonymous.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="auth-panel">
        <div>
          <Link href="/" className="auth-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to home
          </Link>
        </div>

        <div className="auth-form-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-hint">Sign in to your anonymous account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label" htmlFor="email">Email address</label>
            <input id="email" type="email" className="field-input" placeholder="you@campus.edu"
              value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="field-input" placeholder="••••••••"
              value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>

          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:"var(--t2)"}}>
              <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}
                style={{accentColor:"var(--indigo)"}} />
              Remember me
            </label>
            <button type="button" style={{background:"none",border:"none",color:"var(--indigo-2)",fontSize:13,cursor:"pointer"}}>
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{width:"100%",justifyContent:"center"}} disabled={loading}>
            {loading ? <><span className="spin" /> Signing in…</> : "Sign In"}
          </button>

          <div className="auth-divider"><span className="auth-divider-text">or continue with</span></div>

          <button type="button" className="btn btn-ghost btn-lg" style={{width:"100%",justifyContent:"center",gap:10}}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </form>

        <p className="auth-switch">
          No account?{" "}
          <Link href="/register" style={{color:"var(--indigo-2)"}}>Create one — it is free</Link>
        </p>
      </div>
    </div>
  );
}
