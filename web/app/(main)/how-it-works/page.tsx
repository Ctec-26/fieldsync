"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Globe, Zap, MessageCircle, Star, Shield, Check,
} from "lucide-react";

/* ─── Inline visual diagrams per section ─────────────────────── */

function ComplexityDiagram() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs mx-auto opacity-80">
      {/* Horizontal timeline */}
      <line x1="20" y1="100" x2="300" y2="100" stroke="#2A5298" strokeWidth="1.5" />
      {/* Ecosystem nodes growing in complexity */}
      {[
        { x: 50, label: "DeFi", color: "#50C9B5", size: 18 },
        { x: 110, label: "NFTs", color: "#8B6BD9", size: 22 },
        { x: 170, label: "RWA", color: "#4A90E2", size: 28 },
        { x: 230, label: "x402", color: "#E8B86D", size: 34 },
        { x: 285, label: "?", color: "#8B9DC3", size: 20 },
      ].map((n) => (
        <g key={n.x}>
          <circle cx={n.x} cy={100} r={n.size} fill={`${n.color}15`} stroke={n.color} strokeWidth="1.2" />
          <text x={n.x} y={100 + n.size + 14} textAnchor="middle" fill={n.color} fontSize="9" fontFamily="Inter, sans-serif">{n.label}</text>
        </g>
      ))}
      {/* Growing gap indicator */}
      <path d="M20 60 Q160 20 300 60" stroke="#3D7EE8" strokeWidth="1" strokeDasharray="4 3" fill="none" opacity="0.5" />
      <text x="160" y="16" textAnchor="middle" fill="#8B9DC3" fontSize="9" fontFamily="Inter, sans-serif">Human understanding</text>
      <path d="M20 140 Q100 160 300 150" stroke="#8B9DC3" strokeWidth="1" fill="none" opacity="0.4" />
      <text x="160" y="175" textAnchor="middle" fill="#8B9DC3" fontSize="9" fontFamily="Inter, sans-serif">— the gap —</text>
    </svg>
  );
}

function BridgeDiagram() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs mx-auto opacity-90">
      {/* Human node */}
      <circle cx="60" cy="100" r="36" fill="rgba(240,239,232,0.06)" stroke="#F0EFE8" strokeWidth="1.2" />
      <circle cx="60" cy="100" r="8" fill="#F0EFE8" opacity="0.8" />
      <text x="60" y="148" textAnchor="middle" fill="#8B9DC3" fontSize="9" fontFamily="Inter, sans-serif">Human</text>
      {/* FieldSync bridge */}
      <rect x="124" y="78" width="72" height="44" rx="10" fill="rgba(232,184,109,0.1)" stroke="#E8B86D" strokeWidth="1.2" />
      <text x="160" y="97" textAnchor="middle" fill="#E8B86D" fontSize="8" fontWeight="600" fontFamily="Space Grotesk, sans-serif">FIELD</text>
      <text x="160" y="110" textAnchor="middle" fill="#E8B86D" fontSize="8" fontWeight="600" fontFamily="Space Grotesk, sans-serif">SYNC</text>
      {/* Solana node */}
      <circle cx="260" cy="100" r="36" fill="rgba(61,126,232,0.06)" stroke="#3D7EE8" strokeWidth="1.2" />
      <circle cx="260" cy="100" r="8" fill="#3D7EE8" opacity="0.8" />
      <text x="260" y="148" textAnchor="middle" fill="#8B9DC3" fontSize="9" fontFamily="Inter, sans-serif">Solana</text>
      {/* Connection lines */}
      <line x1="96" y1="100" x2="124" y2="100" stroke="#E8B86D" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="196" y1="100" x2="224" y2="100" stroke="#E8B86D" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* Pulse dots */}
      <circle cx="110" cy="100" r="3" fill="#E8B86D" opacity="0.9" />
      <circle cx="210" cy="100" r="3" fill="#E8B86D" opacity="0.9" />
    </svg>
  );
}

