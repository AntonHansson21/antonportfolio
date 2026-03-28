"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pos = useRef({ x: -50, y: -50 });
  const clicking = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    const onDown = () => { clicking.current = true; };
    const onUp   = () => { clicking.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);

    // Classic Windows arrow cursor pixels (16×16 grid, 1=arrow body, 2=outline)
    const shape = [
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0],
      [1,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0],
      [1,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0],
      [1,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0],
      [1,2,2,2,2,2,2,2,1,0,0,0,0,0,0,0],
      [1,2,2,2,2,2,1,1,1,1,0,0,0,0,0,0],
      [1,2,2,1,2,2,1,0,0,0,0,0,0,0,0,0],
      [1,2,1,0,1,2,2,1,0,0,0,0,0,0,0,0],
      [1,1,0,0,1,2,2,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0],
      [0,0,0,0,0,1,2,1,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
    ];

    const S = clicking.current ? 1.5 : 2; // pixel size

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x, y } = pos.current;
      const scale = clicking.current ? 1.8 : 2;

      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          const v = shape[row][col];
          if (v === 0) continue;
          if (v === 2) {
            // Outline — dark teal
            ctx.fillStyle = "#0A4A3A";
          } else {
            // Fill — light mint
            ctx.fillStyle = "#AEFAF0";
          }
          ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 999999 }}
    />
  );
}
