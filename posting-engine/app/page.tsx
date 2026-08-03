"use client";

import { useEffect, useState } from "react";
import { PILLARS, SCHEDULE, type PillarKey, type Platform } from "@/lib/voice";

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
  const [tab, setTab] = useState<"generate" | "replies" | "schedule">("generate");
  return (
    <div className="wrap">
      <div className="top">
        <div>
          <div className="brand">
            <b>tokenmaxxing</b> posting engine
          </div>
          <div className="tagline">generate in your voice, review, then post.</div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === "generate" ? "active" : ""}`} onClick={() => setTab("generate")}>
          Generate
        </button>
        <button className={`tab ${tab === "replies" ? "active" : ""}`} onClick={() => setTab("replies")}>
          Replies
        </button>
        <button className={`tab ${tab === "schedule" ? "active" : ""}`} onClick={() => setTab("schedule")}>
          Schedule
        </button>
      </div>

      {tab === "generate" && <Generate />}
      {tab === "replies" && <Replies />}
      {tab === "schedule" && <ScheduleView />}
    </div>
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
        <p className="hint">Drafts land here for you to send by hand. Nothing posts automatically.</p>
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
