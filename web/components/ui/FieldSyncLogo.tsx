import FieldSyncMark from "./FieldSyncMark";

/**
 * Legacy-compat wrapper used by (focused) session/evaluation pages.
 * Renders the new FieldSyncMark with a word-mark to the right.
 */
export default function FieldSyncLogo({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-3">
      <FieldSyncMark size={size} />
      <span
        className="font-[family-name:var(--font-fraunces)] text-fs-white font-semibold tracking-tight"
        style={{ fontSize: Math.round(size * 0.72) }}
      >
        FieldSync
      </span>
    </span>
  );
}
