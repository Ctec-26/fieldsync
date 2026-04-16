"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { MessageCircle, Star, Shield, ArrowRight, Zap, Globe } from "lucide-react";

const SECTIONS = [
  {
    icon: Globe,
    headline: "Web3 keeps evolving. Every breakthrough creates a new gap.",
    body: "RWA tokenization. DeFi innovations. Autonomous payments via x402. The ecosystem moves faster than any human can follow — and trustworthy guidance is nowhere to be found.",
    accent: "#3D7EE8",
  },
  {
    icon: Zap,
    headline: "FieldSync bridges that gap.",
    body: "Three specialized AI agents, each an expert in their domain. Available 24/7. Teaching — not recommending. Their reputation is built transparently, on-chain, by every person they help.",
    accent: "#E8B86D",
  },
  {
    icon: MessageCircle,
    headline: "Ask a specialized agent.",
    body: "Choose your agent. Start a real conversation. Get expert-level guidance powered by Groq's fastest AI — streaming in real time, never waiting for a full reply.",
    accent: "#50C9B5",
  },
  {
    icon: Star,
    headline: "Rate your session.",
    body: "When your session ends, you evaluate it — honestly. A 1-to-5 star rating with an optional comment. Simple. Permanent. Meaningful.",
    accent: "#8B6BD9",
  },
  {
    icon: Shield,
    headline: "Your feedback becomes on-chain reputation.",
    body: "Every rating is recorded as an attestation on Solana Devnet. 400ms finality. $0.00025 per transaction. The trust layer for AI agents, built in public and verifiable forever.",
    accent: "#E8B86D",
  },
];

function Section({ section, index }: { section: typeof SECTIONS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-12 py-16 border-b border-navy-accent/15`}
    >
      <div className="flex-shrink-0">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background: `${section.accent}15`,
            border: `1px solid ${section.accent}30`,
          }}
        >
          <section.icon size={36} strokeWidth={1.5} style={{ color: section.accent }} />
        </div>
      </div>
      <div className="flex-1 text-center md:text-left">
        <span className="text-[11px] font-inter text-text-muted tracking-widest uppercase mb-3 block">
          0{index + 1}
        </span>
        <h2 className="font-grotesk font-bold text-2xl sm:text-3xl text-text-heading mb-4 leading-tight">
          {section.headline}
        </h2>
        <p className="text-text-muted font-inter text-lg leading-relaxed max-w-lg">{section.body}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="font-grotesk font-bold text-4xl sm:text-5xl text-text-heading mb-4">
            Trusted agents.<br />Transparent value.<br />Forever verifiable.
          </h1>
          <p className="text-text-muted font-inter text-xl max-w-xl mx-auto">
            This is how FieldSync works — and why it matters.
          </p>
        </motion.div>

        {SECTIONS.map((section, i) => (
          <Section key={i} section={section} index={i} />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center pt-16 flex flex-col items-center gap-6"
        >
          <h2 className="font-grotesk font-bold text-2xl sm:text-3xl text-text-heading">
            Ready to begin?
          </h2>
          <Link href="/agents">
            <motion.span
              whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(232,184,109,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold font-inter text-navy-deepest cursor-pointer"
              style={{ background: "linear-gradient(135deg, #E8B86D, #F5D29A)" }}
            >
              Explore the Agents
              <ArrowRight size={16} />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
