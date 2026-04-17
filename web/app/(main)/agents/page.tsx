import { Suspense } from "react";
import { AGENTS_LIST, BLOCKBRAIN_LIST } from "@/lib/agents";
import AgentsPageClient from "./AgentsPageClient";

export const metadata = {
  title: "Agents — FieldSync",
  description: "Meet the specialized AI agents powering FieldSync.",
};

export default function AgentsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AgentsPageClient
        marketplaceAgents={AGENTS_LIST}
        blockbrainAgents={BLOCKBRAIN_LIST}
      />
    </Suspense>
  );
}
