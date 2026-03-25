"use client";
import { useEffect, useRef } from "react";

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const stars: { x: number; y: number; r: number; speed: number; twinkle: number; phase: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < 200; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.3,
          speed: Math.random() * 0.15 + 0.02,
          twinkle: Math.random() * Math.PI * 2,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const colors = ["#ffffff", "#00ffff", "#ff00ff", "#ffff00", "#00ff41"];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.twinkle += star.speed * 0.05;
        const opacity = 0.2 + 0.8 * ((Math.sin(star.twinkle + star.phase) + 1) / 2);
        const color = colors[Math.floor(star.r * 3) % colors.length];

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.fill();

        // Small glow
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * 2.5, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 2.5);
        grad.addColorStop(0, color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.globalAlpha = opacity * 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animId = requestAnimationFrame(draw);
    };

    resize();
    initStars();
    draw();

    window.addEventListener("resize", () => { resize(); initStars(); });
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
