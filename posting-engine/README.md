# Posting Engine

A private tool that writes X and LinkedIn posts in your voice, lets you review and edit each one, then hand it off to post. It also drafts replies for you to send by hand. Nothing goes out automatically until you wire up X.

Built for tokenmaxxing (trytokenmaxxing.com). The voice, the five content pillars, and the posting schedule are all baked in.

## What it does

- **Generate** posts by pillar and platform, steer them with a topic, then approve / edit / copy / reject each one. Approved posts are saved in your browser.
- **Replies** drafts a few reply options for any post you paste in, in your voice.
- **Schedule** shows your posting rhythm (Tue and Wed mornings are the best windows, weekends off).

The voice rules are locked in `lib/voice.ts`. The single hardest rule is enforced twice: no em-dashes, ever.

## Run it locally

```bash
npm install
cp .env.example .env        # then put your real key in .env
npm run dev                 # open http://localhost:3000
```

You need an Anthropic API key from console.anthropic.com. Put it in `.env` as `ANTHROPIC_API_KEY`.

## Deploy to Vercel (always on)

1. Push this repo to GitHub.
2. On vercel.com, "Add New Project" and import the repo.
3. Add one environment variable: `ANTHROPIC_API_KEY` = your key.
4. Deploy. That's it. It stays live at your Vercel URL.

Optional: set `POST_MODEL` to change which Claude model writes the posts. Defaults to `claude-opus-5` (best voice). Cheaper options: `claude-sonnet-5`, `claude-haiku-4-5`.

## X posting (later)

The `.env.example` has slots for X API keys. Posting to X is intentionally not wired up yet, so nothing can go out by accident. When you have an X API key, the plan is a "Post to X" button on each approved post that publishes through your account. LinkedIn stays manual copy-paste (twice a week).
