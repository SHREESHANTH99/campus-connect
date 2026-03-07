"use client";
// src/app/leaderboard/page.tsx

const TOP = [
  {rank:1,name:"shadow_monk",karma:8420,badge:"Legend",     color:"#F59E0B"},
  {rank:2,name:"byte_ninja",  karma:6180,badge:"Hackathon Hero",color:"#6366F1"},
  {rank:3,name:"neon_owl",    karma:5340,badge:"Night Owl",  color:"#8B5CF6"},
  {rank:4,name:"anon_443",    karma:4890,badge:"Contributor",color:"#10B981"},
  {rank:5,name:"coder_x",     karma:4220,badge:"Club Builder",color:"#F43F5E"},
  {rank:6,name:"ghost_7",     karma:3810,badge:"Meme Lord",  color:"#06B6D4"},
  {rank:7,name:"zero_cool",   karma:3560,badge:"Contributor",color:"#10B981"},
  {rank:8,name:"node_17",     karma:3240,badge:"Early Adopter",color:"#F59E0B"},
  {rank:9,name:"null_ptr",    karma:2980,badge:"Contributor",color:"#10B981"},
  {rank:10,name:"aryan_s",   karma:2840,badge:"Hackathon Hero",color:"#6366F1",isYou:true},
];

const RANK_COLORS = ["#F59E0B","#94A3B8","#CD7F32"];

export default function LeaderboardPage() {
  return (
    <div style={{maxWidth:720}}>
      <div className="page-header">
        <span className="eyebrow">Anonymous Rankings</span>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(28px,4vw,44px)",fontWeight:700,color:"var(--t1)",lineHeight:1.0}}>
          Leader<em style={{color:"var(--indigo-2)"}}>board</em>
        </h1>
        <p style={{color:"var(--t2)",fontSize:14,marginTop:8}}>Top contributors this week. All anonymous. Reputation without identity.</p>
      </div>

      {/* Podium */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.2fr 1fr",gap:8,marginBottom:24,alignItems:"flex-end"}}>
        {[TOP[1],TOP[0],TOP[2]].map((u,i)=>{
          const heights = ["140px","180px","120px"];
          const labels = ["2nd","1st","3rd"];
          return (
            <div key={u.rank} style={{background:"var(--bg-2)",border:"1px solid var(--b2)",borderRadius:"var(--r-lg)",padding:"20px 14px",textAlign:"center",height:heights[i],display:"flex",flexDirection:"column",justifyContent:"flex-end",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 0%,${RANK_COLORS[i]}12,transparent 70%)`}} />
              <div style={{position:"relative",zIndex:1}}>
                <div style={{fontFamily:"var(--mono)",fontSize:10,color:RANK_COLORS[i],letterSpacing:"0.14em",marginBottom:6}}>{labels[i]}</div>
                <div style={{width:40,height:40,borderRadius:"50%",background:`${RANK_COLORS[i]}20`,border:`2px solid ${RANK_COLORS[i]}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px",fontFamily:"var(--serif)",fontSize:16,fontWeight:700,color:RANK_COLORS[i]}}>
                  {u.name[0].toUpperCase()}
                </div>
                <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--t1)",marginBottom:2}}>{u.name}</div>
                <div style={{fontFamily:"var(--serif)",fontSize:18,fontWeight:700,fontStyle:"italic",color:RANK_COLORS[i]}}>{u.karma.toLocaleString()}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full list */}
      <div className="widget">
        <div className="widget-header"><div className="widget-title">Top 10 This Week</div></div>
        <div style={{display:"flex",flexDirection:"column",gap:4}}>
          {TOP.map(u=>(
            <div key={u.rank} style={{
              display:"flex",alignItems:"center",gap:14,padding:"12px 14px",
              borderRadius:"var(--r)",
              background:u.isYou?"var(--indigo-deep)":"transparent",
              border:`1px solid ${u.isYou?"var(--indigo-glow)":"transparent"}`,
              transition:"background .15s"
            }}>
              <div style={{width:24,fontFamily:"var(--mono)",fontSize:12,color:u.rank<=3?RANK_COLORS[u.rank-1]:"var(--t3)",textAlign:"center",flexShrink:0,fontWeight:600}}>
                {u.rank <= 3 ? ["▲","★","△"][u.rank-1] : u.rank}
              </div>
              <div style={{width:36,height:36,borderRadius:"50%",background:`${u.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--serif)",fontSize:14,fontWeight:700,color:u.color,flexShrink:0}}>
                {u.name[0].toUpperCase()}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:u.isYou?"var(--indigo-2)":"var(--t1)"}}>{u.name}{u.isYou&&" (you)"}</div>
                <span className="badge" style={{background:`${u.color}18`,color:u.color,border:`1px solid ${u.color}25`,marginTop:2,display:"inline-flex"}}>{u.badge}</span>
              </div>
              <div style={{fontFamily:"var(--serif)",fontSize:16,fontWeight:700,fontStyle:"italic",color:"var(--t1)"}}>{u.karma.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
