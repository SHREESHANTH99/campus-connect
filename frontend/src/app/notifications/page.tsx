"use client";
// src/app/notifications/page.tsx
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";

const ParticleField = dynamic(
  () => import("@/components/3d/ParticleField").then(m => ({ default: m.ParticleField })),
  { ssr: false, loading: () => null }
);

const TYPE_META: Record<string,{color:string;Icon:()=>React.ReactElement}> = {
  reminder: { color:"#6366F1", Icon:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  invite:   { color:"#10B981", Icon:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg> },
  announce: { color:"#F59E0B", Icon:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg> },
  karma:    { color:"#F43F5E", Icon:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg> },
  event:    { color:"#8B5CF6", Icon:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  rsvp:     { color:"#06B6D4", Icon:()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
};

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    api.notifications
      .list()
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
  }, []);

  const unreadCount = items.filter(n => !n.is_read).length;

  async function markAllRead() {
    const snap = [...items];
    setItems(prev => prev.map(n => ({...n, is_read: true})));
    try {
      await api.notifications.readAll();
    } catch {
      setItems(snap);
    }
  }

  async function markRead(id: string) {
    const snap = [...items];
    setItems(prev => prev.map(n => n.id===id ? {...n, is_read: true} : n));
    try {
      await api.notifications.readOne(id);
    } catch {
      setItems(snap);
    }
  }

  return (
    <div style={{maxWidth:700}}>
      <div className="page-header">
        <span className="eyebrow">Inbox</span>
        <div className="page-header-row">
          <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(28px,4vw,44px)",fontWeight:700,color:"var(--t1)",lineHeight:1.0}}>
            Notifications
            {unreadCount > 0 && (
              <span style={{marginLeft:12,fontFamily:"var(--mono)",fontSize:14,fontWeight:400,color:"var(--rose)",fontStyle:"normal"}}>{unreadCount} unread</span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>
          )}
        </div>
      </div>

      <div className="notif-list">
        {items.map(n => {
          const meta = TYPE_META[n.type] ?? TYPE_META.event;
          return (
            <div key={n.id} className={`notif-item ${!n.is_read?"unread":""}`} onClick={()=>void markRead(n.id)}>
              <div className="notif-icon-wrap" style={{background:`${meta.color}18`,border:`1px solid ${meta.color}25`,color:meta.color}}>
                <meta.Icon />
              </div>
              <div style={{flex:1}}>
                <div className="notif-title">{n.title}</div>
                <div className="notif-msg">{n.message}</div>
                <div className="notif-time">{new Date(n.created_at).toLocaleString()}</div>
              </div>
              {!n.is_read && (
                <div style={{width:8,height:8,borderRadius:"50%",background:"var(--indigo)",flexShrink:0,marginTop:4,boxShadow:"0 0 6px var(--indigo-glow)"}} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
