"use client";
export default function GridOverlay() {
  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,255,65,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,255,65,0.06) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        animation: "gridScroll 8s linear infinite",
      }}
    />
  );
}
