"use client";
// src/components/confessions/ReportModal.tsx
import { useState }        from "react";
import { api }             from "@/lib/api";
import { RL }              from "@/lib/rateLimit";
import { REPORT_REASONS }  from "@/types/confession";
import type { ReportReason } from "@/types/confession";

interface Props { id: string; onClose: () => void; }

export function ReportModal({ id, onClose }: Props) {
  const [reason,  setReason]  = useState<ReportReason>("harassment");
  const [desc,    setDesc]    = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [err,     setErr]     = useState<string | null>(null);

  async function submit() {
    if (!RL.canReport()) { setErr("You've reported too many posts recently."); return; }
    setLoading(true); setErr(null);
    try {
      await api.confessions.report(id, reason, desc || undefined);
      setDone(true);
    } catch (e: any) {
      setErr(e?.message ?? "Report failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-report" onClick={e => e.stopPropagation()}>
        {done ? (
          <div className="report-success">
            <div className="report-success-icon">✓</div>
            <p style={{ fontFamily: "var(--serif)", fontSize: 18, marginBottom: 6 }}>Report submitted</p>
            <p style={{ fontSize: 13, color: "var(--t2)", marginBottom: 20 }}>
              Our team reviews every report within 24 hours.
            </p>
            <button className="btn-ghost" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="modal-head">
              <h3 className="modal-title">Report Confession</h3>
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>
            <p className="modal-sub">All reports are anonymous. Pick the most accurate reason.</p>

            <div className="report-options">
              {(Object.keys(REPORT_REASONS) as ReportReason[]).map(r => (
                <label key={r} className={`report-opt ${reason === r ? "sel" : ""}`}>
                  <input type="radio" name="reason" value={r} checked={reason === r}
                    onChange={() => setReason(r)} className="sr-only" />
                  {REPORT_REASONS[r]}
                </label>
              ))}
            </div>

            <label className="fl" htmlFor="rep-desc">
              Additional context <span className="opt">optional</span>
            </label>
            <textarea id="rep-desc" className="textarea" placeholder="Describe the issue…"
              value={desc} onChange={e => setDesc(e.target.value)} maxLength={500} rows={3}
              style={{ marginBottom: 12 }} />

            {err && <p className="form-err">{err}</p>}

            <div className="modal-actions">
              <button className="btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
              <button className="btn-danger" onClick={submit} disabled={loading}>
                {loading ? <><span className="spin" /> Submitting…</> : "Submit Report"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
