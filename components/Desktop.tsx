"use client";
import { useState, useCallback, useEffect } from "react";
import Window, { WindowConfig } from "./Window";
import DesktopIcon from "./DesktopIcon";
import Taskbar from "./Taskbar";
import CustomCursor from "./CustomCursor";
import AboutWindow from "./windows/AboutWindow";
import ProjectsWindow from "./windows/ProjectsWindow";
import SkillsWindow from "./windows/SkillsWindow";
import ContactWindow from "./windows/ContactWindow";
import FunFileWindow from "./windows/FunFileWindow";
import ProjectDetailWindow from "./windows/ProjectDetailWindow";
import SnakeGame from "./windows/SnakeGame";
import MinesweeperGame from "./windows/MinesweeperGame";
import PacmanGame from "./windows/PacmanGame";
import WelcomeText from "./WelcomeText";

interface IconData {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
}

const MAIN_ICONS: IconData[] = [
  { id: "about",    label: "About Me",                   icon: "🧑‍💻", x: 24, y: 24  },
  { id: "projects", label: "Projects",                   icon: "📁",  x: 24, y: 150 },
  { id: "skills",   label: "Skills",                     icon: "⚙️",  x: 24, y: 276 },
  { id: "contact",  label: "Contact",                    icon: "📬",  x: 24, y: 402 },
];

// Fun files — repositioned to right column in useEffect
const FUN_ICONS: IconData[] = [
  { id: "beach",  label: "beach_that_one_summer.jpg", icon: "🖼️", x: 0, y: 24  },
  { id: "cat",    label: "my_cat_on_a_tuesday.png",   icon: "🐱", x: 0, y: 150 },
  { id: "vibes",  label: "totally_not_wallpaper.jpg", icon: "🌄", x: 0, y: 276 },
  { id: "fine",   label: "this_is_fine.png",          icon: "🔥", x: 0, y: 402 },
];

// Games — repositioned to center row in useEffect
const GAME_ICONS: IconData[] = [
  { id: "mines",  label: "mines.exe",  icon: "💣", x: 0, y: 0 },
  { id: "snake",  label: "snake.exe",  icon: "🐍", x: 0, y: 0 },
  { id: "pacman", label: "pacman.exe", icon: "👾", x: 0, y: 0 },
];

const INITIAL_ICONS: IconData[] = [...MAIN_ICONS, ...FUN_ICONS, ...GAME_ICONS];

const WINDOW_DEFAULTS: Record<string, Omit<WindowConfig, "id" | "minimized" | "zIndex">> = {
  about:      { title: "About Me",                      icon: "🧑‍💻", x: 120, y: 50,  width: 460, height: 440 },
  projects:   { title: "Projects",                      icon: "📁",  x: 180, y: 60,  width: 520, height: 500 },
  skills:     { title: "Skills",                        icon: "⚙️",  x: 240, y: 70,  width: 480, height: 460 },
  contact:    { title: "Contact",                       icon: "📬",  x: 300, y: 60,  width: 440, height: 520 },
  beach:      { title: "beach_that_one_summer.jpg",     icon: "🖼️",  x: 200, y: 80,  width: 520, height: 380 },
  cat:        { title: "my_cat_on_a_tuesday.png",       icon: "🐱",  x: 240, y: 100, width: 520, height: 380 },
  vibes:      { title: "totally_not_wallpaper.jpg",     icon: "🌄",  x: 260, y: 90,  width: 520, height: 380 },
  fine:       { title: "this_is_fine.png",              icon: "🔥",  x: 280, y: 70,  width: 520, height: 380 },
  snake:      { title: "snake.exe",   icon: "🐍", x: 200, y: 50, width: 480, height: 520 },
  mines:      { title: "mines.exe",  icon: "💣", x: 240, y: 60, width: 450, height: 420 },
  pacman:     { title: "pacman.exe", icon: "👾", x: 280, y: 70, width: 460, height: 460 },
  proj_p1:    { title: "Portfolio OS",                  icon: "🖥️",  x: 160, y: 40,  width: 600, height: 580 },
  proj_p2:    { title: "UX Case Study — App Redesign",  icon: "📱",  x: 180, y: 50,  width: 600, height: 580 },
  proj_p3:    { title: "Design System",                 icon: "🎨",  x: 200, y: 60,  width: 600, height: 580 },
  proj_p4:    { title: "Interactive Brand Identity",    icon: "✦",   x: 220, y: 70,  width: 600, height: 580 },
};

