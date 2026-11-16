export type Project = {
  slug: string;
  name: string;
  pitch: string;
  tags: string[];
};

export const projects: Project[] = [
  { slug: "jugnu", name: "jugnu", pitch: "One-line pitch for the project.", tags: ["Web", "Astro", "Open source"] },
  { slug: "tools", name: "Tools", pitch: "One-line pitch for the project.", tags: ["macOS", "Swift", "Download"] },
  { slug: "systemdesign-wiki", name: "SystemDesign-Wiki", pitch: "One-line pitch for the project.", tags: ["Web", "Documentation", "Open source"] },
  { slug: "tool-stack", name: "tool-stack", pitch: "One-line pitch for the project.", tags: ["Extension", "TypeScript", "Live"] },
  { slug: "drawit", name: "DrawIt", pitch: "One-line pitch for the project.", tags: ["Extension", "TypeScript", "Live"] },
  { slug: "ink2doc", name: "Ink2Doc", pitch: "One-line pitch for the project.", tags: ["Extension", "TypeScript", "Live"] },
  { slug: "contentvault", name: "ContentVault", pitch: "One-line pitch for the project.", tags: ["Web", "Astro", "Open source"] },
];