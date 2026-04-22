import * as React from "react";

interface FieldSyncMarkProps extends React.SVGAttributes<SVGSVGElement> {
  /** Set `animate={false}` for footer, favicons or reduced contexts. */
  animate?: boolean;
  /** Size in pixels (applied to both width and height). */
  size?: number;
}

/**
 * FieldSyncMark — the three-pillar logo.
 *   circle  → Human (primary blue)
 *   hexagon → Web3 (core blue / primary stroke)
 *   diamond → AI agent (bright blue)
 *   center  → Sync point (amber)
 *
 * When `animate` is true (default), each pillar orbits around the
 * viewBox center at a different cadence (8s / 6s / 4s) and the amber
 * core pulses at a 2s rhythm. Animation classes live in globals.css.
 */
export default function FieldSyncMark({
  animate = true,
  size = 24,
  className,
  ...rest
}: FieldSyncMarkProps) {
  const cls = ["fs-mark", animate ? "fs-mark--animated" : null, className]
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className={cls}
      {...rest}
    >
      <circle
        className={animate ? "fs-pillar-a" : undefined}
        cx={9}
        cy={12}
        r={6}
        fill="#0A6CF3"
        fillOpacity="0.55"
        stroke="#0A6CF3"
        strokeWidth="0.8"
      />
      <polygon
        className={animate ? "fs-pillar-b" : undefined}
        points="15,7 19,9.5 19,14.5 15,17 11,14.5 11,9.5"
        fill="#002080"
        fillOpacity="0.65"
        stroke="#0A6CF3"
        strokeWidth="0.8"
      />
      <polygon
        className={animate ? "fs-pillar-c" : undefined}
        points="12,6 16,12 12,18 8,12"
        fill="#0098FE"
        fillOpacity="0.5"
        stroke="#0098FE"
        strokeWidth="0.8"
      />
      <circle
        className={animate ? "fs-core" : undefined}
        cx={12}
        cy={12}
        r={2.2}
        fill="#F6F6E2"
      />
    </svg>
  );
}