function ChatDiagram() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs mx-auto opacity-90">
      {/* Chat bubbles — user */}
      <rect x="140" y="20" width="150" height="32" rx="10" fill="rgba(42,82,152,0.5)" />
      <text x="215" y="40" textAnchor="middle" fill="#F0EFE8" fontSize="9" fontFamily="Inter, sans-serif">How does Kamino work?</text>
      {/* Agent bubble */}
      <rect x="30" y="66" width="200" height="44" rx="10" fill="rgba(30,58,110,0.7)" stroke="#2A5298" strokeWidth="0.8" />
      <text x="130" y="84" textAnchor="middle" fill="#F0EFE8" fontSize="8" fontFamily="Inter, sans-serif">Kamino is a decentralized</text>
      <text x="130" y="97" textAnchor="middle" fill="#8B9DC3" fontSize="8" fontFamily="Inter, sans-serif">liquidity protocol on Solana…</text>
      {/* Typing dots */}
      <circle cx="52" cy="130" r="3" fill="#50C9B5" opacity="0.9" />
      <circle cx="64" cy="130" r="3" fill="#50C9B5" opacity="0.6" />
      <circle cx="76" cy="130" r="3" fill="#50C9B5" opacity="0.3" />
      {/* Stream indicator */}
      <text x="95" y="134" fill="#8B9DC3" fontSize="8" fontFamily="Inter, sans-serif">streaming…</text>
      {/* Groq badge */}
      <rect x="220" y="152" width="74" height="22" rx="6" fill="rgba(61,126,232,0.12)" stroke="#3D7EE8" strokeWidth="0.8" />
      <text x="257" y="166" textAnchor="middle" fill="#3D7EE8" fontSize="8" fontFamily="Inter, sans-serif">Groq · 1.1s</text>
    </svg>
  );
}

function StarsDiagram() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs mx-auto opacity-90">
      {/* 5 stars */}
      {[0, 1, 2, 3, 4].map((i) => {
        const cx = 60 + i * 50;
        const filled = i < 5;
        return (
          <g key={i}>
            <polygon
              points={`${cx},${80 - 18} ${cx + 7},${80 - 2} ${cx + 18},${80 - 2} ${cx + 10},${80 + 8} ${cx + 13},${80 + 22} ${cx},${80 + 14} ${cx - 13},${80 + 22} ${cx - 10},${80 + 8} ${cx - 18},${80 - 2} ${cx - 7},${80 - 2}`}
              fill={filled ? "#E8B86D" : "none"}
              stroke={filled ? "#E8B86D" : "#2A5298"}
              strokeWidth="1.2"
              opacity={filled ? 0.9 : 0.4}
            />
          </g>
        );
      })}
      <text x="160" y="126" textAnchor="middle" fill="#E8B86D" fontSize="11" fontFamily="Space Grotesk, sans-serif" fontWeight="600">Excellent</text>
      {/* Comment */}
      <rect x="40" y="140" width="240" height="36" rx="8" fill="rgba(30,58,110,0.5)" stroke="#2A5298" strokeWidth="0.8" />
      <text x="160" y="156" textAnchor="middle" fill="#8B9DC3" fontSize="8" fontFamily="Inter, sans-serif">&ldquo;Clear, honest about risks,</text>
      <text x="160" y="168" textAnchor="middle" fill="#8B9DC3" fontSize="8" fontFamily="Inter, sans-serif">exactly what I needed.&rdquo;</text>
    </svg>
  );
}

