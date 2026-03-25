"use client";
import { useEffect, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const trigger = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 400);
    };

    // Random glitch bursts
    const scheduleGlitch = () => {
      const delay = 1500 + Math.random() * 4000;
      return setTimeout(() => {
        trigger();
        scheduleGlitch();
      }, delay);
    };

    const t = scheduleGlitch();
    return () => clearTimeout(t);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Base text */}
      <span className="relative z-10">{text}</span>

      {/* Glitch layer 1 */}
      <span
        aria-hidden
        className="absolute inset-0 z-20"
        style={{
          color: "#ff00ff",
          animation: isGlitching ? "glitch 0.4s steps(1) forwards" : "none",
          opacity: isGlitching ? 1 : 0,
        }}
      >
        {text}
      </span>

      {/* Glitch layer 2 */}
      <span
        aria-hidden
        className="absolute inset-0 z-20"
        style={{
          color: "#00ffff",
          animation: isGlitching ? "glitch2 0.4s steps(1) forwards" : "none",
          opacity: isGlitching ? 1 : 0,
          animationDelay: "0.05s",
        }}
      >
        {text}
      </span>
    </span>
  );
}
