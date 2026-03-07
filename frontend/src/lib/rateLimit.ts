// src/lib/rateLimit.ts
function get(key: string): number[] {
  try { return JSON.parse(localStorage.getItem(`rl:${key}`) ?? "[]"); } catch { return []; }
}
function set(key: string, ts: number[]) {
  try { localStorage.setItem(`rl:${key}`, JSON.stringify(ts)); } catch {}
}
function check(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const ts  = get(key).filter(t => now - t < windowMs);
  if (ts.length >= max) return false;
  set(key, [...ts, now]);
  return true;
}
function cooldown(key: string, max: number, windowMs: number): number {
  const now = Date.now();
  const ts  = get(key).filter(t => now - t < windowMs);
  if (ts.length < max) return 0;
  return Math.ceil((Math.min(...ts) + windowMs - now) / 1000);
}
export const RL = {
  canPost:     () => check("post", 1, 120_000),
  postCooldown:() => cooldown("post", 1, 120_000),
  canVote:     () => check("vote", 10, 60_000),
  voteCooldown:() => cooldown("vote", 10, 60_000),
  canReact:    () => check("react", 5, 60_000),
  canReport:   () => check("report", 3, 3_600_000),
  canComment:  () => check("comment", 10, 300_000),
};
