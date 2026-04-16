"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Users,
  Shield,
  Clock,
  Calendar,
  ExternalLink,
  ArrowLeft,
  Zap,
} from "lucide-react";
import AgentAvatar from "@/components/agents/AgentAvatar";
import type { Agent } from "@/types/agent";
import type { Attestation } from "@/types/attestation";
import { txUrl } from "@/lib/solana";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

function StarDisplay({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          strokeWidth={1.5}
          className={
            i <= Math.round(score)
              ? "fill-amber-primary text-amber-primary"
              : "text-navy-accent"
          }
        />
      ))}
      <span className="text-amber-primary font-grotesk font-semibold text-lg ml-1">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

function AttestationCard({ att }: { att: Attestation }) {
  const date = new Date(att.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="p-4 rounded-xl border border-navy-accent/20 bg-navy-primary/40">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={11}
              strokeWidth={1.5}
              className={i <= att.rating ? "fill-amber-primary text-amber-primary" : "text-navy-accent"}
            />
          ))}
        </div>
        <span className="text-text-muted text-[11px] font-inter">{date}</span>
      </div>
      {att.comment && (
        <p className="text-text-primary text-sm font-inter mb-3 leading-relaxed">
          &ldquo;{att.comment}&rdquo;
        </p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-text-muted text-[11px] font-inter font-mono">{att.walletAddress}</span>
        <a
          href={txUrl(att.txSignature)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-navy-highlight hover:text-amber-primary font-inter transition-colors"
        >
          View on Explorer
          <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}

interface Props {
  agent: Agent;
  attestations: Attestation[];
}

export default function AgentProfileClient({ agent, attestations }: Props) {
  const [introIdx] = useState(() =>
    Math.floor(Math.random() * agent.introVariants.length)
  );
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const handleStartSession = () => {
    if (!publicKey) {
      setVisible(true);
      return;
    }
    const sessionId = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    window.location.href = `/session/${agent.id}/${sessionId}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="pt-6 mb-8"
        >
          <Link
            href="/agents"
            className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary font-inter text-sm transition-colors"
          >
            <ArrowLeft size={15} strokeWidth={1.5} />
            Back to Agents
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-start gap-6 p-8 rounded-2xl border border-navy-accent/30"
              style={{ background: "linear-gradient(135deg, #1E3A6E 0%, #142850 100%)" }}
            >
              <AgentAvatar agentId={agent.id} size={100} glitch />
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h1 className="font-grotesk font-bold text-3xl text-text-heading">{agent.name}</h1>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold font-inter uppercase tracking-wider"
                    style={{
                      background: `${agent.tagColor}18`,
                      color: agent.tagColor,
                      border: `1px solid ${agent.tagColor}40`,
                    }}
                  >
                    {agent.id}
                  </span>
                </div>
                <StarDisplay score={agent.reputationScore} />
                <p className="text-text-muted font-inter leading-relaxed max-w-lg">
                  {agent.introVariants[introIdx]}
                </p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                { icon: Users, label: "Total Sessions", value: agent.totalInteractions.toLocaleString() },
                { icon: Shield, label: "Attestations", value: agent.onChainAttestations.toLocaleString() },
                { icon: Clock, label: "Avg Response", value: agent.avgResponseTime },
                { icon: Calendar, label: "Member Since", value: agent.memberSince },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-xl border border-navy-accent/20 bg-navy-secondary/30 flex flex-col gap-1.5"
                >
                  <stat.icon size={16} className="text-amber-primary" strokeWidth={1.5} />
                  <p className="text-text-heading font-grotesk font-semibold text-lg">{stat.value}</p>
                  <p className="text-text-muted text-xs font-inter">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="p-6 rounded-2xl border border-navy-accent/20 bg-navy-primary/30"
            >
              <h2 className="font-grotesk font-semibold text-lg text-text-heading mb-3">About</h2>
              <p className="text-text-muted font-inter leading-relaxed">{agent.bio}</p>
            </motion.div>

            {/* Specialties */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="font-grotesk font-semibold text-lg text-text-heading mb-3">Specialties</h2>
              <div className="flex flex-wrap gap-2">
                {agent.specialties.map((s) => (
                  <span
                    key={s.slug}
                    className="px-3 py-1.5 rounded-lg border border-navy-accent/30 text-text-primary text-sm font-inter hover:border-navy-highlight/40 transition-colors cursor-default"
                    style={{ background: "rgba(30,58,110,0.4)" }}
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Attestations */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <h2 className="font-grotesk font-semibold text-lg text-text-heading mb-4">
                Recent On-Chain Attestations
              </h2>
              <div className="flex flex-col gap-3">
                {attestations.map((att) => (
                  <AttestationCard key={att.id} att={att} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sticky sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="sticky top-24 p-6 rounded-2xl border border-navy-accent/30 flex flex-col gap-5"
              style={{ background: "linear-gradient(135deg, #1E3A6E 0%, #142850 100%)" }}
            >
              <div>
                <p className="text-text-muted text-xs font-inter mb-1">Per session</p>
                <p className="text-amber-primary font-grotesk font-bold text-3xl">
                  {agent.priceSOL} SOL
                </p>
              </div>

              <div className="flex flex-col gap-2 text-sm font-inter text-text-muted">
                <div className="flex items-center gap-2">
                  <Zap size={13} className="text-amber-primary" strokeWidth={1.5} />
                  Up to 20 messages or 30 minutes
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={13} className="text-amber-primary" strokeWidth={1.5} />
                  Attestation recorded on-chain
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(232,184,109,0.35)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartSession}
                className="w-full py-3.5 rounded-xl font-grotesk font-semibold text-navy-deepest transition-all"
                style={{ background: "linear-gradient(135deg, #E8B86D, #F5D29A)" }}
              >
                Start Session
              </motion.button>

              <p className="text-text-muted text-[11px] font-inter text-center leading-relaxed">
                {publicKey
                  ? "Payment required. Attestation recorded after completion."
                  : "Connect your Phantom wallet to start a session."}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
