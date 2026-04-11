"use client";
// src/app/events/[id]/page.tsx
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";

const GlowingOrb = dynamic(
  () => import("@/components/3d/GlowingOrb").then(m => ({ default: m.GlowingOrb })),
  { ssr: false, loading: () => null }
);

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ev, setEv] = useState<any | null>(null);
  const [tab, setTab] = useState("overview");
  const [rsvpd, setRsvpd] = useState(false);

  useEffect(() => {
    let active = true;
    api.events
      .get(id)
      .then((row) => {
        if (!active) return;
        setEv(row);
        setRsvpd(!!row.is_rsvpd);
      })
      .catch(() => {
        if (!active) return;
        setEv(null);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const pct = useMemo(() => {
    if (!ev?.capacity || ev.capacity <= 0) return 0;
    return Math.min(100, Math.round(((ev.attendee_count ?? 0) / ev.capacity) * 100));
  }, [ev]);

  async function toggleRsvp() {
    if (!ev) return;
    const prevRSVP = rsvpd;
    const prevCount = ev.attendee_count ?? 0;

    setRsvpd(!prevRSVP);
    setEv({
      ...ev,
      attendee_count: Math.max(0, prevCount + (prevRSVP ? -1 : 1)),
    });

    try {
      const res = await api.events.rsvp(ev.id);
      setRsvpd(res.attending);
      setEv((curr: any) => ({ ...curr, attendee_count: res.attendee_count }));
    } catch {
      setRsvpd(prevRSVP);
      setEv((curr: any) => ({ ...curr, attendee_count: prevCount }));
    }
  }

  if (!ev) {
    return <div style={{ color: "var(--t3)", fontSize: 14 }}>Loading event...</div>;
  }

  const eventDate = new Date(ev.start_time);
  const dateLabel = Number.isNaN(eventDate.getTime()) ? "TBD" : eventDate.toLocaleDateString();
  const timeLabel = Number.isNaN(eventDate.getTime()) ? "TBD" : eventDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const schedule = Array.isArray(ev.schedule) ? ev.schedule : [];
  const speakers = Array.isArray(ev.speakers) ? ev.speakers : [];
  const tags = Array.isArray(ev.tags) ? ev.tags : [];

  return (
    <div>
      <Link href="/events" className="auth-back" style={{display:"inline-flex",marginBottom:20}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Events
      </Link>

      {/* Hero */}
      <div style={{position:"relative",height:300,borderRadius:"var(--r-xl)",overflow:"hidden",marginBottom:28,border:"1px solid var(--b2)",background:"rgba(99,102,241,.12)"}}>
        <GlowingOrb style={{position:"absolute",inset:0,width:"100%",height:"100%"}} />
        <div style={{position:"absolute",inset:0,background:`linear-gradient(to right,rgba(7,9,15,.9) 40%,transparent)`,zIndex:1}} />
        <div style={{position:"absolute",bottom:32,left:40,zIndex:2,maxWidth:560}}>
          <span className="badge" style={{background:"rgba(99,102,241,.2)",color:"var(--indigo-2)",border:"1px solid rgba(99,102,241,.4)",marginBottom:12,display:"inline-flex"}}>{ev.category}</span>
          <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(26px,4vw,40px)",fontWeight:700,color:"var(--t1)",lineHeight:1.1,marginBottom:14}}>{ev.title}</h1>
          <div style={{display:"flex",flexWrap:"wrap",gap:16,fontFamily:"var(--mono)",fontSize:11,color:"var(--t2)"}}>
            <span>{dateLabel} · {timeLabel}</span>
            <span>{ev.location}</span>
            <span>by organizer</span>
          </div>
        </div>
        <div style={{position:"absolute",top:20,right:32,zIndex:2,display:"flex",gap:10,alignItems:"center"}}>
          {rsvpd && <span className="badge badge-green">You are registered</span>}
          <button className={`btn btn-md ${rsvpd?"btn-ghost":"btn-primary"}`} onClick={() => void toggleRsvp()}>
            {rsvpd ? "Cancel RSVP" : "Register Now"}
          </button>
        </div>
      </div>

      {/* Capacity bar */}
      <div className="widget" style={{marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontFamily:"var(--mono)",fontSize:11}}>
          <span style={{color:"var(--t2)"}}>{ev.attendee_count ?? 0} registered</span>
          <span style={{color:"var(--t3)"}}>{Math.max(0, (ev.capacity ?? 0) - (ev.attendee_count ?? 0))} spots left</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{width:`${pct}%`,background:pct > 80 ? "var(--rose)" : "var(--indigo)"}} />
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
              {tags.map((tag: string)=>(
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
            {schedule.map((s: any,i: number)=>(
              <div key={i} style={{display:"flex",gap:16,paddingBottom:20,position:"relative"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:40,flexShrink:0}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:"var(--indigo)",boxShadow:`0 0 8px var(--indigo-glow)`,flexShrink:0}} />
                  {i < schedule.length-1 && <div style={{width:1,flex:1,background:"var(--b2)",marginTop:4}} />}
                </div>
                <div style={{flex:1,paddingBottom:i < schedule.length-1 ? 8 : 0}}>
                  <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--indigo-2)",marginBottom:4}}>{s.time ?? "TBD"}</div>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--t1)",marginBottom:2}}>{s.title ?? "Session"}</div>
                  {s.speaker && <div style={{fontSize:12,color:"var(--t3)"}}>{s.speaker}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "speakers" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
          {speakers.length === 0 ? (
            <p style={{color:"var(--t3)",fontSize:13,gridColumn:"1/-1",padding:"40px 0",textAlign:"center"}}>No speakers listed for this event.</p>
          ) : speakers.map((sp: any)=>(
            <div key={sp.name ?? sp.role} className="widget" style={{textAlign:"center"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,var(--indigo),var(--violet))",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--serif)",fontSize:22,fontWeight:700,color:"white",margin:"0 auto 14px",boxShadow:"0 0 20px var(--indigo-glow)"}}>
                {(sp.initials ?? "SP").slice(0, 2)}
              </div>
              <div style={{fontFamily:"var(--serif)",fontSize:16,fontWeight:600,color:"var(--t1)",marginBottom:4}}>{sp.name ?? "Speaker"}</div>
              <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)"}}>{sp.role ?? "Guest"}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "attendees" && (
        <div className="widget">
          <div className="widget-title" style={{marginBottom:16}}>{ev.attendee_count ?? 0} Attendees</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(48px,1fr))",gap:8}}>
            {Array.from({length:Math.min(ev.attendee_count ?? 0,48)},(_,i)=>(
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
