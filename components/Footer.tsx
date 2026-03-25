"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#111] py-10 px-6 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="space-y-3"
      >
        <p className="font-pixel text-[8px] text-[#333] tracking-[0.4em]">
          ANTON_PORTFOLIO &copy; {new Date().getFullYear()}
        </p>
        <p className="font-mono-tech text-xs text-[#222]">
          BUILT WITH NEXT.JS &amp; FRAMER MOTION — DESIGNED IN THE VOID
        </p>
        <div className="flex justify-center gap-2 pt-2">
          {["#ff00ff", "#00ffff", "#00ff41", "#ffff00"].map((c) => (
            <div
              key={c}
              className="w-2 h-2"
              style={{ backgroundColor: c, boxShadow: `0 0 6px ${c}` }}
            />
          ))}
        </div>
      </motion.div>
    </footer>
  );
}
