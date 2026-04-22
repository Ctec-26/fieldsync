import Reveal from "./Reveal";

interface EduCard {
  letter: string;
  name: string;
  eco: string;
  desc: string;
  sessions: string;
}

const EDU_CARDS: EduCard[] = [
  {
    letter: "A",
    name: "Prof. Ada",
    eco: "Educação · fundamentos",
    desc: "Explica contratos inteligentes e o ecossistema Solana em linguagem do dia a dia. Tem paciência infinita.",
    sessions: "1,289 sessões",
  },
  {
    letter: "C",
    name: "CodeMentor",
    eco: "Educação · prática",
    desc: "Code review de contratos Solidity e Anchor. Aponta vulnerabilidades e explica o porquê de cada sugestão.",
    sessions: "842 sessões",
  },
  {
    letter: "T",
    name: "TokenTalk",
    eco: "Educação · tokenomics",
    desc: "Simula emissões, staking e curvas de distribuição. Mostra como pequenas mudanças mudam tudo ao longo dos anos.",
    sessions: "617 sessões",
  },
];

/**
 * Zone 7 — BlockBrain preview. Dark-themed like every other zone;
 * no paper background, no gradient transition. Mirrors the same
 * card / border / text tokens as Dashboard and Discovery so the
 * seam between sections is invisible.
 */
export default function BlockBrainPreview() {
  return (
    <section data-screen-label="BlockBrain">
      <div className="mx-auto max-w-[1440px] px-10 pb-[120px] pt-10">
        <div className="max-w-[860px]">
          <Reveal>
            <div className="inline-flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-fs-primary">
              <span aria-hidden className="inline-block h-px w-6 bg-fs-primary" />
              BlockBrain · camada gratuita
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h2
              className="mt-4.5 font-[family-name:var(--font-fraunces)] font-semibold leading-[1.05] tracking-[-0.02em] text-fs-white"
              style={{ fontSize: "clamp(40px,4.8vw,64px)" }}
            >
              BlockBrain — <em className="italic text-fs-bright">aprenda conversando</em>.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-4 max-w-[560px] text-[18px] leading-[1.55] text-fs-gray-hi">
              Entre sem cadastro. Pergunte o que você não entende sobre o mundo
              agêntico, DeFi, contratos inteligentes — e aprenda com agentes
              especializados que ensinam devagar, no seu ritmo.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EDU_CARDS.map((c, i) => (
            <Reveal key={c.name} delay={((i + 1) as 1 | 2 | 3)}>
              <div className="cursor-pointer rounded-[var(--radius-card-lg)] border border-fs-gray-low bg-fs-deep p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-fs-primary hover:shadow-[0_0_24px_rgba(10,108,243,0.2)]">
                <div className="mb-4 flex items-center gap-3.5">
                  <div className="grad-edu flex h-12 w-12 items-center justify-center rounded-xl font-[family-name:var(--font-fraunces)] text-lg font-semibold text-white">
                    {c.letter}
                  </div>
                  <div>
                    <div className="text-base font-semibold text-fs-white">
                      {c.name}
                    </div>
                    <div className="mt-0.5 font-[family-name:var(--font-mono)] text-xs tracking-[0.04em] text-fs-gray-med">
                      {c.eco}
                    </div>
                  </div>
                </div>
                <p className="text-[13.5px] leading-[1.5] text-fs-gray-hi">
                  {c.desc}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-fs-gray-low pt-3.5 text-xs text-fs-gray-med">
                  <span>{c.sessions}</span>
                  <b className="font-[family-name:var(--font-mono)] font-semibold text-fs-primary">
                    grátis
                  </b>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={4}>
          <div className="mt-14 flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-transparent bg-fs-primary px-6 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-fs-bright hover:shadow-[0_0_24px_rgba(0,152,254,0.5)]"
            >
              Entrar no BlockBrain <span className="text-lg">→</span>
            </button>
            <button
              type="button"
              className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-fs-gray-low bg-transparent px-6 text-[15px] font-semibold text-fs-gray-hi transition-all duration-200 hover:border-fs-primary hover:text-white"
            >
              Ver todos os agentes educacionais
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
