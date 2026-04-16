"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import { Wallet, ChevronDown } from "lucide-react";
import { truncateAddress } from "@/lib/solana";

export default function WalletButton() {
  const { publicKey, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  if (publicKey) {
    return (
      <motion.button
        onClick={() => disconnect()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-navy-accent bg-navy-secondary text-text-primary text-sm font-medium font-inter hover:border-navy-highlight transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
        <span>{truncateAddress(publicKey.toString())}</span>
        <ChevronDown size={14} className="text-text-muted" />
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={() => setVisible(true)}
      disabled={connecting}
      whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(232, 184, 109, 0.3)" }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-primary text-navy-deepest text-sm font-semibold font-inter hover:bg-amber-glow transition-colors disabled:opacity-60"
    >
      <Wallet size={15} />
      {connecting ? "Connecting…" : "Connect Wallet"}
    </motion.button>
  );
}
