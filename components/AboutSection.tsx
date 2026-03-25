"use client";
import { motion } from "framer-motion";

const skills = [
  { label: "USER RESEARCH", pct: 95, color: "#ff00ff" },
  { label: "INTERACTION DESIGN", pct: 90, color: "#00ffff" },
  { label: "PROTOTYPING", pct: 88, color: "#00ff41" },
  { label: "VISUAL DESIGN", pct: 85, color: "#ffff00" },
  { label: "MOTION / ANIMATION", pct: 78, color: "#ff6600" },
  { label: "DESIGN SYSTEMS", pct: 92, color: "#cc00ff" },
];

const tools = [
  "FIGMA", "FRAMER", "ILLUSTRATOR", "AFTER EFFECTS",
  "PRINCIPLE", "MAZE", "HOTJAR", "NOTION",
];

const stats = [
  { value: "5+", label: "YEARS EXP" },
  { value: "40+", label: "PROJECTS" },
  { value: "12+", label: "CLIENTS" },
  { value: "8", label: "AWARDS" },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative z-10 py-32 px-6 max-w-6xl mx-auto w-full">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <div className="font-pixel text-[9px] text-[#00ff41] glow-green tracking-[0.4em] mb-4">
          &gt; ABOUT_SYSTEM
        </div>
        <h2 className="font-pixel text-2xl sm:text-4xl text-white glow-cyan mb-4">
          ABOUT
        </h2>
        <div className="w-24 h-px bg-gradient-to-r from-[#00ffff] to-transparent" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left — bio */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Avatar placeholder */}
          <div
            className="w-32 h-32 mb-8 pixel-corners relative overflow-hidden"
            style={{
              border: "2px solid #ff00ff",
              boxShadow: "0 0 20px #ff00ff55",
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-[#1a001a] to-[#000a1a] flex items-center justify-center">
              <span className="font-pixel text-3xl text-[#ff00ff] glow-pink">A</span>
            </div>
            {/* Pixel grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(rgba(255,0,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,255,0.05) 1px, transparent 1px)",
                backgroundSize: "8px 8px",
              }}
            />
          </div>

          <h3 className="font-pixel text-sm text-[#ff00ff] glow-pink mb-4">
            SYSTEM PROFILE
          </h3>
          <p className="font-mono-tech text-sm text-[#aaa] leading-relaxed mb-4">
            Hey, I&apos;m Anton — a UX designer obsessed with crafting experiences that feel
            alive. I merge data-driven research with expressive visual design to build
            interfaces people actually love using.
          </p>
          <p className="font-mono-tech text-sm text-[#aaa] leading-relaxed mb-8">
            Raised on early internet aesthetics, dial-up tones, and pixel art. I carry
            that energy into every project — because the web should be playful, bold,
            and a little bit weird.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="pixel-corners p-4 text-center"
                style={{
                  border: "1px solid #222",
                  background: "rgba(10,10,15,0.8)",
                }}
              >
                <div className="font-pixel text-xl text-[#00ffff] glow-cyan mb-1">{s.value}</div>
                <div className="font-pixel text-[7px] text-[#555] tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — skills */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="font-pixel text-sm text-[#00ffff] glow-cyan mb-8">
            SKILL_MATRIX
          </h3>

          <div className="space-y-5 mb-12">
            {skills.map((skill, i) => (
              <div key={skill.label}>
                <div className="flex justify-between mb-2">
                  <span className="font-pixel text-[8px] text-[#888]">{skill.label}</span>
                  <span className="font-pixel text-[8px]" style={{ color: skill.color }}>
                    {skill.pct}%
                  </span>
                </div>
                <div className="w-full h-3 bg-[#111] pixel-corners overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                    className="h-full"
                    style={{
                      background: `linear-gradient(90deg, ${skill.color}88, ${skill.color})`,
                      boxShadow: `0 0 8px ${skill.color}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tools */}
          <h3 className="font-pixel text-sm text-[#00ff41] glow-green mb-6">
            TOOLS_LOADED
          </h3>
          <div className="flex flex-wrap gap-3">
            {tools.map((tool, i) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.08 }}
                className="font-pixel text-[8px] px-3 py-2 tracking-widest color-cycle-border text-white"
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
