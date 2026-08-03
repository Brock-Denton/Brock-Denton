import Anthropic from "@anthropic-ai/sdk";

// The model that writes posts. Defaults to the best voice; override with POST_MODEL.
export const POST_MODEL = process.env.POST_MODEL || "claude-opus-5";

let cached: Anthropic | null = null;

export function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set. Add it in your environment (or Vercel project settings).");
  }
  if (!cached) {
    cached = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return cached;
}

// Ask Claude for a JSON array of strings and parse it robustly.
export async function generateStrings(prompt: string, maxTokens = 1024): Promise<string[]> {
  const client = getClient();
  const message = await client.messages.create({
    model: POST_MODEL,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });

  // Pull only text blocks (works across every model, including thinking-capable ones).
  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  return parseStringArray(text);
}

// Tolerant parse: prefer a clean JSON array, fall back to splitting on blank lines.
export function parseStringArray(raw: string): string[] {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start !== -1 && end !== -1 && end > start) {
    try {
      const arr = JSON.parse(cleaned.slice(start, end + 1));
      if (Array.isArray(arr)) {
        return arr.map((s) => String(s).trim()).filter(Boolean);
      }
    } catch {
      // fall through to heuristic split
    }
  }

  // Fallback: treat double-newline separated chunks as separate posts.
  return cleaned
    .split(/\n\s*\n/)
    .map((s) => s.replace(/^["'\-\d.\s]+/, "").trim())
    .filter(Boolean);
}

// Safety net for the one rule that matters most: no em-dashes ever.
export function stripEmDashes(s: string): string {
  return s.replace(/\s*[—–]\s*/g, ". ").replace(/--+/g, ". ").replace(/\.\s*\./g, ".");
}
