"use client";
import { useRef, useCallback } from "react";

interface DesktopIconProps {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  selected: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
}

export default function DesktopIcon({ id, label, icon, x, y, selected, onSelect, onOpen, onMove }: DesktopIconProps) {
  const dragging = useRef(false);
  const moved = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    dragging.current = true;
    moved.current = false;
    offset.current = { x: e.clientX - x, y: e.clientY - y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    onSelect(id);
  }, [x, y, id, onSelect]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const nx = Math.max(0, e.clientX - offset.current.x);
    const ny = Math.max(0, e.clientY - offset.current.y);
    if (Math.abs(nx - x) > 4 || Math.abs(ny - y) > 4) moved.current = true;
    onMove(id, nx, ny);
  }, [id, x, y, onMove]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const onClick = useCallback(() => {
    if (moved.current) return;
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      onOpen(id);
    } else {
      clickTimer.current = setTimeout(() => {
        clickTimer.current = null;
      }, 300);
    }
  }, [id, onOpen]);

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={onClick}
      className={selected ? "icon-selected" : ""}
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: 90,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <div style={{
        fontSize: 52,
        filter: selected
          ? "drop-shadow(0 0 8px rgba(174,250,240,0.95))"
          : "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
        lineHeight: 1,
      }}>
        {icon}
      </div>
      <span
        className="icon-label"
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 13,
          color: "#0A4A3A",
          textAlign: "center",
          padding: "3px 5px",
          lineHeight: 1.6,
          wordBreak: "break-word",
          width: "100%",
          textShadow: "0 1px 0 rgba(174,250,240,0.5)",
        }}
      >
        {label}
      </span>
    </div>
  );
}
