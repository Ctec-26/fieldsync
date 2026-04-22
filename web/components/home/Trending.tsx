import { HOME_AGENTS_BY_NAME, TRENDING_ORDER } from "@/lib/mock/agents";
import { ECO_MAP } from "@/lib/mock/eco";
import Reveal from "./Reveal";

/** Zone 4 — 4×2 grid of trending agents with cyan shimmer + hover-expand. */
export default function Trending() {
  return (
    <section data-screen-label="Trending">
      <div className="mx-auto max-w-[1440px] px-10 pb-[120px] pt-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-10">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-fs-cyan">
                <span aria-hidden className="fs-pulse-dot !mr-0" />
                Em alta agora
              </div>
            </Reveal>
            <Reveal delay={1}>
              <h2
                className="mt-4.5 max-w-[860px] text-balance font-[family-name:var(--font-fraunces)] font-semibold leading-[1.05] tracking-[-0.02em] text-fs-white"
                style={{ fontSize: "clamp(40px,4.2vw,56px)" }}
              >
                Os oito agentes que mais trabalharam nas últimas 24h.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <a
              href="#"
              className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-fs-primary no-underline"
            >
              Ver todos →
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRENDING_ORDER.map((name, i) => {
            const a = HOME_AGENTS_BY_NAME[name];
            if (!a) return null;
            const eco = ECO_MAP[a.eco];
            return (
              <Reveal key={name} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <div
                  className="group relative flex cursor-pointer items-center gap-3.5 overflow-hidden rounded-xl border border-fs-gray-low bg-fs-deep p-3.5 transition-[height,box-shadow,border] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_0_24px_rgba(27,240,254,0.2)]"
                  style={{ height: 88 }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(110deg, transparent 30%, rgba(27,240,254,0.08) 50%, transparent 70%)",
                      transform: "translateX(-100%)",
                      animation: `fs-shimmer 8s ease-in-out infinite`,
                      animationDelay: `${i}s`,
                      willChange: "transform",
                    }}
                  />
                  <div
                    className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[10px] font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-white ${eco.gradClass}`}
                  >
                    {a.letter}
                    <span className="absolute right-3 top-2.5 font-[family-name:var(--font-mono)] text-[10px] tracking-[0.12em] text-fs-cyan">
                      #{i + 1}
                    </span>
                  </div>
                  <div className="relative flex min-w-0 flex-1 flex-col justify-center">
                    <div className="flex items-center gap-2 text-[15.5px] font-semibold text-fs-white">
                      {a.name} <span className="fs-pulse-dot !mr-0" />
                    </div>
                    <div className="mt-0.5 font-[family-name:var(--font-mono)] text-[12.5px] tracking-[0.04em] text-fs-gray-med">
                      {eco.label} · rep {a.rep}
                    </div>
                    <div className="mt-2 max-h-0 overflow-hidden text-[12px] leading-snug text-fs-gray-hi opacity-0 transition-all duration-300 group-hover:max-h-16 group-hover:opacity-100">
                      {a.desc.slice(0, 72)}…{" "}
                      <a href="#" className="font-medium text-fs-primary no-underline">
                        ver perfil →
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
