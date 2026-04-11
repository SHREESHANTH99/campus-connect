"use client";
// src/app/settings/page.tsx
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

const SETTINGS_NAV = ["Account","Security","Notifications","Preferences"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Account");
  const [profile, setProfile] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState("");
  const [notifs, setNotifs] = useState({ email:true, events:true, clubs:false, announcements:true, karma:true });

  useEffect(() => {
    let active = true;
    api.profile
      .me()
      .then((me) => {
        if (!active) return;
        setProfile(me);
        setName(me.anonymous_username ?? "");
        setBranch(me.branch ?? "");
      })
      .catch(() => {
        if (!active) return;
        setProfile(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const initials = useMemo(() => {
    if (!name) return "CC";
    return name.slice(0, 2).toUpperCase();
  }, [name]);

  async function saveAccount() {
    const updated = await api.profile.updateMe({ branch });
    setProfile(updated);
  }

  if (!profile) {
    return <div style={{ color: "var(--t3)", fontSize: 14 }}>Loading settings...</div>;
  }

  return (
    <div style={{maxWidth:820}}>
      <div className="page-header">
        <span className="eyebrow">Preferences</span>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(28px,4vw,44px)",fontWeight:700,color:"var(--t1)",lineHeight:1.0}}>
          <em style={{color:"var(--indigo-2)"}}>Settings</em>
        </h1>
      </div>

      <div className="settings-layout">
        <nav className="settings-nav">
          {SETTINGS_NAV.map(t=>(
            <button key={t} className={`settings-nav-item ${activeTab===t?"active":""}`} onClick={()=>setActiveTab(t)}>
              {t}
            </button>
          ))}
        </nav>

        <div>
          {activeTab === "Account" && (
            <>
              <div className="settings-section">
                <div className="settings-section-title">Profile</div>
                <div className="settings-section-desc">Update your personal details.</div>
                <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20,padding:"14px 16px",background:"var(--bg-3)",borderRadius:"var(--r)",border:"1px solid var(--b)"}}>
                  <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,var(--indigo),var(--violet))",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--serif)",fontSize:20,fontWeight:700,color:"white",boxShadow:"0 0 16px var(--indigo-glow)"}}>{initials}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--t1)",marginBottom:2}}>{profile.anonymous_username}</div>
                    <button className="btn btn-ghost btn-sm">Change photo</button>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label">Display Name</label>
                    <input className="field-input" value={name} onChange={e=>setName(e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Email</label>
                    <input type="email" className="field-input" value={email} onChange={e=>setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Branch / Department</label>
                  <input className="field-input" value={branch} onChange={e => setBranch(e.target.value)} />
                </div>
                <button className="btn btn-primary btn-md" onClick={() => void saveAccount()}>Save Changes</button>
              </div>

              <div className="settings-section">
                <div className="settings-section-title" style={{color:"var(--rose)"}}>Danger Zone</div>
                <div className="settings-section-desc">Permanent actions. Cannot be undone.</div>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn btn-danger btn-md">Delete Account</button>
                  <button className="btn btn-ghost btn-md">Export Data</button>
                </div>
              </div>
            </>
          )}

          {activeTab === "Security" && (
            <div className="settings-section">
              <div className="settings-section-title">Security</div>
              <div className="settings-section-desc">Manage your password and session security.</div>
              <div className="field-group">
                <label className="field-label">Current Password</label>
                <input type="password" className="field-input" placeholder="••••••••" />
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label className="field-label">New Password</label>
                  <input type="password" className="field-input" placeholder="••••••••" />
                </div>
                <div className="field-group">
                  <label className="field-label">Confirm</label>
                  <input type="password" className="field-input" placeholder="••••••••" />
                </div>
              </div>
              <button className="btn btn-primary btn-md" style={{marginBottom:28}}>Update Password</button>

              <div className="settings-divider" />
              <div className="toggle-row">
                <div>
                  <div className="toggle-info-title">Two-Factor Authentication</div>
                  <div className="toggle-info-desc">Require OTP on every login</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" />
                  <div className="toggle-track" />
                </label>
              </div>

              <div className="settings-divider" />
              <div style={{marginTop:16}}>
                <div style={{fontFamily:"var(--mono)",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:"var(--t3)",marginBottom:12}}>Active Sessions</div>
                {["Chrome · Windows",  "Safari · macOS"].map(s=>(
                  <div key={s} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",background:"var(--bg-3)",border:"1px solid var(--b)",borderRadius:"var(--r)",marginBottom:6}}>
                    <div style={{fontSize:13,color:"var(--t1)"}}>{s}</div>
                    <button className="btn btn-danger btn-sm">Revoke</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="settings-section">
              <div className="settings-section-title">Notification Preferences</div>
              <div className="settings-section-desc">Control how and when you receive notifications.</div>
              {(Object.keys(notifs) as Array<keyof typeof notifs>).map(key=>(
                <div key={key} className="toggle-row">
                  <div>
                    <div className="toggle-info-title">{
                      {email:"Email Notifications",events:"Event Reminders",clubs:"Club Updates",announcements:"Announcements",karma:"Karma & Badges"}[key]
                    }</div>
                    <div className="toggle-info-desc">{
                      {email:"Receive digest emails",events:"Get reminded before events",clubs:"New posts from clubs you joined",announcements:"Campus-wide announcements",karma:"When you earn badges or reach milestones"}[key]
                    }</div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={notifs[key]} onChange={e=>setNotifs(n=>({...n,[key]:e.target.checked}))} />
                    <div className="toggle-track" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Preferences" && (
            <div className="settings-section">
              <div className="settings-section-title">App Preferences</div>
              <div className="settings-section-desc">Customize your experience.</div>
              <div className="field-group">
                <label className="field-label">Default Feed Sort</label>
                <select className="field-input">
                  <option>Hot</option>
                  <option>New</option>
                  <option>Top</option>
                  <option>Trending</option>
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">Language</label>
                <select className="field-input">
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
              <button className="btn btn-primary btn-md">Save Preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
