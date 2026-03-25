"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = ["HERO", "PROJECTS", "ABOUT", "CONTACT"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("HERO");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (link: string) => {
    setActive(link);
    document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-[9990] flex items-center justify-between px-8 py-4 transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(10,10,15,0.92)] backdrop-blur-md border-b border-[#00ffff33]"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <button
        onClick={() => handleClick("HERO")}
        className="font-pixel text-xs text-[#00ffff] glow-cyan neon-pulse tracking-widest"
      >
        A<span className="text-[#ff00ff]">N</span>T<span className="text-[#00ff41]">O</span>N H
      </button>

      {/* Nav links */}
      <div className="flex gap-8">
        {links.map((link) => (
          <button
            key={link}
            onClick={() => handleClick(link)}
            className="relative font-pixel text-[9px] tracking-widest group"
          >
            <span
              className={`transition-colors duration-200 ${
                active === link ? "text-[#ff00ff] glow-pink" : "text-[#888] hover:text-[#00ffff]"
              }`}
            >
              {link}
            </span>
            <AnimatePresence>
              {active === link && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#ff00ff]"
                  style={{ boxShadow: "0 0 8px #ff00ff" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                />
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
