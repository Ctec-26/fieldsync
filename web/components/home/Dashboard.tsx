"use client";

import * as React from "react";
import { DASH_ITEMS } from "@/lib/mock/dashboard";
import type { DashItem } from "@/types/home";
import Reveal from "./Reveal";

function DashViz({ viz }: { viz: DashItem["viz"] }) {
  if (viz === "spark") {
    return (
      <svg
        className="absolute bottom-4 right-4 h-6 w-20 opacity-90"
        viewBox="0 0 80 24"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="sparkG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0A6CF3" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0A6CF3" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="#0A6CF3"
          strokeWidth="1.4"
          points="0,18 10,14 20,16 30,10 40,12 50,6 60,8 70,4 80,3"
        />
        <polyline
          fill="url(#sparkG)"
          stroke="none"
          points="0,18 10,14 20,16 30,10 40,12 50,6 60,8 70,4 80,3 80,24 0,24"
        />
      </svg>
    );
  }
  if (viz === "gauge") {
    return (
      <svg
        className="absolute bottom-4 right-4 opacity-90"
        viewBox="0 0 80 40"
        style={{ width: 68, height: 34 }}
        aria-hidden
      >
        <defs>
          <linearGradient id="gaugeG" x1="0" x2="1">
            <stop offset="0" stopColor="#3DDBB4" />
            <stop offset="0.5" stopColor="#F6F6E2" />
            <stop offset="1" stopColor="#0098FE" />
          </linearGradient>
        </defs>
        <path d="M 6 34 A 28 28 0 0 1 74 34" fill="none" stroke="#3A4558" strokeWidth="3" strokeLinecap="round" />
        <path d="M 6 34 A 28 28 0 0 1 60 12" fill="none" stroke="url(#gaugeG)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (viz === "trend") {
    return (
      <svg
        className="absolute bottom-4 right-4 h-6 w-20 opacity-90"
        viewBox="0 0 80 24"
        preserveAspectRatio="none"
        aria-hidden
      >
        <polyline fill="none" stroke="#1BF0FE" strokeWidth="1.4" points="0,20 15,18 30,14 45,15 60,8 80,2" />
      </svg>
    );
  }
  if (viz === "map") {
    // 16 deterministic dots — avoid runtime Math.random to prevent hydration issues
    const positions = [
      [8, 10], [14, 5], [20, 16], [28, 9], [34, 18], [40, 6], [46, 12], [50, 17],
      [56, 8], [60, 14], [66, 5], [70, 11], [74, 18], [77, 8], [16, 20], [42, 22],
    ];
    return (
      <svg
        className="absolute bottom-4 right-4 h-6 w-20 opacity-90"
        viewBox="0 0 80 24"
        aria-hidden
      >
        <g fill="#0A6CF3">
          {positions.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1 + (i % 3) * 0.3} opacity={0.5 + (i % 4) * 0.12} />
          ))}
        </g>
      </svg>
    );
  }
  return null;
}

export default function Dashboard() {
  const activeRef = React.useRef<HTMLDivElement | null>(null);
  const mcapRef = React.useRef<HTMLDivElement | null>(null);
  const fgRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const id1 = window.setInterval(() => {
      const el = activeRef.current;
      if (!el) return;
      const cur = parseInt(el.textContent?.replace(/[^\d]/g, "") || "847", 10);
      const next = Math.max(820, Math.min(900, cur + Math.round((Math.random() - 0.4) * 5)));
      el.textContent = String(next);
    }, 3800);
    const id2 = window.setInterval(() => {
      const el = mcapRef.current;
      if (!el) return;
      const base = 24.7;
      const next = (base + (Math.random() - 0.5) * 0.6).toFixed(2);
      el.textContent = `$${next}M`;
    }, 4600);
    const id3 = window.setInterval(() => {
      const el = fgRef.current;
      if (!el) return;
      const cur = parseInt(el.textContent || "72", 10);
      const next = Math.max(55, Math.min(88, cur + Math.round((Math.random() - 0.5) * 3)));
      el.textContent = String(next);
    }, 5200);
    return () => {
      clearInterval(id1);
      clearInterval(id2);
      clearInterval(id3);
    };
  }, []);

  const refFor = (id: string) =>
    id === "active" ? activeRef : id === "mcap" ? mcapRef : id === "fg" ? fgRef : null;

  return (
    <section data-screen-label="Dashboard">
      <div className="mx-auto max-w-[1440px] px-10 py-[120px]">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-10">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-fs-primary">
                <span aria-hidden className="inline-block h-px w-6 bg-fs-primary" />
                A civilização em números
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2
                className="mt-4.5 max-w-[860px] text-balance font-[family-name:var(--font-fraunces)] font-semibold leading-[1.05] tracking-[-0.02em] text-fs-white"
                style={{ fontSize: "clamp(40px,4.2vw,56px)" }}
              >
                A economia agêntica, ao vivo.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={2} as="p">
            <span className="block max-w-[400px] text-[17px] leading-[1.55] text-fs-gray-hi">
              Seis métricas que respiram. Todos os valores são on-chain ou derivam de
              telemetria pública.{" "}
              <span className="text-fs-gray-med">Atualiza a cada 2s.</span>
            </span>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {DASH_ITEMS.map((d, i) => (
            <Reveal key={d.id} delay={(((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6)}>
              <div
                className="group relative flex h-[140px] cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-fs-gray-low bg-fs-deep p-5 transition-all duration-300 hover:border-fs-primary hover:shadow-[0_0_20px_rgba(10,108,243,0.25)]"
                style={{
                  animation: `fs-breathe 4s ease-in-out infinite`,
                  animationDelay: `${i * 0.6}s`,
                  willChange: "transform",
                }}
              >
                <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.14em] text-fs-gray-med">
                  {d.label}
                </div>
                <div>
                  <div
                    ref={refFor(d.id)}
                    className="font-[family-name:var(--font-fraunces)] text-3xl font-medium leading-none tracking-[-0.01em] text-fs-white"
                  >
                    {d.value}
                  </div>
                  <div
                    className="mt-1.5 font-[family-name:var(--font-mono)] text-[11px] text-fs-gray-med"
                    dangerouslySetInnerHTML={{ __html: d.meta }}
                  />
                </div>
                <DashViz viz={d.viz} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
