"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import Link from "next/link";
import { Copy, ArrowRight, Wallet } from "lucide-react";
import { truncateAddress } from "@/lib/solana";

export default function ProfilePage() {
  const { publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  if (!publicKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-navy-secondary border border-navy-accent/30 flex items-center justify-center">
          <Wallet size={28} className="text-amber-primary" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-grotesk font-bold text-2xl text-text-heading mb-2">Connect your wallet</h1>
          <p className="text-text-muted font-inter">Your session history and attestations live here.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(232,184,109,0.3)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setVisible(true)}
          className="px-6 py-3 rounded-xl font-semibold font-inter text-navy-deepest"
          style={{ background: "linear-gradient(135deg, #E8B86D, #F5D29A)" }}
        >
          Connect Phantom Wallet
        </motion.button>
      </div>
    );
  }

  const address = publicKey.toString();

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          {/* Wallet card */}
          <div
            className="p-6 rounded-2xl border border-navy-accent/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: "linear-gradient(135deg, #1E3A6E 0%, #142850 100%)" }}
          >
            <div className="flex flex-col gap-1">
              <p className="text-text-muted text-xs font-inter">Connected Wallet</p>
              <p className="text-text-heading font-grotesk font-semibold text-lg">{truncateAddress(address, 8)}</p>
              <p className="text-text-muted text-xs font-inter">Solana Devnet</p>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(address)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-navy-accent/30 text-text-muted hover:text-text-primary hover:border-navy-highlight/40 text-sm font-inter transition-colors"
            >
              <Copy size={13} strokeWidth={1.5} />
              Copy address
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Sessions", value: "0" },
              { label: "Attestations", value: "0" },
              { label: "SOL Spent", value: "0.00" },
            ].map((s) => (
              <div key={s.label} className="p-4 rounded-xl border border-navy-accent/20 bg-navy-secondary/20 text-center">
                <p className="font-grotesk font-bold text-2xl text-text-heading">{s.value}</p>
                <p className="text-text-muted text-xs font-inter mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Empty state */}
          <div className="p-12 rounded-2xl border border-navy-accent/15 bg-navy-primary/20 flex flex-col items-center gap-4 text-center">
            <p className="font-grotesk font-semibold text-lg text-text-heading">No sessions yet</p>
            <p className="text-text-muted font-inter text-sm max-w-xs">
              Start your first session with a specialized agent to build your on-chain history.
            </p>
            <Link href="/agents">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium font-inter text-navy-deepest cursor-pointer text-sm"
                style={{ background: "linear-gradient(135deg, #E8B86D, #F5D29A)" }}
              >
                Start your first session
                <ArrowRight size={14} />
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
