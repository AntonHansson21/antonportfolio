"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { WindowConfig } from "./Window";

const MENU_ITEMS = [
  { id: "about",    label: "About Me",  icon: "🧑‍💻" },
  { id: "projects", label: "Projects",  icon: "📁"  },
  { id: "skills",   label: "Skills",    icon: "⚙️"  },
  { id: "contact",  label: "Contact",   icon: "📬"  },
];

interface TaskbarProps {
  windows: WindowConfig[];
  activeId: string | null;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onOpen: (id: string) => void;
}

export default function Taskbar({ windows, activeId, onFocus, onMinimize, onOpen }: TaskbarProps) {
  const [time, setTime] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      setTime(`${h}:${m}`);
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleMenuItemClick = useCallback((id: string) => {
    onOpen(id);
    setMenuOpen(false);
  }, [onOpen]);

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: 40,
      background: "#0E7A65",
      borderTop: "3px solid #AEFAF0",
      display: "flex",
      alignItems: "center",
      gap: 4,
      padding: "0 4px",
      zIndex: 10000,
    }}>

      {/* Start button + popup wrapper */}
      <div ref={menuRef} style={{ position: "relative" }}>

        {/* Start menu popup */}
        {menuOpen && (
          <div style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: 0,
            minWidth: 300,
            background: "#0E7A65",
            border: "3px solid #AEFAF0",
            borderBottom: "none",
            boxShadow: "6px -6px 0 rgba(0,0,0,0.35)",
            zIndex: 20000,
          }}>
            {/* Menu header */}
            <div style={{
              background: "linear-gradient(to right, #0A4A3A, #2DC8A8)",
              padding: "16px 18px",
              borderBottom: "2px solid #AEFAF0",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              <span style={{ fontSize: 32 }}>🌿</span>
              <div>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 11,
                  color: "#AEFAF0",
                  letterSpacing: "0.05em",
                  marginBottom: 4,
                }}>
                  Anton Hansson
                </div>
                <div style={{
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: 13,
                  color: "#9EEEE5",
                }}>
                  UX Designer
                </div>
              </div>
            </div>

            {/* Menu items */}
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "13px 18px",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(174,250,240,0.2)",
                  color: "#AEFAF0",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 10,
                  textAlign: "left",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#1A9E85")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Start button */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          style={{
            height: 28,
            padding: "0 10px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: menuOpen ? "#0A4A3A" : "#FFD166",
            border: "2px solid",
            borderColor: menuOpen
              ? "#0A3D35 #AEFAF0 #AEFAF0 #0A3D35"
              : "#FFE9A0 #B8902A #B8902A #FFE9A0",
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 9,
            color: menuOpen ? "#AEFAF0" : "#0A4A3A",
          }}
        >
          <span style={{ fontSize: 16 }}>🌿</span>
          <span>Start</span>
        </button>
      </div>

      {/* Divider */}
      <div style={{
        width: 2,
        height: 26,
        borderLeft: "1px solid #0A4A3A",
        borderRight: "1px solid #AEFAF0",
        margin: "0 2px",
      }} />

      {/* Window buttons */}
      <div style={{ flex: 1, display: "flex", gap: 3, overflow: "hidden" }}>
        {windows.map((w) => {
          const isActive = w.id === activeId && !w.minimized;
          return (
            <button
              key={w.id}
              onClick={() => {
                if (isActive) onMinimize(w.id);
                else onFocus(w.id);
              }}
              style={{
                height: 26,
                maxWidth: 160,
                minWidth: 80,
                padding: "0 6px",
                background: isActive ? "#0A4A3A" : "#1A9E85",
                border: "2px solid",
                borderColor: isActive
                  ? "#0A3D35 #AEFAF0 #AEFAF0 #0A3D35"
                  : "#AEFAF0 #0A3D35 #0A3D35 #AEFAF0",
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 8,
                color: isActive ? "#E8FDF8" : "#AEFAF0",
                display: "flex",
                alignItems: "center",
                gap: 4,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              <span style={{ fontSize: 12, flexShrink: 0 }}>{w.icon}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{w.title}</span>
            </button>
          );
        })}
      </div>

      {/* Clock */}
      <div style={{
        border: "2px solid",
        borderColor: "#0A4A3A #AEFAF0 #AEFAF0 #0A4A3A",
        padding: "2px 8px",
        fontFamily: "'Courier Prime', monospace",
        fontSize: 15,
        color: "#AEFAF0",
        background: "#0A4A3A",
        height: 28,
        display: "flex",
        alignItems: "center",
      }}>
        {time}
      </div>
    </div>
  );
}
