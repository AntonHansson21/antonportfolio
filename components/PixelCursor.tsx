"use client";
import { useEffect, useRef, useState } from "react";

interface TrailDot {
  x: number;
  y: number;
  id: number;
  opacity: number;
}

export default function PixelCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [clicked, setClicked] = useState(false);
  const trailIdRef = useRef(0);

  useEffect(() => {
    let lastTime = 0;

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      setPos({ x: e.clientX, y: e.clientY });

      if (now - lastTime > 30) {
        lastTime = now;
        const id = trailIdRef.current++;
        setTrail((prev) => [
          ...prev.slice(-14),
          { x: e.clientX, y: e.clientY, id, opacity: 1 },
        ]);
      }
    };

    const onDown = () => setClicked(true);
    const onUp = () => setClicked(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const colors = [
    "#ff00ff", "#cc00ff", "#9900ff", "#6600ff",
    "#3300ff", "#0066ff", "#00aaff", "#00ffff",
    "#00ff99", "#00ff41",
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999]">
      {/* Trail */}
      {trail.map((dot, i) => {
        const size = Math.max(2, Math.round(6 * (i / trail.length)));
        const color = colors[Math.floor((i / trail.length) * colors.length)];
        return (
          <div
            key={dot.id}
            style={{
              position: "absolute",
              left: dot.x - size / 2,
              top: dot.y - size / 2,
              width: size,
              height: size,
              backgroundColor: color,
              opacity: (i / trail.length) * 0.8,
              boxShadow: `0 0 ${size * 2}px ${color}`,
              imageRendering: "pixelated",
            }}
          />
        );
      })}

      {/* Main cursor — pixel cross shape */}
      <div
        style={{
          position: "absolute",
          left: pos.x - 8,
          top: pos.y - 8,
          width: 16,
          height: 16,
          transform: clicked ? "scale(0.7)" : "scale(1)",
          transition: "transform 0.1s",
        }}
      >
        {/* Cross pixels */}
        {[
          { l: 6, t: 0, w: 4, h: 4 },
          { l: 6, t: 12, w: 4, h: 4 },
          { l: 0, t: 6, w: 4, h: 4 },
          { l: 12, t: 6, w: 4, h: 4 },
          { l: 4, t: 4, w: 8, h: 8 },
        ].map((p, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: p.l,
              top: p.t,
              width: p.w,
              height: p.h,
              backgroundColor: "#00ffff",
              boxShadow: "0 0 6px #00ffff, 0 0 12px #00ffff",
            }}
          />
        ))}
      </div>
    </div>
  );
}
