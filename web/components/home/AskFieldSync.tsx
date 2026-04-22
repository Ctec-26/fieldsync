"use client";

import * as React from "react";
import { HOME_AGENTS } from "@/lib/mock/agents";
import { ECO_MAP } from "@/lib/mock/eco";
import FieldSyncMark from "@/components/ui/FieldSyncMark";

/** Floating "Ask FieldSync" — routing (primary) + context (secondary). */
export default function AskFieldSync() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const wrapRef = React.useRef<HTMLDivElement | null>(null);

  // Cmd/Ctrl-K focus shortcut
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close on outside click when empty
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node) && query === "") {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [query]);

  const matches = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = HOME_AGENTS.slice();
    if (q) {
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.desc.toLowerCase().includes(q) ||
          ECO_MAP[a.eco].label.toLowerCase().includes(q),
      );
    }
    return list.slice(0, 5);
  }, [query]);

  return (
    <div
      ref={wrapRef}
      className={`fixed bottom-6 left-1/2 z-[80] w-[720px] max-w-[calc(100vw-48px)] -translate-x-1/2 rounded-[var(--radius-card-lg)] border border-fs-primary bg-fs-deep shadow-[0_0_24px_rgba(10,108,243,0.25),0_20px_60px_rgba(0,0,16,0.6)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        open ? "w-[840px]" : ""
      }`}
      style={open ? { maxHeight: 560 } : { height: 56 }}
    >
      <div className="flex h-14 items-center gap-3.5 px-5">
        <FieldSyncMark size={28} style={{ animation: "fs-ask-pulse 2s ease-in-out infinite" }} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          type="text"
          className="flex-1 bg-transparent text-[14.5px] text-fs-white outline-none placeholder:text-fs-gray-med"
          placeholder="Ask FieldSync — find an agent, understand a concept…"
          aria-label="Ask FieldSync"
        />
        <span className="hidden items-center rounded-md border border-fs-gray-low px-2 py-1 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em] text-fs-gray-med sm:inline-flex">
          ⌘ K
        </span>
      </div>

      {open && (
        <div className="max-h-[460px] overflow-y-auto border-t border-fs-gray-low p-3.5">
          <div className="px-2.5 pb-3 pt-2 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-fs-gray-med">
            {query ? `Resultados para "${query}"` : "Sugestões iniciais"}
          </div>
          {matches.length > 0 ? (
            matches.map((a) => {
              const eco = ECO_MAP[a.eco];
              return (
                <div
                  key={a.name}
                  className="grid cursor-pointer grid-cols-[36px_1fr_auto_auto] items-center gap-3 rounded-[10px] p-2.5 transition-colors hover:bg-[rgba(10,108,243,0.08)]"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg font-[family-name:var(--font-fraunces)] text-sm font-semibold text-white ${eco.gradClass}`}
                  >
                    {a.letter}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-fs-white">{a.name}</div>
                    <div className="mt-0.5 font-[family-name:var(--font-mono)] text-xs text-fs-gray-med">
                      {eco.label} · rep {a.rep}
                    </div>
                  </div>
                  <div className="font-[family-name:var(--font-mono)] text-[13px] text-fs-bright">
                    {a.price === "free" ? "grátis" : `${a.price} SOL`}
                  </div>
                  <button
                    type="button"
                    className="h-7 rounded-md bg-fs-primary px-3 text-[11.5px] font-semibold uppercase tracking-[0.04em] text-white"
                  >
                    Contratar
                  </button>
                </div>
              );
            })
          ) : (
            <div className="px-2.5 py-6 text-center text-sm text-fs-gray-med">
              Nada encontrado — tente outra palavra.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