function ChainDiagram() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs mx-auto opacity-90">
      {/* Block chain */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={20 + i * 96} y="60" width="80" height="80" rx="8"
            fill={i === 2 ? "rgba(232,184,109,0.1)" : "rgba(30,58,110,0.5)"}
            stroke={i === 2 ? "#E8B86D" : "#2A5298"}
            strokeWidth={i === 2 ? "1.5" : "0.8"} />
          <text x={60 + i * 96} y="88" textAnchor="middle"
            fill={i === 2 ? "#E8B86D" : "#8B9DC3"}
            fontSize="7" fontFamily="Inter, sans-serif">
            #{312847290 + i}
          </text>
          <text x={60 + i * 96} y="102" textAnchor="middle"
            fill={i === 2 ? "#F0EFE8" : "#4B5563"}
            fontSize="7" fontFamily="Space Grotesk, sans-serif" fontWeight="600">
            {i < 2 ? "BLOCK" : "ATTEST"}
          </text>
          {i === 2 && (
            <>
              <text x="212" y="118" textAnchor="middle" fill="#E8B86D" fontSize="7" fontFamily="Inter, sans-serif">★★★★★</text>
              <text x="212" y="130" textAnchor="middle" fill="#8B9DC3" fontSize="6" fontFamily="Inter, sans-serif">DeFi Agent</text>
            </>
          )}
          {i < 2 && (
            <line x1={100 + i * 96} y1="100" x2={116 + i * 96} y2="100"
              stroke="#2A5298" strokeWidth="1.2" />
          )}
        </g>
      ))}
      {/* Verified badge */}
      <rect x="104" y="158" width="112" height="24" rx="8"
        fill="rgba(232,184,109,0.12)" stroke="#E8B86D" strokeWidth="0.8" />
      <text x="160" y="174" textAnchor="middle" fill="#E8B86D" fontSize="8"
        fontFamily="Space Grotesk, sans-serif" fontWeight="600">✦ Verified on-chain</text>
    </svg>
  );
}

/* ─── Progress indicator ──────────────────────────────────────── */

const SECTIONS = [
  {
    step: "01",
    headline: "Web3 keeps evolving.",
    subhead: "Every breakthrough creates a new gap.",
    body: "RWA tokenization. DeFi innovations. Autonomous payments via x402. The ecosystem moves faster than any human can follow — and trustworthy guidance is nowhere to be found.",
    accent: "#3D7EE8",
    Icon: Globe,
    Diagram: ComplexityDiagram,
  },
  {
    step: "02",
    headline: "FieldSync bridges that gap.",
    subhead: null,
    body: "Three specialized AI agents, each an expert in their domain. Available 24/7. Teaching — not recommending. Their reputation is built transparently, on-chain, by every person they help.",
    accent: "#E8B86D",
    Icon: Zap,
    Diagram: BridgeDiagram,
  },
  {
    step: "03",
    headline: "Ask a specialized agent.",
    subhead: null,
    body: "Choose your agent. Start a real conversation. Get expert-level guidance powered by Groq's fastest AI — streaming in real time, never waiting for a full reply.",
    accent: "#50C9B5",
    Icon: MessageCircle,
    Diagram: ChatDiagram,
  },
  {
    step: "04",
    headline: "Rate your session.",
    subhead: null,
    body: "When your session ends, you evaluate it honestly. A 1-to-5 star rating with an optional comment. Simple. Permanent. Meaningful.",
    accent: "#8B6BD9",
    Icon: Star,
    Diagram: StarsDiagram,
  },
  {
    step: "05",
    headline: "Your feedback becomes on-chain reputation.",
    subhead: null,
    body: "Every rating is recorded as an attestation on Solana Devnet. 400ms finality. $0.00025 per transaction. The trust layer for AI agents — built in public, verifiable forever.",
    accent: "#E8B86D",
    Icon: Shield,
    Diagram: ChainDiagram,
  },
];

