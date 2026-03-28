"use client";
import { useEffect, useRef, useCallback, useState } from "react";

const COLS = 24;
const ROWS = 20;
const CELL = 18;
const W = COLS * CELL;
const H = ROWS * CELL;

type Dir = "U" | "D" | "L" | "R";
type Pt = { x: number; y: number };

function rand(max: number) { return Math.floor(Math.random() * max); }
function spawnFood(snake: Pt[]): Pt {
  let f: Pt;
  do { f = { x: rand(COLS), y: rand(ROWS) }; }
  while (snake.some(s => s.x === f.x && s.y === f.y));
  return f;
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snake = useRef<Pt[]>([{ x: 12, y: 10 }]);
  const dir = useRef<Dir>("R");
  const nextDir = useRef<Dir>("R");
  const food = useRef<Pt>(spawnFood(snake.current));
  const running = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [score, setScore] = useState(0);
  const [state, setState] = useState<"idle" | "playing" | "dead">("idle");
  const scoreRef = useRef(0);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Background grid
    ctx.fillStyle = "#0A3D35";
    ctx.fillRect(0, 0, W, H);
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        ctx.fillStyle = (c + r) % 2 === 0 ? "#0D4A3E" : "#0A3D35";
        ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
      }
    }

    // Food
    const f = food.current;
    ctx.fillStyle = "#FFD166";
    ctx.fillRect(f.x * CELL + 2, f.y * CELL + 2, CELL - 4, CELL - 4);
    // Food shine
    ctx.fillStyle = "#FFE9A0";
    ctx.fillRect(f.x * CELL + 4, f.y * CELL + 4, 4, 4);

    // Snake
    snake.current.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? "#AEFAF0" : "#2DC8A8";
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      if (isHead) {
        // Eyes
        ctx.fillStyle = "#0A3D35";
        const eyeOff = dir.current;
        if (eyeOff === "R") { ctx.fillRect(seg.x*CELL+12, seg.y*CELL+4, 3, 3); ctx.fillRect(seg.x*CELL+12, seg.y*CELL+11, 3, 3); }
        if (eyeOff === "L") { ctx.fillRect(seg.x*CELL+3, seg.y*CELL+4, 3, 3); ctx.fillRect(seg.x*CELL+3, seg.y*CELL+11, 3, 3); }
        if (eyeOff === "U") { ctx.fillRect(seg.x*CELL+4, seg.y*CELL+3, 3, 3); ctx.fillRect(seg.x*CELL+11, seg.y*CELL+3, 3, 3); }
        if (eyeOff === "D") { ctx.fillRect(seg.x*CELL+4, seg.y*CELL+12, 3, 3); ctx.fillRect(seg.x*CELL+11, seg.y*CELL+12, 3, 3); }
      }
    });
  }, []);

  const tick = useCallback(() => {
    dir.current = nextDir.current;
    const head = snake.current[0];
    const next: Pt = {
      x: (head.x + (dir.current === "R" ? 1 : dir.current === "L" ? -1 : 0) + COLS) % COLS,
      y: (head.y + (dir.current === "D" ? 1 : dir.current === "U" ? -1 : 0) + ROWS) % ROWS,
    };
    // Self collision
    if (snake.current.some(s => s.x === next.x && s.y === next.y)) {
      running.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      setState("dead");
      return;
    }
    snake.current = [next, ...snake.current];
    if (next.x === food.current.x && next.y === food.current.y) {
      food.current = spawnFood(snake.current);
      scoreRef.current += 10;
      setScore(scoreRef.current);
    } else {
      snake.current.pop();
    }
    draw();
  }, [draw]);

  const start = useCallback(() => {
    snake.current = [{ x: 12, y: 10 }];
    dir.current = "R";
    nextDir.current = "R";
    food.current = spawnFood(snake.current);
    scoreRef.current = 0;
    setScore(0);
    setState("playing");
    running.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 120);
    draw();
  }, [tick, draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "U", ArrowDown: "D", ArrowLeft: "L", ArrowRight: "R",
        w: "U", s: "D", a: "L", d: "R",
      };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      const opposite: Record<Dir, Dir> = { U: "D", D: "U", L: "R", R: "L" };
      if (d !== opposite[dir.current]) nextDir.current = d;
      if (!running.current && state === "idle") start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start, state]);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
      fontFamily: "'Press Start 2P', monospace",
    }}>
      {/* Score bar */}
      <div style={{
        width: W,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6px 10px",
        background: "#0A3D35",
        border: "2px solid",
        borderColor: "var(--bevel-sh) var(--bevel-hl) var(--bevel-hl) var(--bevel-sh)",
      }}>
        <span style={{ fontSize: 9, color: "#AEFAF0" }}>🐍 SNAKE</span>
        <span style={{ fontSize: 9, color: "#FFD166" }}>SCORE: {score}</span>
      </div>

      {/* Canvas */}
      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          style={{
            display: "block",
            border: "3px solid",
            borderColor: "var(--bevel-sh) var(--bevel-hl) var(--bevel-hl) var(--bevel-sh)",
          }}
        />

        {/* Overlay for idle / dead */}
        {(state === "idle" || state === "dead") && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10,61,53,0.85)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}>
            {state === "dead" && (
              <div style={{ fontSize: 11, color: "#FFD166", textAlign: "center", lineHeight: 2 }}>
                GAME OVER<br />
                <span style={{ fontSize: 9, color: "#AEFAF0" }}>score: {score}</span>
              </div>
            )}
            {state === "idle" && (
              <div style={{ fontSize: 9, color: "#AEFAF0", textAlign: "center", lineHeight: 2.2 }}>
                🐍 ready?
              </div>
            )}
            <button
              onClick={start}
              style={{
                background: "#FFD166",
                border: "3px solid",
                borderColor: "#FFE9A0 #B8902A #B8902A #FFE9A0",
                padding: "8px 20px",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                color: "#0A3D35",
              }}
            >
              {state === "dead" ? "RETRY" : "START"}
            </button>
            <span style={{ fontSize: 8, color: "#2DC8A8" }}>arrow keys or WASD</span>
          </div>
        )}
      </div>
    </div>
  );
}
