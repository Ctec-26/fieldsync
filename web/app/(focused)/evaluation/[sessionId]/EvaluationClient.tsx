"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Shield, Lock } from "lucide-react";
import FieldSyncLogo from "@/components/ui/FieldSyncLogo";
import { generateMockTxSignature, generateMockBlockHeight } from "@/lib/solana";

export default function EvaluationClient() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || submitting) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    const txId = generateMockTxSignature();
    router.push(`/confirmation/${txId}?blockHeight=${generateMockBlockHeight()}&rating=${rating}`);
  };

  const activeStars = hovered || rating;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* No navigation escape — just logo */}
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
          {/* Lock indicator */}
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
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-primary/8 border border-amber-primary/20">
            <Shield size={14} className="text-amber-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
            <p className="text-text-muted text-xs font-inter leading-relaxed">
              This attestation will be written to Solana Devnet and become part of this agent&apos;s public reputation.
            </p>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={rating > 0 ? { scale: 1.02, boxShadow: "0 0 24px rgba(232,184,109,0.35)" } : {}}
            whileTap={rating > 0 ? { scale: 0.97 } : {}}
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
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
            ) : (
              "Submit & Record On-Chain"
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
