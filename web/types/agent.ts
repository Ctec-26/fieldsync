export type MarketplaceAgentId = "rwa" | "defi" | "x402";
export type BlockBrainAgentId = "edu-rwa" | "edu-defi" | "edu-x402";
export type AgentId = MarketplaceAgentId | BlockBrainAgentId;

export interface AgentSpecialty {
  label: string;
  slug: string;
}

export interface Agent {
  id: AgentId;
  name: string;
  tagline: string;
  bio: string;
  tagColor: string;
  specialties: AgentSpecialty[];
  systemPrompt: string;
  reputationScore: number;
  totalInteractions: number;
  onChainAttestations: number;
  avgResponseTime: string;
  memberSince: string;
  priceSOL: number;
  isFree?: boolean;
  introVariants: string[];
}
