"use client";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const projects = [
  {
    id: "01",
    title: "NEON BANK",
    tags: ["UX", "FINTECH", "MOBILE"],
    desc: "A Y2K-inspired banking app that makes money management feel like a video game. Full end-to-end UX with gamified saving mechanics.",
    color: "#ff00ff",
    accent: "#00ffff",
    year: "2024",
  },
  {
    id: "02",
    title: "PIXEL HEALTH",
    tags: ["UX", "HEALTH", "WEB"],
    desc: "Redesigning a health dashboard with retro-digital aesthetics. Increased user engagement by 62% through dopamine-driven micro-interactions.",
    color: "#00ff41",
    accent: "#ffff00",
    year: "2024",
  },
  {
    id: "03",
    title: "CYBER SHOP",
    tags: ["E-COMMERCE", "UX", "RESEARCH"],
    desc: "From zero to checkout — a full e-commerce UX overhaul. Reduced cart abandonment by 38% using data-driven design decisions.",
    color: "#00ffff",
    accent: "#ff00ff",
    year: "2023",
  },
  {
    id: "04",
    title: "RETRO OS",
    tags: ["UI", "CONCEPT", "DESKTOP"],
    desc: "A conceptual desktop OS interface inspired by Windows 95 aesthetics merged with modern UX principles. Pure nostalgia, reborn.",
    color: "#ffff00",
    accent: "#ff6600",
    year: "2023",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group pixel-corners overflow-hidden transition-all duration-300"
      style={{
        border: `1px solid ${hovered ? project.color : "#222"}`,
        boxShadow: hovered
          ? `0 0 20px ${project.color}55, inset 0 0 20px ${project.color}0a`
          : "none",
        background: hovered
          ? `linear-gradient(135deg, rgba(10,10,15,0.98), ${project.color}08)`
          : "rgba(10,10,15,0.8)",
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: hovered ? `${project.color}44` : "#1a1a1a" }}
      >
        <div className="flex gap-2">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c, opacity: 0.7 }} />
          ))}
        </div>
        <span className="font-pixel text-[8px] text-[#444]">{project.year}</span>
      </div>

      <div className="p-6">
        {/* Project number */}
        <div
          className="font-pixel text-[10px] mb-3"
          style={{ color: project.accent, textShadow: `0 0 12px ${project.accent}` }}
        >
          [{project.id}]
        </div>

        {/* Title */}
        <h3
          className="font-pixel text-base sm:text-xl mb-4 leading-snug transition-all duration-300"
          style={{
            color: hovered ? project.color : "#e0e0e0",
            textShadow: hovered ? `0 0 16px ${project.color}` : "none",
          }}
        >
          {project.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-pixel text-[7px] px-2 py-1 tracking-widest"
              style={{
                color: project.accent,
                border: `1px solid ${project.accent}44`,
                boxShadow: hovered ? `0 0 6px ${project.accent}44` : "none",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="font-mono-tech text-sm text-[#888] leading-relaxed mb-6">
          {project.desc}
        </p>

        {/* CTA */}
        <motion.button
          animate={{ x: hovered ? 4 : 0 }}
          className="font-pixel text-[9px] tracking-widest flex items-center gap-2 transition-colors duration-200"
          style={{ color: hovered ? project.color : "#555" }}
        >
          VIEW CASE STUDY
          <span style={{ fontSize: 12 }}>→</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative z-10 py-32 px-6 max-w-6xl mx-auto w-full">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <div className="font-pixel text-[9px] text-[#ff00ff] glow-pink tracking-[0.4em] mb-4">
          &gt; SELECTED_WORK
        </div>
        <h2 className="font-pixel text-2xl sm:text-4xl text-white glow-cyan mb-4">
          PROJECTS
        </h2>
        <div className="w-24 h-px bg-gradient-to-r from-[#ff00ff] to-transparent" />
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
