"use client";

import * as React from "react";

interface RevealProps {
  children: React.ReactNode;
  /** Delay slot 1-6, matching `.reveal.d1` .. `.reveal.d6` in globals.css. */
  delay?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Render as a different element. */
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}

/**
 * Wraps children in a <div class="reveal ..."> that fades + translates in
 * when ~18% of it enters the viewport. Uses a single shared IntersectionObserver
 * singleton across instances to keep cost negligible.
 */
let sharedObserver: IntersectionObserver | null = null;
const pending = new WeakSet<Element>();

function getObserver() {
  if (typeof window === "undefined") return null;
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
          pending.delete(e.target);
        }
      }
    },
    { threshold: 0.18 },
  );
  return sharedObserver;
}

export default function Reveal({ children, delay, as = "div", className }: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If the element is already in viewport on mount (hero, above-the-fold
    // content), reveal immediately rather than waiting for the first IO tick.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("in");
      return;
    }
    const obs = getObserver();
    if (!obs) return;
    if (pending.has(el) || el.classList.contains("in")) return;
    pending.add(el);
    obs.observe(el);
    return () => {
      obs.unobserve(el);
      pending.delete(el);
    };
  }, []);

  const classes = [
    "reveal",
    delay ? `d${delay}` : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return React.createElement(
    as,
    { ref, className: classes },
    children,
  );
}