function WindowContent({ id, onOpen }: { id: string; onOpen: (id: string) => void }) {
  if (id === "about")    return <AboutWindow />;
  if (id === "projects") return <ProjectsWindow onOpen={onOpen} />;
  if (id === "skills")   return <SkillsWindow />;
  if (id === "contact")  return <ContactWindow />;
  if (["beach", "cat", "vibes", "fine"].includes(id)) return <FunFileWindow id={id} />;
  if (id === "snake")  return <SnakeGame />;
  if (id === "mines")  return <MinesweeperGame />;
  if (id === "pacman") return <PacmanGame />;
  if (id.startsWith("proj_")) return <ProjectDetailWindow projectId={id.replace("proj_", "")} />;
  return null;
}

let zCounter = 10;

export default function Desktop() {
  const [icons, setIcons] = useState<IconData[]>(INITIAL_ICONS);
  const [windows, setWindows] = useState<WindowConfig[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  // Position icons on mount
  useEffect(() => {
    const taskbarH = 40;
    const rightX = window.innerWidth - 110;
    const funIds = new Set(FUN_ICONS.map(i => i.id));
    const gameIds = GAME_ICONS.map(i => i.id);

    // Center games horizontally, vertically centered
    const gapX = 140;
    const totalW = (GAME_ICONS.length - 1) * gapX;
    const gameStartX = Math.floor(window.innerWidth / 2 - totalW / 2 - 45);
    const gameY = Math.floor((window.innerHeight - taskbarH) / 2) - 60;

    setIcons(prev => prev.map(ic => {
      const gi = gameIds.indexOf(ic.id);
      if (gi >= 0) return { ...ic, x: gameStartX + gi * gapX, y: Math.max(70, gameY) };
      if (funIds.has(ic.id)) return { ...ic, x: rightX, y: Math.min(ic.y, window.innerHeight - taskbarH - 100) };
      return { ...ic, y: Math.min(ic.y, window.innerHeight - taskbarH - 100) };
    }));
  }, []);

  const bringToFront = useCallback((id: string) => {
    zCounter += 1;
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zCounter, minimized: false } : w));
    setActiveId(id);
  }, []);

  const openWindow = useCallback((id: string) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        zCounter += 1;
        return prev.map(w => w.id === id ? { ...w, minimized: false, zIndex: zCounter } : w);
      }
      zCounter += 1;
      const def = WINDOW_DEFAULTS[id];
      return [...prev, { id, ...def, minimized: false, zIndex: zCounter }];
    });
    setActiveId(id);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setActiveId(prev => prev === id ? null : prev);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w));
    setActiveId(prev => prev === id ? null : prev);
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  const moveIcon = useCallback((id: string, x: number, y: number) => {
    setIcons(prev => prev.map(ic => ic.id === id ? { ...ic, x, y } : ic));
  }, []);

  const handleDesktopClick = useCallback(() => {
    setSelectedIconId(null);
  }, []);

  return (
    <div
      onClick={handleDesktopClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--desktop)",
        overflow: "hidden",
      }}
    >
      {/* Subtle scanline texture */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.06) 3px,
            rgba(0,0,0,0.06) 4px
          )
        `,
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Moving static line */}
      <div className="static-line" />

      {/* Welcome typewriter */}
      <WelcomeText />

      {/* Desktop icons */}
      {icons.map(ic => (
        <DesktopIcon
          key={ic.id}
          id={ic.id}
          label={ic.label}
          icon={ic.icon}
          x={ic.x}
          y={ic.y}
          selected={selectedIconId === ic.id}
          onSelect={setSelectedIconId}
          onOpen={openWindow}
          onMove={moveIcon}
        />
      ))}

      {/* Windows */}
      {windows.map(w => (
        <Window
          key={w.id}
          config={w}
          isActive={w.id === activeId}
          onFocus={bringToFront}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onMove={moveWindow}
        >
          <WindowContent id={w.id} onOpen={openWindow} />
        </Window>
      ))}

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        activeId={activeId}
        onFocus={bringToFront}
        onMinimize={minimizeWindow}
        onOpen={openWindow}
      />

      {/* Custom cursor */}
      <CustomCursor />
    </div>
  );
}
