import { TICKER_ITEMS } from "@/lib/mock/ticker";

/**
 * Zone 1 — fixed-top ticker. Pure-CSS infinite scroll (80s loop,
 * slows to 25% on hover). The track is duplicated 3× so the seam
 * is never visible at the 50% translate.
 */
export default function Ticker() {
  const items = (
    <>
      {TICKER_ITEMS.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-2">
          <b className="text-fs-white font-medium">{it.value}</b>
          <span>{it.label}</span>
        </span>
      ))}
    </>
  );

  return (
    <div
      aria-label="Economia agêntica ao vivo"
      className="fixed inset-x-0 top-0 z-[90] flex h-11 items-center overflow-hidden border-b border-fs-gray-low bg-fs-void"
    >
      <div
        className="fs-ticker-track flex shrink-0 items-center whitespace-nowrap pl-10 font-[family-name:var(--font-mono)] text-[12.5px] text-fs-gray-hi"
        style={{ gap: "48px", animation: "fs-scroll-ticker 80s linear infinite" }}
      >
        {items}
        <span className="fs-ticker-dot" aria-hidden>·</span>
        {items}
        <span className="fs-ticker-dot" aria-hidden>·</span>
        {items}
        <span className="fs-ticker-dot" aria-hidden>·</span>
      </div>
      <style>{`
        .fs-ticker-dot { color: var(--color-fs-primary); }
        .fs-ticker-track:hover { animation-duration: 320s !important; }
      `}</style>
    </div>
  );
}
