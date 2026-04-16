import AgentCard from "@/components/agents/AgentCard";
import { AGENTS_LIST } from "@/lib/agents";

export const metadata = {
  title: "Agents — FieldSync",
  description: "Meet the specialized AI agents powering FieldSync.",
};

export default function AgentsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-grotesk font-bold text-4xl sm:text-5xl text-text-heading mb-4">
            The Agents
          </h1>
          <p className="text-text-muted font-inter text-xl max-w-2xl mx-auto">
            Specialized AI experts. Every reputation verified on-chain. Choose one to begin.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AGENTS_LIST.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
