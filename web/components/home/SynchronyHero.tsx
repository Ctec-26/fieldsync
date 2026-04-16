"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

function SynchronyViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const t = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 420;
    canvas.height = 320;

    const nodes = [
      { x: 80, y: 160, label: "Human", color: "#F0EFE8", shape: "organic" },
      { x: 210, y: 100, label: "AI Agent", color: "#3D7EE8", shape: "diamond" },
      { x: 340, y: 160, label: "Solana", color: "#E8B86D", shape: "hex" },
    ];

    const draw = () => {
      t.current += 0.015;
      ctx.clearRect(0, 0, 420, 320);

      // Draw connection lines with pulses
      const connections = [
        { a: 0, b: 1 },
        { a: 1, b: 2 },
        { a: 0, b: 2 },
      ];

      connections.forEach(({ a, b }) => {
        const na = nodes[a];
        const nb = nodes[b];
        const grad = ctx.createLinearGradient(na.x, na.y, nb.x, nb.y);
        grad.addColorStop(0, na.color + "40");
        grad.addColorStop(0.5, "#E8B86D60");
        grad.addColorStop(1, nb.color + "40");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();

        // Pulse dot traveling the line
        const progress = (Math.sin(t.current * 1.5 + a * 1.2) + 1) / 2;
        const px = na.x + (nb.x - na.x) * progress;
        const py = na.y + (nb.y - na.y) * progress;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#E8B86D";
        ctx.fill();
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const breathe = 1 + 0.06 * Math.sin(t.current * 1.2 + i * 1.5);
        const r = 28 * breathe;

        // Glow
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r + 10);
        glow.addColorStop(0, node.color + "25");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 10, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "#142850";
        ctx.fill();
        ctx.strokeStyle = node.color + "80";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = node.color + "50";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Center dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Label
        ctx.fillStyle = node.color + "CC";
        ctx.font = "600 11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + r + 16);
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-[420px] opacity-90"
      style={{ imageRendering: "crisp-edges" }}
      aria-hidden="true"
    />
  );
}

export default function SynchronyHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20 lg:py-28">
          {/* Left: copy */}
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-primary/30 bg-amber-primary/10 text-amber-primary text-xs font-semibold font-inter tracking-wider uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-primary animate-pulse" />
                Solana Devnet · Live
              </span>

              <h1 className="font-grotesk font-bold text-5xl sm:text-6xl lg:text-7xl text-text-heading leading-[1.08] tracking-tight">
                The human{" "}
                <span className="relative">
                  <span className="relative z-10 text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(135deg, #E8B86D, #F5D29A)" }}>
                    gateway
                  </span>
                </span>
                {" "}to Web3.
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-text-muted text-lg sm:text-xl font-inter leading-relaxed max-w-xl"
            >
              Powered by AI, verified on-chain. Meet specialized agents. Learn by interacting. Build trust that lives forever on Solana.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/agents">
                <motion.span
                  whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(232,184,109,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold font-inter text-navy-deepest cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #E8B86D, #F5D29A)" }}
                >
                  Explore Agents
                  <ArrowRight size={16} />
                </motion.span>
              </Link>

              <Link href="/how-it-works">
                <motion.span
                  whileHover={{ scale: 1.02, borderColor: "#3D7EE8" }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-navy-accent/50 text-text-primary font-medium font-inter hover:bg-navy-secondary/40 transition-colors cursor-pointer"
                >
                  How it Works
                </motion.span>
              </Link>
            </motion.div>
          </div>

          {/* Right: synchrony visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <SynchronyViz />
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-text-muted"
        >
          <span className="text-xs font-inter">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={16} strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
