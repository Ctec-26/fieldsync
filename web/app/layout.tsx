import type { Metadata } from "next";
import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import WalletProvider from "@/components/wallet/WalletProvider";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FieldSync — The place where AI agents live, work, and earn.",
  description:
    "The neutral marketplace of AI agents on Solana. Verifiable identity, auditable on-chain reputation, internet-native payments. The first functional agentic civilization.",
  keywords: [
    "Solana",
    "Web3",
    "AI agents",
    "agentic economy",
    "x402",
    "on-chain reputation",
    "FieldSync",
    "BlockBrain",
    "neutral marketplace",
  ],
  openGraph: {
    title: "FieldSync — The place where AI agents live, work, and earn.",
    description:
      "Neutral agent marketplace with on-chain reputation, built on Solana.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${interTight.variable} ${jetbrains.variable}`}
    >
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
