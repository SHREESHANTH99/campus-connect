"use client";
// src/app/profile/page.tsx
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";

const FloatingShapes = dynamic(
  () => import("@/components/3d/FloatingShapes").then(m => ({ default: m.FloatingShapes })),
  { ssr: false, loading: () => null }
);

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);
  const [joinedClubs, setJoinedClubs] = useState<any[]>([]);
  const [rsvpdEvents, setRsvpdEvents] = useState<any[]>([]);
  const [bio, setBio] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      api.profile.me().catch(() => null),
      api.profile.myClubs().catch(() => []),
      api.profile.myEvents().catch(() => []),
      api.notifications.list().catch(() => []),
    ]).then(([me, clubs, events]) => {
      if (!active) return;
      setProfile(me);
      setBio(me?.bio ?? "");
      setJoinedClubs(clubs);
      setRsvpdEvents(events);
    });

    return () => {
      active = false;
    };
  }, []);

  async function saveProfile() {
    const updated = await api.profile.updateMe({ bio });
    setProfile(updated);
    setEditing(false);
  }

  if (!profile) {
    return <div style={{ color: "var(--t3)", fontSize: 14 }}>Loading profile...</div>;
  }

  const initials = (profile.anonymous_username ?? "CC").slice(0, 2).toUpperCase();

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
          <div className="profile-av">{initials}</div>
          <button className="btn btn-ghost btn-sm" onClick={() => (editing ? void saveProfile() : setEditing(true))}>
            {editing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
        <div className="profile-name">{profile.anonymous_username}</div>
        <div className="profile-role">{profile.role} · {profile.branch ?? "Branch"} · {profile.college_id ?? "College"}</div>
        {editing ? (
          <textarea className="field-input" style={{marginTop:12,resize:"vertical",minHeight:80,fontSize:13}}
            value={bio} onChange={e=>setBio(e.target.value)} />
        ) : (
          <p className="profile-bio">{bio}</p>
        )}
        <div style={{display:"flex",gap:20,marginTop:16}}>
          {[{n:profile.karma,l:"Karma"},{n:joinedClubs.length,l:"Clubs"},{n:rsvpdEvents.length,l:"Events"},{n:new Date(profile.created_at).toLocaleDateString(),l:"Joined"}].map(({n,l})=>(
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
                <div style={{width:36,height:36,borderRadius:"var(--r)",background:"rgba(99,102,241,.18)",color:"var(--indigo-2)",border:"1px solid rgba(99,102,241,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,fontFamily:"var(--serif)",fontStyle:"italic"}}>{String(c.name).slice(0,2).toUpperCase()}</div>
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
                <div style={{width:4,height:36,borderRadius:2,background:"var(--indigo)",flexShrink:0}} />
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--t1)"}}>{e.title}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)"}}>{new Date(e.start_time).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Achievements */}
          <div className="widget">
            <div className="widget-header"><div className="widget-title">Status</div></div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[{k:"Role",v:profile.role},{k:"Year",v:profile.year ?? "-"},{k:"Branch",v:profile.branch ?? "-"}].map((a)=>(
                <div key={a.k} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:"var(--bg-3)",borderRadius:"var(--r)",border:"1px solid var(--b)"}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(99,102,241,.2)",border:"1px solid rgba(99,102,241,.3)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-2)" strokeWidth="2" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:"var(--t1)"}}>{a.k}</div>
                    <div style={{fontSize:11,color:"var(--t3)"}}>{a.v}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity timeline */}
          <div className="widget">
            <div className="widget-header"><div className="widget-title">Recent Activity</div></div>
            {rsvpdEvents.slice(0, 4).map(item=>(
              <div key={item.id} className="activity-item">
                <div className="activity-av" style={{background:"rgba(99,102,241,.18)",color:"var(--indigo-2)",border:"1px solid rgba(99,102,241,.25)",fontSize:10}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <div>
                  <div className="activity-text">RSVP'd to {item.title}</div>
                  <div className="activity-time">{new Date(item.start_time).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
