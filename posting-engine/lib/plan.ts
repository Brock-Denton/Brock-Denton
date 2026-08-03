// The long game: how long, how much, and the growth engine underneath it.

export const CAMPAIGN = {
  horizon: "A 12-month core run of consistent posting, inside the 3-year arc.",
  xPerWeek: 5,
  linkedinPerWeek: 2,
  xPerYear: 260,
  linkedinPerYear: 104,
  summary:
    "Five X posts a week and two LinkedIn posts a week, every week, for a year. That is the core run. Replies are the daily engine underneath it, and they are what actually grows the account.",
};

// The full week, decided for you: which day, time, platform, and pillar each
// post is. The generator fills in the actual words. You only copy and paste.
export const WEEK_PLAN = [
  { day: "Mon", time: "9:00a", platform: "X", pillar: "The idea" },
  { day: "Tue", time: "9:30a", platform: "X", pillar: "Build in public" },
  { day: "Tue", time: "11:00a", platform: "LinkedIn", pillar: "The idea" },
  { day: "Wed", time: "9:30a", platform: "X", pillar: "Observations" },
  { day: "Wed", time: "4:00p", platform: "LinkedIn", pillar: "Build in public" },
  { day: "Thu", time: "11:00a", platform: "X", pillar: "What I learned" },
  { day: "Fri", time: "9:00a", platform: "X", pillar: "The bigger picture" },
] as const;

// The path from hands-on to hands-off. You are on Phase 1 now.
export const AUTOMATION_PHASES = [
  {
    phase: "Phase 1",
    title: "Review everything",
    now: true,
    desc: "Every X post, LinkedIn post, and reply is written for you in your voice. You approve or edit before anything goes out. You stay in the loop while the voice proves itself.",
  },
  {
    phase: "Phase 2",
    title: "Auto posts, review replies",
    now: false,
    desc: "Scheduled X and LinkedIn posts go out on their own on the calendar. You still glance at the replies before they send.",
  },
  {
    phase: "Phase 3",
    title: "Fully automated",
    now: false,
    desc: "Posts and replies both run on their own, in your voice, on the schedule. You only step in when you want to. It is not spam. It is exactly what you would have said.",
  },
];

// Replies to the right accounts grow you faster than posting does.
export const REPLY_STRATEGY = [
  "Spend about 10 minutes a day replying to bigger AI and builder accounts. This grows you faster than posting does.",
  "Reply with a real thought or a small useful add, never 'great post'. One good reply can out-reach a whole day of posting.",
  "Be early. A thoughtful reply in the first few minutes on a big account puts you in front of their whole audience.",
  "Stay in your voice. Dry, useful, a builder's take. Never fawning, never selling.",
];

// Seed list of accounts to follow and reply to, grouped by why they matter.
// Handles are a starting point. Verify each one before wiring up any automation.
export const REPLY_TARGETS = [
  {
    group: "AI labs and model builders",
    why: "Where the big model conversations happen. High reach and directly on-topic.",
    accounts: ["@AnthropicAI", "@OpenAI", "@sama", "@karpathy"],
  },
  {
    group: "Dev tools and agents",
    why: "Your actual world. People who care about getting more out of AI tooling.",
    accounts: ["@cursor_ai", "@vercel", "@rauchg"],
  },
  {
    group: "Build in public and indie founders",
    why: "The most reciprocal crowd. They reply back, so relationships compound.",
    accounts: ["@levelsio", "@arvidkahl"],
  },
  {
    group: "AI commentary and newsletters",
    why: "They post takes daily, which gives you a steady supply of good threads to reply under.",
    accounts: ["@swyx", "@emollick"],
  },
  {
    group: "Energy and efficient compute",
    why: "Your XPRIZE edge. Fewer people reply here, so a good take stands out more.",
    accounts: ["seed 3 to 5 accounts posting on AI energy use and efficiency"],
  },
];

// How the daily reply habit is meant to run, from manual to automated.
export const REPLY_LOOP = {
  now: "You paste a post from one of these accounts into the Replies tab, get options in your voice, and send the one you like.",
  next: "The tool watches your target accounts, surfaces the best few posts to reply to each day, and drafts a reply for each. You approve.",
  later: "It picks, drafts, and posts the replies on its own, in your voice, within your daily limit.",
};
