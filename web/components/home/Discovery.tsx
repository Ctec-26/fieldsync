"use client";

import * as React from "react";
import { HOME_AGENTS } from "@/lib/mock/agents";
import { ECOSYSTEMS, ECO_MAP } from "@/lib/mock/eco";
import type { EcoId, HomeAgent } from "@/types/home";
import Reveal from "./Reveal";

type EcoFilter = "all" | EcoId;
type CrossFilter = null | "Simples" | "MicroSaaS";

const STATE_LABEL: Record<HomeAgent["state"], string> = {
  available: "Disponível",
  busy: "Ocupado",
  trending: "Em alta",
  featured: "Destaque",
  maintenance: "Manutenção",
};

function AgentCardHome({ a }: { a: HomeAgent }) {
  const eco = ECO_MAP[a.eco];
  const priceLabel =
    a.price === "free" ? "grátis" : a.price;
  const showBusyViz = a.state === "busy";
  const stateColor =
    a.state === "available"
      ? "#3DDBB4"
      : a.state === "busy"
        ? "var(--color-fs-amber)"
        : a.state === "trending"
          ? "var(--color-fs-cyan)"
          : "var(--color-fs-gray-med)";

  return (
    <div className="group relative flex cursor-pointer flex-col gap-3.5 overflow-hidden rounded-[var(--radius-card-lg)] border border-fs-gray-low bg-fs-deep p-5 transition-all duration-[280ms] hover:-translate-y-0.5 hover:border-fs-primary hover:shadow-[0_0_24px_rgba(10,108,243,0.2)]">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] font-[family-name:var(--font-fraunces)] text-[22px] font-semibold text-white ${eco.gradClass}`}
        >
          {a.letter}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[15.5px] font-semibold leading-tight text-fs-white">
            {a.name}
          </div>
          <span
            className={`mt-1.5 inline-block rounded px-2 py-0.5 font-[family-name:var(--font-mono)] text-[9.5px] font-medium uppercase tracking-[0.14em] ${eco.tagClass}`}
          >
            {eco.label}
          </span>
        </div>
        <span
          aria-label={STATE_LABEL[a.state]}
          className="mt-2 h-2 w-2 shrink-0 rounded-full"
          style={{
            background: stateColor,
            boxShadow: `0 0 8px ${stateColor}`,
            animation: a.state === "busy" ? "fs-pulse 2s infinite" : a.state === "maintenance" ? "none" : "fs-pulse 1.6s infinite",
          }}
        />
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-fs-gray-low">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${a.rep}%`,
              background: "linear-gradient(90deg, var(--color-fs-primary), var(--color-fs-bright))",
            }}
          />
        </div>
        <div
          className={`font-[family-name:var(--font-fraunces)] text-2xl font-medium leading-none ${
            a.rep >= 90 ? "text-fs-amber [text-shadow:0_0_12px_rgba(246,246,226,0.35)]" : "text-fs-white"
          }`}
        >
          {a.rep}
        </div>
      </div>

      <p className="line-clamp-2 text-[12.5px] leading-relaxed text-fs-gray-hi">
        {a.desc}
      </p>

      {showBusyViz && (
        <div className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] text-fs-amber">
          <span className="h-1.5 w-1.5 rounded-full bg-fs-amber" style={{ animation: "fs-node-blink 1.4s ease-in-out infinite" }} />
          <span className="h-px w-3 bg-fs-amber opacity-30" />
          <span className="h-1.5 w-1.5 rounded-full bg-fs-amber" style={{ animation: "fs-node-blink 1.4s ease-in-out infinite", animationDelay: "0.2s" }} />
          <span className="h-px w-3 bg-fs-amber opacity-30" />
          <span className="h-1.5 w-1.5 rounded-full bg-fs-amber" style={{ animation: "fs-node-blink 1.4s ease-in-out infinite", animationDelay: "0.4s" }} />
          <span className="ml-1">Analisando → Cruzando → Gerando</span>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-fs-gray-low pt-2.5">
        <div className="font-[family-name:var(--font-mono)] text-base font-medium text-fs-white">
          {priceLabel}
          {a.price !== "free" && (
            <span className="ml-1 text-[11px] text-fs-gray-med">SOL · call</span>
          )}
        </div>
        <button
          type="button"
          className="inline-flex h-8 items-center rounded-lg border border-fs-gray-low bg-transparent px-3.5 text-[12.5px] font-semibold text-fs-gray-hi transition-all hover:border-fs-primary hover:bg-fs-primary hover:text-white"
        >
          Contratar
        </button>
      </div>
    </div>
  );
}

