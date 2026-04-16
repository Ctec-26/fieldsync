import SynchronyHero from "@/components/home/SynchronyHero";
import LiveStats from "@/components/home/LiveStats";
import AgentCard from "@/components/agents/AgentCard";
import HowItWorksPreview from "@/components/home/HowItWorksPreview";
import { AGENTS_LIST } from "@/lib/agents";

export default function HomePage() {
  return (
    <>
      <SynchronyHero />
      <LiveStats />

      {/* Featured Agents */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-text-heading mb-3">
              Meet the Agents
            </h2>
            <p className="text-text-muted font-inter text-lg max-w-xl mx-auto">
              Three specialists. One platform. Every reputation earned on-chain.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AGENTS_LIST.map((agent, i) => (
              <AgentCard key={agent.id} agent={agent} index={i} />
            ))}
          </div>
        </div>
      </section>

      <HowItWorksPreview />
    </>
  );
}
