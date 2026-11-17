export type Role = {
  company: string;
  title: string;
  start: string;
  end: string;
  scope?: string;
  highlights: string[];
  bullets: string[];
  tech: string[];
};

export const roles: Role[] = [
  {
    company: "McKinsey & Company",
    title: "Senior Software Engineer I",
    start: "May 2025",
    end: "Present",
    scope: "Led and mentored 3 backend engineers; informal lead",
    highlights: [
      "Led the backend team from first commit to client go-live.",
      "Built the scheduling layer and hardened the distributed ingestion pipeline.",
      "Owned cross-service integration and built session auth with role-based access.",
    ],
    bullets: [
      "Led and mentored the backend team from first commit to production go-live.",
      "Set the architecture the team extended, as a founding backend engineer.",
      "Built the scheduling layer and hardened the distributed ingestion pipeline, addressing stuck jobs, duplicate dispatch, and worker memory failures.",
      "Owned the cross-service integration, designed so a dashboard outage does not block core saves.",
      "Built session auth with role-based access and contributed to Locust and Playwright load tests.",
    ],
    tech: ["Python", "Django", "FastAPI", "PostgreSQL"],
  },
  {
    company: "Bhanzu",
    title: "Senior Software Engineer",
    start: "Jan 2024",
    end: "Jan 2025",
    scope: "Led a team of up to 12 developers",
    highlights: [
      "Led the Registration and Payments team for about nine months.",
      "Designed on-site multi-gateway payments across multiple providers.",
      "Led the GenAI Video QC project from hackathon to production.",
    ],
    bullets: [
      "Led the Registration and Payments team for about nine months.",
      "Designed on-site multi-gateway payments (JusPay, Stripe, PayPal, Tabby) as an orchestrator plus payment-methods microservices.",
      "Led the GenAI Video QC project from hackathon (2nd prize) to production.",
    ],
    tech: ["Python", "Django", "FastAPI", "PostgreSQL"],
  },
  {
    company: "AIfluence",
    title: "Software Engineer",
    start: "Sep 2022",
    end: "Dec 2023",
    scope: "Second engineer; team grew to 6",
    highlights: [
      "Designed the architecture of a campaign platform integrating about five social-media APIs.",
      "Hired and mentored engineers as the tech team scaled to six.",
      "Built GitLab CI/CD pipelines.",
    ],
    bullets: [
      "Designed the architecture of a campaign platform integrating about five social-media APIs.",
      "Hired and mentored engineers as the tech team scaled to six.",
      "Built GitLab CI/CD pipelines.",
    ],
    tech: ["Python", "Django", "REST APIs", "GitLab CI/CD"],
  },
  {
    company: "GE Digital",
    title: "Software Engineer",
    start: "Jan 2020",
    end: "Oct 2021",
    scope: "First India hire on a US team of about 10",
    highlights: [
      "Built a reusable configurable Angular component library.",
      "Helped build a shared UI design system.",
      "Delivered demos to US stakeholders.",
    ],
    bullets: [
      "Built a reusable configurable Angular component library.",
      "Helped build a shared UI design system.",
      "Delivered demos to US stakeholders.",
    ],
    tech: ["Angular", "TypeScript", "JavaScript", "HTML/CSS"],
  },
  {
    company: "Infosys",
    title: "Systems Engineer",
    start: "Feb 2017",
    end: "Nov 2017",
    highlights: [
      "Built a real-time logistics-tracking web app during training.",
      "Helped move a client system from on-prem to Azure.",
    ],
    bullets: [
      "Built a real-time logistics-tracking web app (.NET) during training.",
      "Helped move a client system from on-prem to Azure.",
    ],
    tech: [".NET", "C#", "Azure", "SQL"],
  },
];