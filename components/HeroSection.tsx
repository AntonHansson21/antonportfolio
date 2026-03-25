"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlitchText from "./GlitchText";

type Phase = "start" | "playing" | "dead" | "won" | "hero";

// ── Game constants ────────────────────────────────────────────────────────────
const GW = 640;
const GH = 400;
const COLS = 10;
const ROWS = 6;
const B_PAD = 4;
const B_H = 20;
const B_W = (GW - B_PAD * (COLS + 1)) / COLS;
const PAD_W = 96;
const PAD_H = 10;
const PAD_Y = GH - 36;
const BALL_R = 7;
const BASE_SPEED = 5;
const ROW_COLORS = ["#ff00ff", "#cc00ff", "#00ffff", "#00ff41", "#ffff00", "#ff6600"];

interface Brick { x: number; y: number; alive: boolean; color: string; flash: number }

// ── Typewriter hook ───────────────────────────────────────────────────────────
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

// ── Main component ────────────────────────────────────────────────────────────
export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<Phase>("start");
  const [phase, setPhase] = useState<Phase>("start");
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // mutable game state (not React state to avoid loop stalls)
  const paddle   = useRef({ x: GW / 2 - PAD_W / 2 });
  const ball     = useRef({ x: GW / 2, y: PAD_Y - BALL_R - 2, vx: BASE_SPEED * 0.7, vy: -BASE_SPEED });
  const bricks   = useRef<Brick[]>([]);
  const livesRef = useRef(3);
  const scoreRef = useRef(0);
  const mouseX   = useRef(GW / 2);
  const particles = useRef<{ x: number; y: number; vx: number; vy: number; color: string; life: number }[]>([]);
  const trail    = useRef<{ x: number; y: number }[]>([]);

  const role = useTypewriter();

  // ── Init bricks ─────────────────────────────────────────────────────────────
  const initBricks = () => {
    const b: Brick[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        b.push({
          x: B_PAD + c * (B_W + B_PAD),
          y: 44 + r * (B_H + B_PAD),
          alive: true,
          color: ROW_COLORS[r % ROW_COLORS.length],
          flash: 0,
        });
      }
    }
    bricks.current = b;
  };

  const resetBall = () => {
    ball.current = {
      x: GW / 2,
      y: PAD_Y - BALL_R - 2,
      vx: BASE_SPEED * 0.7 * (Math.random() > 0.5 ? 1 : -1),
      vy: -BASE_SPEED,
    };
  };

  // ── Start / restart ──────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    initBricks();
    resetBall();
    paddle.current.x = GW / 2 - PAD_W / 2;
    livesRef.current = 3;
    scoreRef.current = 0;
    particles.current = [];
    trail.current = [];
    setLives(3);
    setScore(0);
    phaseRef.current = "playing";
    setPhase("playing");
  }, []);

  const skipToHero = useCallback(() => {
    phaseRef.current = "hero";
    setPhase("hero");
  }, []);

  // ── Spawn particles ──────────────────────────────────────────────────────────
  const spawnParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      particles.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: 1,
      });
    }
  };

  // ── Game loop ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX.current = (e.clientX - rect.left) * (GW / rect.width);
    };
    const onTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX.current = (e.touches[0].clientX - rect.left) * (GW / rect.width);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  mouseX.current = Math.max(0, mouseX.current - 20);
      if (e.key === "ArrowRight") mouseX.current = Math.min(GW, mouseX.current + 20);
    };

    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("keydown", onKey);

    let animId: number;
    let t = 0;

    const loop = () => {
      animId = requestAnimationFrame(loop);
      t++;

      // ── Clear ─────────────────────────────────────────────────────────────
      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, GW, GH);

      // ── Grid ─────────────────────────────────────────────────────────────
      ctx.strokeStyle = "rgba(0,255,65,0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < GW; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, GH); ctx.stroke();
      }
      for (let y = 0; y < GH; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(GW, y); ctx.stroke();
      }

      if (phaseRef.current === "playing") {
        // ── Move paddle ───────────────────────────────────────────────────
        paddle.current.x = Math.max(0, Math.min(GW - PAD_W, mouseX.current - PAD_W / 2));

        // ── Move ball ─────────────────────────────────────────────────────
        const b = ball.current;

        // Record trail
        trail.current.push({ x: b.x, y: b.y });
        if (trail.current.length > 10) trail.current.shift();

        b.x += b.vx;
        b.y += b.vy;

        // Wall bounces
        if (b.x - BALL_R < 0)  { b.x = BALL_R;       b.vx =  Math.abs(b.vx); }
        if (b.x + BALL_R > GW) { b.x = GW - BALL_R;  b.vx = -Math.abs(b.vx); }
        if (b.y - BALL_R < 0)  { b.y = BALL_R;        b.vy =  Math.abs(b.vy); }

        // Ball lost
        if (b.y - BALL_R > GH + 20) {
          livesRef.current--;
          setLives(livesRef.current);
          trail.current = [];
          if (livesRef.current <= 0) {
            if (scoreRef.current > highScore) setHighScore(scoreRef.current);
            phaseRef.current = "dead";
            setPhase("dead");
          } else {
            resetBall();
          }
        }

        // Paddle collision
        if (
          b.vy > 0 &&
          b.y + BALL_R >= PAD_Y &&
          b.y + BALL_R <= PAD_Y + PAD_H + Math.abs(b.vy) &&
          b.x >= paddle.current.x - BALL_R &&
          b.x <= paddle.current.x + PAD_W + BALL_R
        ) {
          b.vy = -Math.abs(b.vy);
          const hit = (b.x - paddle.current.x) / PAD_W - 0.5; // -0.5 to 0.5
          b.vx = hit * 10;
          b.y = PAD_Y - BALL_R - 1;
        }

        // Brick collisions
        let remaining = 0;
        for (const brick of bricks.current) {
          if (!brick.alive) continue;
          remaining++;
          if (brick.flash > 0) brick.flash--;

          const overlapX = b.x + BALL_R > brick.x && b.x - BALL_R < brick.x + B_W;
          const overlapY = b.y + BALL_R > brick.y && b.y - BALL_R < brick.y + B_H;

          if (overlapX && overlapY) {
            brick.alive = false;
            remaining--;
            scoreRef.current += 10;
            setScore(scoreRef.current);
            spawnParticles(brick.x + B_W / 2, brick.y + B_H / 2, brick.color);

            // Which axis to bounce
            const fromLeft   = Math.abs((b.x + BALL_R) - brick.x);
            const fromRight  = Math.abs((b.x - BALL_R) - (brick.x + B_W));
            const fromTop    = Math.abs((b.y + BALL_R) - brick.y);
            const fromBottom = Math.abs((b.y - BALL_R) - (brick.y + B_H));
            const minH = Math.min(fromLeft, fromRight);
            const minV = Math.min(fromTop, fromBottom);
            if (minV < minH) b.vy *= -1;
            else             b.vx *= -1;
            break;
          }
        }

        if (remaining === 0 && phaseRef.current === "playing") {
          if (scoreRef.current > highScore) setHighScore(scoreRef.current);
          phaseRef.current = "won";
          setPhase("won");
          setTimeout(() => {
            phaseRef.current = "hero";
            setPhase("hero");
          }, 2200);
        }
      }

      // ── Draw trail ────────────────────────────────────────────────────────
      trail.current.forEach((pt, i) => {
        const alpha = (i / trail.current.length) * 0.5;
        const r = BALL_R * (i / trail.current.length) * 0.8;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,255,${alpha})`;
        ctx.fill();
      });

      // ── Draw bricks ───────────────────────────────────────────────────────
      for (const brick of bricks.current) {
        if (!brick.alive) continue;
        ctx.fillStyle = brick.color + "18";
        ctx.fillRect(brick.x, brick.y, B_W, B_H);
        ctx.shadowColor = brick.color;
        ctx.shadowBlur = 8;
        ctx.strokeStyle = brick.color;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(brick.x + 0.5, brick.y + 0.5, B_W - 1, B_H - 1);
        ctx.shadowBlur = 0;
        // Pixel highlight
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(brick.x + 2, brick.y + 2, B_W - 4, 3);
      }

      // ── Draw particles ────────────────────────────────────────────────────
      particles.current = particles.current.filter((p) => p.life > 0);
      for (const p of particles.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12;
        p.life -= 0.04;
      }

      // ── Draw paddle ───────────────────────────────────────────────────────
      if (phaseRef.current === "playing" || phaseRef.current === "won") {
        ctx.fillStyle = "rgba(0,255,255,0.12)";
        ctx.fillRect(paddle.current.x, PAD_Y, PAD_W, PAD_H);
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 16;
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 2;
        ctx.strokeRect(paddle.current.x, PAD_Y, PAD_W, PAD_H);
        // Corner pixels
        ctx.fillStyle = "#00ffff";
        ctx.fillRect(paddle.current.x, PAD_Y, 4, 4);
        ctx.fillRect(paddle.current.x + PAD_W - 4, PAD_Y, 4, 4);
        ctx.shadowBlur = 0;
      }

      // ── Draw ball ─────────────────────────────────────────────────────────
      if (phaseRef.current === "playing") {
        const b = ball.current;
        ctx.beginPath();
        ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 20;
        ctx.fill();
        // Pixel center
        ctx.fillStyle = "#00ffff";
        ctx.fillRect(b.x - 2, b.y - 2, 4, 4);
        ctx.shadowBlur = 0;
      }

      // ── HUD: lives ────────────────────────────────────────────────────────
      if (phaseRef.current === "playing") {
        ctx.font = "8px 'Press Start 2P', monospace";
        ctx.fillStyle = "#555";
        ctx.fillText("LIVES", 8, GH - 10);
        for (let i = 0; i < livesRef.current; i++) {
          ctx.beginPath();
          ctx.arc(56 + i * 16, GH - 13, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#ff00ff";
          ctx.shadowColor = "#ff00ff";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        // Score
        ctx.fillStyle = "#555";
        ctx.fillText("SCORE", GW - 100, GH - 10);
        ctx.fillStyle = "#00ffff";
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 6;
        ctx.fillText(String(scoreRef.current).padStart(4, "0"), GW - 36, GH - 10);
        ctx.shadowBlur = 0;
      }

      // ── "WON" flash ───────────────────────────────────────────────────────
      if (phaseRef.current === "won") {
        ctx.fillStyle = `rgba(0,255,65,${0.15 + 0.1 * Math.sin(t * 0.2)})`;
        ctx.fillRect(0, 0, GW, GH);
        ctx.font = "20px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = "#00ff41";
        ctx.shadowColor = "#00ff41";
        ctx.shadowBlur = 30;
        ctx.fillText("ACCESS GRANTED", GW / 2, GH / 2);
        ctx.font = "10px 'Press Start 2P', monospace";
        ctx.fillStyle = "#00ffff";
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 12;
        ctx.fillText(`SCORE: ${scoreRef.current}`, GW / 2, GH / 2 + 36);
        ctx.shadowBlur = 0;
        ctx.textAlign = "left";
      }
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouch);
      window.removeEventListener("keydown", onKey);
    };
  }, [highScore]);

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 z-10"
    >
      <AnimatePresence mode="wait">

        {/* ── GAME PHASE ─────────────────────────────────────────────────── */}
        {phase !== "hero" && (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-full max-w-[640px]"
          >
            {/* Title */}
            <div className="font-pixel text-[9px] text-[#00ff41] glow-green tracking-[0.3em] mb-4">
              &gt; BREAK IN TO ACCESS PORTFOLIO &lt;
            </div>

            {/* Canvas wrapper */}
            <div
              className="relative w-full"
              style={{ aspectRatio: `${GW}/${GH}` }}
            >
              <canvas
                ref={canvasRef}
                width={GW}
                height={GH}
                className="w-full h-full block pixel-corners color-cycle-border"
              />

              {/* ── START overlay ──────────────────────────────────────── */}
              {phase === "start" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(10,10,15,0.88)] pixel-corners">
                  <p className="font-pixel text-[9px] text-[#00ff41] glow-green tracking-widest mb-2">
                    SYSTEM LOCKED
                  </p>
                  <h2 className="font-pixel text-2xl sm:text-3xl text-[#ff00ff] glow-pink mb-2 text-center leading-tight">
                    BREAK THE<br />FIREWALL
                  </h2>
                  <p className="font-mono-tech text-sm text-[#666] mb-8">
                    Move mouse to control paddle · Clear all bricks to unlock
                  </p>
                  <motion.button
                    onClick={startGame}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="font-pixel text-[10px] text-white px-8 py-4 color-cycle-border pixel-corners tracking-widest hover:bg-[rgba(255,0,255,0.1)] transition-colors mb-4"
                  >
                    START GAME
                  </motion.button>
                  {highScore > 0 && (
                    <p className="font-pixel text-[8px] text-[#444]">
                      HIGH SCORE: {highScore}
                    </p>
                  )}
                </div>
              )}

              {/* ── DEAD overlay ───────────────────────────────────────── */}
              {phase === "dead" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(10,10,15,0.92)] pixel-corners">
                  <p className="font-pixel text-[9px] text-[#ff00ff] glow-pink tracking-widest mb-2">
                    CONNECTION LOST
                  </p>
                  <h2 className="font-pixel text-2xl text-white mb-2">GAME OVER</h2>
                  <p className="font-pixel text-[10px] text-[#00ffff] glow-cyan mb-8">
                    SCORE: {score}
                  </p>
                  <div className="flex gap-4">
                    <motion.button
                      onClick={startGame}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="font-pixel text-[9px] text-white px-6 py-3 color-cycle-border pixel-corners tracking-widest"
                    >
                      RETRY
                    </motion.button>
                    <motion.button
                      onClick={skipToHero}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="font-pixel text-[9px] text-[#555] px-6 py-3 border border-[#333] pixel-corners tracking-widest hover:text-[#888]"
                    >
                      SKIP
                    </motion.button>
                  </div>
                </div>
              )}
            </div>

            {/* Skip button (always visible during play) */}
            {phase === "playing" && (
              <motion.button
                onClick={skipToHero}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-4 font-pixel text-[8px] text-[#333] hover:text-[#666] tracking-widest transition-colors"
              >
                SKIP GAME →
              </motion.button>
            )}
          </motion.div>
        )}

        {/* ── HERO PHASE ─────────────────────────────────────────────────── */}
        {phase === "hero" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 font-pixel text-[9px] text-[#00ff41] tracking-[0.3em] glow-green"
            >
              &gt; ACCESS GRANTED · PORTFOLIO_v2.0K &lt;
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              className="font-pixel text-5xl sm:text-7xl md:text-8xl leading-tight mb-6 glow-cyan text-[#00ffff] select-none"
            >
              <GlitchText text="ANTON H" />
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="font-vt text-3xl sm:text-4xl text-[#ff00ff] glow-pink mb-8 h-12 flex items-center"
            >
              {role}
              <span className="blink ml-1 text-[#ff00ff]">_</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="font-mono-tech text-sm sm:text-base text-[#aaa] max-w-xl mb-12 leading-relaxed"
            >
              Crafting digital experiences that live at the intersection of function and fantasy.
              Pixel by pixel. Screen by screen.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
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
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  );
}
