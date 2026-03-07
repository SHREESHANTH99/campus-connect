"use client";
// src/components/layout/AppShell.tsx
import { useState } from "react";
import Link         from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar }  from "./Sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const path     = usePathname();
  const isAuth   = path === "/login" || path === "/register" || path === "/";

  if (isAuth) return <>{children}</>;

  const crumb = path?.split("/")[1] ?? "home";
  const title = crumb.charAt(0).toUpperCase() + crumb.slice(1).replace(/-/g, " ");

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={collapsed}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onToggle={() => setCollapsed(c => !c)}
      />

      <div className="main-area">
        {/* Navbar */}
        <header className="navbar">
          <div className="navbar-left">
            {/* Mobile hamburger */}
            <button
              className="collapse-btn"
              onClick={() => setMobileOpen(o => !o)}
              style={{ display:"none" }}
              id="mob-toggle"
              aria-label="Toggle menu"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6"  x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Desktop collapse */}
            <button
              className="collapse-btn"
              onClick={() => setCollapsed(c => !c)}
              aria-label="Toggle sidebar"
              id="desk-toggle"
            >
              {collapsed ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
                </svg>
              )}
            </button>

            <span className="page-breadcrumb">{title}</span>
          </div>

          {/* Search */}
          <div className="navbar-search">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input className="navbar-search-input" placeholder="Search events, clubs, confessions…" />
          </div>

          <div className="navbar-right">
            <Link href="/events/create" style={{ textDecoration:"none" }}>
              <button className="btn btn-sm btn-primary">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Create
              </button>
            </Link>

            <Link href="/notifications" style={{ textDecoration:"none" }}>
              <button className="notif-btn" aria-label="Notifications">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span className="notif-dot" />
              </button>
            </Link>

            <Link href="/profile" style={{ textDecoration:"none" }}>
              <div className="user-av" style={{ width:36, height:36, fontSize:14 }}>A</div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="page-body">
          {children}
        </main>
      </div>

      {/* Mobile toggle injected via CSS */}
      <style>{`
        @media (max-width: 768px) {
          #mob-toggle  { display: flex !important; }
          #desk-toggle { display: none !important; }
        }
      `}</style>
    </div>
  );
}
