"use client";
// src/app/events/[id]/page.tsx
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { EVENTS } from "@/lib/mock-data";

const GlowingOrb = dynamic(
  () => import("@/components/3d/GlowingOrb").then(m => ({ default: m.GlowingOrb })),
  { ssr: false, loading: () => null }
);

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const ev = EVENTS.find(e => e.id === id) ?? EVENTS[0];
  const [tab, setTab] = useState("overview");
  const [rsvpd, setRsvpd] = useState(ev.isRSVPd ?? false);

  const pct = Math.round((ev.attendees / ev.capacity) * 100);

  return (
    <div>
      <Link href="/events" className="auth-back" style={{display:"inline-flex",marginBottom:20}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Events
      </Link>

      {/* Hero */}
      <div style={{position:"relative",height:300,borderRadius:"var(--r-xl)",overflow:"hidden",marginBottom:28,border:"1px solid var(--b2)",background:`${ev.color}12`}}>
        <GlowingOrb style={{position:"absolute",inset:0,width:"100%",height:"100%"}} />
        <div style={{position:"absolute",inset:0,background:`linear-gradient(to right,rgba(7,9,15,.9) 40%,transparent)`,zIndex:1}} />
        <div style={{position:"absolute",bottom:32,left:40,zIndex:2,maxWidth:560}}>
          <span className="badge" style={{background:`${ev.color}22`,color:ev.color,border:`1px solid ${ev.color}40`,marginBottom:12,display:"inline-flex"}}>{ev.category}</span>
          <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(26px,4vw,40px)",fontWeight:700,color:"var(--t1)",lineHeight:1.1,marginBottom:14}}>{ev.title}</h1>
          <div style={{display:"flex",flexWrap:"wrap",gap:16,fontFamily:"var(--mono)",fontSize:11,color:"var(--t2)"}}>
            <span>{ev.date} · {ev.time}</span>
            <span>{ev.location}</span>
            <span>by {ev.organizer}</span>
          </div>
        </div>
        <div style={{position:"absolute",top:20,right:32,zIndex:2,display:"flex",gap:10,alignItems:"center"}}>
          {rsvpd && <span className="badge badge-green">You are registered</span>}
          <button className={`btn btn-md ${rsvpd?"btn-ghost":"btn-primary"}`} onClick={()=>setRsvpd(r=>!r)}>
            {rsvpd ? "Cancel RSVP" : "Register Now"}
          </button>
        </div>
      </div>

      {/* Capacity bar */}
      <div className="widget" style={{marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontFamily:"var(--mono)",fontSize:11}}>
          <span style={{color:"var(--t2)"}}>{ev.attendees} registered</span>
          <span style={{color:"var(--t3)"}}>{ev.capacity - ev.attendees} spots left</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{width:`${pct}%`,background:pct > 80 ? "var(--rose)" : ev.color}} />
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {["overview","schedule","speakers","attendees"].map(t=>(
          <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div>
          <div className="widget" style={{marginBottom:16}}>
            <div className="widget-title" style={{marginBottom:12}}>About this event</div>
            <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.75}}>{ev.description}</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:16}}>
              {ev.tags.map(tag=>(
                <span key={tag} className="badge badge-indigo">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "schedule" && (
        <div className="widget">
          <div className="widget-title" style={{marginBottom:20}}>Event Schedule</div>
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {ev.schedule.map((s,i)=>(
              <div key={i} style={{display:"flex",gap:16,paddingBottom:20,position:"relative"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:40,flexShrink:0}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:"var(--indigo)",boxShadow:`0 0 8px var(--indigo-glow)`,flexShrink:0}} />
                  {i < ev.schedule.length-1 && <div style={{width:1,flex:1,background:"var(--b2)",marginTop:4}} />}
                </div>
                <div style={{flex:1,paddingBottom:i < ev.schedule.length-1 ? 8 : 0}}>
                  <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--indigo-2)",marginBottom:4}}>{s.time}</div>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--t1)",marginBottom:2}}>{s.title}</div>
                  {s.speaker && <div style={{fontSize:12,color:"var(--t3)"}}>{s.speaker}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "speakers" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
          {ev.speakers.length === 0 ? (
            <p style={{color:"var(--t3)",fontSize:13,gridColumn:"1/-1",padding:"40px 0",textAlign:"center"}}>No speakers listed for this event.</p>
          ) : ev.speakers.map(sp=>(
            <div key={sp.name} className="widget" style={{textAlign:"center"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,var(--indigo),var(--violet))",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--serif)",fontSize:22,fontWeight:700,color:"white",margin:"0 auto 14px",boxShadow:"0 0 20px var(--indigo-glow)"}}>
                {sp.initials}
              </div>
              <div style={{fontFamily:"var(--serif)",fontSize:16,fontWeight:600,color:"var(--t1)",marginBottom:4}}>{sp.name}</div>
              <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)"}}>{sp.role}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "attendees" && (
        <div className="widget">
          <div className="widget-title" style={{marginBottom:16}}>{ev.attendees} Attendees</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(48px,1fr))",gap:8}}>
            {Array.from({length:Math.min(ev.attendees,48)},(_,i)=>(
              <div key={i} style={{width:48,height:48,borderRadius:"50%",background:`hsl(${(i*37)%360},60%,45%)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--mono)",fontSize:11,color:"white",fontWeight:600}}>
                {String.fromCharCode(65+(i%26))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
