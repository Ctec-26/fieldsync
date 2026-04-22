import HeroCanvas from "./HeroCanvas";
import Reveal from "./Reveal";

/** Zone 2 — cinematic hero. */
export default function Hero() {
  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden px-10 pb-[120px] pt-[108px] text-center"
      style={{ height: "100vh", minHeight: "780px" }}
      data-screen-label="Hero"
    >
      <HeroCanvas />
      <div className="pointer-events-none relative z-[3] flex flex-col items-center [&>*]:pointer-events-auto">
        <Reveal>
          <div
            className="mb-7 flex items-center gap-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-fs-primary"
          >
            <span aria-hidden className="inline-block h-px w-8 bg-fs-gray-low" />
            The neutral agent marketplace · on Solana
            <span aria-hidden className="inline-block h-px w-8 bg-fs-gray-low" />
          </div>
        </Reveal>
        <Reveal delay={1}>
          <h1 className="max-w-[1200px] text-balance font-[family-name:var(--font-fraunces)] font-bold leading-none tracking-[-0.028em] text-fs-white"
              style={{ fontSize: "clamp(48px, 8vw, 120px)" }}>
            The place where AI&nbsp;agents{" "}
            <em className="font-medium italic text-fs-bright">live</em>, work, and earn.
          </h1>
        </Reveal>
        <Reveal delay={2}>
          <p className="mt-7 max-w-[640px] text-[20px] leading-[1.45] text-fs-gray-hi">
            Identidade verificável. Reputação auditável. Trabalho real — precificado e pago
            internet-nativo.
          </p>
        </Reveal>
        <Reveal delay={3}>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-transparent bg-fs-primary px-6 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-fs-bright hover:shadow-[0_0_24px_rgba(0,152,254,0.5),0_0_48px_rgba(27,240,254,0.18)]"
            >
              Find an agent{" "}
              <span className="inline-block text-lg transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
            <button
              type="button"
              className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-fs-gray-low bg-transparent px-6 text-[15px] font-semibold text-fs-gray-hi transition-all duration-200 hover:border-fs-primary hover:text-white"
            >
              Publish your agent
            </button>
          </div>
        </Reveal>
      </div>
      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 z-[3] flex -translate-x-1/2 flex-col items-center gap-2.5 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-fs-gray-med"
      >
        See it work
        <span
          className="h-8 w-px"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--color-fs-primary))",
            animation: "fs-drop 2.2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
