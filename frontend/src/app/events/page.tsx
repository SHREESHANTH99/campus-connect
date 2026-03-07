"use client";
// src/app/events/page.tsx
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { EVENTS } from "@/lib/mock-data";

const MiniOrb = dynamic(
  () => import("@/components/3d/GlowingOrb").then(m => ({ default: m.MiniOrb })),
  { ssr: false, loading: () => null }
);

const CATS = ["All","Hackathon","Workshop","Sports","Cultural","Tech"];

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = EVENTS.filter(e =>
    (cat === "All" || e.category === cat) &&
    (!search || e.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="page-header">
        <span className="eyebrow">Campus Events</span>
        <div className="page-header-row">
          <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(28px,4vw,44px)",fontWeight:700,color:"var(--t1)",lineHeight:1.0}}>
            Discover <em style={{color:"var(--indigo-2)"}}>Events</em>
          </h1>
          <Link href="/events/create" className="btn btn-primary btn-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Event
          </Link>
        </div>
      </div>

      <div className="page-toolbar">
        <div className="search-field">
          <svg className="search-icon-abs" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input placeholder="Search events…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {CATS.map(c=>(
            <button key={c} className={`filter-tab ${cat===c?"active":""}`} onClick={()=>setCat(c)}>{c}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{textAlign:"center",padding:"80px 0",color:"var(--t2)"}}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{margin:"0 auto 16px",opacity:0.3}}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <p style={{fontSize:15,marginBottom:12}}>No events found for "{search}"</p>
          <button className="btn btn-ghost btn-sm" onClick={()=>{setSearch("");setCat("All");}}>Clear filters</button>
        </div>
      ) : (
        <div className="events-grid">
          {filtered.map((ev,i)=>(
            <Link key={ev.id} href={`/events/${ev.id}`} style={{textDecoration:"none"}}>
              <div className="event-card" style={{animationDelay:`${i*60}ms`}}>
                <div className="event-card-visual" style={{background:`${ev.color}18`}}>
                  <MiniOrb color={ev.color} style={{position:"absolute",inset:0,width:"100%",height:"100%"}} />
                  <div style={{position:"absolute",inset:0,background:`linear-gradient(to bottom,transparent 30%,${ev.color}20)`,zIndex:1}} />
                  <div className="event-card-badge" style={{zIndex:2}}>
                    <span className="badge" style={{background:`${ev.color}22`,color:ev.color,border:`1px solid ${ev.color}40`}}>{ev.category}</span>
                  </div>
                  {ev.isRSVPd && (
                    <div style={{position:"absolute",top:12,right:12,zIndex:2}}>
                      <span className="badge badge-green">RSVPd</span>
                    </div>
                  )}
                </div>
                <div className="event-card-body">
                  <div className="event-card-title">{ev.title}</div>
                  <div className="event-card-meta">
                    <div className="event-meta-row">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {ev.date}
                    </div>
                    <div className="event-meta-row">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {ev.location}
                    </div>
                  </div>
                  <div className="event-card-footer">
                    <div className="attendees-stack">
                      {["A","B","C"].map((l,i)=>(
                        <div key={i} className="av-mini" style={{background:[ev.color,"#8B5CF6","#F59E0B"][i]}}>{l}</div>
                      ))}
                      <div className="av-count">+{ev.attendees}</div>
                    </div>
                    <button className="btn btn-sm btn-primary" onClick={e=>{e.preventDefault();}}>
                      {ev.isRSVPd ? "Registered" : "RSVP"}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
