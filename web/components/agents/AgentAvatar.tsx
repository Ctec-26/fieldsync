"use client";

import React from "react";
import { motion } from "framer-motion";
import type { AgentId } from "@/types/agent";

function EduRWAShape({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Open book */}
      <path d="M40 22 L40 58" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M40 22 C34 20 22 22 18 26 L18 58 C22 55 34 54 40 56" stroke="#60A5FA" strokeWidth="1.5" fill="rgba(96,165,250,0.06)" strokeLinejoin="round" />
      <path d="M40 22 C46 20 58 22 62 26 L62 58 C58 55 46 54 40 56" stroke="#60A5FA" strokeWidth="1.5" fill="rgba(96,165,250,0.06)" strokeLinejoin="round" />
      {/* Left page lines */}
      <line x1="24" y1="32" x2="36" y2="31" stroke="#60A5FA" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
      <line x1="24" y1="37" x2="36" y2="36" stroke="#60A5FA" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
      <line x1="24" y1="42" x2="36" y2="41" stroke="#60A5FA" strokeWidth="0.9" strokeLinecap="round" opacity="0.4" />
      {/* Token chain on right page */}
      <circle cx="48" cy="32" r="4" stroke="#E8B86D" strokeWidth="1.2" fill="rgba(232,184,109,0.1)" />
      <circle cx="57" cy="32" r="4" stroke="#60A5FA" strokeWidth="1.2" fill="rgba(96,165,250,0.08)" />
      <line x1="52" y1="32" x2="53" y2="32" stroke="#E8B86D" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="48" y1="40" x2="57" y2="40" stroke="#60A5FA" strokeWidth="0.9" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function EduDeFiShape({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Graduation cap */}
      <path d="M40 18 L62 28 L40 38 L18 28 Z" stroke="#2DD4BF" strokeWidth="1.5" fill="rgba(45,212,191,0.07)" strokeLinejoin="round" />
      <path d="M62 28 L62 40" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="62" cy="42" r="2.5" fill="#E8B86D" opacity="0.8" />
      {/* Cap top */}
      <line x1="40" y1="38" x2="40" y2="48" stroke="#2DD4BF" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 43 Q40 48 50 43" stroke="#2DD4BF" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* DeFi yield bars */}
      <rect x="24" y="56" width="5" height="8" rx="1" fill="#2DD4BF" opacity="0.5" />
      <rect x="31" y="52" width="5" height="12" rx="1" fill="#2DD4BF" opacity="0.7" />
      <rect x="38" y="54" width="5" height="10" rx="1" fill="#2DD4BF" opacity="0.6" />
      <rect x="45" y="50" width="5" height="14" rx="1" fill="#E8B86D" opacity="0.7" />
      <rect x="52" y="53" width="5" height="11" rx="1" fill="#2DD4BF" opacity="0.5" />
    </svg>
  );
}

function EduX402Shape({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Book spine */}
      <rect x="16" y="18" width="36" height="46" rx="2" stroke="#C084FC" strokeWidth="1.5" fill="rgba(192,132,252,0.05)" />
      <rect x="16" y="18" width="8" height="46" rx="2" fill="rgba(192,132,252,0.12)" stroke="#C084FC" strokeWidth="1.2" />
      {/* x402 symbol inside book */}
      <line x1="30" y1="30" x2="46" y2="42" stroke="#C084FC" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
      <line x1="46" y1="30" x2="30" y2="42" stroke="#C084FC" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
      <rect x="29" y="48" width="18" height="3" rx="1.5" fill="#C084FC" opacity="0.4" />
      {/* Payment arrow emanating */}
      <path d="M52 36 L64 36 L60 32 M64 36 L60 40" stroke="#E8B86D" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="64" cy="36" r="1.5" fill="#E8B86D" opacity="0.7" />
    </svg>
  );
}

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

const SHAPES: Record<AgentId, React.ComponentType<{ size: number }>> = {
  rwa: RWAShape,
  defi: DeFiShape,
  x402: X402Shape,
  "edu-rwa": EduRWAShape,
  "edu-defi": EduDeFiShape,
  "edu-x402": EduX402Shape,
};

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
