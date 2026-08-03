// The written-ahead content calendar. Static, so the app never needs to call
// an AI to show your posts. Add more weeks here anytime.

export type BankPost = {
  week: number;
  day: string;
  time: string;
  platform: "X" | "LinkedIn";
  pillar: string;
  text: string;
};

export const CONTENT_BANK: BankPost[] = [
  // WEEK 1 — the build, introduced
  {
    week: 1, day: "Mon", time: "9:00a", platform: "X", pillar: "The idea",
    text: "Most AI plans give you a set amount to use each month.\nGetting the full value out of that is harder than it sounds. The tooling either burns through it or leaves a lot sitting there.\nThat gap is what I've been building around.",
  },
  {
    week: 1, day: "Tue", time: "9:30a", platform: "X", pillar: "Build in public",
    text: "Let tokenmaxxing run longer on its own than I had before.\nCame back to more done than I expected, and a clearer sense of what to fix next.\nEvery run teaches me where it's strong and where it isn't yet.",
  },
  {
    week: 1, day: "Tue", time: "11:00a", platform: "LinkedIn", pillar: "The idea",
    text: "The plans are the easy part to buy. Using them well is the part almost no one has solved yet.\nI've been building something that gets more out of the AI you're already paying for. Still early, but the direction feels right.\ntrytokenmaxxing.com",
  },
  {
    week: 1, day: "Wed", time: "9:30a", platform: "X", pillar: "Observations",
    text: "The models this year are good enough that the model isn't the bottleneck anymore.\nHow well you put it to work is.\nThat shift is the interesting part to build in right now.",
  },
  {
    week: 1, day: "Wed", time: "4:00p", platform: "LinkedIn", pillar: "Build in public",
    text: "One of the better parts of building tokenmaxxing is watching it run while I'm away.\nI set it going, step out, and come back to real progress instead of a plan sitting idle.\nSeeing it work like that is what makes me want to push it further.\ntrytokenmaxxing.com",
  },
  {
    week: 1, day: "Thu", time: "11:00a", platform: "X", pillar: "What I learned",
    text: "One thing I've picked up building autonomous tools: the hard part isn't getting it to start.\nIt's getting it to know when it's actually done.\nThat's where most of my time goes now.",
  },
  {
    week: 1, day: "Fri", time: "9:00a", platform: "X", pillar: "The bigger picture",
    text: "There's a version of AI that's just spending more on everything.\nI'm more interested in the opposite. Getting more out of what you already pay for.\nThat's the direction I'm building in.",
  },

  // WEEK 2 — closer to a tool
  {
    week: 2, day: "Mon", time: "9:00a", platform: "X", pillar: "The idea",
    text: "Half the fun of building right now is seeing what these new AI tools can actually do.\nThe harder part is not wasting what you pay for.\nSo I've been building something to close that gap.\ntrytokenmaxxing.com",
  },
  {
    week: 2, day: "Tue", time: "9:30a", platform: "X", pillar: "Build in public",
    text: "Small milestone: tokenmaxxing worked through a full session without me stepping in.\nNot perfect, but the direction is right.\nI've been chasing the version of this that just runs and delivers.",
  },
  {
    week: 2, day: "Tue", time: "11:00a", platform: "LinkedIn", pillar: "The idea",
    text: "Everyone is buying AI plans. Far fewer are using them to their full extent.\nThat gap is most of what I think about lately, and it's what I've been building tokenmaxxing to close.\ntrytokenmaxxing.com",
  },
  {
    week: 2, day: "Wed", time: "9:30a", platform: "X", pillar: "Observations",
    text: "Everyone's asking which model is best.\nI keep landing on a different question: are you using the one you already pay for to its full extent?\nUsually the answer is no.",
  },
  {
    week: 2, day: "Wed", time: "4:00p", platform: "LinkedIn", pillar: "Build in public",
    text: "Ran tokenmaxxing longer than I had before this week.\nCame back to real work done and a clearer read on what to fix next.\nThe version that just runs and delivers is getting closer.\ntrytokenmaxxing.com",
  },
  {
    week: 2, day: "Thu", time: "11:00a", platform: "X", pillar: "What I learned",
    text: "Learned something building this week: a run that looks busy isn't the same as a run finishing real work.\nMeasuring the right thing changed how I'm building it.",
  },
  {
    week: 2, day: "Fri", time: "9:00a", platform: "X", pillar: "The bigger picture",
    text: "Most AI waste isn't money. It's plans nobody's fully using, and oversized models doing small jobs.\nI'm building toward the opposite of that.",
  },

  // WEEK 3 — the honest in-between
  {
    week: 3, day: "Mon", time: "9:00a", platform: "X", pillar: "The idea",
    text: "The compute you already pay for shouldn't sit idle while you're away.\nThat's the whole thing I've been building. Put it to work, get real progress back.\ntrytokenmaxxing.com",
  },
  {
    week: 3, day: "Tue", time: "9:30a", platform: "X", pillar: "Build in public",
    text: "Another session where tokenmaxxing carried more of the work than I did.\nStill rough in places, but the shape of it is there.\nI keep pushing it to need me less.",
  },
  {
    week: 3, day: "Tue", time: "11:00a", platform: "LinkedIn", pillar: "The idea",
    text: "A lot of AI value gets lost in the gap between what you pay for and what you actually use.\nI don't think that gap gets talked about enough. Closing it is what I've been building.\ntrytokenmaxxing.com",
  },
  {
    week: 3, day: "Wed", time: "9:30a", platform: "X", pillar: "Observations",
    text: "The interesting work in AI right now isn't a bigger model.\nIt's using the one you have well, and matching the right size tool to the job.\nThat's underrated.",
  },
  {
    week: 3, day: "Wed", time: "4:00p", platform: "LinkedIn", pillar: "Build in public",
    text: "Progress this week was quieter than loud. A run that finished cleanly, a few things that didn't.\nThat's most of building. I'd rather show the real version than a highlight reel.\ntrytokenmaxxing.com",
  },
  {
    week: 3, day: "Thu", time: "11:00a", platform: "X", pillar: "What I learned",
    text: "One thing building autonomous tools teaches you fast: starting is easy, stopping at the right point is hard.\nKnowing when it's done is most of the problem.",
  },
  {
    week: 3, day: "Fri", time: "9:00a", platform: "X", pillar: "The bigger picture",
    text: "Getting more out of what you already pay for beats buying more of everything.\nCheaper, less wasteful, and honestly more interesting to build.",
  },

  // WEEK 4 — starting to prove out
  {
    week: 4, day: "Mon", time: "9:00a", platform: "X", pillar: "The idea",
    text: "The plans are easy to buy. Using them well is the part still mostly unsolved.\nThat's what I've been building tokenmaxxing around.\ntrytokenmaxxing.com",
  },
  {
    week: 4, day: "Tue", time: "9:30a", platform: "X", pillar: "Build in public",
    text: "tokenmaxxing is starting to feel less like a demo and more like a tool.\nStill early, but the runs are getting more useful and needing me less.\nThat's the milestone I care about.",
  },
  {
    week: 4, day: "Tue", time: "11:00a", platform: "LinkedIn", pillar: "The idea",
    text: "The AI you pay for shouldn't sit idle.\nI've been building something that puts it to work while you're away and hands back real progress instead of an idle subscription.\ntrytokenmaxxing.com",
  },
  {
    week: 4, day: "Wed", time: "9:30a", platform: "X", pillar: "Observations",
    text: "The bottleneck moved. It's not the model anymore, it's how well you use it.\nBuilding in that gap is where the interesting problems are right now.",
  },
  {
    week: 4, day: "Wed", time: "4:00p", platform: "LinkedIn", pillar: "Build in public",
    text: "A few weeks of building tokenmaxxing in the open now.\nThe honest read: real progress, plenty still to fix, and a clearer picture of what \"done\" means each week.\nI'll keep showing the in-between.\ntrytokenmaxxing.com",
  },
  {
    week: 4, day: "Thu", time: "11:00a", platform: "X", pillar: "What I learned",
    text: "Picked this up building autonomous tools: the goal isn't a busy loop, it's a finished one.\nOptimizing for real output changed the whole approach.",
  },
  {
    week: 4, day: "Fri", time: "9:00a", platform: "X", pillar: "The bigger picture",
    text: "Less waste, more value per dollar and per watt.\nThat's the version of AI I want to build toward, and the whole idea behind tokenmaxxing.\ntrytokenmaxxing.com",
  },
];
