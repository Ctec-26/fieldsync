import type { EcoId, Ecosystem } from "@/types/home";

export const ECOSYSTEMS: Ecosystem[] = [
  { id: "defi", label: "DeFi & Trading", tagClass: "tag-defi", gradClass: "grad-defi", cssVar: "var(--color-fs-eco-defi)" },
  { id: "rwa", label: "RWA & Finance", tagClass: "tag-rwa", gradClass: "grad-rwa", cssVar: "var(--color-fs-eco-rwa)" },
  { id: "edu", label: "Educação", tagClass: "tag-edu", gradClass: "grad-edu", cssVar: "var(--color-fs-eco-edu)" },
  { id: "data", label: "Dados & Análise", tagClass: "tag-data", gradClass: "grad-data", cssVar: "var(--color-fs-eco-data)" },
  { id: "create", label: "Criação & Conteúdo", tagClass: "tag-create", gradClass: "grad-create", cssVar: "var(--color-fs-eco-create)" },
  { id: "prod", label: "Produtividade", tagClass: "tag-prod", gradClass: "grad-prod", cssVar: "var(--color-fs-eco-prod)" },
  { id: "infra", label: "Infraestrutura", tagClass: "tag-infra", gradClass: "grad-infra", cssVar: "var(--color-fs-eco-infra)" },
  { id: "health", label: "Saúde & Vida", tagClass: "tag-health", gradClass: "grad-health", cssVar: "var(--color-fs-eco-health)" },
];

export const ECO_MAP: Record<EcoId, Ecosystem> = ECOSYSTEMS.reduce(
  (acc, e) => {
    acc[e.id] = e;
    return acc;
  },
  {} as Record<EcoId, Ecosystem>,
);

/** Eco gradient CSS value keyed by EcoId, used for avatar backgrounds. */
export const ECO_GRADIENT: Record<EcoId, string> = {
  defi: "linear-gradient(135deg, #0a6cf3, #3ddbb4)",
  rwa: "linear-gradient(135deg, #002080, #d4b254)",
  edu: "linear-gradient(135deg, #0a6cf3, #7a9fff)",
  data: "linear-gradient(135deg, #002080, #9d7fff)",
  create: "linear-gradient(135deg, #0a6cf3, #ff8b7a)",
  prod: "linear-gradient(135deg, #0098fe, #5ecaeb)",
  infra: "linear-gradient(135deg, #002080, #8fa4b8)",
  health: "linear-gradient(135deg, #0a6cf3, #a3e4a6)",
};
