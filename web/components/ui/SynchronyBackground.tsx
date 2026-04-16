"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: "human" | "ai" | "chain" | "neutral";
}

interface Connection {
  a: number;
  b: number;
  opacity: number;
  phase: number;
}

const NODE_COLORS = {
  human: "#F0EFE8",
  ai: "#3D7EE8",
  chain: "#E8B86D",
  neutral: "#8B9DC3",
};

export default function SynchronyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const NODE_COUNT = 22;
    const types: Node["type"][] = ["human", "ai", "chain", "neutral"];
    nodesRef.current = Array.from({ length: NODE_COUNT }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 2 + Math.random() * 2,
      type: i < 3
        ? (["human", "ai", "chain"] as Node["type"][])[i]
        : types[Math.floor(Math.random() * types.length)],
    }));

    const MAX_DIST = 200;
    connectionsRef.current = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (Math.random() < 0.25) {
          connectionsRef.current.push({
            a: i,
            b: j,
            opacity: 0.08 + Math.random() * 0.12,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    const draw = () => {
      timeRef.current += 0.008;
      const t = timeRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle gradient orbs
      const orbs = [
        { x: canvas.width * 0.15, y: canvas.height * 0.3, r: 350, color: "rgba(61,126,232,0.04)" },
        { x: canvas.width * 0.85, y: canvas.height * 0.6, r: 280, color: "rgba(232,184,109,0.03)" },
        { x: canvas.width * 0.5, y: canvas.height * 0.8, r: 320, color: "rgba(42,82,152,0.05)" },
      ];
      orbs.forEach((orb) => {
        const ox = orb.x + Math.sin(t * 0.3) * 30;
        const oy = orb.y + Math.cos(t * 0.25) * 20;
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Move nodes
      nodesRef.current.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });

      // Draw connections
      connectionsRef.current.forEach((conn) => {
        const a = nodesRef.current[conn.a];
        const b = nodesRef.current[conn.b];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > MAX_DIST) return;

        const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + conn.phase);
        const alpha = conn.opacity * (1 - dist / MAX_DIST) * (0.6 + 0.4 * pulse);

        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, `${NODE_COLORS[a.type]}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`);
        grad.addColorStop(1, `${NODE_COLORS[b.type]}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      // Draw nodes
      nodesRef.current.forEach((node) => {
        const breathe = 0.85 + 0.15 * Math.sin(t * 1.2 + node.x * 0.01);
        const r = node.radius * breathe;
        const color = NODE_COLORS[node.type];

        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color + "CC";
        ctx.fill();

        // Glow ring for primary node types
        if (node.type !== "neutral") {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 3, 0, Math.PI * 2);
          ctx.strokeStyle = color + "33";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
