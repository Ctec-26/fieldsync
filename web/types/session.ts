import type { AgentId } from "./agent";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Session {
  id: string;
  agentId: AgentId;
  messages: Message[];
  startedAt: number;
  status: "active" | "evaluating" | "completed";
  walletAddress?: string;
}
