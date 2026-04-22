import Link from "next/link";
import type { Agent } from "@/types/agent";
import AgentAvatar from "./AgentAvatar";

/**
 * Legacy-compat card used by `(main)/agents/AgentsPageClient.tsx`.
 * Render-compatible with the previous API (`agent`, `index`).
 * A richer redesigned version will land with the /agents route rework.
 */
export default function AgentCard({ agent }: { agent: Agent; index?: number }) {
  const rep = Math.round(agent.reputationScore * 20); // 0..5 → 0..100
  const priceLabel = agent.isFree || agent.priceSOL === 0 ? "grátis" : `${agent.priceSOL}`;
  return (
    <Link
      href={`/agents/${agent.id}`}
      className="group flex flex-col gap-3.5 rounded-[var(--radius-card-lg)] border border-fs-gray-low bg-fs-deep p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-fs-primary hover:shadow-[0_0_24px_rgba(10,108,243,0.2)]"
    >
      <div className="flex items-start gap-3">
        <AgentAvatar agentId={agent.id} size={56} />
        <div className="min-w-0 flex-1">
          <div className="font-[family-name:var(--font-inter-tight)] text-[15.5px] font-semibold leading-tight text-fs-white">
            {agent.name}
          </div>
          <p className="mt-1 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.14em] text-fs-gray-med">
            {agent.tagline}
          </p>
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-fs-gray-low">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-fs-primary to-fs-bright"
            style={{ width: `${rep}%` }}
          />
        </div>
        <div
          className={`font-[family-name:var(--font-fraunces)] text-2xl font-medium leading-none ${
            rep >= 90 ? "text-fs-amber" : "text-fs-white"
          }`}
        >
          {rep}
        </div>
      </div>

      <p className="line-clamp-2 text-[12.5px] leading-relaxed text-fs-gray-hi">
        {agent.bio}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-fs-gray-low pt-2.5">
        <div className="font-[family-name:var(--font-mono)] text-base font-medium text-fs-white">
          {priceLabel}
          {!agent.isFree && agent.priceSOL > 0 && (
            <span className="ml-1 text-[11px] text-fs-gray-med">SOL · call</span>
          )}
        </div>
        <span className="inline-flex h-8 items-center rounded-lg border border-fs-gray-low px-3.5 text-[12.5px] font-semibold text-fs-gray-hi transition-colors group-hover:border-fs-primary group-hover:bg-fs-primary group-hover:text-white">
          Ver agente
        </span>
      </div>
    </Link>
  );
}
