"use client";
// src/app/clubs/page.tsx
import { useState } from "react";
import Link from "next/link";
import { CLUBS } from "@/lib/mock-data";

const CATS = ["All","Technical","Creative","Business","Sports"];

export default function ClubsPage() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = CLUBS.filter(c =>
    (cat === "All" || c.category === cat) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="page-header">
        <span className="eyebrow">Campus Clubs</span>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(28px,4vw,44px)",fontWeight:700,color:"var(--t1)",lineHeight:1.0}}>
          Explore <em style={{color:"var(--indigo-2)"}}>Clubs</em>
        </h1>
      </div>

      <div className="page-toolbar">
        <div className="search-field">
          <svg className="search-icon-abs" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input placeholder="Search clubs…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {CATS.map(c=>(
            <button key={c} className={`filter-tab ${cat===c?"active":""}`} onClick={()=>setCat(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="clubs-grid">
        {filtered.map((club,i)=>(
          <Link key={club.id} href={`/clubs/${club.id}`} style={{textDecoration:"none"}}>
            <div className="club-card" style={{animationDelay:`${i*60}ms`}}>
              <div className="club-card-header">
                <div className="club-logo" style={{background:`${club.color}18`,color:club.textColor,border:`1px solid ${club.color}30`}}>
                  {club.initials}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="club-name">{club.name}</div>
                  <div className="club-category">{club.category}</div>
                  {club.isJoined && <span className="badge badge-green" style={{marginTop:4,display:"inline-flex"}}>Joined</span>}
                </div>
                <button
                  className={`btn btn-sm ${club.isJoined?"btn-ghost":"btn-primary"}`}
                  style={{flexShrink:0}}
                  onClick={e=>{e.preventDefault();}}
                >
                  {club.isJoined ? "Joined" : "Join"}
                </button>
              </div>
              <p className="club-desc">{club.description}</p>
              <div className="club-stats">
                <div className="club-stat">
                  <span className="club-stat-num">{club.members}</span>
                  <span className="club-stat-lbl">Members</span>
                </div>
                <div className="club-stat">
                  <span className="club-stat-num">{club.events}</span>
                  <span className="club-stat-lbl">Events</span>
                </div>
                <div className="club-stat">
                  <span className="club-stat-num">{club.founded}</span>
                  <span className="club-stat-lbl">Founded</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
