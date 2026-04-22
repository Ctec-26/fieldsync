"use client";

import * as React from "react";

/**
 * Cinematic 10s looping canvas for the hero.
 * Phases (in unit time 0..1):
 *   0.00 – 0.20  chaos       drift + soft synapse lines
 *   0.20 – 0.40  gravity     particles attracted toward the center
 *   0.40 – 0.60  assembly    streams draw circle / hexagon / diamond
 *   0.60 – 0.80  convergence shapes squeeze inward, amber core ignites
 *   0.80 – 0.92  locked      core pulses, shapes hold
 *   0.92 – 1.00  disperse    return to chaos, cycle restarts
 *
 * `prefers-reduced-motion` locks to the final (amber-lit) frame.
 */
const CYCLE = 10_000; // ms
const PARTICLES = 180;
// Balanced across the three shape streams (circle / hex / diamond).
const CIRCLE_N = 60;
const HEX_N = 60;
// DIAMOND = PARTICLES - CIRCLE_N - HEX_N = 60

type Phase = {
  driftFree: number;
  attract: number;
  shape: number;
  converge: number;
  locked: number;
  amber: number;
};

function phaseWeights(t: number): Phase {
  const w: Phase = { driftFree: 1, attract: 0, shape: 0, converge: 0, locked: 0, amber: 0 };
  if (t < 0.2) {
    // chaos
    w.driftFree = 1;
  } else if (t < 0.4) {
    const k = (t - 0.2) / 0.2;
    w.driftFree = 1 - k * 0.8;
    w.attract = k * 0.7;
  } else if (t < 0.6) {
    const k = (t - 0.4) / 0.2;
    w.driftFree = 0.15;
    w.attract = 0.3;
    w.shape = k;
  } else if (t < 0.8) {
    const k = (t - 0.6) / 0.2;
    w.shape = 1;
    w.converge = k;
    w.amber = k;
  } else {
    if (t < 0.92) {
      w.shape = 1;
      w.converge = 1;
      w.amber = 1;
      w.locked = (t - 0.8) / 0.12;
    } else {
      const k = (t - 0.92) / 0.08;
      w.shape = 1 - k;
      w.converge = 1 - k;
      w.amber = 1 - k;
      w.driftFree = k;
    }
  }
  return w;
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  role: 1 | 2 | 3; // 1 = circle, 2 = hex, 3 = diamond
  baseSize: number;
  hue: string;
  opacity: number;
  targetX: number;
  targetY: number;
  seed: number;
};

const ROLE_COLOR: Record<Particle["role"], string> = {
  1: "#0A6CF3",
  2: "#3A6FE0",
  3: "#0098FE",
};

