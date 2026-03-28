"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const COLS = 15, ROWS = 13, CELL = 26;
const W = COLS * CELL, H = ROWS * CELL;
const WL = 1, DT = 0, EM = 2, PW = 3;

const MAZE_INIT: number[][] = [
  [WL,WL,WL,WL,WL,WL,WL,WL,WL,WL,WL,WL,WL,WL,WL],
  [WL,DT,DT,DT,DT,DT,WL,DT,WL,DT,DT,DT,DT,DT,WL],
  [WL,PW,WL,WL,DT,WL,WL,DT,WL,DT,WL,WL,DT,PW,WL],
  [WL,DT,WL,WL,DT,WL,WL,DT,WL,DT,WL,WL,DT,DT,WL],
  [WL,DT,DT,DT,DT,DT,DT,DT,DT,DT,DT,DT,DT,DT,WL],
  [WL,DT,WL,WL,DT,WL,EM,EM,EM,WL,DT,WL,WL,DT,WL],
  [WL,DT,DT,DT,DT,WL,EM,EM,EM,WL,DT,DT,DT,DT,WL],
  [WL,DT,WL,WL,DT,WL,EM,EM,EM,WL,DT,WL,WL,DT,WL],
  [WL,DT,DT,DT,DT,DT,DT,DT,DT,DT,DT,DT,DT,DT,WL],
  [WL,DT,WL,WL,DT,WL,WL,DT,WL,WL,DT,WL,WL,DT,WL],
  [WL,PW,DT,WL,DT,WL,WL,DT,WL,WL,DT,WL,DT,PW,WL],
  [WL,DT,DT,DT,DT,DT,WL,DT,WL,DT,DT,DT,DT,DT,WL],
  [WL,WL,WL,WL,WL,WL,WL,WL,WL,WL,WL,WL,WL,WL,WL],
];

type Dir = "U" | "D" | "L" | "R";
type Pt = { x: number; y: number };
const DVEC: Record<Dir, Pt> = { U:{x:0,y:-1}, D:{x:0,y:1}, L:{x:-1,y:0}, R:{x:1,y:0} };
const OPP: Record<Dir, Dir> = { U:"D", D:"U", L:"R", R:"L" };

function walkable(maze: number[][], x: number, y: number): boolean {
  return x >= 0 && x < COLS && y >= 0 && y < ROWS && maze[y][x] !== WL;
}

function dist(a: Pt, b: Pt) { return Math.abs(a.x-b.x) + Math.abs(a.y-b.y); }

interface GameRef {
  maze: number[][];
  pac: { pos: Pt; dir: Dir; nextDir: Dir | null; mouth: number; mouthDir: number };
  ghosts: { pos: Pt; dir: Dir; color: string; frightened: boolean; frightenFrames: number }[];
  score: number;
  lives: number;
  status: "idle"|"playing"|"won"|"lost";
  frame: number;
}

function initState(): GameRef {
  return {
    maze: MAZE_INIT.map(r => [...r]),
    pac: { pos:{x:7,y:10}, dir:"L", nextDir:null, mouth:0.25, mouthDir:1 },
    ghosts: [
      { pos:{x:6,y:5}, dir:"R", color:"#EF476F", frightened:false, frightenFrames:0 },
      { pos:{x:8,y:7}, dir:"L", color:"#FF9F1C", frightened:false, frightenFrames:0 },
    ],
    score: 0, lives: 3, status: "idle", frame: 0,
  };
}