/** Zone 5 — eco + cross chips, filterable 4×3 agent grid. */
export default function Discovery() {
  const [eco, setEco] = React.useState<EcoFilter>("all");
  const [cross, setCross] = React.useState<CrossFilter>(null);

  const list = React.useMemo(() => {
    let out = HOME_AGENTS.slice();
    if (eco !== "all") out = out.filter((a) => a.eco === eco);
    if (cross === "Simples") out = out.filter((a) => a.tags.includes("Simples"));
    if (cross === "MicroSaaS") out = out.filter((a) => a.tags.includes("MicroSaaS"));
    return out.slice(0, 12);
  }, [eco, cross]);

  const toggleCross = (v: "Simples" | "MicroSaaS") =>
    setCross((p) => (p === v ? null : v));

  return (
    <section data-screen-label="Discovery">
      <div className="mx-auto max-w-[1440px] px-10 pb-[120px] pt-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-10">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-fs-primary">
                <span aria-hidden className="inline-block h-px w-6 bg-fs-primary" />
                Descoberta
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2
                className="mt-4.5 max-w-[860px] text-balance font-[family-name:var(--font-fraunces)] font-semibold leading-[1.05] tracking-[-0.02em] text-fs-white"
                style={{ fontSize: "clamp(40px,4.2vw,56px)" }}
              >
                Pelo ecossistema. Pelo formato. Pelo que você precisa resolver.
              </h2>
            </Reveal>
          </div>
        </div>

        <Reveal delay={2}>
          <div className="mb-8 flex flex-wrap items-center gap-2.5">
            <Chip active={eco === "all"} onClick={() => setEco("all")}>
              Todos
            </Chip>
            {ECOSYSTEMS.map((e) => (
              <Chip key={e.id} active={eco === e.id} onClick={() => setEco(e.id)}>
                {e.label}
              </Chip>
            ))}
            <span aria-hidden className="mx-1 h-5 w-px bg-fs-gray-low" />
            <CrossChip active={cross === "Simples"} onClick={() => toggleCross("Simples")}>
              Simples
            </CrossChip>
            <CrossChip active={cross === "MicroSaaS"} onClick={() => toggleCross("MicroSaaS")}>
              MicroSaaS
            </CrossChip>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.length > 0 ? (
            list.map((a) => <AgentCardHome key={a.name} a={a} />)
          ) : (
            <div className="col-span-full rounded-[var(--radius-card-lg)] border border-dashed border-fs-gray-low p-10 text-center text-fs-gray-med">
              Nenhum agente nessa combinação — tente outro filtro.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full border px-4.5 text-[13.5px] font-medium transition-all duration-200 hover:scale-105 hover:text-white ${
        active
          ? "border-fs-primary bg-fs-primary text-white"
          : "border-fs-gray-low bg-transparent text-fs-gray-hi hover:border-fs-primary"
      }`}
      style={{ paddingLeft: 18, paddingRight: 18 }}
    >
      {children}
    </button>
  );
}

function CrossChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full border px-4.5 text-[13.5px] font-medium transition-all duration-200 hover:scale-105 ${
        active
          ? "border-fs-cyan bg-[rgba(27,240,254,0.12)] text-fs-cyan"
          : "border-[rgba(27,240,254,0.4)] bg-transparent text-fs-cyan"
      }`}
      style={{ paddingLeft: 18, paddingRight: 18 }}
    >
      {children}
    </button>
  );
}
