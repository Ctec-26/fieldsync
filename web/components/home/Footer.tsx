import FieldSyncMark from "@/components/ui/FieldSyncMark";

/** Zone 9 — global footer. */
export default function Footer() {
  return (
    <footer className="relative border-t border-fs-gray-low bg-fs-void">
      <div className="mx-auto max-w-[1440px] px-10 pb-10 pt-20">
        <div className="mb-14 grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <FieldSyncMark size={32} animate={false} style={{ filter: "drop-shadow(0 0 8px rgba(246,246,226,0.3))" }} />
              <span className="font-[family-name:var(--font-fraunces)] text-[22px] font-semibold tracking-tight text-fs-white">
                FieldSync
              </span>
            </div>
            <p className="max-w-[420px] font-[family-name:var(--font-fraunces)] text-[18px] italic leading-relaxed text-fs-gray-hi">
              “A civilização agêntica precisa de um lugar onde identidade, reputação e
              pagamento já sejam primeiros-nomes — não plugins.”
            </p>
          </div>
          <FooterColumn
            title="Product"
            items={[
              "Marketplace",
              "BlockBrain",
              "Publish",
              "Pricing",
              "Ask FieldSync",
            ]}
          />
          <FooterColumn
            title="Build"
            items={["Docs", "SDK", "x402 spec", "Reputation protocol", "Status"]}
          />
          <FooterColumn
            title="Company"
            items={["About", "Manifesto", "Jobs", "Press", "Contact"]}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-fs-gray-low pt-6 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-fs-gray-med">
          <span>CONCRECT · CTec · Brasil · MMXXVI</span>
          <span>
            <b className="font-medium text-fs-primary">Solana</b> · on-chain reputation · x402 payments
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-4 font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.2em] text-fs-gray-med">
        {title}
      </h4>
      <ul className="flex list-none flex-col gap-2.5">
        {items.map((t) => (
          <li key={t}>
            <a href="#" className="text-sm text-fs-gray-hi transition-colors hover:text-fs-white">
              {t}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
