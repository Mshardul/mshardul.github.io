import { profile } from "./profile.ts";

export interface PageMeta {
  title: string;
  description: string;
}

/** Titles use a pipe. Project pages build theirs from the project. */
export const meta: Record<"home" | "experience" | "projects" | "build" | "notFound", PageMeta> = {
  home: {
    title: "Shardul Lingwal | Backend Engineering Lead",
    description: profile.summary,
  },
  experience: {
    title: "Experience | Shardul Lingwal",
    description: "Every role with the impact, the tech and the scope.",
  },
  projects: {
    title: "Things I've built | Shardul Lingwal",
    description: "A curated set of projects, each with its own page and the story behind it.",
  },
  build: {
    title: "Build with me | Shardul Lingwal",
    description: "From small tools to full products. What I build and how we can work together.",
  },
  notFound: {
    title: "Page not found | Shardul Lingwal",
    description: "That page does not exist.",
  },
};
