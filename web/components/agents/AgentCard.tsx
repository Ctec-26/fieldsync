"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Zap, Users } from "lucide-react";
import AgentAvatar from "./AgentAvatar";
import type { Agent } from "@/types/agent";

interface Props {
  agent: Agent;
  index?: number;
}

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          strokeWidth={1.5}
          className={i <= Math.round(score) ? "fill-amber-primary text-amber-primary" : "text-text-muted"}
        />
      ))}
      <span className="text-amber-primary text-xs font-semibold font-inter ml-1">{score.toFixed(1)}</span>
    </div>
  );
}

export default function AgentCard({ agent, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
      whileHover={{ y: -6 }}
    >
      <Link href={`/agents/${agent.id}`} className="block group">
        <motion.div
          whileHover={{ boxShadow: "0 12px 40px rgba(42,82,152,0.5), 0 0 0 1px rgba(61,126,232,0.4)" }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden rounded-2xl border border-navy-accent/30 bg-gradient-to-b from-navy-secondary to-navy-primary p-6 shadow-card-base flex flex-col gap-5"
          style={{ background: "linear-gradient(135deg, #1E3A6E 0%, #142850 100%)" }}
        >
          {/* Tag accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-70"
            style={{ background: `linear-gradient(90deg, transparent, ${agent.tagColor}, transparent)` }}
          />

          {/* Avatar + name row */}
          <div className="flex items-start justify-between">
            <AgentAvatar agentId={agent.id} size={72} glitch />
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-semibold font-inter tracking-wider uppercase"
              style={{
                background: `${agent.tagColor}18`,
                color: agent.tagColor,
                border: `1px solid ${agent.tagColor}40`,
              }}
            >
              {agent.id.toUpperCase()}
            </span>
          </div>

          {/* Name + tagline */}
          <div>
            <h3 className="text-text-heading font-grotesk font-semibold text-lg leading-tight mb-1">
              {agent.name}
            </h3>
            <p className="text-text-muted text-sm font-inter leading-relaxed line-clamp-2">
              {agent.tagline}
            </p>
          </div>

          {/* Reputation */}
          <StarRating score={agent.reputationScore} />

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs font-inter text-text-muted">
            <span className="flex items-center gap-1.5">
              <Users size={12} strokeWidth={1.5} />
              {agent.totalInteractions.toLocaleString()} sessions
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={12} strokeWidth={1.5} />
              {agent.avgResponseTime}
            </span>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-navy-accent/20">
            <div>
              <p className="text-text-muted text-[11px] font-inter">Per session</p>
              {agent.isFree ? (
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-inter"
                  style={{ background: "rgba(45,212,191,0.15)", color: "#2DD4BF", border: "1px solid rgba(45,212,191,0.3)" }}
                >
                  ✦ Free
                </span>
              ) : (
                <p className="text-amber-primary font-grotesk font-semibold text-base">
                  {agent.priceSOL} SOL
                </p>
              )}
            </div>
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-xl bg-navy-accent/40 border border-navy-highlight/30 text-text-primary text-sm font-medium font-inter group-hover:bg-navy-highlight/20 group-hover:border-navy-highlight/60 transition-colors"
            >
              View Agent →
            </motion.span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
