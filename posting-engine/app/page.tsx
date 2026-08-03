"use client";

import { useEffect, useState } from "react";
import { PILLARS, SCHEDULE, type PillarKey, type Platform } from "@/lib/voice";
import { CAMPAIGN, AUTOMATION_PHASES, REPLY_STRATEGY, REPLY_TARGETS, REPLY_LOOP } from "@/lib/plan";

type Draft = {
  id: string;
  text: string;
  pillar: string;
  platform: string;
  editing: boolean;
};

type Saved = { id: string; text: string; pillar: string; platform: string; at: number };

const STORAGE_KEY = "posting-engine.approved.v1";
const X_LIMIT = 280;

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Page() {
  const [tab, setTab] = useState<"week" | "replies" | "plan" | "custom" | "schedule">("week");
  return (
    <div className="wrap">
      <div className="top">
        <div>
          <div className="brand">
            <b>tokenmaxxing</b> posting engine
          </div>
          <div className="tagline">your week, written for you. copy, paste, done.</div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === "week" ? "active" : ""}`} onClick={() => setTab("week")}>
          This week
        </button>
        <button className={`tab ${tab === "replies" ? "active" : ""}`} onClick={() => setTab("replies")}>
          Replies
        </button>
        <button className={`tab ${tab === "plan" ? "active" : ""}`} onClick={() => setTab("plan")}>
          Plan
        </button>
        <button className={`tab ${tab === "custom" ? "active" : ""}`} onClick={() => setTab("custom")}>
          Custom
        </button>
        <button className={`tab ${tab === "schedule" ? "active" : ""}`} onClick={() => setTab("schedule")}>
          Schedule
        </button>
      </div>

      {tab === "week" && <ThisWeek />}
      {tab === "replies" && <Replies />}
      {tab === "plan" && <PlanView />}
      {tab === "custom" && <Generate />}
      {tab === "schedule" && <ScheduleView />}
    </div>
  );
}

const DAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

type WeekItem = { day: string; time: string; platform: string; pillar: string; text: string; editing?: boolean };

const WEEK_KEY = "posting-engine.week.v1";

function ThisWeek() {
  const [items, setItems] = useState<WeekItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [regen, setRegen] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [today, setToday] = useState<number | null>(null);
  const [xStatus, setXStatus] = useState("");
  const [xChecking, setXChecking] = useState(false);
  const [posting, setPosting] = useState<number | null>(null);
  const [posted, setPosted] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setToday(new Date().getDay());
    try {
      const raw = localStorage.getItem(WEEK_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  function persist(next: WeekItem[]) {
    setItems(next);
    try {
      localStorage.setItem(WEEK_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  async function planWeek() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/week", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to plan the week.");
      persist(data.week as WeekItem[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to plan the week.");
    } finally {
      setLoading(false);
    }
  }

  async function regenerate(i: number) {
    setRegen(i);
    try {
      const slot = items[i];
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pillar: slot.pillar, platform: slot.platform, count: 1 }),
      });
      const data = await res.json();
      if (res.ok && data.posts?.[0]) {
        persist(items.map((it, idx) => (idx === i ? { ...it, text: data.posts[0], editing: false } : it)));
      }
    } catch {
      /* ignore */
    } finally {
      setRegen(null);
    }
  }

  function update(i: number, patch: Partial<WeekItem>) {
    persist(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }

  async function checkX() {
    setXChecking(true);
    setXStatus("");
    try {
      const res = await fetch("/api/x/verify");
      const data = await res.json();
      setXStatus(data.ok ? `Connected as @${data.username}` : `Not connected: ${data.error}`);
    } catch {
      setXStatus("Could not check the connection.");
    } finally {
      setXChecking(false);
    }
  }

  async function postX(i: number) {
    setPosting(i);
    try {
      const res = await fetch("/api/x/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: items[i].text }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setPosted((p) => ({ ...p, [i]: true }));
      } else {
        setXStatus(`Post failed: ${data.error || "unknown error"}`);
      }
    } catch {
      setXStatus("Post failed.");
    } finally {
      setPosting(null);
    }
  }

  return (
    <>
      <div className="card">
        <p className="hint" style={{ margin: "0 0 0.8rem" }}>
          One click writes your whole week. Each post already has its day, time, and platform. Post it to X in one tap, or copy it. LinkedIn you paste yourself.
        </p>
        <div className="actions" style={{ marginTop: 0 }}>
          <button className="primary" onClick={planWeek} disabled={loading}>
            {loading ? "Writing your week..." : items.length ? "Rewrite this week" : "Plan my week"}
          </button>
          <button className="ghost" onClick={checkX} disabled={xChecking}>
            {xChecking ? "Checking..." : "Check X connection"}
          </button>
        </div>
        {xStatus && <p className="hint" style={{ marginTop: "0.5rem" }}>{xStatus}</p>}
        {error && <p className="err">{error}</p>}
      </div>

      {items.map((it, i) => {
        const isToday = today !== null && DAY_INDEX[it.day] === today;
        return (
          <div className={`post ${isToday ? "post-today" : ""}`} key={`${it.day}-${it.time}-${i}`}>
            <div className="meta">
              <span className="chip">
                {it.day} {it.time} · {it.platform}
                {isToday ? " · today" : ""}
              </span>
              <CharCount text={it.text} platform={it.platform} />
            </div>
            <div className="slot-pillar">{it.pillar}</div>
            {it.editing ? (
              <textarea value={it.text} onChange={(e) => update(i, { text: e.target.value })} />
            ) : (
              <div className="body">{it.text}</div>
            )}
            <div className="actions">
              {it.platform === "X" ? (
                <button className="primary" onClick={() => postX(i)} disabled={posting === i || posted[i]}>
                  {posted[i] ? "Posted ✓" : posting === i ? "Posting..." : "Post to X"}
                </button>
              ) : null}
              <button className="ghost" onClick={() => copy(it.text)}>
                Copy
              </button>
              <button className="ghost" onClick={() => update(i, { editing: !it.editing })}>
                {it.editing ? "Done" : "Edit"}
              </button>
              <button className="ghost" onClick={() => regenerate(i)} disabled={regen === i}>
                {regen === i ? "..." : "Regenerate"}
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}

function CharCount({ text, platform }: { text: string; platform: string }) {
  if (platform === "LinkedIn") return <span className="count">{text.length} chars</span>;
  const over = text.length > X_LIMIT;
  return (
    <span className={`count ${over ? "over" : ""}`}>
      {text.length}/{X_LIMIT}
      {over ? " over" : ""}
    </span>
  );
}

function Generate() {
  const [pillar, setPillar] = useState<PillarKey>(PILLARS[0].key);
  const [platform, setPlatform] = useState<Platform>("both");
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [saved, setSaved] = useState<Saved[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  function persist(next: Saved[]) {
    setSaved(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pillar, platform, topic, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate.");
      setDrafts(
        (data.posts as string[]).map((text) => ({
          id: uid(),
          text,
          pillar,
          platform,
          editing: false,
        }))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate.");
    } finally {
      setLoading(false);
    }
  }

  function update(id: string, patch: Partial<Draft>) {
    setDrafts((d) => d.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  function reject(id: string) {
    setDrafts((d) => d.filter((x) => x.id !== id));
  }

  function approve(dr: Draft) {
    persist([{ id: dr.id, text: dr.text, pillar: dr.pillar, platform: dr.platform, at: Date.now() }, ...saved]);
    reject(dr.id);
  }

  function removeSaved(id: string) {
    persist(saved.filter((s) => s.id !== id));
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <div className="card">
        <div className="controls">
          <div className="field">
            <label>Pillar</label>
            <select value={pillar} onChange={(e) => setPillar(e.target.value as PillarKey)}>
              {PILLARS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.key}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Platform</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
              <option value="both">Both</option>
              <option value="X">X</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>
          <div className="field">
            <label>How many</label>
            <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="field grow">
            <label>Steer it (optional)</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. what it did overnight, a milestone, a take..."
            />
          </div>
          <button className="primary" onClick={generate} disabled={loading}>
            {loading ? "Writing..." : "Generate"}
          </button>
        </div>
        <p className="hint">{PILLARS.find((p) => p.key === pillar)?.desc}</p>
        {error && <p className="err">{error}</p>}
      </div>

      {drafts.map((dr) => (
        <div className="post" key={dr.id}>
          <div className="meta">
            <span className="chip">
              {dr.pillar} · {dr.platform}
            </span>
            <CharCount text={dr.text} platform={dr.platform} />
          </div>
          {dr.editing ? (
            <textarea value={dr.text} onChange={(e) => update(dr.id, { text: e.target.value })} />
          ) : (
            <div className="body">{dr.text}</div>
          )}
          <div className="actions">
            <button className="primary" onClick={() => approve(dr)}>
              Approve
            </button>
            <button className="ghost" onClick={() => update(dr.id, { editing: !dr.editing })}>
              {dr.editing ? "Done editing" : "Edit"}
            </button>
            <button className="ghost" onClick={() => copy(dr.text)}>
              Copy
            </button>
            <button className="ghost" onClick={() => reject(dr.id)}>
              Reject
            </button>
          </div>
        </div>
      ))}

      {saved.length > 0 && (
        <div className="saved">
          <h3>Approved ({saved.length})</h3>
          {saved.map((s) => (
            <div className="post" key={s.id}>
              <div className="meta">
                <span className="chip">
                  {s.pillar} · {s.platform}
                </span>
                <CharCount text={s.text} platform={s.platform} />
              </div>
              <div className="body">{s.text}</div>
              <div className="actions">
                <button className="ghost" onClick={() => copy(s.text)}>
                  Copy
                </button>
                <button className="ghost" onClick={() => removeSaved(s.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Replies() {
  const [original, setOriginal] = useState("");
  const [angle, setAngle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [replies, setReplies] = useState<string[]>([]);

  async function draft() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original, angle, count: 3 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to draft.");
      setReplies(data.replies as string[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to draft.");
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <div className="card">
        <div className="field" style={{ marginBottom: "0.7rem" }}>
          <label>Post you want to reply to</label>
          <textarea value={original} onChange={(e) => setOriginal(e.target.value)} placeholder="Paste the post here..." />
        </div>
        <div className="controls">
          <div className="field grow">
            <label>Angle (optional)</label>
            <input value={angle} onChange={(e) => setAngle(e.target.value)} placeholder="e.g. agree and add, gentle counter..." />
          </div>
          <button className="primary" onClick={draft} disabled={loading || !original.trim()}>
            {loading ? "Drafting..." : "Draft replies"}
          </button>
        </div>
        <p className="hint">
          Paste a post from one of your target accounts (see the Plan tab), get options in your voice, send the one you like. Nothing posts automatically.
        </p>
        {error && <p className="err">{error}</p>}
      </div>

      {replies.map((r, i) => (
        <div className="post" key={i}>
          <div className="meta">
            <span className="chip">reply option {i + 1}</span>
            <CharCount text={r} platform="X" />
          </div>
          <div className="body">{r}</div>
          <div className="actions">
            <button className="ghost" onClick={() => copy(r)}>
              Copy
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

function PlanView() {
  return (
    <>
      <div className="card">
        <h3 className="plan-h">The estimate</h3>
        <p className="hint" style={{ margin: "0 0 0.9rem" }}>
          {CAMPAIGN.summary}
        </p>
        <div className="stats">
          <div className="stat">
            <div className="stat-n">{CAMPAIGN.xPerWeek}/wk</div>
            <div className="stat-l">X posts</div>
          </div>
          <div className="stat">
            <div className="stat-n">{CAMPAIGN.linkedinPerWeek}/wk</div>
            <div className="stat-l">LinkedIn posts</div>
          </div>
          <div className="stat">
            <div className="stat-n">~{CAMPAIGN.xPerYear}</div>
            <div className="stat-l">X posts / year</div>
          </div>
          <div className="stat">
            <div className="stat-n">~{CAMPAIGN.linkedinPerYear}</div>
            <div className="stat-l">LinkedIn / year</div>
          </div>
        </div>
        <p className="hint" style={{ marginTop: "0.9rem" }}>
          {CAMPAIGN.horizon}
        </p>
      </div>

      <div className="card">
        <h3 className="plan-h">The path to hands-off</h3>
        {AUTOMATION_PHASES.map((p) => (
          <div className={`phase ${p.now ? "phase-now" : ""}`} key={p.phase}>
            <div className="phase-top">
              <span className="chip">{p.phase}</span>
              <b>{p.title}</b>
              {p.now && <span className="phase-badge">you are here</span>}
            </div>
            <p className="phase-d">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="plan-h">Replies are the growth engine</h3>
        <ul className="tips">
          {REPLY_STRATEGY.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        <p className="hint" style={{ margin: "0.8rem 0 0.2rem" }}>
          <b>Now:</b> {REPLY_LOOP.now}
        </p>
        <p className="hint" style={{ margin: "0.2rem 0" }}>
          <b>Next:</b> {REPLY_LOOP.next}
        </p>
        <p className="hint" style={{ margin: "0.2rem 0 0" }}>
          <b>Later:</b> {REPLY_LOOP.later}
        </p>
      </div>

      <div className="card">
        <h3 className="plan-h">Who to follow and reply to</h3>
        <p className="hint" style={{ margin: "0 0 0.8rem" }}>
          A starting list, grouped by why they matter. Verify the handles before wiring up any automation.
        </p>
        {REPLY_TARGETS.map((t) => (
          <div className="target" key={t.group}>
            <div className="target-top">
              <b>{t.group}</b>
              <span className="target-accts">{t.accounts.join("  ")}</span>
            </div>
            <p className="phase-d">{t.why}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function ScheduleView() {
  return (
    <div className="card">
      <p className="hint" style={{ marginBottom: "0.6rem" }}>
        Your posting rhythm. Tuesday and Wednesday mornings are the best windows. Weekends off.
      </p>
      <div className="schedule">
        {SCHEDULE.map((d) => (
          <div className={`day ${d.best ? "best" : ""}`} key={d.day}>
            <div className="d">{d.day}</div>
            {d.x === "off" ? (
              <div className="off">off</div>
            ) : (
              <>
                <div className="x">X {d.x}</div>
                {d.linkedin && <div className="li">LinkedIn {d.linkedin}</div>}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
