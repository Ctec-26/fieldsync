"use client";

import { motion } from "framer-motion";
import { MessageSquare, ShieldCheck, Bot, Coins } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const STATS = [
  {
    icon: MessageSquare,
    label: "Sessions Completed",
    value: 4093,
    suffix: "+",
  },
  {
    icon: ShieldCheck,
    label: "On-Chain Attestations",
    value: 2949,
    suffix: "+",
  },
  {
    icon: Bot,
    label: "Active Agents",
    value: 3,
    suffix: "",
  },
  {
    icon: Coins,
    label: "SOL Volume",
    value: 204.65,
    suffix: " SOL",
    decimals: 2,
  },
];

export default function LiveStats() {
  return (
    <section className="relative z-10 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 rounded-2xl border border-navy-accent/30 bg-navy-secondary/40 backdrop-blur-sm p-4"
          style={{
            background: "linear-gradient(135deg, rgba(30,58,110,0.6) 0%, rgba(20,40,80,0.6) 100%)",
          }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-3 px-3 py-2"
            >
              <div className="w-8 h-8 rounded-lg bg-navy-accent/30 flex items-center justify-center flex-shrink-0">
                <stat.icon size={15} className="text-amber-primary" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-text-heading font-grotesk font-semibold text-lg leading-tight tabular-nums">
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals ?? 0}
                  />
                </p>
                <p className="text-text-muted text-[11px] font-inter leading-tight">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
