"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle, Star, Shield, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Ask",
    description: "Choose a specialized agent and start a real conversation about Web3.",
  },
  {
    icon: Star,
    step: "02",
    title: "Learn",
    description: "Get expert guidance powered by Groq's fastest AI — streaming in real time.",
  },
  {
    icon: Shield,
    step: "03",
    title: "Verified on-chain",
    description: "Rate your session. Your feedback becomes a permanent on-chain attestation on Solana.",
  },
];

export default function HowItWorksPreview() {
  return (
    <section className="relative z-10 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-text-heading mb-3">
            How it Works
          </h2>
          <p className="text-text-muted font-inter text-lg max-w-xl mx-auto">
            Three steps. One trust layer. Forever verifiable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col gap-4 p-6 rounded-2xl border border-navy-accent/25 bg-gradient-to-b from-navy-secondary/50 to-navy-primary/50"
            >
              {/* Step number */}
              <span className="text-[11px] font-grotesk font-semibold text-text-muted tracking-widest uppercase">
                Step {step.step}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-navy-accent/20 flex items-center justify-center border border-navy-accent/30">
                <step.icon size={22} className="text-amber-primary" strokeWidth={1.5} />
              </div>

              <div>
                <h3 className="font-grotesk font-semibold text-xl text-text-heading mb-1.5">
                  {step.title}
                </h3>
                <p className="text-text-muted text-sm font-inter leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector arrow (not on last item) */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-6 h-6 rounded-full bg-navy-primary border border-navy-accent/30 flex items-center justify-center">
                    <ArrowRight size={12} className="text-text-muted" strokeWidth={1.5} />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <Link href="/how-it-works">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary font-inter text-sm border border-navy-accent/30 hover:border-navy-highlight/40 px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              See the full story
              <ArrowRight size={14} strokeWidth={1.5} />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
