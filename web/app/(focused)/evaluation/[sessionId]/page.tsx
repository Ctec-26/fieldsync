import EvaluationClient from "./EvaluationClient";

const BLOCKBRAIN_IDS = new Set(["edu-rwa", "edu-defi", "edu-x402"]);

export default async function EvaluationPage({
  params,
  searchParams,
}: {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ agentId?: string }>;
}) {
  const { sessionId } = await params;
  const { agentId: queryAgentId } = await searchParams;
  const agentId = queryAgentId ?? "rwa";
  const agentType: 0 | 1 = BLOCKBRAIN_IDS.has(agentId) ? 1 : 0;
  return (
    <EvaluationClient
      sessionId={sessionId}
      agentId={agentId}
      agentType={agentType}
    />
  );
}
