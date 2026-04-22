import type { HomeAgent } from "@/types/home";

export const HOME_AGENTS: HomeAgent[] = [
  { name: "DeFiSage", eco: "defi", letter: "D", rep: 94, desc: "Análise de portfólios on-chain com rebalance sugerido em tempo real baseado em correlações multi-cadeia.", state: "busy", price: "0.042", tags: ["Simples"] },
  { name: "YieldHunter", eco: "defi", letter: "Y", rep: 86, desc: "Varredura de pools em 14 protocolos. Alerta quando APY ajustado por risco passa o seu limiar.", state: "available", price: "0.018", tags: [] },
  { name: "TaxAdvisor", eco: "rwa", letter: "T", rep: 91, desc: "Relatório fiscal consolidado de transações cripto em 38 jurisdições. Exporta para contadores.", state: "available", price: "0.11", tags: ["MicroSaaS"] },
  { name: "BondSense", eco: "rwa", letter: "B", rep: 78, desc: "Curadoria de títulos tokenizados com duration e rating — compara contra alternativas tradicionais.", state: "available", price: "0.024", tags: [] },
  { name: "ProfAda", eco: "edu", letter: "A", rep: 88, desc: "Explica contratos inteligentes e DeFi em linguagem cotidiana. Conversa longa com memória.", state: "trending", price: "free", tags: ["Simples"] },
  { name: "CodeMentor", eco: "edu", letter: "C", rep: 92, desc: "Code review de contratos Solidity e Anchor. Aponta vulnerabilidades comuns e sugere fixes.", state: "available", price: "0.008", tags: [] },
  { name: "DataHarvest", eco: "data", letter: "H", rep: 73, desc: "ETL de dados on-chain para dashboards. Conecta a Dune, Flipside e exporta para BigQuery.", state: "busy", price: "0.035", tags: ["MicroSaaS"] },
  { name: "ChartMind", eco: "data", letter: "M", rep: 81, desc: "Detecção de padrões técnicos em séries OHLC com interpretação estatística, não mística.", state: "available", price: "0.015", tags: [] },
  { name: "ContentForge", eco: "create", letter: "F", rep: 96, desc: "Direção editorial para marcas — tom consistente entre threads, newsletter e site. Guarda voz.", state: "trending", price: "0.11", tags: [] },
  { name: "BrandLoom", eco: "create", letter: "L", rep: 84, desc: "Moodboards e sistemas visuais a partir de um briefing de uma página. Entrega em Figma.", state: "available", price: "0.22", tags: ["MicroSaaS"] },
  { name: "ShipAgent", eco: "prod", letter: "S", rep: 90, desc: "Gerencia backlog com priorização baseada em impacto × esforço. Envia resumos semanais.", state: "available", price: "0.006", tags: ["Simples"] },
  { name: "MeetingNote", eco: "prod", letter: "N", rep: 77, desc: "Transcreve, resume e extrai ações de reuniões. Integra com Linear, Notion, Jira.", state: "busy", price: "0.004", tags: ["Simples"] },
  { name: "NodeWatch", eco: "infra", letter: "W", rep: 89, desc: "Monitora validadores Solana. Alerta em slashing, missed slots, e queda de performance.", state: "available", price: "0.05", tags: [] },
  { name: "KeyKeeper", eco: "infra", letter: "K", rep: 93, desc: "Rotação automática de chaves e secrets com auditoria. HSM opcional.", state: "available", price: "0.09", tags: ["MicroSaaS"] },
  { name: "MediRead", eco: "health", letter: "R", rep: 82, desc: "Lê exames laboratoriais em PDF e explica em português claro. Não substitui médico.", state: "trending", price: "0.02", tags: ["Simples"] },
  { name: "SleepCoach", eco: "health", letter: "Z", rep: 71, desc: "Análise de dados de sono do Oura/Apple Watch com sugestões comportamentais.", state: "available", price: "0.005", tags: [] },
];

export const HOME_AGENTS_BY_NAME: Record<string, HomeAgent> = HOME_AGENTS.reduce(
  (acc, a) => {
    acc[a.name] = a;
    return acc;
  },
  {} as Record<string, HomeAgent>,
);

export const TRENDING_ORDER = [
  "ContentForge",
  "ProfAda",
  "MediRead",
  "DeFiSage",
  "YieldHunter",
  "CodeMentor",
  "KeyKeeper",
  "ShipAgent",
];
