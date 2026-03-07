"use client";
// src/components/layout/Sidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── Icons — must be defined BEFORE NAV_GROUPS ────────────────────── */
function DashIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
}
function WallIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
}
function EventIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function ClubIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function PollIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
}
function ChatIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4H9a2 2 0 0 1-2-2v-1" /><path d="M15 3H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2v4l4-4h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" /></svg>;
}
function TrophyIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8m-4-4v4M7 4h10v6a5 5 0 0 1-10 0V4z" /><path d="M7 4H4v3a3 3 0 0 0 3 3M17 4h3v3a3 3 0 0 1-3 3" /></svg>;
}
function BellIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
}
function PersonIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function CogIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
}

const NAV_GROUPS = [
  {
    label: "Platform",
    items: [
      { href: "/dashboard", label: "Dashboard", Icon: DashIcon },
      { href: "/confessions", label: "Confessions", Icon: WallIcon, badge: "Live" },
      { href: "/events", label: "Events", Icon: EventIcon },
      { href: "/clubs", label: "Clubs", Icon: ClubIcon },
      { href: "/polls", label: "Polls", Icon: PollIcon },
      { href: "/chat", label: "Random Chat", Icon: ChatIcon },
    ],
  },
  {
    label: "Community",
    items: [
      { href: "/leaderboard", label: "Leaderboard", Icon: TrophyIcon },
      { href: "/notifications", label: "Notifications", Icon: BellIcon },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/profile", label: "Profile", Icon: PersonIcon },
      { href: "/settings", label: "Settings", Icon: CogIcon },
    ],
  },
];

export function Sidebar({ collapsed, open, onClose, onToggle }: {
  collapsed: boolean;
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
}) {
  const path = usePathname();

  return (
    <>
      {open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(0,0,0,.7)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${open ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <Link href="/" className="logo-glyph" onClick={onClose} title="Campus Connect" style={{ textDecoration: "none" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M2 20h20M4 20V8l8-6 8 6v12M10 20v-6h4v6" />
            </svg>
          </Link>
          {!collapsed && (
            <div className="logo-wordmark">
              <div className="logo-name">Campus Connect</div>
              <div className="logo-tag">anonymous · unified</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_GROUPS.map(({ label, items }) => (
            <div key={label} className="nav-group">
              <div className="nav-group-label">{label}</div>
              {items.map(({ href, label: lbl, Icon, badge }) => (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link ${path === href || path?.startsWith(href + "/") ? "active" : ""}`}
                  onClick={onClose}
                  title={collapsed ? lbl : undefined}
                >
                  <Icon className="nav-icon" />
                  <span className="nav-label">{lbl}</span>
                  {badge && !collapsed && <span className="nav-badge">{badge}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="sidebar-user">
          <div className="user-row">
            <div className="user-av">A</div>
            {!collapsed && (
              <div className="user-meta">
                <div className="user-name">Anonymous</div>
                <div className="user-role">Student · 0 karma</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}