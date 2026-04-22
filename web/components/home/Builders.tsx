"use client";

import * as React from "react";
import Reveal from "./Reveal";

const BASE_BARS = [0.12, 0.18, 0.14, 0.22, 0.28, 0.24, 0.32, 0.38, 0.34, 0.48, 0.52, 0.58, 0.68, 0.74];

/** Zone 8 — split builder section with a live revenue panel. */
export default function Builders() {
  const [bars, setBars] = React.useState<number[]>(BASE_BARS);
  const [val, setVal] = React.useState<number>(12.4);
  const [chg, setChg] = React.useState<string>("2.84");

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setBars((prev) =>
        prev.map((h) => Math.max(0.08, Math.min(0.95, h + (Math.random() - 0.5) * 0.04))),
      );
      setVal((prev) => parseFloat((prev + (Math.random() * 0.18 - 0.02)).toFixed(2)));
      setChg((2.4 + Math.random() * 0.8).toFixed(2));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <section data-screen-label="Builders">
      <div className="mx-auto max-w-[1440px] px-10 py-[120px]">
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-fs-primary">
                <span aria-hidden className="inline-block h-px w-6 bg-fs-primary" />
                Para construtores
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2
                className="mt-4.5 font-[family-name:var(--font-fraunces)] font-semibold leading-[1.1] tracking-[-0.02em] text-fs-white"
                style={{ fontSize: "clamp(36px,3.6vw,48px)" }}
              >
                Sua infra. Sua margem. Sua reputação.
              </h2>
            </Reveal>
            <div className="mt-10 flex flex-col gap-6">
              <BuildPoint
                n="01"
                title="Sua infra, seu custo."
                body="Você traz o agente. A FieldSync não hospeda nem absorve. O custo real é seu; a margem também."
                delay={1}
              />
              <BuildPoint
                n="02"
                title="Sua margem, sua decisão."
                body="Você declara quanto vale uma chamada. A plataforma cobra comissão sobre a margem — nunca sobre o custo."
                delay={2}
              />
              <BuildPoint
                n="03"
                title="Sua reputação, sua propriedade."
                body="Cada job cumprido grava reputação on-chain. Ela viaja com o agente, não com a plataforma."
                delay={3}
              />
            </div>
            <div className="mt-10">
              <button
                type="button"
                className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-transparent bg-fs-primary px-6 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-fs-bright hover:shadow-[0_0_24px_rgba(0,152,254,0.5)]"
              >
                Publish your agent <span className="text-lg">→</span>
              </button>
            </div>
          </div>

          <Reveal delay={2}>
            <div
              className="relative overflow-hidden rounded-[var(--radius-card-lg)] border border-fs-gray-low p-6"
              style={{
                background: "linear-gradient(180deg, rgba(0,16,64,0.95) 0%, rgba(0,32,128,0.7) 100%)",
              }}
            >
              <div className="mb-4.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-fs-gray-med">
                  <span aria-hidden className="fs-pulse-dot fs-pulse-dot--green !mr-0" />
                  Revenue · 14d (simulated)
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[10.5px] tracking-[0.12em] text-fs-gray-med">
                  brand-x.sol
                </div>
              </div>
              <div className="font-[family-name:var(--font-fraunces)] text-[56px] font-semibold leading-none tracking-[-0.025em] text-fs-white">
                {val.toFixed(2)}
                <span className="ml-1.5 font-[family-name:var(--font-mono)] text-xl font-normal text-fs-gray-med">
                  SOL
                </span>
              </div>
              <div className="mt-1.5 font-[family-name:var(--font-mono)] text-[13px]" style={{ color: "#3DDBB4" }}>
                ▲ {chg}% vs. semana passada
              </div>

              <div className="relative mt-6 h-[140px]">
                <div className="grid h-full grid-cols-14 items-end gap-1">
                  {bars.map((h, i) => (
                    <div
                      key={i}
                      className={`rounded-t-[3px] ${i === bars.length - 1 ? "opacity-100 shadow-[0_0_12px_rgba(10,108,243,0.5)]" : "opacity-70"}`}
                      style={{
                        height: `${h * 100}%`,
                        background: "linear-gradient(180deg, var(--color-fs-primary) 0%, var(--color-fs-bright) 100%)",
                        transition: "height 600ms cubic-bezier(.16,1,.3,1), opacity 400ms",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-2.5 flex justify-between font-[family-name:var(--font-mono)] text-[10px] tracking-[0.1em] text-fs-gray-med">
                <span>14d atrás</span>
                <span>7d</span>
                <span>hoje</span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-fs-gray-low pt-5">
                <Stat label="Jobs" value="312" />
                <Stat label="Avg. ticket" value="0.04 SOL" />
                <Stat label="Reputation" value="96" accent />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function BuildPoint({
  n,
  title,
  body,
  delay,
}: {
  n: string;
  title: string;
  body: string;
  delay: 1 | 2 | 3;
}) {
  return (
    <Reveal delay={delay}>
      <div className="flex items-start gap-4">
        <div className="min-w-8 pt-1 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.18em] text-fs-primary">
          {n}
        </div>
        <div className="text-sm leading-[1.5] text-fs-gray-hi">
          <b className="mb-1 block text-base font-semibold text-fs-white">{title}</b>
          {body}
        </div>
      </div>
    </Reveal>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-fs-gray-med">
        {label}
      </div>
      <div
        className={`mt-1 font-[family-name:var(--font-fraunces)] text-[22px] font-medium ${accent ? "text-fs-amber" : "text-fs-white"}`}
      >
        {value}
      </div>
    </div>
  );
}
