"use client";
import { useRef, useCallback } from "react";

export interface WindowConfig {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  zIndex: number;
}

interface WindowProps {
  config: WindowConfig;
  isActive: boolean;
  mobile?: boolean;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
}

export default function Window({
  config, isActive, mobile, onFocus, onClose, onMinimize, onMove, children
}: WindowProps) {
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onTitlePointerDown = useCallback((e: React.PointerEvent) => {
    if (mobile) return;
    dragging.current = true;
    offset.current = { x: e.clientX - config.x, y: e.clientY - config.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    onFocus(config.id);
  }, [mobile, config.x, config.y, config.id, onFocus]);

  const onTitlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || mobile) return;
    const nx = Math.max(0, e.clientX - offset.current.x);
    const ny = Math.max(0, e.clientY - offset.current.y);
    onMove(config.id, nx, ny);
  }, [mobile, config.id, onMove]);

  const onTitlePointerUp = useCallback(() => { dragging.current = false; }, []);

  if (config.minimized) return null;

  const titleBg = `linear-gradient(to right, var(--title-a1), var(--title-a2))`;
  const titleColor = "#E8FDF8";

  // ── MOBILE: full-screen slide-up panel ──────────────────────────────────
  if (mobile) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        display: "flex",
        flexDirection: "column",
        background: "var(--win-bg)",
        animation: "slide-up 0.25s ease-out",
      }}>
        {/* Title bar */}
        <div style={{
          background: titleBg,
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 20 }}>{config.icon}</span>
          <span style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 10,
            color: titleColor,
            flex: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            letterSpacing: "0.05em",
            textShadow: "1px 1px 0 rgba(0,0,0,0.4)",
          }}>
            {config.title}
          </span>
          <button
            className="win-btn"
            onClick={() => onClose(config.id)}
            style={{
              width: 32, height: 32,
              fontFamily: "'Courier Prime', monospace",
              fontWeight: "bold",
              fontSize: 14,
              color: "#8B1A08",
            }}
          >✕</button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: "auto",
          padding: 16,
          background: "var(--win-bg)",
          userSelect: "text",
          WebkitOverflowScrolling: "touch",
        }}>
          {children}
        </div>

        {/* Status bar */}
        <div style={{
          borderTop: "1px solid var(--bevel-sh)",
          padding: "6px 12px",
          fontFamily: "'Courier Prime', monospace",
          fontSize: 12,
          color: "var(--text-dim)",
          flexShrink: 0,
          background: "var(--win-bg)",
          display: "flex",
          justifyContent: "space-between",
        }}>
          <span>Ready</span>
          <span>Anton Hansson © 2025</span>
        </div>
      </div>
    );
  }

  // ── DESKTOP: draggable window ────────────────────────────────────────────
  return (
    <div
      onPointerDown={() => onFocus(config.id)}
      style={{
        position: "fixed",
        left: config.x,
        top: config.y,
        width: config.width,
        height: config.height,
        zIndex: config.zIndex,
        display: "flex",
        flexDirection: "column",
        background: "var(--win-bg)",
        border: "2px solid",
        borderColor: "var(--bevel-hl) var(--bevel-sh) var(--bevel-sh) var(--bevel-hl)",
        boxShadow: "3px 3px 0 rgba(0,0,0,0.4)",
      }}
    >
      {/* Title bar */}
      <div
        onPointerDown={onTitlePointerDown}
        onPointerMove={onTitlePointerMove}
        onPointerUp={onTitlePointerUp}
        style={{
          background: isActive
            ? `linear-gradient(to right, var(--title-a1), var(--title-a2))`
            : `linear-gradient(to right, var(--title-i1), var(--title-i2))`,
          padding: "3px 4px",
          display: "flex",
          alignItems: "center",
          gap: 4,
          flexShrink: 0,
          touchAction: "none",
        }}
      >
        <span style={{ fontSize: 16, flexShrink: 0 }}>{config.icon}</span>
        <span style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 10,
          color: isActive ? "#E8FDF8" : "#B0D8D2",
          flex: 1,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textShadow: isActive ? "1px 1px 0 rgba(0,0,0,0.5)" : "none",
          letterSpacing: "0.05em",
        }}>
          {config.title}
        </span>
        <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
          <button
            className="win-btn"
            onPointerDown={(e) => { e.stopPropagation(); }}
            onClick={() => onMinimize(config.id)}
            title="Minimize"
            style={{ fontFamily: "'Courier Prime', monospace", fontWeight: "bold" }}
          >_</button>
          <button
            className="win-btn"
            onPointerDown={(e) => { e.stopPropagation(); }}
            onClick={() => onClose(config.id)}
            title="Close"
            style={{ fontFamily: "'Courier Prime', monospace", fontWeight: "bold", color: "#8B1A08" }}
          >✕</button>
        </div>
      </div>

      {/* Menu bar */}
      <div style={{
        background: "var(--win-bg)",
        borderBottom: "1px solid var(--bevel-sh)",
        padding: "1px 6px",
        display: "flex",
        gap: 12,
        flexShrink: 0,
      }}>
        {["File", "Edit", "View"].map((m) => (
          <span key={m} style={{
            fontFamily: "'Courier Prime', monospace",
            fontSize: 14,
            color: "var(--text)",
            padding: "1px 3px",
          }}>{m}</span>
        ))}
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflow: "auto",
        padding: 16,
        background: "var(--win-bg)",
        userSelect: "text",
      }}>
        {children}
      </div>

      {/* Status bar */}
      <div style={{
        borderTop: "1px solid var(--bevel-sh)",
        padding: "2px 6px",
        fontFamily: "'Courier Prime', monospace",
        fontSize: 13,
        color: "var(--text-dim)",
        flexShrink: 0,
        background: "var(--win-bg)",
        display: "flex",
        gap: 8,
      }}>
        <span style={{ flex: 1 }}>Ready</span>
        <span style={{
          border: "1px solid var(--bevel-sh)",
          padding: "0 6px",
          borderColor: "var(--bevel-sh) var(--bevel-hl) var(--bevel-hl) var(--bevel-sh)",
        }}>Anton Hansson © 2025</span>
      </div>
    </div>
  );
}
