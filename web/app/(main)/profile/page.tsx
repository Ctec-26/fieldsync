"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Copy, ArrowRight, Wallet, Check, Shield, MessageSquare,
  Coins, ExternalLink, Bot, type LucideIcon,
} from "lucide-react";
import AgentAvatar from "@/components/agents/AgentAvatar";
import { truncateAddress } from "@/lib/solana";
import { AGENTS_LIST } from "@/lib/agents";
import type { AgentId } from "@/types/agent";

/* ─── Disconnected state ─────────────────────────────────────── */

function DisconnectedState() {
  const { setVisible } = useWalletModal();
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 text-center max-w-sm"
      >
        {/* Icon cluster */}
        <div className="relative w-24 h-24">
          <div className="w-24 h-24 rounded-2xl border border-navy-accent/30 bg-navy-secondary/40 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1E3A6E 0%, #142850 100%)" }}>
            <Wallet size={36} className="text-amber-primary" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-navy-primary border border-navy-highlight/40 flex items-center justify-center">
            <Shield size={13} className="text-navy-highlight" strokeWidth={1.5} />
          </div>
        </div>

        <div>
          <h1 className="font-grotesk font-bold text-2xl sm:text-3xl text-text-heading mb-2">
            Your on-chain profile
          </h1>
          <p className="text-text-muted font-inter leading-relaxed">
            Connect your Phantom wallet to view your session history, attestations, and on-chain reputation.
          </p>
        </div>

        {/* Feature hints */}
        <div className="w-full flex flex-col gap-2">
          {[
            { icon: MessageSquare, text: "Session history with every agent" },
            { icon: Shield, text: "Your on-chain attestations" },
            { icon: Coins, text: "SOL spent across all sessions" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 p-3 rounded-xl border border-navy-accent/15 bg-navy-secondary/20 text-left">
              <Icon size={14} className="text-amber-primary flex-shrink-0" strokeWidth={1.5} />
              <span className="text-text-muted text-sm font-inter">{text}</span>
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(232,184,109,0.35)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setVisible(true)}
          className="w-full py-3.5 rounded-xl font-grotesk font-semibold text-navy-deepest"
          style={{ background: "linear-gradient(135deg, #E8B86D, #F5D29A)" }}
        >
          Connect Phantom Wallet
        </motion.button>

        <p className="text-text-muted text-xs font-inter">
          Solana Devnet · Read-only access to your public address
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Connected state ────────────────────────────────────────── */

function StatCard({ icon: Icon, label, value, accent = false }: {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-5 rounded-2xl border border-navy-accent/20 flex flex-col gap-3"
      style={{ background: "linear-gradient(135deg, rgba(30,58,110,0.5) 0%, rgba(20,40,80,0.5) 100%)" }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{
          background: accent ? "rgba(232,184,109,0.12)" : "rgba(42,82,152,0.2)",
          border: accent ? "1px solid rgba(232,184,109,0.25)" : "1px solid rgba(42,82,152,0.3)",
        }}>
        <Icon size={16} strokeWidth={1.5}
          className={accent ? "text-amber-primary" : "text-navy-highlight"} />
      </div>
      <div>
        <p className="font-grotesk font-bold text-2xl text-text-heading">{value}</p>
        <p className="text-text-muted text-xs font-inter mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

function EmptyHistory() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center gap-5 py-16 text-center rounded-2xl border border-dashed border-navy-accent/25"
      style={{ background: "rgba(20,40,80,0.2)" }}
    >
      <div className="w-14 h-14 rounded-2xl border border-navy-accent/20 bg-navy-secondary/30 flex items-center justify-center">
        <Bot size={24} className="text-text-muted" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-grotesk font-semibold text-lg text-text-heading mb-1">No sessions yet</p>
        <p className="text-text-muted font-inter text-sm max-w-xs leading-relaxed">
          Start your first session to build your on-chain history and earn verified attestations.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        {AGENTS_LIST.map((agent) => (
          <Link key={agent.id} href={`/agents/${agent.id}`}>
            <motion.span
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-inter cursor-pointer transition-colors"
              style={{
                background: `${agent.tagColor}10`,
                borderColor: `${agent.tagColor}30`,
                color: agent.tagColor,
              }}
            >
              <AgentAvatar agentId={agent.id as AgentId} size={18} animate={false} />
              {agent.name}
            </motion.span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

function ConnectedProfile({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const memberSince = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          {/* Page header */}
          <div className="pt-4 pb-2 flex items-center justify-between">
            <h1 className="font-grotesk font-bold text-3xl text-text-heading">Profile</h1>
            <span className="text-text-muted text-sm font-inter">Solana Devnet</span>
          </div>

          {/* Wallet card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-6 rounded-2xl border border-navy-accent/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            style={{ background: "linear-gradient(135deg, #1E3A6E 0%, #142850 100%)" }}
          >
            {/* Left: identity */}
            <div className="flex items-center gap-4">
              {/* Avatar placeholder — geometric */}
              <div className="w-14 h-14 rounded-2xl border border-navy-highlight/30 bg-navy-accent/20 flex items-center justify-center flex-shrink-0">
                <div className="w-8 h-8 rounded-full border-2 border-navy-highlight/50 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-navy-highlight opacity-70" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-text-heading font-grotesk font-semibold text-lg">
                    {truncateAddress(address, 6)}
                  </p>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-text-muted text-xs font-inter">Member since {memberSince}</p>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-navy-accent/30 text-text-muted hover:text-text-primary hover:border-navy-highlight/40 text-sm font-inter transition-colors"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Check size={13} className="text-emerald-400" strokeWidth={2} />
                    </motion.span>
                  ) : (
                    <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Copy size={13} strokeWidth={1.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
                {copied ? "Copied!" : "Copy address"}
              </motion.button>
              <a
                href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-navy-accent/30 text-text-muted hover:text-text-primary hover:border-navy-highlight/40 text-sm font-inter transition-colors"
              >
                Explorer
                <ExternalLink size={12} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon={MessageSquare} label="Sessions" value="0" />
            <StatCard icon={Shield} label="Attestations" value="0" accent />
            <StatCard icon={Coins} label="SOL Spent" value="0.00" />
          </div>

          {/* Session history */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-grotesk font-semibold text-lg text-text-heading">Session History</h2>
              <span className="text-text-muted text-xs font-inter border border-navy-accent/20 px-2.5 py-1 rounded-full">
                0 sessions
              </span>
            </div>
            <EmptyHistory />
          </div>

          {/* Explore CTA strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-6 rounded-2xl border border-amber-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background: "linear-gradient(135deg, rgba(232,184,109,0.06) 0%, rgba(20,40,80,0.4) 100%)" }}
          >
            <div>
              <p className="font-grotesk font-semibold text-text-heading mb-0.5">
                Build your on-chain reputation
              </p>
              <p className="text-text-muted text-sm font-inter">
                Every session you rate becomes a permanent attestation on Solana.
              </p>
            </div>
            <Link href="/agents">
              <motion.span
                whileHover={{ scale: 1.03, boxShadow: "0 0 18px rgba(232,184,109,0.3)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold font-inter text-navy-deepest text-sm cursor-pointer whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #E8B86D, #F5D29A)" }}
              >
                Start a Session
                <ArrowRight size={14} />
              </motion.span>
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */

export default function ProfilePage() {
  const { publicKey } = useWallet();
  return publicKey
    ? <ConnectedProfile address={publicKey.toString()} />
    : <DisconnectedState />;
}
