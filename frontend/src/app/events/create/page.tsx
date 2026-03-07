"use client";
// src/app/events/create/page.tsx
import { useState } from "react";
import Link from "next/link";

const CATS = ["Hackathon","Workshop","Sports","Cultural","Tech","Other"];
const STEPS = ["Basic Info","Schedule","Settings"];

export default function CreateEventPage() {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("Hackathon");
  const [location, setLocation] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [capacity, setCapacity] = useState("100");
  const [waitlist, setWaitlist] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div style={{maxWidth:680}}>
      <Link href="/events" className="auth-back" style={{display:"inline-flex",marginBottom:20}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back
      </Link>

      <div className="page-header">
        <span className="eyebrow">New event</span>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(26px,4vw,40px)",fontWeight:700,color:"var(--t1)"}}>
          Create <em style={{color:"var(--indigo-2)"}}>Event</em>
        </h1>
      </div>

      {/* Step indicator */}
      <div style={{display:"flex",gap:0,marginBottom:32,borderBottom:"1px solid var(--b)"}}>
        {STEPS.map((s,i)=>(
          <button key={s} className={`tab ${step===i?"active":""}`} onClick={()=>i<=step&&setStep(i)}>
            <span style={{fontFamily:"var(--mono)",fontSize:10,marginRight:6,opacity:0.6}}>{i+1}</span>
            {s}
          </button>
        ))}
      </div>

      <div className="widget">
        {step === 0 && (
          <div>
            <div className="field-group">
              <label className="field-label">Event Title</label>
              <input className="field-input" placeholder="e.g. Intra-College Hackathon 2025"
                value={title} onChange={e=>setTitle(e.target.value)} />
            </div>
            <div className="field-group">
              <label className="field-label">Description</label>
              <textarea className="field-input" rows={5} style={{resize:"vertical"}}
                placeholder="Describe the event, what attendees can expect, highlights…"
                value={desc} onChange={e=>setDesc(e.target.value)} />
            </div>
            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Category</label>
                <select className="field-input" value={cat} onChange={e=>setCat(e.target.value)}>
                  {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Location</label>
                <input className="field-input" placeholder="e.g. CS Block, Hall A"
                  value={location} onChange={e=>setLocation(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Start Date</label>
                <input type="datetime-local" className="field-input"
                  value={startDate} onChange={e=>setStartDate(e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">End Date</label>
                <input type="datetime-local" className="field-input"
                  value={endDate} onChange={e=>setEndDate(e.target.value)} />
              </div>
            </div>
            <div style={{marginTop:16,padding:"14px 16px",background:"var(--bg-3)",borderRadius:"var(--r)",border:"1px solid var(--b)",fontSize:13,color:"var(--t3)"}}>
              Rich agenda editor (TipTap integration) coming in Phase 3.
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="field-group">
              <label className="field-label">Capacity</label>
              <input type="number" className="field-input" value={capacity} min={1}
                onChange={e=>setCapacity(e.target.value)} />
            </div>
            <div className="toggle-row" style={{borderBottom:"1px solid var(--b)",paddingBottom:14}}>
              <div>
                <div className="toggle-info-title">Public Event</div>
                <div className="toggle-info-desc">Anyone can discover and RSVP</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} />
                <div className="toggle-track" />
              </label>
            </div>
            <div className="toggle-row" style={{paddingTop:14}}>
              <div>
                <div className="toggle-info-title">Allow Waitlist</div>
                <div className="toggle-info-desc">Accept registrations beyond capacity</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={waitlist} onChange={e=>setWaitlist(e.target.checked)} />
                <div className="toggle-track" />
              </label>
            </div>
          </div>
        )}

        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:24,paddingTop:20,borderTop:"1px solid var(--b)"}}>
          {step > 0 && <button className="btn btn-ghost btn-md" onClick={()=>setStep(s=>s-1)}>Back</button>}
          <button className="btn btn-primary btn-md" onClick={()=>step<2?setStep(s=>s+1):alert("Event created!")}>
            {step < 2 ? "Continue" : "Publish Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
