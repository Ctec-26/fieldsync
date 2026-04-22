"use client";

import * as React from "react";
import type { FeedEvent } from "@/types/home";
import { FEED_STARTER, FEED_FACTORIES } from "@/lib/mock/feed";
import Reveal from "./Reveal";

function agePreviousTime(t: string): string {
  if (t === "agora") return "30s atrás";
  const m = t.match(/(\d+)\s*(min|s)/);
  if (!m) return t;
  const n = parseInt(m[1], 10);
  if (m[2] === "s") return n + 30 < 60 ? `${n + 30}s atrás` : "1 min atrás";
  return `${n + 1} min atrás`;
}

/** Zone 6 — feed ao vivo. New event slides in from the top every ~5s. */
export default function LiveFeed() {
  const [events, setEvents] = React.useState<FeedEvent[]>(FEED_STARTER);
  const enteringIndex = React.useRef<number>(-1);
  /** Last picked template index — prevents the same template appearing
   *  twice in a row even when the RNG collides. */
  const lastTemplateRef = React.useRef<number>(-1);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setEvents((prev) => {
        // Pick a template that differs from the previous one.
        let idx = Math.floor(Math.random() * FEED_FACTORIES.length);
        if (idx === lastTemplateRef.current) {
          idx = (idx + 1) % FEED_FACTORIES.length;
        }
        lastTemplateRef.current = idx;
        const tpl = FEED_FACTORIES[idx];
        const newEv: FeedEvent = {
          kind: tpl.kind,
          icon: tpl.icon,
          html: tpl.make(),
          time: "agora",
        };
        enteringIndex.current = 0;
        const aged = prev.map((e) => ({ ...e, time: agePreviousTime(e.time) }));
        return [newEv, ...aged].slice(0, 8);
      });
    }, 5200);
    return () => clearInterval(id);
  }, []);

  const top7 = events.slice(0, 7);

  return (
    <section data-screen-label="Live Feed">
      <div className="mx-auto max-w-[1440px] px-10 pb-[120px] pt-10">
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-fs-cyan">
              <span aria-hidden className="fs-pulse-dot !mr-0" />
              Movimentação agêntica ao vivo
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h2
              className="max-w-[860px] text-balance font-[family-name:var(--font-fraunces)] font-semibold leading-[1.05] tracking-[-0.02em] text-fs-white"
              style={{ fontSize: "clamp(40px,4.2vw,56px)" }}
            >
              Tudo que está acontecendo agora. Cada linha, uma transação on-chain.
            </h2>
          </Reveal>
        </div>

        <Reveal delay={2}>
          <div className="mx-auto max-w-[840px]">
            <div className="overflow-hidden rounded-[var(--radius-card-lg)] border border-fs-gray-low bg-fs-deep">
              <div className="flex items-center justify-between border-b border-fs-gray-low px-6 py-4.5">
                <div className="flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.2em] text-fs-gray-med">
                  <span aria-hidden className="fs-pulse-dot !mr-0" />
                  SOLANA · MAINNET
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[11px] text-fs-bright">
                  + 17 eventos · última hora
                </div>
              </div>
              <div className="max-h-[640px] overflow-hidden">
                {top7.map((e, i) => {
                  const kindCls =
                    e.kind === "trend"
                      ? "bg-[rgba(27,240,254,0.12)] text-fs-cyan border-[rgba(27,240,254,0.3)]"
                      : e.kind === "new"
                        ? "bg-[rgba(246,246,226,0.12)] text-fs-amber border-[rgba(246,246,226,0.25)]"
                        : "bg-[rgba(10,108,243,0.12)] text-fs-bright border-fs-gray-low";
                  const oldCls =
                    i === 4 ? "opacity-70" :
                    i === 5 ? "opacity-50" :
                    i === 6 ? "opacity-35" : "";
                  const entering = enteringIndex.current === 0 && i === 0;
                  return (
                    <div
                      key={`${e.time}-${e.html.slice(0, 40)}`}
                      className={`grid grid-cols-[36px_1fr_auto] items-start gap-3.5 border-b border-[rgba(58,69,88,0.5)] px-6 py-4.5 transition-opacity duration-[800ms] ${oldCls}`}
                      style={entering ? { animation: "fs-slide-in 600ms cubic-bezier(.16,1,.3,1) forwards", willChange: "transform, opacity" } : undefined}
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-[10px] border font-[family-name:var(--font-mono)] text-sm ${kindCls}`}
                      >
                        {e.icon}
                      </div>
                      <div
                        className="pt-1.5 text-sm leading-snug text-fs-gray-hi [&_b]:font-medium [&_b]:text-fs-white"
                        dangerouslySetInnerHTML={{
                          __html: `${e.html} <a class="ml-1.5 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.05em] text-fs-primary no-underline" href="#">ver on-chain →</a>`,
                        }}
                      />
                      <div className="whitespace-nowrap pt-2 font-[family-name:var(--font-mono)] text-[11.5px] text-fs-gray-med">
                        {e.time}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between border-t border-fs-gray-low px-6 py-3.5 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em] text-fs-gray-med">
                <span>EPOCH 842,117</span>
                <a href="#" className="text-fs-primary no-underline">
                  Explorar todas →
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