export default function HeroCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const DPR = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
      2,
    );

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLES; i++) {
      const role: Particle["role"] = i < CIRCLE_N ? 1 : i < CIRCLE_N + HEX_N ? 2 : 3;
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        role,
        baseSize: 0.8 + Math.random() * 1.8,
        hue: Math.random() < 0.5 ? "#0A6CF3" : "#0098FE",
        opacity: 0.2 + Math.random() * 0.6,
        targetX: 0,
        targetY: 0,
        seed: Math.random() * Math.PI * 2,
      });
    }

    let cx = W / 2;
    let cy = H / 2;
    let R = 0;

    const computeTargets = () => {
      cx = W / 2;
      cy = H / 2;
      R = Math.min(W, H) * 0.18;

      const circleP = particles.filter((p) => p.role === 1);
      circleP.forEach((p, i) => {
        const a = (i / circleP.length) * Math.PI * 2;
        p.targetX = cx + Math.cos(a) * R;
        p.targetY = cy + Math.sin(a) * R;
      });

      const hexP = particles.filter((p) => p.role === 2);
      hexP.forEach((p, i) => {
        const t = i / hexP.length;
        const seg = Math.floor(t * 6);
        const localT = t * 6 - seg;
        const a1 = (seg / 6) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((seg + 1) / 6) * Math.PI * 2 - Math.PI / 2;
        const x1 = Math.cos(a1) * R;
        const y1 = Math.sin(a1) * R;
        const x2 = Math.cos(a2) * R;
        const y2 = Math.sin(a2) * R;
        p.targetX = cx + x1 + (x2 - x1) * localT;
        p.targetY = cy + y1 + (y2 - y1) * localT;
      });

      const dmP = particles.filter((p) => p.role === 3);
      const verts: [number, number][] = [
        [0, -R],
        [R, 0],
        [0, R],
        [-R, 0],
      ];
      dmP.forEach((p, i) => {
        const t = i / dmP.length;
        const seg = Math.floor(t * 4);
        const localT = t * 4 - seg;
        const [x1, y1] = verts[seg];
        const [x2, y2] = verts[(seg + 1) % 4];
        p.targetX = cx + x1 + (x2 - x1) * localT;
        p.targetY = cy + y1 + (y2 - y1) * localT;
      });
    };
    computeTargets();

    const onResize = () => {
      resize();
      computeTargets();
    };
    window.addEventListener("resize", onResize);

    const start = performance.now();
    let rafId = 0;

    const draw = (now: number) => {
      const elapsed = ((now - start) % CYCLE) / CYCLE;
      const w = phaseWeights(elapsed);

      // Slight trail for glow buildup
      ctx.fillStyle = "rgba(0,0,16,0.32)";
      ctx.fillRect(0, 0, W, H);

      for (const p of particles) {
        if (w.driftFree > 0.02) {
          p.vx += (Math.random() - 0.5) * 0.04 * w.driftFree;
          p.vy += (Math.random() - 0.5) * 0.04 * w.driftFree;
        }
        if (w.attract > 0) {
          const dx = cx - p.x;
          const dy = cy - p.y;
          const d = Math.max(40, Math.hypot(dx, dy));
          p.vx += (dx / d) * 0.06 * w.attract;
          p.vy += (dy / d) * 0.06 * w.attract;
        }
        if (w.shape > 0.02) {
          const convergeScale = 1 - w.converge * 0.65;
          const tx = cx + (p.targetX - cx) * convergeScale;
          const ty = cy + (p.targetY - cy) * convergeScale;
          const dx = tx - p.x;
          const dy = ty - p.y;
          const pull = 0.06 * w.shape;
          p.vx += dx * pull;
          p.vy += dy * pull;
        }

        const damp = 0.92 - w.shape * 0.05;
        p.vx *= damp;
        p.vy *= damp;

        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 4) {
          p.vx = (p.vx / sp) * 4;
          p.vy = (p.vy / sp) * 4;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (w.driftFree > 0.5) {
          if (p.x < -20) p.x = W + 20;
          if (p.x > W + 20) p.x = -20;
          if (p.y < -20) p.y = H + 20;
          if (p.y > H + 20) p.y = -20;
        }

        let col = p.hue;
        if (w.shape > 0.4) col = ROLE_COLOR[p.role];

        const s = p.baseSize * (1 + 0.2 * Math.sin(now * 0.002 + p.seed));

        ctx.shadowColor = col;
        ctx.shadowBlur = 6 + 8 * w.shape;
        ctx.fillStyle = col;
        ctx.globalAlpha = Math.min(1, p.opacity + w.shape * 0.3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Synapse lines
      const synapseIntensity = Math.max(0.1, 1 - w.converge * 0.7);
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = "rgba(27,240,254,0.35)";
      ctx.shadowColor = "#1BF0FE";
      ctx.shadowBlur = 4;
      for (let i = 0; i < particles.length; i += 3) {
        const a = particles[i];
        const end = Math.min(i + 8, particles.length);
        for (let j = i + 1; j < end; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < 90) {
            ctx.globalAlpha =
              (1 - d / 90) * 0.4 * synapseIntensity * (0.6 + 0.4 * Math.sin(now * 0.003 + i));
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Amber core
      if (w.amber > 0.02) {
        const pulse = 1 + 0.08 * Math.sin(now * 0.003);
        const coreR = R * 0.28 * pulse * w.amber;

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 5);
        g.addColorStop(0, `rgba(246,246,226,${0.75 * w.amber})`);
        g.addColorStop(0.25, `rgba(246,246,226,${0.25 * w.amber})`);
        g.addColorStop(1, "rgba(246,246,226,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, coreR * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,252,230,${0.95 * w.amber})`;
        ctx.shadowColor = "#F6F6E2";
        ctx.shadowBlur = 40;
        ctx.beginPath();
        ctx.moveTo(cx, cy - coreR * 0.9);
        ctx.bezierCurveTo(
          cx + coreR * 0.6, cy - coreR * 0.4,
          cx + coreR * 0.6, cy + coreR * 0.4,
          cx, cy + coreR * 0.9,
        );
        ctx.bezierCurveTo(
          cx - coreR * 0.6, cy + coreR * 0.4,
          cx - coreR * 0.6, cy - coreR * 0.4,
          cx, cy - coreR * 0.9,
        );
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafId = requestAnimationFrame(draw);
    };

    if (reduced) {
      // Paint a single frame near the "locked" phase so the logo still reads.
      draw(start + CYCLE * 0.86);
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }

    rafId = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="hero-canvas"
      className="absolute inset-0 z-[1] h-full w-full"
      aria-hidden="true"
      // Force GPU compositing — the canvas repaints every rAF, so the
      // browser benefits from a dedicated layer.
      style={{ willChange: "transform" }}
    />
  );
}
