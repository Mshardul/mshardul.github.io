export type Project = {
  slug: string;
  name: string;
  pitch: string;
  tags: string[];
  stack?: string[];
  links?: { label: string; href: string }[];
  story?: { why: string; how: string; learned: string };
  aiNote?: string;
};

export const projects: Project[] = [
  {
    slug: "jugnu",
    name: "jugnu",
    pitch: "One-line pitch for the project.",
    tags: ["Web", "Open source"],
    stack: [],
    aiNote: "",
    story: {
      why: "A short paragraph on the problem and what was missing from existing tools.",
      how: "A short paragraph on the approach, the main pieces and one interesting decision.",
      learned: "A short paragraph on the trade-offs, surprises and what you would do differently.",
    },
  },
  {
    slug: "tools",
    name: "Tools",
    pitch: "One-line pitch for the project.",
    tags: ["Mac app", "Download"],
    stack: [],
    aiNote: "",
    story: {
      why: "A short paragraph on the problem and what was missing from existing tools.",
      how: "A short paragraph on the approach, the main pieces and one interesting decision.",
      learned: "A short paragraph on the trade-offs, surprises and what you would do differently.",
    },
  },
  {
    slug: "systemdesign-wiki",
    name: "SystemDesign-Wiki",
    pitch: "One-line pitch for the project.",
    tags: ["Web", "Open source"],
    stack: [],
    aiNote: "",
    story: {
      why: "A short paragraph on the problem and what was missing from existing tools.",
      how: "A short paragraph on the approach, the main pieces and one interesting decision.",
      learned: "A short paragraph on the trade-offs, surprises and what you would do differently.",
    },
  },
  {
    slug: "tool-stack",
    name: "tool-stack",
    pitch: "One-line pitch for the project.",
    tags: ["Web", "Live"],
    stack: [],
    aiNote: "",
    story: {
      why: "A short paragraph on the problem and what was missing from existing tools.",
      how: "A short paragraph on the approach, the main pieces and one interesting decision.",
      learned: "A short paragraph on the trade-offs, surprises and what you would do differently.",
    },
  },
  {
    slug: "drawit",
    name: "DrawIt",
    pitch: "One-line pitch for the project.",
    tags: ["Web", "Live"],
    stack: [],
    aiNote: "",
    story: {
      why: "A short paragraph on the problem and what was missing from existing tools.",
      how: "A short paragraph on the approach, the main pieces and one interesting decision.",
      learned: "A short paragraph on the trade-offs, surprises and what you would do differently.",
    },
  },
  {
    slug: "ink2doc",
    name: "Ink2Doc",
    pitch: "One-line pitch for the project.",
    tags: ["Web", "Live"],
    stack: [],
    aiNote: "",
    story: {
      why: "A short paragraph on the problem and what was missing from existing tools.",
      how: "A short paragraph on the approach, the main pieces and one interesting decision.",
      learned: "A short paragraph on the trade-offs, surprises and what you would do differently.",
    },
  },
  {
    slug: "contentvault",
    name: "ContentVault",
    pitch: "One-line pitch for the project.",
    tags: ["Web", "Open source"],
    stack: [],
    aiNote: "",
    story: {
      why: "A short paragraph on the problem and what was missing from existing tools.",
      how: "A short paragraph on the approach, the main pieces and one interesting decision.",
      learned: "A short paragraph on the trade-offs, surprises and what you would do differently.",
    },
  },
];