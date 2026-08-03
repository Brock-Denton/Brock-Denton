"use client";

import { useEffect, useState } from "react";
import { CONTENT_BANK, type BankPost } from "@/lib/bank";

const X_LIMIT = 280;
const POSTED_KEY = "posting-engine.posted.v1";

function postId(p: BankPost) {
  return `${p.week}-${p.day}-${p.time}-${p.platform}`;
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

export default function Page() {
  const [posted, setPosted] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [xStatus, setXStatus] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(POSTED_KEY);
      if (raw) setPosted(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  function markPosted(id: string) {
    setPosted((prev) => {
      const next = { ...prev, [id]: true };
      try {
        localStorage.setItem(POSTED_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function unmark(id: string) {
    setPosted((prev) => {
      const next = { ...prev };
      delete next[id];
      try {
        localStorage.setItem(POSTED_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  async function copy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
    } catch {
      /* ignore */
    }
  }

  async function checkX() {
    setChecking(true);
    setXStatus("");
    try {
      const res = await fetch("/api/x/verify");
      const data = await res.json();
      setXStatus(data.ok ? `Posting as @${data.username}` : `Not connected: ${data.error}`);
    } catch {
      setXStatus("Could not check the connection.");
    } finally {
      setChecking(false);
    }
  }

  async function postX(id: string, text: string) {
    setBusy(id);
    setXStatus("");
    try {
      const res = await fetch("/api/x/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        markPosted(id);
      } else {
        setXStatus(`Post failed: ${data.error || "unknown error"}`);
      }
    } catch {
      setXStatus("Post failed.");
    } finally {
      setBusy(null);
    }
  }

  const weeks = Array.from(new Set(CONTENT_BANK.map((p) => p.week)));
  const doneCount = CONTENT_BANK.filter((p) => posted[postId(p)]).length;

  return (
    <div className="wrap">
      <div className="top">
        <div>
          <div className="brand">
            <b>tokenmaxxing</b> posts
          </div>
          <div className="tagline">
            {doneCount} of {CONTENT_BANK.length} posted. Copy or post each one at its time.
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <button className="ghost" onClick={checkX} disabled={checking}>
            {checking ? "Checking..." : "Check X"}
          </button>
          {xStatus && <div className="count" style={{ marginTop: "0.35rem" }}>{xStatus}</div>}
        </div>
      </div>

      {weeks.map((w) => (
        <div key={w}>
          <h2 className="wk">Week {w}</h2>
          {CONTENT_BANK.filter((p) => p.week === w).map((p) => {
            const id = postId(p);
            const isPosted = !!posted[id];
            return (
              <div className={`post ${isPosted ? "post-done" : ""}`} key={id}>
                <div className="meta">
                  <span className="chip">
                    {p.day} {p.time} · {p.platform} · {p.pillar}
                  </span>
                  <CharCount text={p.text} platform={p.platform} />
                </div>
                <div className="body">{p.text}</div>
                <div className="actions">
                  <button className="primary" onClick={() => copy(id, p.text)}>
                    {copied === id ? "Copied ✓" : "Copy"}
                  </button>
                  {p.platform === "X" &&
                    (isPosted ? (
                      <button className="ghost" onClick={() => unmark(id)}>
                        Posted ✓ (undo)
                      </button>
                    ) : (
                      <button className="primary" onClick={() => postX(id, p.text)} disabled={busy === id}>
                        {busy === id ? "Posting..." : "Post to X"}
                      </button>
                    ))}
                  {p.platform === "LinkedIn" &&
                    (isPosted ? (
                      <button className="ghost" onClick={() => unmark(id)}>
                        Done ✓ (undo)
                      </button>
                    ) : (
                      <button className="ghost" onClick={() => markPosted(id)}>
                        Mark done
                      </button>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <p className="foot">
        LinkedIn is copy and paste by hand, twice a week. X posts one tap. Nothing sends on its own.
      </p>
    </div>
  );
}
