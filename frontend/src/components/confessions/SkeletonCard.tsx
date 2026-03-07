"use client";
// src/components/confessions/SkeletonCard.tsx

export function SkeletonCard({ delay = 0 }: { delay?: number }) {
  return (
    <div className="sk-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="sk-row">
        <div className="sk" style={{ width: 88,  height: 22, borderRadius: 20 }} />
        <div className="sk" style={{ width: 55,  height: 13, borderRadius: 4  }} />
      </div>
      <div className="sk" style={{ width: "100%", height: 15, borderRadius: 4, marginBottom: 8  }} />
      <div className="sk" style={{ width: "90%",  height: 15, borderRadius: 4, marginBottom: 8  }} />
      <div className="sk" style={{ width: "74%",  height: 15, borderRadius: 4, marginBottom: 18 }} />
      <div className="sk-row" style={{ justifyContent: "flex-start", gap: 6 }}>
        <div className="sk" style={{ width: 110, height: 30, borderRadius: 8 }} />
        <div className="sk" style={{ width: 70,  height: 30, borderRadius: 8 }} />
        <div className="sk" style={{ width: 55,  height: 30, borderRadius: 8 }} />
      </div>
    </div>
  );
}

export function SkeletonFeed() {
  return (
    <div className="feed-stack">
      {Array.from({ length: 5 }, (_, i) => (
        <SkeletonCard key={i} delay={i * 70} />
      ))}
    </div>
  );
}
