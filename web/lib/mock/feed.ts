import type { FeedEvent, FeedEventKind } from "@/types/home";

export const FEED_STARTER: FeedEvent[] = [
  {
    kind: "tx",
    icon: "⇄",
    html: "<b>DeFiSage</b> contratado por <b>PortfolioPilot</b> — <span class='fs-price'>0.042 SOL</span>",
    time: "2 min atrás",
  },
  {
    kind: "new",
    icon: "+",
    html: "Novo agente <b>DataHarvest</b> publicado por <b>dev.nigeria.sol</b>",
    time: "5 min atrás",
  },
  {
    kind: "tx",
    icon: "⇄",
    html: "<b>TaxAdvisor</b> contratado por <b>human/0xA9…2F</b> — <span class='fs-price'>0.018 SOL</span>",
    time: "7 min atrás",
  },
  {
    kind: "trend",
    icon: "↗",
    html: "<b>RWA & Finance</b> em alta — <span style=\"color:var(--color-fs-cyan)\">+18.4%</span> de volume",
    time: "9 min atrás",
  },
  {
    kind: "tx",
    icon: "⇄",
    html: "<b>ContentForge</b> contratado por <b>brand-x.sol</b> — <span class='fs-price'>0.11 SOL</span>",
    time: "12 min atrás",
  },
  {
    kind: "tx",
    icon: "⇄",
    html: "<b>CodeReviewer</b> contratado por <b>ShipAgent</b> — <span class='fs-price'>0.006 SOL</span>",
    time: "14 min atrás",
  },
  {
    kind: "new",
    icon: "+",
    html: "Novo agente <b>MediRead</b> publicado por <b>lisbon-health.sol</b>",
    time: "19 min atrás",
  },
];

// --- Live push: factories that produce a fresh event with randomized
// numeric values on each call. 14 distinct templates keep the feed
// visibly varied across a long visit. ---

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const fmtSol = (v: number, d = 3) => v.toFixed(d);
const fmtPct = (v: number) => v.toFixed(1);

export interface FeedTemplate {
  kind: FeedEventKind;
  icon: string;
  make: () => string;
}

/** 14 distinct event templates — hires / publishes / trend signals
 *  across different agents, wallets, ecosystems. */
export const FEED_FACTORIES: FeedTemplate[] = [
  {
    kind: "tx",
    icon: "⇄",
    make: () =>
      `<b>ChartMind</b> contratado por <b>human/0x48…1E</b> — <span class='fs-price'>${fmtSol(rand(0.010, 0.020))} SOL</span>`,
  },
  {
    kind: "tx",
    icon: "⇄",
    make: () =>
      `<b>NodeWatch</b> contratado por <b>stake.pool.sol</b> — <span class='fs-price'>${fmtSol(rand(0.040, 0.070))} SOL</span>`,
  },
  {
    kind: "new",
    icon: "+",
    make: () =>
      `Novo agente <b>LegalDraft</b> publicado por <b>madrid-jur.sol</b>`,
  },
  {
    kind: "trend",
    icon: "↗",
    make: () =>
      `<b>Educação</b> em alta — <span style="color:var(--color-fs-cyan)">+${fmtPct(rand(6, 14))}%</span> sessões`,
  },
  {
    kind: "tx",
    icon: "⇄",
    make: () =>
      `<b>BrandLoom</b> contratado por <b>startup-seed</b> — <span class='fs-price'>${fmtSol(rand(0.15, 0.28), 2)} SOL</span>`,
  },
  {
    kind: "tx",
    icon: "⇄",
    make: () =>
      `<b>YieldHunter</b> contratado por <b>defi.arb.sol</b> — <span class='fs-price'>${fmtSol(rand(0.012, 0.025))} SOL</span>`,
  },
  {
    kind: "trend",
    icon: "↗",
    make: () =>
      `<b>DeFi & Trading</b> em alta — <span style="color:var(--color-fs-cyan)">+${fmtPct(rand(4, 12))}%</span> volume`,
  },
  {
    kind: "new",
    icon: "+",
    make: () =>
      `Novo agente <b>AudioTranscribe</b> publicado por <b>podcast.sao.sol</b>`,
  },
  {
    kind: "tx",
    icon: "⇄",
    make: () =>
      `<b>KeyKeeper</b> contratado por <b>dao.treasury.sol</b> — <span class='fs-price'>${fmtSol(rand(0.06, 0.12))} SOL</span>`,
  },
  {
    kind: "tx",
    icon: "⇄",
    make: () =>
      `<b>ShipAgent</b> contratado por <b>indie.studio.sol</b> — <span class='fs-price'>${fmtSol(rand(0.004, 0.009))} SOL</span>`,
  },
  {
    kind: "trend",
    icon: "↗",
    make: () =>
      `<b>RWA & Finance</b> em alta — <span style="color:var(--color-fs-cyan)">+${fmtPct(rand(14, 22))}%</span> volume`,
  },
  {
    kind: "tx",
    icon: "⇄",
    make: () =>
      `<b>ContentForge</b> contratado por <b>agency.bcn.sol</b> — <span class='fs-price'>${fmtSol(rand(0.08, 0.15))} SOL</span>`,
  },
  {
    kind: "new",
    icon: "+",
    make: () =>
      `Novo agente <b>CodeReviewer</b> publicado por <b>dev.tokyo.sol</b>`,
  },
  {
    kind: "tx",
    icon: "⇄",
    make: () =>
      `<b>SleepCoach</b> contratado por <b>human/0x7C…9B</b> — <span class='fs-price'>${fmtSol(rand(0.004, 0.008))} SOL</span>`,
  },
];
