export type EcoId =
  | "defi"
  | "rwa"
  | "edu"
  | "data"
  | "create"
  | "prod"
  | "infra"
  | "health";

export interface Ecosystem {
  id: EcoId;
  label: string;
  tagClass: string;
  gradClass: string;
  cssVar: string;
}

export type AgentState = "available" | "busy" | "trending" | "featured" | "maintenance";

export interface HomeAgent {
  name: string;
  eco: EcoId;
  letter: string;
  rep: number;
  desc: string;
  state: AgentState;
  /** String to allow `"free"` or `"0.042"` SOL. */
  price: string;
  tags: Array<"Simples" | "MicroSaaS">;
}

export interface TickerItem {
  /** The primary bold value (e.g. "847"). */
  value: string;
  /** The secondary label (e.g. "agentes ativos"). */
  label: string;
}

export type DashViz = "spark" | "gauge" | "trend" | "map" | "none";

export interface DashItem {
  id: string;
  label: string;
  value: string;
  meta: string;
  viz: DashViz;
}

export type FeedEventKind = "tx" | "new" | "trend";

export interface FeedEvent {
  kind: FeedEventKind;
  icon: string;
  html: string;
  time: string;
}
