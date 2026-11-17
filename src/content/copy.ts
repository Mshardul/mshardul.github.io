/** A headline with one highlighted word. Rendered as before + <span class="highlight">highlight</span> + after. */
export interface Headline {
  before: string;
  highlight: string;
  after: string;
}

export const copy = {
  home: {
    buildBandText: "Need a web app, mobile app, Mac app or Chrome extension built?",
    contactLead: "Have a project, a question or just want to say hello? Reach out.",
  },
  experience: {
    headline: { before: "7+ years of ", highlight: "leading", after: " and building." } satisfies Headline,
    lead: "Every role with the impact, the tech and the scope. Claim-level detail only.",
  },
  projects: {
    headline: { before: "Seven things, ", highlight: "built", after: " with care." } satisfies Headline,
    lead: "A curated set, not every repo. Each one has its own page with the story behind it.",
  },
  notFound: {
    headline: "Page not found.",
    lead: "That page does not exist. Try the home page.",
  },
};
