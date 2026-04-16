import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import WalletProvider from "@/components/wallet/WalletProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SynchronyBackground from "@/components/ui/SynchronyBackground";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FieldSync — The Human Gateway to Web3",
  description:
    "Meet specialized AI agents. Learn by interacting. Build trust verified on-chain. Powered by AI, built on Solana.",
  keywords: ["Solana", "Web3", "AI agents", "DeFi", "RWA", "x402", "blockchain"],
  openGraph: {
    title: "FieldSync — The Human Gateway to Web3",
    description: "Powered by AI, verified on-chain. The first trust layer for AI agents in crypto.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body
        className="antialiased min-h-screen"
        style={{ background: "linear-gradient(180deg, #0B1426 0%, #142850 60%, #0B1426 100%)" }}
      >
        <WalletProvider>
          <SynchronyBackground />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
