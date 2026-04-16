"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, CheckCircle, ArrowRight } from "lucide-react";
import { txUrl } from "@/lib/solana";

export default function ConfirmationPage({ params }: { params: { txId: string } }) {
  const searchParams = useSearchParams();
  const blockHeight = searchParams.get("blockHeight") ?? "312847291";
  const rating = searchParams.get("rating") ?? "5";
  const txSig = params.txId;
  const timestamp = new Date().toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md flex flex-col items-center gap-8 text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(232,184,109,0.2), rgba(232,184,109,0.05))", border: "1px solid rgba(232,184,109,0.4)" }}>
            <CheckCircle size={40} className="text-amber-primary" strokeWidth={1.5} />
          </div>
        </motion.div>

        <div>
          <h1 className="font-grotesk font-bold text-3xl sm:text-4xl text-text-heading mb-3">
            Attestation recorded on-chain ✦
          </h1>
          <p className="text-text-muted font-inter leading-relaxed">
            Your review is now permanent on Solana. It will forever shape this agent&apos;s reputation.
          </p>
        </div>

        {/* Transaction card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full rounded-2xl border border-navy-accent/30 p-6 flex flex-col gap-4 text-left"
          style={{ background: "linear-gradient(135deg, #1E3A6E 0%, #142850 100%)" }}
        >
          <div className="flex items-center justify-between mb-1">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold font-inter flex items-center gap-1.5"
              style={{ background: "rgba(232,184,109,0.15)", color: "#E8B86D", border: "1px solid rgba(232,184,109,0.3)" }}
            >
              ✦ Verified on-chain
            </span>
            <span className="text-amber-primary font-grotesk font-semibold">{"★".repeat(Number(rating))}</span>
          </div>

          {[
            { label: "Transaction", value: `${txSig.slice(0, 20)}…${txSig.slice(-8)}` },
            { label: "Block Height", value: Number(blockHeight).toLocaleString() },
            { label: "Network", value: "Solana Devnet" },
            { label: "Timestamp", value: timestamp },
          ].map((row) => (
            <div key={row.label} className="flex justify-between gap-4 text-sm">
              <span className="text-text-muted font-inter">{row.label}</span>
              <span className="text-text-primary font-inter font-mono text-right break-all">{row.value}</span>
            </div>
          ))}

          <a
            href={txUrl(txSig)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-navy-highlight/30 text-navy-highlight hover:bg-navy-highlight/10 text-sm font-inter transition-colors"
          >
            View on Solana Explorer
            <ExternalLink size={13} strokeWidth={1.5} />
          </a>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 w-full"
        >
          <Link href="/agents" className="flex-1">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold font-inter text-navy-deepest cursor-pointer"
              style={{ background: "linear-gradient(135deg, #E8B86D, #F5D29A)" }}
            >
              Explore More Agents
              <ArrowRight size={15} />
            </motion.span>
          </Link>
          <Link href="/" className="flex-1">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center py-3 rounded-xl border border-navy-accent/40 text-text-primary font-medium font-inter hover:bg-navy-secondary/30 transition-colors cursor-pointer"
            >
              Return Home
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
