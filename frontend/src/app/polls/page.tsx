"use client";
// src/app/polls/page.tsx
import { useState } from "react";

const POLLS = [
  {
    id:1, q:"Which branch has the best placements overall?",
    opts:["Computer Science","ECE","Mechanical","Civil"],
    votes:[312,187,98,44], total:641
  },
  {
    id:2, q:"Is GPA overrated or are you just coping?",
    opts:["GPA matters a lot","Totally overrated"],
    votes:[156,289], total:445
  },
  {
    id:3, q:"What should freshers learn first?",
    opts:["Python","Java","Neither — DSA first"],
    votes:[401,133,67], total:601
  },
  {
    id:4, q:"Best hostel food on campus?",
    opts:["Mess A","Mess B","Canteen","Off-campus"],
    votes:[120,95,280,310], total:805
  },
];

export default function PollsPage() {
  const [voted, setVoted] = useState<Record<number,number>>({});

  function handleVote(pollId:number, optIdx:number) {
    setVoted(v => ({...v,[pollId]:optIdx}));
  }

  return (
    <div style={{maxWidth:680}}>
      <div className="page-header">
        <span className="eyebrow">Anonymous Debates</span>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(28px,4vw,44px)",fontWeight:700,color:"var(--t1)",lineHeight:1.0}}>
          Campus <em style={{color:"var(--indigo-2)"}}>Polls</em>
        </h1>
        <p style={{color:"var(--t2)",fontSize:14,marginTop:8}}>Vote anonymously. See what your campus really thinks.</p>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {POLLS.map(poll => {
          const myVote = voted[poll.id];
          const hasVoted = myVote !== undefined;
          const totalVotes = hasVoted
            ? poll.votes.map((v,i) => i===myVote ? v+1 : v)
            : poll.votes;
          const newTotal = hasVoted ? poll.total+1 : poll.total;

          return (
            <div key={poll.id} className="widget">
              <h3 style={{fontFamily:"var(--serif)",fontSize:17,fontWeight:600,color:"var(--t1)",marginBottom:16,lineHeight:1.4}}>{poll.q}</h3>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {poll.opts.map((opt,i) => {
                  const pct = Math.round((totalVotes[i]/newTotal)*100);
                  const isVoted = myVote === i;
                  return (
                    <div key={opt}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,alignItems:"center"}}>
                        <button
                          style={{
                            background:"none",border:"none",cursor:"pointer",
                            fontSize:13,color:isVoted?"var(--indigo-2)":"var(--t1)",
                            fontWeight:isVoted?600:400,fontFamily:"var(--sans)",
                            transition:"color .15s",padding:0,textAlign:"left"
                          }}
                          onClick={()=>!hasVoted&&handleVote(poll.id,i)}
                        >
                          {isVoted && "⟶ "}{opt}
                        </button>
                        <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)"}}>{pct}%</span>
                      </div>
                      <div style={{height:6,background:"var(--bg-4)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{
                          height:"100%",width:`${hasVoted?pct:0}%`,
                          background:isVoted?"var(--indigo)":"var(--b3)",
                          borderRadius:3,transition:"width .6s ease"
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)",marginTop:12}}>
                {newTotal.toLocaleString()} votes · {hasVoted ? "You voted" : "Tap to vote"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