export default function PacmanGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameRef>(initState());
  const rafRef = useRef<number>(0);
  const [ui, setUi] = useState({ score: 0, lives: 3, status: "idle" as GameRef["status"] });

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { maze, pac, ghosts } = stateRef.current;

    ctx.fillStyle = "#0A1628";
    ctx.fillRect(0, 0, W, H);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const v = maze[r][c];
        const px = c*CELL, py = r*CELL;
        if (v === WL) {
          ctx.fillStyle = "#1A3A6A";
          ctx.fillRect(px, py, CELL, CELL);
          ctx.strokeStyle = "#2A5AB0";
          ctx.lineWidth = 1;
          ctx.strokeRect(px+0.5, py+0.5, CELL-1, CELL-1);
        } else if (v === DT) {
          ctx.fillStyle = "#AEFAF0";
          ctx.beginPath();
          ctx.arc(px+CELL/2, py+CELL/2, 2.5, 0, Math.PI*2);
          ctx.fill();
        } else if (v === PW) {
          const pulse = 0.7 + 0.3 * Math.sin(stateRef.current.frame * 0.15);
          ctx.fillStyle = "#FFD166";
          ctx.globalAlpha = pulse;
          ctx.beginPath();
          ctx.arc(px+CELL/2, py+CELL/2, 5.5, 0, Math.PI*2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    }

    // Ghosts
    ghosts.forEach(g => {
      const px = g.pos.x*CELL+CELL/2, py = g.pos.y*CELL+CELL/2;
      const col = g.frightened
        ? (g.frightenFrames < 60 && Math.floor(g.frightenFrames/8)%2===0 ? "#FFFFFF" : "#4361EE")
        : g.color;
      ctx.fillStyle = col;
      const r = CELL/2 - 2;
      ctx.beginPath();
      ctx.arc(px, py-1, r, Math.PI, 0);
      ctx.lineTo(px+r, py+r);
      for (let i=3; i>=0; i--) {
        ctx.arc(px - r + (r*2/3)*(i+0.5), py+r, r/3, 0, Math.PI, i%2===0);
      }
      ctx.closePath();
      ctx.fill();
      if (!g.frightened) {
        ctx.fillStyle = "white";
        ctx.beginPath(); ctx.arc(px-4, py-3, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(px+4, py-3, 3, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#118AB2";
        ctx.beginPath(); ctx.arc(px-3.5, py-2.5, 1.5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(px+4.5, py-2.5, 1.5, 0, Math.PI*2); ctx.fill();
      }
    });

    // Pac-Man
    const px = pac.pos.x*CELL+CELL/2, py = pac.pos.y*CELL+CELL/2;
    const angleMap: Record<Dir, number> = { R:0, L:Math.PI, U:-Math.PI/2, D:Math.PI/2 };
    const base = angleMap[pac.dir];
    const m = pac.mouth * Math.PI;
    ctx.fillStyle = "#FFD166";
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(px, py, CELL/2-1, base+m, base+Math.PI*2-m);
    ctx.closePath();
    ctx.fill();
    // Eye
    ctx.fillStyle = "#0A3D35";
    ctx.beginPath();
    ctx.arc(px + Math.cos(base-Math.PI/3)*5, py + Math.sin(base-Math.PI/3)*5, 2, 0, Math.PI*2);
    ctx.fill();
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (s.status !== "playing") return;
    s.frame++;

    // Pac-Man moves every 8 frames
    if (s.frame % 8 === 0) {
      s.pac.mouth += 0.07 * s.pac.mouthDir;
      if (s.pac.mouth >= 0.38 || s.pac.mouth <= 0.02) s.pac.mouthDir *= -1;

      const tryMove = (d: Dir | null): boolean => {
        if (!d) return false;
        const dv = DVEC[d];
        const nx = s.pac.pos.x + dv.x, ny = s.pac.pos.y + dv.y;
        if (!walkable(s.maze, nx, ny)) return false;
        s.pac.pos = {x: nx, y: ny};
        s.pac.dir = d;
        return true;
      };
      if (!tryMove(s.pac.nextDir)) tryMove(s.pac.dir);

      const cell = s.maze[s.pac.pos.y][s.pac.pos.x];
      if (cell === DT) {
        s.maze[s.pac.pos.y][s.pac.pos.x] = EM;
        s.score += 10;
      } else if (cell === PW) {
        s.maze[s.pac.pos.y][s.pac.pos.x] = EM;
        s.score += 50;
        s.ghosts = s.ghosts.map(g => ({ ...g, frightened: true, frightenFrames: 0 }));
      }

      const dotsLeft = s.maze.flat().filter(c => c === DT || c === PW).length;
      if (dotsLeft === 0) {
        s.status = "won";
        setUi({ score: s.score, lives: s.lives, status: "won" });
        cancelAnimationFrame(rafRef.current);
        draw(); return;
      }
    }

    // Ghosts move every 14 frames
    if (s.frame % 14 === 0) {
      s.ghosts = s.ghosts.map((g, gi) => {
        g = { ...g, frightenFrames: g.frightened ? g.frightenFrames + 1 : 0 };
        if (g.frightened && g.frightenFrames > 180) g = { ...g, frightened: false };

        const validDirs = (["U","D","L","R"] as Dir[]).filter(d => {
          if (g.dir && d === OPP[g.dir]) return false;
          const dv = DVEC[d];
          return walkable(s.maze, g.pos.x+dv.x, g.pos.y+dv.y);
        });
        const options = validDirs.length > 0 ? validDirs : ([OPP[g.dir]] as Dir[]);
        let chosen: Dir;
        if (g.frightened) {
          chosen = options.reduce((b, d) => {
            return dist({x:g.pos.x+DVEC[d].x, y:g.pos.y+DVEC[d].y}, s.pac.pos) >
                   dist({x:g.pos.x+DVEC[b].x, y:g.pos.y+DVEC[b].y}, s.pac.pos) ? d : b;
          }, options[0]);
        } else if (gi === 1 && Math.random() < 0.35) {
          chosen = options[Math.floor(Math.random()*options.length)];
        } else {
          chosen = options.reduce((b, d) => {
            return dist({x:g.pos.x+DVEC[d].x, y:g.pos.y+DVEC[d].y}, s.pac.pos) <
                   dist({x:g.pos.x+DVEC[b].x, y:g.pos.y+DVEC[b].y}, s.pac.pos) ? d : b;
          }, options[0]);
        }
        const dv = DVEC[chosen];
        return { ...g, pos: {x: g.pos.x+dv.x, y: g.pos.y+dv.y}, dir: chosen };
      });
    }

    // Collision
    let died = false;
    s.ghosts = s.ghosts.map(g => {
      if (g.pos.x === s.pac.pos.x && g.pos.y === s.pac.pos.y) {
        if (g.frightened) { s.score += 200; return { ...g, frightened:false, pos:{x:6,y:5} }; }
        died = true;
      }
      return g;
    });

    if (died) {
      s.lives--;
      if (s.lives <= 0) {
        s.status = "lost";
        setUi({ score: s.score, lives: 0, status: "lost" });
        cancelAnimationFrame(rafRef.current);
        draw(); return;
      }
      s.pac.pos = {x:7,y:10}; s.pac.dir = "L"; s.pac.nextDir = null;
    }

    setUi(prev => prev.score !== s.score || prev.lives !== s.lives
      ? { score: s.score, lives: s.lives, status: s.status } : prev);

    draw();
    rafRef.current = requestAnimationFrame(tick);
  }, [draw]);

  const start = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    stateRef.current = initState();
    stateRef.current.status = "playing";
    setUi({ score: 0, lives: 3, status: "playing" });
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => { draw(); }, [draw]);

  useEffect(() => {
    const map: Partial<Record<string, Dir>> = {
      ArrowUp:"U", ArrowDown:"D", ArrowLeft:"L", ArrowRight:"R", w:"U", s:"D", a:"L", d:"R",
    };
    const onKey = (e: KeyboardEvent) => {
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      stateRef.current.pac.nextDir = d;
      if (stateRef.current.status === "idle") start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [start]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const hearts = "❤️".repeat(Math.max(0, ui.lives));

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, fontFamily:"'Press Start 2P', monospace" }}>
      <div style={{
        width: W, display:"flex", justifyContent:"space-between", padding:"7px 12px",
        background:"#0A3D35", border:"2px solid", borderColor:"var(--bevel-sh) var(--bevel-hl) var(--bevel-hl) var(--bevel-sh)",
      }}>
        <span style={{ fontSize:9, color:"#FFD166" }}>SCORE: {ui.score}</span>
        <span style={{ fontSize:12 }}>{hearts}</span>
      </div>

      <div style={{ position:"relative" }}>
        <canvas ref={canvasRef} width={W} height={H} style={{
          display:"block", border:"3px solid",
          borderColor:"var(--bevel-sh) var(--bevel-hl) var(--bevel-hl) var(--bevel-sh)",
        }} />

        {(ui.status === "idle" || ui.status === "won" || ui.status === "lost") && (
          <div style={{
            position:"absolute", inset:0, background:"rgba(10,22,40,0.88)",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:14,
          }}>
            {ui.status !== "idle" && (
              <div style={{ fontSize:11, color: ui.status==="won"?"#FFD166":"#EF476F", textAlign:"center", lineHeight:2 }}>
                {ui.status==="won" ? "YOU WIN! 🎉" : "GAME OVER 👾"}
                <br/><span style={{ fontSize:8, color:"#AEFAF0" }}>score: {ui.score}</span>
              </div>
            )}
            {ui.status === "idle" && <div style={{ fontSize:13, color:"#FFD166", letterSpacing:"0.06em" }}>PAC-MAN</div>}
            <button onClick={start} style={{
              background:"#FFD166", border:"3px solid", borderColor:"#FFE9A0 #B8902A #B8902A #FFE9A0",
              padding:"9px 22px", fontFamily:"'Press Start 2P', monospace", fontSize:11, color:"#0A3D35",
            }}>
              {ui.status === "idle" ? "START" : "RETRY"}
            </button>
            <span style={{ fontSize:8, color:"#2DC8A8" }}>arrow keys or WASD</span>
          </div>
        )}
      </div>
    </div>
  );
}
