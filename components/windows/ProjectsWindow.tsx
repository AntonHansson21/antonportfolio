const projects = [
  {
    id: "p1",
    title: "Portfolio OS",
    year: "2025",
    tags: ["Next.js", "React", "CSS"],
    desc: "A browser-based desktop OS experience with draggable windows, custom cursor, and BMO-inspired design.",
    icon: "🖥️",
  },
  {
    id: "p2",
    title: "UX Case Study — App Redesign",
    year: "2024",
    tags: ["Figma", "UX Research", "Prototyping"],
    desc: "End-to-end redesign of a mobile banking app. Reduced task completion time by 30%.",
    icon: "📱",
  },
  {
    id: "p3",
    title: "Design System",
    year: "2024",
    tags: ["Figma", "Tokens", "Documentation"],
    desc: "Component library and token system for a SaaS product team, covering 60+ components.",
    icon: "🎨",
  },
  {
    id: "p4",
    title: "Interactive Brand Identity",
    year: "2023",
    tags: ["Illustration", "Motion", "Branding"],
    desc: "Full brand identity with animated logo for a Stockholm creative studio.",
    icon: "✦",
  },
];

interface ProjectsWindowProps {
  onOpen: (id: string) => void;
}

export default function ProjectsWindow({ onOpen }: ProjectsWindowProps) {
  return (
    <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 15, color: "var(--text)" }}>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 9,
        color: "var(--text-dim)",
        marginBottom: 12,
        letterSpacing: "0.05em",
      }}>
        {projects.length} item(s) — click to open
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {projects.map((p) => (
          <div
            key={p.id}
            onClick={() => onOpen(`proj_${p.id}`)}
            style={{
              background: "var(--input-bg)",
              border: "2px solid",
              borderColor: "var(--bevel-sh) var(--bevel-hl) var(--bevel-hl) var(--bevel-sh)",
              padding: "10px 12px",
              cursor: "none",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--win-bg)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--input-bg)")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 22 }}>{p.icon}</span>
              <span style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 9,
                color: "var(--title-a2)",
                flex: 1,
                lineHeight: 1.5,
              }}>
                {p.title}
              </span>
              <span style={{ fontSize: 13, color: "var(--text-dim)", flexShrink: 0 }}>{p.year}</span>
            </div>
            <p style={{ marginBottom: 8, lineHeight: 1.65, fontSize: 14 }}>{p.desc}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {p.tags.map(tag => (
                  <span key={tag} style={{
                    background: "var(--btn-face)",
                    border: "1px solid var(--bevel-sh)",
                    padding: "2px 7px",
                    fontSize: 12,
                    color: "var(--text)",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <span style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 7,
                color: "var(--title-a2)",
                flexShrink: 0,
                marginLeft: 8,
              }}>
                open ▸
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
