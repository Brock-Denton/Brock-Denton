import { NextResponse } from "next/server";
import { verifyX } from "@/lib/x";

export const runtime = "nodejs";

// Check the X connection. Returns the handle it posts as, or a clear message.
// Always 200 so the UI can show the result inline.
export async function GET() {
  try {
    const username = await verifyX();
    return NextResponse.json({ ok: true, username });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not reach X.";
    return NextResponse.json({ ok: false, error: message });
  }
}
