"use client";
// src/app/chat/page.tsx
import dynamic from "next/dynamic";

const GlowingOrb = dynamic(
  () => import("@/components/3d/GlowingOrb").then(m => ({ default: m.GlowingOrb })),
  { ssr: false, loading: () => null }
);

const MODES = [
  { title:"Study Mode",  desc:"Get matched with someone studying the same subject. Clear doubts, share notes, explain concepts to each other.",    soon:false },
  { title:"Vent Mode",   desc:"Matched with a patient listener. Say what you need to say — stress, anxiety, burnout. Zero judgment.",              soon:false },
  { title:"Fun Mode",    desc:"Casual chat, gaming talk, memes, recommendations. Meet someone interesting without the small talk.",               soon:false },
];

export default function ChatPage() {
  return (
    <div style={{maxWidth:640}}>
      <div className="page-header">
        <span className="eyebrow">Anonymous · Instant · Random</span>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(28px,4vw,44px)",fontWeight:700,color:"var(--t1)",lineHeight:1.0}}>
          Random <em style={{color:"var(--indigo-2)"}}>Chat</em>
        </h1>
        <p style={{color:"var(--t2)",fontSize:14,marginTop:8}}>Instantly matched with another engineering student. Both completely anonymous.</p>
      </div>

      {/* Hero orb */}
      <div style={{height:220,borderRadius:"var(--r-xl)",overflow:"hidden",marginBottom:28,border:"1px solid var(--b2)",position:"relative",background:"radial-gradient(ellipse at 50% 50%,rgba(99,102,241,0.1),transparent)"}}>
        <GlowingOrb style={{position:"absolute",inset:0,width:"100%",height:"100%"}} />
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:2}}>
          <div style={{fontFamily:"var(--mono)",fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--indigo-2)",marginBottom:8}}>Matching Engine</div>
          <div style={{fontFamily:"var(--serif)",fontSize:22,color:"var(--t1)",marginBottom:4}}>Phase 3 Feature</div>
          <div style={{fontSize:13,color:"var(--t3)"}}>WebSocket-powered real-time matching</div>
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {MODES.map(m=>(
          <div key={m.title} className="widget" style={{display:"flex",alignItems:"flex-start",gap:16}}>
            <div style={{width:42,height:42,borderRadius:"var(--r)",background:"var(--indigo-dim)",border:"1px solid var(--indigo-glow)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-2)" strokeWidth="1.7" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"var(--serif)",fontSize:16,fontWeight:600,color:"var(--t1)",marginBottom:4}}>{m.title}</div>
              <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.6}}>{m.desc}</p>
            </div>
            <button className="btn btn-sm btn-primary" style={{opacity:0.5,cursor:"not-allowed"}} disabled>Soon</button>
          </div>
        ))}
      </div>
    </div>
  );
}
