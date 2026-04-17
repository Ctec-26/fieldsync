"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Zap } from "lucide-react";
import AgentCard from "@/components/agents/AgentCard";
import type { Agent } from "@/types/agent";

interface Props {
  marketplaceAgents: Agent[];
  blockbrainAgents: Agent[];
}

export default function AgentsPageClient({ marketplaceAgents, blockbrainAgents }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "blockbrain" ? "blockbrain" : "marketplace";

  const setTab = (next: "marketplace" | "blockbrain") => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "marketplace") {
      params.delete("tab");
    } else {
      params.set("tab", "blockbrain");
    }
    router.push(`/agents?${params.toString()}`, { scroll: false });
  };

  const isBlockBrain = tab === "blockbrain";
  const agents = isBlockBrain ? blockbrainAgents : marketplaceAgents;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="font-grotesk font-bold text-4xl sm:text-5xl text-text-heading mb-4">
            The Agents
          </h1>
          <p className="text-text-muted font-inter text-xl max-w-2xl mx-auto">
            Specialized AI experts. Every reputation verified on-chain. Choose one to begin.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10">
          <div className="flex gap-1 p-1 rounded-2xl border border-navy-accent/30 bg-navy-primary/40 backdrop-blur-sm">
            <button
              onClick={() => setTab("marketplace")}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium font-inter transition-all ${
                !isBlockBrain ? "text-text-heading" : "text-text-muted hover:text-text-primary"
              }`}
            >
              {!isBlockBrain && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-xl bg-navy-secondary/80 border border-navy-accent/40"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Zap size={14} strokeWidth={1.5} />
                Marketplace
              </span>
            </button>

            <button
              onClick={() => setTab("blockbrain")}
              className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium font-inter transition-all ${
                isBlockBrain ? "text-text-heading" : "text-text-muted hover:text-text-primary"
              }`}
            >
              {isBlockBrain && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-xl bg-navy-secondary/80 border border-navy-accent/40"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <BookOpen size={14} strokeWidth={1.5} />
                BlockBrain
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(45,212,191,0.15)",
                    color: "#2DD4BF",
                    border: "1px solid rgba(45,212,191,0.25)",
                  }}
                >
                  Free
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* BlockBrain info strip */}
        {isBlockBrain && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8 p-4 rounded-2xl border border-teal-500/20 text-center"
            style={{ background: "rgba(45,212,191,0.05)" }}
          >
            <p className="text-text-muted font-inter text-sm leading-relaxed">
              <span className="text-teal-400 font-medium">BlockBrain</span> agents are free educator AIs — no wallet, no payment required.
              Great for learning before you commit to a Marketplace session.
            </p>
          </motion.div>
        )}

        {/* Agent grid */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {agents.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </motion.div>

        {/* Cross-navigation hint */}
        <div className="mt-10 text-center">
          <p className="text-text-muted text-sm font-inter">
            {isBlockBrain ? (
              <>
                Ready for a full session?{" "}
                <button
                  onClick={() => setTab("marketplace")}
                  className="text-amber-primary hover:underline font-medium"
                >
                  Browse Marketplace agents →
                </button>
              </>
            ) : (
              <>
                Want to learn first?{" "}
                <button
                  onClick={() => setTab("blockbrain")}
                  className="text-teal-400 hover:underline font-medium"
                >
                  Try BlockBrain for free →
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
