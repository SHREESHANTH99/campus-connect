"use client";
// src/app/clubs/page.tsx
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

const CATS = ["All","Technical","Creative","Business","Sports"];

export default function ClubsPage() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    api.clubs
      .list({ category: cat === "All" ? undefined : cat, search: search || undefined })
      .then((rows) => {
        if (!active) return;
        setItems(rows);
      })
      .catch(() => {
        if (!active) return;
        setItems([]);
      });

    return () => {
      active = false;
    };
  }, [cat, search]);

  const filtered = useMemo(() => {
    return items.map((club) => ({
      ...club,
      initials: club.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      color: "#6366F1",
      textColor: "#818CF8",
      members: club.member_count ?? 0,
      events: club.event_count ?? 0,
      founded: club.founded_year ?? "-",
      isJoined: !!club.is_joined,
    }));
  }, [items]);

  async function toggleJoin(id: string) {
    const snap = [...items];
    setItems((curr) =>
      curr.map((club) =>
        club.id === id
          ? {
              ...club,
              is_joined: !club.is_joined,
              member_count: Math.max(0, (club.member_count ?? 0) + (club.is_joined ? -1 : 1)),
            }
          : club
      )
    );

    try {
      const res = await api.clubs.join(id);
      setItems((curr) =>
        curr.map((club) =>
          club.id === id ? { ...club, is_joined: res.joined, member_count: res.member_count } : club
        )
      );
    } catch {
      setItems(snap);
    }
  }

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
                  onClick={e=>{
                    e.preventDefault();
                    void toggleJoin(club.id);
                  }}
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
