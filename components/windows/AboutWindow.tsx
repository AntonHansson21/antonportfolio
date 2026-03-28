export default function AboutWindow() {
  return (
    <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 15, color: "var(--text)", lineHeight: 1.75 }}>
      <div style={{
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        marginBottom: 16,
      }}>
        {/* Avatar placeholder */}
        <div style={{
          width: 72,
          height: 72,
          flexShrink: 0,
          background: "var(--btn-face)",
          border: "2px solid",
          borderColor: "var(--bevel-sh) var(--bevel-hl) var(--bevel-hl) var(--bevel-sh)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 36,
        }}>
          🧑‍💻
        </div>
        <div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 12,
            color: "var(--title-a2)",
            marginBottom: 8,
          }}>
            Anton Hansson
          </div>
          <div style={{ fontSize: 14, color: "var(--text-dim)" }}>
            UX Designer & Creative Developer
          </div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
            📍 Sweden
          </div>
        </div>
      </div>

      <div style={{
        borderTop: "1px solid var(--bevel-sh)",
        paddingTop: 12,
        marginBottom: 12,
      }}>
        <p style={{ marginBottom: 10 }}>
          Hey! I'm Anton — a UX designer who loves crafting experiences that feel
          alive. I blend visual design with a bit of code magic to build things
          people actually enjoy using.
        </p>
        <p style={{ marginBottom: 10 }}>
          I think good design is invisible. When something just works, when it
          feels right without you knowing why — that's the goal.
        </p>
        <p>
          Outside of screens I'm into vintage tech, long walks, and anything that
          has a good aesthetic.
        </p>
      </div>

      <div style={{
        borderTop: "1px solid var(--bevel-sh)",
        paddingTop: 10,
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
      }}>
        {["Figma", "Next.js", "React", "CSS", "Illustration", "Prototyping"].map(tag => (
          <span key={tag} style={{
            background: "var(--btn-face)",
            border: "1px solid var(--bevel-sh)",
            padding: "3px 8px",
            fontSize: 13,
            color: "var(--text)",
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
