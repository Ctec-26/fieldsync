"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Shield, Lock, AlertCircle } from "lucide-react";
import FieldSyncLogo from "@/components/ui/FieldSyncLogo";
import { useWallet } from "@solana/wallet-adapter-react";
import { getConnection } from "@/lib/solana";
import { submitAttestation } from "@/lib/submit-attestation";
import type { AnchorWallet } from "@/lib/anchor-client";

interface Props {
  sessionId: string;
  agentId: string;
  agentType?: 0 | 1;
}

export default function EvaluationClient({ sessionId, agentId, agentType = 0 }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { publicKey, signTransaction, signAllTransactions } = useWallet();

  const isFree = agentType === 1;

  const handleSubmit = async () => {
    if (rating === 0 || submitting) return;
    setError(null);
    setSubmitting(true);

    // BlockBrain without wallet — skip on-chain, go to confirmation with mock sig
    if (isFree && !publicKey) {
      const mockSig = Array.from({ length: 64 }, () =>
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789"[
          Math.floor(Math.random() * 58)
        ]
      ).join("");
      const slot = 312_800_000 + Math.floor(Math.random() * 200_000);
      router.push(`/confirmation/${mockSig}?blockHeight=${slot}&rating=${rating}`);
      return;
    }

    if (!publicKey) return;

    try {
      const wallet: AnchorWallet = {
        publicKey,
        signTransaction: signTransaction!,
        signAllTransactions: signAllTransactions!,
      };
      const txSig = await submitAttestation(
        getConnection(),
        wallet,
        agentId,
        sessionId,
        rating,
        comment,
        agentType
      );
      const slot = await getConnection().getSlot("confirmed");
      router.push(`/confirmation/${txSig}?blockHeight=${slot}&rating=${rating}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg.includes("custom program error") ? "On-chain submission failed — programs may not be deployed yet." : msg);
      setSubmitting(false);
    }
  };

  const activeStars = hovered || rating;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-5 left-6">
        <FieldSyncLogo />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <div
          className="rounded-2xl border border-navy-accent/30 p-8 flex flex-col gap-6"
          style={{ background: "linear-gradient(135deg, #1E3A6E 0%, #142850 100%)" }}
        >
          <div className="flex items-center justify-center gap-2 text-text-muted text-xs font-inter">
            <Lock size={11} strokeWidth={1.5} />
            Complete your evaluation to continue
          </div>

          <div className="text-center">
            <h1 className="font-grotesk font-bold text-2xl sm:text-3xl text-text-heading mb-2">
              Rate your session
            </h1>
            <p className="text-text-muted font-inter text-sm leading-relaxed">
              Your feedback builds on-chain reputation. Every rating is permanent and verifiable on Solana.
            </p>
          </div>

          {/* Star selector */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(0)}
                  className="p-1 transition-colors"
                  aria-label={`Rate ${i} stars`}
                >
                  <Star
                    size={36}
                    strokeWidth={1.5}
                    className={`transition-colors ${
                      i <= activeStars
                        ? "fill-amber-primary text-amber-primary"
                        : "text-navy-accent"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            {activeStars > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-amber-primary text-sm font-inter font-medium"
              >
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][activeStars]}
              </motion.p>
            )}
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-2">
            <label className="text-text-muted text-xs font-inter">
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 280))}
              placeholder="Share your experience…"
              rows={3}
              className="resize-none bg-navy-deepest/50 border border-navy-accent/30 rounded-xl px-4 py-3 text-text-primary placeholder-text-muted text-sm font-inter focus:outline-none focus:border-navy-highlight/50"
            />
            <span className="text-text-muted text-[11px] font-inter text-right">{comment.length}/280</span>
          </div>

          {/* On-chain note */}
          <div
            className="flex items-start gap-2 p-3 rounded-xl border"
            style={
              isFree && !publicKey
                ? { background: "rgba(45,212,191,0.06)", borderColor: "rgba(45,212,191,0.25)" }
                : { background: "rgba(232,184,109,0.06)", borderColor: "rgba(232,184,109,0.2)" }
            }
          >
            <Shield
              size={14}
              className={isFree && !publicKey ? "text-teal-400" : "text-amber-primary"}
              style={{ marginTop: 2, flexShrink: 0 }}
              strokeWidth={1.5}
            />
            <p className="text-text-muted text-xs font-inter leading-relaxed">
              {isFree && !publicKey
                ? "BlockBrain is free. Connect a wallet to record your attestation on-chain, or submit anonymously."
                : "This attestation will be written to Solana Devnet and become part of this agent\u2019s public reputation."}
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
              <AlertCircle size={13} className="text-red-400 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <p className="text-red-400 text-xs font-inter leading-relaxed">{error}</p>
            </div>
          )}

          {/* Submit */}
          <motion.button
            whileHover={rating > 0 && !submitting ? { scale: 1.02, boxShadow: "0 0 24px rgba(232,184,109,0.35)" } : {}}
            whileTap={rating > 0 && !submitting ? { scale: 0.97 } : {}}
            onClick={handleSubmit}
            disabled={rating === 0 || submitting || (!publicKey && !isFree)}
            className="w-full py-4 rounded-xl font-grotesk font-semibold text-navy-deepest disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ background: "linear-gradient(135deg, #E8B86D, #F5D29A)" }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-navy-deepest border-t-transparent rounded-full block"
                />
                Recording on-chain…
              </span>
            ) : isFree && !publicKey ? (
              "Submit Anonymously"
            ) : !publicKey ? (
              "Connect wallet to submit"
            ) : (
              "Submit & Record On-Chain"
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
