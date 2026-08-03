import { NextRequest, NextResponse } from "next/server";
import { buildGenerationPrompt, PILLARS, type PillarKey, type Platform } from "@/lib/voice";
import { generateStrings, stripEmDashes } from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const pillar = (body.pillar as PillarKey) || PILLARS[0].key;
    const platform = (body.platform as Platform) || "both";
    const topic = typeof body.topic === "string" ? body.topic.slice(0, 400) : undefined;
    const count = Math.min(Math.max(Number(body.count) || 3, 1), 5);

    if (!PILLARS.some((p) => p.key === pillar)) {
      return NextResponse.json({ error: "Unknown pillar." }, { status: 400 });
    }

    const prompt = buildGenerationPrompt({ pillar, platform, topic, count });
    const raw = await generateStrings(prompt, 1024);
    const posts = raw.map(stripEmDashes).filter(Boolean).slice(0, count);

    if (posts.length === 0) {
      return NextResponse.json({ error: "No posts came back. Try again." }, { status: 502 });
    }

    return NextResponse.json({ posts, pillar, platform });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    const status = message.includes("ANTHROPIC_API_KEY") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
