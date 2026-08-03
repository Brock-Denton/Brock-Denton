import { NextRequest, NextResponse } from "next/server";
import { buildReplyPrompt } from "@/lib/voice";
import { generateStrings, stripEmDashes } from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const original = typeof body.original === "string" ? body.original.trim() : "";
    const angle = typeof body.angle === "string" ? body.angle.slice(0, 300) : undefined;
    const count = Math.min(Math.max(Number(body.count) || 3, 1), 5);

    if (!original) {
      return NextResponse.json({ error: "Paste the post you want to reply to." }, { status: 400 });
    }

    const prompt = buildReplyPrompt({ original: original.slice(0, 2000), angle, count });
    const raw = await generateStrings(prompt, 800);
    const replies = raw.map(stripEmDashes).filter(Boolean).slice(0, count);

    if (replies.length === 0) {
      return NextResponse.json({ error: "No replies came back. Try again." }, { status: 502 });
    }

    return NextResponse.json({ replies });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    const status = message.includes("ANTHROPIC_API_KEY") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
