"use client";
import { useEffect, useState } from "react";

const MESSAGE = "Hi! I'm Anton  :)";
const DELAY_MS = 80;
const PAUSE_MS = 2800;

export default function WelcomeText() {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);

    const type = () => {
      i++;
      setDisplayed(MESSAGE.slice(0, i));
      if (i < MESSAGE.length) {
        setTimeout(type, DELAY_MS);
      } else {
        setDone(true);
        // Restart after pause
        setTimeout(() => {
          i = 0;
          setDisplayed("");
          setDone(false);
          setTimeout(type, DELAY_MS);
        }, PAUSE_MS);
      }
    };

    const start = setTimeout(type, 600);
    return () => clearTimeout(start);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 18,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9000,
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      gap: 0,
    }}>
      <span style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 22,
        color: "#0A4A3A",
        textShadow: "0 2px 0 rgba(174,250,240,0.7), 0 4px 16px rgba(45,200,168,0.5)",
        letterSpacing: "0.06em",
        whiteSpace: "nowrap",
      }}>
        {displayed}
      </span>
      {!done && (
        <span className="type-cursor" style={{ color: "#0A4A3A", width: 14, height: "1em" }} />
      )}
    </div>
  );
}
