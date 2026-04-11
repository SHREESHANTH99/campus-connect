"use client";
// src/app/clubs/[id]/page.tsx
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";

const FloatingBlob = dynamic(
  () => import("@/components/3d/FloatingBlob").then(m => ({ default: m.FloatingBlob })),
  { ssr: false, loading: () => null }
);

export default function ClubDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<any | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [clubEvents, setClubEvents] = useState<any[]>([]);
  const [tab, setTab] = useState("about");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([api.clubs.get(id), api.clubs.members(id), api.clubs.events(id)])
      .then(([clubResp, membersResp, eventsResp]) => {
        if (!active) return;
        setClub(clubResp);
        setMembers(membersResp);
        setClubEvents(eventsResp);
        setJoined(!!clubResp.is_joined);
      })
      .catch(() => {
        if (!active) return;
        setClub(null);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const ui = useMemo(() => {
    if (!club) return null;
    const initials = club.name
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return {
      ...club,
      initials,
      color: "#6366F1",
      textColor: "#818CF8",
      members: club.member_count ?? 0,
      events: club.event_count ?? 0,
      founded: club.founded_year ?? "-",
      longDesc: club.description,
      lead: "Club Lead",
    };
  }, [club]);

  async function toggleJoin() {
    if (!club) return;
    const prevJoined = joined;
    const prevMembers = club.member_count ?? 0;
    setJoined(!prevJoined);
    setClub({ ...club, member_count: Math.max(0, prevMembers + (prevJoined ? -1 : 1)) });

    try {
      const res = await api.clubs.join(id);
      setJoined(res.joined);
      setClub((curr: any) => ({ ...curr, member_count: res.member_count }));
    } catch {
      setJoined(prevJoined);
      setClub((curr: any) => ({ ...curr, member_count: prevMembers }));
    }
  }

  if (!ui) {
    return <div style={{ color: "var(--t3)", fontSize: 14 }}>Loading club...</div>;
  }

  return (
    <div>
      <Link href="/clubs" className="auth-back" style={{display:"inline-flex",marginBottom:20}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Clubs
      </Link>

      {/* Banner */}
      <div style={{position:"relative",height:220,borderRadius:"var(--r-xl)",overflow:"hidden",marginBottom:0,border:"1px solid var(--b2)",background:`${ui.color}10`}}>
        <div style={{position:"absolute",inset:0}}>
          <FloatingBlob color={ui.color} style={{position:"absolute",inset:0,width:"100%",height:"100%"}} />
        </div>
        <div style={{position:"absolute",inset:0,background:`linear-gradient(to bottom,transparent 40%,rgba(7,9,15,.95))`,zIndex:1}} />
      </div>

      {/* Info strip */}
      <div style={{background:"var(--bg-2)",border:"1px solid var(--b)",borderTop:"none",borderRadius:"0 0 var(--r-xl) var(--r-xl)",padding:"0 32px 24px",marginBottom:24}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",paddingBottom:20}}>
          <div style={{display:"flex",alignItems:"flex-end",gap:16}}>
            <div style={{width:72,height:72,borderRadius:"var(--r-lg)",background:`${ui.color}20`,border:`2px solid var(--bg-2)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--serif)",fontSize:22,fontWeight:700,fontStyle:"italic",color:ui.textColor,marginTop:-36,boxShadow:`0 0 24px ${ui.color}40`}}>
              {ui.initials}
            </div>
            <div>
              <h1 style={{fontFamily:"var(--serif)",fontSize:24,fontWeight:700,color:"var(--t1)",marginBottom:2}}>{ui.name}</h1>
              <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:ui.textColor}}>{ui.category}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {joined && <span className="badge badge-green">Member</span>}
            <button className={`btn btn-md ${joined?"btn-ghost":"btn-primary"}`} onClick={() => void toggleJoin()}>
              {joined ? "Leave Club" : "Join Club"}
            </button>
          </div>
        </div>
        <div style={{display:"flex",gap:24}}>
          {[{n:club.member_count,l:"Members"},{n:club.event_count,l:"Events"},{n:club.founded_year ?? "-",l:"Founded"}].map(({n,l})=>(
            <div key={l}>
              <div style={{fontFamily:"var(--serif)",fontSize:20,fontWeight:700,fontStyle:"italic",color:"var(--t1)"}}>{n}</div>
              <div style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--t3)"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {["about","members","events","gallery"].map(t=>(
          <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "about" && (
        <div className="widget">
          <div className="widget-title" style={{marginBottom:12}}>About {ui.name}</div>
          <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.75,marginBottom:16}}>{ui.longDesc}</p>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",background:"var(--bg-3)",borderRadius:"var(--r)",border:"1px solid var(--b)"}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:`${ui.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:ui.textColor}}>
              CL
            </div>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:"var(--t1)"}}>{ui.lead}</div>
              <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)"}}>Club Lead</div>
            </div>
          </div>
        </div>
      )}

      {tab === "members" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
          {members.map(m=>(
            <div key={m.user_id} className="widget" style={{textAlign:"center"}}>
              <div style={{width:52,height:52,borderRadius:"50%",background:`${ui.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--serif)",fontSize:18,fontWeight:700,color:ui.textColor,margin:"0 auto 12px"}}>
                {String(m.anonymous_username ?? "U").slice(0, 2).toUpperCase()}
              </div>
              <div style={{fontSize:13,fontWeight:600,color:"var(--t1)",marginBottom:2}}>{m.anonymous_username}</div>
              <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)"}}>Member</div>
            </div>
          ))}
          {members.length === 0 && <div style={{color:"var(--t3)",fontSize:13}}>No members available.</div>}
        </div>
      )}

      {tab === "events" && (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {clubEvents.map(ev=>(
            <Link key={ev.id} href={`/events/${ev.id}`} style={{textDecoration:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",background:"var(--bg-2)",borderRadius:"var(--r-lg)",border:"1px solid var(--b)",transition:"border-color .15s"}}
                onMouseEnter={e=>(e.currentTarget.style.borderColor="var(--b2)")}
                onMouseLeave={e=>(e.currentTarget.style.borderColor="var(--b)")}>
                <div style={{width:4,height:40,borderRadius:2,background:"var(--indigo)",flexShrink:0}} />
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:"var(--t1)",marginBottom:3}}>{ev.title}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)"}}>{new Date(ev.start_time).toLocaleDateString()}</div>
                </div>
                <span className="badge" style={{background:"rgba(99,102,241,.2)",color:"var(--indigo-2)",border:"1px solid rgba(99,102,241,.3)"}}>{ev.category}</span>
              </div>
            </Link>
          ))}
          {clubEvents.length === 0 && <div style={{color:"var(--t3)",fontSize:13}}>No events for this club yet.</div>}
        </div>
      )}

      {tab === "gallery" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8}}>
          {Array.from({length:9},(_,i)=>(
            <div key={i} style={{height:160,borderRadius:"var(--r-md)",background:`${[ui.color,"#8B5CF6","#F59E0B","#10B981","#F43F5E","#06B6D4"][i%6]}${["18","14","1a","12","10","16"][i%6]}`,border:"1px solid var(--b)",cursor:"pointer",transition:"transform .2s",display:"flex",alignItems:"center",justifyContent:"center"}}
              onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.03)")}
              onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{opacity:0.3}}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
