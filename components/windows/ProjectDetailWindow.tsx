const projectDetails: Record<string, {
  title: string;
  icon: string;
  year: string;
  role: string;
  tags: string[];
  imgSeed: string;
  summary: string;
  problem: string;
  outcome: string;
  highlights: string[];
}> = {
  p1: {
    title: "Portfolio OS",
    icon: "🖥️",
    year: "2025",
    role: "Design + Development",
    tags: ["Next.js", "React", "TypeScript", "CSS"],
    imgSeed: "portfolio-os-12",
    summary: "A browser-based desktop OS experience built as a portfolio. Features draggable windows, a custom pixel cursor, BMO-inspired color palette, and a typewriter welcome animation.",
    problem: "Portfolios are usually boring scroll pages. I wanted mine to feel like an interactive artifact — something you actually play with rather than just read.",
    outcome: "A fully functional windowed OS in the browser. Every element is draggable, the Start menu works, and files are scattered on the desktop like a real computer.",
    highlights: [
      "Custom pixel cursor drawn on canvas",
      "Draggable windows with z-index management",
      "Typewriter welcome animation",
      "Moving CRT static line overlay",
      "Start menu with all sections",
    ],
  },
  p2: {
    title: "UX Case Study — App Redesign",
    icon: "📱",
    year: "2024",
    role: "UX Researcher + UI Designer",
    tags: ["Figma", "UX Research", "Prototyping", "Usability Testing"],
    imgSeed: "mobile-app-ux-44",
    summary: "End-to-end redesign of a mobile banking app used by 200k+ users. The goal was to simplify core flows and reduce drop-off during key tasks.",
    problem: "Users were abandoning transfers midway due to confusing step ordering and unclear error states. The old UI had 7 steps where 3 were sufficient.",
    outcome: "Task completion time dropped 30%. Error-related support tickets fell by 22% in the first month post-launch. The redesigned flow is now the template used for all new features.",
    highlights: [
      "Conducted 12 moderated usability sessions",
      "Reduced transfer flow from 7 to 3 steps",
      "Redesigned error messaging from scratch",
      "Shipped in 6 weeks from research to handoff",
    ],
  },
  p3: {
    title: "Design System",
    icon: "🎨",
    year: "2024",
    role: "Lead Design Systems Designer",
    tags: ["Figma", "Tokens", "Documentation", "Component Library"],
    imgSeed: "design-system-77",
    summary: "Built a complete component library and token system for a SaaS product serving 4 separate product teams. Covered 60+ components, motion guidelines, and dark mode.",
    problem: "Four teams, four different button styles. The product looked like four different companies. Designers were rebuilding the same things independently every sprint.",
    outcome: "Adoption across all 4 teams within 8 weeks. Design time per feature dropped by roughly 40%. Engineers reported fewer design inconsistency bugs.",
    highlights: [
      "60+ components documented in Figma",
      "Design token system with light/dark mode",
      "Auto Layout-first — no fixed frames",
      "Contributing guide so teams could extend it",
    ],
  },
  p4: {
    title: "Interactive Brand Identity",
    icon: "✦",
    year: "2023",
    role: "Brand Designer + Creative Director",
    tags: ["Illustration", "Motion", "Branding", "Web"],
    imgSeed: "brand-identity-33",
    summary: "Full brand identity for a Stockholm-based creative studio. Included logo system, animated variants, typography, color system, and an interactive landing page.",
    problem: "The studio had great work but no visual identity. Their web presence was a plain Squarespace template that didn't reflect their personality at all.",
    outcome: "Launched to strong reception. Client reported a 60% increase in inbound inquiries in the first quarter. The animated logo became their most-used social asset.",
    highlights: [
      "Logo with 3 animated variants",
      "Full brand guidelines (48 pages)",
      "Hand-illustrated pattern system",
      "Interactive landing page with scroll animations",
    ],
  },
};

export default function ProjectDetailWindow({ projectId }: { projectId: string }) {
  const p = projectDetails[projectId];
  if (!p) return null;

  return (
    <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 14, color: "var(--text)", lineHeight: 1.7 }}>

      {/* Hero image */}
      <div style={{
        border: "2px solid",
        borderColor: "var(--bevel-sh) var(--bevel-hl) var(--bevel-hl) var(--bevel-sh)",
        overflow: "hidden",
        marginBottom: 14,
        background: "#000",
        height: 180,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${p.imgSeed}/600/180`}
          alt={p.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.9 }}
        />
      </div>

      {/* Title row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>{p.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            color: "var(--title-a2)",
            lineHeight: 1.6,
            marginBottom: 4,
          }}>
            {p.title}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", display: "flex", gap: 16 }}>
            <span>📅 {p.year}</span>
            <span>👤 {p.role}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
        {p.tags.map(tag => (
          <span key={tag} style={{
            background: "var(--btn-face)",
            border: "1px solid var(--bevel-sh)",
            padding: "2px 8px",
            fontSize: 11,
            color: "var(--text)",
            fontFamily: "'Courier Prime', monospace",
          }}>{tag}</span>
        ))}
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid var(--bevel-sh)", marginBottom: 12 }} />

      {/* Summary */}
      <p style={{ marginBottom: 12 }}>{p.summary}</p>

      {/* Problem / Outcome */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        <div style={{
          background: "var(--input-bg)",
          border: "2px solid",
          borderColor: "var(--bevel-sh) var(--bevel-hl) var(--bevel-hl) var(--bevel-sh)",
          padding: "8px 10px",
        }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: "var(--title-a1)",
            marginBottom: 5,
            letterSpacing: "0.05em",
          }}>⚡ THE PROBLEM</div>
          <p style={{ fontSize: 13 }}>{p.problem}</p>
        </div>

        <div style={{
          background: "var(--input-bg)",
          border: "2px solid",
          borderColor: "var(--bevel-sh) var(--bevel-hl) var(--bevel-hl) var(--bevel-sh)",
          padding: "8px 10px",
        }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 8,
            color: "var(--title-a2)",
            marginBottom: 5,
            letterSpacing: "0.05em",
          }}>✅ THE OUTCOME</div>
          <p style={{ fontSize: 13 }}>{p.outcome}</p>
        </div>
      </div>

      {/* Highlights */}
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 8,
        color: "var(--text-dim)",
        marginBottom: 6,
        letterSpacing: "0.05em",
      }}>HIGHLIGHTS</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {p.highlights.map((h, i) => (
          <li key={i} style={{ display: "flex", gap: 8, fontSize: 13 }}>
            <span style={{ color: "var(--title-a2)", flexShrink: 0 }}>▸</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
