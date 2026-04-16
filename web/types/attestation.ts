import type { AgentId } from "./agent";

export interface Attestation {
  id: string;
  agentId: AgentId;
  walletAddress: string;
  rating: number;
  comment: string;
  txSignature: string;
  blockHeight: number;
  timestamp: number;
  sessionId: string;
}
