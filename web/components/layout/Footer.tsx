import Link from "next/link";
import { Code2, AtSign, BookOpen } from "lucide-react";
import FieldSyncLogo from "@/components/ui/FieldSyncLogo";

const LINKS = [
  { href: "/how-it-works", label: "About" },
  { href: "https://github.com/Ctec-26/fieldsync", label: "GitHub", external: true },
  { href: "https://twitter.com/fieldsync_sol", label: "Twitter", external: true },
  { href: "/how-it-works", label: "Docs" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-navy-accent/20 bg-navy-deepest/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <FieldSyncLogo />
            <p className="text-text-muted text-sm font-inter max-w-xs text-center md:text-left">
              The human gateway to Web3 — powered by AI, verified on-chain.
            </p>
          </div>

          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            {LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-text-primary text-sm font-inter transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-text-muted hover:text-text-primary text-sm font-inter transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Ctec-26/fieldsync"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="GitHub"
            >
              <Code2 size={18} strokeWidth={1.5} />
            </a>
            <a
              href="https://twitter.com/fieldsync_sol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="Twitter"
            >
              <AtSign size={18} strokeWidth={1.5} />
            </a>
            <a
              href="/how-it-works"
              className="text-text-muted hover:text-text-primary transition-colors"
              aria-label="Docs"
            >
              <BookOpen size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-navy-accent/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-text-muted text-xs font-inter">
            Built by{" "}
            <span className="text-amber-primary font-medium">CONCRECT-CTec</span>
          </p>
          <p className="text-text-muted text-xs font-inter">
            Solana Devnet • Colosseum Frontier Hackathon 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
