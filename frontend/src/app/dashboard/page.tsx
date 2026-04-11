"use client";
// src/app/dashboard/page.tsx
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";

const GlowingOrb = dynamic(
  () => import("@/components/3d/GlowingOrb").then(m => ({ default: m.GlowingOrb })),
  { ssr: false, loading: () => null }
);

const ICON_COLORS = ["#6366F1","#8B5CF6","#10B981","#F59E0B"];

function categoryColor(category: string) {
  const map: Record<string, string> = {
    Hackathon: "#6366F1",
    Workshop: "#06B6D4",
    Sports: "#10B981",
    Cultural: "#F59E0B",
    Tech: "#8B5CF6",
  };
  return map[category] ?? "#818CF8";
}

export default function DashboardPage() {
  const [me, setMe] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [confessions, setConfessions] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.profile.me().catch(() => null),
      api.events.list({ limit: 4 }).catch(() => []),
      api.clubs.list({ limit: 20 }).catch(() => []),
      api.notifications.list().catch(() => []),
      api.confessions.feed({ limit: 20 }).catch(() => ({ items: [] })),
    ]).then(([meResp, eventsResp, clubsResp, notifResp, confResp]) => {
      if (!active) return;
      setMe(meResp);
      setEvents(eventsResp);
      setClubs(clubsResp);
      setNotifs(notifResp);
      setConfessions(confResp.items ?? []);
    });

    return () => {
      active = false;
    };
  }, []);

  const upcoming = useMemo(
    () =>
      events.map((ev) => ({
        ...ev,
        color: categoryColor(ev.category),
        date: new Date(ev.start_time).toLocaleDateString(),
        isRSVPd: !!ev.is_rsvpd,
      })),
    [events]
  );

  const stats = useMemo(
    () => [
      { label: "Upcoming Events", value: String(events.length), trend: "+live", up: true },
      { label: "Joined Clubs", value: String(clubs.length), trend: "+live", up: true },
      { label: "Unread Alerts", value: String(notifs.filter((n) => !n.is_read).length), trend: "auto", up: null },
      { label: "Karma", value: String(me?.karma ?? 0), trend: "+0", up: true },
    ],
    [events.length, clubs.length, notifs, me?.karma]
  );

  const activity = useMemo(
    () =>
      notifs.slice(0, 5).map((n) => ({
        id: n.id,
        text: n.title,
        time: new Date(n.created_at).toLocaleString(),
        color: "#6366F1",
      })),
    [notifs]
  );

  return (
    <div>
      {/* Hero banner */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-canvas">
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 50%,rgba(99,102,241,0.25),transparent 60%),radial-gradient(ellipse at 80% 30%,rgba(139,92,246,0.15),transparent 60%)"}} />
          <div style={{position:"absolute",right:0,top:0,width:"40%",height:"100%"}}>
            <GlowingOrb style={{width:"100%",height:"100%"}} />
          </div>
        </div>
        <div className="dashboard-hero-content">
          <div className="dashboard-greeting">
            Good evening, <em>{(me?.anonymous_username ?? "Student").split("_")[0]}</em>
          </div>
          <div className="dashboard-date">
            {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
          </div>
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <Link href="/confessions" className="btn btn-sm btn-primary">View Confessions</Link>
            <Link href="/events" className="btn btn-sm btn-ghost">Browse Events</Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s,i)=>(
          <div key={s.label} className="stat-card">
            <div className="stat-card-top">
              <div className="stat-card-icon" style={{background:`${ICON_COLORS[i]}18`}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ICON_COLORS[i]} strokeWidth="1.8" strokeLinecap="round">
                  <path d={["M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z","M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z","M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11","M18 20V10M12 20V4M6 20v-6"][i]} />
                </svg>
              </div>
              {s.up !== null && (
                <span className={`stat-card-trend ${s.up?"trend-up":"trend-down"}`}>{s.trend}</span>
              )}
            </div>
            <div className="stat-card-value">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Two-col: Upcoming Events + Activity Feed */}
      <div className="dashboard-two-col">
        {/* Upcoming Events */}
        <div className="widget">
          <div className="widget-header">
            <div className="widget-title">Upcoming Events</div>
            <Link href="/events" className="widget-link">View all</Link>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {upcoming.map(ev=>(
              <Link key={ev.id} href={`/events/${ev.id}`} style={{textDecoration:"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:14,padding:"10px 12px",background:"var(--bg-3)",borderRadius:"var(--r)",border:"1px solid var(--b)",transition:"all .15s",cursor:"pointer"}}
                  onMouseEnter={e=>(e.currentTarget.style.borderColor="var(--b2)")}
                  onMouseLeave={e=>(e.currentTarget.style.borderColor="var(--b)")}>
                  <div style={{width:4,height:36,borderRadius:2,background:ev.color,flexShrink:0}} />
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--t1)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>{ev.title}</div>
                    <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)"}}>{ev.date} — {ev.location}</div>
                  </div>
                  {ev.isRSVPd && <span className="badge badge-green">RSVPd</span>}
                  <span className="badge badge-indigo" style={{fontSize:9}}>{ev.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="widget">
          <div className="widget-header">
            <div className="widget-title">Activity</div>
          </div>
          <div>
            {activity.map(item=>(
              <div key={item.id} className="activity-item">
                <div className="activity-av" style={{background:`${item.color}18`,color:item.color,border:`1px solid ${item.color}30`}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                </div>
                <div>
                  <div className="activity-text">{item.text}</div>
                  <div className="activity-time">{item.time}</div>
                </div>
              </div>
            ))}
            {activity.length === 0 && <div style={{color:"var(--t3)",fontSize:13}}>No recent activity yet.</div>}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="widget">
        <div className="widget-header">
          <div className="widget-title">Quick Actions</div>
        </div>
        <div className="quick-actions">
          {[
            {label:"Post Confession",href:"/confessions"},
            {label:"Browse Events",  href:"/events"},
            {label:"Explore Clubs",  href:"/clubs"},
            {label:"Random Chat",    href:"/chat"},
            {label:"View Polls",     href:"/polls"},
            {label:"Leaderboard",    href:"/leaderboard"},
          ].map(({label,href})=>(
            <Link key={label} href={href} style={{textDecoration:"none"}}>
              <div className="qa-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                {label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
