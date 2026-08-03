import { NextResponse } from "next/server";
import { buildGenerationPrompt, type PillarKey, type Platform } from "@/lib/voice";
import { WEEK_PLAN } from "@/lib/plan";
import { generateStrings, stripEmDashes } from "@/lib/claude";

export const runtime = "nodejs";
export const maxDuration = 60;

// Generate the whole week in one shot. Each slot already knows its day, time,
// platform, and pillar; we just fill in the words. Runs in parallel to stay
// under the function time limit.
export async function POST() {
  try {
    const results = await Promise.all(
      WEEK_PLAN.map(async (slot) => {
        const prompt = buildGenerationPrompt({
          pillar: slot.pillar as PillarKey,
          platform: slot.platform as Platform,
          count: 1,
        });
        const raw = await generateStrings(prompt, 700);
        const text = stripEmDashes(raw[0] || "");
        return { day: slot.day, time: slot.time, platform: slot.platform, pillar: slot.pillar, text };
      })
    );

    const week = results.filter((r) => r.text);
    if (week.length === 0) {
      return NextResponse.json({ error: "Nothing came back. Try again." }, { status: 502 });
    }

    return NextResponse.json({ week });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    const status = message.includes("ANTHROPIC_API_KEY") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
