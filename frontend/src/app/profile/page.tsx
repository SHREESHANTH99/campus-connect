"use client";
// src/app/profile/page.tsx
import { useState } from "react";
import dynamic from "next/dynamic";
import { MOCK_USER, CLUBS, EVENTS, ACTIVITY_FEED, ACHIEVEMENTS } from "@/lib/mock-data";

const FloatingShapes = dynamic(
  () => import("@/components/3d/FloatingShapes").then(m => ({ default: m.FloatingShapes })),
  { ssr: false, loading: () => null }
);

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(MOCK_USER.bio);

  const joinedClubs  = CLUBS.filter(c => c.isJoined);
  const rsvpdEvents  = EVENTS.filter(e => e.isRSVPd);

  return (
    <div>
      {/* Banner */}
      <div className="profile-header">
        <div className="profile-banner-canvas">
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 50%,rgba(99,102,241,0.22),transparent 60%),radial-gradient(ellipse at 70% 30%,rgba(139,92,246,0.12),transparent 60%)"}} />
          <FloatingShapes style={{position:"absolute",inset:0,width:"100%",height:"100%"}} />
        </div>
      </div>

      {/* Profile info */}
      <div className="profile-info">
        <div className="profile-av-row">
          <div className="profile-av">{MOCK_USER.initials}</div>
          <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(e=>!e)}>
            {editing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
        <div className="profile-name">{MOCK_USER.name}</div>
        <div className="profile-role">{MOCK_USER.role} · {MOCK_USER.branch} · {MOCK_USER.college}</div>
        {editing ? (
          <textarea className="field-input" style={{marginTop:12,resize:"vertical",minHeight:80,fontSize:13}}
            value={bio} onChange={e=>setBio(e.target.value)} />
        ) : (
          <p className="profile-bio">{bio}</p>
        )}
        <div style={{display:"flex",gap:20,marginTop:16}}>
          {[{n:MOCK_USER.karma,l:"Karma"},{n:joinedClubs.length,l:"Clubs"},{n:rsvpdEvents.length,l:"Events"},{n:"Aug 2022",l:"Joined"}].map(({n,l})=>(
            <div key={l}>
              <div style={{fontFamily:"var(--serif)",fontSize:18,fontWeight:700,fontStyle:"italic",color:"var(--indigo-2)"}}>{n}</div>
              <div style={{fontFamily:"var(--mono)",fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--t3)"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-tabs">
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Clubs */}
          <div className="widget">
            <div className="widget-header">
              <div className="widget-title">Clubs Joined</div>
            </div>
            {joinedClubs.map(c=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--b)"}}>
                <div style={{width:36,height:36,borderRadius:"var(--r)",background:`${c.color}18`,color:c.textColor,border:`1px solid ${c.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:"var(--serif)",fontStyle:"italic"}}>{c.initials}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--t1)"}}>{c.name}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)"}}>{c.category}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Events */}
          <div className="widget">
            <div className="widget-header">
              <div className="widget-title">Events Attended</div>
            </div>
            {rsvpdEvents.map(e=>(
              <div key={e.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--b)"}}>
                <div style={{width:4,height:36,borderRadius:2,background:e.color,flexShrink:0}} />
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--t1)"}}>{e.title}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)"}}>{e.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Achievements */}
          <div className="widget">
            <div className="widget-header"><div className="widget-title">Achievements</div></div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {ACHIEVEMENTS.map(a=>(
                <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:"var(--bg-3)",borderRadius:"var(--r)",border:"1px solid var(--b)"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:`${a.color}20`,border:`1px solid ${a.color}30`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={a.color} strokeWidth="2" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:"var(--t1)"}}>{a.title}</div>
                    <div style={{fontSize:11,color:"var(--t3)"}}>{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity timeline */}
          <div className="widget">
            <div className="widget-header"><div className="widget-title">Recent Activity</div></div>
            {ACTIVITY_FEED.map(item=>(
              <div key={item.id} className="activity-item">
                <div className="activity-av" style={{background:`${item.color}18`,color:item.color,border:`1px solid ${item.color}25`,fontSize:10}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <div>
                  <div className="activity-text" dangerouslySetInnerHTML={{__html:item.text}} />
                  <div className="activity-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
