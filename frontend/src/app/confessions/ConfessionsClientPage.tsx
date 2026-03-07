"use client";
// src/app/confessions/ConfessionsClientPage.tsx
import dynamic from "next/dynamic";

const FeedList = dynamic(
  () => import("@/components/confessions/FeedList").then(m => ({ default: m.FeedList })),
  { ssr: false, loading: () => (
    <div style={{padding:"40px 0",textAlign:"center",color:"var(--t3)",fontFamily:"var(--mono)",fontSize:12}}>
      Loading confessions…
    </div>
  )}
);

export default function ConfessionsPage() {
  return (
    <div style={{display:"flex",gap:28,alignItems:"flex-start",width:"100%"}}>
      {/* Feed */}
      <div style={{flex:1,minWidth:0}}>
        <div style={{marginBottom:28,paddingBottom:24,borderBottom:"1px solid var(--b)"}}>
          <span className="eyebrow" style={{display:"block",marginBottom:10}}>anonymous · unfiltered</span>
          <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(28px,4vw,44px)",fontWeight:700,color:"var(--t1)",lineHeight:1.0,marginBottom:8}}>
            The Confession <em style={{color:"var(--indigo-2)"}}>Wall</em>
          </h1>
          <p style={{fontSize:14,color:"var(--t2)"}}>Engineering students confessing what they cannot say out loud.</p>
        </div>
        <FeedList />
      </div>

      {/* Right rail */}
      <aside style={{width:280,flexShrink:0,display:"flex",flexDirection:"column",gap:14,position:"sticky",top:96}}>
        <div className="widget">
          <div className="widget-title" style={{marginBottom:14,paddingBottom:12,borderBottom:"1px solid var(--b)"}}>Privacy Guarantee</div>
          {[["Phone","SHA-256 hashed only"],["Author","Never stored"],["IP","Not logged"],["Posts","Author ID hidden"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--b)",fontSize:12}}>
              <span style={{color:"var(--t2)"}}>{k}</span>
              <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--green)"}}>{v}</span>
            </div>
          ))}
        </div>
        <div className="widget">
          <div className="widget-title" style={{marginBottom:14,paddingBottom:12,borderBottom:"1px solid var(--b)"}}>Top Categories</div>
          {["Academics","Professor Roast","Love & Crush","Career Anxiety","Placement Tea"].map(c=>(
            <div key={c} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid var(--b)",fontSize:12}}>
              <span style={{color:"var(--t2)"}}>{c}</span>
              <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--indigo-2)"}}>Trending</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
