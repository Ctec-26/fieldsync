"use client";

import { motion } from "framer-motion";
import type { AgentId } from "@/types/agent";

interface Props {
  agentId: AgentId;
  size?: number;
  animate?: boolean;
  glitch?: boolean;
}

function RWAShape({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Building base */}
      <rect x="18" y="38" width="18" height="22" rx="1" stroke="#4A90E2" strokeWidth="1.5" fill="none" />
      <rect x="22" y="42" width="4" height="5" rx="0.5" stroke="#4A90E2" strokeWidth="1" fill="none" />
      <rect x="28" y="42" width="4" height="5" rx="0.5" stroke="#4A90E2" strokeWidth="1" fill="none" />
      <rect x="22" y="50" width="4" height="5" rx="0.5" stroke="#4A90E2" strokeWidth="1" fill="none" />
      <rect x="28" y="50" width="4" height="5" rx="0.5" stroke="#4A90E2" strokeWidth="1" fill="none" />
      {/* Tokenization arc */}
      <path d="M20 38 L27 24 L34 38" stroke="#4A90E2" strokeWidth="1.5" fill="none" />
      {/* Digital token hex */}
      <path d="M50 22 L58 26 L58 34 L50 38 L42 34 L42 26 Z" stroke="#4A90E2" strokeWidth="1.5" fill="rgba(74,144,226,0.08)" />
      <circle cx="50" cy="30" r="3" fill="#4A90E2" opacity="0.7" />
      {/* Connection */}
      <line x1="36" y1="38" x2="42" y2="30" stroke="#E8B86D" strokeWidth="1.2" strokeDasharray="2 2" />
      <circle cx="39" cy="34" r="1.5" fill="#E8B86D" opacity="0.8" />
      {/* Data stream lines */}
      <line x1="56" y1="42" x2="62" y2="48" stroke="#4A90E2" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <line x1="58" y1="44" x2="62" y2="44" stroke="#4A90E2" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

function DeFiShape({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Liquidity flow circles */}
      <circle cx="26" cy="30" r="10" stroke="#50C9B5" strokeWidth="1.5" fill="rgba(80,201,181,0.06)" />
      <circle cx="26" cy="30" r="5" stroke="#50C9B5" strokeWidth="1" opacity="0.5" />
      <circle cx="54" cy="30" r="10" stroke="#50C9B5" strokeWidth="1.5" fill="rgba(80,201,181,0.06)" />
      <circle cx="54" cy="30" r="5" stroke="#50C9B5" strokeWidth="1" opacity="0.5" />
      {/* AMM curve */}
      <path d="M16 54 Q40 20 64 54" stroke="#50C9B5" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Flow arrows */}
      <path d="M34 26 L40 30 L34 34" stroke="#E8B86D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M46 34 L40 30 L46 26" stroke="#E8B86D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Central node */}
      <circle cx="40" cy="30" r="3" fill="#E8B86D" opacity="0.9" />
      {/* Yield bar */}
      <rect x="34" y="58" width="4" height="8" rx="1" fill="#50C9B5" opacity="0.6" />
      <rect x="40" y="54" width="4" height="12" rx="1" fill="#50C9B5" opacity="0.8" />
      <rect x="46" y="56" width="4" height="10" rx="1" fill="#50C9B5" opacity="0.7" />
    </svg>
  );
}

function X402Shape({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* HTTP 402 bracket */}
      <path d="M14 20 L14 14 L26 14" stroke="#8B6BD9" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M54 14 L66 14 L66 20" stroke="#8B6BD9" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M14 60 L14 66 L26 66" stroke="#8B6BD9" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M54 66 L66 66 L66 60" stroke="#8B6BD9" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* 402 text representation as geometric shapes */}
      <rect x="22" y="28" width="8" height="14" rx="1" stroke="#8B6BD9" strokeWidth="1.2" fill="none" />
      <line x1="30" y1="33" x2="36" y2="33" stroke="#8B6BD9" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="30" y1="37" x2="36" y2="37" stroke="#8B6BD9" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M38 28 L44 35 L38 42" stroke="#8B6BD9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Payment pulse */}
      <circle cx="55" cy="35" r="8" stroke="#E8B86D" strokeWidth="1.2" fill="rgba(232,184,109,0.08)" />
      <circle cx="55" cy="35" r="4" fill="#E8B86D" opacity="0.7" />
      {/* Signal waves */}
      <path d="M47 35 Q40 28 33 35" stroke="#8B6BD9" strokeWidth="1" fill="none" strokeDasharray="2 2" opacity="0.6" />
      {/* Arrow indicating autonomous payment */}
      <path d="M40 50 L55 50 L51 47 M55 50 L51 53" stroke="#8B6BD9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SHAPES = { rwa: RWAShape, defi: DeFiShape, x402: X402Shape };

export default function AgentAvatar({ agentId, size = 80, animate = true, glitch = false }: Props) {
  const Shape = SHAPES[agentId];

  return (
    <motion.div
      animate={animate ? { y: [0, -4, 0] } : {}}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
      style={{ width: size, height: size }}
    >
      {glitch && (
        <motion.div
          className="absolute inset-0"
          animate={{ x: [0, -2, 2, 0], opacity: [0, 0.4, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
          style={{ filter: "hue-rotate(120deg)" }}
        >
          <Shape size={size} />
        </motion.div>
      )}
      <Shape size={size} />
    </motion.div>
  );
}
