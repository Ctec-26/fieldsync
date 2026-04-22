"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FieldSyncMark from "@/components/ui/FieldSyncMark";

interface NavLink {
  label: string;
  href: string;
}

const LINKS: NavLink[] = [
  { label: "Marketplace", href: "/" },
  { label: "BlockBrain", href: "/blockbrain" },
  { label: "Publish", href: "/publish" },
  { label: "Creators", href: "/creators" },
  { label: "Docs", href: "/docs" },
];

/**
 * Fixed nav that sits below the ticker. Active link shows an underlined
 * primary glow. Background is a soft gradient/blur so the hero canvas
 * remains visible underneath.
 */
export default function Nav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <nav
      className="fixed inset-x-0 top-11 z-[85] flex h-16 items-center justify-between border-b border-fs-gray-low/30 px-10 backdrop-blur-md"
      style={{
        // Solid fs-void — never lets content behind bleed through.
        // The nav is fixed over all content; a transparent-fading
        // bottom would bleed paper (from BlockBrain) into the dark
        // chrome as the user scrolls past it. Strict rule: nav is
        // always #000010, no exceptions.
        background: "var(--color-fs-void)",
      }}
    >
      <div className="flex items-center gap-9">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-[family-name:var(--font-fraunces)] text-xl font-semibold tracking-tight text-fs-white"
        >
          <FieldSyncMark size={24} />
          FieldSync
        </Link>
        <div className="hidden items-center gap-7 text-sm text-fs-gray-hi md:flex">
          {LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative cursor-pointer transition-colors hover:text-fs-white ${
                  active ? "text-fs-white" : ""
                }`}
              >
                {l.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-0 -bottom-1.5 h-px bg-fs-primary"
                    style={{ boxShadow: "0 0 8px var(--color-fs-primary)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] text-fs-gray-med sm:block">
          EN · PT
        </span>
        <button
          type="button"
          className="hidden h-9 rounded-[10px] border border-fs-gray-low bg-transparent px-4 text-[13.5px] font-medium text-fs-gray-hi transition-all hover:border-fs-primary hover:text-white sm:block"
        >
          Sign in
        </button>
        <button
          type="button"
          className="h-9 rounded-[10px] border border-fs-primary bg-fs-primary px-4 text-[13.5px] font-medium text-white transition-all hover:bg-fs-bright"
          style={{ boxShadow: "0 0 0 transparent" }}
        >
          Connect wallet
        </button>
      </div>
    </nav>
  );
}
