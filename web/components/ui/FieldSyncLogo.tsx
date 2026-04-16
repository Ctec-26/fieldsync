"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Props {
  size?: number;
  showText?: boolean;
}

export default function FieldSyncLogo({ size = 32, showText = true }: Props) {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="FieldSync logo"
        >
          {/* Organic human shape — rounded hexagon */}
          <path
            d="M9 4 C6 4 4 6 4 9 L4 15 C4 18 6 20 9 20 L12 20 C13 20 13.5 20.5 13.5 21.5 C13.5 22.5 13 23 12 23 L10 23"
            stroke="#F0EFE8"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Digital shape — precise octagon */}
          <path
            d="M19 12 L22 9 L26 9 L29 12 L29 19 L26 22 L22 22 L19 19 Z"
            stroke="#3D7EE8"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Connecting glowing line */}
          <line
            x1="13.5"
            y1="14"
            x2="19"
            y2="15.5"
            stroke="#E8B86D"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Amber sync node */}
          <circle cx="16.2" cy="14.7" r="1.8" fill="#E8B86D" opacity="0.9" />
          {/* Pulse ring */}
          <circle
            cx="16.2"
            cy="14.7"
            r="3.2"
            stroke="#E8B86D"
            strokeWidth="0.8"
            opacity="0.35"
          />
        </svg>
      </motion.div>
      {showText && (
        <span className="font-grotesk font-600 text-lg text-text-heading tracking-tight group-hover:text-amber-glow transition-colors">
          FieldSync
        </span>
      )}
    </Link>
  );
}
