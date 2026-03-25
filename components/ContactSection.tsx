"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputClass = (field: string) =>
    `w-full bg-transparent font-mono-tech text-sm text-[#e0e0e0] px-4 py-3 outline-none transition-all duration-300 pixel-corners ${
      focused === field
        ? "border border-[#ff00ff] placeholder:text-[#ff00ff55]"
        : "border border-[#333] placeholder:text-[#444]"
    }`;

  const socials = [
    { label: "TWITTER", handle: "@anton_ux", color: "#00ffff" },
    { label: "LINKEDIN", handle: "/in/antonux", color: "#ff00ff" },
    { label: "DRIBBBLE", handle: "anton.design", color: "#00ff41" },
    { label: "EMAIL", handle: "hello@anton.design", color: "#ffff00" },
  ];

  return (
    <section id="contact" className="relative z-10 py-32 px-6 max-w-6xl mx-auto w-full">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <div className="font-pixel text-[9px] text-[#ffff00] tracking-[0.4em] mb-4" style={{ textShadow: "0 0 12px #ffff00" }}>
          &gt; INITIALIZE_CONTACT
        </div>
        <h2 className="font-pixel text-2xl sm:text-4xl text-white glow-cyan mb-4">
          CONTACT
        </h2>
        <div className="w-24 h-px bg-gradient-to-r from-[#ffff00] to-transparent" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {sent ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="pixel-corners p-8 text-center"
              style={{ border: "1px solid #00ff41", boxShadow: "0 0 20px #00ff4155" }}
            >
              <div className="font-pixel text-2xl text-[#00ff41] glow-green mb-4">✓</div>
              <p className="font-pixel text-xs text-[#00ff41] tracking-widest mb-2">MESSAGE_SENT</p>
              <p className="font-mono-tech text-sm text-[#888]">Transmission received. I&apos;ll be in touch soon.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-pixel text-[8px] text-[#555] tracking-widest block mb-2">NAME_INPUT</label>
                <input
                  required
                  placeholder="YOUR_NAME"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  className={inputClass("name")}
                  style={focused === "name" ? { boxShadow: "0 0 10px #ff00ff44" } : {}}
                />
              </div>
              <div>
                <label className="font-pixel text-[8px] text-[#555] tracking-widest block mb-2">EMAIL_INPUT</label>
                <input
                  required
                  type="email"
                  placeholder="YOUR_EMAIL"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  className={inputClass("email")}
                  style={focused === "email" ? { boxShadow: "0 0 10px #ff00ff44" } : {}}
                />
              </div>
              <div>
                <label className="font-pixel text-[8px] text-[#555] tracking-widest block mb-2">MESSAGE_INPUT</label>
                <textarea
                  required
                  rows={5}
                  placeholder="YOUR_MESSAGE..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  className={inputClass("message") + " resize-none"}
                  style={focused === "message" ? { boxShadow: "0 0 10px #ff00ff44" } : {}}
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full pixel-corners color-cycle-border font-pixel text-[10px] text-white py-4 tracking-widest hover:bg-[rgba(255,0,255,0.1)] transition-colors duration-300"
              >
                SEND_TRANSMISSION
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Right — socials + info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <p className="font-mono-tech text-sm text-[#888] leading-relaxed">
            Got a project in mind? Want to collaborate? Or just want to geek out
            about design? I&apos;m always open to new connections.
          </p>

          <div className="space-y-3 pt-4">
            {socials.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 6 }}
                className="flex items-center justify-between pixel-corners p-4 border border-[#1a1a1a] hover:border-opacity-60 transition-all duration-300 group"
                style={{
                  background: "rgba(10,10,15,0.8)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = s.color + "66";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 12px ${s.color}33`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <span className="font-pixel text-[8px] text-[#555] tracking-widest">{s.label}</span>
                <span className="font-mono-tech text-sm" style={{ color: s.color, textShadow: `0 0 8px ${s.color}` }}>
                  {s.handle}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Availability badge */}
          <motion.div
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-3 pt-4"
          >
            <div className="w-3 h-3 rounded-full bg-[#00ff41]" style={{ boxShadow: "0 0 8px #00ff41" }} />
            <span className="font-pixel text-[8px] text-[#00ff41] glow-green tracking-widest">
              AVAILABLE FOR WORK
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
