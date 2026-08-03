# Handoff: tokenmaxxing marketing / content platform

You are taking ownership of the marketing / content platform for tokenmaxxing
(trytokenmaxxing.com). This is a standing role, not a one-off task. Read this
whole brief, then start with the "First job" section.

## What tokenmaxxing is

A tool that puts the AI plan you already pay for to work while you are away, so
it hands you real progress instead of an idle subscription, and uses the
right-size model for each job so less is wasted. Founder: Brock. Energy-efficient
AI, XPRIZE angle.

## What already exists (do not rebuild it, adopt it)

A finished Next.js (App Router, TypeScript) app called "posting-engine" that
generates X and LinkedIn posts in Brock's exact voice, with a review screen
(approve / edit / copy / reject) and a reply drafter. It lives in GitHub repo
`Brock-Denton/Brock-Denton`, in the folder `posting-engine/`, on branch
`claude/tokenmaxxing-logo-branding-pvmwz4` (open as draft PR #1).

Structure:

- `lib/voice.ts` -> THE SOURCE OF TRUTH: voice rules, the 5 content pillars, the
  posting schedule, the 3-year arc, and approved gold-standard example posts.
  Read this first. Do not loosen these rules.
- `lib/claude.ts` -> Claude API client. Uses `@anthropic-ai/sdk`, model set by
  env `POST_MODEL` (default `claude-opus-5`). Reads only text blocks. Strips
  em-dashes twice as a hard guarantee.
- `app/api/generate/route.ts`, `app/api/reply/route.ts` -> the endpoints.
- `app/page.tsx` -> the review dashboard (Generate / Replies / Schedule tabs).
- Needs one env var to run: `ANTHROPIC_API_KEY`.

## First job: get it live on Vercel (this is why you exist locally)

The cloud agent that built this could not deploy it, because its Vercel
connection lacked permission to create a project. You are local and logged into
Brock's real Vercel account, so you can. Do this:

1. Clone the repo and check out that branch. `cd posting-engine`.
2. `npm install`, then `npm run build` to confirm it builds clean.
3. Deploy with the Vercel CLI: `npx vercel` (create the project, name it
   `posting-engine`), then `npx vercel --prod`.
4. In the Vercel project settings, add env var `ANTHROPIC_API_KEY` (Brock has the
   value; it is the same key used in his CardSearch.ai project). Optionally set
   `POST_MODEL` to a cheaper model like `claude-sonnet-5` if cost matters.
5. Redeploy so the key takes effect. Give Brock the live URL and confirm Generate
   and Replies actually work end to end.

## The voice (non-negotiable, this is the whole product)

Full rules are in `lib/voice.ts`. The ones you must never break:

- NO em-dashes or long dashes, ever. Use a period or a new line. This is the
  single most important rule.
- Never use the words "dumb" or "simple".
- Simple, concise, plain, short sentences. Calm and grounded. Brock is smart and
  capable; never downplay his credibility. Confident but not loud. Dry, not
  jokey. No hype, no emojis, no hashtags, no cheese, no thread-bait hooks.
- Honest about the in-between but always framed forward. He is learning and
  building, never failing, struggling, complaining, or "figured out".
- Prefer "I've been" over "Been". Most posts have NO link; only add
  trytokenmaxxing.com on idea/build-update posts.

If you ever generate something and are unsure, match the gold examples in
`lib/voice.ts`, and when in doubt show Brock options and let him say yes/no.

## Content system (already encoded in lib/voice.ts)

- 5 pillars: The idea, Build in public, Observations, What I learned, The bigger
  picture.
- Schedule: Mon X 9:00a, Tue X 9:30a + LinkedIn 11:00a, Wed X 9:30a + LinkedIn
  4:00p, Thu X 11:00a, Fri X 9:00a. Sat/Sun off. Tue and Wed mornings are best.
- LinkedIn is manual, ~2x per week, Brock copy-pastes it himself.
- 3-year arc: NOW build -> NEXT proof -> THEN voice -> LATER the turn. The story
  knows its ending before the first post.

## Ongoing ownership (after it is live)

- Keep the app healthy and deployed. Every push can auto-redeploy if you connect
  the GitHub repo in Vercel.
- Generate posts on the schedule, always review-then-post (nothing auto-posts).
- Draft replies for Brock to send by hand.
- When Brock provides an X API key, wire a "Post to X" button on approved posts
  so it can post to X directly. Keep LinkedIn manual.
- Improve the tool over time (analytics, saved history, scheduling) without ever
  loosening the voice rules.

## Hard boundaries

- Do NOT touch or interfere with Brock's separate Cursor automation agent or the
  tokenmaxxing automation repo and its locked lanes (.orch, website-ui,
  metrics-docs). This marketing platform is a completely separate project.
- Never post anything publicly without Brock's explicit approval.
- Never hardcode the API key into source. It lives only in Vercel env settings.

Start now with "First job". Report back with the live URL once Generate and
Replies work.
