import { NextRequest, NextResponse } from "next/server";
import { postToX } from "@/lib/x";

export const runtime = "nodejs";

// Post one tweet to X now.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) {
      return NextResponse.json({ error: "Nothing to post." }, { status: 400 });
    }
    const id = await postToX(text);
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Post failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
