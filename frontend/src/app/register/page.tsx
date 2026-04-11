"use client";
// src/app/register/page.tsx
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const RotatingRings = dynamic(
  () => import("@/components/3d/FloatingShapes").then(m => ({ default: m.RotatingRings })),
  { ssr: false, loading: () => null }
);

const ROLES = [
  { id:"student",   label:"Student",          desc:"Attend events, join clubs, confess" },
  { id:"club_admin",label:"Club Admin",        desc:"Manage a club and post events"      },
  { id:"organizer", label:"Event Organizer",   desc:"Create and manage campus events"    },
];

function strengthLabel(p: string): { pct: number; color: string; label: string } {
  if (!p) return { pct: 0, color: "var(--b2)", label: "" };
  const checks = [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)];
  const n = checks.filter(Boolean).length;
  if (n <= 1) return { pct: 25, color: "var(--rose)",   label: "Weak"   };
  if (n === 2) return { pct: 50, color: "var(--amber)",  label: "Fair"   };
  if (n === 3) return { pct: 75, color: "var(--indigo)", label: "Good"   };
  return             { pct: 100, color: "var(--green)",  label: "Strong" };
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const strength = strengthLabel(password);

  function next(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) { setStep(s => s + 1); return; }
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <div className="auth-root">
      <div className="auth-visual">
        <div className="auth-canvas-wrap">
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 40%,rgba(99,102,241,0.18),transparent 70%)"}} />
        </div>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1}}>
          <div style={{width:300,height:300}}>
            <RotatingRings style={{width:"100%",height:"100%"}} />
          </div>
        </div>
        <div className="auth-visual-content">
          <div className="auth-tagline">
            Join the most <em>honest</em> campus.
          </div>
          <p className="auth-sub">
            Phone OTP verification. No real names stored anywhere. Your identity stays yours.
          </p>
        </div>
      </div>

      <div className="auth-panel">
        <div>
          <Link href="/login" className="auth-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to login
          </Link>
        </div>

        <div className="auth-form-header">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-hint">Step {step} of 3 — {["Basic info","Set password","Your role"][step-1]}</p>
        </div>

        <div className="step-indicator">
          {[1,2,3].map(n=>(
            <div key={n} className={`step-dot ${n < step ? "done" : n === step ? "active" : ""}`} />
          ))}
        </div>

        <form onSubmit={next}>
          {step === 1 && (
            <>
              <div className="field-row">
                <div className="field-group">
                  <label className="field-label">First name</label>
                  <input className="field-input" placeholder="Aryan" value={name.split(" ")[0]}
                    onChange={e=>setName(e.target.value+" "+(name.split(" ")[1]||""))} required />
                </div>
                <div className="field-group">
                  <label className="field-label">Last name</label>
                  <input className="field-input" placeholder="Sharma"
                    onChange={e=>setName((name.split(" ")[0]||"")+" "+e.target.value)} required />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">College email</label>
                <input type="email" className="field-input" placeholder="you@campus.edu"
                  value={email} onChange={e=>setEmail(e.target.value)} required />
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="field-group">
                <label className="field-label">Password</label>
                <input type="password" className="field-input" placeholder="Create a strong password"
                  value={password} onChange={e=>setPassword(e.target.value)} required />
                {password && (
                  <>
                    <div className="progress-bar" style={{marginTop:8}}>
                      <div className="progress-fill" style={{width:`${strength.pct}%`,background:strength.color}} />
                    </div>
                    <div style={{fontFamily:"var(--mono)",fontSize:10,color:strength.color,marginTop:4}}>
                      {strength.label} password
                    </div>
                  </>
                )}
              </div>
              <div className="field-group">
                <label className="field-label">Confirm password</label>
                <input type="password" className={`field-input ${confirm && confirm !== password ? "err" : ""}`}
                  placeholder="Repeat password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
                {confirm && confirm !== password && <p className="form-err">Passwords do not match</p>}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <p style={{fontSize:13,color:"var(--t2)",marginBottom:16}}>How will you use NyxWall?</p>
              <div className="role-cards">
                {ROLES.map(r=>(
                  <div key={r.id} className={`role-card ${role===r.id?"selected":""}`} onClick={()=>setRole(r.id)}>
                    <div className="role-card-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    </div>
                    <div className="role-card-title">{r.label}</div>
                    <div className="role-card-desc">{r.desc}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary btn-lg" style={{width:"100%",justifyContent:"center",marginTop:8}} disabled={loading}>
            {loading ? <><span className="spin" /> Creating…</> : step < 3 ? "Continue" : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link href="/login" style={{color:"var(--indigo-2)"}}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
