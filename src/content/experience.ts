export type Role = {
  company: string;
  title: string;
  start: string;
  end: string;
  scope?: string;
  /** Short form, shown on the home page. */
  highlights: string[];
  /** Full form, shown on the experience page. */
  bullets: string[];
  /** Fuller tech list grouped by area, shown on the experience page. */
  stack: { area: string; items: string[] }[];
};

export const roles: Role[] = [
  {
    company: "McKinsey & Company",
    title: "Senior Software Engineer I",
    start: "May 2025",
    end: "Present",
    scope: "Led and mentored 3 backend engineers; informal lead",
    highlights: [
      "Led the backend team from first commit to go-live.",
      "Built the scheduling layer and hardened the distributed ingestion pipeline.",
      "Owned ingestion reliability and cross-service integration through client go-live.",
    ],
    bullets: [
      "Led and mentored the backend team from first commit to production go-live.",
      "Founding backend engineer: set up the service and its architecture, which became the baseline the team extended rather than replaced.",
      "Became the senior owner of ingestion reliability through go-live, fixing stuck jobs, duplicate dispatch and worker memory failures in the scheduling layer and distributed pipeline.",
      "Owned the cross-service integration end to end, designed so a dashboard outage never blocks core saves.",
      "Integrated enterprise SSO into the new service and defined its own access roles, separate from the other platform services.",
      "Turned an untested worker pipeline into a retry-safe, tested one: shared base-task architecture, and external calls separated from database transactions to stop phantom and duplicate jobs.",
      "Made calls to external services resilient with retries, circuit breakers and backpressure, so upstream failures stop stalling ingestion.",
      "Made the system debuggable end to end: distributed tracing and structured logs correlated by one request ID from API through workers to the data platform.",
      "Set the platform baseline: initial CI with security scanning, a storage layer portable across AWS, Azure and GCP, and internal APIs isolated from the public surface.",
      "Contributed to Locust and Playwright load testing, giving the team measured runtimes for readiness discussions instead of ad-hoc timing.",
    ],
    stack: [
      { area: "Backend", items: ["Python", "FastAPI", "Celery", "Flower", "Pydantic", "SQLAlchemy", "Alembic"] },
      { area: "Data", items: ["PostgreSQL", "Redis", "Databricks"] },
      { area: "Observability", items: ["OpenTelemetry", "Sentry", "Grafana", "Loki"] },
      { area: "Testing", items: ["Locust", "Playwright", "pytest"] },
      { area: "Infra and CI", items: ["Docker", "Kubernetes", "GitLab CI"] },
    ],
  },
  {
    company: "Bhanzu",
    title: "SDE IV",
    start: "Oct 2022",
    end: "Jun 2024",
    scope: "Led a team of up to 12 developers; informal lead",
    highlights: [
      "Led a payments team of up to 12 developers.",
      "Designed on-site multi-gateway payments across multiple providers.",
      "Led the GenAI Video QC project from hackathon to production.",
    ],
    bullets: [
      "Led the payments team of up to 12 developers across backend, frontend and QA, owning sprint planning, allocation, design and code reviews.",
      "Designed on-site multi-gateway payments (JusPay, Stripe, PayPal, Tabby) as an orchestrator plus payment-methods microservices, covering India, the US and the Middle East.",
      "Replaced manually sent third-party payment links with automated emailed links that open a payment page on the Bhanzu platform, making payment look and feel trustworthy.",
      "Led the GenAI Video QC project from hackathon (2nd prize) to production: automated scoring of teacher sessions against predefined quality metrics using speech transcription and LLMs, replacing manual review.",
      "Built the backend for a live-class platform that scaled classes from small batches to 1000+ students: scheduling, time zones, progress tracking, automated reminders.",
      "Cut spam flagging on reminder emails to near zero by redesigning the template and batching sends with AWS Step Functions.",
      "Interviewed candidates and mentored the team across backend, frontend and QA.",
      "Shipped four production microservices, managing the AWS infrastructure with Terraform.",
    ],
    stack: [
      { area: "Backend", items: ["Python", "Flask", "FastAPI"] },
      { area: "Data", items: ["DynamoDB"] },
      { area: "Frontend", items: ["React"] },
      { area: "Cloud and infra", items: ["AWS", "GCP", "Docker", "Kubernetes", "Terraform"] },
      { area: "CI/CD", items: ["GitHub Actions", "Argo CD"] },
      { area: "AI", items: ["OpenAI (GPT, Whisper)", "AssemblyAI"] },
    ],
  },
  {
    company: "AIfluence",
    title: "Senior Full Stack Engineer",
    start: "Nov 2021",
    end: "Oct 2022",
    scope: "Second engineer; team grew to 6",
    highlights: [
      "Defined the architecture of a campaign platform integrating about five social-media APIs.",
      "Hired and mentored engineers as the tech team scaled to six.",
      "Built GitLab CI/CD pipelines.",
    ],
    bullets: [
      "Defined the architecture of a campaign platform connecting brands and influencers, integrating about five social-media and productivity APIs.",
      "Built a brand-facing web app and an influencer-facing web app.",
      "Owned modules end to end, from proof of concept to delivery, coordinating frontend, backend and DevOps.",
      "Hired and mentored engineers as the tech team grew from two to six.",
      "Built GitLab CI/CD pipelines that automated build, test and deploy.",
    ],
    stack: [
      { area: "Backend", items: ["Go", "Python"] },
      { area: "Frontend", items: ["React", "Material UI"] },
      { area: "Data", items: ["MySQL", "MongoDB"] },
      { area: "Cloud and CI/CD", items: ["AWS", "GitLab CI/CD"] },
    ],
  },
  {
    company: "GE Digital",
    title: "Software Engineering Specialist, Digital Technology Intern",
    start: "Jan 2020",
    end: "Oct 2021",
    scope: "First India hire on a US team of about 10",
    highlights: [
      "Built a reusable configurable Angular component library.",
      "Helped build a shared UI design system.",
    ],
    bullets: [
      "Built a reusable, highly configurable Angular component library in the style of Material UI.",
      "Helped design a system of reusable UI components and tools that encoded organisation-wide UI best practices.",
    ],
    stack: [
      { area: "Frontend", items: ["Angular", "HTML/CSS", "Bootstrap", "Material UI"] },
      { area: "Charting", items: ["c3", "d3", "Google Charts"] },
      { area: "Tooling", items: ["Docker", "Git/GitHub"] },
    ],
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
    stack: [
      { area: "Backend", items: [".NET", "C#", "Python"] },
      { area: "Data", items: ["SQL (T-SQL, MySQL)"] },
      { area: "Cloud", items: ["Azure"] },
      { area: "Frontend", items: ["HTML/CSS", "Bootstrap", "JavaScript", "jQuery"] },
    ],
  },
];