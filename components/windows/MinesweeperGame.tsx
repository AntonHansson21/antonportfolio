"use client";
import { useState, useCallback, useEffect, useRef } from "react";

const COLS = 12, ROWS = 9, MINE_COUNT = 10, CELL = 34;

type Cell = { mine: boolean; revealed: boolean; flagged: boolean; count: number };
type Status = "idle" | "playing" | "won" | "lost";

const NUM_COLORS = ["", "#118AB2", "#06D6A0", "#EF476F", "#073B4C", "#9B2226", "#00B4D8", "#0A3D35", "#6A9988"];

function blank(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, revealed: false, flagged: false, count: 0 }))
  );
}

function withMines(sr: number, sc: number): Cell[][] {
  const g = blank();
  let n = 0;
  while (n < MINE_COUNT) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (g[r][c].mine || (Math.abs(r - sr) <= 1 && Math.abs(c - sc) <= 1)) continue;
    g[r][c].mine = true;
    n++;
  }
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (!g[r][c].mine)
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++)
            if (g[r + dr]?.[c + dc]?.mine) g[r][c].count++;
  return g;
}

function cascade(g: Cell[][], r: number, c: number): Cell[][] {
  const ng = g.map(row => row.map(cl => ({ ...cl })));
  const q = [[r, c]];
  while (q.length) {
    const [cr, cc] = q.pop()!;
    if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS) continue;
    const cell = ng[cr][cc];
    if (cell.revealed || cell.flagged) continue;
    cell.revealed = true;
    if (cell.count === 0 && !cell.mine)
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          q.push([cr + dr, cc + dc]);
  }
  return ng;
}

export default function MinesweeperGame() {
  const [grid, setGrid] = useState<Cell[][]>(blank);
  const [status, setStatus] = useState<Status>("idle");
  const [flags, setFlags] = useState(0);
  const [time, setTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gridRef = useRef(grid);
  const statusRef = useRef(status);
  gridRef.current = grid;
  statusRef.current = status;

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer(); setTime(0);
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
  }, [stopTimer]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const reset = useCallback(() => {
    stopTimer(); setGrid(blank()); setStatus("idle"); setFlags(0); setTime(0);
  }, [stopTimer]);

  const handleClick = useCallback((r: number, c: number) => {
    const st = statusRef.current;
    if (st === "won" || st === "lost") return;
    const prev = gridRef.current;
    const cell = prev[r][c];
    if (cell.revealed || cell.flagged) return;

    let g = prev;
    if (st === "idle") { g = withMines(r, c); startTimer(); setStatus("playing"); }

    if (g[r][c].mine) {
      const ng = g.map(row => row.map(cl => ({ ...cl, revealed: cl.mine ? true : cl.revealed })));
      setGrid(ng); setStatus("lost"); stopTimer(); return;
    }

    const ng = cascade(g, r, c);
    const won = ng.every(row => row.every(cl => cl.mine || cl.revealed));
    setGrid(ng);
    if (won) { setStatus("won"); stopTimer(); } else if (st === "idle") setStatus("playing");
  }, [startTimer, stopTimer]);

  const handleRightClick = useCallback((e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    const st = statusRef.current;
    if (st !== "playing") return;
    setGrid(prev => {
      const cell = prev[r][c];
      if (cell.revealed) return prev;
      const ng = prev.map(row => row.map(cl => ({ ...cl })));
      ng[r][c].flagged = !ng[r][c].flagged;
      setFlags(f => f + (ng[r][c].flagged ? 1 : -1));
      return ng;
    });
  }, []);

  const remaining = Math.max(0, MINE_COUNT - flags);

  return (
    <div style={{ fontFamily: "'Press Start 2P', monospace", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      {/* Header */}
      <div style={{
        width: COLS * CELL, display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 12px", background: "#0A3D35",
        border: "2px solid", borderColor: "var(--bevel-sh) var(--bevel-hl) var(--bevel-hl) var(--bevel-sh)",
      }}>
        <span style={{ fontSize: 9, color: "#EF476F" }}>💣 {remaining}</span>
        <button onClick={reset} style={{
          background: "#FFD166", border: "2px solid", borderColor: "#FFE9A0 #B8902A #B8902A #FFE9A0",
          padding: "4px 10px", fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: "#0A3D35",
        }}>
          {status === "won" ? "😎" : status === "lost" ? "😵" : "🙂"}
        </button>
        <span style={{ fontSize: 9, color: "#AEFAF0" }}>⏱ {time}s</span>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid", gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
        border: "3px solid", borderColor: "var(--bevel-sh) var(--bevel-hl) var(--bevel-hl) var(--bevel-sh)",
      }}>
        {grid.map((row, r) => row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            onClick={() => handleClick(r, c)}
            onContextMenu={e => handleRightClick(e, r, c)}
            style={{
              width: CELL, height: CELL,
              background: cell.revealed ? (cell.mine ? "#EF476F" : "var(--win-bg)") : "var(--btn-face)",
              border: "2px solid",
              borderColor: cell.revealed
                ? "var(--bevel-sh) var(--bevel-hl) var(--bevel-hl) var(--bevel-sh)"
                : "var(--bevel-hl) var(--bevel-sh) var(--bevel-sh) var(--bevel-hl)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: cell.revealed && !cell.mine ? 13 : 16,
              color: cell.count > 0 ? NUM_COLORS[cell.count] : undefined,
              fontFamily: cell.revealed && !cell.mine && cell.count > 0 ? "'Press Start 2P', monospace" : undefined,
              fontWeight: "bold", boxSizing: "border-box",
            }}
          >
            {cell.revealed
              ? (cell.mine ? "💣" : (cell.count > 0 ? cell.count : ""))
              : (cell.flagged ? "🚩" : "")}
          </div>
        )))}
      </div>

      {(status === "won" || status === "lost") && (
        <div style={{ fontSize: 10, color: status === "won" ? "#FFD166" : "#EF476F", textAlign: "center", lineHeight: 2.2 }}>
          {status === "won" ? "YOU WIN! 🎉" : "BOOM! 💥"}<br />
          <button onClick={reset} style={{
            marginTop: 6, background: "#FFD166", border: "2px solid",
            borderColor: "#FFE9A0 #B8902A #B8902A #FFE9A0",
            padding: "6px 14px", fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: "#0A3D35",
          }}>PLAY AGAIN</button>
        </div>
      )}
      {status === "idle" && (
        <div style={{ fontSize: 8, color: "var(--text-dim)", textAlign: "center", lineHeight: 2 }}>
          click to reveal · right-click to flag
        </div>
      )}
    </div>
  );
}
