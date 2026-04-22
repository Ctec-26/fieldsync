import type { AgentId } from "@/types/agent";

interface AgentAvatarProps {
  agentId: AgentId | string;
  size?: number;
  /** Reserved — kept for legacy caller compatibility. No-op in current impl. */
  animate?: boolean;
  /** Reserved — kept for legacy caller compatibility. No-op in current impl. */
  glitch?: boolean;
}

/** Deterministic gradient + initial for legacy agent avatars.
 *  Keyed by the last character of the agent id so every agent
 *  gets a stable color. */
const GRADIENTS = [
  "linear-gradient(135deg, #0a6cf3, #3ddbb4)",
  "linear-gradient(135deg, #002080, #d4b254)",
  "linear-gradient(135deg, #0a6cf3, #7a9fff)",
  "linear-gradient(135deg, #002080, #9d7fff)",
  "linear-gradient(135deg, #0a6cf3, #ff8b7a)",
  "linear-gradient(135deg, #0098fe, #5ecaeb)",
  "linear-gradient(135deg, #002080, #8fa4b8)",
  "linear-gradient(135deg, #0a6cf3, #a3e4a6)",
];

export default function AgentAvatar({ agentId, size = 48 }: AgentAvatarProps) {
  const idx = (agentId.charCodeAt(agentId.length - 1) || 0) % GRADIENTS.length;
  const bg = GRADIENTS[idx];
  const initial = agentId.replace(/^edu-/, "").charAt(0).toUpperCase();
  const radius = size >= 64 ? 12 : size >= 32 ? 10 : 8;
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center font-[family-name:var(--font-fraunces)] font-semibold text-white shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: bg,
        fontSize: Math.round(size * 0.42),
      }}
    >
      {initial}
    </span>
  );
}
