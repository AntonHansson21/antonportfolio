"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlitchText from "./GlitchText";

const ROLES = ["UX DESIGNER", "INTERACTION DESIGNER", "VISUAL STORYTELLER", "PIXEL CRAFTSMAN"];

function useTypewriter() {
  const [displayed, setDisplayed] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const target = ROLES[roleIdx];
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else {
        setRoleIdx((i) => (i + 1) % ROLES.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, roleIdx]);

  return displayed;
}

export default function HeroSection() {
  const role = useTypewriter();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 z-10"
    >
      {/* Top badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8 font-pixel text-[9px] text-[#00ff41] tracking-[0.3em] glow-green"
      >
        &gt; PORTFOLIO_v2.0K &lt;
      </motion.div>

      {/* Main name */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
        className="font-pixel text-4xl sm:text-6xl md:text-7xl leading-tight mb-6 glow-cyan text-[#00ffff] select-none"
      >
        <GlitchText text="ADAM" />
      </motion.h1>

      {/* Typewriter role */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="font-vt text-3xl sm:text-4xl text-[#ff00ff] glow-pink mb-8 h-12 flex items-center"
      >
        {role}
        <span className="blink ml-1 text-[#ff00ff]">_</span>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="font-mono-tech text-sm sm:text-base text-[#aaa] max-w-xl mb-12 leading-relaxed"
      >
        Crafting digital experiences that live at the intersection of function and fantasy.
        Pixel by pixel. Screen by screen.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button
          onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
          className="pixel-corners color-cycle-border bg-transparent font-pixel text-[10px] text-white px-8 py-4 tracking-widest hover:bg-[rgba(255,0,255,0.1)] transition-all duration-300"
        >
          VIEW WORK
        </button>
        <button
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          className="pixel-corners font-pixel text-[10px] text-[#00ffff] px-8 py-4 tracking-widest border border-[#00ffff33] hover:border-[#00ffff] hover:bg-[rgba(0,255,255,0.08)] transition-all duration-300"
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 12px #00ffff")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          CONTACT ME
        </button>
      </motion.div>

      {/* Scroll arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 float-anim"
      >
        <div className="font-pixel text-[8px] text-[#555] tracking-widest flex flex-col items-center gap-2">
          <span>SCROLL</span>
          <div className="flex flex-col gap-[3px] items-center">
            <div className="w-px h-3 bg-[#555]" />
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#555]" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
