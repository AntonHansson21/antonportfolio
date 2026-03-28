const skills = [
  { category: "Design", items: [
    { name: "UX Research", level: 90 },
    { name: "UI Design", level: 88 },
    { name: "Figma", level: 95 },
    { name: "Prototyping", level: 85 },
    { name: "Illustration", level: 70 },
  ]},
  { category: "Development", items: [
    { name: "HTML / CSS", level: 82 },
    { name: "React / Next.js", level: 75 },
    { name: "TypeScript", level: 68 },
    { name: "Animation (CSS/Motion)", level: 72 },
  ]},
  { category: "Tools", items: [
    { name: "VS Code", level: 88 },
    { name: "Git / GitHub", level: 78 },
    { name: "Notion", level: 90 },
    { name: "Miro", level: 82 },
  ]},
];

function Bar({ level }: { level: number }) {
  return (
    <div style={{
      height: 14,
      background: "var(--win-bg)",
      border: "1px solid var(--bevel-sh)",
      flex: 1,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: `${level}%`,
        background: "linear-gradient(to right, var(--title-a1), var(--title-a2))",
      }} />
    </div>
  );
}

export default function SkillsWindow() {
  return (
    <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 15, color: "var(--text)" }}>
      {skills.map((group) => (
        <div key={group.category} style={{ marginBottom: 16 }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            color: "var(--title-a2)",
            marginBottom: 10,
            borderBottom: "1px solid var(--bevel-sh)",
            paddingBottom: 4,
            letterSpacing: "0.05em",
          }}>
            📁 {group.category}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {group.items.map((skill) => (
              <div key={skill.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 170, flexShrink: 0, fontSize: 14 }}>{skill.name}</span>
                <Bar level={skill.level} />
                <span style={{ fontSize: 13, color: "var(--text-dim)", width: 36, textAlign: "right" }}>
                  {skill.level}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