function ScrollSection({ section, index }: { section: typeof SECTIONS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className="relative py-20 sm:py-28 border-b border-navy-accent/10 last:border-0">
      {/* Step number — large background text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="absolute top-12 font-grotesk font-bold text-[120px] sm:text-[160px] leading-none select-none pointer-events-none"
        style={{
          color: `${section.accent}08`,
          left: isEven ? "-0.5rem" : "auto",
          right: isEven ? "auto" : "-0.5rem",
        }}
      >
        {section.step}
      </motion.div>

      <div className={`relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${isEven ? "" : "md:grid-flow-dense"}`}>
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -24 : 24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className={isEven ? "" : "md:col-start-2"}
        >
          {/* Step tag */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${section.accent}15`, border: `1px solid ${section.accent}30` }}
            >
              <section.Icon size={17} strokeWidth={1.5} style={{ color: section.accent }} />
            </div>
            <span
              className="text-[11px] font-grotesk font-semibold tracking-widest uppercase"
              style={{ color: section.accent }}
            >
              Step {section.step}
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-text-heading leading-tight mb-2">
            {section.headline}
          </h2>
          {section.subhead && (
            <p className="font-grotesk font-semibold text-xl sm:text-2xl mb-4"
              style={{ color: section.accent }}>
              {section.subhead}
            </p>
          )}

          {/* Body */}
          <p className="text-text-muted font-inter text-lg leading-relaxed mt-4 max-w-md">
            {section.body}
          </p>
        </motion.div>

        {/* Diagram side */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? 24 : -24, scale: 0.96 }}
          animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
          className={`flex items-center justify-center ${isEven ? "" : "md:col-start-1 md:row-start-1"}`}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-navy-accent/20 p-8"
            style={{ background: "linear-gradient(135deg, rgba(30,58,110,0.5) 0%, rgba(20,40,80,0.5) 100%)" }}
          >
            <section.Diagram />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Sticky scroll progress bar ─────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #E8B86D, #F5D29A)",
      }}
    />
  );
}

/* ─── Page ────────────────────────────────────────────────────── */

export default function HowItWorksPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <>
      <ScrollProgress />

      <div className="min-h-screen pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero */}
          <div ref={heroRef} className="pt-32 pb-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-primary/30 bg-amber-primary/10 text-amber-primary text-xs font-semibold font-inter tracking-wider uppercase mb-8">
                The FieldSync Story
              </span>
              <h1 className="font-grotesk font-bold text-5xl sm:text-6xl text-text-heading leading-[1.06] mb-6">
                Trusted agents.<br />
                <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, #E8B86D, #F5D29A)" }}>
                  Transparent value.
                </span><br />
                Forever verifiable.
              </h1>
              <p className="text-text-muted font-inter text-xl max-w-2xl mx-auto leading-relaxed">
                This is how FieldSync works — and why it matters.
              </p>
            </motion.div>

            {/* Quick nav pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-2 mt-10"
            >
              {SECTIONS.map((s) => (
                <span
                  key={s.step}
                  className="px-3 py-1.5 rounded-full border border-navy-accent/25 text-text-muted text-xs font-inter hover:text-text-primary hover:border-navy-highlight/40 transition-colors cursor-default"
                >
                  {s.step} — {s.headline.split(".")[0]}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Scroll sections */}
          {SECTIONS.map((section, i) => (
            <ScrollSection key={section.step} section={section} index={i} />
          ))}

          {/* Final CTA */}
          <div className="pt-24 pb-8 flex flex-col items-center gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Checklist */}
              <div className="flex flex-col gap-2 text-left mb-4">
                {[
                  "Three specialized AI agents",
                  "Real conversations, real learning",
                  "Every reputation earned on-chain",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-text-muted text-sm font-inter">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(232,184,109,0.15)", border: "1px solid rgba(232,184,109,0.3)" }}>
                      <Check size={11} className="text-amber-primary" strokeWidth={2.5} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              <h2 className="font-grotesk font-bold text-3xl sm:text-4xl text-text-heading">
                Ready to begin?
              </h2>
              <p className="text-text-muted font-inter max-w-sm">
                Start with any agent. Your first conversation is one click away.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <Link href="/agents">
                <motion.span
                  whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(232,184,109,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold font-inter text-navy-deepest text-lg cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #E8B86D, #F5D29A)" }}
                >
                  Explore the Agents
                  <ArrowRight size={18} />
                </motion.span>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </>
  );
}
