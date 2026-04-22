"use client";

import * as React from "react";

/**
 * Fixed holographic grid layer behind the dark home content.
 * Opacity/density respond to scroll position but all DOM writes
 * are committed inside a dedicated rAF loop — never directly from
 * the scroll event handler — so scroll event bursts don't cause
 * style thrash.
 */
export default function HoloBackground() {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let lastScroll = typeof window !== "undefined" ? window.scrollY : 0;
    let lastApplied = -1;

    // Scroll handler only records the most recent scrollY.
    // Zero DOM reads, zero DOM writes — passive + ultra-cheap.
    const onScroll = () => {
      lastScroll = window.scrollY;
    };

    const tick = () => {
      // Only touch styles when scroll actually changed — keeps the
      // continuous rAF loop near-zero-cost during idle. No section
      // lookup / light-fade logic: the page is uniformly dark, so
      // the holo grid just intensifies slightly with scroll depth.
      if (lastScroll !== lastApplied) {
        const y = lastScroll;
        const boost = Math.max(0, Math.min(1, (y - 400) / 1400));
        const opacity = Math.min(0.09, 0.04 + boost * 0.04);
        const size = 60 - boost * 8;
        el.style.opacity = String(opacity);
        el.style.backgroundSize = `${size}px ${size}px, ${size}px ${size}px`;
        lastApplied = y;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700"
      style={{
        opacity: 0.04,
        backgroundImage:
          "linear-gradient(rgba(10,108,243,1) 1px, transparent 1px), linear-gradient(90deg, rgba(10,108,243,1) 1px, transparent 1px)",
        backgroundSize: "60px 60px, 60px 60px",
        WebkitMask:
          "radial-gradient(ellipse at center, black 20%, transparent 85%)",
        mask: "radial-gradient(ellipse at center, black 20%, transparent 85%)",
        // Promote to its own GPU layer.
        willChange: "opacity, background-size",
        transform: "translateZ(0)",
      }}
    />
  );
}
