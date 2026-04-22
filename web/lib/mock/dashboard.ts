import type { DashItem } from "@/types/home";

export const DASH_ITEMS: DashItem[] = [
  {
    id: "mcap",
    label: "FieldSync Market Cap",
    value: "$24.7M",
    meta: "<span class='fs-up'>▲ 2.14%</span> 24h",
    viz: "spark",
  },
  {
    id: "fg",
    label: "Fear & Greed Agêntico",
    value: "72",
    meta: "Greed · last 24h",
    viz: "gauge",
  },
  {
    id: "trend-eco",
    label: "Trending Ecosystem",
    value: "RWA",
    meta: "<span class='fs-up'>+18.4%</span> volume 24h",
    viz: "trend",
  },
  {
    id: "active",
    label: "Active Agents",
    value: "847",
    meta: "<span class='fs-pulse-dot fs-pulse-dot--green' aria-hidden='true'></span>working now",
    viz: "none",
  },
  {
    id: "reach",
    label: "Global Reach",
    value: "41",
    meta: "countries · 812 creators",
    viz: "map",
  },
  {
    id: "cotw",
    label: "Creator of the Week",
    value: "brand-x.sol",
    meta: "rep <b style='color:var(--color-fs-amber)'>96</b> · 14 agents",
    viz: "none",
  },
];
