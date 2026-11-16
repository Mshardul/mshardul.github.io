import type { Project } from "../content/projects.ts";
import { projects } from "../content/projects.ts";

export function nextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return projects[0];
  const nextIndex = (index + 1) % projects.length;
  return projects[nextIndex];
}