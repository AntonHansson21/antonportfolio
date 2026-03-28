"use client";
import { useState } from "react";

export default function ContactWindow() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Opens default mail client as a simple contact approach
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
    const body = encodeURIComponent(`From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:karl.anton.hansson@hotmail.com?subject=${subject}&body=${body}`);
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{
        fontFamily: "'Courier Prime', monospace",
        fontSize: 13,
        color: "var(--text)",
        textAlign: "center",
        padding: "24px 0",
      }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📬</div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 9,
          color: "var(--title-a2)",
          marginBottom: 8,
        }}>
          Message Sent!
        </div>
        <p style={{ color: "var(--text-dim)", fontSize: 12 }}>
          Your mail client should have opened.<br />
          Talk soon!
        </p>
        <button
          className="win-btn"
          onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
          style={{ marginTop: 16, width: "auto", padding: "0 12px", height: 24 }}
        >
          New Message
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 13, color: "var(--text)" }}>
      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 8,
        color: "var(--text-dim)",
        marginBottom: 12,
        letterSpacing: "0.05em",
      }}>
        📧 New Message
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <label style={{ fontSize: 11, color: "var(--text-dim)" }}>To:</label>
          <input
            readOnly
            value="Anton Hansson"
            style={{ background: "var(--btn-face)" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <label style={{ fontSize: 11, color: "var(--text-dim)" }}>From (your name):</label>
          <input
            required
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <label style={{ fontSize: 11, color: "var(--text-dim)" }}>Reply-to (email):</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="your@email.com"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <label style={{ fontSize: 11, color: "var(--text-dim)" }}>Message:</label>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            placeholder="Say hi..."
            style={{ resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          <button
            type="submit"
            className="win-btn"
            style={{ width: "auto", padding: "0 12px", height: 24, gap: 4, display: "flex", alignItems: "center" }}
          >
            📤 Send
          </button>
        </div>
      </form>

      <div style={{
        marginTop: 16,
        borderTop: "1px solid var(--bevel-sh)",
        paddingTop: 10,
        fontSize: 11,
        color: "var(--text-dim)",
      }}>
        Or find me on:{" "}
        <a
          href="https://github.com/AntonHansson21"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--title-a2)", textDecoration: "underline" }}
        >
          GitHub
        </a>
        {" · "}
        <a
          href="https://www.linkedin.com/in/anton-hansson"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--title-a2)", textDecoration: "underline" }}
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}
